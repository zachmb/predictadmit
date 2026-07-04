<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import UVAAccepted from '$lib/components/uva/UVAAccepted.svelte';
	import UVADenied from '$lib/components/uva/UVADenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'uva';
	const school = {
		schoolName: 'University of Virginia',
		primaryColor: '#232D4B', // UVA Jefferson Blue (navy)
		accentColor: '#E57200', // UVA Rotunda Orange
		footerDomain: 'virginia.edu',
		statusLastPosted: 'March 21, 2026',
		round: '2026 Early Action',
		college: 'College of Arts & Sciences',
		residency: 'Non-Virginian',
		referenceNumber: '35270918'
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
	<title>MyUVA Application Portal</title>
</svelte:head>

<div class="min-h-screen font-sans bg-white text-slate-800">
	{#if !authenticated}
		<!-- ===================== LOGIN PAGE ===================== -->
		<header style="background-color: {school.primaryColor};">
			<div class="max-w-6xl mx-auto px-6 h-20 flex items-center gap-4">
				<div
					class="w-11 h-11 flex items-center justify-center font-serif font-bold text-2xl text-white rounded-sm"
					style="background-color: {school.accentColor};"
				>
					V
				</div>
				<div class="leading-tight">
					<div class="text-white font-serif text-xl tracking-wide">UNIVERSITY OF VIRGINIA</div>
					<div class="text-[11px] uppercase tracking-widest" style="color: {school.accentColor};">
						Office of Undergraduate Admission
					</div>
				</div>
			</div>
		</header>

		<div class="h-1" style="background-color: {school.accentColor};"></div>

		<main class="bg-white min-h-[520px] py-16">
			<div class="max-w-xl mx-auto px-6">
				<h1 class="text-4xl font-serif font-normal mb-6" style="color: {school.primaryColor};">
					Login
				</h1>

				<p class="text-[15px] text-slate-700 mb-8">
					To log in, please enter your email address and password.
				</p>

				<form class="space-y-5 max-w-[440px]" on:submit={autoLogin}>
					{#if error}
						<p
							class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div>
						<label
							for="portal-email"
							class="block text-[13px] font-semibold text-slate-800 mb-1"
						>
							Email
						</label>
						<input
							id="portal-email"
							type="email"
							class="w-full border border-slate-400 bg-white px-3 py-2 text-[14px] focus:outline-none focus:ring-2"
							style="--tw-ring-color: {school.accentColor};"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div>
						<div class="flex items-center justify-between mb-1">
							<label for="portal-password" class="block text-[13px] font-semibold text-slate-800">
								Password
							</label>
							<a href="/disclaimer" class="text-[12px] text-[#00669e] hover:underline">
								Forgot Your Password?
							</a>
						</div>
						<input
							id="portal-password"
							type="password"
							class="w-full border border-slate-400 bg-white px-3 py-2 text-[14px] focus:outline-none focus:ring-2"
							style="--tw-ring-color: {school.accentColor};"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
					</div>

					<div class="flex items-center gap-3 pt-2">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="px-8 py-2 text-[14px] font-semibold text-white rounded-sm hover:opacity-90 active:opacity-100"
							style="background-color: {school.primaryColor};"
						>
							Login
						</button>
						</div>

					<p class="pt-6 text-[11px] leading-relaxed text-slate-500">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<footer class="border-t-4 text-slate-300" style="border-color: {school.accentColor}; background-color: {school.primaryColor};">
			<div class="max-w-6xl mx-auto px-6 py-6 text-[12px] leading-relaxed">
				<div class="font-semibold text-white mb-1">Office of Undergraduate Admission</div>
				<div>
					190 McCormick Road (<a href="/disclaimer" class="underline">map</a>) &nbsp;•&nbsp; P.O. Box
					400160 &nbsp;•&nbsp; Charlottesville, VA 22904
				</div>
				<div>
					(434) 982-5300 &nbsp;•&nbsp;
					<a href="/disclaimer" class="underline">undergradadmission@{school.footerDomain}</a>
				</div>
				<div class="mt-3 text-[11px] text-slate-400">
					© 2025 By the Rector and Visitors of the University of Virginia &nbsp;—&nbsp; PredictAdmit
					Simulation, not affiliated with the University of Virginia.
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ===================== PORTAL PAGE ===================== -->
		<header style="background-color: {school.primaryColor};">
			<div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
				<div class="flex items-center gap-4">
					<div
						class="w-11 h-11 flex items-center justify-center font-serif font-bold text-2xl text-white rounded-sm"
						style="background-color: {school.accentColor};"
					>
						V
					</div>
					<div class="leading-tight">
						<div class="text-white font-serif text-xl tracking-wide">UNIVERSITY OF VIRGINIA</div>
						<div
							class="text-[11px] uppercase tracking-widest"
							style="color: {school.accentColor};"
						>
							Office of Undergraduate Admission
						</div>
					</div>
				</div>
				<div class="text-[12px] text-slate-200">{applicantName()}</div>
			</div>
		</header>
		<div class="h-1" style="background-color: {school.accentColor};"></div>

		<div class="max-w-6xl mx-auto px-6 mt-8 pb-12">
			<div class="mb-6">
				<h1 class="text-3xl font-serif" style="color: {school.primaryColor};">
					Welcome to your MyUVA Application Portal, {applicantName()}.
				</h1>
				<p class="text-sm text-slate-600 mt-2">
					Please bookmark this page. We have your full name listed as
					<strong>{applicantName()}</strong>. If this is incorrect, please
					<a href="/disclaimer" class="text-[#00669e] hover:underline">contact us</a>.
				</p>
			</div>

			<div class="flex flex-wrap gap-x-10 gap-y-2 text-sm text-slate-700 border-y border-slate-200 py-3 mb-6">
				<span><strong>{school.round}</strong></span>
				<span>Residency Status: <strong>{school.residency}</strong></span>
				<span>{school.college}</span>
				<span class="text-slate-500">Reference #: {school.referenceNumber}</span>
			</div>

			<!-- Primary nav tabs -->
			<nav class="flex border-b border-slate-300 mb-8">
				{#each ['Admissions Status', 'Financial Aid', 'Events'] as tab}
					<button
						on:click={() => (activeTab = tab)}
						class="px-5 py-2 text-sm font-semibold border-b-4 transition-colors"
						class:text-slate-900={activeTab === tab}
						class:text-slate-500={activeTab !== tab}
						style={activeTab === tab
							? `border-color: ${school.accentColor};`
							: 'border-color: transparent;'}
					>
						{tab === 'Admissions Status' ? 'Admission' : tab}
					</button>
				{/each}
			</nav>

			<div class="flex w-full gap-8">
				<!-- Sidebar -->
				<aside class="w-1/4 hidden md:block">
					<h2 class="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">
						MyUVA Application Portal
					</h2>
					<nav class="text-sm space-y-1">
						<a
							href="/disclaimer"
							class="block py-1.5 px-3 font-semibold border-l-4 text-slate-900 bg-slate-100"
							style="border-color: {school.accentColor};"
						>
							Status Update
						</a>
						<a href="/disclaimer" class="block py-1.5 px-3 text-slate-700 hover:bg-slate-50">
							Change Password
						</a>
						<a href="/disclaimer" class="block py-1.5 px-3 text-slate-700 hover:bg-slate-50">
							Contact Us
						</a>
						<a href="/disclaimer" class="block py-1.5 px-3 text-slate-700 hover:bg-slate-50">
							Logout
						</a>
					</nav>
				</aside>

				<!-- Main content -->
				<div class="flex-1 md:border-l md:border-slate-200 md:pl-8">
					{#if activeTab === 'Admissions Status'}
						<h2 class="text-2xl font-serif mb-4" style="color: {school.primaryColor};">
							Status Update
						</h2>
						<div
							class="p-5 border-l-4 bg-slate-50"
							style="border-color: {school.accentColor};"
						>
							<p class="text-[15px] text-slate-700 mb-4">
								An update to your application was last posted <strong
									>{school.statusLastPosted}</strong
								>.
							</p>
							<button
								on:click={handleViewUpdate}
								class="text-sm font-semibold px-5 py-2 text-white rounded-sm hover:opacity-90"
								style="background-color: {school.primaryColor};"
							>
								View Simulated Status Update &gt;&gt;
							</button>
						</div>

						<div class="mt-8">
							<h3 class="text-lg font-serif mb-3" style="color: {school.primaryColor};">
								Application Checklist
							</h3>
							<table class="w-full text-sm text-left border border-slate-300">
								<thead class="bg-slate-100">
									<tr>
										<th class="px-4 py-2 font-semibold">Status</th>
										<th class="px-4 py-2 font-semibold">Item</th>
										<th class="px-4 py-2 font-semibold">Date Received</th>
									</tr>
								</thead>
								<tbody>
									<tr class="border-b border-slate-200">
										<td class="px-4 py-2 font-semibold text-green-700">✔ Received</td>
										<td class="px-4 py-2">Common Application</td>
										<td class="px-4 py-2">10/28/2025</td>
									</tr>
									<tr class="border-b border-slate-200">
										<td class="px-4 py-2 font-semibold text-green-700">✔ Received</td>
										<td class="px-4 py-2">Official High School Transcript</td>
										<td class="px-4 py-2">11/01/2025</td>
									</tr>
									<tr class="border-b border-slate-200">
										<td class="px-4 py-2 font-semibold text-green-700">✔ Received</td>
										<td class="px-4 py-2">School Counselor Recommendation</td>
										<td class="px-4 py-2">11/03/2025</td>
									</tr>
									<tr class="border-b border-slate-200">
										<td class="px-4 py-2 font-semibold text-green-700">✔ Received</td>
										<td class="px-4 py-2">Teacher Recommendation</td>
										<td class="px-4 py-2">11/05/2025</td>
									</tr>
									<tr>
										<td class="px-4 py-2 font-semibold text-green-700">✔ Posted</td>
										<td class="px-4 py-2">Admission Decision</td>
										<td class="px-4 py-2">03/21/2026</td>
									</tr>
								</tbody>
							</table>
						</div>
					{:else if activeTab === 'Financial Aid'}
						<div class="p-6 bg-slate-50 border border-slate-200">
							<p class="text-lg font-serif" style="color: {school.primaryColor};">
								Financial Aid
							</p>
							<p class="text-sm text-slate-600 mt-2">
								Information about your financial aid application and awards will be displayed here.
								Student Financial Services will notify you when your award is available.
							</p>
						</div>
					{:else if activeTab === 'Events'}
						<div class="p-6 bg-slate-50 border border-slate-200">
							<p class="text-lg font-serif" style="color: {school.primaryColor};">Events</p>
							<p class="text-sm text-slate-600 mt-2">
								Upcoming information sessions, tours, and admitted-student programming will appear
								here as they are scheduled.
							</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<footer class="border-t-4 text-slate-300 mt-8" style="border-color: {school.accentColor}; background-color: {school.primaryColor};">
			<div class="max-w-6xl mx-auto px-6 py-6 text-[12px] leading-relaxed">
				<div class="font-semibold text-white mb-1">Office of Undergraduate Admission</div>
				<div>
					190 McCormick Road (<a href="/disclaimer" class="underline">map</a>) &nbsp;•&nbsp; P.O. Box
					400160 &nbsp;•&nbsp; Charlottesville, VA 22904
				</div>
				<div>
					(434) 982-5300 &nbsp;•&nbsp;
					<a href="/disclaimer" class="underline">undergradadmission@{school.footerDomain}</a>
				</div>
				<div class="mt-3 text-[11px] text-slate-400">
					© 2025 By the Rector and Visitors of the University of Virginia &nbsp;—&nbsp; PredictAdmit
					Simulation, not affiliated with the University of Virginia.
				</div>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<UVAAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<UVADenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
