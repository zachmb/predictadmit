<script lang="ts">
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';

  import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
  import UPennAccepted from '$lib/components/upenn/UPennAccepted.svelte';
  import UPennDenied from '$lib/components/upenn/UPennDenied.svelte';

  // Toggle this for your own simulations
  const DECISION: 'admit' | 'deny' = 'admit';

  let profile: UserProfile = { name: '', email: '', password: '' };
  let emailInput = '';
  let passwordInput = '';
  let error = '';
  let authenticated = false;
  let hasViewedUpdate = false;

  // pull from PredictAdmit main page store
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

  const handleViewUpdate = () => {
    hasViewedUpdate = true;
  };
</script>

<svelte:head>
  <title>University of Pennsylvania Undergraduate Admissions Portal</title>
</svelte:head>

<main class="min-h-screen bg-slate-200 text-slate-900 font-serif">
  {#if !authenticated}
    <!-- FULL-SCREEN UPENN LOGIN (early 2000s vibe) -->
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="w-full max-w-md bg-white border border-slate-500 shadow-md">
        <!-- Header - Penn Red (#990000) -->
        <div class="bg-[#990000] text-white border-b border-slate-700 px-4 py-3">
          <h1 class="text-lg font-bold tracking-tight">
            University of Pennsylvania
          </h1>
          <p class="text-[11px] text-red-100">
            Undergraduate Admissions – Applicant Login
          </p>
        </div>

        <form class="px-4 py-4 space-y-3" on:submit={handleLogin}>
          <p class="text-[11px] text-slate-700 mb-1">
            Please sign in using the email address and password you created on
            <span class="font-semibold">PredictAdmit.com</span>.
          </p>

          <div>
            <label
              class="block text-sm font-semibold text-slate-800 mb-1"
              for="upenn-email"
            >
              Email Address:
            </label>
            <input
              id="upenn-email"
              type="email"
              class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-[#990000]"
              bind:value={emailInput}
              autocomplete="email"
            />
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-slate-800 mb-1"
              for="upenn-password"
            >
              Password:
            </label>
            <input
              id="upenn-password"
              type="password"
              class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-[#990000]"
              bind:value={passwordInput}
              autocomplete="current-password"
            />
          </div>

          {#if error}
            <p class="text-[11px] text-red-700 mt-1">
              {error}
            </p>
          {/if}

          <button
            type="submit"
            class="mt-2 inline-block bg-[#990000] text-white text-sm font-semibold px-4 py-2 border border-[#880000] shadow hover:bg-[#880000] focus:outline-none focus:ring-1 focus:ring-[#990000]"
          >
            Log In
          </button>

          <p class="mt-3 text-[11px] text-slate-700">
            To change your login credentials, return to the main
            <span class="font-semibold">PredictAdmit.com</span> page.
          </p>
        </form>
      </div>
    </div>
  {:else}
    <!-- AUTHENTICATED FLOW -->
    {#if !hasViewedUpdate}
      <!-- FULL-SCREEN PORTAL SHELL USING THE TEMPLATE -->
      <AdmissionsPortalTemplate
        logoPrimary="Penn"
        logoSecondary="ADMISSIONS"
        schoolName="University of Pennsylvania"
        primaryColor="#990000"
        applicantName={applicantName()}
        admissionsId="2026-PENN-456789"
        financialAidId="FA-112233"
        bannerText="Thank you for applying to the University of Pennsylvania!"
        noticeText="Admission decisions for Regular Decision candidates will be available Thursday, March 28, 2024 at 7:00 PM Eastern Time."
        statusLastPosted="February 20, 2024"
        statusLinkLabel="View Decision >>"
        onViewUpdate={handleViewUpdate}
        additionalSections={[
          {
            title: 'Application Information',
            content: `
              <p><strong>Application Type:</strong> Regular Decision</p>
              <p><strong>Proposed School:</strong> The College of Arts and Sciences</p>
              <p><strong>Application ID:</strong> PENN-456789</p>
              <p><strong>Applicant:</strong> ${applicantName()}</p>
              <p><strong>Decision Status:</strong> Available</p>
            `
          },
          {
            title: 'Application Checklist',
            content: `
              <div class="space-y-2">
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Common Application (Submitted)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Penn Writing Supplement (Submitted)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>School Report & Transcript (Received)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Teacher Recommendations (Received)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Mid-Year Report (Received)</span>
                </div>
              </div>
            `
          },
          {
            title: 'Financial Aid',
            content: `
              <p>Your financial aid application is complete and under review. Financial aid decisions 
              will be released concurrently with admission decisions.</p>
              <p class="mt-2 text-sm text-gray-600">For questions about financial aid, please contact the 
              Student Financial Services office at 215-898-1988 or 
              <a href="mailto:sfsmail@upenn.edu" class="text-[#990000] hover:underline">sfsmail@upenn.edu</a>.</p>
            `
          },
          {
            title: 'Undergraduate Schools at Penn',
            content: `
              <p class="text-sm mb-2">The University of Pennsylvania comprises four undergraduate schools:</p>
              <ul class="text-sm list-disc pl-5 space-y-1 text-gray-700">
                <li><strong>The College of Arts and Sciences</strong></li>
                <li><strong>The School of Engineering and Applied Science</strong></li>
                <li><strong>The Wharton School</strong></li>
                <li><strong>The School of Nursing</strong></li>
              </ul>
            `
          },
          {
            title: 'Contact Information',
            content: `
              <p><strong>Undergraduate Admissions:</strong> 215-898-7507</p>
              <p><strong>Email:</strong> <a href="mailto:info@admissions.upenn.edu" class="text-[#990000] hover:underline">info@admissions.upenn.edu</a></p>
              <p><strong>Office Hours:</strong> Monday–Friday, 9:00 AM–5:00 PM EST</p>
              <p class="mt-2 text-sm text-gray-600">Please have your Application ID (PENN-456789) ready when contacting our office.</p>
            `
          }
        ]}
      />
    {:else}
      <!-- FINAL DECISION LETTER, FULL PAGE -->
      {#if DECISION === 'admit'}
        <UPennAccepted applicantName={applicantName()} />
      {:else}
        <UPennDenied applicantName={applicantName()} />
      {/if}
    {/if}
  {/if}
</main>