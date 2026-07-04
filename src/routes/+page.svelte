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

	// First-time simulation disclosure: shown once before the first portal visit
	// launched from the home-page search, then remembered in localStorage.
	const DISCLOSURE_ACK_KEY = 'predictadmit:simDisclosureAck';
	let showSimDisclosure = false;
	let pendingPortalSlug: string | null = null;

	function hasAcknowledgedDisclosure(): boolean {
		try {
			return localStorage.getItem(DISCLOSURE_ACK_KEY) === '1';
		} catch {
			return true; // storage unavailable — don't trap the user in the modal
		}
	}

	function acknowledgeSimDisclosure() {
		try {
			localStorage.setItem(DISCLOSURE_ACK_KEY, '1');
		} catch {
			// ignore — worst case the notice shows again next time
		}
		showSimDisclosure = false;
		if (pendingPortalSlug) {
			const slug = pendingPortalSlug;
			pendingPortalSlug = null;
			goto(`/portals/${slug}`);
		}
	}

	function dismissSimDisclosure() {
		showSimDisclosure = false;
		pendingPortalSlug = null;
	}

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
			updatedDecisions[existingIndex] = {
				...updatedDecisions[existingIndex],
				outcome: status,
				source: 'manual'
			};
		} else {
			const newDecision: AiDecision = {
				school: schoolConfig.schoolName,
				slug: slug,
				outcome: status,
				source: 'manual',
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
		searchQuery = '';
		showSearchResults = false;

		if (!hasAcknowledgedDisclosure()) {
			pendingPortalSlug = slug;
			showSimDisclosure = true;
			return;
		}
		goto(`/portals/${slug}`);
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
			source: 'manual' as const,
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
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}, 100);
	};

	const resetSimulation = () => {
		applyTimeoutIds.forEach((id) => clearTimeout(id));
		userProfile.update((u) => ({ ...u, isSubmitting: false }));
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
	<title>PredictAdmit - T20 Admissions Simulator.</title>
	<meta
		name="description"
		content="Master your college application cycle with the world's most advanced admissions simulator."
	/>
</svelte:head>

<!-- MARKETING LANDING PAGE -->
<main class="font-sans text-slate-900 bg-white selection:bg-blue-100 selection:text-blue-900">
	<!-- HERO SECTION -->
	<section class="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-[#FAFAFA]">
		<div class="max-w-[1200px] mx-auto px-6 text-center relative z-10 flex flex-col items-center">
			<!-- Headline -->
			<div class="space-y-6 max-w-4xl mx-auto mb-12">
				<h1
					class="text-6xl md:text-[5.5rem] font-bold tracking-tighter leading-[0.95] text-slate-900 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both"
				>
					Simulate Any <br class="hidden md:block" /> University Portal.
				</h1>
				<p
					class="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-snug tracking-tight font-medium mt-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-[200ms] fill-mode-both"
				>
					Experience perfectly realistic college admission portals — and make your application as
					strong as it can be with our free tools.
				</p>
			</div>

			<!-- Search Bar + Simulation Button -->
			<!-- Search Bar + Simulation Button OR Simulation Interface -->
			{#if !hasApplied}
				<div
					class="w-full max-w-xl mx-auto relative z-20 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 fill-mode-both"
				>
					<div
						class="flex items-center gap-2 p-1.5 bg-white rounded-full border border-slate-200 shadow-sm relative transition-all focus-within:ring-4 focus-within:ring-slate-100 focus-within:border-slate-300"
					>
						<!-- Mode Selector (Accept/Deny) -->
						<div class="relative flex-shrink-0 h-12">
							<select
								bind:value={$manualOverrideMode}
								class="appearance-none h-full pl-5 pr-9 bg-slate-50 font-bold text-sm text-slate-900 rounded-full border border-slate-100 hover:border-slate-200 transition-colors focus:outline-none cursor-pointer"
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
							aria-label="Search"
							class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-slate-900 text-white rounded-full hover:bg-black transition-all shadow-sm transform active:scale-95"
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
					<div class="mt-8">
						<button
							on:click={handleStartSimulationClick}
							class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors group"
						>
							Or run a full cycle simulation <span
								class="group-hover:translate-x-1 transition-transform">&rarr;</span
							>
						</button>
					</div>
				</div>
			{:else}
				<!-- ACTIVE SIMULATION UI -->
				<div
					class="max-w-4xl mx-auto relative z-20 mt-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500"
				>
					<div class="flex items-center justify-between gap-4 mb-8 md:mb-12 px-2">
						<h2 class="text-xl font-bold text-slate-900">Admissions Inbox</h2>
						<button
							on:click={resetSimulation}
							class="text-sm text-red-600 hover:text-red-700 font-semibold bg-red-50 px-3 py-1 rounded-full"
							>End Simulation</button
						>
					</div>

					<div class="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200/80">
						{#if visiblePortals.length === 0 && $userProfile.isSubmitting}
							<div class="p-8 flex flex-col items-center justify-center gap-4">
								<svg
									class="w-12 h-12 text-blue-500 animate-spin"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
								<p class="text-slate-600 font-medium">Submitting your application...</p>
							</div>
						{:else}
							<AdmitMail
								bind:inboxSection
								{viewMode}
								{activeFolder}
								searchQuery={inboxSearchQuery}
								{filteredPortals}
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
							/>{/if}
					</div>
				</div>
			{/if}

			<!-- Social Proof Ribbon -->
			<div
				class="pt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both"
			>
				<div class="flex -space-x-2">
					<div
						class="w-8 h-8 rounded-full border-2 border-white bg-[#B2D8C9] relative overflow-hidden shadow-sm transition-transform hover:-translate-y-1 hover:z-10"
					>
						<img
							src="/apple_memoji_1.png"
							alt="Student 1"
							class="w-full h-full object-cover scale-[1.35] mt-0.5"
						/>
					</div>
					<div
						class="w-8 h-8 rounded-full border-2 border-white bg-[#E3A5A5] relative overflow-hidden shadow-sm transition-transform hover:-translate-y-1 hover:z-10"
					>
						<img
							src="/apple_memoji_2.png"
							alt="Student 2"
							class="w-full h-full object-cover scale-[1.35] mt-0.5"
						/>
					</div>
					<div
						class="w-8 h-8 rounded-full border-2 border-white bg-[#E9B681] relative overflow-hidden shadow-sm transition-transform hover:-translate-y-1 hover:z-10"
					>
						<img
							src="/apple_memoji_3.png"
							alt="Student 3"
							class="w-full h-full object-cover scale-[1.35] mt-0.5"
						/>
					</div>
					<div
						class="w-8 h-8 rounded-full border-2 border-white bg-[#A7BCE6] relative overflow-hidden shadow-sm transition-transform hover:-translate-y-1 hover:z-10"
					>
						<img
							src="/apple_memoji_4.png"
							alt="Student 4"
							class="w-full h-full object-cover scale-[1.35] mt-0.5"
						/>
					</div>
				</div>
				<div class="flex flex-col items-center md:items-start justify-center gap-0.5 mt-2 md:mt-0">
					<div class="flex gap-1 text-[#0052CC]">
						{#each Array(5) as _}
							<svg class="w-4 h-4 fill-current drop-shadow-sm" viewBox="0 0 20 20">
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
						{/each}
					</div>
					<span class="text-xs font-semibold text-slate-500">Trusted by 5,000+</span>
				</div>
			</div>
		</div>
	</section>

	<!-- SECTION 1: FREE SIMULATOR -->
	<section class="py-32 bg-white relative overflow-hidden">
		<div class="max-w-[1200px] mx-auto px-6 relative z-10">
			<!-- Headline -->
			<div class="text-center max-w-2xl mx-auto mb-20 space-y-6">
				<h2 class="text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 leading-[1.05]">
					Free Portals. <br /> AI Simulations.
				</h2>
				<p class="text-lg text-slate-500">
					Experience the rush of decision day without the risk. <span
						class="text-[#0052CC] font-bold">100% Free.</span
					>
				</p>
			</div>

			<!-- Window-in-Window UI -->
			<div class="relative max-w-5xl mx-auto group perspective-1000">
				<!-- Base Window: Browser -->
				<div
					class="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200/60 overflow-hidden relative z-10 select-none animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]"
				>
					<!-- Browser Bar -->
					<div
						class="bg-slate-50/50 px-4 py-3 flex items-center gap-3 border-b border-slate-100/50"
					>
						<div class="flex gap-1.5">
							<div class="w-3 h-3 rounded-full bg-slate-300"></div>
							<div class="w-3 h-3 rounded-full bg-slate-300"></div>
							<div class="w-3 h-3 rounded-full bg-slate-300"></div>
						</div>
						<div class="flex-1 text-center">
							<div
								class="bg-white border border-slate-200/60 rounded-md px-4 py-1.5 text-[11px] font-medium text-slate-400 inline-block w-64 shadow-sm"
							>
								portal.harvard.edu/status
							</div>
						</div>
					</div>
					<!-- Content: Portal -->
					<div class="bg-white p-8 md:p-12 min-h-[450px] relative">
						<!-- Header -->
						<div class="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
							<div class="flex items-center gap-4">
								<div
									class="w-12 h-12 bg-[#A51C30] text-white flex items-center justify-center font-serif font-bold text-2xl rounded-lg shadow-sm"
								>
									H
								</div>
								<span class="font-bold tracking-tight text-xl text-slate-900">Harvard College</span>
							</div>
							<div class="text-xs font-semibold uppercase tracking-wider text-slate-400">
								Applicant ID: 7413268
							</div>
						</div>

						<!-- Status Update Alert -->
						<div
							class="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 flex items-start gap-4"
						>
							<div class="p-2 bg-white border border-slate-200 shadow-sm rounded-xl text-slate-600">
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
								<h3 class="font-bold tracking-tight text-slate-900">Status Update Available</h3>
								<p class="text-sm text-slate-500 mt-1">
									An update to your application was posted on March 27.
								</p>
								<div class="mt-3">
									<span
										class="text-xs font-bold uppercase tracking-widest text-[#0052CC] hover:text-blue-700 cursor-pointer"
										>View Update &rarr;</span
									>
								</div>
							</div>
						</div>

						<!-- Background elements -->
						<div class="space-y-4 opacity-40">
							<div class="h-4 bg-slate-100 rounded-full w-3/4"></div>
							<div class="h-4 bg-slate-100 rounded-full w-1/2"></div>
							<div class="h-32 bg-slate-50 rounded-2xl border border-slate-100 w-full mt-8"></div>
						</div>

						<!-- CTA OVERLAY -->
						<div
							class="absolute inset-0 flex items-center justify-center z-20 bg-white/40 backdrop-blur-[2px]"
						>
							<div class="bg-white p-3 rounded-3xl border border-slate-200/80 shadow-2xl">
								<button
									on:click={handleStartSimulationClick}
									class="px-8 py-4 bg-slate-900 text-white text-sm tracking-wide font-bold rounded-full hover:bg-black transition-all shadow-md active:scale-95"
								>
									Start Simulation
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Glows removed entirely -->
			</div>
		</div>
	</section>

	<!-- SECTION 2: PRO WORKSHOP -->
	<section class="py-32 bg-white border-t border-slate-100">
		<div class="max-w-[1200px] mx-auto px-6">
			<div class="grid lg:grid-cols-2 gap-20 items-center">
				<!-- Text Content -->
				<div class="space-y-8 max-w-xl">
					<span
						class="inline-block px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full"
						>PredictAdmit Pro</span
					>
					<h2 class="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 leading-[1.05]">
						Ivy League Essay <br /> Workshop.
					</h2>
					<p class="text-lg text-slate-500 leading-relaxed font-medium tracking-tight">
						An advanced workshop, tailored per school, that takes in everything in your application
						to help you craft essays perfectly tailored to you.
					</p>

					<ul class="space-y-5 pt-4">
						{#each ['Institutional Archtype Analysis', 'Deep-Dive Essay Grading', 'Application Strategy Mapping'] as feature}
							<li class="flex items-center gap-3 text-slate-700 font-medium tracking-tight">
								<div
									class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200/60"
								>
									<svg
										class="w-3.5 h-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="3"
										><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg
									>
								</div>
								{feature}
							</li>
						{/each}
					</ul>

					<div class="pt-8">
						<a
							href="/pro"
							class="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#0052CC] hover:text-blue-700 hover:gap-3 transition-all"
						>
							Enter Workshop <span class="text-xl">&rarr;</span>
						</a>
					</div>
				</div>

				<!-- Visual: Pro Dashboard Mockup -->
				<div class="relative group perspective-1000">
					<!-- Glow effect on hover -->
					<div
						class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
					></div>
					<div
						class="relative bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200/60 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]"
					>
						<!-- Top Bar -->
						<div
							class="bg-white border-b border-slate-100 flex items-center px-4 py-3 justify-between"
						>
							<div class="flex items-center gap-2">
								<div class="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
								<span class="text-xs font-bold text-slate-900 tracking-tight"
									>Predict Admit Pro</span
								>
							</div>
							<div class="flex items-center gap-2">
								<div
									class="px-2 py-1 rounded bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-500"
								>
									Edit Profile
								</div>
								<div class="w-6 h-6 rounded-full bg-slate-100"></div>
							</div>
						</div>

						<!-- Dashboard Layout -->
						<div class="flex h-[320px] bg-slate-50">
							<!-- Main Content -->
							<div class="flex-1 p-4 flex flex-col gap-4 overflow-hidden relative">
								<!-- Get Started Row -->
								<div>
									<div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
										Get Started
									</div>
									<div class="flex gap-2">
										<div
											class="flex-1 bg-white border border-slate-200 rounded-lg p-3 h-20 relative overflow-hidden"
										>
											<div class="text-[11px] font-bold text-slate-800">Complete Profile</div>
											<div class="text-[9px] text-slate-400 mb-2">Enter GPA & test scores</div>
											<div class="flex gap-1 absolute bottom-3 w-full pr-6 opacity-40">
												<div class="h-2 w-1/3 bg-slate-200 rounded"></div>
												<div class="h-2 w-1/2 bg-slate-200 rounded"></div>
											</div>
										</div>
										<div
											class="flex-1 bg-white border border-slate-200 rounded-lg p-3 h-20 relative overflow-hidden"
										>
											<div class="text-[11px] font-bold text-slate-800">Import Activities</div>
											<div class="text-[9px] text-slate-400 mb-2">Add your extracurriculars</div>
											<div
												class="absolute bottom-3 left-3 right-3 h-4 border border-dashed border-slate-300 rounded flex items-center justify-center bg-slate-50 opacity-60"
											>
												<div class="h-1 w-8 bg-slate-300 rounded"></div>
											</div>
										</div>
									</div>
								</div>

								<!-- Explore Row -->
								<div>
									<div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
										Explore Features
									</div>
									<div class="flex gap-2">
										<div class="flex-1 bg-blue-50/50 border border-blue-100 rounded-lg p-3 h-20">
											<div class="text-[11px] font-bold text-blue-900 mt-2">Outcome Predictor</div>
											<div class="text-[9px] text-blue-700/60 mt-0.5">See your chances</div>
										</div>
										<div
											class="flex-1 bg-purple-50/50 border border-purple-100 rounded-lg p-3 h-20"
										>
											<div class="text-[11px] font-bold text-purple-900 mt-2">Mind Map</div>
											<div class="text-[9px] text-purple-700/60 mt-0.5">Brainstorm topics</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Right Sidebar -->
							<div class="w-32 bg-slate-50 border-l border-slate-200 p-4 flex flex-col gap-4">
								<div class="bg-white border border-slate-200 rounded-md p-3 shadow-sm">
									<div
										class="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1 border-b border-slate-100 pb-1"
									>
										Acad. Index
									</div>
									<div class="text-xl font-black text-[#0052CC] leading-none mt-2">214</div>
									<div class="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
										<div class="bg-[#0052CC] h-full" style="width: 89%"></div>
									</div>
								</div>

								<div class="bg-white border border-slate-200 rounded-md p-3 shadow-sm">
									<div
										class="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-100 pb-1"
									>
										Holistic
									</div>
									<div class="space-y-1.5 mt-2">
										<div class="flex items-center gap-1">
											<div class="w-3 text-[8px] text-slate-400">A</div>
											<div class="flex-1 h-1 bg-blue-500 rounded-full"></div>
										</div>
										<div class="flex items-center gap-1">
											<div class="w-3 text-[8px] text-slate-400">E</div>
											<div class="flex-1 h-1 bg-purple-500 rounded-full w-3/4"></div>
										</div>
										<div class="flex items-center gap-1">
											<div class="w-3 text-[8px] text-slate-400">P</div>
											<div class="flex-1 h-1 bg-amber-400 rounded-full w-1/2"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- START SIMULATION (APP ENTRY) -->
	<section id="simulation-start" class="py-24 bg-white border-t border-slate-100">
		<div class="max-w-[800px] mx-auto px-6 text-center space-y-8">
			<div class="space-y-4">
				<h2 class="text-3xl font-bold text-slate-900">Ready to begin?</h2>
				<p class="text-slate-500">
					Create a temporary profile to start your free simulation or upgrade for the full workshop.
				</p>
			</div>

			<div
				class="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/80 text-left max-w-md mx-auto"
			>
				{#if showAccountForm}
					<form on:submit={handleSubmit} class="space-y-6">
						<div class="space-y-5">
							<div>
								<label
									for="name"
									class="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2"
									>Applicant Name</label
								>
								<div class="flex gap-2 relative">
									<input
										id="name"
										type="text"
										bind:value={name}
										placeholder="e.g. Jordan Lee"
										class="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all font-medium placeholder:text-slate-400"
									/>
									<button
										type="button"
										on:click={generateFakeCredentials}
										class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm transition-colors"
										>Auto-fill</button
									>
								</div>
							</div>
							<div>
								<label
									for="email"
									class="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2"
									>Fake Email</label
								>
								<input
									id="email"
									type="email"
									bind:value={email}
									placeholder="jordan.lee@example.com"
									class="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all font-medium placeholder:text-slate-400"
								/>
							</div>
							<div class="relative">
								<label
									for="password"
									class="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2"
									>Fake Password</label
								>
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									bind:value={password}
									placeholder="••••••••"
									class="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all font-medium placeholder:text-slate-400"
								/>
							</div>
						</div>

						<div class="pt-4">
							<button
								type="submit"
								on:click={handleApply}
								class="w-full py-3.5 bg-slate-900 text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-black transition-all shadow-sm active:scale-95"
							>
								Start Application Cycle
							</button>
							<p class="text-[10px] text-center text-slate-400 mt-3">
								By clicking Start, you agree to our terms. This is a simulation.
							</p>
						</div>
					</form>
				{:else}
					<div class="text-center py-6 space-y-6">
						<div
							class="w-16 h-16 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-600 shadow-sm"
						>
							<svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4v16m8-8H4"
								/></svg
							>
						</div>
						<p class="text-sm text-slate-500 font-medium">
							The Simulator is always free. We fund it through our Pro tools.
						</p>
						<button
							on:click={() => (showAccountForm = true)}
							class="w-full py-3.5 bg-slate-900 text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-black transition-all shadow-sm active:scale-95"
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
</main>

{#if showSimDisclosure}
	<div
		class="fixed inset-0 z-[10000] flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="sim-disclosure-title"
	>
		<div class="absolute inset-0 bg-black/50 backdrop-blur-sm" on:click={dismissSimDisclosure}></div>
		<div class="relative z-10 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl md:p-8">
			<p
				id="sim-disclosure-title"
				class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500"
			>
				Important disclosure — simulation only
			</p>
			<p class="text-[13px] leading-relaxed text-slate-600">
				PredictAdmit is an independent educational tool and is <strong>not affiliated with,
				endorsed by, sponsored by, or connected to</strong> any college or university shown on this
				site. Every portal, status page, and decision letter here is a
				<strong>fictional simulation</strong> created for practice and preparation. Nothing on this
				page is an official communication from any institution, and no simulated outcome reflects,
				predicts, or affects any real application or admission decision. University names and marks
				are the property of their respective owners and are used solely to identify the institution
				being simulated. PredictAdmit does not access, connect to, or interact with any
				university's actual application systems or applicant data. If you represent an institution
				and have questions or concerns, please
				<a href="/contact" class="font-semibold text-[#0052CC] underline hover:text-[#003d99]"
					>contact us</a
				>.
			</p>
			<div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				<button
					type="button"
					on:click={dismissSimDisclosure}
					class="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
				>
					Cancel
				</button>
				<button
					type="button"
					on:click={acknowledgeSimDisclosure}
					class="rounded-lg bg-[#0052CC] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0052CC]/20 transition-colors hover:bg-[#003d99]"
				>
					I understand — view the simulation →
				</button>
			</div>
		</div>
	</div>
{/if}
