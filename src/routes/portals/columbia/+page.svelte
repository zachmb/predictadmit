<script lang="ts">
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';

  import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
  import ColumbiaAccepted from '$lib/components/columbia/ColumbiaAccepted.svelte';
  import ColumbiaDenied from '$lib/components/columbia/ColumbiaDenied.svelte';

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
  <title>Columbia University Undergraduate Admissions Portal</title>
</svelte:head>

<main class="min-h-screen bg-slate-200 text-slate-900 font-serif">
  {#if !authenticated}
    <!-- FULL-SCREEN COLUMBIA LOGIN (early 2000s vibe) -->
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="w-full max-w-md bg-white border border-slate-500 shadow-md">
        <!-- Header - Columbia Blue (#6CACE4) -->
        <div class="bg-[#6CACE4] text-white border-b border-slate-700 px-4 py-3">
          <h1 class="text-lg font-bold tracking-tight">
            Columbia University
          </h1>
          <p class="text-[11px] text-blue-100">
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
              for="columbia-email"
            >
              Email Address:
            </label>
            <input
              id="columbia-email"
              type="email"
              class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-[#6CACE4]"
              bind:value={emailInput}
              autocomplete="email"
            />
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-slate-800 mb-1"
              for="columbia-password"
            >
              Password:
            </label>
            <input
              id="columbia-password"
              type="password"
              class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-[#6CACE4]"
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
            class="mt-2 inline-block bg-[#6CACE4] text-white text-sm font-semibold px-4 py-2 border border-[#5A9BD4] shadow hover:bg-[#5A9BD4] focus:outline-none focus:ring-1 focus:ring-[#6CACE4]"
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
        logoPrimary="Columbia"
        logoSecondary="UNIVERSITY"
        schoolName="Columbia University"
        primaryColor="#6CACE4"
        applicantName={applicantName()}
        admissionsId="2026-CC-789012"
        financialAidId="FA-345678"
        bannerText="Thank you for applying to Columbia University!"
        noticeText="Admission decisions for Regular Decision candidates will be available Thursday, March 28, 2024 at 7:00 PM Eastern Time."
        statusLastPosted="February 15, 2024"
        statusLinkLabel="View Decision >>"
        onViewUpdate={handleViewUpdate}
        additionalSections={[
          {
            title: 'Application Summary',
            content: `
              <p><strong>Application Type:</strong> Regular Decision</p>
              <p><strong>School Applying To:</strong> Columbia College</p>
              <p><strong>Application ID:</strong> CC-789012</p>
              <p><strong>Applicant:</strong> ${applicantName()}</p>
              <p><strong>Status:</strong> Decision Available</p>
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
                  <span>Columbia Supplement (Submitted)</span>
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
            title: 'Financial Aid Status',
            content: `
              <p>Your financial aid application is under review. Decisions will be released concurrently 
              with admission decisions on March 28, 2024.</p>
              <p class="mt-2 text-sm text-gray-600">For questions about financial aid, please contact the 
              Office of Financial Aid and Educational Financing at 212-854-3711 or 
              <a href="mailto:ugrad-finaid@columbia.edu" class="text-[#6CACE4] hover:underline">ugrad-finaid@columbia.edu</a>.</p>
            `
          },
          {
            title: 'Core Curriculum',
            content: `
              <p class="text-sm mb-2">Columbia's Core Curriculum provides all undergraduates with a common foundation in:</p>
              <ul class="text-sm list-disc pl-5 space-y-1 text-gray-700">
                <li>Literature Humanities (Lit Hum)</li>
                <li>Contemporary Civilization (CC)</li>
                <li>University Writing</li>
                <li>Frontiers of Science</li>
                <li>Art Humanities and Music Humanities</li>
                <li>Global Core requirement</li>
                <li>Science requirement</li>
                <li>Foreign Language requirement</li>
              </ul>
            `
          },
          {
            title: 'Contact Information',
            content: `
              <p><strong>Undergraduate Admissions:</strong> 212-854-2522</p>
              <p><strong>Email:</strong> <a href="mailto:ugrad-ask@columbia.edu" class="text-[#6CACE4] hover:underline">ugrad-ask@columbia.edu</a></p>
              <p><strong>Office Hours:</strong> Monday–Friday, 9:00 AM–5:00 PM EST</p>
              <p class="mt-2 text-sm text-gray-600">Please have your Application ID (CC-789012) ready when contacting our office.</p>
            `
          }
        ]}
      />
    {:else}
      <!-- FINAL DECISION LETTER, FULL PAGE -->
      {#if DECISION === 'admit'}
        <ColumbiaAccepted applicantName={applicantName()} />
      {:else}
        <ColumbiaDenied applicantName={applicantName()} />
      {/if}
    {/if}
  {/if}
</main>