<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';

	// School Config
	import { schoolConfigs } from '$lib/config/schools';

	// --- CORRECT IMPORTS ---
	import NorthwesternAccepted from '$lib/components/northwestern/NorthwesternAccepted.svelte';
	import NorthwesternDenied from '$lib/components/northwestern/NorthwesternDenied.svelte';

	// ----------------- CONFIGURATION -----------------

	const SLUG = 'northwestern';
    // Simulated config based on screenshot and standard Northwestern branding
	const school = {
		schoolName: 'Northwestern University',
		admissionsId: '4209942099', // From screenshot
		statusLastPosted: 'March 24, 2020', // From screenshot
		statusLinkLabel: 'Click here to view your admission decision',
		primaryColor: '#4E2A84', // Northwestern Purple
		secondaryColor: '#957DAD', // Lighter Purple/Mauve
		// Placeholder decision for simulation
		decision: schoolConfigs[SLUG]?.decision || 'admit',
        footerDomain: 'northwestern.edu',
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
	// Applicant name is "John" in the screenshot
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
		hasViewedUpdate = true;
	};
</script>

<svelte:head>
	<title>{school.schoolName} Undergraduate Admissions Portal</title>
</svelte:head>

<div class="min-h-screen font-sans text-slate-900 bg-white">
	
	{#if !authenticated}
    <header class="bg-[#4E2A84] border-b border-slate-300 text-white">
			<div class="max-w-7xl mx-auto px-6 py-2 text-[11px] flex justify-end gap-4 uppercase font-semibold border-b border-[#6f4b9c]">
				<a href="/disclaimer" class="hover:underline">For Counselors</a>
				<a href="/disclaimer" class="hover:underline">Viewbook</a>
				<a href="/disclaimer" class="hover:underline">Social Media</a>
				<a href="/disclaimer" class="hover:underline">Contact</a>
			</div>
			
			<div class="max-w-7xl mx-auto px-6 pt-4 pb-2 flex items-baseline justify-between">
				<div class="flex items-end gap-3">
					<span class="text-3xl font-serif font-extrabold text-white">
                        Northwestern
					</span>
					<span class="text-[14px] tracking-[0.1em] uppercase pb-[3px]">
						Undergraduate Admission
					</span>
				</div>
				<div class="text-[13px] text-white/90">
					{applicantName()}
				</div>
			</div>
			<div class="h-1 bg-[#957DAD]"></div>
		</header>

		<section class="bg-white min-h-[500px] py-10">
			<div class="max-w-4xl mx-auto px-10">
				<div class="max-w-3xl mx-auto text-[13px]">
                    
                    <h1 class="text-2xl font-normal mb-8 font-serif text-[#4E2A84] border-b border-slate-300 pb-2">
                        Portal Login
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

		<footer class="bg-[#4E2A84] h-8 flex items-center justify-center text-white text-[11px] font-normal">
			<div class="max-w-4xl mx-auto flex justify-between w-full px-10">
				<span>&copy; 2020</span>
				<span>PredictAdmit Simulation - Not affiliated with Northwestern University</span>
			</div>
		</footer>

	{:else}
    {#if !hasViewedUpdate}
            <header class="bg-[#4E2A84] text-white">
                <div class="max-w-7xl mx-auto px-6 py-2 text-[11px] flex justify-end gap-4 uppercase font-semibold">
					<a href="/disclaimer" class="hover:underline">For Counselors</a>
					<a href="/disclaimer" class="hover:underline">Viewbook</a>
					<a href="/disclaimer" class="hover:underline">Social Media</a>
					<a href="/disclaimer" class="hover:underline">Contact</a>
                    <div class="relative flex items-center">
                        <input 
                            type="text" 
                            placeholder="Search this site" 
                            class="bg-white/10 border border-white/30 text-white placeholder-white/80 text-[10px] py-0.5 px-2 w-32 focus:outline-none"
                        />
                        <button class="absolute right-0 top-0 bottom-0 px-1 text-white/70">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </div>
				</div>

                <div class="max-w-7xl mx-auto px-6 pt-2 pb-6">
					<div class="flex items-center justify-between">
						<div class="flex flex-col">
                            <span class="text-3xl font-serif font-extrabold text-white">
                                Northwestern
                            </span>
                            <span class="text-xl tracking-wider uppercase font-normal pt-1">
                                Undergraduate Admissions
                            </span>
						</div>
					</div>

                    <nav class="mt-4">
						<ul class="flex gap-6 text-[13px] font-normal">
							<li><a href="/disclaimer" class="hover:underline">Academics</a></li>
							<li><a href="/disclaimer" class="hover:underline">Student Life</a></li>
							<li><a href="/disclaimer" class="hover:underline">Tuition and Aid</a></li>
							<li><a href="/disclaimer" class="hover:underline">Visit and Engage</a></li>
							<li><a href="/disclaimer" class="hover:underline">Apply</a></li>
							<li><a href="/disclaimer" class="hover:underline">FAQs</a></li>
						</ul>
					</nav>
				</div>
			</header>

            <main class="bg-white py-8 min-h-[500px]">
                <div class="max-w-7xl mx-auto px-6">
                    
                    <div class="flex border-b border-gray-300 mb-6">
                        <div class="bg-[#4E2A84] text-white px-4 py-2 text-sm font-semibold border-r border-white">
                            Application Status
                        </div>
                        <div class="text-[#4E2A84] px-4 py-2 text-sm font-semibold hover:bg-gray-100 cursor-pointer">
                            Financial Aid Status
                        </div>
                        <div class="flex-grow border-b-2 border-[#4E2A84]"></div>
                    </div>
                    
                    <div class="max-w-2xl">
                        <h2 class="font-normal text-3xl mb-4 text-slate-900">Welcome {applicantName()},</h2>
                        
                        <p class="text-sm text-red-700 mb-4">
                            This page is your application status portal and will be used to monitor the progress of your application and to communicate any important updates or changes to your application. When decisions become available they will also be posted here.
                        </p>

                        <p class="text-sm text-slate-700 mb-6">
                            If you have any questions please reach out to us at <a href="mailto:ug-admission@northwestern.edu" class="text-blue-600 hover:underline">ug-admission@northwestern.edu</a> or (847) 491-7271 and provide the following reference number: <span class="font-bold">{school.admissionsId}</span>.
                        </p>
                        
                        <h3 class="font-bold text-lg mb-2 text-slate-800 border-b border-gray-300 pb-1">Status Update</h3>
                        <p class="mb-2 text-sm text-black">
                            An update to your application was last posted {school.statusLastPosted}.
                        </p>
                        <button
                            on:click={handleViewUpdate}
                            class="text-blue-600 text-sm hover:underline font-semibold"
                        >
                            {school.statusLinkLabel}
                        </button>
                        
                        <div class="mt-8 border-t border-gray-300 pt-4 max-w-lg">
                            <h3 class="font-bold text-lg mb-2 text-slate-800">Account Tools:</h3>
                            <div class="flex gap-4 text-sm text-blue-600">
                                <a href="/disclaimer" class="hover:underline">Change Email Address</a>
                                <a href="/disclaimer" class="hover:underline">Change Password</a>
                                <a href="/disclaimer" class="hover:underline">Logout</a>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

			<footer class="bg-[#4E2A84] text-white py-10 font-sans">
				<div class="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-8 text-[13px]">
					<div>
                        <h4 class="font-bold text-white mb-2">Northwestern University</h4>
						<p class="text-[12px] leading-relaxed mb-4">
							&copy; 2020 Northwestern University
							<br />
							<a href="/disclaimer" class="text-white/80 hover:underline">Disclaimer</a>
							<br />
							<a href="/disclaimer" class="text-white/80 hover:underline">Campus Emergency Information</a>
							<br />
							<a href="/disclaimer" class="text-white/80 hover:underline">University Policies</a>
						</p>
					</div>

					<div>
						<h4 class="font-bold text-white mb-2">Office of Undergraduate Admission</h4>
						<div class="space-y-1 text-white/90 text-[12px]">
							<p>1801 Hinman Avenue</p>
							<p>Evanston, IL 60208</p>
							<p><a href="tel:8474917271" class="hover:underline">(847) 491-7271</a></p>
							<p class="pt-2">@: <a href="mailto:ug-admission@northwestern.edu" class="hover:underline">ug-admission@northwestern.edu</a></p>
						</div>
					</div>

					<div>
						<h4 class="font-bold text-white mb-2">Social Media</h4>
						<div class="flex gap-2 text-white/90">
                            <i class="fas fa-fw fa-facebook-f"></i>
                            <i class="fas fa-fw fa-twitter"></i>
                            <i class="fas fa-fw fa-instagram"></i>
                            <i class="fas fa-fw fa-youtube"></i>
                            <i class="fab fa-fw fa-tiktok"></i>
						</div>
					</div>

                    <div>
						<h4 class="font-bold text-white mb-2">Links</h4>
                        <div class="flex flex-col text-[12px]">
                            <a href="/disclaimer" class="text-white/80 hover:underline">Parking</a>
                            <a href="/disclaimer" class="text-white/80 hover:underline">Maps</a>
                            <a href="/disclaimer" class="text-white/80 hover:underline">Shuttles</a>
                            <a href="/disclaimer" class="text-white/80 hover:underline">Directory</a>
                            <a href="/disclaimer" class="text-white/80 hover:underline">Bookstore</a>
                            <a href="/disclaimer" class="text-white/80 hover:underline">Library</a>
                        </div>
					</div>
				</div>

			</footer>


		{:else}
            {#if school.decision === 'admit'}
				<NorthwesternAccepted
					applicantName={applicantName()}
					schoolName={school.schoolName}
					primaryColor={school.primaryColor}
					footerDomain={school.footerDomain}
				/>
			{:else}
				<NorthwesternDenied
					applicantName={applicantName()}
					schoolName={school.schoolName}
					primaryColor={school.primaryColor}
					footerDomain={school.footerDomain}
				/>
			{/if}
		{/if}
	{/if}
</div>