<script lang="ts">
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';

	import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
	import { schoolConfigs } from '$lib/config/schools';
	import { portalDecisionViewed } from '$lib/stores/ui';

	import GenericAcceptedLetter from '$lib/components/portal/GenericAcceptedLetter.svelte';
	import GenericDeniedLetter from '$lib/components/portal/GenericDeniedLetter.svelte';

	import DukeAccepted from '$lib/components/duke/DukeAccepted.svelte';
	import DukeDenied from '$lib/components/duke/DukeDenied.svelte';
	import HarvardAccepted from '$lib/components/harvard/HarvardAccepted.svelte';
	import HarvardDenied from '$lib/components/harvard/HarvardDenied.svelte';
	import YaleAccepted from '$lib/components/yale/YaleAccepted.svelte';
	import YaleDenied from '$lib/components/yale/YaleDenied.svelte';
	import UbiquityAccepted from '$lib/components/ubiquity/UbiquityAccepted.svelte';

	/**
	 * Use the type of GenericAcceptedLetter as the base component type.
	 * All letter components have the same shape, so this keeps TS happy
	 * without importing runtime-only stuff.
	 */
	type LetterComponents = {
		accepted: any;
		denied: any;
	};

	// Register custom letters by slug. Others fall back to Generic*.
	const letterComponentsBySlug: Record<string, LetterComponents> = {
		duke: {
			accepted: DukeAccepted,
			denied: DukeDenied
		},
		harvard: {
			accepted: HarvardAccepted,
			denied: HarvardDenied
		},
		yale: {
			accepted: YaleAccepted,
			denied: YaleDenied
		},
		ubiquity: {
			accepted: UbiquityAccepted,
			denied: GenericDeniedLetter
		}

		// Add more here as you create per-school components.
	};

	const getLetterComponentsForSlug = (slug: string): LetterComponents => {
		return (
			letterComponentsBySlug[slug] ?? {
				accepted: GenericAcceptedLetter,
				denied: GenericDeniedLetter
			}
		);
	};

	// ----------------- STATE -----------------

	let profile: UserProfile = {
		name: '',
		email: '',
		password: '',
		isPro: false,
		requestCount: 0,
		applicationProfile: {
			gpa: '',
			essays: '',
			activities: '',
			awards: '',
			rigor: ''
		},
		schoolList: [],
		savedDecisions: []
	};
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;

	// Route + school state must be declared before reactive assignments
	let currentSlug = '';
	let school: (typeof schoolConfigs)[string] | undefined = undefined;
	let pageTitle = 'PredictAdmit – Unknown Portal';

	import { aiResults } from '$lib/stores/results';
	import type { AiDecision } from '$lib/stores/results';

	// ----------------- REACTIVE DERIVATIONS -----------------

	$: profile = $userProfile;

	$: currentSlug = $page.params.slug;

	// Check for AI decision overlap
	$: aiDecision = $aiResults.decisions.find(
		(d) => d.slug === currentSlug || d.school.toLowerCase().replace(/\s+/g, '-') === currentSlug
	);

	// If AI decision exists, override the static school config's decision
	$: school = schoolConfigs[currentSlug]
		? {
				...schoolConfigs[currentSlug],
				decision: aiDecision ? aiDecision.outcome : schoolConfigs[currentSlug].decision
			}
		: undefined;

	$: pageTitle = school
		? `${school.schoolName} Undergraduate Admissions Portal`
		: 'PredictAdmit – Unknown Portal';

	const applicantName = () => profile.name || 'Applicant';

	// ----------------- HANDLERS -----------------

	const handleLoadSavedLogin = () => {
		if (!profile.email || !profile.password) {
			emailInput = 'john.doe@gmail.com';
			passwordInput = 'password123';
			error = '';
			return;
		}
		emailInput = profile.email;
		passwordInput = profile.password;
		error = '';
	};

	const handleLogin = (event: SubmitEvent) => {
		event.preventDefault();

		if (!school) {
			error = 'Unknown portal.';
			authenticated = false;
			return;
		}

		if (!profile.email || !profile.password) {
			error = 'Please set your PredictAdmit email and password on the main page.';
			authenticated = false;
			return;
		}

		if (emailInput.trim() === profile.email && passwordInput === profile.password) {
			authenticated = true;
			error = '';
		} else {
			error = 'Invalid email or password.';
			authenticated = false;
		}
	};

	import { goto } from '$app/navigation';
	import PortalSidebar from '$lib/components/portal/PortalSidebar.svelte';
	import { aiEvaluationService } from '$lib/services/aiEvaluationService';

	const handleViewUpdate = () => {
		hasViewedUpdate = true;
		portalDecisionViewed.set(true);
	};

	let showDeepDiveModal = false;
	let deepDiveContent: any = null;
	let deepDiveLoading = false;

	async function handleDeepDive() {
		if (!aiDecision) return;
		showDeepDiveModal = true;
		deepDiveLoading = true;

		try {
			// Check if we already have it in store or cache?
			// For now, straight fetch via service
			const result = await aiEvaluationService.requestDeepDive(
				aiDecision,
				$aiResults.applicantSummary || '',
				'' // ED slug not relevant here if we just want explanation
			);
			deepDiveContent = result;
		} catch (e) {
			console.error(e);
		} finally {
			deepDiveLoading = false;
		}
	}

	function handleSidebarHome() {
		goto('/ai');
	}

	function handleSaveDecision() {
		if (!aiDecision) return;

		userProfile.update((u) => {
			const existing = u.savedDecisions.find((d) => d.slug === currentSlug);
			if (existing) return u; // Already saved

			const newDecision = {
				id: currentSlug + '-' + Date.now(),
				school: school?.schoolName || aiDecision.school,
				slug: currentSlug,
				outcome: aiDecision.outcome,
				dateSaved: new Date().toISOString(),
				stats: {
					academic: aiDecision.academic_score,
					extracurricular: aiDecision.extracurricular_score,
					fit: aiDecision.fit_score,
					intellectual: aiDecision.intellectual_score,
					character: aiDecision.character_score
				}
			};

			return {
				...u,
				savedDecisions: [...u.savedDecisions, newDecision]
			};
		});
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

{#if !school}
	<main
		class="min-h-screen bg-slate-200 text-slate-900 font-serif flex items-center justify-center px-4"
	>
		<div class="border border-slate-400 bg-white px-6 py-4 shadow-md max-w-md text-sm space-y-3">
			<div class="flex items-center justify-between gap-2">
				<h1 class="text-lg font-bold">Unknown Admissions Portal</h1>
			</div>
			<p class="text-[12px] text-slate-800">
				The portal you tried to access is not part of this PredictAdmit simulation.
			</p>
			<p class="text-[11px] text-slate-700">
				Please return to the AI inbox and try a different link.
			</p>
		</div>
	</main>
{:else}
	<!-- Outer wrapper (not <main>, so child templates can own <main> / main content) -->
	<div class="min-h-screen bg-slate-200 text-slate-900 font-serif relative">
		{#if school}
			<PortalSidebar
				showDeepDive={!!aiDecision && aiDecision.academic_explanation !== 'N/A: random sim'}
				decisionOutcome={school.decision}
				on:deepDive={handleDeepDive}
				on:home={handleSidebarHome}
				on:save={handleSaveDecision}
			/>
		{/if}
		{#if !authenticated}
			<!-- LOGIN VIEW -->
			<header class="bg-white border-b border-slate-300 mt-2">
				<div class="max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
					<div class="flex items-baseline gap-3">
						<span class="text-3xl font-serif" style={`color: ${school.primaryColor};`}>
							{school.logoPrimary}
						</span>
						<span class="text-[11px] tracking-[0.18em] uppercase text-slate-700">
							{school.logoSecondary}
						</span>
					</div>
					<div class="text-[11px] text-slate-700">
						{applicantName()}
					</div>
				</div>
				<div class="h-8" style={`background-color: ${school.primaryColor};`}></div>
			</header>

			<section class="bg-white">
				<div class="max-w-5xl mx-auto px-10 py-10">
					<h1 class="text-3xl font-normal mb-6">Login</h1>

					<div class="border border-lime-700 bg-lime-100 px-4 py-3 mb-8 text-[12px] text-slate-900">
						To log in, please enter your email address and password.
					</div>

					<form class="space-y-4 text-sm" on:submit={handleLogin}>
						{#if error}
							<p
								class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2"
								role="alert"
							>
								{error}
							</p>
						{/if}

						<div class="flex items-center gap-4">
							<label
								for="portal-email"
								class="w-32 text-[12px] font-semibold text-slate-900 text-right"
							>
								Email Address
							</label>
							<input
								id="portal-email"
								type="email"
								class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80"
								bind:value={emailInput}
								autocomplete="email"
							/>
						</div>

						<div class="flex items-center gap-4">
							<label
								for="portal-password"
								class="w-32 text-[12px] font-semibold text-slate-900 text-right"
							>
								Password
							</label>
							<input
								id="portal-password"
								type="password"
								class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80"
								bind:value={passwordInput}
								autocomplete="current-password"
							/>
							<a href="/disclaimer" class="text-[12px] text-blue-800 underline hover:no-underline">
								Forgot Your Password?
							</a>
						</div>

						<div class="flex items-center gap-4 pt-4">
							<div class="w-32"></div>
							<div class="flex flex-wrap items-center gap-3">
								<button
									type="submit"
									class="border border-slate-500 bg-slate-300 px-4 py-1 text-[12px] font-semibold hover:bg-slate-400 active:bg-slate-500"
								>
									Login
								</button>
								<button
									type="button"
									class="border border-slate-400 bg-slate-100 px-3 py-1 text-[11px] hover:bg-slate-200 active:bg-slate-300"
									on:click={handleLoadSavedLogin}
								>
									Load saved PredictAdmit login
								</button>
							</div>
						</div>

						<p class="pt-4 text-[10px] leading-relaxed text-slate-600 max-w-xl">
							For this simulation, use the same email address and password that you saved on the
							PredictAdmit.com home page. No real application data is used, and all information is
							stored only in your browser.
						</p>
					</form>
				</div>
			</section>

			<footer class="mt-8">
				<div class="h-10 flex items-center" style={`background-color: ${school.primaryColor};`}>
					<div
						class="max-w-5xl mx-auto px-6 w-full flex items-center justify-between text-[11px] text-white"
					>
						<span>&copy; {school.footerDomain} 2019</span>
						<span class="opacity-80">
							PredictAdmit.com simulation · Not affiliated with {school.schoolName}
						</span>
					</div>
				</div>
			</footer>
		{:else if !hasViewedUpdate}
			<AdmissionsPortalTemplate
				logoPrimary={school.logoPrimary}
				logoSecondary={school.logoSecondary}
				schoolName={school.schoolName}
				primaryColor={school.primaryColor}
				applicantName={applicantName()}
				admissionsId={school.admissionsId}
				financialAidId={school.financialAidId}
				bannerText={school.bannerText}
				noticeText={school.noticeText}
				statusLastPosted={school.statusLastPosted}
				statusLinkLabel={school.statusLinkLabel}
				onViewUpdate={handleViewUpdate}
			/>
		{:else}
			{#key school.slug}
				{#if school.decision === 'admit'}
					<svelte:component
						this={getLetterComponentsForSlug(school.slug).accepted}
						applicantName={applicantName()}
						schoolName={school.schoolName}
						primaryColor={school.primaryColor}
						footerDomain={school.footerDomain}
						showDeepDive={!!aiDecision && aiDecision.academic_explanation !== 'N/A: random sim'}
					/>
				{:else}
					<svelte:component
						this={getLetterComponentsForSlug(school.slug).denied}
						applicantName={applicantName()}
						schoolName={school.schoolName}
						primaryColor={school.primaryColor}
						footerDomain={school.footerDomain}
						showDeepDive={!!aiDecision && aiDecision.academic_explanation !== 'N/A: random sim'}
					/>
				{/if}
			{/key}
		{/if}
	</div>

	<!-- Deep Dive Modal -->
	{#if showDeepDiveModal}
		<div
			class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
		>
			<div
				class="max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
			>
				<header class="bg-indigo-600 px-6 py-4 flex items-center justify-between shrink-0">
					<h2 class="text-white font-bold text-lg flex items-center gap-2">
						<svg
							class="w-5 h-5 text-indigo-200"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/></svg
						>
						AI Deep Dive Analysis
					</h2>
					<button
						on:click={() => (showDeepDiveModal = false)}
						class="text-indigo-100 hover:text-white transition-colors"
					>
						<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/></svg
						>
					</button>
				</header>

				<div class="p-6 overflow-y-auto font-sans">
					{#if deepDiveLoading}
						<div class="flex flex-col items-center justify-center py-12 space-y-4">
							<div
								class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
							></div>
							<p class="text-sm text-slate-500 font-medium">Analyzing application file...</p>
						</div>
					{:else if deepDiveContent}
						<div class="space-y-6">
							<div>
								<h3 class="text-xl font-bold text-slate-900 mb-2">{deepDiveContent.school}</h3>
								<div
									class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
										deepDiveContent.outcome === 'admit'
											? 'bg-emerald-50 text-emerald-700 border-emerald-200'
											: deepDiveContent.outcome === 'deny'
												? 'bg-rose-50 text-rose-700 border-rose-200'
												: 'bg-amber-50 text-amber-700 border-amber-200'
									}`}
								>
									{deepDiveContent.outcome === 'admit'
										? 'Admitted'
										: deepDiveContent.outcome === 'deny'
											? 'Denied'
											: 'Waitlisted'}
								</div>
							</div>

							<div class="prose prose-sm prose-slate max-w-none">
								<p class="whitespace-pre-wrap leading-relaxed">{deepDiveContent.explanation}</p>
							</div>

							{#if deepDiveContent.improvement_tips}
								<div class="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
									<h4 class="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-2">
										Key Insights
									</h4>
									<p class="text-sm text-indigo-800 leading-relaxed whitespace-pre-wrap">
										{deepDiveContent.improvement_tips}
									</p>
								</div>
							{/if}
						</div>
					{:else}
						<p class="text-center text-slate-500 py-10">
							Use Deep Dive to uncover the "why" behind this decision.
						</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}
{/if}
