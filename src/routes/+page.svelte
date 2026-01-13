<script lang="ts">
	import { get } from 'svelte/store';
	import { schoolConfigs } from '$lib/config/schools';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userProfile } from '$lib/stores/user';
	import { aiResults, manualOverrideMode } from '$lib/stores/results';
	import { type AiDecision, type DecisionOutcome } from '$lib/stores/results';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import AdmitMail from '$lib/components/AdmitMail.svelte';
	import Card from '$lib/components/common/Card.svelte';

	// --- Config & State Imports ---
	import {
		portals,
		sentEmails,
		calendarDates,
		ED_DATE_LABEL,
		RD_DATE_LABEL,
		type PortalEmail,
		type SentEmail,
		type ApplicationPhase,
		type PersistedState
	} from '$lib/config/admitMail';

	// University search state
	let searchQuery = '';
	let showSearchResults = false;
	let filteredUniversities: typeof portals = [];
	let selectedIndex = -1;

	// Filter universities as user types
	$: {
		const query = searchQuery.trim().toLowerCase();
		if (query) {
			filteredUniversities = portals
				.filter((p) => p.name.toLowerCase().includes(query) || p.slug.toLowerCase().includes(query))
				.slice(0, 5); // Show max 5 results
			showSearchResults = filteredUniversities.length > 0;
			selectedIndex = -1; // Reset selection on new search
		} else {
			filteredUniversities = [];
			showSearchResults = false;
			selectedIndex = -1;
		}
	}

	const handleKeydown = (e: KeyboardEvent) => {
		if (!showSearchResults || filteredUniversities.length === 0) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % filteredUniversities.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex =
				(selectedIndex - 1 + filteredUniversities.length) % filteredUniversities.length;
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (selectedIndex >= 0 && selectedIndex < filteredUniversities.length) {
				handleUniversitySelect(filteredUniversities[selectedIndex].slug);
			} else if (filteredUniversities.length > 0) {
				handleUniversitySelect(filteredUniversities[0].slug);
			}
		} else if (e.key === 'Escape') {
			showSearchResults = false;
		}
	};

	function handleUniversitySelect(slug: string) {
		const mode = get(manualOverrideMode); // 'accepted' or 'denied'
		const status: DecisionOutcome = mode === 'accepted' ? 'admit' : 'deny';
		userProfile.update((u) => ({ ...u, usingAI: false }));

		const currentResults = get(aiResults);
		const schoolConfig = schoolConfigs[slug];
		if (!schoolConfig) return;

		const existingIndex = currentResults.decisions.findIndex((d) => d.slug === slug);
		let updatedDecisions = [...currentResults.decisions];

		if (existingIndex !== -1) {
			updatedDecisions[existingIndex] = { ...updatedDecisions[existingIndex], outcome: status };
		} else {
			const newDecision: AiDecision = {
				school: schoolConfig.schoolName,
				slug: slug,
				outcome: status,
				academic_score: 0,
				academic_explanation: 'N/A: random sim',
				extracurricular_score: 0,
				extracurricular_explanation: 'Manual Search Override',
				fit_score: 0,
				fit_explanation: 'Manual Search Override',
				intellectual_score: 0,
				intellectual_explanation: 'Manual Search Override',
				character_score: 0,
				character_explanation: 'Manual Search Override',
				improvement_tips: ''
			};
			updatedDecisions.push(newDecision);
		}

		aiResults.setDecisions(updatedDecisions);
		sessionStorage.setItem(`decision-${slug}`, status);
		goto(`/portals/${slug}`);
		searchQuery = '';
		showSearchResults = false;
	}

	// --- State Variables (Existing Logic Kept) ---
	let name = '';
	let email = '';
	let password = '';
	let saveMessage = '';
	let inboxSearchQuery = '';
	let filteredPortals: PortalEmail[] = [];
	let inboxSection: HTMLElement | null = null;
	let hasAutoScrolledToInbox = false;
	let sortedVisiblePortals: PortalEmail[] = [];
	let selectedPortal: PortalEmail | null = null;
	let selectedSent: SentEmail | null = null;
	let activeFolder: 'inbox' | 'sent' = 'inbox';
	let viewMode: 'inbox' | 'email' = 'inbox';
	let readPortalSlugs: Set<string> = new Set();
	let showAccountForm = false;
	let showPassword = false;
	let hasApplied = false;
	let hasSavedProfile = false;
	let visiblePortals: (PortalEmail & { outcome?: string })[] = [];
	let isApplying = false;
	let applicationPhase: ApplicationPhase = 'idle';
	let calendarIndex = 0;
	let calendarIntervalId: number | null = null;
	let edChoiceSlug = '';
	let currentEdPortal: PortalEmail | null = null;
	let edEmailMustBeViewed = false;
	let hasViewedEdEmail = false;
	let edEmailRevealed = false;
	let rdTimelineStarted = false;
	let applyTimeoutIds: number[] = [];
	let canApply = false;

	const PERSIST_KEY = 'predictadmit_state_v1';

	// --- Derived State ---
	$: displayNameStr = name.trim() || 'Applicant';
	$: displayEmailStr = email.trim() || 'you@example.com';
	$: canApply = Boolean(name.trim() && email.trim() && password);

	// --- Core Logic (Persistence, Calendar, Emails) ---
	// (Collapsed for brevity - utilizing existing logic structure)
	// ... [Persistence and Logic same as original file, ensuring app functionality remains] ...

	const saveState = () => {
		if (typeof localStorage === 'undefined') return;
		const state: PersistedState = {
			hasApplied,
			hasSavedProfile,
			calendarIndex,
			applicationPhase,
			edChoiceSlug,
			currentEdSlug: currentEdPortal ? currentEdPortal.slug : null,
			edEmailMustBeViewed,
			hasViewedEdEmail,
			edEmailRevealed,
			rdTimelineStarted,
			visiblePortalSlugs: visiblePortals.map((p) => p.slug),
			readPortalSlugs: Array.from(readPortalSlugs)
		};
		try {
			localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
		} catch (err) {
			console.error(err);
		}
	};

	const loadState = () => {
		if (typeof localStorage === 'undefined') return;
		const raw = localStorage.getItem(PERSIST_KEY);
		if (!raw) return;
		try {
			const state = JSON.parse(raw) as Partial<PersistedState>;
			hasApplied = !!state.hasApplied;
			hasSavedProfile = !!state.hasSavedProfile;
			if (typeof state.calendarIndex === 'number') calendarIndex = state.calendarIndex;
			if (state.applicationPhase) applicationPhase = state.applicationPhase;
			if (state.edChoiceSlug) edChoiceSlug = state.edChoiceSlug;
			currentEdPortal = state.currentEdSlug
				? (portals.find((p) => p.slug === state.currentEdSlug) ?? null)
				: null;
			edEmailMustBeViewed = !!state.edEmailMustBeViewed;
			hasViewedEdEmail = !!state.hasViewedEdEmail;
			edEmailRevealed = !!state.edEmailRevealed;
			rdTimelineStarted = !!state.rdTimelineStarted;
			if (state.visiblePortalSlugs)
				visiblePortals = state.visiblePortalSlugs
					.map((s) => portals.find((p) => p.slug === s))
					.filter((p): p is PortalEmail => !!p) as any;
			if (state.readPortalSlugs) readPortalSlugs = new Set(state.readPortalSlugs);
			if (hasSavedProfile) showAccountForm = true;
			if (rdTimelineStarted && visiblePortals.length < portals.length)
				startRdEmailTimeline(currentEdPortal);
		} catch (err) {
			console.error(err);
		}
	};

	onMount(() => {
		loadState();
		const savedIndex = localStorage.getItem('calendar_progress');
		if (savedIndex !== null) {
			calendarIndex = parseInt(savedIndex);
			if (calendarIndex < calendarDates.length - 1) startCalendar();
		}
	});

	// --- Handlers ---
	const handleStartSimulationClick = () => {
		// Scroll to account form or open modal
		const el = document.getElementById('simulation-start');
		el?.scrollIntoView({ behavior: 'smooth' });
		showAccountForm = true;
	};

	// ... [Keeping existing helper functions: startCalendar, startRdEmailTimeline, formatTime, etc.] ...
	const startCalendar = () => {
		if (calendarIntervalId !== null) clearInterval(calendarIntervalId);
		calendarIntervalId = window.setInterval(() => {
			if (calendarIndex < calendarDates.length - 1) {
				calendarIndex += 1;
				localStorage.setItem('calendar_progress', calendarIndex.toString());
			} else {
				calendarIntervalId = null;
				localStorage.removeItem('calendar_progress');
			}
		}, 700);
	};

	const startRdEmailTimeline = (edPortal: PortalEmail | null) => {
		const rdPortals = edPortal ? portals.filter((p) => p.slug !== edPortal.slug) : portals;
		rdPortals.forEach((portal, index) => {
			const timeoutId = window.setTimeout(
				() => {
					if (!visiblePortals.some((vp) => vp.slug === portal.slug)) {
						const decision = $aiResults.decisions.find((d) => d.slug === portal.slug);
						const newPortalEntry = {
							...portal,
							outcome: decision?.outcome || 'deny',
							received: getReceivedLabel(portal)
						};
						visiblePortals = [...visiblePortals, newPortalEntry as any];
						if (index === rdPortals.length - 1) {
							applicationPhase = 'finished';
							userProfile.update((u) => ({ ...u, isSubmitting: false }));
						}
						saveState();
					}
				},
				(index + 1) * 1000
			);
			applyTimeoutIds.push(timeoutId);
		});
	};

	const formatTime = (h: number, m: number) => {
		const suffix = h >= 12 ? 'PM' : 'AM';
		const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
		return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
	};

	const getReceivedLabel = (portal: PortalEmail): string => {
		const idx = portals.findIndex((p) => p.slug === portal.slug);
		if (currentEdPortal && portal.slug === currentEdPortal.slug) {
			return `${ED_DATE_LABEL}, ${formatTime(16, 5 + idx * 2)}`;
		}
		return `${RD_DATE_LABEL}, ${formatTime(17, 1 + idx * 2)}`;
	};

	// --- App Flow Handlers ---

	const generateFakeCredentials = () => {
		name = 'Alex Smith';
		email = 'alex.smith' + Math.floor(Math.random() * 9999) + '@example.com';
		password = 'password123';
	};

	const handleApply = () => {
		if (!canApply) return;
		if (hasApplied) return;
		userProfile.update((u) => ({ ...u, usingAI: false, isSubmitting: true }));
		hasApplied = true;
		aiResults.clear();
		// Generate random decisions for this simulation mode
		const randomDecisions = portals.map((p) => ({
			school: p.name,
			slug: p.slug,
			outcome: Math.random() > 0.5 ? 'admit' : ('deny' as 'admit' | 'deny'),
			academic_score: 0,
			extracurricular_score: 0,
			intellectual_score: 0,
			fit_score: 0,
			character_score: 0,
			academic_explanation: 'Sim',
			extracurricular_explanation: 'Sim',
			fit_explanation: 'Sim',
			intellectual_explanation: 'Sim',
			character_explanation: 'Sim',
			improvement_tips: 'Sim'
		}));
		aiResults.setDecisions(randomDecisions);

		// Reset state
		currentEdPortal = edChoiceSlug ? (portals.find((p) => p.slug === edChoiceSlug) ?? null) : null;
		visiblePortals = [];
		selectedPortal = null;
		selectedSent = null;
		readPortalSlugs = new Set();
		inboxSearchQuery = '';
		hasViewedEdEmail = false;
		edEmailMustBeViewed = false;
		edEmailRevealed = false;
		rdTimelineStarted = false;
		applyTimeoutIds.forEach((id) => clearTimeout(id));
		applyTimeoutIds = [];
		calendarIndex = 0;
		startCalendar();

		// Animation
		isApplying = true;
		applicationPhase = 'commonapp';
		setTimeout(() => saveState(), 1000); // reduced to 1s as requested

		// Auto-scroll to admit mail
		setTimeout(() => {
			const mailSection = document.getElementById('admit-mail-section');
			if (mailSection) {
				mailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
			} else if (inboxSection) {
				inboxSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}, 100);
	};

	const resetSimulation = () => {
		applyTimeoutIds.forEach((id) => clearTimeout(id));
		hasApplied = false;
		hasSavedProfile = false;
		showAccountForm = false;
		visiblePortals = [];
		calendarIndex = 0;
		applicationPhase = 'idle';
		if (typeof localStorage !== 'undefined') localStorage.removeItem(PERSIST_KEY);
		// Reset local fields
		name = '';
		email = '';
		password = '';
	};

	const startApplicationAnimation = () => {
		/* ... kept simple in handleApply ... */
	};

	// --- Updates to visible portals ---
	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		const trimmedName = name.trim();
		const trimmedEmail = email.trim();
		userProfile.update((u) => ({
			...u,
			name: trimmedName,
			email: trimmedEmail,
			password // keep as typed
		}));
		hasSavedProfile = true;
		saveMessage = 'Fake login saved.';
		showAccountForm = true;
		saveState();
	};

	$: if (hasApplied && applicationPhase === 'finished') {
		sortedVisiblePortals = [...visiblePortals].sort(
			(a, b) => new Date(b.received).getTime() - new Date(a.received).getTime()
		);
		if (inboxSection && !hasAutoScrolledToInbox) {
			inboxSection.scrollIntoView({ behavior: 'smooth' });
			hasAutoScrolledToInbox = true;
		}
	} else {
		sortedVisiblePortals = [...visiblePortals];
	}

	$: filteredPortals = inboxSearchQuery.trim()
		? sortedVisiblePortals.filter((p) =>
				p.name.toLowerCase().includes(inboxSearchQuery.trim().toLowerCase())
			)
		: sortedVisiblePortals;

	// --- View Handling ---
	const handleSelectPortal = (p: PortalEmail) => {
		selectedPortal = p;
		viewMode = 'email';
		readPortalSlugs.add(p.slug);
		if (currentEdPortal && p.slug === currentEdPortal.slug) hasViewedEdEmail = true;
		saveState();
	};
	const handleSelectSent = (s: SentEmail) => {
		selectedSent = s;
		viewMode = 'email';
	};
	const switchFolder = (f: 'inbox' | 'sent') => {
		activeFolder = f;
		viewMode = 'inbox';
	};
	const openInboxList = () => (viewMode = 'inbox');

	// ED Reveal Logic
	$: if (hasApplied) {
		const d = calendarDates[calendarIndex];
		if (currentEdPortal && !edEmailRevealed && d === ED_DATE_LABEL) {
			visiblePortals = [currentEdPortal];
			edEmailRevealed = true;
			edEmailMustBeViewed = true;
			if (calendarIntervalId) {
				clearInterval(calendarIntervalId);
				calendarIntervalId = null;
			}
		}
		if (
			currentEdPortal &&
			edEmailRevealed &&
			hasViewedEdEmail &&
			viewMode === 'inbox' &&
			!calendarIntervalId &&
			!rdTimelineStarted &&
			calendarIndex < calendarDates.length - 1
		) {
			startCalendar();
		}
		if (!rdTimelineStarted && d === RD_DATE_LABEL && (!currentEdPortal || hasViewedEdEmail)) {
			rdTimelineStarted = true;
			startRdEmailTimeline(currentEdPortal);
			if (calendarIntervalId) {
				clearInterval(calendarIntervalId);
				calendarIntervalId = null;
			}
		}
		saveState();
	}
</script>

<svelte:head>
	<title>PredictAdmit - Admissions, Predicted.</title>
	<meta
		name="description"
		content="Master your college application cycle with the world's most advanced admissions simulator."
	/>
</svelte:head>

<!-- MARKETING LANDING PAGE -->
<main class="font-sans text-slate-900 bg-white selection:bg-blue-100 selection:text-blue-900">
	<!-- HERO SECTION -->
	<section class="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
		<!-- Background Decoration -->
		<div
			class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 rounded-[100%] blur-3xl -z-10 pointer-events-none"
		></div>

		<div class="max-w-[1200px] mx-auto px-6 text-center space-y-10 relative z-10">
			<!-- Headline -->
			<div class="space-y-6 max-w-4xl mx-auto">
				<h1 class="text-5xl md:text-7xl font-[600] tracking-tight leading-[1.1] text-slate-900">
					Simulate Any University Portal
				</h1>
				<p class="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
					Experience realistic college admission portals. Search for any university or run a full
					simulation.
				</p>
			</div>

			<!-- Search Bar + Simulation Button -->
			<!-- Search Bar + Simulation Button OR Simulation Interface -->
			{#if !hasApplied}
				<div class="max-w-xl mx-auto relative z-20">
					<div
						class="flex gap-2 p-1 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-blue-100/50 relative"
					>
						<!-- Mode Selector (Accept/Deny) -->
						<div class="relative flex-shrink-0">
							<select
								bind:value={$manualOverrideMode}
								class="appearance-none h-full pl-4 pr-8 bg-slate-50 font-bold text-sm text-slate-900 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
							>
								<option value="" disabled selected class="text-slate-500">Decision</option>
								<option value="accepted">Accept</option>
								<option value="denied">Reject</option>
							</select>
							<div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
								<svg
									class="w-3 h-3 text-slate-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/></svg
								>
							</div>
						</div>

						<!-- Search Input -->
						<div class="flex-1 relative">
							<input
								type="text"
								bind:value={searchQuery}
								on:keydown={handleKeydown}
								placeholder="Search university..."
								class="w-full h-12 px-4 text-slate-900 placeholder:text-slate-400 font-medium outline-none bg-transparent"
							/>
							{#if searchQuery && showSearchResults}
								<ul
									class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden text-left z-50 animate-in fade-in slide-in-from-top-2 duration-200"
								>
									{#each filteredUniversities as university, i}
										<li>
											<button
												class="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-50 transition-colors {i ===
												selectedIndex
													? 'bg-blue-50'
													: ''}"
												on:click={() => handleUniversitySelect(university.slug)}
											>
												<span class="font-bold text-slate-900">{university.name}</span>
												<span class="text-xs font-medium text-slate-400">View Portal &rarr;</span>
											</button>
										</li>
									{/each}
								</ul>
							{/if}
						</div>

						<!-- Search Button Icon -->
						<button
							class="w-12 h-12 flex items-center justify-center bg-[#0052CC] text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
						>
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2.5"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/></svg
							>
						</button>
					</div>

					<!-- Start Simulation Link (Secondary) -->
					<div class="mt-6">
						<button
							on:click={handleStartSimulationClick}
							class="text-sm font-bold text-slate-500 hover:text-[#0052CC] transition-colors underline decoration-slate-300 underline-offset-4 hover:decoration-[#0052CC]"
						>
							Or run a full cycle simulation &rarr;
						</button>
					</div>
				</div>
			{:else}
				<!-- ACTIVE SIMULATION UI -->
				<div
					class="max-w-4xl mx-auto relative z-20 mt-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500"
				>
					<div class="flex items-center justify-between mb-4 px-2">
						<h2 class="text-xl font-bold text-slate-900">Admissions Inbox</h2>
						<button
							on:click={resetSimulation}
							class="text-sm text-red-600 hover:text-red-700 font-semibold bg-red-50 px-3 py-1 rounded-full"
							>End Simulation</button
						>
					</div>

					<div class="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
						{#if applicationPhase !== 'finished' && $userProfile.isSubmitting}
							<div class="p-12 text-center space-y-4">
								<div class="inline-block animate-spin text-[#0052CC]">
									<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24"
										><circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle><path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path></svg
									>
								</div>
								<p class="text-slate-500 font-medium">Connecting to portals...</p>
							</div>
						{:else}
							<AdmitMail
								bind:inboxSection
								{viewMode}
								{activeFolder}
								searchQuery={inboxSearchQuery}
								{filteredPortals}
								{sortedVisiblePortals}
								{visiblePortals}
								{currentEdPortal}
								{edEmailMustBeViewed}
								{hasViewedEdEmail}
								{readPortalSlugs}
								{selectedPortal}
								{selectedSent}
								{sentEmails}
								displayName={displayNameStr}
								displayEmail={displayEmailStr}
								{getReceivedLabel}
								{resetSimulation}
								selectPortal={handleSelectPortal}
								selectSent={handleSelectSent}
								{switchFolder}
								{openInboxList}
							/>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Social Proof Ribbon -->
			<div class="pt-8 flex items-center justify-center gap-6 opacity-80">
				<div class="flex -space-x-3">
					{#each Array(4) as _, i}
						<div
							class="w-10 h-10 rounded-full border-2 border-white bg-slate-200 relative overflow-hidden"
						>
							<img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="User" />
						</div>
					{/each}
				</div>
				<div class="flex flex-col items-start gap-0.5">
					<div class="flex gap-1 text-[#0052CC]">
						{#each Array(5) as _}
							<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"
								><path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/></svg
							>
						{/each}
					</div>
					<span class="text-xs font-semibold text-slate-500">Trusted by 500 students</span>
				</div>
			</div>
		</div>
	</section>

	<!-- PORTAL SIMULATION MOCKUP (DIFFERENTIATOR) -->
	<section class="py-24 bg-[#F0F7FF] relative overflow-hidden">
		<div class="max-w-[1200px] mx-auto px-6 relative z-10">
			<div class="mb-16 text-center max-w-2xl mx-auto space-y-4">
				<h2 class="text-3xl font-bold tracking-tight text-slate-900">Free Portal Simulator.</h2>
				<p class="text-lg text-slate-500">
					Experience the heart-pounding moment of status updates <span
						class="font-bold text-[#0052CC]">entirely for free</span
					>. No signup required to try.
				</p>
			</div>

			<!-- Window-in-Window UI -->
			<div class="relative max-w-5xl mx-auto">
				<!-- Base Window: Browser -->
				<div
					class="bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden relative z-10 select-none"
				>
					<!-- Browser Bar -->
					<div class="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-3">
						<div class="flex gap-1.5">
							<div class="w-3 h-3 rounded-full bg-red-400/80"></div>
							<div class="w-3 h-3 rounded-full bg-amber-400/80"></div>
							<div class="w-3 h-3 rounded-full bg-green-400/80"></div>
						</div>
						<div class="flex-1 text-center">
							<div
								class="bg-white border border-slate-200 rounded-md px-3 py-1 text-[10px] text-slate-400 inline-block w-64 shadow-sm"
							>
								portal.harvard.edu/status
							</div>
						</div>
					</div>
					<!-- Content: Portal -->
					<div class="bg-white p-8 md:p-12 min-h-[400px] relative">
						<!-- Header -->
						<div class="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
							<div class="flex items-center gap-3">
								<div
									class="w-10 h-10 bg-[#A51C30] text-white flex items-center justify-center font-serif font-bold text-xl rounded-md"
								>
									H
								</div>
								<span class="font-bold text-slate-900">Harvard College</span>
							</div>
							<div class="text-xs font-semibold text-slate-500">Applicant ID: 8900421</div>
						</div>

						<!-- Status Update Alert -->
						<div
							class="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 flex items-start gap-4"
						>
							<div class="p-2 bg-blue-100 rounded-lg text-blue-600">
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/></svg
								>
							</div>
							<div>
								<h3 class="font-bold text-slate-900 text-sm">Status Update Available</h3>
								<p class="text-xs text-slate-500 mt-1">
									An update to your application was posted on March 27.
								</p>
								<div class="mt-3">
									<span class="text-xs font-bold text-[#0052CC] hover:underline cursor-pointer"
										>View Update &rarr;</span
									>
								</div>
							</div>
						</div>

						<!-- Background elements to make it look active -->
						<div class="space-y-4 opacity-50 blur-[1px]">
							<div class="h-4 bg-slate-100 rounded w-3/4"></div>
							<div class="h-4 bg-slate-100 rounded w-1/2"></div>
							<div class="h-32 bg-slate-50 rounded-xl border border-slate-100 w-full"></div>
						</div>

						<!-- Overlay (Glassmorphism) -->
						<div
							class="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center"
						>
							<div
								class="bg-white/90 p-8 rounded-2xl shadow-xl border border-white/50 text-center max-w-sm"
							>
								<h4 class="font-bold text-slate-900 mb-2">Simulated Decision</h4>
								<p class="text-sm text-slate-500 mb-6">
									This is just a drill. The outcome is generated by our AI based on your profile
									stats.
								</p>
								<button
									class="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
								>
									Reveal Decision
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Decorative Background Blurs -->
				<div
					class="absolute -top-10 -right-10 w-32 h-32 bg-blue-400 rounded-full blur-[80px] opacity-40"
				></div>
				<div
					class="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400 rounded-full blur-[80px] opacity-40"
				></div>
			</div>
		</div>
	</section>

	<!-- FEATURE BENTO GRID -->
	<section class="py-24 bg-white">
		<div class="max-w-[1200px] mx-auto px-6">
			<!-- PREDICTADMIT PRO FEATURE GRID -->
			<section class="py-32 bg-slate-50 relative overflow-hidden">
				<!-- Background Accents -->
				<div
					class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-100/30 rounded-full blur-3xl -z-10"
				></div>

				<div class="max-w-[1200px] mx-auto px-6">
					<div class="text-center mb-20 space-y-4">
						<h2 class="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
							The Ultimate Admissions Toolkit.
						</h2>
						<p class="text-lg text-slate-500 max-w-2xl mx-auto">
							Master your story with the same tools used by the pros. Build your application with
							confidence.
						</p>
					</div>

					<!-- BENTO GRID -->
					<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
						<!-- CARD 1: IDE (Double width) -->
						<div
							class="md:col-span-2 md:row-span-2 bg-slate-900 rounded-3xl p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border border-slate-800"
						>
							<div class="relative z-10 h-full flex flex-col">
								<div class="mb-auto">
									<span
										class="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase rounded-md mb-4"
										>Pro Tool</span
									>
									<h3 class="text-3xl font-bold text-white mb-2">Essay Superstation.</h3>
									<p class="text-slate-400 text-sm leading-relaxed max-w-sm">
										Write, edit, and perfect your essays in our distraction-free IDE. Get instant AI
										feedback on structure and tone without leaving the page.
									</p>
								</div>

								<!-- Mock IDE UI -->
								<div
									class="mt-8 bg-slate-800 rounded-t-xl border border-slate-700 p-4 font-mono text-xs text-slate-300 shadow-2xl translate-y-4 group-hover:translate-y-2 transition-transform duration-500"
								>
									<div class="flex items-center gap-2 mb-3 border-b border-slate-700 pb-2">
										<div class="w-2 h-2 rounded-full bg-red-400"></div>
										<div class="w-2 h-2 rounded-full bg-amber-400"></div>
										<div class="w-2 h-2 rounded-full bg-emerald-400"></div>
										<span class="ml-2 text-slate-500">harvard_supp.md</span>
									</div>
									<div class="space-y-1">
										<p>
											<span class="text-purple-400">const</span> story =
											<span class="text-green-400">"My unique journey..."</span>;
										</p>
										<p>
											<span class="text-blue-400">analyze</span>(story).<span
												class="text-yellow-400">then</span
											>(feedback =&gt; {'{'}
										</p>
										<p class="pl-4 text-slate-500">// AI feedback appears here</p>
										<p class="pl-4">improve_clarity();</p>
										<p>{'}'});</p>
									</div>
								</div>

								<div class="mt-6">
									<a
										href="/pro"
										class="inline-flex items-center gap-2 text-white font-bold text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
									>
										Open Editor <span class="text-lg">&rarr;</span>
									</a>
								</div>
							</div>
						</div>

						<!-- CARD 2: GRADER -->
						<div
							class="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl shadow-slate-100/50 flex flex-col justify-between hover:border-slate-200 transition-all group"
						>
							<div
								class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300"
							>
								<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div>
								<h3 class="text-xl font-bold text-slate-900 mb-2">AI Scorecard.</h3>
								<p class="text-xs text-slate-500 leading-relaxed mb-4">
									Know exactly where you stand. Ivy-trained AI grades your essays on 5 key
									institutional metrics.
								</p>
								<div class="flex items-center gap-2">
									<div class="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
										<div class="h-full bg-emerald-500 w-[85%]"></div>
									</div>
									<span class="text-xs font-bold text-slate-900">8.5/10</span>
								</div>
							</div>
						</div>

						<!-- CARD 3: DEEP DIVE -->
						<div
							class="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl shadow-slate-100/50 flex flex-col justify-between hover:border-slate-200 transition-all group"
						>
							<div
								class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300"
							>
								<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div>
								<h3 class="text-xl font-bold text-slate-900 mb-2">Application Analysis.</h3>
								<p class="text-xs text-slate-500 leading-relaxed">
									Understand the "Why". Get a full granular breakdown of your application's
									strengths and weaknesses.
								</p>
							</div>
						</div>

						<!-- CARD 4: PLANNER (Longer horizontal) -->
						<div
							class="md:col-span-2 bg-[#F0F7FF] rounded-3xl border border-blue-100 p-8 relative overflow-hidden group hover:border-blue-200 transition-all"
						>
							<div class="relative z-10 flex flex-col h-full justify-between">
								<div>
									<span
										class="inline-block px-3 py-1 bg-white text-blue-600 border border-blue-100 text-[10px] font-bold uppercase rounded-md mb-4 shadow-sm"
										>Pro Tool</span
									>
									<h3 class="text-2xl font-bold text-slate-900 mb-2">Strategy Map.</h3>
									<p class="text-slate-500 text-sm max-w-md">
										Connect the dots. Organize your entire admissions strategy, track narratives,
										and ensure you fit the specific institutional archetype for each school.
									</p>
								</div>
								<div class="pt-6">
									<a
										href="/pro"
										class="text-sm font-bold text-blue-600 flex items-center gap-2 group-hover:gap-3 transition-all"
										>Start Planning <span class="text-lg">&rarr;</span></a
									>
								</div>
							</div>

							<!-- Decorative "Map" elements -->
							<div
								class="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 opacity-10 group-hover:opacity-20 transition-opacity"
							>
								<svg
									viewBox="0 0 100 100"
									fill="none"
									stroke="currentColor"
									class="text-blue-600 w-full h-full rotate-12"
								>
									<path stroke-width="0.5" d="M10 10 L40 40 L30 80 L80 20" />
									<circle cx="10" cy="10" r="2" fill="currentColor" />
									<circle cx="40" cy="40" r="2" fill="currentColor" />
									<circle cx="30" cy="80" r="2" fill="currentColor" />
									<circle cx="80" cy="20" r="2" fill="currentColor" />
								</svg>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- PRO COMPARISON TABLE -->
			<section class="py-24 bg-slate-50 border-t border-slate-200">
				<div class="max-w-[1000px] mx-auto px-6">
					<div class="text-center mb-16">
						<h2 class="text-3xl font-black text-slate-900 mb-4">Why Go Pro?</h2>
						<p class="text-slate-500">The competition pays thousands. You pay less than a lunch.</p>
					</div>

					<div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
						<div
							class="grid grid-cols-4 bg-slate-50 border-b border-slate-100 p-4 text-xs font-bold uppercase tracking-widest text-slate-500"
						>
							<div class="col-span-2">Feature</div>
							<div class="text-center text-[#0052CC]">PredictAdmit Pro</div>
							<div class="text-center">Private Consultant</div>
						</div>

						<!-- Row 1 -->
						<div
							class="grid grid-cols-4 p-6 border-b border-slate-50 items-center hover:bg-slate-50/50 transition-colors"
						>
							<div class="col-span-2 font-bold text-slate-900">Unlimited Essay Grading</div>
							<div class="text-center text-[#0052CC] font-bold text-lg">✓</div>
							<div class="text-center text-slate-300 font-bold text-lg">✗</div>
						</div>
						<!-- Row 2 -->
						<div
							class="grid grid-cols-4 p-6 border-b border-slate-50 items-center hover:bg-slate-50/50 transition-colors"
						>
							<div class="col-span-2 font-bold text-slate-900">
								Detailed AI "Deep Dive" Analysis
							</div>
							<div class="text-center text-[#0052CC] font-bold text-lg">✓</div>
							<div class="text-center text-slate-900 font-medium">$250/hr</div>
						</div>
						<!-- Row 3 -->
						<div
							class="grid grid-cols-4 p-6 border-b border-slate-50 items-center hover:bg-slate-50/50 transition-colors"
						>
							<div class="col-span-2 font-bold text-slate-900">Application Strategy Map</div>
							<div class="text-center text-[#0052CC] font-bold text-lg">✓</div>
							<div class="text-center text-slate-900 font-medium">$5,000+</div>
						</div>
						<!-- Row 4 -->
						<div
							class="grid grid-cols-4 p-6 border-b border-slate-50 items-center hover:bg-slate-50/50 transition-colors"
						>
							<div class="col-span-2 font-bold text-slate-900">Research Opportunities Hub</div>
							<div class="text-center text-[#0052CC] font-bold text-lg">✓</div>
							<div class="text-center text-slate-300 font-bold text-lg">✗</div>
						</div>
						<!-- Price Row -->
						<div class="grid grid-cols-4 p-6 bg-[#F0F7FF] items-center">
							<div class="col-span-2 font-bold text-slate-900 text-lg">Monthly Cost</div>
							<div class="text-center text-[#0052CC] font-black text-2xl">$5</div>
							<div
								class="text-center text-slate-500 font-medium strike-through decoration-slate-400"
							>
								$2,000+
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- START SIMULATION (APP ENTRY) -->
			<section id="simulation-start" class="py-24 bg-white border-t border-slate-100">
				<div class="max-w-[800px] mx-auto px-6 text-center space-y-8">
					<div class="space-y-4">
						<h2 class="text-3xl font-bold text-slate-900">Ready to see your future?</h2>
						<p class="text-slate-500">
							Create a temporary profile to begin the simulation. Your data is not stored
							permanently unless you upgrade.
						</p>
					</div>

					<div
						class="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-left max-w-md mx-auto"
					>
						{#if showAccountForm}
							<form on:submit={handleSubmit} class="space-y-5">
								<div class="space-y-4">
									<div>
										<label for="name" class="block text-xs font-bold uppercase text-slate-500 mb-1"
											>Applicant Name</label
										>
										<div class="flex gap-2">
											<input
												id="name"
												type="text"
												bind:value={name}
												placeholder="e.g. Jordan Lee"
												class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
											<button
												type="button"
												on:click={generateFakeCredentials}
												class="text-xs font-bold text-[#0052CC] hover:underline px-2"
												>Auto-fill</button
											>
										</div>
									</div>
									<div>
										<label for="email" class="block text-xs font-bold uppercase text-slate-500 mb-1"
											>Fake Email</label
										>
										<input
											id="email"
											type="email"
											bind:value={email}
											placeholder="jordan.lee@example.com"
											class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div class="relative">
										<label
											for="password"
											class="block text-xs font-bold uppercase text-slate-500 mb-1"
											>Fake Password</label
										>
										<input
											id="password"
											type={showPassword ? 'text' : 'password'}
											bind:value={password}
											placeholder="••••••••"
											class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>

								<div class="pt-2">
									<button
										type="submit"
										on:click={handleApply}
										class="w-full py-3 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
									>
										Start Application Cycle
									</button>
									<p class="text-[10px] text-center text-slate-400 mt-3">
										By clicking Start, you agree to our terms. This is a simulation.
									</p>
								</div>
							</form>
						{:else}
							<div class="text-center py-8 space-y-6">
								<div
									class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#0052CC]"
								>
									<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 4v16m8-8H4"
										/></svg
									>
								</div>
								<p class="text-sm text-slate-600">
									The Simulator is always free. We fund it through our Pro tools.
								</p>
								<button
									on:click={() => (showAccountForm = true)}
									class="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
								>
									Start Free Simulation
								</button>
							</div>
						{/if}
					</div>
				</div>
			</section>

			<!-- TESTIMONIAL (NAVY) -->
			<section class="py-24 bg-[#001F3F] text-white">
				<div class="max-w-[1200px] mx-auto px-6 text-center">
					<div class="max-w-3xl mx-auto space-y-8">
						<div class="flex justify-center text-[#0052CC]">
							{#each Array(5) as _}
								<svg class="w-6 h-6 fill-current" viewBox="0 0 20 20"
									><path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/></svg
								>
							{/each}
						</div>
						<blockquote class="text-2xl md:text-4xl font-serif leading-relaxed opacity-90">
							"ts was lowkenuinely accurate"
						</blockquote>
						<div class="pt-4">
							<div class="font-bold">Miao S.</div>
							<div class="text-sm text-slate-400">Accepted to Northwestern '30</div>
						</div>
					</div>
				</div>
			</section>

			<SiteFooter />
		</div>
	</section>
</main>
