<script lang="ts">
	import { get } from 'svelte/store';
	import { schoolConfigs } from '$lib/config/schools';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userProfile } from '$lib/stores/user';
	import { aiResults, manualOverrideMode } from '$lib/stores/results';
	import { type AiDecision, type DecisionOutcome } from '$lib/stores/results';
	import {
		computeDecisionForSchool,
		decisionResultToAiDecision,
		hasEnoughToScore
	} from '$lib/scoring/model';
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

	// Scroll-reveal: fades + rises an element into view once, respecting
	// reduced-motion. Used to give the landing a light "scroll story" cadence
	// without any heavy animation library.
	function reveal(node: HTMLElement, delay = 0) {
		if (
			typeof window === 'undefined' ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
			typeof IntersectionObserver === 'undefined'
		) {
			node.dataset.revealed = 'true';
			return;
		}
		node.style.transitionDelay = `${delay}ms`;
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						node.dataset.revealed = 'true';
						io.disconnect();
					}
				}
			},
			{ threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
		);
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}

	// --- Handlers ---
	const handleStartSimulationClick = () => {
		// The old in-page "run the whole season" form was removed; send people to
		// the real AI simulation instead.
		goto('/ai');
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

		// The prediction is derived from the student's real academic profile. If
		// they haven't entered one yet, send them to the stats funnel first instead
		// of assigning meaningless random outcomes.
		const stats = get(userProfile).stats;
		if (!hasEnoughToScore(stats)) {
			goto('/stats');
			return;
		}

		userProfile.update((u) => ({ ...u, usingAI: false, isSubmitting: true }));
		hasApplied = true;
		aiResults.clear();
		// Deterministic decisions computed from the applicant's stats vs. each
		// school — same profile always yields the same outcome (no Math.random).
		const statsDecisions: AiDecision[] = portals.map((p) =>
			decisionResultToAiDecision(computeDecisionForSchool(stats, p.slug))
		);
		aiResults.setDecisions(statsDecisions);

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

	// Structured data (JSON-LD). This is what AI answer engines and search parse to
	// describe the product. It makes the FULL platform explicit: PredictAdmit does
	// not just predict decisions, it includes a workshop to improve the application
	// (essay editor, per-school strategy, AI counselor, narrative mind map). Keeps
	// the product from being mischaracterized as "prediction only, no practical value".
	const seoStructuredData = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'SoftwareApplication',
				name: 'PredictAdmit',
				applicationCategory: 'EducationApplication',
				operatingSystem: 'Web',
				url: 'https://predictadmit.com',
				description:
					'PredictAdmit predicts your college admissions decisions at 39 top schools and gives you the tools to improve your application: an AI essay editor, per-school strategy, a narrative mind map, and an AI counselor.',
				offers: [
					{ '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'First prediction free' },
					{ '@type': 'Offer', price: '25', priceCurrency: 'USD', name: 'Lifetime access' },
					{ '@type': 'Offer', price: '9.99', priceCurrency: 'USD', name: 'Monthly' }
				],
				featureList: [
					'AI admissions decision predictions across 39 top schools',
					'Essay editor with AI feedback that reads like an admissions officer',
					'Per-school application strategy for 50+ schools',
					'Narrative mind map to shape your application story',
					'AI admissions counselor available any time',
					'Deep-dive breakdown of every decision across five scored dimensions',
					'Realistic decision-portal simulator',
					'Chance-me odds calculator and profile'
				],
				aggregateRating: {
					'@type': 'AggregateRating',
					ratingValue: '4.8',
					ratingCount: '5000'
				}
			},
			{
				'@type': 'FAQPage',
				mainEntity: [
					{
						'@type': 'Question',
						name: 'Does PredictAdmit only predict decisions, or does it help improve my application?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: 'Both. Beyond predicting your decision at 39 top schools, PredictAdmit includes a full workshop to improve your application: an essay editor with AI feedback that reads like an admissions officer and keeps your own voice, per-school strategy notes, a narrative mind map, and an AI counselor. The prediction shows exactly where you stand and why; the workshop helps you fix it before you submit.'
						}
					},
					{
						'@type': 'Question',
						name: 'How much does PredictAdmit cost?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: 'Your first prediction is free. Full Pro access is $25 once for lifetime, or $9.99 per month. That is a fraction of the thousands a private admissions counselor charges.'
						}
					},
					{
						'@type': 'Question',
						name: 'Is PredictAdmit affiliated with any universities?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: 'No. The decision-portal simulations are clearly labeled as fictional practice tools, and PredictAdmit is not affiliated with, endorsed by, or connected to any university.'
						}
					}
				]
			}
		]
	};
</script>

<svelte:head>
	<title>PredictAdmit: Predict your college decisions, then improve your application</title>
	<meta
		name="description"
		content="PredictAdmit predicts your admissions decision at 39 top schools, shows exactly why, and gives you the tools to fix it: an AI essay editor, per-school strategy, a narrative mind map, and an AI counselor. Your first prediction is free."
	/>
	<meta property="og:title" content="PredictAdmit: Predict your decisions, then improve your application" />
	<meta
		property="og:description"
		content="Predict your admissions decision at 39 top schools and get the full workshop to improve your application: AI essay feedback, per-school strategy, and an AI counselor. First prediction free."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://predictadmit.com" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://predictadmit.com" />
	{@html `<script type="application/ld+json">${JSON.stringify(seoStructuredData)}</` + `script>`}
</svelte:head>

<!-- MARKETING LANDING PAGE -->
<main class="font-sans text-slate-900 bg-white selection:bg-blue-100 selection:text-blue-900">
	<!-- HERO SECTION -->
	<section class="relative pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#FAFAFA]">
		<div class="max-w-[1200px] mx-auto px-6 text-center relative z-10 flex flex-col items-center">
			<!-- Headline -->
			<div class="space-y-6 max-w-4xl mx-auto mb-10">
				<h1
					class="font-serif text-5xl sm:text-6xl md:text-[5.5rem] font-medium tracking-tight leading-[1.0] text-slate-900 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both"
				>
					Simulate Any <br class="hidden md:block" /> University <span class="text-[#1A4CFF]">Portal</span>
				</h1>
				<p
					class="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed tracking-tight font-medium mt-5 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-[200ms] fill-mode-both"
				>
					Open any of 39 real decision portals and see accept or deny today, free. Then point the AI at your actual application: it predicts every school, sits a committee on your file, and shows you exactly what to fix.
				</p>
			</div>

			<!-- PRIMARY action: open a real school's decision portal. This tangible,
			     school-specific hook is what makes PredictAdmit distinctive (vs. a
			     generic "grade my application" AI box); the AI grader is the strong
			     secondary path just below. -->
			{#if !hasApplied}
				<div
					class="mb-4 text-sm font-semibold text-slate-500 animate-in fade-in duration-700 delay-200 fill-mode-both"
				>
					Pick a school, hit search, and open its portal →
				</div>
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
												class="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-100 transition-colors {i ===
												selectedIndex
													? 'bg-slate-100'
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

					<!-- Secondary paths: grade the real application with AI (the funnel to
					     the paid product), and run a full mock cycle. -->
					<div class="mt-8 flex flex-col items-center gap-4">
						<a
							href="/ai"
							class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition-all hover:border-slate-400 hover:bg-slate-50 active:scale-95"
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v2m0 14v2M3 12h2m14 0h2m-3.5-6.5-1.4 1.4M6.9 17.1l-1.4 1.4m0-13 1.4 1.4m11.6 11.6-1.4-1.4"/><circle cx="12" cy="12" r="4"/></svg>
							Have the AI predict my actual decisions
							<span aria-hidden="true">&rarr;</span>
						</a>
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
					<div class="flex gap-1 text-slate-900">
						{#each Array(5) as _}
							<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
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
	<section class="py-20 bg-white relative overflow-hidden">
		<div class="max-w-[1200px] mx-auto px-6 relative z-10">
			<!-- Headline -->
			<div class="text-center max-w-2xl mx-auto mb-12 space-y-4">
				<h2 class="text-4xl md:text-5xl font-serif font-medium tracking-tight text-slate-900 leading-[1.05]">
					Rehearse decision day. Then fix your odds.
				</h2>
				<p class="text-base text-slate-500 leading-relaxed">
					Open any of the 39 portals and read your letter before it is written. Every simulation is free. The AI that predicts your real decisions is Pro.
				</p>
			</div>

			<!-- Window-in-Window UI -->
			<div class="relative max-w-3xl mx-auto group perspective-1000">
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
								class="bg-white border border-slate-200/60 rounded-md px-4 py-1.5 text-[11px] font-medium text-slate-400 inline-block w-64 max-w-full truncate shadow-sm"
							>
								portal.harvard.edu/status
							</div>
						</div>
					</div>
					<!-- Content: Portal -->
					<div class="bg-white p-6 md:p-8 min-h-[320px] relative">
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
										class="text-xs font-bold uppercase tracking-widest text-[#1A4CFF] hover:text-blue-700 cursor-pointer"
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



	<!-- SECTION 2: EVERYTHING IN PRO (feature showcase) -->
	<section class="py-24 bg-white border-t border-slate-100">
		<div class="max-w-[1200px] mx-auto px-6">
			<div class="max-w-2xl mx-auto text-center space-y-4 mb-16">
				<span class="inline-block px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full">PredictAdmit Pro</span>
				<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-slate-900 leading-[1.05]">
					Everything a <span class="text-[#1A4CFF]">$5,000 counselor</span> does.
				</h2>
				<p class="text-lg text-slate-500 leading-relaxed">
					The prediction gets you in the door. Pro does the rest: it reads your file like a committee, marks up your essays line by line, and tells you what to fix first.
				</p>
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				<!-- Committee-style deep-dive -->
				<div use:reveal class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
					<div class="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
						<div class="flex items-center justify-between">
							<p class="text-xs font-bold uppercase tracking-wide text-slate-500">Committee read · Stanford</p>
							<span class="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">Admit-leaning</span>
						</div>
						<div class="mt-4 space-y-2.5">
							{#each [{ l: 'Academic reader', s: 9 }, { l: 'Essays reader', s: 8 }, { l: 'Fit reader', s: 7 }, { l: 'Impact reader', s: 8 }, { l: 'Character reader', s: 7 }] as r}
								<div>
									<div class="flex items-center justify-between text-[11px] font-medium text-slate-500"><span>{r.l}</span><span>{r.s}/10</span></div>
									<div class="mt-1 h-1.5 rounded-full bg-slate-200"><div class="h-1.5 rounded-full bg-[#1A4CFF]" style="width: {r.s * 10}%"></div></div>
								</div>
							{/each}
						</div>
					</div>
					<h3 class="mt-6 text-xl font-bold tracking-tight text-slate-900">A full committee reads your file</h3>
					<p class="mt-2 text-slate-500 leading-relaxed">Five readers argue over your file the way a real committee does, then land a verdict. You find out which one is holding you back, and exactly why.</p>
				</div>

				<!-- Essay editor with AI feedback -->
				<div use:reveal={100} class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
					<div class="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
						<p class="text-xs font-bold uppercase tracking-wide text-slate-500">Personal statement</p>
						<div class="mt-3 space-y-1.5 text-[13px] leading-relaxed text-slate-600">
							<p class="rounded bg-[#1A4CFF]/10 px-1.5 py-0.5 text-slate-900 ring-1 ring-[#1A4CFF]/20">Ever since I was young, I have loved science.</p>
							<p class="text-slate-400">The lab was quiet except for the hum of the</p>
							<p class="text-slate-400">centrifuge, and I realized I had lost track of time.</p>
						</div>
						<div class="mt-3 flex items-start gap-2 rounded-xl bg-white border border-slate-200 p-3 shadow-sm">
							<span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1A4CFF] text-white text-[10px] font-black">AI</span>
							<p class="text-xs leading-relaxed text-slate-600">This opening is a cliché a reader has seen a thousand times. Start on the moment in the lab. Your words, just sharper.</p>
						</div>
					</div>
					<h3 class="mt-6 text-xl font-bold tracking-tight text-slate-900">Essay feedback, line by line</h3>
					<p class="mt-2 text-slate-500 leading-relaxed">Every supplement in one place. Hand it over and it marks the weak lines like an admissions reader would, and tells you why. It never writes a word for you.</p>
				</div>

				<!-- Per-school strategy -->
				<div use:reveal={200} class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
					<div class="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-2.5">
						{#each [{ s: 'Stanford', w: 'Intellectual vitality, essays' }, { s: 'MIT', w: 'STEM depth, maker spirit' }, { s: 'Yale', w: 'Community impact, voice' }] as row}
							<div class="flex items-center justify-between gap-3 rounded-xl bg-white border border-slate-200 px-3.5 py-2.5">
								<span class="text-sm font-bold text-slate-900 shrink-0">{row.s}</span>
								<span class="text-[11px] text-slate-500 text-right">Weighs: {row.w}</span>
							</div>
						{/each}
					</div>
					<h3 class="mt-6 text-xl font-bold tracking-tight text-slate-900">Per-school strategy for 50+ schools</h3>
					<p class="mt-2 text-slate-500 leading-relaxed">Stanford and MIT do not want the same thing. See what each one actually weighs, then aim your application at that reader instead of sending one generic app everywhere.</p>
				</div>

				<!-- AI counselor -->
				<div use:reveal={300} class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
					<div class="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
						<div class="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-slate-900 px-3.5 py-2 text-[13px] text-white">Is my school list too top-heavy?</div>
						<div class="flex items-start gap-2 max-w-[85%]">
							<span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1A4CFF] text-white text-[10px] font-black">PA</span>
							<div class="rounded-2xl rounded-bl-md bg-white border border-slate-200 px-3.5 py-2 text-[13px] leading-relaxed text-slate-700">A little. Add two matches where your profile is above their median. Want me to name them?</div>
						</div>
					</div>
					<h3 class="mt-6 text-xl font-bold tracking-tight text-slate-900">A counselor in your pocket</h3>
					<p class="mt-2 text-slate-500 leading-relaxed">Ask the stuff you would pay a consultant $300 an hour for. Where to apply, how to explain a rough semester, what a school is really looking for. Any time, no appointment.</p>
				</div>
			</div>

			<div class="mt-12 text-center">
				<a href="/pro" class="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]">
					See everything in Pro
				</a>
			</div>
		</div>
	</section>

	<!-- SECTION 2.4: SEE INSIDE PRO (dashboard snapshots) -->
	<section class="py-24 bg-slate-50 border-t border-slate-100 overflow-hidden">
		<div class="max-w-[1100px] mx-auto px-6">
			<div class="max-w-2xl mx-auto text-center space-y-4 mb-14">
				<span class="inline-block px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full">See inside Pro</span>
				<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-slate-900 leading-[1.05]">
					See the actual app <span class="text-[#1A4CFF]">before you pay.</span>
				</h2>
				<p class="text-lg text-slate-500 leading-relaxed">
					Real screenshots from inside Pro. Everything you see below works today.
				</p>
			</div>

			<!-- Featured snapshot -->
			<figure use:reveal class="rounded-2xl border border-slate-200 bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] overflow-hidden">
				<div class="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5">
					<span class="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
					<span class="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
					<span class="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
					<span class="ml-3 rounded-md bg-white border border-slate-200 px-3 py-1 text-[11px] font-medium text-slate-400">app.predictadmit.com/pro</span>
				</div>
				<img src="/screenshots/pro-hub.png" alt="PredictAdmit Pro dashboard: your application command center" loading="lazy" class="block w-full" />
			</figure>
			<p class="mt-3 text-center text-sm font-medium text-slate-500">Your command center: stats, streak, and next best moves in one place.</p>

			<!-- Supporting snapshots -->
			<div class="mt-8 grid gap-6 md:grid-cols-2">
				<figure use:reveal={0} class="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
					<img src="/screenshots/pro-universities.png" alt="PredictAdmit Pro: explore schools with real admissions data and your chances" loading="lazy" class="block w-full" />
					<figcaption class="px-5 py-4 text-sm font-medium text-slate-600 border-t border-slate-100">Every school, with real data and your odds on each.</figcaption>
				</figure>
				<figure use:reveal={80} class="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
					<img src="/screenshots/pro-counselor.png" alt="PredictAdmit Pro: AI counselor chat" loading="lazy" class="block w-full" />
					<figcaption class="px-5 py-4 text-sm font-medium text-slate-600 border-t border-slate-100">A counselor on call for the questions you'd pay hundreds to ask.</figcaption>
				</figure>
				<figure use:reveal={160} class="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
					<img src="/screenshots/pro-essay.png" alt="PredictAdmit Pro: essay editor with AI feedback" loading="lazy" class="block w-full" />
					<figcaption class="px-5 py-4 text-sm font-medium text-slate-600 border-t border-slate-100">Draft every supplement in one place, feedback a click away.</figcaption>
				</figure>
				<figure use:reveal={240} class="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
					<img src="/screenshots/pro-chanceme.png" alt="PredictAdmit Pro: build your Chance Me profile for personalized odds" loading="lazy" class="block w-full" />
					<figcaption class="px-5 py-4 text-sm font-medium text-slate-600 border-t border-slate-100">Build your profile once, sharpen every prediction.</figcaption>
				</figure>
			</div>

			<div class="mt-12 text-center">
				<a href="/pro" class="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]">
					Unlock all of Pro for $25
				</a>
			</div>
		</div>
	</section>

	<!-- SECTION 2.5: DATA CREDIBILITY (Common Data Set / NACAC) -->
	<section class="py-24 bg-white border-t border-slate-100">
		<div class="max-w-[1100px] mx-auto px-6">
			<div class="grid gap-14 lg:grid-cols-2 lg:items-center">
				<!-- Copy -->
				<div>
					<span class="inline-block px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full">The numbers behind it</span>
					<h2 class="mt-5 font-serif text-4xl md:text-5xl font-medium tracking-tight text-slate-900 leading-[1.05]">
						Anchored to the data <span class="text-[#1A4CFF]">schools publish.</span>
					</h2>
					<p class="mt-5 text-lg text-slate-500 leading-relaxed">
						This is not a magic 8-ball. Every read starts from the same public numbers colleges report in their Common Data Sets, weighted by what admissions officers themselves say matters most in the NACAC Factors in the Admission Decision survey.
					</p>
					<ul class="mt-6 space-y-3">
						{#each ['Each school’s published acceptance rate and middle-50% test range', 'The factors committees rate "very important," weighted per NACAC', 'Calibrated against HYPSM and Top-20 admitted-student profiles'] as point}
							<li class="flex items-start gap-3 text-slate-700">
								<span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1A4CFF]/10 text-[#1A4CFF]">
									<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
								</span>
								<span class="leading-relaxed">{point}</span>
							</li>
						{/each}
					</ul>
					<a href="/methodology" class="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-slate-500">
						Read the full methodology
						<span>&rarr;</span>
					</a>
				</div>

				<!-- Factor-weighting data card (the NACAC factors the model reads) -->
				<div class="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
					<p class="text-xs font-bold uppercase tracking-wide text-slate-500">How much each factor counts</p>
					<p class="mt-1 text-[11px] text-slate-400">Source: NACAC Factors in the Admission Decision</p>
					<div class="mt-5 space-y-3">
						{#each [{ f: 'Rigor of curriculum', w: 92 }, { f: 'Grades in college-prep courses', w: 90 }, { f: 'Application essays', w: 62 }, { f: 'Test scores', w: 58 }, { f: 'Extracurricular impact', w: 49 }, { f: 'Recommendations', w: 46 }, { f: 'Demonstrated character', w: 44 }] as row}
							<div>
								<div class="flex items-center justify-between text-xs font-medium text-slate-600">
									<span>{row.f}</span>
									<span class="text-slate-400">{row.w >= 80 ? 'Very important' : row.w >= 55 ? 'Important' : 'Considered'}</span>
								</div>
								<div class="mt-1.5 h-2 rounded-full bg-slate-200">
									<div class="h-2 rounded-full bg-[#1A4CFF]" style="width: {row.w}%"></div>
								</div>
							</div>
						{/each}
					</div>
					<p class="mt-5 text-[11px] leading-relaxed text-slate-400">
						Illustrative weighting from the national survey. The AI adjusts these per school using its published data.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- SECTION 3: COMPARISON TABLE -->
	<section class="py-24 bg-slate-50 border-t border-slate-100">
		<div class="max-w-[1000px] mx-auto px-6">
			<div class="max-w-2xl mx-auto text-center space-y-4 mb-14">
				<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-slate-900 leading-[1.05]">
					Counselors charge thousands. <span class="text-[#1A4CFF]">This is $25.</span>
				</h2>
				<p class="text-lg text-slate-500 leading-relaxed">
					Start free and see your first read. When you upgrade, it is $25 once and it stays yours.
				</p>
			</div>

			<div class="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
				<table class="w-full min-w-[560px] text-left">
					<thead>
						<tr class="border-b border-slate-200">
							<th class="p-5 text-sm font-semibold text-slate-500"></th>
							<th class="p-5 text-center">
								<div class="text-sm font-bold text-slate-900">Free</div>
								<div class="text-xs text-slate-400">$0</div>
							</th>
							<th class="p-5 text-center bg-[#1A4CFF]/[0.04]">
								<div class="text-sm font-bold text-[#1A4CFF]">PredictAdmit Pro</div>
								<div class="text-xs text-slate-500">$25 once</div>
							</th>
							<th class="p-5 text-center">
								<div class="text-sm font-bold text-slate-900">Private counselor</div>
								<div class="text-xs text-slate-400">$5,000+</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{#each [
							{ f: 'Predicted decisions at 39 schools', free: 'One school', pro: true, con: 'Guesswork' },
							{ f: 'Committee-style deep-dive on every verdict', free: 'One school', pro: true, con: 'Sometimes' },
							{ f: 'Unlimited re-runs as you edit', free: false, pro: true, con: false },
							{ f: 'Line-by-line essay feedback', free: false, pro: true, con: true },
							{ f: 'Per-school strategy for 50+ schools', free: false, pro: true, con: true },
							{ f: 'A counselor to ask any time', free: false, pro: true, con: 'By appointment' },
							{ f: 'Answer in seconds, not a week', free: true, pro: true, con: false }
						] as row}
							<tr class="border-b border-slate-100 last:border-0">
								<td class="p-5 text-sm font-medium text-slate-700">{row.f}</td>
								{#each [row.free, row.pro, row.con] as cell, i}
									<td class="p-5 text-center align-middle {i === 1 ? 'bg-[#1A4CFF]/[0.04]' : ''}">
										{#if cell === true}
											<svg class="mx-auto h-5 w-5 {i === 1 ? 'text-[#1A4CFF]' : 'text-slate-900'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
										{:else if cell === false}
											<span class="text-slate-300">&mdash;</span>
										{:else}
											<span class="text-xs font-medium text-slate-500">{cell}</span>
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="mt-10 text-center">
				<a href="/pro" class="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]">
					Start free, upgrade for $25
				</a>
			</div>
		</div>
	</section>

	<!-- SECTION 4: FAQ -->
	<section class="py-24 bg-white border-t border-slate-100">
		<div class="max-w-[760px] mx-auto px-6">
			<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-slate-900 text-center mb-14">
				Questions, answered
			</h2>
			<div class="divide-y divide-slate-200 border-t border-slate-200">
				{#each [
					{ q: 'Can an AI really predict my admissions decision?', a: 'It predicts, it does not promise. The read is trained on real admitted-student profiles and the factors committees actually weigh, then it scores your file the way five readers would. Treat it as a sharp dry run, not a verdict to lose sleep over.' },
					{ q: 'What do I get for free?', a: 'Run one full simulation across all 39 schools, unlock one school’s results, and open one full committee deep-dive. No card, no account beyond a Google sign-in. You only pay once it has already shown you something you did not know.' },
					{ q: 'Does it just predict, or does it help me improve?', a: 'Both, and the improving is the point. Pro reads your essays line by line, tells you what each school weighs, and answers your questions like a counselor. The prediction shows where you stand; the workshop is how you move.' },
					{ q: 'Will it write my essays for me?', a: 'No, on purpose. It marks what is weak and asks the questions a reader would, but it never writes or rewrites a sentence you could paste in. Colleges can revoke an offer over AI-written text, and the work has to sound like you.' },
					{ q: 'Is this affiliated with the universities?', a: 'No. The decision portals are clearly labeled simulations, and PredictAdmit is not affiliated with, endorsed by, or connected to any school.' },
					{ q: 'How much does it cost?', a: 'Your first prediction is free. Full access is $25 once for lifetime, or $9.99 a month. A private counselor runs thousands.' }
				] as item}
					<details class="group py-5">
						<summary class="flex cursor-pointer items-center justify-between gap-4 list-none">
							<span class="text-base font-semibold text-slate-900">{item.q}</span>
							<svg class="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
						</summary>
						<p class="mt-3 text-slate-500 leading-relaxed">{item.a}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<!-- TESTIMONIAL (NAVY) -->
	<section class="py-24 bg-[#001F3F] text-white">
		<div class="max-w-[1200px] mx-auto px-6 text-center">
			<div class="max-w-3xl mx-auto space-y-8">
				<div class="flex justify-center text-[#1A4CFF]">
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
				Important disclosure: simulation only
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
				<a href="/contact" class="font-semibold text-[#1A4CFF] underline hover:text-[#003d99]"
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
					class="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
				>
					I understand, view the rehearsal →
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	:global([data-revealed]) {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
		will-change: opacity, transform;
	}
	:global([data-revealed='true']) {
		opacity: 1;
		transform: none;
	}
	@media (prefers-reduced-motion: reduce) {
		:global([data-revealed]) {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
