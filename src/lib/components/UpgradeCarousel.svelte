<script lang="ts">
	// Premium onboarding paywall sequence (mymind / Cal-AI pattern from Mobbin):
	// tap through benefit screens — some showing the REAL Pro dashboard — then land
	// on a plan picker as the final step, and only then go to Stripe. Launched from
	// /pro's CTA and from the /ai paywall. Zero slop: flat single brand blue, real
	// product screenshots framed in device chrome, editorial type, smooth motion.
	import { fade, fly } from 'svelte/transition';
	import { pushOverlay, popOverlay } from '$lib/stores/ui';

	let {
		open = $bindable(false),
		loading = false,
		oncontinue,
		onclose
	}: {
		open?: boolean;
		loading?: boolean;
		oncontinue?: (plan: 'monthly' | 'lifetime') => void;
		onclose?: () => void;
	} = $props();

	type Screen = {
		kind: 'benefit';
		eyebrow: string;
		title: string;
		body: string;
		icon: 'bolt' | 'pencil' | 'search' | 'chat';
		shot?: string;
		mock?: 'essay' | 'chat'; // designed visual for the screens without a screenshot
	};

	// Essay editing is screen 3 on purpose — rising seniors pay for that specifically.
	const screens: Screen[] = [
		{
			kind: 'benefit',
			eyebrow: 'PredictAdmit Pro',
			title: 'See your decisions before they land',
			body: "The AI reads your real application and calls your verdict — accept, deny, or waitlist — at all 39 top schools, then shows you exactly why.",
			icon: 'bolt',
			shot: '/onboarding/dashboard.png'
		},
		{
			kind: 'benefit',
			eyebrow: 'Unlimited',
			title: 'Run it as many times as you want',
			body: 'Change an essay, a score, an activity — re-run across all 39 schools and watch your odds move in real time.',
			icon: 'search',
			shot: '/onboarding/schools.png'
		},
		{
			kind: 'benefit',
			eyebrow: 'The workshop',
			title: 'Pro essay editing',
			body: "Line-by-line AI feedback on every supplement — the honest read an admissions officer would give. You write every word; it just makes them land.",
			icon: 'pencil',
			mock: 'essay'
		},
		{
			kind: 'benefit',
			eyebrow: 'Talk to us',
			title: 'Advice from the founding team',
			body: 'Stuck on your list or an essay? Message the people who got into these schools and calibrated the AI on real admissions results.',
			icon: 'chat',
			mock: 'chat'
		}
	];

	// Real testimonials (also shown on /about) — social proof was GPT-vision's #1 ask.
	const testimonials = [
		{
			quote: 'Opening the fake Stanford portal genuinely scared me. Then I went back and rewrote two essays I thought were fine. Worth it.',
			name: 'Priya',
			role: 'Class of 2025'
		},
		{
			quote: 'The essay grader flagged the cliché opening I was about to submit — and the breakdown pointed straight at my weakest spot.',
			name: 'Marcus',
			role: 'First-gen applicant'
		},
		{
			quote: 'Easiest money I spent all season.',
			name: 'Elena',
			role: 'Class of 2026'
		}
	];

	// Steps: benefits (0..n-1) → social proof (n) → plan picker (n+1).
	const nBenefits = screens.length;
	const lastStep = nBenefits + 1;
	let step = $state(0);
	const onSocial = $derived(step === nBenefits);
	const onPlans = $derived(step > nBenefits);

	let selectedPlan = $state<'monthly' | 'lifetime'>('lifetime');

	function next() {
		if (step < lastStep) step += 1;
		else oncontinue?.(selectedPlan);
	}
	function back() {
		if (step > 0) step -= 1;
	}
	function close() {
		open = false;
		onclose?.();
	}
	$effect(() => {
		if (open) step = 0;
	});
	$effect(() => {
		if (open) {
			pushOverlay();
			return popOverlay;
		}
	});
</script>

{#if open}
	<div
		class="fixed inset-0 z-[10001] flex items-stretch justify-center bg-white sm:items-center sm:bg-slate-950/70 sm:p-6 sm:backdrop-blur-md"
		transition:fade={{ duration: 180 }}
		role="dialog"
		aria-modal="true"
		aria-label="What PredictAdmit Pro includes"
	>
		<div
			class="relative flex w-full max-w-md flex-col bg-white sm:max-h-[94vh] sm:rounded-[28px] sm:shadow-2xl overflow-hidden"
			transition:fly={{ y: 24, duration: 260 }}
		>
			<!-- Top bar: back · progress · close -->
			<div class="flex items-center gap-3 px-5 pt-5">
				<button
					onclick={back}
					disabled={step === 0}
					aria-label="Back"
					class="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-0"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
				</button>
				<div class="flex flex-1 items-center justify-center gap-1.5">
					{#each Array(lastStep + 1) as _, i}
						<span class="h-1.5 rounded-full transition-all duration-300 {i === step ? 'w-7 bg-[#0052CC]' : 'w-1.5 bg-slate-200'}"></span>
					{/each}
				</div>
				<button
					onclick={close}
					aria-label="Close"
					class="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>

			<!-- Body -->
			<div class="flex flex-1 flex-col overflow-y-auto px-7 pb-4 pt-4">
				{#if step < nBenefits}
					{@const s = screens[step]}
					{#key step}
						<div in:fly={{ x: 18, duration: 240 }} class="flex flex-1 flex-col">
							<div class="text-center">
								<div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#0052CC]/10 text-[#0052CC]">
									{#if s.icon === 'bolt'}
										<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
									{:else if s.icon === 'pencil'}
										<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
									{:else if s.icon === 'search'}
										<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
									{:else}
										<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 01-9 9c-1.6 0-3.1-.42-4.4-1.15L3 21l1.15-4.6A8.96 8.96 0 013 12a9 9 0 019-9 9 9 0 019 9z" /></svg>
									{/if}
								</div>
								<p class="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0052CC]">{s.eyebrow}</p>
								<h2 class="mt-1.5 text-[26px] font-black leading-[1.1] tracking-tight text-slate-900">{s.title}</h2>
								<p class="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-slate-500">{s.body}</p>
							</div>

							{#if s.shot}
								<!-- Real Pro screenshot, framed in device chrome (top bar hides the browser nav) -->
								<div class="relative mx-auto mt-6 w-full max-w-[264px] overflow-hidden rounded-[26px] border border-slate-200 bg-slate-900 shadow-xl">
									<div class="flex items-center gap-1.5 px-4 py-2.5">
										<span class="h-2 w-2 rounded-full bg-white/25"></span>
										<span class="h-2 w-2 rounded-full bg-white/25"></span>
										<span class="h-2 w-2 rounded-full bg-white/25"></span>
									</div>
									<img src={s.shot} alt="PredictAdmit Pro" class="block w-full object-cover object-top" style="max-height:340px;" />
								</div>
							{:else if s.mock === 'essay'}
								<!-- Essay-editing demo: a line with an AI margin note. -->
								<div class="mx-auto mt-7 w-full max-w-[300px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
									<p class="text-[13px] leading-relaxed text-slate-700">
										Ever since I was little, I have <span class="rounded bg-amber-100 px-0.5 text-amber-900 line-through decoration-amber-400/70">always been passionate about</span> helping people.
									</p>
									<div class="mt-3 flex items-start gap-2 rounded-xl bg-[#0052CC]/[0.06] p-3">
										<div class="grid h-5 w-5 flex-none place-items-center rounded-full bg-[#0052CC] text-white">
											<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
										</div>
										<p class="text-[12px] leading-snug text-slate-700">
											Cliché opener. Start on the <span class="font-semibold">specific moment</span> — the reader has seen “passionate about helping” a thousand times.
										</p>
									</div>
								</div>
							{:else if s.mock === 'chat'}
								<!-- Founder-advice demo: a short chat exchange. -->
								<div class="mx-auto mt-7 w-full max-w-[300px] space-y-2.5">
									<div class="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-slate-100 px-4 py-2.5 text-[13px] leading-snug text-slate-700">
										Is my list too top-heavy? 9 reaches, 2 targets.
									</div>
									<div class="flex items-end gap-2">
										<div class="grid h-7 w-7 flex-none place-items-center rounded-full bg-[#0052CC] text-[11px] font-bold text-white">PA</div>
										<div class="max-w-[80%] rounded-2xl rounded-bl-md bg-[#0052CC] px-4 py-2.5 text-[13px] leading-snug text-white">
											Yes — add 3–4 targets where your profile is above their median. Want me to name them?
										</div>
									</div>
								</div>
							{/if}
						</div>
					{/key}
				{:else if onSocial}
					<!-- Social proof (GPT-vision's top ask) — real applicant quotes + scale. -->
					<div in:fly={{ x: 18, duration: 240 }} class="flex flex-1 flex-col">
						<div class="text-center">
							<div class="flex items-center justify-center gap-0.5 text-[#0052CC]">
								{#each Array(5) as _}
									<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.3a1 1 0 00.95.68h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.83-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.4 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.68l1.07-3.3z" /></svg>
								{/each}
							</div>
							<h2 class="mt-4 text-[26px] font-black leading-[1.1] tracking-tight text-slate-900">Applicants like you</h2>
							<p class="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-slate-500">
								Join <span class="font-semibold text-slate-700">5,000+ students</span> who pressure-tested their application here first.
							</p>
						</div>
						<div class="mt-6 space-y-3">
							{#each testimonials as t}
								<div class="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
									<p class="text-[13.5px] leading-relaxed text-slate-700">“{t.quote}”</p>
									<div class="mt-2.5 flex items-center gap-2">
										<div class="grid h-6 w-6 flex-none place-items-center rounded-full bg-[#0052CC] text-[11px] font-bold text-white">{t.name[0]}</div>
										<p class="text-xs font-semibold text-slate-600">{t.name} <span class="font-normal text-slate-400">· {t.role}</span></p>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<!-- Plan picker (final step) — mymind pattern: tap a card, then continue -->
					<div in:fly={{ x: 18, duration: 240 }}>
						<div class="text-center">
							<h2 class="text-[26px] font-black leading-[1.1] tracking-tight text-slate-900">Pick your plan</h2>
							<p class="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-slate-500">
								Your first prediction is free. This unlocks all 39, forever.
							</p>
						</div>

						<div class="mt-6 space-y-3">
							<button
								onclick={() => (selectedPlan = 'lifetime')}
								class="relative w-full rounded-2xl border-2 px-5 py-4 text-left transition {selectedPlan === 'lifetime' ? 'border-[#0052CC] bg-[#0052CC]/[0.04]' : 'border-slate-200 hover:border-slate-300'}"
							>
								<span class="absolute -top-2.5 left-5 rounded-full bg-[#0052CC] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Best value</span>
								<div class="flex items-center justify-between gap-3">
									<div>
										<div class="text-base font-black text-slate-900">Lifetime</div>
										<div class="mt-0.5 text-xs text-slate-500">All 39 schools, unlimited, forever — no subscription</div>
									</div>
									<div class="text-right">
										<div class="text-xl font-black text-slate-900">$25</div>
										<div class="text-[10px] font-medium text-slate-400">once</div>
									</div>
								</div>
							</button>

							<button
								onclick={() => (selectedPlan = 'monthly')}
								class="w-full rounded-2xl border-2 px-5 py-4 text-left transition {selectedPlan === 'monthly' ? 'border-[#0052CC] bg-[#0052CC]/[0.04]' : 'border-slate-200 hover:border-slate-300'}"
							>
								<div class="flex items-center justify-between gap-3">
									<div>
										<div class="text-base font-black text-slate-900">Monthly</div>
										<div class="mt-0.5 text-xs text-slate-500">Full access while you're applying. Just 2½ months = Lifetime.</div>
									</div>
									<div class="text-right">
										<div class="text-xl font-black text-slate-900">$9.99</div>
										<div class="text-[10px] font-medium text-slate-400">/mo</div>
									</div>
								</div>
							</button>
						</div>

						<ul class="mx-auto mt-5 max-w-[17rem] space-y-1.5">
							{#each ['All 39 predicted decisions', 'Unlimited re-runs', 'Deep-dive on every verdict', 'Unlimited essay editing', 'AI counselor + founder advice'] as f}
								<li class="flex items-center gap-2.5 text-sm text-slate-600">
									<svg class="h-4 w-4 flex-none text-[#0052CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
									{f}
								</li>
							{/each}
						</ul>

						<p class="mx-auto mt-5 max-w-xs text-center text-xs text-slate-400">
							$25 is <span class="font-semibold text-slate-600">10% of a single $100 application fee</span> — a fraction of one school.
						</p>
					</div>
				{/if}
			</div>

			<!-- Footer CTA -->
			<div class="border-t border-slate-100 px-7 pb-8 pt-4">
				<button
					onclick={next}
					disabled={loading}
					class="w-full rounded-2xl bg-[#0052CC] px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#0047b3] active:scale-[0.99] disabled:opacity-50"
				>
					{#if onPlans}
						{loading
							? 'Opening secure checkout…'
							: selectedPlan === 'monthly'
								? 'Continue — $9.99/mo'
								: 'Continue — $25 once'}
					{:else}
						Continue
					{/if}
				</button>
				{#if onPlans}
					<p class="mt-2 text-center text-[11px] text-slate-400">Secure checkout by Stripe · cancel anytime</p>
				{:else}
					<button onclick={() => (step = total)} class="mt-3 w-full text-center text-xs font-semibold text-slate-400 transition hover:text-slate-600">Skip to plans</button>
				{/if}
			</div>
		</div>
	</div>
{/if}
