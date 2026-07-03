<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import UChicagoAccepted from '$lib/components/uchicago/UChicagoAccepted.svelte';
	import UChicagoDenied from '$lib/components/uchicago/UChicagoDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'uchicago';
	const UCHICAGO_MAROON = '#800000'; // UChicago maroon
	const UCHICAGO_TEAL = '#155f83'; // Section header teal used throughout the real portal

	const school = {
		schoolName: 'The University of Chicago',
		primaryColor: UCHICAGO_MAROON,
		footerDomain: 'uchicago.edu',
		statusLastPosted: 'March 16, 2026',
		round: 'Regular Decision',
		referenceNumber: '657368584'
	};

	// --- State Variables ---
	let profile: UserProfile = { ...defaultProfile };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;

	// Subscribe to the global user profile store
	$: profile = $userProfile;

	// Dynamic Data Helpers
	const applicantName = () => profile.name || 'Applicant';

	// Default decision when the prediction store has no entry for this slug
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

	// --- Main navigation (recreated from the real captures) ---
	const mainNav = ['Apply', 'Visit', 'Academics', 'Student Life', 'After Graduation', 'Cost & Aid', 'Contact Us'];

	// --- Financial Aid Checklist rows ---
	const financialAid = [
		{ detail: 'FAFSA - Free Application for Federal Student Aid', date: '01/08/2026' },
		{ detail: "Parent's 2024 Federal Income Tax Return", date: '02/10/2026' },
		{ detail: "Parent's W-2 Forms", date: '02/10/2026' },
		{ detail: 'UChicago Financial Aid Worksheet', date: '02/10/2026' }
	];

	// --- Forms rows ---
	const forms = [
		{ received: false, detail: 'Schoolhouse.World Transcript Upload', date: '' },
		{ received: true, detail: 'Self Reported Test Scores', date: '01/13/2026' },
		{ received: true, detail: 'Student Early Decision Agreement', date: '01/13/2026' }
	];
</script>

<svelte:head>
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen bg-white text-gray-800" style="font-family: Georgia, 'Times New Roman', serif;">
	{#if !authenticated}
		<!-- ============ LOGIN PAGE ============ -->
		<header>
			<div class="border-b border-gray-300 bg-white">
				<div class="max-w-6xl mx-auto px-6 py-4 flex items-end justify-between">
					<a href="/disclaimer" class="block text-3xl font-bold" style="color: {UCHICAGO_MAROON};">
						College Admissions
					</a>
					<a href="/disclaimer" class="text-sm tracking-wide text-gray-600 uppercase">
						University of Chicago
					</a>
				</div>
			</div>
			<nav style="background-color: {UCHICAGO_MAROON};" class="text-white">
				<div class="max-w-6xl mx-auto px-6 flex items-center text-sm">
					<a href="/disclaimer" class="px-3 py-3 hover:bg-black/20">&#8962;</a>
					{#each mainNav as item}
						<a href="/disclaimer" class="px-3 py-3 hover:bg-black/20 whitespace-nowrap">{item}</a>
					{/each}
				</div>
			</nav>
		</header>

		<main class="min-h-[520px] py-12">
			<div class="max-w-4xl mx-auto px-6">
				<h1 class="text-4xl font-normal mb-6 text-gray-900 border-b border-gray-200 pb-3">Login</h1>

				<div class="border border-green-700 bg-[#E6F4EA] px-4 py-3 mb-8 text-[14px] text-green-900">
					To log in, please enter your email address and password.
				</div>

				<form class="space-y-4 max-w-xl" on:submit={autoLogin}>
					{#if error}
						<p
							class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-3">
						<label for="portal-email" class="text-[14px] text-gray-900 w-36 text-left font-semibold">
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="border border-gray-400 bg-white px-2 py-1 text-[14px] w-64"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-3">
						<label for="portal-password" class="text-[14px] text-gray-900 w-36 text-left font-semibold">
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="border border-gray-400 bg-white px-2 py-1 text-[14px] w-64"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a href="/disclaimer" class="text-[13px] hover:underline ml-1" style="color: {UCHICAGO_TEAL};">
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-3 pt-3">
						<div class="w-36"></div>
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="text-white px-6 py-1.5 text-[14px] font-semibold hover:opacity-90"
							style="background-color: {UCHICAGO_MAROON};"
						>
							Login
						</button>
						</div>

					<div class="pt-8 text-[13px] leading-relaxed text-gray-600 max-w-2xl">
						If you do not know your password or have not set one up, please click the "Forgot Your
						Password?" link to create a new password. For this simulation, use the same email address
						and password that you saved on the PredictAdmit.com home page. No real application data is
						used, and all information is stored only in your browser.
					</div>
				</form>
			</div>
		</main>

		<!-- Footer -->
		<footer class="border-t border-gray-300 bg-[#f4f4f2] text-gray-700 text-[13px] mt-8">
			<div class="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
				<div>
					<div class="text-lg font-bold" style="color: {UCHICAGO_MAROON};">The University of Chicago</div>
					<p class="mt-2">&copy; 2026 The University of Chicago</p>
				</div>
				<div>
					<a href="/disclaimer" class="font-semibold" style="color: {UCHICAGO_MAROON};">College Admissions</a>
					<p class="mt-2">1101 E. 58th Street</p>
					<p>Rosenwald Hall 105</p>
					<p>Chicago, Illinois 60637</p>
					<p>Phone: 773.702.8650</p>
				</div>
				<div class="space-y-1">
					<a href="/disclaimer" class="block hover:underline">Apply Online</a>
					<a href="/disclaimer" class="block hover:underline">Request Information</a>
					<a href="/disclaimer" class="block hover:underline">Privacy Information</a>
					<a href="/disclaimer" class="block hover:underline">Accessibility</a>
					<a href="/disclaimer" class="block hover:underline">Non-Discrimination</a>
				</div>
			</div>
			<div class="border-t border-gray-300 py-3 text-center text-[11px] text-gray-500">
				PredictAdmit Simulation &mdash; Not affiliated with The University of Chicago
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============ APPLICANT PORTAL ============ -->
		<header>
			<div class="border-b border-gray-300 bg-white">
				<div class="max-w-6xl mx-auto px-6 py-4 flex items-end justify-between">
					<a href="/disclaimer" class="block text-3xl font-bold" style="color: {UCHICAGO_MAROON};">
						College Admissions
					</a>
					<span class="text-sm tracking-wide text-gray-600 uppercase">University of Chicago</span>
				</div>
			</div>
			<nav style="background-color: {UCHICAGO_MAROON};" class="text-white">
				<div class="max-w-6xl mx-auto px-6 flex items-center text-sm">
					<a href="/disclaimer" class="px-3 py-3 hover:bg-black/20">&#8962;</a>
					{#each mainNav as item}
						<a href="/disclaimer" class="px-3 py-3 hover:bg-black/20 whitespace-nowrap">{item}</a>
					{/each}
				</div>
			</nav>
		</header>

		<div class="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
			<!-- Main column -->
			<div class="flex-1 min-w-0 space-y-8">
				<!-- Welcome block -->
				<div>
					<p class="text-2xl mb-4" style="color: {UCHICAGO_MAROON};">Welcome, {applicantName()}</p>
					<p class="text-[15px] leading-relaxed text-gray-800">
						We are here to help! If you need assistance or additional information, please contact us.
						Please provide us with your name and reference number: <strong>{school.referenceNumber}</strong>
					</p>
					<p class="text-[15px] mt-4 font-semibold text-gray-800">Your UChicago Account is your resource to:</p>
					<ul class="list-disc ml-8 mt-2 text-[15px] text-gray-800 space-y-1">
						<li>Complete and update your profile</li>
						<li>Change your <a href="/disclaimer" class="underline" style="color: {UCHICAGO_TEAL};">password</a></li>
						<li>Apply for financial aid</li>
						<li>Upload and submit additional materials</li>
						<li>View your admission decision</li>
						<li>Upload and submit your 2 minute video profile</li>
					</ul>
				</div>

				<!-- Congratulatory notice -->
				<div class="p-4 border border-[#d6d6ce] bg-[#f4f4f2] text-[14px] leading-relaxed text-gray-800">
					Thank you! With the release of admissions decisions, we want to take a moment to say thank
					you &mdash; you are all extraordinary! You are among the most brilliant, ambitious, and
					academically qualified students in the world. It is a privilege to have shared in your
					ideas and accomplishments, and to have gotten to know you better.
				</div>

				<!-- Status Update -->
				<div class="border border-[#d6d6ce] bg-[#f4f4f2] pt-8 px-6 pb-6 relative">
					<h3
						class="absolute -top-4 left-0 text-white text-[15px] font-semibold px-4 py-1"
						style="background-color: {UCHICAGO_TEAL};"
					>
						Status Update
					</h3>
					<p class="text-[15px] text-gray-800 mb-4">
						An update to your application was last posted {school.statusLastPosted}.
					</p>
					<button
						on:click={handleViewUpdate}
						class="text-[15px] font-bold hover:underline"
						style="color: {UCHICAGO_TEAL};"
					>
						View Update &gt;&gt;
					</button>
				</div>

				<!-- Financial Aid Checklist -->
				<div class="border border-[#d6d6ce] bg-[#f4f4f2] pt-8 px-6 pb-6 relative">
					<h3
						class="absolute -top-4 left-0 text-white text-[15px] font-semibold px-4 py-1"
						style="background-color: {UCHICAGO_TEAL};"
					>
						Financial Aid Checklist
					</h3>
					<a href="/disclaimer" class="text-[13px] underline" style="color: {UCHICAGO_TEAL};">
						Click here for additional details
					</a>
					<table class="w-full text-[14px] text-left mt-3 bg-white border border-gray-200">
						<thead>
							<tr class="border-b border-gray-300">
								<th class="px-3 py-2" colspan="2">Status</th>
								<th class="px-3 py-2">Details</th>
								<th class="px-3 py-2">Date</th>
							</tr>
						</thead>
						<tbody>
							{#each financialAid as row}
								<tr class="border-b border-gray-100 align-top">
									<td class="px-3 py-2 w-6 text-green-700 font-bold">&#10003;</td>
									<td class="px-3 py-2 whitespace-nowrap">Received</td>
									<td class="px-3 py-2">{row.detail}</td>
									<td class="px-3 py-2 whitespace-nowrap">{row.date}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Forms -->
				<div class="border border-[#d6d6ce] bg-[#f4f4f2] pt-8 px-6 pb-6 relative">
					<h3
						class="absolute -top-4 left-0 text-white text-[15px] font-semibold px-4 py-1"
						style="background-color: {UCHICAGO_TEAL};"
					>
						Forms
					</h3>
					<table class="w-full text-[14px] text-left bg-white border border-gray-200">
						<tbody>
							{#each forms as row}
								<tr class="border-b border-gray-100 align-top">
									<td class="px-3 py-2 w-6">
										{#if row.received}
											<span class="text-green-700 font-bold">&#10003;</span>
										{/if}
									</td>
									<td class="px-3 py-2 whitespace-nowrap">
										{#if row.received}
											{row.date}
										{:else}
											<span class="text-gray-500">Optional</span>
										{/if}
									</td>
									<td class="px-3 py-2">
										{#if row.received}
											{row.detail}
											<a href="/disclaimer" class="ml-3 underline" style="color: {UCHICAGO_TEAL};">Display</a>
										{:else}
											<a href="/disclaimer" class="underline" style="color: {UCHICAGO_TEAL};">{row.detail}</a>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Upload Materials -->
				<div class="border border-[#d6d6ce] bg-[#f4f4f2] pt-8 px-6 pb-6 relative">
					<h3
						class="absolute -top-4 left-0 text-white text-[15px] font-semibold px-4 py-1"
						style="background-color: {UCHICAGO_TEAL};"
					>
						Upload Materials
					</h3>
					<p class="text-[14px] leading-relaxed text-gray-800">
						If you need to upload documents to complete your admissions or financial aid application,
						please do so here. <strong>Video profiles, arts supplements, or other supplementary
						materials can be uploaded in the "Portfolio" section below.</strong>
					</p>
					<p class="text-[14px] mt-3 text-gray-800">We have received the following documents from you:</p>
					<ul class="list-disc ml-8 mt-2 text-[14px] text-gray-800 space-y-1">
						<li>02/10/2026 10:40 PM - Financial Aid - Parents' 2024 Federal Income Tax Return</li>
						<li>02/10/2026 10:41 PM - Financial Aid - W2 Form From Parent - 2024</li>
						<li>01/06/2026 04:26 PM - Application Fee Waiver</li>
					</ul>
				</div>
			</div>

			<!-- Sidebar -->
			<aside class="w-full md:w-64 flex-shrink-0 space-y-6">
				<div>
					<div class="text-white text-[16px] px-3 py-1.5" style="background-color: {UCHICAGO_TEAL};">
						Name Details
					</div>
					<div class="border border-[#d6d6ce] border-t-0 bg-[#f4f4f2] p-3 text-[14px] text-gray-800">
						<p><strong>Legal Name:</strong><br />{applicantName()}</p>
						<p class="mt-3"><strong>Preferred Name:</strong><br />{applicantName()}</p>
						<p class="mt-3"><strong>Reference Number:</strong><br />{school.referenceNumber}</p>
						<p class="mt-3"><strong>Round:</strong><br />{school.round}</p>
					</div>
				</div>
				<div>
					<div class="text-white text-[16px] px-3 py-1.5" style="background-color: {UCHICAGO_TEAL};">
						Social Media
					</div>
					<div class="border border-[#d6d6ce] border-t-0 bg-[#f4f4f2] p-3 text-[14px] space-y-2">
						<a href="/disclaimer" class="block underline" style="color: {UCHICAGO_TEAL};">Find Us on Facebook</a>
						<a href="/disclaimer" class="block underline" style="color: {UCHICAGO_TEAL};">Follow Us on Twitter</a>
					</div>
				</div>
			</aside>
		</div>

		<!-- Footer -->
		<footer class="border-t border-gray-300 bg-[#f4f4f2] text-gray-700 text-[13px] mt-8">
			<div class="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
				<div>
					<div class="text-lg font-bold" style="color: {UCHICAGO_MAROON};">The University of Chicago</div>
					<p class="mt-2">&copy; 2026 The University of Chicago</p>
				</div>
				<div>
					<span class="font-semibold" style="color: {UCHICAGO_MAROON};">College Admissions</span>
					<p class="mt-2">1101 E. 58th Street</p>
					<p>Rosenwald Hall 105</p>
					<p>Chicago, Illinois 60637</p>
					<p>Phone: 773.702.8650</p>
				</div>
				<div class="space-y-1">
					<a href="/disclaimer" class="block hover:underline">Apply Online</a>
					<a href="/disclaimer" class="block hover:underline">Request Information</a>
					<a href="/disclaimer" class="block hover:underline">Privacy Information</a>
					<a href="/disclaimer" class="block hover:underline">Accessibility</a>
					<a href="/disclaimer" class="block hover:underline">Non-Discrimination</a>
				</div>
			</div>
			<div class="border-t border-gray-300 py-3 text-center text-[11px] text-gray-500">
				PredictAdmit Simulation &mdash; Not affiliated with The University of Chicago
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<UChicagoAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<UChicagoDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
