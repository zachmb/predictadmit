<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import DartmouthAccepted from '$lib/components/dartmouth/DartmouthAccepted.svelte';
	import DartmouthDenied from '$lib/components/dartmouth/DartmouthDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'dartmouth';
	const school = {
		schoolName: 'Dartmouth College',
		primaryColor: '#00693E',
		footerDomain: 'dartmouth.edu',
		statusLastPosted: 'March 16, 2026',
		round: 'Regular Decision',
		referenceNumber: '52047318'
	};

	// --- State Variables ---
	let profile: UserProfile = { ...defaultProfile };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;
	let activeTab = 'Home';

	// Subscribe to the global user profile store
	$: profile = $userProfile;

	// Dynamic Data Helpers
	const applicantName = () => profile.name || 'Applicant';
	const firstName = () => (profile.name ? profile.name.split(' ')[0] : 'Applicant');

	// Default decision when the prediction store has no entry for this slug:
	const DEFAULT_DECISION = 'admit';
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
			// Use default John Doe credentials if user hasn't set up their own
			userProfile.update((u) => ({
				...u,
				name: u.name || 'John Doe',
				email: u.email || 'john.doe@example.com',
				password: u.password || 'password123'
			}));
		}
		// Directly authenticate
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

	const navItems = ['About', 'Academics', 'Life at Dartmouth', 'Visit', 'Apply', 'Afford', 'Follow'];
</script>

<svelte:head>
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen bg-white font-serif text-gray-900">
	{#if !authenticated}
		<!-- ============================ LOGIN ============================ -->
		<header class="border-b-4" style="border-color: {school.primaryColor};">
			<div class="mx-auto flex max-w-6xl items-center px-6 py-5">
				<a href="/disclaimer" class="flex items-center gap-3">
					<svg viewBox="0 0 40 48" class="h-11 w-11" aria-hidden="true">
						<path
							d="M20 2 L27 16 L23 16 L29 27 L24.5 27 L31 39 L9 39 L15.5 27 L11 27 L17 16 L13 16 Z"
							fill={school.primaryColor}
						/>
						<rect x="18" y="39" width="4" height="7" fill={school.primaryColor} />
					</svg>
					<div class="text-3xl font-bold tracking-tight" style="color: {school.primaryColor};">
						Dartmouth
					</div>
				</a>
			</div>
			<div class="border-t border-gray-200 bg-[#00693E] text-white">
				<div class="mx-auto flex max-w-6xl flex-wrap items-center gap-x-7 gap-y-1 px-6 py-3">
					<span class="mr-2 text-lg font-semibold tracking-wide">Undergraduate Admissions</span>
					<nav class="hidden flex-wrap items-center gap-x-6 text-[14px] font-medium md:flex">
						{#each navItems as item}
							<a href="/disclaimer" class="text-white/90 hover:text-white">{item}</a>
						{/each}
					</nav>
				</div>
			</div>
		</header>

		<main class="mx-auto min-h-[520px] max-w-4xl px-6 py-12">
			<h1 class="mb-4 text-4xl font-normal text-gray-900">Login</h1>
			<p class="mb-6 text-lg font-bold text-gray-900">
				Welcome to Dartmouth's Application Management System.
			</p>

			<div class="max-w-2xl">
				<div
					class="mb-8 border-l-4 bg-[#e5f2ea] px-4 py-3 text-[14px] text-gray-800"
					style="border-color: {school.primaryColor};"
				>
					To log in, please enter your email address and password.
				</div>

				<form class="space-y-5" on:submit={autoLogin}>
					{#if error}
						<p
							class="border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-6">
						<label for="portal-email" class="w-36 text-[14px] font-bold text-gray-900">
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="w-64 border border-gray-400 px-2 py-1.5 text-[14px]"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-6">
						<label for="portal-password" class="w-36 text-[14px] font-bold text-gray-900">
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="w-64 border border-gray-400 px-2 py-1.5 text-[14px]"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a href="/disclaimer" class="text-[14px] underline" style="color: {school.primaryColor};">
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-4 pt-3 pl-[168px]">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="px-6 py-2 text-[14px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
							style="background-color: {school.primaryColor};"
						>
							Login
						</button>
						</div>

					<p class="pl-[168px] pt-6 text-[14px] font-bold text-gray-900">
						If you are having trouble logging in, please
						<a href="/disclaimer" class="underline" style="color: {school.primaryColor};">contact us</a>.
					</p>

					<p class="max-w-xl pl-[168px] pt-4 text-[11px] leading-relaxed text-gray-500">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<!-- Footer -->
		<footer class="border-t border-gray-200 bg-[#f4f4f4]">
			<div class="mx-auto max-w-6xl px-6 py-10">
				<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
					<div>
						<h3 class="mb-2 font-sans text-sm font-bold text-gray-900">My Dartmouth</h3>
						<ul class="space-y-1 font-sans text-[13px] text-gray-600">
							<li><a href="/disclaimer" class="hover:underline">Students</a></li>
							<li><a href="/disclaimer" class="hover:underline">Faculty</a></li>
							<li><a href="/disclaimer" class="hover:underline">Staff</a></li>
							<li><a href="/disclaimer" class="hover:underline">Alumni</a></li>
							<li><a href="/disclaimer" class="hover:underline">Families</a></li>
						</ul>
					</div>
					<div>
						<h3 class="mb-2 font-sans text-sm font-bold text-gray-900">Find it Fast</h3>
						<ul class="space-y-1 font-sans text-[13px] text-gray-600">
							<li><a href="/disclaimer" class="hover:underline">Campus Map</a></li>
							<li><a href="/disclaimer" class="hover:underline">Directory</a></li>
							<li><a href="/disclaimer" class="hover:underline">Events</a></li>
							<li><a href="/disclaimer" class="hover:underline">News</a></li>
							<li><a href="/disclaimer" class="hover:underline">Visit</a></li>
						</ul>
					</div>
					<div>
						<h3 class="mb-2 font-sans text-sm font-bold text-gray-900">Resources</h3>
						<ul class="space-y-1 font-sans text-[13px] text-gray-600">
							<li><a href="/disclaimer" class="hover:underline">Dartmouth at a Glance</a></li>
							<li><a href="/disclaimer" class="hover:underline">Accessibility</a></li>
							<li><a href="/disclaimer" class="hover:underline">Administrative Offices</a></li>
							<li><a href="/disclaimer" class="hover:underline">Careers</a></li>
						</ul>
					</div>
					<div>
						<h3 class="mb-2 font-sans text-sm font-bold text-gray-900">Connect With Us</h3>
						<ul class="space-y-1 font-sans text-[13px] text-gray-600">
							<li><a href="/disclaimer" class="hover:underline">Facebook</a></li>
							<li><a href="/disclaimer" class="hover:underline">Instagram</a></li>
							<li><a href="/disclaimer" class="hover:underline">Twitter</a></li>
							<li><a href="/disclaimer" class="hover:underline">YouTube</a></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="border-t border-gray-200 bg-[#00693E] text-white">
				<div
					class="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 px-6 py-4 font-sans text-[12px]"
				>
					<a href="/disclaimer" class="hover:underline"
						>Copyright &copy; 2026 Trustees of Dartmouth College</a
					>
					<span aria-hidden="true">&bull;</span>
					<a href="/disclaimer" class="hover:underline">Privacy</a>
					<span aria-hidden="true">&bull;</span>
					<a href="/disclaimer" class="hover:underline">A-Z Index</a>
					<span aria-hidden="true">&bull;</span>
					<a href="/disclaimer" class="hover:underline">Contact</a>
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============================ PORTAL ============================ -->
		<header class="border-b-4" style="border-color: {school.primaryColor};">
			<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
				<div class="flex items-center gap-3">
					<svg viewBox="0 0 40 48" class="h-11 w-11" aria-hidden="true">
						<path
							d="M20 2 L27 16 L23 16 L29 27 L24.5 27 L31 39 L9 39 L15.5 27 L11 27 L17 16 L13 16 Z"
							fill={school.primaryColor}
						/>
						<rect x="18" y="39" width="4" height="7" fill={school.primaryColor} />
					</svg>
					<div class="text-3xl font-bold tracking-tight" style="color: {school.primaryColor};">
						Dartmouth
					</div>
				</div>
				<div class="text-[13px] text-gray-600">
					{firstName()}
					<a
						href="/disclaimer"
						class="ml-2 text-[11px] underline"
						style="color: {school.primaryColor};">Logout</a
					>
				</div>
			</div>
			<div class="border-t border-gray-200 bg-[#00693E] text-white">
				<div class="mx-auto flex max-w-6xl flex-wrap items-center gap-x-7 gap-y-1 px-6 py-3">
					<span class="mr-2 text-lg font-semibold tracking-wide">Undergraduate Admissions</span>
				</div>
			</div>
		</header>

		<main class="mx-auto max-w-4xl px-6 pb-16">
			<!-- Subtabs -->
			<nav class="mt-8 flex flex-wrap gap-1 border-b border-gray-200">
				{#each ['Home', 'Financial Aid', 'Address Verification', 'Testing'] as tab}
					<button
						on:click={() => (activeTab = tab)}
						class="px-4 py-2 font-sans text-[14px] font-medium transition-colors"
						style={activeTab === tab
							? `background-color: ${school.primaryColor}; color: #fff;`
							: 'background-color: #a5d75f; color: #0f4d2e;'}
					>
						{tab}
					</button>
				{/each}
			</nav>

			<div class="py-8">
				<h2 class="text-2xl font-normal text-gray-900">Welcome,&nbsp;{firstName()}</h2>

				{#if activeTab === 'Home'}
					<div class="mt-8">
						<h3 class="text-xl font-normal text-gray-900">Status Update</h3>
						<p class="mt-3 text-[15px] text-gray-700">
							An update to your application was last posted {school.statusLastPosted}.
						</p>
						<p class="mt-3">
							<button
								on:click={handleViewUpdate}
								class="font-sans text-[15px] font-bold underline"
								style="color: {school.primaryColor};"
							>
								View your simulated admission decision letter.
							</button>
						</p>
					</div>

					<!-- Upload Materials -->
					<div class="mt-12">
						<h3 class="text-xl font-normal text-gray-900">Upload Materials</h3>
						<p class="mt-3 text-[15px] text-gray-700">
							If you wish to update your admissions application, you may upload additional material
							here.
						</p>
						<div class="mt-4 flex flex-wrap items-center gap-4">
							<select
								class="border border-gray-400 px-2 py-1.5 font-sans text-[14px] text-gray-700"
								disabled
							>
								<option>Post Decision Application Update</option>
							</select>
							<a
								href="/disclaimer"
								class="px-4 py-1.5 font-sans text-[14px] font-semibold text-white"
								style="background-color: {school.primaryColor};">Upload</a
							>
						</div>
					</div>

					<!-- Account Tools -->
					<div
						class="mt-12 border-t border-b border-gray-900 py-3 text-center font-sans text-[13px] text-gray-700"
					>
						<strong>Account Tools:</strong>
						<a href="/disclaimer" class="mx-3 underline" style="color: {school.primaryColor};"
							>Change Email Address</a
						>
						<a href="/disclaimer" class="mx-3 underline" style="color: {school.primaryColor};"
							>Change Password</a
						>
						<a href="/disclaimer" class="mx-3 underline" style="color: {school.primaryColor};"
							>Contact Us</a
						>
						<a href="/disclaimer" class="mx-3 underline" style="color: {school.primaryColor};"
							>Logout</a
						>
					</div>
				{:else}
					<div class="mt-8 border border-gray-200 bg-gray-50 p-6">
						<p class="font-sans text-sm text-gray-600">
							This section of your applicant portal is not available in this simulation.
						</p>
					</div>
				{/if}
			</div>
		</main>

		<!-- Footer -->
		<footer class="border-t border-gray-200 bg-[#f4f4f4]">
			<div class="mx-auto max-w-6xl px-6 py-10">
				<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
					<div>
						<h3 class="mb-2 font-sans text-sm font-bold text-gray-900">My Dartmouth</h3>
						<ul class="space-y-1 font-sans text-[13px] text-gray-600">
							<li><a href="/disclaimer" class="hover:underline">Students</a></li>
							<li><a href="/disclaimer" class="hover:underline">Faculty</a></li>
							<li><a href="/disclaimer" class="hover:underline">Staff</a></li>
							<li><a href="/disclaimer" class="hover:underline">Alumni</a></li>
							<li><a href="/disclaimer" class="hover:underline">Families</a></li>
						</ul>
					</div>
					<div>
						<h3 class="mb-2 font-sans text-sm font-bold text-gray-900">Find it Fast</h3>
						<ul class="space-y-1 font-sans text-[13px] text-gray-600">
							<li><a href="/disclaimer" class="hover:underline">Campus Map</a></li>
							<li><a href="/disclaimer" class="hover:underline">Directory</a></li>
							<li><a href="/disclaimer" class="hover:underline">Events</a></li>
							<li><a href="/disclaimer" class="hover:underline">News</a></li>
							<li><a href="/disclaimer" class="hover:underline">Visit</a></li>
						</ul>
					</div>
					<div>
						<h3 class="mb-2 font-sans text-sm font-bold text-gray-900">Resources</h3>
						<ul class="space-y-1 font-sans text-[13px] text-gray-600">
							<li><a href="/disclaimer" class="hover:underline">Dartmouth at a Glance</a></li>
							<li><a href="/disclaimer" class="hover:underline">Accessibility</a></li>
							<li><a href="/disclaimer" class="hover:underline">Administrative Offices</a></li>
							<li><a href="/disclaimer" class="hover:underline">Careers</a></li>
						</ul>
					</div>
					<div>
						<h3 class="mb-2 font-sans text-sm font-bold text-gray-900">Connect With Us</h3>
						<ul class="space-y-1 font-sans text-[13px] text-gray-600">
							<li><a href="/disclaimer" class="hover:underline">Facebook</a></li>
							<li><a href="/disclaimer" class="hover:underline">Instagram</a></li>
							<li><a href="/disclaimer" class="hover:underline">Twitter</a></li>
							<li><a href="/disclaimer" class="hover:underline">YouTube</a></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="border-t border-gray-200 bg-[#00693E] text-white">
				<div
					class="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 px-6 py-4 font-sans text-[12px]"
				>
					<a href="/disclaimer" class="hover:underline"
						>Copyright &copy; 2026 Trustees of Dartmouth College</a
					>
					<span aria-hidden="true">&bull;</span>
					<a href="/disclaimer" class="hover:underline">Privacy</a>
					<span aria-hidden="true">&bull;</span>
					<a href="/disclaimer" class="hover:underline">A-Z Index</a>
					<span aria-hidden="true">&bull;</span>
					<a href="/disclaimer" class="hover:underline">Contact</a>
				</div>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<DartmouthAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<DartmouthDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
