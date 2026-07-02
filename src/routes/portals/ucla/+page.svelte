<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import UCLAAccepted from '$lib/components/ucla/UCLAAccepted.svelte';
	import UCLADenied from '$lib/components/ucla/UCLADenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'ucla';
	const school = {
		schoolName: 'University of California, Los Angeles',
		primaryColor: '#2774AE',
		accentColor: '#FFD100',
		footerDomain: 'ucla.edu',
		statusLastPosted: 'March 20, 2026',
		round: 'Fall 2026 First-Year',
		referenceNumber: '20260012'
	};

	// --- State Variables ---
	let profile: UserProfile = { ...defaultProfile };
	let lastNameInput = '';
	let applicationIdInput = '';
	let dobInput = '';
	let cityOfBirthInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;

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
		if (lastNameInput.trim() && applicationIdInput.trim() && dobInput.trim() && cityOfBirthInput.trim()) {
			authenticated = true;
			error = '';
		} else {
			error = 'Please complete all fields to check your application status.';
			authenticated = false;
		}
	};

	const handleViewUpdate = () => {
		hasViewedUpdate = true;
		portalDecisionViewed.set(true);
	};
</script>

<svelte:head>
	<title>My Application Status | UCLA Undergraduate Admission</title>
</svelte:head>

<div class="min-h-screen bg-white font-sans text-gray-900">
	{#if !authenticated}
		<!-- ============================ LOGIN ============================ -->
		<!-- Top blue utility bar -->
		<div class="w-full" style="background-color: {school.primaryColor};">
			<div class="mx-auto max-w-6xl px-6 py-2">
				<a href="/disclaimer" class="text-lg font-extrabold italic tracking-tight text-white">UCLA</a>
			</div>
		</div>

		<!-- White masthead -->
		<header class="border-b border-gray-200 bg-white">
			<div class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
				<div class="flex items-end gap-3">
					<span class="text-3xl font-extrabold italic tracking-tight" style="color: {school.primaryColor};">UCLA</span>
					<span class="pb-1 text-xl font-bold leading-tight text-gray-900">Undergraduate<br />Admission</span>
				</div>
				<div class="flex items-center gap-4">
					<a href="/disclaimer" class="text-sm font-semibold" style="color: {school.primaryColor};">Applicant Login</a>
					<a href="/disclaimer" class="px-4 py-2 text-sm font-semibold text-white" style="background-color: {school.primaryColor};">Request Information</a>
				</div>
			</div>
			<div class="mx-auto max-w-6xl px-6">
				<nav class="flex flex-wrap items-center justify-end gap-6 border-t border-gray-100 py-3 text-sm font-semibold" style="color: {school.primaryColor};">
					{#each ['Apply', 'Explore', 'Visit', 'Tuition & Aid', 'Admitted Students', 'Contact'] as item}
						<a href="/disclaimer" class="hover:underline">{item}</a>
					{/each}
					<a href="/disclaimer" aria-label="Search" class="hover:underline">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
					</a>
				</nav>
			</div>
		</header>

		<main class="mx-auto min-h-[520px] max-w-6xl px-6 py-10">
			<div class="text-sm font-semibold" style="color: {school.primaryColor};">Home</div>
			<h1 class="mt-2 text-4xl font-bold text-gray-900">My Application Status</h1>
			<p class="mt-2 text-[15px] text-gray-700">
				Applicants for 2026 may check their application status by logging in below.
			</p>

			<div class="mt-8 max-w-xl">
				<fieldset class="border border-gray-300 px-6 py-6">
					<legend class="px-2 text-sm text-gray-600">Login</legend>

					{#if error}
						<p class="mb-5 border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800" role="alert">
							{error}
						</p>
					{/if}

					<form class="space-y-5" on:submit={handleLogin}>
						<div>
							<label for="last-name" class="mb-1 block text-sm text-gray-700">Last Name:</label>
							<input
								id="last-name"
								type="text"
								class="w-full border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:border-[#2774AE] focus:outline-none"
								bind:value={lastNameInput}
							/>
						</div>

						<div>
							<label for="app-id" class="mb-1 block text-sm text-gray-700">
								Application ID:
								<a href="/disclaimer" class="ml-1 text-sm underline" style="color: {school.primaryColor};">What is this?</a>
							</label>
							<input
								id="app-id"
								type="text"
								class="w-full border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:border-[#2774AE] focus:outline-none"
								bind:value={applicationIdInput}
							/>
						</div>

						<div>
							<label for="dob" class="mb-1 block text-sm text-gray-700">Date of Birth:</label>
							<input
								id="dob"
								type="text"
								placeholder="MM-DD-YYYY"
								class="w-full border border-gray-300 bg-gray-100 px-3 py-2 text-sm placeholder-gray-400 focus:border-[#2774AE] focus:outline-none"
								bind:value={dobInput}
							/>
						</div>

						<div>
							<label for="city-birth" class="mb-1 block text-sm text-gray-700">City of Birth:</label>
							<input
								id="city-birth"
								type="text"
								class="w-full border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:border-[#2774AE] focus:outline-none"
								bind:value={cityOfBirthInput}
							/>
						</div>

						<div class="flex flex-wrap items-center gap-4 pt-1">
							<button
								type="submit"
								class="px-6 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
								style="background-color: {school.primaryColor};"
							>
								Login
							</button>
							<button
								type="button"
								on:click={handleLoadSavedLogin}
								class="border border-gray-400 bg-gray-100 px-3 py-2 text-xs text-gray-700 hover:bg-gray-200"
							>
								Load saved PredictAdmit login
							</button>
							<a href="/disclaimer" class="text-xs underline" style="color: {school.primaryColor};">Forgot password?</a>
						</div>
					</form>
				</fieldset>

				<p class="mt-3 text-xs leading-relaxed text-gray-600">
					Pursuant to <a href="/disclaimer" class="underline" style="color: {school.primaryColor};">Section 502</a>
					of the <a href="/disclaimer" class="underline" style="color: {school.primaryColor};">California Penal Code</a>,
					unauthorized access to applicant information will be prosecuted to the full extent of the law.
				</p>
				<p class="mt-3 max-w-xl text-[11px] leading-relaxed text-gray-500">
					For this simulation, simply fill in any values for the fields above, or load your saved
					PredictAdmit login. No real application data is used, and all information is stored only in
					your browser.
				</p>
			</div>
		</main>

		<!-- Learn more band -->
		<section class="w-full" style="background-color: #005587;">
			<div class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 text-white md:flex-row md:items-center md:justify-between">
				<p class="text-sm">
					<span class="font-bold">LEARN MORE ABOUT UCLA</span>
					<span class="ml-2 text-gray-100">Hear more about events in your area, application deadlines and more.</span>
				</p>
				<a href="/disclaimer" class="whitespace-nowrap px-4 py-2 text-sm font-bold text-gray-900" style="background-color: {school.accentColor};">
					Request Information
				</a>
			</div>
		</section>

		<!-- Footer -->
		<footer class="w-full text-white" style="background-color: #003B5C;">
			<div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-8 md:grid-cols-3">
				<div>
					<div class="flex items-end gap-2">
						<span class="text-2xl font-extrabold italic tracking-tight text-white">UCLA</span>
						<span class="pb-0.5 text-sm font-semibold leading-tight">Undergraduate<br />Admission</span>
					</div>
					<p class="mt-4 text-xs leading-relaxed text-gray-200">
						1147 Murphy Hall, Box 951436<br />Los Angeles, CA 90095-1436
					</p>
					<div class="mt-4 flex gap-3 text-white">
						<a href="/disclaimer" aria-label="Instagram"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2z"/></svg></a>
						<a href="/disclaimer" aria-label="Facebook"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.8v8h3.1z"/></svg></a>
					</div>
				</div>
				<div class="text-sm">
					<ul class="space-y-2 text-gray-200">
						<li><a href="/disclaimer" class="hover:underline">Maps &amp; Parking</a></li>
						<li><a href="/disclaimer" class="hover:underline">Campus Tours</a></li>
						<li><a href="/disclaimer" class="hover:underline">Admission Events</a></li>
						<li><a href="/disclaimer" class="hover:underline">Virtual Tour</a></li>
					</ul>
				</div>
				<div class="text-sm">
					<ul class="space-y-2 text-gray-200">
						<li><a href="/disclaimer" class="hover:underline">Publications</a></li>
						<li><a href="/disclaimer" class="hover:underline">Contact Us</a></li>
					</ul>
				</div>
			</div>
			<div class="border-t border-white/20">
				<div class="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 text-xs text-gray-200 md:flex-row md:items-center md:justify-between">
					<div>&copy; 2026 Regents of the University of California</div>
					<nav class="flex flex-wrap gap-5">
						<a href="/disclaimer" class="hover:underline">Emergency</a>
						<a href="/disclaimer" class="hover:underline">Security &amp; Fire Safety</a>
						<a href="/disclaimer" class="hover:underline">Accessibility</a>
						<a href="/disclaimer" class="hover:underline">Privacy &amp; Terms of Use</a>
					</nav>
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============================ PORTAL ============================ -->
		<!-- Top blue utility bar -->
		<div class="w-full" style="background-color: {school.primaryColor};">
			<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
				<span class="text-lg font-extrabold italic tracking-tight text-white">UCLA</span>
				<span class="text-xs text-white/90">UCLA Office of Undergraduate Admission</span>
			</div>
		</div>

		<header class="border-b border-gray-200 bg-white">
			<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<div class="flex items-end gap-3">
					<span class="text-3xl font-extrabold italic tracking-tight" style="color: {school.primaryColor};">UCLA</span>
					<span class="pb-1 text-xl font-bold leading-tight text-gray-900">Undergraduate<br />Admission</span>
				</div>
				<a href="/disclaimer" class="text-sm font-semibold" style="color: {school.primaryColor};">Log off</a>
			</div>
		</header>

		<main class="mx-auto max-w-6xl px-6 pb-16">
			<div class="flex flex-wrap items-start justify-between gap-4 pt-8 pb-4">
				<h1 class="text-3xl font-bold text-gray-900">My Application Status</h1>
				<div class="text-right text-[13px] text-gray-700">
					<div class="flex flex-wrap justify-end gap-x-6 gap-y-1">
						<span><strong>Applicant:</strong> {applicantName()}</span>
						<span><strong>Term:</strong> {school.round}</span>
						<span><strong>UCLA ID:</strong> {school.referenceNumber}</span>
					</div>
				</div>
			</div>

			<div class="border-t-4" style="border-color: {school.primaryColor};"></div>

			<div class="mt-6 border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-4 flex items-center gap-3">
					<span class="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-white" style="background-color: {school.primaryColor};">!</span>
					<h2 class="text-xl font-semibold text-gray-900">Status Update</h2>
				</div>
				<p class="text-[15px] leading-relaxed text-gray-700">
					A decision on your application for {school.round} admission has been posted to your
					applicant record. An update to your application was last posted {school.statusLastPosted}.
				</p>
				<button
					on:click={handleViewUpdate}
					class="mt-5 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
					style="background-color: {school.primaryColor};"
				>
					View Decision Letter &gt;&gt;
				</button>
			</div>

			<div class="mt-8">
				<h3 class="mb-3 text-lg font-semibold text-gray-800">Application Checklist</h3>
				<div class="overflow-x-auto border border-gray-200">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b border-gray-200 bg-gray-50 text-left text-gray-700">
								<th class="px-4 py-2 font-semibold">Requirement</th>
								<th class="px-4 py-2 font-semibold">Status</th>
								<th class="px-4 py-2 font-semibold">Date</th>
							</tr>
						</thead>
						<tbody class="text-gray-700">
							<tr class="border-b border-gray-100">
								<td class="px-4 py-3">UC Application</td>
								<td class="px-4 py-3 font-medium text-green-600">Received</td>
								<td class="px-4 py-3 text-gray-500">11/30/2025</td>
							</tr>
							<tr class="border-b border-gray-100">
								<td class="px-4 py-3">Application Fee</td>
								<td class="px-4 py-3 font-medium text-green-600">Paid</td>
								<td class="px-4 py-3 text-gray-500">11/30/2025</td>
							</tr>
							<tr>
								<td class="px-4 py-3">Admission Decision</td>
								<td class="px-4 py-3 font-medium" style="color: {school.primaryColor};">Available</td>
								<td class="px-4 py-3 text-gray-500">{school.statusLastPosted}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</main>

		<!-- Footer -->
		<footer class="w-full text-white" style="background-color: #003B5C;">
			<div class="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-gray-200 md:flex-row md:items-center md:justify-between">
				<div class="flex items-end gap-2">
					<span class="text-2xl font-extrabold italic tracking-tight text-white">UCLA</span>
					<span class="pb-0.5 text-sm font-semibold leading-tight">Undergraduate Admission</span>
				</div>
				<div>&copy; 2026 Regents of the University of California</div>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<UCLAAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<UCLADenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
