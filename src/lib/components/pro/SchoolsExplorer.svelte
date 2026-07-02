<script lang="ts">
	import { userProfile, type TrackedSchool } from '$lib/stores/user';
	import { schoolConfigs } from '$lib/config/schools';
	import {
		schoolStats,
		computeAcademicIndex,
		classifyLikelihood,
		type SchoolStat,
		type SchoolSize,
		type CampusSetting,
		type Likelihood
	} from '$lib/config/schoolStats';

	const ACADEMICS_KEY = 'predictadmit:pro:academics';

	// ---- Academic index (read once from localStorage) --------------------------
	let academicIndex = $state(60);
	let hasStats = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		try {
			const raw = window.localStorage.getItem(ACADEMICS_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw) as {
				sat?: number;
				act?: number;
				weightedGpa?: number;
			};
			const sat = Number(parsed.sat) || undefined;
			const act = Number(parsed.act) || undefined;
			const weightedGpa = Number(parsed.weightedGpa) || undefined;
			if (sat || act || weightedGpa) {
				academicIndex = computeAcademicIndex(sat, act, weightedGpa);
				hasStats = true;
			}
		} catch {
			// ignore malformed storage
		}
	});

	// ---- Chance computation ----------------------------------------------------
	// Base is the school's acceptance rate, scaled by how far the student's
	// academic index sits from the school's selectivity. Clamped 1–99.
	function computeChance(stat: SchoolStat, ai: number): number {
		const base = stat.acceptanceRate * 100;
		const selectivity = Math.min(1, Math.max(0, 1 - stat.acceptanceRate * 1.8)); // 0..1
		const margin = ai / 100 - selectivity; // -1..1, strength vs. selectivity
		// Strong students at selective schools can multiply base several-fold;
		// weak students see it shrink toward the floor.
		const multiplier = 1 + margin * 2.5;
		const chance = base * Math.max(0.15, multiplier);
		return Math.min(99, Math.max(1, Math.round(chance)));
	}

	// ---- Base rows -------------------------------------------------------------
	type Row = {
		slug: string;
		name: string;
		color: string;
		stat: SchoolStat;
		chance: number;
		likelihood: Likelihood;
	};

	const baseRows: Row[] = Object.values(schoolStats)
		.map((stat) => {
			const cfg = schoolConfigs[stat.slug];
			return {
				slug: stat.slug,
				name: cfg?.schoolName ?? stat.name ?? stat.slug,
				color: cfg?.primaryColor ?? stat.color ?? '#0052CC',
				stat,
				chance: 0,
				likelihood: 'Target' as Likelihood
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
		let list = baseRows.map((r) => ({
			...r,
			chance: computeChance(r.stat, academicIndex),
			likelihood: classifyLikelihood(r.stat, academicIndex)
		}));

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
			const stat = schoolStats[tracked.slug];
			if (!stat) continue;
			counts[classifyLikelihood(stat, academicIndex)]++;
		}
		return counts;
	});

	// ---- Styling helpers -------------------------------------------------------
	const likelihoodChip: Record<Likelihood, string> = {
		Safety: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
		Target: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
		Reach: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
		'Hard reach': 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
	};

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
			{#if !hasStats}
				<div
					class="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-[#0052CC] ring-1 ring-blue-100"
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
					class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0052CC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
				/>
			</div>

			<div class="flex flex-wrap gap-2">
				<label class="flex items-center gap-1.5 text-xs font-medium text-slate-500">
					<span class="hidden sm:inline">Size</span>
					<select
						bind:value={sizeFilter}
						class="rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:border-[#0052CC] focus:outline-none focus:ring-2 focus:ring-blue-100"
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
						class="rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:border-[#0052CC] focus:outline-none focus:ring-2 focus:ring-blue-100"
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
						class="rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:border-[#0052CC] focus:outline-none focus:ring-2 focus:ring-blue-100"
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
								class="flex h-11 w-11 flex-none items-center justify-center rounded-xl text-sm font-bold text-white"
								style="background-color: {row.color}"
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

						<!-- Bottom: chance + action -->
						<div class="flex items-center justify-between gap-3">
							<div class="flex items-center gap-2">
								<span class="text-2xl font-bold tabular-nums text-[#0052CC]">{row.chance}%</span>
								<span class="text-xs font-medium leading-tight text-slate-500"
									>your<br />chance</span
								>
							</div>
							<button
								type="button"
								onclick={() => toggleList(row)}
								class="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition
									{onList
									? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100'
									: 'bg-[#0052CC] text-white hover:bg-[#0047b3]'}"
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
									On list
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
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
