<script lang="ts">
  import type { PortalEmail, SentEmail } from '$lib/config/admitMail';

  // DOM handle for scroll into view
  export let inboxSection: HTMLElement | null;

  // view state
  export let viewMode: 'inbox' | 'email';
  export let activeFolder: 'inbox' | 'sent';
// ?
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

<section
  id="inboxSection"
  class="bg-white border border-slate-400 shadow-md rounded-sm"
  bind:this={inboxSection}
>
  <div class="border-b border-slate-300 bg-slate-100 px-4 py-3 flex items-center justify-between">
    <div>
      <div class="flex items-baseline gap-2">
        <span class="text-lg font-semibold text-slate-900 tracking-tight">
          admitMail
        </span>
        <span class="inline-flex items-center justify-center text-[9px] uppercase border border-slate-400 px-1 py-[1px] rounded-sm ml-1 bg-slate-50">
          beta
        </span>
      </div>
      <p class="text-[11px] text-slate-700 mt-1">
        Your simulated college decisions inbox. Click a subject to open the email, then “View Status”
        to jump into that school’s portal.
      </p>
    </div>
    <div class="hidden md:flex flex-col items-end text-[11px] text-slate-600 gap-1">
      <div>
        Signed in as: <span class="font-semibold">{displayEmail}</span>
      </div>
      <button
        type="button"
        class="inline-block bg-slate-100 border border-slate-400 px-2 py-1 text-[10px] text-slate-800 hover:bg-slate-200 rounded-sm"
        on:click={resetSimulation}
      >
        Restart simulation
      </button>
    </div>
  </div>

  {#if viewMode === 'inbox'}
    <!-- Search bar -->
    <div class="px-4 py-2 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
      <p class="text-[11px] text-slate-600">
        Showing <span class="font-semibold">{filteredPortals.length}</span>
        of <span class="font-semibold">{sortedVisiblePortals.length}</span> schools
      </p>
      <div class="flex-1 flex justify-end">
        <input
          type="text"
          class="w-full max-w-xs border border-slate-300 bg-slate-50 px-2 py-1 text-[11px] rounded-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-800 focus:border-blue-800"
          placeholder="Search schools…"
          bind:value={searchQuery}
        />
      </div>
    </div>

    <!-- INBOX VIEW -->
    <div class="flex text-[11px]">
      <!-- Left sidebar -->
      <aside class="w-52 border-r border-slate-200 bg-slate-50 py-3">
        <div class="px-3 mb-3">
          <button
            type="button"
            class="w-full text-left bg-blue-600 text-white border border-blue-800 font-semibold px-3 py-2 text-[11px] rounded-sm hover:bg-blue-500 shadow-sm"
          >
            Compose
          </button>
        </div>
        <nav class="text-[11px] text-slate-800 space-y-1">
          <button
            type="button"
            class={`w-full text-left px-3 py-1 rounded-r-full ${
              activeFolder === 'inbox'
                ? 'bg-blue-100 font-semibold'
                : 'hover:bg-slate-100'
            }`}
            on:click={() => switchFolder('inbox')}
          >
            Inbox <span class="text-slate-500">({visiblePortals.length})</span>
          </button>
          <button
            type="button"
            class="w-full text-left px-3 py-1 hover:bg-slate-100 rounded-r-full"
          >
            Starred
          </button>
          <button
            type="button"
            class={`w-full text-left px-3 py-1 rounded-r-full ${
              activeFolder === 'sent'
                ? 'bg-blue-100 font-semibold'
                : 'hover:bg-slate-100'
            }`}
            on:click={() => switchFolder('sent')}
          >
            Sent
          </button>
          <button
            type="button"
            class="w-full text-left px-3 py-1 hover:bg-slate-100 rounded-r-full"
          >
            Drafts
          </button>
          <button
            type="button"
            class="w-full text-left px-3 py-1 hover:bg-slate-100 rounded-r-full"
          >
            All Mail
          </button>
          <button
            type="button"
            class="w-full text-left px-3 py-1 hover:bg-slate-100 rounded-r-full"
          >
            Trash
          </button>
        </nav>
      </aside>

      <!-- Inbox / Sent main area -->
      <div class="flex-1">
        <!-- ED alert -->
        {#if currentEdPortal && edEmailMustBeViewed && !hasViewedEdEmail}
          <div class="px-4 py-2 bg-red-50 border-b border-red-200 text-[11px] text-red-800 flex items-center justify-between">
            <div class="font-semibold">
              Early Decision / REA decision available for {currentEdPortal.name}.
            </div>
            <button
              type="button"
              class="text-[10px] font-semibold border border-red-400 bg-red-100 px-3 py-1 rounded-sm hover:bg-red-200"
              on:click={() => selectPortal(currentEdPortal)}
            >
              Open decision
            </button>
          </div>
        {/if}

        <!-- Tabs -->
        <div class="border-b border-slate-200 bg-white flex text-[11px]">
          <button
            type="button"
            class="px-4 py-2 border-b-2 border-blue-600 font-semibold text-slate-900"
          >
            Primary
          </button>
          <button
            type="button"
            class="px-4 py-2 text-slate-500 hover:bg-slate-50"
          >
            Updates
          </button>
          <button
            type="button"
            class="px-4 py-2 text-slate-500 hover:bg-slate-50"
          >
            Promotions
          </button>
        </div>

        {#if activeFolder === 'inbox'}
          <div class="px-0 py-0 overflow-x-auto">
            {#if visiblePortals.length === 0}
              <div class="px-4 py-4 text-[11px] text-slate-700">
                Your first decision email will appear here when the calendar reaches your decision date.
              </div>
            {:else}
              <table class="w-full text-xs">
                <tbody>
                  {#if filteredPortals.length === 0}
                    <tr>
                      <td colspan="4" class="px-4 py-4 text-[11px] text-slate-600">
                        No schools match “{searchQuery}”. Try another name or leave the search box empty to
                        see all decisions.
                      </td>
                    </tr>
                  {:else}
                    {#each filteredPortals as portal (portal.slug)}
                      <tr
                        class={`cursor-pointer border-b border-slate-100 hover:bg-slate-50 ${
                          currentEdPortal &&
                          portal.slug === currentEdPortal.slug &&
                          !hasViewedEdEmail
                            ? 'bg-red-50'
                            : readPortalSlugs.has(portal.slug)
                            ? 'bg-slate-50 text-slate-700'
                            : 'bg-white'
                        }`}
                        on:click={() => selectPortal(portal)}
                      >
                        <td class="px-3 py-2 align-top text-slate-500 w-10">
                          <input type="checkbox" class="align-middle mr-1" />
                        </td>
                        <td class="px-2 py-2 align-top text-slate-800 text-[11px] whitespace-nowrap w-64">
                          <span class={readPortalSlugs.has(portal.slug) ? '' : 'font-semibold'}>
                            {portal.name}
                          </span>
                        </td>
                        <td class="px-2 py-2 align-top text-[11px]">
                          <span
                            class={`${
                              currentEdPortal &&
                              portal.slug === currentEdPortal.slug &&
                              !hasViewedEdEmail
                                ? 'font-semibold text-red-700'
                                : readPortalSlugs.has(portal.slug)
                                ? 'text-slate-700'
                                : 'font-semibold text-slate-900'
                            }`}
                          >
                            {portal.subject}
                          </span>
                          <span class="text-slate-500">
                            &nbsp;– A status update is available in your application portal.
                          </span>
                        </td>
                        <td
                          class="px-3 py-2 align-top text-right text-slate-600 text-[11px] whitespace-nowrap w-40"
                        >
                          {getReceivedLabel(portal)}
                        </td>
                      </tr>
                    {/each}
                  {/if}
                </tbody>
              </table>
            {/if}
          </div>
        {:else}
          <!-- SENT MAIL EMAILS -->
          <div class="px-0 py-0 overflow-x-auto">
            <table class="w-full text-xs">
              <tbody>
                {#each sentEmails as message (message.id)}
                  <tr
                    class="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                    on:click={() => selectSent(message)}
                  >
                    <td class="px-3 py-2 align-top text-slate-500 w-10">
                      <input type="checkbox" class="align-middle mr-1" />
                    </td>
                    <td class="px-2 py-2 align-top text-slate-800 text-[11px] whitespace-nowrap w-64">
                      To: {message.to}
                    </td>
                    <td class="px-2 py-2 align-top text-[11px]">
                      <span class="font-semibold text-slate-900">
                        {message.subject}
                      </span>
                      <span class="text-slate-500">
                        &nbsp;– {message.preview}
                      </span>
                    </td>
                    <td
                      class="px-3 py-2 align-top text-right text-slate-600 text-[11px] whitespace-nowrap w-32"
                    >
                      {message.sent}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <!-- EMAIL VIEW -->
    <div class="flex text-[11px]">
      <!-- Left sidebar -->
      <aside class="w-52 border-r border-slate-200 bg-slate-50 py-3">
        <div class="px-3 mb-3">
          <button
            type="button"
            class="w-full text-left bg-blue-600 text-white border border-blue-800 font-semibold px-3 py-2 text-[11px] rounded-sm hover:bg-blue-500 shadow-sm"
          >
            Compose
          </button>
        </div>
        <nav class="text-[11px] text-slate-800 space-y-1">
          <button
            type="button"
            class={`w-full text-left px-3 py-1 rounded-r-full ${
              activeFolder === 'inbox'
                ? 'bg-blue-100 font-semibold'
                : 'hover:bg-slate-100'
            }`}
            on:click={() => switchFolder('inbox')}
          >
            Inbox <span class="text-slate-500">({visiblePortals.length})</span>
          </button>
          <button
            type="button"
            class="w-full text-left px-3 py-1 hover:bg-slate-100 rounded-r-full"
          >
            Starred
          </button>
          <button
            type="button"
            class={`w-full text-left px-3 py-1 rounded-r-full ${
              activeFolder === 'sent'
                ? 'bg-blue-100 font-semibold'
                : 'hover:bg-slate-100'
            }`}
            on:click={() => switchFolder('sent')}
          >
            Sent
          </button>
          <button
            type="button"
            class="w-full text-left px-3 py-1 hover:bg-slate-100 rounded-r-full"
          >
            Drafts
          </button>
          <button
            type="button"
            class="w-full text-left px-3 py-1 hover:bg-slate-100 rounded-r-full"
          >
            All Mail
          </button>
          <button
            type="button"
            class="w-full text-left px-3 py-1 hover:bg-slate-100 rounded-r-full"
          >
            Trash
          </button>
        </nav>
      </aside>

      <!-- Email content area -->
      <div class="flex-1">
        <!-- Top controls -->
        <div class="border-b border-slate-300 bg-slate-100 px-3 py-2 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="border border-slate-400 bg-white px-2 py-1 text-[11px] hover:bg-slate-200"
              on:click={openInboxList}
            >
              &larr; Back to Admissions Inbox
            </button>
            <button
              type="button"
              class="border border-slate-400 bg-white px-2 py-1 text-[11px] hover:bg-slate-200"
            >
              Archive
            </button>
            <button
              type="button"
              class="border border-slate-400 bg-white px-2 py-1 text-[11px] hover:bg-slate-200"
            >
              Report spam
            </button>
            <button
              type="button"
              class="border border-slate-400 bg-white px-2 py-1 text-[11px] hover:bg-slate-200"
            >
              Delete
            </button>
          </div>
          <div class="text-slate-600 text-[11px]">
            1 of {visiblePortals.length}
          </div>
        </div>

        <div class="px-4 py-4">
          {#if activeFolder === 'inbox' && selectedPortal}
            <div class="max-w-3xl text-[12px] leading-relaxed text-slate-900">
              <h3 class="text-sm font-bold mb-1">
                {selectedPortal.subject}
              </h3>
              <div class="text-[11px] text-slate-700 mb-3 border-b border-slate-300 pb-2">
                <div>
                  <span class="font-semibold">From:</span> {selectedPortal.from}
                </div>
                <div>
                  <span class="font-semibold">To:</span> {displayName} &lt;{displayEmail}&gt;
                </div>
                <div>
                  <span class="font-semibold">Date:</span> {getReceivedLabel(selectedPortal)}
                </div>
              </div>

              <p class="mb-2">
                Dear {displayName},
              </p>
              <p class="mb-2">
                This email is to notify you that there has been an update to your application status
                for <span class="font-semibold"> {selectedPortal.name}</span>. For security reasons, we do
                not release admission decisions via email.
              </p>
              <p class="mb-2">
                Please log in to your applicant portal using the credentials you created when you first
                applied. Once you have signed in, you will be able to view your official admission
                decision and any related next steps.
              </p>
              <p class="mb-3">
                To view your status, click the link below:
              </p>

              <p class="mb-4">
                <a
                  href={`/portals/${selectedPortal.slug}`}
                  class="inline-block border border-blue-800 bg-blue-900 text-white text-[11px] font-semibold px-4 py-2 no-underline hover:bg-blue-800"
                >
                  View Status
                </a>
              </p>

              <p class="mb-2">
                If you experience any difficulty accessing your portal, please ensure that you are using
                the same email address you used when you applied and that your password is entered
                correctly.
              </p>

              <p class="mt-4">
                Sincerely,<br />
                <span class="font-semibold">Office of Undergraduate Admissions</span><br />
                {selectedPortal.name}
              </p>
            </div>
          {:else if activeFolder === 'sent' && selectedSent}
            <div class="max-w-3xl text-[12px] leading-relaxed text-slate-900">
              <h3 class="text-sm font-bold mb-1">
                {selectedSent.subject}
              </h3>
              <div class="text-[11px] text-slate-700 mb-3 border-b border-slate-300 pb-2">
                <div>
                  <span class="font-semibold">From:</span> {displayName} &lt;{displayEmail}&gt;
                </div>
                <div>
                  <span class="font-semibold">To:</span> {selectedSent.to}
                </div>
                <div>
                  <span class="font-semibold">Date:</span> {selectedSent.sent}
                </div>
              </div>

              <pre class="whitespace-pre-wrap text-[12px] leading-relaxed text-slate-900 mb-2">
{selectedSent.body}
              </pre>
            </div>
          {:else}
            <p class="text-[11px] text-slate-700">
              No email selected. Use “Back to Admissions Inbox” to choose a message.
            </p>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</section>
