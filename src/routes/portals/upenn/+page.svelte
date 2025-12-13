<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';

	// School Config
	import { schoolConfigs } from '$lib/config/schools';

	// Import the correct Penn decision components
	import PennAccepted from '$lib/components/upenn/PennAccepted.svelte';
	import PennDenied from '$lib/components/upenn/PennDenied.svelte';

	// ----------------- CONFIGURATION -----------------

	const SLUG = 'upenn';
    // Using default colors/fallbacks if config is missing
	const school = {
		schoolName: 'University of Pennsylvania',
		statusLastPosted: 'March 26th, 2020',
		primaryColor: '#011F5B', // Navy Blue
		accentColor: '#EC5537', // Red-Orange
		// Placeholder decision for simulation
		decision: schoolConfigs[SLUG]?.decision || 'admit',
        footerDomain: 'upenn.edu',
        // Placeholder ID - not shown on the status page screenshot
        admissionsId: '987654321',
	};


	// ----------------- STATE -----------------

	let profile: UserProfile = { name: '', email: '', password: '' };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;

	// ----------------- REACTIVE DERIVATIONS -----------------

	$: profile = $userProfile;
	const applicantName = () => profile.name || 'John Doe';

	// ----------------- HANDLERS -----------------

	const handleLoadSavedLogin = () => {
		if (!profile.email || !profile.password) {
			error = 'No saved PredictAdmit login found. Please save it on the main page first.';
			return;
		}
		emailInput = profile.email;
		passwordInput = profile.password;
		error = '';
	};

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
	<title>{school.schoolName} Undergraduate Admissions Portal</title>
</svelte:head>

<div class="min-h-screen font-sans text-slate-900 bg-[#f7f7f7]">
	
	{#if !authenticated}
    <header class="bg-white border-b border-slate-300">
			<div class="max-w-4xl mx-auto px-10 pt-4 pb-2 flex items-baseline justify-between">
				<div class="flex items-end gap-3">
					<span class="text-3xl font-serif font-bold text-slate-800">
						<span class="text-3xl font-serif font-extrabold text-[#011F5B]">
                            Penn
                        </span>
                        <span class="text-[11px] tracking-[0.18em] uppercase text-slate-700 pb-[3px]">
                            Undergraduate Admission
                        </span>
					</span>
				</div>
				<div class="text-[11px] text-slate-700">
					{applicantName()}
				</div>
			</div>
			<div class="h-6 bg-[#011F5B]"></div>
		</header>

		<section class="bg-white min-h-[500px] py-10">
			<div class="max-w-4xl mx-auto px-10">
				<div class="max-w-3xl mx-auto text-[13px]">
                    
                    <h1 class="text-2xl font-normal mb-8 font-serif text-[#011F5B] border-b border-slate-300 pb-2">
                        Login
                    </h1>

					<div class="border border-green-700 bg-[#E0FFE0] px-4 py-3 mb-6 text-[13px] text-slate-900 font-normal max-w-[500px]">
						To log in, please enter your email address and password.
					</div>

					<form class="space-y-4 max-w-[500px]" on:submit={handleLogin}>
						{#if error}
							<p class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2" role="alert">{error}</p>
						{/if}

						<div class="flex items-center gap-2">
							<label
								for="portal-email"
								class="text-[13px] font-normal text-slate-900 w-32 text-right"
							>
                                Email Address
							</label>
							<input
								id="portal-email"
								type="email"
								class="border border-slate-400 bg-white px-2 py-1 text-[13px] w-56 shadow-inner"
								bind:value={emailInput}
								autocomplete="email"
							/>
						</div>

						<div class="flex items-center gap-2">
							<label
								for="portal-password"
								class="text-[13px] font-normal text-slate-900 w-32 text-right"
							>
								Password
							</label>
                            <input
                                id="portal-password"
                                type="password"
                                class="border border-slate-400 bg-white px-2 py-1 text-[13px] w-32 shadow-inner"
                                bind:value={passwordInput}
                                autocomplete="current-password"
                            />
                            <a
                                href="/disclaimer"
                                class="text-[12px] text-blue-800 underline hover:no-underline ml-4 whitespace-nowrap"
                            >
                                Forgot Your Password?
                            </a>
						</div>


						<div class="flex items-center gap-3 pt-3">
                            <div class="w-32"></div> 
                            
							<button
								type="submit"
								class="border border-slate-600 bg-slate-300 px-4 py-1 text-[12px] font-semibold text-black
										shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
							>
								Login
							</button>
                            <button
								type="button"
								class="border border-slate-400 bg-slate-100 px-3 py-1 text-[11px] text-slate-700
										shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:bg-slate-200 active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
								on:click={handleLoadSavedLogin}
							>
								Load saved PredictAdmit login
							</button>
						</div>

						<p class="pt-6 text-[11px] leading-relaxed text-slate-600">
							for this simulation, use the same email address and password that you saved on the
							PredictAdmit.com home page. No real application data is used, and all information is
							stored only in your browser.
						</p>
					</form>
				</div>
			</div>
		</section>

		<footer class="bg-[#011F5B] h-8 flex items-center justify-center text-white text-[11px] font-normal">
			<div class="max-w-4xl mx-auto flex justify-between w-full px-10">
				<span>&copy; 2019</span>
				<span>PredictAdmit Simulation - Not affiliated with University of Pennsylvania</span>
			</div>
		</footer>

	{:else}
    {#if !hasViewedUpdate}
            <header class="bg-[#011F5B] text-white h-20 flex items-center justify-between px-10">
				<div class="max-w-4xl mx-auto w-full flex items-center gap-4">
					<div class="flex items-end gap-3 flex-grow">
                        <div class="w-12 h-12">
                             
                        </div>
						<span class="font-serif text-2xl tracking-wide font-bold">Penn</span>
						<span class="text-xs self-end pb-1 font-normal">UNIVERSITY of PENNSYLVANIA</span>
					</div>

					<div class="flex items-center gap-4 text-[13px] font-normal">
						<a
							href="/disclaimer"
							class="bg-[#EC5537] text-white px-4 py-2 text-sm font-semibold hover:bg-[#D94F31] whitespace-nowrap"
						>
							Back to Penn Admissions
						</a>
						<div class="flex gap-1">
							<span>{applicantName()}</span>
							<a href="/disclaimer" class="hover:underline text-white/80">Logout</a>
						</div>
					</div>
				</div>
			</header>

			<main class="bg-gray-100 py-10 min-h-[500px]">
				<div class="max-w-4xl mx-auto">
					<div class="bg-[#FFFFE0] p-6 text-sm text-slate-800">
						<h2 class="font-normal text-xl mb-4 text-slate-900">Welcome {applicantName()}</h2>
						
                        <div class="flex items-start gap-4">
                            <div class="flex-grow">
                                <h3 class="font-bold text-[#A8171E] text-md mb-2">Status Update</h3>
                                <p class="mb-4 text-black">
                                    New updates to your application were posted {school.statusLastPosted}.
                                </p>
                                <button
                                    on:click={handleViewUpdate}
                                    class="text-[#A8171E] font-normal text-sm hover:underline"
                                >
                                    View Update>>
                                </button>
                            </div>
                            <div class="w-1/3">
                                </div>
                        </div>

					</div>
				</div>
			</main>

			<footer class="bg-[#011F5B] text-white py-4 font-sans text-[13px]">
				<div class="max-w-4xl mx-auto px-10 flex flex-col items-center">
					<div class="flex gap-8 mb-2">
						<a href="/disclaimer" class="hover:underline">Penn Homepage</a>
						<a href="/disclaimer" class="hover:underline">Penn Admissions Homepage</a>
					</div>
					<div class="text-center text-xs">
						<p class="mb-1">University of Pennsylvania</p>
						<p class="mb-1">1 College Hall, Room 1, Philadelphia, PA 19104-6376</p>
						<p>(215) 898-7507</p>
					</div>
				</div>
                <div class="text-center text-[10px] pt-4 text-white/50">
                    PredictAdmit Simulation
                </div>
			</footer>


		{:else}
            {#if school.decision === 'admit'}
				<PennAccepted
					applicantName={applicantName()}
					schoolName={school.schoolName}
					primaryColor={school.primaryColor}
					footerDomain={school.footerDomain}
				/>
			{:else}
				<PennDenied
					applicantName={applicantName()}
					schoolName={school.schoolName}
					primaryColor={school.primaryColor}
					footerDomain={school.footerDomain}
				/>
			{/if}
		{/if}
	{/if}
</div>