<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import BrownAccepted from '$lib/components/brown/BrownAccepted.svelte';
	import BrownDenied from '$lib/components/brown/BrownDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'brown';
	const school = {
		schoolName: 'Brown University',
		primaryColor: '#4E3629',
		accentColor: '#ED1C24',
		footerDomain: 'brown.edu',
		statusLastPosted: 'March 15, 2026',
		round: 'Regular Decision',
		referenceNumber: '112579138'
	};

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
	const applicantEmail = () => profile.email || 'applicant@example.com';

	// Default decision when the prediction store has no entry for this slug:
	const DEFAULT_DECISION = 'deny';
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

<div class="min-h-screen bg-white font-serif text-gray-900">
	{#if !authenticated}
		<!-- ============================ LOGIN ============================ -->
		<div class="h-1.5 w-full" style="background-color: {school.accentColor};"></div>
		<header class="border-b border-gray-200 bg-white">
			<div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
				<a href="/disclaimer" class="flex items-center gap-3">
					<svg viewBox="0 0 100 100" class="h-11 w-11" aria-hidden="true">
						<circle cx="50" cy="50" r="48" fill={school.primaryColor} />
						<circle cx="50" cy="50" r="40" fill="none" stroke="#ffffff" stroke-width="1.5" />
						<path d="M26 58 C36 50 46 50 50 54 C54 50 64 50 74 58 L74 44 C64 38 54 38 50 42 C46 38 36 38 26 44 Z" fill="#ffffff" />
						<line x1="50" y1="42" x2="50" y2="54" stroke={school.primaryColor} stroke-width="1.2" />
						<g stroke="#ffffff" stroke-width="1.4">
							<line x1="50" y1="20" x2="50" y2="30" />
							<line x1="34" y1="24" x2="38" y2="32" />
							<line x1="66" y1="24" x2="62" y2="32" />
						</g>
						<circle cx="50" cy="30" r="4" fill="#ffffff" />
					</svg>
					<div class="leading-none">
						<div class="text-2xl font-bold tracking-tight" style="color: {school.primaryColor};">Brown</div>
						<div class="text-[10px] tracking-[0.28em] text-gray-500">UNIVERSITY</div>
					</div>
				</a>
				<nav class="hidden items-center gap-7 text-[15px] text-gray-800 md:flex">
					<a href="/disclaimer" class="hover:opacity-70">Explore Brown</a>
					<a href="/disclaimer" class="hover:opacity-70">Admission &amp; Aid</a>
					<a href="/disclaimer" class="hover:opacity-70">Academics</a>
					<a href="/disclaimer" class="hover:opacity-70">Campus Life</a>
				</nav>
			</div>
		</header>

		<main class="mx-auto min-h-[520px] max-w-6xl px-6 py-14">
			<h1 class="mb-8 text-5xl font-normal text-gray-900">Login</h1>

			<div class="max-w-3xl">
				<div
					class="mb-8 border-l-4 px-4 py-3 text-[13px] text-gray-800"
					style="border-color: {school.accentColor}; background-color: #f7ecdf;"
				>
					To log in, please enter your email address and password.
				</div>

				<form class="space-y-5" on:submit={autoLogin}>
					{#if error}
						<p
							class="border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-6">
						<label for="portal-email" class="w-32 text-[13px] font-bold text-gray-900">
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="w-72 border border-gray-300 bg-[#f2f2f2] px-2 py-1.5 text-[13px]"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-6">
						<label for="portal-password" class="w-32 text-[13px] font-bold text-gray-900">
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="w-72 border border-gray-300 bg-[#f2f2f2] px-2 py-1.5 text-[13px]"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a href="/disclaimer" class="text-[13px] text-gray-700 underline hover:text-gray-900">
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-4 pt-3 pl-[152px]">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="px-5 py-2 text-[13px] font-medium text-white hover:opacity-90"
							style="background-color: {school.primaryColor};"
						>
							Login
						</button>
						</div>

					<p class="max-w-2xl pl-[152px] pt-4 text-[11px] leading-relaxed text-gray-500">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<!-- Footer -->
		<footer class="text-gray-200" style="background-color: {school.primaryColor};">
			<div class="mx-auto max-w-6xl px-6 py-10">
				<div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
					<div class="text-[13px] leading-relaxed">
						<div class="mb-2 text-base font-semibold text-white">Office of College Admission</div>
						Brown University<br />
						Box 1876<br />
						Providence, RI 02912<br />
						Phone: 401-863-2378<br />
						Fax: 401-863-9300
					</div>
					<div class="flex items-center gap-4">
						<a href="/disclaimer" aria-label="Twitter"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 4.9c-.8.4-1.7.6-2.6.8a4.5 4.5 0 0 0 2-2.5c-.9.5-1.9.9-2.9 1.1a4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 2.5 3.7a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 18.6a12.7 12.7 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6c.9-.6 1.6-1.4 2.3-2.3z"/></svg></a>
						<a href="/disclaimer" aria-label="Facebook"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.8v8h3.1z"/></svg></a>
						<a href="/disclaimer" aria-label="Instagram"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2z"/></svg></a>
					</div>
				</div>
				<div class="mt-8 border-t border-white/20 pt-4 text-[12px] text-gray-300">
					&copy; 2026 Brown University
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============================ PORTAL ============================ -->
		<div class="h-1.5 w-full" style="background-color: {school.accentColor};"></div>
		<header class="text-white" style="background-color: {school.primaryColor};">
			<div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
				<div class="flex items-center gap-3">
					<svg viewBox="0 0 100 100" class="h-11 w-11" aria-hidden="true">
						<circle cx="50" cy="50" r="48" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-width="1.5" />
						<path d="M26 58 C36 50 46 50 50 54 C54 50 64 50 74 58 L74 44 C64 38 54 38 50 42 C46 38 36 38 26 44 Z" fill="#ffffff" />
						<line x1="50" y1="42" x2="50" y2="54" stroke={school.primaryColor} stroke-width="1.2" />
						<circle cx="50" cy="30" r="4" fill="#ffffff" />
					</svg>
					<div class="leading-none">
						<div class="text-2xl font-bold tracking-tight text-white">Brown</div>
						<div class="text-[10px] tracking-[0.28em] text-gray-300">UNIVERSITY</div>
					</div>
				</div>
				<div class="text-[12px] text-gray-200">admission.{school.footerDomain}</div>
			</div>
		</header>

		<main class="mx-auto max-w-4xl px-6 pb-16">
			<div class="flex flex-wrap items-start justify-between gap-4 pt-10 pb-6">
				<h1 class="text-3xl font-normal text-gray-900">Applicant Status Portal</h1>
				<div class="text-right text-[13px] text-gray-700">
					<div class="font-semibold text-gray-900">{applicantName()}</div>
					<a
						href="/disclaimer"
						class="mt-1 inline-block font-semibold"
						style="color: {school.accentColor};">Logout</a
					>
				</div>
			</div>

			<!-- Status Update -->
			<section class="mb-8 border border-gray-200">
				<div
					class="border-b-2 px-5 py-3 text-lg font-semibold text-white"
					style="background-color: {school.primaryColor}; border-color: {school.accentColor};"
				>
					Status Update
				</div>
				<div class="px-5 py-6">
					<p class="text-[15px] text-gray-700">
						An update to your application was last posted {school.statusLastPosted}.
					</p>
					<button
						on:click={handleViewUpdate}
						class="mt-5 inline-flex items-center gap-2 px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
						style="background-color: {school.accentColor};"
					>
						Your Admission Decision &gt;&gt;
					</button>
				</div>
			</section>

			<!-- Your Information -->
			<section class="mb-8 border border-gray-200">
				<div
					class="border-b border-gray-200 bg-gray-100 px-5 py-3 text-lg font-semibold text-gray-800"
				>
					Your Information
				</div>
				<div class="px-5 py-5 text-[14px] text-gray-700">
					<dl class="space-y-2">
						<div class="flex gap-2">
							<dt class="w-32 font-semibold text-gray-900">Reference ID:</dt>
							<dd>{school.referenceNumber}</dd>
						</div>
						<div class="flex gap-2">
							<dt class="w-32 font-semibold text-gray-900">Name:</dt>
							<dd>{applicantName()}</dd>
						</div>
						<div class="flex gap-2">
							<dt class="w-32 font-semibold text-gray-900">Email:</dt>
							<dd>{applicantEmail()}</dd>
						</div>
						<div class="flex gap-2">
							<dt class="w-32 font-semibold text-gray-900">Round:</dt>
							<dd>{school.round}</dd>
						</div>
					</dl>
				</div>
			</section>
		</main>

		<!-- Footer -->
		<footer class="text-gray-200" style="background-color: {school.primaryColor};">
			<div class="mx-auto max-w-6xl px-6 py-10">
				<div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
					<div class="text-[13px] leading-relaxed">
						<div class="mb-2 text-base font-semibold text-white">Office of College Admission</div>
						Brown University<br />
						Box 1876<br />
						Providence, RI 02912<br />
						Phone: 401-863-2378<br />
						Fax: 401-863-9300
					</div>
					<div class="flex items-center gap-4">
						<a href="/disclaimer" aria-label="Twitter"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 4.9c-.8.4-1.7.6-2.6.8a4.5 4.5 0 0 0 2-2.5c-.9.5-1.9.9-2.9 1.1a4.5 4.5 0 0 0-7.7 4.1A12.8 12.8 0 0 1 2.5 3.7a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 18.6a12.7 12.7 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6c.9-.6 1.6-1.4 2.3-2.3z"/></svg></a>
						<a href="/disclaimer" aria-label="Facebook"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.8v8h3.1z"/></svg></a>
						<a href="/disclaimer" aria-label="Instagram"><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2z"/></svg></a>
					</div>
				</div>
				<div class="mt-8 border-t border-white/20 pt-4 text-[12px] text-gray-300">
					&copy; 2026 Brown University
				</div>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<BrownAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<BrownDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
