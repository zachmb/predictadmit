<script lang="ts">
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';

  import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
  import BrownAccepted from '$lib/components/brown/BrownAccepted.svelte';
  import BrownDenied from '$lib/components/brown/BrownDenied.svelte';

  // Set decision type (change to 'deny' for rejection)
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

  const handleViewUpdate = () => {
    hasViewedUpdate = true;
  };
</script>

<svelte:head>
  <title>Brown University Applicant Portal</title>
</svelte:head>

<main class="min-h-screen bg-gray-100 text-gray-900 font-sans">
  {#if !authenticated}
    <!-- Brown Login Screen - Red Theme -->
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden">
        <!-- Header - Red -->
        <div class="bg-[#ED1C24] text-white p-6">
          <div class="flex items-center mb-2">
            <div class="w-10 h-10 bg-white rounded-full mr-3 flex items-center justify-center">
              <span class="text-[#ED1C24] text-xl font-bold">B</span>
            </div>
            <div>
              <h1 class="text-2xl font-bold">Brown University</h1>
              <p class="text-sm opacity-90">Office of College Admission – Applicant Portal</p>
            </div>
          </div>
          <div class="mt-2 text-xs opacity-80 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
            Providence, Rhode Island
          </div>
        </div>

        <!-- Login Form -->
        <div class="p-6">
          <form on:submit={handleLogin} class="space-y-4">
            <div>
              <label for="brown-email" class="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="brown-email"
                type="email"
                bind:value={emailInput}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#ED1C24] focus:border-[#ED1C24]"
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <label for="brown-password" class="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="brown-password"
                type="password"
                bind:value={passwordInput}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#ED1C24] focus:border-[#ED1C24]"
                placeholder="Enter your password"
                required
              />
            </div>

            {#if error}
              <div class="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
                {error}
              </div>
            {/if}

            <div class="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
              <p class="font-medium mb-1">ℹ️ Login Instructions</p>
              <p>Use the same email and password you created on the PredictAdmit main page.</p>
            </div>

            <button
              type="submit"
              class="w-full bg-[#ED1C24] text-white py-2 px-4 rounded-md hover:bg-[#D41920] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED1C24] font-medium transition-colors"
            >
              Sign In
            </button>

            <div class="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
              <p>This is a simulation. No actual Brown University credentials are required.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  {:else}
    {#if !hasViewedUpdate}
      <AdmissionsPortalTemplate
        logoPrimary="Brown"
        logoSecondary="UNIVERSITY"
        schoolName="Brown University"
        primaryColor="#ED1C24"
        applicantName={applicantName()}
        admissionsId="2026-600950269"
        financialAidId="FA-987654"
        bannerText="Thank you for applying to Brown University!"
        noticeText="In preparation for releasing admission decisions on March 26, 2020, the checklist on your Brown portal is no longer available for viewing."
        statusLastPosted="December 12, 2019"
        statusLinkLabel="View Update >>"
        onViewUpdate={handleViewUpdate}
        additionalSections={[
          {
            title: 'Your Information',
            content: `
              <p><strong>Reference:</strong> db-600950269</p>
              <p><strong>Preferred:</strong> John</p>
              <p><strong>First:</strong> John</p>
              <p><strong>Middle:</strong></p>
              <p><strong>Last:</strong> Doe</p>
            `
          },
          {
            title: 'Portal Tools',
            content: `
              <p>Update the email you use to login, or change your portal password. If you need to update the address you listed on your Common Application, please email us.</p>
              <p class="mt-2">To view your Financial Aid application status, please visit <strong>Banner Self-Service</strong>. If you have trouble logging in, please contact the IT Service Center at (401) 853-4357. Office hours can be found here.</p>
            `
          },
          {
            title: 'Upload Materials',
            content: `
              <p class="text-sm mb-2"><strong>Supplementary Materials:</strong> While not expected, applicants to Brown who wish to provide additional materials may do so below. The majority of students admitted to Brown do not submit additional materials; however, the opportunity to do so is available to any candidate.</p>
              <p class="text-sm"><strong>Academic Paper/Research Abstract:</strong> If you have completed an advanced academic paper or significant research project, you may upload that document to your application below. Please include a brief note to provide context for your submission.</p>
            `
          },
          {
            title: 'Test Scores',
            content: `
              <p class="text-sm">You may self-report test scores that were not included on your Common Application. You can view our testing requirements on our website.</p>
            `
          }
        ]}
      />
    {:else}
      {#if DECISION === 'admit'}
        <BrownAccepted applicantName={applicantName()} />
      {:else}
        <BrownDenied applicantName={applicantName()} />
      {/if}
    {/if}
  {/if}
</main>