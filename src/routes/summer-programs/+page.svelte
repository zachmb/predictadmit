<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import {
		summerPrograms,
		inviteOnlyPipelines,
		type ProgramSubject,
		type ProgramFormat,
		type AdmissionsSignal
	} from '$lib/config/summerPrograms';

	const SAVED_KEY = 'predictadmit:savedSummerPrograms';

	// ---- Saved programs (browser-only, like the rest of the sim) ---------------
	let saved = $state<Set<string>>(new Set());

	$effect(() => {
		if (typeof window === 'undefined') return;
		try {
			const raw = window.localStorage.getItem(SAVED_KEY);
			if (raw) saved = new Set(JSON.parse(raw) as string[]);
		} catch {
			// ignore malformed storage
		}
	});

	function toggleSaved(id: string) {
		const next = new Set(saved);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		saved = next;
		try {
			window.localStorage.setItem(SAVED_KEY, JSON.stringify([...next]));
		} catch {
			// ignore
		}
	}

	// ---- Filters ----------------------------------------------------------------
	const subjects: ProgramSubject[] = [
		'STEM research',
		'Math',
		'CS & engineering',
		'Medicine',
		'Writing & humanities',
		'Journalism',
		'Business',
		'Leadership & service',
		'Arts',
		'Global & language'
	];
	const formats: ProgramFormat[] = ['Residential', 'Commuter', 'Virtual', 'Hybrid'];

	let search = $state('');
	let subjectFilter = $state<'All' | ProgramSubject>('All');
	let costFilter = $state<'All' | 'Free or funded' | 'Paid'>('All');
	let formatFilter = $state<'All' | ProgramFormat>('All');
	let savedOnly = $state(false);

	const rows = $derived.by(() => {
		const q = search.trim().toLowerCase();
		return summerPrograms
			.filter((p) => {
				if (savedOnly && !saved.has(p.id)) return false;
				if (subjectFilter !== 'All' && !p.subjects.includes(subjectFilter)) return false;
				if (costFilter === 'Free or funded' && p.cost !== 'Free' && p.cost !== 'Free + stipend')
					return false;
				if (costFilter === 'Paid' && (p.cost === 'Free' || p.cost === 'Free + stipend'))
					return false;
				if (formatFilter !== 'All' && p.format !== formatFilter && p.format !== 'Varies')
					return false;
				if (
					q &&
					!p.name.toLowerCase().includes(q) &&
					!p.host.toLowerCase().includes(q) &&
					!p.blurb.toLowerCase().includes(q)
				)
					return false;
				return true;
			})
			.sort((a, b) => a.deadlineOrder - b.deadlineOrder || a.name.localeCompare(b.name));
	});

	// ---- Presentation helpers -----------------------------------------------------
	const signalChip: Record<AdmissionsSignal, string> = {
		Elite: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
		Strong: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
		Moderate: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
		Enrichment: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
	};

	const signalLegend: { key: AdmissionsSignal; text: string }[] = [
		{ key: 'Elite', text: 'Hard to get into, usually free. Reads as a real spike to a reader.' },
		{ key: 'Strong', text: 'Selective and known. Adds real weight to your file.' },
		{ key: 'Moderate', text: 'Somewhat selective or a big cohort. Useful, but it won\'t set you apart.' },
		{
			key: 'Enrichment',
			text: 'Open or near-open enrollment. Fine for exploring, but paying your way in signals nothing about selectivity.'
		}
	];

	const freeCount = summerPrograms.filter(
		(p) => p.cost === 'Free' || p.cost === 'Free + stipend'
	).length;
</script>

<svelte:head>
	<title>Summer Programs for High School Students — PredictAdmit</title>
	<meta
		name="description"
		content="A checked catalog of summer programs for high schoolers — one entry per program, real cost tiers, typical deadlines, and a straight read on what each one signals to selective colleges."
	/>
</svelte:head>

<main class="min-h-screen bg-white font-sans text-slate-900">
	<!-- Hero -->
	<section class="border-b border-slate-100 bg-slate-50">
		<div class="max-w-5xl mx-auto px-6 py-16 md:py-20">
			<p
				class="inline-block mb-5 text-xs font-semibold tracking-widest uppercase text-[#0052CC] bg-[#0052CC]/10 px-3 py-1 rounded-full"
			>
				Summer Programs
			</p>
			<h1 class="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4 text-balance">
				Spend your summer on something that counts.
			</h1>
			<p class="text-lg text-slate-500 leading-relaxed max-w-2xl">
				{summerPrograms.length} programs, checked by hand. {freeCount} of them are free or come with a
				stipend. Each one has a straight read on what it actually signals to selective colleges. No
				duplicate listings, no made-up prices, no fake deadlines.
			</p>
			<p class="mt-4 max-w-2xl text-xs leading-relaxed text-slate-400">
				How the list works: every program appears once, under the organization that actually runs it.
				Costs are grouped into tiers, and deadlines are the typical windows from recent years —
				<span class="font-semibold text-slate-500">check the current deadline on the program's own
				site</span> before you plan around it.
			</p>
		</div>
	</section>

	<!-- Signal legend -->
	<section class="max-w-5xl mx-auto px-6 pt-10">
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{#each signalLegend as s}
				<div class="rounded-xl border border-slate-100 bg-white p-4">
					<span
						class="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold {signalChip[s.key]}"
						>{s.key}</span
					>
					<p class="mt-2 text-xs leading-relaxed text-slate-500">{s.text}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Toolbar -->
	<section class="max-w-5xl mx-auto px-6 pt-8">
		<div
			class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center"
		>
			<input
				type="text"
				bind:value={search}
				placeholder="Search by program, host, or keyword…"
				class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]/30"
			/>
			<div class="flex flex-wrap items-center gap-2">
				<select
					bind:value={subjectFilter}
					class="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700"
				>
					<option value="All">All subjects</option>
					{#each subjects as s}
						<option value={s}>{s}</option>
					{/each}
				</select>
				<select
					bind:value={costFilter}
					class="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700"
				>
					<option value="All">Any cost</option>
					<option value="Free or funded">Free or funded</option>
					<option value="Paid">Paid</option>
				</select>
				<select
					bind:value={formatFilter}
					class="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700"
				>
					<option value="All">Any format</option>
					{#each formats as f}
						<option value={f}>{f}</option>
					{/each}
				</select>
				<button
					type="button"
					onclick={() => (savedOnly = !savedOnly)}
					class="rounded-lg border px-3 py-2 text-sm font-semibold transition-colors {savedOnly
						? 'border-[#0052CC] bg-[#0052CC]/10 text-[#0052CC]'
						: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}"
				>
					★ Saved ({saved.size})
				</button>
			</div>
		</div>
		<p class="mt-3 text-xs text-slate-400">
			{rows.length} of {summerPrograms.length} programs · sorted by typical deadline · anything you
			save stays in this browser only
		</p>
	</section>

	<!-- Program cards -->
	<section class="max-w-5xl mx-auto px-6 py-8">
		{#if rows.length === 0}
			<div class="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
				No programs match those filters.
			</div>
		{:else}
			<div class="grid gap-4 md:grid-cols-2">
				{#each rows as p (p.id)}
					<article
						class="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
					>
						<div class="mb-2 flex items-start justify-between gap-3">
							<div>
								<h2 class="font-bold leading-snug text-slate-900">{p.name}</h2>
								<p class="text-xs font-medium text-slate-500">{p.host}</p>
							</div>
							<div class="flex shrink-0 items-center gap-2">
								<span class="rounded-full px-2.5 py-0.5 text-[11px] font-bold {signalChip[p.signal]}"
									>{p.signal}</span
								>
								<button
									type="button"
									aria-label={saved.has(p.id) ? 'Remove from saved' : 'Save program'}
									onclick={() => toggleSaved(p.id)}
									class="text-lg leading-none transition-colors {saved.has(p.id)
										? 'text-amber-400'
										: 'text-slate-300 hover:text-amber-400'}"
								>
									★
								</button>
							</div>
						</div>

						<p class="mb-3 text-sm leading-relaxed text-slate-600">{p.blurb}</p>

						<div class="mb-3 flex flex-wrap gap-1.5">
							{#each p.subjects as s}
								<span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
									>{s}</span
								>
							{/each}
						</div>

						<dl class="mt-auto grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3 text-xs">
							<div>
								<dt class="font-semibold uppercase tracking-wide text-slate-400">Cost</dt>
								<dd class="text-slate-700">
									{p.cost}{#if p.costNote}<span class="text-slate-400"> · {p.costNote}</span>{/if}
								</dd>
							</div>
							<div>
								<dt class="font-semibold uppercase tracking-wide text-slate-400">Typical deadline</dt>
								<dd class="text-slate-700">{p.typicalDeadline}</dd>
							</div>
							<div>
								<dt class="font-semibold uppercase tracking-wide text-slate-400">Format</dt>
								<dd class="text-slate-700">{p.format} · {p.duration}</dd>
							</div>
							{#if p.eligibility}
								<div>
									<dt class="font-semibold uppercase tracking-wide text-slate-400">Eligibility</dt>
									<dd class="text-slate-700">{p.eligibility}</dd>
								</div>
							{/if}
						</dl>

						{#if p.website}
							<a
								href="https://{p.website}"
								target="_blank"
								rel="noopener noreferrer"
								class="mt-3 inline-block text-xs font-semibold text-[#0052CC] hover:underline"
							>
								Official site: {p.website} ↗
							</a>
						{/if}
					</article>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Invite-only pipelines -->
	<section class="max-w-5xl mx-auto px-6 pb-8">
		<div class="rounded-2xl border border-amber-200 bg-amber-50 p-6">
			<h2 class="mb-2 font-bold text-amber-900">Programs you can't just apply to</h2>
			<p class="mb-4 text-sm leading-relaxed text-amber-800">
				Some famous programs have no application form at all — you win your way up a
				competition pipeline. Any catalog that shows these with an "application deadline" has it wrong.
			</p>
			<ul class="space-y-2 text-sm text-amber-900">
				{#each inviteOnlyPipelines as p}
					<li>
						<span class="font-semibold">{p.name}:</span>
						<span class="text-amber-800"> {p.how}</span>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- CTA -->
	<section class="max-w-5xl mx-auto px-6 pb-16">
		<div class="rounded-[2rem] bg-[#0052CC] p-10 text-center">
			<h2 class="mb-3 text-2xl md:text-3xl font-bold tracking-tight text-white">
				Landed a great summer? Now make it count on the application.
			</h2>
			<p class="mx-auto mb-8 max-w-xl leading-relaxed text-white/80">
				The free AI essay workshop helps you turn the summer into a story worth reading. Then the
				chances predictor shows you how much it moves your odds.
			</p>
			<a
				href="/pro"
				class="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-[#0052CC] shadow-lg transition-colors hover:bg-slate-100"
			>
				Open PredictAdmit Pro →
			</a>
		</div>
	</section>

	<SiteFooter />
</main>
