<script lang="ts">
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
</script>

<section
	id="inboxSection"
	class="rounded-2xl border border-slate-200 bg-white shadow-xl text-slate-900 text-[11px]"
	bind:this={inboxSection}
>
	<!-- HEADER -->
	<div
		class="border-b border-slate-200 bg-slate-50/80 px-4 py-3 flex items-center justify-between gap-4"
	>
		<div class="space-y-1">
			<div class="flex items-center gap-2">
				<span class="text-sm font-bold tracking-tight text-slate-900"> AIMail </span>
			</div>
			<p class="text-[10px] text-slate-500 max-w-md">
				Simulated college decisions inbox. Click a subject to open the email, then
				<span class="text-cyan-700 font-semibold">View Status</span> to jump into that school’s portal.
			</p>
		</div>
		<div class="hidden md:flex flex-col items-end text-[10px] text-slate-500 gap-1">
			<div>
				Signed in as:
				<span class="font-semibold text-slate-900">{displayEmail}</span>
			</div>
			<button
				type="button"
				class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] text-slate-700 hover:bg-slate-50 hover:border-slate-300"
				on:click={resetSimulation}
			>
				<span class="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
				Restart simulation
			</button>
		</div>
	</div>

	{#if viewMode === 'inbox'}
		<!-- SEARCH / META BAR -->
		<div
			class="px-4 py-2 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3"
		>
			<p class="text-[10px] text-slate-500">
				Showing
				<span class="font-semibold text-slate-900">{filteredPortals.length}</span>
				of
				<span class="font-semibold text-slate-900">{sortedVisiblePortals.length}</span>
				schools
			</p>
			<div class="flex-1 flex justify-end">
				<div class="relative w-full max-w-xs">
					<span
						class="pointer-events-none absolute left-2 top-1.5 h-3 w-3 rounded-full border border-slate-400/70"
					></span>
					<input
						type="text"
						class="w-full rounded-full border border-slate-200 bg-white px-7 py-1 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 shadow-sm"
						placeholder="Search schools…"
						bind:value={searchQuery}
					/>
				</div>
			</div>
		</div>

		<!-- INBOX VIEW -->
		<div class="flex text-[11px]">
			<!-- LEFT SIDEBAR -->
			<aside class="hidden md:flex w-52 border-r border-slate-200 bg-slate-50 py-3 flex-col gap-3">
				<!-- Compose pill (non-functional, just for UI parity) -->
				<div class="px-3">
					<button
						type="button"
						class="w-full inline-flex items-center justify-center gap-2 rounded-full border border-cyan-600/30 bg-white px-3 py-1.5 text-[11px] font-semibold text-cyan-700 hover:bg-cyan-50"
					>
						<span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
						Compose
					</button>
				</div>

				<!-- Folders -->
				<nav class="px-1 text-[11px] text-slate-600 space-y-0.5">
					<button
						type="button"
						class={`w-full flex items-center justify-between rounded-r-full px-3 py-1 transition ${
							activeFolder === 'inbox'
								? 'bg-blue-100/50 text-blue-900 font-semibold'
								: 'hover:bg-slate-200/50 text-slate-600'
						}`}
						on:click={() => switchFolder('inbox')}
					>
						<span>Inbox</span>
						<span class="text-slate-500 text-[10px]">
							{visiblePortals.length}
						</span>
					</button>
					<button
						type="button"
						class="w-full text-left px-3 py-1 rounded-r-full text-slate-500 hover:bg-slate-900/80"
					>
						Starred
					</button>
					<button
						type="button"
						class={`w-full text-left px-3 py-1 rounded-r-full transition ${
							activeFolder === 'sent'
								? 'bg-slate-800/80 text-slate-50 font-semibold'
								: 'hover:bg-slate-900/80 text-slate-300'
						}`}
						on:click={() => switchFolder('sent')}
					>
						Sent
					</button>
					<button
						type="button"
						class="w-full text-left px-3 py-1 rounded-r-full text-slate-500 hover:bg-slate-900/80"
					>
						Drafts
					</button>
					<button
						type="button"
						class="w-full text-left px-3 py-1 rounded-r-full text-slate-500 hover:bg-slate-900/80"
					>
						All Mail
					</button>
					<button
						type="button"
						class="w-full text-left px-3 py-1 rounded-r-full text-slate-500 hover:bg-slate-200/50"
					>
						Trash
					</button>
				</nav>
			</aside>

			<!-- MAIN PANE (LIST) -->
			<div class="flex-1 flex flex-col bg-white">
				<!-- ED ALERT -->
				{#if currentEdPortal && edEmailMustBeViewed && !hasViewedEdEmail}
					<div
						class="px-4 py-2 bg-rose-950/70 border-b border-rose-600/60 text-[11px] text-rose-100 flex items-center justify-between"
					>
						<div class="font-semibold">
							Early Decision / REA decision available for {currentEdPortal.name}.
						</div>
						<button
							type="button"
							class="text-[10px] font-semibold border border-rose-500 bg-rose-600/90 px-3 py-1 rounded-full hover:bg-rose-500"
							on:click={() => selectPortal(currentEdPortal)}
						>
							Open decision
						</button>
					</div>
				{/if}

				<!-- CATEGORY TABS -->
				<div class="border-b border-slate-200 bg-slate-50/50 flex text-[11px]">
					<button
						type="button"
						class="px-4 py-2 border-b-2 border-cyan-500 font-semibold text-slate-900"
					>
						Primary
					</button>
					<button type="button" class="px-4 py-2 text-slate-500 hover:bg-slate-900/80">
						Updates
					</button>
					<button type="button" class="px-4 py-2 text-slate-500 hover:bg-slate-900/80">
						Promotions
					</button>
				</div>

				<!-- LIST CONTENT -->
				<div class="flex-1 overflow-x-auto">
					{#if activeFolder === 'inbox'}
						{#if visiblePortals.length === 0}
							<div class="px-4 py-6 text-[11px] text-slate-400">
								Your first decision email will appear here when the calendar reaches your decision
								date.
							</div>
						{:else}
							<table class="w-full text-[11px]">
								<tbody>
									{#if filteredPortals.length === 0}
										<tr>
											<td colspan="4" class="px-4 py-6 text-[11px] text-slate-500">
												No schools match “{searchQuery}”. Try another name or leave the search box
												empty to see all decisions.
											</td>
										</tr>
									{:else}
										{#each filteredPortals as portal (portal.slug)}
											<tr
												class={`cursor-pointer border-b border-slate-100 transition ${
													currentEdPortal &&
													portal.slug === currentEdPortal.slug &&
													!hasViewedEdEmail
														? 'bg-rose-50 hover:bg-rose-100'
														: readPortalSlugs.has(portal.slug)
															? 'bg-slate-50 hover:bg-slate-100 text-slate-500'
															: 'bg-white hover:bg-slate-50'
												}`}
												on:click={() => selectPortal(portal)}
											>
												<td class="px-3 py-3 align-top text-slate-400 w-10">
													<input
														type="checkbox"
														class="align-middle mr-1 h-3 w-3 rounded border border-slate-300 bg-white text-cyan-600"
													/>
												</td>
												<td class="px-2 py-3 align-top whitespace-nowrap w-56">
													<span
														class={readPortalSlugs.has(portal.slug)
															? 'text-slate-500'
															: 'font-semibold text-slate-900'}
													>
														{portal.name}
													</span>
												</td>
												<td class="px-2 py-3 align-top">
													<div class="flex items-baseline justify-between gap-2">
														<div class="min-w-0">
															<span
																class={`truncate ${
																	currentEdPortal &&
																	portal.slug === currentEdPortal.slug &&
																	!hasViewedEdEmail
																		? 'font-semibold text-rose-700'
																		: readPortalSlugs.has(portal.slug)
																			? 'text-slate-500'
																			: 'font-semibold text-slate-900'
																}`}
															>
																{portal.subject}
															</span>
															<span class="text-slate-500">
																&nbsp;– A status update is available in your application portal.
															</span>
														</div>

														{#if deepDiveItems && deepDiveItems.some((d) => d.slug === portal.slug)}
															<span
																class="shrink-0 inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-[1px] text-[9px] text-violet-700"
															>
																<span class="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
																Deep dive
															</span>
														{/if}
													</div>
												</td>
												<td
													class="px-3 py-3 align-top text-right text-slate-500 whitespace-nowrap w-40"
												>
													{getReceivedLabel(portal)}
												</td>
											</tr>
										{/each}
									{/if}
								</tbody>
							</table>
						{/if}
					{:else}
						<!-- SENT MAIL -->
						<table class="w-full text-[11px]">
							<tbody>
								{#each sentEmails as message (message.id)}
									<tr
										class="cursor-pointer border-b border-slate-100 bg-white hover:bg-slate-50 transition"
										on:click={() => selectSent(message)}
									>
										<td class="px-3 py-3 align-top text-slate-400 w-10">
											<input
												type="checkbox"
												class="align-middle mr-1 h-3 w-3 rounded border border-slate-300 bg-white text-cyan-600"
											/>
										</td>
										<td class="px-2 py-3 align-top whitespace-nowrap w-56 text-slate-900">
											To: {message.to}
										</td>
										<td class="px-2 py-3 align-top">
											<span class="font-semibold text-slate-900">
												{message.subject}
											</span>
											<span class="text-slate-500">
												&nbsp;– {message.preview}
											</span>
										</td>
										<td
											class="px-3 py-3 align-top text-right text-slate-500 whitespace-nowrap w-32"
										>
											{message.sent}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</div>
			</div>
		</div>
	{:else}
		<!-- EMAIL VIEW -->
		<div class="flex text-[11px]">
			<!-- LEFT SIDEBAR (same as inbox) -->
			<aside class="hidden md:flex w-52 border-r border-slate-200 bg-slate-50 py-3 flex-col gap-3">
				<div class="px-3">
					<button
						type="button"
						class="w-full inline-flex items-center justify-center gap-2 rounded-full border border-cyan-500/60 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-semibold text-cyan-200 hover:bg-cyan-500/20"
					>
						<span class="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
						Compose
					</button>
				</div>
				<nav class="px-1 text-[11px] text-slate-300 space-y-0.5">
					<button
						type="button"
						class={`w-full flex items-center justify-between rounded-r-full px-3 py-1 transition ${
							activeFolder === 'inbox'
								? 'bg-slate-800/80 text-slate-50 font-semibold'
								: 'hover:bg-slate-900/80 text-slate-300'
						}`}
						on:click={() => switchFolder('inbox')}
					>
						<span>Inbox</span>
						<span class="text-slate-500 text-[10px]">
							{visiblePortals.length}
						</span>
					</button>
					<button
						type="button"
						class="w-full text-left px-3 py-1 rounded-r-full text-slate-500 hover:bg-slate-900/80"
					>
						Starred
					</button>
					<button
						type="button"
						class={`w-full text-left px-3 py-1 rounded-r-full transition ${
							activeFolder === 'sent'
								? 'bg-slate-800/80 text-slate-50 font-semibold'
								: 'hover:bg-slate-900/80 text-slate-300'
						}`}
						on:click={() => switchFolder('sent')}
					>
						Sent
					</button>
					<button
						type="button"
						class="w-full text-left px-3 py-1 rounded-r-full text-slate-500 hover:bg-slate-900/80"
					>
						Drafts
					</button>
					<button
						type="button"
						class="w-full text-left px-3 py-1 rounded-r-full text-slate-500 hover:bg-slate-900/80"
					>
						All Mail
					</button>
					<button
						type="button"
						class="w-full text-left px-3 py-1 rounded-r-full text-slate-500 hover:bg-slate-900/80"
					>
						Trash
					</button>
				</nav>
			</aside>

			<!-- EMAIL CONTENT -->
			<div class="flex-1 flex flex-col bg-white">
				<!-- TOP CONTROLS -->
				<div
					class="border-b border-slate-200 bg-slate-50/50 px-3 py-2 flex items-center justify-between"
				>
					<div class="flex items-center gap-2">
						<button
							type="button"
							class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] text-slate-600 hover:bg-slate-50"
							on:click={openInboxList}
						>
							← Back to inbox
						</button>
						<div class="hidden sm:flex items-center gap-1">
							<button
								type="button"
								class="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-500 hover:bg-slate-50"
							>
								Archive
							</button>
							<button
								type="button"
								class="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-500 hover:bg-slate-50"
							>
								Report spam
							</button>
							<button
								type="button"
								class="rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] text-rose-700 hover:bg-rose-100"
							>
								Delete
							</button>
						</div>
					</div>
					<div class="text-slate-500 text-[10px]">
						1 of {visiblePortals.length}
					</div>
				</div>

				<!-- BODY -->
				<div class="px-4 py-4">
					{#if activeFolder === 'inbox' && selectedPortal}
						<div class="max-w-3xl text-[12px] leading-relaxed text-slate-900">
							<h3 class="text-sm font-semibold mb-2 text-slate-900">
								{selectedPortal.subject}
							</h3>
							<div
								class="text-[11px] text-slate-500 mb-3 border-b border-slate-200 pb-2 space-y-0.5"
							>
								<div>
									<span class="font-semibold text-slate-700">From:</span>
									<span class="text-slate-600"> {selectedPortal.from}</span>
								</div>
								<div>
									<span class="font-semibold text-slate-700">To:</span>
									<span class="text-slate-600">
										{' '}
										{displayName} &lt;{displayEmail}&gt;
									</span>
								</div>
								<div>
									<span class="font-semibold text-slate-700">Date:</span>
									<span class="text-slate-600"> {getReceivedLabel(selectedPortal)}</span>
								</div>
							</div>

							<p class="mb-2 text-slate-900">
								Dear {displayName},
							</p>
							<p class="mb-2 text-slate-700">
								This email is to notify you that there has been an update to your application status
								for <span class="font-semibold"> {selectedPortal.name}</span>. For security reasons,
								we do not release admission decisions via email.
							</p>
							<p class="mb-2 text-slate-700">
								Please log in to your applicant portal using the credentials you created when you
								first applied. Once you have signed in, you will be able to view your official
								admission decision and any related next steps.
							</p>
							<p class="mb-3 text-slate-700">To view your status, click the link below:</p>

							<!-- CTA + Deep Dive flag row -->
							<div class="mb-4 flex flex-wrap items-center gap-2">
								<a
									href={`/portals/${selectedPortal.slug}`}
									class="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300 bg-cyan-100 text-[11px] font-semibold px-4 py-2 no-underline text-cyan-900 hover:bg-cyan-200"
								>
									View Status
								</a>

								{#if deepDiveItems && deepDiveItems.some((d) => d.slug === selectedPortal.slug)}
									<button
										type="button"
										class="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-medium text-violet-700 cursor-default"
									>
										<span class="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
										Deep dive saved for this school
									</button>
								{:else if deepDiveLoadingSlug === selectedPortal.slug}
									<button
										type="button"
										class="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-medium text-violet-700 cursor-wait"
										disabled
									>
										<span
											class="h-3 w-3 animate-spin rounded-full border border-violet-300 border-t-transparent"
										></span>
										Generating deep dive…
									</button>
								{:else}
									<button
										type="button"
										class="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-[10px] font-medium text-violet-700 hover:bg-violet-50"
										on:click={() => requestDeepDiveForSlug(selectedPortal.slug)}
									>
										<span class="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
										Flag for deep dive
									</button>
								{/if}
							</div>

							<p class="mb-2 text-slate-500">
								If you experience any difficulty accessing your portal, please ensure that you are
								using the same email address you used when you applied and that your password is
								entered correctly.
							</p>

							<p class="mt-4 text-slate-700">
								Sincerely,<br />
								<span class="font-semibold">Office of Undergraduate Admissions</span><br />
								{selectedPortal.name}
							</p>
						</div>
					{:else if activeFolder === 'sent' && selectedSent}
						<div class="max-w-3xl text-[12px] leading-relaxed text-slate-900">
							<h3 class="text-sm font-semibold mb-2 text-slate-900">
								{selectedSent.subject}
							</h3>
							<div
								class="text-[11px] text-slate-500 mb-3 border-b border-slate-200 pb-2 space-y-0.5"
							>
								<div>
									<span class="font-semibold text-slate-700">From:</span>
									<span class="text-slate-600">
										{' '}
										{displayName} &lt;{displayEmail}&gt;
									</span>
								</div>
								<div>
									<span class="font-semibold text-slate-700">To:</span>
									<span class="text-slate-600"> {selectedSent.to}</span>
								</div>
								<div>
									<span class="font-semibold text-slate-700">Date:</span>
									<span class="text-slate-600"> {selectedSent.sent}</span>
								</div>
							</div>

							<pre class="whitespace-pre-wrap text-[12px] leading-relaxed text-slate-700 mb-2">
{selectedSent.body}
              </pre>
						</div>
					{:else}
						<p class="text-[11px] text-slate-500">
							No email selected. Use “Back to inbox” to choose a message.
						</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</section>
