<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { browser } from '$app/environment';

	const ACADEMICS_KEY = 'predictadmit:pro:academics';
	const CONTRIBUTIONS_KEY = 'predictadmit:pro:contributions';
	const CONTRIBUTED_FLAG = 'predictadmit:pro:contributed';

	const ACCENT = '#0052CC';

	type Academics = {
		sat: number | '';
		act: number | '';
		weightedGpa: number | '';
		unweightedGpa: number | '';
	};

	type ResultRow = { school: string; slug: string; outcome: string };

	// ---- Local state ----
	let loaded = $state(false);
	let alreadyContributed = $state(false);
	let anonymous = $state(true);
	let consent = $state(false);
	let submitting = $state(false);
	let submitted = $state(false);
	let errorMsg = $state('');

	let academics = $state<Academics>({ sat: '', act: '', weightedGpa: '', unweightedGpa: '' });

	// Editable fields (seeded from the profile).
	let displayName = $state('');
	let gradYear = $state('');
	let major = $state('');

	// ---- Load persisted data once ----
	$effect(() => {
		if (!browser || loaded) return;

		try {
			alreadyContributed = window.localStorage.getItem(CONTRIBUTED_FLAG) === '1';
		} catch {
			// ignore
		}

		try {
			const raw = window.localStorage.getItem(ACADEMICS_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				academics = {
					sat: parsed.sat === '' || parsed.sat == null ? '' : Number(parsed.sat),
					act: parsed.act === '' || parsed.act == null ? '' : Number(parsed.act),
					weightedGpa:
						parsed.weightedGpa === '' || parsed.weightedGpa == null
							? ''
							: Number(parsed.weightedGpa),
					unweightedGpa:
						parsed.unweightedGpa === '' || parsed.unweightedGpa == null
							? ''
							: Number(parsed.unweightedGpa)
				};
			}
		} catch {
			// ignore
		}

		loaded = true;
	});

	// Seed editable fields from the profile once loaded.
	$effect(() => {
		if (!loaded) return;
		if (!displayName) displayName = $userProfile.name || '';
	});

	// ---- Derived: activities / awards snippets ----
	const activities = $derived(($userProfile.applicationProfile?.activities || '').trim());
	const awards = $derived(($userProfile.applicationProfile?.awards || '').trim());

	function activitiesSnippet(text: string): string {
		if (!text) return '';
		const flat = text.replace(/\s+/g, ' ').trim();
		return flat.length > 140 ? flat.slice(0, 140).trimEnd() + '…' : flat;
	}

	const outcomeLabels: Record<string, string> = {
		admit: 'Admitted',
		deny: 'Denied',
		waitlist: 'Waitlisted',
		defer: 'Deferred'
	};

	// ---- Derived: results to share (schools with a decision outcome) ----
	const results = $derived.by<ResultRow[]>(() => {
		const map = $decisionsBySlug;
		const rows: ResultRow[] = [];
		for (const s of $userProfile.schoolList || []) {
			const outcome = map[s.slug];
			if (outcome) {
				rows.push({ school: s.name, slug: s.slug, outcome });
			}
		}
		return rows;
	});

	const gpaWeighted = $derived(academics.weightedGpa === '' ? null : academics.weightedGpa);
	const gpaUnweighted = $derived(academics.unweightedGpa === '' ? null : academics.unweightedGpa);
	const sat = $derived(academics.sat === '' ? null : academics.sat);
	const act = $derived(academics.act === '' ? null : academics.act);

	const canSubmit = $derived(consent && !submitting);

	function toLines(text: string): string[] {
		return text
			.split(/\r?\n/)
			.map((l) => l.replace(/^[\s•\-*]+/, '').trim())
			.filter(Boolean);
	}

	async function submit() {
		if (!canSubmit) return;
		errorMsg = '';
		submitting = true;

		const cleanName = (displayName || '').trim();
		const cleanMajor = (major || '').trim();
		const yearNum = gradYear ? Number(gradYear) : null;

		const payload = {
			consent: true,
			anonymous,
			displayName: cleanName,
			gradYear: yearNum,
			major: cleanMajor,
			gpaWeighted,
			gpaUnweighted,
			sat,
			act,
			activities,
			awards,
			results: results.map((r) => ({ school: r.school, slug: r.slug, outcome: r.outcome }))
		};

		try {
			const res = await fetch('/api/contribute', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(payload)
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data?.error || `Something went wrong (${res.status}).`);
			}

			// Append to local contributions so it appears in Community Admits immediately.
			if (browser) {
				try {
					const raw = window.localStorage.getItem(CONTRIBUTIONS_KEY);
					const arr = raw ? JSON.parse(raw) : [];
					const list = Array.isArray(arr) ? arr : [];
					list.unshift({
						id: `you-${Date.now()}`,
						handle: anonymous ? 'Anonymous applicant' : cleanName || 'You',
						gradYear: yearNum,
						major: cleanMajor,
						gpaWeighted,
						gpaUnweighted,
						sat,
						act,
						activities: toLines(activities),
						awards: toLines(awards),
						results: results.map((r) => ({
							school: r.school,
							slug: r.slug,
							outcome: r.outcome
						})),
						mine: true,
						submittedAt: new Date().toISOString()
					});
					window.localStorage.setItem(CONTRIBUTIONS_KEY, JSON.stringify(list));
					window.localStorage.setItem(CONTRIBUTED_FLAG, '1');
				} catch {
					// ignore storage errors — the POST still succeeded
				}
			}

			submitted = true;
			alreadyContributed = true;
		} catch (e) {
			errorMsg = e instanceof Error ? e.message : 'Could not submit. Please try again.';
		} finally {
			submitting = false;
		}
	}
</script>

{#if alreadyContributed && !submitted}
	<!-- Compact "already contributed" state -->
	<section class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
		<div
			class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
			style="background:{ACCENT}14;color:{ACCENT}"
		>
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
			</svg>
		</div>
		<div>
			<h3 class="text-base font-semibold text-slate-900">Thanks for contributing 💙</h3>
			<p class="mt-0.5 text-sm text-slate-500">
				Your results are helping the next class of applicants. You're part of the corpus that
				powers Community Admits.
			</p>
		</div>
	</section>
{:else if submitted}
	<!-- Fresh thank-you state -->
	<section class="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
		<div
			class="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
			style="background:{ACCENT}14;color:{ACCENT}"
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M20 6 9 17l-5-5" />
			</svg>
		</div>
		<h3 class="mt-3 text-lg font-semibold text-slate-900">Thank you — you're helping the next class 💙</h3>
		<p class="mx-auto mt-1 max-w-md text-sm text-slate-500">
			Your {anonymous ? 'anonymized' : ''} profile is now part of the community corpus. It powers
			Community Admits and sharper predictions for everyone.
		</p>
	</section>
{:else}
	<!-- Consent + submit form -->
	<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
		<!-- Header -->
		<div class="flex items-start gap-3">
			<div
				class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
				style="background:{ACCENT}14;color:{ACCENT}"
			>
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
					<path d="M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
			</div>
			<div class="min-w-0">
				<h3 class="text-lg font-semibold text-slate-900">Help the next class — share your results</h3>
				<p class="mt-0.5 text-sm text-slate-500">
					Your anonymized profile powers Community Admits and better predictions for everyone.
				</p>
			</div>
		</div>

		<!-- What will be shared -->
		<div class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold uppercase tracking-wide text-slate-500">What you'll share</span>
				<span
					class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
					style="background:{ACCENT}14;color:{ACCENT}"
				>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
						<path d="M7 11V7a5 5 0 0 1 10 0v4" />
					</svg>
					{anonymous ? 'Anonymous' : 'Named'}
				</span>
			</div>

			<!-- Editable summary fields -->
			<div class="mt-3 grid gap-3 sm:grid-cols-2">
				<label class="block">
					<span class="mb-1 block text-xs font-medium text-slate-600">Display name</span>
					<input
						type="text"
						bind:value={displayName}
						disabled={anonymous}
						placeholder={anonymous ? 'Anonymous applicant' : 'Your name'}
						class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 disabled:bg-slate-100 disabled:text-slate-400"
					/>
				</label>
				<label class="block">
					<span class="mb-1 block text-xs font-medium text-slate-600">Grad year</span>
					<input
						type="number"
						bind:value={gradYear}
						placeholder="2026"
						class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20"
					/>
				</label>
				<label class="block sm:col-span-2">
					<span class="mb-1 block text-xs font-medium text-slate-600">Intended major</span>
					<input
						type="text"
						bind:value={major}
						placeholder="e.g. Computer Science"
						class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20"
					/>
				</label>
			</div>

			<!-- Read-only academics snapshot -->
			<div class="mt-3 flex flex-wrap gap-2">
				{#if gpaWeighted != null}
					<span class="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">GPA (W) {gpaWeighted}</span>
				{/if}
				{#if gpaUnweighted != null}
					<span class="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">GPA (UW) {gpaUnweighted}</span>
				{/if}
				{#if sat != null}
					<span class="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">SAT {sat}</span>
				{/if}
				{#if act != null}
					<span class="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">ACT {act}</span>
				{/if}
				{#if gpaWeighted == null && gpaUnweighted == null && sat == null && act == null}
					<span class="text-xs italic text-slate-400">No academics on file — add them in your profile to enrich your contribution.</span>
				{/if}
			</div>

			<!-- Activities snippet -->
			{#if activitiesSnippet(activities)}
				<p class="mt-3 text-xs text-slate-600">
					<span class="font-medium text-slate-700">Activities:</span>
					{activitiesSnippet(activities)}
				</p>
			{/if}

			<!-- Results -->
			<div class="mt-4">
				<span class="text-xs font-medium text-slate-700">Schools &amp; outcomes</span>
				{#if results.length > 0}
					<ul class="mt-2 space-y-1.5">
						{#each results as r (r.slug)}
							<li class="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm">
								<span class="truncate text-slate-800">{r.school}</span>
								<span
									class="ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
									class:bg-emerald-50={r.outcome === 'admit'}
									class:text-emerald-700={r.outcome === 'admit'}
									class:bg-rose-50={r.outcome === 'deny'}
									class:text-rose-700={r.outcome === 'deny'}
									class:bg-amber-50={r.outcome === 'waitlist' || r.outcome === 'defer'}
									class:text-amber-700={r.outcome === 'waitlist' || r.outcome === 'defer'}
								>
									{outcomeLabels[r.outcome] ?? r.outcome}
								</span>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-2 text-xs italic text-slate-400">
						No decisions yet. Once you get results back, they'll be included here to help others.
					</p>
				{/if}
			</div>
		</div>

		<!-- Anonymity toggle -->
		<div class="mt-4 flex items-center justify-between rounded-xl border border-slate-200 p-3">
			<div class="pr-4">
				<p class="text-sm font-medium text-slate-900">Share anonymously</p>
				<p class="text-xs text-slate-500">Hide your name — only your stats &amp; outcomes are shared.</p>
			</div>
			<button
				type="button"
				role="switch"
				aria-checked={anonymous}
				aria-label="Share anonymously"
				onclick={() => (anonymous = !anonymous)}
				class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
				style={anonymous ? `background:${ACCENT}` : 'background:#cbd5e1'}
			>
				<span
					class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
					class:translate-x-5={anonymous}
					class:translate-x-0.5={!anonymous}
				></span>
			</button>
		</div>

		<!-- Consent -->
		<label class="mt-4 flex cursor-pointer items-start gap-3">
			<input
				type="checkbox"
				bind:checked={consent}
				class="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-[#0052CC]"
			/>
			<span class="text-sm text-slate-700">
				I agree to share this data to help improve predictions and the Community Admits corpus. I can
				request removal at any time.
			</span>
		</label>

		{#if errorMsg}
			<p class="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMsg}</p>
		{/if}

		<!-- Actions -->
		<div class="mt-5 flex items-center gap-3">
			<button
				type="button"
				onclick={submit}
				disabled={!canSubmit}
				class="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40"
				style="background:{ACCENT}"
			>
				{#if submitting}
					<svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" />
						<path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
					</svg>
					Sharing…
				{:else}
					Share my results
				{/if}
			</button>
			<span class="text-xs text-slate-400">You control what's shared. Nothing leaves without your consent.</span>
		</div>
	</section>
{/if}
