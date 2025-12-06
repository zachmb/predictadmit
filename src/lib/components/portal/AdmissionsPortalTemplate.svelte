<script lang="ts">
  // Generic template for early-2000s admissions portals

  export let logoPrimary = '';                // e.g. "Duke"
  export let logoSecondary = 'UNDERGRADUATE ADMISSIONS';
  export let schoolName = '';                 // e.g. "Duke University"

  export let applicantName = 'Applicant';
  export let admissionsId: string | null = null;
  export let financialAidId: string | null = null;

  export let bannerText = '';                 // main thank-you line
  export let noticeText = '';                 // bold line about decision date

  export let statusSectionTitle = 'Status Update';
  export let statusLastPosted = '';           // e.g. "December 12, 2019"
  export let statusLinkLabel = 'View Update &gt;&gt;';
  export let statusLinkHref: string | null = null;

  export let showTabs = true;
  export let admissionsTabLabel = 'Admissions';
  export let financialTabLabel = 'Financial Aid';

  export let primaryColor = '#0047ab';        // header/footer color per school
  export let footerLabelLeft = 'UKE.EDU 2019';

  // If provided, called instead of doing a normal navigation
  export let onViewUpdate: (() => void) | null = null;

  const handleStatusClick = (event: MouseEvent) => {
    if (onViewUpdate) {
      event.preventDefault();
      onViewUpdate();
    }
  };
</script>

<div
  class="min-h-screen flex flex-col bg-white text-black"
  style="font-family: Arial, Helvetica, sans-serif;"
>
  <!-- Top header bar -->
  <header class="w-full" style={`background-color: ${primaryColor};`}>
    <div class="max-w-5xl mx-auto px-4 py-4">
      <div class="flex items-baseline gap-2">
        <div class="text-white text-3xl leading-none mr-2">
          {logoPrimary}
        </div>
        <div class="text-white text-xs tracking-[0.18em] uppercase">
          {logoSecondary}
        </div>
      </div>
      {#if schoolName}
        <div class="text-white text-xs mt-1">
          {schoolName}
        </div>
      {/if}
    </div>
  </header>

  <!-- Main body -->
  <main class="flex-1 w-full">
    <div class="max-w-5xl mx-auto px-4 py-8">
      <!-- IDs top-right -->
      <div class="flex justify-end text-sm">
        <div class="text-right">
          {#if admissionsId}
            <div>
              <span class="font-bold">Admissions ID:</span> {admissionsId}
            </div>
          {/if}
          {#if financialAidId}
            <div>
              <span class="font-bold">Financial Aid ID:</span> {financialAidId}
            </div>
          {/if}
        </div>
      </div>

      <!-- Greeting + copy -->
      <h1 class="mt-4 mb-4 text-2xl font-bold">
        Welcome, {applicantName}!
      </h1>

      {#if bannerText}
        <p class="mb-3 text-sm">
          {bannerText}
        </p>
      {/if}

      {#if noticeText}
        <p class="mb-5 text-sm font-bold">
          {noticeText}
        </p>
      {/if}

      <!-- Gray tabs -->
      {#if showTabs}
        <div class="mb-6 flex gap-3">
          <button
            type="button"
            class="border border-gray-400 bg-gray-200 text-xs px-4 py-1"
          >
            {admissionsTabLabel}
          </button>
          <button
            type="button"
            class="border border-gray-400 bg-gray-200 text-xs px-4 py-1 text-gray-600"
          >
            {financialTabLabel}
          </button>
        </div>
      {/if}

      <!-- Status section -->
      <section class="mb-8 text-sm">
        <h2 class="font-bold mb-1">
          {statusSectionTitle}
        </h2>
        {#if statusLastPosted}
          <p class="mb-2">
            An update to your application was last posted {statusLastPosted}.
          </p>
        {/if}

        {#if statusLinkHref}
          <a
            href={statusLinkHref}
            class="text-blue-700 font-bold text-sm"
            on:click={handleStatusClick}
          >
            {@html statusLinkLabel}
          </a>
        {:else}
          <!-- Use button as a fake link when using onViewUpdate -->
          <button
            type="button"
            class="p-0 border-0 bg-transparent text-blue-700 font-bold text-sm underline-offset-2 hover:underline cursor-pointer"
            on:click={handleStatusClick}
          >
            {@html statusLinkLabel}
          </button>
        {/if}
      </section>

      <!-- Optional “Forms” heading + slot -->
      <section class="text-sm mt-6">
        <h2 class="font-bold mb-1">Forms</h2>
        <slot />
      </section>

      <!-- Account tools -->
      <div class="mt-16 text-center text-xs">
        Account Tools:
        <a href="/account/email" class="text-blue-700 ml-1 mr-1">Change Email Address</a>
        <a href="/account/password" class="text-blue-700 mr-1">Change Password</a>
        <a href="/logout" class="text-blue-700">Logout</a>
      </div>
    </div>
  </main>

  <!-- Bottom footer bar -->
  <footer class="w-full mt-8" style={`background-color: ${primaryColor};`}>
    <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between text-xs text-white">
      <div class="flex items-center gap-2">
        <div
          class="h-6 w-6 rounded-full bg-white text-blue-700 flex items-center justify-center text-lg"
          aria-hidden="true"
        >
          ⓘ
        </div>
        <span>{footerLabelLeft}</span>
      </div>

      <!-- Fake social icons with real hrefs -->
      <div class="flex gap-4">
        <a href="https://x.com" target="_blank" rel="noreferrer">𝕏</a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer">f</a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer">▶</a>
      </div>
    </div>
  </footer>
</div>
