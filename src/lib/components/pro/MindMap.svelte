<script lang="ts">
	import type { SavedDecision } from '$lib/stores/user';
	import RadarChart from '$lib/components/common/RadarChart.svelte';

	export let savedDecisions: SavedDecision[] = [];

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function outcomeColor(outcome: string) {
		if (outcome === 'admit') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
		if (outcome === 'deny') return 'text-rose-600 bg-rose-50 border-rose-200';
		if (outcome === 'waitlist') return 'text-amber-600 bg-amber-50 border-amber-200';
		return 'text-sky-600 bg-sky-50 border-sky-200';
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold text-slate-900">Your Evaluation Mind Map</h2>
		<span class="text-xs font-bold uppercase tracking-widest text-slate-500">
			{savedDecisions.length} Saved Results
		</span>
	</div>

	{#if savedDecisions.length === 0}
		<div
			class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500"
		>
			<p>No decisions saved yet. Run a simulation and save your results to build your map.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each savedDecisions as decision}
				<div
					class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
				>
					<div class="flex justify-between items-start mb-4">
						<div>
							<h3 class="font-bold text-slate-900 text-lg">{decision.school}</h3>
							<p class="text-xs text-slate-400">{formatDate(decision.dateSaved)}</p>
						</div>
						<div
							class={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${outcomeColor(decision.outcome)}`}
						>
							{decision.outcome}
						</div>
					</div>

					<div class="flex items-center justify-center py-2">
						<RadarChart
							data={[
								{ label: 'GPA', value: decision.stats.academic },
								{ label: 'ECs', value: decision.stats.extracurricular },
								{ label: 'Fit', value: decision.stats.fit },
								{ label: 'Int.', value: decision.stats.intellectual },
								{ label: 'Char.', value: decision.stats.character }
							]}
							size={140}
							color={decision.outcome === 'admit' ? 'text-emerald-500' : 'text-slate-400'}
						/>
					</div>

					<div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
						<span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider"
							>Simulation Snapshot</span
						>
						<!-- Could add a "View" button here to re-open the deep dive or portal -->
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
