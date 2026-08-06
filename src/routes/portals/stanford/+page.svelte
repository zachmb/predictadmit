<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import StanfordAccepted from '$lib/components/stanford/StanfordAccepted.svelte';
	import StanfordDenied from '$lib/components/stanford/StanfordDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'stanford';
	const school = {
		schoolName: 'Stanford University',
		primaryColor: '#8C1515',
		footerDomain: 'stanford.edu',
		statusLastPosted: 'March 14, 2026',
		round: 'Regular Decision',
		referenceNumber: '24831067'
	};

	// --- State Variables ---
	let profile: UserProfile = { ...defaultProfile };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;
	let activeTab = 'Admissions Status';

	// Subscribe to the global user profile store
	$: profile = $userProfile;

	// Dynamic Data Helpers
	const applicantName = () => profile.name || 'Applicant';

	// Default decision when the prediction store has no entry for this slug:
	const DEFAULT_DECISION = 'deny';
	$: shownDecision = $decisionsBySlug[SLUG] ?? DEFAULT_DECISION;

	// --- Handlers ---
	let isAutoLoggingIn = false;
	const autoLogin = async (e?: Event) => {
		if (e) e.preventDefault();
		if (isAutoLoggingIn) return;
		isAutoLoggingIn = true;
		const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
		const em = profile && profile.email && profile.password ? profile.email : 'john.doe@gmail.com';
		const pw = profile && profile.email && profile.password ? profile.password : 'password123';
		emailInput = '';
		passwordInput = '';
		for (let i = 1; i <= em.length; i++) {
			emailInput = em.slice(0, i);
			await sleep(30);
		}
		await sleep(220);
		for (let i = 1; i <= pw.length; i++) {
			passwordInput = pw.slice(0, i);
			await sleep(30);
		}
		await sleep(360);
		authenticated = true;
		isAutoLoggingIn = false;
	};

	const handleLoadSavedLogin = () => {
		if (!profile.email || !profile.password) {
			userProfile.update((u) => ({
				...u,
				name: u.name || 'John Doe',
				email: u.email || 'john.doe@example.com',
				password: u.password || 'password123'
			}));
		}
		authenticated = true;
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
		portalDecisionViewed.set(true);
	};
</script>

<svelte:head>
	<title>Applicant Status Portal</title>
</svelte:head>

<div class="min-h-screen bg-white text-[#2e2d29] font-sans flex flex-col">
	<!-- Stanford red brand header (shared across all states) -->
	<header style="background-color: {school.primaryColor};" class="w-full">
		<div class="max-w-5xl mx-auto px-6 py-3 flex items-center">
			<span class="text-white text-2xl font-serif tracking-tight">Stanford</span>
			<span class="mx-3 text-white/50 text-2xl font-light">|</span>
			<span class="text-white/90 text-lg font-light">Undergraduate Admission</span>
		</div>
	</header>

	<!-- Secondary nav bar -->
	<nav class="w-full bg-[#f4f4f2] border-b border-gray-300">
		<div class="max-w-5xl mx-auto px-6 py-2 flex items-center gap-6 text-sm font-semibold">
			<a href="/disclaimer" class="text-gray-800 hover:text-[#8C1515]">Plan</a>
			<a href="/disclaimer" class="text-gray-800 hover:text-[#8C1515]">Afford</a>
			<a href="/disclaimer" class="text-gray-800 hover:text-[#8C1515]">Engage</a>
			<a href="/disclaimer" class="text-[#8C1515] underline">Apply</a>
		</div>
	</nav>

	{#if !authenticated}
		<!-- ===================== LOGIN ===================== -->
		<main class="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
			<h1 class="text-5xl font-bold text-[#2e2d29] mb-6">Login</h1>

			<div
				class="border-l-4 border-[#4b8a08] bg-[#eef7e3] px-4 py-2 mb-8 text-sm text-[#2e2d29] max-w-2xl"
			>
				To log in, please enter your email address and password.
			</div>

			<form class="space-y-3 max-w-xl" on:submit={autoLogin}>
				{#if error}
					<p
						class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2 max-w-md"
						role="alert"
					>
						{error}
					</p>
				{/if}

				<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
					<label for="portal-email" class="text-[13px] text-[#2e2d29] w-28">Email Address</label>
					<input
						id="portal-email"
						type="email"
						class="border border-gray-400 bg-white px-2 py-1 text-[13px] w-full max-w-[16rem] sm:w-64 sm:max-w-none shadow-inner"
						bind:value={emailInput}
						autocomplete="email"
					/>
				</div>

				<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
					<label for="portal-password" class="text-[13px] text-[#2e2d29] w-28">Password</label>
					<input
						id="portal-password"
						type="password"
						class="border border-gray-400 bg-white px-2 py-1 text-[13px] w-full max-w-[16rem] sm:w-64 sm:max-w-none shadow-inner"
						bind:value={passwordInput}
						autocomplete="current-password"
					/>
					<a href="/disclaimer" class="text-[13px] text-[#8C1515] underline hover:no-underline">
						Forgot Your Password?
					</a>
				</div>

				<div class="flex items-center gap-3 pt-2 pl-32">
					<button
						type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
						class="border border-gray-500 bg-gray-200 px-5 py-1 text-[13px] font-semibold text-gray-800 hover:bg-gray-300"
					>
						Login
					</button>
					</div>

				<p class="pt-6 text-[11px] leading-relaxed text-gray-500 max-w-lg">
					For this simulation, use the same email address and password that you saved on the
					PredictAdmit.com home page. No real application data is used, and all information is stored
					only in your browser.
				</p>
			</form>
		</main>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ===================== PORTAL ===================== -->
		<div class="flex-grow max-w-5xl w-full mx-auto px-6 py-6">
			<div class="flex justify-end text-[11px] text-gray-600 mb-4">
				<span>{applicantName()}</span>
				<a href="/disclaimer" class="ml-2 text-gray-500 hover:underline">Logout</a>
			</div>

			<h1 class="text-6xl font-serif text-[#8C1515] mb-4">Stanford</h1>

			<p class="text-base text-[#2e2d29] mb-8">Application Status for {applicantName()}</p>

			<!-- Status Update -->
			<section class="mb-8">
				<h2 class="text-lg font-semibold text-[#8C1515] mb-1">Status Update</h2>
				<p class="text-sm text-[#2e2d29] mb-3">
					An update to your application was last posted {school.statusLastPosted}.
				</p>
				<button
					on:click={handleViewUpdate}
					class="text-sm font-bold text-[#8C1515] underline hover:no-underline"
				>
					View Simulated Status Update &gt;&gt;
				</button>
			</section>

			<!-- Your Account -->
			<section class="mb-8">
				<h2 class="text-lg font-semibold text-[#8C1515] mb-2">Your Account</h2>
				<p class="text-sm text-[#2e2d29] leading-relaxed">
					{applicantName()}<br />
					{profile.email || 'applicant@example.com'}<br />
					Date of Birth: July 12, 2008
				</p>
				<div class="text-sm mt-3 space-y-1">
					<a href="/disclaimer" class="block text-[#8C1515] underline hover:no-underline"
						>Change Email</a
					>
					<a href="/disclaimer" class="block text-[#8C1515] underline hover:no-underline"
						>Change Account Password</a
					>
				</div>
			</section>
		</div>
	{:else if shownDecision === 'admit'}
		<StanfordAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<StanfordDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}

	{#if !authenticated || (authenticated && !hasViewedUpdate)}
		<!-- Shared Stanford footer -->
		<footer class="mt-auto">
			<div class="bg-[#f2f1eb] border-t border-gray-300 py-8">
				<div class="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-[13px]">
					<div>
						<h3 class="text-[#8C1515] font-bold uppercase text-xs tracking-wide mb-3">
							Engage with Us
						</h3>
						<div class="flex gap-2">
							<span
								class="w-6 h-6 rounded-full bg-[#8C1515] inline-flex items-center justify-center text-white text-[10px]"
								>IG</span
							>
							<span
								class="w-6 h-6 rounded-full bg-[#3b7fb8] inline-flex items-center justify-center text-white text-[10px]"
								>TW</span
							>
							<span
								class="w-6 h-6 rounded-full bg-[#c4302b] inline-flex items-center justify-center text-white text-[10px]"
								>YT</span
							>
						</div>
					</div>
					<div>
						<h3 class="text-[#8C1515] font-bold uppercase text-xs tracking-wide mb-3">Programs</h3>
						<a href="/disclaimer" class="text-gray-700 hover:underline"
							>Admission Forums, Student Programs, and Special Events</a
						>
					</div>
					<div>
						<h3 class="text-[#8C1515] font-bold uppercase text-xs tracking-wide mb-3">
							Publications
						</h3>
						<a href="/disclaimer" class="block text-gray-700 hover:underline">Stanford Preview</a>
						<a href="/disclaimer" class="block text-gray-700 hover:underline">Stanford Viewbook</a>
					</div>
					<div class="space-y-2">
						<a href="/disclaimer" class="block bg-[#d9d7cd] text-gray-700 px-3 py-2"
							>Join the Mailing List</a
						>
						<a href="/disclaimer" class="block bg-[#d9d7cd] text-gray-700 px-3 py-2">Contact Us</a>
						<a href="/disclaimer" class="block bg-[#d9d7cd] text-gray-700 px-3 py-2"
							>University Policies</a
						>
					</div>
				</div>
				<p class="max-w-5xl mx-auto px-6 text-center text-[11px] text-gray-500 mt-6">
					Stanford complies with the Jeanne Clery Act and publishes crime statistics for the most
					recent three-year period.
					<a href="/disclaimer" class="underline">View the full report</a>.
				</p>
			</div>

			<div style="background-color: {school.primaryColor};" class="text-white py-5">
				<div class="max-w-5xl mx-auto px-6 flex flex-col md:flex-row md:items-center gap-3">
					<div class="font-serif text-lg leading-tight">
						Stanford<br /><span class="text-xs font-sans tracking-widest uppercase">University</span>
					</div>
					<div class="flex-grow text-[12px]">
						<div class="flex flex-wrap gap-x-4 gap-y-1 font-semibold">
							<a href="/disclaimer" class="hover:underline">Stanford Home</a>
							<a href="/disclaimer" class="hover:underline">Maps &amp; Directions</a>
							<a href="/disclaimer" class="hover:underline">Search Stanford</a>
							<a href="/disclaimer" class="hover:underline">Emergency Info</a>
						</div>
						<div class="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-white/90">
							<a href="/disclaimer" class="hover:underline">Terms of Use</a>
							<a href="/disclaimer" class="hover:underline">Privacy</a>
							<a href="/disclaimer" class="hover:underline">Copyright</a>
							<a href="/disclaimer" class="hover:underline">Trademarks</a>
							<a href="/disclaimer" class="hover:underline">Non-Discrimination</a>
							<a href="/disclaimer" class="hover:underline">Accessibility</a>
						</div>
						<p class="mt-1 text-white/90">&copy; Stanford University. Stanford, California 94305.</p>
					</div>
				</div>
			</div>
		</footer>
	{/if}
</div>
