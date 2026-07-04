<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { signIn } from '@auth/sveltekit/client';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';

	// NEW: bring in AdmitMail + types from the existing simulator
	import BetterAdmitMail from '$lib/components/BetterAdmitMail.svelte';
	import {
		sentEmails as baseSentEmails,
		type PortalEmail,
		type SentEmail
	} from '$lib/config/admitMail';

	import { userProfile } from '$lib/stores/user';
	import { majors } from '$lib/config/majors';

	// NEW: store AI results globally so portals can read decisions
	import { aiResults, currentStoreVersion } from '$lib/stores/results';

	let { data }: { data: PageData } = $props();
	let activeGenerationId = $state(0);
	const AI_PERSIST_KEY = 'predictadmit_ai_inbox_v1';
	let activeSupTab = $state('harvard'); // Set a default school

	type DecisionOutcome = 'admit' | 'deny' | 'waitlist' | 'defer';

	type AiDecision = {
		school: string;
		slug: string;
		outcome: DecisionOutcome;
		academic_score: number;
		academic_explanation: string;
		extracurricular_score: number;
		extracurricular_explanation: string;
		fit_score: number;
		fit_explanation: string;
		intellectual_score: number;
		intellectual_explanation: string;
		character_score: number;
		character_explanation: string;
		improvement_tips: string; // NEW: Detailed actionable feedback
	};

	type DeepDiveItem = {
		school: string;
		slug: string;
		outcome: DecisionOutcome;
		explanation: string;
	};
	// Application inputs (can be typed or filled via OCR)
	let essay = $state('');
	let activities = $state('');
	let honors = $state('');
	let transcript = $state('');
	let major = $state('');
	let supplementals = $state<Record<string, string>>({});
	// OCR state
	let ocrUploading = $state(false);
	let ocrError = $state('');
	let ocrText = $state('');

	// Major Autofill
	let majorSuggestions = $derived(
		major.length > 0
			? majors
					.filter((m) => m.toLowerCase().includes(major.toLowerCase()) && m !== major)
					.slice(0, 5)
			: []
	);
	let showMajorDropdown = $state(false);

	// Free-tier limits (persisted per browser)
	let hasUsedFreeSimulation = $state(false);
	let hasUsedFreePdfOcr = $state(false);
	let promoCodeInput = $state('');
	let showPaywallModal = $state(false);
	let paywallMode = $state<'simulation' | 'ocr' | 'deepDive' | null>(null);
	let paywallContextDecision = $state<AiDecision | null>(null);

	// Pro access (in a real app this would come from your backend / Stripe webhook)

	// Google sign-in (real: derived from Auth.js session)
	let googleSignedIn = $state(true);
	let googleEmail = $state('');
	let googleName = $state('');

	$effect(() => {
		googleSignedIn = !!data.session?.user;
		googleEmail = data.session?.user?.email ?? '';
		// This runs whenever data.session changes
	});

	// ED selection — every school we simulate that offers a binding ED, or a
	// restrictive/single-choice early plan (REA/SCEA). Public schools and
	// non-restrictive EA schools (MIT, Caltech, Georgia Tech, Michigan, UNC, USC,
	// the UCs, etc.) are intentionally excluded.
	const ED_SCHOOLS = [
		// Restrictive / single-choice early action (non-binding)
		{ slug: 'harvard', label: 'Harvard (REA)' },
		{ slug: 'stanford', label: 'Stanford (REA)' },
		{ slug: 'yale', label: 'Yale (SCEA)' },
		{ slug: 'princeton', label: 'Princeton (SCEA)' },
		{ slug: 'notredame', label: 'Notre Dame (REA)' },
		{ slug: 'georgetown', label: 'Georgetown (REA)' },
		// Binding Early Decision
		{ slug: 'columbia', label: 'Columbia (ED)' },
		{ slug: 'upenn', label: 'Penn (ED)' },
		{ slug: 'brown', label: 'Brown (ED)' },
		{ slug: 'dartmouth', label: 'Dartmouth (ED)' },
		{ slug: 'duke', label: 'Duke (ED)' },
		{ slug: 'northwestern', label: 'Northwestern (ED)' },
		{ slug: 'cornell', label: 'Cornell (ED)' },
		{ slug: 'uchicago', label: 'UChicago (ED I/II)' },
		{ slug: 'jhu', label: 'Johns Hopkins (ED I/II)' },
		{ slug: 'vanderbilt', label: 'Vanderbilt (ED I/II)' },
		{ slug: 'rice', label: 'Rice (ED)' },
		{ slug: 'wustl', label: 'WashU (ED I/II)' },
		{ slug: 'emory', label: 'Emory (ED I/II)' },
		{ slug: 'cmu', label: 'Carnegie Mellon (ED)' },
		{ slug: 'uva', label: 'UVA (ED)' },
		{ slug: 'nyu', label: 'NYU (ED I/II)' },
		{ slug: 'wakeforest', label: 'Wake Forest (ED I/II)' }
	];

	export const SCHOOLS = [
		{ school: 'Harvard University', slug: 'harvard' },
		{ school: 'Stanford University', slug: 'stanford' },
		{ school: 'Massachusetts Institute of Technology', slug: 'mit' },
		{ school: 'Princeton University', slug: 'princeton' },
		{ school: 'Yale University', slug: 'yale' },
		{ school: 'Columbia University', slug: 'columbia' },
		{ school: 'University of Chicago', slug: 'uchicago' },
		{ school: 'University of Pennsylvania', slug: 'upenn' },
		{ school: 'California Institute of Technology', slug: 'caltech' },
		{ school: 'Duke University', slug: 'duke' },
		{ school: 'Johns Hopkins University', slug: 'jhu' },
		{ school: 'Northwestern University', slug: 'northwestern' },
		{ school: 'Dartmouth College', slug: 'dartmouth' },
		{ school: 'Brown University', slug: 'brown' },
		{ school: 'Vanderbilt University', slug: 'vanderbilt' },
		{ school: 'Rice University', slug: 'rice' },
		{ school: 'Washington University in St. Louis', slug: 'wustl' },
		{ school: 'Cornell University', slug: 'cornell' },
		{ school: 'University of California, Los Angeles', slug: 'ucla' },
		{ school: 'University of California, Berkeley', slug: 'ucberkeley' }
	];

	const handlePromoCode = (e: KeyboardEvent) => {
		// Check if the key pressed was 'Enter'
		if (e.key === 'Enter') {
			// Prevent the form from submitting accidentally
			e.preventDefault();

			if (promoCodeInput.trim() === 'strawberrylemonade') {
				hasUsedFreeSimulation = false;
				hasDeepDiveAccess = true;
				userProfile.update((u) => ({ ...u, isPro: true }));
				promoCodeInput = ''; // Clear input on success
				alert('Promo code applied! Deep Dive unlocked.');
			} else {
				alert('Invalid promo code.');
			}
		}
	};

	let aiError = $state('');
	let aiDecisions = $state<AiDecision[]>([]);
	let deepDiveItems = $state<DeepDiveItem[]>([]);
	let deepDiveLoadingSlug = $state<string | null>(null);
	let applicantSummary = $state('');

	// === AdmitMail-style inbox state, driven by AI decisions ===

	// DOM handle for scroll (not used for auto-scroll in this file, but AdmitMail expects it)
	let inboxSection: HTMLElement | null = null;

	// view state for AdmitMail
	let mailViewMode = $state<'inbox' | 'email'>('inbox');
	let mailActiveFolder = $state<'inbox' | 'sent'>('inbox');
	// search + lists
	let searchQuery = $state('');
	let visiblePortals = $derived($aiResults?.decisions?.map(decisionToPortalEmail) ?? []);
	let sortedVisiblePortals = $derived([...visiblePortals]);

	// For complex logic like your search filter:
	let filteredPortals = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return [...visiblePortals];
		return visiblePortals.filter(
			(p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
		);
	});
	// ED / RD state (minimal in AI mode)
	let currentEdPortal: PortalEmail | null = null;
	let edEmailMustBeViewed = false;
	let hasViewedEdEmail = false;

	// selections + read tracking
	let readPortalSlugs = $state<Set<string>>(new Set());
	let selectedPortal = $state<PortalEmail | null>(null);
	let selectedSent = $state<SentEmail | null>(null);
	let edSlug = $state('');

	// Sent mail list reused from the static simulator
	const sentEmails: SentEmail[] = baseSentEmails;

	// Display name/email for AdmitMail
	let displayName = $derived(googleName?.trim() || 'Applicant');
	let displayEmail = $derived(googleEmail?.trim() || 'you@predictadmit.ai');

	// Map an AI decision into a PortalEmail shape that AdmitMail expects
	function decisionToPortalEmail(decision: AiDecision): PortalEmail {
		const schoolSlug = decision.slug || decision.school.toLowerCase().replace(/\s+/g, '-');

		return {
			slug: schoolSlug,
			name: decision.school,
			subject: `${decision.school} Application Status Update`,
			from: `${decision.school} Admissions <no-reply@${schoolSlug}.edu>`
		} as PortalEmail;
	}

	// Received label for AI decisions – simple placeholder timestamp
	function getReceivedLabelForAI(portal: PortalEmail): string {
		return 'March 20, 5:00 PM';
	}

	// === Persistence helpers for AI inbox ===

	function saveAiInboxState() {
		if (typeof localStorage === 'undefined') return;

		const state = {
			visiblePortals,
			readPortalSlugs: Array.from(readPortalSlugs),
			selectedPortal,
			selectedSent,
			mailViewMode,
			mailActiveFolder,
			searchQuery
		};

		try {
			localStorage.setItem(AI_PERSIST_KEY, JSON.stringify(state));
		} catch (err) {
			console.error('Failed to persist AI inbox state', err);
		}
	}

	// Callbacks that AdmitMail expects

	function selectPortal(portal: PortalEmail) {
		selectedPortal = portal;
		selectedSent = null;
		mailActiveFolder = 'inbox';
		mailViewMode = 'email';

		const next = new Set(readPortalSlugs);
		next.add(portal.slug);
		readPortalSlugs = next;

		saveAiInboxState();
	}

	function selectSent(message: SentEmail) {
		selectedSent = message;
		selectedPortal = null;
		mailActiveFolder = 'sent';
		mailViewMode = 'email';
		saveAiInboxState();
	}

	function switchFolder(folder: 'inbox' | 'sent') {
		mailActiveFolder = folder;
		mailViewMode = 'inbox';
		saveAiInboxState();
	}

	function openInboxList() {
		mailViewMode = 'inbox';
		saveAiInboxState();
	}

	// This is *not* the full simulator reset — just clears the AI inbox state.
	function resetInboxState() {
		activeGenerationId++;
		// 1. Kill the loop and the network requests
		aiResults.clear();

		// 3. Reset local $state variables
		aiDecisions = [];
		deepDiveItems = [];
		applicantSummary = '';

		// 4. Reset UI state variables (Ensure these are declared as $state)
		selectedPortal = null;
		selectedSent = null;
		readPortalSlugs = new Set();
		mailViewMode = 'inbox';
		mailActiveFolder = 'inbox';

		// 5. Update global profile state
		userProfile.update((u) => ({
			...u,
			isSubmittingAI: false,
			usingAI: false
		}));

		// 6. Persistence cleanup
		if (typeof localStorage !== 'undefined') {
			try {
				localStorage.removeItem(AI_PERSIST_KEY);
			} catch (err) {
				console.error('Failed to clear AI inbox state', err);
			}
		}
	}

	// Restore free-tier usage + Pro flag from localStorage and handle Stripe return
	onMount(() => {
		if (typeof window === 'undefined') return;

		const params = new URLSearchParams(window.location.search);

		// If we just came back from Stripe with ?upgrade=success, mark this browser as Pro
		if (params.get('upgrade') === 'success') {
			// Update the global store (which auto-persists to localStorage['predictadmit:user'])
			userProfile.update((u) => ({ ...u, isPro: true }));

			// Optional: clean ?upgrade=success from the URL
			window.history.replaceState({}, '', window.location.pathname);
		}

		// Restore free-tier usage flags (still used for non-Pro users)
		hasUsedFreeSimulation = localStorage.getItem('predictadmit_hasUsedFreeSimulation') === 'true';
		hasUsedFreePdfOcr = localStorage.getItem('predictadmit_hasUsedFreePdfOcr') === 'true';

		// Restore AI inbox state (visiblePortals, read flags, selected email, etc.)

		// NEW: Restore application inputs from persisted user profile if they exist
		const savedProfile = $userProfile.applicationProfile;
		if (savedProfile) {
			if (!essay && savedProfile.essays) essay = savedProfile.essays;
			if (!activities && savedProfile.activities) activities = savedProfile.activities;
			if (!honors && savedProfile.awards) honors = savedProfile.awards;
			if (!transcript && savedProfile.rigor) transcript = savedProfile.rigor;
		}
	});

	// Reactive Pro check
	let hasDeepDiveAccess = $derived($userProfile.isPro);

	function outcomeLabel(outcome: DecisionOutcome): string {
		if (outcome === 'admit') return 'Admitted';
		if (outcome === 'deny') return 'Denied';
		if (outcome === 'waitlist') return 'Waitlisted';
		return 'Deferred';
	}

	function outcomeClasses(outcome: DecisionOutcome): string {
		if (outcome === 'admit') {
			return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/70';
		}
		if (outcome === 'deny') {
			return 'bg-rose-500/10 text-rose-300 border-rose-400/70';
		}
		if (outcome === 'waitlist') {
			return 'bg-amber-500/15 text-amber-300 border-amber-400/70';
		}
		return 'bg-sky-500/15 text-sky-300 border-sky-400/70';
	}

	function isEDDecision(decision: AiDecision): boolean {
		return !!edSlug && decision.slug === edSlug;
	}

	function ensureHasSomeInput(): boolean {
		return !!essay.trim() || !!activities.trim() || !!honors.trim() || !!transcript.trim();
	}

	// NEW: Save current form state to the global store (persisted to localStorage)
	function saveToStore() {
		userProfile.update((u) => ({
			...u,
			applicationProfile: {
				...u.applicationProfile,
				essays: essay,
				activities: activities,
				awards: honors,
				rigor: transcript
				// Note: major and supplementals aren't in the default profile type yet,
				// but we can add them or just rely on these main ones for now.
			}
		}));
	}

	function openPaywall(mode: 'simulation' | 'ocr' | 'deepDive', decision?: AiDecision) {
		paywallMode = mode;
		paywallContextDecision = decision ?? null;
		showPaywallModal = true;
	}

	function closePaywall() {
		showPaywallModal = false;
		paywallMode = null;
		paywallContextDecision = null;
	}

	let checkoutLoading = $state(false);
	async function startCheckout(plan: 'lifetime' | 'monthly') {
		if (checkoutLoading) return;
		if (!googleSignedIn) {
			signIn('google', { callbackUrl: '/ai' });
			return;
		}
		checkoutLoading = true;
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pricingMode: plan })
			});
			const data = await res.json();
			if (data.url) {
				window.location.href = data.url;
				return;
			}
			alert('Checkout error: ' + (data.error || 'Unknown error'));
		} catch (e) {
			console.error(e);
			alert('Checkout error');
		} finally {
			checkoutLoading = false;
		}
	}

	async function runEvaluation() {
		saveToStore(); // Save before running
		const myId = currentStoreVersion + 1;

		if (!googleSignedIn) {
			aiError = 'Please sign in with Google first to create your AI application.';
			return;
		}

		if (!ensureHasSomeInput()) {
			aiError =
				'Add at least one piece of application data (essay, activities, honors, or transcript text) before applying to the AI simulator.';
			return;
		}

		// Free tier: one full simulation per browser. Pro unlocks unlimited runs.
		if (hasUsedFreeSimulation && !hasDeepDiveAccess) {
			openPaywall('simulation');
			return;
		}

		userProfile.update((u) => ({ ...u, isSubmittingAI: true }));
		userProfile.update((u) => ({ ...u, usingAI: true }));

		deepDiveItems = [];

		let myValidId: number = 0;

		try {
			// 1. Reset state before starting the loop
			aiResults.clear();
			myValidId = currentStoreVersion;
			aiDecisions = [];

			// 2. Define the payload without school-specific info
			const basePayload = {
				essay,
				activities,
				honors,
				transcript,
				major,
				supplementals,
				edSlug,
				googleEmail,
				googleName
			};

			// 3. Loop through each school slug
			// Note: Ensure SCHOOLS is imported or defined in your script
			for (const { slug } of SCHOOLS) {
				if (myValidId !== currentStoreVersion) return;

				const schoolSpecificSupplemental = supplementals[slug] || '';
				const res = await fetch(`/api/ai-evaluate/${slug}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						...basePayload,
						supplementals: schoolSpecificSupplemental
					})
				});
				if (myValidId !== currentStoreVersion) return;

				const data = await res.json();

				if (!res.ok || !(myValidId === currentStoreVersion)) {
					console.error(`Error evaluating ${slug}:`, data?.error);
					continue; // Skip failed schools and move to the next
				}

				// 4. Add individual decision to the store
				aiResults.addDecision({ ...data.decision, source: 'ai' }, myValidId, {
					major,
					applicantSummary: data.applicantSummary
				});

				// 5. Update local state for the UI
				aiDecisions = $aiResults.decisions;
				applicantSummary = data.applicantSummary;

				saveAiInboxState();

				// 6. Update the AdmitMail inbox in real-time
				// This will automatically update the inbox every time a new school is added
			}

			// --- Post-Loop Logic (Finalizing the run) ---

			if (!aiDecisions.length) {
				aiError =
					'The AI did not return any decisions. Try adding more detail to your application.';
			} else {
				hasUsedFreeSimulation = true;
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem('predictadmit_hasUsedFreeSimulation', 'true');
				}

				userProfile.update((u) => {
					const newProfile = { ...u.applicationProfile };
					if (!newProfile.essays && essay) newProfile.essays = essay;
					if (!newProfile.activities && activities) newProfile.activities = activities;
					if (!newProfile.awards && honors) newProfile.awards = honors;
					if (!newProfile.rigor && transcript) newProfile.rigor = transcript;

					return {
						...u,
						requestCount: (u.requestCount || 0) + 1,
						applicationProfile: newProfile
					};
				});

				selectedPortal = null;
				selectedSent = null;
				mailActiveFolder = 'inbox';
				mailViewMode = 'inbox';
			}
		} catch (err: any) {
			console.error(err);
			aiError = 'Network or server error while calling the AI evaluator.';
			return;
		} finally {
			if (currentStoreVersion === myValidId) {
				userProfile.update((u) => ({ ...u, isSubmittingAI: false }));
			}
		}
	}

	// 🔒 Deep Dive is now fully free for signed-in users
	async function requestDeepDive(decision: AiDecision) {

		if (!applicantSummary) {
			applicantSummary = [
				essay && `Personal essay:\n${essay}`,
				activities && `Activities / extracurriculars:\n${activities}`,
				honors && `Honors & awards:\n${honors}`,
				transcript && `Transcript / GPA & coursework:\n${transcript}`,
				major && `Intended major:\n${major}`,
				supplementals && `Supplemental prompts and essays:\n${supplementals}`
			]
				.filter(Boolean)
				.join('\n\n');
		}

		aiError = '';
		deepDiveLoadingSlug = decision.slug;

		try {
			const res = await fetch('/api/ai-deep-dive', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					// School Metadata
					school: decision.school,
					slug: decision.slug,
					outcome: decision.outcome,

					// Granular Scores
					academic_score: decision.academic_score,
					academic_explanation: decision.academic_explanation,
					extracurricular_score: decision.extracurricular_score,
					extracurricular_explanation: decision.extracurricular_explanation,
					fit_score: decision.fit_score,
					fit_explanation: decision.fit_explanation,
					intellectual_score: decision.intellectual_score,
					intellectual_explanation: decision.intellectual_explanation,
					character_score: decision.character_score,
					character_explanation: decision.character_explanation,

					// Feedback & Tips
					improvement_tips: decision.improvement_tips,
					applicantSummary,
					edSlug
				})
			});

			const data = await res.json();

			if (!res.ok) {
				aiError = data?.error ?? 'Something went wrong generating the deep dive.';
				return;
			}

			const deepDive = data.deepDive as DeepDiveItem | undefined;

			if (deepDive) {
				deepDiveItems = [...deepDiveItems.filter((d) => d.slug !== deepDive.slug), deepDive];
			}
		} catch (err) {
			console.error(err);
			aiError = 'Network or server error while calling the AI deep dive.';
		} finally {
			deepDiveLoadingSlug = null;
		}
	}

	// === OCR handler ===
	async function handleOcrChange(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		const file = target.files?.[0];

		ocrError = '';
		ocrText = '';

		if (!file) return;

		// PDF OCR is now free for signed-in users

		// Guard: only PDFs
		if (file.type !== 'application/pdf') {
			ocrError = 'Please upload a PDF file.';
			return;
		}

		const formData = new FormData();
		formData.append('file', file);

		ocrUploading = true;

		try {
			const res = await fetch('/api/ocr', {
				method: 'POST',
				body: formData
			});

			if (!res.ok) {
				const text = await res.text();
				console.error('OCR error:', text);
				ocrError = 'OCR failed on this file. Try another PDF or copy–paste manually.';
				return;
			}

			const data = (await res.json()) as { text?: string };
			ocrText = (data.text ?? '').trim();

			if (!ocrText) {
				ocrError = 'OCR completed but returned no text. The PDF might be image-only or locked.';
			} else {
				// Mark free OCR as used after a successful extraction
				hasUsedFreePdfOcr = true;
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem('predictadmit_hasUsedFreePdfOcr', 'true');
				}
			}
		} catch (err) {
			console.error(err);
			ocrError = 'Network error while calling OCR. Please try again.';
		} finally {
			ocrUploading = false;
		}
	}

	function applyOcrToEssay() {
		if (!ocrText) return;
		essay = ocrText;
	}

	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import RadarChart from '$lib/components/common/RadarChart.svelte';
</script>

<svelte:head>
	<title>PredictAdmit – AI Admissions Inbox</title>
</svelte:head>

<main
	class="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 text-slate-900 overflow-hidden font-sans"
>
	<!-- Decorative background elements -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div
			class="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/40 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"
		></div>
		<div
			class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"
		></div>
	</div>

	<!-- Main content wrapper -->
	<div class="relative z-10">
		<div class="max-w-[1000px] mx-auto px-6 py-24 space-y-16">
			<!-- Hero -->
			<header class="text-center space-y-6 max-w-2xl mx-auto">
				<div
					class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/10 to-emerald-600/10 border border-blue-200/50 backdrop-blur-sm"
				>
					<span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
					<span class="text-xs font-bold text-blue-700 tracking-wide"
						>AI-POWERED ADMISSIONS SIMULATOR</span
					>
				</div>

				<h1 class="text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
					Predict Your College<br />
					<span
						class="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
					>
						Results
					</span>
				</h1>

				<p class="text-lg text-slate-600 font-normal max-w-xl mx-auto leading-relaxed">
					Get <span class="font-bold text-emerald-600 relative">
						your first AI simulation free
						<svg
							class="absolute -bottom-1 left-0 w-full h-2"
							viewBox="0 0 100 10"
							preserveAspectRatio="none"
						>
							<path
								d="M0,7 Q25,3 50,7 T100,7"
								stroke="currentColor"
								stroke-width="2"
								fill="none"
								class="text-emerald-300"
							/>
						</svg>
					</span>. Every aspect of your application analyzed in depth—trained on real admissions
					results.
				</p>

				<p class="text-sm text-slate-500">
					Predictions use factor weights from NACAC's Factors in the Admission Decision survey.
					<a href="/methodology" class="font-medium text-[#0052CC] hover:underline"
						>Read our methodology →</a
					>
				</p>
			</header>

			<!-- Application builder + AI controls -->
			<section class="max-w-2xl mx-auto">
				<!-- Application card -->
				<Card
					class="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-2xl text-slate-900 rounded-3xl overflow-hidden"
				>
					<div class="p-8 md:p-10">
						<!-- Google sign-in bar -->
						<div
							class="mb-10 flex flex-col items-center justify-between gap-4 border-b border-slate-200 pb-8 md:flex-row"
						>
							<div class="space-y-1.5">
								<h2 class="font-bold text-xl text-slate-900 tracking-tight">Applicant Context</h2>
								<p class="text-xs text-slate-500">Your information stays private</p>
							</div>

							<div class="flex items-center gap-3">
								{#if googleSignedIn}
									<div
										class="text-xs text-right bg-slate-50 rounded-xl px-4 py-3 border border-slate-200"
									>
										<div class="font-bold text-slate-900">
											{googleName || 'Signed in'}
										</div>
										<div class="text-slate-500">
											{googleEmail}
										</div>
									</div>
								{:else}
									<button
										type="button"
										class="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg shadow-slate-900/5 border border-slate-200 hover:shadow-xl hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200"
										onclick={() => {
											saveToStore();
											signIn('google', { callbackUrl: '/ai' });
										}}
									>
										<svg class="w-4 h-4" viewBox="0 0 24 24">
											<path
												fill="#4285F4"
												d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											/>
											<path
												fill="#34A853"
												d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											/>
											<path
												fill="#FBBC05"
												d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											/>
											<path
												fill="#EA4335"
												d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											/>
										</svg>
										<span>Continue with Google</span>
									</button>
								{/if}
							</div>
						</div>

						<!-- Application inputs -->
						<form
							class="space-y-8"
							onsubmit={(e) => {
								e.preventDefault();
								runEvaluation();
							}}
							aria-label="AI admissions evaluation form"
						>
							<!-- PDF info + OCR upload area -->
							<div class="grid gap-6">
								<div
									class="group rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 border border-slate-200/60 hover:border-blue-300/40 transition-all duration-300"
								>
									<div class="flex items-center justify-between mb-4">
										<div class="flex items-center gap-3">
											<div
												class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25"
											>
												<svg
													class="w-5 h-5 text-white"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
													/>
												</svg>
											</div>
											<div>
												<h3 class="text-sm font-bold text-slate-900">Import from PDF</h3>
												<p class="text-xs text-slate-500 mt-0.5">
													Extract your Common App data instantly
												</p>
											</div>
										</div>
										<span
											class="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60 shadow-sm"
										>
											<span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
											OCR Beta
										</span>
									</div>

									<label class="flex items-center gap-3 cursor-pointer group/button">
										<div
											class="bg-white border-2 border-slate-300 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold group-hover/button:bg-slate-50 group-hover/button:border-blue-400 group-hover/button:text-blue-700 transition-all duration-200 shadow-sm"
										>
											Choose File
										</div>
										<input
											type="file"
											accept="application/pdf"
											class="hidden"
											onchange={handleOcrChange}
										/>
										<span class="text-sm text-slate-500 font-medium">
											{#if ocrUploading}
												<span class="flex items-center gap-2">
													<span
														class="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"
													></span>
													Extracting...
												</span>
											{:else if ocrText}
												<span class="text-emerald-600 flex items-center gap-1.5">
													<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
														<path
															fill-rule="evenodd"
															d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
															clip-rule="evenodd"
														/>
													</svg>
													Text extracted successfully
												</span>
											{:else}
												Common App PDF only
											{/if}
										</span>
									</label>

									{#if ocrError}
										<div
											class="mt-3 flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200"
										>
											<svg
												class="w-4 h-4 text-rose-500 mt-0.5"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
													clip-rule="evenodd"
												/>
											</svg>
											<p class="text-xs text-rose-700 font-medium">{ocrError}</p>
										</div>
									{/if}

									{#if ocrText}
										<div class="mt-4">
											<button
												type="button"
												onclick={applyOcrToEssay}
												class="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:gap-3 transition-all duration-200 group/insert"
											>
												<span>Insert extracted text into essay</span>
												<svg
													class="w-4 h-4 group-hover/insert:translate-y-0.5 transition-transform"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 14l-7 7m0 0l-7-7m7 7V3"
													/>
												</svg>
											</button>
										</div>
									{/if}
								</div>
							</div>

							<div class="space-y-7">
								<!-- Major -->
								<div class="space-y-2.5 relative">
									<label
										for="major"
										class="block text-sm font-bold text-slate-900 flex items-center gap-2"
									>
										<span class="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
										Intended Major
									</label>
									<input
										id="major"
										type="text"
										bind:value={major}
										class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm hover:border-slate-300 font-sans"
										placeholder="e.g. Computer Science, Comparative Literature..."
										onfocus={() => (showMajorDropdown = true)}
										onblur={() => setTimeout(() => (showMajorDropdown = false), 200)}
									/>
									{#if showMajorDropdown && majorSuggestions.length > 0}
										<div
											class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
										>
											{#each majorSuggestions as m}
												<button
													type="button"
													onclick={() => {
														major = m;
														showMajorDropdown = false;
													}}
													class="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors border-b border-slate-100 last:border-0"
												>
													{m}
												</button>
											{/each}
										</div>
									{/if}
								</div>

								<!-- Essay -->
								<div class="space-y-2.5">
									<label
										for="essay"
										class="block text-sm font-bold text-slate-900 flex items-center gap-2"
									>
										<span class="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
										Personal Essay
									</label>
									<textarea
										id="essay"
										bind:value={essay}
										rows="6"
										class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm hover:border-slate-300 font-sans resize-y"
										placeholder="Paste your personal statement here..."
									></textarea>
								</div>

								<!-- Supplements -->
								<div
									class="space-y-4 bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-200/60"
								>
									<div class="flex items-center justify-between gap-3">
										<div class="flex items-center gap-2.5">
											<span class="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
											<h3 class="text-base font-bold text-slate-900">Supplemental Essays</h3>
										</div>
										<span
											class="inline-flex items-center gap-1.5 text-[10px] bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-bold border border-blue-200/60 shadow-sm"
										>
											<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
												<path
													d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"
												/>
											</svg>
											AI Extrapolates
										</span>
									</div>

									<div
										class="flex items-start gap-2 p-3 rounded-lg bg-blue-50/50 border border-blue-100"
									>
										<svg
											class="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
												clip-rule="evenodd"
											/>
										</svg>
										<p class="text-xs text-blue-800 leading-relaxed">
											The supplemental you provide will be used as a quality baseline to extrapolate
											your fit/why-us performance for <strong>all other schools</strong> in the simulation.
										</p>
									</div>

									<div
										class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
									>
										{#each SCHOOLS as { school, slug }}
											<button
												type="button"
												class="px-4 py-2 rounded-full border-2 transition-all duration-200 font-medium text-sm whitespace-nowrap
                {activeSupTab === slug
													? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25'
													: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}"
												onclick={() => (activeSupTab = slug)}
											>
												{slug}
											</button>
										{/each}
									</div>

									<textarea
										bind:value={supplementals[activeSupTab]}
										placeholder="Paste the supplemental for {activeSupTab} here..."
										class="w-full h-48 bg-white border-2 border-slate-200 rounded-xl p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none shadow-sm hover:border-slate-300 transition-all font-sans resize-y"
									></textarea>
								</div>

								<!-- Promo Code -->
								<div class="space-y-2.5 border-t-2 border-slate-100 pt-6">
									<label
										for="promoCode"
										class="block text-sm font-bold text-slate-900 flex items-center gap-2"
									>
										<span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
										Promo Code <span class="text-xs font-normal text-slate-500">(Optional)</span>
									</label>
									<div class="relative max-w-xs">
										<input
											id="promoCode"
											type="text"
											bind:value={promoCodeInput}
											onkeydown={handlePromoCode}
											placeholder="Enter code and press Enter..."
											class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 font-sans shadow-sm hover:border-slate-300 transition-all"
										/>
										{#if hasDeepDiveAccess}
											<div
												class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5"
											>
												<span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
												<span class="text-xs text-emerald-600 font-bold">Active</span>
											</div>
										{/if}
									</div>
									<p class="text-xs text-slate-500 flex items-center gap-1.5">
										<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
												clip-rule="evenodd"
											/>
										</svg>
										Have a special access code? Enter it and press Enter to unlock premium features
									</p>
								</div>

								<!-- Activities -->
								<div class="space-y-2.5">
									<label
										for="activities"
										class="block text-sm font-bold text-slate-900 flex items-center gap-2"
									>
										<span class="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
										Activities / Résumé
									</label>
									<textarea
										id="activities"
										bind:value={activities}
										rows="4"
										class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 resize-y font-sans shadow-sm hover:border-slate-300 transition-all"
										placeholder="Paste your activities list or résumé bullets. If in PDF, copy-paste the text."
									></textarea>
								</div>
							</div>

							<div class="grid gap-6 md:grid-cols-2">
								<!-- Honors -->
								<div class="space-y-2.5">
									<label
										for="honors"
										class="block text-sm font-bold text-slate-900 flex items-center gap-2"
									>
										<span class="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
										Honors & Awards
									</label>
									<textarea
										id="honors"
										bind:value={honors}
										rows="3"
										class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 resize-y font-sans shadow-sm hover:border-slate-300 transition-all"
										placeholder="List major competitions, scholarships, and distinctions..."
									></textarea>
								</div>

								<!-- Transcript -->
								<div class="space-y-2.5">
									<label
										for="transcript"
										class="block text-sm font-bold text-slate-900 flex items-center gap-2"
									>
										<span class="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
										Transcript / GPA
									</label>
									<textarea
										id="transcript"
										bind:value={transcript}
										rows="3"
										class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 resize-y font-sans shadow-sm hover:border-slate-300 transition-all"
										placeholder="Include GPA, course rigor, key grades, testing, and context..."
									></textarea>
								</div>
							</div>

							<!-- ED selection + privacy note -->
							<div class="grid gap-6 md:grid-cols-2 items-start pt-6 border-t-2 border-slate-100">
								<div class="space-y-2.5">
									<label
										for="edSchool"
										class="block text-sm font-bold text-slate-900 flex items-center gap-2"
									>
										<span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
										Early Decision / REA
										<span class="text-xs font-normal text-slate-500">(Optional)</span>
									</label>
									<select
										id="edSchool"
										bind:value={edSlug}
										class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 shadow-sm hover:border-slate-300 transition-all font-sans cursor-pointer"
									>
										<option value="">No ED selected (RD only)</option>
										{#each ED_SCHOOLS as school}
											<option value={school.slug}>{school.label}</option>
										{/each}
									</select>
									<p class="text-xs text-slate-500 flex items-center gap-1.5">
										<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Binding choice • Reflects actual ED acceptance rates
									</p>
								</div>

								<div class="space-y-2 flex flex-col justify-end h-full">
									<div
										class="flex items-start gap-2 p-4 rounded-xl bg-slate-50 border border-slate-200"
									>
										<svg
											class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										<p class="text-xs text-slate-600 leading-relaxed">
											Your inputs are sent to our AI API for evaluation. We <strong
												class="text-slate-900">do not store</strong
											> your data. Nothing is sent to colleges.
										</p>
									</div>
								</div>
							</div>

							{#if aiError}
								<div
									class="flex items-start gap-3 p-4 rounded-xl bg-red-50 border-2 border-red-200"
								>
									<svg
										class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clip-rule="evenodd"
										/>
									</svg>
									<p class="text-sm font-bold text-red-700">{aiError}</p>
								</div>
							{/if}

							<!-- Submit button -->
							<div class="flex flex-col sm:flex-row items-center gap-4 pt-6">
								<button
									type={googleSignedIn ? 'submit' : 'button'}
									disabled={$userProfile.isSubmittingAI}
									onclick={!googleSignedIn
										? () => signIn('google', { callbackUrl: '/ai' })
										: undefined}
									class="group relative w-full rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
								>
									<!-- Animated border gradient -->
									<div
										class="absolute inset-[-200%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#3B82F6_50%,#8B5CF6_75%,#E2E8F0_100%)] opacity-0 group-hover:opacity-100 animate-spin-slow transition-opacity duration-300 pointer-events-none"
									></div>

									<!-- Button content -->
									<div
										class="relative m-[2px] rounded-[calc(1rem-2px)] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 px-8 py-5 transition-all duration-300"
									>
										<div
											class="text-base font-bold uppercase tracking-widest text-white flex items-center justify-center gap-3"
										>
											{#if !googleSignedIn}
												<svg class="w-5 h-5" viewBox="0 0 24 24">
													<path
														fill="currentColor"
														d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
													/>
													<path
														fill="currentColor"
														d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
													/>
													<path
														fill="currentColor"
														d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
													/>
													<path
														fill="currentColor"
														d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
													/>
												</svg>
												<span>Sign in with Google to Simulate</span>
											{:else if $userProfile.isSubmittingAI}
												<span class="flex items-center gap-3">
													<span
														class="h-5 w-5 animate-spin rounded-full border-3 border-white/30 border-t-white"
													></span>
													<span>Admissions Officers Analyzing...</span>
												</span>
											{:else if hasUsedFreeSimulation && !hasDeepDiveAccess}
												<span
													onclick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														goto('/pro');
													}}
													class="flex items-center gap-2.5"
												>
													<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
														<path
															d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
														/>
													</svg>
													Upgrade to Pro (Unlimited Runs)
												</span>
											{:else}
												<span class="flex items-center gap-2.5">
													<svg
														class="w-5 h-5"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M13 10V3L4 14h7v7l9-11h-7z"
														/>
													</svg>
													Submit Application
												</span>
											{/if}
										</div>
									</div>
								</button>

								<button
									type="button"
									class="text-sm text-slate-400 hover:text-slate-600 underline decoration-dotted underline-offset-2 transition-colors whitespace-nowrap"
									onclick={resetInboxState}
								>
									Clear AI inbox
								</button>
							</div>

							{#if applicantSummary}
								<details class="mt-6">
									<summary
										class="cursor-pointer font-semibold text-sm text-slate-700 hover:text-slate-900 flex items-center gap-2 transition-colors"
									>
										<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
										Preview extracted text
									</summary>
									<pre
										class="mt-3 max-h-48 overflow-auto whitespace-pre-wrap text-xs text-slate-600 border-2 border-slate-200 rounded-xl p-4 bg-slate-50/50 font-mono">{applicantSummary}</pre>
								</details>
							{/if}
						</form>
					</div>
				</Card>
			</section>

			<!-- AIMail Inbox -->
			{#if hasUsedFreeSimulation || $userProfile.isSubmittingAI}
				<section
					class="rounded-3xl border-2 border-slate-200 bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden mt-12"
				>
					{#if $userProfile.isSubmittingAI}
						<div
							class="border-b-2 border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30 px-6 py-4 flex items-center gap-3 text-sm text-slate-700"
						>
							<span
								class="h-4 w-4 animate-spin rounded-full border-3 border-slate-300 border-t-blue-600"
							></span>
							<span class="font-semibold">Simulating decision committee...</span>
						</div>
					{/if}

					{#if $userProfile.usingAI}
						<div class="bg-white min-h-[400px]">
							<BetterAdmitMail
								bind:inboxSection
								viewMode={mailViewMode}
								activeFolder={mailActiveFolder}
								bind:searchQuery
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
								{displayName}
								{displayEmail}
								getReceivedLabel={getReceivedLabelForAI}
								resetSimulation={resetInboxState}
								{selectPortal}
								{selectSent}
								{switchFolder}
								{openInboxList}
								{deepDiveItems}
								{deepDiveLoadingSlug}
								requestDeepDiveForSlug={(slug: string) => {
									const decision = aiDecisions.find(
										(d) => d.slug === slug || d.school.toLowerCase().replace(/\s+/g, '-') === slug
									);
									if (decision) {
										requestDeepDive(decision);
									}
								}}
							/>
						</div>
					{/if}

					{#if deepDiveItems.length}
						<div
							class="border-t-2 border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/20 px-6 py-8 space-y-6"
						>
							<div class="flex items-center justify-between gap-3">
								<div class="space-y-1.5">
									<div class="flex items-center gap-2">
										<div
											class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25"
										>
											<svg
												class="w-4 h-4 text-white"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
												/>
											</svg>
										</div>
										<p class="text-sm font-bold uppercase tracking-wider text-slate-900">
											Decision Analysis
										</p>
									</div>
									<p class="text-xs text-slate-600 max-w-xl leading-relaxed pl-10">
										Confidential admissions committee breakdown explaining your admit, deny, or
										waitlist decision
									</p>
								</div>
							</div>

							<div class="space-y-4">
								{#each deepDiveItems as item (item.slug)}
									<article
										class="group rounded-2xl border-2 border-slate-200 bg-white px-6 py-5 shadow-sm hover:shadow-lg hover:border-blue-300/50 transition-all duration-300"
									>
										<div class="flex flex-wrap items-center justify-between gap-3 mb-4">
											<div class="flex items-center gap-3">
												<h3 class="text-base font-bold text-slate-900">
													{item.school}
												</h3>
												<span
													class={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide border-2 shadow-sm ${
														item.outcome === 'admit'
															? 'bg-emerald-50 text-emerald-700 border-emerald-200'
															: item.outcome === 'deny'
																? 'bg-rose-50 text-rose-700 border-rose-200'
																: 'bg-amber-50 text-amber-700 border-amber-200'
													}`}
												>
													{#if item.outcome === 'admit'}
														<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
															<path
																fill-rule="evenodd"
																d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																clip-rule="evenodd"
															/>
														</svg>
													{:else if item.outcome === 'deny'}
														<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
															<path
																fill-rule="evenodd"
																d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
																clip-rule="evenodd"
															/>
														</svg>
													{:else}
														<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
															<path
																fill-rule="evenodd"
																d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
																clip-rule="evenodd"
															/>
														</svg>
													{/if}
													{outcomeLabel(item.outcome)}
												</span>
											</div>
											<span
												class="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200"
											>
												<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
													<path
														d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"
													/>
												</svg>
												AI Analysis
											</span>
										</div>

										<div
											class="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-sans bg-slate-50/50 rounded-xl p-4 border border-slate-100"
										>
											{item.explanation}
										</div>
									</article>
								{/each}
							</div>
						</div>
					{/if}
				</section>
			{/if}
		</div>
	</div>


	<style>
		@keyframes spin-slow {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
		.animate-spin-slow {
			animation: spin-slow 3s linear infinite;
		}

		/* Custom scrollbar styling */
		.scrollbar-thin {
			scrollbar-width: thin;
		}
		.scrollbar-thumb-slate-300::-webkit-scrollbar-thumb {
			background-color: rgb(203 213 225);
			border-radius: 9999px;
		}
		.scrollbar-track-slate-100::-webkit-scrollbar-track {
			background-color: rgb(241 245 249);
		}
	</style>
</main>

<!-- Pro paywall modal -->
{#if showPaywallModal}
	<div class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="presentation">
		<button class="absolute inset-0 cursor-default" aria-label="Close" onclick={closePaywall}></button>
		<div class="relative z-10 w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl" role="dialog" aria-modal="true" aria-label="Upgrade to Pro">
			<div class="p-6">
				<div class="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#0052CC]/10 text-[#0052CC]">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
				</div>
				<h3 class="mt-4 text-center text-xl font-bold text-slate-900">
					{paywallMode === 'simulation' ? "You've used your free simulation" : paywallMode === 'deepDive' ? 'Deep dives are a Pro feature' : 'This is a Pro feature'}
				</h3>
				<p class="mx-auto mt-2 max-w-sm text-center text-sm text-slate-500">
					Pro unlocks unlimited AI simulations, full deep-dive decision analyses, and unlimited
					essay grading. One upgrade, everything included.
				</p>
				<div class="mt-6 space-y-2">
					<button
						onclick={() => startCheckout('lifetime')}
						disabled={checkoutLoading}
						class="w-full rounded-xl bg-[#0052CC] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0047b3] disabled:opacity-50"
					>
						{checkoutLoading ? 'Starting secure checkout…' : 'Lifetime Pro — $9 once'}
					</button>
					<button
						onclick={() => startCheckout('monthly')}
						disabled={checkoutLoading}
						class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
					>
						Monthly — $5/mo, cancel anytime
					</button>
				</div>
				<button onclick={closePaywall} class="mt-4 w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600">
					Maybe later
				</button>
			</div>
		</div>
	</div>
{/if}

<SiteFooter />
