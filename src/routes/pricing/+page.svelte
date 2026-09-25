<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	import { portals } from '$lib/config/admitMail';
	import { onMount } from 'svelte';
	import { track, trackViewItem, trackAddToCart, trackBeginCheckout } from '$lib/analytics';
	import { STRIPE_PRODUCTS } from '$lib/config/stripe-products';
	import UpgradeCarousel from '$lib/components/UpgradeCarousel.svelte';

	let isProcessing = $state(false);
	// Show the onboarding benefit carousel before Stripe on the full-access tiers
	// (Zach, 2026-09-12): walk the value, then the carousel's last step checks out.
	let showUpgradeCarousel = $state(false);
	function openUpgrade(plan: 'monthly' | 'lifetime') {
		track('upgrade_carousel_view', { plan, where: 'pricing' });
		showUpgradeCarousel = true;
	}
	let passSchoolSlug = $state(portals[0]?.slug ?? '');

	// GA4 funnel Step 2 "View product" — the pricing page is a product view.
	onMount(() => {
		track('pricing_page_view', { where: 'pricing' });
		trackViewItem('lifetime', STRIPE_PRODUCTS.lifetime.amountCents / 100);
	});

	const planCents = (plan: 'single' | 'monthly' | 'lifetime') =>
		plan === 'single'
			? STRIPE_PRODUCTS.single.amountCents
			: plan === 'monthly'
				? STRIPE_PRODUCTS.monthly.amountCents
				: STRIPE_PRODUCTS.lifetime.amountCents;

	async function startCheckout(plan: 'single' | 'monthly' | 'lifetime') {
		if (isProcessing) return;
		if (!$page.data.session?.user) {
			signIn('google', { callbackUrl: '/pricing' });
			return;
		}
		isProcessing = true;
		// GA4 funnel Steps 3 + 4 — plan picked, then Stripe checkout opening.
		trackAddToCart(plan, planCents(plan) / 100);
		track('checkout_step_1', { plan, where: 'pricing' });
		trackBeginCheckout(plan, planCents(plan) / 100);
		try {
			const school = portals.find((p) => p.slug === passSchoolSlug);
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(
					plan === 'single' && school
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

	// Pro sells IMPROVEMENT, not more predictions. Lead with the workshop and the
	// fix-it tools (what actually moves your odds); the prediction is the free,
	// unbiased scoreboard those tools are graded against.
	const fullFeatures = [
		'The essay workshop: line-by-line notes and honest admissions-officer reads on every draft.',
		'Rewrites in your voice, a tighter version of your own words, never a new essay.',
		"A per-school deep-dive with a mock admissions committee and a plan to fix what's weak.",
		'Reviews of your activities, honors, and recommendation letters.',
		'A Final Read of your whole application before you hit submit.',
		'An AI counselor that knows your file, plus re-run your prediction any time.'
	];

	const freeFeatures = [
		'Run the AI across all 39 schools, free',
		'Open your first predicted decision free',
		'Clearly labeled fictional portals and decision letters',
		'No credit card required'
	];
</script>

<svelte:head>
	<title>PredictAdmit: Pricing</title>
	<meta
		name="description"
		content="Your first AI admissions rehearsal is free. Unlock one school for $4.99, or get full access to every school and tool for $9.99/mo (or $25 once)."
	/>
</svelte:head>

<main class="min-h-screen pa-grid text-ink">
	<div class="max-w-6xl mx-auto px-4 py-16 space-y-14">
		<header class="text-center space-y-4">
			<h1 class="font-display text-navy text-5xl">
				Your admissions strategist, <span class="text-blue">not your consultant's invoice.</span>
			</h1>
			<p class="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
				Your prediction is free. What you pay for is fixing it: real essay edits,
				a plan for every school, and a counselor who's read thousands of applications.
				All of it for less than one hour with a $200-an-hour consultant.
			</p>
		</header>

		<section>
			<div class="pa-card overflow-hidden">
				<div class="grid divide-y divide-navy/15 md:grid-cols-3 md:divide-x md:divide-y-0">
					<!-- Free -->
					<div class="flex flex-col p-8">
						<h2 class="font-display text-navy text-2xl">Free</h2>
						<div class="mt-3 flex items-baseline gap-1.5">
							<span class="font-display text-navy text-4xl">$0</span>
							<span class="text-sm text-muted">to start</span>
						</div>
						<p class="mt-4 text-sm leading-relaxed text-muted">
							Run the AI across all 39 schools and open your first decision. See where you stand, no card.
						</p>
						<ul class="mt-6 mb-8 space-y-2.5">
							{#each freeFeatures as f}
								<li class="flex items-start gap-2.5 text-sm text-muted">
									<svg class="mt-0.5 h-4 w-4 flex-none text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
									{f}
								</li>
							{/each}
						</ul>
						<a href="/verdict" class="btn btn-secondary btn-block mt-auto text-center">
							Run your free rehearsal →
						</a>
					</div>

					<!-- Season Pass: the primary plan (pay once for the whole season).
					     Tinted + recommended; on mobile it jumps to the top (order-first). -->
					<div class="pa-card-cyan relative order-first flex flex-col p-8 md:order-none">
						<span class="absolute right-6 top-8 rounded-full bg-blue px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">Recommended</span>
						<h2 class="font-display text-navy text-2xl">Season Pass</h2>
						<div class="mt-3 flex items-baseline gap-1.5">
							<span class="font-display text-navy text-4xl">$25</span>
							<span class="text-sm text-muted">once</span>
						</div>
						<p class="mt-1 text-xs text-muted">One payment. No subscription.</p>
						<p class="mt-3 text-sm leading-relaxed text-muted">
							The whole application season, yours to keep. Everything that makes your application stronger, from now until you hit submit.
						</p>
						<ul class="mt-6 mb-8 space-y-2.5">
							{#each fullFeatures as f}
								<li class="flex items-start gap-2.5 text-sm text-ink">
									<svg class="mt-0.5 h-4 w-4 flex-none text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
									{f}
								</li>
							{/each}
						</ul>
						<button
							onclick={() => openUpgrade('lifetime')}
							disabled={isProcessing}
							class="btn btn-primary btn-block mt-auto"
						>
							{isProcessing ? 'Starting checkout…' : 'Get the Season Pass · $25'}
						</button>
					</div>

					<!-- Monthly: the flexible, cancel-anytime version of the Season Pass. -->
					<div class="flex flex-col p-8">
						<h2 class="font-display text-navy text-2xl">Monthly</h2>
						<div class="mt-3 flex items-baseline gap-1.5">
							<span class="font-display text-navy text-4xl">$9.99</span>
							<span class="text-sm text-muted">/mo</span>
						</div>
						<p class="mt-1 text-xs text-muted">Renews monthly. Cancel anytime.</p>
						<p class="mt-3 text-sm leading-relaxed text-muted">
							Same features as the Season Pass, billed monthly. For students who only need PredictAdmit for a deadline or two.
						</p>
						<ul class="mt-6 mb-8 space-y-2.5">
							{#each ['Everything in the Season Pass, month to month', 'Cancel the moment you hit submit', 'About 2½ months equals the Season Pass'] as f}
								<li class="flex items-start gap-2.5 text-sm text-muted">
									<svg class="mt-0.5 h-4 w-4 flex-none text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
									{f}
								</li>
							{/each}
						</ul>
						<button
							onclick={() => openUpgrade('monthly')}
							disabled={isProcessing}
							class="btn btn-secondary btn-block mt-auto"
						>
							{isProcessing ? 'Starting checkout…' : 'Start monthly · $9.99/mo'}
						</button>
					</div>
				</div>
			</div>

			<!-- Single-school downsell — keeps the school picker, visually secondary. -->
			<div class="pa-card mt-4 flex flex-col items-center gap-3 p-5 text-center sm:flex-row sm:justify-between sm:text-left">
				<div>
					<p class="text-sm font-bold text-navy">Just one dream school? $4.99</p>
					<p class="mt-0.5 text-xs text-muted">Its full deep-dive and unblurred decision, yours forever. Run your free rehearsal first.</p>
				</div>
				<div class="flex w-full shrink-0 items-center gap-2 sm:w-auto">
					<select
						bind:value={passSchoolSlug}
						class="w-full rounded-lg border-2 border-navy bg-paper px-3 py-2.5 text-sm text-navy focus:outline-none sm:w-44"
					>
						{#each portals as p}
							<option value={p.slug}>{p.name}</option>
						{/each}
					</select>
					<button
						onclick={() => startCheckout('single')}
						disabled={isProcessing}
						class="btn btn-secondary shrink-0"
					>
						Unlock · $4.99
					</button>
				</div>
			</div>
		</section>

		<!-- Value math -->
		<section class="max-w-3xl mx-auto grid gap-4 sm:grid-cols-3 text-center">
			<div class="pa-card p-5">
				<div class="font-display text-navy text-2xl">$5,000+</div>
				<div class="mt-1 text-xs text-muted">Typical private consultant, one application season</div>
			</div>
			<div class="pa-card p-5">
				<div class="font-display text-navy text-2xl">$200–500</div>
				<div class="mt-1 text-xs text-muted">One hour of consultant essay review</div>
			</div>
			<div class="pa-card-yellow p-5">
				<div class="font-display text-navy text-2xl">$25</div>
				<div class="mt-1 text-xs text-muted">Season Pass: every school, every tool, all season</div>
			</div>
		</section>

		<!-- Message Section -->
		<section class="max-w-xl mx-auto pt-4 pb-12 text-center">
			<div class="pa-card relative p-8">
				<div class="space-y-4">
					<h3 class="font-display text-navy text-2xl">Why this pricing?</h3>
					<p class="text-lg text-muted font-medium leading-relaxed">
						The feedback loop consultants sell by the hour (a blunt read of your application,
						school by school, with a concrete plan to fix it) is what Pro gives you
						unlimited, for less than one-tenth of a single consultant hour. Only care about one dream school?
						A single-school unlock gets you its full analysis for $4.99.
					</p>
					<p class="text-muted italic">"The read is the same either way. We just don't bill you by the hour for it."</p>
				</div>
			</div>
		</section>
	</div>
</main>

<!-- Pre-checkout benefit carousel (Monthly/Lifetime upgrade path) -->
<UpgradeCarousel bind:open={showUpgradeCarousel} loading={isProcessing} oncontinue={(plan) => startCheckout(plan)} />

<SiteFooter />
