<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import USCAccepted from '$lib/components/usc/USCAccepted.svelte';
	import USCDenied from '$lib/components/usc/USCDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'usc';
	const school = {
		schoolName: 'University of Southern California',
		primaryColor: '#990000', // USC Cardinal
		accentColor: '#FFCC00', // USC Gold
		footerDomain: 'usc.edu',
		statusLastPosted: 'March 27, 2026',
		round: 'Regular Decision',
		referenceNumber: '205719348'
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

	// --- Received Documents (from capture) ---
	const receivedDocs = [
		{ date: '01/22/2026 06:39 AM', detail: 'Application Fee Waiver' },
		{ date: '01/29/2026 06:42 AM', detail: 'Mid Year Transcript' },
		{ date: '03/12/2026 04:08 PM', detail: 'High School Transcript' },
		{ date: '02/04/2026 12:08 PM', detail: 'Counselor Recommendation' },
		{ date: '01/22/2026 06:41 AM', detail: 'Common Application' }
	];

	const docTypes = [
		'AP or IB Score Report',
		'Application Fee Waiver',
		'Gap Year Explanation',
		'High School Transcript',
		'Mid Year Transcript',
		'Schoolhouse Certification',
		'Portfolio'
	];
</script>

<svelte:head>
	<title>University of Southern California</title>
</svelte:head>

<div class="min-h-screen bg-white text-gray-800" style="font-family: Georgia, 'Times New Roman', serif;">
	{#if !authenticated}
		<!-- ================= LOGIN PAGE ================= -->
		<header class="border-b-4" style="border-color: {school.accentColor};">
			<div class="max-w-6xl mx-auto px-6 py-5 flex items-center gap-4">
				<span
					class="text-3xl font-extrabold tracking-tight"
					style="color: {school.primaryColor};"
				>
					USC
				</span>
				<span class="border-l border-gray-300 pl-4 text-lg text-gray-700 tracking-wide">
					Undergraduate Admission
				</span>
			</div>
		</header>

		<div style="background-color: {school.primaryColor};" class="h-2"></div>

		<main class="bg-white min-h-[520px] py-16">
			<div class="max-w-2xl mx-auto px-6">
				<h1 class="text-4xl font-normal mb-6" style="color: {school.primaryColor};">Login</h1>

				<p
					class="border border-green-700 bg-[#E7F6E7] px-4 py-3 mb-8 text-sm text-slate-800"
				>
					To log in, please enter your email address and password.
				</p>

				<form class="space-y-5 max-w-lg" on:submit={autoLogin} autocomplete="off">
					{#if error}
						<p
							class="text-sm text-red-800 border border-red-300 bg-red-50 px-3 py-2"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-3">
						<label for="portal-email" class="text-sm text-slate-800 w-36 text-right">
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="border border-slate-400 bg-white px-2 py-1.5 text-sm w-64"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-3">
						<label for="portal-password" class="text-sm text-slate-800 w-36 text-right">
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="border border-slate-400 bg-white px-2 py-1.5 text-sm w-64"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a href="/disclaimer" class="text-sm text-blue-800 hover:underline whitespace-nowrap">
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-3 pt-2">
						<div class="w-36"></div>
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="px-6 py-2 text-sm font-semibold text-white"
							style="background-color: {school.primaryColor};"
						>
							Login
						</button>
						</div>

					<p class="pt-6 text-xs leading-relaxed text-slate-600 max-w-md">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<footer class="border-t border-gray-200 text-gray-600 py-8 text-xs">
			<div class="max-w-6xl mx-auto px-6 flex flex-col gap-2">
				<div class="flex flex-wrap gap-x-6 gap-y-1">
					<span>University Park Campus</span>
					<span>213-740-2311</span>
					<a href="/disclaimer" class="hover:underline">Privacy</a>
					<a href="/disclaimer" class="hover:underline">Notice of Non-Discrimination</a>
					<a href="/disclaimer" class="hover:underline">Digital Accessibility</a>
				</div>
				<div class="flex justify-between flex-wrap gap-2 pt-2 border-t border-gray-100">
					<span>Copyright &copy; 2026 University of Southern California</span>
					<span>PredictAdmit Simulation &mdash; Not affiliated with USC</span>
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ================= APPLICANT PORTAL ================= -->
		<header class="border-b-4" style="border-color: {school.accentColor};">
			<div class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
				<div class="flex items-center gap-4">
					<span class="text-3xl font-extrabold tracking-tight" style="color: {school.primaryColor};">
						USC
					</span>
					<span class="border-l border-gray-300 pl-4 text-lg text-gray-700 tracking-wide">
						Undergraduate Admission
					</span>
				</div>
				<div class="text-sm text-gray-700 flex items-center gap-4">
					<span>{applicantName()}</span>
					<a href="/disclaimer" class="hover:underline" style="color: {school.primaryColor};">Logout</a>
				</div>
			</div>
		</header>

		<div style="background-color: {school.primaryColor};" class="h-2"></div>

		<div class="max-w-6xl mx-auto px-6 mt-8 pb-12">
			<div class="flex justify-between items-end mb-6 border-b border-gray-300 pb-3">
				<h1 class="text-3xl font-normal text-gray-800">Applicant Portal</h1>
				<div class="text-xs flex items-center text-gray-600 gap-4">
					<span><strong>Applicant:</strong> {applicantName()}</span>
					<span><strong>Round:</strong> {school.round}</span>
					<span><strong>Reference ID:</strong> {school.referenceNumber}</span>
				</div>
			</div>

			<nav class="flex border-b border-gray-300 mb-6">
				{#each ['Admissions Status', 'Application Information', 'Profile'] as tab}
					<button
						on:click={() => (activeTab = tab)}
						class="px-4 py-2 text-sm font-semibold border border-b-0 relative top-[1px] transition-colors"
						class:bg-white={activeTab === tab}
						class:text-gray-900={activeTab === tab}
						class:border-gray-300={activeTab === tab}
						class:bg-gray-100={activeTab !== tab}
						class:text-gray-600={activeTab !== tab}
						class:border-transparent={activeTab !== tab}
						style={activeTab === tab ? `border-top: 3px solid ${school.primaryColor};` : ''}
					>
						{tab}
					</button>
				{/each}
				<div class="flex-grow border-b border-gray-300"></div>
			</nav>

			{#if activeTab === 'Admissions Status'}
				<!-- Status Update -->
				<section class="mb-10">
					<h2 class="text-xl font-semibold mb-4 text-gray-800">Status Update</h2>
					<div class="p-5 border-l-4 bg-[#FBF7E9]" style="border-color: {school.primaryColor};">
						<p class="text-base text-gray-800 mb-2">
							An update to your application was last posted <strong>{school.statusLastPosted}</strong>.
						</p>
						<p class="text-base text-gray-800 mb-4">There is an update to your admission status.</p>
						<button
							on:click={handleViewUpdate}
							class="text-sm font-semibold px-5 py-2 text-white shadow-sm"
							style="background-color: {school.primaryColor};"
						>
							View Simulated Status Update &raquo;
						</button>
					</div>
				</section>

				<!-- Upload Materials -->
				<section class="mb-10">
					<h2 class="text-xl font-semibold mb-3 text-gray-800">Upload Materials</h2>
					<p class="text-sm text-gray-600 mb-4 max-w-3xl">
						To submit documents that we have requested, please select the document type below and
						upload a Word document, PDF, or scanned image file. If we have not requested that you
						submit documents to us, you may disregard this.
					</p>

					<p class="text-sm font-semibold text-gray-700 mb-2">
						We have received the following documents from you:
					</p>
					<table class="w-full text-sm text-left border border-gray-300 mb-6">
						<thead class="bg-gray-100">
							<tr>
								<th class="px-4 py-2 font-bold">Date Received</th>
								<th class="px-4 py-2 font-bold">Document</th>
							</tr>
						</thead>
						<tbody>
							{#each receivedDocs as doc}
								<tr class="border-b border-gray-200">
									<td class="px-4 py-2 text-gray-700">{doc.date}</td>
									<td class="px-4 py-2 text-gray-800">{doc.detail}</td>
								</tr>
							{/each}
						</tbody>
					</table>

					<div class="flex items-center gap-3 flex-wrap p-4 border border-gray-200 bg-gray-50">
						<label for="doc-type" class="text-sm text-gray-700">Document Type</label>
						<select id="doc-type" class="border border-slate-400 bg-white px-2 py-1.5 text-sm">
							{#each docTypes as t}
								<option>{t}</option>
							{/each}
						</select>
						<a
							href="/disclaimer"
							class="text-sm font-semibold px-4 py-1.5 text-white"
							style="background-color: {school.primaryColor};"
						>
							Upload
						</a>
					</div>
				</section>
			{:else if activeTab === 'Application Information'}
				<div class="p-6 bg-gray-100 border border-gray-300">
					<p class="text-lg font-semibold">Application Information</p>
					<p class="text-sm text-gray-600 mt-2">
						Details about your submitted application, including your Common Application and USC
						Writing Supplement, will be available here.
					</p>
				</div>
			{:else if activeTab === 'Profile'}
				<div class="p-6 bg-gray-100 border border-gray-300">
					<p class="text-lg font-semibold">Profile</p>
					<p class="text-sm text-gray-600 mt-2">
						Review and update your contact details and biographical information.
					</p>
				</div>
			{/if}
		</div>

		<footer class="border-t border-gray-200 text-gray-600 py-8 text-xs mt-12">
			<div class="max-w-6xl mx-auto px-6 flex justify-between flex-wrap gap-2">
				<span>Copyright &copy; 2026 University of Southern California</span>
				<span>PredictAdmit Simulation &mdash; Not affiliated with USC</span>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<USCAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<USCDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
