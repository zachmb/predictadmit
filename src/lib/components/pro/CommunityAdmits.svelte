<script lang="ts">
	import { communityProfiles, type CommunityProfile, type AdmitResult } from '$lib/config/communityProfiles';

	const CONTRIB_KEY = 'predictadmit:pro:contributions';

	// ---- Load & normalize locally-contributed profiles -------------------------
	let contributed = $state<CommunityProfile[]>([]);

	function toNum(v: unknown): number | undefined {
		const n = Number(v);
		return Number.isFinite(n) && n > 0 ? n : undefined;
	}

	function toStrArray(v: unknown): string[] {
		if (!Array.isArray(v)) return [];
		return v.map((x) => String(x ?? '').trim()).filter(Boolean);
	}

	function normalizeResults(v: unknown): AdmitResult[] {
		if (!Array.isArray(v)) return [];
		const out: AdmitResult[] = [];
		for (const raw of v) {
			if (!raw || typeof raw !== 'object') continue;
			const r = raw as Record<string, unknown>;
			const school = String(r.school ?? '').trim();
			if (!school) continue;
			let outcome: AdmitResult['outcome'] = 'admit';
			const o = String(r.outcome ?? '').toLowerCase();
			if (o === 'deny' || o === 'denied' || o === 'reject' || o === 'rejected') outcome = 'deny';
			else if (o === 'waitlist' || o === 'waitlisted' || o === 'wl') outcome = 'waitlist';
			out.push({
				school,
				slug: r.slug ? String(r.slug) : undefined,
				outcome
			});
		}
		return out;
	}

	function normalizeProfile(raw: unknown, idx: number): CommunityProfile | null {
		if (!raw || typeof raw !== 'object') return null;
		const p = raw as Record<string, unknown>;
		const handle = String(p.handle ?? '').trim() || 'Anonymous';
		const results = normalizeResults(p.results);
		return {
			id: String(p.id ?? `contrib-${idx}`),
			handle,
			gradYear: toNum(p.gradYear) ?? new Date().getFullYear(),
			major: String(p.major ?? '').trim() || 'Undecided',
			state: String(p.state ?? '').trim() || '—',
			gpaWeighted: toNum(p.gpaWeighted) ?? 0,
			gpaUnweighted: toNum(p.gpaUnweighted) ?? 0,
			sat: toNum(p.sat),
			act: toNum(p.act),
			hook: String(p.hook ?? '').trim(),
			activities: toStrArray(p.activities),
			awards: toStrArray(p.awards),
			results,
			seed: false
		};
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		try {
			const rawStr = window.localStorage.getItem(CONTRIB_KEY);
			if (!rawStr) return;
			const parsed = JSON.parse(rawStr);
			const arr = Array.isArray(parsed) ? parsed : [parsed];
			const normalized = arr
				.map((r, i) => normalizeProfile(r, i))
				.filter((p): p is CommunityProfile => p !== null);
			contributed = normalized;
		} catch {
			// ignore malformed storage
		}
	});

	// ---- Full corpus (contributions first so a user's own appears up top) ------
	const allProfiles = $derived<CommunityProfile[]>([...contributed, ...communityProfiles]);

	// ---- Filter option lists ---------------------------------------------------
	const schoolOptions = $derived(
		Array.from(
			new Set(allProfiles.flatMap((p) => p.results.map((r) => r.school)))
		).sort((a, b) => a.localeCompare(b))
	);

	const majorOptions = $derived(
		Array.from(new Set(allProfiles.map((p) => p.major))).sort((a, b) => a.localeCompare(b))
	);

	// ---- Filter state ----------------------------------------------------------
	let search = $state('');
	let schoolFilter = $state('');
	let majorFilter = $state('');

	const filtered = $derived(
		allProfiles.filter((p) => {
			const q = search.trim().toLowerCase();
			if (q) {
				const hay = `${p.handle} ${p.major} ${p.hook}`.toLowerCase();
				if (!hay.includes(q)) return false;
			}
			if (schoolFilter && !p.results.some((r) => r.school === schoolFilter)) return false;
			if (majorFilter && p.major !== majorFilter) return false;
			return true;
		})
	);

	// ---- Stat row --------------------------------------------------------------
	const totalResults = $derived(allProfiles.reduce((n, p) => n + p.results.length, 0));

	// ---- Expanded card / modal -------------------------------------------------
	let openId = $state<string | null>(null);
	const openProfile = $derived(allProfiles.find((p) => p.id === openId) ?? null);

	function outcomeDot(outcome: AdmitResult['outcome']): string {
		if (outcome === 'admit') return 'bg-emerald-500';
		if (outcome === 'waitlist') return 'bg-amber-500';
		return 'bg-rose-500';
	}

	function outcomeLabel(outcome: AdmitResult['outcome']): string {
		if (outcome === 'admit') return 'Admitted';
		if (outcome === 'waitlist') return 'Waitlisted';
		return 'Denied';
	}

	function scores(p: CommunityProfile): string {
		const parts: string[] = [];
		if (p.sat) parts.push(`SAT ${p.sat}`);
		if (p.act) parts.push(`ACT ${p.act}`);
		return parts.length ? parts.join(' · ') : 'Test optional';
	}

	function admitCount(p: CommunityProfile): number {
		return p.results.filter((r) => r.outcome === 'admit').length;
	}

	function clearFilters() {
		search = '';
		schoolFilter = '';
		majorFilter = '';
	}
</script>

<div class="flex-1 min-h-0 overflow-y-auto bg-slate-50">
	<div class="max-w-6xl mx-auto px-6 md:px-10 py-8">
		<!-- Contribution banner -->
		<div
			class="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#0052CC]/20 bg-[#0052CC]/5 px-5 py-3"
		>
			<div class="flex items-center gap-3">
				<span
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0052CC] text-white"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 5v14M5 12h14" />
					</svg>
				</span>
				<p class="text-sm text-slate-700">
					<span class="font-semibold text-slate-900">Paid it forward yet?</span>
					Add your profile to help the next class.
				</p>
			</div>
			<span class="hidden shrink-0 text-sm font-semibold text-[#0052CC] sm:inline">Add your profile →</span>
		</div>

		<!-- Header -->
		<header class="mb-6">
			<h1 class="text-2xl font-bold tracking-tight text-slate-900">Human Counselors</h1>
			<p class="mt-1 text-slate-500">
				Learn from real admitted students and mentors who've been exactly where you are.
			</p>
			<div class="mt-3 flex items-center gap-2 text-sm font-medium text-slate-500">
				<span class="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
					<span class="font-semibold text-slate-900">{allProfiles.length}</span> profiles
				</span>
				<span class="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
					<span class="font-semibold text-slate-900">{totalResults}</span> results
				</span>
			</div>
		</header>

		<!-- Filter toolbar -->
		<div class="mb-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
			<div class="flex flex-col gap-3 md:flex-row md:items-center">
				<label class="relative flex-1">
					<span class="sr-only">Search profiles</span>
					<svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="11" cy="11" r="7" />
						<path d="m21 21-4.3-4.3" />
					</svg>
					<input
						type="text"
						bind:value={search}
						placeholder="Search by handle or major…"
						class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0052CC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20"
					/>
				</label>

				<select
					bind:value={schoolFilter}
					class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:border-[#0052CC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 md:w-56"
				>
					<option value="">All schools</option>
					{#each schoolOptions as school}
						<option value={school}>{school}</option>
					{/each}
				</select>

				<select
					bind:value={majorFilter}
					class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:border-[#0052CC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 md:w-56"
				>
					<option value="">All majors</option>
					{#each majorOptions as major}
						<option value={major}>{major}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Results grid -->
		{#if filtered.length === 0}
			<div class="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
				<div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="11" cy="11" r="7" />
						<path d="m21 21-4.3-4.3" />
					</svg>
				</div>
				<p class="font-semibold text-slate-900">No matching profiles</p>
				<p class="mt-1 text-sm text-slate-500">Try a different school, major, or search term.</p>
				<button
					onclick={clearFilters}
					class="mt-4 rounded-xl bg-[#0052CC] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0047b3]"
				>
					Clear filters
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each filtered as p (p.id)}
					<button
						type="button"
						onclick={() => (openId = p.id)}
						class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0052CC]/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0052CC]/30"
					>
						<div class="flex items-start justify-between gap-2">
							<div class="min-w-0">
								<h3 class="truncate font-semibold text-slate-900 group-hover:text-[#0052CC]">{p.handle}</h3>
								<p class="mt-0.5 text-xs font-medium text-slate-500">
									Class of {p.gradYear} · {p.state}
								</p>
							</div>
							{#if !p.seed}
								<span class="shrink-0 rounded-full bg-[#0052CC]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0052CC]">You</span>
							{:else if admitCount(p) > 0}
								<span class="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">{admitCount(p)} admits</span>
							{/if}
						</div>

						<p class="mt-3 text-sm font-medium text-slate-700">{p.major}</p>

						<div class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
							{#if p.gpaWeighted}<span>{p.gpaWeighted.toFixed(2)}W GPA</span>{/if}
							<span>{scores(p)}</span>
						</div>

						{#if p.hook}
							<p class="mt-3 line-clamp-2 text-sm italic text-slate-600">“{p.hook}”</p>
						{/if}

						<div class="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
							{#each p.results as r}
								<span class="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
									<span class="h-1.5 w-1.5 rounded-full {outcomeDot(r.outcome)}"></span>
									{r.school}
								</span>
							{/each}
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Detail modal -->
{#if openProfile}
	<div
		class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
		role="button"
		tabindex="-1"
		onclick={() => (openId = null)}
		onkeydown={(e) => { if (e.key === 'Escape') openId = null; }}
	>
		<div
			class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-xl sm:rounded-2xl"
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => { if (e.key === 'Escape') openId = null; }}
		>
			<div class="sticky top-0 flex items-start justify-between gap-3 border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
				<div>
					<div class="flex items-center gap-2">
						<h2 class="text-lg font-bold text-slate-900">{openProfile.handle}</h2>
						{#if !openProfile.seed}
							<span class="rounded-full bg-[#0052CC]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0052CC]">Your profile</span>
						{/if}
					</div>
					<p class="mt-0.5 text-sm text-slate-500">
						Class of {openProfile.gradYear} · {openProfile.state} · {openProfile.major}
					</p>
				</div>
				<button
					onclick={() => (openId = null)}
					class="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
					aria-label="Close"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 6 6 18M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="space-y-6 px-6 py-5">
				<!-- Stats -->
				<div class="grid grid-cols-3 gap-3">
					<div class="rounded-xl bg-slate-50 p-3 text-center">
						<p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Weighted</p>
						<p class="mt-0.5 font-bold text-slate-900">{openProfile.gpaWeighted ? openProfile.gpaWeighted.toFixed(2) : '—'}</p>
					</div>
					<div class="rounded-xl bg-slate-50 p-3 text-center">
						<p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Unweighted</p>
						<p class="mt-0.5 font-bold text-slate-900">{openProfile.gpaUnweighted ? openProfile.gpaUnweighted.toFixed(2) : '—'}</p>
					</div>
					<div class="rounded-xl bg-slate-50 p-3 text-center">
						<p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Testing</p>
						<p class="mt-0.5 font-bold text-slate-900">{openProfile.sat ?? openProfile.act ?? '—'}</p>
					</div>
				</div>

				{#if openProfile.hook}
					<p class="rounded-xl border border-[#0052CC]/15 bg-[#0052CC]/5 px-4 py-3 text-sm italic text-slate-700">
						“{openProfile.hook}”
					</p>
				{/if}

				<!-- Activities -->
				{#if openProfile.activities.length}
					<section>
						<h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Activities</h3>
						<ul class="space-y-1.5">
							{#each openProfile.activities as a}
								<li class="flex gap-2 text-sm text-slate-700">
									<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0052CC]"></span>
									<span>{a}</span>
								</li>
							{/each}
						</ul>
					</section>
				{/if}

				<!-- Awards -->
				{#if openProfile.awards.length}
					<section>
						<h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Awards & honors</h3>
						<div class="flex flex-wrap gap-1.5">
							{#each openProfile.awards as aw}
								<span class="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">{aw}</span>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Results -->
				<section>
					<h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Decisions</h3>
					<ul class="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
						{#each openProfile.results as r}
							<li class="flex items-center justify-between gap-3 px-4 py-2.5">
								<span class="text-sm font-medium text-slate-800">{r.school}</span>
								<span class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
									<span class="h-2 w-2 rounded-full {outcomeDot(r.outcome)}"></span>
									{outcomeLabel(r.outcome)}
								</span>
							</li>
						{/each}
					</ul>
				</section>
			</div>
		</div>
	</div>
{/if}
