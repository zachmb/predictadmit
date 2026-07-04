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
	const schoolData = $derived($aiResults.decisions.find((d) => d.slug === slug));
	$effect(() => {
		if (schoolData && schoolData.academic_explanation === 'N/A: random sim') {
			goto('/pro');
		}
	});
	// Updated outcome colors for higher contrast on light backgrounds
	const outcomeColors = {
		admit: 'text-emerald-600 border-emerald-600',
		deny: 'text-rose-600 border-rose-600',
		waitlist: 'text-amber-600 border-amber-600',
		defer: 'text-blue-600 border-blue-600'
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
	<div class="min-h-screen bg-slate-50 text-slate-700 p-4 md:p-8 font-sans">
		<header class="mb-8">
			<h1 class="text-3xl font-bold text-slate-900 mb-2">School Match & Ethos Check</h1>
			<p class="text-slate-500 text-sm italic">
				Harsh grading based on your stored profile and supplemental essays.
			</p>
		</header>

		{#if !schoolData}
			<div class="text-center py-20 border border-dashed border-slate-300 rounded-xl">
				<p>No data found for this school. Please run an evaluation first.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
				<div class="lg:col-span-4 space-y-6">
					<div class="bg-white p-6 rounded-xl border border-slate-200 shadow-xl">
						<div class="mb-6">
							<label
								class="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2"
								>Target University</label
							>
							<div class="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
								{schoolData.school}
							</div>
						</div>

						<div class="mb-6">
							<div class="flex justify-between items-end mb-2">
								<label class="text-[10px] font-bold uppercase tracking-widest text-slate-400"
									>Profile Data</label
								>
								<button class="text-[10px] text-cyan-600 font-bold hover:underline">Manage</button>
							</div>
							<div class="space-y-1">
								<div class="flex justify-between text-xs">
									<span>Common App</span>
									<span class="text-emerald-600 font-mono font-bold">Loaded</span>
								</div>
								<div class="flex justify-between text-xs">
									<span>Transcript</span>
									<span class="text-emerald-600 font-mono font-bold">Loaded</span>
								</div>
							</div>
						</div>

						<div class="space-y-4">
							<label class="block text-[10px] font-bold uppercase tracking-widest text-slate-400"
								>Intended Major</label
							>
							<p class="text-sm text-slate-800 bg-slate-50 p-3 rounded border border-slate-200">
								{$aiResults.raw?.major || 'Undecided'}
							</p>
						</div>
					</div>
				</div>

				<div
					class="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
				>
					<div class="p-8 border-b border-slate-100 flex justify-between items-center">
						<div class="space-y-2">
							<h2 class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
								Decision Outcome
							</h2>
							<p class="max-w-xl text-xs leading-relaxed text-slate-500">
								Remember: this is just an AI prediction. It could be completely wrong, so
								don't think about it too deeply or treat it like a real admissions decision.
							</p>
						</div>
						<div class="flex items-center gap-4">
							<div
								class="text-4xl font-black uppercase italic tracking-tighter {outcomeColors[
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
									fill="rgba(37, 99, 235, 0.15)"
									stroke="#2563eb"
									stroke-width="2"
								/>
							</svg>
						</div>

						<div class="space-y-6">
							<h3
								class="text-rose-600 text-xs font-black uppercase tracking-widest border-l-2 border-rose-600 pl-3"
							>
								Harsh Critique
							</h3>

							<div class="space-y-4 text-[13px] leading-relaxed italic text-slate-600">
								{#each [{ label: 'Academic', val: $academicExplanationsBySlug[slug] }, { label: 'Extracurricular', val: $extracurricularExplanationsBySlug[slug] }, { label: 'Intellectual', val: $intellectualExplanationsBySlug[slug] }, { label: 'Character', val: $characterExplanationsBySlug[slug] }, { label: 'Fit', val: $fitExplanationsBySlug[slug] }] as item}
									<p>
										<strong class="text-slate-900 not-italic">{item.label}:</strong>
										<span>{getPeekText(item.val)}</span>
										<span
											class:blur-sm={!$userProfile.isPro}
											class:select-none={!$userProfile.isPro}
										>
											{getRemainingText(item.val)}
										</span>
									</p>
								{/each}
							</div>

							<div class="pt-6 border-t border-slate-100">
								<h3 class="text-emerald-600 text-xs font-black uppercase tracking-widest mb-4">
									Key Improvements
								</h3>
								<div
									class="text-xs text-slate-700 space-y-2 whitespace-pre-line"
									class:blur-sm={!$userProfile.isPro}
									class:select-none={!$userProfile.isPro}
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
