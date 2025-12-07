<script lang="ts">
  import { userProfile } from '$lib/stores/user';
  import type { UserProfile } from '$lib/stores/user';

  import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
  import DartmouthAccepted from '$lib/components/dartmouth/DartmouthAccepted.svelte';
  import DartmouthDenied from '$lib/components/dartmouth/DartmouthDenied.svelte';

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
  <title>Dartmouth College Undergraduate Admissions Portal</title>
</svelte:head>

<main class="min-h-screen bg-slate-200 text-slate-900 font-serif">
  {#if !authenticated}
    <!-- FULL-SCREEN DARTMOUTH LOGIN (early 2000s vibe) -->
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="w-full max-w-md bg-white border border-slate-500 shadow-md">
        <!-- Header - Dartmouth Green (#00693E) -->
        <div class="bg-[#00693E] text-white border-b border-slate-700 px-4 py-3">
          <h1 class="text-lg font-bold tracking-tight">
            Dartmouth College
          </h1>
          <p class="text-[11px] text-green-100">
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
              for="dartmouth-email"
            >
              Email Address:
            </label>
            <input
              id="dartmouth-email"
              type="email"
              class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-[#00693E]"
              bind:value={emailInput}
              autocomplete="email"
            />
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-slate-800 mb-1"
              for="dartmouth-password"
            >
              Password:
            </label>
            <input
              id="dartmouth-password"
              type="password"
              class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-[#00693E]"
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
            class="mt-2 inline-block bg-[#00693E] text-white text-sm font-semibold px-4 py-2 border border-[#005530] shadow hover:bg-[#005530] focus:outline-none focus:ring-1 focus:ring-[#00693E]"
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
        logoPrimary="DARTMOUTH"
        logoSecondary="ADMISSIONS"
        schoolName="Dartmouth College"
        primaryColor="#00693E"
        applicantName={applicantName()}
        admissionsId="2026-DART-112233"
        financialAidId="FA-445566"
        bannerText="Thank you for applying to Dartmouth College!"
        noticeText="Admission decisions for Regular Decision applicants will be available Thursday, March 28, 2024 at 7:00 PM Eastern Time (Ivy Day)."
        statusLastPosted="February 14, 2024"
        statusLinkLabel="View Decision >>"
        onViewUpdate={handleViewUpdate}
        additionalSections={[
          {
            title: 'Application Information',
            content: `
              <p><strong>Application Type:</strong> Regular Decision</p>
              <p><strong>Intended Concentration:</strong> Economics</p>
              <p><strong>Application ID:</strong> DART-112233</p>
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
                  <span>Dartmouth Writing Supplement (Submitted)</span>
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
                  <span>High School Transcript (Received)</span>
                </div>
                <div class="flex items-center text-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span>School Profile (Received)</span>
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
                  <span>Mid-Year Report (Received)</span>
                </div>
              </div>
            `
          },
          {
            title: 'Financial Aid Status',
            content: `
              <p>Your financial aid application is complete and under review. Financial aid decisions 
              will be released concurrently with admission decisions on March 28, 2024.</p>
              <p class="mt-2 text-sm text-gray-600">For questions about financial aid, please contact the 
              Dartmouth Financial Aid Office at 603-646-2451 or 
              <a href="mailto:financial.aid@dartmouth.edu" class="text-[#00693E] hover:underline">financial.aid@dartmouth.edu</a>.</p>
            `
          },
          {
            title: 'The Dartmouth D-Plan',
            content: `
              <p class="text-sm mb-2">Dartmouth operates on a distinctive quarter system called the D-Plan:</p>
              <ul class="text-sm list-disc pl-5 space-y-1 text-gray-700">
                <li>Four 10-week terms per year (Fall, Winter, Spring, Summer)</li>
                <li>Students typically take three courses per term</li>
                <li>Flexibility for internships, research, study abroad, and off-campus programs</li>
                <li>Allows for deep immersion in each subject</li>
              </ul>
              <p class="mt-2 text-xs text-gray-600">The D-Plan is unique among the Ivy League and provides exceptional flexibility.</p>
            `
          },
          {
            title: 'Dartmouth Traditions',
            content: `
              <p class="text-sm mb-2">Dartmouth is known for its distinctive traditions and strong sense of community:</p>
              <ul class="text-sm list-disc pl-5 space-y-1 text-gray-700">
                <li><strong>Dartmouth Outing Club:</strong> Oldest and largest collegiate outing club in the U.S.</li>
                <li><strong>Winter Carnival:</strong> Annual winter celebration since 1911</li>
                <li><strong>Homecoming:</strong> Bonfire tradition for first-year students</li>
                <li><strong>Outdoor Program:</strong> Access to the Appalachian Trail and White Mountains</li>
              </ul>
            `
          },
          {
            title: 'Important Dates',
            content: `
              <ul class="text-sm space-y-1 text-gray-700">
                <li><strong>Regular Decision Deadline:</strong> January 3, 2024</li>
                <li><strong>Decision Release (Ivy Day):</strong> March 28, 2024 (7:00 PM ET)</li>
                <li><strong>Dimensions of Dartmouth:</strong> April 12-14, 2024</li>
                <li><strong>Reply Deadline:</strong> May 1, 2024</li>
              </ul>
            `
          },
          {
            title: 'Contact Information',
            content: `
              <p><strong>Undergraduate Admissions:</strong> 603-646-2875</p>
              <p><strong>Email:</strong> <a href="mailto:admissions@dartmouth.edu" class="text-[#00693E] hover:underline">admissions@dartmouth.edu</a></p>
              <p><strong>Office Hours:</strong> Monday–Friday, 8:00 AM–4:30 PM EST</p>
              <p class="mt-2 text-sm text-gray-600">Please have your Application ID (DART-112233) ready when contacting our office.</p>
            `
          }
        ]}
      />
    {:else}
      <!-- FINAL DECISION LETTER, FULL PAGE -->
      {#if DECISION === 'admit'}
        <DartmouthAccepted applicantName={applicantName()} />
      {:else}
        <DartmouthDenied applicantName={applicantName()} />
      {/if}
    {/if}
  {/if}
</main>