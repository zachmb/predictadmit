<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import HarvardAccepted from '$lib/components/harvard/HarvardAccepted.svelte';
	import HarvardDenied from '$lib/components/harvard/HarvardDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'harvard';
	const school = {
		schoolName: 'Harvard College',
		primaryColor: '#A51C30',
		footerDomain: 'harvard.edu',
		statusLastPosted: 'March 15, 2026',
		round: '2026 Regular Action',
		referenceNumber: '605294718'
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
</script>

<svelte:head>
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen bg-white font-serif text-gray-900">
	{#if !authenticated}
		<!-- ============================ LOGIN ============================ -->
		<header class="border-b border-gray-200 bg-white">
			<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
				<a href="/disclaimer" class="flex items-center gap-3">
					<svg viewBox="0 0 100 112" class="h-9 w-9" aria-hidden="true">
						<path
							d="M6 4 H94 V64 C94 88 74 102 50 110 C26 102 6 88 6 64 Z"
							fill={school.primaryColor}
						/>
						<rect x="18" y="26" width="18" height="14" rx="1.5" fill="white" />
						<rect x="41" y="26" width="18" height="14" rx="1.5" fill="white" />
						<rect x="64" y="26" width="18" height="14" rx="1.5" fill="white" />
						<text x="27" y="36" font-size="8" text-anchor="middle" fill={school.primaryColor} font-family="serif">VE</text>
						<text x="50" y="36" font-size="8" text-anchor="middle" fill={school.primaryColor} font-family="serif">RI</text>
						<text x="73" y="36" font-size="7" text-anchor="middle" fill={school.primaryColor} font-family="serif">TAS</text>
					</svg>
					<div class="leading-none">
						<div class="text-lg font-semibold tracking-[0.25em] text-gray-900">HARVARD</div>
						<div class="text-[10px] tracking-[0.35em] text-gray-500">COLLEGE</div>
					</div>
				</a>
				<nav class="hidden items-center gap-7 text-[15px] text-gray-800 md:flex">
					<a href="/disclaimer" class="hover:text-[color:var(--crimson)]" style="--crimson: {school.primaryColor}">About</a>
					<a href="/disclaimer" class="hover:text-[color:var(--crimson)]" style="--crimson: {school.primaryColor}">Admissions</a>
					<a href="/disclaimer" class="hover:text-[color:var(--crimson)]" style="--crimson: {school.primaryColor}">Financial Aid</a>
					<a href="/disclaimer" class="hover:text-[color:var(--crimson)]" style="--crimson: {school.primaryColor}">Academics</a>
					<a href="/disclaimer" class="hover:text-[color:var(--crimson)]" style="--crimson: {school.primaryColor}">Life at Harvard</a>
				</nav>
			</div>
		</header>

		<main class="mx-auto min-h-[520px] max-w-6xl px-4 py-14 sm:px-6">
			<h1 class="mb-8 text-5xl font-normal text-gray-900">Login</h1>

			<div class="max-w-3xl">
				<div
					class="mb-8 border-l-4 bg-[#e9f0d5] px-4 py-3 text-[13px] text-gray-800"
					style="border-color: #8a9a3f;"
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

					<div class="flex flex-wrap items-center gap-x-6 gap-y-2">
						<label for="portal-email" class="w-32 text-[13px] font-bold text-gray-900">
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="w-full max-w-[16rem] border border-gray-300 bg-[#f2f2f2] px-2 py-1.5 text-[13px] sm:w-72 sm:max-w-none"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex flex-wrap items-center gap-x-6 gap-y-2">
						<label for="portal-password" class="w-32 text-[13px] font-bold text-gray-900">
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="w-full max-w-[16rem] border border-gray-300 bg-[#f2f2f2] px-2 py-1.5 text-[13px] sm:w-72 sm:max-w-none"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a href="/disclaimer" class="text-[13px] text-gray-700 underline hover:text-gray-900">
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-4 pt-3 pl-0 sm:pl-[152px]">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="bg-[#1a1a1a] px-5 py-2 text-[13px] font-medium text-white hover:bg-black"
						>
							Login
						</button>
						</div>

					<p class="max-w-2xl pl-0 pt-4 text-[11px] leading-relaxed text-gray-500 sm:pl-[152px]">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<!-- Dark footer -->
		<footer class="bg-[#1f1f1f] text-gray-300">
			<div
				class="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-7 text-[13px] md:flex-row md:items-center md:justify-between"
			>
				<div class="leading-snug text-gray-400">
					Copyright &copy; 2026 The President<br />&amp; Fellows of Harvard College
				</div>
				<nav class="flex flex-wrap gap-6 text-gray-300">
					<a href="/disclaimer" class="hover:underline">Privacy</a>
					<a href="/disclaimer" class="hover:underline">Copyright Disclosure</a>
					<a href="/disclaimer" class="hover:underline">Accessibility</a>
				</nav>
				<div class="flex items-center gap-4 text-gray-300">
					<a href="/disclaimer" aria-label="Twitter"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 4.9c-.8.4-1.7.6-2.6.8a4.5 4.5 0 0 0 2-2.5c-.9.5-1.9.9-2.9 1.1a4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 2.5 3.7a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 18.6a12.7 12.7 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6c.9-.6 1.6-1.4 2.3-2.3z"/></svg></a>
					<a href="/disclaimer" aria-label="Facebook"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.8v8h3.1z"/></svg></a>
					<a href="/disclaimer" aria-label="Instagram"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1 0-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 9.5 2.6 9.9 2.6 12s0 2.5.1 3.7c0 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2 0 1.6.1 4.7.1s3.5 0 4.7-.1c1.1 0 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-3.7s0-2.5-.1-3.7c0-1.1-.2-1.7-.4-2.1a3.5 3.5 0 0 0-.8-1.3 3.5 3.5 0 0 0-1.3-.8c-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2zm6.3-8.2a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z"/></svg></a>
					<a href="/disclaimer" aria-label="YouTube"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.5.5-3 .5-4.5s-.1-3-.5-4.5zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z"/></svg></a>
				</div>
			</div>
			<div class="border-t border-gray-700">
				<div class="mx-auto flex max-w-6xl items-start gap-4 px-6 py-5">
					<svg viewBox="0 0 100 112" class="h-8 w-8 shrink-0" aria-hidden="true">
						<path d="M6 4 H94 V64 C94 88 74 102 50 110 C26 102 6 88 6 64 Z" fill={school.primaryColor} />
						<rect x="18" y="26" width="18" height="14" rx="1.5" fill="white" />
						<rect x="41" y="26" width="18" height="14" rx="1.5" fill="white" />
						<rect x="64" y="26" width="18" height="14" rx="1.5" fill="white" />
					</svg>
					<div class="leading-tight">
						<div class="text-[13px] font-semibold tracking-[0.2em] text-white">HARVARD</div>
						<div class="text-[9px] tracking-[0.3em] text-gray-400">COLLEGE</div>
					</div>
					<p class="max-w-3xl text-[11px] leading-relaxed text-gray-400">
						If you are located in the European Union, Iceland, Liechtenstein or Norway (the
						"European Economic Area"), please read the
						<a href="/disclaimer" class="underline">Additional EEA Privacy Disclosures</a>
						about ways that certain Harvard University Schools, Centers, units and controlled
						entities, including this one, may collect, use, and share information about you.
					</p>
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============================ PORTAL ============================ -->
		<header class="bg-[#2b2b2b] text-white">
			<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
				<div class="flex items-center gap-3">
					<svg viewBox="0 0 100 112" class="h-9 w-9" aria-hidden="true">
						<path d="M6 4 H94 V64 C94 88 74 102 50 110 C26 102 6 88 6 64 Z" fill={school.primaryColor} />
						<rect x="18" y="26" width="18" height="14" rx="1.5" fill="white" />
						<rect x="41" y="26" width="18" height="14" rx="1.5" fill="white" />
						<rect x="64" y="26" width="18" height="14" rx="1.5" fill="white" />
					</svg>
					<div class="leading-none">
						<div class="text-lg font-semibold tracking-[0.25em] text-white">HARVARD</div>
						<div class="text-[10px] tracking-[0.35em] text-gray-300">COLLEGE</div>
					</div>
				</div>
				<div class="text-[12px] text-gray-300">college.{school.footerDomain}</div>
			</div>
		</header>

		<main class="mx-auto max-w-6xl px-6 pb-16">
			<div class="flex flex-wrap items-start justify-between gap-4 pt-10 pb-5">
				<h1 class="text-4xl font-normal text-gray-900">Applicant Portal</h1>
				<div class="text-right text-[13px] text-gray-700">
					<div class="flex flex-wrap justify-end gap-x-6 gap-y-1">
						<span><strong>Applicant Name:</strong> {applicantName()}</span>
						<span><strong>Round:</strong> {school.round}</span>
						<span><strong>Reference Number:</strong> {school.referenceNumber}</span>
					</div>
					<a
						href="/disclaimer"
						class="mt-3 inline-block font-semibold"
						style="color: {school.primaryColor};">Logout</a
					>
				</div>
			</div>

			<nav class="flex items-center gap-6 border-b border-gray-300 text-sm">
				{#each ['Admissions Status', 'Application Information', 'Profile'] as tab}
					<button
						on:click={() => (activeTab = tab)}
						class="-mb-px border-b-2 px-1 py-3 font-sans font-medium transition-colors"
						class:border-transparent={activeTab !== tab}
						class:text-gray-600={activeTab !== tab}
						style={activeTab === tab
							? `border-color: ${school.primaryColor}; color: ${school.primaryColor};`
							: ''}
					>
						{tab}
					</button>
				{/each}
				<a
					href="/disclaimer"
					class="ml-auto flex items-center gap-1 py-3 font-sans text-sm font-medium"
					style="color: {school.primaryColor};"
				>
					<span
						class="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
						style="background-color: {school.primaryColor};">?</span
					>
					Contact &amp; Resources
				</a>
			</nav>

			<div class="flex flex-col gap-8 py-8 md:flex-row">
				<aside class="w-full shrink-0 md:w-64">
					<div class="border border-gray-200 bg-gray-100">
						<div class="border-b border-gray-200 px-4 py-3 font-sans text-sm font-bold text-gray-800">
							Admission Status
						</div>
						<a
							href="/disclaimer"
							class="block px-4 py-3 font-sans text-sm text-gray-600 hover:bg-gray-200"
						>
							Status Update
						</a>
					</div>
				</aside>

				<section class="flex-1">
					{#if activeTab === 'Admissions Status'}
						<h2 class="flex items-center gap-3 text-2xl text-gray-800">
							<span
								class="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-white"
								style="background-color: {school.primaryColor};">!</span
							>
							Status Update
						</h2>
						<p class="mt-4 text-[15px] text-gray-700">
							An update to your application was last posted {school.statusLastPosted}.
						</p>
						<button
							on:click={handleViewUpdate}
							class="mt-5 px-4 py-2 font-sans text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
							style="background-color: {school.primaryColor};"
						>
							View Simulated Status Update &gt;&gt;
						</button>
					{:else}
						<div class="border border-gray-200 bg-gray-50 p-6">
							<p class="font-sans text-sm text-gray-600">
								This section of your applicant portal is not available in this simulation.
							</p>
						</div>
					{/if}
				</section>
			</div>
		</main>

		<!-- Dark footer -->
		<footer class="bg-[#1f1f1f] text-gray-300">
			<div
				class="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-7 text-[13px] md:flex-row md:items-center md:justify-between"
			>
				<div class="leading-snug text-gray-400">
					Copyright &copy; 2026 The President<br />&amp; Fellows of Harvard College
				</div>
				<nav class="flex flex-wrap gap-6 text-gray-300">
					<a href="/disclaimer" class="hover:underline">Privacy</a>
					<a href="/disclaimer" class="hover:underline">Copyright Disclosure</a>
					<a href="/disclaimer" class="hover:underline">Accessibility</a>
				</nav>
				<div class="flex items-center gap-4 text-gray-300">
					<a href="/disclaimer" aria-label="Twitter"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 4.9c-.8.4-1.7.6-2.6.8a4.5 4.5 0 0 0 2-2.5c-.9.5-1.9.9-2.9 1.1a4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 2.5 3.7a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 18.6a12.7 12.7 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6c.9-.6 1.6-1.4 2.3-2.3z"/></svg></a>
					<a href="/disclaimer" aria-label="Facebook"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.8v8h3.1z"/></svg></a>
					<a href="/disclaimer" aria-label="Instagram"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1 0-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 9.5 2.6 9.9 2.6 12s0 2.5.1 3.7c0 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2 0 1.6.1 4.7.1s3.5 0 4.7-.1c1.1 0 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-3.7s0-2.5-.1-3.7c0-1.1-.2-1.7-.4-2.1a3.5 3.5 0 0 0-.8-1.3 3.5 3.5 0 0 0-1.3-.8c-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2zm6.3-8.2a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z"/></svg></a>
					<a href="/disclaimer" aria-label="YouTube"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.5.5-3 .5-4.5s-.1-3-.5-4.5zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z"/></svg></a>
				</div>
			</div>
			<div class="border-t border-gray-700">
				<div class="mx-auto flex max-w-6xl items-start gap-4 px-6 py-5">
					<svg viewBox="0 0 100 112" class="h-8 w-8 shrink-0" aria-hidden="true">
						<path d="M6 4 H94 V64 C94 88 74 102 50 110 C26 102 6 88 6 64 Z" fill={school.primaryColor} />
						<rect x="18" y="26" width="18" height="14" rx="1.5" fill="white" />
						<rect x="41" y="26" width="18" height="14" rx="1.5" fill="white" />
						<rect x="64" y="26" width="18" height="14" rx="1.5" fill="white" />
					</svg>
					<div class="leading-tight">
						<div class="text-[13px] font-semibold tracking-[0.2em] text-white">HARVARD</div>
						<div class="text-[9px] tracking-[0.3em] text-gray-400">COLLEGE</div>
					</div>
					<p class="max-w-3xl text-[11px] leading-relaxed text-gray-400">
						If you are located in the European Union, Iceland, Liechtenstein or Norway (the
						"European Economic Area"), please read the
						<a href="/disclaimer" class="underline">Additional EEA Privacy Disclosures</a>
						about ways that certain Harvard University Schools, Centers, units and controlled
						entities, including this one, may collect, use, and share information about you.
					</p>
				</div>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<HarvardAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<HarvardDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
