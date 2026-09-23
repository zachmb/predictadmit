<script lang="ts">
	import { fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import { pushOverlay, popOverlay } from '$lib/stores/ui';
	import type { PortalEmail, SentEmail } from '$lib/config/admitMail';

	// Dim the nav while the toast is visible (per the global overlay rule).
	let toastShown = false;
	$: {
		const show = !!toastMsg;
		if (show && !toastShown) {
			toastShown = true;
			pushOverlay();
		} else if (!show && toastShown) {
			toastShown = false;
			popOverlay();
		}
	}
	onDestroy(() => {
		if (toastShown) popOverlay();
	});

	// DOM handle for scroll into view
	export let inboxSection: HTMLElement | null;

	// view state
	export let viewMode: 'inbox' | 'email';
	export let activeFolder: 'inbox' | 'sent';

	// search + lists
	export let searchQuery: string;
	export let filteredPortals: PortalEmail[];
	export let visiblePortals: PortalEmail[];

	// ED / RD state
	export let currentEdPortal: PortalEmail | null;
	export let edEmailMustBeViewed: boolean;
	export let hasViewedEdEmail: boolean;

	// selections + read tracking
	export let readPortalSlugs: Set<string>;
	// Slugs the (non-Pro) user can't open for free anymore — shown with a $4.99 lock
	// chip; tapping routes to the paywall (handled in the parent's selectPortal).
	export let lockedSlugs: Set<string> = new Set();
	export let selectedPortal: PortalEmail | null;
	export let selectedSent: SentEmail | null;

	// data
	export let sentEmails: SentEmail[];

	// display helpers
	export let displayName: string;
	export let displayEmail: string;
	export let getReceivedLabel: (portal: PortalEmail) => string;

	// callbacks to parent
	export let resetSimulation: () => void;
	export let selectPortal: (portal: PortalEmail) => void;
	export let selectSent: (message: SentEmail) => void;
	export let switchFolder: (folder: 'inbox' | 'sent') => void;
	export let openInboxList: () => void;

	// 🔍 Deep dive integration
	// We only need the slug to know what's already got a deep dive.
	type DeepDiveMeta = { slug: string };

	// List of deep dives that already exist (by slug)
	export let deepDiveItems: DeepDiveMeta[] = [];

	// Slug currently generating a deep dive (for loading state)
	export let deepDiveLoadingSlug: string | null = null;

	// Callback to request a deep dive for a given slug
	export let requestDeepDiveForSlug: (slug: string) => void = () => {};

	// Share the decision from the inbox (native share, copy-link fallback) — sits
	// alongside "View" and "Deep Dive" in one row so all three show at once and
	// never overlap. Feedback surfaces as a floating toast rather than mutating
	// the button label (which read as a glitch).
	let toastMsg = '';
	let toastTimer: ReturnType<typeof setTimeout>;
	function showToast(msg: string) {
		toastMsg = msg;
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => (toastMsg = ''), 2400);
	}
	async function shareDecision(portal: PortalEmail) {
		if (typeof window === 'undefined') return;
		const url = `${window.location.origin}/portals/${portal.slug}`;
		const title = `My ${portal.name} decision`;
		try {
			if (navigator.share) {
				await navigator.share({ title, url });
				return;
			}
		} catch {
			/* user cancelled or unsupported — fall through to copy */
		}
		try {
			await navigator.clipboard.writeText(url);
			showToast('Link copied to clipboard');
		} catch {
			showToast('Couldn’t copy. Please copy the URL manually');
		}
	}

	// Unread decisions still waiting to be opened — powers the blue Inbox badge
	// (a real mail app counts unread, not total).
	$: unreadCount = visiblePortals.filter((p) => !readPortalSlugs.has(p.slug)).length;

	// A real inbox never shows the same one-line preview on every message. Pick a
	// varied, believable snippet deterministically per school so the simulated
	// inbox reads like a real one instead of a generated list.
	const PREVIEWS = [
		'Please log in to your applicant portal to view the latest update.',
		'There has been a change to the status of your application.',
		'Your admission decision is now available. Sign in to view it.',
		"We've posted an update to your application. Log in to see it.",
		'A new notification is waiting for you in your applicant status page.',
		'Important: action may be required on your application. Please sign in.'
	];
	function previewFor(portal: PortalEmail): string {
		let h = 0;
		for (let i = 0; i < portal.slug.length; i++) h = (h * 31 + portal.slug.charCodeAt(i)) >>> 0;
		return PREVIEWS[h % PREVIEWS.length];
	}
	// Single brand-blue avatar tint — one accent, consistent with the rest of the
	// app (was a 7-color pastel rainbow, which read as AI-generated).
	function tintFor(_portal: PortalEmail): string {
		return 'bg-[#1A4CFF]/10 text-[#1A4CFF]';
	}
</script>

<section id="inboxSection" bind:this={inboxSection} class="scroll-mt-24 font-sans">
	<div
		class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[min(600px,82svh)] md:h-[min(700px,86svh)]"
	>
		<!-- Header -->
		<header
			class="bg-white border-b border-slate-100 flex items-center justify-between px-6 py-4 z-20"
		>
			<div class="flex items-center gap-3">
				<div
					class="w-9 h-9 rounded-xl bg-[#1A4CFF] flex items-center justify-center shadow-sm"
				>
					<svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<div>
					<h2 class="text-base font-bold text-slate-900 leading-tight">AIMail</h2>
					<p class="text-xs text-slate-500 font-medium">Your simulated decisions</p>
				</div>
			</div>

			<div class="flex items-center gap-2.5">
				<div class="hidden md:flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5">
					<span class="relative flex h-1.5 w-1.5">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
						<span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
					</span>
					<span class="text-[11px] font-semibold text-slate-600">{displayEmail}</span>
				</div>
				<button
					type="button"
					class="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
					title="Restart simulation"
					on:click={resetSimulation}
				>
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
				</button>
			</div>
		</header>

		<div class="flex flex-1 overflow-hidden relative">
			<!-- Sidebar — folders only (this is a decision inbox, not a mail client) -->
			<aside
				class="w-52 bg-slate-50/70 border-r border-slate-200 flex-col py-5 px-4 gap-2 hidden md:flex"
			>
				<p class="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Folders</p>
				<nav class="space-y-1">
					<button
						on:click={() => switchFolder('inbox')}
						class={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeFolder === 'inbox' ? 'bg-white text-[#1A4CFF] shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:bg-slate-100'}`}
					>
						<div class="flex items-center gap-2.5">
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
							</svg>
							<span>Inbox</span>
						</div>
						{#if unreadCount > 0}
							<span class="text-[11px] font-bold bg-[#1A4CFF] text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
						{:else if visiblePortals.length > 0}
							<span class="text-[11px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{visiblePortals.length}</span>
						{/if}
					</button>

					<button
						on:click={() => switchFolder('sent')}
						class={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeFolder === 'sent' ? 'bg-white text-[#1A4CFF] shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:bg-slate-100'}`}
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
						</svg>
						<span>Sent</span>
					</button>
				</nav>

				<div class="mt-auto rounded-xl border border-slate-200 bg-white p-3">
					<p class="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
						<svg class="h-3.5 w-3.5 text-[#1A4CFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
						Simulation only
					</p>
					<p class="mt-1 text-[11px] leading-snug text-slate-400">AI predictions from your file. Not real emails or official decisions.</p>
				</div>
			</aside>

			<!-- Mobile Nav Overlay (implied/simplified) -->

			<!-- Main Content Area -->
			<main class="flex-1 flex flex-col relative bg-white min-w-0">
				{#if viewMode === 'inbox'}
					<!-- INBOX VIEW -->

					<!-- Mobile folder switcher: the sidebar folders are desktop-only
					     (hidden md:flex), so without this phones can't reach Sent or
					     see the unread count. -->
					<div class="md:hidden flex items-center gap-2 border-b border-slate-100 px-4 py-2.5 bg-white">
						<button
							on:click={() => switchFolder('inbox')}
							class={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${activeFolder === 'inbox' ? 'bg-[#1A4CFF] text-white' : 'bg-slate-100 text-slate-600'}`}
						>
							Inbox
							{#if unreadCount > 0}
								<span class={`rounded-full px-1.5 text-[10px] font-bold ${activeFolder === 'inbox' ? 'bg-white/25 text-white' : 'bg-[#1A4CFF] text-white'}`}>{unreadCount}</span>
							{/if}
						</button>
						<button
							on:click={() => switchFolder('sent')}
							class={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${activeFolder === 'sent' ? 'bg-[#1A4CFF] text-white' : 'bg-slate-100 text-slate-600'}`}
						>
							Sent
						</button>
					</div>

					<!-- Toolbar -->
					<div
						class="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white z-10"
					>
						<div class="relative max-w-md w-full">
							<svg
								class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<input
								type="text"
								bind:value={searchQuery}
								placeholder="Search mail..."
								class="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1A4CFF]/20 focus:bg-white transition-all"
							/>
						</div>
					</div>

					<!-- ED Alert -->
					{#if currentEdPortal && edEmailMustBeViewed && !hasViewedEdEmail}
						<div
							class="bg-rose-50 border-b border-rose-100 px-6 py-3 flex items-center justify-between"
							transition:fly={{ y: -8, duration: 200 }}
						>
							<div class="flex items-center gap-3">
								<div class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
								<span class="text-xs font-bold text-rose-700"
									>Priority Decision: {currentEdPortal.name}</span
								>
							</div>
							<button
								on:click={() => currentEdPortal && selectPortal(currentEdPortal)}
								class="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-rose-700 active:scale-[0.99] cursor-pointer"
							>
								View Simulated Decision
							</button>
						</div>
					{/if}

					<!-- List -->
					<div class="flex-1 overflow-y-auto">
						{#if activeFolder === 'inbox'}
							{#if visiblePortals.length === 0}
								<div class="flex flex-col items-center justify-center h-full text-center p-8">
									<div
										class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"
									>
										<svg
											class="w-8 h-8 text-slate-300"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
											/>
										</svg>
									</div>
									<h3 class="text-slate-900 font-bold mb-1">Inbox Empty</h3>
									<p class="text-slate-500 text-sm max-w-xs">
										Decisions land here as the simulation plays out. Sit tight.
									</p>
								</div>
							{:else if filteredPortals.length === 0}
								<!-- Search matched nothing — don't leave a blank list. -->
								<div class="flex flex-col items-center justify-center h-full text-center p-8">
									<div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
										<svg class="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
										</svg>
									</div>
									<h3 class="text-slate-900 font-bold mb-1">No matches</h3>
									<p class="text-slate-500 text-sm max-w-xs">
										No decisions match “{searchQuery.trim()}”. Try a different school name.
									</p>
								</div>
							{:else}
								{#each filteredPortals as portal (portal.slug)}
									<button
										on:click={() => selectPortal(portal)}
										class={`w-full text-left px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-start gap-4 group ${readPortalSlugs.has(portal.slug) ? 'opacity-80' : 'bg-white'}`}
									>
										<!-- Unread dot -->
										<div class="w-2 flex-shrink-0 self-center">
											{#if !readPortalSlugs.has(portal.slug)}
												<span class="block w-2 h-2 rounded-full bg-[#1A4CFF]"></span>
											{/if}
										</div>

										<!-- Avatar/Icon -->
										<div
											class={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${readPortalSlugs.has(portal.slug) ? 'bg-slate-100 text-slate-400' : tintFor(portal)}`}
										>
											{portal.name[0]}
										</div>

										<div class="flex-1 min-w-0">
											<div class="flex justify-between items-baseline mb-1">
												<span
													class={`text-sm truncate pr-2 ${readPortalSlugs.has(portal.slug) ? 'font-medium text-slate-500' : 'font-bold text-slate-900'}`}
												>
													{portal.name}
												</span>
												<span class="text-xs text-slate-400 font-medium whitespace-nowrap">
													{getReceivedLabel(portal)}
												</span>
											</div>
											<div class="text-sm text-slate-600 truncate flex items-center gap-2">
												<div class="truncate">
													<span
														class={readPortalSlugs.has(portal.slug)
															? 'text-slate-500'
															: 'font-semibold text-slate-800'}>{portal.subject}</span
													>
													<span class="text-slate-300 mx-1.5">·</span>
													<span class="text-slate-400">{previewFor(portal)}</span>
												</div>
												{#if deepDiveItems && deepDiveItems.some((d) => d.slug === portal.slug)}
													<span
														class="shrink-0 inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-[1px] text-[9px] text-blue-700"
													>
														<span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
														Deep Dive
													</span>
												{:else if lockedSlugs.has(portal.slug)}
													<span
														class="shrink-0 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-[1px] text-[9px] font-bold text-slate-500"
													>
														<svg class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
														$4.99
													</span>
												{/if}
											</div>
										</div>
									</button>
								{/each}
							{/if}
						{:else if activeFolder === 'sent'}
							{#each sentEmails as message (message.id)}
								<button
									on:click={() => selectSent(message)}
									class="w-full text-left px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-start gap-4 group"
								>
									<div
										class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex-shrink-0 flex items-center justify-center text-xs font-bold"
									>
										Me
									</div>
									<div class="flex-1 min-w-0">
										<div class="flex justify-between items-baseline mb-1">
											<span class="text-sm font-bold text-slate-900 truncate pr-2"
												>To: {message.to}</span
											>
											<span class="text-xs text-slate-400 font-medium whitespace-nowrap"
												>{message.sent}</span
											>
										</div>
										<div class="text-sm text-slate-600 truncate">
											<span class="font-medium text-slate-800">{message.subject}</span>
											<span class="text-slate-400 mx-1">·</span>
											<span class="text-slate-500">{message.preview}</span>
										</div>
									</div>
								</button>
							{/each}
						{/if}
					</div>
				{:else}
					<!-- EMAIL DETAIL VIEW -->
					<div
						class="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white z-10 sticky top-0"
					>
						<button
							on:click={openInboxList}
							class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
						>
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Back
						</button>
					</div>

					<div class="flex-1 overflow-y-auto p-8 bg-white">
						{#if activeFolder === 'inbox' && selectedPortal}
							<div class="max-w-2xl mx-auto">
								<span class="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
									<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
									Simulated notification
								</span>

								<h1 class="mt-3 font-serif text-2xl sm:text-3xl font-medium tracking-tight leading-tight text-slate-900">{selectedPortal.subject}</h1>

								<!-- Sender card -->
								<div class="mt-5 flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
									<div
										class={`h-11 w-11 shrink-0 rounded-full flex items-center justify-center text-base font-bold ${tintFor(selectedPortal)}`}
									>
										{selectedPortal.name[0]}
									</div>
									<div class="min-w-0 flex-1">
										<div class="flex items-center justify-between gap-2">
											<p class="truncate text-sm font-bold text-slate-900">{selectedPortal.name} Admissions</p>
											<span class="shrink-0 text-[11px] font-medium text-slate-500">{getReceivedLabel(selectedPortal)}</span>
										</div>
										<p class="truncate text-xs text-slate-500">{selectedPortal.from} · to you</p>
									</div>
								</div>

								<!-- Body -->
								<div class="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-600">
									<p>Dear {displayName},</p>
									<p>
										Your application status for <strong class="font-semibold text-slate-900">{selectedPortal.name}</strong> has
										changed. We don't send the decision itself over email, so you'll need to
										sign in to your portal to see it.
									</p>
									<p>Log in with the credentials you set up when you applied.</p>

									<div class="flex items-start gap-2.5 rounded-xl border border-[#1A4CFF]/15 bg-[#1A4CFF]/5 px-4 py-3">
										<svg class="mt-0.5 h-4 w-4 shrink-0 text-[#1A4CFF]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
										<p class="text-sm leading-relaxed text-slate-600">
											<span class="font-semibold text-[#1A4CFF]">First time?</span> This is a
											simulation, so just tap <span class="font-semibold text-slate-900">Login</span> to reveal your
											decision. Your details are pre-filled and no real credentials are needed.
										</p>
									</div>

									<div class="mt-7 flex flex-wrap items-center gap-3">
										<a
											href={`/portals/${selectedPortal.slug}`}
											class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A4CFF] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1540E0] active:scale-[0.99] no-underline"
										>
											View Simulated Decision
										</a>

										<button
											type="button"
											on:click={() => shareDecision(selectedPortal)}
											class="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-400 hover:text-blue-700 hover:bg-slate-50"
										>
											<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
												/>
											</svg>
											Share your decision
										</button>

										{#if deepDiveItems && deepDiveItems.some((d) => d.slug === selectedPortal.slug)}
											<button
												type="button"
												class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 cursor-default"
											>
												<svg class="h-4 w-4 text-[#1A4CFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
												Deep dive ready
											</button>
										{:else if deepDiveLoadingSlug === selectedPortal.slug}
											<button
												type="button"
												class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 cursor-wait"
												disabled
											>
												<span
													class="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"
												></span>
												Reading your file...
											</button>
										{:else}
											<button
												type="button"
												class="inline-flex items-center gap-2 rounded-xl bg-[#1A4CFF] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1540E0] active:scale-[0.99]"
												on:click={() => requestDeepDiveForSlug(selectedPortal.slug)}
											>
												<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
												See the full deep dive
											</button>
										{/if}
									</div>

									<p class="text-slate-500 text-xs mt-8 pt-8 border-t border-slate-100">
										Sincerely,<br />
										Office of Undergraduate Admissions<br />
										{selectedPortal.name}
									</p>
								</div>
							</div>
						{:else if activeFolder === 'sent' && selectedSent}
							<div class="max-w-2xl mx-auto">
								<h1 class="text-2xl font-bold text-slate-900 mb-6">{selectedSent.subject}</h1>
								<div class="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
									<div
										class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-500"
									>
										Me
									</div>
									<div class="flex-1">
										<div class="flex justify-between items-baseline">
											<span class="font-bold text-slate-900">To: {selectedSent.to}</span>
											<span class="text-xs text-slate-500">{selectedSent.sent}</span>
										</div>
									</div>
								</div>
								<div class="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-600">
									{selectedSent.body}
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</main>
		</div>
	</div>
</section>

{#if toastMsg}
	<div
		class="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xl ring-1 ring-black/5"
		role="status"
		aria-live="polite"
		transition:fly={{ y: 24, duration: 220 }}
	>
		<svg class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
		</svg>
		{toastMsg}
	</div>
{/if}
