<script lang="ts">
	import { counselors, allSpecialties, allMajors, type Counselor } from '$lib/config/counselors';
	import { readableTextColor } from '$lib/config/schoolStats';

	const specialties = allSpecialties();
	const majors = allMajors();

	// A couple short, illustrative review quotes per counselor (simulation).
	const reviews: Record<string, { quote: string; who: string }[]> = {
		default: [
			{ quote: 'Cut my personal statement from “fine” to actually memorable in one call.', who: 'Class of 2025 applicant' },
			{ quote: 'Finally understood what my activities list was missing. Worth every minute.', who: 'Class of 2025 applicant' }
		]
	};
	function reviewsFor(id: string) {
		return reviews[id] ?? reviews.default;
	}

	function firstName(name: string) {
		return name.split(/\s+/)[0];
	}
	function initials(name: string) {
		return name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
	}

	let showVerify = $state(false);

	// ---------- lightweight browse filters ----------
	let query = $state('');
	let majorFilter = $state('All');
	let topicFilter = $state('All');

	const browseList = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return counselors.filter((c) => {
			if (majorFilter !== 'All' && !c.majors.includes(majorFilter as any)) return false;
			if (topicFilter !== 'All' && !c.specialties.includes(topicFilter)) return false;
			if (
				q &&
				!(
					c.name.toLowerCase().includes(q) ||
					c.school.toLowerCase().includes(q) ||
					c.headline.toLowerCase().includes(q) ||
					c.specialties.some((s) => s.toLowerCase().includes(q))
				)
			)
				return false;
			return true;
		});
	});

	// ---------- "Get matched" quiz ----------
	let quizMajor = $state('');
	let quizNeed = $state('');
	let quizBudget = $state('');
	let match = $state<{ c: Counselor; reasons: string[] } | null>(null);

	const budgetBands = [
		{ key: 'low', label: 'Under $110 / session', max: 109 },
		{ key: 'mid', label: '$110–$140 / session', max: 140 },
		{ key: 'any', label: 'Best fit, any price', max: Infinity }
	];

	function runMatch() {
		const maxPrice = budgetBands.find((b) => b.key === quizBudget)?.max ?? Infinity;
		let best: { c: Counselor; score: number; reasons: string[] } | null = null;
		for (const c of counselors) {
			let score = 0;
			const reasons: string[] = [];
			if (quizMajor && c.majors.includes(quizMajor as any)) {
				score += 3;
				reasons.push(`Mentors ${quizMajor.replace(/\s[^\sA-Za-z].*$/, '')} applicants`);
			}
			if (quizNeed && c.specialties.includes(quizNeed)) {
				score += 3;
				reasons.push(`Specializes in ${quizNeed.toLowerCase()}`);
			}
			if (c.pricePerSession <= maxPrice) {
				score += 1;
				if (maxPrice !== Infinity) reasons.push('Within your budget');
			} else {
				score -= 1;
			}
			score += c.rating - 4.5; // gentle tiebreak toward top-rated
			if (!best || score > best.score) best = { c, score, reasons };
		}
		if (best) {
			if (best.reasons.length === 0) best.reasons.push('A strong all-around fit from our roster');
			match = { c: best.c, reasons: best.reasons };
			// scroll the result into view on next tick
			queueMicrotask(() => document.getElementById('match-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
		}
	}
	function resetMatch() {
		match = null;
		quizMajor = quizNeed = quizBudget = '';
	}

	// ---------- booking modal (schedule-then-pay) ----------
	type SessionOption = { key: 'intro' | 'session' | 'package'; label: string; sub: string; price: number };
	let active = $state<Counselor | null>(null);
	let modalEl = $state<HTMLElement | null>(null);
	let step = $state<'options' | 'time' | 'done'>('options');
	let chosen = $state<SessionOption | null>(null);
	let slot = $state<string | null>(null);
	let checkoutState = $state<'idle' | 'loading' | 'error'>('idle');

	const options = $derived.by<SessionOption[]>(() => {
		if (!active) return [];
		const pkgSaving = active.pricePerSession * 4 - active.packagePrice;
		return [
			{ key: 'intro', label: 'Free 20-min intro call', sub: 'Meet your mentor, get a plan — no charge', price: 0 },
			{ key: 'session', label: '60-min working session', sub: 'Live essay + strategy help', price: active.pricePerSession },
			{
				key: 'package',
				label: 'Application package (4 sessions)',
				sub: pkgSaving > 0 ? `Save $${pkgSaving} vs. booking singly` : 'Multi-session ED/app support',
				price: active.packagePrice
			}
		];
	});

	// Fake availability: next weekdays x a few evening slots.
	function buildSlots(): { id: string; day: string; time: string }[] {
		const out: { id: string; day: string; time: string }[] = [];
		const times = ['4:00 PM', '5:30 PM', '7:00 PM'];
		const d = new Date();
		let added = 0;
		let offset = 1;
		while (added < 4) {
			const day = new Date(d.getTime() + offset * 86400000);
			const dow = day.getDay();
			if (dow !== 0 && dow !== 6) {
				const label = day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
				for (const t of times) out.push({ id: `${label}-${t}`, day: label, time: t });
				added++;
			}
			offset++;
		}
		return out;
	}
	let slots = $state<{ id: string; day: string; time: string }[]>([]);

	function openBooking(c: Counselor, preselect?: 'intro' | 'session') {
		active = c;
		step = 'options';
		chosen = null;
		slot = null;
		checkoutState = 'idle';
		slots = buildSlots();
		if (preselect === 'intro') {
			// jump straight into scheduling the free call
			queueMicrotask(() => {
				chosen = options.find((o) => o.key === 'intro') ?? null;
				step = 'time';
			});
		}
	}
	function closeBooking() {
		active = null;
	}
	function chooseOption(o: SessionOption) {
		chosen = o;
		step = 'time';
	}

	async function confirm() {
		if (!active || !chosen || !slot) return;
		const s = slots.find((x) => x.id === slot);
		const when = s ? `${s.day} at ${s.time}` : 'your selected time';
		if (chosen.price === 0) {
			// Free intro — no payment, just confirm the booking.
			step = 'done';
			return;
		}
		checkoutState = 'loading';
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					pricingMode: 'counselor',
					counselorName: `${active.name} · ${active.school}`,
					sessionLabel: `${chosen.label} with ${active.name} — ${when}`,
					amount: Math.round(chosen.price * 100)
				})
			});
			const data = await res.json().catch(() => ({}));
			if (res.ok && data?.url) {
				window.location.href = data.url;
				return;
			}
			step = 'done'; // payments not configured — treat as request received
		} catch {
			checkoutState = 'error';
		}
	}

	function onKeydown(e: KeyboardEvent) {
		if (!active) return;
		if (e.key === 'Escape') {
			closeBooking();
			return;
		}
		if (e.key !== 'Tab' || !modalEl) return;
		const f = modalEl.querySelectorAll<HTMLElement>(
			'button:not([disabled]), a[href], input, select, [tabindex]:not([tabindex="-1"])'
		);
		if (!f.length) return;
		const first = f[0];
		const last = f[f.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}
	$effect(() => {
		if (active && modalEl) modalEl.querySelector<HTMLElement>('button')?.focus();
	});
</script>

<svelte:window onkeydown={onKeydown} />

<div class="flex-1 min-h-0 overflow-y-auto bg-slate-50">
	<div class="mx-auto max-w-6xl px-6 py-8 md:px-10">
		<!-- Hero -->
		<header class="mb-8">
			<div class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#0052CC]/10 px-3 py-1 text-xs font-bold text-[#0052CC]">
				<span class="h-1.5 w-1.5 rounded-full bg-[#0052CC]"></span> Human Counselors
			</div>
			<h1 class="text-3xl font-black tracking-tight text-slate-900 md:text-4xl md:whitespace-nowrap">
				Get matched with a mentor who <span class="text-[#0052CC]">just got in.</span>
			</h1>
			<p class="mt-3 max-w-2xl text-slate-600">
				1:1 mentorship from verified students who were admitted to a Top-20 <span class="font-semibold">this cycle</span>.
				Your AI essay workshop is free with Pro — this is the human edge. Every mentor offers a
				<span class="font-semibold text-slate-900">free 20-minute intro call</span>, so you can start with zero risk.
			</p>
			<div class="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
				<span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
					<svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clip-rule="evenodd"/></svg>
					Enrollment verified via school-issued .edu email
				</span>
				<span>· {counselors.length} hand-picked mentors · Class of 2029</span>
				<button onclick={() => (showVerify = true)} class="font-semibold text-emerald-700 hover:underline">How we verify</button>
				<a href="/mentors/apply" class="font-semibold text-[#0052CC] hover:underline">Become a mentor →</a>
			</div>
		</header>

		<!-- Get matched quiz -->
		<section class="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
			<div class="flex items-center gap-2">
				<div class="grid h-9 w-9 place-items-center rounded-xl bg-[#0052CC] text-white">
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.5 14.5L3 21m0 0h6m-6 0v-6M14.5 9.5L21 3m0 0h-6m6 0v6"/></svg>
				</div>
				<div>
					<h2 class="text-lg font-bold text-slate-900">Get matched in 20 seconds</h2>
					<p class="text-sm text-slate-500">Answer 3 quick questions and we'll match you to one PredictAdmit mentor.</p>
				</div>
			</div>

			<div class="mt-4 grid gap-3 sm:grid-cols-3">
				<label class="block">
					<span class="mb-1 block text-xs font-semibold text-slate-600">What will you study?</span>
					<select bind:value={quizMajor} class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-[#0052CC] focus:outline-none">
						<option value="">Any / not sure</option>
						{#each majors as m}<option value={m}>{m}</option>{/each}
					</select>
				</label>
				<label class="block">
					<span class="mb-1 block text-xs font-semibold text-slate-600">Biggest need right now?</span>
					<select bind:value={quizNeed} class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-[#0052CC] focus:outline-none">
						<option value="">Any</option>
						{#each specialties as s}<option value={s}>{s}</option>{/each}
					</select>
				</label>
				<label class="block">
					<span class="mb-1 block text-xs font-semibold text-slate-600">Budget per session</span>
					<select bind:value={quizBudget} class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-[#0052CC] focus:outline-none">
						<option value="">No preference</option>
						{#each budgetBands as b}<option value={b.key}>{b.label}</option>{/each}
					</select>
				</label>
			</div>
			<div class="mt-4 flex items-center gap-3">
				<button onclick={runMatch} class="rounded-xl bg-[#0052CC] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0047b3]">
					Find my match
				</button>
				{#if match}
					<button onclick={resetMatch} class="text-sm font-semibold text-slate-500 hover:text-slate-800">Reset</button>
				{/if}
			</div>

			{#if match}
				{@const c = match.c}
				<div id="match-result" class="mt-5 rounded-2xl border-2 border-[#0052CC]/30 bg-[#0052CC]/[0.04] p-4">
					<p class="mb-3 text-xs font-bold uppercase tracking-wide text-[#0052CC]">Your match</p>
					<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
						<div class="grid h-14 w-14 flex-none place-items-center rounded-2xl text-base font-bold" style="background-color: {c.color}; color: {readableTextColor(c.color)}">
							{initials(c.name)}
						</div>
						<div class="min-w-0 flex-1">
							<p class="text-base font-bold text-slate-900">{c.name}</p>
							<p class="truncate text-sm font-semibold" style="color: {c.color}">{c.headline}</p>
							<div class="mt-1 flex flex-wrap gap-1.5">
								{#each match.reasons as r}
									<span class="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">✓ {r}</span>
								{/each}
							</div>
						</div>
						<button onclick={() => openBooking(c, 'intro')} class="flex-none rounded-xl bg-[#0052CC] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0047b3]">
							Book free intro →
						</button>
					</div>
				</div>
			{/if}
		</section>

		<!-- How it works -->
		<section class="mb-8 grid gap-3 sm:grid-cols-3">
			{#each [{ n: 1, t: 'Match or browse', d: 'Take the quiz or scan the roster and pick a mentor whose path fits yours.' }, { n: 2, t: 'Free intro call', d: 'Book a no-charge 20-minute call to make sure it clicks before you pay anything.' }, { n: 3, t: 'Book sessions', d: 'Schedule paid 1:1 sessions or a package — pick a time, then pay securely.' }] as s}
				<div class="rounded-2xl border border-slate-200 bg-white p-4">
					<div class="grid h-7 w-7 place-items-center rounded-full bg-[#0052CC]/10 text-sm font-bold text-[#0052CC]">{s.n}</div>
					<p class="mt-2 text-sm font-bold text-slate-900">{s.t}</p>
					<p class="mt-0.5 text-sm text-slate-500">{s.d}</p>
				</div>
			{/each}
		</section>

		<!-- Roster header + filters -->
		<div class="mb-4 flex flex-wrap items-center justify-between gap-2">
			<h2 class="text-xl font-bold text-slate-900">Meet the mentors</h2>
			<div class="flex flex-wrap items-center gap-2">
				<input type="text" placeholder="Search…" bind:value={query} class="w-40 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0052CC] focus:outline-none" />
				<select bind:value={majorFilter} class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#0052CC] focus:outline-none">
					<option value="All">All majors</option>
					{#each majors as m}<option value={m}>{m}</option>{/each}
				</select>
				<select bind:value={topicFilter} class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#0052CC] focus:outline-none">
					<option value="All">All topics</option>
					{#each specialties as s}<option value={s}>{s}</option>{/each}
				</select>
			</div>
		</div>

		<!-- Roster -->
		<div class="grid gap-4 lg:grid-cols-2">
			{#each browseList as c (c.id)}
				<article class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#0052CC]/40 hover:shadow-md">
					<div class="flex items-start gap-3">
						<div class="grid h-14 w-14 flex-none place-items-center rounded-2xl text-base font-bold" style="background-color: {c.color}; color: {readableTextColor(c.color)}">
							{initials(c.name)}
						</div>
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-1.5">
								<h3 class="truncate text-base font-bold text-slate-900">{c.name}</h3>
								{#if c.verified}
									<button
											onclick={() => (showVerify = true)}
											title={`Enrollment at ${c.school} verified via ${c.eduDomain} on ${c.verifiedOn}`}
											class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 transition hover:bg-emerald-100"
										>
											<svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clip-rule="evenodd"/></svg>
											{c.idVerified ? 'ID + enrollment verified' : 'Enrollment verified'}
										</button>
								{/if}
							</div>
							<p class="mt-0.5 text-sm font-semibold leading-snug" style="color: {c.color}">{c.headline}</p>
							<div class="mt-1 flex items-center gap-2 text-xs text-slate-500">
								<span class="inline-flex items-center gap-1 font-semibold text-slate-700">
									<svg class="h-3.5 w-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" role="img" aria-label="rating"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.83-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.33 8.7c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69L9.05 2.93z"/></svg>
									{c.rating.toFixed(1)}
								</span>
								<span>({c.reviews})</span>
								<span>· replies in ~{c.responseHours}h</span>
							</div>
						</div>
					</div>

					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each c.majors as m}<span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{m}</span>{/each}
					</div>

					<p class="mt-3 line-clamp-3 text-sm leading-snug text-slate-600">{c.bio}</p>

					<div class="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs">
						<span class="font-bold text-slate-500">Accepted to: </span>
						<span class="font-medium text-slate-700">{c.acceptedTo.join(' · ')}</span>
					</div>

					<div class="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
						<div>
							<p class="text-lg font-bold text-slate-900">${c.pricePerSession}<span class="text-xs font-medium text-slate-400"> / 60-min session</span></p>
							<p class="text-[11px] font-semibold text-emerald-600">Free 20-min intro call</p>
						</div>
						<div class="flex items-center gap-2">
							<button onclick={() => openBooking(c)} class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Sessions</button>
							<button onclick={() => openBooking(c, 'intro')} class="rounded-xl bg-[#0052CC] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0047b3]">Book free intro</button>
						</div>
					</div>
				</article>
			{/each}
		</div>

		{#if browseList.length === 0}
			<div class="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
				<p class="text-sm font-semibold text-slate-700">No mentors match those filters.</p>
				<p class="mt-1 text-sm text-slate-500">Try clearing a filter or the "Get matched" quiz above.</p>
			</div>
		{/if}

		<!-- FAQ -->
		<section class="mt-10">
			<h2 class="mb-4 text-xl font-bold text-slate-900">Questions</h2>
			<div class="space-y-2">
				{#each [{ q: 'How do you verify mentors got into a Top-20?', a: 'We confirm every mentor is currently enrolled at the school shown by sending a one-time code to their school-issued .edu email — the same method employers use. We never accept portal screenshots or decision letters (including PredictAdmit-generated ones). Their enrolled school is verified; any additional admits they list are labeled self-reported.' }, { q: 'Do I have to pay to start?', a: 'No. Every mentor offers a free 20-minute intro call. You only pay if you book a full session or a package afterward.' }, { q: 'How does scheduling work?', a: 'You pick a session type and a time slot, then confirm. Paid sessions go to secure Stripe checkout only after you\'ve chosen a time.' }, { q: 'What is your refund policy?', a: 'If a paid session is not useful in the first 15 minutes, or your mentor no-shows, you get a full refund.' }] as f}
					<details class="group rounded-xl border border-slate-200 bg-white p-4">
						<summary class="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-900">
							{f.q}
							<svg class="h-4 w-4 text-slate-400 transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
						</summary>
						<p class="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
					</details>
				{/each}
			</div>
		</section>
	</div>
</div>

<!-- Booking modal: schedule-then-pay -->
{#if active}
	{@const c = active}
	<div class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="presentation">
		<button class="absolute inset-0 cursor-default" aria-label="Close" onclick={closeBooking}></button>
		<div bind:this={modalEl} class="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl" role="dialog" aria-modal="true" aria-label={`Book ${c.name}`}>
			<!-- header -->
			<div class="flex items-start gap-3 border-b border-slate-100 p-5">
				<div class="grid h-12 w-12 flex-none place-items-center rounded-xl text-sm font-bold" style="background-color: {c.color}; color: {readableTextColor(c.color)}">{initials(c.name)}</div>
				<div class="min-w-0 flex-1">
					<h3 class="text-base font-bold text-slate-900">{c.name}</h3>
					<p class="truncate text-xs font-semibold" style="color: {c.color}">{c.headline}</p>
				</div>
				<button onclick={closeBooking} class="rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Close">
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
				</button>
			</div>

			<div class="min-h-0 flex-1 overflow-y-auto p-5">
				{#if step === 'done'}
					<div class="py-6 text-center">
						<div class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
							<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
						</div>
						<h4 class="mt-4 text-lg font-bold text-slate-900">You're booked!</h4>
						<p class="mx-auto mt-1 max-w-sm text-sm text-slate-500">
							{c.name} will confirm your {chosen?.label.toLowerCase()}{slot ? ` for ${slots.find((s) => s.id === slot)?.day} at ${slots.find((s) => s.id === slot)?.time}` : ''} by email. Check your inbox for the meeting link.
						</p>
						<button onclick={closeBooking} class="mt-5 rounded-xl bg-[#0052CC] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0047b3]">Done</button>
					</div>
				{:else}
					<!-- Trust: review quotes + accepted to -->
					<div class="mb-5 space-y-2">
						{#each reviewsFor(c.id) as r}
							<blockquote class="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-600">
								“{r.quote}” <span class="text-xs font-medium text-slate-400">— {r.who}</span>
							</blockquote>
						{/each}
						<p class="text-xs text-slate-500">
							<span class="font-semibold text-emerald-700">✓ Enrollment at {c.school} verified</span> via {c.eduDomain} on {c.verifiedOn}.
						</p>
						<p class="text-xs text-slate-500">
							<span class="font-bold text-slate-600">Also reports admits to:</span> {c.acceptedTo.filter((x) => x !== c.school).join(' · ')} <span class="text-slate-400">(self-reported)</span>
						</p>
					</div>

					<!-- Step 1: choose session -->
					<p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">1 · Choose a session</p>
					<div class="space-y-2">
						{#each options as o (o.key)}
							<button onclick={() => chooseOption(o)} class="flex w-full items-center justify-between rounded-xl border p-3 text-left transition {chosen?.key === o.key ? 'border-[#0052CC] bg-blue-50/60 ring-1 ring-[#0052CC]' : 'border-slate-200 hover:border-slate-300'}">
								<div>
									<p class="text-sm font-semibold text-slate-900">{o.label}</p>
									<p class="text-xs text-slate-500">{o.sub}</p>
								</div>
								<span class="text-base font-bold {o.price === 0 ? 'text-emerald-600' : 'text-slate-900'}">{o.price === 0 ? 'Free' : `$${o.price}`}</span>
							</button>
						{/each}
					</div>

					<!-- Step 2: choose a time (only after a session is picked) -->
					{#if chosen}
						<p class="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">2 · Pick a time</p>
						<div class="grid grid-cols-3 gap-2">
							{#each slots as s (s.id)}
								<button onclick={() => (slot = s.id)} class="rounded-xl border px-2 py-2 text-center text-xs transition {slot === s.id ? 'border-[#0052CC] bg-[#0052CC] text-white' : 'border-slate-200 text-slate-700 hover:border-slate-300'}">
									<span class="block font-semibold">{s.day}</span>
									<span class="block {slot === s.id ? 'text-white/90' : 'text-slate-500'}">{s.time}</span>
								</button>
							{/each}
						</div>
					{/if}

					{#if checkoutState === 'error'}
						<p class="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">Something went wrong. Please try again.</p>
					{/if}
				{/if}
			</div>

			{#if step !== 'done'}
				<div class="border-t border-slate-100 p-4">
					<button onclick={confirm} disabled={!chosen || !slot || checkoutState === 'loading'} class="w-full rounded-xl bg-[#0052CC] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0047b3] disabled:cursor-not-allowed disabled:opacity-50">
						{#if checkoutState === 'loading'}
							Starting secure checkout…
						{:else if !chosen}
							Choose a session
						{:else if !slot}
							Pick a time
						{:else if chosen.price === 0}
							Confirm free intro call
						{:else}
							Continue to secure checkout · ${chosen.price}
						{/if}
					</button>
					<p class="mt-2 text-center text-[11px] text-slate-400">
						{chosen && chosen.price > 0 ? 'Secure payment via Stripe · full refund if not useful in the first 15 min' : 'No payment required for the intro call'}
					</p>
				</div>
			{/if}
		</div>
	</div>
{/if}

<!-- How we verify explainer -->
{#if showVerify}
	<div class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="presentation">
		<button class="absolute inset-0 cursor-default" aria-label="Close" onclick={() => (showVerify = false)}></button>
		<div class="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl" role="dialog" aria-modal="true" aria-label="How we verify mentors">
			<div class="flex items-center justify-between border-b border-slate-100 p-5">
				<h3 class="text-base font-bold text-slate-900">How we verify mentors</h3>
				<button onclick={() => (showVerify = false)} class="rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Close">
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
				</button>
			</div>
			<div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-sm text-slate-600">
				<div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
					<p class="font-bold text-emerald-800">✓ Enrollment verified (the strong claim)</p>
					<p class="mt-1 text-emerald-800/90">
						We send a one-time code to the mentor's official <b>.edu</b> email at their university and require they enter it — the same way employers confirm a student. Controlling an <b>@school.edu</b> inbox proves current enrollment at that Top-20.
					</p>
				</div>
				<div class="rounded-xl border border-slate-200 p-3">
					<p class="font-bold text-slate-900">Optional: ID + selfie</p>
					<p class="mt-1">Mentors can add a student-ID and selfie check for an <b>ID-verified</b> badge. Reviewed by our team, never shown publicly.</p>
				</div>
				<div class="rounded-xl border border-amber-200 bg-amber-50 p-3">
					<p class="font-bold text-amber-800">What we do NOT accept</p>
					<p class="mt-1 text-amber-800/90">
						Applicant-portal screenshots and decision letters — <b>including ones generated on PredictAdmit</b> — are trivially faked, so they never count as proof of anything.
					</p>
				</div>
				<p>
					A mentor's <b>enrolled</b> school is what we verify. Any additional schools in their "Accepted to" list are shown as <b>self-reported</b> unless separately documented.
				</p>
				<a href="/mentors/apply" class="inline-block rounded-xl bg-[#0052CC] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0047b3]">Become a verified mentor →</a>
			</div>
		</div>
	</div>
{/if}
