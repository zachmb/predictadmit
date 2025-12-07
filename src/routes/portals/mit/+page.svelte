<script lang="ts">
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';

  import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
  import MITAccepted from '$lib/components/mit/MITAccepted.svelte';
  import MITDenied from '$lib/components/mit/MITDenied.svelte';

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
  <title>MIT Undergraduate Admissions Portal</title>
</svelte:head>

<main class="min-h-screen bg-slate-200 text-slate-900 font-serif">
  {#if !authenticated}
    <!-- FULL-SCREEN MIT LOGIN (early 2000s vibe) -->
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="w-full max-w-md bg-white border border-slate-500 shadow-md">
        <!-- Header - MIT Red (#A31F34) -->
        <div class="bg-[#A31F34] text-white border-b border-slate-700 px-4 py-3">
          <h1 class="text-lg font-bold tracking-tight">
            Massachusetts Institute of Technology
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
              for="mit-email"
            >
              Email Address:
            </label>
            <input
              id="mit-email"
              type="email"
              class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-[#A31F34]"
              bind:value={emailInput}
              autocomplete="email"
            />
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-slate-800 mb-1"
              for="mit-password"
            >
              Password:
            </label>
            <input
              id="mit-password"
              type="password"
              class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-[#A31F34]"
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
            class="mt-2 inline-block bg-[#A31F34] text-white text-sm font-semibold px-4 py-2 border border-[#8A1A2C] shadow hover:bg-[#8A1A2C] focus:outline-none focus:ring-1 focus:ring-[#A31F34]"
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
        logoPrimary="MIT"
        logoSecondary="ADMISSIONS"
        schoolName="Massachusetts Institute of Technology"
        primaryColor="#A31F34"
        applicantName={applicantName()}
        admissionsId="2026-MIT-334455"
        financialAidId="FA-778899"
        bannerText="Thank you for applying to the Massachusetts Institute of Technology!"
        noticeText="Admission decisions for Regular Action applicants will be available Saturday, March 16, 2024 at 6:28 PM Eastern Time (Pi Time)."
        statusLastPosted="February 20, 2024"
        statusLinkLabel="View Decision >>"
        onViewUpdate={handleViewUpdate}
        additionalSections={[
          {
            title: 'Application Information',
            content: `
              <p><strong>Application Type:</strong> Regular Action</p>
              <p><strong>Application ID:</strong> MIT-334455</p>
              <p><strong>Applicant:</strong> ${applicantName()}</p>
              <p><strong>Decision Status:</strong> Available</p>
              <p><strong>Application Complete:</strong> January 5, 2024</p>
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
                  <span>MIT Application (Submitted)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Essays and Short Answers (Submitted)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Self-Reported Coursework (Submitted)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Secondary School Report (Received)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>Teacher Evaluations (2 Received)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>February Updates & Notes (Received)</span>
                </div>
              </div>
            `
          },
          {
            title: 'Financial Aid Status',
            content: `
              <p>Your financial aid application is complete and under review. Financial aid decisions 
              will be released concurrently with admission decisions.</p>
              <p class="mt-2 text-sm text-gray-600">MIT is committed to meeting 100% of demonstrated financial need for all admitted students. 
              For questions, contact Student Financial Services at 617-253-4971 or 
              <a href="mailto:sfs@mit.edu" class="text-[#A31F34] hover:underline">sfs@mit.edu</a>.</p>
            `
          },
          {
            title: 'Important Dates',
            content: `
              <ul class="text-sm space-y-1 text-gray-700">
                <li><strong>Regular Action Deadline:</strong> January 5, 2024</li>
                <li><strong>Decision Release:</strong> March 16, 2024 (6:28 PM ET)</li>
                <li><strong>Campus Preview Weekend (CPW):</strong> April 11-14, 2024</li>
                <li><strong>Reply Deadline:</strong> May 1, 2024</li>
              </ul>
              <p class="mt-2 text-xs text-gray-600">MIT releases decisions at "Pi Time" (3/14 at 1:59 PM) for Early Action and 6:28 PM for Regular Action, referencing the mathematical constant π.</p>
            `
          },
          {
            title: 'Contact Information',
            content: `
              <p><strong>Undergraduate Admissions:</strong> 617-253-3400</p>
              <p><strong>Email:</strong> <a href="mailto:admissions@mit.edu" class="text-[#A31F34] hover:underline">admissions@mit.edu</a></p>
              <p><strong>Office Hours:</strong> Monday–Friday, 9:00 AM–5:00 PM EST</p>
              <p class="mt-2 text-sm text-gray-600">Please have your Application ID (MIT-334455) ready when contacting our office.</p>
            `
          }
        ]}
      />
    {:else}
      <!-- FINAL DECISION LETTER, FULL PAGE -->
      {#if DECISION === 'admit'}
        <MITAccepted applicantName={applicantName()} />
      {:else}
        <MITDenied applicantName={applicantName()} />
      {/if}
    {/if}
  {/if}
</main>