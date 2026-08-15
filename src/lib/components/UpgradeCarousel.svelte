<script lang="ts">
	// Pre-checkout benefit carousel — the user taps through a few screens that
	// showcase everything Pro includes BEFORE they ever see Stripe's card page.
	// Pattern from Mobbin (Spotify "Your benefits" / Apple News+ onboarding): one
	// benefit per screen, big icon + bold title + subtitle, dots, Next → final
	// confirm → checkout. Non-subscription micro-buys ($4.99/decision) skip this.
	import { fade, fly } from 'svelte/transition';

	let {
		open = $bindable(false),
		plan = 'lifetime',
		loading = false,
		oncontinue,
		onclose
	}: {
		open?: boolean;
		plan?: 'monthly' | 'lifetime';
		loading?: boolean;
		oncontinue?: () => void;
		onclose?: () => void;
	} = $props();

	// Icon keys map to inline SVGs below. Essay editing is featured 2nd on purpose —
	// rising seniors pay for essay help, and it's included in paid PredictAdmit.
	const benefits = [
		{
			icon: 'bolt',
			title: 'Unlimited predictions',
			body: 'Run your real application against all 39 top schools as many times as you want. Change an essay, a score, an activity — re-run and watch your odds move.'
		},
		{
			icon: 'pencil',
			title: 'Pro essay editing',
			body: 'Line-by-line AI feedback on every supplement — the honest read an admissions officer would give. It marks up your weak lines and tells you why. You write every word; it just makes them land.'
		},
		{
			icon: 'search',
			title: 'The deep-dive on every verdict',
			body: 'Not just accept or deny — the five scored dimensions behind each decision and the concrete changes that would actually move it.'
		},
		{
			icon: 'chat',
			title: 'Advice from the founding team',
			body: 'Stuck on your list or an essay? Message the team that got into these schools and calibrated the AI on real admissions results.'
		}
	];

	let step = $state(0);
	const total = benefits.length; // benefit steps; step === total is the confirm screen
	const onConfirm = $derived(step >= total);

	const priceLabel = $derived(plan === 'monthly' ? '$9.99/mo' : '$25 once');
	const planName = $derived(plan === 'monthly' ? 'Monthly' : 'Lifetime');

	function next() {
		if (step < total) step += 1;
		else oncontinue?.();
	}
	function back() {
		if (step > 0) step -= 1;
	}
	function close() {
		step = 0;
		open = false;
		onclose?.();
	}
	// Reset to the first screen whenever it (re)opens.
	$effect(() => {
		if (open) step = 0;
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
			class="relative flex w-full max-w-md flex-col bg-white sm:max-h-[92vh] sm:rounded-3xl sm:shadow-2xl"
			transition:fly={{ y: 24, duration: 240 }}
		>
			<!-- Top bar: back + progress + close -->
			<div class="flex items-center gap-3 px-5 pt-5">
				<button
					onclick={back}
					disabled={step === 0}
					aria-label="Back"
					class="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-0"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
				</button>
				<div class="flex flex-1 items-center justify-center gap-1.5">
					{#each Array(total + 1) as _, i}
						<span class="h-1.5 rounded-full transition-all duration-300 {i === step ? 'w-6 bg-[#0052CC]' : 'w-1.5 bg-slate-200'}"></span>
					{/each}
				</div>
				<button
					onclick={close}
					aria-label="Close"
					class="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>

			<!-- Body -->
			<div class="flex flex-1 flex-col justify-center px-7 py-10">
				{#if !onConfirm}
					{#key step}
						<div in:fly={{ x: 20, duration: 220 }} class="text-center">
							<div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#0052CC]/10 text-[#0052CC]">
								{#if benefits[step].icon === 'bolt'}
									<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
								{:else if benefits[step].icon === 'pencil'}
									<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
								{:else if benefits[step].icon === 'search'}
									<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
								{:else}
									<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 01-9 9c-1.6 0-3.1-.42-4.4-1.15L3 21l1.15-4.6A8.96 8.96 0 013 12a9 9 0 019-9 9 9 0 019 9z" /></svg>
								{/if}
							</div>
							<p class="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0052CC]">Included with Pro</p>
							<h2 class="mt-2 text-2xl font-black tracking-tight text-slate-900">{benefits[step].title}</h2>
							<p class="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-slate-500">{benefits[step].body}</p>
						</div>
					{/key}
				{:else}
					<!-- Confirm screen: everything, one price -->
					<div in:fly={{ x: 20, duration: 220 }} class="text-center">
						<div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#0052CC] text-white">
							<svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
						</div>
						<h2 class="mt-5 text-2xl font-black tracking-tight text-slate-900">Everything above — {priceLabel}</h2>
						<p class="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
							{planName} unlocks all 39 decisions, unlimited re-runs, every deep-dive, unlimited essay editing, and the AI counselor.
						</p>
						<ul class="mx-auto mt-5 max-w-[16rem] space-y-2 text-left">
							{#each benefits as b}
								<li class="flex items-start gap-2.5 text-sm text-slate-700">
									<svg class="mt-0.5 h-4 w-4 flex-none text-[#0052CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
									{b.title}
								</li>
							{/each}
						</ul>
						<p class="mx-auto mt-5 max-w-xs text-xs text-slate-400">A private admissions counselor runs $5,000+ a season.</p>
					</div>
				{/if}
			</div>

			<!-- Footer CTA -->
			<div class="px-7 pb-8 pt-2">
				<button
					onclick={next}
					disabled={loading}
					class="w-full rounded-2xl bg-[#0052CC] px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#0047b3] active:scale-[0.99] disabled:opacity-50"
				>
					{#if onConfirm}
						{loading ? 'Opening secure checkout…' : `Continue — ${priceLabel}`}
					{:else}
						Next
					{/if}
				</button>
				{#if onConfirm}
					<p class="mt-2 text-center text-[11px] text-slate-400">Secure checkout by Stripe · cancel anytime{plan === 'monthly' ? '' : ' — or one payment, forever'}</p>
				{:else}
					<button onclick={() => (step = total)} class="mt-3 w-full text-center text-xs font-semibold text-slate-400 transition hover:text-slate-600">Skip to checkout</button>
				{/if}
			</div>
		</div>
	</div>
{/if}
