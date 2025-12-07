<script lang="ts">
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';

  import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
  import UCBerkeleyAccepted from '$lib/components/berkeley/UCBerkeleyAccepted.svelte';
  import UCBerkeleyDenied from '$lib/components/berkeley/UCBerkeleyDenied.svelte';

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
  <title>UC Berkeley Undergraduate Admissions Portal</title>
</svelte:head>

<main class="min-h-screen bg-slate-200 text-slate-900 font-serif">
  {#if !authenticated}
    <!-- FULL-SCREEN UC BERKELEY LOGIN (Duke style, Berkeley Blue) -->
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="w-full max-w-md bg-white border border-slate-500 shadow-md">
        <div class="bg-[#003262] text-white border-b border-slate-700 px-4 py-3">
          <h1 class="text-lg font-bold tracking-tight">
            UC Berkeley
          </h1>
          <p class="text-[11px] text-[#FDB515]">
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
              for="berkeley-email"
            >
              Email Address:
            </label>
            <input
              id="berkeley-email"
              type="email"
              class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-[#003262]"
              bind:value={emailInput}
              autocomplete="email"
            />
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-slate-800 mb-1"
              for="berkeley-password"
            >
              Password:
            </label>
            <input
              id="berkeley-password"
              type="password"
              class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-[#003262]"
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
            class="mt-2 inline-block bg-[#003262] text-white text-sm font-semibold px-4 py-2 border border-[#00254A] shadow hover:bg-[#00254A] focus:outline-none focus:ring-1 focus:ring-[#003262]"
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
        logoPrimary="UC BERKELEY"
        logoSecondary="ADMISSIONS"
        schoolName="University of California, Berkeley"
        primaryColor="#003262"
        applicantName={applicantName()}
        admissionsId="2024-BERK-112233"
        financialAidId="FA-445566"
        bannerText="Thank you for applying to the University of California, Berkeley!"
        noticeText="Admission decisions for freshman applicants will be available Thursday, March 28, 2024 at 3:00 PM Pacific Time."
        statusLastPosted="February 1, 2024"
        statusLinkLabel="View Decision >>"
        onViewUpdate={handleViewUpdate}
        additionalSections={[
          {
            title: 'Application Information',
            content: `
              <p><strong>Application Type:</strong> Freshman</p>
              <p><strong>Campus:</strong> UC Berkeley</p>
              <p><strong>College/School:</strong> College of Letters and Science</p>
              <p><strong>UC Application ID:</strong> BERK-112233</p>
              <p><strong>Applicant:</strong> ${applicantName()}</p>
              <p><strong>Decision Status:</strong> Available</p>
              <p><strong>Application Submitted:</strong> November 30, 2023</p>
            `
          },
          {
            title: 'UC Application Checklist',
            content: `
              <div class="space-y-2">
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>UC Application (Submitted)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Personal Insight Questions (Submitted)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Self-Reported Academic Record (Verified)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Test Scores (Not Considered - Test-Free)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Application Fee/ Waiver (Processed)</span>
                </div>
              </div>
            `
          },
          {
            title: 'UC Berkeley Colleges & Schools',
            content: `
              <p class="text-sm mb-2">UC Berkeley comprises 14 colleges and schools:</p>
              <ul class="text-sm list-disc pl-5 space-y-1 text-gray-700">
                <li><strong>College of Letters and Science</strong> (largest)</li>
                <li><strong>College of Chemistry</strong></li>
                <li><strong>College of Engineering</strong></li>
                <li><strong>College of Environmental Design</strong></li>
                <li><strong>College of Natural Resources</strong></li>
                <li><strong>Haas School of Business</strong></li>
                <li><strong>Graduate School of Education</strong></li>
                <li><strong>Goldman School of Public Policy</strong></li>
                <li><strong>Graduate School of Journalism</strong></li>
                <li><strong>School of Information</strong></li>
                <li><strong>School of Law</strong> (Boalt Hall)</li>
                <li><strong>School of Optometry</strong></li>
                <li><strong>School of Public Health</strong></li>
                <li><strong>School of Social Welfare</strong></li>
              </ul>
            `
          },
          {
            title: 'Contact Information',
            content: `
              <p><strong>Undergraduate Admissions:</strong> 510-642-3175</p>
              <p><strong>Email:</strong> <a href="mailto:ouars@berkeley.edu" class="text-[#003262] hover:underline">ouars@berkeley.edu</a></p>
              <p><strong>Office Hours:</strong> Monday–Friday, 9:00 AM–4:00 PM PST</p>
              <p class="mt-2 text-sm text-gray-600">Please have your UC Application ID (BERK-112233) ready when contacting our office.</p>
            `
          }
        ]}
      />
    {:else}
      <!-- FINAL DECISION LETTER, FULL PAGE -->
      {#if DECISION === 'admit'}
        <UCBerkeleyAccepted applicantName={applicantName()} />
      {:else}
        <UCBerkeleyDenied applicantName={applicantName()} />
      {/if}
    {/if}
  {/if}
</main>