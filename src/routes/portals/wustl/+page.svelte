<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import WashUAccepted from '$lib/components/washu/WashUAccepted.svelte';
	import WashUDenied from '$lib/components/washu/WashUDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'wustl';
	const school = {
		schoolName: 'Washington University in St. Louis',
		primaryColor: '#A51417',
		accentColor: '#007360',
		footerDomain: 'wustl.edu',
		statusLastPosted: 'March 18, 2026',
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
</script>

<svelte:head>
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen bg-white font-serif text-gray-900">
	{#if !authenticated}
		<!-- ============================ LOGIN ============================ -->
		<div class="h-1.5 w-full" style="background-color: {school.primaryColor};"></div>
		<header class="bg-white">
			<div class="mx-auto flex h-16 max-w-6xl items-center px-6">
				<a href="/disclaimer" class="flex items-center gap-2.5">
					<svg viewBox="0 0 64 74" class="h-8 w-8" aria-hidden="true">
						<path d="M4 3 H60 V36 C60 55 47 67 32 73 C17 67 4 55 4 36 Z" fill="white" stroke={school.primaryColor} stroke-width="2.5" />
						<path d="M4 3 H60 V15 H4 Z" fill={school.primaryColor} />
						<rect x="11" y="6.5" width="6" height="6" fill="white" />
						<rect x="29" y="6.5" width="6" height="6" fill="white" />
						<rect x="47" y="6.5" width="6" height="6" fill="white" />
						<path d="M14 24 L32 34 L50 24" fill="none" stroke={school.primaryColor} stroke-width="2.5" />
						<path d="M14 40 L32 50 L50 40" fill="none" stroke={school.primaryColor} stroke-width="2.5" />
					</svg>
					<span class="text-3xl font-normal text-gray-900" style="font-family: Georgia, 'Times New Roman', serif;">WashU</span>
				</a>
			</div>
		</header>

		<main class="mx-auto min-h-[520px] max-w-6xl px-6 py-12">
			<h1 class="mb-6 text-5xl font-bold text-gray-900">Login</h1>

			<div
				class="mb-8 border-l-4 px-5 py-4 text-[15px] font-semibold text-gray-800"
				style="border-color: {school.accentColor}; background-color: #eaf3d9;"
			>
				To log in, please enter your email address and password.
			</div>

			<form class="max-w-2xl space-y-4" on:submit={autoLogin}>
				{#if error}
					<p
						class="border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800"
						role="alert"
					>
						{error}
					</p>
				{/if}

				<div class="flex items-center gap-6">
					<label for="portal-email" class="w-32 text-[15px] text-gray-900">
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
					<label for="portal-password" class="w-32 text-[15px] text-gray-900">
						Password
					</label>
					<input
						id="portal-password"
						type="password"
						class="w-72 border border-gray-400 bg-white px-2 py-1.5 text-[14px]"
						bind:value={passwordInput}
						autocomplete="current-password"
					/>
					<a
						href="/disclaimer"
						class="text-[16px] font-semibold underline"
						style="color: {school.primaryColor};"
					>
						Forgot Your Password?
					</a>
				</div>

				<div class="flex items-center gap-4 pt-2">
					<button
						type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
						class="border border-gray-400 bg-gradient-to-b from-gray-100 to-gray-300 px-6 py-2 text-[16px] font-medium text-gray-900 hover:from-gray-200 hover:to-gray-400"
					>
						Login
					</button>
					</div>

				<p class="max-w-2xl pt-3 text-[11px] leading-relaxed text-gray-500">
					For this simulation, use the same email address and password that you saved on the
					PredictAdmit.com home page. No real application data is used, and all information is stored
					only in your browser.
				</p>
			</form>
		</main>

		<!-- Footer -->
		<footer class="bg-black text-white">
			<div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2">
				<div class="font-sans text-[13px] leading-relaxed text-gray-200">
					<div>MSC 1089-105-05</div>
					<div>One Brookings Drive</div>
					<div>St. Louis, MO 63130-4899</div>
					<div class="mt-4">314-935-6000 | 800-638-0700</div>
					<a href="/disclaimer" class="underline">admissions@{school.footerDomain}</a>
					<div class="mt-4 flex items-center gap-2.5">
						<a href="/disclaimer" aria-label="Facebook" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.8v8h3.1z"/></svg></a>
						<a href="/disclaimer" aria-label="X" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18.9 2H22l-7.5 8.6L23 22h-6.9l-5.4-7-6.2 7H1.4l8-9.2L1 2h7l4.9 6.5L18.9 2zM17.7 20h1.9L7.4 4H5.4L17.7 20z"/></svg></a>
						<a href="/disclaimer" aria-label="YouTube" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.5.5-3 .5-4.5s-.1-3-.5-4.5zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z"/></svg></a>
						<a href="/disclaimer" aria-label="Instagram" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.1a6.7 6.7 0 1 0 0 13.4 6.7 6.7 0 0 0 0-13.4zm0 11a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6zm6.5-11.3a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0z"/></svg></a>
						<a href="/disclaimer" aria-label="Snapchat" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c2.7 0 4.9 2.2 4.9 4.9 0 .6 0 1.5-.1 2.3.2.1.5.2.8.2.5 0 1-.3 1.4-.5.1-.1.3-.1.4-.1.4 0 .8.3.8.7 0 .3-.2.6-.7.8-.4.2-1.2.4-1.4.9-.1.3 0 .6.2.9.5.9 1.4 1.7 2.5 2 .3.1.5.3.5.6 0 .5-1 .9-1.7 1-.1.2-.1.5-.2.7-.1.2-.2.3-.5.3-.4 0-.9-.2-1.6-.2-.9 0-1.3.1-1.9.6-.6.5-1.4 1.1-2.7 1.1s-2.1-.6-2.7-1.1c-.6-.5-1-.6-1.9-.6-.7 0-1.2.2-1.6.2-.3 0-.4-.1-.5-.3-.1-.2-.1-.5-.2-.7-.7-.1-1.7-.5-1.7-1 0-.3.2-.5.5-.6 1.1-.3 2-1.1 2.5-2 .2-.3.3-.6.2-.9-.2-.5-1-.7-1.4-.9-.5-.2-.7-.5-.7-.8 0-.4.4-.7.8-.7.1 0 .3 0 .4.1.4.2.9.5 1.4.5.3 0 .6-.1.8-.2-.1-.8-.1-1.7-.1-2.3C7.1 4.2 9.3 2 12 2z"/></svg></a>
						<a href="/disclaimer" aria-label="TikTok" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 0h-3.3v13.6a2.3 2.3 0 1 1-2.3-2.3c.2 0 .4 0 .6.1V8a5.6 5.6 0 1 0 4.7 5.5V6.7a6.7 6.7 0 0 0 3.9 1.2V4.6a3.9 3.9 0 0 1-3.6-4.6z"/></svg></a>
					</div>
				</div>
				<div>
					<h2 class="mb-3 font-sans text-[15px] font-bold tracking-wide text-white">RESOURCES</h2>
					<ul class="space-y-2 font-sans text-[13px]">
						<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">Admissions</a></li>
						<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">Financial Aid</a></li>
						<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">College Prep Program</a></li>
						<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">Academics</a></li>
						<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">Report Website Issue</a></li>
					</ul>
				</div>
			</div>
			<div class="border-t border-gray-700">
				<div class="mx-auto max-w-6xl px-6 py-4 font-sans text-[12px] text-gray-300">
					&copy;2025 Washington University in St. Louis
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ============================ PORTAL ============================ -->
		<div class="h-1.5 w-full" style="background-color: {school.primaryColor};"></div>
		<header class="bg-white">
			<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
				<div class="flex items-center gap-2.5">
					<svg viewBox="0 0 64 74" class="h-8 w-8" aria-hidden="true">
						<path d="M4 3 H60 V36 C60 55 47 67 32 73 C17 67 4 55 4 36 Z" fill="white" stroke={school.primaryColor} stroke-width="2.5" />
						<path d="M4 3 H60 V15 H4 Z" fill={school.primaryColor} />
						<rect x="11" y="6.5" width="6" height="6" fill="white" />
						<rect x="29" y="6.5" width="6" height="6" fill="white" />
						<rect x="47" y="6.5" width="6" height="6" fill="white" />
						<path d="M14 24 L32 34 L50 24" fill="none" stroke={school.primaryColor} stroke-width="2.5" />
						<path d="M14 40 L32 50 L50 40" fill="none" stroke={school.primaryColor} stroke-width="2.5" />
					</svg>
					<span class="text-3xl font-normal text-gray-900" style="font-family: Georgia, 'Times New Roman', serif;">WashU</span>
				</div>
			</div>
		</header>

		<main class="mx-auto max-w-5xl px-6 pb-16 pt-6">
			<div class="mb-2 text-right text-[13px] text-gray-700">
				<span class="font-semibold">{applicantName()}</span>
				<a href="/disclaimer" class="ml-2 text-[12px] underline" style="color: {school.primaryColor};">Logout</a>
			</div>

			<div class="flex flex-col gap-10 md:flex-row">
				<!-- Main column -->
				<section class="flex-1">
					<h1 class="border-b border-gray-300 pb-3 text-2xl font-bold text-gray-900">
						WashU Pathway for {applicantName()}
					</h1>

					<h2 class="mt-5 text-[15px] font-bold text-gray-900">Status Update</h2>
					<p class="mt-2 text-[14px] text-gray-700">
						An update to your application was last posted {school.statusLastPosted}.
					</p>
					<button
						on:click={handleViewUpdate}
						class="mt-3 text-[15px] font-bold underline"
						style="color: {school.primaryColor};"
					>
						View Update &gt;&gt;
					</button>
					<div class="mt-4 border-b border-gray-300"></div>
				</section>

				<!-- Right sidebar -->
				<aside class="w-full shrink-0 md:w-72">
					<a
						href="/disclaimer"
						class="mb-6 inline-block px-4 py-2 font-sans text-[13px] font-semibold text-white"
						style="background-color: {school.primaryColor};"
					>
						Go to the Financial Aid Portal
					</a>

					<h3 class="mt-2 text-xl font-bold text-gray-900">Questions?</h3>
					<p class="mt-2 text-[13px] leading-relaxed text-gray-700">
						If you have questions about your application checklist, or if you have a change to your
						mailing address or email, contact your Admissions Services Coordinator:
					</p>
					<div class="mt-3 flex h-40 w-full items-end justify-center bg-gray-200">
						<svg viewBox="0 0 24 24" class="h-28 w-28 text-gray-400" fill="currentColor" aria-hidden="true">
							<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.7-8 6v2h16v-2c0-3.3-3.6-6-8-6z" />
						</svg>
					</div>
					<div class="mt-2 text-[13px] leading-relaxed text-gray-800">
						<div class="font-semibold">Meagan Vines</div>
						<div>314-935-5422</div>
						<a href="/disclaimer" class="underline" style="color: {school.primaryColor};">admissions@{school.footerDomain}</a>
						<div class="italic text-gray-500">She/Her/Hers</div>
					</div>

					<h3 class="mt-6 text-xl font-bold text-gray-900">Your Admissions Officer</h3>
					<div class="mt-3 flex h-40 w-full items-end justify-center bg-gray-200">
						<svg viewBox="0 0 24 24" class="h-28 w-28 text-gray-400" fill="currentColor" aria-hidden="true">
							<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.7-8 6v2h16v-2c0-3.3-3.6-6-8-6z" />
						</svg>
					</div>
					<div class="mt-2 text-[13px] leading-relaxed text-gray-800">
						<div class="font-semibold">Morgan Farrar</div>
						<div>Senior Assistant Director of Admissions</div>
						<a href="/disclaimer" class="underline" style="color: {school.primaryColor};">farrar@{school.footerDomain}</a>
						<div class="italic text-gray-500">She/Her/Hers</div>
					</div>
				</aside>
			</div>
		</main>

		<!-- Footer -->
		<footer class="bg-black text-white">
			<div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2">
				<div class="font-sans text-[13px] leading-relaxed text-gray-200">
					<div>MSC 1089-105-05</div>
					<div>One Brookings Drive</div>
					<div>St. Louis, MO 63130-4899</div>
					<div class="mt-4">314-935-6000 | 800-638-0700</div>
					<a href="/disclaimer" class="underline">admissions@{school.footerDomain}</a>
					<div class="mt-4 flex items-center gap-2.5">
						<a href="/disclaimer" aria-label="Facebook" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.8v8h3.1z"/></svg></a>
						<a href="/disclaimer" aria-label="X" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18.9 2H22l-7.5 8.6L23 22h-6.9l-5.4-7-6.2 7H1.4l8-9.2L1 2h7l4.9 6.5L18.9 2zM17.7 20h1.9L7.4 4H5.4L17.7 20z"/></svg></a>
						<a href="/disclaimer" aria-label="YouTube" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.5.5-3 .5-4.5s-.1-3-.5-4.5zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z"/></svg></a>
						<a href="/disclaimer" aria-label="Instagram" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.1a6.7 6.7 0 1 0 0 13.4 6.7 6.7 0 0 0 0-13.4zm0 11a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6zm6.5-11.3a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0z"/></svg></a>
						<a href="/disclaimer" aria-label="Snapchat" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c2.7 0 4.9 2.2 4.9 4.9 0 .6 0 1.5-.1 2.3.2.1.5.2.8.2.5 0 1-.3 1.4-.5.1-.1.3-.1.4-.1.4 0 .8.3.8.7 0 .3-.2.6-.7.8-.4.2-1.2.4-1.4.9-.1.3 0 .6.2.9.5.9 1.4 1.7 2.5 2 .3.1.5.3.5.6 0 .5-1 .9-1.7 1-.1.2-.1.5-.2.7-.1.2-.2.3-.5.3-.4 0-.9-.2-1.6-.2-.9 0-1.3.1-1.9.6-.6.5-1.4 1.1-2.7 1.1s-2.1-.6-2.7-1.1c-.6-.5-1-.6-1.9-.6-.7 0-1.2.2-1.6.2-.3 0-.4-.1-.5-.3-.1-.2-.1-.5-.2-.7-.7-.1-1.7-.5-1.7-1 0-.3.2-.5.5-.6 1.1-.3 2-1.1 2.5-2 .2-.3.3-.6.2-.9-.2-.5-1-.7-1.4-.9-.5-.2-.7-.5-.7-.8 0-.4.4-.7.8-.7.1 0 .3 0 .4.1.4.2.9.5 1.4.5.3 0 .6-.1.8-.2-.1-.8-.1-1.7-.1-2.3C7.1 4.2 9.3 2 12 2z"/></svg></a>
						<a href="/disclaimer" aria-label="TikTok" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 0h-3.3v13.6a2.3 2.3 0 1 1-2.3-2.3c.2 0 .4 0 .6.1V8a5.6 5.6 0 1 0 4.7 5.5V6.7a6.7 6.7 0 0 0 3.9 1.2V4.6a3.9 3.9 0 0 1-3.6-4.6z"/></svg></a>
					</div>
				</div>
				<div>
					<h2 class="mb-3 font-sans text-[15px] font-bold tracking-wide text-white">RESOURCES</h2>
					<ul class="space-y-2 font-sans text-[13px]">
						<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">Admissions</a></li>
						<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">Financial Aid</a></li>
						<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">College Prep Program</a></li>
						<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">Academics</a></li>
						<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">Report Website Issue</a></li>
					</ul>
				</div>
			</div>
			<div class="border-t border-gray-700">
				<div class="mx-auto max-w-6xl px-6 py-4 font-sans text-[12px] text-gray-300">
					&copy;2025 Washington University in St. Louis
				</div>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<WashUAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<WashUDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
