<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import BerkeleyAccepted from '$lib/components/berkeley/BerkeleyAccepted.svelte';
	import BerkeleyDenied from '$lib/components/berkeley/BerkeleyDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'ucberkeley';
	const school = {
		schoolName: 'University of California, Berkeley',
		primaryColor: '#003262',
		accentColor: '#FDB515',
		footerDomain: 'berkeley.edu',
		statusLastPosted: 'March 20, 2026',
		round: 'Regular Decision',
		referenceNumber: '5236114'
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
		requestAnimationFrame(() => window.scrollTo(0, 0));
	};
</script>

<svelte:head>
	<title>MAP@Berkeley &middot; Office of Undergraduate Admissions</title>
</svelte:head>

<div class="min-h-screen bg-white font-sans text-slate-800">
	{#if !authenticated}
		<!-- ============================ LOGIN ============================ -->
		<!-- Top navy utility bar -->
		<div class="bg-[#003262] text-white">
			<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
				<div class="text-[13px] font-semibold">UC Berkeley</div>
				<div class="flex items-center gap-5 text-[11px]">
					<a href="/disclaimer" class="hover:underline">MAP@Berkeley</a>
					<a href="/disclaimer" class="hover:underline">Sign up for our email list</a>
					<a href="/disclaimer" class="hover:underline">Contact Us</a>
					<span class="hidden items-center rounded-sm bg-white/90 px-2 py-0.5 text-[11px] text-slate-500 md:inline-flex">Search .......</span>
				</div>
			</div>
		</div>

		<!-- Wordmark header -->
		<header class="border-b border-slate-200 bg-white">
			<div class="mx-auto max-w-6xl px-6 pt-6 pb-3">
				<h1 class="text-[34px] leading-none text-[#003262]">
					<span class="font-serif italic">Berkeley</span>
					<span class="ml-1 font-serif font-normal">Office of Undergraduate Admissions</span>
				</h1>
				<nav class="mt-4 flex flex-wrap gap-6 text-[13px] font-semibold text-[#003262]">
					<a href="/disclaimer" class="hover:underline">Apply to Berkeley <span class="text-[9px]">&#9662;</span></a>
					<a href="/disclaimer" class="hover:underline">Academics <span class="text-[9px]">&#9662;</span></a>
					<a href="/disclaimer" class="hover:underline">Cost <span class="text-[9px]">&#9662;</span></a>
					<a href="/disclaimer" class="hover:underline">Discover Berkeley <span class="text-[9px]">&#9662;</span></a>
					<a href="/disclaimer" class="hover:underline">Visit <span class="text-[9px]">&#9662;</span></a>
					<a href="/disclaimer" class="hover:underline">Berkeley En Espa&ntilde;ol <span class="text-[9px]">&#9662;</span></a>
				</nav>
			</div>
		</header>

		<main class="mx-auto min-h-[440px] max-w-6xl px-6 py-10">
			<h2 class="mb-4 font-serif text-[38px] font-normal text-[#003262]">Login</h2>

			<p class="mb-5 max-w-3xl text-[13px] leading-relaxed text-slate-700">
				Welcome to My Application Portal (MAP@Berkeley)! This portal will be your gateway to check the
				status of your application and receive important updates from UC Berkeley, including your
				admissions decision.
			</p>

			<div
				class="mb-6 max-w-3xl border-l-4 bg-[#eef2d8] px-4 py-3 text-[13px] text-slate-800"
				style="border-color: #8a9a3f;"
			>
				To log in, please enter your email address and password.
			</div>

			<form class="max-w-xl space-y-4" on:submit={autoLogin}>
				{#if error}
					<p class="border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800" role="alert">
						{error}
					</p>
				{/if}

				<div class="flex flex-wrap items-center gap-6">
					<label for="portal-email" class="w-28 text-[13px] text-slate-800">Email Address</label>
					<input
						id="portal-email"
						type="email"
						class="w-full max-w-[16rem] sm:w-64 border border-slate-400 bg-white px-2 py-1 text-[13px] focus:border-[#003262] focus:outline-none"
						bind:value={emailInput}
						autocomplete="email"
					/>
				</div>

				<div class="flex flex-wrap items-center gap-6">
					<label for="portal-password" class="w-28 text-[13px] text-slate-800">Password</label>
					<input
						id="portal-password"
						type="password"
						class="w-full max-w-[16rem] sm:w-64 border border-slate-400 bg-white px-2 py-1 text-[13px] focus:border-[#003262] focus:outline-none"
						bind:value={passwordInput}
						autocomplete="current-password"
					/>
					<a href="/disclaimer" class="text-[13px] font-semibold text-[#003262] hover:underline">
						Forgot Your Password?
					</a>
				</div>

				<div class="flex items-center gap-4 pt-2">
					<button
						type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
						class="border border-slate-400 bg-gradient-to-b from-white to-slate-200 px-5 py-1.5 text-[13px] font-semibold text-slate-800 hover:from-slate-50 hover:to-slate-300"
					>
						Login
					</button>
					</div>

				<p class="pt-3 text-[12px] leading-relaxed text-slate-600">
					Questions about your application? Visit the
					<a href="/disclaimer" class="text-[#003262] hover:underline">Application FAQs</a> or the
					<a href="/disclaimer" class="text-[#003262] hover:underline"
						>University of California Admissions website</a
					>.
				</p>
				<p class="max-w-2xl text-[11px] leading-relaxed text-slate-500">
					For this simulation, use the same email address and password that you saved on the
					PredictAdmit.com home page. No real application data is used, and all information is stored
					only in your browser.
				</p>
			</form>
		</main>

		<!-- Navy footer -->
		<footer class="bg-[#003262] text-slate-200">
			<div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-4">
				<div class="flex items-start gap-3">
					<div class="flex gap-3 text-slate-100">
						<a href="/disclaimer" aria-label="Facebook"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.8v8h3.1z"/></svg></a>
						<a href="/disclaimer" aria-label="Twitter"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 4.9c-.8.4-1.7.6-2.6.8a4.5 4.5 0 0 0 2-2.5c-.9.5-1.9.9-2.9 1.1a4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 2.5 3.7a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 18.6a12.7 12.7 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6c.9-.6 1.6-1.4 2.3-2.3z"/></svg></a>
						<a href="/disclaimer" aria-label="Instagram"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2z"/></svg></a>
						<a href="/disclaimer" aria-label="Medium"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 5h16v14H4z" fill="none"/><ellipse cx="7" cy="12" rx="3.5" ry="4"/><ellipse cx="15" cy="12" rx="1.6" ry="4"/><ellipse cx="20" cy="12" rx="0.7" ry="4"/></svg></a>
						<a href="/disclaimer" aria-label="TikTok"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 3c.3 2 1.5 3.5 3.5 3.9V10c-1.4 0-2.6-.4-3.5-1v6.5A5.5 5.5 0 1 1 10.5 10v3a2.5 2.5 0 1 0 2.5 2.5V3H16z"/></svg></a>
					</div>
				</div>
				<div class="text-[13px] leading-relaxed">
					<div class="font-semibold">Office of Undergraduate Admissions</div>
					<div>University of California, Berkeley</div>
					<div>110 Sproul Hall #5800,</div>
					<div>Berkeley, CA 94720-5800</div>
				</div>
				<div class="text-[13px] leading-relaxed">
					<a href="/disclaimer" class="block hover:underline">Events</a>
					<a href="/disclaimer" class="block hover:underline">MAP@Berkeley</a>
					<a href="/disclaimer" class="block hover:underline">Publications</a>
					<a href="/disclaimer" class="block hover:underline">Volunteer</a>
					<a href="/disclaimer" class="block hover:underline">Contact Us</a>
				</div>
				<div class="text-[13px] leading-relaxed">
					<a href="/disclaimer" class="block hover:underline">Privacy Policy</a>
					<a href="/disclaimer" class="block hover:underline">Accessibility</a>
					<a href="/disclaimer" class="block hover:underline">Nondiscrimination</a>
				</div>
			</div>
			<div class="border-t border-white/20">
				<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
					<div class="leading-none text-white">
						<div class="font-serif text-3xl italic">Berkeley</div>
						<div class="text-[9px] tracking-[0.25em] text-slate-300">UNIVERSITY OF CALIFORNIA</div>
					</div>
					<div class="text-[11px] text-slate-300">
						Copyright &copy; 2026 UC Regents; all rights reserved
					</div>
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============================ PORTAL ============================ -->
		<!-- Top navy utility bar -->
		<div class="bg-[#003262] text-white">
			<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
				<div class="text-[13px] font-semibold">UC Berkeley</div>
				<div class="flex items-center gap-5 text-[11px]">
					<a href="/disclaimer" class="hover:underline">MAP@Berkeley</a>
					<a href="/disclaimer" class="hover:underline">Sign up for our email list</a>
					<a href="/disclaimer" class="hover:underline">Contact Us</a>
					<span class="hidden items-center rounded-sm bg-white/90 px-2 py-0.5 text-[11px] text-slate-500 md:inline-flex">Search</span>
				</div>
			</div>
		</div>

		<!-- Wordmark header -->
		<header class="border-b border-slate-200 bg-white">
			<div class="mx-auto max-w-6xl px-6 pt-4 pb-2">
				<h1 class="text-[30px] leading-none text-[#003262]">
					<span class="font-serif italic">Berkeley</span>
					<span class="ml-1 font-serif font-normal">Office of Undergraduate Admissions</span>
				</h1>
				<nav class="mt-3 flex flex-wrap gap-6 text-[12px] font-semibold text-[#003262]">
					<a href="/disclaimer" class="hover:underline">Apply to Berkeley</a>
					<a href="/disclaimer" class="hover:underline">Academics</a>
					<a href="/disclaimer" class="hover:underline">Cost</a>
					<a href="/disclaimer" class="hover:underline">Discover Berkeley</a>
					<a href="/disclaimer" class="hover:underline">Visit</a>
					<a href="/disclaimer" class="hover:underline">Berkeley En Espa&ntilde;ol</a>
				</nav>
			</div>
		</header>

		<main class="mx-auto max-w-6xl px-6 py-6">
			<!-- Applicant chip -->
			<div class="mb-4 flex justify-end">
				<span class="inline-flex items-center gap-2 bg-[#0b76c4] px-4 py-1.5 text-[13px] font-semibold text-white">
					{applicantName()} <span class="text-[10px] font-normal opacity-80">Logout</span>
				</span>
			</div>

			<div class="flex flex-col gap-6 lg:flex-row">
				<!-- Left main column -->
				<div class="flex-1">
					<!-- Gold hero banner -->
					<div class="relative overflow-hidden bg-[#FDB515] px-8 py-8 text-[#003262]">
						<div class="relative z-10 max-w-lg">
							<p class="text-[12px] font-semibold">MAP@Berkeley</p>
							<h2 class="font-serif text-[30px] font-bold leading-tight">MY APPLICATION PORTAL</h2>
							<p class="mt-2 text-[12px] leading-relaxed">
								If you need to contact us regarding your application, provide your name and this
								reference number: <strong>{school.referenceNumber}</strong>
							</p>
						</div>
						<div class="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-40">
							<svg viewBox="0 0 200 100" class="h-full w-full" preserveAspectRatio="xMidYMid slice">
								<path d="M0 70 L200 70" stroke="#003262" stroke-width="2" fill="none" />
								<path d="M30 70 L30 20 M170 70 L170 20" stroke="#003262" stroke-width="3" />
								<path d="M0 45 Q100 -10 200 45" stroke="#003262" stroke-width="2" fill="none" />
								<path d="M30 30 L60 45 M170 30 L140 45 M75 40 L95 55 M125 40 L105 55" stroke="#003262" stroke-width="1" />
							</svg>
						</div>
					</div>

					<!-- STATUS UPDATE gold block with bear -->
					<div class="mt-4 flex items-center gap-6 bg-[#FDB515] px-8 py-6 text-[#003262]">
						<svg viewBox="0 0 64 40" class="h-10 w-16 shrink-0 text-white" fill="currentColor" aria-hidden="true">
							<path d="M4 30 C6 20 14 14 24 16 C28 10 36 10 40 16 C50 14 58 20 60 30 C58 34 50 36 44 35 C40 38 24 38 20 35 C14 36 6 34 4 30 Z" />
						</svg>
						<div>
							<h3 class="font-serif text-[26px] font-bold">STATUS UPDATE</h3>
							<p class="text-[12px]">See status update below.</p>
							<p class="text-[12px]">
								Questions? <a href="/disclaimer" class="underline">Click here for Decisions Frequently Asked Questions (FAQs).</a>
							</p>
						</div>
					</div>

					<!-- Status Update section -->
					<div class="mt-4 bg-[#FDB515] px-4 py-2 font-serif text-[18px] font-bold text-[#003262]">
						Status Update
					</div>
					<div class="border border-t-0 border-[#FDB515] bg-[#fffdf3] px-6 py-5">
						<p class="text-[13px] text-slate-700">
							New updates to your application were posted {school.statusLastPosted}.
						</p>
						<button
							on:click={handleViewUpdate}
							class="mt-4 bg-[#003262] px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
						>
							Simulated Decisions and Important Updates &gt;&gt;
						</button>
					</div>

					<!-- Forms section -->
					<div class="mt-4 bg-[#FDB515] px-4 py-2 font-serif text-[18px] font-bold text-[#003262]">
						Forms
					</div>
					<div class="border border-t-0 border-[#FDB515] bg-white px-4 py-3">
						<table class="w-full text-[13px]">
							<tbody>
								<tr class="border-b border-slate-200">
									<td class="py-2 text-slate-600">12/14/2026</td>
									<td class="py-2">M.E.T. Supplemental Written Essay</td>
									<td class="py-2 text-right"><a href="/disclaimer" class="text-[#003262] hover:underline">Display</a></td>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- Application Checklist section -->
					<div class="mt-4 bg-[#FDB515] px-4 py-2 font-serif text-[18px] font-bold text-[#003262]">
						Application Checklist
					</div>
					<div class="border border-t-0 border-[#FDB515] bg-white px-4 py-3">
						<table class="w-full text-[13px]">
							<thead>
								<tr class="border-b border-slate-300 text-slate-700">
									<th class="py-2 text-left font-semibold">Status</th>
									<th class="py-2 text-left font-semibold">Details</th>
									<th class="py-2 text-right font-semibold">Date</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-b border-slate-200">
									<td class="py-2"><span class="text-green-600">&#10003;</span> Received</td>
									<td class="py-2">Application</td>
									<td class="py-2 text-right text-slate-600">11/25/2025</td>
								</tr>
								<tr>
									<td class="py-2 text-slate-500">Optional</td>
									<td class="py-2">Photo ID <span class="text-slate-500">(Upload in Material Section Below)</span></td>
									<td class="py-2 text-right text-slate-600">&mdash;</td>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- Upload Materials section -->
					<div class="mt-4 bg-[#FDB515] px-4 py-2 font-serif text-[18px] font-bold text-[#003262]">
						Upload Materials
					</div>
					<div class="border border-t-0 border-[#FDB515] bg-white px-4 py-4">
						<p class="mb-3 text-[13px] text-slate-700">
							Please select the document type below and upload a PDF or scanned image file.
						</p>
						<div class="flex items-center gap-3 text-[13px]">
							<button class="border border-slate-400 bg-slate-100 px-3 py-1 text-slate-700">Choose File</button>
							<span class="text-slate-500">no file selected</span>
							<button class="ml-auto border border-slate-400 bg-slate-100 px-3 py-1 text-slate-700">Upload</button>
						</div>
					</div>
				</div>

				<!-- Right sidebar -->
				<aside class="w-full shrink-0 lg:w-72">
					<div class="bg-[#4a8ba3] px-4 py-2 text-[14px] font-bold text-white">Helpful Links</div>
					<div class="border border-t-0 border-slate-300 bg-white px-4 py-3 text-[13px] text-[#003262]">
						<ul class="space-y-1">
							<li><a href="/disclaimer" class="hover:underline">Application FAQs</a></li>
							<li><a href="/disclaimer" class="hover:underline">Campus Resources</a></li>
							<li><a href="/disclaimer" class="hover:underline">Explore Housing Options</a></li>
							<li><a href="/disclaimer" class="hover:underline">Financial &amp; Scholarships Page</a></li>
							<li><a href="/disclaimer" class="hover:underline">Visit the Campus</a></li>
							<li><a href="/disclaimer" class="hover:underline">Contact Us</a></li>
						</ul>
					</div>

					<div class="mt-4 bg-[#4a8ba3] px-4 py-2 text-[14px] font-bold text-white">Verify Address</div>
					<div class="border border-t-0 border-slate-300 bg-white px-4 py-3 text-[13px] text-slate-700">
						<p class="mb-2">We have your addresses listed below.</p>
						<p class="font-semibold">Mailing Address</p>
						<p class="leading-snug">2847 Birchwood Ln<br />Naperville, IL 60540-4417<br />United States</p>
						<p class="mt-2 font-semibold">Permanent Address</p>
						<p class="leading-snug">2847 Birchwood Ln<br />Naperville, IL 60540-4417<br />United States</p>
						<a href="/disclaimer" class="mt-2 inline-block text-[#003262] hover:underline">Edit Addresses</a>
					</div>

					<div class="mt-4 bg-[#4a8ba3] px-4 py-2 text-[14px] font-bold text-white">Account Tools</div>
					<div class="border border-t-0 border-slate-300 bg-white px-4 py-3 text-[13px] text-[#003262]">
						<ul class="space-y-1">
							<li><a href="/disclaimer" class="hover:underline">Change Email Account</a></li>
							<li><a href="/disclaimer" class="hover:underline">Change Password</a></li>
							<li><a href="/disclaimer" class="hover:underline">Withdraw Application</a></li>
							<li><a href="/disclaimer" class="hover:underline">Privacy Statement</a></li>
							<li><a href="/disclaimer" class="hover:underline">Logout</a></li>
						</ul>
					</div>
				</aside>
			</div>
		</main>

		<!-- Navy footer -->
		<footer class="bg-[#003262] text-slate-200">
			<div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-4">
				<div class="flex gap-3 text-slate-100">
					<a href="/disclaimer" aria-label="Facebook"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.8v8h3.1z"/></svg></a>
					<a href="/disclaimer" aria-label="Twitter"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 4.9c-.8.4-1.7.6-2.6.8a4.5 4.5 0 0 0 2-2.5c-.9.5-1.9.9-2.9 1.1a4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 2.5 3.7a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 18.6a12.7 12.7 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6c.9-.6 1.6-1.4 2.3-2.3z"/></svg></a>
					<a href="/disclaimer" aria-label="Instagram"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2z"/></svg></a>
					<a href="/disclaimer" aria-label="Medium"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><ellipse cx="7" cy="12" rx="3.5" ry="4"/><ellipse cx="15" cy="12" rx="1.6" ry="4"/><ellipse cx="20" cy="12" rx="0.7" ry="4"/></svg></a>
					<a href="/disclaimer" aria-label="TikTok"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 3c.3 2 1.5 3.5 3.5 3.9V10c-1.4 0-2.6-.4-3.5-1v6.5A5.5 5.5 0 1 1 10.5 10v3a2.5 2.5 0 1 0 2.5 2.5V3H16z"/></svg></a>
				</div>
				<div class="text-[13px] leading-relaxed">
					<div class="font-semibold">Office of Undergraduate Admissions</div>
					<div>University of California, Berkeley</div>
					<div>110 Sproul Hall #5800,</div>
					<div>Berkeley, CA 94720-5800</div>
				</div>
				<div class="text-[13px] leading-relaxed">
					<a href="/disclaimer" class="block hover:underline">Events</a>
					<a href="/disclaimer" class="block hover:underline">MAP@Berkeley</a>
					<a href="/disclaimer" class="block hover:underline">Publications</a>
					<a href="/disclaimer" class="block hover:underline">Volunteer</a>
					<a href="/disclaimer" class="block hover:underline">Contact Us</a>
				</div>
				<div class="text-[13px] leading-relaxed">
					<a href="/disclaimer" class="block hover:underline">Privacy Policy</a>
					<a href="/disclaimer" class="block hover:underline">Accessibility</a>
					<a href="/disclaimer" class="block hover:underline">Nondiscrimination</a>
				</div>
			</div>
			<div class="border-t border-white/20">
				<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
					<div class="leading-none text-white">
						<div class="font-serif text-3xl italic">Berkeley</div>
						<div class="text-[9px] tracking-[0.25em] text-slate-300">UNIVERSITY OF CALIFORNIA</div>
					</div>
					<div class="text-[11px] text-slate-300">
						Copyright &copy; 2026 UC Regents; all rights reserved
					</div>
				</div>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<BerkeleyAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<BerkeleyDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
