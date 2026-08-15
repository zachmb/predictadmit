<script lang="ts">
	// Extracurricular Helper — a dedicated tool that tiers a student's activities
	// (Standout / Strong / Solid / Filler), names their spike, and gives concrete
	// next moves. Reads activities from the shared profile; one-tap analyze.
	import { userProfile } from '$lib/stores/user';

	type Item = { name: string; tier: string; why: string; improve: string };
	type Analysis = { overall: string; spike: string; activities: Item[]; next_moves: string[] };

	let activities = $state($userProfile.applicationProfile?.activities ?? '');
	let major = $state(($userProfile.applicationProfile as any)?.major ?? '');
	let loading = $state(false);
	let error = $state('');
	let analysis = $state<Analysis | null>(null);

	const tierStyle: Record<string, string> = {
		Standout: 'bg-[#0052CC] text-white',
		Strong: 'bg-emerald-100 text-emerald-800',
		Solid: 'bg-slate-100 text-slate-700',
		Filler: 'bg-amber-100 text-amber-800'
	};
	const tierOrder: Record<string, number> = { Standout: 0, Strong: 1, Solid: 2, Filler: 3 };

	async function analyze() {
		if (loading) return;
		error = '';
		if (!activities.trim()) {
			error = 'Add your activities first.';
			return;
		}
		// Persist to the shared profile so it flows into the other tools too.
		userProfile.update((u) => ({
			...u,
			applicationProfile: { ...u.applicationProfile, activities }
		}));
		loading = true;
		analysis = null;
		try {
			const res = await fetch('/api/ai/extracurricular', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ activities, major })
			});
			const data = await res.json();
			if (!res.ok) {
				error = data?.error ?? 'That didn’t go through — try again.';
				return;
			}
			analysis = data.analysis as Analysis;
		} catch {
			error = 'Connection dropped. Try again.';
		} finally {
			loading = false;
		}
	}

	const sorted = $derived(
		analysis
			? [...analysis.activities].sort(
					(a, b) => (tierOrder[a.tier] ?? 9) - (tierOrder[b.tier] ?? 9)
				)
			: []
	);
</script>

<div class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
	<header class="mb-6">
		<h1 class="text-2xl font-black tracking-tight text-slate-900">Extracurricular Helper</h1>
		<p class="mt-1 text-sm text-slate-500">
			A blunt, AO-style read of your activities — tiered by real impact, with the one move that
			raises each. It grades what you list; it never invents anything.
		</p>
	</header>

	<div class="rounded-2xl border border-slate-200 bg-white p-5">
		<label for="ec-major" class="block text-xs font-bold uppercase tracking-wide text-slate-500">Intended major (optional)</label>
		<input
			id="ec-major"
			bind:value={major}
			placeholder="e.g. Computer Science"
			class="mt-1.5 w-full max-w-xs rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0052CC] focus:ring-4 focus:ring-blue-600/10"
		/>
		<label for="ec-acts" class="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-500">Your activities / résumé</label>
		<textarea
			id="ec-acts"
			bind:value={activities}
			placeholder="One per line — role, organization, and what you did (hours/weeks and any awards if you have them)."
			class="mt-1.5 h-44 w-full resize-y rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#0052CC] focus:ring-4 focus:ring-blue-600/10"
		></textarea>
		<button
			onclick={analyze}
			disabled={loading}
			class="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0052CC] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#0047b3] active:scale-[0.99] disabled:opacity-60"
		>
			{#if loading}
				<span class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
				Reading your activities…
			{:else}
				Analyze my activities
			{/if}
		</button>
		{#if error}
			<p class="mt-3 text-sm font-semibold text-rose-600">{error}</p>
		{/if}
	</div>

	{#if !analysis && !loading}
		<!-- Value preview so the tool sells itself before the first run. -->
		<div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
			<h2 class="text-xs font-bold uppercase tracking-wide text-slate-500">What you'll get</h2>
			<p class="mt-1.5 text-sm text-slate-600">Every activity sorted into the four tiers admissions officers actually use:</p>
			<div class="mt-3 grid gap-2 sm:grid-cols-2">
				{#each [['Standout', 'National impact — the rare, résumé-defining kind', 'bg-[#0052CC] text-white'], ['Strong', 'State/regional leadership or real, sustained results', 'bg-emerald-100 text-emerald-800'], ['Solid', 'School-level involvement — good, but expected', 'bg-slate-200 text-slate-700'], ['Filler', 'Brief or passive — little real impact', 'bg-amber-100 text-amber-800']] as [tier, desc, cls]}
					<div class="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3">
						<span class="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold {cls}">{tier}</span>
						<span class="text-xs leading-snug text-slate-600">{desc}</span>
					</div>
				{/each}
			</div>
			<p class="mt-3 text-xs text-slate-400">Plus your <span class="font-semibold text-slate-600">spike</span> (the theme tying it together) and one concrete move to raise each activity.</p>
		</div>
	{/if}

	{#if analysis}
		<div class="mt-6 space-y-5">
			<div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
				<h2 class="text-xs font-bold uppercase tracking-wide text-slate-500">The read</h2>
				<p class="mt-2 text-sm leading-relaxed text-slate-800">{analysis.overall}</p>
				<div class="mt-3 rounded-xl border border-[#0052CC]/20 bg-[#0052CC]/[0.05] px-4 py-3">
					<span class="text-xs font-bold uppercase tracking-wide text-[#0052CC]">Your spike</span>
					<p class="mt-1 text-sm text-slate-800">{analysis.spike}</p>
				</div>
			</div>

			<div class="space-y-3">
				{#each sorted as a}
					<div class="rounded-2xl border border-slate-200 bg-white p-4">
						<div class="flex items-start justify-between gap-3">
							<p class="text-sm font-bold text-slate-900">{a.name}</p>
							<span class="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold {tierStyle[a.tier] ?? 'bg-slate-100 text-slate-700'}">{a.tier}</span>
						</div>
						<p class="mt-1.5 text-sm leading-relaxed text-slate-600">{a.why}</p>
						<p class="mt-2 flex items-start gap-2 text-sm leading-relaxed text-slate-800">
							<svg class="mt-0.5 h-4 w-4 flex-none text-[#0052CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
							<span><span class="font-semibold">Raise it:</span> {a.improve}</span>
						</p>
					</div>
				{/each}
			</div>

			{#if analysis.next_moves?.length}
				<div class="rounded-2xl border border-slate-200 bg-white p-5">
					<h2 class="text-xs font-bold uppercase tracking-wide text-slate-500">Your next moves</h2>
					<ol class="mt-3 space-y-2">
						{#each analysis.next_moves as m, i}
							<li class="flex items-start gap-3 text-sm text-slate-800">
								<span class="grid h-5 w-5 flex-none place-items-center rounded-full bg-[#0052CC] text-[11px] font-bold text-white">{i + 1}</span>
								{m}
							</li>
						{/each}
					</ol>
				</div>
			{/if}
		</div>
	{/if}
</div>
