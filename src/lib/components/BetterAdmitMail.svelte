<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { PortalEmail, SentEmail } from '$lib/config/admitMail';

	// DOM handle for scroll into view
	export let inboxSection: HTMLElement | null;

	// view state
	export let viewMode: 'inbox' | 'email';
	export let activeFolder: 'inbox' | 'sent';

	// search + lists
	export let searchQuery: string;
	export let filteredPortals: PortalEmail[];
	export let sortedVisiblePortals: PortalEmail[];
	export let visiblePortals: PortalEmail[];

	// ED / RD state
	export let currentEdPortal: PortalEmail | null;
	export let edEmailMustBeViewed: boolean;
	export let hasViewedEdEmail: boolean;

	// selections + read tracking
	export let readPortalSlugs: Set<string>;
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
			showToast('Couldn’t copy — please copy the URL manually');
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
		"We've posted an update to your application — log in to see it.",
		'A new notification is waiting for you in your applicant status page.',
		'Important: action may be required on your application. Please sign in.'
	];
	function previewFor(portal: PortalEmail): string {
		let h = 0;
		for (let i = 0; i < portal.slug.length; i++) h = (h * 31 + portal.slug.charCodeAt(i)) >>> 0;
		return PREVIEWS[h % PREVIEWS.length];
	}
	// Short brand-ish accent per school for the avatar, so the list has color
	// variety like a real inbox (falls back to blue).
	const AVATAR_TINTS = [
		'bg-rose-100 text-rose-700',
		'bg-blue-100 text-blue-700',
		'bg-emerald-100 text-emerald-700',
		'bg-amber-100 text-amber-700',
		'bg-violet-100 text-violet-700',
		'bg-sky-100 text-sky-700',
		'bg-indigo-100 text-indigo-700'
	];
	function tintFor(portal: PortalEmail): string {
		let h = 0;
		for (let i = 0; i < portal.slug.length; i++) h = (h * 33 + portal.slug.charCodeAt(i)) >>> 0;
		return AVATAR_TINTS[h % AVATAR_TINTS.length];
	}
</script>

<section id="inboxSection" bind:this={inboxSection} class="scroll-mt-24 font-sans">
	<div
		class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:h-[700px] h-[600px]"
	>
		<!-- Header -->
		<header
			class="bg-white border-b border-slate-100 flex items-center justify-between px-6 py-4 z-20"
		>
			<div class="flex items-center gap-3">
				<div
					class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200"
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
					<h2 class="text-lg font-bold text-slate-900 leading-none">AIMail</h2>
					<p class="text-xs text-slate-500 font-medium">AI Simulation Inbox</p>
				</div>
			</div>

			<div class="flex items-center gap-4">
				<div class="hidden md:block text-right">
					<div class="text-xs font-bold text-slate-900">{displayEmail}</div>
					<div class="text-[10px] text-slate-500">Connected</div>
				</div>
				<button
					type="button"
					class="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
					title="Restart Simulation"
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
			<!-- Sidebar -->
			<aside
				class="w-64 bg-slate-50 border-r border-slate-200 flex flex-col py-6 px-4 gap-6 hidden md:flex"
			>
				<button
					class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95"
				>
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					<span>Compose</span>
				</button>

				<nav class="space-y-1">
					<button
						on:click={() => switchFolder('inbox')}
						class={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeFolder === 'inbox' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:bg-slate-100'}`}
					>
						<div class="flex items-center gap-3">
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
								/>
							</svg>
							<span>Inbox</span>
						</div>
						{#if unreadCount > 0}
							<span class="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
						{:else if visiblePortals.length > 0}
							<span class="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{visiblePortals.length}</span>
						{/if}
					</button>

					<button
						class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
							/>
						</svg>
						<span>Starred</span>
					</button>

					<button
						on:click={() => switchFolder('sent')}
						class={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeFolder === 'sent' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:bg-slate-100'}`}
					>
						<div class="flex items-center gap-3">
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
								/>
							</svg>
							<span>Sent</span>
						</div>
					</button>

					<button
						class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
						<span>Trash</span>
					</button>
				</nav>
			</aside>

			<!-- Mobile Nav Overlay (implied/simplified) -->

			<!-- Main Content Area -->
			<main class="flex-1 flex flex-col relative bg-white min-w-0">
				{#if viewMode === 'inbox'}
					<!-- INBOX VIEW -->

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
								class="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
							/>
						</div>
					</div>

					<!-- ED Alert -->
					{#if currentEdPortal && edEmailMustBeViewed && !hasViewedEdEmail}
						<div
							class="bg-rose-50 border-b border-rose-100 px-6 py-3 flex items-center justify-between animate-in slide-in-from-top-2"
						>
							<div class="flex items-center gap-3">
								<div class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
								<span class="text-xs font-bold text-rose-700"
									>Priority Decision: {currentEdPortal.name}</span
								>
							</div>
							<button
								on:click={() => selectPortal(currentEdPortal)}
								class="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
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
										Decisions will arrive here automatically as the simulation progresses.
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
												<span class="block w-2 h-2 rounded-full bg-blue-600"></span>
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
														class="shrink-0 inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-[1px] text-[9px] text-violet-700"
													>
														<span class="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
														Deep Dive
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
											<span class="text-slate-400 mx-1">–</span>
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
						<div class="flex items-center gap-2">
							<button class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
								<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</button>
						</div>
					</div>

					<div class="flex-1 overflow-y-auto p-8 bg-white">
						{#if activeFolder === 'inbox' && selectedPortal}
							<div class="max-w-2xl mx-auto">
								<h1 class="text-2xl font-bold text-slate-900 mb-6">{selectedPortal.subject}</h1>

								<div class="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
									<div
										class={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${tintFor(selectedPortal)}`}
									>
										{selectedPortal.name[0]}
									</div>
									<div class="flex-1">
										<div class="flex justify-between items-baseline">
											<span class="font-bold text-slate-900">{selectedPortal.from}</span>
											<span
												class="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-full border border-slate-100"
												>{getReceivedLabel(selectedPortal)}</span
											>
										</div>
										<div class="text-xs text-slate-500">to me</div>
									</div>
								</div>

								<div class="prose prose-sm prose-slate max-w-none">
									<p>Dear {displayName},</p>
									<p>
										This email is to notify you that there has been an update to your application
										status for <strong>{selectedPortal.name}</strong>. For security reasons, we do
										not release admission decisions via email.
									</p>
									<p>
										Please log in to your applicant portal using the credentials you created when
										you first applied.
									</p>
									<p class="not-prose rounded-lg border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm text-slate-600">
										<span class="font-semibold text-[#0052CC]">First time?</span> The portal is a
										simulation — just tap <span class="font-semibold">Login</span> to reveal your
										decision (your details are pre-filled, no real credentials needed).
									</p>

									<div class="my-8 flex flex-wrap items-center gap-3">
										<a
											href={`/portals/${selectedPortal.slug}`}
											class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 no-underline"
										>
											View Simulated Decision
										</a>

										<button
											type="button"
											on:click={() => shareDecision(selectedPortal)}
											class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
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
												class="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700 cursor-default"
											>
												<span class="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
												Deep dive saved
											</button>
										{:else if deepDiveLoadingSlug === selectedPortal.slug}
											<button
												type="button"
												class="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700 cursor-wait"
												disabled
											>
												<span
													class="h-3 w-3 animate-spin rounded-full border border-violet-300 border-t-transparent"
												></span>
												Generating...
											</button>
										{:else}
											<button
												type="button"
												class="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-medium text-violet-700 hover:bg-violet-50 transition-colors"
												on:click={() => requestDeepDiveForSlug(selectedPortal.slug)}
											>
												<span class="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
												Flag for Deep Dive
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
								<div class="prose prose-sm prose-slate max-w-none whitespace-pre-wrap">
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
