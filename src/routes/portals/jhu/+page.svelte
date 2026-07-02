<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import JHUAccepted from '$lib/components/jhu/JHUAccepted.svelte';
	import JHUDenied from '$lib/components/jhu/JHUDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'jhu';

	const school = {
		schoolName: 'Johns Hopkins University',
		primaryColor: '#002D72', // Hopkins Blue
		footerDomain: 'jhu.edu',
		statusLastPosted: 'March 15, 2026',
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
	<title>{school.schoolName} | Undergraduate Admissions</title>
</svelte:head>

<div class="min-h-screen font-sans bg-white text-gray-800">
	{#if !authenticated}
		<!-- ===================== LOGIN PAGE ===================== -->
		<!-- Thin utility bar -->
		<div class="bg-[#e8e8e8] h-8 text-[11px] text-gray-700">
			<div class="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
				<span class="tracking-wide font-semibold">JHU.EDU</span>
				<div class="flex items-stretch h-full">
					<a
						href="/disclaimer"
						class="flex items-center px-3 bg-[#002D72] text-white text-[10px] font-bold tracking-wider uppercase hover:bg-[#00204f]"
					>
						Tours &amp; Events
					</a>
					<a
						href="/disclaimer"
						class="flex items-center px-3 bg-[#0074d9] text-white text-[10px] font-bold tracking-wider uppercase hover:bg-[#005fb0]"
					>
						Connect
					</a>
				</div>
			</div>
		</div>

		<!-- Main brand header -->
		<header class="border-b border-gray-200 bg-white">
			<div class="max-w-6xl mx-auto px-6 py-4 flex items-center">
				<div class="flex items-center gap-3 pr-6">
					<!-- Shield mark -->
					<div
						class="w-9 h-11 flex items-center justify-center text-white text-[10px] font-serif font-bold"
						style="background-color: {school.primaryColor}; clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);"
					>
						JHU
					</div>
					<div class="leading-tight">
						<div class="font-serif text-xl font-bold" style="color: {school.primaryColor};">
							Johns Hopkins
						</div>
						<div class="text-[10px] tracking-[0.35em] text-gray-600 uppercase">University</div>
					</div>
				</div>
				<div class="border-l border-gray-300 pl-6 hidden sm:block">
					<div class="text-[11px] font-bold tracking-wider text-[#0074d9] uppercase leading-tight">
						Undergraduate<br />Admissions
					</div>
				</div>
				<nav class="ml-auto hidden md:flex items-center gap-6 text-[15px] text-gray-700">
					<a href="/disclaimer" class="hover:text-[#002D72]">How to Apply</a>
					<a href="/disclaimer" class="hover:text-[#002D72]">Tuition &amp; Aid</a>
					<a href="/disclaimer" class="hover:text-[#002D72]">Academics</a>
					<a href="/disclaimer" class="hover:text-[#002D72]">Life at Hopkins</a>
				</nav>
			</div>
		</header>

		<main class="bg-white min-h-[440px] py-12">
			<div class="max-w-2xl mx-auto px-6">
				<h1
					class="text-2xl font-bold tracking-wide mb-6 uppercase"
					style="color: {school.primaryColor};"
				>
					Johns Hopkins University
				</h1>

				<div
					class="border-l-4 border-[#5cb8b2] bg-[#e2ddd7] px-4 py-3 mb-8 text-[14px] text-gray-800"
				>
					To log in, please enter your email address and password.
				</div>

				<form class="mb-8" on:submit={handleLogin}>
					{#if error}
						<p
							class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-4"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-3 mb-2">
						<label for="portal-email" class="text-[14px] text-gray-800 w-28">Email Address</label>
						<input
							id="portal-email"
							type="email"
							class="border border-gray-400 bg-white px-2 py-1 text-[14px] w-56"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-start gap-3 mb-6">
						<label for="portal-password" class="text-[14px] text-gray-800 w-28 pt-1">Password</label>
						<div>
							<input
								id="portal-password"
								type="password"
								class="border border-gray-400 bg-white px-2 py-1 text-[14px] w-56 block"
								bind:value={passwordInput}
								autocomplete="current-password"
							/>
							<a href="/disclaimer" class="text-[13px] text-[#0074d9] underline hover:no-underline"
								>Forgot Your Password?</a
							>
						</div>
					</div>

					<div class="flex items-center gap-3 ml-[124px]">
						<button
							type="submit"
							class="border border-[#002D72] bg-white text-[#002D72] px-8 py-2 text-[13px] font-bold tracking-widest uppercase hover:bg-[#002D72] hover:text-white transition-colors"
						>
							Login
						</button>
						<button
							type="button"
							class="border border-gray-400 bg-gray-100 px-3 py-2 text-[11px] text-gray-700 hover:bg-gray-200"
							on:click={handleLoadSavedLogin}
						>
							Load saved PredictAdmit login
						</button>
					</div>
				</form>

				<p class="text-[14px] leading-relaxed text-gray-700 max-w-xl">
					If you have questions or technical issues, email
					<a href="/disclaimer" class="text-[#0074d9] underline hover:no-underline">gotojhu@jhu.edu</a
					>. For technical emergencies or urgent support, text the admissions office at +1
					443-743-3782. We'll respond to all requests during normal business hours, Monday–Friday
					from 9 a.m. to 5 p.m. Eastern.
				</p>

				<p class="pt-8 text-[11px] leading-relaxed text-gray-500 max-w-xl">
					For this simulation, use the same email address and password that you saved on the
					PredictAdmit.com home page. No real application data is used, and all information is stored
					only in your browser.
				</p>
			</div>
		</main>

		<!-- Footer -->
		<footer class="bg-[#31261d] text-gray-300 pt-10 pb-6">
			<div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-[12px]">
				<div>
					<div class="flex items-center gap-3 mb-4">
						<div
							class="w-8 h-10 flex items-center justify-center text-[9px] font-serif font-bold text-[#31261d] bg-white"
							style="clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);"
						>
							JHU
						</div>
						<div class="leading-tight">
							<div class="font-serif text-lg font-bold text-white">Johns Hopkins</div>
							<div class="text-[9px] tracking-[0.3em] text-gray-400 uppercase">University</div>
						</div>
					</div>
					<div class="font-bold text-white mb-3">Undergraduate Admissions</div>
					<div class="flex gap-2">
						<span class="w-7 h-7 rounded-full bg-[#009b8e] inline-block"></span>
						<span class="w-7 h-7 rounded-full bg-[#009b8e] inline-block"></span>
						<span class="w-7 h-7 rounded-full bg-[#009b8e] inline-block"></span>
					</div>
				</div>
				<div>
					<div class="text-[#5cb8b2] font-bold uppercase tracking-wide mb-2">
						Mail Only Correspondence
					</div>
					<div class="leading-relaxed text-gray-400">
						Office of Undergraduate Admissions<br />
						Johns Hopkins University<br />
						3400 N. Charles St., Mason Hall<br />
						Baltimore, MD 21218-2683 USA
					</div>
					<div class="text-[#5cb8b2] font-bold uppercase tracking-wide mt-4 mb-2">
						GPS Address – Do Not Use for Mail
					</div>
					<div class="leading-relaxed text-gray-400">
						3101 Wyman Park Drive<br />
						Baltimore, MD 21218
					</div>
				</div>
				<div class="text-gray-400">
					<div class="flex flex-col gap-2 mb-6">
						<a href="/disclaimer" class="hover:text-white">Our Story</a>
						<a href="/disclaimer" class="hover:text-white">Alumni Volunteers</a>
						<a href="/disclaimer" class="hover:text-white">Administrative Offices</a>
						<a href="/disclaimer" class="hover:text-white">Clery Notice of Availability</a>
						<a href="/disclaimer" class="hover:text-white">Report Issue</a>
						<a href="/disclaimer" class="hover:text-white">Emergency Info</a>
					</div>
				</div>
			</div>
			<div class="max-w-6xl mx-auto px-6 mt-8 pt-4 border-t border-gray-700 text-[11px] text-gray-500">
				&copy; 2014–2026 Johns Hopkins University. All rights reserved.
				<a href="/disclaimer" class="underline ml-1 hover:text-white">Policies</a>
				<span class="ml-2"
					>· PredictAdmit Simulation — Not affiliated with Johns Hopkins University</span
				>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ===================== PORTAL PAGE ===================== -->
		<!-- Top utility bar -->
		<div class="bg-[#1a1a1a] h-11 text-white">
			<div class="max-w-6xl mx-auto px-6 h-full flex items-center justify-end gap-4">
				<span class="text-[13px]">Hi, {applicantName()}</span>
				<a
					href="/disclaimer"
					class="bg-[#0074d9] hover:bg-[#005fb0] text-white text-[12px] font-bold tracking-wider uppercase px-4 py-1.5"
				>
					Logout
				</a>
			</div>
		</div>

		<!-- Brand header -->
		<header class="border-b border-gray-200 bg-white">
			<div class="max-w-6xl mx-auto px-6 py-5 flex items-center">
				<div class="flex items-center gap-3 pr-6">
					<div
						class="w-9 h-11 flex items-center justify-center text-white text-[10px] font-serif font-bold"
						style="background-color: {school.primaryColor}; clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);"
					>
						JHU
					</div>
					<div class="leading-tight">
						<div class="font-serif text-xl font-bold" style="color: {school.primaryColor};">
							Johns Hopkins
						</div>
						<div class="text-[10px] tracking-[0.35em] text-gray-600 uppercase">University</div>
					</div>
				</div>
				<div class="border-l border-gray-300 pl-6 hidden sm:block">
					<div class="text-[11px] font-bold tracking-wider text-[#0074d9] uppercase leading-tight">
						Undergraduate<br />Admissions Applicant<br />Portal
					</div>
				</div>
				<nav class="ml-auto flex items-center text-[15px]">
					<button
						on:click={() => (activeTab = 'Admissions Status')}
						class="text-[#0074d9] border-b-2 border-[#0074d9] pb-0.5"
					>
						My Application
					</button>
				</nav>
			</div>
		</header>

		<!-- Content -->
		<div class="bg-[#e9e9e9] min-h-[360px] py-10">
			<div class="max-w-6xl mx-auto px-6">
				<div class="bg-[#f3f3f3] border border-gray-200 p-8 max-w-md">
					<button
						on:click={handleViewUpdate}
						class="text-2xl font-bold underline decoration-2 underline-offset-4 hover:no-underline block mb-4 text-left"
						style="color: {school.primaryColor};"
					>
						Decision Letter
					</button>
					<p class="text-[14px] text-gray-700">
						<span class="font-bold" style="color: {school.primaryColor};">READ</span>, Received
						3/18/2026
					</p>
					<p class="mt-4 text-[12px] text-gray-500">
						An update to your application was last posted {school.statusLastPosted}.
					</p>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<footer class="bg-[#31261d] text-gray-300 pt-10 pb-6">
			<div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-[12px]">
				<div>
					<div class="flex items-center gap-3 mb-4">
						<div
							class="w-8 h-10 flex items-center justify-center text-[9px] font-serif font-bold text-[#31261d] bg-white"
							style="clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);"
						>
							JHU
						</div>
						<div class="leading-tight">
							<div class="font-serif text-lg font-bold text-white">Johns Hopkins</div>
							<div class="text-[9px] tracking-[0.3em] text-gray-400 uppercase">University</div>
						</div>
					</div>
					<div class="font-bold text-white mb-1">Undergraduate Admissions</div>
					<div class="font-bold text-white mb-3">Applicant Portal</div>
					<div class="flex flex-col gap-1 text-[#c99a4e]">
						<a href="/disclaimer" class="uppercase font-bold hover:text-white">Logout</a>
						<a href="/disclaimer" class="uppercase font-bold hover:text-white"
							>Change Email Address</a
						>
						<a href="/disclaimer" class="uppercase font-bold hover:text-white">Change Password</a>
					</div>
					<div class="flex gap-2 mt-4">
						<span class="w-7 h-7 rounded-full bg-[#009b8e] inline-block"></span>
						<span class="w-7 h-7 rounded-full bg-[#009b8e] inline-block"></span>
						<span class="w-7 h-7 rounded-full bg-[#009b8e] inline-block"></span>
					</div>
				</div>
				<div>
					<div class="text-[#5cb8b2] font-bold uppercase tracking-wide mb-2">
						Mail Only Correspondence
					</div>
					<div class="leading-relaxed text-gray-400">
						Office of Undergraduate Admissions<br />
						Johns Hopkins University<br />
						3400 N. Charles St., Mason Hall<br />
						Baltimore, MD 21218-2683 USA
					</div>
					<div class="text-[#5cb8b2] font-bold uppercase tracking-wide mt-4 mb-2">
						GPS Address – Do Not Use for Mail
					</div>
					<div class="leading-relaxed text-gray-400">
						3101 Wyman Park Drive<br />
						Baltimore, MD 21218
					</div>
				</div>
				<div class="text-gray-400">
					<div class="flex flex-col gap-2 mb-6">
						<a href="/disclaimer" class="hover:text-white">Our Story</a>
						<a href="/disclaimer" class="hover:text-white">Alumni Volunteers</a>
						<a href="/disclaimer" class="hover:text-white">Administrative Offices</a>
						<a href="/disclaimer" class="hover:text-white">Clery Notice of Availability</a>
						<a href="/disclaimer" class="hover:text-white">Report Issue</a>
						<a href="/disclaimer" class="hover:text-white">Emergency Info</a>
					</div>
				</div>
			</div>
			<div class="max-w-6xl mx-auto px-6 mt-8 pt-4 border-t border-gray-700 text-[11px] text-gray-500">
				&copy; 2014–2026 Johns Hopkins University. All rights reserved.
				<a href="/disclaimer" class="underline ml-1 hover:text-white">Policies</a>
				<span class="ml-2"
					>· PredictAdmit Simulation — Not affiliated with Johns Hopkins University</span
				>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<JHUAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<JHUDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
