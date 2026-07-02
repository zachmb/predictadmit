<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import YaleAccepted from '$lib/components/yale/YaleAccepted.svelte';
	import YaleDenied from '$lib/components/yale/YaleDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'yale';
	const school = {
		schoolName: 'Yale College',
		primaryColor: '#00356B',
		footerDomain: 'yale.edu',
		statusLastPosted: 'March 15, 2026',
		round: 'Regular Decision',
		referenceNumber: '003602518'
	};

	// --- State Variables ---
	let profile: UserProfile = { ...defaultProfile };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;
	let activeTab = 'Admissions Checklist';

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

	// --- Checklist Data ---
	const supplementRow = {
		status: 'RECEIVED',
		form: 'Coalition Application Supplement 2025-2026',
		date: '1/2/2026'
	};

	const materialRows = [
		{ status: 'RECEIVED', detail: 'Application', date: '1/3/2026' },
		{ status: 'RECEIVED', detail: 'Application Fee or Waiver', date: '1/3/2026' },
		{ status: 'RECEIVED', detail: 'Teacher Recommendation 1', date: '1/16/2026' },
		{ status: 'RECEIVED', detail: 'Teacher Recommendation 2', date: '1/17/2026' },
		{ status: 'RECEIVED', detail: 'Counselor Recommendation', date: '1/9/2026' },
		{ status: 'RECEIVED', detail: 'School Report (High School Transcript)', date: '1/9/2026' },
		{
			status: 'RECEIVED',
			detail: 'Mid-Year Report - due when first term grades are available',
			date: '1/23/2026'
		}
	];

	const sideButtons = [
		'My Personal Information',
		'Update Admissions Application',
		'Email an Admissions Question >>',
		'Withdraw My Application'
	];
</script>

<svelte:head>
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen bg-white font-serif text-gray-900">
	{#if !authenticated}
		<!-- ============ LOGIN PAGE ============ -->
		<header class="border-b-2 pb-3 pt-6 px-8" style="border-color: {school.primaryColor};">
			<span class="text-5xl font-serif" style="color: {school.primaryColor};">Yale</span>
		</header>

		<main class="px-8 min-h-[420px]">
			<div class="max-w-6xl">
				<h1 class="text-3xl font-normal mt-6 mb-4" style="color: {school.primaryColor};">Login</h1>

				<div
					class="border-l-4 border-[#63a70a] bg-[#e6eec6] px-4 py-3 mb-5 text-[15px] text-gray-900"
				>
					To log in, please enter your email address and password.
				</div>

				<form on:submit={handleLogin}>
					{#if error}
						<p
							class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-3 max-w-xl"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<table class="border-separate" style="border-spacing: 0 8px;">
						<tbody>
							<tr>
								<td class="pr-6 align-middle text-[15px] text-gray-800">
									<label for="portal-email">Email Address</label>
								</td>
								<td class="align-middle">
									<input
										id="portal-email"
										type="email"
										class="border border-gray-400 bg-white px-1 py-[3px] text-[14px] w-52"
										bind:value={emailInput}
										autocomplete="email"
									/>
								</td>
								<td></td>
							</tr>
							<tr>
								<td class="pr-6 align-middle text-[15px] text-gray-800">
									<label for="portal-password">Password</label>
								</td>
								<td class="align-middle">
									<input
										id="portal-password"
										type="password"
										class="border border-gray-400 bg-white px-1 py-[3px] text-[14px] w-52"
										bind:value={passwordInput}
										autocomplete="current-password"
									/>
								</td>
								<td class="pl-6 align-middle">
									<a
										href="/disclaimer"
										class="text-[15px] underline"
										style="color: {school.primaryColor};"
									>
										Forgot Your Password?
									</a>
								</td>
							</tr>
						</tbody>
					</table>

					<div class="mt-5 flex items-center gap-3">
						<button
							type="submit"
							class="border border-gray-500 bg-[#cccccc] px-3 py-[3px] text-[13px] font-bold text-black hover:bg-[#bfbfbf]"
						>
							Login
						</button>
						<button
							type="button"
							class="border border-gray-400 bg-gray-100 px-3 py-[3px] text-[12px] text-gray-700 hover:bg-gray-200"
							on:click={handleLoadSavedLogin}
						>
							Load saved PredictAdmit login
						</button>
					</div>

					<p class="mt-6 text-[11px] leading-relaxed text-gray-500 max-w-xl">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<footer class="px-8 mt-10">
			<div class="border-t border-gray-200 pt-6">
				<div class="text-3xl leading-tight font-serif" style="color: {school.primaryColor};">
					Yale College<br />Undergraduate<br />Admissions
				</div>
				<p class="mt-6 text-[12px] text-gray-500">
					Copyright &copy;2026 Yale University. All rights reserved
				</p>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============ APPLICANT STATUS PORTAL ============ -->
		<header class="border-b-2 pb-2 pt-5 px-8" style="border-color: {school.primaryColor};">
			<div class="flex items-end justify-between">
				<span class="text-4xl font-serif" style="color: {school.primaryColor};">Yale</span>
				<div class="text-[11px] text-gray-600 pb-1">
					{applicantName()}
					<a href="/disclaimer" class="underline ml-1" style="color: {school.primaryColor};">Logout</a
					>
				</div>
			</div>
		</header>

		<main class="max-w-5xl mx-auto px-8 pt-6 pb-16">
			<!-- Banner -->
			<div
				class="relative h-28 w-full overflow-hidden mb-4"
				style="background: linear-gradient(115deg, #1b2a3d 0%, #3a4b5c 45%, #7d6f52 100%);"
			>
				<div class="absolute inset-0 flex items-center px-8">
					<h2 class="text-2xl font-serif tracking-wide text-[#efe9d8] leading-snug">
						ADMISSIONS &amp; FINANCIAL AID<br />APPLICANT STATUS PORTAL
					</h2>
				</div>
			</div>

			<h1 class="text-2xl font-serif mb-1" style="color: {school.primaryColor};">
				{applicantName()}
			</h1>
			<p class="text-[12px] text-gray-500 mb-3">
				Application Record ID: {school.referenceNumber}
			</p>
			<p class="text-[13px] text-gray-700 mb-5 max-w-3xl">
				Use this portal to track your application materials and submit updates to the Office of
				Undergraduate Admissions or Office of Undergraduate Financial Aid.
			</p>

			<!-- Status Update -->
			<h3 class="text-[15px] font-semibold underline mb-1" style="color: {school.primaryColor};">
				Status Update
			</h3>
			<p class="text-[13px] text-gray-700 mb-1">
				An update to your application was last posted {school.statusLastPosted}.
			</p>
			<button
				on:click={handleViewUpdate}
				class="text-[14px] font-semibold underline mb-5 hover:opacity-80"
				style="color: {school.primaryColor};"
			>
				View Update
			</button>

			<!-- Additional Information -->
			<h3 class="text-[15px] font-semibold mb-2" style="color: {school.primaryColor};">
				Additional Information
			</h3>
			<ul class="list-disc pl-6 text-[12px] text-gray-700 space-y-1 mb-6 max-w-3xl">
				<li>As a matter of long-standing policy, all decisions are final and cannot be appealed.</li>
				<li>
					Denied applicants may reapply for admission to Yale College but are not eligible to apply
					again for this cycle.
				</li>
				<li>
					Please note that in recent years, very few students who have reapplied to Yale in a later
					admission cycle have been offered admission.
				</li>
				<li>
					<a href="/disclaimer" class="underline" style="color: {school.primaryColor};">
						Admissions Statistics
					</a>
				</li>
			</ul>

			<!-- Tabs -->
			<div class="flex gap-2 border-b border-gray-300 mb-4">
				{#each ['Admissions Checklist', 'Financial Aid Checklist'] as tab}
					<button
						on:click={() => (activeTab = tab)}
						class="px-5 py-2 text-[13px] font-semibold"
						style={activeTab === tab
							? `background-color: ${school.primaryColor}; color: #ffffff;`
							: 'background-color: #f1f1f1; color: #333333;'}
					>
						{tab}
					</button>
				{/each}
			</div>

			<div class="flex gap-6">
				<!-- Checklist tables -->
				<div class="flex-1">
					{#if activeTab === 'Admissions Checklist'}
						<!-- Supplement table -->
						<table class="w-full text-[12px] mb-6">
							<thead>
								<tr class="border-b border-gray-300 text-left text-gray-600">
									<th class="py-2 pr-4 font-semibold w-24">Status</th>
									<th class="py-2 pr-4 font-semibold">Form</th>
									<th class="py-2 font-semibold w-24">Date</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-b border-gray-100">
									<td class="py-2 pr-4 text-green-700 font-semibold whitespace-nowrap">
										<span class="text-green-600">&#10004;</span>
										{supplementRow.status}
									</td>
									<td class="py-2 pr-4">
										<a href="/disclaimer" class="underline" style="color: {school.primaryColor};">
											{supplementRow.form}
										</a>
									</td>
									<td class="py-2">{supplementRow.date}</td>
								</tr>
							</tbody>
						</table>

						<!-- Materials table -->
						<table class="w-full text-[12px]">
							<thead>
								<tr class="border-b border-gray-300 text-left text-gray-600">
									<th class="py-2 pr-4 font-semibold w-24">Status</th>
									<th class="py-2 pr-4 font-semibold">Details</th>
									<th class="py-2 font-semibold w-24">Date</th>
								</tr>
							</thead>
							<tbody>
								{#each materialRows as row}
									<tr class="border-b border-gray-100">
										<td class="py-2 pr-4 text-green-700 font-semibold whitespace-nowrap">
											<span class="text-green-600">&#10004;</span>
											{row.status}
										</td>
										<td class="py-2 pr-4">{row.detail}</td>
										<td class="py-2 whitespace-nowrap">{row.date}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{:else}
						<div class="text-[13px] text-gray-600 py-6">
							Your Financial Aid Checklist is complete. No outstanding items are required at this
							time.
						</div>
					{/if}
				</div>

				<!-- Side action buttons -->
				<div class="w-56 flex flex-col gap-2 pt-1">
					{#each sideButtons as label}
						<a
							href="/disclaimer"
							class="block text-center text-white text-[11px] px-3 py-2 hover:opacity-90"
							style="background-color: {school.primaryColor};"
						>
							{label}
						</a>
					{/each}
				</div>
			</div>

			<!-- Logout -->
			<div class="flex justify-end mt-8">
				<a href="/disclaimer" class="flex flex-col items-center text-[11px] text-[#d9791f]">
					<span class="text-lg">&#10162;</span>
					Logout
				</a>
			</div>
		</main>

		<footer class="px-8">
			<div class="border-t border-gray-200 pt-6 max-w-5xl mx-auto">
				<div class="text-2xl leading-tight font-serif" style="color: {school.primaryColor};">
					Yale College<br />Undergraduate<br />Admissions
				</div>
				<p class="mt-4 text-[11px] text-gray-500 pb-8">
					Copyright &copy;2026 Yale University. All rights reserved
				</p>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<YaleAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<YaleDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
