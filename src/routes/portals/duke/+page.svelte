<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import DukeAccepted from '$lib/components/duke/DukeAccepted.svelte';
	import DukeDenied from '$lib/components/duke/DukeDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'duke';
	const school = {
		schoolName: 'Duke University',
		primaryColor: '#00539B',
		footerDomain: 'duke.edu',
		statusLastPosted: 'March 26, 2026',
		round: 'Regular Decision',
		referenceNumber: '074087361'
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
	<title>{school.schoolName} — Undergraduate Admissions</title>
</svelte:head>

<div class="min-h-screen bg-white font-sans text-gray-800">
	{#if !authenticated}
		<!-- ============================ LOGIN ============================ -->
		<header class="border-b border-gray-200 bg-white">
			<div class="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-6">
				<div class="flex items-center gap-3">
					<span class="font-serif text-3xl font-semibold" style="color: {school.primaryColor};">
						Duke
					</span>
					<span
						class="border-l border-gray-300 pl-3 text-[11px] font-semibold uppercase leading-tight tracking-wide"
						style="color: {school.primaryColor};"
					>
						Undergraduate<br />Admissions
					</span>
				</div>
				<nav
					class="hidden items-center gap-8 text-[13px] font-bold uppercase tracking-wide md:flex"
					style="color: {school.primaryColor};"
				>
					<a href="/disclaimer" class="hover:underline">Our Students</a>
					<a href="/disclaimer" class="hover:underline">Campus Life</a>
					<a href="/disclaimer" class="hover:underline">Financial Support</a>
				</nav>
				<div
					class="flex text-[13px] font-bold uppercase tracking-wide"
					style="color: {school.primaryColor};"
				>
					<a href="/disclaimer" class="border border-gray-200 px-5 py-4 hover:bg-gray-50">Visit</a>
					<a href="/disclaimer" class="border border-l-0 border-gray-200 px-5 py-4 hover:bg-gray-50"
						>Apply</a
					>
				</div>
			</div>
		</header>

		<div style="background-color: {school.primaryColor};" class="h-[60px]"></div>

		<main class="min-h-[440px] bg-white">
			<div class="mx-auto max-w-6xl px-8 py-10">
				<h1 class="mb-6 text-4xl font-normal text-gray-900">Login</h1>

				<div
					class="mb-6 border-l-4 border-green-700 bg-[#E4EBC8] px-4 py-3 text-[15px] text-gray-900"
				>
					To log in, please enter your email address and password.
				</div>

				<form on:submit={autoLogin}>
					{#if error}
						<p
							class="mb-3 max-w-lg border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="mb-2 flex items-center gap-3">
						<label for="portal-email" class="w-32 text-[15px] text-gray-900">Email Address</label>
						<input
							id="portal-email"
							type="email"
							class="w-64 border border-gray-400 bg-white px-2 py-1 text-[14px] shadow-inner"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="mb-4 flex items-center gap-3">
						<label for="portal-password" class="w-32 text-[15px] text-gray-900">Password</label>
						<input
							id="portal-password"
							type="password"
							class="w-64 border border-gray-400 bg-white px-2 py-1 text-[14px] shadow-inner"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a
							href="/disclaimer"
							class="ml-4 text-[15px] hover:underline"
							style="color: {school.primaryColor};"
						>
							Forgot Your Password?
						</a>
					</div>

					<div class="ml-[8.75rem] flex items-center gap-3">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="border border-gray-400 bg-gray-300 px-4 py-1 text-[13px] font-semibold text-black shadow-[1px_1px_0_0_rgba(0,0,0,0.3)] hover:bg-gray-200 active:shadow-none"
						>
							Login
						</button>
						</div>

					<p class="mt-8 max-w-2xl text-[11px] leading-relaxed text-gray-500">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is stored
						only in your browser.
					</p>
				</form>
			</div>
		</main>

		<footer style="background-color: {school.primaryColor};" class="mt-10 text-white">
			<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-[12px]">
				<span class="font-bold uppercase tracking-wide">&copy; DUKE.EDU</span>
				<nav class="flex gap-6">
					<a href="/disclaimer" class="hover:underline">Counselors</a>
					<a href="/disclaimer" class="hover:underline">Families</a>
					<a href="/disclaimer" class="hover:underline">Resources</a>
					<a href="/disclaimer" class="hover:underline">FAQs</a>
					<a href="/disclaimer" class="hover:underline">Contact</a>
				</nav>
				<div class="flex gap-3 text-[13px]">
					<span aria-hidden="true">𝕏</span>
					<span aria-hidden="true">f</span>
					<span aria-hidden="true">◎</span>
					<span aria-hidden="true">▶</span>
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============================ PORTAL ============================ -->
		<header class="border-b border-gray-200 bg-white">
			<div class="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-6">
				<div class="flex items-center gap-3">
					<span class="font-serif text-3xl font-semibold" style="color: {school.primaryColor};">
						Duke
					</span>
					<span
						class="border-l border-gray-300 pl-3 text-[11px] font-semibold uppercase leading-tight tracking-wide"
						style="color: {school.primaryColor};"
					>
						Undergraduate<br />Admissions
					</span>
				</div>
				<nav
					class="hidden items-center gap-8 text-[13px] font-bold uppercase tracking-wide md:flex"
					style="color: {school.primaryColor};"
				>
					<a href="/disclaimer" class="hover:underline">Our Students</a>
					<a href="/disclaimer" class="hover:underline">Campus Life</a>
					<a href="/disclaimer" class="hover:underline">Financial Support</a>
				</nav>
				<div
					class="flex text-[13px] font-bold uppercase tracking-wide"
					style="color: {school.primaryColor};"
				>
					<a href="/disclaimer" class="border border-gray-200 px-5 py-4 hover:bg-gray-50">Visit</a>
					<a href="/disclaimer" class="border border-l-0 border-gray-200 px-5 py-4 hover:bg-gray-50"
						>Apply</a
					>
				</div>
			</div>
		</header>

		<div style="background-color: {school.primaryColor};" class="h-[46px]"></div>
		<div class="mx-auto flex max-w-7xl justify-end px-6 py-1 text-[12px] text-gray-700">
			<span>{applicantName()}</span>
			<a href="/disclaimer" class="ml-2 hover:underline" style="color: {school.primaryColor};">Logout</a
			>
		</div>

		<main class="mx-auto max-w-7xl px-6 pb-10">
			<div class="grid grid-cols-1 gap-10 lg:grid-cols-[1.7fr_1fr]">
				<!-- LEFT COLUMN -->
				<div>
					<div
						class="mb-4 h-56 w-full rounded-sm bg-cover bg-center"
						style="background-image: linear-gradient(180deg, rgba(60,90,50,0.15), rgba(40,60,80,0.35)), linear-gradient(120deg, #6b7a3a 0%, #8a7a4a 35%, #4a5a6a 70%, #2d3b4a 100%);"
						role="img"
						aria-label="Duke University campus entrance with the Chapel in the distance"
					></div>

					<h2 class="mb-2 text-2xl font-bold" style="color: {school.primaryColor};">
						Hello, {firstName()}!
					</h2>
					<hr class="mb-4 border-gray-300" />

					<div class="mb-5 flex gap-2 text-[13px] font-semibold">
						<button
							class="flex-1 rounded-full px-5 py-2 text-center text-white"
							style="background-color: {school.primaryColor};"
						>
							My Admissions Information
						</button>
						<a
							href="/disclaimer"
							class="flex-1 rounded-full border border-gray-300 bg-gray-50 px-5 py-2 text-center text-gray-500"
						>
							My Financial Aid Checklist
						</a>
					</div>

					<h3 class="text-[15px] font-bold text-gray-900">Status Update</h3>
					<p class="mb-2 text-[13px] text-gray-700">
						An update to your application was last posted {school.statusLastPosted}.
					</p>
					<button
						on:click={handleViewUpdate}
						class="text-[14px] font-bold hover:underline"
						style="color: {school.primaryColor};"
					>
						View Application Update &gt;&gt;
					</button>

					<h3 class="mb-1 mt-10 text-xl font-bold" style="color: {school.primaryColor};">
						Application Checklist
					</h3>
					<h3 class="mb-3 text-xl font-bold" style="color: {school.primaryColor};">
						Upload Materials
					</h3>
					<div
						class="my-4 flex items-center justify-center gap-3 text-[10px]"
						style="color: {school.primaryColor};"
					>
						<span class="h-[1px] flex-1 bg-gray-200"></span>
						<span aria-hidden="true">◆ ◆ ◆</span>
						<span class="h-[1px] flex-1 bg-gray-200"></span>
					</div>

					<p class="mb-3 text-[13px] font-bold text-gray-900">
						You selected test-consider application review. Your reported scores are listed below.
					</p>
					<table class="w-full border border-gray-500 text-left text-[13px]">
						<thead>
							<tr>
								<th class="border-r border-gray-300 px-2 py-1 font-bold">Date</th>
								<th class="border-r border-gray-300 px-2 py-1 font-bold">English</th>
								<th class="border-r border-gray-300 px-2 py-1 font-bold">Math</th>
								<th class="border-r border-gray-300 px-2 py-1 font-bold">Reading</th>
								<th class="border-r border-gray-300 px-2 py-1 font-bold">Science Reasoning</th>
								<th class="px-2 py-1 font-bold">ACT Source</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="border-r border-gray-300 px-2 py-1">2025-04-25</td>
								<td class="border-r border-gray-300 px-2 py-1"></td>
								<td class="border-r border-gray-300 px-2 py-1">35</td>
								<td class="border-r border-gray-300 px-2 py-1"></td>
								<td class="border-r border-gray-300 px-2 py-1"></td>
								<td class="px-2 py-1">Self-Reported</td>
							</tr>
							<tr>
								<td class="border-r border-gray-300 px-2 py-1">2025-06-25</td>
								<td class="border-r border-gray-300 px-2 py-1">34</td>
								<td class="border-r border-gray-300 px-2 py-1"></td>
								<td class="border-r border-gray-300 px-2 py-1">35</td>
								<td class="border-r border-gray-300 px-2 py-1">34</td>
								<td class="px-2 py-1">Self-Reported</td>
							</tr>
						</tbody>
					</table>

					<p class="mt-8 text-center text-[13px] text-gray-800">
						<strong>Account Tools:</strong>
						<a href="/disclaimer" class="ml-1 hover:underline" style="color: {school.primaryColor};"
							>Change Email Address</a
						>
						<a href="/disclaimer" class="ml-2 hover:underline" style="color: {school.primaryColor};"
							>Change Password</a
						>
						<a href="/disclaimer" class="ml-2 hover:underline" style="color: {school.primaryColor};"
							>Logout</a
						>
					</p>
				</div>

				<!-- RIGHT COLUMN -->
				<aside class="pt-2 text-[12px] leading-relaxed text-gray-800">
					<p class="mb-4">
						<strong>Admission Questions?</strong> Search our website,
						<a href="/disclaimer" class="hover:underline" style="color: {school.primaryColor};"
							>admissions.duke.edu</a
						>. We can also be reached between 8:30 a.m. - 4:30 p.m. ET at (919) 684-3214 or
						<a href="/disclaimer" class="hover:underline" style="color: {school.primaryColor};"
							>undergrad-admissions@duke.edu</a
						>. Your Admissions ID:
						<strong style="color: {school.primaryColor};">{school.referenceNumber}</strong>
					</p>
					<p class="mb-4">
						<strong>Financial Aid Questions?</strong> Please contact the Karsh Office of Financial
						Support,
						<a href="/disclaimer" class="hover:underline" style="color: {school.primaryColor};"
							>financialaid.duke.edu</a
						>, at (919) 684-6225 or
						<a href="/disclaimer" class="hover:underline" style="color: {school.primaryColor};"
							>finaid@duke.edu</a
						>. Your Financial Aid ID:
						<strong style="color: {school.primaryColor};">3223626</strong>
					</p>

					<div
						class="my-4 flex items-center justify-center gap-3 text-[10px]"
						style="color: {school.primaryColor};"
					>
						<span class="h-[1px] flex-1 bg-gray-200"></span>
						<span aria-hidden="true">◆ ◆ ◆</span>
						<span class="h-[1px] flex-1 bg-gray-200"></span>
					</div>

					<h4 class="mb-1 text-[13px] font-bold uppercase tracking-wide text-[#C24E00]">
						Edit Your Application Details
					</h4>
					<p class="mb-3">
						If you need to update your application information, please do so below. To update any
						section, click the link, select an option, and submit. You will receive written
						confirmation of changes via email. You can update your email address at the bottom of this
						page.
					</p>
					<p class="mb-3">
						Some options (standardized test consideration, decision plan [look in section for
						deadlines], college you are applying to) cannot be changed after November 1 for
						QuestBridge, November 21 for Early Decision, February 13 for Regular Decision, and April 1
						for Transfers.
					</p>
					<p class="font-bold">Most students will not need to update this information.</p>

					<div
						class="my-4 flex items-center justify-center gap-3 text-[10px]"
						style="color: {school.primaryColor};"
					>
						<span class="h-[1px] flex-1 bg-gray-200"></span>
						<span aria-hidden="true">◆ ◆ ◆</span>
						<span class="h-[1px] flex-1 bg-gray-200"></span>
					</div>
				</aside>
			</div>
		</main>

		<footer style="background-color: {school.primaryColor};" class="mt-10 text-white">
			<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-[12px]">
				<span class="font-bold uppercase tracking-wide">&copy; DUKE.EDU</span>
				<nav class="flex gap-6">
					<a href="/disclaimer" class="hover:underline">Counselors</a>
					<a href="/disclaimer" class="hover:underline">Families</a>
					<a href="/disclaimer" class="hover:underline">Resources</a>
					<a href="/disclaimer" class="hover:underline">FAQs</a>
					<a href="/disclaimer" class="hover:underline">Contact</a>
				</nav>
				<div class="flex gap-3 text-[13px]">
					<span aria-hidden="true">𝕏</span>
					<span aria-hidden="true">f</span>
					<span aria-hidden="true">◎</span>
					<span aria-hidden="true">▶</span>
				</div>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<DukeAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<DukeDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
