<script lang="ts">
	import { page } from '$app/stores';
	import { schoolConfigs } from '$lib/config/schools';
	import { schoolStats } from '$lib/config/schoolStats';

	// --- Read + sanitize query params ---
	const params = $derived($page.url.searchParams);

	const schoolSlug = $derived((params.get('school') ?? '').toLowerCase().trim());

	const outcome = $derived<'admit' | 'deny'>(
		params.get('outcome') === 'deny' ? 'deny' : 'admit'
	);

	function sanitizeName(raw: string | null): string {
		if (!raw) return 'A PredictAdmit user';
		// Strip anything that isn't a letter, space, hyphen or apostrophe; cap length.
		const cleaned = raw.replace(/[^\p{L}\s'-]/gu, '').trim().slice(0, 40);
		return cleaned.length ? cleaned : 'A PredictAdmit user';
	}

	const name = $derived(sanitizeName(params.get('name')));

	// --- Resolve school display name + brand color ---
	const schoolName = $derived(
		schoolConfigs[schoolSlug]?.schoolName ??
			schoolStats[schoolSlug]?.name ??
			(schoolSlug ? 'a top university' : 'a top university')
	);

	const accent = $derived(
		schoolConfigs[schoolSlug]?.primaryColor ??
			schoolStats[schoolSlug]?.color ??
			'#4f46e5'
	);

	const isAdmit = $derived(outcome === 'admit');

	const headline = $derived(
		isAdmit ? `${name} got into ${schoolName}! 🎉` : `${name}'s ${schoolName} decision`
	);

	// --- Meta for link previews ---
	const metaTitle = $derived(
		isAdmit
			? `${name} got into ${schoolName}! 🎉 — PredictAdmit`
			: `${name}'s ${schoolName} decision — PredictAdmit`
	);

	const metaDescription = $derived(
		isAdmit
			? `${name} rehearsed a ${schoolName} admissions outcome on PredictAdmit. Try your own clearly labeled rehearsal for free.`
			: `See ${name}'s simulated ${schoolName} admissions decision on PredictAdmit. Run your own admissions rehearsal for free.`
	);
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDescription} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={metaTitle} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:image" content="/og-default.png" />
	<meta property="og:site_name" content="PredictAdmit" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metaTitle} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content="/og-default.png" />
</svelte:head>

<div
	class="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased"
	style="--accent: {accent};"
>
	<!-- Top bar -->
	<header class="w-full border-b border-slate-200/70 bg-white/80 backdrop-blur">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
			<a href="/" class="text-lg font-bold tracking-tight text-slate-900">
				predict<span style="color: var(--accent);">admit</span
				><span class="text-slate-400">.com</span>
			</a>
			<a
				href="/portals"
				class="hidden rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:inline-block"
				style="background-color: var(--accent);"
			>
				Try it free
			</a>
		</div>
	</header>

	<!-- Card -->
	<main class="flex flex-1 items-center justify-center px-5 py-12">
		<div class="w-full max-w-lg">
			<div
				class="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5"
			>
				<!-- Accent top bar -->
				<div class="h-2 w-full" style="background-color: var(--accent);"></div>

				<div class="px-7 py-10 text-center sm:px-10 sm:py-12">
					<span
						class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
						style="background-color: color-mix(in srgb, var(--accent) 12%, white); color: var(--accent);"
					>
						{isAdmit ? 'Admissions Simulation' : 'Decision Simulation'}
					</span>

					<h1
						class="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl"
					>
						{headline}
					</h1>

					<p class="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-500">
						{#if isAdmit}
							This decision was simulated on PredictAdmit's realistic admissions
							simulator — the same engine top applicants use to see where they stand.
						{:else}
							This decision was simulated on PredictAdmit's realistic admissions
							simulator. A simulation isn't a verdict — it's a way to understand the odds.
						{/if}
					</p>

					<!-- CTAs -->
					<div class="mt-8 flex flex-col gap-3">
						<a
							href="/portals"
							class="inline-flex w-full items-center justify-center rounded-xl px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
							style="background-color: var(--accent);"
						>
							Predict YOUR decision →
						</a>
						<a
							href="/ai"
							class="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
						>
							Try the free admissions predictor
						</a>
					</div>

					<p class="mt-6 text-sm text-slate-400">
						<a href="/about" class="font-medium text-slate-500 underline-offset-2 hover:underline">
							How real is this?
						</a>
					</p>
				</div>
			</div>

			<p class="mt-6 text-center text-xs text-slate-400">
				Simulated result. Not affiliated with or endorsed by any university.
			</p>
		</div>
	</main>
</div>
