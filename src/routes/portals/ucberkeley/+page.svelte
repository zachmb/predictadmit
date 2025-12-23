<script lang="ts">
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';

  import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
  import BerkeleyAccepted from '$lib/components/berkeley/BerkeleyAccepted.svelte';
  import BerkeleyDenied from '$lib/components/berkeley/BerkeleyDenied.svelte';

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
    requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });
  };
</script>

<svelte:head>
  <title>UC Berkeley Undergraduate Admissions</title>
</svelte:head>

<main class="min-h-screen bg-slate-100 text-slate-900 font-sans">
  {#if !authenticated}
    <!-- UC Berkeley login screen -->
    <div class="min-h-screen bg-slate-100">
      <!-- Top blue bar -->
      <div class="bg-[#003262] text-white py-3 px-6">
        <div class="flex items-center justify-between max-w-7xl mx-auto">
          <div class="text-sm font-semibold">UC Berkeley</div>
          <div class="flex gap-6 text-xs">
            <a href="/" class="hover:underline">MAP@Berkeley</a>
            <a href="/" class="hover:underline">Sign up for our email list</a>
            <a href="/" class="hover:underline">Contact Us</a>
          </div>
        </div>
      </div>

      <!-- Header -->
      <div class="bg-white border-b border-slate-300">
        <div class="max-w-7xl mx-auto py-8 px-6">
          <h1 class="text-4xl text-slate-700 font-serif mb-2">
            <span class="font-light">Berkeley</span> Office of Undergraduate Admissions
          </h1>
          <nav class="flex gap-8 text-sm text-slate-600 mt-6">
            <a href="/" class="hover:underline">Apply to Berkeley</a>
            <a href="/" class="hover:underline">Academics</a>
            <a href="/" class="hover:underline">Cost</a>
            <a href="/" class="hover:underline">Discover Berkeley</a>
            <a href="/" class="hover:underline">Visit</a>
            <a href="/" class="hover:underline">Berkeley En Español</a>
          </nav>
        </div>
      </div>

      <!-- Login form -->
      <div class="max-w-2xl mx-auto px-6 py-12">
        <h2 class="text-3xl font-serif text-slate-700 mb-8">Login</h2>

        <div class="bg-[#F5F8E8] border-l-4 border-[#8B9E3C] px-6 py-4 mb-6">
          <p class="text-sm text-slate-700">
            To log in, please enter your email address and password.
          </p>
        </div>

        <form on:submit={handleLogin} class="space-y-6">
          <div>
            <label for="berkeley-email" class="block text-sm text-slate-700 mb-2">
              Email Account
            </label>
            <input
              type="email"
              id="berkeley-email"
              bind:value={emailInput}
              required
              class="w-full px-3 py-2 border border-slate-300 bg-white text-sm focus:outline-none focus:border-[#003262]"
              placeholder="cal@berkeley.edu"
            />
          </div>

          <div>
            <label for="berkeley-password" class="block text-sm text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="berkeley-password"
              bind:value={passwordInput}
              required
              class="w-full px-3 py-2 border border-slate-300 bg-white text-sm focus:outline-none focus:border-[#003262]"
            />
            <a href="/" class="text-xs text-[#003262] hover:underline mt-1 inline-block">
              Forgot Your Password?
            </a>
          </div>

          {#if error}
            <div class="bg-red-50 border border-red-300 text-red-800 px-4 py-3 text-sm">
              {error}
            </div>
          {/if}

          <div class="text-sm text-slate-600 bg-slate-50 border border-slate-200 px-4 py-3">
            <strong>Note:</strong> Use the same email and password you created on the PredictAdmit main page.
          </div>

          <button
            type="submit"
            class="bg-slate-300 hover:bg-slate-400 text-slate-800 text-sm font-semibold px-6 py-2 border border-slate-400"
          >
            Login
          </button>
        </form>

        <div class="mt-8 pt-8 border-t border-slate-300 text-sm text-slate-600">
          <p>
            Questions about your application? Visit the Application FAQs or the University of California Admissions website.
          </p>
        </div>
      </div>
    </div>
  {:else}
    {#if !hasViewedUpdate}
      <!-- UC Berkeley Portal Status Page -->
      <div class="min-h-screen bg-slate-100">
        <!-- Top blue bar -->
        <div class="bg-[#003262] text-white py-3 px-6">
          <div class="flex items-center justify-between max-w-7xl mx-auto">
            <div class="text-sm font-semibold">UC Berkeley</div>
            <div class="flex gap-6 text-xs">
              <a href="/" class="hover:underline">MAP@Berkeley</a>
              <a href="/" class="hover:underline">Sign up for our email list</a>
              <a href="/" class="hover:underline">Contact Us</a>
              <input type="text" placeholder="Search" class="px-3 py-1 text-slate-900 text-xs w-48" />
            </div>
          </div>
        </div>

        <!-- Header -->
        <div class="bg-white border-b border-slate-300">
          <div class="max-w-7xl mx-auto py-6 px-6">
            <h1 class="text-3xl text-slate-700 font-serif mb-1">
              <span class="font-light">Berkeley</span> Office of Undergraduate Admissions
            </h1>
            <nav class="flex gap-8 text-sm text-slate-600 mt-4">
              <a href="/" class="hover:underline">Apply to Berkeley</a>
              <a href="/" class="hover:underline">Academics</a>
              <span class="text-slate-400">...</span>
              <a href="/" class="hover:underline">Berkeley En Español</a>
            </nav>
          </div>
        </div>

        <!-- Main content area -->
        <div class="max-w-7xl mx-auto px-6 py-8">
          <div class="flex gap-6">
            <!-- Left side content -->
            <div class="flex-1">
              <!-- Top right button -->
              <div class="flex justify-end mb-6">
                <button class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-2">
                  {applicantName()}
                </button>
              </div>

              <!-- Hero banner with golden gate bridge -->
              <div class="bg-gradient-to-r from-[#FDB515] to-[#FFD966] text-[#003262] p-8 mb-6 relative overflow-hidden" style="min-height: 200px;">
                <div class="relative z-10">
                  <p class="text-xs mb-2">MAP@Berkeley</p>
                  <h2 class="text-3xl font-serif mb-4">MY APPLICATION</h2>
                  <p class="text-sm max-w-md">
                    If you need to complete any outstanding items for your application, you can do so here.
                  </p>
                </div>
                <!-- Decorative bridge illustration would go here -->
              </div>

              <!-- Status Update Section -->
              <div class="bg-[#FDB515] text-[#003262] p-12 mb-6 flex items-center gap-8">
                <div class="text-white text-8xl"></div>
                <div>
                  <h3 class="text-3xl font-serif font-bold mb-2">STATUS UPDATE</h3>
                </div>
              </div>

              <!-- Yellow notice box -->
              <div class="bg-[#FFF9E6] border-l-4 border-[#FDB515] p-6 mb-6">
                <p class="text-sm text-slate-700 mb-4">
                  <strong>&gt;Your status update below:</strong>
                </p>
                <p class="text-sm text-slate-700 mb-4">
                  <strong>Questions?</strong> Click here for Applications FAQs.
                </p>
              </div>

              <!-- Status Update header -->
              <div class="bg-[#FDB515] text-[#003262] px-6 py-3 mb-0">
                <h4 class="font-bold text-lg">Status Update</h4>
              </div>

              <!-- Status content -->
              <div class="bg-[#FFFEF5] border border-[#FDB515] border-t-0 p-6 mb-6">
                <p class="text-sm text-slate-700 mb-6">
                  New updates to your application were posted March 27, 2025.
                </p>

                <button
                  on:click={handleViewUpdate}
                  class="bg-[#003262] hover:bg-[#004080] text-white text-sm font-semibold px-6 py-2"
                >
                  Decisions and Important Updates &gt;&gt;
                </button>
              </div>

              <!-- Application Checklist header -->
              <div class="bg-[#FDB515] text-[#003262] px-6 py-3 mb-0">
                <h4 class="font-bold text-lg">Application Checklist</h4>
              </div>

              <!-- Checklist content -->
              <div class="bg-white border border-[#FDB515] border-t-0 p-6">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-slate-300">
                      <th class="text-left py-2 font-semibold text-slate-700">Status</th>
                      <th class="text-left py-2 font-semibold text-slate-700">Details</th>
                      <th class="text-right py-2 font-semibold text-slate-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-slate-200">
                      <td class="py-3">
                        <span class="text-green-600">✓</span> Received
                      </td>
                      <td class="py-3">Application</td>
                      <td class="py-3 text-right text-slate-600">11/25/2024</td>
                    </tr>
                    <tr>
                      <td class="py-3">
                        <span class="text-green-600">✓</span> Received
                      </td>
                      <td class="py-3">
                        <a href="/" class="text-blue-600 hover:underline">M.E.T. Video Essay</a>
                      </td>
                      <td class="py-3 text-right text-slate-600">01/02/2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Right sidebar -->
            <div class="w-80">
              <div class="bg-[#4A90A4] text-white px-6 py-3 mb-0">
                <h4 class="font-bold">Helpful Links</h4>
              </div>
              <div class="bg-[#E8F4F8] border border-[#4A90A4] border-t-0 p-6">
                <ul class="space-y-3 text-sm text-[#003262]">
                  <li><a href="/" class="hover:underline">Admission Home Page</a></li>
                  <li><a href="/" class="hover:underline">Application FAQs</a></li>
                  <li><a href="/" class="hover:underline">Campus Resources</a></li>
                  <li><a href="/" class="hover:underline">Explore Housing Options</a></li>
                </ul>
              </div>

              <div class="bg-[#4A90A4] text-white px-6 py-3 mt-6 mb-0">
                <h4 class="font-bold">Financial Aid & Scholarships</h4>
              </div>
              <div class="bg-[#E8F4F8] border border-[#4A90A4] border-t-0 p-6 text-sm text-slate-700">
                <p>Information about financial aid and scholarships will be available after admission decisions are released.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    {:else}
      {#if DECISION === 'admit'}
        <BerkeleyAccepted applicantName={applicantName()} />
      {:else}
        <BerkeleyDenied applicantName={applicantName()} />
      {/if}
    {/if}
  {/if}
</main>