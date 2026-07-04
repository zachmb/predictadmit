<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	let isProcessing = $state(false);

	async function startCheckout(plan: 'lifetime' | 'monthly') {
		if (isProcessing) return;
		if (!$page.data.session?.user) {
			signIn('google', { callbackUrl: '/pricing' });
			return;
		}
		isProcessing = true;
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pricingMode: plan })
			});
			const data = await res.json();
			if (data.url) {
				window.location.href = data.url;
				return;
			}
			alert('Checkout error: ' + (data.error || 'Unknown error'));
		} catch (e) {
			console.error(e);
			alert('Checkout error');
		} finally {
			isProcessing = false;
		}
	}

	const proFeatures = [
		'Unlimited AI admissions rehearsals across all 39 schools',
		'Full deep-dive analysis behind every decision',
		'Unlimited essay grading',
		'AI counselor + narrative mind-map',
		'Per-school improvement tips'
	];

	const freeFeatures = [
		'1 full AI admissions rehearsal (all 39 schools)',
		'Clearly labeled fictional portals and decision letters',
		'Chances predictor preview',
		'No credit card required'
	];
</script>

<svelte:head>
	<title>PredictAdmit – Pricing</title>
	<meta
		name="description"
		content="Start free with one full AI admissions rehearsal. PredictAdmit Pro unlocks unlimited rehearsals, deep dives, and essay grading — $5/month or $9 once for lifetime access."
	/>
</svelte:head>

<main class="min-h-screen bg-slate-50 text-slate-900">
	<div class="max-w-5xl mx-auto px-4 py-16 space-y-14">
		<header class="text-center space-y-4">
			<h1 class="text-5xl font-bold tracking-tight text-slate-900">
				Start free. Go Pro for <span class="text-[#0052CC]">$9</span>.
			</h1>
			<p class="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
				One free admissions rehearsal to see where you stand. One tiny upgrade to remove every limit —
				less than a private consultant charges per minute.
			</p>
		</header>

		<section class="grid gap-6 md:grid-cols-3 items-stretch">
			<!-- Free tier -->
			<div class="rounded-[1.5rem] bg-white p-8 border border-slate-200 flex flex-col">
				<h2 class="text-sm font-bold text-slate-500 tracking-[0.25em] uppercase">Free</h2>
				<div class="mt-4 flex items-end gap-1">
					<span class="text-5xl font-bold tracking-tighter">$0</span>
					<span class="text-sm text-slate-400 font-medium mb-1.5">to start</span>
				</div>
				<ul class="mt-6 space-y-3 text-sm text-slate-600 flex-1">
					{#each freeFeatures as f}
						<li class="flex items-start gap-2">
							<svg class="mt-0.5 h-4 w-4 flex-none text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clip-rule="evenodd"/></svg>
							{f}
						</li>
					{/each}
				</ul>
				<a
					href="/ai"
					class="mt-8 w-full rounded-2xl border border-slate-200 px-6 py-3.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
				>
					Run your free rehearsal
				</a>
			</div>

			<!-- Lifetime (featured) -->
			<div class="relative rounded-[1.5rem] bg-white p-8 border-2 border-[#0052CC] shadow-[0_20px_50px_-12px_rgba(0,82,204,0.25)] flex flex-col">
				<span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0052CC] text-white text-[10px] uppercase font-bold tracking-[0.2em] px-4 py-1.5 rounded-full">
					Best value
				</span>
				<h2 class="text-sm font-bold text-[#0052CC] tracking-[0.25em] uppercase">Pro · Lifetime</h2>
				<div class="mt-4 flex items-end gap-1">
					<span class="text-5xl font-bold tracking-tighter">$9</span>
					<span class="text-sm text-slate-400 font-medium mb-1.5">once, forever</span>
				</div>
				<ul class="mt-6 space-y-3 text-sm text-slate-600 flex-1">
					{#each proFeatures as f}
						<li class="flex items-start gap-2">
							<svg class="mt-0.5 h-4 w-4 flex-none text-[#0052CC]" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clip-rule="evenodd"/></svg>
							{f}
						</li>
					{/each}
				</ul>
				<button
					onclick={() => startCheckout('lifetime')}
					disabled={isProcessing}
					class="mt-8 w-full rounded-2xl bg-[#0052CC] px-6 py-3.5 text-sm font-bold text-white shadow-xl hover:bg-[#0047b3] hover:-translate-y-0.5 transition-all disabled:opacity-50"
				>
					{isProcessing ? 'Starting checkout…' : 'Get Lifetime Pro →'}
				</button>
			</div>

			<!-- Monthly -->
			<div class="rounded-[1.5rem] bg-white p-8 border border-slate-200 flex flex-col">
				<h2 class="text-sm font-bold text-slate-500 tracking-[0.25em] uppercase">Pro · Monthly</h2>
				<div class="mt-4 flex items-end gap-1">
					<span class="text-5xl font-bold tracking-tighter">$5</span>
					<span class="text-sm text-slate-400 font-medium mb-1.5">/ month</span>
				</div>
				<ul class="mt-6 space-y-3 text-sm text-slate-600 flex-1">
					<li class="flex items-start gap-2">
						<svg class="mt-0.5 h-4 w-4 flex-none text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clip-rule="evenodd"/></svg>
						Everything in Pro
					</li>
					<li class="flex items-start gap-2">
						<svg class="mt-0.5 h-4 w-4 flex-none text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clip-rule="evenodd"/></svg>
						Cancel anytime
					</li>
					<li class="flex items-start gap-2">
						<svg class="mt-0.5 h-4 w-4 flex-none text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clip-rule="evenodd"/></svg>
						Good for a single application push
					</li>
				</ul>
				<button
					onclick={() => startCheckout('monthly')}
					disabled={isProcessing}
					class="mt-8 w-full rounded-2xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
				>
					Start monthly
				</button>
			</div>
		</section>

		<!-- Message Section -->
		<section class="max-w-xl mx-auto pt-8 pb-12 text-center">
			<div class="relative p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
				<div class="space-y-4">
					<h3 class="text-2xl font-bold text-blue-900">Why so cheap?</h3>
					<p class="text-lg text-slate-600 font-medium leading-relaxed">
						The college admissions landscape is expensive and gatekept — private consultants charge
						thousands for the feedback Pro gives you for nine dollars. We priced it so no student's
						family income decides whether they get honest answers.
					</p>
					<p class="text-slate-500 italic">"Democratizing elite admissions through technology."</p>
				</div>
			</div>
		</section>
	</div>
</main>

<SiteFooter />
