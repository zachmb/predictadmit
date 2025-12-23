<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { schoolConfigs } from '$lib/config/schools';

	// Placeholder Decision Components (for completeness, although not requested yet)
	import CaltechAccepted from '$lib/components/caltech/CaltechAccepted.svelte';
	import CaltechDenied from '$lib/components/caltech/CaltechDenied.svelte';

	// ----------------- CONFIGURATION -----------------

	const SLUG = 'caltech';
	const CALTECH_PRIMARY_COLOR = '#E15000'; // Caltech Orange (for branding/header)
	const INSTITUTIONAL_BLUE = '#003399'; // Color for status box
	const HIGHLIGHT_YELLOW = '#FFFFCC'; // Color for the update status container (based on Penn screenshot)

	const school = {
		schoolName: 'California Institute of Technology',
		admissionsId: '987654321', // Placeholder
		statusLastPosted: 'March 13, 2020', // Based on JHU example screenshot time
		primaryColor: CALTECH_PRIMARY_COLOR,
		secondaryColor: '#F0F0F0',
		decisionDateText: 'Saturday, March 14 at 10 a.m. Pacific Time', // Placeholder for decision release
		// Placeholder decision for simulation
		decision: schoolConfigs[SLUG]?.decision || 'admit',
		footerDomain: 'caltech.edu'
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
	const applicantName = () => profile.name || 'John Doe';
    const applicantEmail = () => profile.email || 'johndoe@example.com';

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
		// When the user clicks "View your decision", we show the decision component.
		hasViewedUpdate = true;
	};
</script>

<svelte:head>
	<title>Caltech Undergraduate Admissions</title>
</svelte:head>

<div class="min-h-screen font-sans text-slate-800 bg-white">
	
	{#if !authenticated}
	<header class="bg-white border-b border-gray-200">
			<div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<span class="text-2xl font-serif font-bold" style="color: {school.primaryColor};">Caltech</span>
					<span class="text-sm font-light uppercase tracking-widest text-slate-700">Undergraduate Admissions</span>
				</div>
				<div class="text-xs">
					<a href="/disclaimer" class="hover:text-blue-700 mx-2">Contact</a>
					<span class="text-gray-300">|</span>
					<a href="/disclaimer" class="hover:text-blue-700 mx-2">Apply</a>
				</div>
			</div>
		</header>

		<main class="bg-white min-h-[500px] py-24">
			<div class="max-w-xl mx-auto px-6 text-[13px]">
				
				<h1 class="text-2xl font-normal mb-8 text-slate-900">
					Login
				</h1>

				<div class="px-4 py-2 mb-8 text-[13px] font-normal border" style="border-color: #A3C989; background-color: #F1FCE8;">
					To log in, please enter your email address and password.
				</div>

				<form class="space-y-4 max-w-[500px] mx-auto" on:submit={handleLogin}>
					{#if error}
						<p class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2" role="alert">{error}</p>
					{/if}
                    
					<div class="flex items-center gap-2">
						<label for="portal-email" class="text-[13px] font-normal text-slate-900 w-32 text-right">
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
						<label for="portal-password" class="text-[13px] font-normal text-slate-900 w-32 text-right">
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
							class="text-[12px] text-blue-800 hover:underline ml-6 whitespace-nowrap"
						>
							Forgot Your Password?
						</a>
					</div>


					<div class="flex items-center gap-3 pt-4">
						<div class="w-32"></div> 
						
						<button
							type="submit"
							class="border border-black bg-gray-300 px-4 py-1 text-[12px] font-normal text-black hover:bg-gray-400 transition-colors"
						>
							Login
						</button>
						<button
							type="button"
							class="border border-slate-400 bg-slate-100 px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-200"
							on:click={handleLoadSavedLogin}
						>
							Load saved PredictAdmit login
						</button>
					</div>

					<p class="pt-6 text-[11px] leading-relaxed text-slate-600 max-w-[480px] mx-auto">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<footer style="background-color: {school.primaryColor};" class="h-10 flex items-center justify-center text-white text-[11px] font-normal">
			<div class="max-w-6xl mx-auto flex justify-between w-full px-6">
				<span>&copy; 2019</span>
				<span>PredictAdmit.com simulation - Not affiliated with California Institute of Technology</span>
			</div>
		</footer>


	{:else}
	{#if !hasViewedUpdate}
			<header class="bg-white border-b border-gray-200">
				<div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<span class="text-2xl font-serif font-bold" style="color: {school.primaryColor};">Caltech</span>
						<span class="text-sm font-light uppercase tracking-widest text-slate-700">Undergraduate Admissions</span>
					</div>
					<a href="/disclaimer" class="text-xs text-blue-700 hover:underline">Logout</a>
				</div>
			</header>

			<main class="bg-white py-8 min-h-[700px]">
				<div class="max-w-4xl mx-auto px-6">
					
					<h1 class="text-3xl font-serif font-bold mb-4" style="color: {school.primaryColor};">
						Welcome to the Beaver Breakroom, {applicantName()}!
					</h1>
					
					<p class="text-sm text-slate-700 mb-4 leading-relaxed">
						Kickback, relax and know the hardest part is done – you’ve applied! We are grateful you decided to submit an application to Caltech.
					</p>
					<p class="text-sm text-slate-700 mb-6 leading-relaxed">
						The Beaver Breakroom is a space designed to let you learn more about the status of your application and provides you a way to update your application.
					</p>

					<p class="text-sm text-slate-700 mb-8 font-semibold">
						<span class="text-red-600">Please note</span> - the Caltech Undergraduate Admissions Office **will not** share information about your application by phone or email.
					</p>

					<div class="p-6 my-6 text-2xl font-bold text-white" style="background-color: {INSTITUTIONAL_BLUE};">
						Current Application Status: <span class="uppercase">Decision Available</span>
					</div>

                    <div class="mb-12 p-4 border border-yellow-400 shadow-inner" style="background-color: {HIGHLIGHT_YELLOW};">
						<p class="text-base text-slate-800 font-bold mb-3">
							New updates to your application were posted {school.statusLastPosted}.
						</p>
                        <p class="text-sm text-slate-700 mb-4">
                            Your admission decision is now available.
                        </p>
                        
						<button
							on:click={handleViewUpdate}
							class="text-sm font-semibold px-4 py-1 text-black bg-gray-200 border border-gray-500 shadow-md hover:bg-gray-300 active:shadow-inner"
						>
							View Update >>
						</button>
					</div>


					<h2 class="text-xl font-bold mb-4" style="color: {CALTECH_PRIMARY_COLOR};">Application Checklist</h2>
					
					<table class="w-full text-sm text-left border border-gray-300 mb-8">
						<thead class="bg-gray-100">
							<tr>
								<th class="px-4 py-2 font-bold">Status</th>
								<th class="px-4 py-2 font-bold">Details</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="px-4 py-2 text-green-700 font-semibold">✔ Received</td>
								<td class="px-4 py-2">Application</td>
							</tr>
							<tr>
								<td class="px-4 py-2 text-green-700 font-semibold">✔ Received</td>
								<td class="px-4 py-2">Transcript for Gaithersburg High School</td>
							</tr>
							<tr>
								<td class="px-4 py-2 text-green-700 font-semibold">✔ Received</td>
								<td class="px-4 py-2">Signed 2021 Parent Tax Return or Parent Non-Tax Filer's Statement</td>
							</tr>
						</tbody>
					</table>

					<h2 class="text-xl font-bold mb-4" style="color: {CALTECH_PRIMARY_COLOR};">Forms</h2>
					<p class="text-sm mb-6 text-slate-700">
						<span class="text-green-700 font-semibold">✔ 11/06/2022</span> Caltech QuestBridge Supplement <a href="/disclaimer" class="text-blue-600 hover:underline ml-1">Display</a>
					</p>
					
					<h2 class="text-xl font-bold mb-4" style="color: {CALTECH_PRIMARY_COLOR};">Optional Application Materials</h2>
					<p class="text-sm text-slate-700 mb-4 leading-relaxed">
						Optional. There’s that word again that can make students start to panic. At Caltech, we **strongly** believe that we have asked in our application what we need to know about a student who applies to Caltech. However, we recognize that sometimes students want to add more materials to their application. If you **strongly** believe that additional material will help us, you may help your application. Click <a href="/disclaimer" class="text-blue-600 hover:underline">here</a> to upload.
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
			</main>
			
			<footer class="bg-gray-800 text-white py-6 text-sm font-normal">
				<div class="max-w-6xl mx-auto px-6">
					
					<div class="flex justify-between items-start text-[12px] pb-4 border-b border-gray-700 mb-4">
						<div class="flex gap-6">
							<a href="/disclaimer" class="hover:underline">Contact</a>
							<a href="/disclaimer" class="hover:underline">Privacy Policy</a>
							<a href="/disclaimer" class="hover:underline">Report Issue</a>
						</div>
					</div>

					<div class="flex justify-between w-full text-[11px] text-gray-400">
						<span>&copy; 2019-2020 California Institute of Technology. All rights reserved.</span>
						<span>1200 E California Blvd, Pasadena, CA 91125</span>
					</div>
				</div>
			</footer>

		{:else}
			{#if school.decision === 'admit'}
				<CaltechAccepted
					applicantName={applicantName()}
					schoolName={school.schoolName}
					primaryColor={school.primaryColor}
					footerDomain={school.footerDomain}
				/>
			{:else}
				<CaltechDenied
					applicantName={applicantName()}
					schoolName={school.schoolName}
					primaryColor={school.primaryColor}
					footerDomain={school.footerDomain}
				/>
			{/if}
		{/if}
	{/if}
</div>