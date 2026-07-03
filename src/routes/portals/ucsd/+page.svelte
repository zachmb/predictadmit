<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import UCSDAccepted from '$lib/components/ucsd/UCSDAccepted.svelte';
	import UCSDDenied from '$lib/components/ucsd/UCSDDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'ucsd';
	const UCSD_NAVY = '#182B49';
	const UCSD_GOLD = '#FFCD00';

	const school = {
		schoolName: 'University of California, San Diego',
		primaryColor: UCSD_NAVY,
		footerDomain: 'ucsd.edu',
		statusLastPosted: 'March 20, 2026',
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

	// --- Checklist Table Data ---
	const formData = [
		{ status: '✔ Received', detail: 'UC Application', date: '11/30/2025', color: 'text-green-700', link: false },
		{ status: '✔ Received', detail: 'Official Transcripts', date: '01/12/2026', color: 'text-green-700', link: false },
		{ status: '✔ Received', detail: 'Statement of Intent to Register (SIR) Eligibility', date: '03/20/2026', color: 'text-green-700', link: false },
		{ status: '! Pending', detail: 'FAFSA / California Dream Act Application', date: '--', color: 'text-amber-600', link: false },
		{ status: '✔ Posted', detail: 'Admission Decision', date: '03/20/2026', color: 'text-green-700', link: true }
	];
</script>

<svelte:head>
	<title>{school.schoolName} — Applicant Portal</title>
</svelte:head>

<div class="min-h-screen font-sans bg-white text-gray-800">
	{#if !authenticated}
		<!-- ===================== LOGIN PAGE ===================== -->
		<div class="h-1.5 w-full" style="background-color: {UCSD_NAVY};"></div>
		<header class="bg-[#f4f4f4] border-b border-gray-200">
			<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
				<span
					class="text-2xl font-serif tracking-tight border-b-2 pb-0.5"
					style="color: {UCSD_NAVY}; border-color: {UCSD_NAVY};"
				>
					UC San Diego
				</span>
				<span class="text-sm font-bold text-slate-800">Undergraduate Admissions</span>
			</div>
		</header>

		<main class="bg-white min-h-[520px]">
			<div class="max-w-6xl mx-auto px-6 pt-10 pb-16">
				<h1 class="text-6xl font-bold text-slate-700 mb-8 tracking-tight">LOGIN</h1>

				<div
					class="border-l-4 bg-[#e9edd3] px-4 py-3 mb-6 text-sm text-slate-800"
					style="border-color: #6b8e23;"
				>
					To log in, please enter your email address and password.
				</div>

				<form class="mb-4" on:submit={autoLogin}>
					{#if error}
						<p
							class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-3 max-w-xl"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-4 mb-2">
						<label for="portal-email" class="text-sm text-slate-800 w-32">Email Address</label>
						<input
							id="portal-email"
							type="email"
							class="border border-slate-400 bg-white px-2 py-1 text-sm w-64 shadow-inner"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-4 mb-6">
						<label for="portal-password" class="text-sm text-slate-800 w-32">Password</label>
						<input
							id="portal-password"
							type="password"
							class="border border-slate-400 bg-[#eef2fb] px-2 py-1 text-sm w-64 shadow-inner"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a
							href="/disclaimer"
							class="text-base font-semibold hover:underline whitespace-nowrap"
							style="color: {UCSD_NAVY};"
						>
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-3">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="border border-slate-500 bg-[#e0e0e0] px-4 py-1 text-sm font-semibold text-slate-800
									shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:bg-[#d5d5d5] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
						>
							Login
						</button>
						</div>
				</form>

				<div class="text-sm leading-relaxed text-slate-600 max-w-4xl space-y-4 mt-10">
					<p>
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
					<p>
						If this is the first time you are logging into your portal, when asked for temporary pin,
						use the password provided in the log-in instruction email. The most recent email address
						you provided on your UC Application is used to authenticate your account. If you no longer
						have access to this email address, you must update your email address through your
						<a href="/disclaimer" class="hover:underline" style="color: {UCSD_NAVY};">UC Application</a>
						first. They will then transmit the new email address to us within five business days and then
						you will be able to login with your new email address.
					</p>
					<div>
						<p>Recommended browser is Chrome and the use of an English keyboard</p>
						<p>
							To verify your birth date and email address on file are accurate please log in to your
							<a href="/disclaimer" class="hover:underline" style="color: {UCSD_NAVY};">UC Application</a>
						</p>
						<p>Please use a device with a larger display than a smartphone for an optimal experience</p>
						<p>
							To prevent correspondence being sent to your SPAM folder, please add admissions@ucsd.edu
							to your Safe Senders List.
						</p>
					</div>
					<p>For login difficulties, please use the Forgot Your Password feature above.</p>
				</div>
			</div>
		</main>

		<footer style="background-color: {UCSD_NAVY};" class="text-white">
			<div class="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10">
				<span class="text-3xl font-serif tracking-tight border-b-2 border-white pb-0.5">UC San Diego</span>
				<div class="text-sm font-bold leading-relaxed">
					Student Services Center, MC 0021 9460 Russell Lane, Suite 159 La Jolla, CA 92093-0021
					<div class="text-right md:text-left mt-1">(858) 534-4831</div>
				</div>
			</div>
		</footer>
		<div class="bg-[#f4f4f4] border-t border-gray-200">
			<div class="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-600">
				<span style="color: {UCSD_NAVY};">
					© 2026 Regents of the University of California. All rights reserved.
				</span>
				<span class="text-gray-300">|</span>
				<a href="/disclaimer" class="hover:underline">Terms of Use</a>
				<span class="text-gray-300">|</span>
				<a href="/disclaimer" class="hover:underline">Health &amp; Safety</a>
				<span class="text-gray-300">|</span>
				<a href="/disclaimer" class="hover:underline">Feedback</a>
				<span class="text-gray-300">|</span>
				<a href="/disclaimer" class="hover:underline">Contact</a>
				<span class="ml-auto text-[10px] text-slate-500">PredictAdmit Simulation — Not affiliated with UC San Diego</span>
			</div>
		</div>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ===================== PORTAL PAGE ===================== -->
		<div class="h-1.5 w-full" style="background-color: {UCSD_NAVY};"></div>
		<header class="bg-[#f4f4f4] border-b border-gray-200">
			<div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
				<span
					class="text-2xl font-serif tracking-tight border-b-2 pb-0.5"
					style="color: {UCSD_NAVY}; border-color: {UCSD_NAVY};"
				>
					UC San Diego
				</span>
				<span class="text-sm font-bold text-slate-800">Undergraduate Admissions</span>
			</div>
		</header>

		<div class="max-w-7xl mx-auto px-6 mt-6 pb-12">
			<div class="flex justify-between items-end mb-6 border-b border-gray-300 pb-2">
				<h1 class="text-3xl font-normal text-slate-700">Applicant Status Portal</h1>
				<div class="text-xs flex items-center text-gray-600 space-x-4">
					<span><strong>Applicant Name:</strong> {applicantName()}</span>
					<span><strong>Term:</strong> Fall 2026 · {school.round}</span>
					<span><strong>Application ID:</strong> {school.referenceNumber}</span>
				</div>
			</div>

			<nav class="flex border-b border-gray-300 mb-6 relative">
				{#each ['Admissions Status', 'Application Information', 'Events', 'Profile'] as tab}
					<button
						on:click={() => (activeTab = tab)}
						class="px-4 py-2 text-sm font-semibold border border-b-0 transition-colors duration-150 relative top-[1px]"
						class:bg-white={activeTab === tab}
						class:text-slate-900={activeTab === tab}
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
				<div class="w-1/4 pr-8 pt-2">
					{#if activeTab === 'Admissions Status'}
						<h2 class="text-lg font-semibold mb-3 text-slate-800">Admission Status</h2>
						<nav class="text-sm space-y-1">
							<a
								href="/disclaimer"
								class="block py-1 px-2 font-bold bg-gray-200 border-l-4 text-slate-900"
								style="border-color: {UCSD_NAVY};"
							>
								Status Update
							</a>
							<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">Checklist</a>
							<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">Financial Aid &amp; Scholarships</a>
							<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">Triton Days</a>
							<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">Housing</a>
							<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">Student PID</a>
						</nav>
					{/if}
				</div>

				<div class="w-3/4 pl-8 border-l border-gray-300">
					{#if activeTab === 'Admissions Status'}
						<div class="mb-8">
							<h2 class="text-xl font-semibold mb-4 text-slate-700">Status Update</h2>
							<div class="p-4 border-2" style="background-color: #f4f6f9; border-color: {UCSD_NAVY};">
								<p class="text-base text-slate-700 mb-4">
									An update to your application was last posted on
									<strong>{school.statusLastPosted}</strong>.
								</p>
								<button
									on:click={handleViewUpdate}
									class="text-sm font-semibold px-4 py-1.5 text-white border shadow-md hover:opacity-90 active:shadow-inner"
									style="background-color: {UCSD_NAVY}; border-color: {UCSD_NAVY};"
								>
									View Update &gt;&gt;
								</button>
							</div>
						</div>

						<div class="mb-8">
							<h2 class="text-xl font-semibold mb-4 text-slate-700">Application Checklist</h2>
							<table class="w-full text-sm text-left border border-gray-300">
								<thead class="bg-gray-100">
									<tr>
										<th class="px-4 py-2 font-bold">Status</th>
										<th class="px-4 py-2 font-bold">Item</th>
										<th class="px-4 py-2 font-bold">Date</th>
									</tr>
								</thead>
								<tbody>
									{#each formData as item}
										<tr class="border-b border-gray-200">
											<td
												class="px-4 py-2 font-semibold"
												class:text-green-700={item.color === 'text-green-700'}
												class:text-amber-600={item.color === 'text-amber-600'}
											>
												{item.status}
											</td>
											<td class="px-4 py-2">
												{item.detail}
												{#if item.link}
													<a href="/disclaimer" class="text-blue-600 hover:underline ml-1">View</a>
												{/if}
											</td>
											<td class="px-4 py-2">{item.date}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{:else if activeTab === 'Application Information'}
						<div class="p-6 bg-gray-100 border border-gray-300">
							<p class="text-lg font-semibold">Application Information</p>
							<p class="text-sm text-gray-600 mt-2">
								Details about your submitted UC Application, including major and college
								preferences, will be available here.
							</p>
						</div>
					{:else if activeTab === 'Events'}
						<div class="p-6 bg-gray-100 border border-gray-300">
							<p class="text-lg font-semibold">Events</p>
							<p class="text-sm text-gray-600 mt-2">
								Information about admitted student events, including Triton Days, will appear here.
							</p>
						</div>
					{:else if activeTab === 'Profile'}
						<div class="p-6 bg-gray-100 border border-gray-300">
							<p class="text-lg font-semibold">Profile</p>
							<p class="text-sm text-gray-600 mt-2">
								Review and update your contact details and biographical information.
							</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<footer style="background-color: {UCSD_NAVY};" class="text-white mt-12">
			<div class="max-w-7xl mx-auto px-6 py-6 flex justify-between w-full text-xs">
				<span>© 2026 Regents of the University of California. All rights reserved.</span>
				<span>PredictAdmit Simulation — Not affiliated with UC San Diego</span>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<UCSDAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<UCSDDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
