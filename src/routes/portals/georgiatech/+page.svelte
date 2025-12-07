<script lang="ts">
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';

  import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
  import GeorgiaTechAccepted from '$lib/components/georgia-tech/GeorgiaTechAccepted.svelte';
  import GeorgiaTechDenied from '$lib/components/georgia-tech/GeorgiaTechDenied.svelte';

  // You can change this to 'deny' to test the deny letter
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
  <title>Georgia Tech Undergraduate Admissions Portal</title>
</svelte:head>

<main class="min-h-screen bg-slate-200 text-slate-900 font-serif">
  {#if !authenticated}
    <!-- Georgia Tech login screen (full-page) -->
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-white border border-gray-300 shadow-sm">
        <!-- Header -->
        <div class="bg-[#B3A369] text-white p-4 border-b border-gray-300">
          <h1 class="text-xl font-bold">Georgia Institute of Technology</h1>
          <p class="text-sm opacity-90">Undergraduate Admissions – Applicant Login</p>
        </div>

        <!-- Login form -->
        <form on:submit|preventDefault={handleLogin} class="p-6 space-y-4">
          <div>
            <label for="gt-email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="gt-email"
              type="email"
              bind:value={emailInput}
              class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#00254C] focus:border-[#00254C]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label for="gt-password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="gt-password"
              type="password"
              bind:value={passwordInput}
              class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#00254C] focus:border-[#00254C]"
              placeholder="Enter your password"
              required
            />
          </div>

          {#if error}
            <p class="text-red-600 text-sm font-medium">{error}</p>
          {:else if !profile.email || !profile.password}
            <p class="text-amber-700 text-sm">
              ⓘ Please set your PredictAdmit email and password on the main page first.
            </p>
          {/if}

          <div class="text-sm text-gray-600 space-y-2">
            <p>Use the same credentials you created on PredictAdmit.com</p>
            <p class="text-xs">This is a simulation. No real login occurs.</p>
          </div>

          <button
            type="submit"
            class="w-full bg-[#00254C] text-white py-2 px-4 rounded-sm hover:bg-[#001A36] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#00254C] font-medium"
          >
            Login to Portal
          </button>
        </form>
      </div>
    </div>
  {:else}
    {#if !hasViewedUpdate}
      <!-- Custom Georgia Tech portal based on screenshot -->
      <div class="min-h-screen bg-gray-100 text-gray-900 font-sans">
        <!-- Header -->
        <header class="bg-white border-b border-gray-300">
          <div class="container mx-auto px-4 py-3">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold text-[#00254C]">GEORGIA TECH</h1>
                <p class="text-sm text-gray-600">Undergraduate Admission</p>
              </div>
              <div class="text-right">
                <p class="text-sm">Welcome, <span class="font-semibold">{applicantName()}</span></p>
                <button
                  on:click={() => authenticated = false}
                  class="text-xs text-[#B3A369] hover:underline"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8">
          <!-- Status Update Banner -->
          <div class="bg-white border border-gray-300 rounded-sm mb-8 shadow-sm">
            <div class="border-b border-gray-300 p-4">
              <h2 class="text-lg font-bold text-[#00254C]">Status Update</h2>
            </div>
            <div class="p-6">
              <p class="text-gray-700 mb-2">
                An update to your application was last posted <span class="font-semibold">March 14, 2020</span>.
              </p>
              <button
                on:click={handleViewUpdate}
                class="inline-block bg-[#00254C] text-white text-sm font-semibold px-5 py-2 rounded-sm hover:bg-[#001A36] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#00254C]"
              >
                Click to View Decision Letter
              </button>
            </div>
          </div>

          <!-- Application Checklist -->
          <div class="bg-white border border-gray-300 rounded-sm shadow-sm">
            <div class="border-b border-gray-300 p-4">
              <h2 class="text-lg font-bold text-[#00254C]">Application Checklist</h2>
            </div>
            <div class="p-4">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="border-b border-gray-300">
                    <th class="text-left py-2 px-3 text-sm font-semibold text-gray-700">Status</th>
                    <th class="text-left py-2 px-3 text-sm font-semibold text-gray-700">Details</th>
                    <th class="text-left py-2 px-3 text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-3">
                      <span class="inline-flex items-center text-green-600">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        Received
                      </span>
                    </td>
                    <td class="py-3 px-3 text-sm">ACT or SAT Scores (Official)</td>
                    <td class="py-3 px-3 text-sm">01/09/2020</td>
                  </tr>
                  <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-3">
                      <span class="inline-flex items-center text-green-600">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        Received
                      </span>
                    </td>
                    <td class="py-3 px-3 text-sm">ACT or SAT Scores (Self-Reported)</td>
                    <td class="py-3 px-3 text-sm">01/02/2020</td>
                  </tr>
                  <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-3">
                      <span class="inline-flex items-center text-green-600">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        Received
                      </span>
                    </td>
                    <td class="py-3 px-3 text-sm">High School Transcript for A High School</td>
                    <td class="py-3 px-3 text-sm">01/02/2020</td>
                  </tr>
                  <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-3">
                      <span class="inline-flex items-center text-green-600">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        Received
                      </span>
                    </td>
                    <td class="py-3 px-3 text-sm">Counselor Recommendation</td>
                    <td class="py-3 px-3 text-sm">01/02/2020</td>
                  </tr>
                  <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-3">
                      <span class="inline-flex items-center text-green-600">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        Received
                      </span>
                    </td>
                    <td class="py-3 px-3 text-sm">Mid-year Transcript</td>
                    <td class="py-3 px-3 text-sm">02/15/2020</td>
                  </tr>
                  <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-3">
                      <span class="inline-flex items-center text-green-600">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        Received
                      </span>
                    </td>
                    <td class="py-3 px-3 text-sm">Mid-year Transcript</td>
                    <td class="py-3 px-3 text-sm">02/15/2020</td>
                  </tr>
                  <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="py-3 px-3">
                      <span class="inline-flex items-center text-green-600">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        Received
                      </span>
                    </td>
                    <td class="py-3 px-3 text-sm">School Report</td>
                    <td class="py-3 px-3 text-sm">01/02/2020</td>
                  </tr>
                  <tr class="hover:bg-gray-50">
                    <td class="py-3 px-3">
                      <span class="inline-flex items-center text-green-600">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        Received
                      </span>
                    </td>
                    <td class="py-3 px-3 text-sm">Teacher Recommendation</td>
                    <td class="py-3 px-3 text-sm">01/02/2020</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Resources Section -->
          <div class="mt-8 pt-6 border-t border-gray-300">
            <div class="flex space-x-8 text-sm">
              <div>
                <h3 class="font-bold text-[#00254C] mb-2">Georgia Tech Resources</h3>
                <ul class="space-y-1 text-gray-700">
                  <li><a href="#" class="text-[#B3A369] hover:underline">Office of Undergraduate Education</a></li>
                  <li><a href="#" class="text-[#B3A369] hover:underline">Registrar</a></li>
                  <li><a href="#" class="text-[#B3A369] hover:underline">Bursar</a></li>
                  <li><a href="#" class="text-[#B3A369] hover:underline">Financial Aid</a></li>
                </ul>
              </div>
              <div>
                <h3 class="font-bold text-[#00254C] mb-2">Visitor Resources</h3>
                <ul class="space-y-1 text-gray-700">
                  <li><a href="#" class="text-[#B3A369] hover:underline">Campus Visits</a></li>
                  <li><a href="#" class="text-[#B3A369] hover:underline">Admitted Student Programs</a></li>
                  <li><a href="#" class="text-[#B3A369] hover:underline">Directions & Parking</a></li>
                  <li><a href="#" class="text-[#B3A369] hover:underline">Atlanta Information</a></li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        <!-- Footer -->
        <footer class="bg-white border-t border-gray-300 mt-8">
          <div class="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Georgia Institute of Technology. All rights reserved.</p>
            <p class="mt-1">North Avenue, Atlanta, GA 30332 • 404.894.2000</p>
          </div>
        </footer>
      </div>
    {:else}
      {#if DECISION === 'admit'}
        <GeorgiaTechAccepted applicantName={applicantName()} />
      {:else}
        <GeorgiaTechDenied applicantName={applicantName()} />
      {/if}
    {/if}
  {/if}
</main>