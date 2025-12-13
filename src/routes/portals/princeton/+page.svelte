<script lang="ts">
	// Svelte Stores and Types
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';

	// Shared Components and Configuration
	import { schoolConfigs } from '$lib/config/schools';

	// School-Specific Components (Decision Letters are the only allowed imports outside of config/template)
	import PrincetonAccepted from '$lib/components/princeton/PrincetonAccepted.svelte';
	import PrincetonDenied from '$lib/components/princeton/PrincetonDenied.svelte';
    
    // NOTE: AdmissionsPortalTemplate is not used in the authenticated block, 
    // but typically should be imported if the authenticated view is meant to be consistent.
    // I will not add it back since the user's authenticated block is custom, but mention it. 
    // import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
    
	// --- Component Configuration ---
	const SCHOOL_DATA = schoolConfigs.princeton;
	const PRINCETON_ORANGE = '#F58025'; // Kept as a helper variable

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
    
    // HANDLERS from the Generic Dynamic Page

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

		if (!SCHOOL_DATA) { // Use SCHOOL_DATA instead of 'school'
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

<main class="min-h-screen bg-slate-200 text-slate-900 font-serif">
	{#if !authenticated}
		<div class="min-h-screen bg-slate-200 text-slate-900 font-serif">
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

            <footer class="mt-8">
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
        </div>
	{:else}
		{#if !hasViewedUpdate}
			<div class="border-b border-gray-300 shadow-sm bg-white">
				<div class="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center text-sm">
					<div class="flex items-center space-x-2 text-gray-800 tracking-wide">
						<span style="color: {PRINCETON_ORANGE}; font-size: 1.5rem; font-weight: 900;">&#9660;</span>
						<span class="text-xl font-serif font-bold">PRINCETON UNIVERSITY</span>
						<span class="text-xs font-light tracking-widest text-gray-700">Undergraduate Admission</span>
					</div>
					<nav class="flex space-x-4 text-gray-600 font-semibold text-xs uppercase tracking-wide">
						<a href="#">How to Apply</a>
						<a href="#">Cost & Aid</a>
						<a href="#">Academics</a>
						<a href="#">Campus Life</a>
						<a href="#">Visit Us</a>
						<a href="#">Blog</a>
						<a href="#">Contact Us</a>
						<a href="#">LN ESPAÑOL</a>
					</nav>
				</div>
			</div>

			<div class="max-w-7xl mx-auto px-6 pt-3 pb-6 flex justify-end">
				<div class="text-xs text-gray-700">
					{applicantName()} | 
					<a href="/" class="text-blue-600 hover:underline ml-1">Logout</a>
				</div>
			</div>

			<div class="max-w-4xl mx-auto px-6 pb-20">
				
				<h1 class="text-3xl font-light text-gray-800 mb-6 border-b border-gray-200 pb-3">
					Application Status for {applicantName()}
				</h1>

				<div class="p-3 mb-6 text-sm bg-yellow-100 border border-yellow-300 font-medium text-gray-800">
					<p class="font-bold mb-1">Status Update</p>
					{SCHOOL_DATA.bannerText}
					<button on:click={handleViewUpdate} class="ml-2 text-orange-600 hover:underline font-bold">
						{SCHOOL_DATA.statusLinkLabel}
					</button>
				</div>

				<div class="text-xs text-center my-10">
					Account Tools: 
					<a href="#" class="text-blue-600 hover:underline">Change Password</a> | 
					<a href="#" class="text-blue-600 hover:underline">Logout</a>
				</div>
			</div>

			<footer class="bg-gray-800 text-white mt-auto py-10">
				<div class="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-8 text-xs">
					<div>
						<div class="flex items-center space-x-2 mb-4">
							<span class="text-3xl font-bold font-serif" style="color: {PRINCETON_ORANGE};">&#9660;</span>
							<span class="text-xl font-serif font-bold">PRINCETON UNIVERSITY</span>
						</div>
						<p class="text-gray-400 font-light">Undergraduate Admission</p>
					</div>
					<div class="space-y-2 text-gray-300">
						<p class="font-bold">Admissions Publications</p>
						<a href="#" class="block hover:underline">Contact Us</a>
						<a href="#" class="block hover:underline">FAQs</a>
						<a href="#" class="block hover:underline">Request Information</a>
						<a href="#" class="block hover:underline">Privacy Notice</a>
					</div>
					<div class="space-y-2">
						<p class="font-bold text-gray-300">#PrincetonU</p>
						<div class="flex space-x-2">
							<span class="w-4 h-4 bg-white text-gray-800 flex items-center justify-center">F</span>
							<span class="w-4 h-4 bg-white text-gray-800 flex items-center justify-center">T</span>
							<span class="w-4 h-4 bg-white text-gray-800 flex items-center justify-center">I</span>
							<span class="w-4 h-4 bg-white text-gray-800 flex items-center justify-center">Y</span>
						</div>
					</div>
					<div class="space-y-2 text-[11px] text-gray-400">
						<p>The Office of Admission serves under the Office of the Dean of the College.</p>
						<p>©2019 The Trustees of Princeton University</p>
						<p class="mt-4 text-center font-serif text-lg">Est. 1746</p>
					</div>
				</div>
			</footer>
		{:else}
			{#if SCHOOL_DATA.decision === 'admit'}
				<PrincetonAccepted applicantName={applicantName()} />
			{:else}
				<PrincetonDenied applicantName={applicantName()} />
			{/if}
		{/if}
	{/if}
</main>