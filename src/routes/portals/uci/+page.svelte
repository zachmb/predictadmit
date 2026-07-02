<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import UCIAccepted from '$lib/components/uci/UCIAccepted.svelte';
	import UCIDenied from '$lib/components/uci/UCIDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'uci';
	const school = {
		schoolName: 'University of California, Irvine',
		primaryColor: '#0064A4', // UCI blue
		accentColor: '#FFD200', // UCI gold
		footerDomain: 'uci.edu',
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
			error = 'Invalid UCInetID or password.';
			authenticated = false;
		}
	};

	const handleViewUpdate = () => {
		hasViewedUpdate = true;
		portalDecisionViewed.set(true);
	};

	// --- Applicant Information (portal capture) ---
	const applicantInfo = [
		{ label: 'Level', value: 'First Year' },
		{ label: 'Term', value: 'Fall 2026' },
		{ label: 'App ID', value: '4180909' },
		{ label: 'UCI ID', value: '28568655' },
		{ label: 'Major', value: 'Business Administration' },
		{ label: 'Alt Major', value: 'Information and Computer Sciences/Undeclared' }
	];
</script>

<svelte:head>
	<title>{authenticated ? 'Applicant Status Portal' : 'UCInetID Secure Web Login'}</title>
</svelte:head>

<div class="min-h-screen font-sans text-[#212529]">
	{#if !authenticated}
		<!-- ======================= LOGIN (UCInetID Secure Web Login) ======================= -->
		<div class="min-h-screen flex flex-col bg-[#f4f4f4]">
			<!-- Duo warning banner -->
			<header class="pt-4 px-4">
				<div
					class="mx-auto w-fit max-w-full rounded border border-[#ffeeba] bg-[#fff3cd] px-5 py-3 text-center text-sm text-[#332701]"
					role="alert"
				>
					Required:
					<a href="/disclaimer" class="font-bold text-[#332701] underline">Update your Duo app</a>
					by March 31
				</div>
			</header>

			<div class="flex flex-1 flex-col items-center justify-center px-4">
				<!-- UCI wordmark -->
				<a href="/disclaimer" class="block py-8" tabindex="-1" aria-label="UCI University of California, Irvine">
					<div class="flex items-baseline gap-3">
						<span class="text-5xl font-extrabold tracking-tight" style="color: #2b5597;">UCI</span>
						<span class="hidden text-sm font-medium uppercase tracking-wide text-[#2b5597] sm:inline">
							University of California, Irvine
						</span>
					</div>
				</a>

				<!-- Login card -->
				<div
					class="w-full max-w-[500px] rounded-[5px] bg-white shadow-[0_0_14px_6px_rgba(0,0,0,0.12)]"
				>
					<div class="px-6 py-8 sm:px-8">
						<h1 class="pb-3 text-center text-[1.75rem] font-medium">Login with your UCInetID</h1>

						<form class="space-y-1" on:submit={handleLogin}>
							{#if error}
								<p
									class="mb-3 rounded border border-[#f5c6cb] bg-[#f8d7da] px-3 py-2 text-sm text-[#2c0b0e]"
									role="alert"
								>
									{error}
								</p>
							{/if}

							<div class="mb-4">
								<input
									id="j_username"
									type="text"
									class="h-[calc(3em+2px)] w-full rounded-[5px] border border-[#cccccc] bg-white px-4 text-base outline-none focus:border-[#255799]"
									bind:value={emailInput}
									placeholder="UCInetID"
									autocomplete="username"
									aria-label="UCInetID"
								/>
							</div>

							<div class="mb-2">
								<input
									id="j_password"
									type="password"
									class="h-[calc(3em+2px)] w-full rounded-[5px] border border-[#cccccc] bg-white px-4 text-base outline-none focus:border-[#255799]"
									bind:value={passwordInput}
									placeholder="Password"
									autocomplete="current-password"
									aria-label="password"
								/>
								<p class="mb-4 text-[80%]">
									<a href="/disclaimer" class="text-[#255799] hover:underline">Forgot your password?</a>
								</p>
							</div>

							<button
								type="submit"
								class="mb-4 w-full rounded-[0.3rem] py-2 text-[1.25rem] font-medium"
								style="background-color: {school.accentColor}; color: #255799;"
							>
								Login
							</button>

							<button
								type="button"
								class="mb-4 w-full rounded-[0.3rem] border border-[#255799] bg-white py-2 text-sm font-semibold text-[#255799] hover:bg-[#255799] hover:text-white"
								on:click={handleLoadSavedLogin}
							>
								Load saved PredictAdmit login
							</button>

							<div class="text-center text-[80%] leading-6 text-[#255799]">
								<a href="/disclaimer" class="hover:underline">Activate my UCInetID</a>
								<span class="text-[#212529]"> &bull; </span>
								<a href="/disclaimer" class="hover:underline">Need help logging in?</a>
							</div>
							<div class="text-center text-[80%] leading-6">
								<a href="/disclaimer" class="text-[#255799] hover:underline"
									>View recent account activity</a
								>
							</div>
						</form>
					</div>
				</div>

				<footer class="pt-10 text-center text-[80%] text-[#255799]">
					<a href="/disclaimer" class="hover:underline">Privacy Policy</a>
					<span class="text-[#212529]"> &bull; </span>
					<a href="/disclaimer" class="hover:underline">OIT</a>
				</footer>
			</div>
		</div>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ======================= APPLICANT STATUS PORTAL (Slate) ======================= -->
		<div class="min-h-screen bg-white">
			<!-- UCI utility + main nav -->
			<div style="background-color: {school.primaryColor};" class="text-white">
				<div class="max-w-6xl mx-auto flex items-center justify-between px-6 py-2 text-[11px]">
					<div class="space-x-4">
						<a href="/disclaimer" class="hover:underline">Parents</a>
						<a href="/disclaimer" class="hover:underline">Counselors</a>
						<a href="/disclaimer" class="hover:underline">Current Students</a>
					</div>
					<div class="flex items-center gap-4">
						<span class="font-semibold">{applicantName()}</span>
						<a href="/disclaimer" class="hover:underline">Logout</a>
					</div>
				</div>
			</div>

			<header class="border-b border-gray-200 bg-white">
				<div class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
					<div class="flex items-baseline gap-3">
						<span class="text-3xl font-extrabold tracking-tight" style="color: {school.primaryColor};"
							>UCI</span
						>
						<span class="hidden text-xs font-semibold uppercase tracking-wide text-gray-600 sm:inline">
							University of California, Irvine
						</span>
					</div>
					<nav class="hidden space-x-6 text-sm font-semibold text-gray-700 md:flex">
						<a href="/disclaimer" class="hover:text-[#0064A4]">Discover</a>
						<a href="/disclaimer" class="hover:text-[#0064A4]">Study</a>
						<a href="/disclaimer" class="hover:text-[#0064A4]">Afford</a>
						<a href="/disclaimer" class="hover:text-[#0064A4]">Apply</a>
						<a href="/disclaimer" class="hover:text-[#0064A4]">Request Info</a>
					</nav>
				</div>
			</header>

			<!-- Portal tabs -->
			<div class="border-b border-gray-200 bg-[#f4f4f4]">
				<div class="max-w-6xl mx-auto flex px-6">
					{#each ['Applicant Status Portal Home', 'Personal Information', 'Academic History'] as tab, i}
						{@const tabKey = i === 0 ? 'Admissions Status' : tab}
						<button
							on:click={() => (activeTab = tabKey)}
							class="border-b-[3px] px-4 py-3 text-sm font-semibold transition-colors {activeTab ===
							tabKey
								? 'text-[#0064A4]'
								: 'border-transparent text-gray-600'}"
							style={activeTab === tabKey ? `border-color: ${school.primaryColor};` : ''}
						>
							{tab}
						</button>
					{/each}
				</div>
			</div>

			<main class="max-w-6xl mx-auto px-6 py-8">
				<h1 class="mb-6 text-3xl font-light text-gray-800" style="color: {school.primaryColor};">
					Applicant Status Portal
				</h1>

				{#if activeTab === 'Admissions Status'}
					<div class="grid gap-8 md:grid-cols-3">
						<!-- Left: Applicant Information -->
						<div class="md:col-span-1">
							<div class="border border-gray-200 bg-[#f8f8f8]">
								<h2
									class="px-4 py-2 text-sm font-bold uppercase tracking-wide text-white"
									style="background-color: {school.primaryColor};"
								>
									Applicant Information
								</h2>
								<dl class="divide-y divide-gray-200 text-sm">
									<div class="flex justify-between px-4 py-2">
										<dt class="font-semibold text-gray-600">Name</dt>
										<dd class="text-right text-gray-800">{applicantName()}</dd>
									</div>
									{#each applicantInfo as row}
										<div class="flex justify-between gap-3 px-4 py-2">
											<dt class="font-semibold text-gray-600">{row.label}</dt>
											<dd class="text-right text-gray-800">{row.value}</dd>
										</div>
									{/each}
								</dl>
							</div>

							<div class="mt-6 border border-gray-200 bg-white">
								<h2 class="border-b border-gray-200 px-4 py-2 text-sm font-bold text-gray-700">
									Account Tools
								</h2>
								<ul class="p-4 text-sm">
									<li class="mb-2">
										<a href="/disclaimer" class="text-[#255799] hover:underline"
											>Update Personal Information via the UC Application</a
										>
									</li>
									<li>
										<a href="/disclaimer" class="text-[#255799] hover:underline">Logout</a>
									</li>
								</ul>
							</div>
						</div>

						<!-- Right: Status Update -->
						<div class="md:col-span-2">
							<div class="mb-8">
								<h2 class="mb-3 text-xl font-semibold text-gray-800">Status Update</h2>
								<div
									class="border-l-4 bg-[#f4f4f4] p-5"
									style="border-color: {school.accentColor};"
								>
									<p class="mb-4 text-base text-gray-700">
										An update to your application was last posted <strong
											>{school.statusLastPosted}</strong
										>.
									</p>
									<button
										on:click={handleViewUpdate}
										class="rounded px-5 py-2 text-sm font-bold shadow hover:opacity-90"
										style="background-color: {school.accentColor}; color: {school.primaryColor};"
									>
										View Update &gt;&gt;
									</button>
								</div>
							</div>

							<div class="mb-8">
								<h2 class="mb-3 text-xl font-semibold text-gray-800">Application Deadlines</h2>
								<div class="border border-gray-200 bg-white p-5 text-sm text-gray-700">
									Please visit our
									<a href="/disclaimer" class="text-[#255799] hover:underline">website</a> to see important
									dates and deadlines. Your application for the
									<strong>{school.round}</strong> round (Reference #{school.referenceNumber}) has been received
									and is under review by the Office of Undergraduate Admissions.
								</div>
							</div>
						</div>
					</div>
				{:else if activeTab === 'Personal Information'}
					<div class="border border-gray-200 bg-[#f8f8f8] p-6">
						<p class="text-lg font-semibold text-gray-800">Personal Information</p>
						<p class="mt-2 text-sm text-gray-600">
							Review and update your contact details and biographical information via the UC
							Application.
						</p>
					</div>
				{:else if activeTab === 'Academic History'}
					<div class="border border-gray-200 bg-[#f8f8f8] p-6">
						<p class="text-lg font-semibold text-gray-800">Academic History</p>
						<p class="mt-2 text-sm text-gray-600">
							Your reported coursework, grades, and test information will be displayed here.
						</p>
					</div>
				{/if}
			</main>

			<!-- UCI footer -->
			<footer style="background-color: {school.primaryColor};" class="mt-12 text-white">
				<div class="max-w-6xl mx-auto grid gap-8 px-6 py-10 text-sm md:grid-cols-2">
					<div>
						<h3 class="mb-2 font-bold">Contact Us</h3>
						<p class="leading-relaxed text-white/90">
							Office of Undergraduate Admissions<br />
							260 Aldrich Hall<br />
							Irvine, CA 92697-1075<br />
							949-824-6703
						</p>
					</div>
					<div class="md:text-right">
						<div class="space-x-3 text-white/90">
							<a href="/disclaimer" class="hover:underline">UCI.edu</a>
							<a href="/disclaimer" class="hover:underline">Terms of Use</a>
							<a href="/disclaimer" class="hover:underline">Privacy Policy</a>
							<a href="/disclaimer" class="hover:underline">Accessibility</a>
						</div>
						<p class="mt-4 text-xs text-white/70">
							&copy; 2026 The Regents of the University of California
						</p>
						<p class="mt-1 text-xs text-white/70">
							PredictAdmit Simulation &mdash; Not affiliated with UC Irvine
						</p>
					</div>
				</div>
			</footer>
		</div>
	{:else if shownDecision === 'admit'}
		<UCIAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<UCIDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
