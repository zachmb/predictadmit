<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import MichiganAccepted from '$lib/components/umich/MichiganAccepted.svelte';
	import MichiganDenied from '$lib/components/umich/MichiganDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'umich';
	const MICHIGAN_BLUE = '#00274C';
	const MICHIGAN_MAIZE = '#FFCB05';
	const PORTAL_DARK = '#192734';

	const school = {
		schoolName: 'University of Michigan',
		primaryColor: MICHIGAN_BLUE,
		footerDomain: 'umich.edu',
		statusLastPosted: 'March 28, 2026',
		round: 'Regular Decision',
		referenceNumber: '37026459'
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

	const statusLinkLabel = 'Decision Letter Viewer';

	// --- Handlers ---
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
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen font-sans bg-white text-gray-900">
	{#if !authenticated}
		<!-- Utility bar -->
		<div style="background-color: {MICHIGAN_BLUE};" class="text-white">
			<div class="max-w-6xl mx-auto px-4 flex justify-end">
				<nav class="flex items-center text-[11px] font-semibold uppercase tracking-wider">
					<a href="/disclaimer" class="py-3 px-3 hover:text-[#FFCB05]">Get help</a>
					<a href="/disclaimer" class="py-3 px-3 hover:text-[#FFCB05]">Request Information</a>
					<a href="/disclaimer" class="py-3 px-3 hover:text-[#FFCB05]">Enrollment Connect Login</a>
				</nav>
			</div>
		</div>

		<!-- Header -->
		<header class="bg-white border-b border-gray-200 sticky top-0 z-30">
			<div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
				<a href="/disclaimer" class="flex items-center gap-3">
					<span
						class="flex items-center justify-center w-9 h-9 font-black text-lg"
						style="background-color: {MICHIGAN_BLUE}; color: {MICHIGAN_MAIZE};"
					>
						M
					</span>
					<span class="text-lg font-bold tracking-tight" style="color: {MICHIGAN_BLUE};">
						UNIVERSITY OF MICHIGAN
					</span>
				</a>
				<nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-800">
					<a href="/disclaimer" class="hover:text-[#00274C]">Academics &amp; Majors</a>
					<a href="/disclaimer" class="hover:text-[#00274C]">Apply</a>
					<a href="/disclaimer" class="hover:text-[#00274C]">Costs &amp; Aid</a>
					<a href="/disclaimer" class="hover:text-[#00274C]">Explore &amp; Visit</a>
				</nav>
			</div>
		</header>

		<main class="bg-white min-h-[500px] py-16">
			<div class="max-w-2xl mx-auto px-6">
				<h1 class="text-3xl font-normal mb-6 text-gray-900">Login</h1>

				<div
					class="border border-green-700 bg-[#E6F4EA] px-4 py-3 mb-8 text-[14px] text-gray-900"
				>
					To log in, please enter your email address and password.
				</div>

				<form class="space-y-5 max-w-[520px]" on:submit={handleLogin}>
					{#if error}
						<p
							class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-3">
						<label for="portal-email" class="text-[14px] font-semibold text-gray-900 w-36 text-right">
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="border border-gray-400 bg-white px-2 py-1.5 text-[14px] w-56"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-3">
						<label
							for="portal-password"
							class="text-[14px] font-semibold text-gray-900 w-36 text-right"
						>
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="border border-gray-400 bg-white px-2 py-1.5 text-[14px] w-56"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a href="/disclaimer" class="text-[13px] text-blue-800 hover:underline ml-2 whitespace-nowrap">
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-3 pt-2">
						<div class="w-36"></div>
						<button
							type="submit"
							class="px-6 py-2 text-[14px] font-bold text-white"
							style="background-color: {MICHIGAN_BLUE};"
						>
							Login
						</button>
						<button
							type="button"
							class="px-3 py-2 text-[12px] font-semibold border border-gray-400 bg-gray-100 text-gray-700 hover:bg-gray-200"
							on:click={handleLoadSavedLogin}
						>
							Load saved PredictAdmit login
						</button>
					</div>

					<p class="pt-6 text-[12px] leading-relaxed text-gray-600 max-w-md">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<!-- Footer -->
		<footer class="border-t-8 mt-10" style="border-color: {MICHIGAN_MAIZE};">
			<div class="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-8">
				<div class="text-[11px] uppercase tracking-widest text-gray-600 leading-relaxed">
					<div class="text-sm font-semibold tracking-wider text-gray-800">
						Office of Undergraduate Admissions
					</div>
					<div class="w-8 h-1 my-2" style="background-color: {MICHIGAN_MAIZE};"></div>
					1220 Student Activities Building<br />
					515 E. Jefferson St.<br />
					Ann Arbor, MI 48109-1316<br />
					<span class="tracking-wider">734-764-7433</span>
				</div>
				<div class="text-[11px] text-gray-600">
					<div class="text-sm font-semibold tracking-wider text-gray-800">Menu</div>
					<div class="w-8 h-1 my-2" style="background-color: {MICHIGAN_MAIZE};"></div>
					<ul class="space-y-1 uppercase tracking-widest">
						<li><a href="/disclaimer" class="hover:text-[#9A3324]">Contact Us</a></li>
						<li><a href="/disclaimer" class="hover:text-[#9A3324]">Academics &amp; Majors</a></li>
						<li><a href="/disclaimer" class="hover:text-[#9A3324]">Apply</a></li>
						<li><a href="/disclaimer" class="hover:text-[#9A3324]">Costs &amp; Aid</a></li>
					</ul>
				</div>
			</div>
			<div class="max-w-6xl mx-auto px-6 pb-8 flex flex-col md:flex-row justify-between text-[13px] text-gray-500">
				<span>&copy; 2026 The Regents of the University of Michigan</span>
				<span>PredictAdmit Simulation — Not affiliated with the University of Michigan</span>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- Enrollment Connect portal (dark theme) -->
		<div style="background-color: {PORTAL_DARK};" class="min-h-screen py-6">
			<div class="max-w-5xl mx-auto px-4">
				<!-- Portal header -->
				<div class="flex items-center justify-between py-2">
					<div class="flex items-center gap-3">
						<span
							class="flex items-center justify-center w-11 h-11 font-black text-2xl"
							style="background-color: {MICHIGAN_BLUE}; color: {MICHIGAN_MAIZE};"
						>
							M
						</span>
					</div>
					<div class="text-center text-white">
						<div class="text-xl font-bold">Fall 2026 First-Year Application</div>
						<div class="text-sm text-gray-300">College of Engineering</div>
					</div>
					<a
						href="/disclaimer"
						class="px-4 py-2 text-sm font-bold rounded"
						style="background-color: {MICHIGAN_MAIZE}; color: #343A40;"
					>
						Logout
					</a>
				</div>

				<!-- Applicant detail bar -->
				<nav class="my-4 bg-gray-900 text-white px-4 py-3 flex justify-between text-sm">
					<span>{applicantName()} (UMID {school.referenceNumber})</span>
					<span>Engineering: First Year</span>
				</nav>

				<!-- Action cards -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<!-- Action Items -->
					<div class="bg-gray-800 border border-gray-700 flex flex-col">
						<div
							class="px-4 py-5 text-white text-lg font-bold border-b-4"
							style="background-color: {MICHIGAN_BLUE}; border-color: {MICHIGAN_MAIZE};"
						>
							Action Items
						</div>
						<div class="p-4 space-y-3">
							<a
								href="/disclaimer"
								class="block text-center px-3 py-2 text-sm font-bold rounded"
								style="background-color: {MICHIGAN_MAIZE}; color: #343A40;"
							>
								Pay Enrollment Deposit (EDR) by 05/01/2026
							</a>
							<a
								href="/disclaimer"
								class="block text-center px-3 py-2 text-sm font-bold rounded"
								style="background-color: {MICHIGAN_MAIZE}; color: #343A40;"
							>
								Register for Campus Day
							</a>
						</div>
					</div>

					<!-- Messages -->
					<div class="bg-gray-800 border border-gray-700 flex flex-col">
						<div
							class="px-4 py-5 text-white text-lg font-bold border-b-4"
							style="background-color: {MICHIGAN_BLUE}; border-color: {MICHIGAN_MAIZE};"
						>
							Messages
						</div>
						<div class="p-4 space-y-3">
							<div
								class="px-3 py-2 text-sm font-bold rounded text-center"
								style="background-color: {MICHIGAN_MAIZE}; color: #343A40;"
							>
								Application Fee Waiver Consideration
							</div>
							<p class="text-xs text-gray-300 leading-relaxed">
								We are pleased to inform you that we were able to waive your application fee based on
								the information provided on your application.
							</p>
						</div>
					</div>

					<!-- Application -->
					<div class="bg-gray-800 border border-gray-700 flex flex-col">
						<div
							class="px-4 py-5 text-white text-lg font-bold border-b-4"
							style="background-color: {MICHIGAN_BLUE}; border-color: {MICHIGAN_MAIZE};"
						>
							Application
						</div>
						<div class="p-4 space-y-3">
							<div class="bg-gray-900 border border-gray-700 rounded p-3">
								<div class="text-[11px] uppercase tracking-wider text-gray-400 mb-1">
									Your Application Status
								</div>
								<div class="text-sm font-semibold" style="color: {MICHIGAN_MAIZE};">
									Admitted, Awaiting Response to Offer
								</div>
							</div>
							<button
								on:click={handleViewUpdate}
								class="w-full px-3 py-2 text-sm font-bold rounded"
								style="background-color: {MICHIGAN_MAIZE}; color: #343A40;"
							>
								{statusLinkLabel}
							</button>
							<a
								href="/disclaimer"
								class="block text-center px-3 py-2 text-sm font-bold rounded"
								style="background-color: {MICHIGAN_MAIZE}; color: #343A40;"
							>
								Important Dates
							</a>
							<a
								href="/disclaimer"
								class="block text-center px-3 py-2 text-sm font-bold rounded"
								style="background-color: {MICHIGAN_MAIZE}; color: #343A40;"
							>
								Financial Aid
							</a>
							<a
								href="/disclaimer"
								class="block text-center px-3 py-2 text-sm font-bold rounded"
								style="background-color: {MICHIGAN_MAIZE}; color: #343A40;"
							>
								Verify Application Answers
							</a>
						</div>
					</div>
				</div>

				<!-- Status note -->
				<div
					class="mt-6 p-4 border-l-4 bg-gray-800 text-gray-200 text-sm"
					style="border-color: {MICHIGAN_MAIZE};"
				>
					An update to your application was last posted <strong>{school.statusLastPosted}</strong>.
					Select <strong>{statusLinkLabel}</strong> above to view your decision.
				</div>

				<!-- Newly admitted resources -->
				<div class="mt-4 bg-gray-900 text-white">
					<div class="px-4 py-3 font-bold flex items-center justify-between">
						<span>Resources for Newly-Admitted Students</span>
						<span style="color: {MICHIGAN_MAIZE};">&raquo;</span>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 text-center text-sm">
						<a href="/disclaimer" class="bg-gray-800 hover:bg-gray-700 py-4 rounded">Get Connected</a>
						<a href="/disclaimer" class="bg-gray-800 hover:bg-gray-700 py-4 rounded">Resources</a>
						<a href="/disclaimer" class="bg-gray-800 hover:bg-gray-700 py-4 rounded">Next Steps</a>
					</div>
				</div>

				<div class="mt-6 text-center text-[11px] text-gray-500">
					&copy; 2026 The Regents of the University of Michigan &nbsp;•&nbsp; PredictAdmit Simulation —
					Not affiliated with the University of Michigan
				</div>
			</div>
		</div>
	{:else if shownDecision === 'admit'}
		<MichiganAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<MichiganDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
