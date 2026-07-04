<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import WisconsinAccepted from '$lib/components/wisconsin/WisconsinAccepted.svelte';
	import WisconsinDenied from '$lib/components/wisconsin/WisconsinDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'wisconsin';
	const school = {
		schoolName: 'University of Wisconsin-Madison',
		primaryColor: '#C5050C', // Badger red
		footerDomain: 'wisc.edu',
		statusLastPosted: 'March 15, 2026',
		round: 'Regular Decision',
		referenceNumber: '03158246'
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
			error = 'The NetID or password you entered was incorrect.';
			authenticated = false;
		}
	};

	const handleViewUpdate = () => {
		hasViewedUpdate = true;
		portalDecisionViewed.set(true);
	};

	// --- Application To Do List / Requirements Data ---
	const toDoList = [
		{
			status: '✔ Received',
			detail: 'Application for Admission',
			date: '01/17/2026',
			color: 'text-green-700',
			link: false
		},
		{
			status: '✔ Received',
			detail: 'Application Fee / Fee Waiver',
			date: '01/17/2026',
			color: 'text-green-700',
			link: false
		},
		{
			status: '✔ Received',
			detail: 'Official High School Transcript',
			date: '01/20/2026',
			color: 'text-green-700',
			link: false
		},
		{
			status: '✔ Received',
			detail: 'Letter of Recommendation',
			date: '01/22/2026',
			color: 'text-green-700',
			link: false
		},
		{
			status: '! Requested',
			detail: 'Mid-Year Grade Report',
			date: '--',
			color: 'text-yellow-700',
			link: true
		}
	];
</script>

<svelte:head>
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen font-sans bg-[#f2f2f2] text-gray-800">
	{#if !authenticated}
		<!-- ===================== LOGIN (NetID Login Service) ===================== -->
		<header style="background-color: {school.primaryColor};" class="text-white">
			<div class="max-w-6xl mx-auto px-6 h-14 flex items-center">
				<span class="text-lg font-semibold tracking-tight">
					University of Wisconsin-Madison Login
				</span>
			</div>
		</header>

		<main class="min-h-[560px] py-12">
			<div class="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-8">
				<!-- Login well -->
				<div class="bg-white border border-gray-300 rounded-sm shadow-sm p-6">
					<p class="text-2xl font-light text-gray-800 mb-6">Login</p>

					<form class="space-y-5" on:submit={autoLogin}>
						{#if error}
							<p
								class="text-[13px] text-red-800 border border-red-300 bg-red-50 px-3 py-2"
								role="alert"
							>
								{error}
							</p>
						{/if}

						<div>
							<div class="flex justify-between items-baseline mb-1">
								<label for="netid" class="text-[13px] font-semibold text-gray-700">NetID</label>
								<a href="/disclaimer" class="text-[12px] text-[#0479a8] hover:underline">Forgot NetID</a>
							</div>
							<input
								id="netid"
								type="text"
								placeholder="Ex: bbadger"
								class="w-full border border-gray-400 rounded-sm px-3 py-2 text-[14px] focus:outline-none focus:border-[#C5050C] focus:ring-1 focus:ring-[#C5050C]"
								bind:value={emailInput}
								autocomplete="username"
								spellcheck="false"
							/>
						</div>

						<div>
							<div class="flex justify-between items-baseline mb-1">
								<label for="netpw" class="text-[13px] font-semibold text-gray-700">Password</label>
								<a href="/disclaimer" class="text-[12px] text-[#0479a8] hover:underline"
									>Forgot password</a
								>
							</div>
							<input
								id="netpw"
								type="password"
								class="w-full border border-gray-400 rounded-sm px-3 py-2 text-[14px] focus:outline-none focus:border-[#C5050C] focus:ring-1 focus:ring-[#C5050C]"
								bind:value={passwordInput}
								autocomplete="current-password"
								spellcheck="false"
							/>
						</div>

						<div class="space-y-3">
							<button
								type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
								class="w-1/3 min-w-[120px] text-white text-[14px] font-semibold py-2 rounded-sm shadow-sm hover:opacity-90 active:opacity-100"
								style="background-color: {school.primaryColor};"
							>
								Log In
							</button>

							</div>
					</form>
				</div>

				<!-- Need help well -->
				<div class="bg-white border border-gray-300 rounded-sm shadow-sm p-6 self-start">
					<p class="text-2xl font-light text-gray-800 mb-4">Need help?</p>
					<ul class="list-disc pl-5 space-y-2 text-[14px] text-[#0479a8]">
						<li><a href="/disclaimer" class="hover:underline">Activate your NetID</a></li>
						<li><a href="/disclaimer" class="hover:underline">Modify your account</a></li>
						<li><a href="/disclaimer" class="hover:underline">Contact the Help Desk</a></li>
					</ul>
					<p class="mt-6 text-[11px] leading-relaxed text-gray-500">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used,
						and all information is stored only in your browser.
					</p>
				</div>
			</div>
		</main>

		<footer class="border-t border-gray-300 bg-white py-4">
			<div class="max-w-4xl mx-auto px-6 text-center text-[12px] text-gray-600">
				© Board of Regents of the University of Wisconsin System
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ===================== APPLICANT PORTAL (Student Center / Application Status) ===================== -->
		<header style="background-color: {school.primaryColor};" class="text-white">
			<div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<span class="text-lg font-bold tracking-tight">UW-Madison</span>
					<span class="text-[11px] uppercase tracking-wider text-white/80 border-l border-white/40 pl-3"
						>Applicant Homepage</span
					>
				</div>
				<div class="text-[12px] text-white/90 flex items-center gap-5">
					<a href="/disclaimer" class="hover:underline">Home</a>
					<a href="/disclaimer" class="hover:underline">Help</a>
					<a href="/disclaimer" class="hover:underline">Sign Out</a>
				</div>
			</div>
		</header>

		<div class="bg-white border-b border-gray-300">
			<div class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
				<h1 class="text-xl font-normal text-gray-800">Application Status</h1>
				<div class="text-[12px] text-gray-600 flex items-center gap-5">
					<span><strong>Applicant:</strong> {applicantName()}</span>
					<span><strong>Application Number:</strong> {school.referenceNumber}</span>
				</div>
			</div>
		</div>

		<div class="max-w-7xl mx-auto px-6 py-8 flex gap-8">
			<!-- Side Page Menu -->
			<aside class="w-1/4">
				<div class="bg-white border border-gray-300 rounded-sm">
					<div
						class="px-4 py-2 text-[13px] font-semibold text-white"
						style="background-color: {school.primaryColor};"
					>
						Side Page Menu
					</div>
					<nav class="text-[14px]">
						<a
							href="/disclaimer"
							class="block px-4 py-2 border-l-4 bg-gray-50 font-semibold text-gray-900"
							style="border-color: {school.primaryColor};">Application Status</a
						>
						<a
							href="/disclaimer"
							class="block px-4 py-2 border-l-4 border-transparent text-gray-700 hover:bg-gray-50"
							>Requests</a
						>
						<a
							href="/disclaimer"
							class="block px-4 py-2 border-l-4 border-transparent text-gray-700 hover:bg-gray-50"
							>Application To Do List</a
						>
					</nav>
				</div>
			</aside>

			<!-- Main -->
			<main class="flex-1 space-y-6">
				<div class="bg-white border border-gray-300 rounded-sm p-6">
					<div class="border-b border-gray-200 pb-3 mb-4">
						<h2 class="text-lg font-semibold text-gray-800">Fall 2026-2027 Application</h2>
						<p class="text-[13px] text-gray-600">Undergraduate &middot; Mechanical Engineering &middot; UW-Madison</p>
					</div>

					<table class="w-full text-[14px]">
						<tbody class="divide-y divide-gray-100">
							<tr>
								<td class="py-2 pr-4 font-semibold text-gray-600 w-1/3">Application Date</td>
								<td class="py-2 text-gray-800">01/17/2026</td>
							</tr>
							<tr>
								<td class="py-2 pr-4 font-semibold text-gray-600">Application Number</td>
								<td class="py-2 text-gray-800">{school.referenceNumber}</td>
							</tr>
							<tr>
								<td class="py-2 pr-4 font-semibold text-gray-600">Academic Plan</td>
								<td class="py-2 text-gray-800">Mechanical Engineering BS</td>
							</tr>
							<tr>
								<td class="py-2 pr-4 font-semibold text-gray-600">Status</td>
								<td class="py-2">
									<span
										class="inline-block text-white text-[12px] font-semibold px-2 py-0.5 rounded-sm"
										style="background-color: {school.primaryColor};">A decision is available</span
									>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Status update / decision available -->
				<div class="bg-white border-2 rounded-sm p-6" style="border-color: {school.primaryColor};">
					<p class="text-[14px] text-gray-700 mb-4">
						An update to your application was last posted <strong>{school.statusLastPosted}</strong>. Your
						admission decision is now available to view.
					</p>
					<div class="flex flex-wrap items-center gap-3">
						<button
							on:click={handleViewUpdate}
							class="text-white text-[14px] font-semibold px-5 py-2 rounded-sm shadow-sm hover:opacity-90"
							style="background-color: {school.primaryColor};"
						>
							View Decision Letter
						</button>
						<a
							href="/disclaimer"
							class="border border-gray-400 bg-gray-100 text-gray-700 text-[14px] px-4 py-2 rounded-sm hover:bg-gray-200"
							>Contact Us</a
						>
					</div>
				</div>

				<!-- Application To Do List -->
				<div class="bg-white border border-gray-300 rounded-sm p-6">
					<h2 class="text-lg font-semibold text-gray-800 mb-4">Application To Do List</h2>
					<table class="w-full text-[14px] text-left border border-gray-200">
						<thead class="bg-gray-100">
							<tr>
								<th class="px-4 py-2 font-semibold">Status</th>
								<th class="px-4 py-2 font-semibold">Requirement</th>
								<th class="px-4 py-2 font-semibold">Date Received</th>
							</tr>
						</thead>
						<tbody>
							{#each toDoList as item}
								<tr class="border-b border-gray-100">
									<td
										class="px-4 py-2 font-semibold"
										class:text-green-700={item.color === 'text-green-700'}
										class:text-yellow-700={item.color === 'text-yellow-700'}
									>
										{item.status}
									</td>
									<td class="px-4 py-2">
										{item.detail}
										{#if item.link}
											<a href="/disclaimer" class="text-[#0479a8] hover:underline ml-1">Upload</a>
										{/if}
									</td>
									<td class="px-4 py-2">{item.date}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</main>
		</div>

		<footer class="border-t border-gray-300 bg-white py-4 mt-4">
			<div class="max-w-7xl mx-auto px-6 flex justify-between text-[11px] text-gray-600">
				<span>© Board of Regents of the University of Wisconsin System</span>
				<span>PredictAdmit Simulation — Not affiliated with the University of Wisconsin-Madison</span>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<WisconsinAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<WisconsinDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
