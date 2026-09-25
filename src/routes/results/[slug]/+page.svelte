<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { userProfile } from '$lib/stores/user';
	import {
		aiResults,
		academicExplanationsBySlug,
		extracurricularExplanationsBySlug,
		fitExplanationsBySlug,
		intellectualExplanationsBySlug,
		characterExplanationsBySlug,
		improvementTipsBySlug,
		academicScoresBySlug,
		extracurricularScoresBySlug,
		intellectualScoresBySlug,
		characterScoresBySlug,
		fitScoresBySlug
	} from '$lib/stores/results';

	const slug = $derived($page.params.slug ?? '');
	// Full Access or a School Pass for this school unlocks the full analysis.
	const unlocked = $derived(
		$userProfile.isPro || ($userProfile.proSchools ?? []).includes(slug)
	);
	const schoolData = $derived($aiResults.decisions.find((d) => d.slug === slug));
	$effect(() => {
		if (schoolData && schoolData.academic_explanation === 'N/A: random sim') {
			goto('/pro');
		}
	});
	// Updated outcome colors for higher contrast on light backgrounds
	const outcomeColors = {
		admit: 'text-blue border-blue',
		deny: 'text-stamp-red border-stamp-red',
		waitlist: 'text-navy border-yellow',
		defer: 'text-blue border-blue'
	};
	const getPeekText = (text: string) => {
		if (!text) return '';
		return text.split(' ').slice(0, 3).join(' ') + ' ';
	};
	const getRemainingText = (text: string) => {
		if (!text) return '';
		return text.split(' ').slice(3).join(' ');
	};
	const getRadarPoints = () => {
		const scores = [
			$academicScoresBySlug[slug] || 0,
			$extracurricularScoresBySlug[slug] || 0,
			$intellectualScoresBySlug[slug] || 0,
			$characterScoresBySlug[slug] || 0,
			$fitScoresBySlug[slug] || 0
		];

		const centerX = 150;
		const centerY = 150;
		const radius = 100;

		return scores
			.map((score, i) => {
				const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
				const val = (score / 10) * radius;
				return `${centerX + val * Math.cos(angle)},${centerY + val * Math.sin(angle)}`;
			})
			.join(' ');
	};
</script>

{#if schoolData && schoolData.academic_explanation !== 'N/A: random sim'}
	<div class="min-h-screen pa-grid text-navy p-4 md:p-8 font-sans">
		<header class="mb-8">
			<h1 class="text-3xl font-display text-navy mb-2">Where you stand with this school</h1>
			<p class="text-muted text-sm italic">
				A blunt read of your saved profile and essays. It's an estimate, not a real decision.
			</p>
		</header>

		{#if !schoolData}
			<div class="text-center py-20 pa-card">
				<p>Nothing here yet for this school. Run a simulation first.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
				<div class="lg:col-span-4 space-y-6">
					<div class="pa-card p-6">
						<div class="mb-6">
							<label
								class="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2"
								>Target University</label
							>
							<div class="text-xl font-display text-navy border-b-2 border-navy pb-2">
								{schoolData.school}
							</div>
						</div>

						<div class="mb-6">
							<div class="flex justify-between items-end mb-2">
								<label class="text-[10px] font-bold uppercase tracking-widest text-muted"
									>Profile Data</label
								>
								<button class="text-[10px] text-blue font-bold hover:underline">Manage</button>
							</div>
							<div class="space-y-1">
								<div class="flex justify-between text-xs">
									<span>Common App</span>
									<span class="text-blue font-mono font-bold">Loaded</span>
								</div>
								<div class="flex justify-between text-xs">
									<span>Transcript</span>
									<span class="text-blue font-mono font-bold">Loaded</span>
								</div>
							</div>
						</div>

						<div class="space-y-4">
							<label class="block text-[10px] font-bold uppercase tracking-widest text-muted"
								>Intended Major</label
							>
							<p class="text-sm text-navy pa-inset p-3">
								{$aiResults.raw?.major || 'Undecided'}
							</p>
						</div>
					</div>
				</div>

				<div
					class="lg:col-span-8 pa-card overflow-hidden"
				>
					<div class="p-8 border-b-2 border-navy flex justify-between items-center">
						<div class="space-y-2">
							<h2 class="text-[11px] font-display uppercase tracking-[0.3em] text-muted">
								Decision Outcome
							</h2>
							<p class="max-w-xl text-xs leading-relaxed text-muted">
								Remember: this is just an AI prediction. It could be completely wrong, so
								don't think about it too deeply or treat it like a real admissions decision.
							</p>
						</div>
						<div class="flex items-center gap-4">
							<div
								class="text-4xl font-display uppercase italic tracking-tighter {outcomeColors[
									schoolData.outcome
								]}"
							>
								{schoolData.outcome}
							</div>
						</div>
					</div>

					<div class="p-8 grid md:grid-cols-2 gap-12">
						<div class="flex flex-col items-center">
							<svg width="300" height="300" viewBox="0 0 300 300" class="filter drop-shadow-sm">
								{#each [0.2, 0.4, 0.6, 0.8, 1] as level}
									<polygon
										points={Array.from({ length: 5 })
											.map((_, i) => {
												const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
												return `${150 + level * 100 * Math.cos(angle)},${150 + level * 100 * Math.sin(angle)}`;
											})
											.join(' ')}
										fill="none"
										stroke="#e2e8f0"
										stroke-width="1"
									/>
								{/each}

								<text
									x="150"
									y="30"
									text-anchor="middle"
									class="fill-slate-400 text-[10px] font-bold">ACADEMIC</text
								>
								<text
									x="270"
									y="130"
									text-anchor="start"
									class="fill-slate-400 text-[10px] font-bold">EXTRACURRICULAR</text
								>
								<text
									x="220"
									y="270"
									text-anchor="middle"
									class="fill-slate-400 text-[10px] font-bold">INTELLECTUAL</text
								>
								<text
									x="80"
									y="270"
									text-anchor="middle"
									class="fill-slate-400 text-[10px] font-bold">CHARACTER</text
								>
								<text x="30" y="130" text-anchor="end" class="fill-slate-400 text-[10px] font-bold"
									>FIT</text
								>

								<polygon
									points={getRadarPoints()}
									fill="rgba(18, 102, 227, 0.15)"
									stroke="#1266e3"
									stroke-width="2"
								/>
							</svg>
						</div>

						<div class="space-y-6">
							<h3
								class="text-stamp-red text-xs font-display uppercase tracking-widest border-l-2 border-stamp-red pl-3"
							>
								Harsh Critique
							</h3>

							<div class="space-y-4 text-[13px] leading-relaxed italic text-muted">
								{#each [{ label: 'Academic', val: $academicExplanationsBySlug[slug] }, { label: 'Extracurricular', val: $extracurricularExplanationsBySlug[slug] }, { label: 'Intellectual', val: $intellectualExplanationsBySlug[slug] }, { label: 'Character', val: $characterExplanationsBySlug[slug] }, { label: 'Fit', val: $fitExplanationsBySlug[slug] }] as item}
									<p>
										<strong class="text-navy not-italic">{item.label}:</strong>
										<span>{getPeekText(item.val)}</span>
										<span class:blur-sm={!unlocked} class:select-none={!unlocked}>
											{getRemainingText(item.val)}
										</span>
									</p>
								{/each}
							</div>

							<div class="pt-6 pa-rule-top">
								<h3 class="text-blue text-xs font-display uppercase tracking-widest mb-4">
									Key Improvements
								</h3>
								<div
									class="text-xs text-navy space-y-2 whitespace-pre-line"
									class:blur-sm={!unlocked}
									class:select-none={!unlocked}
								>
									{$improvementTipsBySlug[slug]}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}
