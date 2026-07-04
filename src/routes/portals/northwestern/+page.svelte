<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import NorthwesternAccepted from '$lib/components/northwestern/NorthwesternAccepted.svelte';
	import NorthwesternDenied from '$lib/components/northwestern/NorthwesternDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'northwestern';
	const school = {
		schoolName: 'Northwestern University',
		primaryColor: '#4E2A84',
		footerDomain: 'northwestern.edu',
		statusLastPosted: 'March 17, 2026',
		round: 'Regular Decision',
		referenceNumber: '250917384'
	};

	// --- State Variables ---
	let profile: UserProfile = { ...defaultProfile };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;
	let activeTab = 'Application Status';

	// Subscribe to the global user profile store
	$: profile = $userProfile;

	// Dynamic Data Helpers
	const applicantName = () => profile.name || 'Applicant';
	const firstName = () => (profile.name || 'Applicant').split(' ')[0];

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

	const topNav = [
		'Academics',
		'Student Life',
		'Student Success',
		'Cost and Aid',
		'Visit and Engage',
		'Apply',
		'FAQs'
	];
</script>

<svelte:head>
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen bg-white font-sans text-gray-900">
	{#if !authenticated}
		<!-- ============================ LOGIN ============================ -->
		<!-- Purple wordmark bar -->
		<div style="background-color: {school.primaryColor};">
			<div class="mx-auto max-w-6xl px-6 py-3">
				<a href="/disclaimer" class="font-serif text-lg text-white">Northwestern</a>
			</div>
		</div>

		<!-- White header -->
		<header class="border-b border-gray-200 bg-white">
			<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
				<div class="text-2xl font-normal tracking-wide" style="color: {school.primaryColor};">
					UNDERGRADUATE ADMISSIONS
				</div>
				<div class="hidden flex-col items-end gap-2 md:flex">
					<nav class="flex items-center gap-5 text-[10px] font-semibold tracking-wide text-gray-600">
						<a href="/disclaimer" class="hover:underline">FOR COUNSELORS</a>
						<a href="/disclaimer" class="hover:underline">PUBLICATIONS</a>
						<a href="/disclaimer" class="hover:underline">SOCIAL MEDIA</a>
						<a href="/disclaimer" class="hover:underline">CONTACT US</a>
					</nav>
					<div class="flex items-center gap-2 border-b border-gray-300 pb-1">
						<span class="text-[12px] text-gray-400">Search this site</span>
						<svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<circle cx="11" cy="11" r="7" stroke-width="2" />
							<path d="M21 21l-4.3-4.3" stroke-width="2" stroke-linecap="round" />
						</svg>
					</div>
				</div>
			</div>
			<div class="border-t border-gray-200">
				<nav
					class="mx-auto flex max-w-6xl flex-wrap items-center gap-8 px-6 py-4 text-[15px] font-semibold"
					style="color: {school.primaryColor};"
				>
					{#each topNav as item}
						<a href="/disclaimer" class="hover:underline">{item}</a>
					{/each}
				</nav>
			</div>
		</header>

		<main class="mx-auto min-h-[420px] max-w-6xl px-6 py-10">
			<h1 class="mb-6 font-serif text-5xl font-normal text-gray-900">Login</h1>

			<div class="max-w-3xl">
				<div
					class="mb-8 border-l-4 bg-[#e9edd0] px-4 py-4 text-[14px] text-gray-800"
					style="border-color: #b6b95e;"
				>
					To log in, please enter your email address and password.
				</div>

				<form class="space-y-5" on:submit={autoLogin}>
					{#if error}
						<p class="border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800" role="alert">
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-6">
						<label for="portal-email" class="w-28 text-[14px] text-gray-800"> Email Address </label>
						<input
							id="portal-email"
							type="email"
							class="w-72 border border-gray-300 bg-white px-2 py-1.5 text-[14px]"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-6">
						<label for="portal-password" class="w-28 text-[14px] text-gray-800"> Password </label>
						<input
							id="portal-password"
							type="password"
							class="w-72 border border-gray-300 bg-white px-2 py-1.5 text-[14px]"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a
							href="/disclaimer"
							class="text-[14px] font-semibold hover:underline"
							style="color: {school.primaryColor};"
						>
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-4 pt-3 pl-[136px]">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="border px-4 py-2 text-[13px] font-semibold uppercase tracking-wide"
							style="border-color: {school.primaryColor}; color: {school.primaryColor};"
						>
							Login &rarr;
						</button>
						</div>

					<p class="max-w-2xl pt-4 pl-[136px] text-[11px] leading-relaxed text-gray-500">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is stored
						only in your browser.
					</p>
				</form>
			</div>
		</main>

		<!-- Dark footer -->
		<footer class="bg-[#1c1319] text-gray-300">
			<div class="mx-auto max-w-6xl px-6 py-12">
				<div class="grid gap-10 md:grid-cols-3">
					<div>
						<div class="font-serif text-2xl text-white">Northwestern University</div>
						<div class="mt-2 text-[15px] font-semibold text-gray-200">
							Office of Undergraduate Admission
						</div>
						<div class="mt-6 space-y-2 text-[13px] text-gray-400">
							<div>1801 Hinman Avenue<br />Evanston, IL 60208</div>
							<div>(847) 491-7271</div>
							<a href="/disclaimer" class="underline">ug-admission@{school.footerDomain}</a>
						</div>
					</div>
					<div>
						<div class="text-[13px] font-bold tracking-wide text-white">Connect</div>
						<div class="mt-4 flex items-center gap-3">
							{#each ['YouTube', 'Instagram', 'TikTok', 'Facebook'] as social}
								<a
									href="/disclaimer"
									aria-label={social}
									class="flex h-9 w-9 items-center justify-center rounded-full"
									style="background-color: {school.primaryColor};"
								>
									<span class="text-[10px] font-bold text-white">{social[0]}</span>
								</a>
							{/each}
						</div>
						<a
							href="/disclaimer"
							class="mt-6 inline-flex items-center border border-gray-500 px-4 py-2 text-[12px] font-semibold uppercase tracking-wide text-white hover:bg-white/10"
						>
							Request Information &rarr;
						</a>
					</div>
					<div>
						<div class="text-[13px] font-bold tracking-wide text-white">Northwestern Resources</div>
						<div class="mt-4 space-y-2 text-[13px] text-gray-300">
							<a href="/disclaimer" class="block underline">Building Access</a>
							<a href="/disclaimer" class="block underline">Campus Emergency Information</a>
							<a href="/disclaimer" class="block underline">Careers</a>
							<a href="/disclaimer" class="block underline">Contact Northwestern University</a>
							<a href="/disclaimer" class="block underline">University Policies</a>
						</div>
					</div>
				</div>
			</div>
			<div style="background-color: {school.primaryColor};">
				<div
					class="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-3 text-[12px] text-gray-200"
				>
					<span>&copy; 2026 Northwestern University</span>
					<a href="/disclaimer" class="font-semibold underline">Accessibility</a>
					<a href="/disclaimer" class="font-semibold underline">Disclaimer</a>
					<a href="/disclaimer" class="font-semibold underline">Privacy Statement</a>
					<a href="/disclaimer" class="font-semibold underline">Report a Concern</a>
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============================ PORTAL ============================ -->
		<div style="background-color: {school.primaryColor};">
			<div class="mx-auto max-w-6xl px-6 py-3">
				<span class="font-serif text-lg text-white">Northwestern</span>
			</div>
		</div>

		<header class="border-b border-gray-200 bg-white">
			<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
				<div class="text-2xl font-normal tracking-wide" style="color: {school.primaryColor};">
					UNDERGRADUATE ADMISSIONS
				</div>
			</div>
		</header>

		<main class="mx-auto max-w-6xl px-6 pb-16">
			<!-- Hero -->
			<div class="relative mt-8 h-48 overflow-hidden">
				<div
					class="absolute inset-0"
					style="background: linear-gradient(135deg, {school.primaryColor} 0%, #2e1a4d 55%, #3d5a3d 100%);"
				></div>
				<div class="absolute inset-0 bg-black/10"></div>
				<h1 class="relative z-10 px-8 pt-8 font-serif text-5xl font-bold text-white drop-shadow">
					Welcome, {firstName()}
				</h1>
			</div>

			<!-- Tabs -->
			<nav
				class="mt-8 flex flex-wrap items-center gap-1 border-b-2"
				style="border-color: {school.primaryColor};"
			>
				{#each ['Application Status', 'Applicant Details', 'Testing Info', 'Financial Aid'] as tab}
					<button
						on:click={() => (activeTab = tab)}
						class="px-5 py-2 text-[14px] font-semibold transition-colors"
						style={activeTab === tab
							? `background-color: ${school.primaryColor}; color: white;`
							: `background-color: #ece9f0; color: ${school.primaryColor};`}
					>
						{tab}
					</button>
				{/each}
			</nav>

			<div class="flex flex-col gap-10 py-8 md:flex-row">
				<section class="flex-1">
					{#if activeTab === 'Application Status'}
						<div class="space-y-4 text-[13px] leading-relaxed" style="color: {school.primaryColor};">
							<p>
								This page is your application status portal and will be used to monitor the progress
								of your application and to communicate any important updates or changes to your
								application. When decisions become available they will also be posted here. We
								anticipate releasing admission decisions for Regular Decision candidates on March
								17th.
							</p>
							<p>
								If you have any questions please reach out to us at
								<a href="/disclaimer" class="font-bold underline">ug-admission@{school.footerDomain}</a>
								or (847) 491-7271 and provide the following reference number:
								<strong>{school.referenceNumber}</strong>.
							</p>
						</div>

						<h2 class="mt-6 font-serif text-2xl text-gray-900">Status Update</h2>
						<p class="mt-3 text-[14px] text-gray-700">
							An update to your application was last posted {school.statusLastPosted}.
						</p>
						<button
							on:click={handleViewUpdate}
							class="mt-4 text-[14px] font-bold hover:underline"
							style="color: {school.primaryColor};"
						>
							View Update &raquo;
						</button>
					{:else}
						<div class="border border-gray-200 bg-gray-50 p-6">
							<p class="text-sm text-gray-600">
								This section of your applicant portal is not available in this simulation.
							</p>
						</div>
					{/if}

					<div class="mt-16 border-t border-gray-300 pt-4">
						<div class="text-center text-[14px] text-gray-800">
							<span class="font-bold">Account Tools:</span>
							<a
								href="/disclaimer"
								class="ml-2 font-semibold hover:underline"
								style="color: {school.primaryColor};">Change Password</a
							>
							<a
								href="/disclaimer"
								class="ml-3 font-semibold hover:underline"
								style="color: {school.primaryColor};">Logout</a
							>
						</div>
						<p class="mt-4 text-[13px] text-gray-600">
							Northwestern University is committed to a policy of non-discrimination. Click
							<a href="/disclaimer" class="font-semibold" style="color: {school.primaryColor};">here</a
							>
							to view the full statement.
						</p>
					</div>
				</section>

				<aside class="w-full shrink-0 space-y-6 md:w-64">
					<div class="border-t pt-2" style="border-color: {school.primaryColor};">
						<div class="text-[12px]" style="color: {school.primaryColor};">
							Have questions about applying?
						</div>
						<a
							href="/disclaimer"
							class="mt-2 flex items-center justify-between border px-4 py-2 text-[13px] font-bold"
							style="border-color: {school.primaryColor}; color: {school.primaryColor};"
						>
							FIND ANSWERS <span>&rarr;</span>
						</a>
					</div>
					<div class="border-t pt-2" style="border-color: {school.primaryColor};">
						<div class="text-[12px]" style="color: {school.primaryColor};">
							Want to connect on social media?
						</div>
						<a
							href="/disclaimer"
							class="mt-2 flex items-center justify-between border px-4 py-2 text-[13px] font-bold"
							style="border-color: {school.primaryColor}; color: {school.primaryColor};"
						>
							CONNECT <span>&rarr;</span>
						</a>
					</div>
				</aside>
			</div>
		</main>

		<!-- Dark footer -->
		<footer class="bg-[#1c1319] text-gray-300">
			<div class="mx-auto max-w-6xl px-6 py-12">
				<div class="grid gap-10 md:grid-cols-3">
					<div>
						<div class="font-serif text-2xl text-white">Northwestern University</div>
						<div class="mt-2 text-[15px] font-semibold text-gray-200">
							Office of Undergraduate Admission
						</div>
						<div class="mt-6 space-y-2 text-[13px] text-gray-400">
							<div>1801 Hinman Avenue<br />Evanston, IL 60208</div>
							<div>(847) 491-7271</div>
							<a href="/disclaimer" class="underline">ug-admission@{school.footerDomain}</a>
						</div>
					</div>
					<div>
						<div class="text-[13px] font-bold tracking-wide text-white">Connect</div>
						<div class="mt-4 flex items-center gap-3">
							{#each ['YouTube', 'Instagram', 'TikTok', 'Facebook'] as social}
								<a
									href="/disclaimer"
									aria-label={social}
									class="flex h-9 w-9 items-center justify-center rounded-full"
									style="background-color: {school.primaryColor};"
								>
									<span class="text-[10px] font-bold text-white">{social[0]}</span>
								</a>
							{/each}
						</div>
						<a
							href="/disclaimer"
							class="mt-6 inline-flex items-center border border-gray-500 px-4 py-2 text-[12px] font-semibold uppercase tracking-wide text-white hover:bg-white/10"
						>
							Request Information &rarr;
						</a>
					</div>
					<div>
						<div class="text-[13px] font-bold tracking-wide text-white">Northwestern Resources</div>
						<div class="mt-4 space-y-2 text-[13px] text-gray-300">
							<a href="/disclaimer" class="block underline">Building Access</a>
							<a href="/disclaimer" class="block underline">Campus Emergency Information</a>
							<a href="/disclaimer" class="block underline">Careers</a>
							<a href="/disclaimer" class="block underline">Contact Northwestern University</a>
							<a href="/disclaimer" class="block underline">University Policies</a>
						</div>
					</div>
				</div>
			</div>
			<div style="background-color: {school.primaryColor};">
				<div
					class="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-3 text-[12px] text-gray-200"
				>
					<span>&copy; 2026 Northwestern University</span>
					<a href="/disclaimer" class="font-semibold underline">Accessibility</a>
					<a href="/disclaimer" class="font-semibold underline">Disclaimer</a>
					<a href="/disclaimer" class="font-semibold underline">Privacy Statement</a>
					<a href="/disclaimer" class="font-semibold underline">Report a Concern</a>
				</div>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
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
</div>
