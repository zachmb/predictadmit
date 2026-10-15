<script lang="ts">
	import { userProfile, type TrackedSchool } from '$lib/stores/user';
	import { schoolConfigs } from '$lib/config/schools';
	import {
		schoolStats,
		readableTextColor,
		type SchoolStat,
		type SchoolSize,
		type CampusSetting,
		type Likelihood
	} from '$lib/config/schoolStats';
	import { computeDecisionForSchool, hasEnoughToScore } from '$lib/scoring/model';
	import { aiResults, type DecisionOutcome } from '$lib/stores/results';

	// The SAME structured profile that drives the predicted decisions in the AI
	// inbox — so the chances here can never contradict the prediction.
	const scoring = $derived($userProfile.stats);
	const hasStats = $derived(hasEnoughToScore(scoring));

	// Actual run predictions (odds + outcome + fit) by slug, when a simulation has
	// been run. These are preferred over a fresh model call so the Universities tab
	// matches the inbox exactly.
	const predBySlug = $derived.by(() => {
		const m: Record<string, { odds?: number; outcome: DecisionOutcome; fit: number }> = {};
		for (const d of $aiResults?.decisions ?? []) {
			if (d.slug) m[d.slug] = { odds: d.odds, outcome: d.outcome, fit: d.fit_score };
		}
		return m;
	});

	// ---- Chance = the real model's admit odds + outcome ------------------------
	// A predicted "admit" can never show a contradictory single-digit chance, because
	// the odds, outcome, and likelihood label all come from one source of truth.
	type Chance = { odds: number; outcome: DecisionOutcome; label: Likelihood; fit: number };

	function labelFromOutcome(outcome: DecisionOutcome, odds: number): Likelihood {
		if (outcome === 'admit') return odds >= 55 ? 'Safety' : 'Target';
		if (outcome === 'waitlist' || outcome === 'defer') return 'Reach';
		return 'Hard reach';
	}

	function chanceForSlug(slug: string): Chance {
		const pred = predBySlug[slug];
		if (pred && typeof pred.odds === 'number') {
			return { odds: pred.odds, outcome: pred.outcome, label: labelFromOutcome(pred.outcome, pred.odds), fit: pred.fit ?? 0 };
		}
		if (hasStats) {
			const r = computeDecisionForSchool(scoring, slug);
			return { odds: r.odds, outcome: r.outcome, label: labelFromOutcome(r.outcome, r.odds), fit: 0 };
		}
		// No stats entered yet — show the school's raw acceptance rate as a neutral
		// baseline (clearly not personalized until stats are added).
		const stat = schoolStats[slug];
		const base = stat ? Math.round(stat.acceptanceRate * 100) : 10;
		return { odds: base, outcome: 'deny', label: base >= 40 ? 'Target' : 'Reach', fit: 0 };
	}

	// ---- Base rows -------------------------------------------------------------
	type Row = {
		slug: string;
		name: string;
		color: string;
		stat: SchoolStat;
		chance: number;
		outcome: DecisionOutcome;
		likelihood: Likelihood;
		fit: number;
	};

	const baseRows: Row[] = Object.values(schoolStats)
		.map((stat) => {
			const cfg = schoolConfigs[stat.slug];
			return {
				slug: stat.slug,
				name: cfg?.schoolName ?? stat.name ?? stat.slug,
				color: cfg?.primaryColor ?? stat.color ?? '#0c0c09',
				stat,
				chance: 0,
				outcome: 'deny' as DecisionOutcome,
				likelihood: 'Target' as Likelihood,
				fit: 0
			};
		})
		.sort((a, b) => a.stat.rank - b.stat.rank);

	// ---- Toolbar state ---------------------------------------------------------
	let search = $state('');
	let sizeFilter = $state<'All' | SchoolSize>('All');
	let settingFilter = $state<'All' | CampusSetting>('All');
	let sortBy = $state<'Rank' | 'Acceptance rate' | 'Your chances' | 'Tuition'>('Rank');

	// ---- Derived: rows with live chance + filtering + sorting ------------------
	const rows = $derived.by(() => {
		const q = search.trim().toLowerCase();
		let list = baseRows.map((r) => {
			const c = chanceForSlug(r.slug);
			return { ...r, chance: c.odds, outcome: c.outcome, likelihood: c.label, fit: c.fit };
		});

		if (q) {
			list = list.filter(
				(r) =>
					r.name.toLowerCase().includes(q) ||
					r.stat.location.toLowerCase().includes(q)
			);
		}
		if (sizeFilter !== 'All') list = list.filter((r) => r.stat.size === sizeFilter);
		if (settingFilter !== 'All') list = list.filter((r) => r.stat.setting === settingFilter);

		list.sort((a, b) => {
			switch (sortBy) {
				case 'Acceptance rate':
					return a.stat.acceptanceRate - b.stat.acceptanceRate;
				case 'Your chances':
					return b.chance - a.chance;
				case 'Tuition':
					return a.stat.tuition - b.stat.tuition;
				case 'Rank':
				default:
					return a.stat.rank - b.stat.rank;
			}
		});
		return list;
	});

	// ---- List membership -------------------------------------------------------
	const listSlugs = $derived(new Set($userProfile.schoolList.map((s) => s.slug)));

	function toggleList(row: Row) {
		userProfile.update((u) => {
			const exists = u.schoolList.some((s) => s.slug === row.slug);
			if (exists) {
				return { ...u, schoolList: u.schoolList.filter((s) => s.slug !== row.slug) };
			}
			const tracked: TrackedSchool = {
				slug: row.slug,
				name: row.name,
				status: 'researching',
				supplements: []
			};
			return { ...u, schoolList: [...u.schoolList, tracked] };
		});
	}

	// ---- Summary of user's list by likelihood ----------------------------------
	const summary = $derived.by(() => {
		const counts = { Safety: 0, Target: 0, Reach: 0, 'Hard reach': 0 };
		for (const tracked of $userProfile.schoolList) {
			if (!schoolStats[tracked.slug]) continue;
			counts[chanceForSlug(tracked.slug).label]++;
		}
		return counts;
	});

	// ---- PredictAI fit identifiers --------------------------------------------
	// What the model thinks is a strong fit vs a stretch — surfaced as a quick-read
	// panel so the page leads with guidance, not just a table.
	const bestFits = $derived.by(() => {
		if (!hasStats) return [];
		return baseRows
			.map((r) => ({ ...r, ...chanceForSlug(r.slug) }))
			.filter((r) => r.outcome === 'admit')
			.sort((a, b) => b.fit - a.fit || b.odds - a.odds)
			.slice(0, 5);
	});
	const topReaches = $derived.by(() => {
		if (!hasStats) return [];
		return baseRows
			.map((r) => ({ ...r, ...chanceForSlug(r.slug) }))
			.filter((r) => r.outcome === 'waitlist')
			.sort((a, b) => b.odds - a.odds)
			.slice(0, 4);
	});

	// ---- Styling helpers -------------------------------------------------------
	const likelihoodChip: Record<Likelihood, string> = {
		Safety: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
		Target: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
		Reach: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
		'Hard reach': 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
	};

	// Solid fills for the per-card chance bar + the list-balance bar.
	const likelihoodBar: Record<Likelihood, string> = {
		Safety: 'bg-emerald-500',
		Target: 'bg-blue-500',
		Reach: 'bg-amber-500',
		'Hard reach': 'bg-rose-500'
	};

	// Total schools on the list that resolve to a known likelihood (for the balance bar).
	const listTotal = $derived(
		summary.Safety + summary.Target + summary.Reach + summary['Hard reach']
	);

	function initials(name: string): string {
		const words = name.replace(/[^a-zA-Z ]/g, '').trim().split(/\s+/);
		if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
		return (words[0][0] + words[words.length - 1][0]).toUpperCase();
	}

	const money = (n: number) => `$${n.toLocaleString('en-US')}`;
	const pct = (n: number) => `${Math.round(n * 100)}%`;
</script>

<div class="flex-1 min-h-0 overflow-y-auto bg-slate-50">
	<div class="max-w-6xl mx-auto px-6 md:px-10 py-8">
		<!-- Header -->
		<header class="mb-6">
			<h1 class="text-2xl font-bold tracking-tight text-slate-900">Universities</h1>
			<p class="mt-1 text-sm text-slate-500">
				Explore schools with real admissions data and your personalized chances.
			</p>
			<p class="mt-1 text-xs text-slate-400">
				Chances use factor weights from NACAC's Factors in the Admission Decision survey,
				calibrated on 2026-cycle HYPSM &amp; T20 admits.
				<a href="/methodology" class="font-medium text-[#0c0c09] hover:underline" target="_blank"
					>How it works →</a
				>
			</p>
			{#if !hasStats}
				<div
					class="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-[#0c0c09] ring-1 ring-blue-100"
				>
					<svg
						viewBox="0 0 24 24"
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="M12 16v-4M12 8h.01" />
					</svg>
					Add your stats for personalized chances
				</div>
			{/if}
		</header>

		<!-- PredictAI fit panel — leads with guidance: where you clear the bar vs the
		     reaches worth a shot, straight from the same model as your predictions. -->
		{#if hasStats && (bestFits.length || topReaches.length)}
			<div class="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
				<div class="flex items-center gap-2">
					<span class="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0c0c09] text-white">
						<svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.66 17h4.68M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2V16h6v-.5c0-.8.3-1.3 1-2A6 6 0 0 0 12 3z" /></svg>
					</span>
					<h2 class="text-sm font-bold text-slate-900">What PredictAI thinks fits you</h2>
				</div>

				{#if bestFits.length}
					<div class="mt-4">
						<div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-600">
							<span class="h-2 w-2 rounded-full bg-emerald-500"></span>Strong fits — you clear the bar
						</div>
						<div class="mt-2 flex flex-wrap gap-2">
							{#each bestFits as r}
								<span class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 py-1 pl-1 pr-3 text-sm font-medium text-emerald-800">
									<span class="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold" style="background-color:{r.color};color:{readableTextColor(r.color)}">{initials(r.name)}</span>
									{r.name}
									<span class="tabular-nums font-semibold text-emerald-600">{r.chance}%</span>
								</span>
							{/each}
						</div>
					</div>
				{/if}

				{#if topReaches.length}
					<div class="mt-4">
						<div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-600">
							<span class="h-2 w-2 rounded-full bg-amber-500"></span>Reaches worth a shot
						</div>
						<div class="mt-2 flex flex-wrap gap-2">
							{#each topReaches as r}
								<span class="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 py-1 pl-1 pr-3 text-sm font-medium text-amber-800">
									<span class="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold" style="background-color:{r.color};color:{readableTextColor(r.color)}">{initials(r.name)}</span>
									{r.name}
									<span class="tabular-nums font-semibold text-amber-600">{r.chance}%</span>
								</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Summary bar -->
		<div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
			<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
				<div class="text-xs font-semibold uppercase tracking-wide text-slate-400">On your list</div>
				<div class="mt-1 text-2xl font-bold text-slate-900">{$userProfile.schoolList.length}</div>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
				<div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Safety</div>
				<div class="mt-1 text-2xl font-bold text-emerald-600">{summary.Safety}</div>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
				<div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Target</div>
				<div class="mt-1 text-2xl font-bold text-blue-600">{summary.Target}</div>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
				<div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Reach</div>
				<div class="mt-1 text-2xl font-bold text-amber-600">
					{summary.Reach + summary['Hard reach']}
				</div>
			</div>
		</div>

		<!-- List balance — a balanced list has a few of each -->
		{#if listTotal > 0}
			<div class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
				<div class="flex items-center justify-between">
					<span class="text-xs font-semibold uppercase tracking-wide text-slate-400">List balance</span>
					<span class="text-xs font-medium text-slate-500">
						{$userProfile.schoolList.length}
						{$userProfile.schoolList.length === 1 ? 'school' : 'schools'}
					</span>
				</div>
				<div class="mt-2.5 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
					{#if summary.Safety}
						<div class="bg-emerald-500" style="width: {(summary.Safety / listTotal) * 100}%"></div>
					{/if}
					{#if summary.Target}
						<div class="bg-blue-500" style="width: {(summary.Target / listTotal) * 100}%"></div>
					{/if}
					{#if summary.Reach}
						<div class="bg-amber-500" style="width: {(summary.Reach / listTotal) * 100}%"></div>
					{/if}
					{#if summary['Hard reach']}
						<div class="bg-rose-500" style="width: {(summary['Hard reach'] / listTotal) * 100}%"></div>
					{/if}
				</div>
				<div class="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
					<span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-emerald-500"></span>Safety {summary.Safety}</span>
					<span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-blue-500"></span>Target {summary.Target}</span>
					<span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-amber-500"></span>Reach {summary.Reach}</span>
					{#if summary['Hard reach']}
						<span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-rose-500"></span>Hard reach {summary['Hard reach']}</span>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Toolbar -->
		<div
			class="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center"
		>
			<div class="relative flex-1">
				<svg
					viewBox="0 0 24 24"
					class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.3-4.3" />
				</svg>
				<input
					type="text"
					bind:value={search}
					placeholder="Search by school or location…"
					class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0c0c09] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
				/>
			</div>

			<div class="flex flex-wrap gap-2">
				<label class="flex items-center gap-1.5 text-xs font-medium text-slate-500">
					<span class="hidden sm:inline">Size</span>
					<select
						bind:value={sizeFilter}
						class="rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:border-[#0c0c09] focus:outline-none focus:ring-2 focus:ring-blue-100"
					>
						<option value="All">All sizes</option>
						<option value="Small">Small</option>
						<option value="Medium">Medium</option>
						<option value="Large">Large</option>
					</select>
				</label>

				<label class="flex items-center gap-1.5 text-xs font-medium text-slate-500">
					<span class="hidden sm:inline">Setting</span>
					<select
						bind:value={settingFilter}
						class="rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:border-[#0c0c09] focus:outline-none focus:ring-2 focus:ring-blue-100"
					>
						<option value="All">All settings</option>
						<option value="Urban">Urban</option>
						<option value="Suburban">Suburban</option>
						<option value="College town">College town</option>
						<option value="Rural">Rural</option>
					</select>
				</label>

				<label class="flex items-center gap-1.5 text-xs font-medium text-slate-500">
					<span class="hidden sm:inline">Sort by</span>
					<select
						bind:value={sortBy}
						class="rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:border-[#0c0c09] focus:outline-none focus:ring-2 focus:ring-blue-100"
					>
						<option value="Rank">Rank</option>
						<option value="Acceptance rate">Acceptance rate</option>
						<option value="Your chances">Your chances</option>
						<option value="Tuition">Tuition</option>
					</select>
				</label>
			</div>
		</div>

		<!-- Results count -->
		<div class="mb-3 px-1 text-xs font-medium text-slate-400">
			{rows.length}
			{rows.length === 1 ? 'school' : 'schools'}
		</div>

		<!-- List -->
		{#if rows.length === 0}
			<div
				class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"
			>
				<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
					<svg
						viewBox="0 0 24 24"
						class="h-6 w-6 text-slate-400"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
					</svg>
				</div>
				<p class="mt-3 text-sm font-semibold text-slate-700">No schools match your filters</p>
				<p class="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
				{#each rows as row (row.slug)}
					{@const onList = listSlugs.has(row.slug)}
					<div
						class="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
					>
						<!-- Top: identity + rank -->
						<div class="flex items-start gap-3">
							<div
								class="flex h-11 w-11 flex-none items-center justify-center rounded-xl text-sm font-bold"
								style="background-color: {row.color}; color: {readableTextColor(row.color)}"
							>
								{initials(row.name)}
							</div>
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<h3 class="truncate text-sm font-semibold text-slate-900">{row.name}</h3>
									<span
										class="flex-none rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-500"
										>#{row.stat.rank}</span
									>
								</div>
								<p class="mt-0.5 truncate text-xs text-slate-500">
									{row.stat.location} · {row.stat.size} · {row.stat.setting}
								</p>
							</div>
							<span
								class="flex-none rounded-full px-2.5 py-1 text-xs font-semibold {likelihoodChip[
									row.likelihood
								]}"
							>
								{row.likelihood}
							</span>
						</div>

						<!-- Stats grid -->
						<div class="grid grid-cols-4 gap-2 rounded-xl bg-slate-50 p-3">
							<div>
								<div class="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
									Accept
								</div>
								<div class="mt-0.5 text-sm font-semibold text-slate-800">
									{pct(row.stat.acceptanceRate)}
								</div>
							</div>
							<div>
								<div class="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
									SAT
								</div>
								<div class="mt-0.5 text-sm font-semibold text-slate-800">{row.stat.satAvg}</div>
							</div>
							<div>
								<div class="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
									GPA
								</div>
								<div class="mt-0.5 text-sm font-semibold text-slate-800">
									{row.stat.gpaWeighted.toFixed(2)}
								</div>
							</div>
							<div>
								<div class="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
									Tuition
								</div>
								<div class="mt-0.5 text-sm font-semibold text-slate-800">
									{money(row.stat.tuition)}
								</div>
							</div>
						</div>

						<!-- Chance meter -->
						<div>
							<div class="flex items-center justify-between text-xs">
								<span class="font-medium text-slate-500">Your chance</span>
								<span class="font-bold tabular-nums text-slate-900">{row.chance}%</span>
							</div>
							<div
								class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100"
								role="progressbar"
								aria-valuenow={row.chance}
								aria-valuemin="0"
								aria-valuemax="100"
							>
								<div
									class="h-full rounded-full transition-all {likelihoodBar[row.likelihood]}"
									style="width: {row.chance}%"
								></div>
							</div>
						</div>

						<!-- Action -->
						<button
							type="button"
							onclick={() => toggleList(row)}
							class="inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition
								{onList
								? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100'
								: 'bg-[#0c0c09] text-white hover:bg-[#2b2b22]'}"
						>
							{#if onList}
								<svg
									viewBox="0 0 24 24"
									class="h-4 w-4"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M20 6 9 17l-5-5" />
								</svg>
								On your list
							{:else}
								<svg
									viewBox="0 0 24 24"
									class="h-4 w-4"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M12 5v14M5 12h14" />
								</svg>
								Add to list
							{/if}
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
