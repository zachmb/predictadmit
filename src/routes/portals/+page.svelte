<script lang="ts">
	import { goto } from '$app/navigation';

	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import { decisionsBySlug, manualOverrideMode } from '$lib/stores/results';

	import { schoolConfigs } from '$lib/config/schools';

	type DecisionMode = 'random' | 'accepted' | 'denied' | 'waitlisted' | 'deferred';

	// Generate initial list from config, sorted alphabetically
	const initialPortals = Object.values(schoolConfigs)
		.map((s) => ({
			name: s.schoolName,
			slug: s.slug,
			color: s.primaryColor,
			decision: 'random' as DecisionMode
		}))
		.sort((a, b) => a.name.localeCompare(b.name));

	let portals = [...initialPortals];

	// Sync with persistent store AND manual override mode
	$: {
		const mode = $manualOverrideMode;
		const decisions = $decisionsBySlug;

		portals = initialPortals.map((p) => {
			// 1. Global Override
			if (mode === 'accepted') {
				return { ...p, decision: 'accepted' };
			}
			if (mode === 'denied') {
				return { ...p, decision: 'denied' };
			}

			// 2. Simulation Results
			const outcome = decisions[p.slug];
			if (outcome) {
				const mappedMode: DecisionMode = outcome === 'admit' ? 'accepted' : 'denied';
				return { ...p, decision: mappedMode };
			}

			// 3. Default
			return p;
		});
	}

	const handlePortalClick = (slug: string, currentDecision: DecisionMode) => {
		const mode = $manualOverrideMode;
		if (mode !== 'random') {
			sessionStorage.setItem(`decision-${slug}`, mode === 'accepted' ? 'admit' : 'deny');
		} else {
			sessionStorage.setItem(`decision-${slug}`, currentDecision);
		}
		goto(`/portals/${slug}`);
	};

	const getDecisionLabel = (decision: DecisionMode) => {
		switch (decision) {
			case 'accepted':
				return 'Accepted';
			case 'denied':
				return 'Denied';
			default:
				return '';
		}
	};

	const getDecisionColor = (decision: DecisionMode) => {
		switch (decision) {
			case 'accepted':
				return 'text-green-600 bg-green-50 border-green-200';
			case 'denied':
				return 'text-red-600 bg-red-50 border-red-200';
			default:
				return 'text-slate-600 bg-slate-50 border-slate-200';
		}
	};
</script>

<svelte:head>
	<title>All College Portals - PredictAdmit</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
	<div class="flex-1">
		<div class="max-w-6xl mx-auto px-4 py-10">
			<div class="bg-white border border-slate-400 shadow-md rounded-md overflow-hidden">
				<div
					class="border-b border-slate-300 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 px-5 py-4"
				>
					<h1 class="text-3xl font-bold text-slate-900 mb-2">All College Portals</h1>
					<p class="text-slate-700">
						Explore individual college admission portals. These results are locked based on your
						simulation run.
					</p>

					<div class="mt-4 flex items-center gap-3">
						<span class="text-xs font-bold text-slate-500 uppercase tracking-wider"
							>Simulate Mode:</span
						>
						<select
							bind:value={$manualOverrideMode}
							class="bg-white border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-md outline-none cursor-pointer hover:border-slate-400 transition-colors"
						>
							<option value="random">Random / As Simulated</option>
							<option value="accepted">Force Accepted</option>
							<option value="denied">Force Rejected</option>
						</select>
					</div>
				</div>

				<div class="p-6">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{#each portals as portal}
							<div
								class="border border-slate-300 rounded-md hover:border-slate-400 hover:shadow-md transition-all duration-200 bg-white"
							>
								<button
									type="button"
									class="w-full p-4 text-left"
									on:click={() => handlePortalClick(portal.slug, portal.decision)}
								>
									<div class="flex items-center gap-3 mb-2">
										<div
											class="w-3 h-3 rounded-full"
											style="background-color: {portal.color}"
										></div>
										<h3 class="font-semibold text-slate-900">{portal.name}</h3>
									</div>
									<div class="flex items-center justify-between">
										<div class="text-xs text-blue-600 font-medium">Visit Portal →</div>
										<div
											class={`px-2 py-1 text-xs font-medium rounded border ${getDecisionColor(portal.decision)}`}
										>
											{getDecisionLabel(portal.decision)}
										</div>
									</div>
								</button>

								<div class="px-4 pb-3 pt-0 border-t border-slate-100 bg-slate-50/50">
									<div class="flex items-center gap-1 mt-2">
										<span class="text-[10px] uppercase tracking-wider text-slate-500 mr-2"
											>Status:</span
										>

										<button
											disabled
											class={`px-2 py-0.5 text-xs font-medium rounded border cursor-not-allowed ${
												portal.decision === 'accepted'
													? 'bg-green-600 text-white border-green-600'
													: 'bg-white text-slate-300 border-slate-200 opacity-50'
											}`}
										>
											Accepted
										</button>

										<button
											disabled
											class={`px-2 py-0.5 text-xs font-medium rounded border cursor-not-allowed ${
												portal.decision === 'denied'
													? 'bg-red-600 text-white border-red-600'
													: 'bg-white text-slate-300 border-slate-200 opacity-50'
											}`}
										>
											Denied
										</button>
									</div>
								</div>
							</div>
						{/each}
					</div>

					<div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
						<p class="text-sm text-blue-800">
							<strong>Simulation Results Locked:</strong> Individual decisions are determined by the PredictAdmit
							simulation. These cannot be manually toggled to ensure the integrity of your practice run.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<SiteFooter />
</main>
