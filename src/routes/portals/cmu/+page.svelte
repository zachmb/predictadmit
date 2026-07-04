<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import CMUAccepted from '$lib/components/cmu/CMUAccepted.svelte';
	import CMUDenied from '$lib/components/cmu/CMUDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'cmu';
	const school = {
		schoolName: 'Carnegie Mellon University',
		primaryColor: '#C41230',
		footerDomain: 'cmu.edu',
		statusLastPosted: 'March 15, 2026',
		round: 'Regular Decision',
		referenceNumber: '92415078'
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

	// --- Application Checklist Data (from the real CMU portal capture) ---
	const checklist = [
		{ status: 'Received', detail: 'Common Application', date: '01/05/2026' },
		{ status: 'Received', detail: 'School Report', date: '01/05/2026' },
		{ status: 'Received', detail: 'Writing Supplement', date: '01/07/2026', link: true },
		{
			status: 'Received',
			detail: 'H.S. Transcript or Self-Reported Courses and Grades',
			date: '01/05/2026'
		},
		{ status: 'Received', detail: 'Recommendation: High School Teacher', date: '01/10/2026' },
		{
			status: 'Received',
			detail: 'Recommendation: Counselor or School Official',
			date: '01/05/2026'
		},
		{ status: 'Received', detail: 'Standardized Test Scores', date: '01/05/2026' },
		{ status: 'Received', detail: 'Mid-Year Transcript', date: '01/29/2026' }
	];

	const navLinks = [
		'Who We Are',
		'Majors & Programs',
		'Visit Opportunities',
		'Admission',
		'Cost & Aid',
		'Campus Experience'
	];
</script>

<svelte:head>
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen bg-white text-gray-800" style="font-family: 'Open Sans', system-ui, sans-serif;">
	{#if !authenticated}
		<!-- ===================== LOGIN PAGE ===================== -->
		<header class="border-b border-gray-200 bg-white">
			<div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
				<a href="/disclaimer" class="flex items-baseline gap-2">
					<span class="text-lg font-bold tracking-tight text-gray-900">Carnegie Mellon University</span>
					<span
						class="text-[11px] uppercase tracking-widest border-l border-gray-300 pl-2 font-semibold"
						style="color: {school.primaryColor};"
					>
						Admission
					</span>
				</a>
				<nav class="hidden lg:flex items-center gap-5 text-[13px] text-gray-700">
					{#each navLinks as link}
						<a href="/disclaimer" class="hover:text-gray-900 hover:underline">{link}</a>
					{/each}
				</nav>
			</div>
		</header>

		<div style="background-color: {school.primaryColor};" class="h-1.5 w-full"></div>

		<main class="bg-white min-h-[500px] py-16">
			<div class="max-w-2xl mx-auto px-6">
				<h1 class="text-3xl font-bold mb-4 text-gray-900">Where Am I in the Process?</h1>
				<p class="text-[15px] text-gray-700 mb-6 leading-relaxed">
					Thank you for applying to Carnegie Mellon University! Please login to monitor the status of
					your undergraduate application.
				</p>

				<div
					class="border-l-4 bg-gray-50 px-4 py-3 mb-8 text-[14px] text-gray-800"
					style="border-color: {school.primaryColor};"
				>
					To log in, please enter your email address and password.
				</div>

				<form class="max-w-lg" on:submit={autoLogin}>
					{#if error}
						<p
							class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-4"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-3 mb-4">
						<label for="portal-email" class="text-[14px] font-semibold text-gray-800 w-36">
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="border border-gray-400 bg-white px-2 py-1.5 text-[14px] w-56 focus:outline-none focus:ring-1 focus:ring-[#C41230]"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-3 mb-6">
						<label for="portal-password" class="text-[14px] font-semibold text-gray-800 w-36">
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="border border-gray-400 bg-white px-2 py-1.5 text-[14px] w-56 focus:outline-none focus:ring-1 focus:ring-[#C41230]"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a href="/disclaimer" class="text-[13px] text-[#C41230] hover:underline whitespace-nowrap">
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-3 pl-[9.75rem]">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="text-white text-[14px] font-semibold px-6 py-2 hover:opacity-90 active:opacity-80"
							style="background-color: {school.primaryColor};"
						>
							Login
						</button>
						</div>

					<p class="pt-8 text-[12px] leading-relaxed text-gray-500 max-w-md">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is stored
						only in your browser.
					</p>
				</form>
			</div>
		</main>

		<footer class="bg-[#1a1a1a] text-gray-300 py-10">
			<div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
				<div class="text-[13px] leading-relaxed">
					<h3 class="text-white font-semibold mb-2">Office of Admission</h3>
					Warner Hall<br />
					5000 Forbes Avenue<br />
					Pittsburgh, PA 15213<br />
					T: 412.268.2082<br />
					F: 412.268.7838<br />
					<a href="/disclaimer" class="hover:underline">admission@andrew.cmu.edu</a>
				</div>
				<div class="text-[13px]">
					<h4 class="text-white font-semibold mb-2">Quick Links</h4>
					<ul class="space-y-1">
						<li><a href="/disclaimer" class="hover:underline">Connect with Us</a></li>
						<li><a href="/disclaimer" class="hover:underline">Meet Our Staff</a></li>
						<li><a href="/disclaimer" class="hover:underline">Application Status</a></li>
						<li><a href="/disclaimer" class="hover:underline">Admission Events</a></li>
						<li><a href="/disclaimer" class="hover:underline">Campus Map</a></li>
					</ul>
				</div>
			</div>
			<div
				class="max-w-6xl mx-auto px-6 mt-8 pt-4 border-t border-gray-700 flex justify-between text-[11px] text-gray-400"
			>
				<span>&copy;2026 Carnegie Mellon University</span>
				<span>PredictAdmit Simulation &mdash; Not affiliated with Carnegie Mellon University</span>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ===================== APPLICANT PORTAL ===================== -->
		<header class="border-b border-gray-200 bg-white">
			<div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
				<a href="/disclaimer" class="flex items-baseline gap-2">
					<span class="text-lg font-bold tracking-tight text-gray-900">Carnegie Mellon University</span>
					<span
						class="text-[11px] uppercase tracking-widest border-l border-gray-300 pl-2 font-semibold"
						style="color: {school.primaryColor};"
					>
						Admission
					</span>
				</a>
				<nav class="hidden lg:flex items-center gap-5 text-[13px] text-gray-700">
					{#each navLinks as link}
						<a href="/disclaimer" class="hover:text-gray-900 hover:underline">{link}</a>
					{/each}
				</nav>
			</div>
		</header>

		<div style="background-color: {school.primaryColor};" class="h-1.5 w-full"></div>

		<main class="max-w-6xl mx-auto px-6 py-8">
			<p class="text-center text-[13px] text-gray-700 mb-6">
				<span class="font-bold mr-3">Account Tools:</span>
				<a href="/disclaimer" class="text-[#C41230] hover:underline mr-3">Change Email Address</a>
				<a href="/disclaimer" class="text-[#C41230] hover:underline mr-3">Change Password</a>
				<a href="/disclaimer" class="text-[#C41230] hover:underline">Logout</a>
			</p>

			<h1
				class="text-2xl font-bold uppercase pl-6 py-2 mb-6 border-l-[5px]"
				style="border-color: {school.primaryColor}; color: {school.primaryColor};"
			>
				Where Am I in the Process?
			</h1>

			<div class="border border-gray-200 border-t-[3px] border-t-[#6D6E71] p-4 mb-8 text-[14px] text-gray-800 leading-relaxed">
				Thank you for confirming your plan to enroll at Carnegie Mellon University!<br /><br />
				We encourage you to visit
				<a href="/disclaimer" class="text-[#C41230] hover:underline">cmu.edu/admission/admitted</a>
				for information on key dates and next steps.
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Main column -->
				<div class="lg:col-span-2">
					<div class="mb-8">
						<h3 class="text-lg font-bold text-gray-800 mb-2">Status Update</h3>
						<p class="text-[14px] text-gray-700 mb-3">
							An update to your application was last posted {school.statusLastPosted}.
						</p>
						<button
							on:click={handleViewUpdate}
							class="text-[14px] font-bold text-[#C41230] hover:underline"
						>
							Please click here to view your decision letter.
						</button>
					</div>

					<div>
						<h3 class="text-lg font-bold text-gray-800 mb-3">Application Checklist</h3>
						<table class="w-full text-[13px] text-left border border-gray-300">
							<thead class="bg-gray-100 border-b border-gray-300">
								<tr>
									<th class="px-3 py-2 font-bold" colspan="2">Status</th>
									<th class="px-3 py-2 font-bold">Details</th>
									<th class="px-3 py-2 font-bold">Date</th>
								</tr>
							</thead>
							<tbody>
								{#each checklist as item}
									<tr class="border-b border-gray-200 align-top">
										<td class="px-3 py-2 w-6 text-green-700 font-bold">&#10004;</td>
										<td class="px-3 py-2 w-24">{item.status}</td>
										<td class="px-3 py-2">
											{#if item.link}
												<a href="/disclaimer" class="text-[#C41230] hover:underline">{item.detail}</a>
											{:else}
												{item.detail}
											{/if}
										</td>
										<td class="px-3 py-2 w-24">{item.date}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>

				<!-- Side column -->
				<div class="space-y-8">
					<div>
						<h3 class="text-[15px] font-bold text-gray-800 mb-2">Questions? Contact us!</h3>
						<p class="text-[13px]">
							<a href="/disclaimer" class="text-[#C41230] hover:underline">admission@andrew.cmu.edu</a>
						</p>
					</div>

					<div>
						<h3 class="text-[17px] font-semibold mb-1" style="color: {school.primaryColor};">
							My Student Aid Portal
						</h3>
						<p class="text-[13px] text-gray-700">
							Access your financial aid information through the
							<a href="/disclaimer" class="text-[#C41230] hover:underline">My Student Aid portal</a>.
						</p>
					</div>

					<div>
						<h3 class="text-[15px] font-bold text-gray-800 mb-2">Verify Address</h3>
						<p class="text-[13px] text-gray-700 mb-2">We have your address listed as follows:</p>
						<p class="text-[13px] text-gray-700">
							<em>Permanent Address</em><br />
							2847 Birchwood Ln<br />
							Naperville, IL 60540-4417<br />
							United States
						</p>
					</div>
				</div>
			</div>
		</main>

		<footer class="bg-[#1a1a1a] text-gray-300 py-10 mt-12">
			<div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
				<div class="text-[13px] leading-relaxed">
					<h3 class="text-white font-semibold mb-2">Office of Admission</h3>
					Warner Hall<br />
					5000 Forbes Avenue<br />
					Pittsburgh, PA 15213<br />
					T: 412.268.2082<br />
					F: 412.268.7838<br />
					<a href="/disclaimer" class="hover:underline">admission@andrew.cmu.edu</a>
				</div>
				<div class="text-[13px]">
					<h4 class="text-white font-semibold mb-2">Quick Links</h4>
					<ul class="space-y-1">
						<li><a href="/disclaimer" class="hover:underline">Connect with Us</a></li>
						<li><a href="/disclaimer" class="hover:underline">Meet Our Staff</a></li>
						<li><a href="/disclaimer" class="hover:underline">Application Status</a></li>
						<li><a href="/disclaimer" class="hover:underline">Admission Events</a></li>
						<li><a href="/disclaimer" class="hover:underline">Campus Map</a></li>
					</ul>
				</div>
			</div>
			<div
				class="max-w-6xl mx-auto px-6 mt-8 pt-4 border-t border-gray-700 flex justify-between text-[11px] text-gray-400"
			>
				<span>&copy;2026 Carnegie Mellon University</span>
				<span>PredictAdmit Simulation &mdash; Not affiliated with Carnegie Mellon University</span>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<CMUAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<CMUDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
