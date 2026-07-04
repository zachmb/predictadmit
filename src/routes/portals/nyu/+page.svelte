<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import NYUAccepted from '$lib/components/nyu/NYUAccepted.svelte';
	import NYUDenied from '$lib/components/nyu/NYUDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'nyu';
	const school = {
		schoolName: 'New York University',
		primaryColor: '#57068C', // NYU Violet
		footerDomain: 'nyu.edu',
		statusLastPosted: 'March 26, 2026',
		round: 'Regular Decision',
		referenceNumber: '18274905'
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

	// Default decision when the prediction store has no entry for this slug
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

	// --- Application Materials / Checklist Data ---
	const checklistData = [
		{ status: '✔ Received', detail: 'Common Application', date: '01/02/2026', color: 'text-green-700', link: false },
		{ status: '✔ Received', detail: 'Secondary School Report & Transcript', date: '01/05/2026', color: 'text-green-700', link: false },
		{ status: '✔ Received', detail: 'Counselor Recommendation', date: '01/06/2026', color: 'text-green-700', link: false },
		{ status: '✔ Received', detail: 'Teacher Evaluation', date: '01/08/2026', color: 'text-green-700', link: false },
		{ status: '✔ Received', detail: 'Mid-Year Grade Report', date: '02/12/2026', color: 'text-green-700', link: false },
		{ status: '! Optional', detail: 'Portfolio / Audition Supplement', date: '--', color: 'text-gray-500', link: false },
		{ status: '✔ Posted', detail: 'Admissions Decision Notification', date: '03/26/2026', color: 'text-green-700', link: true }
	];
</script>

<svelte:head>
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen font-sans bg-white text-gray-900">
	{#if !authenticated}
		<!-- ============ LOGIN ============ -->
		<div style="background-color: {school.primaryColor};" class="h-2 w-full"></div>
		<header class="border-b border-gray-200 bg-white">
			<div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<span
						class="text-2xl font-extrabold tracking-tight leading-none"
						style="color: {school.primaryColor};"
					>
						NYU
					</span>
					<span class="text-sm font-semibold text-gray-800 border-l border-gray-300 pl-3">
						Undergraduate Admissions
					</span>
				</div>
				<a href="/disclaimer" class="text-[12px] font-semibold uppercase tracking-wide" style="color: {school.primaryColor};">
					Login to NYU Home
				</a>
			</div>
		</header>

		<div style="background-color: {school.primaryColor};" class="py-3"></div>

		<main class="bg-white min-h-[520px] py-16">
			<div class="max-w-md mx-auto px-6">
				<h1 class="text-3xl font-bold mb-2 text-gray-900">Sign in to your account</h1>
				<p class="text-sm text-gray-600 mb-8">
					Access your NYU applicant status page using your registered email address and password.
				</p>

				<div
					class="border-l-4 px-4 py-3 mb-6 text-[13px] text-gray-800 bg-gray-50"
					style="border-color: {school.primaryColor};"
				>
					<strong>ATTENTION:</strong> Do not use your personal email. Sign in with the email you registered
					with your application.
				</div>

				<form class="space-y-5" on:submit={autoLogin}>
					{#if error}
						<p class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2" role="alert">
							{error}
						</p>
					{/if}

					<div>
						<label for="portal-email" class="block text-[13px] font-semibold text-gray-800 mb-1">
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="border border-gray-400 bg-white px-3 py-2 text-sm w-full focus:outline-none focus:ring-2"
							style="--tw-ring-color: {school.primaryColor};"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div>
						<label for="portal-password" class="block text-[13px] font-semibold text-gray-800 mb-1">
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="border border-gray-400 bg-white px-3 py-2 text-sm w-full focus:outline-none focus:ring-2"
							style="--tw-ring-color: {school.primaryColor};"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a href="/disclaimer" class="inline-block mt-2 text-[12px] hover:underline" style="color: {school.primaryColor};">
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-3 pt-2">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="px-6 py-2 text-sm font-semibold text-white"
							style="background-color: {school.primaryColor};"
						>
							Sign In
						</button>
						</div>

					<p class="pt-4 text-[11px] leading-relaxed text-gray-500 border-t border-gray-200">
						By logging in, you agree to abide by the Policy on Responsible Use of NYU Computers and
						Data. For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is stored
						only in your browser.
					</p>
				</form>
			</div>
		</main>

		<footer class="text-white text-[12px]" style="background-color: {school.primaryColor};">
			<div class="max-w-6xl mx-auto px-6 py-6 flex flex-wrap justify-between gap-4">
				<div class="space-x-4">
					<a href="/disclaimer" class="hover:underline">Search</a>
					<a href="/disclaimer" class="hover:underline">Campus Map</a>
					<a href="/disclaimer" class="hover:underline">Events</a>
					<a href="/disclaimer" class="hover:underline">Contact Us</a>
					<a href="/disclaimer" class="hover:underline">Accessibility</a>
				</div>
				<span>PredictAdmit Simulation — Not affiliated with New York University</span>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============ PORTAL / APPLICANT STATUS ============ -->
		<div style="background-color: {school.primaryColor};" class="h-2 w-full"></div>
		<header class="border-b border-gray-200 bg-white">
			<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<span class="text-2xl font-extrabold tracking-tight" style="color: {school.primaryColor};">NYU</span>
					<span class="text-sm font-semibold text-gray-800 border-l border-gray-300 pl-3">
						Undergraduate Admissions
					</span>
				</div>
				<div class="text-[12px] text-gray-600">{applicantName()}</div>
			</div>
		</header>

		<div class="bg-gray-50 border-b border-gray-200">
			<div class="max-w-7xl mx-auto px-6 py-2 text-[12px] text-gray-500">
				NYU <span class="mx-1">/</span> Admissions <span class="mx-1">/</span> Undergraduate Admissions
			</div>
		</div>

		<div class="max-w-7xl mx-auto px-6 mt-8 pb-12">
			<div class="flex justify-between items-end mb-6 border-b border-gray-300 pb-3">
				<h1 class="text-3xl font-bold" style="color: {school.primaryColor};">Application Status</h1>
				<div class="text-xs flex flex-wrap items-center text-gray-600 gap-x-4 gap-y-1 justify-end">
					<span><strong>Applicant:</strong> {applicantName()}</span>
					<span><strong>Round:</strong> {school.round}</span>
					<span><strong>Reference #:</strong> {school.referenceNumber}</span>
				</div>
			</div>

			<nav class="flex flex-wrap border-b border-gray-300 mb-8">
				{#each ['Application Status', 'Checklists & More', 'Profile'] as tab}
					<button
						on:click={() => (activeTab = tab)}
						class="px-4 py-2 text-sm font-semibold border-b-2 transition-colors duration-150 -mb-[2px]"
						style={activeTab === tab
							? `color: ${school.primaryColor}; border-color: ${school.primaryColor};`
							: 'color: #6b7280; border-color: transparent;'}
					>
						{tab}
					</button>
				{/each}
			</nav>

			{#if activeTab === 'Application Status'}
				<div class="flex flex-col md:flex-row gap-8">
					<div class="md:w-1/4">
						<h2 class="text-base font-bold mb-3 text-gray-800">My Application</h2>
						<nav class="text-sm space-y-1">
							<a
								href="/disclaimer"
								class="block py-1 px-2 font-semibold text-white"
								style="background-color: {school.primaryColor};"
							>
								Status Update
							</a>
							<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">Application Materials</a>
							<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">Financial Aid</a>
							<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">Update My Information</a>
							<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">Contact Admissions</a>
						</nav>
					</div>

					<div class="md:w-3/4 md:pl-8 md:border-l border-gray-200">
						<div class="mb-10">
							<h2 class="text-xl font-bold mb-4 text-gray-800">Status Update</h2>
							<div
								class="p-5 border-l-4 bg-gray-50"
								style="border-color: {school.primaryColor};"
							>
								<p class="text-base text-gray-800 mb-4">
									An update to your application was last posted on
									<strong>{school.statusLastPosted}</strong>. A decision regarding your application is
									now available.
								</p>
								<button
									on:click={handleViewUpdate}
									class="text-sm font-semibold px-5 py-2 text-white hover:opacity-90 transition-opacity"
									style="background-color: {school.primaryColor};"
								>
									View Update →
								</button>
							</div>
						</div>

						<div class="mb-8">
							<h2 class="text-xl font-bold mb-4 text-gray-800">Application Materials</h2>
							<table class="w-full text-sm text-left border border-gray-300">
								<thead>
									<tr style="background-color: {school.primaryColor};" class="text-white">
										<th class="px-4 py-2 font-semibold">Status</th>
										<th class="px-4 py-2 font-semibold">Item</th>
										<th class="px-4 py-2 font-semibold">Date Received</th>
									</tr>
								</thead>
								<tbody>
									{#each checklistData as item}
										<tr class="border-b border-gray-200">
											<td
												class="px-4 py-2 font-semibold"
												class:text-green-700={item.color === 'text-green-700'}
												class:text-gray-500={item.color === 'text-gray-500'}
											>
												{item.status}
											</td>
											<td class="px-4 py-2">
												{item.detail}
												{#if item.link}
													<a href="/disclaimer" class="hover:underline ml-1" style="color: {school.primaryColor};">View</a>
												{/if}
											</td>
											<td class="px-4 py-2">{item.date}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			{:else if activeTab === 'Checklists & More'}
				<div class="p-6 bg-gray-50 border border-gray-200">
					<p class="text-lg font-semibold text-gray-800">Checklists &amp; More</p>
					<p class="text-sm text-gray-600 mt-2">
						Once you have an admissions decision, your admitted student checklist, academics,
						student life, and financial aid resources will appear here as your Home Base.
					</p>
				</div>
			{:else if activeTab === 'Profile'}
				<div class="p-6 bg-gray-50 border border-gray-200">
					<p class="text-lg font-semibold text-gray-800">Profile</p>
					<p class="text-sm text-gray-600 mt-2">
						Review and update your contact details and biographical information.
					</p>
				</div>
			{/if}
		</div>

		<footer class="text-white text-[12px]" style="background-color: {school.primaryColor};">
			<div class="max-w-7xl mx-auto px-6 py-6 flex flex-wrap justify-between gap-4">
				<div class="space-x-4">
					<a href="/disclaimer" class="hover:underline">Search</a>
					<a href="/disclaimer" class="hover:underline">Campus Map</a>
					<a href="/disclaimer" class="hover:underline">Events</a>
					<a href="/disclaimer" class="hover:underline">Contact Us</a>
					<a href="/disclaimer" class="hover:underline">Accessibility</a>
				</div>
				<span>PredictAdmit Simulation — Not affiliated with New York University</span>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<NYUAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<NYUDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
