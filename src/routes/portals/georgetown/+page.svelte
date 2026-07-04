<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import GeorgetownAccepted from '$lib/components/georgetown/GeorgetownAccepted.svelte';
	import GeorgetownDenied from '$lib/components/georgetown/GeorgetownDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'georgetown';
	const school = {
		schoolName: 'Georgetown University',
		primaryColor: '#041E42', // Georgetown blue
		accentColor: '#8A8B8C', // Georgetown gray
		footerDomain: 'georgetown.edu',
		statusLastPosted: 'March 20, 2026',
		round: 'Regular Decision',
		referenceNumber: '528491067'
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

	// --- Checklist Data (Georgetown Slate checklist) ---
	const checklist = [
		{ status: 'received', detail: 'Georgetown Application', date: '01/08/2026' },
		{ status: 'received', detail: 'Application Fee / Fee Waiver', date: '01/08/2026' },
		{ status: 'received', detail: 'Secondary School Report', date: '01/12/2026' },
		{ status: 'received', detail: 'Counselor Recommendation', date: '01/12/2026' },
		{ status: 'received', detail: 'Teacher Recommendation', date: '01/14/2026' },
		{ status: 'received', detail: 'Official Transcript', date: '01/12/2026' },
		{ status: 'received', detail: 'Mid-Year School Report', date: '02/09/2026' },
		{ status: 'awaiting', detail: 'SAT / ACT Score Report', date: '--' }
	];

	// Top-level site navigation (all outbound -> disclaimer)
	const mainMenu = [
		'Admissions',
		'Academics',
		'Campus Life',
		'Research',
		'Alumni',
		'Global',
		'About'
	];
</script>

<svelte:head>
	<title>{authenticated ? 'Applicant Status Page' : 'Login'}</title>
</svelte:head>

<div class="min-h-screen bg-white text-gray-800" style="font-family: Georgia, 'Times New Roman', serif;">
	<!-- ============ SHARED GEORGETOWN SITE HEADER ============ -->
	<header class="bg-white border-b border-gray-200">
		<!-- Utility bar -->
		<div class="max-w-[1140px] mx-auto px-6 pt-4 flex justify-between items-start">
			<a href="/disclaimer" class="block leading-none">
				<span
					class="block text-[26px] tracking-tight"
					style="color: {school.primaryColor}; font-family: Georgia, serif; font-weight: 400;"
				>
					Georgetown
				</span>
				<span
					class="block text-[13px] tracking-[0.3em] uppercase mt-0.5"
					style="color: {school.accentColor};"
				>
					University
				</span>
			</a>
			<ul
				class="hidden sm:flex gap-5 text-[12px] uppercase tracking-wider pt-1"
				style="color: {school.primaryColor}; font-family: Arial, sans-serif;"
			>
				<li><a href="/disclaimer" class="hover:underline">Giving</a></li>
				<li><a href="/disclaimer" class="hover:underline">Connect</a></li>
				<li><a href="/disclaimer" class="hover:underline">Directory</a></li>
			</ul>
		</div>
		<!-- Main nav -->
		<nav
			class="max-w-[1140px] mx-auto px-6 mt-3 border-t border-gray-200"
			aria-label="Top level navigation"
		>
			<ul
				class="flex flex-wrap gap-6 py-2 text-[13px] uppercase tracking-wide"
				style="color: {school.primaryColor}; font-family: Arial, sans-serif;"
			>
				{#each mainMenu as item}
					<li>
						<a href="/disclaimer" class="hover:underline" class:font-bold={item === 'Admissions'}>
							{item}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</header>

	<!-- Header image band (Healy Hall / cherry blossoms motif) -->
	<div
		class="w-full h-[120px] sm:h-[160px]"
		style="background: linear-gradient(120deg, {school.primaryColor} 0%, #0a2c5a 55%, {school.accentColor} 130%);"
	></div>

	<!-- Section label -->
	<div class="max-w-[1140px] mx-auto px-6 py-3 border-b border-gray-200">
		<span
			class="text-[15px] uppercase tracking-[0.25em]"
			style="color: {school.accentColor}; font-family: Arial, sans-serif;"
		>
			Admissions
		</span>
	</div>

	{#if !authenticated}
		<!-- ============ LOGIN PAGE ============ -->
		<main class="max-w-[1140px] mx-auto px-6 py-10 min-h-[420px]">
			<h1 class="text-[32px] font-normal mb-4" style="color: {school.primaryColor};">Login</h1>
			<p
				class="border-l-4 bg-[#eef3fa] px-4 py-3 mb-8 text-[14px] text-gray-800 max-w-xl"
				style="border-color: {school.primaryColor};"
			>
				To log in, please enter your email address and password.
			</p>

			<form class="max-w-xl" on:submit={autoLogin} autocomplete="off">
				{#if error}
					<p
						class="text-[13px] text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-4"
						role="alert"
					>
						{error}
					</p>
				{/if}

				<div class="flex items-center gap-3 mb-4">
					<label for="portal-email" class="text-[14px] text-gray-800 w-[150px]">
						Email Address
					</label>
					<input
						id="portal-email"
						type="email"
						class="border border-gray-400 bg-white px-2 py-1 text-[14px] w-[220px]"
						bind:value={emailInput}
						autocomplete="email"
					/>
				</div>

				<div class="flex items-center gap-3 mb-6">
					<label for="portal-password" class="text-[14px] text-gray-800 w-[150px]"> Password </label>
					<input
						id="portal-password"
						type="password"
						class="border border-gray-400 bg-white px-2 py-1 text-[14px] w-[220px]"
						bind:value={passwordInput}
						autocomplete="current-password"
					/>
					<a href="/disclaimer" class="text-[13px] text-blue-800 hover:underline">
						Forgot Your Password?
					</a>
				</div>

				<div class="flex items-center gap-4 pl-[162px]">
					<button
						type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
						class="px-6 py-2 text-[14px] font-semibold text-white"
						style="background-color: {school.primaryColor}; font-family: Arial, sans-serif;"
					>
						Login
					</button>
					</div>

				<p class="pt-8 text-[12px] leading-relaxed text-gray-500 max-w-lg">
					For this simulation, use the same email address and password that you saved on the
					PredictAdmit.com home page. No real application data is used, and all information is stored
					only in your browser.
				</p>
			</form>
		</main>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============ APPLICANT STATUS PAGE ============ -->
		<main class="max-w-[1140px] mx-auto px-6 py-6 min-h-[420px]">
			<!-- Update actions row -->
			<p class="mb-6 text-[14px]" style="font-family: Arial, sans-serif;">
				<span class="font-bold mr-4">Update:</span>
				<a href="/disclaimer" class="text-blue-800 hover:underline mr-4">Change Email Address</a>
				<a href="/disclaimer" class="text-blue-800 hover:underline mr-4">Change Password</a>
				<a href="/disclaimer" class="text-blue-800 hover:underline mr-4">Logout</a>
			</p>

			<div class="flex flex-col lg:flex-row gap-6">
				<!-- Left / main column -->
				<div class="flex-1">
					<!-- Welcome box -->
					<div class="border p-4 mb-6" style="border-color: {school.primaryColor};">
						<h2 class="text-[24px] mb-2" style="color: {school.primaryColor};">
							Welcome, {firstName()}!
						</h2>
						<p class="text-[15px] leading-relaxed text-gray-800">
							We are so happy that you have submitted an application to Georgetown University for
							Fall 2026. We hope that your Georgetown Application Portal will help you to connect with
							us and to have the necessary information easily available to you. Please carefully
							review each section of the portal to better understand where your application is in the
							admissions process. We look forward to working with you over the coming months.<br /><br
							/>
							- The Georgetown Admissions Staff
						</p>
					</div>

					<!-- Application Information box -->
					<div class="border mb-6" style="border-color: {school.primaryColor};">
						<div
							class="text-center text-white py-1 text-[15px]"
							style="background-color: {school.primaryColor};"
						>
							Application Information
						</div>
						<div class="p-3 text-[14px] leading-relaxed text-gray-800">
							Application Reference Number: <strong>{school.referenceNumber}</strong><br />
							Your Current Application Deadline: <strong>Regular Decision - January 10</strong><br />
							Applicant Name: <strong>{applicantName()}</strong><br />
							Email Address: <strong>{profile.email || 'applicant@example.com'}</strong>
							<p class="mt-3 text-[13px] text-gray-600">
								If you wish to provide an update regarding your standardized testing, complete
								<a href="/disclaimer" class="text-blue-800 underline">this form</a>. If you have
								indicated that you have sent or are planning to send scores in the near future, please
								continue to monitor the checklist below for receipt of your standardized test scores.
								Your file will still be fully reviewed even if SAT/ACT remains as awaiting on your
								checklist.
							</p>
						</div>
					</div>

					<!-- Status Update section -->
					<div class="mb-6">
						<h3 class="text-[20px] mb-2" style="color: {school.primaryColor};">Status Update</h3>
						<div
							class="border-2 p-4 bg-[#f5f7fb]"
							style="border-color: {school.primaryColor};"
						>
							<p class="text-[15px] text-gray-800 mb-3">
								An update to your application was last posted <strong>{school.statusLastPosted}</strong>.
							</p>
							<button
								on:click={handleViewUpdate}
								class="text-[14px] font-bold text-white px-5 py-2 hover:opacity-90"
								style="background-color: {school.primaryColor}; font-family: Arial, sans-serif;"
							>
								View Update &gt;&gt;
							</button>
						</div>
					</div>

					<!-- Checklist -->
					<div class="mb-6">
						<h3 class="text-[20px] mb-2" style="color: {school.primaryColor};">
							Application Checklist
						</h3>
						<table class="w-full text-[14px] text-left border border-gray-300">
							<thead class="text-white" style="background-color: {school.primaryColor};">
								<tr>
									<th class="px-3 py-2 w-24 font-normal">Status</th>
									<th class="px-3 py-2 font-normal">Material</th>
									<th class="px-3 py-2 w-32 font-normal">Date Received</th>
								</tr>
							</thead>
							<tbody>
								{#each checklist as item}
									<tr class="border-b border-gray-200">
										<td class="px-3 py-2">
											{#if item.status === 'received'}
												<span class="text-green-700 font-bold">✓ Received</span>
											{:else}
												<span class="text-red-600 font-bold">✗ Awaiting</span>
											{/if}
										</td>
										<td class="px-3 py-2">{item.detail}</td>
										<td class="px-3 py-2">{item.date}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<!-- Application Proof -->
					<div class="mb-6">
						<h3 class="text-[20px] mb-2" style="color: {school.primaryColor};">Application Proof</h3>
						<p class="text-[14px] text-gray-800">
							This is a proof of your application and is for your records only. Do not send this proof
							by mail as your application.
						</p>
						<p class="mt-1">
							<a href="/disclaimer" class="text-blue-800 hover:underline text-[14px]"
								>Preview Application Proof</a
							>
						</p>
					</div>
				</div>

				<!-- Right sidebar -->
				<aside class="w-full lg:w-[300px] shrink-0 space-y-5">
					<!-- Notification of Decision -->
					<div class="border" style="border-color: {school.primaryColor};">
						<div
							class="text-center text-white py-1 text-[14px]"
							style="background-color: {school.primaryColor};"
						>
							Notification of Decision
						</div>
						<div class="p-3 text-[14px] text-gray-800 text-center">
							Early Action - December 15<br />
							Regular Decision - April 1
						</div>
					</div>

					<!-- Alumni Interviewer -->
					<div class="border" style="border-color: {school.primaryColor};">
						<div
							class="text-center text-white py-1 text-[14px]"
							style="background-color: {school.primaryColor};"
						>
							Your Assigned Alumni Interviewer
						</div>
						<div class="p-3 text-[13px] text-gray-800 leading-relaxed">
							<strong>It is your responsibility to reach out to your interviewer to set up an
								interview as soon as possible.</strong>
							Please reference the information below for your assigned AAP interviewer:<br /><br />
							<strong>AAP Interviewer:</strong> Michael Ippolito<br />
							<strong>Email Address:</strong>
							<a href="/disclaimer" class="text-blue-800 underline">m.ippolito@georgetown.edu</a><br />
							<strong>Date Assigned:</strong> November 30, 2025
						</div>
					</div>

					<!-- Virtually Visit -->
					<div class="border" style="border-color: {school.primaryColor};">
						<div
							class="text-center text-white py-1 text-[14px]"
							style="background-color: {school.primaryColor};"
						>
							Virtually Visit Us
						</div>
						<div class="p-3 text-[13px] text-gray-800">
							If you have not yet visited campus or would like to connect with us again, please
							<a href="/disclaimer" class="text-blue-800 underline">sign-up</a> for a virtual
							information session.
						</div>
					</div>

					<!-- Verify Address -->
					<div class="border" style="border-color: {school.primaryColor};">
						<div
							class="text-center text-white py-1 text-[14px]"
							style="background-color: {school.primaryColor};"
						>
							Verify Address
						</div>
						<div class="p-3 text-[13px] text-gray-800">
							<em>Mailing Address</em><br />
							On file with the Office of Undergraduate Admissions.<br />
							<a href="/disclaimer" class="text-blue-800 underline">Edit Addresses</a>
						</div>
					</div>
				</aside>
			</div>
		</main>
	{:else if shownDecision === 'admit'}
		<GeorgetownAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<GeorgetownDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}

	<!-- ============ SHARED GEORGETOWN FOOTER ============ -->
	<footer class="mt-10" style="background-color: {school.primaryColor};">
		<div class="max-w-[1140px] mx-auto px-6 py-6 text-white">
			<p class="text-[16px]" style="font-family: Georgia, serif;">Georgetown University</p>
			<p class="text-[13px] text-gray-300 mt-1">
				37th and O Streets, N.W., Washington D.C. 20057<br />
				Phone: (202) 687.0100
			</p>
			<ul
				class="flex flex-wrap gap-4 mt-4 text-[12px] text-gray-200"
				style="font-family: Arial, sans-serif;"
			>
				<li><a href="/disclaimer" class="hover:underline">Careers</a></li>
				<li><a href="/disclaimer" class="hover:underline">Copyright</a></li>
				<li><a href="/disclaimer" class="hover:underline">Privacy</a></li>
				<li><a href="/disclaimer" class="hover:underline">Contact</a></li>
				<li><a href="/disclaimer" class="hover:underline">Tools &amp; Resources</a></li>
				<li><a href="/disclaimer" class="hover:underline">Maps</a></li>
				<li><a href="/disclaimer" class="hover:underline">Mobile App</a></li>
			</ul>
			<p class="text-[11px] text-gray-400 mt-4">
				PredictAdmit Simulation - Not affiliated with Georgetown University.
			</p>
		</div>
	</footer>
</div>
