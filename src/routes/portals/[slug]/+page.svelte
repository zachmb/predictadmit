<script lang="ts">
  import { page } from '$app/stores';
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';

  import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
  import { schoolConfigs } from '$lib/config/schools';

  import GenericAcceptedLetter from '$lib/components/portal/GenericAcceptedLetter.svelte';
  import GenericDeniedLetter from '$lib/components/portal/GenericDeniedLetter.svelte';

  import DukeAccepted from '$lib/components/duke/DukeAccepted.svelte';
  import DukeDenied from '$lib/components/duke/DukeDenied.svelte';
  import HarvardAccepted from '$lib/components/harvard/HarvardAccepted.svelte';
  import HarvardDenied from '$lib/components/harvard/HarvardDenied.svelte';

  /**
   * Use the type of GenericAcceptedLetter as the base component type.
   * All letter components have the same shape, so this keeps TS happy
   * without importing runtime-only stuff.
   */
  type LetterComponents = {
    accepted: typeof GenericAcceptedLetter;
    denied: typeof GenericDeniedLetter;
  };

  // Register custom letters by slug. Others fall back to Generic*.
  const letterComponentsBySlug: Record<string, LetterComponents> = {
    duke: {
      accepted: DukeAccepted,
      denied: DukeDenied
    },
    harvard: {
      accepted: HarvardAccepted,
      denied: HarvardDenied
    }
    // Add more here as you create per-school components.
  };

  const getLetterComponentsForSlug = (slug: string): LetterComponents => {
    return letterComponentsBySlug[slug] ?? {
      accepted: GenericAcceptedLetter,
      denied: GenericDeniedLetter
    };
  };

  // ----------------- STATE -----------------

  let profile: UserProfile = { name: '', email: '', password: '' };
  let emailInput = '';
  let passwordInput = '';
  let error = '';
  let authenticated = false;
  let hasViewedUpdate = false;

  // Route + school state must be declared before reactive assignments
  let currentSlug = '';
  let school: (typeof schoolConfigs)[string] | undefined = undefined;
  let pageTitle = 'PredictAdmit – Unknown Portal';

  // ----------------- REACTIVE DERIVATIONS -----------------

  $: profile = $userProfile;

  $: currentSlug = $page.params.slug;

  $: school = schoolConfigs[currentSlug];

  $: pageTitle = school
    ? `${school.schoolName} Undergraduate Admissions Portal`
    : 'PredictAdmit – Unknown Portal';

  const applicantName = () => profile.name || 'Applicant';

  // ----------------- HANDLERS -----------------

  const handleLoadSavedLogin = () => {
    if (!profile.email || !profile.password) {
      error = 'No saved PredictAdmit login found. Please save it on the main page first.';
      return;
    }
    emailInput = profile.email;
    passwordInput = profile.password;
    error = '';
  };

  const handleLogin = (event: SubmitEvent) => {
    event.preventDefault();

    if (!school) {
      error = 'Unknown portal.';
      authenticated = false;
      return;
    }

    if (!profile.email || !profile.password) {
      error = 'Please set your PredictAdmit email and password on the main page.';
      authenticated = false;
      return;
    }

    if (emailInput.trim() === profile.email && passwordInput === profile.password) {
      authenticated = true;
      error = '';
    } else {
      error = 'Invalid email or password.';
      authenticated = false;
    }
  };

  const handleViewUpdate = () => {
    hasViewedUpdate = true;
  };
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

{#if !school}
  <main class="min-h-screen bg-slate-200 text-slate-900 font-serif flex items-center justify-center px-4">
    <div class="border border-slate-400 bg-white px-6 py-4 shadow-md max-w-md text-sm">
      <h1 class="text-lg font-bold mb-2">Unknown Admissions Portal</h1>
      <p class="text-[12px] text-slate-800 mb-2">
        The portal you tried to access is not part of this PredictAdmit simulation.
      </p>
      <p class="text-[11px] text-slate-700">
        Please return to the admitMail inbox and try a different link.
      </p>
    </div>
  </main>
{:else}
  <!-- Outer wrapper (not <main>, so child templates can own <main> / main content) -->
  <div class="min-h-screen bg-slate-200 text-slate-900 font-serif">
    {#if !authenticated}
      <!-- LOGIN VIEW -->
      <header class="bg-white border-b border-slate-300">
        <div class="max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
          <div class="flex items-baseline gap-3">
            <span class="text-3xl font-serif" style={`color: ${school.primaryColor};`}>
              {school.logoPrimary}
            </span>
            <span class="text-[11px] tracking-[0.18em] uppercase text-slate-700">
              {school.logoSecondary}
            </span>
          </div>
          <div class="text-[11px] text-slate-700">
            {applicantName()}
          </div>
        </div>
        <div class="h-8" style={`background-color: ${school.primaryColor};`}></div>
      </header>

      <section class="bg-white">
        <div class="max-w-5xl mx-auto px-10 py-10">
          <h1 class="text-3xl font-normal mb-6">
            Login
          </h1>

          <div class="border border-lime-700 bg-lime-100 px-4 py-3 mb-8 text-[12px] text-slate-900">
            To log in, please enter your email address and password.
          </div>

          <form class="space-y-4 text-sm" on:submit={handleLogin}>
            {#if error}
              <p
                class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2"
                role="alert"
              >
                {error}
              </p>
            {/if}

            <div class="flex items-center gap-4">
              <label
                for="portal-email"
                class="w-32 text-[12px] font-semibold text-slate-900 text-right"
              >
                Email Address
              </label>
              <input
                id="portal-email"
                type="email"
                class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80"
                bind:value={emailInput}
                autocomplete="email"
              />
            </div>

            <div class="flex items-center gap-4">
              <label
                for="portal-password"
                class="w-32 text-[12px] font-semibold text-slate-900 text-right"
              >
                Password
              </label>
              <input
                id="portal-password"
                type="password"
                class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80"
                bind:value={passwordInput}
                autocomplete="current-password"
              />
              <a
                href="/disclaimer"
                class="text-[12px] text-blue-800 underline hover:no-underline"
              >
                Forgot Your Password?
              </a>
            </div>

            <div class="flex items-center gap-4 pt-4">
              <div class="w-32"></div>
              <div class="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  class="border border-slate-500 bg-slate-300 px-4 py-1 text-[12px] font-semibold hover:bg-slate-400 active:bg-slate-500"
                >
                  Login
                </button>
                <button
                  type="button"
                  class="border border-slate-400 bg-slate-100 px-3 py-1 text-[11px] hover:bg-slate-200 active:bg-slate-300"
                  on:click={handleLoadSavedLogin}
                >
                  Load saved PredictAdmit login
                </button>
              </div>
            </div>

            <p class="pt-4 text-[10px] leading-relaxed text-slate-600 max-w-xl">
              For this simulation, use the same email address and password that you saved on the
              PredictAdmit.com home page. No real application data is used, and all information is
              stored only in your browser.
            </p>
          </form>
        </div>
      </section>

      <footer class="mt-8">
        <div
          class="h-10 flex items-center"
          style={`background-color: ${school.primaryColor};`}
        >
          <div class="max-w-5xl mx-auto px-6 w-full flex items-center justify-between text-[11px] text-white">
            <span>&copy; {school.footerDomain} 2019</span>
            <span class="opacity-80">
              PredictAdmit.com simulation · Not affiliated with {school.schoolName}
            </span>
          </div>
        </div>
      </footer>
    {:else}
      {#if !hasViewedUpdate}
        <AdmissionsPortalTemplate
          logoPrimary={school.logoPrimary}
          logoSecondary={school.logoSecondary}
          schoolName={school.schoolName}
          primaryColor={school.primaryColor}
          applicantName={applicantName()}
          admissionsId={school.admissionsId}
          financialAidId={school.financialAidId}
          bannerText={school.bannerText}
          noticeText={school.noticeText}
          statusLastPosted={school.statusLastPosted}
          statusLinkLabel={school.statusLinkLabel}
          onViewUpdate={handleViewUpdate}
        />
      {:else}
        {#key school.slug}
          {#if school.decision === 'admit'}
            <svelte:component
              this={getLetterComponentsForSlug(school.slug).accepted}
              applicantName={applicantName()}
              schoolName={school.schoolName}
              primaryColor={school.primaryColor}
              footerDomain={school.footerDomain}
            />
          {:else}
            <svelte:component
              this={getLetterComponentsForSlug(school.slug).denied}
              applicantName={applicantName()}
              schoolName={school.schoolName}
              primaryColor={school.primaryColor}
              footerDomain={school.footerDomain}
            />
          {/if}
        {/key}
      {/if}
    {/if}
  </div>
{/if}
