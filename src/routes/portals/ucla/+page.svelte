<script lang="ts">
  import { tick } from 'svelte';
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';
  import UCLAAccepted from '$lib/components/ucla/UCLAAccepted.svelte';
  import UCLADenied from '$lib/components/ucla/UCLADenied.svelte';

  const DECISION: 'admit' | 'deny' = 'admit';

  let profile: UserProfile = { name: '', email: '', password: '' };
  let lastNameInput = '';
  let applicationIdInput = '';
  let dateOfBirthInput = '';
  let cityOfBirthInput = '';
  let error = '';
  let authenticated = false;

  $: profile = $userProfile;

  const applicantName = () => profile.name || 'Applicant';

  const handleLogin = async (event: SubmitEvent) => {
    event.preventDefault();

    if (!profile.email || !profile.password) {
      error = 'Please set your PredictAdmit email and password on the main page.';
      authenticated = false;
      return;
    }

    // Simple validation - just check if fields are filled
    if (lastNameInput && applicationIdInput && dateOfBirthInput && cityOfBirthInput) {
      authenticated = true;
      error = '';
      await tick();
      window.scrollTo(0, 0);
    } else {
      error = 'Please fill in all fields.';
      authenticated = false;
    }
  };
</script>

<svelte:head>
  <title>UCLA - Application Status</title>
</svelte:head>

{#if !authenticated}
  <!-- UCLA login screen -->
  <div class="min-h-screen bg-stone-200 border-8 border-[#2774AE] p-8">
    <div class="bg-stone-200 max-w-5xl mx-auto">
      <!-- UCLA Logo and Title -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <div class="text-6xl font-bold text-[#2774AE] italic" style="font-family: serif;">
            UCLA
          </div>
          <div class="text-sm text-[#2774AE] mt-4">Home</div>
        </div>
        <h1 class="text-4xl font-bold text-stone-700 mb-2">Application Status</h1>
        <p class="text-stone-600">
          Applicants for 2025 may check their application status by logging in below.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-8">
        <!-- Login Form -->
        <div class="bg-white border border-stone-300 p-8">
          <h2 class="text-lg font-semibold text-stone-700 mb-6">Login</h2>

          {#if error}
            <div class="bg-red-50 border border-red-300 text-red-800 px-4 py-3 text-sm mb-6" role="alert">
              {error}
            </div>
          {/if}

          <form class="space-y-6" on:submit={handleLogin}>
            <div>
              <label for="last-name" class="block text-sm text-stone-600 mb-2">
                Last Name:
              </label>
              <input
                id="last-name"
                type="text"
                class="w-full border border-stone-400 bg-stone-100 px-3 py-2 text-sm focus:outline-none focus:border-[#2774AE]"
                bind:value={lastNameInput}
                required
              />
            </div>

            <div>
              <label for="app-id" class="block text-sm text-stone-600 mb-2">
                Application ID: <a href="#" class="text-[#2774AE] text-xs hover:underline">What is this?</a>
              </label>
              <input
                id="app-id"
                type="password"
                class="w-full border border-stone-400 bg-stone-100 px-3 py-2 text-sm focus:outline-none focus:border-[#2774AE]"
                bind:value={applicationIdInput}
                required
              />
            </div>

            <div>
              <label for="dob" class="block text-sm text-stone-600 mb-2">
                Date of Birth:
              </label>
              <input
                id="dob"
                type="text"
                placeholder="MM/DD/YYYY"
                class="w-full border border-pink-400 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#2774AE]"
                bind:value={dateOfBirthInput}
                required
              />
            </div>

            <div>
              <label for="city-birth" class="block text-sm text-stone-600 mb-2">
                City of Birth:
              </label>
              <input
                id="city-birth"
                type="password"
                class="w-full border border-stone-400 bg-stone-100 px-3 py-2 text-sm focus:outline-none focus:border-[#2774AE]"
                bind:value={cityOfBirthInput}
                required
              />
            </div>

            <div class="pt-2">
              <button
                type="submit"
                class="bg-[#2774AE] text-white px-8 py-2 text-sm font-semibold hover:bg-[#1e5a8a] transition-colors"
              >
                Login
              </button>
            </div>

            <p class="pt-6 text-xs text-stone-600 leading-relaxed border-t border-stone-300">
              For this simulation, simply fill in any values for the fields above. 
              No real application data is used, and all information is stored only in your browser.
            </p>
          </form>
        </div>

        <!-- Right side - empty space in original -->
        <div></div>
      </div>
    </div>
  </div>
{:else}
  {#if DECISION === 'admit'}
    <UCLAAccepted applicantName={applicantName()} />
  {:else}
    <UCLADenied applicantName={applicantName()} />
  {/if}
{/if}