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
	import { track, trackBeginCheckout, trackTrialStart, trackPurchase } from '$lib/analytics';
	import { STRIPE_PRODUCTS } from '$lib/config/stripe-products';
	import { nextMilestonePhrase } from '$lib/admissionsCalendar';
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

	// "Paste everything you've got" → autofill every field.
	let pasteBlob = $state('');
	let parsing = $state(false);
	let parseError = $state('');
	let parseNotice = $state('');
	let parsedFieldKeys = $state<string[]>([]);
	// Which field is currently being typed in (drives the glow highlight).
	let fillingField = $state<string | null>(null);

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
	// Retained for compatibility; the paywall now shows the one-time tiers directly
	// (no deferred-pricing toggle), so this is effectively unused.
	let showPlans = $state(false);

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

	// Runs the AI simulation across every school that has a portal page + a
	// backend SCHOOL_MAP entry (keep these in sync with SCHOOL_MAP in
	// src/routes/api/ai-evaluate/[slug]/+server.ts).
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
		{ school: 'Cornell University', slug: 'cornell' },
		{ school: 'Vanderbilt University', slug: 'vanderbilt' },
		{ school: 'Rice University', slug: 'rice' },
		{ school: 'Washington University in St. Louis', slug: 'wustl' },
		{ school: 'University of Notre Dame', slug: 'notredame' },
		{ school: 'Georgetown University', slug: 'georgetown' },
		{ school: 'Emory University', slug: 'emory' },
		{ school: 'University of California, Berkeley', slug: 'ucberkeley' },
		{ school: 'University of California, Los Angeles', slug: 'ucla' },
		{ school: 'University of Southern California', slug: 'usc' },
		{ school: 'University of Michigan', slug: 'umich' },
		{ school: 'University of North Carolina at Chapel Hill', slug: 'unc' },
		{ school: 'University of Virginia', slug: 'uva' },
		{ school: 'New York University', slug: 'nyu' },
		{ school: 'Carnegie Mellon University', slug: 'cmu' },
		{ school: 'Georgia Institute of Technology', slug: 'georgiatech' },
		{ school: 'University of California, San Diego', slug: 'ucsd' },
		{ school: 'University of California, Irvine', slug: 'uci' },
		{ school: 'University of California, Davis', slug: 'ucdavis' },
		{ school: 'Wake Forest University', slug: 'wakeforest' },
		{ school: 'University of Florida', slug: 'uf' },
		{ school: 'University of Wisconsin–Madison', slug: 'wisconsin' },
		{ school: 'Purdue University', slug: 'purdue' },
		{ school: 'The Ohio State University', slug: 'osu' },
		{ school: 'Western Washington University', slug: 'wwu' }
	];

	const handlePromoCode = (e: KeyboardEvent) => {
		// Check if the key pressed was 'Enter'
		if (e.key === 'Enter') {
			// Prevent the form from submitting accidentally
			e.preventDefault();

			// Promo codes no longer unlock Pro from the client. The old
			// `strawberrylemonade` string shipped in the JS bundle, so ANY visitor
			// could read it and grant themselves free Pro (unlimited free sims) —
			// exactly the "accidental Pro for free users" hole. Predictions now
			// require a real trial/subscription. To offer a promo, apply a Stripe
			// coupon to the trial checkout instead (server-validated).
			promoCodeInput = '';
			alert('To run predictions, unlock Full Season.');
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

		// If we just came back from Stripe with ?upgrade=success, VERIFY the payment
		// with Stripe before unlocking anything. Granting on the URL param alone was
		// a free-unlock hole (anyone could visit /ai?upgrade=success). We confirm
		// payment_status:paid AND read the plan from Stripe metadata (not the URL),
		// so a user can't replay a $14.99 school session to claim lifetime.
		if (params.get('upgrade') === 'success') {
			const sessionId = params.get('session_id');
			(async () => {
				try {
					if (!sessionId) return; // no session to verify → grant nothing
					const res = await fetch(
						`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`
					);
					const data = await res.json().catch(() => null);
					// One-time / immediately-billed plans must be fully paid. A free
					// trial completes with payment_status:'no_payment_required', so we
					// instead confirm the subscription actually entered 'trialing'
					// (or 'active') before unlocking Pro.
					const complete = res.ok && data && data.status === 'complete';
					const paid = complete && data.payment_status === 'paid';
					const trialStarted =
						complete &&
						(data.subscription_status === 'trialing' ||
							data.subscription_status === 'active');
					if (!paid && !trialStarted) return; // not confirmed → do NOT unlock
					const vPlan = data.plan as string | null;
					const vSlug = data.slug as string | null;
					// Per-school unlock (new 'single' $29, or legacy 'school' $14.99):
					// grants ONE school's deep-dive, not full access.
					if ((vPlan === 'single' || vPlan === 'school') && vSlug) {
						userProfile.update((u) => ({
							...u,
							proSchools: u.proSchools.includes(vSlug)
								? u.proSchools
								: [...u.proSchools, vSlug]
						}));
						trackPurchase(
							vPlan,
							STRIPE_PRODUCTS[vPlan === 'single' ? 'single' : 'school'].amountCents / 100,
							sessionId ?? undefined
						);
					} else if (
						// Full-access one-time passes (new + legacy) → Pro.
						vPlan === 'season' ||
						vPlan === 'season_plus' ||
						vPlan === 'lifetime' ||
						vPlan === 'monthly' ||
						(vPlan === 'trial' && trialStarted)
					) {
						userProfile.update((u) => ({ ...u, isPro: true }));
						// A legacy trial start is $0 today — fire trial_start (value 0);
						// paid plans fire purchase with their real amount.
						if (vPlan === 'trial') trackTrialStart();
						else {
							const amt =
								vPlan === 'season'
									? STRIPE_PRODUCTS.season.amountCents
									: vPlan === 'season_plus'
										? STRIPE_PRODUCTS.seasonPlus.amountCents
										: vPlan === 'lifetime'
											? STRIPE_PRODUCTS.lifetime.amountCents
											: STRIPE_PRODUCTS.monthly.amountCents;
							trackPurchase(vPlan, amt / 100, sessionId ?? undefined);
						}
					}
				} catch (err) {
					console.error('Payment verification failed', err);
				} finally {
					// Clean the query string either way so a refresh can't retrigger.
					window.history.replaceState({}, '', window.location.pathname);
				}
			})();
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
		showPlans = false;
		showPaywallModal = true;
		track('paywall_view', { mode, school: decision?.slug });
	}

	function closePaywall() {
		showPaywallModal = false;
		paywallMode = null;
		paywallContextDecision = null;
		showPlans = false;
	}

	// Parent-payer path: the applicant often isn't the card-holder. Let them hand
	// the decision (and the $ vs a $200/hr counselor anchor) to a parent.
	async function sendToParent() {
		track('send_to_parent');
		if (typeof window === 'undefined') return;
		const url = `${window.location.origin}/pro`;
		const text =
			'I found PredictAdmit — its AI predicts my real admissions decisions across all 39 schools. It’s a one-time $99, way cheaper than a counselor. Can we?';
		try {
			if (navigator.share) {
				await navigator.share({ title: 'PredictAdmit', text, url });
				return;
			}
		} catch {
			/* user cancelled — fall through to copy */
		}
		try {
			await navigator.clipboard.writeText(`${text} ${url}`);
			alert('Copied — paste it in a text to your parent.');
		} catch {
			window.location.href = `mailto:?subject=${encodeURIComponent('PredictAdmit')}&body=${encodeURIComponent(`${text} ${url}`)}`;
		}
	}

	let checkoutLoading = $state(false);
	async function startCheckout(
		plan: 'season' | 'season_plus' | 'single',
		decision?: AiDecision
	) {
		if (checkoutLoading) return;
		if (!googleSignedIn) {
			track('sign_in_click', { source: 'checkout', plan });
			signIn('google', { callbackUrl: '/ai' });
			return;
		}
		checkoutLoading = true;
		const _amt =
			plan === 'season'
				? STRIPE_PRODUCTS.season.amountCents
				: plan === 'season_plus'
					? STRIPE_PRODUCTS.seasonPlus.amountCents
					: STRIPE_PRODUCTS.single.amountCents;
		trackBeginCheckout(plan, _amt / 100);
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(
					plan === 'single' && decision
						? { pricingMode: plan, slug: decision.slug, schoolName: decision.school }
						: { pricingMode: plan }
				)
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
			aiError = 'Sign in with Google first, then we can run this.';
			return;
		}

		if (!ensureHasSomeInput()) {
			aiError =
				'Give it something to read first — an essay, your activities, honors, or transcript.';
			return;
		}

		// One free prediction, then the wall. A signed-in non-Pro user gets their
		// FIRST full simulation free — the aha moment that converts. Once they've
		// used it, any further run opens the paywall to start the trial. Pro/trial
		// users are unlimited. The server enforces the same one-free window via an
		// httpOnly cookie, so clearing localStorage can't grind out unlimited runs.
		if (!hasDeepDiveAccess && hasUsedFreeSimulation) {
			openPaywall('simulation');
			return;
		}

		track('simulation_start');
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

				// Server says no active plan (e.g. a trial that ended while the local
				// isPro flag is stale) — the server is the source of truth, so drop
				// the local Pro flag and send them to the paywall instead of grinding
				// through 38 failing schools.
				if (res.status === 402 || data?.code === 'plan_required') {
					userProfile.update((u) => ({ ...u, isPro: false }));
					openPaywall('simulation');
					return;
				}

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
					'No predictions came back. Add more detail and try again.';
			} else {
				track('simulation_complete', { schools: aiDecisions.length });
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
			aiError = 'Something broke on the way to the AI. Try running it again.';
			return;
		} finally {
			if (currentStoreVersion === myValidId) {
				userProfile.update((u) => ({ ...u, isSubmittingAI: false }));
			}
		}
	}

	// 🔒 Deep Dive requires Full Access or a School Pass for that school
	function hasSchoolAccess(slug: string): boolean {
		return $userProfile.isPro || ($userProfile.proSchools ?? []).includes(slug);
	}

	async function requestDeepDive(decision: AiDecision) {
		if (!hasSchoolAccess(decision.slug)) {
			openPaywall('deepDive', decision);
			return;
		}

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
				aiError = data?.error ?? 'The deep dive didn’t come through.';
				return;
			}

			const deepDive = data.deepDive as DeepDiveItem | undefined;

			if (deepDive) {
				deepDiveItems = [...deepDiveItems.filter((d) => d.slug !== deepDive.slug), deepDive];
			}
		} catch (err) {
			console.error(err);
			aiError = 'Couldn’t reach the deep dive. Give it another go.';
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
				ocrError = 'That PDF didn’t read cleanly. Try a different one, or just paste the text.';
				return;
			}

			const data = (await res.json()) as { text?: string };
			ocrText = (data.text ?? '').trim();

			if (!ocrText) {
				ocrError = 'Read the file but found no text — it’s probably a scanned image or locked.';
			} else {
				// Mark free OCR as used after a successful extraction
				hasUsedFreePdfOcr = true;
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem('predictadmit_hasUsedFreePdfOcr', 'true');
				}
				// The whole point of the upload: turn the extracted text into filled
				// fields automatically, not just a blob the student re-sorts by hand.
				await parseAndFill(ocrText);
			}
		} catch (err) {
			console.error(err);
			ocrError = 'Couldn’t reach the reader. Give it another shot.';
		} finally {
			ocrUploading = false;
		}
	}

	function applyOcrToEssay() {
		if (!ocrText) return;
		essay = ocrText;
	}

	// Send one blob of text (OCR'd PDF or a big paste) to the parser and drop the
	// pieces into the right boxes. We only OVERWRITE a field when the parser
	// actually found something for it, so a partial resume never wipes work the
	// student already typed.
	const FIELD_LABELS: Record<string, string> = {
		transcript: 'GPA & scores',
		activities: 'Activities',
		honors: 'Honors',
		essay: 'Essay',
		major: 'Major'
	};

	// Visual order the boxes fill in (top → bottom of the form).
	const FILL_ORDER = ['major', 'transcript', 'activities', 'honors', 'essay'] as const;

	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

	// Type text into a field progressively so the user watches it populate.
	async function typeReveal(text: string, set: (v: string) => void) {
		const total = text.length;
		set('');
		if (total <= 48) {
			const steps = 10;
			for (let i = 1; i <= steps; i++) {
				set(text.slice(0, Math.ceil((total * i) / steps)));
				await sleep(26);
			}
		} else {
			const chunk = Math.max(8, Math.ceil(total / 45));
			for (let i = chunk; i < total; i += chunk) {
				set(text.slice(0, i));
				await sleep(15);
			}
		}
		set(text);
	}

	// Fill each box one after another, gliding to it with a glow, so the autofill
	// reads as the AI "writing in" the application rather than a silent snap.
	async function animateFill(f: Record<string, string>) {
		const setters: Record<string, (v: string) => void> = {
			major: (v) => (major = v),
			transcript: (v) => (transcript = v),
			activities: (v) => (activities = v),
			honors: (v) => (honors = v),
			essay: (v) => (essay = v)
		};
		for (const key of FILL_ORDER) {
			const text = f[key];
			if (!text) continue;
			fillingField = key;
			try {
				document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			} catch {
				/* SSR / no DOM */
			}
			await sleep(180);
			await typeReveal(text, setters[key]);
			await sleep(160);
		}
		fillingField = null;
	}

	async function parseAndFill(text: string) {
		const source = (text ?? '').trim();
		parseError = '';
		parseNotice = '';
		parsedFieldKeys = [];
		if (source.length < 20) {
			parseError = 'Need a bit more to work with — paste a resume, a brag sheet, or your activities list.';
			return;
		}

		parsing = true;
		let fields: Record<string, string> | null = null;
		try {
			const res = await fetch('/api/parse-application', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: source })
			});
			const data = await res.json();
			if (!res.ok) {
				parseError = data?.error ?? 'That didn’t parse. Paste it again?';
				return;
			}
			fields = (data.fields ?? {}) as Record<string, string>;
		} catch (err) {
			console.error('parseAndFill error:', err);
			parseError = 'Connection dropped mid-read. Try again.';
			return;
		} finally {
			parsing = false;
		}

		const present = FILL_ORDER.filter((k) => fields && fields[k]);
		if (!present.length) {
			parseError = "Nothing in there looked like application details. A resume or brag sheet works better.";
			return;
		}
		parsedFieldKeys = [...present];
		// Watch every box get written in, one by one.
		await animateFill(fields!);
		parseNotice = `Filled ${present.length} field${present.length > 1 ? 's' : ''}. Read them over and fix anything that's off.`;
	}

	// Glow applied to whichever field is currently being typed into.
	function fillClass(key: string) {
		return fillingField === key
			? ' ring-4 ring-blue-500/40 border-blue-500 bg-blue-50/40'
			: '';
	}

	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import RadarChart from '$lib/components/common/RadarChart.svelte';
</script>

<svelte:head>
	<title>Predict My Decisions – PredictAdmit</title>
</svelte:head>

<main
	class="relative min-h-screen bg-[#FAFAFA] text-slate-900 overflow-hidden font-sans"
>
	<!-- Decorative background elements -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div
			class="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/40 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"
		></div>
		<div
			class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/25 to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"
		></div>
	</div>

	<!-- Main content wrapper -->
	<div class="relative z-10">
		<div class="max-w-[1000px] mx-auto px-6 py-24 space-y-16">
			<!-- Hero -->
			<header class="text-center space-y-6 max-w-2xl mx-auto">
				<div
					class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100"
				>
					<span class="w-2 h-2 bg-[#0052CC] rounded-full animate-pulse"></span>
					<span class="text-xs font-bold text-[#0052CC] tracking-wide"
						>AI-POWERED ADMISSIONS SIMULATOR</span
					>
				</div>

				<h1 class="text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
					Predict Your College<br />
					<span class="text-[#0052CC]"> Results </span>
				</h1>

				<p class="text-lg text-slate-600 font-normal max-w-xl mx-auto leading-relaxed">
					PredictAdmit's AI reads every part of your application and predicts your decision at all 39
					top schools — trained until it reproduced our founding team's own admissions results.
					<span class="font-bold text-[#0052CC]">Your first prediction is free — sign in with Google to run it.</span>
				</p>

				<p class="text-sm text-slate-500">
					Predictions use factor weights from NACAC's Factors in the Admission Decision survey.
					<a href="/methodology" class="font-medium text-[#0052CC] hover:underline"
						>Read our methodology →</a
					>
				</p>

				<p
					class="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm leading-relaxed text-amber-900"
				>
					Calibrated on real decisions: we tuned PredictAdmit until it reproduced our founding team's own college admissions results, so it reads your profile far more sharply than a generic ChatGPT guess. Still — it's an AI prediction and could be wrong,
					so don't think about it too deeply or treat it like a real admissions decision.
				</p>
			</header>

			<!-- Anyone can fill in their application below and run ONE free prediction.
			     After that, RUNNING again requires Full Season — the submit button
			     flips to "Unlock all 39 schools" for used-free non-Pro users,
			     runEvaluation double-checks, and the AI route is server-enforced
			     (guardEvaluation meters the one free run). Letting people invest the
			     effort + feel the aha BEFORE the wall lifts conversion. -->
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
								<h2 class="font-bold text-xl text-slate-900 tracking-tight">Your application</h2>
								<p class="text-xs text-slate-500">Stays on your side — we don't keep it</p>
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
										<span>Sign in with Google</span>
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
												<h3 class="text-sm font-bold text-slate-900">Autofill the boxes</h3>
												<p class="text-xs text-slate-500 mt-0.5">
													Drop in a PDF or a wall of text. We split it into the fields below.
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
													Got the text
												</span>
											{:else}
												Common App PDF works best
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

									<!-- Autofill status: which fields got populated -->
									{#if parsing}
										<div class="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600">
											<span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"></span>
											Reading it and sorting the pieces into fields…
										</div>
									{:else if fillingField}
										<div class="mt-3 flex items-center gap-2 text-sm font-semibold text-blue-700">
											<span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></span>
											Writing in your {FIELD_LABELS[fillingField] ?? fillingField}…
										</div>
									{:else if parseNotice}
										<div class="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 p-3">
											<p class="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
												<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
												{parseNotice}
											</p>
											<div class="mt-2 flex flex-wrap gap-1.5">
												{#each parsedFieldKeys as k}
													<span class="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-white border border-emerald-200 rounded-full px-2 py-0.5">{FIELD_LABELS[k] ?? k}</span>
												{/each}
											</div>
										</div>
									{/if}

									{#if parseError}
										<div class="mt-3 flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
											<svg class="w-4 h-4 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
											<p class="text-xs text-amber-800 font-medium">{parseError}</p>
										</div>
									{/if}

									<!-- Or paste one big blob -->
									<div class="mt-4 pt-4 border-t border-slate-200/70">
										<label for="paste-blob" class="block text-xs font-semibold text-slate-500 mb-2">
											No PDF handy? Paste a resume, brag sheet, or your Common App activities:
										</label>
										<textarea
											id="paste-blob"
											bind:value={pasteBlob}
											rows="4"
											placeholder="Dump it all here — GPA, scores, activities, awards, essay. We'll split it into the right boxes."
											class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm resize-y font-sans"
										></textarea>
										<button
											type="button"
											onclick={() => parseAndFill(pasteBlob)}
											disabled={parsing || !!fillingField || pasteBlob.trim().length < 20}
											class="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
										>
											<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4"/><path d="M13 3l3.5 8.5L21 13l-8.5 1.5L11 23l-1.5-8.5L1 13l8.5-1.5z"/></svg>
											{parsing ? 'Reading…' : fillingField ? 'Autofilling…' : 'Autofill my application'}
										</button>
									</div>
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
										class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm hover:border-slate-300 font-sans{fillClass('major')}"
										placeholder="e.g. Computer Science, Comparative Literature"
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
										class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm hover:border-slate-300 font-sans resize-y{fillClass('essay')}"
										placeholder="Paste your personal statement."
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
One fills the rest
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
											Write one supplemental well and we read it as your baseline, then estimate your
											fit and why-us answer for <strong>every other school</strong> from it.
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
										placeholder="Paste your {activeSupTab} supplemental."
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
											placeholder="Type a code, hit Enter"
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
										Got an access code? Enter it and hit Enter to turn on Pro.
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
										class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 resize-y font-sans shadow-sm hover:border-slate-300 transition-all{fillClass('activities')}"
										placeholder="Paste your activities list or résumé bullets. If it's a PDF, copy the text over."
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
										class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 resize-y font-sans shadow-sm hover:border-slate-300 transition-all{fillClass('honors')}"
										placeholder="Competitions, scholarships, anything you'd actually list."
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
										class="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 resize-y font-sans shadow-sm hover:border-slate-300 transition-all{fillClass('transcript')}"
										placeholder="GPA, course rigor, test scores, and any context that matters."
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
Picking one applies that school's real early-round odds
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
											Your inputs go to the AI to be scored, and that's it. We <strong
												class="text-slate-900">don't keep them</strong
											>, and nothing ever reaches a college.
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
												<span>Sign in — run your free prediction</span>
											{:else if $userProfile.isSubmittingAI}
												<span class="flex items-center gap-3">
													<span
														class="h-5 w-5 animate-spin rounded-full border-3 border-white/30 border-t-white"
													></span>
													<span>Reading your file...</span>
												</span>
											{:else if !hasDeepDiveAccess && hasUsedFreeSimulation}
												<span
													onclick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														openPaywall('simulation');
													}}
													class="flex items-center gap-2.5"
												>
													<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
														<path
															d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
														/>
													</svg>
													Unlock all 39 schools
												</span>
											{:else if !hasDeepDiveAccess}
												<!-- First run is on the house — this SUBMITS (runs the sim), no paywall. -->
												<span class="flex items-center gap-2.5">
													<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
													</svg>
													Run my free prediction
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
													Run my predictions
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

							<p class="mt-4 text-center text-xs leading-relaxed text-slate-500">
								It's a prediction, not a decision — and it can miss. Treat it as a dry run, not
								a verdict to lose sleep over.
							</p>

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
See what we read from your file
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
					<!-- Honesty caveat: these are AI-simulated letters, never real decisions.
					     A student must not mistake the inbox metaphor for an actual result. -->
					<p
						class="px-6 py-2 text-[11px] leading-snug text-slate-500 bg-slate-50 border-b border-slate-100"
					>
						These are the AI's best guess from what you gave it — estimates, not real or official
						decisions. PredictAdmit isn't affiliated with any school.
					</p>
					<!-- Conversion moment: the free prediction has landed. A non-Pro user who has
					     used their one free run gets a warm, specific upsell (not a cold wall) to
					     start the trial for unlimited re-runs + deep dives. Pro users never see it. -->
					{#if !hasDeepDiveAccess && hasUsedFreeSimulation && !$userProfile.isSubmittingAI && aiDecisions.length}
						<div class="border-b-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50/40 px-6 py-4">
							<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
								<div>
									<p class="text-sm font-bold text-slate-900">That was your free prediction.</p>
									<p class="mt-0.5 text-xs leading-relaxed text-slate-600">Unlock all 39 schools — one payment, no subscription — to re-run after every essay edit and open the deep-dive on any school.</p>
								</div>
								<button
									type="button"
									onclick={() => openPaywall('simulation')}
									class="shrink-0 inline-flex items-center justify-center rounded-xl bg-[#0052CC] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0047b3] active:scale-[0.99]"
								>
									Unlock all 39 schools
								</button>
							</div>
						</div>
					{/if}

					{#if $userProfile.isSubmittingAI}
						<div
							class="border-b-2 border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30 px-6 py-4 flex items-center gap-3 text-sm text-slate-700"
						>
							<span
								class="h-4 w-4 animate-spin rounded-full border-3 border-slate-300 border-t-blue-600"
							></span>
							<span class="font-semibold">Scoring you school by school...</span>
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
											Why you got that call
										</p>
									</div>
									<p class="text-xs text-slate-600 max-w-xl leading-relaxed pl-10">
A read on what pushed each school toward admit, deny, or waitlist for you
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

		/* Paywall entrance — scrim fades, sheet rises (reads as a bottom-sheet on
		   mobile and a gentle lift on desktop). */
		.paywall-scrim {
			animation: paywall-scrim-in 0.22s ease both;
		}
		.paywall-sheet {
			animation: paywall-sheet-in 0.34s cubic-bezier(0.22, 1, 0.36, 1) both;
		}
		.paywall-plans {
			animation: paywall-plans-in 0.2s ease both;
		}
		@keyframes paywall-scrim-in {
			from { opacity: 0; }
			to { opacity: 1; }
		}
		@keyframes paywall-sheet-in {
			from { opacity: 0; transform: translateY(24px) scale(0.98); }
			to { opacity: 1; transform: translateY(0) scale(1); }
		}
		@keyframes paywall-plans-in {
			from { opacity: 0; transform: translateY(-4px); }
			to { opacity: 1; transform: translateY(0); }
		}
		@media (prefers-reduced-motion: reduce) {
			.paywall-scrim,
			.paywall-sheet,
			.paywall-plans {
				animation: none;
			}
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

<!-- Pro paywall — value-first, price-deferred. Scrim sits ABOVE the nav
     (z-[9999]) so the whole page, nav included, dims behind it. -->
{#if showPaywallModal}
	<div
		class="paywall-scrim fixed inset-0 z-[10000] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-md sm:items-center sm:p-6"
		role="presentation"
	>
		<button class="absolute inset-0 cursor-default" aria-label="Close" onclick={closePaywall}></button>

		<div
			class="paywall-sheet relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
			role="dialog"
			aria-modal="true"
			aria-label="Unlock PredictAdmit Pro"
		>
			<button
				onclick={closePaywall}
				aria-label="Close"
				class="absolute right-3.5 top-3.5 z-20 grid h-8 w-8 place-items-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
			</button>

			<!-- Hero -->
			<div class="bg-[#0052CC] px-7 pt-9 pb-7 text-center text-white">
				<div class="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
				</div>
				<p class="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">PredictAdmit Pro</p>
				<h3 class="mt-1.5 text-2xl font-black leading-tight">
					{paywallMode === 'deepDive' ? 'See exactly why' : 'Find out where you actually stand'}
				</h3>
				<p class="mx-auto mt-2 max-w-[18rem] text-sm leading-relaxed text-blue-100">
					{paywallMode === 'deepDive'
						? 'Open the full breakdown of this decision — what drove it, and what would move it.'
						: 'Point the AI at your real application and get your decision, school by school.'}
				</p>
				<div class="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold ring-1 ring-white/20">
					<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
					{nextMilestonePhrase()}
				</div>
			</div>

			<!-- Value -->
			<div class="px-7 py-6">
				<ul class="space-y-3">
					{#each ['Your predicted decision — accept, deny, or waitlist — at all 39 top schools', 'The deep-dive on every verdict: exactly what drove it and what would move it', 'Unlimited essay grading and the AI counselor, on tap', 'Calibrated on real admissions results — not a generic ChatGPT guess'] as benefit}
						<li class="flex items-start gap-3">
							<span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0052CC]/10 text-[#0052CC]">
								<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
							</span>
							<span class="text-sm leading-snug text-slate-700">{benefit}</span>
						</li>
					{/each}
				</ul>

				<p class="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs leading-relaxed text-slate-500">
					We tuned it until it reproduced our founding team's own admissions results.
				</p>

				<!-- One-time pricing — good-better-best, anchored against a private
				     counselor. No subscription: one payment, no "billed later" fear. -->
				<p class="mt-5 text-center text-xs leading-relaxed text-slate-500">
					A private admissions counselor runs <span class="font-semibold text-slate-700">$5,000+</span>.
					This is one payment — no subscription.
				</p>

				<!-- Full Season — the target -->
				<button
					onclick={() => startCheckout('season')}
					disabled={checkoutLoading}
					class="relative mt-4 w-full overflow-hidden rounded-2xl border-2 border-[#0052CC] bg-[#0052CC] px-5 py-4 text-left text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#0047b3] active:scale-[0.99] disabled:opacity-50"
				>
					<span class="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-white/30">Most popular</span>
					<span class="block text-base font-black">{checkoutLoading ? 'Opening checkout…' : 'Full Season — $99'}</span>
					<span class="mt-0.5 block max-w-[15rem] text-xs leading-relaxed text-blue-100">All 39 schools, unlimited re-runs all cycle, every deep-dive, and the essay workshop.</span>
				</button>

				<!-- Season + Essay — the high anchor -->
				<button
					onclick={() => startCheckout('season_plus')}
					disabled={checkoutLoading}
					class="mt-2.5 w-full rounded-2xl border border-slate-200 px-5 py-3.5 text-left transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
				>
					<span class="flex items-baseline justify-between gap-2">
						<span class="text-sm font-bold text-slate-900">Season + Essay Review</span>
						<span class="text-sm font-bold text-slate-900">$249</span>
					</span>
					<span class="mt-0.5 block text-xs leading-relaxed text-slate-500">Everything in Full Season, plus hands-on review of your essays.</span>
				</button>

				<!-- Single school — the floor / downsell (only from a specific school) -->
				{#if paywallContextDecision}
					<button
						onclick={() => startCheckout('single', paywallContextDecision ?? undefined)}
						disabled={checkoutLoading}
						class="mt-2.5 w-full rounded-2xl border border-slate-200 px-5 py-3.5 text-left transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
					>
						<span class="flex items-baseline justify-between gap-2">
							<span class="text-sm font-bold text-slate-900">Just {paywallContextDecision.school}?</span>
							<span class="text-sm font-bold text-slate-900">$29</span>
						</span>
						<span class="mt-0.5 block text-xs leading-relaxed text-slate-500">Unlock the full deep-dive for this one school.</span>
					</button>
				{/if}

				<p class="mt-3 text-center text-[11px] text-slate-400">One-time payment · instant access · secure checkout by Stripe</p>

				<button
					onclick={sendToParent}
					class="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
				>
					Not your card? Send this to a parent →
				</button>
				<button onclick={closePaywall} class="mt-3 w-full text-center text-xs font-medium text-slate-400 transition hover:text-slate-600">
					Maybe later
				</button>
			</div>
		</div>
	</div>
{/if}

<SiteFooter />
