<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import ColumbiaAccepted from '$lib/components/columbia/ColumbiaAccepted.svelte';
	import ColumbiaDenied from '$lib/components/columbia/ColumbiaDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'columbia';
	const school = {
		schoolName: 'Columbia University',
		primaryColor: '#003D6B',
		footerDomain: 'columbia.edu',
		statusLastPosted: 'March 13, 2026',
		round: 'Regular Decision',
		referenceNumber: '20260012'
	};

	// Columbia Blue light accent
	const COLUMBIA_BLUE = '#B9D9EB';

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

	// --- Application Checklist Data ---
	const checklistData = [
		{ status: 'Received', detail: 'Coalition / Common Application', date: '01/01/2026', received: true },
		{ status: 'Received', detail: 'Columbia-Specific Questions', date: '01/01/2026', received: true },
		{ status: 'Received', detail: 'Secondary School Report & Transcript', date: '01/04/2026', received: true },
		{ status: 'Received', detail: 'Counselor Recommendation', date: '01/04/2026', received: true },
		{ status: 'Received', detail: 'Two Teacher Evaluations', date: '01/06/2026', received: true },
		{ status: 'Received', detail: 'Mid-Year School Report', date: '02/12/2026', received: true },
		{ status: 'Optional', detail: 'Creative / Academic Supplement', date: '—', received: false }
	];

	const navLinks = ['Life at Columbia', 'How to Apply', 'Affordability & Aid', 'Academics', 'Visit'];
</script>

<svelte:head>
	<title>{school.schoolName} — Undergraduate Admissions</title>
</svelte:head>

<div class="min-h-screen bg-white text-slate-900" style="font-family: Georgia, 'Times New Roman', serif;">
	{#if !authenticated}
		<!-- ===================== LOGIN ===================== -->
		<header class="border-b border-slate-200">
			<div class="max-w-6xl mx-auto px-6">
				<!-- Top utility links -->
				<div
					class="flex justify-end items-center gap-5 pt-3 text-[12px] text-slate-700"
					style="font-family: Arial, Helvetica, sans-serif;"
				>
					<a href="/disclaimer" class="hover:underline">News &amp; Updates</a>
					<a href="/disclaimer" class="hover:underline">FAQ</a>
				</div>
				<!-- Main brand + nav -->
				<div class="flex items-center justify-between pb-4 pt-1">
					<div class="flex items-center gap-3">
						<!-- Columbia Crown -->
						<svg viewBox="0 0 60 46" class="w-9 h-8" aria-hidden="true">
							<path d="M4 40 L6 16 L18 26 L30 6 L42 26 L54 16 L56 40 Z" fill={COLUMBIA_BLUE} />
							<rect x="4" y="40" width="52" height="5" fill={COLUMBIA_BLUE} />
							<circle cx="6" cy="14" r="3" fill={COLUMBIA_BLUE} />
							<circle cx="30" cy="4" r="3.5" fill={COLUMBIA_BLUE} />
							<circle cx="54" cy="14" r="3" fill={COLUMBIA_BLUE} />
						</svg>
						<div class="leading-tight">
							<div class="text-[19px] font-bold text-slate-900" style="font-family: Georgia, serif;">
								Columbia
							</div>
							<div class="text-[13px] text-slate-500 -mt-0.5" style="font-family: Georgia, serif;">
								Undergraduate Admissions
							</div>
						</div>
					</div>
					<nav
						class="hidden md:flex items-center gap-6 text-[14px] font-bold text-slate-900"
						style="font-family: Arial, Helvetica, sans-serif;"
					>
						{#each navLinks as link}
							<a href="/disclaimer" class="hover:text-slate-600">{link}</a>
						{/each}
						<a href="/disclaimer" aria-label="Search" class="text-slate-900">&#128269;</a>
						<a href="/disclaimer" aria-label="Menu" class="text-slate-900 text-lg leading-none">&#9776;</a>
					</nav>
				</div>
			</div>
		</header>

		<main class="max-w-6xl mx-auto px-6 min-h-[420px]">
			<h1 class="text-[34px] font-bold text-slate-900 mt-8 mb-5" style="font-family: Georgia, serif;">
				Login
			</h1>

			<!-- Green info banner -->
			<div
				class="border-l-4 border-[#7ab648] bg-[#e4f0cd] px-4 py-3 mb-8 text-[14px] text-slate-800"
				style="font-family: Arial, Helvetica, sans-serif;"
			>
				To log in, please enter your email address and password.
			</div>

			<form on:submit={autoLogin} style="font-family: Arial, Helvetica, sans-serif;">
				{#if error}
					<p
						class="text-[13px] text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-4 max-w-md"
						role="alert"
					>
						{error}
					</p>
				{/if}

				<div class="flex items-center gap-3 mb-3">
					<label for="portal-email" class="text-[14px] text-slate-800 w-28">Email Address</label>
					<input
						id="portal-email"
						type="email"
						class="border border-slate-400 bg-white px-2 py-[3px] text-[14px] w-64"
						bind:value={emailInput}
						autocomplete="email"
					/>
				</div>

				<div class="flex items-center gap-3 mb-6">
					<label for="portal-password" class="text-[14px] text-slate-800 w-28">Password</label>
					<input
						id="portal-password"
						type="password"
						class="border border-slate-400 bg-white px-2 py-[3px] text-[14px] w-64"
						bind:value={passwordInput}
						autocomplete="current-password"
					/>
					<a
						href="/disclaimer"
						class="text-[14px] text-[#1a5b9e] underline ml-3 whitespace-nowrap">Forgot Your Password?</a
					>
				</div>

				<div class="flex items-center gap-4 pl-[124px] mb-6">
					<button
						type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
						class="border border-slate-400 bg-gradient-to-b from-slate-100 to-slate-300 px-4 py-[3px] text-[13px] font-bold text-slate-800 rounded-[2px] hover:from-slate-200 hover:to-slate-400"
					>
						Login
					</button>
					</div>

				<p class="text-[12px] text-slate-500 leading-relaxed max-w-2xl">
					For this simulation, use the same email address and password that you saved on the
					PredictAdmit.com home page. No real application data is used, and all information is stored
					only in your browser.
				</p>
			</form>
		</main>

		<!-- Footer -->
		<footer
			class="mt-20 border-t border-slate-200 pt-10 pb-12"
			style="font-family: Arial, Helvetica, sans-serif;"
		>
			<div class="max-w-6xl mx-auto px-6">
				<h2 class="text-[28px] mb-8 text-slate-900" style="font-family: Georgia, serif;">
					<span class="font-bold">Columbia</span>
					<span class="text-slate-500">Undergraduate Admissions</span>
				</h2>
				<div class="grid grid-cols-2 md:grid-cols-5 gap-6 text-[13px] text-[#1a5b9e]">
					<div class="space-y-2">
						<a href="/disclaimer" class="block hover:underline">Life at Columbia</a>
						<a href="/disclaimer" class="block hover:underline">How to Apply</a>
						<a href="/disclaimer" class="block hover:underline">Affordability &amp; Aid</a>
						<a href="/disclaimer" class="block hover:underline">Academics</a>
						<a href="/disclaimer" class="block hover:underline">Visit</a>
					</div>
					<div class="space-y-2">
						<a href="/disclaimer" class="block hover:underline">News &amp; Updates</a>
						<a href="/disclaimer" class="block hover:underline">FAQ</a>
						<a href="/disclaimer" class="block hover:underline">For Parents &amp; Guardians</a>
						<a href="/disclaimer" class="block hover:underline">For Counselors</a>
					</div>
					<div class="space-y-2">
						<a href="/disclaimer" class="block hover:underline">Privacy Policy</a>
						<a href="/disclaimer" class="block hover:underline">Terms of Use</a>
						<a href="/disclaimer" class="block hover:underline">Accessibility</a>
						<a href="/disclaimer" class="block hover:underline">University Policies</a>
					</div>
					<div class="text-[13px] text-slate-600 leading-relaxed">
						212 Hamilton Hall<br />
						Mail Code 2807<br />
						1130 Amsterdam Avenue<br />
						New York, NY 10027<br />
						212-854-2522<br />
						<a href="/disclaimer" class="text-[#1a5b9e] hover:underline">ugrad-ask@columbia.edu</a>
					</div>
					<div class="space-y-2 text-slate-700 font-bold">
						<div>Columbia College</div>
						<div>Columbia Engineering</div>
						<div>Columbia University</div>
					</div>
				</div>
				<div class="flex gap-4 mt-8 text-slate-700 text-lg">
					<a href="/disclaimer" aria-label="Instagram">&#9673;</a>
					<a href="/disclaimer" aria-label="Twitter">&#9673;</a>
					<a href="/disclaimer" aria-label="Facebook">&#9673;</a>
					<a href="/disclaimer" aria-label="YouTube">&#9673;</a>
				</div>
				<div class="mt-6 text-[11px] text-slate-400">
					PredictAdmit Simulation — Not affiliated with Columbia University.
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ===================== PORTAL ===================== -->
		<header class="border-b border-slate-200">
			<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<svg viewBox="0 0 60 46" class="w-8 h-7" aria-hidden="true">
						<path d="M4 40 L6 16 L18 26 L30 6 L42 26 L54 16 L56 40 Z" fill={COLUMBIA_BLUE} />
						<rect x="4" y="40" width="52" height="5" fill={COLUMBIA_BLUE} />
						<circle cx="6" cy="14" r="3" fill={COLUMBIA_BLUE} />
						<circle cx="30" cy="4" r="3.5" fill={COLUMBIA_BLUE} />
						<circle cx="54" cy="14" r="3" fill={COLUMBIA_BLUE} />
					</svg>
					<div class="leading-tight">
						<div class="text-[17px] font-bold text-slate-900" style="font-family: Georgia, serif;">
							Columbia
						</div>
						<div class="text-[12px] text-slate-500 -mt-0.5" style="font-family: Georgia, serif;">
							Undergraduate Admissions
						</div>
					</div>
				</div>
				<div class="text-[12px] text-slate-600" style="font-family: Arial, Helvetica, sans-serif;">
					Signed in as {applicantName()}
				</div>
			</div>
		</header>

		<main class="max-w-6xl mx-auto px-6 py-8" style="font-family: Arial, Helvetica, sans-serif;">
			<div class="flex flex-wrap justify-between items-end border-b border-slate-200 pb-3 mb-6">
				<h1 class="text-[30px] text-slate-900" style="font-family: Georgia, serif;">Applicant Status</h1>
				<div class="text-[12px] text-slate-600 flex flex-wrap gap-x-6 gap-y-1">
					<span><strong>Applicant:</strong> {applicantName()}</span>
					<span><strong>Round:</strong> {school.round}</span>
					<span><strong>Reference #:</strong> {school.referenceNumber}</span>
				</div>
			</div>

			<!-- Tabs -->
			<nav class="flex gap-1 border-b border-slate-200 mb-6 text-[13px] font-bold">
				{#each ['Admissions Status', 'Application', 'Financial Aid', 'Profile'] as tab}
					<button
						on:click={() => (activeTab = tab)}
						class="px-4 py-2 border-t border-l border-r rounded-t-sm -mb-px transition-colors"
						class:bg-white={activeTab === tab}
						class:text-slate-900={activeTab === tab}
						class:border-slate-200={activeTab === tab}
						class:bg-slate-50={activeTab !== tab}
						class:text-slate-500={activeTab !== tab}
						class:border-transparent={activeTab !== tab}
					>
						{tab}
					</button>
				{/each}
			</nav>

			{#if activeTab === 'Admissions Status'}
				<!-- Status update card -->
				<section class="mb-8">
					<div
						class="border-l-4 p-5"
						style="border-color: {school.primaryColor}; background-color: {COLUMBIA_BLUE}33;"
					>
						<h2
							class="text-[18px] font-bold mb-1"
							style="color: {school.primaryColor}; font-family: Georgia, serif;"
						>
							A Decision Has Been Posted
						</h2>
						<p class="text-[14px] text-slate-700 mb-4">
							An update to your application was last posted on <strong>{school.statusLastPosted}</strong
							>. Please view your admissions decision below.
						</p>
						<button
							on:click={handleViewUpdate}
							class="text-[14px] font-bold px-5 py-2 text-white rounded-sm shadow hover:opacity-90"
							style="background-color: {school.primaryColor};"
						>
							View Update &raquo;
						</button>
					</div>
				</section>

				<!-- Checklist -->
				<section class="mb-8">
					<h2 class="text-[18px] font-bold text-slate-800 mb-3" style="font-family: Georgia, serif;">
						Application Checklist
					</h2>
					<table class="w-full text-[13px] text-left border border-slate-200">
						<thead class="bg-slate-50 text-slate-700">
							<tr>
								<th class="px-4 py-2 font-bold w-32">Status</th>
								<th class="px-4 py-2 font-bold">Item</th>
								<th class="px-4 py-2 font-bold w-40">Date Received</th>
							</tr>
						</thead>
						<tbody>
							{#each checklistData as item}
								<tr class="border-t border-slate-100">
									<td
										class="px-4 py-2 font-bold"
										class:text-green-700={item.received}
										class:text-slate-500={!item.received}
									>
										{item.received ? '✓ ' : ''}{item.status}
									</td>
									<td class="px-4 py-2 text-slate-700">{item.detail}</td>
									<td class="px-4 py-2 text-slate-600">{item.date}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</section>

				<section class="mb-4">
					<h2 class="text-[18px] font-bold text-slate-800 mb-2" style="font-family: Georgia, serif;">
						Interview
					</h2>
					<div class="border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-700">
						Your application has been reviewed by the Admissions Committee. Interviews with Columbia
						alumni representatives are offered on a limited basis; not all applicants are contacted.
					</div>
				</section>
			{:else if activeTab === 'Application'}
				<div class="border border-slate-200 bg-slate-50 p-6 text-[14px] text-slate-600">
					Your submitted application materials, essays, and Columbia-specific responses are available
					here.
				</div>
			{:else if activeTab === 'Financial Aid'}
				<div class="border border-slate-200 bg-slate-50 p-6 text-[14px] text-slate-600">
					Columbia meets 100% of demonstrated financial need. Your financial aid award, if applicable,
					will be posted here following an admission offer.
				</div>
			{:else}
				<div class="border border-slate-200 bg-slate-50 p-6 text-[14px] text-slate-600">
					Review and update your contact details and biographical information.
				</div>
			{/if}
		</main>

		<footer
			class="border-t border-slate-200 mt-12 py-6"
			style="font-family: Arial, Helvetica, sans-serif;"
		>
			<div class="max-w-6xl mx-auto px-6 flex flex-wrap justify-between text-[11px] text-slate-500">
				<span>&copy; 2026 Columbia University in the City of New York.</span>
				<span>PredictAdmit Simulation — Not affiliated with Columbia University.</span>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<ColumbiaAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<ColumbiaDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
