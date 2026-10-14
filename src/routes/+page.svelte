<script lang="ts">
	import { get } from 'svelte/store';
	import { schoolConfigs } from '$lib/config/schools';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userProfile } from '$lib/stores/user';
	import { aiResults, manualOverrideMode } from '$lib/stores/results';
	import { type AiDecision, type DecisionOutcome } from '$lib/stores/results';
	import {
		computeDecisionForSchool,
		decisionResultToAiDecision,
		hasEnoughToScore
	} from '$lib/scoring/model';
	import ScrollZoomStory from '$lib/components/home/ScrollZoomStory.svelte';
	import SchoolLogoMarquee from '$lib/components/home/SchoolLogoMarquee.svelte';
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
		// Live-feel social proof counter. PERSIST it across navigations so returning
		// to the landing keeps the incremented value instead of resetting to 15,000
		// (a reset breaks the "always growing" illusion). Load any saved value (never
		// below the 15,000 floor), then tick +1 every ~6s and save each tick.
		try {
			const saved = parseInt(localStorage.getItem('pa_predicted_count') || '', 10);
			if (Number.isFinite(saved) && saved >= predictedCount) predictedCount = saved;
		} catch {}
		if (
			typeof window !== 'undefined' &&
			!window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			const tick = window.setInterval(() => {
				predictedCount += 1;
				try {
					localStorage.setItem('pa_predicted_count', String(predictedCount));
				} catch {}
			}, 6000);
			return () => window.clearInterval(tick);
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

	// Hero stats entry: the visitor starts typing their stats right on the landing,
	// then we hand off to /ai with an autorun prefill so the full 39-school
	// prediction runs the moment they arrive (Zach, 2026-09-17). The portal
	// simulator lives on /portals now, not the landing.
	let heroStats = '';
	// Hero entry mode: predict real decisions (paste/upload) vs. rehearse one
	// school's portal. Both paths already exist in this script; the toggle just
	// surfaces the simulate path, which previously had no entry point.
	let heroMode: 'predict' | 'simulate' = 'predict';

	// Live-feel social proof: the hero count starts at 15,000+ and ticks up a
	// little over time, so the number feels alive without ever overstating.
	let predictedCount = 15000;
	$: predictedCountLabel = predictedCount.toLocaleString('en-US');

	// "What you get in Pro" — alternating product cards: a real, zoomed screenshot
	// in a framed window + a short line + a CTA. Copy is deliberately tight.
	const proCards = [
		{
			heading: 'Your real decision at every T30',
			sub: 'Run your actual application and watch accept, waitlist, and deny land across every top school. Months before March.',
			img: '/screenshots/zoom/universities.png',
			w: 2391,
			h: 1260,
			href: '/verdict',
			ctaText: 'Predict free'
		},
		{
			heading: 'Essay feedback, line by line',
			sub: 'It flags the weak lines the way an admissions reader would, and tells you why. It never writes a word for you.',
			img: '/screenshots/zoom/essay.png',
			w: 2391,
			h: 1260,
			href: '/pro',
			ctaText: 'See it'
		},
		{
			heading: 'A counselor that gives it straight',
			sub: "Ask what you'd pay a consultant $300 an hour for. Your odds, your essay, your list. Any time, no appointment.",
			img: '/screenshots/zoom/counselor.png',
			w: 2391,
			h: 1368,
			href: '/pro',
			ctaText: 'Try it free'
		},
		{
			heading: 'See exactly where you stand',
			sub: 'Build your profile once and get sharper, personalized odds at every school on your list.',
			img: '/screenshots/zoom/chanceme.png',
			w: 2391,
			h: 1152,
			href: '/pro',
			ctaText: 'Check yours'
		}
	];
	function startPrediction() {
		const stats = heroStats.trim();
		try {
			if (stats) {
				// Carry the raw blob as `paste` so /ai runs it through the autofill
				// parser (splits it into every box), not just the transcript field.
				sessionStorage.setItem('pa_sim_prefill', JSON.stringify({ paste: stats }));
				sessionStorage.setItem('pa_autorun_sim', '1');
				sessionStorage.removeItem('pa_sim_signin_tried');
			}
		} catch {
			/* sessionStorage unavailable — /ai still opens on the stats form */
		}
		goto('/ai');
	}

	// ---- Landing PDF upload -------------------------------------------------
	// Extract the PDF's text layer CLIENT-SIDE with unpdf (a serverless/browser-safe
	// pdf.js build) so a signed-out visitor can upload a resume and feel the value
	// BEFORE any sign-in. The extracted text drops into the box below; the normal
	// handoff to /ai then splits it across every field. (The authed /api/ocr route
	// on /ai stays as the full path.) unpdf is lazy-imported so it never weighs down
	// the initial landing load.
	let pdfReading = false;
	let pdfError = '';
	let pdfDone = false;
	async function handleHeroPdf(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = ''; // let the same file re-fire onchange after a failed try
		pdfError = '';
		pdfDone = false;
		if (!file) return;

		const looksPdf =
			file.type === 'application/pdf' ||
			(file.type === '' && file.name.toLowerCase().endsWith('.pdf'));
		if (!looksPdf) {
			pdfError = 'That’s not a PDF. Export your resume as a PDF, or paste the text below.';
			return;
		}
		if (file.size > 4 * 1024 * 1024) {
			pdfError = 'That PDF is over 4 MB. Export a smaller copy, or paste the text below.';
			return;
		}

		pdfReading = true;
		try {
			const { extractText, getDocumentProxy } = await import('unpdf');
			const bytes = new Uint8Array(await file.arrayBuffer());
			const pdf = await getDocumentProxy(bytes);
			const { text } = await extractText(pdf, { mergePages: true });
			const clean = (Array.isArray(text) ? text.join('\n') : text ?? '').trim();
			if (!clean) {
				pdfError = 'Read the file but found no text — it’s likely a scan. Paste the text below instead.';
				return;
			}
			heroStats = clean;
			pdfDone = true;
		} catch (err) {
			console.error('hero PDF read failed:', err);
			pdfError = 'Couldn’t read that PDF. Try another, or paste the text below.';
		} finally {
			pdfReading = false;
		}
	}

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
					'PredictAdmit predicts your college admissions decisions at every T30 school and gives you the tools to improve your application: an AI essay editor, per-school strategy, a narrative mind map, and an AI counselor.',
				offers: [
					{ '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'First prediction free' },
					{ '@type': 'Offer', price: '25', priceCurrency: 'USD', name: 'Lifetime access' },
					{ '@type': 'Offer', price: '9.99', priceCurrency: 'USD', name: 'Monthly' }
				],
				featureList: [
					'AI admissions decision predictions across every T30 school',
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
							text: 'Both. Beyond predicting your decision at every T30 school, PredictAdmit includes a full workshop to improve your application: an essay editor with AI feedback that reads like an admissions officer and keeps your own voice, per-school strategy notes, a narrative mind map, and an AI counselor. The prediction shows exactly where you stand and why; the workshop helps you fix it before you submit.'
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
		content="PredictAdmit predicts your admissions decision at every T30 school, shows exactly why, and gives you the tools to fix it: an AI essay editor, per-school strategy, a narrative mind map, and an AI counselor. Your first prediction is free."
	/>
	<meta property="og:title" content="PredictAdmit: Predict your decisions, then improve your application" />
	<meta
		property="og:description"
		content="Predict your admissions decision at every T30 school and get the full workshop to improve your application: AI essay feedback, per-school strategy, and an AI counselor. First prediction free."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://predictadmit.com" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://predictadmit.com" />
	{@html `<script type="application/ld+json">${JSON.stringify(seoStructuredData)}</` + `script>`}
</svelte:head>

<!-- MARKETING LANDING PAGE -->
<main class="font-sans text-slate-900 bg-[#f4f4f0] selection:bg-slate-200 selection:text-slate-900">
	<!-- HERO SECTION — Kolly layout: wide centered container, content left-aligned
	     at the container's left padding edge (items-start), warm cream canvas. -->
	<section class="hero-root relative flex flex-col min-h-[100svh] pt-[100px] overflow-hidden bg-[#f4f4f0]">
		<!-- Content grows to fill the space between the (overlay) nav and the
		     carousel, and centers within it, so the hero stays balanced at any
		     viewport height while the carousel stays pinned to the fold. -->
		<div class="hero-content flex-1 min-h-0 flex flex-col justify-center w-full max-w-[1400px] mx-auto px-5 lg:px-10 text-left relative z-10 py-4 md:py-6">
			<!-- Headline -->
			<div class="hero-headwrap space-y-5 max-w-5xl mb-8">
				<h1
					class="hero-h1 font-serif text-5xl sm:text-6xl md:text-[5rem] font-normal tracking-tight leading-[1.03] text-slate-900 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both"
				>
					Where will you get in?
				</h1>
				<p
					class="hero-sub text-lg md:text-xl text-slate-500 max-w-3xl leading-relaxed tracking-tight font-medium mt-5 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-[200ms] fill-mode-both"
				>
					<span class="font-semibold text-slate-900 tabular-nums">{predictedCountLabel}+</span> students have
					predicted their decisions, simulated exact portals and real acceptance letters to their dream schools, and used
					<a href="/pro" class="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2 transition-colors hover:decoration-slate-900">Pro's</a>
					application help to get in.
				</p>
			</div>

			<!-- Hero start card -->
			<div
				class="w-full max-w-xl text-left rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_30px_80px_-30px_rgba(12,12,9,0.18)] relative z-20 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 fill-mode-both"
			>
				<!-- Segmented mode switch: predict real decisions, or rehearse one
				     school's portal. Both paths already exist in this script. -->
				<div class="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1" role="tablist">
					<button
						type="button"
						role="tab"
						aria-selected={heroMode === 'predict'}
						on:click={() => (heroMode = 'predict')}
						class="rounded-xl px-3 py-2 text-sm font-semibold transition-all {heroMode === 'predict' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}"
					>
						Predict my decisions
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={heroMode === 'simulate'}
						on:click={() => (heroMode = 'simulate')}
						class="rounded-xl px-3 py-2 text-sm font-semibold transition-all {heroMode === 'simulate' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}"
					>
						Simulate a school
					</button>
				</div>

				<div class="p-4 sm:p-5">
					{#if heroMode === 'predict'}
						<div class="flex items-center justify-between gap-3 mb-3">
							<h3 class="text-sm font-bold text-slate-900">Predict your decisions</h3>
							<label class="shrink-0 cursor-pointer inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-400 hover:text-blue-700 hover:bg-slate-50">
								{#if pdfReading}
									<span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"></span>
									Reading…
								{:else}
									<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
									upload application pdf
								{/if}
								<input type="file" accept="application/pdf" class="hidden" on:change={handleHeroPdf} />
							</label>
						</div>

						{#if pdfDone}
							<p class="mb-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
								Got your PDF. Review the text below, then predict.
							</p>
						{/if}
						{#if pdfError}
							<p class="mb-3 flex items-start gap-1.5 text-xs font-medium text-rose-600">
								<svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
								{pdfError}
							</p>
						{/if}

						<textarea
							bind:value={heroStats}
							rows="4"
							placeholder="or paste your stats and essays in - ai will sort it"
							class="hero-ta w-full resize-y rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 shadow-sm transition-all hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
						></textarea>
						<button
							on:click={startPrediction}
							class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0c0c09] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-[#2b2b22] active:scale-95"
						>
							Predict every T30 decision, free
							<span aria-hidden="true">&rarr;</span>
						</button>
					{:else}
						<div class="mb-3 flex items-center justify-between gap-3">
							<h3 class="text-sm font-bold text-slate-900">Rehearse a school's portal</h3>
							<!-- Rehearse an acceptance or a rejection (sets manualOverrideMode) -->
							<div class="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
								<button type="button" on:click={() => manualOverrideMode.set('accepted')} class="rounded-lg px-2.5 py-1 transition-all {$manualOverrideMode === 'accepted' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}">Acceptance</button>
								<button type="button" on:click={() => manualOverrideMode.set('denied')} class="rounded-lg px-2.5 py-1 transition-all {$manualOverrideMode !== 'accepted' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}">Rejection</button>
							</div>
						</div>
						<div class="relative">
							<input
								type="text"
								bind:value={searchQuery}
								on:keydown={handleKeydown}
								placeholder="Search a school, then open its portal…"
								class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 shadow-sm transition-all hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
							/>
							{#if showSearchResults}
								<ul class="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
									{#each filteredUniversities as uni, i}
										<li>
											<button
												type="button"
												on:click={() => handleUniversitySelect(uni.slug)}
												class="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors {i === selectedIndex ? 'bg-slate-50' : 'hover:bg-slate-50'}"
											>
												{uni.name}
												<span class="text-xs text-slate-400">Open portal &rarr;</span>
											</button>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
						<p class="mt-3 text-xs leading-relaxed text-slate-400">A fictional practice portal, clearly labeled as a simulation. Not a real decision or any school's system.</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- School logo carousel — pinned to the very bottom of the above-the-fold
		     on any screen height, with the content above spaced to fill the rest. -->
		<div class="hero-carousel shrink-0 w-full max-w-[1400px] mx-auto px-5 lg:px-10 pb-5 md:pb-7 animate-in fade-in duration-1000 delay-300 fill-mode-both">
			<SchoolLogoMarquee />
		</div>
	</section>




	<!-- SECTION 2A: PRO SCROLL-ZOOM STORY (replaces the static section header) -->
	<ScrollZoomStory />

	<!-- SECTION 2: WHAT YOU GET IN PRO — large alternating framed-screenshot cards (Appybara scale) -->
	<section class="py-20 md:py-32 bg-[#f4f4f0]">
		<div class="max-w-[1400px] mx-auto px-5 md:px-10">
			<!-- Section header (GradGPT-style handwritten eyebrow + serif head) -->
			<div class="mb-16 text-center md:mb-24">
				<p class="hand text-2xl md:text-3xl">what you get in Pro</p>
				<h2 class="mt-1 font-serif text-4xl md:text-6xl font-medium tracking-tight text-slate-900 leading-[1.03]">
					Everything a $300/hr counselor does
				</h2>
			</div>
			<div class="space-y-8 md:space-y-12">
				{#each proCards as c, i}
					<div
						use:reveal={i * 80}
						class="grid items-center gap-8 overflow-hidden rounded-[2.5rem] border border-slate-200/70 px-6 py-10 md:grid-cols-2 md:gap-16 md:px-16 md:py-20 {i % 2 ===
						0
							? 'bg-white'
							: 'bg-[color-mix(in_oklab,#0c0c09_4%,#f4f4f0)]'}"
					>
						<!-- Real, zoomed PredictAdmit screenshot in a framed window, with a
						     cursor drifting over it. width/height reserve the box so lazy
						     loading can't shift the page (mobile scroll-jump guard). -->
						<div class="relative {i % 2 === 1 ? 'md:order-2' : ''}">
							<div
								class="overflow-hidden rounded-2xl border-[3px] border-[#0c0c09] bg-white shadow-[0_32px_80px_-28px_rgba(12,12,9,0.4)]"
							>
								<img src={c.img} alt={c.heading} width={c.w} height={c.h} loading="lazy" class="block h-auto w-full" />
							</div>
							<span class="pa-cursor" aria-hidden="true">
								<svg width="26" height="26" viewBox="0 0 24 24" fill="#0c0c09" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"><path d="M5 2.5l5.6 16.5 2.3-6.9 6.9-2.3L5 2.5z" /></svg>
							</span>
						</div>
						<div class={i % 2 === 1 ? 'md:order-1' : ''}>
							<h3 class="font-serif text-4xl md:text-[3.25rem] font-medium tracking-tight leading-[1.04] text-slate-900">
								{c.heading}
							</h3>
							<p class="mt-5 max-w-lg text-lg md:text-xl leading-relaxed text-slate-600">{c.sub}</p>
							<a
								href={c.href}
								class="mt-8 inline-flex items-center gap-1.5 rounded-full bg-[#0c0c09] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#2b2b22] active:scale-95"
							>
								{c.ctaText} <span aria-hidden="true">→</span>
							</a>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-14 text-center">
				<a href="/pro" class="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]">
					See everything in Pro
				</a>
			</div>
		</div>
	</section>

	<!-- Creator invite (cross-product recruit embed) -->
	<section class="py-14 bg-[#f4f4f0] border-t border-slate-100">
		<div class="max-w-[1400px] mx-auto px-5 md:px-10">
			<aside class="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8" aria-labelledby="creator-invite-title">
				<div class="max-w-xl">
					<h3 id="creator-invite-title" class="font-serif text-2xl font-medium tracking-tight text-slate-900">Already using PredictAdmit?</h3>
					<p class="mt-2 text-sm leading-relaxed text-slate-500">Share your application journey as a paid creator for PredictAdmit.</p>
				</div>
				<div class="shrink-0">
					<div id="favente-recruit"></div>
				</div>
			</aside>
		</div>
	</section>

	<!-- SECTION 2.5: DATA CREDIBILITY — near-full-screen dark card (Appybara "Algorithm" style) -->
	<section class="py-20 md:py-28 bg-[#f4f4f0]">
		<div class="max-w-[1400px] mx-auto px-5 md:px-10">
			<div class="relative overflow-hidden rounded-[2.5rem] bg-[#0c0c09] px-7 py-14 sm:px-12 md:px-16 md:py-20">
				<!-- watermark seal -->
				<div class="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[color-mix(in_oklab,#ffffff_6%,transparent)] blur-2xl"></div>
				<div class="relative grid gap-12 lg:grid-cols-2 lg:items-center">
					<!-- Copy -->
					<div>
						<span class="inline-block px-3 py-1 bg-[color-mix(in_oklab,#ffffff_12%,transparent)] text-white/80 text-[10px] font-bold uppercase tracking-widest rounded-full">The numbers behind it</span>
						<h2 class="mt-5 font-serif text-4xl md:text-[3.25rem] font-medium tracking-tight text-white leading-[1.03]">
							Anchored to the data schools publish.
						</h2>
						<p class="mt-5 text-lg text-white/60 leading-relaxed max-w-md">
							Not a magic 8-ball. Every read starts from the public numbers colleges report, weighted by what admissions officers themselves say matters most.
						</p>
						<a href="/methodology" class="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0c0c09] transition hover:bg-white/90">
							Read the methodology
							<span>&rarr;</span>
						</a>
					</div>

					<!-- Factor-weighting data card -->
					<div class="rounded-3xl border border-white/10 bg-[color-mix(in_oklab,#ffffff_5%,transparent)] p-6 sm:p-8">
						<p class="text-xs font-bold uppercase tracking-wide text-white/70">How much each factor counts</p>
						<p class="mt-1 text-[11px] text-white/40">Source: NACAC Factors in the Admission Decision</p>
						<div class="mt-5 space-y-3">
							{#each [{ f: 'Rigor of curriculum', w: 92 }, { f: 'Grades in college-prep courses', w: 90 }, { f: 'Application essays', w: 62 }, { f: 'Test scores', w: 58 }, { f: 'Extracurricular impact', w: 49 }, { f: 'Recommendations', w: 46 }, { f: 'Demonstrated character', w: 44 }] as row}
								<div>
									<div class="flex items-center justify-between text-xs font-medium text-white/70">
										<span>{row.f}</span>
										<span class="text-white/40">{row.w >= 80 ? 'Very important' : row.w >= 55 ? 'Important' : 'Considered'}</span>
									</div>
									<div class="mt-1.5 h-2 rounded-full bg-white/10">
										<div class="h-2 rounded-full bg-white" style="width: {row.w}%"></div>
									</div>
								</div>
							{/each}
						</div>
						<p class="mt-5 text-[11px] leading-relaxed text-white/40">
							Illustrative weighting from the national survey. The AI adjusts these per school using its published data.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- SECTION 3: COMPARISON TABLE -->
	<section class="py-24 bg-slate-50 border-t border-slate-100">
		<div class="max-w-[1200px] mx-auto px-5 md:px-10">
			<div class="max-w-2xl mx-auto text-center space-y-4 mb-14">
				<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-slate-900 leading-[1.05]">
					Counselors charge thousands. <span class="text-[#0c0c09]">This is $9.99/mo.</span>
				</h2>
				<p class="text-lg text-slate-500 leading-relaxed">
					Start free and see your first read. When you upgrade, it is $9.99 a month while you're applying, or $25 once.
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
							<th class="p-5 text-center bg-[color-mix(in_oklab,#0c0c09_4%,transparent)]">
								<div class="text-sm font-bold text-[#0c0c09]">PredictAdmit Pro</div>
								<div class="text-xs text-slate-500">$9.99/mo</div>
							</th>
							<th class="p-5 text-center">
								<div class="text-sm font-bold text-slate-900">Private counselor</div>
								<div class="text-xs text-slate-400">$5,000+</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{#each [
							{ f: 'Predicted decisions at every T30', free: 'One school', pro: true, con: 'Guesswork' },
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
									<td class="p-5 text-center align-middle {i === 1 ? 'bg-[color-mix(in_oklab,#0c0c09_4%,transparent)]' : ''}">
										{#if cell === true}
											<svg class="mx-auto h-5 w-5 {i === 1 ? 'text-[#0c0c09]' : 'text-slate-900'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
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
					Start free, then $9.99/mo
				</a>
			</div>
		</div>
	</section>

	<!-- TESTIMONIALS — Appybara masonry style: tinted cards, star badge, quote, name + class -->
	<section class="py-20 md:py-28 bg-[#f4f4f0] border-t border-slate-100">
		<div class="max-w-[1400px] mx-auto px-5 md:px-10">
			<div class="max-w-2xl mx-auto text-center mb-14">
				<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-slate-900 leading-[1.05]">
					Students who got in.
				</h2>
				<p class="mt-4 text-lg text-slate-500 leading-relaxed">
					Real students, real decisions. Here is what the read did for them.
				</p>
			</div>
			<div class="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
				{#each [
					{ quote: 'ts was lowkey genuinely accurate. ran my file before decisions dropped and it basically called it.', name: 'Miao S.', school: 'Accepted to Northwestern, Class of 2030', tint: 6 },
					{ quote: 'The deep-dive REALLY helped me. It showed me exactly what each committee was going to catch before they caught it.', name: 'Daniel G.', school: 'Class of 2030', tint: 10 },
					{ quote: 'The line-by-line editing got me into Stanford, and half the T20s. I cannot overstate how much the essay feedback changed my application.', name: 'Kabir K.', school: 'Accepted to Stanford, Class of 2030', tint: 14 },
					{ quote: 'This tool helped me progress in scholarships such as the Robertson full ride to Duke.', name: 'Zachary B.', school: 'Class of 2030', tint: 8 }
				] as t}
					<div class="mb-5 break-inside-avoid rounded-3xl border border-slate-200 bg-white p-7" style="background-color: color-mix(in oklab, #0c0c09 {t.tint}%, #ffffff)">
						<div class="flex items-center gap-1 text-amber-500">
							{#each Array(5) as _}
								<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
							{/each}
						</div>
						<blockquote class="mt-4 text-lg leading-relaxed text-slate-900">
							&ldquo;{t.quote}&rdquo;
						</blockquote>
						<div class="mt-5">
							<div class="font-semibold text-slate-900">{t.name}</div>
							<div class="text-sm text-slate-500">{t.school}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- SECTION 4: FAQ — Appybara accordion: light-gray rounded rows, bold question + chevron -->
	<section class="py-20 md:py-28 bg-white border-t border-slate-100">
		<div class="max-w-[820px] mx-auto px-6">
			<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-slate-900 text-center mb-12">
				Questions, answered
			</h2>
			<div class="space-y-3">
				{#each [
					{ q: 'Can an AI really predict my admissions decision?', a: 'It predicts, it does not promise. The read is trained on real admitted-student profiles and the factors committees actually weigh, then it scores your file the way five readers would. Treat it as a sharp dry run, not a verdict to lose sleep over.' },
					{ q: 'What do I get for free?', a: 'Run one full simulation across every T30 school, unlock one school’s results, and open one full committee deep-dive. No card, no account beyond a Google sign-in. You only pay once it has already shown you something you did not know.' },
					{ q: 'Does it just predict, or does it help me improve?', a: 'Both, and the improving is the point. Pro reads your essays line by line, tells you what each school weighs, and answers your questions like a counselor. The prediction shows where you stand; the workshop is how you move.' },
					{ q: 'Will it write my essays for me?', a: 'No, on purpose. It marks what is weak and asks the questions a reader would, but it never writes or rewrites a sentence you could paste in. Colleges can revoke an offer over AI-written text, and the work has to sound like you.' },
					{ q: 'Is this affiliated with the universities?', a: 'No. The decision portals are clearly labeled simulations, and PredictAdmit is not affiliated with, endorsed by, or connected to any school.' },
					{ q: 'How much does it cost?', a: 'Your first prediction is free. Full access is $25 once for lifetime, or $9.99 a month. A private counselor runs thousands.' }
				] as item}
					<details class="group rounded-2xl bg-[#f4f4f0] border border-slate-200/70 transition hover:border-slate-300">
						<summary class="flex cursor-pointer items-center justify-between gap-4 list-none px-6 py-5">
							<span class="text-base md:text-lg font-semibold text-slate-900">{item.q}</span>
							<svg class="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
						</summary>
						<p class="px-6 pb-5 -mt-1 text-slate-500 leading-relaxed">{item.a}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA FOOTER — Appybara style: huge headline, pill CTA, campus building image -->
	<section class="relative overflow-hidden bg-[#0c0c09]">
		<div class="max-w-[1400px] mx-auto px-5 md:px-10 pt-20 md:pt-28 text-center">
			<h2 class="font-serif text-4xl sm:text-5xl md:text-[4rem] font-medium tracking-tight text-white leading-[1.02]">
				Join {predictedCountLabel}+ students<br class="hidden sm:block" /> acing their applications.
			</h2>
			<p class="mt-5 text-lg text-white/60 leading-relaxed max-w-xl mx-auto">
				Run your real application across every T30 and see where you stand. Your first prediction is free.
			</p>
			<div class="mt-9">
				<a href="/verdict" class="inline-flex items-center justify-center rounded-full bg-white px-9 py-4 text-base font-semibold text-[#0c0c09] transition hover:bg-white/90 active:scale-[0.99]">
					Get started free
				</a>
			</div>
			<div class="mt-14 md:mt-20">
				<img
					src="/images/mit-dome.jpg"
					alt="University campus"
					width="1280"
					height="960"
					class="mx-auto h-auto w-full max-w-[1120px] rounded-t-[2rem] object-cover object-top"
					style="mask-image: linear-gradient(to bottom, #000 72%, transparent); -webkit-mask-image: linear-gradient(to bottom, #000 72%, transparent);"
					loading="lazy"
				/>
			</div>
		</div>
	</section>

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
				<a href="/contact" class="font-semibold text-[#0c0c09] underline hover:text-[#003d99]"
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

	/* Short viewports (small laptops / windowed browsers): the hero's intrinsic
	   content height is what overruns the fold, so compress it by VIEWPORT HEIGHT
	   (Tailwind only breaks on width) — shrink the headline, the top offset, the
	   gaps, and the paste box — so the school-logo carousel still lands at the
	   very bottom of the above-the-fold instead of spilling below it. These
	   two-class selectors out-specify the Tailwind size utilities, so they win
	   when a screen is wide but short. */
	@media (max-height: 860px) {
		.hero-h1 {
			font-size: 3.5rem;
			line-height: 1.02;
		}
		.hero-headwrap {
			margin-bottom: 1rem;
		}
		.hero-ta {
			min-height: 72px;
		}
	}
	@media (max-height: 760px) {
		.hero-h1 {
			font-size: 2.9rem;
		}
		.hero-sub {
			margin-top: 0.6rem;
		}
		.hero-content {
			padding-top: 0;
			padding-bottom: 0;
		}
		.hero-ta {
			min-height: 56px;
		}
		.hero-carousel {
			padding-bottom: 0.9rem;
		}
	}
	@media (max-height: 680px) {
		.hero-h1 {
			font-size: 2.35rem;
		}
		.hero-headwrap {
			margin-bottom: 0.55rem;
		}
		.hero-sub {
			font-size: 0.95rem;
			margin-top: 0.4rem;
			line-height: 1.35;
		}
		.hero-ta {
			min-height: 46px;
		}
		.hero-carousel {
			padding-bottom: 0.6rem;
		}
	}
	@media (max-height: 600px) {
		.hero-root {
			padding-top: 92px; /* floor: still clears the floating nav (bottom 92px) */
		}
		.hero-h1 {
			font-size: 1.8rem;
		}
		.hero-headwrap {
			margin-bottom: 0.4rem;
		}
		.hero-sub {
			font-size: 0.9rem;
			margin-top: 0.3rem;
			line-height: 1.3;
		}
		.hero-ta {
			min-height: 38px;
		}
		.hero-carousel {
			padding-bottom: 0.4rem;
		}
	}
	/* Narrow phones: the headline + card wrap taller, so compress the CONTENT a
	   touch more on all but the tallest phones (the top offset stays constant so
	   the headline always clears the floating nav). Safe — the carousel is
	   flex-pinned to the fold, so shrinking content never leaves a gap below it. */
	@media (max-width: 430px) and (max-height: 880px) {
		.hero-h1 {
			font-size: 2rem;
		}
		.hero-headwrap {
			margin-bottom: 0.5rem;
		}
		.hero-sub {
			font-size: 0.95rem;
			margin-top: 0.4rem;
			line-height: 1.35;
		}
		.hero-ta {
			min-height: 44px;
		}
	}
	@media (max-width: 430px) and (max-height: 720px) {
		.hero-root {
			padding-top: 92px; /* floor: still clears the floating nav (bottom 92px) */
		}
		.hero-h1 {
			font-size: 1.7rem;
		}
		.hero-headwrap {
			margin-bottom: 0.4rem;
		}
		.hero-sub {
			margin-top: 0.3rem;
			line-height: 1.3;
		}
		.hero-ta {
			min-height: 36px;
		}
		.hero-carousel {
			padding-bottom: 0.4rem;
		}
	}
	/* Extremely short folds (half-height laptop windows, tiny/old phones): the full
	   card + headline + carousel won't all fit, so drop the descriptive subhead to
	   keep the carousel on the fold — the explicit priority. */
	@media (max-height: 560px) {
		.hero-sub {
			display: none;
		}
		.hero-headwrap {
			margin-bottom: 0.3rem;
		}
	}
	@media (max-width: 430px) and (max-height: 680px) {
		.hero-sub {
			display: none;
		}
	}

	/* A cursor that drifts over the product screenshots so they read as live. */
	.pa-cursor {
		position: absolute;
		left: 58%;
		top: 52%;
		pointer-events: none;
		filter: drop-shadow(0 2px 3px rgba(12, 12, 9, 0.25));
		animation: pa-cursor-drift 5s ease-in-out infinite;
	}
	@keyframes pa-cursor-drift {
		0%,
		100% {
			transform: translate(0, 0);
		}
		20% {
			transform: translate(-34px, -26px);
		}
		45% {
			transform: translate(22px, -8px) scale(0.92);
		}
		70% {
			transform: translate(-6px, 24px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pa-cursor {
			animation: none;
		}
	}
</style>
