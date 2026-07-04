<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import NotreDameAccepted from '$lib/components/notredame/NotreDameAccepted.svelte';
	import NotreDameDenied from '$lib/components/notredame/NotreDameDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'notredame';
	const ND_NAVY = '#0C2340'; // Notre Dame navy
	const ND_GOLD = '#C99700'; // Notre Dame gold

	const school = {
		schoolName: 'University of Notre Dame',
		primaryColor: ND_NAVY,
		footerDomain: 'nd.edu',
		statusLastPosted: 'March 25, 2026',
		round: 'Regular Decision',
		referenceNumber: '51930842'
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

	// --- Application Checklist Data (from real ND portal capture) ---
	const checklist = [
		{ detail: 'Application', date: '01/03/2026', status: 'Received', color: 'text-green-700' },
		{ detail: 'High School Transcript', date: '01/29/2026', status: 'Received', color: 'text-green-700' },
		{ detail: "Teacher's Evaluation", date: '01/04/2026', status: 'Received', color: 'text-green-700' },
		{ detail: "Counselor's Evaluation", date: '01/27/2026', status: 'Received', color: 'text-green-700' },
		{ detail: 'ACT or SAT Test Scores', date: '01/03/2026', status: 'Received', color: 'text-green-700' },
		{ detail: 'Mid-year Grades - when available', date: '01/29/2026', status: 'Waived', color: 'text-slate-500' },
		{ detail: 'Application Fee', date: '01/03/2026', status: 'Received', color: 'text-green-700' },
		{ detail: 'School Report', date: '02/06/2026', status: 'Received', color: 'text-green-700' }
	];
</script>

<svelte:head>
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen font-sans bg-white text-gray-800">
	{#if !authenticated}
		<!-- ===================== LOGIN PAGE ===================== -->
		<header class="border-b-4" style="background-color: {ND_NAVY}; border-color: {ND_GOLD};">
			<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
				<div class="flex flex-col leading-tight">
					<span class="text-lg md:text-xl font-serif font-bold tracking-wide text-white">
						University of Notre Dame
					</span>
					<span class="text-[11px] uppercase tracking-[0.2em] text-white/70">
						Enrollment Division
					</span>
				</div>
				<nav class="hidden md:flex items-center gap-5 text-[12px] uppercase tracking-wide text-white/80">
					<a href="/disclaimer" class="hover:text-white" style="color: {ND_GOLD};">Undergraduate Admissions</a>
					<a href="/disclaimer" class="hover:text-white">Pre-College Programs</a>
					<a href="/disclaimer" class="hover:text-white">Financial Aid</a>
					<a href="/disclaimer" class="hover:text-white">Student Accounts</a>
				</nav>
			</div>
		</header>

		<main class="bg-white min-h-[520px] py-16">
			<div class="max-w-xl mx-auto px-6">
				<div class="text-[12px] text-slate-500 mb-6">
					<a href="/disclaimer" class="hover:underline">Home</a>
					<span class="mx-1">/</span>
					<span>Login</span>
				</div>

				<h1 class="text-3xl font-serif mb-2" style="color: {ND_NAVY};">Login</h1>
				<div class="h-1 w-16 mb-8" style="background-color: {ND_GOLD};"></div>

				<p class="text-[14px] text-slate-700 mb-8">
					To log in, please enter your email address and password.
				</p>

				<form class="space-y-5 max-w-md" on:submit={autoLogin}>
					{#if error}
						<p class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2" role="alert">
							{error}
						</p>
					{/if}

					<div>
						<label for="portal-email" class="block text-[13px] font-semibold text-slate-800 mb-1">
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="border border-slate-400 bg-white px-3 py-2 text-[14px] w-full focus:outline-none focus:ring-2"
							style="--tw-ring-color: {ND_NAVY};"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div>
						<label for="portal-password" class="block text-[13px] font-semibold text-slate-800 mb-1">
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="border border-slate-400 bg-white px-3 py-2 text-[14px] w-full focus:outline-none focus:ring-2"
							style="--tw-ring-color: {ND_NAVY};"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a href="/disclaimer" class="inline-block mt-2 text-[12px] hover:underline" style="color: {ND_NAVY};">
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-4 pt-2">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="px-6 py-2 text-[14px] font-semibold text-white uppercase tracking-wide hover:opacity-90"
							style="background-color: {ND_NAVY};"
						>
							Login
						</button>
						</div>

					<p class="pt-6 text-[11px] leading-relaxed text-slate-500 max-w-md">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<footer style="background-color: {ND_NAVY};" class="text-white/80 py-8">
			<div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 text-[12px]">
				<div>
					<div class="font-serif text-white text-sm mb-1">University of Notre Dame</div>
					<div>Enrollment Division</div>
					<div>McKenna Hall, Notre Dame, IN 46556</div>
					<div>574-631-7505 &middot; admissions@nd.edu</div>
				</div>
				<div class="md:text-right self-end">
					<div>&copy; 2026 University of Notre Dame</div>
					<div class="text-white/50 mt-1">PredictAdmit Simulation &mdash; Not affiliated with the University of Notre Dame</div>
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ===================== PORTAL PAGE ===================== -->
		<header class="border-b-4" style="background-color: {ND_NAVY}; border-color: {ND_GOLD};">
			<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
				<div class="flex flex-col leading-tight">
					<span class="text-lg md:text-xl font-serif font-bold tracking-wide text-white">
						University of Notre Dame
					</span>
					<span class="text-[11px] uppercase tracking-[0.2em] text-white/70">
						Enrollment Division
					</span>
				</div>
				<div class="flex items-center gap-4 text-[13px] text-white/90">
					<span>{applicantName()}</span>
					<a href="/disclaimer" class="hover:underline" style="color: {ND_GOLD};">Logout</a>
				</div>
			</div>
		</header>

		<div class="max-w-6xl mx-auto px-6 mt-8 pb-12">
			<!-- Tabs -->
			<nav class="flex border-b border-gray-300 mb-8">
				{#each ['Admissions', 'Financial Aid'] as tab}
					<button
						on:click={() => (activeTab = tab === 'Admissions' ? 'Admissions Status' : tab)}
						class="px-5 py-2 text-sm font-semibold border-b-2 transition-colors"
						class:text-slate-900={(tab === 'Admissions' && activeTab === 'Admissions Status') || activeTab === tab}
						class:text-slate-500={!((tab === 'Admissions' && activeTab === 'Admissions Status') || activeTab === tab)}
						style:border-color={(tab === 'Admissions' && activeTab === 'Admissions Status') || activeTab === tab ? ND_GOLD : 'transparent'}
					>
						{tab}
					</button>
				{/each}
			</nav>

			{#if activeTab === 'Admissions Status'}
				<!-- Applicant header -->
				<div class="mb-8">
					<h1 class="text-2xl font-serif" style="color: {ND_NAVY};">{applicantName()}</h1>
					<p class="text-sm text-slate-600 mt-1">NDid: 415096273</p>
				</div>

				<!-- Status Update -->
				<div class="mb-10">
					<h2 class="text-lg font-serif mb-3" style="color: {ND_NAVY};">Status Update</h2>
					<div class="p-5 border-l-4 bg-slate-50" style="border-color: {ND_GOLD};">
						<p class="text-[15px] text-slate-700 mb-4">
							An update to your application was last posted <strong>{school.statusLastPosted}</strong>.
						</p>
						<button
							on:click={handleViewUpdate}
							class="text-sm font-semibold px-5 py-2 text-white uppercase tracking-wide hover:opacity-90"
							style="background-color: {ND_NAVY};"
						>
							View Simulated Status Update &raquo;
						</button>
					</div>
				</div>

				<!-- Application Checklist -->
				<div class="mb-10">
					<h2 class="text-lg font-serif mb-3" style="color: {ND_NAVY};">Application Checklist</h2>
					<p class="text-[13px] text-slate-600 mb-4 max-w-3xl">
						Please review the checklist of required application items below and submit missing items
						via your application or
						<a href="/disclaimer" class="hover:underline" style="color: {ND_NAVY};">ndforms@nd.edu</a>.
						Items noted as received are included in your application file.
					</p>
					<table class="w-full text-sm text-left border border-gray-300">
						<thead style="background-color: {ND_NAVY};" class="text-white">
							<tr>
								<th class="px-4 py-2 font-semibold">Details</th>
								<th class="px-4 py-2 font-semibold">Date Received</th>
								<th class="px-4 py-2 font-semibold">Status</th>
							</tr>
						</thead>
						<tbody>
							{#each checklist as item}
								<tr class="border-b border-gray-200">
									<td class="px-4 py-2">{item.detail}</td>
									<td class="px-4 py-2">{item.date}</td>
									<td class="px-4 py-2 font-semibold {item.color}">{item.status}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Admissions Counselor -->
				<div class="mb-4 p-5 border border-gray-300 bg-slate-50 max-w-md">
					<h3 class="text-sm font-semibold uppercase tracking-wide mb-2" style="color: {ND_NAVY};">
						Your Admissions Counselor
					</h3>
					<p class="text-[14px] font-serif text-slate-800">Alisa Fisher</p>
					<p class="text-[13px] text-slate-600">Senior Associate Director</p>
					<p class="text-[13px] text-slate-600">Alisa.admissions@nd.edu</p>
					<p class="text-[13px] text-slate-600">(574) 631-7505</p>
				</div>
			{:else}
				<div class="p-6 bg-slate-50 border border-gray-300">
					<p class="text-lg font-serif" style="color: {ND_NAVY};">Financial Aid</p>
					<p class="text-sm text-slate-600 mt-2">
						Information about your financial aid application and award will be available here.
					</p>
				</div>
			{/if}
		</div>

		<footer style="background-color: {ND_NAVY};" class="text-white/80 py-8 mt-12">
			<div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 text-[12px]">
				<div>
					<div class="font-serif text-white text-sm mb-1">University of Notre Dame</div>
					<div>Enrollment Division</div>
					<div>McKenna Hall, Notre Dame, IN 46556</div>
					<div>574-631-7505 &middot; admissions@nd.edu</div>
				</div>
				<div class="md:text-right self-end">
					<div>&copy; 2026 University of Notre Dame</div>
					<div class="text-white/50 mt-1">PredictAdmit Simulation &mdash; Not affiliated with the University of Notre Dame</div>
				</div>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<NotreDameAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<NotreDameDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
