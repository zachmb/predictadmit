<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import UCDavisAccepted from '$lib/components/ucdavis/UCDavisAccepted.svelte';
	import UCDavisDenied from '$lib/components/ucdavis/UCDavisDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'ucdavis';
	const school = {
		schoolName: 'University of California, Davis',
		primaryColor: '#022851', // UC Davis navy (Aggie Blue)
		accentGold: '#FFBF00', // UC Davis gold
		footerDomain: 'ucdavis.edu',
		statusLastPosted: 'March 20, 2026',
		round: 'Regular Decision',
		referenceNumber: '814305627'
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
			error = 'Invalid username or passphrase.';
			authenticated = false;
		}
	};

	const handleViewUpdate = () => {
		hasViewedUpdate = true;
		portalDecisionViewed.set(true);
	};

	// --- Applicant Profile / Checklist Data ---
	const profileRows = [
		{ label: 'SID', value: school.referenceNumber },
		{ label: 'Term', value: 'Fall Quarter 2026' },
		{ label: 'Major', value: 'Economics' }
	];

	const checklist = [
		{ status: 'Received', detail: 'UC Application', date: '11/28/2025', color: 'text-green-700' },
		{
			status: 'Received',
			detail: 'Official High School Transcript',
			date: '01/12/2026',
			color: 'text-green-700'
		},
		{
			status: 'Received',
			detail: 'Personal Insight Questions',
			date: '11/28/2025',
			color: 'text-green-700'
		},
		{
			status: 'Not Required',
			detail: 'SAT / ACT Test Scores (test-free review)',
			date: '--',
			color: 'text-gray-500'
		},
		{
			status: 'Posted',
			detail: 'Admission Decision',
			date: '03/20/2026',
			color: 'text-green-700'
		}
	];
</script>

<svelte:head>
	<title>UC Davis MyAdmissions</title>
</svelte:head>

<div class="min-h-screen font-sans bg-white text-gray-800">
	{#if !authenticated}
		<!-- ================= LOGIN (CAS) ================= -->
		<div
			style="border-top-color: {school.accentGold};"
			class="border-t-[6px]"
		></div>
		<div class="max-w-[600px] mx-auto px-6 pt-6 pb-16">
			<div class="text-center mb-4">
				<div class="inline-block text-left">
					<div class="text-[42px] leading-none font-extrabold tracking-tight">
						<span style="color: {school.accentGold};">UC</span><span
							style="color: {school.primaryColor};">DAVIS</span
						>
					</div>
					<div
						class="border-t-2 mt-1 pt-1 text-[13px] tracking-[0.28em] font-semibold"
						style="color: {school.primaryColor}; border-color: {school.primaryColor};"
					>
						UNIVERSITY OF CALIFORNIA
					</div>
				</div>
			</div>

			<h1
				class="text-center text-[1.3em] font-normal mb-6"
				style="color: {school.primaryColor};"
			>
				Central Authentication Service (CAS)
			</h1>

			<div class="border-t border-gray-200 pt-6">
				<form class="space-y-4" on:submit={autoLogin}>
					{#if error}
						<div
							class="border border-dotted px-4 py-3 text-[11px]"
							style="border-color: #BB0000; color: #BB0000;"
							role="alert"
						>
							{error}
						</div>
					{/if}

					<div>
						<label
							for="cas-user"
							class="block font-bold text-[13px] mb-1"
							style="color: {school.primaryColor};"
						>
							Username:
						</label>
						<input
							id="cas-user"
							type="email"
							class="w-full border border-[#B7B7B7] rounded px-3 py-3 text-[14px]"
							bind:value={emailInput}
							autocomplete="username"
						/>
					</div>

					<div>
						<label
							for="cas-pass"
							class="block font-bold text-[13px] mb-1"
							style="color: {school.primaryColor};"
						>
							Passphrase:
						</label>
						<input
							id="cas-pass"
							type="password"
							class="w-full border border-[#B7B7B7] rounded px-3 py-3 text-[14px]"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
					</div>

					<button
						type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
						class="w-full rounded py-3 text-[15px] font-bold cursor-pointer"
						style="background: #335379; color: {school.accentGold};"
					>
						Login
					</button>

					<div class="text-center pt-2">
						<a href="/disclaimer" class="text-[13px] text-[#335379] hover:underline">Need Help?</a>
					</div>
				</form>
			</div>

			<div class="mt-10 text-[11px] leading-relaxed" style="color: {school.primaryColor};">
				<p class="font-bold mb-1">Protect your campus computing account login ID and passphrase.</p>
				<p>
					Use them only for campus websites and campus online services. UC Davis will never ask you
					to provide your passphrase via phone or email. Be extremely wary of messages that ask you
					to enter your passphrase into a non-UC Davis website.
				</p>
				<p class="mt-3 text-gray-500">
					For this simulation, use the same email address and password that you saved on the
					PredictAdmit.com home page. No real application data is used, and all information is stored
					only in your browser.
				</p>
			</div>

			<footer
				class="mt-10 pt-4 border-t border-gray-200 text-[11px]"
				style="color: {school.primaryColor};"
			>
				Copyright © Regents of the University of California, Davis campus. All Rights Reserved.
			</footer>
		</div>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ================= PORTAL (MyAdmissions) ================= -->
		<header style="background-color: {school.primaryColor};" class="text-white">
			<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
				<div class="flex items-baseline gap-3">
					<span class="text-2xl font-extrabold tracking-tight">
						<span style="color: {school.accentGold};">UC</span>DAVIS
					</span>
					<span class="text-[13px] font-semibold tracking-wide text-white/80">MyAdmissions</span>
				</div>
				<div class="text-[12px] text-white/80">{applicantName()}</div>
			</div>
		</header>

		<div style="background-color: {school.accentGold};" class="h-1.5"></div>

		<div class="max-w-6xl mx-auto px-6 mt-6 pb-12">
			<div class="flex justify-between items-end mb-6 border-b border-gray-300 pb-2">
				<h1 class="text-3xl font-light" style="color: {school.primaryColor};">
					Undergraduate Admissions
				</h1>
				<div class="text-xs flex flex-wrap items-center text-gray-600 gap-x-4 gap-y-1">
					<span><strong>Applicant:</strong> {applicantName()}</span>
					<span><strong>SID:</strong> {school.referenceNumber}</span>
					<span><strong>Round:</strong> {school.round}</span>
				</div>
			</div>

			<nav class="flex border-b border-gray-300 mb-6">
				{#each ['Admissions Status', 'Applicant Profile', 'Financial Aid'] as tab}
					<button
						on:click={() => (activeTab = tab)}
						class="px-4 py-2 text-sm font-semibold border border-b-0 transition-colors duration-150 relative top-[1px]"
						class:bg-white={activeTab === tab}
						class:text-gray-900={activeTab === tab}
						class:border-gray-300={activeTab === tab}
						class:bg-gray-100={activeTab !== tab}
						class:text-gray-600={activeTab !== tab}
						class:border-transparent={activeTab !== tab}
					>
						{tab}
					</button>
				{/each}
				<div class="flex-grow border-b border-gray-300"></div>
			</nav>

			<div class="flex w-full">
				<aside class="w-1/4 pr-8 pt-2">
					<h2 class="text-lg font-semibold mb-3" style="color: {school.primaryColor};">
						Admission Status
					</h2>
					<nav class="text-sm space-y-1">
						<a
							href="/disclaimer"
							class="block py-1 px-2 font-bold bg-gray-100 border-l-4 text-gray-900"
							style="border-color: {school.accentGold};"
						>
							Status Update
						</a>
						<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-50">Next Steps</a>
						<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-50"
							>Conditions of Admission</a
						>
						<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-50"
							>Financial Aid Information</a
						>
						<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-50"
							>Reporting Changes</a
						>
						<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-50">Ask an Advisor</a
						>
					</nav>
				</aside>

				<div class="w-3/4 pl-8 border-l border-gray-300">
					{#if activeTab === 'Admissions Status'}
						<div class="mb-8">
							<h2 class="text-xl font-semibold mb-4" style="color: {school.primaryColor};">
								Status Update
							</h2>
							<div
								class="p-4 border-2"
								style="background-color: #F4F7FB; border-color: {school.primaryColor};"
							>
								<p class="text-base text-gray-700 mb-4">
									An update to your application was last posted <strong
										>{school.statusLastPosted}</strong
									>.
								</p>
								<button
									on:click={handleViewUpdate}
									class="text-sm font-semibold px-5 py-2 text-white border shadow-md hover:opacity-90 active:shadow-inner"
									style="background-color: {school.primaryColor}; border-color: {school.primaryColor};"
								>
									View Simulated Status Update &raquo;
								</button>
							</div>
						</div>

						<div class="mb-8">
							<h2 class="text-xl font-semibold mb-4" style="color: {school.primaryColor};">
								Application Checklist
							</h2>
							<table class="w-full text-sm text-left border border-gray-300">
								<thead class="bg-gray-100">
									<tr>
										<th class="px-4 py-2 font-bold">Status</th>
										<th class="px-4 py-2 font-bold">Item</th>
										<th class="px-4 py-2 font-bold">Date</th>
									</tr>
								</thead>
								<tbody>
									{#each checklist as item}
										<tr class="border-b border-gray-200">
											<td class="px-4 py-2 font-semibold {item.color}">{item.status}</td>
											<td class="px-4 py-2">{item.detail}</td>
											<td class="px-4 py-2">{item.date}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{:else if activeTab === 'Applicant Profile'}
						<div class="p-6 bg-gray-50 border border-gray-300">
							<p class="text-lg font-semibold mb-4" style="color: {school.primaryColor};">
								Applicant Profile
							</p>
							<dl class="text-sm space-y-2">
								<div class="flex">
									<dt class="w-40 font-semibold text-gray-600">Name:</dt>
									<dd>{applicantName()}</dd>
								</div>
								{#each profileRows as row}
									<div class="flex">
										<dt class="w-40 font-semibold text-gray-600">{row.label}:</dt>
										<dd>{row.value}</dd>
									</div>
								{/each}
								<div class="flex">
									<dt class="w-40 font-semibold text-gray-600">Email:</dt>
									<dd>{profile.email || 'applicant@example.com'}</dd>
								</div>
							</dl>
							<p class="text-xs text-gray-500 mt-4">
								Please <a href="/disclaimer" class="text-[#335379] hover:underline">report any changes</a
								>.
							</p>
						</div>
					{:else if activeTab === 'Financial Aid'}
						<div class="p-6 bg-gray-50 border border-gray-300">
							<p class="text-lg font-semibold" style="color: {school.primaryColor};">
								Financial Aid Information
							</p>
							<p class="text-sm text-gray-600 mt-2">
								View Financial Aid and Scholarship Information for Undergraduate Students through your
								MyAwards portal.
							</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<footer
			class="text-white py-6 text-[11px] mt-12"
			style="background-color: {school.primaryColor};"
		>
			<div class="max-w-6xl mx-auto px-6 flex justify-between w-full">
				<span>University of California, Davis · One Shields Avenue, Davis, CA 95616</span>
				<span>PredictAdmit Simulation — Not affiliated with UC Davis</span>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<UCDavisAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<UCDavisDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
