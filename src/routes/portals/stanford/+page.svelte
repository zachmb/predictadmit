<script lang="ts">
	// Svelte Stores and Types
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';

	// Shared Components and Configuration
	import { schoolConfigs } from '$lib/config/schools';

	// School-Specific Components (Decision Letters)
	import StanfordAccepted from '$lib/components/stanford/StanfordAccepted.svelte';
	import StanfordDenied from '$lib/components/stanford/StanfordDenied.svelte';
    
    // --- Component Configuration ---
	const SCHOOL_DATA = schoolConfigs.stanford;
	// Stanford Cardinal Color
	const STANFORD_RED = '#8C1515'; 

	// --- State Variables (Authentication Logic) ---
	let profile: UserProfile = { name: '', email: '', password: '' };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;

	// Subscribe to the global user profile store
	$: profile = $userProfile;

	const applicantName = () => profile.name || 'Applicant';
    
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
                
                <header class="bg-white">
                    <div class="bg-red-900 text-white font-sans">
                        <div class="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
                            <div class="flex items-center space-x-1">
                                <span class="font-bold text-lg font-serif">Stanford</span>
                                <span class="text-xs uppercase tracking-wider opacity-90">Undergraduate Admission</span>
                            </div>
                            <nav class="flex space-x-4 text-xs font-semibold uppercase">
                                <a href="#" class="hover:underline">Discover</a>
                                <a href="#" class="hover:underline">Apply</a>
                                <a href="#" class="hover:underline">Afford</a>
                                <a href="#" class="hover:underline">Visit</a>
                            </nav>
                        </div>
                    </div>
                    
                    <div class="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider text-red-900">
                        <nav class="flex space-x-4">
                            <a href="#" class="hover:underline">ADMISSION VOLUNTEERS</a>
                            <a href="#" class="hover:underline">COUNSELORS</a>
                            <a href="#" class="hover:underline">PARENTS</a>
                        </nav>
                        <span class="text-slate-700">
                            {applicantName()} <a href="/" class="hover:underline">Logout</a>
                        </span>
                    </div>
                </header>

                <main class="max-w-4xl mx-auto px-6 pt-10 pb-16 flex-1"> 
                    
                    <h1 class="text-6xl font-serif text-red-900 font-normal mb-2">Stanford</h1>
                    <p class="text-sm italic text-red-900 mb-8">Thank you for applying to Stanford!</p>

                    <p class="text-sm font-semibold text-slate-700 mb-6">
                        Application Status for {applicantName()}
                    </p>

                    <div class="p-3 mb-8 bg-yellow-100 border border-yellow-300 text-sm">
                        <p class="font-bold text-sm text-slate-900 mb-1">Status Update</p>
                        <p class="text-sm text-slate-800">
                            {SCHOOL_DATA.bannerText}
                        </p>
                        <button on:click={handleViewUpdate} class="mt-1 text-sm text-red-700 hover:underline font-bold">
                            {SCHOOL_DATA.statusLinkLabel}
                        </button>
                    </div>
                    <section class="text-sm text-slate-800 leading-relaxed">
                        <h2 class="font-bold mb-2">Your Account</h2>
                        <div class="grid grid-cols-2 gap-x-8">
                            <div>
                                <p>{applicantName()}</p>
                                <p>{profile.email}</p>
                                <p>Date of Birth: July 1, 2002</p>
                                <p>
                                    <a href="#" class="text-blue-800 underline hover:no-underline text-xs">Change Email</a>
                                </p>
                                <p>
                                    <a href="#" class="text-blue-800 underline hover:no-underline text-xs">Change Account Password</a>
                                </p>
                            </div>
                            <div>
                                <p class="font-bold mb-1">Permanent Address</p>
                                <p>123 Collegeway</p>
                                <p>Pasadena CA, 91001</p>
                                <p>United States</p>
                                <p class="font-bold mt-4 mb-1">Mailing Address</p>
                            </div>
                        </div>
                        <p class="mt-4">
                            <a href="#" class="text-blue-800 underline hover:no-underline text-xs">Edit Addresses</a>
                        </p>
                    </section>
                </main>
                <div class="border-t border-slate-300 bg-gray-50 text-xs text-slate-800">
                    <div class="max-w-7xl mx-auto px-6 py-6 flex justify-between">
                        <div class="flex space-x-12">
                            <div>
                                <h3 class="font-bold mb-2 uppercase">Engage With Us</h3>
                                <div class="flex space-x-2">
                                    <span class="w-5 h-5 bg-blue-500 rounded-full text-white flex items-center justify-center text-[10px]">F</span>
                                    <span class="w-5 h-5 bg-blue-700 rounded-full text-white flex items-center justify-center text-[10px]">T</span>
                                    <span class="w-5 h-5 bg-red-600 rounded-full text-white flex items-center justify-center text-[10px]">Y</span>
                                </div>
                            </div>
                            <div>
                                <h3 class="font-bold mb-2 uppercase">Programs</h3>
                                <a href="#" class="block hover:underline">Stanford in Your Area</a>
                                <a href="#" class="block hover:underline">Discover Stanford</a>
                            </div>
                            <div>
                                <h3 class="font-bold mb-2 uppercase">Publications</h3>
                                <a href="#" class="block hover:underline">Stanford Preview</a>
                                <a href="#" class="block hover:underline">Stanford Viewbook</a>
                            </div>
                        </div>
                        
                        <div class="space-y-2">
                            <button class="bg-gray-300 hover:bg-gray-400 text-slate-800 py-1 px-4 w-40 text-left">Join the Mailing List</button>
                            <button class="bg-gray-300 hover:bg-gray-400 text-slate-800 py-1 px-4 w-40 text-left">FAQs</button>
                            <button class="bg-gray-300 hover:bg-gray-400 text-slate-800 py-1 px-4 w-40 text-left">Contact Us</button>
                        </div>
                    </div>
                    
                    <div class="max-w-7xl mx-auto px-6 pt-4 pb-6 text-center text-[10px] text-slate-600 border-t border-slate-300">
                        Stanford complies with the Jeanne Clery Act and publishes crime statistics for the most recent three-year period. View the full report.
                    </div>
                </div>
                <footer class="bg-red-900 text-white text-[11px] py-4 mt-auto">
                    <div class="max-w-7xl mx-auto px-6 flex items-center space-x-6">
                        <span class="font-bold text-xl font-serif">Stanford <span class="block text-[8px] tracking-widest uppercase">University</span></span>
                        <nav class="flex space-x-3">
                            <a href="#" class="hover:underline">Stanford Home</a>
                            <a href="#" class="hover:underline">Maps & Directions</a>
                            <a href="#" class="hover:underline">Search Stanford</a>
                            <a href="#" class="hover:underline">Emergency Info</a>
                            <a href="#" class="hover:underline">Terms of Use</a>
                            <a href="#" class="hover:underline">Privacy</a>
                            <a href="#" class="hover:underline">Copyright</a>
                            <a href="#" class="hover:underline">Trademarks</a>
                            <a href="#" class="hover:underline">Non-Discrimination</a>
                            <a href="#" class="hover:underline">Accessibility</a>
                        </nav>
                        <span class="ml-auto opacity-80">
                            &copy; Stanford University, Stanford, California 94305.
                        </span>
                    </div>
                </footer>
            </div>
		{:else}
            {#if SCHOOL_DATA.decision === 'admit'}
				<StanfordAccepted applicantName={applicantName()} />
			{:else}
				<StanfordDenied applicantName={applicantName()} />
			{/if}
		{/if}
	{/if}
</div>