<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import { userProfile } from '$lib/stores/user';

	import {
		aiResults,
		decisionsBySlug,
		manualOverrideMode,
		type DecisionOutcome,
		type AiDecision
	} from '$lib/stores/results';
	import { schoolConfigs } from '$lib/config/schools';

	type DecisionMode = 'random' | 'accepted' | 'denied' | 'waitlisted' | 'deferred';

	const initialPortals = Object.values(schoolConfigs)
		.map((s) => ({
			name: s.schoolName,
			slug: s.slug,
			color: s.primaryColor,
			decision: 'random' as DecisionMode
		}))
		.sort((a, b) => a.name.localeCompare(b.name));

	let portals = $state([...initialPortals]);

	// This runs ONLY to keep the UI (the cards) synced with whatever is in the store
	$effect(() => {
		const decisions = $decisionsBySlug;
		portals = initialPortals.map((p) => {
			const outcome = decisions[p.slug];
			if (outcome) {
				const mappedMode: DecisionMode = outcome === 'admit' ? 'accepted' : 'denied';
				return { ...p, decision: mappedMode };
			}
			return { ...p, decision: 'random' };
		});
	});

	const buildManualDecision = (
		portal: (typeof initialPortals)[number],
		outcome: DecisionOutcome
	): AiDecision => ({
		school: portal.name,
		slug: portal.slug,
		outcome,
		source: 'manual',
		academic_score: 0,
		academic_explanation: 'N/A: manual portal selection',
		extracurricular_score: 0,
		extracurricular_explanation: 'Forced via individual selector',
		fit_score: 0,
		fit_explanation: 'Forced via individual selector',
		intellectual_score: 0,
		intellectual_explanation: 'Forced via individual selector',
		character_score: 0,
		character_explanation: 'Forced via individual selector',
		improvement_tips: ''
	});

	const handleModeChange = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		const newMode = target.value as 'accepted' | 'denied' | 'random';

		// Update the mode store
		manualOverrideMode.set(newMode);

		if (newMode === 'accepted' || newMode === 'denied') {
			userProfile.update((u) => ({ ...u, usingAI: false }));

			const status: DecisionOutcome = newMode === 'accepted' ? 'admit' : 'deny';
			const currentResults = get(aiResults);
			const decisionsByPortal = new Map(currentResults.decisions.map((d) => [d.slug, d]));
			const updatedDecisions = initialPortals.map((portal) => {
				const existingDecision = decisionsByPortal.get(portal.slug);
				return existingDecision
					? { ...existingDecision, outcome: status, source: 'manual' as const }
					: buildManualDecision(portal, status);
			});

			aiResults.setDecisions(updatedDecisions);
		}
	};

	const handlePortalDecisionChange = (slug: string, decision: 'accepted' | 'denied') => {
		const portal = initialPortals.find((p) => p.slug === slug);
		if (!portal) return;

		userProfile.update((u) => ({ ...u, usingAI: false }));
		manualOverrideMode.set('random');

		const outcome: DecisionOutcome = decision === 'accepted' ? 'admit' : 'deny';
		const currentResults = get(aiResults);
		const existingDecision = currentResults.decisions.find((d) => d.slug === slug);
		const updatedDecision = existingDecision
			? { ...existingDecision, outcome, source: 'manual' as const }
			: buildManualDecision(portal, outcome);

		aiResults.setDecisions([
			...currentResults.decisions.filter((d) => d.slug !== slug),
			updatedDecision
		]);
	};

	const handlePortalClick = (slug: string, currentDecision: DecisionMode) => {
		if (currentDecision === 'accepted' || currentDecision === 'denied') {
			const status = currentDecision === 'accepted' ? 'admit' : 'deny';
			sessionStorage.setItem(`decision-${slug}`, status);
		}
		goto(`/portals/${slug}`);
	};

	const getDecisionLabel = (decision: DecisionMode) => {
		if (decision === 'accepted') return 'Accepted';
		if (decision === 'denied') return 'Denied';
		return '';
	};

	// Flash the card of the school whose decision letter was just viewed
	// (recorded by the root layout in sessionStorage), green or red.
	let flashSlug = $state<string | null>(null);
	let flashOutcome = $state<'admit' | 'deny'>('deny');

	onMount(() => {
		let record;
		try {
			const raw = sessionStorage.getItem('predictadmit:lastDecision');
			if (!raw) return;
			sessionStorage.removeItem('predictadmit:lastDecision');
			record = JSON.parse(raw);
		} catch {
			return;
		}
		if (!record?.slug || Date.now() - (record.at || 0) > 5 * 60_000) return;
		flashSlug = record.slug;
		flashOutcome = record.outcome === 'admit' ? 'admit' : 'deny';
		requestAnimationFrame(() => {
			document
				.getElementById(`portal-card-${record.slug}`)
				?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		});
		const timer = setTimeout(() => (flashSlug = null), 4000);
		return () => clearTimeout(timer);
	});

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
						Explore individual college admission portals. Choose a result for any school, or use
						the simulator mode to update every portal at once.
					</p>

					<div
						class="mt-3 rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-[11px] leading-relaxed text-slate-600"
					>
						<p class="font-bold uppercase tracking-wider text-slate-500 mb-1">
							Important disclosure — simulation only
						</p>
						<p>
							PredictAdmit is an independent educational tool and is <strong>not affiliated with,
							endorsed by, sponsored by, or connected to</strong> any college or university shown on
							this site. Every portal, status page, and decision letter here is a
							<strong>fictional simulation</strong> created for practice and preparation. Nothing on
							this page is an official communication from any institution, and no simulated outcome
							reflects, predicts, or affects any real application or admission decision. University
							names and marks are the property of their respective owners and are used solely to
							identify the institution being simulated. PredictAdmit does not access, connect to, or
							interact with any university's actual application systems or applicant data. If you
							represent an institution and have questions or concerns, please
							<a href="/contact" class="font-semibold text-[#0052CC] underline hover:text-[#003d99]"
								>contact us</a
							>.
						</p>
					</div>

					<div class="mt-4 flex flex-wrap items-center gap-3">
						<label
							for="applicant-name"
							class="text-xs font-bold text-slate-500 uppercase tracking-wider">Your name:</label
						>
						<input
							id="applicant-name"
							type="text"
							placeholder="Enter your name"
							value={$userProfile.name}
							oninput={(e) => {
								const v = (e.currentTarget as HTMLInputElement).value;
								const slug = v
									.trim()
									.toLowerCase()
									.replace(/[^a-z0-9\s]/g, '')
									.replace(/\s+/g, '.');
								userProfile.update((u) => ({
									...u,
									name: v,
									// Derive the fake-login email from the name so it matches on every portal.
									email: slug ? `${slug}@gmail.com` : u.email,
									// Ensure a password exists so auto-login uses the derived email.
									password: u.password || 'password123'
								}));
							}}
							class="bg-white border border-slate-300 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-md outline-none w-56 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-colors"
						/>
						{#if $userProfile.email}
							<span class="text-[11px] text-slate-500"
								>Login email: <span class="font-semibold text-slate-700">{$userProfile.email}</span></span
							>
						{:else}
							<span class="text-[11px] text-slate-400">Personalizes every portal &amp; letter</span>
						{/if}
					</div>

					<div class="mt-3 flex items-center gap-3">
						<span class="text-xs font-bold text-slate-500 uppercase tracking-wider"
							>Simulate Mode:</span
						>
						<select
							value={$manualOverrideMode}
							onchange={handleModeChange}
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
								id={`portal-card-${portal.slug}`}
								class={`border rounded-md transition-all duration-700 ${
									flashSlug === portal.slug
										? flashOutcome === 'admit'
											? 'decision-flash decision-flash-admit'
											: 'decision-flash decision-flash-deny'
										: 'border-slate-300 hover:border-slate-400 hover:shadow-md bg-white'
								}`}
							>
								<button
									type="button"
									class="w-full p-4 text-left"
									onclick={() => handlePortalClick(portal.slug, portal.decision)}
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
											type="button"
											aria-pressed={portal.decision === 'accepted'}
											onclick={() => handlePortalDecisionChange(portal.slug, 'accepted')}
											class={`px-2 py-0.5 text-xs font-medium rounded border transition-colors ${
												portal.decision === 'accepted'
													? 'bg-green-600 text-white border-green-600'
													: 'bg-white text-slate-600 border-slate-200 hover:border-green-300 hover:text-green-700'
											}`}
										>
											Accepted
										</button>

										<button
											type="button"
											aria-pressed={portal.decision === 'denied'}
											onclick={() => handlePortalDecisionChange(portal.slug, 'denied')}
											class={`px-2 py-0.5 text-xs font-medium rounded border transition-colors ${
												portal.decision === 'denied'
													? 'bg-red-600 text-white border-red-600'
													: 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-700'
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
							<strong>Simulation Controls:</strong> Individual buttons update that school's
							portal and letter. The simulator mode above can still force every school at once.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<SiteFooter />
</main>

<style>
	.decision-flash {
		animation: decision-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.decision-flash-admit {
		border-color: #16a34a;
		background-color: #f0fdf4;
		box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5);
		animation:
			decision-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1),
			decision-pulse-admit 1.4s ease-out 2;
	}

	.decision-flash-deny {
		border-color: #dc2626;
		background-color: #fef2f2;
		box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5);
		animation:
			decision-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1),
			decision-pulse-deny 1.4s ease-out 2;
	}

	@keyframes decision-pop {
		0% {
			transform: scale(1);
		}
		40% {
			transform: scale(1.04);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes decision-pulse-admit {
		0% {
			box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5);
		}
		100% {
			box-shadow: 0 0 0 14px rgba(34, 197, 94, 0);
		}
	}

	@keyframes decision-pulse-deny {
		0% {
			box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5);
		}
		100% {
			box-shadow: 0 0 0 14px rgba(239, 68, 68, 0);
		}
	}
</style>
