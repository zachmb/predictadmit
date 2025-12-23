<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';

	// School Config
	import { schoolConfigs } from '$lib/config/schools';

	// --- CORRECT IMPORTS ---
	import JHUAccepted from '$lib/components/jhu/JHUAccepted.svelte';
	import JHUDenied from '$lib/components/jhu/JHUDenied.svelte';

	// ----------------- CONFIGURATION -----------------

	const SLUG = 'jhu';
    // Simulated config based on screenshot and standard JHU branding
	const school = {
		schoolName: 'Johns Hopkins University',
		statusLastPosted: 'March 13, 2020', // From screenshot
		primaryColor: '#002D72', // JHU Blue/Navy
		// Placeholder decision for simulation
		decision: schoolConfigs[SLUG]?.decision || 'admit',
        footerDomain: 'jhu.edu',
        applicantName: 'John Doe',
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
	const applicantName = () => profile.name || school.applicantName; 

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
    <header class="h-10 border-b border-gray-300">
			<div class="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
				<div class="flex items-center gap-3">
                    <span class="text-xl font-serif font-extrabold tracking-wide" style="color: {school.primaryColor};">
                        JOHNS HOPKINS
                    </span>
                    <span class="text-[10px] uppercase tracking-wider text-slate-600 border-l border-slate-300 pl-2">
                        UNDERGRADUATE ADMISSIONS
                    </span>
				</div>
                <div class="text-[11px] text-slate-600">
                    {applicantName()}
                </div>
			</div>
		</header>

		<main class="bg-white min-h-[500px] py-20">
			<div class="max-w-xl mx-auto px-6 text-base">
                
                <h1 class="text-3xl font-normal mb-8 text-slate-900">
                    Applicant Portal Login
                </h1>

                <div class="border border-green-700 bg-[#E0FFE0] px-4 py-3 mb-6 text-[13px] text-slate-900 font-normal max-w-full">
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

		<footer class="bg-[#002D72] h-8 flex items-center justify-center text-white text-[11px] font-normal">
			<div class="max-w-4xl mx-auto flex justify-between w-full px-10">
				<span>&copy; 2020</span>
				<span>PredictAdmit Simulation - Not affiliated with Johns Hopkins University</span>
			</div>
		</footer>

	{:else}
    {#if !hasViewedUpdate}
            <header class="bg-white text-slate-800 border-b border-gray-300 pb-2">
                
                <div class="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-6 h-6 bg-slate-600 rounded-full"></div>
                        <span class="text-xl font-serif font-extrabold" style="color: {school.primaryColor};">DISCOVER JHU</span>
                        <span class="text-sm font-light uppercase tracking-wider text-slate-600">Undergraduate Admissions</span>
                    </div>
                    <div class="text-[13px] font-normal flex gap-4 text-slate-600">
                        <a href="/disclaimer" class="hover:underline">Contact</a>
                        <a href="/disclaimer" class="hover:underline">FAQ</a>
                        <a href="/disclaimer" class="border border-slate-400 px-3 py-1 bg-gray-100 hover:bg-gray-200">APPLY</a>
                        <a href="/disclaimer" class="hover:underline">Visit</a>
                    </div>
                </div>

                <nav class="max-w-6xl mx-auto px-6 pt-1">
                    <ul class="flex gap-8 text-[13px] font-semibold tracking-wider border-b border-gray-300 pb-1">
                        <li><a href="/disclaimer" class="hover:underline border-b-2 border-transparent hover:border-slate-800 pb-1">DISCOVER JHU</a></li>
                        <li><a href="/disclaimer" class="hover:underline border-b-2 border-transparent hover:border-slate-800 pb-1">EXPLORE ACADEMICS</a></li>
                        <li><a href="/disclaimer" class="hover:underline border-b-2 border-transparent hover:border-slate-800 pb-1">AFFORDING HOPKINS</a></li>
                        <li><a href="/disclaimer" class="hover:underline border-b-2 border-transparent hover:border-slate-800 pb-1">CAMPUS AND COMMUNITY</a></li>
                        <li><a href="/disclaimer" class="hover:underline border-b-2 border-transparent hover:border-slate-800 pb-1">APPLICATION PROCESS</a></li>
                    </ul>
                </nav>
			</header>

            <main class="bg-white py-16 min-h-[300px]">
                <div class="max-w-3xl mx-auto px-6 text-center bg-yellow-100 border border-yellow-300 p-8 rounded shadow-md">
                    
                    <h3 class="font-bold text-xl mb-4 text-slate-800 tracking-wider">Status Update</h3>
                    
                    <p class="mb-4 text-sm text-black">
                        An update to your application was last posted {school.statusLastPosted}.
                    </p>
                    
                    <button
                        on:click={handleViewUpdate}
                        class="text-blue-600 text-sm hover:underline font-semibold"
                    >
                        View your admissions decision.
                    </button>
                    
                    <div class="mt-8">
                        <a href="/disclaimer" class="text-xs font-semibold text-slate-600 hover:underline tracking-widest">LOG OUT</a>
                    </div>
                </div>
            </main>

			<footer class="bg-[#002D72] text-white py-10 font-sans text-sm">
				<div class="max-w-6xl mx-auto px-6 grid grid-cols-4 gap-8">
                    
                    <div>
                        <div class="flex items-center gap-2 mb-4">
                            <div class="w-8 h-8 bg-white rounded-full"></div>
                            <h4 class="font-bold text-white text-lg">JOHNS HOPKINS</h4>
                        </div>

                        <h5 class="font-semibold text-white mb-2 text-md">Office of Undergraduate Admissions</h5>
						
                        <div class="text-[12px] leading-relaxed space-y-2">
                            <p>(Mail only correspondence):</p>
                            <p>Mason Hall / 3400 N. Charles St.</p>
                            <p>Baltimore, MD 21218 USA</p>
                        </div>

                        <div class="text-[12px] leading-relaxed space-y-2 mt-4">
                            <p>(UPS address; do not use for mail)</p>
                            <p>3701 Wyman Park Dr.</p>
                            <p>Baltimore, MD 21218</p>
                        </div>

                        <div class="text-[12px] leading-relaxed space-y-2 mt-4">
                            <p>Tel: +1 (410) 516-8171</p>
                            <p>Fax: +1 (410) 516-6585</p>
                            <p><a href="mailto:gotojhu@jhu.edu" class="hover:underline">gotojhu@jhu.edu</a></p>
                        </div>
					</div>

                    <div>
						<h4 class="font-bold text-white mb-3 pt-6">Contact</h4>
						<div class="flex flex-col gap-1 text-[13px]">
                            <a href="/disclaimer" class="hover:underline">Contact</a>
                            <a href="/disclaimer" class="hover:underline">FAQ</a>
                            <a href="/disclaimer" class="hover:underline">Apply</a>
                            <a href="/disclaimer" class="hover:underline">Visit</a>
                            <a href="/disclaimer" class="hover:underline">Off-Campus Events</a>
                            <a href="/disclaimer" class="hover:underline">Virtual Tour</a>
                        </div>
					</div>

                    <div>
						<h4 class="font-bold text-white mb-3 pt-6">Join our mailing list</h4>
                        <button class="bg-red-600 text-white font-bold text-lg px-8 py-2 mb-4 hover:bg-red-700">
                            SAY HELLO
                        </button>
                        <p class="text-[12px] leading-relaxed mb-4">
                            Sign up to receive emails for events, news, info sessions, and other admission-related information.
                        </p>
                        
                        <div class="flex gap-3 text-white">
                            <i class="fas fa-fw fa-facebook-f"></i>
                            <i class="fas fa-fw fa-twitter"></i>
                            <i class="fas fa-fw fa-instagram"></i>
                            <i class="fas fa-fw fa-youtube"></i>
						</div>
					</div>

                    <div class="pt-6">
                        <p class="text-[12px] mb-4">&copy; 2014-2019 Johns Hopkins University. All rights reserved.</p>
                        <div class="flex flex-col gap-1 text-[12px] text-white/80">
                            <a href="/disclaimer" class="hover:underline">Clery Notice of Availability</a>
                            <a href="/disclaimer" class="hover:underline">Privacy Policy</a>
                            <a href="/disclaimer" class="hover:underline">Report Issue</a>
                            <a href="/disclaimer" class="hover:underline">Emergency Info</a>
                        </div>
                    </div>
				</div>

			</footer>


		{:else}
            {#if school.decision === 'admit'}
				<JHUAccepted
					applicantName={applicantName()}
					schoolName={school.schoolName}
					primaryColor={school.primaryColor}
					footerDomain={school.footerDomain}
				/>
			{:else}
				<JHUDenied
					applicantName={applicantName()}
					schoolName={school.schoolName}
					primaryColor={school.primaryColor}
					footerDomain={school.footerDomain}
				/>
			{/if}
		{/if}
	{/if}
</div>