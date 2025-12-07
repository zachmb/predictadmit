<script lang="ts">
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';

  import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
  import NorthwesternAccepted from '$lib/components/northwestern/NorthwesternAccepted.svelte';
  import NorthwesternDenied from '$lib/components/northwestern/NorthwesternDenied.svelte';

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
  <title>Northwestern University Undergraduate Admissions Portal</title>
</svelte:head>

<main class="min-h-screen bg-slate-200 text-slate-900 font-serif">
  {#if !authenticated}
    <!-- FULL-SCREEN NORTHWESTERN LOGIN (early 2000s vibe) -->
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="w-full max-w-md bg-white border border-slate-500 shadow-md">
        <!-- Header - Northwestern Purple (#4E2A84) -->
        <div class="bg-[#4E2A84] text-white border-b border-slate-700 px-4 py-3">
          <h1 class="text-lg font-bold tracking-tight">
            Northwestern University
          </h1>
          <p class="text-[11px] text-purple-100">
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
              for="northwestern-email"
            >
              Email Address:
            </label>
            <input
              id="northwestern-email"
              type="email"
              class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-[#4E2A84]"
              bind:value={emailInput}
              autocomplete="email"
            />
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-slate-800 mb-1"
              for="northwestern-password"
            >
              Password:
            </label>
            <input
              id="northwestern-password"
              type="password"
              class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-[#4E2A84]"
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
            class="mt-2 inline-block bg-[#4E2A84] text-white text-sm font-semibold px-4 py-2 border border-[#3D216B] shadow hover:bg-[#3D216B] focus:outline-none focus:ring-1 focus:ring-[#4E2A84]"
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
        logoPrimary="Northwestern"
        logoSecondary="ADMISSIONS"
        schoolName="Northwestern University"
        primaryColor="#4E2A84"
        applicantName={applicantName()}
        admissionsId="2026-NU-556677"
        financialAidId="FA-889900"
        bannerText="Thank you for applying to Northwestern University!"
        noticeText="Admission decisions for Regular Decision applicants will be available Friday, March 22, 2024 at 5:00 PM Central Time."
        statusLastPosted="February 18, 2024"
        statusLinkLabel="View Decision >>"
        onViewUpdate={handleViewUpdate}
        additionalSections={[
          {
            title: 'Application Information',
            content: `
              <p><strong>Application Type:</strong> Regular Decision</p>
              <p><strong>Proposed School:</strong> Weinberg College of Arts and Sciences</p>
              <p><strong>Application ID:</strong> NU-556677</p>
              <p><strong>Applicant:</strong> ${applicantName()}</p>
              <p><strong>Decision Status:</strong> Available</p>
              <p><strong>Application Complete:</strong> January 3, 2024</p>
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
                  <span>Northwestern Writing Supplement (Submitted)</span>
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
            title: 'Financial Aid Status',
            content: `
              <p>Your financial aid application is complete and under review. Financial aid decisions 
              will be released concurrently with admission decisions.</p>
              <p class="mt-2 text-sm text-gray-600">For questions about financial aid, please contact the 
              Office of Undergraduate Financial Aid at 847-491-7400 or 
              <a href="mailto:ug-finaid@northwestern.edu" class="text-[#4E2A84] hover:underline">ug-finaid@northwestern.edu</a>.</p>
            `
          },
          {
            title: 'Northwestern Undergraduate Schools',
            content: `
              <p class="text-sm mb-2">Northwestern University comprises six undergraduate schools:</p>
              <ul class="text-sm list-disc pl-5 space-y-1 text-gray-700">
                <li><strong>Weinberg College of Arts and Sciences</strong></li>
                <li><strong>McCormick School of Engineering</strong></li>
                <li><strong>School of Communication</strong></li>
                <li><strong>School of Education and Social Policy</strong></li>
                <li><strong>Medill School of Journalism</strong></li>
                <li><strong>Bienen School of Music</strong></li>
              </ul>
              <p class="mt-2 text-xs text-gray-600">Northwestern's quarter system allows students to explore multiple academic interests.</p>
            `
          },
          {
            title: 'Important Dates',
            content: `
              <ul class="text-sm space-y-1 text-gray-700">
                <li><strong>Regular Decision Deadline:</strong> January 3, 2024</li>
                <li><strong>Decision Release:</strong> March 22, 2024 (5:00 PM CT)</li>
                <li><strong>Wildcat Days (Admitted Students):</strong> April 12-14, 2024</li>
                <li><strong>Reply Deadline:</strong> May 1, 2024</li>
              </ul>
            `
          },
          {
            title: 'Contact Information',
            content: `
              <p><strong>Undergraduate Admission:</strong> 847-491-7271</p>
              <p><strong>Email:</strong> <a href="mailto:ug-admission@northwestern.edu" class="text-[#4E2A84] hover:underline">ug-admission@northwestern.edu</a></p>
              <p><strong>Office Hours:</strong> Monday–Friday, 8:30 AM–5:00 PM CST</p>
              <p class="mt-2 text-sm text-gray-600">Please have your Application ID (NU-556677) ready when contacting our office.</p>
            `
          }
        ]}
      />
    {:else}
      <!-- FINAL DECISION LETTER, FULL PAGE -->
      {#if DECISION === 'admit'}
        <NorthwesternAccepted applicantName={applicantName()} />
      {:else}
        <NorthwesternDenied applicantName={applicantName()} />
      {/if}
    {/if}
  {/if}
</main>