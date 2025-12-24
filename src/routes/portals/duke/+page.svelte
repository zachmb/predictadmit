<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';

	// School Config
	import { schoolConfigs } from '$lib/config/schools';
	import DukeAccepted from '$lib/components/duke/DukeAccepted.svelte';
	import DukeDenied from '$lib/components/duke/DukeDenied.svelte';
	// --- Placeholder Decision Components (normally imported from $lib/components/duke/) ---
    // Note: Since you imported DukeAccepted/DukeDenied, I'll remove the inline placeholders 
    // to avoid redundancy and use the imported components in the final decision block.

	// ----------------- CONFIGURATION -----------------

	const SLUG = 'duke';
	const DUKE_PRIMARY_COLOR = '#003366'; // Duke Blue
	const DUKE_ACCENT_COLOR = '#E0F0FF'; // Very Light Blue/Near White for accents

	const school = {
		schoolName: 'Duke University',
		admissionsId: '4206942069', // From screenshot
		financialAidId: '689420', // From screenshot
		statusLastPosted: 'December 12, 2019', // From screenshot
		primaryColor: DUKE_PRIMARY_COLOR,
		secondaryColor: DUKE_ACCENT_COLOR,
		decisionDateText: 'Thursday, March 26 at 7 p.m. Eastern Time', // Key text from screenshot
		// Placeholder decision for simulation
		// Note: schoolConfigs is imported from external stores, but default to 'admit'
		decision: schoolConfigs[SLUG]?.decision || 'admit',
        footerDomain: 'duke.edu',
	};


	// ----------------- STATE -----------------

	let profile: UserProfile = { name: '', email: '', password: '' };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false; // Controls the transition to the decision page

	// ----------------- REACTIVE DERIVATIONS -----------------

	$: profile = $userProfile;
	const applicantName = () => profile.name || 'John'; 

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
		// When the user clicks "View Update >>", we show the decision component.
		hasViewedUpdate = true;
	};
</script>

<svelte:head>
	<title>{school.schoolName} Undergraduate Admissions Portal</title>
</svelte:head>

<div class="min-h-screen font-sans text-slate-800 bg-white">
	
	{#if !authenticated}
	<header class="bg-white border-b border-gray-200">
			<div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
				<div class="flex items-center gap-3">
                    <span class="text-2xl font-serif font-bold" style="color: {school.primaryColor};">Duke</span>
					<span class="text-sm font-light uppercase tracking-widest text-slate-700">Undergraduate Admissions</span>
				</div>
                <nav class="flex gap-6 text-sm font-semibold text-slate-800 uppercase tracking-wider">
					<a href="/disclaimer" class="hover:text-blue-700">OUR STUDENTS</a>
					<a href="/disclaimer" class="hover:text-blue-700">CAMPUS LIFE</a>
					<a href="/disclaimer" class="hover:text-blue-700">FINANCIAL SUPPORT</a>
                    <a href="/disclaimer" class="bg-slate-200 px-3 py-1 hover:bg-slate-300">VISIT</a>
					<a href="/disclaimer" class="bg-slate-200 px-3 py-1 hover:bg-slate-300">APPLY</a>
				</nav>
			</div>
		</header>

		<main class="bg-white min-h-[500px] pt-8 pb-12">
			<div class="max-w-xl mx-auto px-6 text-[13px]">
                
                <h1 class="text-2xl font-normal mb-6 text-slate-900">
                    Login
                </h1>

                <div class="bg-green-50 px-4 py-3 mb-6 text-[13px] text-slate-900 font-normal border border-green-200 max-w-full">
                    To log in, please enter your email address and password.
                </div>

				<form class="space-y-4 max-w-[500px]" on:submit={handleLogin}>
					{#if error}
						<p class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2" role="alert">{error}</p>
					{/if}

                    <div class="flex items-center gap-2">
						<label
							for="portal-email"
							class="text-[13px] font-normal text-slate-900 w-24 text-right"
						>
                            Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="border border-gray-400 bg-white px-2 py-1 text-[13px] w-64 shadow-inner"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

                    <div class="flex items-center gap-2">
						<label
							for="portal-password"
							class="text-[13px] font-normal text-slate-900 w-24 text-right"
						>
							Password
						</label>
                        <input
                            id="portal-password"
                            type="password"
                            class="border border-gray-400 bg-white px-2 py-1 text-[13px] w-32 shadow-inner"
                            bind:value={passwordInput}
                            autocomplete="current-password"
                        />
                        <a
                            href="/disclaimer"
                            class="text-[12px] text-blue-800 hover:underline ml-4 whitespace-nowrap"
                        >
                            Forgot Your Password?
                        </a>
					</div>


					<div class="flex items-center gap-3 pt-4">
                        <div class="w-24"></div> 
                        
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
		</main>

		<footer style="background-color: {school.primaryColor};" class="h-10 flex items-center justify-center text-white text-[11px] font-normal">
			<div class="max-w-6xl mx-auto flex justify-between w-full px-6">
				<span>&copy; DUKE.EDU 2019</span>
				<span>PredictAdmit Simulation - Not affiliated with Duke University</span>
			</div>
		</footer>


	{:else}
    {#if !hasViewedUpdate}
            <header class="bg-white border-b-4" style="border-color: {school.primaryColor};">
				<div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<span class="text-2xl font-serif font-bold" style="color: {school.primaryColor};">Duke</span>
						<span class="text-sm font-light uppercase tracking-widest text-slate-700">Undergraduate Admissions</span>
					</div>
					<nav class="flex gap-6 text-sm font-semibold text-slate-800 uppercase tracking-wider">
						<a href="/disclaimer" class="hover:text-blue-700">OUR STUDENTS</a>
						<a href="/disclaimer" class="hover:text-blue-700">CAMPUS LIFE</a>
						<a href="/disclaimer" class="hover:text-blue-700">FINANCIAL SUPPORT</a>
						<a href="/disclaimer" class="bg-slate-200 px-3 py-1 hover:bg-slate-300">VISIT</a>
						<a href="/disclaimer" class="bg-slate-200 px-3 py-1 hover:bg-slate-300">APPLY</a>
					</nav>
				</div>
			</header>

			<main class="bg-white py-12 min-h-[500px]">
				<div class="max-w-6xl mx-auto px-6">
					
					<div class="max-w-4xl mx-auto text-sm">
						
						<div class="flex justify-end text-[12px] font-semibold text-slate-600">
							{applicantName()} <a href="/disclaimer" class="text-blue-700 hover:underline ml-1">Logout</a>
						</div>

						<div class="mt-4 flex justify-between items-start">
							<h2 class="text-3xl font-normal mb-2 text-slate-900">
								Welcome, {applicantName()}!
							</h2>
							<div class="text-sm text-right leading-relaxed">
								<p>Admissions ID: <span class="font-semibold">{school.admissionsId}</span></p>
								<p>Financial Aid ID: <span class="font-semibold">{school.financialAidId}</span></p>
							</div>
						</div>
						
						<p class="text-base text-slate-700 mb-8 max-w-2xl">
							Thank you for submitting your application to Duke University!
						</p>

						<div class="mb-8 p-4 border-l-4" style="border-color: {school.primaryColor}; background-color: {school.secondaryColor};">
							<p class="text-base text-black">
								Admission decisions for Regular Decision (and deferred Early Decision) candidates will be available 
								**{school.decisionDateText}**.
							</p>
						</div>

						<div class="flex gap-1 border-b border-gray-300 mb-8">
							<button class="border-b-2 font-semibold px-4 py-2 text-sm" style="border-color: {school.primaryColor}; color: {school.primaryColor};">
								Admissions
							</button>
							<button class="text-gray-600 border-b-2 border-transparent px-4 py-2 text-sm hover:border-gray-400">
								Financial Aid
							</button>
						</div>

						<h3 class="font-bold text-lg mb-2 text-slate-900">Status Update</h3>
						<div class="mb-8">
							<p class="mb-2 text-sm text-slate-700">
								An update to your application was last posted {school.statusLastPosted}.
							</p>
							<button
								on:click={handleViewUpdate}
								class="text-red-700 text-sm hover:underline"
							>
								View Update >>
							</button>
						</div>

						<h3 class="font-bold text-lg mb-4 text-slate-900">Forms</h3>
						<p class="text-sm text-slate-600">
							All application documents have been received.
						</p>

						<div class="mt-12 border-t border-gray-300 pt-4 text-[13px] text-slate-700">
							<span class="font-bold">Account Tools:</span>
							<a href="/disclaimer" class="text-blue-600 hover:underline ml-2">Change Email Address</a>
							<span class="text-slate-400 mx-1">|</span>
							<a href="/disclaimer" class="text-blue-600 hover:underline">Change Password</a>
							<span class="text-slate-400 mx-1">|</span>
							<a href="/disclaimer" class="text-blue-600 hover:underline">Logout</a>
						</div>
					</div>
				</div>
			</main>

			<footer style="background-color: {school.primaryColor};" class="text-white py-6 text-sm font-normal">
				<div class="max-w-6xl mx-auto px-6">
					
					<div class="flex justify-between items-start text-[12px] pb-4 border-b border-gray-500 mb-4">
						<div class="flex gap-6 uppercase">
							<a href="/disclaimer" class="hover:underline">For Counselors</a>
							<a href="/disclaimer" class="hover:underline">For Parents</a>
							<a href="/disclaimer" class="hover:underline">Resources + Tools</a>
							<a href="/disclaimer" class="hover:underline">FAQs</a>
							<a href="/disclaimer" class="hover:underline">Contact Us</a>
						</div>
						<div class="flex gap-2">
							<div class="w-4 h-4 bg-white border border-white"></div>
							<div class="w-4 h-4 bg-white border border-white"></div>
							<div class="w-4 h-4 bg-white border border-white"></div>
							<div class="w-4 h-4 bg-white border border-white"></div>
						</div>
					</div>

					<div class="flex justify-between w-full text-[11px] text-gray-400">
						<span>&copy; DUKE.EDU 2019</span>
						<span>Duke University - Durham, NC 27708</span>
					</div>
				</div>
			</footer>

		{:else}
            {#if school.decision === 'admit'}
				<DukeAccepted
					applicantName={applicantName()}
					schoolName={school.schoolName}
					primaryColor={school.primaryColor}
					footerDomain={school.footerDomain}
				/>
			{:else}
				<DukeDenied
					applicantName={applicantName()}
					schoolName={school.schoolName}
					primaryColor={school.primaryColor}
					footerDomain={school.footerDomain}
				/>
			{/if}
		{/if}
	{/if}
</div>