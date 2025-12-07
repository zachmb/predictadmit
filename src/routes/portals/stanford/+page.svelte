<script lang="ts">
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';

  import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
  import StanfordAccepted from '$lib/components/stanford/StanfordAccepted.svelte';
  import StanfordDenied from '$lib/components/stanford/StanfordDenied.svelte';

  // For demo purposes, you can toggle between 'admit' and 'deny'
  const DECISION: 'admit' | 'deny' = 'admit';

  let profile: UserProfile = { name: '', email: '', password: '' };
  let emailInput = '';
  let passwordInput = '';
  let error = '';
  let authenticated = false;
  let hasViewedUpdate = false;

  $: profile = $userProfile;

  const applicantName = () => profile.name || 'Applicant';
  const applicantEmail = () => profile.email || 'applicant@example.com';

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
  <title>Stanford University Undergraduate Admissions Portal</title>
</svelte:head>

<main class="min-h-screen bg-slate-200 text-slate-900 font-serif">
  {#if !authenticated}
    <!-- Stanford login screen -->
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-white border border-gray-300 shadow-md rounded">
        <!-- Header -->
        <div class="bg-[#8C1515] text-white p-4 rounded-t">
          <div class="text-xl font-bold">Stanford University</div>
          <div class="text-sm">Office of Undergraduate Admissions – Applicant Login</div>
        </div>

        <!-- Login Form -->
        <div class="p-6">
          <form on:submit={handleLogin} class="space-y-4">
            <div>
              <label for="stanford-email" class="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="stanford-email"
                type="email"
                bind:value={emailInput}
                required
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label for="stanford-password" class="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="stanford-password"
                type="password"
                bind:value={passwordInput}
                required
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {#if error}
              <div class="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
                {error}
              </div>
            {/if}

            <div class="text-xs text-gray-600 space-y-2">
              <p>
                <strong>Note:</strong> Use the same credentials you created on the PredictAdmit main page.
                This is a simulation – no real login is required.
              </p>
              {#if !profile.email || !profile.password}
                <p class="text-amber-700">
                  ⚠️ You haven't set up your PredictAdmit profile yet. Please go back to the main page and create your fake login first.
                </p>
              {/if}
            </div>

            <button
              type="submit"
              class="w-full bg-[#8C1515] hover:bg-[#6C0F0F] text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#8C1515] focus:ring-offset-2"
            >
              Log In to Stanford Portal
            </button>
          </form>

          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="text-xs text-gray-500 space-y-2">
              <p>
                <strong>Forgot your password?</strong> This is a simulation. Use the email and password you set on the PredictAdmit home page.
              </p>
              <p>
                <strong>Need help?</strong> Contact the Stanford Admissions Office at 650-723-2091.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else}
    {#if !hasViewedUpdate}
      <AdmissionsPortalTemplate
        logoPrimary="STANFORD"
        logoSecondary="UNIVERSITY"
        schoolName="Stanford University"
        primaryColor="#8C1515"
        accentColor="#0098DB"
        applicantName={applicantName()}
        admissionsId={`SU${new Date().getFullYear().toString().slice(-2)}${Math.floor(10000 + Math.random() * 90000)}`}
        financialAidId={`FAID-${Math.floor(100000 + Math.random() * 900000)}`}
        bannerText="Thank you for applying to Stanford University!"
        noticeText="Application Status for {applicantName()}"
        statusLastPosted="March 27, 2020"
        statusLinkLabel="View Updates >>"
        onViewUpdate={handleViewUpdate}
        showAccountPanel={true}
        accountEmail={applicantEmail()}
      />
    {:else}
      {#if DECISION === 'admit'}
        <StanfordAccepted applicantName={applicantName()} />
      {:else}
        <StanfordDenied applicantName={applicantName()} />
      {/if}
    {/if}
  {/if}
</main>
