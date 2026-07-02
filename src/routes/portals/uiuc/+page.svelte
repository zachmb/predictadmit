<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import IllinoisAccepted from '$lib/components/uiuc/IllinoisAccepted.svelte';
	import IllinoisDenied from '$lib/components/uiuc/IllinoisDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'uiuc';
	const ILLINI_BLUE = '#13294B'; // Illinois Blue
	const ILLINI_ORANGE = '#E84A27'; // Illinois Orange

	const school = {
		schoolName: 'University of Illinois Urbana-Champaign',
		primaryColor: ILLINI_BLUE,
		footerDomain: 'illinois.edu',
		statusLastPosted: 'March 6, 2026',
		round: 'Regular Decision',
		referenceNumber: '20260012'
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
	const firstName = () => (profile.name ? profile.name.split(' ')[0] : 'Applicant');

	// Default decision when the prediction store has no entry for this slug:
	const DEFAULT_DECISION = 'admit';
	$: shownDecision = $decisionsBySlug[SLUG] ?? DEFAULT_DECISION;

	// --- Handlers ---
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

	// --- Received Items (from myIllini status page) ---
	const receivedItems = [
		{ detail: 'ACT/SAT Scores', note: 'Scores Submitted', date: '11/2/2025' },
		{ detail: 'Application Fee $75', note: 'waiver-approved', date: '10/28/2025' },
		{ detail: 'Self-Reported Academic Record', note: 'Received', date: '11/4/2025' }
	];
</script>

<svelte:head>
	<title>myIllini | {school.schoolName}</title>
</svelte:head>

<div class="min-h-screen font-sans bg-white text-gray-800">
	{#if !authenticated}
		<!-- =================== LOGIN =================== -->
		<header style="background-color: {ILLINI_BLUE};" class="h-14">
			<div class="max-w-6xl mx-auto px-6 h-full flex items-center gap-2">
				<span
					class="inline-flex items-center justify-center w-6 h-8 font-serif font-black text-white text-lg leading-none border-2"
					style="background-color: {ILLINI_ORANGE}; border-color: {ILLINI_BLUE};">I</span
				>
				<span class="text-white text-xl tracking-tight">my<span class="font-bold">Illini</span></span>
			</div>
		</header>

		<main class="bg-white min-h-[560px]">
			<div class="max-w-5xl mx-auto px-8 pt-12 pb-24">
				<h1 class="text-4xl font-bold mb-12" style="color: {ILLINI_BLUE};">Log In to myIllini</h1>

				<div class="grid md:grid-cols-2 gap-12 md:divide-x md:divide-gray-200">
					<!-- Future Students -->
					<div class="md:pr-12">
						<h2 class="text-xl font-bold mb-4" style="color: {ILLINI_ORANGE};">Future Students</h2>
						<p class="text-[15px] text-gray-600 mb-6 leading-relaxed">
							Access your application, accept your offer of admission, and manage your next steps for
							enrollment.
						</p>

						<form class="space-y-4 max-w-sm" on:submit={handleLogin}>
							{#if error}
								<p
									class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2"
									role="alert"
								>
									{error}
								</p>
							{/if}

							<div>
								<label for="portal-email" class="block text-sm text-gray-700 mb-1"
									>Username or Email:</label
								>
								<input
									id="portal-email"
									type="email"
									class="w-full border border-gray-400 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1"
									style="--tw-ring-color: {ILLINI_BLUE};"
									bind:value={emailInput}
									autocomplete="email"
								/>
							</div>

							<div>
								<label for="portal-password" class="block text-sm text-gray-700 mb-1"
									>Password:</label
								>
								<input
									id="portal-password"
									type="password"
									class="w-full border border-gray-400 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1"
									style="--tw-ring-color: {ILLINI_BLUE};"
									bind:value={passwordInput}
									autocomplete="current-password"
								/>
							</div>

							<div class="flex items-center gap-3 pt-1">
								<button
									type="submit"
									class="text-white text-sm font-bold px-5 py-2 hover:opacity-90"
									style="background-color: {ILLINI_BLUE};"
								>
									Log In
								</button>
								<button
									type="button"
									class="border border-gray-400 bg-gray-100 px-3 py-2 text-xs text-gray-700 hover:bg-gray-200"
									on:click={handleLoadSavedLogin}
								>
									Load saved PredictAdmit login
								</button>
							</div>

							<div class="pt-2 space-y-2 text-[13px]">
								<a href="/disclaimer" class="block text-gray-600 hover:underline"
									>Forgot your username or password?</a
								>
								<a href="/disclaimer" class="block text-gray-600 hover:underline"
									>Don't have an account?</a
								>
							</div>
						</form>

						<p class="pt-8 text-[11px] leading-relaxed text-gray-500 max-w-sm">
							For this simulation, use the same email address and password that you saved on the
							PredictAdmit.com home page. No real application data is used, and all information is
							stored only in your browser.
						</p>
					</div>

					<!-- Current Students -->
					<div class="md:pl-12">
						<h2 class="text-xl font-bold mb-4" style="color: {ILLINI_ORANGE};">Current Students</h2>
						<p class="text-[15px] font-bold text-gray-800 mb-1">student.myillini.illinois.edu</p>
						<p class="text-[15px] text-gray-600 mb-6 leading-relaxed">
							Access your course schedule, grades, account balance, and more.
						</p>
						<a
							href="/disclaimer"
							class="inline-block text-white text-sm font-bold px-5 py-2 hover:opacity-90"
							style="background-color: {ILLINI_BLUE};"
						>
							Log In
						</a>
					</div>
				</div>
			</div>
		</main>

		<footer style="background-color: {ILLINI_BLUE};" class="text-white py-6">
			<div class="max-w-5xl mx-auto px-6 text-center space-y-2">
				<p class="text-sm">
					<strong>Need Help?</strong> Email
					<a href="/disclaimer" class="underline">admissions@illinois.edu</a> or call 217-333-0302.
				</p>
				<p class="text-[11px] text-blue-200">
					&copy; Copyright University of Illinois Board of Trustees
				</p>
				<p class="text-[11px] text-blue-200 space-x-3">
					<a href="/disclaimer" class="underline">Web Privacy Notice</a>
					<a href="/disclaimer" class="underline">Cookie Settings</a>
				</p>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- =================== PORTAL =================== -->
		<header style="background-color: {ILLINI_BLUE};" class="h-14">
			<div class="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
				<div class="flex items-center gap-2">
					<span
						class="inline-flex items-center justify-center w-6 h-8 font-serif font-black text-white text-lg leading-none border-2"
						style="background-color: {ILLINI_ORANGE}; border-color: {ILLINI_BLUE};">I</span
					>
					<span class="text-white text-xl tracking-tight"
						>my<span class="font-bold">Illini</span></span
					>
				</div>
				<div class="flex items-center gap-4 text-[13px] text-white">
					<span
						class="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold"
						style="background-color: {ILLINI_ORANGE};">{firstName().charAt(0)}</span
					>
					<span>Hi {firstName()}!</span>
					<a href="/disclaimer" class="underline">Dashboard</a>
					<a href="/disclaimer" class="underline">Profile</a>
					<a href="/disclaimer" class="underline">Log Off</a>
				</div>
			</div>
		</header>

		<!-- Hero banner (recreated) -->
		<div class="max-w-6xl mx-auto px-6 pt-6">
			<div
				class="relative overflow-hidden h-44 flex items-center px-10"
				style="background: linear-gradient(110deg, {ILLINI_BLUE} 0%, {ILLINI_BLUE} 45%, {ILLINI_ORANGE} 130%);"
			>
				<div>
					<h2 class="text-white text-3xl md:text-4xl font-serif font-bold leading-tight">
						Joining the Illinois legacy<br />starts with your app.
					</h2>
					<div class="mt-3 h-1 w-40" style="background-color: {ILLINI_ORANGE};"></div>
				</div>
			</div>
		</div>

		<main class="max-w-6xl mx-auto px-6 pb-16">
			<!-- Your Applications -->
			<section class="mt-10">
				<h3 class="text-lg font-bold mb-3" style="color: {ILLINI_ORANGE};">Your Applications</h3>
				<div class="border border-gray-200 bg-gray-50">
					<div class="px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
						<div>
							<p class="font-bold text-gray-800 text-sm tracking-wide">
								FIRST-YEAR APP: FALL 2026, COMPUTER SCIENCE AND ADVERTISING
							</p>
							<p class="text-xs text-gray-500 mt-1">
								Reference Number: {school.referenceNumber} &middot; {school.round}
							</p>
						</div>
						<button
							on:click={handleViewUpdate}
							class="shrink-0 text-white text-sm font-bold px-4 py-2 hover:opacity-90"
							style="background-color: {ILLINI_BLUE};"
						>
							View Update &raquo;
						</button>
					</div>
					<div class="px-5 py-3 border-t border-gray-200 bg-white">
						<p class="text-[13px] text-gray-600">
							An update to your application was last posted <strong>{school.statusLastPosted}</strong
							>. Select <strong>View Update</strong> to see your admission decision.
						</p>
					</div>
				</div>
			</section>

			<!-- Received Items -->
			<section class="mt-8">
				<h3 class="text-lg font-bold mb-3" style="color: {ILLINI_ORANGE};">Received Items</h3>
				<table class="w-full text-sm text-left border border-gray-200">
					<thead class="bg-gray-100 text-gray-700">
						<tr>
							<th class="px-4 py-2 font-bold">Item</th>
							<th class="px-4 py-2 font-bold">Status</th>
							<th class="px-4 py-2 font-bold">Date</th>
						</tr>
					</thead>
					<tbody>
						{#each receivedItems as item}
							<tr class="border-t border-gray-200">
								<td class="px-4 py-2">{item.detail}</td>
								<td class="px-4 py-2 text-green-700 font-semibold">&#10003; {item.note}</td>
								<td class="px-4 py-2 text-gray-600">{item.date}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</section>

			<!-- Start a New Application -->
			<section class="mt-10">
				<h3 class="text-lg font-bold mb-2" style="color: {ILLINI_ORANGE};">Start a New Application</h3>
				<p class="text-sm text-gray-600 mb-4">
					First-year applicants apply through the <a href="/disclaimer" class="underline"
						>Common App</a
					>.
				</p>
				<div class="space-y-3">
					{#each ['TRANSFER', 'NONDEGREE', "SECOND BACHELOR'S DEGREE"] as app}
						<a
							href="/disclaimer"
							class="block border border-gray-200 bg-gray-50 px-5 py-3 font-bold text-gray-800 text-sm tracking-wide hover:bg-gray-100"
						>
							{app}
						</a>
					{/each}
				</div>
			</section>
		</main>

		<footer style="background-color: {ILLINI_BLUE};" class="text-white py-6">
			<div class="max-w-5xl mx-auto px-6 text-center space-y-2">
				<p class="text-sm">
					<strong>Need help?</strong> Email
					<a href="/disclaimer" class="underline">admissions@illinois.edu</a> or call 217-333-0302.
				</p>
				<p class="text-[11px] text-blue-200">
					&copy; Copyright University of Illinois Board of Trustees
				</p>
				<p class="text-[11px] text-blue-200">
					<a href="/disclaimer" class="underline">Web Privacy Notice</a>
				</p>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<IllinoisAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<IllinoisDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
