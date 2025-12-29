<script lang="ts">
	import { onMount } from 'svelte';
	import { signIn } from '@auth/sveltekit/client';
	import type { PageData } from './$types';

	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';

	// NEW: bring in AdmitMail + types from the existing simulator
	import BetterAdmitMail from '$lib/components/BetterAdmitMail.svelte';
	import {
		sentEmails as baseSentEmails,
		type PortalEmail,
		type SentEmail
	} from '$lib/config/admitMail';

	// NEW: store AI results globally so portals can read decisions
	import { aiResults } from '$lib/stores/results';

	export let data: PageData;

	const session = data.session;

	// 🔐 LocalStorage persistence key for AI inbox
	const AI_PERSIST_KEY = 'predictadmit_ai_inbox_v1';

	type DecisionOutcome = 'admit' | 'deny' | 'waitlist' | 'defer';

	type AiDecision = {
		school: string;
		slug: string;
		outcome: DecisionOutcome;
		short_reason: string;
	};

	type DeepDiveItem = {
		school: string;
		slug: string;
		outcome: DecisionOutcome;
		explanation: string;
	};

	// Application inputs (can be typed or filled via OCR)
	let essay = '';
	let activities = '';
	let honors = '';
	let transcript = '';

	// OCR state
	let ocrUploading = false;
	let ocrError = '';
	let ocrText = '';

	// Free-tier limits (persisted per browser)
	let hasUsedFreeSimulation = false; // one full HYPSM+ run
	let hasUsedFreePdfOcr = false; // one Common App PDF upload
	let promoCodeInput = '';

	// Paywall modal state
	let showPaywallModal = false;
	let paywallMode: 'simulation' | 'ocr' | 'deepDive' | null = null;
	let paywallContextDecision: AiDecision | null = null;

	// Pro access (in a real app this would come from your backend / Stripe webhook)
	let hasDeepDiveAccess = false;

	// Google sign-in (real: derived from Auth.js session)
	let googleSignedIn = false;
	let googleEmail = '';
	let googleName = '';

	$: {
		googleSignedIn = !!session?.user;
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}

	// ED selection
	const ED_SCHOOLS = [
		{ slug: 'harvard', label: 'Harvard (REA)' },
		{ slug: 'stanford', label: 'Stanford (REA)' },
		{ slug: 'yale', label: 'Yale (SCEA)' },
		{ slug: 'princeton', label: 'Princeton (SCEA)' },
		{ slug: 'duke', label: 'Duke (ED)' },
		{ slug: 'u-penn', label: 'Penn (ED)' },
		{ slug: 'brown', label: 'Brown (ED)' },
		{ slug: 'northwestern', label: 'Northwestern (ED)' },
		{ slug: 'dartmouth', label: 'Dartmouth (ED)' },
		{ slug: 'vanderbilt', label: 'Vanderbilt (ED I/II)' }
	];

	const handlePromoCode = (e: KeyboardEvent) => {
		// Check if the key pressed was 'Enter'
		if (e.key === 'Enter') {
			// Prevent the form from submitting accidentally
			e.preventDefault();

			if (promoCodeInput.trim() === 'strawberrylemonade') {
				hasUsedFreeSimulation = false;
				hasDeepDiveAccess = true;
				promoCodeInput = ''; // Clear input on success
				alert('Promo code applied! Deep Dive unlocked.');
			} else {
				alert('Invalid promo code.');
			}
		}
	};

	let edSlug: string = '';

	let isSubmitting = false;
	let aiError = '';
	let aiDecisions: AiDecision[] = [];

	// Deep dive state
	let deepDiveItems: DeepDiveItem[] = [];
	let deepDiveLoadingSlug: string | null = null;

	// Summary of all materials returned from the evaluate endpoint.
	let applicantSummary = '';

	// === AdmitMail-style inbox state, driven by AI decisions ===

	// DOM handle for scroll (not used for auto-scroll in this file, but AdmitMail expects it)
	let inboxSection: HTMLElement | null = null;

	// view state for AdmitMail
	let mailViewMode: 'inbox' | 'email' = 'inbox';
	let mailActiveFolder: 'inbox' | 'sent' = 'inbox';

	// search + lists
	let searchQuery = '';
	let filteredPortals: PortalEmail[] = [];
	let sortedVisiblePortals: PortalEmail[] = [];
	let visiblePortals: PortalEmail[] = [];

	// ED / RD state (minimal in AI mode)
	let currentEdPortal: PortalEmail | null = null;
	let edEmailMustBeViewed = false;
	let hasViewedEdEmail = false;

	// selections + read tracking
	let readPortalSlugs: Set<string> = new Set();
	let selectedPortal: PortalEmail | null = null;
	let selectedSent: SentEmail | null = null;

	// Sent mail list reused from the static simulator
	const sentEmails: SentEmail[] = baseSentEmails;

	// Display name/email for AdmitMail
	$: displayName = googleName?.trim() || 'Applicant';
	$: displayEmail = googleEmail?.trim() || 'you@predictadmit.ai';

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

	// Keep sortedVisiblePortals in sync with visiblePortals
	$: sortedVisiblePortals = [...visiblePortals];

	// Keep filteredPortals in sync with searchQuery
	$: {
		const q = searchQuery.trim().toLowerCase();

		if (!q) {
			filteredPortals = [...sortedVisiblePortals];
		} else {
			filteredPortals = sortedVisiblePortals.filter((portal) => {
				return portal.name.toLowerCase().includes(q) || portal.slug.toLowerCase().includes(q);
			});
		}
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

	function loadAiInboxState() {
		if (typeof localStorage === 'undefined') return;

		const raw = localStorage.getItem(AI_PERSIST_KEY);
		if (!raw) return;

		try {
			const state = JSON.parse(raw) as {
				visiblePortals?: PortalEmail[];
				readPortalSlugs?: string[];
				selectedPortal?: PortalEmail | null;
				selectedSent?: SentEmail | null;
				mailViewMode?: 'inbox' | 'email';
				mailActiveFolder?: 'inbox' | 'sent';
				searchQuery?: string;
			};

			visiblePortals = state.visiblePortals ?? [];
			readPortalSlugs = new Set(state.readPortalSlugs ?? []);
			selectedPortal = state.selectedPortal ?? null;
			selectedSent = state.selectedSent ?? null;
			mailViewMode = state.mailViewMode ?? 'inbox';
			mailActiveFolder = state.mailActiveFolder ?? 'inbox';
			searchQuery = state.searchQuery ?? '';
		} catch (err) {
			console.error('Failed to load AI inbox state', err);
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
		aiDecisions = [];
		deepDiveItems = [];
		applicantSummary = '';

		visiblePortals = [];
		// sortedVisiblePortals is reactive from visiblePortals
		filteredPortals = [];
		selectedPortal = null;
		selectedSent = null;
		readPortalSlugs = new Set();
		mailViewMode = 'inbox';
		mailActiveFolder = 'inbox';

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
			localStorage.setItem('predictadmit_pro', 'true');

			// Optional: clean ?upgrade=success from the URL
			window.history.replaceState({}, '', window.location.pathname);
		}

		// Read Pro flag
		if (localStorage.getItem('predictadmit_pro') === 'true') {
			hasDeepDiveAccess = true;
		}

		// Restore free-tier usage flags (still used for non-Pro users)
		hasUsedFreeSimulation = localStorage.getItem('predictadmit_hasUsedFreeSimulation') === 'true';
		hasUsedFreePdfOcr = localStorage.getItem('predictadmit_hasUsedFreePdfOcr') === 'true';

		// Restore AI inbox state (visiblePortals, read flags, selected email, etc.)
		loadAiInboxState();
	});

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

	async function runEvaluation() {
		aiError = '';

		if (!googleSignedIn) {
			aiError = 'Please sign in with Google first to create your AI application.';
			return;
		}

		if (!ensureHasSomeInput()) {
			aiError =
				'Add at least one piece of application data (essay, activities, honors, or transcript text) before applying to the AI simulator.';
			return;
		}

		// 🔒 Free tier: one full HYPSM+ simulation per browser (unless Pro)
		if (hasUsedFreeSimulation && !hasDeepDiveAccess) {
			openPaywall('simulation');
			return;
		}

		isSubmitting = true;
		deepDiveItems = [];

		try {
			const payload: Record<string, unknown> = {
				essay,
				activities,
				honors,
				transcript,
				edSlug,
				googleEmail,
				googleName
			};

			const res = await fetch('/api/ai-evaluate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const data = await res.json();

			if (!res.ok) {
				aiError = data?.error ?? 'Something went wrong talking to the AI evaluator.';
				return;
			}

			// 🔁 NEW: store this evaluation globally so individual portals can read their outcome
			aiResults.setFromApi(data);

			aiDecisions = (data.decisions ?? []) as AiDecision[];
			applicantSummary = (data.applicantSummary ?? '') as string;

			if (!aiDecisions.length) {
				aiError =
					'The AI did not return any decisions. Try adding more detail to your application and apply again.';
			} else {
				// Mark free simulation as used after a successful run
				hasUsedFreeSimulation = true;
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem('predictadmit_hasUsedFreeSimulation', 'true');
				}

				// Hydrate AdmitMail inbox from AI decisions
				visiblePortals = aiDecisions.map(decisionToPortalEmail);
				readPortalSlugs = new Set();
				selectedPortal = null;
				selectedSent = null;
				mailActiveFolder = 'inbox';
				mailViewMode = 'inbox';

				// Persist inbox so it survives navigation
				saveAiInboxState();
			}
		} catch (err) {
			console.error(err);
			aiError = 'Network or server error while calling the AI evaluator.';
		} finally {
			isSubmitting = false;
		}
	}

	// 🔒 Deep Dive is fully paywalled – no API call until they upgrade
	async function requestDeepDive(decision: AiDecision) {
		if (!hasDeepDiveAccess) {
			openPaywall('deepDive', decision);
			return;
		}

		if (!applicantSummary) {
			applicantSummary = [
				essay && `Personal essay:\n${essay}`,
				activities && `Activities / extracurriculars:\n${activities}`,
				honors && `Honors & awards:\n${honors}`,
				transcript && `Transcript / GPA & coursework:\n${transcript}`
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
					school: decision.school,
					slug: decision.slug,
					outcome: decision.outcome,
					short_reason: decision.short_reason,
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

		// 🔒 Free tier: one Common App PDF OCR per browser (unless Pro)
		if (hasUsedFreePdfOcr && !hasDeepDiveAccess) {
			openPaywall('ocr');
			// reset file input so they can pick again later if they upgrade
			target.value = '';
			return;
		}

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
</script>

<svelte:head>
	<title>PredictAdmit – AI Admissions Inbox</title>
</svelte:head>

<main class="relative min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
	<!-- Blurred content when not signed in -->
	<div class={googleSignedIn ? '' : 'pointer-events-none blur-sm opacity-70'}>
		<div class="max-w-[1000px] mx-auto px-6 py-24 space-y-16">
			<!-- Hero -->
			<header class="text-center space-y-4 max-w-2xl mx-auto">
				<h1 class="text-5xl font-bold tracking-tight text-slate-900 drop-shadow-sm">
					Analyze Application.
				</h1>
				<p class="text-xl text-slate-500 font-light">
					Upload PDF or paste text. Get instant feedback.
				</p>
			</header>

			<!-- Application builder + AI controls -->
			<section class="max-w-2xl mx-auto">
				<!-- Application card -->
				<Card class="bg-white border border-slate-200 shadow-xl text-slate-900">
					<div class="p-8">
						<!-- Google sign-in bar -->
						<div
							class="mb-8 flex flex-col items-center justify-between gap-4 border-b border-slate-700 pb-6 md:flex-row"
						>
							<div class="space-y-1">
								<h2 class="font-bold text-slate-900">Applicant Context</h2>
							</div>

							<div class="flex items-center gap-3">
								{#if googleSignedIn}
									<div class="text-xs text-right">
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
										class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-900 hover:bg-slate-50"
										on:click={() => signIn('google', { callbackUrl: '/ai' })}
									>
										<span>Continue with Google</span>
									</button>
								{/if}
							</div>
						</div>

						<!-- Application inputs -->
						<form
							class="space-y-8"
							on:submit|preventDefault={runEvaluation}
							aria-label="AI admissions evaluation form"
						>
							<!-- PDF info + OCR upload area -->
							<div class="grid gap-6">
								<div class="rounded-lg bg-slate-50 p-4 border border-slate-100">
									<div class="flex items-center justify-between mb-3">
										<h3 class="text-sm font-bold text-slate-900">Import from PDF</h3>
										<span
											class="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100"
											>OCR Beta</span
										>
									</div>

									<label class="flex items-center gap-3 cursor-pointer group">
										<div
											class="bg-white border border-slate-300 text-slate-600 px-4 py-2 rounded-[var(--radius-btn)] text-xs font-semibold group-hover:bg-slate-50 transition-colors"
										>
											Choose File
										</div>
										<input
											type="file"
											accept="application/pdf"
											class="hidden"
											on:change={handleOcrChange}
										/>
										<span class="text-xs text-slate-400">
											{#if ocrUploading}
												Extracting...
											{:else if ocrText}
												Text extracted ready for essay.
											{:else}
												Common App PDF only.
											{/if}
										</span>
									</label>

									{#if ocrError}
										<p class="mt-2 text-xs text-rose-400">{ocrError}</p>
									{/if}

									{#if ocrText}
										<div class="mt-3">
											<button
												type="button"
												on:click={applyOcrToEssay}
												class="text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
											>
												Insert extracted text into essay &darr;
											</button>
										</div>
									{/if}
								</div>
							</div>

							<div class="space-y-6">
								<!-- Essay -->
								<div class="space-y-2">
									<label for="essay" class="block text-sm font-bold text-slate-900">
										Personal Essay
									</label>
									<textarea
										id="essay"
										bind:value={essay}
										rows="6"
										class="w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-inner"
										placeholder="Paste your personal statement here..."
									></textarea>
								</div>

								<!-- Promo Code -->
								<div class="space-y-2 border-t border-slate-200 pt-4">
									<label
										for="promoCode"
										class="block text-[11px] font-medium text-amber-700 uppercase tracking-[0.2em]"
									>
										Promo Code (Optional)
									</label>
									<div class="relative max-w-xs">
										<input
											id="promoCode"
											type="text"
											bind:value={promoCodeInput}
											on:keydown={handlePromoCode}
											placeholder="Type code and hit Enter..."
											class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
										/>
										{#if hasDeepDiveAccess}
											<div
												class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-green-400 font-bold uppercase"
											>
												Active
											</div>
										{/if}
									</div>
									<p class="text-[9px] text-slate-500">
										Have a special access code? Type it above and press Enter to apply.
									</p>
								</div>

								<!-- Activities -->
								<div class="space-y-2">
									<div class="flex items-center justify-between gap-2">
										<label
											for="activities"
											class="block text-[11px] font-medium text-cyan-700 uppercase tracking-[0.2em]"
										>
											Activities / Résumé
										</label>
									</div>
									<textarea
										id="activities"
										bind:value={activities}
										rows="4"
										class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 resize-y"
										placeholder="Paste your activities list or résumé bullets here. If they’re in a PDF, copy–paste the text."
									></textarea>
								</div>
							</div>

							<div class="grid gap-4 md:grid-cols-2">
								<!-- Honors -->
								<div class="space-y-2">
									<div class="flex items-center justify-between gap-2">
										<label
											for="honors"
											class="block text-[11px] font-medium text-cyan-700 uppercase tracking-[0.2em]"
										>
											Honors & Awards
										</label>
									</div>
									<textarea
										id="honors"
										bind:value={honors}
										rows="3"
										class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 resize-y"
										placeholder="List major competitions, scholarships, and distinctions. Copy–paste from your app if needed."
									></textarea>
								</div>

								<!-- Transcript -->
								<div class="space-y-2">
									<div class="flex items-center justify-between gap-2">
										<label
											for="transcript"
											class="block text-[11px] font-medium text-cyan-700 uppercase tracking-[0.2em]"
										>
											Transcript / GPA
										</label>
									</div>
									<textarea
										id="transcript"
										bind:value={transcript}
										rows="3"
										class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 resize-y"
										placeholder="Include GPA, course rigor, key grades, testing, and any school context. Copy–paste from your transcript if needed."
									></textarea>
								</div>
							</div>

							<!-- ED selection + privacy note -->
							<div class="grid gap-6 md:grid-cols-2 items-start pt-6 border-t border-slate-100">
								<div class="space-y-2">
									<label for="edSchool" class="block text-sm font-bold text-slate-900">
										Early Decision / REA (Optional)
									</label>
									<select
										id="edSchool"
										bind:value={edSlug}
										class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
									>
										<option value="">No ED selected (RD only)</option>
										{#each ED_SCHOOLS as school}
											<option value={school.slug}>{school.label}</option>
										{/each}
									</select>
									<p class="text-xs text-slate-500">
										Binding choice. Decisions will reflect ED acceptance rates.
									</p>
								</div>

								<div class="space-y-1 text-xs text-slate-500">
									<p>
										Your inputs are sent to the AI API for evaluation. We do not store your data.
										Nothing is sent to colleges.
									</p>
								</div>
							</div>

							{#if aiError}
								<p
									class="text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-md px-4 py-3"
								>
									{aiError}
								</p>
							{/if}

							<!-- Apply controls -->
							<div class="flex flex-col sm:flex-row items-center gap-4 pt-4">
								<Button
									type="submit"
									disabled={isSubmitting || !googleSignedIn}
									class="w-full sm:w-auto"
								>
									{#if isSubmitting}
										<span>DeepSeek AI is analyzing...</span>
									{:else if hasUsedFreeSimulation && !hasDeepDiveAccess}
										<span>Upgrade to re-run</span>
									{:else}
										<span>Get Application Results (DeepSeek AI)</span>
									{/if}
								</Button>

								<button
									type="button"
									class="text-sm text-slate-400 hover:text-slate-600 underline decoration-dotted"
									on:click={resetInboxState}
								>
									Clear AI inbox
								</button>
							</div>

							{#if applicantSummary}
								<details class="mt-4 text-xs text-slate-500">
									<summary class="cursor-pointer font-semibold text-slate-700 hover:text-slate-900">
										Preview extracted text
									</summary>
									<pre
										class="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-[10px] text-slate-600 border border-slate-200 rounded-md p-3 bg-slate-50">
                        {applicantSummary}
                    </pre>
								</details>
							{/if}
						</form>
					</div>
				</Card>
			</section>

			<!-- AIMail Inbox (now powered by AdmitMail + portal-style status emails) -->
			<section class="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden mt-8">
				<!-- Top bar -->
				<div
					class="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50"
				>
					<div>
						<div class="flex items-center gap-2">
							<span class="text-xs font-bold uppercase tracking-widest text-slate-500">
								AIMail
							</span>
							<span
								class="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700 border border-emerald-100 font-bold"
							>
								AI Generated
							</span>
						</div>
					</div>
					<div class="text-right text-[10px] text-slate-400">
						<span class="font-medium text-slate-600">
							{googleEmail || 'you@predictadmit.ai'}
						</span>
					</div>
				</div>

				{#if isSubmitting}
					<div
						class="border-b border-slate-100 bg-slate-50 px-6 py-3 flex items-center gap-3 text-xs text-slate-600"
					>
						<span
							class="h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600"
						></span>
						<span class="font-medium"> Simulating decision committee... </span>
					</div>
				{/if}

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
								// uses your existing requestDeepDive(decision: AiDecision)
								requestDeepDive(decision);
							}
						}}
					/>
				</div>

				{#if deepDiveItems.length}
					<!-- Deep Dive explanations, driven by AI -->
					<div class="border-t border-slate-100 bg-slate-50 px-6 py-6 space-y-6">
						<div class="flex items-center justify-between gap-3">
							<div>
								<p class="text-xs font-bold uppercase tracking-widest text-slate-900">
									Decision Analysis
								</p>
								<p class="mt-1 text-xs text-slate-500 max-w-xl leading-relaxed">
									Confidential adcom-style breakdown of why you were admitted, denied, or
									waitlisted.
								</p>
							</div>
						</div>

						<div class="space-y-4">
							{#each deepDiveItems as item (item.slug)}
								<article class="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
									<div class="flex flex-wrap items-center justify-between gap-2 mb-3">
										<div class="flex items-center gap-3">
											<h3 class="text-sm font-bold text-slate-900">
												{item.school}
											</h3>
											<span
												class={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${
													item.outcome === 'admit'
														? 'bg-emerald-50 text-emerald-700 border-emerald-200'
														: item.outcome === 'deny'
															? 'bg-rose-50 text-rose-700 border-rose-200'
															: 'bg-amber-50 text-amber-700 border-amber-200'
												}`}
											>
												{outcomeLabel(item.outcome)}
											</span>
										</div>
										<span class="text-[10px] font-medium text-slate-400"> AI Analysis </span>
									</div>

									<div
										class="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-serif"
									>
										{item.explanation}
									</div>
								</article>
							{/each}
						</div>
					</div>
				{/if}
			</section>
		</div>
	</div>

	{#if !googleSignedIn}
		<!-- Full-screen auth gate (top-aligned, softer blur) -->
		<div
			class="pointer-events-auto absolute inset-0 z-20 flex items-start justify-center pt-8 bg-white/80 backdrop-blur-md"
		>
			<div
				class="max-w-sm w-full rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-2xl space-y-4 text-center"
			>
				<p class="text-xs font-bold uppercase tracking-widest text-emerald-700">
					Unlock PredictAdmit /AI
				</p>
				<p class="text-sm text-slate-600 leading-relaxed">
					Sign in with Google to create your private AI inbox. You’ll see simulated HYPSM+ decisions
					and can decide later whether to upgrade.
				</p>
				<button
					type="button"
					class="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 w-full transition-all"
					on:click={() => signIn('google', { callbackUrl: '/ai' })}
				>
					<span
						class="h-4 w-4 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-white"
					>
						G
					</span>
					<span>Continue with Google</span>
				</button>
				<p class="text-[10px] text-slate-400">
					We never send your materials to real universities. Signing in just ties your free trial
					and upgrades to a single account.
				</p>
			</div>
		</div>
	{/if}

	{#if showPaywallModal && paywallMode}
		<!-- Paywall modal overlay -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md"
		>
			<div
				class="max-w-md w-full rounded-2xl border border-slate-200 bg-white px-8 py-8 shadow-2xl space-y-6"
			>
				<div class="flex items-center justify-between gap-3">
					<div class="space-y-1">
						<p class="text-[10px] uppercase tracking-widest font-bold text-emerald-600">
							{#if paywallMode === 'deepDive'}
								Locked · Deep Dive Explanation
							{:else if paywallMode === 'simulation'}
								Locked · Extra AI Simulations
							{:else}
								Locked · Extra PDF Uploads
							{/if}
						</p>
						<h2 class="text-lg font-bold text-slate-900">
							{#if paywallMode === 'deepDive' && paywallContextDecision}
								You know the verdict. Now learn
								<span class="text-emerald-600">why</span>.
							{:else if paywallMode === 'simulation'}
								One full HYPSM+ run is free. The rest are premium.
							{:else}
								You’ve used your free Common App scan.
							{/if}
						</h2>
					</div>
					<button
						type="button"
						class="h-8 w-8 rounded-full bg-slate-100 text-slate-500 text-sm flex items-center justify-center hover:bg-slate-200 transition-colors"
						on:click={closePaywall}
					>
						✕
					</button>
				</div>

				<div class="space-y-4 text-sm text-slate-600 leading-relaxed text-left">
					{#if paywallMode === 'deepDive' && paywallContextDecision}
						<p>
							Right now you’re staring at a single line —
							<span class="font-bold text-slate-900"
								>{outcomeLabel(paywallContextDecision.outcome)}</span
							>
							from <span class="font-bold text-slate-900">{paywallContextDecision.school}</span>.
							That’s how real portals work: one word, no context.
						</p>
						<p>
							The Deep Dive turns that verdict into a full, adcom-style breakdown: what helped you,
							what quietly hurt you, and what they’d need to see to flip this decision next cycle.
						</p>
					{:else if paywallMode === 'simulation'}
						<p>You’ve already used your free full HYPSM+ simulation on this device.</p>
						<p>
							To rerun with a new draft, different activities, or a rebalanced spike, you’ll need to
							unlock PredictAdmit
							<span class="font-bold text-emerald-600">/AI Premium</span>.
						</p>
					{:else}
						<p>
							You get <span class="font-bold text-slate-900">one</span> free Common App PDF scan. You’ve
							used it.
						</p>
						<p>
							To upload new versions, alternate essays, or a different Common App file, you’ll need
							to unlock PredictAdmit
							<span class="font-bold text-emerald-600">/AI Premium</span>.
						</p>
					{/if}
				</div>

				<div class="space-y-3 pt-2">
					<a
						href="/pricing"
						class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
					>
						{#if paywallMode === 'deepDive'}
							Unlock Deep Dive explanations
						{:else if paywallMode === 'simulation'}
							Unlock more HYPSM+ simulations
						{:else}
							Unlock more Common App uploads
						{/if}
					</a>
					<button
						type="button"
						class="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
						on:click={closePaywall}
					>
						Not now · keep the free run
					</button>
					<p class="text-[10px] text-slate-400 text-center">
						No real applications are affected. This is a training ground, not a crystal ball.
					</p>
				</div>
			</div>
		</div>
	{/if}
</main>

<SiteFooter />
