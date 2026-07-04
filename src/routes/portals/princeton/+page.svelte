<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import PrincetonAccepted from '$lib/components/princeton/PrincetonAccepted.svelte';
	import PrincetonDenied from '$lib/components/princeton/PrincetonDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'princeton';
	const school = {
		schoolName: 'Princeton University',
		primaryColor: '#FF8F00', // Princeton orange (accent black #000000)
		footerDomain: 'princeton.edu',
		statusLastPosted: 'March 12, 2026',
		round: 'Regular Decision',
		referenceNumber: '528370149'
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
	<title>{school.schoolName} · Applicant Portal</title>
</svelte:head>

<div class="min-h-screen font-sans bg-white text-gray-900">
	{#if !authenticated}
		<!-- ============ LOGIN PAGE ============ -->
		<header class="bg-black text-white">
			<div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<span
						class="w-9 h-9 flex items-center justify-center font-serif font-bold text-lg"
						style="background-color: {school.primaryColor}; color: #000;"
					>
						P
					</span>
					<div class="leading-tight">
						<div class="font-serif text-lg tracking-wide">Princeton University</div>
						<div class="text-[10px] uppercase tracking-[0.2em] text-gray-300">
							Office of Undergraduate Admission
						</div>
					</div>
				</div>
				<span class="font-serif text-sm text-gray-300">1746</span>
			</div>
		</header>

		<div style="background-color: {school.primaryColor};" class="h-2"></div>

		<main class="bg-white min-h-[520px] py-20">
			<div class="max-w-md mx-auto px-6">
				<h1 class="text-3xl font-serif font-normal mb-2 text-gray-900">Applicant Portal</h1>
				<p class="text-sm text-gray-600 mb-8">
					Sign in to view the status of your application to Princeton University.
				</p>

				<form class="space-y-5" on:submit={autoLogin}>
					{#if error}
						<p
							class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2"
							role="alert"
						>
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
							class="border border-gray-400 bg-white px-3 py-2 text-sm w-full focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
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
							class="border border-gray-400 bg-white px-3 py-2 text-sm w-full focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a href="/disclaimer" class="inline-block mt-2 text-[12px] text-blue-800 hover:underline">
							Forgot your password?
						</a>
					</div>

					<div class="flex flex-wrap items-center gap-3 pt-2">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="px-6 py-2 text-sm font-semibold text-black border border-black hover:opacity-90"
							style="background-color: {school.primaryColor};"
						>
							Login
						</button>
						</div>

					<p class="pt-6 text-[11px] leading-relaxed text-gray-500">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<footer class="bg-black text-gray-300 py-6 text-[11px]">
			<div class="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-3">
				<div class="flex flex-wrap gap-4 uppercase tracking-wide text-[10px]">
					<a href="/disclaimer" class="hover:text-white">Admission</a>
					<a href="/disclaimer" class="hover:text-white">Accessibility</a>
					<a href="/disclaimer" class="hover:text-white">Blog</a>
					<a href="/disclaimer" class="hover:text-white">Contact</a>
					<a href="/disclaimer" class="hover:text-white">Counselors</a>
					<a href="/disclaimer" class="hover:text-white">Request Info</a>
				</div>
				<span>PredictAdmit Simulation — Not affiliated with Princeton University</span>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============ PORTAL / STATUS PAGE ============ -->
		<header class="bg-black text-white">
			<div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<span
						class="w-9 h-9 flex items-center justify-center font-serif font-bold text-lg"
						style="background-color: {school.primaryColor}; color: #000;"
					>
						P
					</span>
					<div class="leading-tight">
						<div class="font-serif text-lg tracking-wide">Princeton University</div>
						<div class="text-[10px] uppercase tracking-[0.2em] text-gray-300">
							Office of Undergraduate Admission
						</div>
					</div>
				</div>
				<div class="flex items-center gap-4 text-[13px]">
					<span class="font-serif text-gray-300">1746</span>
					<span class="text-gray-200">{applicantName()}</span>
					<a
						href="/disclaimer"
						class="text-gray-300 hover:text-white uppercase text-[11px] tracking-wide">Logout</a
					>
				</div>
			</div>
		</header>

		<nav style="background-color: {school.primaryColor};" class="text-black">
			<div class="max-w-6xl mx-auto px-6 flex flex-wrap gap-6 text-[12px] font-semibold uppercase tracking-wide">
				{#each ['Apply', 'Cost & Aid', 'Academics', 'Community', 'Diversity'] as item}
					<a href="/disclaimer" class="py-2 hover:underline">{item}</a>
				{/each}
			</div>
		</nav>

		<main class="max-w-4xl mx-auto px-6 py-12">
			<h1 class="text-3xl font-serif text-gray-900 mb-2">
				Application Status for {applicantName()}
			</h1>
			<p class="text-sm text-gray-600 mb-8">
				If you need to contact us regarding your application, provide your name and this reference
				number: <strong>{school.referenceNumber}</strong>.
			</p>

			<div class="flex gap-10">
				<aside class="w-1/4 hidden md:block">
					<nav class="text-sm">
						<a
							href="/disclaimer"
							class="block py-2 px-3 font-semibold border-l-4 bg-gray-50 text-gray-900"
							style="border-color: {school.primaryColor};"
						>
							Status Update
						</a>
						<a
							href="/disclaimer"
							class="block py-2 px-3 text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
							>Application Checklist</a
						>
						<a
							href="/disclaimer"
							class="block py-2 px-3 text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
							>Financial Aid</a
						>
						<a
							href="/disclaimer"
							class="block py-2 px-3 text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
							>Update Contact Info</a
						>
					</nav>
				</aside>

				<section class="flex-1">
					<h2 class="text-xl font-serif text-gray-900 mb-4">Status Update</h2>
					<div class="border-l-4 bg-gray-50 p-5" style="border-color: {school.primaryColor};">
						<p class="text-base text-gray-800 mb-4">
							An update to your application was last posted
							<strong>{school.statusLastPosted}</strong>.
						</p>
						<button
							on:click={handleViewUpdate}
							class="text-sm font-semibold px-5 py-2 text-black border border-black hover:opacity-90"
							style="background-color: {school.primaryColor};"
						>
							View Simulated Status Update &raquo;
						</button>
					</div>

					<div class="mt-10">
						<h2 class="text-xl font-serif text-gray-900 mb-4">Application Checklist</h2>
						<table class="w-full text-sm text-left border border-gray-200">
							<thead class="bg-gray-100 text-gray-700">
								<tr>
									<th class="px-4 py-2 font-semibold">Item</th>
									<th class="px-4 py-2 font-semibold">Status</th>
									<th class="px-4 py-2 font-semibold">Date</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-gray-200">
									<td class="px-4 py-2">Common / Coalition Application</td>
									<td class="px-4 py-2 text-green-700 font-semibold">Received</td>
									<td class="px-4 py-2">01/01/2026</td>
								</tr>
								<tr class="border-t border-gray-200">
									<td class="px-4 py-2">Princeton Supplement</td>
									<td class="px-4 py-2 text-green-700 font-semibold">Received</td>
									<td class="px-4 py-2">01/01/2026</td>
								</tr>
								<tr class="border-t border-gray-200">
									<td class="px-4 py-2">Graded Written Paper</td>
									<td class="px-4 py-2 text-green-700 font-semibold">Received</td>
									<td class="px-4 py-2">01/03/2026</td>
								</tr>
								<tr class="border-t border-gray-200">
									<td class="px-4 py-2">Secondary School Report &amp; Transcript</td>
									<td class="px-4 py-2 text-green-700 font-semibold">Received</td>
									<td class="px-4 py-2">01/05/2026</td>
								</tr>
								<tr class="border-t border-gray-200">
									<td class="px-4 py-2">Two Teacher Recommendations</td>
									<td class="px-4 py-2 text-green-700 font-semibold">Received</td>
									<td class="px-4 py-2">01/06/2026</td>
								</tr>
								<tr class="border-t border-gray-200">
									<td class="px-4 py-2">Optional Arts Supplement</td>
									<td class="px-4 py-2 text-gray-500 font-semibold">Not Submitted</td>
									<td class="px-4 py-2">&mdash;</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</main>

		<footer class="bg-black text-gray-300 py-6 text-[11px] mt-12">
			<div class="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-3">
				<div class="flex flex-wrap gap-4 uppercase tracking-wide text-[10px]">
					<a href="/disclaimer" class="hover:text-white">Admission</a>
					<a href="/disclaimer" class="hover:text-white">Accessibility</a>
					<a href="/disclaimer" class="hover:text-white">Blog</a>
					<a href="/disclaimer" class="hover:text-white">Contact</a>
					<a href="/disclaimer" class="hover:text-white">Counselors</a>
					<a href="/disclaimer" class="hover:text-white">Podcast</a>
					<a href="/disclaimer" class="hover:text-white">Request Info</a>
				</div>
				<span>&copy; The Trustees of Princeton University</span>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<PrincetonAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<PrincetonDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
