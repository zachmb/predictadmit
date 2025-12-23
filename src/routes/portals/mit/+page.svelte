<script lang="ts">
  import { tick } from 'svelte';
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';

  import MITAccepted from '$lib/components/mit/MITAccepted.svelte';
  import MITDenied from '$lib/components/mit/MITDenied.svelte';

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

  const handleViewUpdate = async () => {
    hasViewedUpdate = true;
    await tick();
    window.scrollTo(0, 0);
  };
</script>

<svelte:head>
  <title>MIT - MyMIT Portal</title>
</svelte:head>

{#if !authenticated}
  <!-- MIT login screen -->
  <div class="min-h-screen bg-slate-100">
    <header class="bg-white border-b border-slate-300">
      <div class="max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
        <div class="flex items-baseline gap-3">
          <span class="text-3xl font-serif text-[#A31F34]">
            MIT
          </span>
          <span class="text-[11px] tracking-[0.18em] uppercase text-slate-700">
            Office of Admissions
          </span>
        </div>
        <div class="text-[11px] text-slate-700">
          {applicantName()}
        </div>
      </div>
      <div class="h-8 bg-[#A31F34]"></div>
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
              for="mit-email"
              class="w-32 text-[12px] font-semibold text-slate-900 text-right"
            >
              Email Address
            </label>
            <input
              id="mit-email"
              type="email"
              class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80"
              bind:value={emailInput}
              autocomplete="email"
              required
            />
          </div>

          <div class="flex items-center gap-4">
            <label
              for="mit-password"
              class="w-32 text-[12px] font-semibold text-slate-900 text-right"
            >
              Password
            </label>
            <input
              id="mit-password"
              type="password"
              class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80"
              bind:value={passwordInput}
              autocomplete="current-password"
              required
            />
            <a
              href="/portals/mit"
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
      <div class="h-10 flex items-center bg-[#A31F34]">
        <div class="max-w-5xl mx-auto px-6 w-full flex items-center justify-between text-[11px] text-white">
          <span>&copy; mit.edu 2021</span>
          <span class="opacity-80">
            PredictAdmit.com simulation · Not affiliated with MIT
          </span>
        </div>
      </div>
    </footer>
  </div>
{:else}
  {#if !hasViewedUpdate}
    <!-- MIT portal status page -->
    <div class="min-h-screen bg-white">
      <!-- Header with gradient -->
      <div class="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 h-3"></div>
      
      <header class="bg-white border-b border-slate-200 py-4 px-6">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-8">
              <h1 class="text-2xl font-bold text-[#A31F34]">mit</h1>
              
            </div>
            <div class="text-yellow-500 text-xl">{applicantName()}</div>
          </div>
          
          <!-- Breadcrumb navigation -->
          <div class="text-xs text-slate-600">
            <span class="hover:text-[#A31F34] cursor-pointer">MyMIT</span>
            <span class="mx-2">›</span>
            <span class="hover:text-[#A31F34] cursor-pointer">Application</span>
            <span class="mx-2">›</span>
            <span class="font-semibold">Decision Status</span>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main class="max-w-7xl mx-auto px-6 py-8 font-sans">
        <!-- Page title and intro -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Application Status</h1>
          <p class="text-xs text-slate-600">
            View your application materials, decision updates, and next steps.
          </p>
        </div>

        <!-- Application summary cards -->
        <div class="grid grid-cols-3 gap-3 mb-6">
          <div class="bg-blue-50 p-3">
            <div class="text-[10px] text-blue-700 font-bold mb-1 tracking-wide">APPLICATION ID</div>
            <div class="text-base font-bold text-slate-900">MIT-2025-{Math.floor(Math.random() * 90000) + 10000}</div>
          </div>
          <div class="bg-green-50 p-3">
            <div class="text-[10px] text-green-700 font-bold mb-1 tracking-wide">APPLICATION TYPE</div>
            <div class="text-base font-bold text-slate-900">Regular Action</div>
          </div>
          <div class="bg-purple-50 p-3">
            <div class="text-[10px] text-purple-700 font-bold mb-1 tracking-wide">DECISION DATE</div>
            <div class="text-base font-bold text-slate-900">March 14, 2021</div>
          </div>
        </div>

        <div class="bg-slate-50 shadow-md p-6">
          <!-- Thank you message -->
          <div class="mb-6">
            <p class="text-[13px] text-slate-700 mb-3 leading-relaxed">
              Thank you for applying to MIT! Our records indicate that you applied for First-Year Admission in Regular Action.
            </p>
            
            <h2 class="text-lg font-bold text-slate-900 mb-2">The waiting is over!</h2>
            
            <p class="text-[13px] text-slate-700 mb-3 leading-relaxed">
              We're happy to report that admissions decisions are now available. There is no interim "are you sure???" screen. Once you click View Update, you're going to know 
              immediately whether or not we are able to offer you a spot in MIT's Class of 2025.
            </p>
            
            <p class="text-[13px] text-slate-700 mb-4 leading-relaxed">
              We've had a wonderful time getting to know each of you—your stories, your dreams, your wishes for the future. Regardless of which letter awaits you, please know 
              that we think you're simply fantastic—and we can't wait to see how you change our world for the better.
            </p>
            
            <p class="text-[13px] text-slate-700 mb-6">
              With that said, deep breath...
            </p>
          </div>

          <!-- Status Update section -->
          <div class="bg-yellow-50 p-5 mb-6">
            <h3 class="text-base font-bold text-slate-900 mb-2">Status Update</h3>
            <p class="text-[13px] text-slate-700 mb-3">
              New updates to your application were posted March 14, 2021.
            </p>
            <button
              on:click={handleViewUpdate}
              class="text-[13px] font-bold text-green-700 hover:text-green-900 underline"
            >
              View Update &gt;&gt;
            </button>
          </div>

          <!-- Financial Aid section -->
          <div class="mb-6">
            <h3 class="text-base font-bold text-slate-900 mb-2">Financial Aid</h3>
            <p class="text-[13px] text-slate-700 mb-3 leading-relaxed">
              The MIT Online Financial Aid system will provide all the information you need about your financial aid award, 
              outstanding requirements for your financial aid, instructions for your financial aid appeal, and understanding requirements as well as 
              messages about your aid can be found by clicking the button below.
            </p>
            <button class="bg-slate-200 px-4 py-2 text-[12px] font-bold hover:bg-slate-300">
              Manage Financial Aid
            </button>
          </div>

          <!-- Test Scores section -->
          <div>
            <h3 class="text-base font-bold text-slate-900 mb-2">Test Scores</h3>
            <p class="text-[13px] text-slate-700 mb-3">
              We have received the following test scores from you:
            </p>
            <table class="w-full max-w-xl border-collapse text-[12px]">
              <thead>
                <tr class="bg-slate-800 text-white">
                  <th class="px-3 py-2 text-left font-bold">TEST DATE</th>
                  <th class="px-3 py-2 text-left font-bold">TEST TYPE</th>
                  <th class="px-3 py-2 text-left font-bold">TEST TOTAL</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr>
                  <td class="px-3 py-2">2020-05-20</td>
                  <td class="px-3 py-2">AP</td>
                  <td class="px-3 py-2">5</td>
                </tr>
                <tr>
                  <td class="px-3 py-2">2020-05-15</td>
                  <td class="px-3 py-2">AP</td>
                  <td class="px-3 py-2">5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <!-- MIT Footer -->
      <footer class="bg-slate-800 text-white mt-12">
        <div class="max-w-7xl mx-auto px-6 py-8">
          <div class="grid grid-cols-4 gap-8 mb-6">
            <div>
              <h4 class="text-[11px] font-bold mb-3 tracking-wider">ABOUT MIT</h4>
              <ul class="space-y-2 text-[11px]">
                <li><a href="/portals/mit" class="hover:text-[#A31F34]">Mission</a></li>
                <li><a href="/portals/mit" class="hover:text-[#A31F34]">Leadership</a></li>
                <li><a href="/portals/mit" class="hover:text-[#A31F34]">Facts & History</a></li>
                <li><a href="/portals/mit" class="hover:text-[#A31F34]">Campus Map</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-[11px] font-bold mb-3 tracking-wider">ADMISSIONS</h4>
              <ul class="space-y-2 text-[11px]">
                <li><a href="/portals/mit" class="hover:text-[#A31F34]">Undergraduate</a></li>
                <li><a href="/portals/mit" class="hover:text-[#A31F34]">Graduate</a></li>
                <li><a href="/portals/mit" class="hover:text-[#A31F34]">Financial Aid</a></li>
                <li><a href="/portals/mit" class="hover:text-[#A31F34]">Visit Campus</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-[11px] font-bold mb-3 tracking-wider">RESOURCES</h4>
              <ul class="space-y-2 text-[11px]">
                <li><a href="/portals/mit" class="hover:text-[#A31F34]">Libraries</a></li>
                <li><a href="/portals/mit" class="hover:text-[#A31F34]">Career Services</a></li>
                <li><a href="/portals/mit" class="hover:text-[#A31F34]">Student Life</a></li>
                <li><a href="/portals/mit" class="hover:text-[#A31F34]">Athletics</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-[11px] font-bold mb-3 tracking-wider">CONTACT</h4>
              <ul class="space-y-2 text-[11px]">
                <li class="leading-relaxed">77 Massachusetts Avenue<br>Cambridge, MA 02139</li>
                <li><a href="/portals/mit" class="hover:text-[#A31F34]">(617) 253-1000</a></li>
                <li><a href="/portals/mit" class="hover:text-[#A31F34]">Contact MIT</a></li>
              </ul>
            </div>
          </div>
          
          <div class="border-t border-slate-600 pt-4">
            <div class="flex items-center justify-between text-[10px]">
              <div class="space-x-4">
                <a href="/portals/mit" class="hover:text-[#A31F34]">Privacy</a>
                <a href="/portals/mit" class="hover:text-[#A31F34]">Accessibility</a>
                <a href="/portals/mit" class="hover:text-[#A31F34]">Terms of Use</a>
              </div>
              <div>
                <span>© 2021 Massachusetts Institute of Technology</span>
                <span class="ml-4 opacity-70">PredictAdmit.com simulation · Not affiliated with MIT</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  {:else}
    {#if DECISION === 'admit'}
      <MITAccepted applicantName={applicantName()} />
    {:else}
      <MITDenied applicantName={applicantName()} />
    {/if}
  {/if}
{/if}