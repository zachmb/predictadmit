<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import WakeForestAccepted from '$lib/components/wakeforest/WakeForestAccepted.svelte';
	import WakeForestDenied from '$lib/components/wakeforest/WakeForestDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'wakeforest';
	const WFU_GOLD = '#9E7E38'; // Wake Forest Old Gold

	const school = {
		schoolName: 'Wake Forest University',
		primaryColor: WFU_GOLD,
		footerDomain: 'wfu.edu',
		statusLastPosted: 'March 24, 2026',
		round: 'Regular Decision',
		referenceNumber: '908867920'
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

	// --- Application Checklist Data (from the real WFU status portal) ---
	const checklistData = [
		{ status: 'Received', detail: 'High School Transcript', date: '02/26/2026' },
		{ status: 'Received', detail: 'School Report', date: '02/25/2026' },
		{ status: 'Received', detail: 'Teacher Recommendation', date: '02/25/2026' },
		{ status: 'Received', detail: 'Standardized Test Score (Optional)', date: '02/27/2026' },
		{ status: 'Received', detail: 'Writing Supplement', date: '02/26/2026' }
	];
</script>

<svelte:head>
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen bg-white text-gray-900 font-sans">
	{#if !authenticated}
		<!-- ===================== LOGIN ===================== -->
		<header class="border-b border-gray-200 bg-white">
			<div class="max-w-6xl mx-auto px-6 py-4">
				<a href="/disclaimer" class="inline-flex flex-col leading-none">
					<span class="text-2xl font-serif font-bold tracking-tight text-black">
						WAKE FOREST
					</span>
					<span
						class="text-[10px] font-semibold tracking-[0.25em] uppercase mt-1"
						style="color: {school.primaryColor};"
					>
						University
					</span>
				</a>
			</div>
		</header>

		<div style="background-color: {school.primaryColor};" class="h-1 w-full"></div>

		<main class="bg-white min-h-[520px] py-16">
			<div class="max-w-xl mx-auto px-6">
				<h1 class="text-4xl font-serif font-normal mb-4 text-black">Login</h1>

				<p class="font-serif text-[15px] text-gray-700 mb-5 leading-relaxed">
					Welcome back! To continue your Undergraduate or School of Divinity application to Wake
					Forest University or to view your status page, login below:
				</p>

				<div
					class="border-l-4 px-4 py-3 mb-6 text-[13px] text-gray-800 bg-[#faf7f0]"
					style="border-color: {school.primaryColor};"
				>
					To log in, please enter your email address and password.
				</div>

				<form class="space-y-4" on:submit={autoLogin}>
					{#if error}
						<p
							class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-3">
						<label for="portal-email" class="text-[13px] font-semibold text-gray-800 w-36 text-right">
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="border border-gray-400 bg-white px-2 py-1.5 text-[13px] w-64 rounded-sm focus:outline-none focus:ring-1"
							style="--tw-ring-color: {school.primaryColor};"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-3">
						<label
							for="portal-password"
							class="text-[13px] font-semibold text-gray-800 w-36 text-right"
						>
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="border border-gray-400 bg-white px-2 py-1.5 text-[13px] w-64 rounded-sm focus:outline-none focus:ring-1"
							style="--tw-ring-color: {school.primaryColor};"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
					</div>

					<div class="flex items-center gap-3">
						<div class="w-36"></div>
						<a href="/disclaimer" class="text-[12px] hover:underline" style="color: {school.primaryColor};">
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-3 pt-3">
						<div class="w-36"></div>
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="px-6 py-2 text-[13px] font-semibold text-white rounded-sm hover:opacity-90 active:opacity-100 transition-opacity"
							style="background-color: {school.primaryColor};"
						>
							Login
						</button>
						</div>

					<p class="pt-6 text-[11px] leading-relaxed text-gray-500">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<footer class="bg-[#353535] text-white">
			<div class="max-w-6xl mx-auto px-6 py-6 text-[13px] font-light">
				A Private Liberal Arts University in Winston-Salem, North Carolina &nbsp;/&nbsp; Founded 1834
				&nbsp;/&nbsp;
				<em class="border-b border-dotted border-gray-400">Pro Humanitate</em>
			</div>
		</footer>
		<footer class="bg-[#222222] text-gray-300">
			<div
				class="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between gap-1 text-[11px]"
			>
				<span>1834 Wake Forest Road, Winston-Salem, NC 27109</span>
				<span>PredictAdmit Simulation &mdash; Not affiliated with Wake Forest University</span>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ===================== PORTAL ===================== -->
		<div class="bg-[#1a1a1a]">
			<div class="max-w-5xl mx-auto px-6 h-[50px] flex items-center">
				<a href="/disclaimer" class="flex flex-col leading-none">
					<span class="text-lg font-serif font-bold tracking-tight text-white">WAKE FOREST</span>
					<span
						class="text-[8px] font-semibold tracking-[0.25em] uppercase"
						style="color: {school.primaryColor};"
					>
						University
					</span>
				</a>
			</div>
		</div>

		<!-- Jumbotron welcome banner -->
		<div class="bg-[#222222]">
			<div class="max-w-5xl mx-auto px-6 py-10">
				<p class="text-white text-4xl font-serif font-normal mb-4">
					Welcome to your application portal, {applicantName()}!
				</p>
				<div class="h-1 w-24 mb-5" style="background-color: {school.primaryColor};"></div>
				<p class="text-white text-[15px] font-light max-w-3xl leading-relaxed">
					This is your application status page! You&rsquo;ll want to check it frequently. In fact, go
					ahead and bookmark it. This is where we will make changes to your checklist below to let you
					know what we need throughout the admissions process. Thank you for applying to Wake Forest!
				</p>
			</div>
		</div>

		<!-- Gold navigation bar -->
		<nav style="background-color: {school.primaryColor};">
			<div class="max-w-5xl mx-auto flex text-black text-[15px] font-semibold">
				{#each ['Your Application', 'Next Steps', 'Financial Aid', 'Scholarships'] as tab, i}
					{#if i > 0}
						<span class="py-3 text-black/40 self-center">|</span>
					{/if}
					<a
						href="/disclaimer"
						class="px-5 py-3 hover:bg-black hover:text-[#9E7E38] transition-colors duration-500"
						class:underline={i === 0}
					>
						{tab}
					</a>
				{/each}
			</div>
		</nav>

		<div class="max-w-5xl mx-auto px-6 py-8">
			<p class="text-[14px] text-gray-800 mb-6">
				<strong
					>If you need to contact us regarding your application, email
					<a href="/disclaimer" style="color: {school.primaryColor};">admissions@wfu.edu</a> and provide
					your name along with this reference number: {school.referenceNumber}.</strong
				>
			</p>

			<div class="border-t border-gray-200 my-6"></div>

			<div class="flex flex-col md:flex-row gap-8">
				<!-- Main column -->
				<div class="md:w-2/3 space-y-8">
					<!-- Status Update box -->
					<div>
						<h3 class="font-serif text-2xl text-black mb-3">Status Update</h3>
						<div
							class="rounded-2xl p-5"
							style="border: 1px solid {school.primaryColor}; background-color: #fafafa;"
						>
							<p class="text-[14px] text-gray-800 mb-4">
								An update to your application was last posted <strong>{school.statusLastPosted}</strong
								>.
							</p>
							<button
								on:click={handleViewUpdate}
								class="text-[14px] font-bold px-5 py-2 text-white rounded hover:opacity-90"
								style="background-color: {school.primaryColor};"
							>
								View Update &gt;&gt;
							</button>
						</div>
					</div>

					<!-- Forms -->
					<div>
						<h3 class="font-serif text-2xl text-black mb-3">Forms</h3>
						<table class="w-full text-[14px] text-left border-collapse">
							<tbody>
								<tr class="border-b border-gray-200">
									<td class="py-2 pr-2 w-6 text-green-700">&#10004;</td>
									<td class="py-2 pr-4 w-24">{school.statusLastPosted.includes('March') ? '03/24/2026' : '--'}</td>
									<td class="py-2">
										Decision Reply Form
										<a href="/disclaimer" class="ml-2" style="color: {school.primaryColor};">Display</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- Application Checklist -->
					<div>
						<h3 class="font-serif text-2xl text-black mb-3">Application Checklist</h3>
						<table class="w-full text-[14px] text-left border-collapse">
							<thead>
								<tr style="background-color: #CEB888;">
									<th class="py-2 px-2" colspan="2">Status</th>
									<th class="py-2 px-2">Details</th>
									<th class="py-2 px-2">Date</th>
								</tr>
							</thead>
							<tbody>
								{#each checklistData as item}
									<tr class="border-b border-gray-200 align-top">
										<td class="py-2 px-2 w-6 text-green-700">&#10004;</td>
										<td class="py-2 px-2 w-24">{item.status}</td>
										<td class="py-2 px-2">{item.detail}</td>
										<td class="py-2 px-2 w-24">{item.date}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<div class="border-t border-gray-200"></div>

					<!-- Recent Activities -->
					<div>
						<h3 class="font-serif text-2xl text-black mb-3">Recent Activities</h3>
						<table class="w-full text-[14px] text-left border-collapse">
							<thead>
								<tr style="background-color: #CEB888;">
									<th class="py-2 px-2 w-32">Date</th>
									<th class="py-2 px-2">Details</th>
								</tr>
							</thead>
							<tbody>
								<tr class="align-top">
									<td class="py-2 px-2">02/27/2026</td>
									<td class="py-2 px-2">
										Payment Waived: 85.00 USD
										<div class="text-gray-500">Application Fee</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<!-- Sidebar -->
				<div class="md:w-1/3 space-y-6">
					<div
						class="rounded-2xl p-4"
						style="border: 1px solid {school.primaryColor}; background-color: #fafafa;"
					>
						<h3 class="font-serif text-xl text-black mb-2"><strong>Meet your Wake Forest Dean!</strong></h3>
						<div
							class="w-24 h-24 rounded-sm mb-2 flex items-center justify-center text-white text-2xl font-serif"
							style="background-color: {school.primaryColor};"
						>
							JS
						</div>
						<p class="text-[13px] font-serif text-gray-800 leading-relaxed">
							Mr. Jeremy Shearer<br />
							Assistant Dean | Office of Undergraduate Admissions<br />
							Wake Forest University<br />
							shearej@wfu.edu
						</p>
					</div>

					<div
						class="rounded-2xl p-4"
						style="border: 1px solid {school.primaryColor}; background-color: #fafafa;"
					>
						<h3 class="font-serif text-xl text-black mb-2"><strong>Your Information</strong></h3>
						<p class="text-[13px] text-gray-800 leading-relaxed">
							<strong>Name:</strong> {applicantName()}<br />
							<strong>Email:</strong> {profile.email || 'applicant@example.com'}<br />
							<strong>App Type:</strong> {school.round}<br />
							<strong>Student ID:</strong> 31050109<br />
							<strong>Financial Aid:</strong> Yes<br />
							<strong>Consider Tests:</strong> Optional<br />
							<strong>Residency Status:</strong> Out-of-State
						</p>
					</div>

					<div
						class="rounded-2xl p-4"
						style="border: 1px solid {school.primaryColor}; background-color: #fafafa;"
					>
						<h3 class="font-serif text-xl text-black mb-2">Your Academic Interest</h3>
						<p class="text-[13px] text-gray-800 leading-relaxed">
							We want you to feel confident about your academic path at Wake Forest. Visit the
							<a href="/disclaimer" style="color: {school.primaryColor};">Majors &amp; Minors page</a>
							to explore our degree offerings.
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<footer class="bg-[#353535] text-white mt-8">
			<div class="max-w-5xl mx-auto px-6 py-6 text-[13px] font-light">
				A Private Liberal Arts University in Winston-Salem, North Carolina &nbsp;/&nbsp; Founded 1834
				&nbsp;/&nbsp;
				<em class="border-b border-dotted border-gray-400">Pro Humanitate</em>
			</div>
		</footer>
		<footer class="bg-[#222222] text-gray-300">
			<div class="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between gap-4">
				<div>
					<p class="text-2xl font-serif text-white mb-2">Undergraduate Admissions</p>
					<p class="text-[13px] font-light leading-relaxed">
						Porter B. Byrum Welcome Center<br />
						P.O. Box 7305 Reynolda Station<br />
						Winston-Salem, NC 27109
					</p>
				</div>
				<div class="text-[13px] font-light md:text-right">
					<a href="/disclaimer" class="hover:underline">336.758.5201</a><br />
					<a href="/disclaimer" class="hover:underline">admissions@wfu.edu</a>
				</div>
			</div>
			<div class="max-w-5xl mx-auto px-6 pb-6 flex flex-wrap gap-x-6 gap-y-2 text-[12px]">
				<a href="/disclaimer" class="hover:underline" style="color: {school.primaryColor};">Change Email Address</a>
				<a href="/disclaimer" class="hover:underline" style="color: {school.primaryColor};">Change Password</a>
				<a href="/disclaimer" class="hover:underline" style="color: {school.primaryColor};">Withdraw Application</a>
				<a href="/disclaimer" class="hover:underline" style="color: {school.primaryColor};">Logout</a>
			</div>
			<div class="max-w-5xl mx-auto px-6 pb-6 text-[11px] text-gray-500">
				PredictAdmit Simulation &mdash; Not affiliated with Wake Forest University
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<WakeForestAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<WakeForestDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
