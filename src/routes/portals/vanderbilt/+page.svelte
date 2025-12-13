<script lang="ts">
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';

  import VanderbiltAccepted from '$lib/components/vanderbilt/VanderbiltAccepted.svelte';
  import VanderbiltDenied from '$lib/components/vanderbilt/VanderbiltDenied.svelte';

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

  const loadSavedLogin = () => {
    emailInput = profile.email;
    passwordInput = profile.password;
  };
</script>

<svelte:head>
  <title>Vanderbilt University - Office of Admission</title>
</svelte:head>

{#if !authenticated}
    <!-- Vanderbilt login screen -->
    <div class="min-h-screen bg-slate-100">
      <header class="bg-white border-b border-slate-300">
        <div class="max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
          <div class="flex items-baseline gap-3">
            <span class="text-3xl font-serif text-[#866D4B]">
              Vanderbilt
            </span>
            <span class="text-[11px] tracking-[0.18em] uppercase text-slate-700">
              Office of Admission
            </span>
          </div>
          <div class="text-[11px] text-slate-700">
            {applicantName()}
          </div>
        </div>
        <div class="h-8 bg-[#866D4B]"></div>
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
                for="vandy-email"
                class="w-32 text-[12px] font-semibold text-slate-900 text-right"
              >
                Email Address
              </label>
              <input
                id="vandy-email"
                type="email"
                class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80"
                bind:value={emailInput}
                autocomplete="email"
                required
              />
            </div>

            <div class="flex items-center gap-4">
              <label
                for="vandy-password"
                class="w-32 text-[12px] font-semibold text-slate-900 text-right"
              >
                Password
              </label>
              <input
                id="vandy-password"
                type="password"
                class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80"
                bind:value={passwordInput}
                autocomplete="current-password"
                required
              />
              <a
                href="/portals/vanderbilt"
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
        <div class="h-10 flex items-center bg-[#866D4B]">
          <div class="max-w-5xl mx-auto px-6 w-full flex items-center justify-between text-[11px] text-white">
            <span>&copy; vanderbilt.edu 2019</span>
            <span class="opacity-80">
              PredictAdmit.com simulation · Not affiliated with Vanderbilt University
            </span>
          </div>
        </div>
      </footer>
    </div>
{:else}
  {#if !hasViewedUpdate}
    <!-- Vanderbilt portal status page matching screenshots -->
    <div class="min-h-screen bg-slate-100">
      <!-- Top black header with Vanderbilt branding -->
      <header class="bg-black text-white py-3 px-6 border-b border-slate-700">
        <div class="flex items-center justify-between max-w-7xl mx-auto">
          <div class="flex items-center gap-2">
            <span class="text-[#CFB53B] text-lg font-bold tracking-wider">VANDERBILT</span>
            <span class="text-[#CFB53B] text-2xl font-serif">V</span>
            <span class="text-white text-lg font-bold tracking-wider">UNIVERSITY</span>
          </div>
          <nav class="flex gap-6 text-sm">
            <button class="text-[#CFB53B] hover:text-white flex items-center gap-1">
              APPLY <span class="text-xs">◉</span>
            </button>
            <button class="text-[#CFB53B] hover:text-white flex items-center gap-1">
              VISIT <span class="text-xs">◉</span>
            </button>
            <button class="text-[#CFB53B] hover:text-white flex items-center gap-1">
              REQUEST <span class="text-xs">◉</span>
            </button>
          </nav>
          <div class="flex items-center gap-4 text-sm">
            <span class="text-slate-400">Admissions</span>
            <span class="text-slate-400">Community</span>
            <span class="text-slate-400">Affordability</span>
            <span class="text-slate-400">Nashville</span>
          </div>
        </div>
      </header>

      <!-- Dark admissions banner -->
      <div class="bg-gradient-to-r from-slate-800 to-slate-700 py-16 px-6 border-b border-slate-600">
        <div class="max-w-7xl mx-auto">
          <div class="text-[#CFB53B] text-sm tracking-widest mb-2">UNDERGRADUATE</div>
          <h1 class="text-white text-5xl font-light tracking-wide">ADMISSIONS</h1>
        </div>
      </div>

      <!-- Main content area -->
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Tabs -->
        <div class="flex gap-2 mb-6">
          <button class="px-6 py-2 bg-slate-200 border border-slate-400 text-slate-800 text-sm font-semibold">
            Application
          </button>
          <button class="px-6 py-2 bg-white border border-slate-300 text-slate-600 text-sm hover:bg-slate-50">
            Financial Aid
          </button>
          <button class="px-6 py-2 bg-white border border-slate-300 text-slate-600 text-sm hover:bg-slate-50">
            Scholarships
          </button>
        </div>

        <!-- Welcome section -->
        <div class="bg-white border border-slate-300 shadow-sm mb-6">
          <div class="px-6 py-4 border-b border-slate-200">
            <h2 class="text-2xl font-serif text-slate-800">Welcome, {applicantName()}</h2>
          </div>
          <div class="px-6 py-4">
            <p class="text-sm text-slate-700 leading-relaxed mb-3">
              <strong>NOTE:</strong> MyAppVU portal is the only way to receive your Vanderbilt admissions decision. Any 
              official email communication from the Office of Undergraduate Admissions will come from a 
              vanderbilt.edu email address.
            </p>
            <p class="text-sm text-slate-600 leading-relaxed">
              It may take up to two business days for application parts and test scores to be reflected in this 
              portal. Only requested items appear on the checklist. For example, SAT II/subject test scores and 
              additional recommendation letters will not appear on the checklist as their scores fall.
            </p>
          </div>
        </div>

        <!-- Two column layout -->
        <div class="grid grid-cols-3 gap-6">
          <!-- Left column - Main content -->
          <div class="col-span-2 space-y-6">
            <!-- Application Charges section -->
            <div class="bg-white border border-slate-300 shadow-sm">
              <div class="bg-slate-100 px-6 py-3 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800">Application Charges</h3>
              </div>
              <div class="px-6 py-4">
                <p class="text-sm text-slate-700 leading-relaxed mb-4">
                  You are no longer permitted to submit charges to your Vanderbilt decision plan as of the date of choice. 
                  Decision plan and school of choice charges can be submitted only up to two weeks after the decision date. 
                  <strong>Additional charges as part of the CommonApp or a decision plan in Early Decision 1 or 2: 
                  Agreement: A required fee of $400 to access and to process your Early Decision plan in Early Decision 1 or 2.</strong>
                </p>
              </div>
            </div>

            <!-- Upload Materials section -->
            <div class="bg-white border border-slate-300 shadow-sm">
              <div class="bg-slate-100 px-6 py-3 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800">Upload Materials</h3>
              </div>
              <div class="px-6 py-4">
                <p class="text-sm text-slate-700 leading-relaxed mb-4">
                  You may upload application materials using the drop-down below. The only "required documents" that can be 
                  uploaded (and will appear on your MyAppVU checklist) are the Early Decision Agreement and self-reported testing. 
                  Required materials such as high school transcripts and teacher recommendations cannot be submitted through 
                  this upload tool. To be considered official, these materials must be submitted directly from the application platform 
                  or from your high school. DO NOT upload materials that are not listed in the drop-down menu.
                </p>
                <p class="text-sm text-slate-600 mb-4">
                  Because all items uploaded will be added to your admissions file and will be considered if submitted in time for 
                  admissions review, it is not necessary to contact your admissions office regarding these materials.
                </p>
                <div class="flex items-center gap-3">
                  <select class="px-3 py-2 border border-slate-400 bg-white text-sm text-slate-700 min-w-[200px]">
                    <option>Choose File</option>
                  </select>
                  <span class="text-sm text-slate-500">No file chosen</span>
                  <button class="px-4 py-2 bg-slate-200 border border-slate-400 text-slate-800 text-sm font-semibold hover:bg-slate-300">
                    Upload
                  </button>
                </div>
              </div>
            </div>

            <!-- Verify Address section -->
            <div class="bg-white border border-slate-300 shadow-sm">
              <div class="bg-slate-100 px-6 py-3 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800">Verify Address</h3>
              </div>
              <div class="px-6 py-4">
                <p class="text-sm text-slate-700 mb-4">We have your address listed as follows:</p>
                <div class="text-sm text-slate-700 mb-2"><strong>Mailing Address:</strong></div>
                <div class="text-sm text-slate-600 mb-1">2301 West End Ave</div>
                <div class="text-sm text-slate-600 mb-1">Nashville, TN 37203-1700</div>
                <div class="text-sm text-slate-600 mb-4">United States</div>
                <button class="text-sm text-blue-700 underline hover:text-blue-900">Edit Address</button>
              </div>
            </div>

            <!-- Admissions Counselor section -->
            <div class="bg-white border border-slate-300 shadow-sm">
              <div class="bg-slate-100 px-6 py-3 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-800">Your Vanderbilt Admissions Counselor</h3>
              </div>
              <div class="px-6 py-4">
                <p class="text-sm text-Black-700 underline cursor-pointer hover:text-blue-900">» Ricky Thrash</p>
              </div>
            </div>

            <!-- Decision Status Button -->
            <div class="bg-yellow-50 border-2 border-yellow-400 p-6 text-center">
              <p class="text-lg font-semibold text-slate-800 mb-4">
                Your admissions decision is now available.
              </p>
              <button
                on:click={handleViewUpdate}
                class="px-8 py-3 bg-slate-700 text-white text-sm font-bold border border-slate-800 hover:bg-slate-800 focus:outline-none"
              >
                View Update &gt;&gt;
              </button>
            </div>
          </div>

          <!-- Right column - Sidebar -->
          <div class="space-y-6">
            <!-- Campus Vanderbilt box -->
            <div class="bg-white border border-slate-300 shadow-sm">
              <div class="px-4 py-3 border-b border-slate-200">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-slate-700"></div>
                  <div>
                    <div class="text-xs font-bold text-slate-800">Office of Undergraduate</div>
                    <div class="text-xs text-slate-600">Admissions</div>
                  </div>
                </div>
              </div>
              <div class="px-4 py-3">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-10 h-10 bg-slate-400 rounded-full"></div>
                  <div>
                    <div class="text-xs font-semibold text-slate-800">Office of Undergraduate</div>
                    <div class="text-xs text-slate-600">Admissions</div>
                    <div class="text-xs text-slate-500">about 2 years ago</div>
                  </div>
                  <button class="ml-auto text-Black-700">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                    </svg>
                  </button>
                </div>
                <div class="text-xs font-bold text-slate-800 mb-2">New Senior Admissions Counselor</div>
                <div class="text-xs text-slate-700 mb-2">Arianna Yamillo</div>
                <p class="text-xs text-slate-600 leading-relaxed">
                  Hi there—My name is Arianna Yamillo, and I've worked in the Office of Undergraduate Admissions since 
                  graduating from Vanderbilt in 2018! I live in New York City and work on students here and in Long Island, Fairfield County, Central American, the 
                  Caribbean, Mexico, the U.S. territories, and parts of China (what?) in the office! I help plan events(!) and serve on our Diversity, Equity, and 
                  Inclusion Initiatives. I enjoy working magical illusions and tips; and going, meeting friends and family to homeschooled teens. Let me know if 
                  you have any recipes you think I...
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom links -->
        <div class="mt-8 flex gap-6 text-sm text-slate-500">
          <button class="hover:text-slate-700">Change Email Address</button>
          <button class="hover:text-slate-700">Change Password</button>
          <button class="hover:text-slate-700">Logout</button>
        </div>
      </div>
    </div>
  {:else}
    {#if DECISION === 'admit'}
      <VanderbiltAccepted applicantName={applicantName()} />
    {:else}
      <VanderbiltDenied applicantName={applicantName()} />
    {/if}
  {/if}
{/if}