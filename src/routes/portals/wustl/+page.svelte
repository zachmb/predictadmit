<script lang="ts">
  import { tick } from 'svelte';
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';
  import WashUAccepted from '$lib/components/washu/WashUAccepted.svelte';
  import WashUDenied from '$lib/components/washu/WashUDenied.svelte';

  const DECISION: 'admit' | 'deny' = 'admit';

  let profile: UserProfile = { name: '', email: '', password: '' };
  let emailInput = '';
  let passwordInput = '';
  let error = '';
  let authenticated = false;
  let hasViewedUpdate = false;

  $: profile = $userProfile;

  const applicantName = () => profile.name || 'Applicant';

  const handleLogin = (event: SubmitEvent) => {
    event.preventDefault();

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

  const handleViewUpdate = async () => {
    hasViewedUpdate = true;
    await tick();
    window.scrollTo(0, 0);
  };
</script>

<svelte:head>
  <title>Washington University in St. Louis - Admission Portal</title>
</svelte:head>

{#if !authenticated}
  <!-- WashU login screen -->
  <div class="min-h-screen bg-stone-50">
    <!-- Header with logo -->
    <header class="bg-[#A51417] py-4">
      <div class="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <div class="text-[#A51417] font-bold text-xs text-center leading-tight">WASHU<br/>1853</div>
          </div>
          <div class="text-white">
            <div class="text-xl font-semibold">Washington University in St. Louis</div>
            <div class="text-sm">UNDERGRADUATE ADMISSIONS</div>
          </div>
        </div>
        <div class="text-white text-sm">
          {applicantName()}
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-stone-100 border-b border-stone-300">
      <div class="max-w-6xl mx-auto px-6 py-3 flex gap-8 text-sm text-stone-700">
        <a href="/portals/washu" class="hover:text-[#A51417]">Academics</a>
        <a href="/portals/washu" class="hover:text-[#A51417]">Life at WashU</a>
        <a href="/portals/washu" class="hover:text-[#A51417]">Cost & Aid</a>
        <a href="/portals/washu" class="hover:text-[#A51417]">Visit Us Virtually</a>
        <a href="/portals/washu" class="hover:text-[#A51417]">How to Apply</a>
      </div>
    </nav>

    <section class="bg-white">
      <div class="max-w-4xl mx-auto px-10 py-12">
        <h1 class="text-3xl font-normal mb-2 text-stone-800">
          WashU Pathway Login
        </h1>
        <p class="text-sm text-stone-600 mb-8">
          Access your application status and admission decision
        </p>

        <form class="space-y-6" on:submit={handleLogin}>
          {#if error}
            <div class="bg-red-50 border border-red-300 text-red-800 px-4 py-3 text-sm" role="alert">
              {error}
            </div>
          {/if}

          <div>
            <label for="washu-email" class="block text-sm font-semibold text-stone-800 mb-2">
              Email Address
            </label>
            <input
              id="washu-email"
              type="email"
              class="w-full border border-stone-400 px-3 py-2 text-sm focus:outline-none focus:border-[#A51417]"
              bind:value={emailInput}
              autocomplete="email"
              required
            />
          </div>

          <div>
            <label for="washu-password" class="block text-sm font-semibold text-stone-800 mb-2">
              Password
            </label>
            <input
              id="washu-password"
              type="password"
              class="w-full border border-stone-400 px-3 py-2 text-sm focus:outline-none focus:border-[#A51417]"
              bind:value={passwordInput}
              autocomplete="current-password"
              required
            />
            <a href="/portals/washu" class="text-sm text-[#A51417] hover:underline mt-2 inline-block">
              Forgot Your Password?
            </a>
          </div>

          <div class="flex items-center gap-4 pt-2">
            <button
              type="submit"
              class="bg-[#A51417] text-white px-6 py-2 text-sm font-semibold hover:bg-[#8B1114] transition-colors"
            >
              Login
            </button>
          </div>

          <p class="pt-4 text-xs text-stone-600 max-w-2xl leading-relaxed border-t border-stone-200 mt-6">
            For this simulation, use the same email address and password that you saved on the
            PredictAdmit.com home page. No real application data is used, and all information is
            stored only in your browser.
          </p>
        </form>
      </div>
    </section>

    <footer class="bg-stone-800 text-white mt-12 py-6">
      <div class="max-w-6xl mx-auto px-6 text-xs">
        <div class="flex items-center justify-between">
          <span>&copy; 2021 Washington University in St. Louis</span>
          <span class="opacity-70">PredictAdmit.com simulation · Not affiliated with Washington University</span>
        </div>
      </div>
    </footer>
  </div>
{:else}
  {#if !hasViewedUpdate}
    <!-- WashU Header -->
    <header class="bg-white border-b border-stone-200 py-3">
      <div class="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <div class="text-xs text-stone-500 uppercase tracking-wide">
          <a href="/portals/washu" class="hover:text-[#A51417]">WASHU PATHWAY</a>
          <span class="mx-3">|</span>
          <a href="/portals/washu" class="hover:text-[#A51417]">REQUEST INFORMATION</a>
          <span class="mx-3">|</span>
          <a href="/portals/washu" class="hover:text-[#A51417]">CONTACT US</a>
        </div>
      </div>
    </header>

    <!-- Main Title -->
    <div class="bg-white py-12">
      <div class="max-w-7xl mx-auto px-8">
        <h1 class="text-5xl tracking-tight">
          <span class="text-stone-300 font-light">UNDERGRADUATE</span>
          {" "}
          <span class="text-[#A51417] font-normal">ADMISSIONS</span>
        </h1>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <nav class="bg-white border-b border-stone-200">
      <div class="max-w-7xl mx-auto px-8 flex gap-12 text-sm text-stone-600">
        <a href="/portals/washu" class="py-4 hover:text-[#A51417]">Academics</a>
        <a href="/portals/washu" class="py-4 hover:text-[#A51417]">Life at WashU</a>
        <a href="/portals/washu" class="py-4 hover:text-[#A51417]">Cost & Aid</a>
        <a href="/portals/washu" class="py-4 hover:text-[#A51417]">Visit Us Virtually</a>
        <a href="/portals/washu" class="py-4 hover:text-[#A51417]">How to Apply</a>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="bg-stone-50 min-h-screen">
      <main class="max-w-7xl mx-auto px-8 py-12">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl text-stone-600 font-light">
            WashU Pathway for {applicantName()}
          </h2>
          <a href="/portals/washu" class="text-xs text-stone-500 uppercase tracking-wide hover:text-[#A51417]">
            GO TO THE FINANCIAL AID PORTAL →
          </a>
        </div>

        <div class="grid grid-cols-3 gap-8">
          <!-- Left Column -->
          <div class="col-span-2 space-y-6">
            <!-- Status Update -->
            <div class="bg-amber-50 border-l-4 border-amber-400 p-6">
              <h3 class="text-base font-semibold text-amber-900 mb-2">Status Update</h3>
              <p class="text-sm text-stone-700 mb-3">
                New updates to your application were posted March 24, 2021.
              </p>
              <button
                on:click={handleViewUpdate}
                class="text-sm font-semibold text-[#A51417] hover:underline"
              >
                View Update &gt;&gt;
              </button>
            </div>

            <!-- Application Status Text -->
            <div class="space-y-4 text-sm text-stone-700 leading-relaxed">
              <p>
                Your Regular Decision application for admission is complete! Please check back for important updates.
              </p>
              <p>
                You have elected to submit standardized tests scores in your application for admission. You may 
                report new ACT or SAT scores using this form - <a href="/portals/washu" class="text-[#A51417] underline">Self-Reported Test Scores</a>.
              </p>
              <p>
                If you report test scores, we will use these test scores to read and make a decision on your 
                application. Enrolling students who elect to provide test scores and who self-report scores on their 
                application will be required to send official scores from the testing agency.
              </p>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Questions Section with Image -->
            <div class="bg-white border border-stone-200 overflow-hidden">
              <div class="p-6">
                <h4 class="text-base font-semibold text-stone-800 mb-3">Questions?</h4>
                <p class="text-sm text-stone-700 leading-relaxed mb-4">
                  If you have questions about your application checklist, or if you have a change to your 
                  mailing address or email, contact your Admissions Services Coordinator:
                </p>
              </div>
              <!-- Counselor Image Placeholder -->
              <div class="w-full h-64 bg-stone-200 flex items-center justify-center">
                <div class="text-center">
                  <div class="w-32 h-32 bg-stone-300 rounded-full mx-auto mb-2"></div>
                  <p class="text-sm font-semibold text-stone-700">Regional Counselor</p>
                  <p class="text-xs text-stone-500">Admissions Office</p>
                </div>
              </div>
              <div class="p-6 bg-stone-50">
                <a href="/portals/washu" class="text-sm text-[#A51417] hover:underline font-medium">
                  MEET YOUR COUNSELOR →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Footer -->
    <footer class="bg-stone-800 text-white py-8">
      <div class="max-w-7xl mx-auto px-8">
        <div class="flex items-center justify-between text-xs">
          <span>&copy; 2021 Washington University in St. Louis</span>
          <span class="opacity-70">PredictAdmit.com simulation · Not affiliated with Washington University</span>
        </div>
      </div>
    </footer>
  {:else}
    {#if DECISION === 'admit'}
      <WashUAccepted applicantName={applicantName()} />
    {:else}
      <WashUDenied applicantName={applicantName()} />
    {/if}
  {/if}
{/if}