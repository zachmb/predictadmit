<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	import { portals } from '$lib/config/admitMail';

	let isProcessing = $state(false);
	let passSchoolSlug = $state(portals[0]?.slug ?? '');

	async function startCheckout(plan: 'lifetime' | 'monthly' | 'school') {
		if (isProcessing) return;
		if (!$page.data.session?.user) {
			signIn('google', { callbackUrl: '/pricing' });
			return;
		}
		isProcessing = true;
		try {
			const school = portals.find((p) => p.slug === passSchoolSlug);
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(
					plan === 'school' && school
						? { pricingMode: plan, slug: school.slug, schoolName: school.name }
						: { pricingMode: plan }
				)
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

	const fullFeatures = [
		'Unlimited AI admissions rehearsals across all 39 schools',
		'Every deep-dive decision analysis — 5 scored dimensions, AO-style critique, and an improvement plan per school',
		'Unlimited essay grading: 10 inline annotations + harsh and honest AO reads on every draft',
		'AI counselor with your full application in context',
		'Narrative mind-map, schools explorer, and chance-me profile',
		'Every future school and tool we add — included'
	];

	const schoolFeatures = [
		'Full deep-dive analysis for your school — 5 scored dimensions + improvement plan',
		'Unblurred decision breakdown on the results page',
		'Unlimited essay grading targeted at your school',
		'Yours forever — one payment, no subscription'
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
		content="Start free with one full AI admissions rehearsal. Unlock one school for $14.99, or get Full Access — every school, every tool — for $39/month or $99 once."
	/>
</svelte:head>

<main class="min-h-screen bg-slate-50 text-slate-900">
	<div class="max-w-6xl mx-auto px-4 py-16 space-y-14">
		<header class="text-center space-y-4">
			<h1 class="text-5xl font-bold tracking-tight text-slate-900">
				Your admissions strategist, <span class="text-[#0052CC]">not your consultant's invoice.</span>
			</h1>
			<p class="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
				Private admissions consultants run $200–500 an hour and $5,000+ per application season.
				Full Access is $99 — once. Start free and see where you stand first.
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

			<!-- School Pass -->
			<div class="rounded-[1.5rem] bg-white p-8 border border-slate-200 flex flex-col">
				<h2 class="text-sm font-bold text-slate-500 tracking-[0.25em] uppercase">School Pass</h2>
				<div class="mt-4 flex items-end gap-1">
					<span class="text-5xl font-bold tracking-tighter">$14.99</span>
					<span class="text-sm text-slate-400 font-medium mb-1.5">once, per school</span>
				</div>
				<p class="mt-2 text-xs text-slate-500">
					Everything Pro knows about one school — the one you actually care about.
				</p>
				<ul class="mt-5 space-y-3 text-sm text-slate-600 flex-1">
					{#each schoolFeatures as f}
						<li class="flex items-start gap-2">
							<svg class="mt-0.5 h-4 w-4 flex-none text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clip-rule="evenodd"/></svg>
							{f}
						</li>
					{/each}
				</ul>
				<select
					bind:value={passSchoolSlug}
					class="mt-6 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-[#0052CC] focus:outline-none"
				>
					{#each portals as p}
						<option value={p.slug}>{p.name}</option>
					{/each}
				</select>
				<button
					onclick={() => startCheckout('school')}
					disabled={isProcessing}
					class="mt-3 w-full rounded-2xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
				>
					Unlock this school — $14.99
				</button>
			</div>

			<!-- Full Access (featured) -->
			<div class="relative rounded-[1.5rem] bg-white p-8 border-2 border-[#0052CC] shadow-[0_20px_50px_-12px_rgba(0,82,204,0.25)] flex flex-col">
				<span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0052CC] text-white text-[10px] uppercase font-bold tracking-[0.2em] px-4 py-1.5 rounded-full">
					Best value
				</span>
				<h2 class="text-sm font-bold text-[#0052CC] tracking-[0.25em] uppercase">Full Access</h2>
				<div class="mt-4 flex items-end gap-1">
					<span class="text-5xl font-bold tracking-tighter">$99</span>
					<span class="text-sm text-slate-400 font-medium mb-1.5">once, forever</span>
				</div>
				<p class="mt-2 text-xs text-slate-500">
					Or $39/month while you're applying — cancel anytime.
				</p>
				<ul class="mt-5 space-y-3 text-sm text-slate-600 flex-1">
					{#each fullFeatures as f}
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
					{isProcessing ? 'Starting checkout…' : 'Get Full Access — $99 once →'}
				</button>
				<button
					onclick={() => startCheckout('monthly')}
					disabled={isProcessing}
					class="mt-2 w-full rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
				>
					Or $39/month
				</button>
			</div>
		</section>

		<!-- Value math -->
		<section class="max-w-3xl mx-auto grid gap-4 sm:grid-cols-3 text-center">
			<div class="rounded-2xl border border-slate-200 bg-white p-5">
				<div class="text-2xl font-bold text-slate-900">$5,000+</div>
				<div class="mt-1 text-xs text-slate-500">Typical private consultant, one application season</div>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-white p-5">
				<div class="text-2xl font-bold text-slate-900">$200–500</div>
				<div class="mt-1 text-xs text-slate-500">One hour of consultant essay review</div>
			</div>
			<div class="rounded-2xl border border-[#0052CC]/30 bg-blue-50/50 p-5">
				<div class="text-2xl font-bold text-[#0052CC]">$99</div>
				<div class="mt-1 text-xs text-slate-600">Full Access — every school, every tool, forever</div>
			</div>
		</section>

		<!-- Message Section -->
		<section class="max-w-xl mx-auto pt-4 pb-12 text-center">
			<div class="relative p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
				<div class="space-y-4">
					<h3 class="text-2xl font-bold text-blue-900">Why this pricing?</h3>
					<p class="text-lg text-slate-600 font-medium leading-relaxed">
						The feedback loop consultants sell by the hour — a blunt read of your application,
						school by school, with a concrete plan to fix it — is what Full Access gives you
						unlimited, for less than half of one consultant hour. Only care about one dream school?
						The School Pass gets you its full analysis for $14.99.
					</p>
					<p class="text-slate-500 italic">"The read is the same either way. We just don't bill you by the hour for it."</p>
				</div>
			</div>
		</section>
	</div>
</main>

<SiteFooter />
