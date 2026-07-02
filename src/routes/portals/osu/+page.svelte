<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import OhioStateAccepted from '$lib/components/osu/OhioStateAccepted.svelte';
	import OhioStateDenied from '$lib/components/osu/OhioStateDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'osu';
	const SCARLET = '#BB0000';
	const GRAY = '#666666';
	const CHARCOAL = '#2A2A2A';

	const school = {
		schoolName: 'The Ohio State University',
		primaryColor: SCARLET,
		footerDomain: 'osu.edu',
		statusLastPosted: 'March 12, 2026',
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
	let privateDevice = 'yes';

	// Subscribe to the global user profile store
	$: profile = $userProfile;

	// Dynamic Data Helpers
	const applicantName = () => profile.name || 'Applicant';

	// Default decision when the prediction store has no entry for this slug:
	const DEFAULT_DECISION = 'admit';
	$: shownDecision = $decisionsBySlug[SLUG] ?? DEFAULT_DECISION;

	const statusLinkLabel = 'View Admission Decision';

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

	// --- To Do / Checklist Data (Buckeye Link style) ---
	const checklist = [
		{
			status: '✔ Complete',
			detail: 'Common Application / Coalition Application',
			date: '11/01/2025',
			color: 'text-green-700'
		},
		{
			status: '✔ Complete',
			detail: 'Official High School Transcript',
			date: '11/04/2025',
			color: 'text-green-700'
		},
		{
			status: '✔ Complete',
			detail: 'Self-Reported Academic Record (SRAR)',
			date: '11/05/2025',
			color: 'text-green-700'
		},
		{
			status: '✔ Complete',
			detail: 'Counselor Recommendation',
			date: '11/06/2025',
			color: 'text-green-700'
		},
		{
			status: '! Optional',
			detail: 'SAT / ACT Score Report (Test-Optional)',
			date: '--',
			color: 'text-amber-700'
		},
		{
			status: '✔ Posted',
			detail: 'Admission Decision Notification',
			date: '03/12/2026',
			color: 'text-green-700'
		}
	];
</script>

<svelte:head>
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen font-sans bg-white text-gray-800">
	{#if !authenticated}
		<!-- Utility bar -->
		<div class="bg-[#F2F2F2] border-b border-gray-300 text-[12px] text-gray-700">
			<div class="max-w-6xl mx-auto px-4 h-10 flex items-center justify-between">
				<a href="/disclaimer" class="font-extrabold tracking-tight text-gray-800">
					OSU<span style="color: {SCARLET};">.EDU</span>
				</a>
				<nav class="flex items-center gap-5">
					<a href="/disclaimer" class="hover:underline">Help</a>
					<a href="/disclaimer" class="hover:underline">BuckeyeLink</a>
					<a href="/disclaimer" class="hover:underline">Map</a>
					<a href="/disclaimer" class="hover:underline">Find People</a>
					<a href="/disclaimer" class="hover:underline">Webmail</a>
					<a href="/disclaimer" class="hover:underline">Search Ohio State</a>
				</nav>
			</div>
		</div>

		<!-- Scarlet rule -->
		<div style="background-color: {SCARLET};" class="h-1"></div>

		<!-- Charcoal header band -->
		<div style="background-color: {CHARCOAL};" class="py-7">
			<div class="max-w-6xl mx-auto px-4">
				<h1 class="text-3xl font-semibold text-white">Login Required</h1>
			</div>
		</div>

		<main class="bg-white min-h-[500px] py-10">
			<div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
				<!-- Left: login form + info -->
				<div class="md:col-span-2">
					<p class="text-[14px] text-gray-800 mb-6">
						A login is required to access the requested service.
					</p>

					<form class="space-y-4 max-w-[560px]" on:submit={handleLogin}>
						{#if error}
							<p
								class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2"
								role="alert"
							>
								{error}
							</p>
						{/if}

						<div class="flex items-start gap-4">
							<label for="portal-email" class="text-[13px] text-gray-700 w-40 pt-1">
								Ohio State Username
							</label>
							<input
								id="portal-email"
								type="text"
								placeholder="lastname.#"
								class="border border-gray-400 bg-white px-2 py-1.5 text-[14px] flex-1 max-w-xs placeholder:text-gray-400"
								bind:value={emailInput}
								autocomplete="username"
							/>
						</div>

						<div class="flex items-start gap-4">
							<label for="portal-password" class="text-[13px] text-gray-700 w-40 pt-1">
								Password
							</label>
							<input
								id="portal-password"
								type="password"
								class="border border-gray-400 bg-white px-2 py-1.5 text-[14px] flex-1 max-w-xs"
								bind:value={passwordInput}
								autocomplete="current-password"
							/>
						</div>

						<div class="flex items-start gap-4">
							<span class="text-[13px] text-gray-700 w-40 pt-1">
								Is this a <a href="/disclaimer" class="text-blue-800 underline">private</a> computer/device?
							</span>
							<div class="flex items-center gap-4 pt-1 text-[13px] text-gray-700">
								<label class="flex items-center gap-1">
									<input type="radio" name="private" value="yes" bind:group={privateDevice} /> Yes
								</label>
								<label class="flex items-center gap-1">
									<input type="radio" name="private" value="no" bind:group={privateDevice} /> No
								</label>
							</div>
						</div>

						<div class="flex items-start gap-4">
							<div class="w-40"></div>
							<div class="text-[13px]">
								<a href="/disclaimer" class="text-blue-800 hover:underline">Forgot username?</a>
								<a href="/disclaimer" class="text-blue-800 hover:underline ml-2">Forgot password?</a>
							</div>
						</div>

						<div class="flex items-start gap-4 pt-2">
							<div class="w-40"></div>
							<div class="flex-1 max-w-xs">
								<button
									type="submit"
									class="w-full py-2.5 text-[15px] font-semibold text-white"
									style="background-color: {SCARLET};"
								>
									Login
								</button>
								<button
									type="button"
									class="w-full mt-3 py-1.5 text-[12px] font-semibold border border-gray-400 bg-gray-100 text-gray-700 hover:bg-gray-200"
									on:click={handleLoadSavedLogin}
								>
									Load saved PredictAdmit login
								</button>
							</div>
						</div>
					</form>

					<!-- Important Login Information -->
					<div class="mt-10 max-w-[720px] border border-gray-300">
						<div
							class="px-3 py-2 text-white text-[12px] font-bold uppercase tracking-wide"
							style="background: linear-gradient(#3E7BB6, #2E5C8A);"
						>
							Important Login Information
						</div>
						<div class="bg-[#EAF2FA] px-4 py-4 text-[12px] leading-relaxed text-gray-700 space-y-3">
							<p>
								These information systems, including all related equipment, networks, and network
								devices, are provided solely for use authorized by The Ohio State University. Use of
								these systems constitutes consent to abide by The Ohio State University's
								<a href="/disclaimer" class="text-blue-800 underline"
									>Responsible Use of University Computing and Network Resources Policy</a
								>. The Ohio State University may monitor use of these information systems without
								notice. Unauthorized disclosure of information, or evidence of unauthorized use, may
								be subject to administrative action, civil action, and/or criminal prosecution.
							</p>
							<p>
								For help with password or login issues, contact the IT Service Desk by calling
								<span class="text-blue-800">614-688-4357 (HELP)</span> or online at
								<a href="/disclaimer" class="text-blue-800 underline">https://ocio.osu.edu/selfservice</a>.
							</p>
							<p>
								The Ohio State University will <strong>NEVER</strong> ask for your password via email,
								phone, or any other method. If you receive such a message or have replied to one, please
								report it to <span class="text-blue-800">report.phish@osu.edu</span>.
								<strong>NEVER</strong> reply to any email asking for your account information or other
								personal details.
							</p>
							<p>
								To protect your privacy, <strong>completely
									<a href="/disclaimer" class="text-blue-800 underline">clear your web browser</a></strong
								> when finished. Login will remain in effect until you completely clear your browser or
								several hours have elapsed.
							</p>
						</div>
					</div>
				</div>

				<!-- Right sidebar -->
				<aside class="md:col-span-1 pt-1">
					<a
						href="/disclaimer"
						class="flex items-center gap-3 border border-gray-300 px-3 py-3 mb-6 hover:bg-gray-50"
					>
						<span class="text-2xl">⚠️</span>
						<span class="text-[12px] font-bold uppercase tracking-wide text-blue-900 leading-tight">
							View System Status and Maintenance
						</span>
					</a>

					<div class="mb-6">
						<h2 class="text-[15px] font-bold text-gray-800 mb-2">Need Help?</h2>
						<ul class="text-[13px] space-y-1">
							<li><a href="/disclaimer" class="text-blue-800 hover:underline">Forgot your username?</a></li>
							<li><a href="/disclaimer" class="text-blue-800 hover:underline">Reset your password?</a></li>
							<li>
								<a href="/disclaimer" class="text-blue-800 hover:underline"
									>Need to activate your Ohio State Username?</a
								>
							</li>
						</ul>
					</div>

					<div>
						<h2 class="text-[15px] font-bold text-gray-800 mb-2">Other questions?</h2>
						<ul class="text-[13px] space-y-1">
							<li><a href="/disclaimer" class="text-blue-800 hover:underline">About Ohio State Usernames</a></li>
							<li><a href="/disclaimer" class="text-blue-800 hover:underline">About OSU Web Login</a></li>
							<li><a href="/disclaimer" class="text-blue-800 hover:underline">Contact IT Service Desk</a></li>
						</ul>
					</div>
				</aside>
			</div>
		</main>

		<!-- Footer -->
		<footer style="background-color: {CHARCOAL};" class="text-gray-300 mt-6">
			<div class="max-w-6xl mx-auto px-4 py-8">
				<div class="text-lg font-serif font-bold text-white tracking-wide mb-3">
					THE OHIO STATE UNIVERSITY
				</div>
				<div class="w-full border-t border-gray-600 mb-4"></div>
				<p class="text-[12px] leading-relaxed mb-1">
					This page is maintained by the
					<a href="/disclaimer" class="text-white underline">Office of Technology and Digital Innovation</a>.
				</p>
				<p class="text-[12px] leading-relaxed mb-1">
					Contact: <a href="/disclaimer" class="text-white underline">IT Service Desk</a> |
					<a href="/disclaimer" class="text-white underline">Locations</a> | Phone:
					614-688-HELP (4357) | TDD: 614-688-8743
				</p>
				<p class="text-[12px] leading-relaxed mt-3">
					If you have a disability and experience difficulty accessing this service, please call the
					Accessibility Help Line at 614-292-5000.
				</p>
				<div class="w-full border-t border-gray-600 mt-5 pt-3 flex justify-between text-[11px] text-gray-400">
					<span>&copy; 2026 The Ohio State University</span>
					<span>PredictAdmit Simulation — Not affiliated with The Ohio State University</span>
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- Applicant Center portal -->
		<div class="min-h-screen bg-gray-50">
			<!-- Utility bar -->
			<div class="bg-[#F2F2F2] border-b border-gray-300 text-[12px] text-gray-700">
				<div class="max-w-6xl mx-auto px-4 h-9 flex items-center justify-between">
					<span class="font-extrabold tracking-tight text-gray-800">
						OSU<span style="color: {SCARLET};">.EDU</span>
					</span>
					<a href="/disclaimer" class="hover:underline">Sign Out</a>
				</div>
			</div>

			<!-- Scarlet header -->
			<header style="background-color: {SCARLET};" class="text-white">
				<div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<span class="text-xl font-serif font-bold tracking-wide">THE OHIO STATE UNIVERSITY</span>
						<span class="text-[11px] uppercase tracking-wider border-l border-white/40 pl-3">
							Buckeye Link
						</span>
					</div>
					<div class="text-[12px]">buckeyelink.{school.footerDomain}</div>
				</div>
			</header>

			<div class="max-w-6xl mx-auto px-4 mt-6 pb-14">
				<div class="flex justify-between items-end mb-6 border-b border-gray-300 pb-2">
					<h1 class="text-3xl font-normal text-gray-800">Applicant Center</h1>
					<div class="text-xs flex flex-wrap items-center gap-x-5 gap-y-1 text-gray-600">
						<span><strong>Applicant:</strong> {applicantName()}</span>
						<span><strong>Term:</strong> Autumn 2026</span>
						<span><strong>Reference #:</strong> {school.referenceNumber}</span>
					</div>
				</div>

				<!-- Tabs -->
				<nav class="flex border-b border-gray-300 mb-6">
					{#each ['Admissions Status', 'To Do List', 'Profile'] as tab}
						<button
							on:click={() => (activeTab = tab)}
							class="px-4 py-2 text-sm font-semibold border border-b-0 transition-colors duration-150 relative top-[1px]"
							class:bg-white={activeTab === tab}
							class:text-gray-900={activeTab === tab}
							class:border-gray-300={activeTab === tab}
							class:bg-gray-100={activeTab !== tab}
							class:text-gray-600={activeTab !== tab}
							class:border-transparent={activeTab !== tab}
						>
							{tab}
						</button>
					{/each}
					<div class="flex-grow border-b border-gray-300"></div>
				</nav>

				<div class="flex w-full flex-col md:flex-row">
					<!-- Left rail -->
					<div class="md:w-1/4 md:pr-8 pt-2">
						<h2 class="text-lg font-semibold mb-3 text-gray-800">Admissions</h2>
						<nav class="text-sm space-y-1">
							<a
								href="/disclaimer"
								class="block py-1 px-2 font-bold bg-gray-100 border-l-4 text-gray-900"
								style="border-color: {SCARLET};"
							>
								Decision Status
							</a>
							<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">Application Summary</a>
							<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">Financial Aid &amp; Scholarships</a>
							<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">Housing</a>
							<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">Buckeye ID</a>
						</nav>
					</div>

					<!-- Main content -->
					<div class="md:w-3/4 md:pl-8 md:border-l border-gray-300">
						{#if activeTab === 'Admissions Status'}
							<div class="mb-8">
								<h2 class="text-xl font-semibold mb-4 text-gray-700">Status Update</h2>
								<div
									class="p-4 border-2"
									style="background-color: #FCF2F2; border-color: {SCARLET};"
								>
									<p class="text-base text-gray-700 mb-4">
										An update to your application was last posted <strong>{school.statusLastPosted}</strong>.
										A decision on your application for admission is now available.
									</p>
									<button
										on:click={handleViewUpdate}
										class="text-sm font-semibold px-5 py-2 text-white hover:opacity-90 active:opacity-100"
										style="background-color: {SCARLET};"
									>
										{statusLinkLabel} &raquo;
									</button>
								</div>
							</div>

							<div class="mb-8">
								<h2 class="text-xl font-semibold mb-4 text-gray-700">Application Checklist</h2>
								<table class="w-full text-sm text-left border border-gray-300">
									<thead class="bg-gray-100">
										<tr>
											<th class="px-4 py-2 font-bold">Status</th>
											<th class="px-4 py-2 font-bold">Item</th>
											<th class="px-4 py-2 font-bold">Date Received</th>
										</tr>
									</thead>
									<tbody>
										{#each checklist as item}
											<tr class="border-b border-gray-200">
												<td
													class="px-4 py-2 font-semibold"
													class:text-green-700={item.color === 'text-green-700'}
													class:text-amber-700={item.color === 'text-amber-700'}
												>
													{item.status}
												</td>
												<td class="px-4 py-2">{item.detail}</td>
												<td class="px-4 py-2">{item.date}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>

							<div class="mb-8">
								<h2 class="text-xl font-semibold mb-4 text-gray-700">Holds</h2>
								<div class="p-4 border border-gray-300 bg-white text-sm">
									<p class="text-gray-700">You have no holds at this time.</p>
								</div>
							</div>
						{:else if activeTab === 'To Do List'}
							<div class="p-6 bg-white border border-gray-300">
								<p class="text-lg font-semibold text-gray-800">To Do List</p>
								<p class="text-sm text-gray-600 mt-2">
									Outstanding items required to complete your file will appear here. Your admissions
									file is currently complete.
								</p>
							</div>
						{:else if activeTab === 'Profile'}
							<div class="p-6 bg-white border border-gray-300">
								<p class="text-lg font-semibold text-gray-800">Profile</p>
								<p class="text-sm text-gray-600 mt-2">
									Review and update your contact details and biographical information.
								</p>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Footer -->
			<footer style="background-color: {CHARCOAL};" class="text-gray-300 mt-6">
				<div class="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between text-[11px]">
					<span>&copy; 2026 The Ohio State University — Office of Undergraduate Admissions</span>
					<span>PredictAdmit Simulation — Not affiliated with The Ohio State University</span>
				</div>
			</footer>
		</div>
	{:else if shownDecision === 'admit'}
		<OhioStateAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<OhioStateDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
