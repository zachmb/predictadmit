<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// Campus hero image
	import RiceImage from '$lib/assets/ricecampus-beautifulsunset2022-2560x1728.jpeg';

	// School-Specific Components (Decision Letters)
	import RiceAccepted from '$lib/components/rice/RiceAccepted.svelte';
	import RiceDenied from '$lib/components/rice/RiceDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'rice';
	const school = {
		schoolName: 'Rice University',
		primaryColor: '#00205B',
		accentGray: '#7C7E7F',
		footerDomain: 'rice.edu',
		statusLastPosted: 'March 16, 2026',
		round: 'Regular Decision',
		referenceNumber: '471590263'
	};

	// A lighter steel blue used by Rice for section headings / links.
	const headingBlue = '#4a7ab5';
	const linkGreen = '#8ba63f';

	// The Rice shield mark (navy shield, white chevron, three owls).
	const shieldSvg = `
		<svg viewBox="0 0 120 148" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path d="M6 6 H114 V86 C114 118 88 136 60 146 C32 136 6 118 6 86 Z" fill="#1b2f66"/>
			<path d="M22 84 L60 56 L98 84 L98 100 L60 72 L22 100 Z" fill="#ffffff"/>
			<g fill="#ffffff">
				<ellipse cx="30" cy="34" rx="9" ry="11"/>
				<ellipse cx="90" cy="34" rx="9" ry="11"/>
				<ellipse cx="60" cy="118" rx="9" ry="11"/>
			</g>
			<g fill="#1b2f66">
				<circle cx="26" cy="32" r="2.2"/><circle cx="34" cy="32" r="2.2"/>
				<circle cx="86" cy="32" r="2.2"/><circle cx="94" cy="32" r="2.2"/>
				<circle cx="56" cy="116" r="2.2"/><circle cx="64" cy="116" r="2.2"/>
			</g>
		</svg>`;

	// --- State Variables ---
	let profile: UserProfile = { ...defaultProfile };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;

	// Subscribe to the global user profile store
	$: profile = $userProfile;

	// Dynamic Data Helpers
	const applicantName = () => profile.name || 'Applicant';
	const firstName = () => (profile.name || 'Applicant').split(' ')[0];

	// Application checklist rows (from the real Rice applicant portal capture).
	const checklist = [
		{ detail: 'Application Fee', date: '01/06/2026', link: false },
		{ detail: 'Common Application', date: '01/06/2026', link: false },
		{ detail: 'Common Application Writing Supplement', date: '01/06/2026', link: true },
		{ detail: 'Mid-year Grades', date: '01/28/2026', link: false },
		{ detail: 'High School Transcript', date: '01/06/2026', link: false },
		{ detail: 'SAT or ACT', date: '01/06/2026', link: false },
		{ detail: 'Counselor Recommendation', date: '01/06/2026', link: false },
		{ detail: 'School Report', date: '01/06/2026', link: false },
		{ detail: 'Teacher Evaluation - First', date: '01/11/2026', link: false },
		{ detail: 'Teacher Evaluation - Second', date: '01/11/2026', link: false }
	];

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
</script>

<svelte:head>
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen bg-white font-sans text-gray-900">
	{#if !authenticated}
		<!-- ============================ LOGIN ============================ -->
		<header class="border-b border-gray-100 bg-white">
			<div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
				<a href="/disclaimer" class="flex items-center gap-3">
					<span class="h-11 w-9">{@html shieldSvg}</span>
					<span class="leading-tight">
						<span
							class="block text-[13px] font-semibold tracking-[0.18em]"
							style="color: {school.primaryColor};">RICE UNIVERSITY</span
						>
						<span class="block text-[22px] font-normal" style="color: {school.accentGray};"
							>Office of Admission</span
						>
					</span>
				</a>
				<a
					href="/disclaimer"
					class="flex items-center gap-2 text-[15px]"
					style="color: {school.primaryColor};"
				>
					Menu
					<span class="flex flex-col gap-[3px]">
						<span class="block h-[2px] w-5 bg-current"></span>
						<span class="block h-[2px] w-5 bg-current"></span>
						<span class="block h-[2px] w-5 bg-current"></span>
					</span>
				</a>
			</div>
		</header>

		<!-- Hero (campus aerial) -->
		<div class="h-64 w-full bg-cover bg-center" style="background-image: url({RiceImage});"></div>

		<main class="mx-auto min-h-[420px] max-w-5xl px-6 py-12">
			<h1 class="mb-6 text-5xl font-extrabold tracking-tight" style="color: {headingBlue};">
				LOGIN
			</h1>

			<div class="max-w-4xl">
				<div
					class="mb-7 border-l-4 px-4 py-3 text-[14px] text-gray-800"
					style="border-color: {linkGreen}; background-color: #e6efc9;"
				>
					To log in, please enter your email address and password.
				</div>

				<form class="space-y-4" on:submit={autoLogin}>
					{#if error}
						<p
							class="border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-6">
						<label for="portal-email" class="w-40 text-[13px] font-bold uppercase text-gray-900">
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="w-72 border border-gray-400 bg-white px-2 py-1.5 text-[14px]"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-6">
						<label for="portal-password" class="w-40 text-[13px] font-bold uppercase text-gray-900">
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="w-72 border border-gray-400 bg-white px-2 py-1.5 text-[14px]"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a href="/disclaimer" class="text-[14px] hover:underline" style="color: {linkGreen};">
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-4 pt-3 pl-[184px]">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="border border-gray-400 bg-[#e6e6e6] px-6 py-1.5 text-[13px] font-medium text-gray-900 hover:bg-[#d9d9d9]"
						>
							Login
						</button>
						</div>

					<p class="max-w-2xl pl-[184px] pt-3 text-[11px] leading-relaxed text-gray-500">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<!-- Blue contact bar -->
		<footer style="background-color: {school.primaryColor};" class="text-white">
			<div
				class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 text-[13px] md:flex-row md:items-center md:gap-12"
			>
				<div class="flex items-center gap-4">
					<a href="/disclaimer" aria-label="Facebook"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.8v8h3.1z"/></svg></a>
					<a href="/disclaimer" aria-label="YouTube"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.5.5-3 .5-4.5s-.1-3-.5-4.5zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z"/></svg></a>
					<a href="/disclaimer" aria-label="X"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.9 2H22l-7.3 8.3L23 22h-6.8l-5.3-6.9L4.8 22H1.7l7.8-8.9L1 2h7l4.8 6.3L18.9 2zm-2.4 18h1.9L7.6 4H5.6l10.9 16z"/></svg></a>
					<a href="/disclaimer" aria-label="Instagram"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4zm0 8.6a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8zm6.6-8.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/></svg></a>
				</div>
				<div class="flex flex-col gap-6 sm:flex-row sm:gap-14">
					<div>
						<div class="text-[13px] font-semibold tracking-wide text-white/80">CALL</div>
						<div class="mt-1 text-[15px]">713-348-7423</div>
					</div>
					<div>
						<div class="text-[13px] font-semibold tracking-wide text-white/80">EMAIL</div>
						<div class="mt-1 text-[15px]">admission@rice.edu</div>
					</div>
					<div>
						<div class="text-[13px] font-semibold tracking-wide text-white/80">HOURS</div>
						<div class="mt-1 text-[15px]">M-F 8:30 a.m. to 5 p.m. CT</div>
					</div>
				</div>
			</div>
		</footer>

		<!-- Bottom wordmark footer -->
		<div class="bg-white">
			<div class="mx-auto max-w-6xl px-6 py-10">
				<div class="flex items-center gap-5">
					<span class="h-16 w-14">{@html shieldSvg}</span>
					<span class="text-5xl font-normal tracking-tight" style="color: {school.primaryColor};"
						>RICE UNIVERSITY</span
					>
				</div>
				<div class="mt-6 text-[11px] font-semibold tracking-[0.15em] text-gray-500">
					RICE UNIVERSITY
				</div>
				<p class="mt-2 text-[11px] leading-relaxed text-gray-400">
					6100 Main St., Houston, TX 77005-1892 | Mailing Address: P.O. Box 1892, Houston, TX
					77251-1892 | 713-348-0000 |
					<a href="/disclaimer" class="underline">Privacy Policy</a>
					|
					<a href="/disclaimer" class="underline">Web Accessibility</a>
					|
					<a href="/disclaimer" class="underline">Campus Carry</a>
				</p>
			</div>
		</div>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============================ PORTAL ============================ -->
		<header class="border-b border-gray-100 bg-white">
			<div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
				<div class="flex items-center gap-3">
					<span class="h-11 w-9">{@html shieldSvg}</span>
					<span class="leading-tight">
						<span
							class="block text-[13px] font-semibold tracking-[0.18em]"
							style="color: {school.primaryColor};">RICE UNIVERSITY</span
						>
						<span class="block text-[22px] font-normal" style="color: {school.accentGray};"
							>Office of Admission</span
						>
					</span>
				</div>
				<a
					href="/disclaimer"
					class="flex items-center gap-2 text-[15px]"
					style="color: {school.primaryColor};"
				>
					Menu
					<span class="flex flex-col gap-[3px]">
						<span class="block h-[2px] w-5 bg-current"></span>
						<span class="block h-[2px] w-5 bg-current"></span>
						<span class="block h-[2px] w-5 bg-current"></span>
					</span>
				</a>
			</div>
		</header>

		<!-- Hero (campus aerial) -->
		<div class="h-64 w-full bg-cover bg-center" style="background-image: url({RiceImage});"></div>

		<!-- Applicant / logout row -->
		<div class="mx-auto max-w-6xl px-6 pt-3 text-right text-[15px]">
			<span style="color: {school.accentGray};">{applicantName()}</span>
			<a href="/disclaimer" class="ml-3" style="color: {linkGreen};">Logout</a>
		</div>

		<!-- Top navigation -->
		<nav class="mx-auto mt-4 max-w-6xl px-6">
			<div
				class="flex flex-wrap items-center gap-x-10 gap-y-2 border-t border-b border-gray-100 py-4"
			>
				{#each ['My Application', 'My Financial Aid', 'My Test Scores', 'My Interview', 'My Account', 'Contact Us'] as item}
					<a
						href="/disclaimer"
						class="flex items-center gap-1 text-[13px] font-bold uppercase tracking-wide"
						style="color: {school.primaryColor};"
					>
						{item}
						<span style="color: {linkGreen};">&rsaquo;</span>
					</a>
				{/each}
			</div>
		</nav>

		<!-- Welcome band -->
		<div style="background-color: {school.primaryColor};" class="mt-6 py-12 text-center text-white">
			<h1 class="text-4xl font-extrabold uppercase tracking-wide">Welcome, {firstName()}</h1>
			<p class="mx-auto mt-3 max-w-2xl px-6 text-[14px] leading-relaxed text-white/85">
				Use your <span class="font-semibold">Rice Admission Student Portal</span> to track your
				admission and financial aid progress, submit required materials, request an optional
				admission interview, and more.
			</p>
		</div>

		<main class="mx-auto max-w-6xl px-6 pb-16 pt-10">
			<div class="flex flex-col gap-10 md:flex-row">
				<!-- Main column -->
				<section class="flex-1">
					<h2 class="text-2xl font-extrabold uppercase tracking-wide" style="color: {headingBlue};">
						Status Update
					</h2>
					<p class="mt-3 text-[15px] text-gray-700">
						An update to your application was last posted {school.statusLastPosted}.
					</p>
					<button
						on:click={handleViewUpdate}
						class="mt-3 text-[15px] underline hover:opacity-80"
						style="color: {headingBlue};"
					>
						View Update &gt;&gt;
					</button>

					<h2
						class="mt-10 text-2xl font-extrabold uppercase tracking-wide"
						style="color: {headingBlue};"
					>
						Application Checklist
					</h2>
					<table class="mt-4 w-full border border-gray-200 text-left text-[14px]">
						<thead>
							<tr class="bg-gray-100 text-[12px] font-bold uppercase tracking-wide text-gray-700">
								<th class="px-4 py-3">Status</th>
								<th class="px-4 py-3">Details</th>
								<th class="px-4 py-3">Date</th>
							</tr>
						</thead>
						<tbody>
							{#each checklist as row}
								<tr class="border-t border-gray-200">
									<td class="px-4 py-3">
										<span class="flex items-center gap-2 text-gray-700">
											<svg
												class="h-4 w-4 text-green-600"
												fill="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true"
												><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" /></svg
											>
											Received
										</span>
									</td>
									<td class="px-4 py-3">
										{#if row.link}
											<a href="/disclaimer" class="underline" style="color: {headingBlue};"
												>{row.detail}</a
											>
										{:else}
											<span class="text-gray-800">{row.detail}</span>
										{/if}
									</td>
									<td class="px-4 py-3 text-gray-700">{row.date}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</section>

				<!-- Sidebar -->
				<aside class="w-full shrink-0 md:w-72">
					<h3
						class="text-[13px] font-bold uppercase tracking-wide"
						style="color: {school.primaryColor};"
					>
						Your Application Profile
					</h3>
					<div class="mt-3 space-y-3 text-[13px] leading-relaxed text-gray-700">
						<div>
							<div class="font-semibold text-gray-800">{applicantName()}</div>
							<div>ID: {school.referenceNumber}</div>
							<div>zacharybasingercollege@gmail.com</div>
						</div>
						<div>
							2847 Birchwood Ln<br />
							Naperville, IL 60540-4417<br />
							United States
						</div>
						<div>
							2026 Fall - {school.round}<br />
							Business Division
						</div>
					</div>

					<h3
						class="mt-8 text-[13px] font-bold uppercase tracking-wide"
						style="color: {school.primaryColor};"
					>
						Additional Resources
					</h3>
					<div class="mt-3 flex flex-col gap-2 text-[13px]">
						{#each ['Virtual Events', 'On-Campus Visits', 'Important Dates', 'Admission Blog'] as res}
							<a
								href="/disclaimer"
								class="uppercase tracking-wide underline"
								style="color: {headingBlue};">{res}</a
							>
						{/each}
					</div>
				</aside>
			</div>
		</main>

		<!-- Blue contact bar -->
		<footer style="background-color: {school.primaryColor};" class="text-white">
			<div
				class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 text-[13px] md:flex-row md:items-center md:gap-12"
			>
				<div class="flex items-center gap-4">
					<a href="/disclaimer" aria-label="Facebook"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.8v8h3.1z"/></svg></a>
					<a href="/disclaimer" aria-label="YouTube"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.5.5-3 .5-4.5s-.1-3-.5-4.5zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z"/></svg></a>
					<a href="/disclaimer" aria-label="X"><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.9 2H22l-7.3 8.3L23 22h-6.8l-5.3-6.9L4.8 22H1.7l7.8-8.9L1 2h7l4.8 6.3L18.9 2zm-2.4 18h1.9L7.6 4H5.6l10.9 16z"/></svg></a>
					<a href="/disclaimer" aria-label="Instagram"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4zm0 8.6a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8zm6.6-8.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/></svg></a>
				</div>
				<div class="flex flex-col gap-6 sm:flex-row sm:gap-14">
					<div>
						<div class="text-[13px] font-semibold tracking-wide text-white/80">CALL</div>
						<div class="mt-1 text-[15px]">713-348-7423</div>
					</div>
					<div>
						<div class="text-[13px] font-semibold tracking-wide text-white/80">EMAIL</div>
						<div class="mt-1 text-[15px]">admission@rice.edu</div>
					</div>
					<div>
						<div class="text-[13px] font-semibold tracking-wide text-white/80">HOURS</div>
						<div class="mt-1 text-[15px]">M-F 8:30 a.m. to 5 p.m. CT</div>
					</div>
				</div>
			</div>
		</footer>

		<!-- Bottom wordmark footer -->
		<div class="bg-white">
			<div class="mx-auto max-w-6xl px-6 py-10">
				<div class="flex items-center gap-5">
					<span class="h-16 w-14">{@html shieldSvg}</span>
					<span class="text-5xl font-normal tracking-tight" style="color: {school.primaryColor};"
						>RICE UNIVERSITY</span
					>
				</div>
				<div class="mt-6 text-[11px] font-semibold tracking-[0.15em] text-gray-500">
					RICE UNIVERSITY
				</div>
				<p class="mt-2 text-[11px] leading-relaxed text-gray-400">
					6100 Main St., Houston, TX 77005-1892 | Mailing Address: P.O. Box 1892, Houston, TX
					77251-1892 | 713-348-0000 |
					<a href="/disclaimer" class="underline">Privacy Policy</a>
					|
					<a href="/disclaimer" class="underline">Web Accessibility</a>
					|
					<a href="/disclaimer" class="underline">Campus Carry</a>
				</p>
			</div>
		</div>
	{:else if shownDecision === 'admit'}
		<RiceAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<RiceDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
