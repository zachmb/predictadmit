<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import EmoryAccepted from '$lib/components/emory/EmoryAccepted.svelte';
	import EmoryDenied from '$lib/components/emory/EmoryDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'emory';
	const EMORY_BLUE = '#012169';
	const EMORY_GOLD = '#B58500';

	const school = {
		schoolName: 'Emory University',
		primaryColor: EMORY_BLUE,
		footerDomain: 'emory.edu',
		statusLastPosted: 'March 25, 2026',
		round: 'Regular Decision',
		referenceNumber: '4193085'
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

	// --- Received documents (from status capture) ---
	const receivedDocs = [
		{ detail: 'Fee Waiver', date: '01/02/2026 10:54 AM' },
		{ detail: 'Common Application', date: '01/02/2026 10:54 AM' },
		{ detail: 'Official High School Transcript', date: '01/05/2026 09:12 AM' },
		{ detail: 'Counselor Recommendation', date: '01/05/2026 09:12 AM' },
		{ detail: 'Teacher Recommendation', date: '01/07/2026 02:31 PM' }
	];
</script>

<svelte:head>
	<title>Admission | Emory University</title>
</svelte:head>

<div class="min-h-screen font-sans bg-white text-gray-800">
	{#if !authenticated}
		<!-- ================= LOGIN PAGE ================= -->
		<header class="border-b border-gray-200 bg-white">
			<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<span
						class="text-2xl font-serif font-bold tracking-tight"
						style="color: {school.primaryColor};"
					>
						EMORY
					</span>
					<span
						class="text-[11px] uppercase tracking-wider text-slate-600 border-l border-slate-300 pl-3"
					>
						Office of Undergraduate Admission
					</span>
				</div>
				<a
					href="/disclaimer"
					class="text-[11px] uppercase tracking-wider font-semibold"
					style="color: {school.primaryColor};"
				>
					Check My Status
				</a>
			</div>
		</header>

		<div style="background-color: {school.primaryColor};" class="h-1.5"></div>
		<div style="background-color: {EMORY_GOLD};" class="h-1"></div>

		<main class="bg-white min-h-[500px] py-20">
			<div class="max-w-xl mx-auto px-6 text-base">
				<h1 class="text-3xl font-serif font-normal mb-2 text-slate-900">Login</h1>
				<p class="text-[13px] text-slate-600 mb-8">
					To log in, please enter your email address and password.
				</p>

				<form class="space-y-5 max-w-[500px]" on:submit={autoLogin}>
					{#if error}
						<p
							class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="flex flex-col gap-1">
						<label for="portal-email" class="text-[13px] font-semibold text-slate-800">
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="border border-slate-400 bg-white px-3 py-2 text-[14px] w-full rounded-sm focus:outline-none focus:border-[#012169]"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex flex-col gap-1">
						<label for="portal-password" class="text-[13px] font-semibold text-slate-800">
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="border border-slate-400 bg-white px-3 py-2 text-[14px] w-full rounded-sm focus:outline-none focus:border-[#012169]"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a href="/disclaimer" class="text-[12px] text-[#007dba] hover:underline mt-1">
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-3 pt-2">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="px-6 py-2 text-[13px] font-semibold text-white uppercase tracking-wide rounded-sm hover:opacity-90"
							style="background-color: {school.primaryColor};"
						>
							Login
						</button>
						</div>

					<p class="pt-6 text-[11px] leading-relaxed text-slate-500">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is stored
						only in your browser.
					</p>
				</form>
			</div>
		</main>

		<footer class="text-white text-[11px]" style="background-color: {school.primaryColor};">
			<div class="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between gap-2">
				<span>
					Emory University · Office of Undergraduate Admission · 1390 Oxford Road NE · Atlanta, GA
					30322-1016
				</span>
				<span>PredictAdmit Simulation — Not affiliated with Emory University</span>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ================= PORTAL / STATUS PAGE ================= -->
		<header class="border-b border-gray-200 bg-white">
			<div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<span
						class="text-2xl font-serif font-bold tracking-tight"
						style="color: {school.primaryColor};"
					>
						EMORY
					</span>
					<span
						class="text-[11px] uppercase tracking-wider text-slate-600 border-l border-slate-300 pl-3"
					>
						Office of Undergraduate Admission
					</span>
				</div>
				<div class="text-[12px] text-slate-600">{school.footerDomain}</div>
			</div>
		</header>
		<div style="background-color: {school.primaryColor};" class="h-1.5"></div>
		<div style="background-color: {EMORY_GOLD};" class="h-1"></div>

		<div class="max-w-6xl mx-auto px-6 mt-8 pb-12">
			<div class="flex flex-col md:flex-row justify-between md:items-end mb-6 border-b border-gray-300 pb-3 gap-3">
				<h1 class="text-3xl font-serif font-normal text-slate-900">Application Status</h1>
				<div class="text-[12px] text-slate-600 space-y-0.5 md:text-right">
					<div><strong>{applicantName()}</strong> · {school.referenceNumber}</div>
					<div>2026 {school.round} — Emory College</div>
				</div>
			</div>

			<nav class="flex flex-wrap gap-x-6 gap-y-1 text-[12px] mb-8">
				<a href="/disclaimer" class="text-[#007dba] hover:underline">Emory College Decisions</a>
				<a href="/disclaimer" class="text-[#007dba] hover:underline">Oxford College Decisions</a>
				<a href="/disclaimer" class="text-[#007dba] hover:underline">Upload Materials</a>
				<a href="/disclaimer" class="text-[#007dba] hover:underline">Verify Address</a>
			</nav>

			<!-- Decisions section -->
			<section class="mb-10">
				<h2
					class="text-lg font-serif font-semibold mb-3 pb-1 border-b-2"
					style="color: {school.primaryColor}; border-color: {EMORY_GOLD};"
				>
					Emory College Decisions
				</h2>
				<table class="w-full text-[13px] text-left border border-gray-300">
					<thead>
						<tr class="text-white" style="background-color: {school.primaryColor};">
							<th class="px-4 py-2 font-semibold">Date</th>
							<th class="px-4 py-2 font-semibold">Decision</th>
							<th class="px-4 py-2 font-semibold">View</th>
						</tr>
					</thead>
					<tbody>
						<tr class="border-b border-gray-200 bg-[#f7f8fa]">
							<td class="px-4 py-3">Mar 25 2026 6:00PM</td>
							<td class="px-4 py-3">
								<span class="font-semibold" style="color: {school.primaryColor};"
									>Status Update Available</span
								>
							</td>
							<td class="px-4 py-3">
								<button
									on:click={handleViewUpdate}
									class="text-[12px] font-semibold px-4 py-1.5 text-white rounded-sm hover:opacity-90"
									style="background-color: {EMORY_GOLD};"
								>
									View Letter »
								</button>
							</td>
						</tr>
					</tbody>
				</table>
				<p class="text-[12px] text-slate-500 mt-2">
					An update to your application was last posted <strong>{school.statusLastPosted}</strong>.
				</p>
			</section>

			<!-- Application review flags -->
			<section class="mb-10 grid md:grid-cols-2 gap-6">
				<div class="border border-gray-200 p-4 bg-[#fafafa]">
					<h3 class="text-[13px] font-semibold text-slate-800 mb-1">Test Scores</h3>
					<p class="text-[12px] text-slate-600">Consider test scores</p>
					<p class="text-[11px] text-slate-400 mt-1">
						The deadline to update test scores has passed.
					</p>
				</div>
				<div class="border border-gray-200 p-4 bg-[#fafafa]">
					<h3 class="text-[13px] font-semibold text-slate-800 mb-1">Scholar Programs</h3>
					<p class="text-[12px] text-slate-600">Do not consider for scholar programs</p>
					<p class="text-[11px] text-slate-400 mt-1">
						The deadline to add consideration for Scholar Programs has passed.
					</p>
				</div>
			</section>

			<!-- Upload materials / received documents -->
			<section class="mb-10">
				<h2
					class="text-lg font-serif font-semibold mb-3 pb-1 border-b-2"
					style="color: {school.primaryColor}; border-color: {EMORY_GOLD};"
				>
					Upload Materials
				</h2>
				<p class="text-[12px] text-slate-600 mb-4">
					We have received the following documents from you:
				</p>
				<table class="w-full text-[13px] text-left border border-gray-300">
					<thead class="bg-gray-100">
						<tr>
							<th class="px-4 py-2 font-semibold">Status</th>
							<th class="px-4 py-2 font-semibold">Document</th>
							<th class="px-4 py-2 font-semibold">Date Received</th>
						</tr>
					</thead>
					<tbody>
						{#each receivedDocs as doc}
							<tr class="border-b border-gray-200">
								<td class="px-4 py-2 font-semibold text-green-700">✔ Received</td>
								<td class="px-4 py-2">{doc.detail}</td>
								<td class="px-4 py-2 text-slate-600">{doc.date}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</section>

			<!-- Verify address -->
			<section class="mb-6">
				<h2
					class="text-lg font-serif font-semibold mb-3 pb-1 border-b-2"
					style="color: {school.primaryColor}; border-color: {EMORY_GOLD};"
				>
					Verify Address
				</h2>
				<p class="text-[12px] text-slate-600 mb-2">We have your address listed as follows:</p>
				<div class="text-[13px] text-slate-800 leading-relaxed">
					<div class="font-semibold">Permanent Address</div>
					<div>2847 Birchwood Ln</div>
					<div>Naperville, IL 60540-4417</div>
					<div>United States</div>
				</div>
				<div class="mt-3 text-[12px] space-x-4">
					<a href="/disclaimer" class="text-[#007dba] hover:underline">Edit Addresses</a>
					<a href="/disclaimer" class="text-[#007dba] hover:underline">Change Password</a>
					<a href="/disclaimer" class="text-[#007dba] hover:underline">Logout</a>
				</div>
			</section>
		</div>

		<footer class="text-white text-[11px]" style="background-color: {school.primaryColor};">
			<div class="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between gap-2">
				<span>
					Emory University · Office of Undergraduate Admission · 1390 Oxford Road NE · Atlanta, GA
					30322-1016
				</span>
				<span>PredictAdmit Simulation — Not affiliated with Emory University</span>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<EmoryAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<EmoryDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
