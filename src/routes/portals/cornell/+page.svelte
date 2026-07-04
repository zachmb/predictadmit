<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import CornellAccepted from '$lib/components/cornell/CornellAccepted.svelte';
	import CornellDenied from '$lib/components/cornell/CornellDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'cornell';
	const school = {
		schoolName: 'Cornell University',
		primaryColor: '#B31B1B',
		footerDomain: 'cornell.edu',
		statusLastPosted: 'March 15, 2026',
		round: 'Regular Decision',
		referenceNumber: '30412857'
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
	<title>{school.schoolName} Applicant Portal</title>
</svelte:head>

<div class="min-h-screen bg-white font-serif text-gray-900">
	{#if !authenticated}
		<!-- ============================ LOGIN ============================ -->
		<header class="border-b border-gray-200 bg-white">
			<!-- Utility nav -->
			<div class="border-b border-gray-100 bg-[#f7f7f7]">
				<div
					class="mx-auto flex max-w-6xl items-center justify-end gap-6 px-6 py-2 font-sans text-[12px] text-gray-700"
				>
					<a
						href="/disclaimer"
						class="rounded px-3 py-1 font-semibold text-white"
						style="background-color: {school.primaryColor};">Check Application Status</a
					>
					<a href="/disclaimer" class="hidden hover:underline sm:inline">Policies</a>
					<a href="/disclaimer" class="hidden hover:underline sm:inline">Request Information</a>
					<a href="/disclaimer" class="hidden hover:underline sm:inline">Contact Us</a>
				</div>
			</div>
			<!-- Main header -->
			<div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
				<a href="/disclaimer" class="flex items-center gap-3">
					<h1 class="text-xl font-semibold text-gray-900 md:text-2xl">
						Cornell Undergraduate Admissions
					</h1>
				</a>
				<div class="flex items-center gap-7">
					<nav class="hidden items-center gap-7 font-sans text-[15px] text-gray-800 md:flex">
						<a href="/disclaimer" class="hover:text-[color:var(--carnelian)]" style="--carnelian: {school.primaryColor}">How to Apply</a>
						<a href="/disclaimer" class="hover:text-[color:var(--carnelian)]" style="--carnelian: {school.primaryColor}">Visit &amp; Connect</a>
						<a href="/disclaimer" class="hover:text-[color:var(--carnelian)]" style="--carnelian: {school.primaryColor}">Menu</a>
					</nav>
					<a href="https://www.cornell.edu" aria-label="Cornell University">
						<svg viewBox="0 0 100 100" class="h-14 w-14" aria-hidden="true">
							<circle cx="50" cy="50" r="48" fill={school.primaryColor} />
							<circle cx="50" cy="50" r="43" fill="none" stroke="white" stroke-width="1.2" />
							<circle cx="50" cy="50" r="33" fill="none" stroke="white" stroke-width="0.8" />
							<path d="M50 38 L34 44 L34 60 L50 55 Z" fill="white" opacity="0.95" />
							<path d="M50 38 L66 44 L66 60 L50 55 Z" fill="white" opacity="0.8" />
							<line x1="50" y1="38" x2="50" y2="55" stroke={school.primaryColor} stroke-width="1.2" />
							<text x="50" y="72" font-size="8" text-anchor="middle" fill="white" font-family="serif" letter-spacing="1">1865</text>
						</svg>
					</a>
				</div>
			</div>
		</header>

		<main class="mx-auto min-h-[520px] max-w-6xl px-6 py-14">
			<h1 class="mb-8 text-5xl font-normal text-gray-900">Login</h1>

			<div class="max-w-3xl">
				<div
					class="mb-8 border-l-4 bg-[#f4e6e6] px-4 py-3 text-[13px] text-gray-800"
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
						<label for="portal-email" class="w-32 text-[13px] font-bold text-gray-900">
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="w-72 border border-gray-300 bg-white px-2 py-1.5 text-[13px]"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-6">
						<label for="portal-password" class="w-32 text-[13px] font-bold text-gray-900">
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="w-72 border border-gray-300 bg-white px-2 py-1.5 text-[13px]"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a href="/disclaimer" class="text-[13px] text-gray-700 underline hover:text-gray-900">
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-4 pt-3 pl-[152px]">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="px-6 py-2 font-sans text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
							style="background-color: {school.primaryColor};"
						>
							Login
						</button>
						</div>

					<p class="max-w-2xl pl-[152px] pt-4 text-[11px] leading-relaxed text-gray-500">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<!-- Footer -->
		<footer class="bg-[#222222] text-gray-300">
			<div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-3">
				<div>
					<h2 class="mb-3 font-sans text-sm font-bold tracking-wide text-white">
						Undergraduate Admissions Office
					</h2>
					<p class="text-[13px] leading-relaxed text-gray-400">
						Cornell University<br />
						410 Thurston Avenue<br />
						Ithaca, NY 14850
					</p>
					<p class="mt-3 text-[13px] text-gray-400">
						<a href="/disclaimer" class="hover:underline">engage@admissions.{school.footerDomain}</a><br />
						607.255.5241
					</p>
				</div>
				<div>
					<h2 class="mb-3 font-sans text-sm font-bold tracking-wide text-white">Enrollment</h2>
					<ul class="space-y-1 text-[13px] text-gray-400">
						<li><a href="/disclaimer" class="hover:underline">Admissions</a></li>
						<li><a href="/disclaimer" class="hover:underline">Financial Aid</a></li>
						<li><a href="/disclaimer" class="hover:underline">Registrar</a></li>
						<li><a href="/disclaimer" class="hover:underline">Student Employment</a></li>
					</ul>
				</div>
				<div>
					<h2 class="mb-3 font-sans text-sm font-bold tracking-wide text-white">Connect</h2>
					<div class="flex gap-4 text-gray-300">
						<a href="/disclaimer" aria-label="Instagram"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.1a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8zm0 8a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm6.3-8.2a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z"/></svg></a>
						<a href="/disclaimer" aria-label="YouTube"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.5.5-3 .5-4.5s-.1-3-.5-4.5zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z"/></svg></a>
					</div>
				</div>
			</div>
			<div class="border-t border-gray-700">
				<div class="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2 px-6 py-5 font-sans text-[11px] text-gray-400">
					<a href="/disclaimer" class="hover:underline">Annual Security and Fire Safety Reports</a>
					<a href="/disclaimer" class="hover:underline">Land Acknowledgment</a>
					<a href="/disclaimer" class="hover:underline">University Privacy</a>
					<a href="/disclaimer" class="hover:underline">Web Accessibility Assistance</a>
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============================ PORTAL ============================ -->
		<header class="border-b border-gray-200 bg-white">
			<div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
				<div class="flex items-center gap-3">
					<h1 class="text-xl font-semibold text-gray-900 md:text-2xl">
						Cornell Undergraduate Admissions
					</h1>
				</div>
				<svg viewBox="0 0 100 100" class="h-14 w-14" aria-hidden="true">
					<circle cx="50" cy="50" r="48" fill={school.primaryColor} />
					<circle cx="50" cy="50" r="43" fill="none" stroke="white" stroke-width="1.2" />
					<circle cx="50" cy="50" r="33" fill="none" stroke="white" stroke-width="0.8" />
					<path d="M50 38 L34 44 L34 60 L50 55 Z" fill="white" opacity="0.95" />
					<path d="M50 38 L66 44 L66 60 L50 55 Z" fill="white" opacity="0.8" />
					<line x1="50" y1="38" x2="50" y2="55" stroke={school.primaryColor} stroke-width="1.2" />
					<text x="50" y="72" font-size="8" text-anchor="middle" fill="white" font-family="serif" letter-spacing="1">1865</text>
				</svg>
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
							View Update &gt;&gt;
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

		<!-- Footer -->
		<footer class="bg-[#222222] text-gray-300">
			<div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-3">
				<div>
					<h2 class="mb-3 font-sans text-sm font-bold tracking-wide text-white">
						Undergraduate Admissions Office
					</h2>
					<p class="text-[13px] leading-relaxed text-gray-400">
						Cornell University<br />
						410 Thurston Avenue<br />
						Ithaca, NY 14850
					</p>
					<p class="mt-3 text-[13px] text-gray-400">
						<a href="/disclaimer" class="hover:underline">engage@admissions.{school.footerDomain}</a><br />
						607.255.5241
					</p>
				</div>
				<div>
					<h2 class="mb-3 font-sans text-sm font-bold tracking-wide text-white">Enrollment</h2>
					<ul class="space-y-1 text-[13px] text-gray-400">
						<li><a href="/disclaimer" class="hover:underline">Admissions</a></li>
						<li><a href="/disclaimer" class="hover:underline">Financial Aid</a></li>
						<li><a href="/disclaimer" class="hover:underline">Registrar</a></li>
						<li><a href="/disclaimer" class="hover:underline">Student Employment</a></li>
					</ul>
				</div>
				<div>
					<h2 class="mb-3 font-sans text-sm font-bold tracking-wide text-white">Connect</h2>
					<div class="flex gap-4 text-gray-300">
						<a href="/disclaimer" aria-label="Instagram"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.1a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8zm0 8a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm6.3-8.2a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z"/></svg></a>
						<a href="/disclaimer" aria-label="YouTube"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.5.5-3 .5-4.5s-.1-3-.5-4.5zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z"/></svg></a>
					</div>
				</div>
			</div>
			<div class="border-t border-gray-700">
				<div class="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2 px-6 py-5 font-sans text-[11px] text-gray-400">
					<a href="/disclaimer" class="hover:underline">Annual Security and Fire Safety Reports</a>
					<a href="/disclaimer" class="hover:underline">Land Acknowledgment</a>
					<a href="/disclaimer" class="hover:underline">University Privacy</a>
					<a href="/disclaimer" class="hover:underline">Web Accessibility Assistance</a>
				</div>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<CornellAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<CornellDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
