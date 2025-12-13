<script lang="ts">
  import { tick } from 'svelte';
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';
  import RiceImage from '$lib/assets/ricecampus-beautifulsunset2022-2560x1728.jpeg';
  import RiceAccepted from '$lib/components/rice/RiceAccepted.svelte';
  import RiceDenied from '$lib/components/rice/RiceDenied.svelte';

  const DECISION: 'admit' | 'deny' = 'admit';

  let profile: UserProfile = { name: '', email: '', password: '' };
  let emailInput = '';
  let passwordInput = '';
  let error = '';
  let authenticated = false;
  let hasViewedUpdate = false;
  let scrollY = 0;

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
  <title>Rice University - Admission Portal</title>
</svelte:head>

<svelte:window bind:scrollY />

{#if !authenticated}
  <!-- Rice login screen -->
  <div class="min-h-screen bg-slate-100">
    <header class="bg-white border-b border-slate-300">
      <div class="max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
        <div class="flex items-baseline gap-3">
          <span class="text-3xl font-serif text-[#003366]">
            Rice
          </span>
          <span class="text-[11px] tracking-[0.18em] uppercase text-slate-700">
            Office of Admission
          </span>
        </div>
        <div class="text-[11px] text-slate-700">
          {applicantName()}
        </div>
      </div>
      <div class="h-8 bg-[#003366]"></div>
    </header>

    <section class="bg-white">
      <div class="max-w-5xl mx-auto px-10 py-10">
        <h1 class="text-3xl font-normal mb-6">
          Login
        </h1>

        <div class="border border-lime-700 bg-lime-100 px-4 py-3 mb-8 text-[12px] text-slate-900">
          To log in, please enter your email address and password.
        </div>

        <form class="space-y-4 text-sm" on:submit={handleLogin}>
          {#if error}
            <p
              class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2"
              role="alert"
            >
              {error}
            </p>
          {/if}

          <div class="flex items-center gap-4">
            <label
              for="rice-email"
              class="w-32 text-[12px] font-semibold text-slate-900 text-right"
            >
              Email Address
            </label>
            <input
              id="rice-email"
              type="email"
              class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80"
              bind:value={emailInput}
              autocomplete="email"
              required
            />
          </div>

          <div class="flex items-center gap-4">
            <label
              for="rice-password"
              class="w-32 text-[12px] font-semibold text-slate-900 text-right"
            >
              Password
            </label>
            <input
              id="rice-password"
              type="password"
              class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80"
              bind:value={passwordInput}
              autocomplete="current-password"
              required
            />
            <a
              href="/portals/rice"
              class="text-[12px] text-blue-800 underline hover:no-underline"
            >
              Forgot Your Password?
            </a>
          </div>

          <div class="flex items-center gap-4 pt-4">
            <div class="w-32"></div>
            <div class="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                class="border border-slate-500 bg-slate-300 px-4 py-1 text-[12px] font-semibold hover:bg-slate-400 active:bg-slate-500"
              >
                Login
              </button>
            </div>
          </div>

          <p class="pt-4 text-[10px] leading-relaxed text-slate-600 max-w-xl">
            For this simulation, use the same email address and password that you saved on the
            PredictAdmit.com home page. No real application data is used, and all information is
            stored only in your browser.
          </p>
        </form>
      </div>
    </section>

    <footer class="mt-8">
      <div class="h-10 flex items-center bg-[#003366]">
        <div class="max-w-5xl mx-auto px-6 w-full flex items-center justify-between text-[11px] text-white">
          <span>&copy; rice.edu 2021</span>
          <span class="opacity-80">
            PredictAdmit.com simulation · Not affiliated with Rice University
          </span>
        </div>
      </div>
    </footer>
  </div>
{:else}
  {#if !hasViewedUpdate}
    <!-- Top navigation bar -->
    <nav class="bg-white border-b border-slate-300 py-3 px-6 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-8">
          <h1 class="text-xl font-bold text-[#003366]">rice</h1>
          <div class="flex gap-6 text-[11px] text-slate-600">
            <a href="/portals/rice" class="hover:text-[#003366]">MY APPLICATION</a>
            <a href="/portals/rice" class="hover:text-[#003366]">MY FINANCIAL AID</a>
            <a href="/portals/rice" class="hover:text-[#003366]">MY TEST SCORES</a>
            <a href="/portals/rice" class="hover:text-[#003366]">MY INTERVIEW</a>
            <a href="/portals/rice" class="hover:text-[#003366]">MY ACCOUNT</a>
            <a href="/portals/rice" class="hover:text-[#003366]">CONTACT</a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Rice portal status page -->
    
    <div class="min-h-screen bg-slate-50">
      <!-- Header Text -->
      <div class="bg-white py-12 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="text-left">
            <div class="text-3xl font-serif text-[#003366] mb-1">Rice University</div>
            <div class="text-sm text-slate-700">Office of Admission</div>
          </div>
        </div>
      </div>
      <!-- Hero Image with Fade Effect -->
      <div class="relative h-[60vh] overflow-hidden">
        <img 
          src={RiceImage}
          alt="Rice University Campus" 
          class="w-full h-full object-cover"
        />
        <div 
          class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-50"
        ></div>
         
      </div>
      <!-- Main content -->
      <main class="max-w-6xl mx-auto px-6 py-8 -mt-32 relative z-10">
        <!-- Welcome section -->
        <div class="bg-white border border-slate-300 shadow-sm p-8 mb-6">
          <h2 class="text-3xl font-light text-[#4A90E2] mb-4">WELCOME, {applicantName().toUpperCase()}!</h2>
          <p class="text-[13px] text-slate-700 leading-relaxed mb-4">
            Use your <strong>Rice Admission Student Portal</strong> to track your admission and financial aid progress, submit required materials, request an 
            optional admission interview, and more.
          </p>
        </div>

        <!-- Two column layout -->
        <div class="grid grid-cols-3 gap-6">
          <!-- Main content column -->
          <div class="col-span-2 space-y-6">
            <!-- Status Update section -->
            <div class="bg-yellow-50 border border-yellow-200 p-6">
              <h3 class="text-xl font-light text-[#4A90E2] mb-3">STATUS UPDATE</h3>
              <p class="text-[13px] text-slate-700 mb-4">
                New updates to your application were posted March 30, 2021.
              </p>
              <button
                on:click={handleViewUpdate}
                class="text-[13px] font-semibold text-[#4A90E2] hover:text-[#003366] underline"
              >
                View Update &gt;&gt;
              </button>
            </div>

            <!-- Application Checklist -->
            <div class="bg-white border border-slate-300 shadow-sm p-6">
              <h3 class="text-xl font-light text-[#4A90E2] mb-4">APPLICATION CHECKLIST</h3>
              <table class="w-full text-[12px]">
                <thead>
                  <tr class="bg-slate-100 border-b border-slate-300">
                    <th class="px-3 py-2 text-left font-semibold text-slate-700">STATUS</th>
                    <th class="px-3 py-2 text-left font-semibold text-slate-700">DETAILS</th>
                    <th class="px-3 py-2 text-left font-semibold text-slate-700">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-slate-200">
                    <td class="px-3 py-3 text-green-700">✓ Waived</td>
                    <td class="px-3 py-3 text-slate-700">Application Fee</td>
                    <td class="px-3 py-3 text-slate-600">11/22/2020</td>
                  </tr>
                  <tr class="border-b border-slate-200">
                    <td class="px-3 py-3 text-green-700">✓ Received</td>
                    <td class="px-3 py-3 text-slate-700">Common Application</td>
                    <td class="px-3 py-3 text-slate-600">11/22/2020</td>
                  </tr>
                  <tr class="border-b border-slate-200">
                    <td class="px-3 py-3 text-green-700">✓ Received</td>
                    <td class="px-3 py-3 text-slate-700">Rice Supplement</td>
                    <td class="px-3 py-3 text-slate-600">11/22/2020</td>
                  </tr>
                  <tr class="border-b border-slate-200">
                    <td class="px-3 py-3 text-green-700">✓ Received</td>
                    <td class="px-3 py-3 text-slate-700">Counselor Recommendation</td>
                    <td class="px-3 py-3 text-slate-600">11/23/2020</td>
                  </tr>
                  <tr class="border-b border-slate-200">
                    <td class="px-3 py-3 text-green-700">✓ Received</td>
                    <td class="px-3 py-3 text-slate-700">Teacher Recommendation 1</td>
                    <td class="px-3 py-3 text-slate-600">11/23/2020</td>
                  </tr>
                  <tr>
                    <td class="px-3 py-3 text-green-700">✓ Received</td>
                    <td class="px-3 py-3 text-slate-700">Teacher Recommendation 2</td>
                    <td class="px-3 py-3 text-slate-600">11/24/2020</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Financial Aid -->
            <div class="bg-white border border-slate-300 shadow-sm p-6">
              <h3 class="text-xl font-light text-[#4A90E2] mb-3">FINANCIAL AID</h3>
              <p class="text-[13px] text-slate-700 mb-4 leading-relaxed">
                Rice's Office of Financial Aid is committed to making a Rice education affordable for all admitted students. 
                Track your financial aid application status and view your award letter when available.
              </p>
              <button class="border border-slate-400 bg-slate-200 px-4 py-2 text-[12px] font-semibold hover:bg-slate-300">
                View Financial Aid Status
              </button>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Admission Counselor -->
            <div class="bg-white border border-slate-300 shadow-sm p-5">
              <h4 class="text-sm font-bold text-[#003366] mb-3">YOUR ADMISSION COUNSELOR</h4>
              <div class="mb-3">
                <div class="w-20 h-20 bg-slate-300 mb-2"></div>
                <p class="text-[12px] font-semibold text-slate-800">Shana Castillo</p>
                <p class="text-[11px] text-slate-600">Assistant Director</p>
              </div>
              <p class="text-[11px] text-slate-700 leading-relaxed mb-3">
                Shana is your personal admission counselor and is here to help answer any questions about your application.
              </p>
              <a href="/portals/rice" class="text-[11px] text-[#4A90E2] hover:text-[#003366] underline">
                Contact Shana
              </a>
            </div>

            <!-- Important Dates -->
            <div class="bg-white border border-slate-300 shadow-sm p-5">
              <h4 class="text-sm font-bold text-[#003366] mb-3">IMPORTANT DATES</h4>
              <ul class="space-y-2 text-[11px] text-slate-700">
                <li><strong>March 30:</strong> Decision Release</li>
                <li><strong>April 15:</strong> Admitted Student Visit Day</li>
                <li><strong>May 1:</strong> Enrollment Deposit Due</li>
                <li><strong>June 1:</strong> Housing Application Opens</li>
              </ul>
            </div>

            <!-- Resources -->
            <div class="bg-white border border-slate-300 shadow-sm p-5">
              <h4 class="text-sm font-bold text-[#003366] mb-3">RESOURCES</h4>
              <ul class="space-y-2 text-[11px]">
                <li><a href="/portals/rice" class="text-[#4A90E2] hover:text-[#003366] underline">Virtual Campus Tour</a></li>
                <li><a href="/portals/rice" class="text-[#4A90E2] hover:text-[#003366] underline">Financial Aid Calculator</a></li>
                <li><a href="/portals/rice" class="text-[#4A90E2] hover:text-[#003366] underline">Student Life at Rice</a></li>
                <li><a href="/portals/rice" class="text-[#4A90E2] hover:text-[#003366] underline">Admitted Student FAQ</a></li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-[#003366] text-white mt-12">
        <div class="max-w-6xl mx-auto px-6 py-6">
          <div class="flex items-center justify-between text-[10px]">
            <span>© 2021 Rice University</span>
            <span class="opacity-70">PredictAdmit.com simulation · Not affiliated with Rice University</span>
          </div>
        </div>
      </footer>
    </div>
  {:else}
    {#if DECISION === 'admit'}
      <RiceAccepted applicantName={applicantName()} />
    {:else}
      <RiceDenied applicantName={applicantName()} />
    {/if}
  {/if}
{/if}