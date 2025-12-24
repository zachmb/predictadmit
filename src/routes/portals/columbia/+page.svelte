<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';

	// School Config
	import { schoolConfigs } from '$lib/config/schools';

	// --- CORRECT IMPORTS ---
	import ColumbiaAccepted from '$lib/components/columbia/ColumbiaAccepted.svelte';
	import ColumbiaDenied from '$lib/components/columbia/ColumbiaDenied.svelte';

	// ----------------- CONFIGURATION -----------------

	const SLUG = 'columbia';
    // Simulated config based on screenshot and standard Columbia branding
	const school = {
		schoolName: 'Columbia University',
		admissionsId: '094598420', // From screenshot
		statusLastPosted: 'March 25th, 2020', // From screenshot
		primaryColor: '#0039A6', // Dark Columbia Blue/Navy
		secondaryColor: '#99CCFF', // Light Blue/Sky Blue (for gradient)
		// Placeholder decision for simulation
		decision: schoolConfigs[SLUG]?.decision || 'admit',
        footerDomain: 'columbia.edu',
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

<div class="min-h-screen font-sans text-slate-800 bg-white">
	
	{#if !authenticated}
    <header class="bg-white border-b border-slate-300">
			<div class="h-16" style="background-image: linear-gradient(to bottom, {school.secondaryColor}, {school.primaryColor}00);">
				<div class="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
					<div class="flex items-center gap-3">
                        <span class="text-xl font-serif font-extrabold" style="color: {school.primaryColor};">COLUMBIA</span>
						<span class="text-sm font-light uppercase tracking-wider" style="color: {school.primaryColor};">Undergraduate Admissions</span>
					</div>
					<span class="text-xs font-light" style="color: {school.primaryColor};">Login to your applicant status page</span>
				</div>
			</div>
		</header>

		<main class="bg-white min-h-[500px] py-20">
			<div class="max-w-xl mx-auto px-6 text-base">
                
                <h1 class="text-3xl font-normal mb-8 text-slate-900">
                    Applicant Portal Login
                </h1>

                <div class="border border-blue-700 bg-blue-50 px-4 py-3 mb-6 text-[13px] text-slate-900 font-normal max-w-full">
                    To access your status page, please enter your registered email address and password.
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
							class="border border-slate-400 bg-white px-2 py-1 text-[13px] w-64 shadow-inner"
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
                            class="text-[12px] text-blue-800 hover:underline ml-4 whitespace-nowrap"
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
		</main>

		<footer class="bg-[#0039A6] h-8 flex items-center justify-center text-white text-[11px] font-normal">
			<div class="max-w-4xl mx-auto flex justify-between w-full px-10">
				<span>&copy; 2020</span>
				<span>PredictAdmit Simulation - Not affiliated with Columbia University</span>
			</div>
		</footer>

	{:else}
    {#if !hasViewedUpdate}
			<header class="text-slate-800 border-b border-slate-300" style="background-image: linear-gradient(to bottom, {school.secondaryColor}, {school.primaryColor}00);">
				
				<div class="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<span class="text-xl font-serif font-extrabold" style="color: {school.primaryColor};">COLUMBIA</span>
						<span class="text-sm font-light uppercase tracking-wider" style="color: {school.primaryColor};">Undergraduate Admissions</span>
					</div>
					<div class="text-[11px] text-slate-600">
						Search Status Log-out
					</div>
				</div>

				<nav class="max-w-7xl mx-auto px-6 pb-2 pt-1 flex justify-between items-end">
					<ul class="flex gap-4 text-sm font-normal">
						<li><a href="/disclaimer" class="hover:underline text-slate-800 border-b-2 border-transparent hover:border-slate-800 pb-1">Explore</a></li>
						<li><a href="/disclaimer" class="hover:underline text-slate-800 border-b-2 border-transparent hover:border-slate-800 pb-1">Learn</a></li>
						<li><a href="/disclaimer" class="hover:underline text-slate-800 border-b-2 border-transparent hover:border-slate-800 pb-1">Visit</a></li>
						<li><a href="/disclaimer" class="hover:underline text-slate-800 border-b-2 border-transparent hover:border-slate-800 pb-1">Apply</a></li>
						<li><a href="/disclaimer" class="hover:underline text-slate-800 border-b-2 border-transparent hover:border-slate-800 pb-1">Ask</a></li>
						<li><a href="/disclaimer" class="hover:underline text-slate-800 border-b-2 border-transparent hover:border-slate-800 pb-1">Financial Aid</a></li>
					</ul>
					<div class="text-[11px] font-semibold flex gap-3 text-slate-600">
						<span class="border border-slate-400 px-2 py-0.5 bg-gray-100">HOME</span>
						<span>MORT NETS</span>
						<span>FDR KSNK SHCS</span>
						<span>AD AMRSH</span>
					</div>
				</nav>
			</header>

            <main class="bg-white py-8 min-h-[500px]">
				<div class="max-w-7xl mx-auto px-6">
					
					<div class="grid grid-cols-3 gap-3 mb-8">
						<div class="h-40 bg-gray-200 flex items-center justify-center text-sm text-slate-500">
							[Image: Students on campus]
						</div>
						<div class="h-40 bg-gray-200 flex items-center justify-center text-sm text-slate-500">
							[Image: Columbia Lion statue]
						</div>
						<div class="h-40 bg-gray-200 flex items-center justify-center text-sm text-slate-500">
							[Image: Library Interior]
						</div>
					</div>
					
					<div class="max-w-3xl mx-auto">
						
						<h2 class="font-normal text-2xl mb-2 text-slate-900">
							Welcome to your applicant status page, {applicantName()}!
						</h2>
						
						<p class="text-sm text-slate-600 mb-6">
							Columbia ID: {school.admissionsId}
							<span class="float-right font-bold text-slate-800">2020 First-Year Regular Decision - Columbia Engineering</span>
						</p>
						
						<p class="text-sm text-slate-700 mb-6 max-w-2xl">
							Thank you for submitting your application to Columbia University in the City of New York. Please use this status page to provide us with application updates and to explore more about Columbia's application process.
						</p>

                        <div class="bg-[#FFFFE0] p-4 text-sm text-slate-800 border-t border-b border-yellow-300 mb-6 max-w-xl">
							<h3 class="font-bold text-md mb-1 text-slate-800">Status Update:</h3>
							<p class="mb-2 text-black">
								New updates to your application were posted {school.statusLastPosted}.
							</p>
							<button
								on:click={handleViewUpdate}
								class="text-red-700 text-sm hover:underline"
							>
								View Update>>
							</button>
						</div>

						<h3 class="font-bold text-md mb-2 text-slate-800 border-b border-gray-300 pb-1">Verify Address</h3>
						<p class="text-sm text-slate-700 mb-4">
							We have your address(es) listed as follows:
						</p>
						
						<div class="grid grid-cols-3 gap-8 text-[12px] max-w-3xl mb-4">
							<div class="space-y-0.5">
								<h4 class="font-bold">Permanent Address</h4>
								<p>John Doe's Residence</p>
								<p>123 Fake Street</p>
								<p>New York, NY 10025</p>
								<p>United States</p>
							</div>
							<div class="space-y-0.5">
								<h4 class="font-bold">Mailing Address</h4>
								<p>c/o John's Relative</p>
								<p>23-13 Some</p>
								<p>Nonexistent Town, 00000</p>
								<p>United States</p>
							</div>
							<div class="space-y-0.5">
								<h4 class="font-bold">Billing Address</h4>
								<p>Same as Mailing Address</p>
								<p>23-13 Some</p>
								<p>Nonexistent Town, 00000</p>
								<p>United States</p>
							</div>
						</div>

						<a href="/disclaimer" class="text-blue-600 text-[13px] hover:underline block mb-8">
							Edit Address(es)
						</a>

						<div class="mt-4 border-t border-gray-300 pt-4">
							<span class="font-bold text-[13px] text-slate-800">Account Tools:</span>
							<a href="/disclaimer" class="text-blue-600 text-[13px] hover:underline ml-2">Change Email Address</a>
							<span class="text-slate-400 mx-1">|</span>
							<a href="/disclaimer" class="text-blue-600 text-[13px] hover:underline">Change Password</a>
							<span class="text-slate-400 mx-1">|</span>
							<a href="/disclaimer" class="text-blue-600 text-[13px] hover:underline">Logout</a>
						</div>
					</div>
				</div>
			</main>

            <footer class="text-slate-700 py-10 font-sans text-sm" style="background-image: linear-gradient(to top, {school.secondaryColor}, {school.primaryColor}00);">
				<div class="max-w-7xl mx-auto px-6 flex justify-between">
					
                    <div class="w-1/3">
						<h4 class="font-bold text-slate-800 mb-2">Contact Us</h4>
						<div class="text-[12px] leading-relaxed">
							<p>Columbia Undergraduate Admissions</p>
							<p>212 Hamilton Hall, Mail Code 2807</p>
							<p>New York, NY 10027</p>
							<p>212-854-2522</p>
							<p class="mt-2"><a href="mailto:ugrad-ask@columbia.edu" class="text-blue-600 hover:underline">ugrad-ask@columbia.edu</a></p>
							<p><a href="/disclaimer" class="text-blue-600 hover:underline">About Admissions & Contact Info</a></p>
						</div>
					</div>

                    <div class="w-1/3">
						<h4 class="font-bold text-slate-800 mb-2">Related Websites</h4>
						<div class="flex flex-col gap-1 text-[12px]">
							<a href="/disclaimer" class="text-blue-600 hover:underline">Columbia College</a>
							<a href="/disclaimer" class="text-blue-600 hover:underline">The Fu Foundation School of Engineering and Applied Science</a>
							<a href="/disclaimer" class="text-blue-600 hover:underline">Columbia University Home</a>
						</div>
                        <div class="mt-4">
							<input type="text" placeholder="Search" class="border border-slate-400 p-1 text-[12px] w-64 block mb-1"/>
							<input type="text" placeholder="Directory" class="border border-slate-400 p-1 text-[12px] w-64 block mb-1"/>
							<button class="bg-slate-200 text-slate-700 text-[12px] px-3 py-1 mt-2 border border-slate-400">Logout</button>
						</div>
					</div>

                    <div class="w-1/3 text-right">
						<h4 class="font-bold text-slate-800 mb-2">Take a Virtual Tour</h4>
						<div class="flex justify-end gap-1 mb-4">
							<div class="w-4 h-4 bg-red-600 border border-slate-400"></div>
							<div class="w-4 h-4 bg-blue-600 border border-slate-400"></div>
							<div class="w-4 h-4 bg-pink-600 border border-slate-400"></div>
							<div class="w-4 h-4 bg-black border border-slate-400"></div>
						</div>
						<button class="bg-slate-700 text-white text-[13px] px-4 py-2 hover:bg-slate-800">
							Take a Virtual Tour
						</button>
					</div>
				</div>
                
                <div class="max-w-7xl mx-auto px-6 mt-8 text-center text-[10px] text-slate-600 border-t border-slate-400 pt-2">
                    <a href="/disclaimer" class="hover:underline mx-2">Privacy Policy</a>
                    <span class="mx-1">|</span>
                    <a href="/disclaimer" class="hover:underline mx-2">Terms of Use</a>
                    <span class="mx-1">|</span>
                    <a href="/disclaimer" class="hover:underline mx-2">Accessibility</a>
                    <span class="mx-1">|</span>
                    <a href="/disclaimer" class="hover:underline mx-2">Copyright &copy; 2019 Columbia University</a>
                    <span class="mx-1">|</span>
                    <a href="/disclaimer" class="hover:underline mx-2">Policies</a>
                </div>

			</footer>


		{:else}
            {#if school.decision === 'admit'}
				<ColumbiaAccepted
					applicantName={applicantName()}
					schoolName={school.schoolName}
					primaryColor={school.primaryColor}
					footerDomain={school.footerDomain}
				/>
			{:else}
				<ColumbiaDenied
					applicantName={applicantName()}
					schoolName={school.schoolName}
					primaryColor={school.primaryColor}
					footerDomain={school.footerDomain}
				/>
			{/if}
		{/if}
	{/if}
</div>