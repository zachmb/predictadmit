<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import VanderbiltAccepted from '$lib/components/vanderbilt/VanderbiltAccepted.svelte';
	import VanderbiltDenied from '$lib/components/vanderbilt/VanderbiltDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'vanderbilt';
	const school = {
		schoolName: 'Vanderbilt University',
		primaryColor: '#866D4B',
		footerDomain: 'vanderbilt.edu',
		statusLastPosted: 'March 17, 2026',
		round: 'Regular Decision',
		referenceNumber: '582937831'
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
	$: firstName = (profile.name || 'Applicant').split(' ')[0];

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
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen bg-white text-gray-900" style="font-family: Georgia, 'Times New Roman', serif;">
	{#if !authenticated}
		<!-- ============================ LOGIN ============================ -->
		<header class="bg-white">
			<div class="mx-auto max-w-6xl px-6">
				<div class="flex items-center gap-3 border-b border-gray-200 py-1.5">
					<svg viewBox="0 0 100 100" class="h-4 w-4 shrink-0" aria-hidden="true">
						<path d="M10 8 L34 8 L50 58 L66 8 L90 8 L58 94 L42 94 Z" fill={school.primaryColor} />
					</svg>
					<div class="text-[11px] font-semibold tracking-[0.2em] text-gray-800">
						VANDERBILT UNIVERSITY
					</div>
				</div>
				<div class="flex items-center justify-between py-4">
					<a href="/disclaimer" class="flex items-center gap-3">
						<svg viewBox="0 0 100 100" class="h-9 w-9 shrink-0" aria-hidden="true">
							<path d="M10 8 L34 8 L50 58 L66 8 L90 8 L58 94 L42 94 Z" fill={school.primaryColor} />
						</svg>
						<span class="text-lg font-bold text-gray-900">Undergraduate Admissions</span>
					</a>
					<nav class="hidden items-center gap-6 text-[13px] text-gray-800 md:flex">
						{#each ['Apply', 'Visit', 'Request', 'Academics', 'Affordability', 'Community', 'Connect'] as item}
							<a href="/disclaimer" class="hover:text-[color:var(--gold)]" style="--gold: {school.primaryColor}">{item}</a>
						{/each}
					</nav>
				</div>
			</div>
		</header>

		<main class="mx-auto min-h-[520px] max-w-6xl px-6 py-12">
			<h1 class="mb-6 text-4xl font-normal text-gray-800">Login</h1>

			<div
				class="mb-8 border-l-4 bg-[#e6ecc9] px-4 py-3 text-[14px] text-gray-800"
				style="border-color: #7f8f3c;"
			>
				To log in, please enter your email address and password.
			</div>

			{#if error}
				<p
					class="mb-5 max-w-xl border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800"
					role="alert"
				>
					{error}
				</p>
			{/if}

			<div class="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
				<form class="space-y-4" on:submit={autoLogin}>
					<div class="flex items-center gap-6">
						<label for="portal-email" class="w-32 text-[13px] text-gray-900">Email Address</label>
						<input
							id="portal-email"
							type="email"
							class="w-72 border border-gray-300 bg-[#efefef] px-2 py-1.5 text-[13px]"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-6">
						<label for="portal-password" class="w-32 text-[13px] text-gray-900">Password</label>
						<input
							id="portal-password"
							type="password"
							class="w-72 border border-gray-300 bg-[#efefef] px-2 py-1.5 text-[13px]"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a
							href="/disclaimer"
							class="text-[14px] font-semibold hover:underline"
							style="color: {school.primaryColor};">Forgot Your Password?</a
						>
					</div>

					<div class="flex flex-wrap items-center gap-4 pt-4 md:pl-[152px]">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="rounded-full bg-[#111111] px-8 py-2.5 text-[14px] font-medium text-white hover:bg-black"
						>
							Login
						</button>
						</div>

					<p class="max-w-2xl pt-3 text-[11px] leading-relaxed text-gray-500 md:pl-[152px]">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>

				<div class="flex flex-col gap-1.5">
					<a
						href="/disclaimer"
						class="flex w-52 items-center gap-3 rounded bg-[#4285F4] px-2 py-2 text-[13px] text-white hover:opacity-90"
					>
						<span class="flex h-6 w-6 items-center justify-center rounded bg-white text-[13px] font-bold text-[#4285F4]">G</span>
						Login with Google
					</a>
					<a
						href="/disclaimer"
						class="flex w-52 items-center gap-3 rounded bg-[#3b5998] px-2 py-2 text-[13px] text-white hover:opacity-90"
					>
						<span class="flex h-6 w-6 items-center justify-center rounded bg-white text-[14px] font-bold text-[#3b5998]">f</span>
						Login with Facebook
					</a>
					<a
						href="/disclaimer"
						class="flex w-52 items-center gap-3 rounded bg-[#0077b5] px-2 py-2 text-[13px] text-white hover:opacity-90"
					>
						<span class="flex h-6 w-6 items-center justify-center rounded bg-white text-[12px] font-bold text-[#0077b5]">in</span>
						Login with LinkedIn
					</a>
				</div>
			</div>
		</main>

		<!-- Footer -->
		<footer class="mt-8 border-t border-gray-200 bg-white">
			<div class="mx-auto max-w-4xl px-6 py-12 text-center">
				<div class="flex items-center justify-center gap-3">
					<svg viewBox="0 0 100 100" class="h-12 w-12 shrink-0" aria-hidden="true">
						<path d="M10 8 L34 8 L50 58 L66 8 L90 8 L58 94 L42 94 Z" fill={school.primaryColor} />
					</svg>
					<div class="text-left leading-none">
						<div class="text-2xl font-normal tracking-wide text-gray-800">VANDERBILT</div>
						<div class="text-2xl font-normal tracking-wide text-gray-800">UNIVERSITY</div>
					</div>
				</div>
				<div class="mt-4 text-[13px] text-gray-600">Nashville, Tennessee 37240</div>
				<div class="mt-1 text-[13px] text-gray-600">
					615-322-2561 | 800-288-0432 &middot;
					<a href="/disclaimer" class="hover:underline" style="color: {school.primaryColor};">Contact Us</a>
				</div>
				<p class="mx-auto mt-6 max-w-3xl text-[11px] leading-relaxed text-gray-500">
					Vanderbilt University is committed to principles of equal opportunity and affirmative
					action. Vanderbilt University does not discriminate against individuals on the basis of
					their race, sex, sexual orientation, gender identity, religion, color, national or ethnic
					origin, age, disability, military service, or genetic information in its administration of
					educational policies, programs, or activities; admissions policies; scholarship and loan
					programs; athletic or other University-administered programs; or employment. Accessibility
					information. Vanderbilt&reg;, Vanderbilt University&reg; and the Vanderbilt logos are
					trademarks of The Vanderbilt University. Site Development: Digital Strategies
					(Communications and Marketing.) &copy;2026
				</p>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============================ PORTAL ============================ -->
		<header class="bg-white">
			<div class="mx-auto max-w-6xl px-6">
				<div class="flex items-center gap-3 border-b border-gray-200 py-1.5">
					<svg viewBox="0 0 100 100" class="h-4 w-4 shrink-0" aria-hidden="true">
						<path d="M10 8 L34 8 L50 58 L66 8 L90 8 L58 94 L42 94 Z" fill={school.primaryColor} />
					</svg>
					<div class="text-[11px] font-semibold tracking-[0.2em] text-gray-800">
						VANDERBILT UNIVERSITY
					</div>
				</div>
				<div class="flex items-center justify-between py-4">
					<div class="flex items-center gap-3">
						<svg viewBox="0 0 100 100" class="h-9 w-9 shrink-0" aria-hidden="true">
							<path d="M10 8 L34 8 L50 58 L66 8 L90 8 L58 94 L42 94 Z" fill={school.primaryColor} />
						</svg>
						<span class="text-lg font-bold text-gray-900">Undergraduate Admissions</span>
					</div>
					<nav class="hidden items-center gap-6 text-[13px] text-gray-800 md:flex">
						{#each ['Apply', 'Visit', 'Request', 'Academics', 'Affordability', 'Community', 'Connect'] as item}
							<a href="/disclaimer" class="hover:text-[color:var(--gold)]" style="--gold: {school.primaryColor}">{item}</a>
						{/each}
					</nav>
				</div>
			</div>
		</header>

		<main class="mx-auto max-w-6xl px-6 pb-16">
			<div class="flex items-center justify-end pt-4 text-[14px] text-gray-800">
				{applicantName()}
				<a href="/disclaimer" class="ml-2 text-[12px]" style="color: {school.primaryColor};">Logout</a>
			</div>

			<div class="mt-4 flex gap-2">
				{#each ['Application', 'Financial Aid', 'Scholarships'] as tab}
					<a
						href="/disclaimer"
						class="rounded border border-gray-300 px-3 py-1 text-[12px] text-gray-700 hover:bg-gray-50"
						>{tab}</a
					>
				{/each}
			</div>

			<div class="mt-8 flex flex-col gap-8 md:flex-row md:justify-between">
				<div class="max-w-2xl">
					<h1 class="text-3xl font-normal text-gray-800">
						{firstName}, welcome to your MyAppVU portal.
					</h1>
					<p class="mt-5 text-[15px] leading-relaxed text-gray-700">
						NOTE: MyAppVU portal is the only way to receive your Vanderbilt admissions decision. Any
						official email communication from the Office of Undergraduate Admissions will come from a
						Vanderbilt.edu email address.
					</p>
					<p class="mt-5 text-[15px] leading-relaxed text-gray-700">
						It may take up to two business days for application pieces and test scores to be
						reflected in this portal. Only required items appear on the checklist. For example, Mid
						Year Report, SAT II/AP/IB test scores and additional recommendation letters will not
						appear on the checklist or test scores list.
					</p>
					<button
						on:click={handleViewUpdate}
						class="mt-6 rounded-full bg-[#111111] px-6 py-2.5 text-[14px] font-medium text-white hover:bg-black"
					>
						Decision Available
					</button>
				</div>

				<div class="text-[14px] leading-relaxed text-gray-800 md:pt-2">
					<div><span class="font-bold">Decision Plan:</span> {school.round}</div>
					<div><span class="font-bold">VU School:</span> Peabody College</div>
					<div><span class="font-bold">Application Source:</span> Coalition Application</div>
					<div>
						<span class="font-bold">Status:</span>
						<button
							on:click={handleViewUpdate}
							class="font-semibold underline"
							style="color: {school.primaryColor};">Decision Available &#9873;</button
						>
					</div>
					<div><span class="font-bold">Reference Number:</span> {school.referenceNumber}</div>
				</div>
			</div>

			<!-- Test Scores -->
			<section class="mt-14 border-t border-gray-200 pt-8">
				<h2 class="text-2xl font-bold text-gray-800">Test Scores</h2>
				<p class="mt-4 text-[15px] leading-relaxed text-gray-700">
					You have indicated that you will be applying <strong>with</strong> ACT or SAT Scores.
					Self-reported ACT or SAT Score Reports may take up to two business days to be reflected
					here.
				</p>
				<table class="mt-4 text-[15px] text-gray-800">
					<thead>
						<tr class="text-left">
							<th class="pr-10 font-normal">Test</th>
							<th class="font-normal">Test Superscore</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="pr-10">ACT</td>
							<td>35</td>
						</tr>
						<tr>
							<td class="pr-10">SAT</td>
							<td></td>
						</tr>
					</tbody>
				</table>
				<p class="mt-4 text-[15px] leading-relaxed text-gray-700">
					If you would like to submit additional self-reported testing please fill out this
					<a href="/disclaimer" class="underline" style="color: {school.primaryColor};">form</a>.
				</p>
			</section>

			<!-- Application Changes -->
			<section class="mt-12">
				<h2 class="text-2xl font-bold text-gray-800">Application Changes</h2>
				<p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-gray-700">
					You are no longer permitted to submit changes to your Vanderbilt decision plan or to your
					school of choice. Decision plan and school of choice changes can be submitted only up to
					two weeks after the decision plan deadline. Find information about our three decision plans
					and a pdf of the ED Agreement on our website. The ED Agreement is required for students who
					change their decision plan to Early Decision 1 or 2.
				</p>
			</section>

			<!-- Upload Materials -->
			<section class="mt-12">
				<h2 class="text-2xl font-bold text-gray-800">Upload Materials</h2>
				<p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-gray-700">
					You may upload application materials using the drop-down below. The only required document
					that can be uploaded (and will appear on your MyAppVU checklist) is the Early Decision
					Agreement. Required materials such as high school transcripts and teacher recommendations
					cannot be submitted through this upload tool; to be considered official, these materials
					must be submitted directly from the application platform or from your high school. DO NOT
					upload materials that are not listed in the drop-down menu.
				</p>
				<p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-gray-700">
					If you have completed a Schoolhouse portfolio, you can upload it below.
				</p>
				<p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-gray-700">
					Because all items uploaded will be added to your admissions file and will be considered if
					submitted in time for admissions review, it is not necessary to contact your admissions
					officer regarding these materials.
				</p>
				<div class="mt-5 max-w-md">
					<select
						class="w-full border border-gray-300 bg-white px-2 py-1.5 text-[14px] text-gray-700"
					>
						<option></option>
						<option>Early Decision Agreement</option>
						<option>Schoolhouse Portfolio</option>
					</select>
					<div class="mt-3 flex items-center gap-3 bg-[#efefef] px-3 py-2 text-[13px] text-gray-600">
						<span class="rounded border border-gray-400 bg-gray-100 px-2 py-0.5">Choose File</span>
						no file selected
					</div>
					<button
						class="mt-4 rounded-full bg-[#111111] px-6 py-2 text-[14px] font-medium text-white hover:bg-black"
					>
						Upload
					</button>
				</div>
			</section>

			<!-- Verify Address -->
			<section class="mt-12">
				<h2 class="text-2xl font-bold text-gray-800">Verify Address</h2>
				<p class="mt-4 text-[15px] text-gray-700">We have your addresses listed as follows:</p>
				<div class="mt-4 flex flex-wrap gap-16 text-[15px] leading-relaxed text-gray-800">
					<div>
						<div class="italic text-gray-500">Mailing Address</div>
						<div>1824 Smith Rd</div>
						<div>Northbrook, IL 60062-5830</div>
						<div>United States</div>
					</div>
					<div>
						<div class="italic text-gray-500">Permanent Address</div>
						<div>1824 Smith Rd</div>
						<div>Northbrook, IL 60062-5830</div>
						<div>United States</div>
					</div>
				</div>
				<a
					href="/disclaimer"
					class="mt-4 inline-block text-[15px] underline"
					style="color: {school.primaryColor};">Edit Addresses</a
				>
				<div class="mt-6 flex flex-wrap gap-6 border-t border-gray-200 pt-4 text-[15px]">
					<a href="/disclaimer" class="hover:underline" style="color: {school.primaryColor};"
						>Change Email Address</a
					>
					<a href="/disclaimer" class="hover:underline" style="color: {school.primaryColor};"
						>Change Password</a
					>
					<a href="/disclaimer" class="hover:underline" style="color: {school.primaryColor};">Logout</a>
				</div>
			</section>
		</main>

		<!-- Footer -->
		<footer class="mt-8 border-t border-gray-200 bg-white">
			<div class="mx-auto max-w-4xl px-6 py-12 text-center">
				<div class="flex items-center justify-center gap-3">
					<svg viewBox="0 0 100 100" class="h-12 w-12 shrink-0" aria-hidden="true">
						<path d="M10 8 L34 8 L50 58 L66 8 L90 8 L58 94 L42 94 Z" fill={school.primaryColor} />
					</svg>
					<div class="text-left leading-none">
						<div class="text-2xl font-normal tracking-wide text-gray-800">VANDERBILT</div>
						<div class="text-2xl font-normal tracking-wide text-gray-800">UNIVERSITY</div>
					</div>
				</div>
				<div class="mt-4 text-[13px] text-gray-600">Nashville, Tennessee 37240</div>
				<div class="mt-1 text-[13px] text-gray-600">
					615-322-2561 | 800-288-0432 &middot;
					<a href="/disclaimer" class="hover:underline" style="color: {school.primaryColor};">Contact Us</a>
				</div>
				<p class="mx-auto mt-6 max-w-3xl text-[11px] leading-relaxed text-gray-500">
					Vanderbilt University is committed to principles of equal opportunity and affirmative
					action. Vanderbilt University does not discriminate against individuals on the basis of
					their race, sex, sexual orientation, gender identity, religion, color, national or ethnic
					origin, age, disability, military service, or genetic information in its administration of
					educational policies, programs, or activities; admissions policies; scholarship and loan
					programs; athletic or other University-administered programs; or employment. Accessibility
					information. Vanderbilt&reg;, Vanderbilt University&reg; and the Vanderbilt logos are
					trademarks of The Vanderbilt University. Site Development: Digital Strategies
					(Communications and Marketing.) &copy;2026
				</p>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<VanderbiltAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<VanderbiltDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
