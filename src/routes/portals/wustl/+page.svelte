<script lang="ts">
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';

  import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
  import WUSTLAccepted from '$lib/components/wustl/WUSTLAccepted.svelte';
  import WUSTLDenied from '$lib/components/wustl/WUSTLDenied.svelte';

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
  <title>Washington University in St. Louis Undergraduate Admissions Portal</title>
</svelte:head>

<main class="min-h-screen bg-slate-200 text-slate-900 font-serif">
  {#if !authenticated}
    <!-- FULL-SCREEN WASHU LOGIN (Duke style, WashU Red) -->
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="w-full max-w-md bg-white border border-slate-500 shadow-md">
        <div class="bg-[#A51417] text-white border-b border-slate-700 px-4 py-3">
          <h1 class="text-lg font-bold tracking-tight">
            Washington University in St. Louis
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
              for="wustl-email"
            >
              Email Address:
            </label>
            <input
              id="wustl-email"
              type="email"
              class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-[#A51417]"
              bind:value={emailInput}
              autocomplete="email"
            />
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-slate-800 mb-1"
              for="wustl-password"
            >
              Password:
            </label>
            <input
              id="wustl-password"
              type="password"
              class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-[#A51417]"
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
            class="mt-2 inline-block bg-[#A51417] text-white text-sm font-semibold px-4 py-2 border border-[#8A1013] shadow hover:bg-[#8A1013] focus:outline-none focus:ring-1 focus:ring-[#A51417]"
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
        logoPrimary="WASHINGTON"
        logoSecondary="UNIVERSITY"
        schoolName="Washington University in St. Louis"
        primaryColor="#A51417"
        applicantName={applicantName()}
        admissionsId="2026-WUSTL-778899"
        financialAidId="FA-001122"
        bannerText="Thank you for applying to Washington University in St. Louis!"
        noticeText="Admission decisions for Regular Decision applicants will be available Thursday, March 21, 2024 at 5:00 PM Central Time."
        statusLastPosted="February 16, 2024"
        statusLinkLabel="View Decision >>"
        onViewUpdate={handleViewUpdate}
        additionalSections={[
          {
            title: 'Application Information',
            content: `
              <p><strong>Application Type:</strong> Regular Decision</p>
              <p><strong>Undergraduate Division:</strong> College of Arts & Sciences</p>
              <p><strong>Proposed Major:</strong> Biology</p>
              <p><strong>Application ID:</strong> WUSTL-778899</p>
              <p><strong>Applicant:</strong> ${applicantName()}</p>
              <p><strong>Decision Status:</strong> Available</p>
              <p><strong>Application Complete:</strong> January 4, 2024</p>
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
                  <span>WashU Supplement (Submitted)</span>
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
                  <span>Counselor Recommendation (Received)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Teacher Recommendations (2 Received)</span>
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
            title: 'Washington University Undergraduate Schools',
            content: `
              <p class="text-sm mb-2">Washington University in St. Louis comprises five undergraduate schools:</p>
              <ul class="text-sm list-disc pl-5 space-y-1 text-gray-700">
                <li><strong>College of Arts & Sciences</strong></li>
                <li><strong>McKelvey School of Engineering</strong></li>
                <li><strong>Olin Business School</strong></li>
                <li><strong>Sam Fox School of Design & Visual Arts</strong></li>
                <li><strong>University College</strong> (part-time/continuing education)</li>
              </ul>
            `
          },
          {
            title: 'Contact Information',
            content: `
              <p><strong>Undergraduate Admissions:</strong> 314-935-6000</p>
              <p><strong>Email:</strong> <a href="mailto:admissions@wustl.edu" class="text-[#A51417] hover:underline">admissions@wustl.edu</a></p>
              <p><strong>Office Hours:</strong> Monday–Friday, 8:30 AM–5:00 PM CST</p>
              <p class="mt-2 text-sm text-gray-600">Please have your Application ID (WUSTL-778899) ready when contacting our office.</p>
            `
          }
        ]}
      />
    {:else}
      <!-- FINAL DECISION LETTER, FULL PAGE -->
      {#if DECISION === 'admit'}
        <WUSTLAccepted applicantName={applicantName()} />
      {:else}
        <WUSTLDenied applicantName={applicantName()} />
      {/if}
    {/if}
  {/if}
</main>