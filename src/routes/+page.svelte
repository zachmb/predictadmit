<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userProfile } from '$lib/stores/user';
	import AI from '$lib/components/common/AI.svelte';
	import type { UserProfile } from '$lib/stores/user';
	import { aiResults, manualOverrideMode, type OverrideMode } from '$lib/stores/results';

	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import ApplicationTimeline from '$lib/components/home/ApplicationTimeline.svelte';
	import AdmitMail from '$lib/components/AdmitMail.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';

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
				// If nothing selected but results exist, auto-select top result on Enter?
				// User usually expects this from search bars.
				handleUniversitySelect(filteredUniversities[0].slug);
			}
		} else if (e.key === 'Escape') {
			showSearchResults = false;
		}
	};

	// Navigate to portal
	const handleUniversitySelect = (slug: string) => {
		// Check override mode
		const mode = $manualOverrideMode;
		if (mode !== 'random') {
			sessionStorage.setItem(`decision-${slug}`, mode === 'accepted' ? 'admit' : 'deny');
		}

		// Navigate directly to the portal page
		// (Portals handle their own auth/login state)
		goto(`/portals/${slug}`);

		searchQuery = '';
		showSearchResults = false;
	};

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

	let name = '';
	let email = '';
	let password = '';
	let saveMessage = '';

	// Search query for admitMail inbox
	let inboxSearchQuery = '';

	// Filtered view based on search
	let filteredPortals: PortalEmail[] = [];

	// Inbox auto-scroll
	let inboxSection: HTMLElement | null = null;
	let hasAutoScrolledToInbox = false;

	// Sorted view of visible portals (newest first)
	let sortedVisiblePortals: PortalEmail[] = [];

	let selectedPortal: PortalEmail | null = null;
	let selectedSent: SentEmail | null = null;

	// Which folder is active in the mail sidebar
	let activeFolder: 'inbox' | 'sent' = 'inbox';

	// Are we looking at the list or a full email view?
	let viewMode: 'inbox' | 'email' = 'inbox';

	// Track which inbox emails have been "read" (clicked)
	let readPortalSlugs: Set<string> = new Set();

	// Application flow state
	let showAccountForm = false;
	let showPassword = false;

	// AI hero state
	let aiExpanded = false;

	const handleAiGetStarted = () => {
		aiExpanded = true;
	};

	const handleStartSimulationClick = () => {
		showAccountForm = true;
	};

	// Generate fake credentials automatically
	const generateFakeCredentials = () => {
		const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn'];
		const lastNames = [
			'Smith',
			'Johnson',
			'Williams',
			'Brown',
			'Jones',
			'Garcia',
			'Miller',
			'Davis'
		];

		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		const randomNum = Math.floor(Math.random() * 9999);

		name = `${firstName} ${lastName}`;
		email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@example.com`;
		password = `password${randomNum}`;

		saveMessage = 'Fake credentials generated!';
	};

	let hasApplied = false;
	let hasSavedProfile = false;
	let visiblePortals: PortalEmail[] = [];
	let isApplying = false;

	let applicationPhase: ApplicationPhase = 'idle';

	let calendarIndex = 0;
	let calendarIntervalId: number | null = null;

	// ED / REA choice
	let edChoiceSlug = '';
	let currentEdPortal: PortalEmail | null = null;
	let edEmailMustBeViewed = false;
	let hasViewedEdEmail = false;
	let edEmailRevealed = false;
	let rdTimelineStarted = false;

	// POPUP STATE
	let showSMMInvite = false;
	let hasViewedSMMInvite = false;

	// Timeouts used both for animation & email drip
	let applyTimeoutIds: number[] = [];

	// Apply button enabled?
	let canApply = false;

	const PERSIST_KEY = 'predictadmit_state_v1';

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
			console.error('Failed to persist PredictAdmit state', err);
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

			if (typeof state.calendarIndex === 'number') {
				calendarIndex = Math.min(Math.max(state.calendarIndex, 0), calendarDates.length - 1);
			}

			if (state.applicationPhase) {
				applicationPhase = state.applicationPhase;
			}

			if (typeof state.edChoiceSlug === 'string') {
				edChoiceSlug = state.edChoiceSlug;
			}

			if (typeof state.currentEdSlug === 'string' && state.currentEdSlug) {
				currentEdPortal = portals.find((p) => p.slug === state.currentEdSlug) ?? null;
			} else {
				currentEdPortal = null;
			}

			edEmailMustBeViewed = !!state.edEmailMustBeViewed;
			hasViewedEdEmail = !!state.hasViewedEdEmail;
			edEmailRevealed = !!state.edEmailRevealed;
			rdTimelineStarted = !!state.rdTimelineStarted;

			if (Array.isArray(state.visiblePortalSlugs)) {
				visiblePortals = state.visiblePortalSlugs
					.map((slug) => portals.find((p) => p.slug === slug) || null)
					.filter((p): p is PortalEmail => p !== null);
			}

			if (Array.isArray(state.readPortalSlugs)) {
				readPortalSlugs = new Set(state.readPortalSlugs);
			}

			// if we had a saved profile before, surface the account form again
			if (hasSavedProfile) {
				showAccountForm = true;
				aiExpanded = true;
			}
		} catch (err) {
			console.error('Failed to load PredictAdmit state', err);
		}
	};

	onMount(() => {
		loadState();
	});

	// Sync local fields with store
	$: {
		const profile: UserProfile = $userProfile;
		if (profile) {
			name = profile.name;
			email = profile.email;
			password = profile.password;
		}
	}

	$: canApply = Boolean(name.trim() && email.trim() && password);

	// Nice display strings for children
	$: displayNameStr = name.trim() || 'Applicant';
	$: displayEmailStr = email.trim() || 'you@example.com';

	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();

		const trimmedName = name.trim();
		const trimmedEmail = email.trim();

		userProfile.set({
			name: trimmedName,
			email: trimmedEmail,
			password // keep as typed
		});

		hasSavedProfile = true;
		saveMessage = 'Fake login saved.';
		showAccountForm = true;
		saveState();

		// Check if there's a pending portal navigation
		const pendingSlug = sessionStorage.getItem('pendingPortalSlug');
		if (pendingSlug) {
			sessionStorage.removeItem('pendingPortalSlug');
			setTimeout(() => {
				goto(`/portals/${pendingSlug}`);
			}, 100);
		}
	};

	// Save credentials without starting simulation
	const saveCredentialsOnly = () => {
		if (!name.trim() || !email.trim() || !password) {
			saveMessage = 'Please fill out all fields first.';
			return;
		}

		const trimmedName = name.trim();
		const trimmedEmail = email.trim();

		userProfile.set({
			name: trimmedName,
			email: trimmedEmail,
			password
		});

		hasSavedProfile = true;
		saveMessage = 'Credentials saved! You can now start the simulation.';
		saveState();
	};

	const handleSelectPortal = (portal: PortalEmail) => {
		selectedPortal = portal;
		selectedSent = null;
		activeFolder = 'inbox';
		viewMode = 'email';

		const next = new Set(readPortalSlugs);
		next.add(portal.slug);
		readPortalSlugs = next;

		if (currentEdPortal && portal.slug === currentEdPortal.slug) {
			hasViewedEdEmail = true;
		}

		saveState();
	};

	const handleSelectSent = (message: SentEmail) => {
		selectedSent = message;
		selectedPortal = null;
		activeFolder = 'sent';
		viewMode = 'email';
	};

	const openInboxList = () => {
		viewMode = 'inbox';
	};

	const switchFolder = (folder: 'inbox' | 'sent') => {
		activeFolder = folder;
		viewMode = 'inbox';
	};

	const startCalendar = () => {
		if (calendarIntervalId !== null) {
			clearInterval(calendarIntervalId);
		}
		calendarIntervalId = window.setInterval(() => {
			if (calendarIndex < calendarDates.length - 1) {
				calendarIndex += 1;
			} else if (calendarIntervalId !== null) {
				clearInterval(calendarIntervalId);
				calendarIntervalId = null;
			}
		}, 700);
	};

	const startRdEmailTimeline = (edPortal: PortalEmail | null) => {
		const rdPortals = edPortal ? portals.filter((p) => p.slug !== edPortal.slug) : portals;

		rdPortals.forEach((portal, index) => {
			const timeoutId = window.setTimeout(
				() => {
					// avoid duplicates
					if (!visiblePortals.some((vp) => vp.slug === portal.slug)) {
						visiblePortals = [...visiblePortals, portal];

						// 🔐 NEW: persist updated inbox so it survives navigation
						saveState();
					}
				},
				(index + 1) * 1000
			);

			applyTimeoutIds.push(timeoutId);
		});
	};

	const formatTime = (hour24: number, minute: number) => {
		const isPM = hour24 >= 12;
		let h12 = hour24 > 12 ? hour24 - 12 : hour24;
		if (h12 === 0) h12 = 12;
		const mStr = minute.toString().padStart(2, '0');
		const suffix = isPM ? 'PM' : 'AM';
		return `${h12}:${mStr} ${suffix}`;
	};

	const getPortalIndex = (portal: PortalEmail) => portals.findIndex((p) => p.slug === portal.slug);

	const getReceivedLabel = (portal: PortalEmail): string => {
		const idx = getPortalIndex(portal);
		if (currentEdPortal && portal.slug === currentEdPortal.slug) {
			// Early decision time block, around 4 PM
			const minute = 5 + idx * 2;
			const time = formatTime(16, minute);
			return `${ED_DATE_LABEL}, ${time}`;
		} else {
			// Regular decision time block, around 5 PM
			const minute = 1 + idx * 2;
			const time = formatTime(17, minute);
			return `${RD_DATE_LABEL}, ${time}`;
		}
	};

	// Keep inbox sorted newest → oldest and auto-scroll to inbox when ready
	$: if (hasApplied && applicationPhase === 'finished') {
		// Sort visible portals by their actual received date/time (newest first)
		sortedVisiblePortals = [...visiblePortals].sort((a, b) => {
			const timeA = new Date(getReceivedLabel(a)).getTime();
			const timeB = new Date(getReceivedLabel(b)).getTime();
			return timeB - timeA;
		});

		// Once inbox section exists, scroll to it once
		if (inboxSection && !hasAutoScrolledToInbox) {
			inboxSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
			hasAutoScrolledToInbox = true;
		}
	} else {
		// If simulation not finished yet, keep sorted list in sync but no scroll
		sortedVisiblePortals = [...visiblePortals];
	}

	// TRIGGER SMM INVITATION
	$: if (hasApplied && applicationPhase === 'finished' && !hasViewedSMMInvite) {
		// Wait 6 seconds after simulation finishes (users looking at emails) then trigger
		setTimeout(() => {
			if (!hasViewedSMMInvite) {
				showSMMInvite = true;
				hasViewedSMMInvite = true;
			}
		}, 6000);
	}

	// 🔍 Apply search filter to sorted portals
	$: {
		const q = inboxSearchQuery.trim().toLowerCase();

		if (!q) {
			filteredPortals = sortedVisiblePortals;
		} else {
			filteredPortals = sortedVisiblePortals.filter((portal) => {
				return portal.name.toLowerCase().includes(q) || portal.slug.toLowerCase().includes(q);
			});
		}
	}

	const startApplicationAnimation = () => {
		isApplying = true;
		applicationPhase = 'commonapp';

		const phaseSchedule: { phase: ApplicationPhase; delay: number }[] = [
			{ phase: 'fee', delay: 2500 },
			{ phase: 'transcript', delay: 5000 },
			{ phase: 'act', delay: 7500 },
			{ phase: 'finished', delay: 10000 }
		];

		phaseSchedule.forEach(({ phase, delay }) => {
			const timeoutId = window.setTimeout(() => {
				applicationPhase = phase;
				if (phase === 'finished') {
					isApplying = false;
					// After this, calendar + reactive block will unlock ED/RD emails
				}
				saveState();
			}, delay);
			applyTimeoutIds.push(timeoutId);
		});
	};

	const handleApply = () => {
		if (!canApply) {
			saveMessage = 'Fill out name, email, and password first.';
			return;
		}
		if (hasApplied) return;

		hasApplied = true;

		// --- NEW: GENERATE RANDOM DECISIONS ---
		const randomDecisions = portals.map((portal) => ({
			school: portal.name,
			slug: portal.slug,
			// Randomly pick 'admit' or 'deny'
			outcome: (Math.random() > 0.5 ? 'admit' : 'deny') as 'admit' | 'deny'
		}));

		aiResults.setDecisions(randomDecisions);

		// Set up ED choice & reset inbox-related state
		currentEdPortal = edChoiceSlug ? (portals.find((p) => p.slug === edChoiceSlug) ?? null) : null;
		visiblePortals = [];
		selectedPortal = null;
		selectedSent = null;
		readPortalSlugs = new Set();
		hasViewedEdEmail = false;
		edEmailMustBeViewed = false;
		edEmailRevealed = false;
		rdTimelineStarted = false;
		hasAutoScrolledToInbox = false;

		applyTimeoutIds.forEach((id) => clearTimeout(id));
		applyTimeoutIds = [];

		calendarIndex = 0;
		startCalendar();
		startApplicationAnimation();
		saveState();
	};

	// 🔄 Reset the whole simulation (profile, state, localStorage)
	const resetSimulation = () => {
		// clear timers
		applyTimeoutIds.forEach((id) => clearTimeout(id));
		applyTimeoutIds = [];
		if (calendarIntervalId !== null) {
			clearInterval(calendarIntervalId);
			calendarIntervalId = null;
		}

		// clear global store
		userProfile.set({
			name: '',
			email: '',
			password: ''
		});

		// clear local fields
		name = '';
		email = '';
		password = '';
		saveMessage = 'Simulation reset. Start fresh with a new fake login.';

		// reset flow flags
		hasApplied = false;
		hasSavedProfile = false;
		showAccountForm = false;
		showPassword = false;
		aiExpanded = false;

		// reset inbox / portals
		selectedPortal = null;
		selectedSent = null;
		activeFolder = 'inbox';
		viewMode = 'inbox';
		readPortalSlugs = new Set();
		visiblePortals = [];
		isApplying = false;

		// reset calendar & phases
		applicationPhase = 'idle';
		calendarIndex = 0;
		hasAutoScrolledToInbox = false;

		// reset ED / RD
		edChoiceSlug = '';
		currentEdPortal = null;
		edEmailMustBeViewed = false;
		hasViewedEdEmail = false;
		edEmailRevealed = false;
		rdTimelineStarted = false;

		// clear persisted state
		if (typeof localStorage !== 'undefined') {
			try {
				localStorage.removeItem(PERSIST_KEY);
			} catch (err) {
				console.error('Failed to clear PredictAdmit state', err);
			}
		}
	};

	// Unlock ED / RD emails as the calendar + application phase progress
	$: if (hasApplied) {
		const currentDate = calendarDates[calendarIndex];

		// --- ED/REA handling: stop time on ED date and show ONLY the ED email ---
		if (currentEdPortal && !edEmailRevealed && currentDate === ED_DATE_LABEL) {
			visiblePortals = [currentEdPortal];
			edEmailRevealed = true;
			edEmailMustBeViewed = true;

			// Pause the calendar at the ED date
			if (calendarIntervalId !== null) {
				clearInterval(calendarIntervalId);
				calendarIntervalId = null;
			}
		}

		// --- Resume calendar AFTER ED email is viewed AND user returns to inbox ---
		if (
			currentEdPortal &&
			edEmailRevealed &&
			hasViewedEdEmail &&
			viewMode === 'inbox' &&
			calendarIntervalId === null &&
			!rdTimelineStarted &&
			calendarIndex < calendarDates.length - 1
		) {
			calendarIntervalId = window.setInterval(() => {
				if (calendarIndex < calendarDates.length - 1) {
					calendarIndex += 1;
				} else if (calendarIntervalId !== null) {
					clearInterval(calendarIntervalId);
					calendarIntervalId = null;
				}
			}, 700);
		}

		// --- Start RD drip on RD date (March 20), only after ED has been viewed if applicable ---
		if (
			!rdTimelineStarted &&
			currentDate === RD_DATE_LABEL &&
			(!currentEdPortal || hasViewedEdEmail)
		) {
			rdTimelineStarted = true;
			startRdEmailTimeline(currentEdPortal);

			// Once RD emails start, we can stop the calendar
			if (calendarIntervalId !== null) {
				clearInterval(calendarIntervalId);
				calendarIntervalId = null;
			}
		}

		// persist any changes from this tick
		saveState();
	}

	onDestroy(() => {
		applyTimeoutIds.forEach((id) => clearTimeout(id));
		if (calendarIntervalId !== null) {
			clearInterval(calendarIntervalId);
		}
	});
</script>

<svelte:head>
	<title>PredictAdmit.com – College Admissions Portal Simulator</title>
</svelte:head>

<main
	class="min-h-screen bg-[var(--color-brand-bg)] text-slate-900 font-sans flex flex-col relative overflow-hidden transition-colors duration-700 ease-in-out"
>
	<div class="flex-1 w-full relative z-10 transition-colors duration-500">
		<div class="max-w-[1200px] mx-auto px-6 py-32 space-y-32">
			<!-- HERO: SEARCH + SIMULATION -->
			<section class="text-center max-w-4xl mx-auto space-y-8">
				<h1 class="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900">
					Simulate Any University Portal
				</h1>
				<p class="text-lg text-slate-600 max-w-2xl mx-auto">
					Experience realistic college admission portals. Search for any university or run a full
					simulation.
				</p>

				<!-- Search Bar + Simulation Button -->
				<div class="flex gap-3 max-w-3xl mx-auto relative">
					<div class="flex-1 relative">
						<!-- Search Bar Container -->
						<div
							class="flex bg-white border border-slate-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all overflow-hidden items-center"
						>
							<!-- Decision Mode Selector -->
							<select
								bind:value={$manualOverrideMode}
								class="bg-slate-50 text-slate-700 text-sm font-semibold px-4 py-4 border-r border-slate-200 outline-none cursor-pointer hover:bg-slate-100 transition-colors w-[130px] appearance-none text-center"
								style="text-align-last: center;"
							>
								<option value="random">Random</option>
								<option value="accepted">Accepted</option>
								<option value="denied">Rejected</option>
							</select>

							<!-- Search Input -->
							<input
								type="text"
								bind:value={searchQuery}
								on:keydown={handleKeydown}
								placeholder="Search for Harvard, Stanford, MIT..."
								class="w-full text-slate-900 text-lg px-6 py-4 outline-none placeholder:text-slate-400"
							/>
						</div>

						<!-- Search Results Dropdown -->
						{#if showSearchResults}
							<div
								class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
							>
								{#each filteredUniversities as university, index}
									<button
										type="button"
										class="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0"
										class:bg-blue-50={index === selectedIndex}
										on:mousedown|preventDefault={() => handleUniversitySelect(university.slug)}
									>
										<div class="font-semibold text-slate-900">{university.name}</div>
										<div class="text-xs text-slate-500">View admission portal →</div>
									</button>
								{/each}
							</div>
						{/if}
					</div>

					<button
						type="button"
						class="px-8 h-[56px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg transition-colors shadow-sm whitespace-nowrap"
						on:click={handleStartSimulationClick}
					>
						Simulate Full Cycle
					</button>
				</div>
			</section>

			<!-- THE NARRATIVE: ANXIETY MACHINE -->
			<section class="grid md:grid-cols-2 gap-12 items-center">
				<div class="space-y-6">
					<h2 class="text-3xl font-bold text-slate-900">Practice Your College Decision Day</h2>
					<div class="space-y-4 text-lg text-slate-600 leading-relaxed">
						<p>
							Experience realistic college admission portals before decision day arrives. We've
							recreated <span class="text-slate-900 font-bold">50+ university portals</span> so you can
							prepare for the real thing.
						</p>
						<p>
							Search for any university above, or run a full simulation to see decisions from
							multiple schools at once. The AI Application Simulator is now available for everyone.
						</p>
					</div>
				</div>

				<Card class="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
					<div class="p-6 space-y-4">
						<div class="flex items-center justify-between">
							<h3 class="text-xl font-bold text-slate-900">Get Predicted Decisions</h3>
						</div>

						<p class="text-sm text-slate-700">
							Use our AI simulator to see your predicted admission decisions based on your actual
							profile. <strong>Your first simulation is completely free!</strong>
						</p>

						<div class="pt-2">
							<a
								href="/ai"
								class="inline-flex items-center justify-center w-full font-bold text-sm bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
							>
								Try AI Simulator →
							</a>
						</div>
					</div>
				</Card>
			</section>

			<!-- NEW TOOLS SECTION -->
			<section class="grid md:grid-cols-2 gap-6">
				<a
					href="/research-hub"
					class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-8 hover:border-blue-300 hover:shadow-lg transition-all"
				>
					<div class="relative z-10 space-y-4">
						<div
							class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-bold"
						>
							🔬
						</div>
						<h3
							class="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
						>
							Research Hub
						</h3>
						<p class="text-slate-600">
							Build your "Spike" with high-impact, verified non-profit work and research positions.
						</p>
						<div class="text-sm font-bold text-indigo-600 flex items-center gap-1">
							Find Roles <span class="group-hover:translate-x-1 transition-transform">→</span>
						</div>
					</div>
				</a>

				<a
					href="/junior-diagnostic"
					class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-8 hover:border-blue-300 hover:shadow-lg transition-all"
				>
					<div class="relative z-10 space-y-4">
						<div
							class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold"
						>
							📊
						</div>
						<h3
							class="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
						>
							Junior Diagnostic
						</h3>
						<p class="text-slate-600">
							Don't guess. Project your rejection probability based on your current stats and
							coursework.
						</p>
						<div class="text-sm font-bold text-emerald-600 flex items-center gap-1">
							Analyze Profile <span class="group-hover:translate-x-1 transition-transform">→</span>
						</div>
					</div>
				</a>
			</section>

			{#if showAccountForm}
				<div class="py-12 max-w-[600px] mx-auto">
					<Card>
						<div class="p-8">
							<h3 class="text-xl font-bold mb-6 text-[var(--color-brand-primary)]">
								Configure Simulation
							</h3>

							<form class="space-y-6" on:submit={handleSubmit}>
								<p class="text-sm text-slate-600">
									Set up a fake login to power the portals. Data never leaves your browser.
								</p>

								<div class="space-y-4">
									<div>
										<label class="block text-sm font-bold text-slate-900 mb-2" for="applicant-name"
											>Name</label
										>
										<input
											id="applicant-name"
											type="text"
											class="w-full border border-slate-300 bg-slate-50 px-4 py-3 text-sm rounded-[var(--radius-btn)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] transition-all"
											bind:value={name}
											placeholder="e.g., Ben Dover"
											autocomplete="name"
										/>
									</div>

									<div>
										<label class="block text-sm font-bold text-slate-900 mb-2" for="applicant-email"
											>Email</label
										>
										<input
											id="applicant-email"
											type="email"
											class="w-full border border-slate-300 bg-slate-50 px-4 py-3 text-sm rounded-[var(--radius-btn)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] transition-all"
											bind:value={email}
											placeholder="you@example.com"
											autocomplete="email"
										/>
									</div>

									<div>
										<label
											class="block text-sm font-bold text-slate-900 mb-2"
											for="applicant-password">Password</label
										>
										<div class="relative">
											<input
												id="applicant-password"
												type={showPassword ? 'text' : 'password'}
												class="w-full border border-slate-300 bg-slate-50 px-4 py-3 text-sm rounded-[var(--radius-btn)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] transition-all"
												bind:value={password}
												placeholder="Make one up"
												autocomplete="new-password"
											/>
											<button
												type="button"
												class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-900"
												on:click={() => (showPassword = !showPassword)}
											>
												{showPassword ? 'Hide' : 'Show'}
											</button>
										</div>
									</div>

									<div class="pt-4 border-t border-slate-100">
										<label class="block text-sm font-bold text-slate-900 mb-2" for="ed-choice"
											>Early Decision / REA (Optional)</label
										>
										<select
											id="ed-choice"
											class="w-full border border-slate-300 bg-white px-4 py-3 text-sm rounded-[var(--radius-btn)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
											bind:value={edChoiceSlug}
										>
											<option value="">None – Regular Decision only</option>
											{#each portals as portal}
												<option value={portal.slug}>{portal.name}</option>
											{/each}
										</select>
									</div>
								</div>

								<div class="pt-4 flex flex-col gap-3">
									<button
										type="button"
										class="w-full inline-flex items-center justify-center font-bold text-sm bg-blue-600 text-white px-5 py-2.5 rounded-[var(--radius-btn)] hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										on:click={generateFakeCredentials}
									>
										Auto-Generate Credentials
									</button>
									<button
										type="button"
										class="w-full inline-flex items-center justify-center font-bold text-sm bg-slate-600 text-white px-5 py-2.5 rounded-[var(--radius-btn)] hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										on:click={saveCredentialsOnly}
										disabled={!canApply}
									>
										Save Credentials
									</button>
								</div>
								{#if saveMessage}
									<p class="text-sm font-semibold text-emerald-600 text-center">
										{saveMessage}
									</p>
								{/if}
							</form>
						</div>
					</Card>
				</div>
			{/if}

			<!-- APPLY BUTTON / INBOX ANIMATION CONTROL -->
			{#if showAccountForm && hasSavedProfile}
				<section
					class="bg-white border border-slate-400 shadow-sm rounded-md px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-3"
				>
					<div class="text-sm text-slate-800 space-y-1">
						<p class="font-semibold">Run the simulation.</p>
						<p>
							Click <span class="font-semibold">Apply</span> to fast-forward from August to decision day
							and watch the emails roll in.
						</p>
					</div>
					<div class="ml-0 md:ml-4 text-right space-y-1">
						<button
							type="button"
							class={`text-sm font-semibold px-5 py-2 rounded-md border shadow focus:outline-none focus:ring-1 ${
								!canApply
									? 'bg-slate-200 text-slate-500 border-slate-400 cursor-not-allowed'
									: hasApplied
										? 'bg-green-900 text-white border-green-950 cursor-default'
										: 'bg-green-700 text-white border-green-900 hover:bg-green-600'
							}`}
							on:click={handleApply}
							disabled={!canApply || hasApplied}
						>
							{hasApplied ? (isApplying ? 'Simulating…' : 'Simulation started') : 'Apply'}
						</button>
						{#if !canApply}
							<p class="text-xs text-slate-600">Fill in name, email, and password first.</p>
						{:else if hasApplied && visiblePortals.length === 0}
							<p class="text-xs text-slate-600">Sending apps and waiting…</p>
						{:else if hasApplied}
							<p class="text-xs text-slate-600">Decisions are loading into admitMail.</p>
						{/if}
					</div>
				</section>
			{/if}

			<!-- POPUPS -->

			<!-- APPLICATION ANIMATION -->
			{#if hasApplied}
				<ApplicationTimeline
					{hasApplied}
					{calendarIndex}
					{applicationPhase}
					displayName={displayNameStr}
					displayEmail={displayEmailStr}
				/>
			{/if}

			<!-- admitMail INBOX / EMAIL VIEW -->
			{#if hasApplied && applicationPhase === 'finished'}
				<AdmitMail
					bind:inboxSection
					{viewMode}
					{activeFolder}
					bind:searchQuery={inboxSearchQuery}
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

	<SiteFooter />
</main>
