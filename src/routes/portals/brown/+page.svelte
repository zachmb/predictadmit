<script lang="ts">
	// Svelte Stores and Types
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';

	// Shared Components and Configuration
	import { schoolConfigs } from '$lib/config/schools';

	// School-Specific Components (Decision Letters)
    // NOTE: These components must exist in $lib/components/brown/
	import BrownAccepted from '$lib/components/brown/BrownAccepted.svelte';
	import BrownDenied from '$lib/components/brown/BrownDenied.svelte';
    
    // --- Component Configuration ---
	const SCHOOL_DATA = schoolConfigs.brown;
	// Brown's primary color
	const BROWN_RED = '#4E2A2A'; 

	// --- State Variables (Authentication Logic) ---
	let profile: UserProfile = { name: '', email: '', password: '' };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;

	// Subscribe to the global user profile store
	$: profile = $userProfile;

    // Helper functions for dynamic data
	const applicantName = () => profile.name || 'Applicant';
    const applicantFirstName = () => profile.name.split(' ')[0] || 'John';
    const applicantLastName = () => profile.name.split(' ').slice(-1).join(' ') || 'Doe';
    const applicantEmail = () => profile.email || '1234@notanemail.com';
    // NOTE: Assuming default placeholder for fields not in userProfile store (DOB, Address)
    
    // HANDLERS

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

		if (!SCHOOL_DATA) {
			error = 'Unknown portal.';
			authenticated = false;
			return;
		}

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
	<title>{SCHOOL_DATA.schoolName} Admissions Portal</title>
</svelte:head>

<div class="bg-slate-200 text-slate-900 font-serif flex flex-col {authenticated ? 'min-h-screen' : ''}">
	{#if !authenticated}
		<div class="bg-white">
            <header class="bg-white border-b border-slate-300">
                <div class="max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
                    <div class="flex items-baseline gap-3">
                        <span class="text-3xl font-serif" style={`color: ${SCHOOL_DATA.primaryColor};`}>
                            {SCHOOL_DATA.logoPrimary}
                        </span>
                        <span class="text-[11px] tracking-[0.18em] uppercase text-slate-700">
                            {SCHOOL_DATA.logoSecondary}
                        </span>
                    </div>
                    <div class="text-[11px] text-slate-700">
                        {applicantName()}
                    </div>
                </div>
                <div class="h-8" style={`background-color: ${SCHOOL_DATA.primaryColor};`}></div>
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
                                for="portal-email"
                                class="w-32 text-[12px] font-semibold text-slate-900 text-right"
                            >
                                Email Address
                            </label>
                            <input
                                id="portal-email"
                                type="email"
                                class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80"
                                bind:value={emailInput}
                                autocomplete="email"
                            />
                        </div>

                        <div class="flex items-center gap-4">
                            <label
                                for="portal-password"
                                class="w-32 text-[12px] font-semibold text-slate-900 text-right"
                            >
                                Password
                            </label>
                            <input
                                id="portal-password"
                                type="password"
                                class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80"
                                bind:value={passwordInput}
                                autocomplete="current-password"
                            />
                            <a
                                href="/disclaimer"
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
                                <button
                                    type="button"
                                    class="border border-slate-400 bg-slate-100 px-3 py-1 text-[11px] hover:bg-slate-200 active:bg-slate-300"
                                    on:click={handleLoadSavedLogin}
                                >
                                    Load saved PredictAdmit login
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
        </div>
        
        <footer>
			<div
				class="h-10 flex items-center"
				style={`background-color: ${SCHOOL_DATA.primaryColor};`}
			>
				<div class="max-w-5xl mx-auto px-6 w-full flex items-center justify-between text-[11px] text-white">
					<span>&copy; {SCHOOL_DATA.footerDomain} 2019</span>
					<span class="opacity-80">
						PredictAdmit.com simulation · Not affiliated with {SCHOOL_DATA.schoolName}
					</span>
				</div>
			</div>
		</footer>
	{:else}
        {#if !hasViewedUpdate}
            <div class="flex-grow flex flex-col min-h-screen bg-white">
                
                <header class="bg-white border-b border-gray-300">
                    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <span class="text-2xl font-serif text-slate-900 font-normal tracking-wide">BROWN</span>
                        
                        <div class="text-xs text-slate-700">
                            {applicantName()} <a href="/" class="text-blue-800 hover:underline">Logout</a>
                        </div>
                    </div>
                </header>

                <main class="max-w-7xl mx-auto px-6 pt-6 pb-10 flex-1 text-sm text-slate-800">
                    
                    <p class="mb-4 text-base font-normal">
                        {applicantFirstName()}, thank you for applying to Brown University!
                    </p>
                    <p class="mb-8 text-xs text-slate-600 leading-relaxed max-w-2xl">
                        It is important that, since releasing the regular admission decision on March 26, 2020, you check 
                        your Brown portal regularly for updates and below.
                    </p>

                    <div class="grid grid-cols-2 gap-x-12">
                        
                        <div class="space-y-6">
                            <h2 class="text-base font-bold mb-2">Your Information</h2>
                            <p class="text-xs">Reference ID: 123456789</p>
                            <p class="text-xs">First: {applicantFirstName()}</p>
                            <p class="text-xs">Last: {applicantLastName()}</p>
                            
                            <h2 class="text-base font-bold pt-4 mb-2">Portal Tools</h2>
                            <p class="text-xs max-w-sm leading-relaxed">
                                Update financial aid to-do list, change your email address, or update your academic record. If you need to update the address you listed on your Common Application, please 
                                <a href="#" class="text-red-700 underline hover:no-underline">email us.</a>
                            </p>
                            
                            <p class="text-xs max-w-sm leading-relaxed">
                                To view your Financial Aid application status, please visit the Brown Financial Aid Portal. For technical assistance, please contact the IT Service Center at (401) 863-HELP. Office hours can be found <a href="#" class="text-red-700 underline hover:no-underline">here.</a>
                            </p>
                        </div>
                        
                        <div class="space-y-6">
                            
                            <div class="border border-yellow-500 bg-yellow-100 p-3 text-xs">
                                <h3 class="font-bold mb-1">Status Update</h3>
                                <p>An update to your application was last posted December 17, 2019.</p>
                            </div>
                            
                            <button on:click={handleViewUpdate} class="block w-full border border-gray-400 bg-gray-50 p-3 text-sm text-center font-bold text-slate-900 hover:bg-gray-200 active:bg-gray-300 transition duration-150 ease-in-out">
                                View Your Admissions Decision
                            </button>

                            <h3 class="text-base font-bold pt-4 mb-2">Upload Materials</h3>
                            <p class="text-xs max-w-md leading-relaxed">
                                **Supplementary Materials:** While not expected, applicants to the College may submit supplementary materials for consideration. This inquiry into status admitted is sheer **do not submit** restricted materials. We allow the opportunity to do so in an effort to accommodate students who wish to share additional information when it is supplementary matter.
                            </p>

                            <h3 class="text-base font-bold pt-4 mb-2">Academic Paper/Research Abstract</h3>
                            <p class="text-xs max-w-md leading-relaxed">
                                If you have completed an academic paper or significant research project, you may upload this document to your application below. Please submit a real paper/abstract, and be sure to title your work, for example: My research project for the state science fair 2018 (if you won, you are the most amazing). We want to read your work and anything else you want us to know.
                            </p>
                            
                            <h3 class="text-base font-bold pt-4 mb-2">Test Scores</h3>
                            <p class="text-xs max-w-md leading-relaxed">
                                You may <a href="#" class="text-red-700 underline hover:no-underline">self-report</a> test scores that were not included in your Common Application. You can view our testing requirements on our <a href="#" class="text-red-700 underline hover:no-underline">website.</a>
                            </p>

                        </div>
                    </div>
                    
                    <h3 class="text-base font-bold mt-10 mb-3">Take a Virtual Tour of Brown</h3>
                    <div class="border border-gray-300 w-[300px] h-[200px] bg-gray-100 flex flex-col justify-end p-2 text-white" 
                         style="background-image: url('placeholder-image.jpg'); background-size: cover;">
                        <span class="font-bold text-lg">Explore Our Campus Now</span>
                    </div>

                </main>
                <div class="mt-auto bg-white border-t border-gray-300 pt-6 pb-12 text-xs text-slate-800">
                    <div class="max-w-7xl mx-auto px-6 flex items-start justify-between">
                        
                        <div>
                            <p class="text-base font-bold mb-2">Office of College Admission</p>
                            <p>Brown University</p>
                            <p>Box 1876</p>
                            <p>Providence, RI 02912, USA</p>
                        </div>

                        <div class="space-y-1">
                            <p>U: (401) 863-9800</p>
                            <p>F: (401) 863-9300</p>
                            <p><a href="mailto:admission@brown.edu" class="text-blue-800 hover:underline">admission@brown.edu</a></p>
                        </div>
                        
                        <div class="space-y-1">
                            <p><a href="#" class="text-blue-800 hover:underline">Facebook</a></p>
                            <p><a href="#" class="text-blue-800 hover:underline">Twitter</a></p>
                            <p><a href="#" class="text-blue-800 hover:underline">Instagram</a></p>
                            <p><a href="#" class="text-blue-800 hover:underline">YouTube</a></p>
                        </div>

                    </div>
                </div>
                
                <footer class="h-8 flex items-center" style={`background-color: ${BROWN_RED};`}>
                    <div class="max-w-7xl mx-auto px-6 w-full text-[10px] text-white">
                        &copy; 2020 Brown University. All rights reserved.
                    </div>
                </footer>
            </div>
		{:else}
            {#if SCHOOL_DATA.decision === 'admit'}
				<BrownAccepted applicantName={applicantName()} />
			{:else}
				<BrownDenied applicantName={applicantName()} />
			{/if}
		{/if}
	{/if}
</div>