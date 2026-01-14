<script lang="ts">
	import type { PortalEmail, SentEmail } from '$lib/config/admitMail';
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';

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
					<h2 class="text-lg font-bold text-slate-900 leading-none">AdmitMail</h2>
					<p class="text-xs text-slate-500 font-medium">Simulation Inbox</p>
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
						{#if visiblePortals.length > 0}
							<span class="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
								>{visiblePortals.length}</span
							>
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
								View Decision
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
										<!-- Avatar/Icon -->
										<div
											class={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${readPortalSlugs.has(portal.slug) ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}`}
										>
											{portal.name[0]}
										</div>

										<div class="flex-1 min-w-0">
											<div class="flex justify-between items-baseline mb-1">
												<span
													class={`text-sm truncate pr-2 ${readPortalSlugs.has(portal.slug) ? 'font-medium text-slate-900' : 'font-bold text-slate-900'}`}
												>
													{portal.name}
												</span>
												<span class="text-xs text-slate-400 font-medium whitespace-nowrap">
													{getReceivedLabel(portal)}
												</span>
											</div>
											<div class="text-sm text-slate-600 truncate">
												<span
													class={readPortalSlugs.has(portal.slug)
														? ''
														: 'font-semibold text-slate-800'}>{portal.subject}</span
												>
												<span class="text-slate-400 mx-1">–</span>
												<span class="text-slate-500"
													>A status update is available in your application portal.</span
												>
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
										class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600"
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

									<div class="my-8">
										<a
											href={`/portals/${selectedPortal.slug}`}
											class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 no-underline"
										>
											View Decision
										</a>
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
