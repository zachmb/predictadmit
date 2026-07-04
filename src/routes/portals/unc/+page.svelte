<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import UNCAccepted from '$lib/components/unc/UNCAccepted.svelte';
	import UNCDenied from '$lib/components/unc/UNCDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'unc';
	const CAROLINA_BLUE = '#4B9CD3';
	const CAROLINA_NAVY = '#13294B';

	const school = {
		schoolName: 'University of North Carolina at Chapel Hill',
		primaryColor: CAROLINA_BLUE,
		footerDomain: 'unc.edu',
		statusLastPosted: 'March 20, 2026',
		round: 'Regular Decision',
		referenceNumber: '73158240'
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

<div class="min-h-screen bg-white font-sans text-gray-800">
	{#if !hasViewedUpdate}
	<!-- Shared header -->
	<header style="background-color: {CAROLINA_NAVY};" class="w-full">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-2.5">
			<div class="flex items-center gap-3">
				<span
					class="font-serif text-3xl font-black leading-none tracking-tighter"
					style="color: {CAROLINA_BLUE};"
				>
					NC
				</span>
				<div class="border-l border-white/30 pl-3 font-serif text-[10px] leading-tight text-white">
					The University<br />of North Carolina<br />at Chapel Hill
				</div>
			</div>
		</div>
	</header>

	<!-- Shared hero: the Old Well -->
	<div class="mx-auto max-w-6xl px-6 pt-6">
		<div
			class="relative flex h-24 w-full items-end justify-center overflow-hidden rounded-sm"
			style="background: linear-gradient(180deg,#3f6b2f 0%,#4e7c33 45%,#6f8a3f 70%,#b7a06a 100%);"
		>
			<!-- azalea beds -->
			<div class="pointer-events-none absolute bottom-1 left-0 right-0 flex justify-between px-4 opacity-80">
				{#each Array(28) as _, i}
					<span class="h-1.5 w-1.5 rounded-full" style="background:{i % 3 === 0 ? '#c0392b' : '#d65a4e'}"></span>
				{/each}
			</div>
			<!-- Old Well rotunda -->
			<svg viewBox="0 0 200 130" class="relative h-[88px] w-[120px]" aria-hidden="true">
				<circle cx="100" cy="20" r="2.5" fill="#eef2f3" />
				<path d="M62 60 Q100 12 138 60 Z" fill="#eef2f3" />
				<ellipse cx="100" cy="60" rx="40" ry="5" fill="#dbe3e5" />
				<rect x="58" y="60" width="84" height="7" fill="#f3f6f7" />
				{#each [64, 78, 92, 106, 120] as x}
					<rect {x} y="67" width="6" height="42" fill="#f6f9fa" />
				{/each}
				<rect x="54" y="109" width="92" height="7" fill="#e4eaec" />
				<rect x="49" y="116" width="102" height="6" fill="#d3dcde" />
			</svg>
		</div>
	</div>
	{/if}

	{#if !authenticated}
		<!-- ===================== LOGIN ===================== -->
		<main class="mx-auto max-w-6xl px-6 pb-24 pt-8">
			<h1 class="mb-4 text-[28px] font-normal text-gray-900">Login</h1>

			<div
				class="mb-6 border-l-4 px-4 py-2 text-[13px] text-gray-800"
				style="background-color:#e9f1d8;border-color:{CAROLINA_NAVY};"
			>
				To log in, please enter your email address and password.
			</div>

			<form class="max-w-2xl" on:submit={autoLogin}>
				{#if error}
					<p class="mb-3 border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800" role="alert">
						{error}
					</p>
				{/if}

				<div class="mb-3 flex items-center gap-4">
					<label for="portal-email" class="w-28 text-[13px] text-gray-800">Email Address</label>
					<input
						id="portal-email"
						type="email"
						class="w-56 border border-slate-400 bg-white px-2 py-0.5 text-[13px] shadow-inner"
						bind:value={emailInput}
						autocomplete="email"
					/>
				</div>

				<div class="mb-4 flex items-center gap-4">
					<label for="portal-password" class="w-28 text-[13px] text-gray-800">Password</label>
					<input
						id="portal-password"
						type="password"
						class="w-56 border border-slate-400 bg-white px-2 py-0.5 text-[13px] shadow-inner"
						bind:value={passwordInput}
						autocomplete="current-password"
					/>
					<a href="/disclaimer" class="ml-2 text-[13px] hover:underline" style="color:{CAROLINA_BLUE};">
						Forgot Your Password?
					</a>
				</div>

				<div class="flex items-center gap-3 pl-32">
					<button
						type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
						class="rounded-sm border border-slate-400 bg-slate-200 px-4 py-1 text-[12px] font-semibold text-black shadow-sm hover:bg-slate-300"
					>
						Login
					</button>
					</div>

				<p class="max-w-xl pt-8 text-[11px] leading-relaxed text-slate-500">
					For this simulation, use the same email address and password that you saved on the
					PredictAdmit.com home page. No real application data is used, and all information is stored
					only in your browser.
				</p>
			</form>
		</main>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ===================== PORTAL ===================== -->
		<main class="mx-auto max-w-6xl px-6 pb-24 pt-4">
			<div class="mb-6 text-right text-[13px] text-gray-700">
				{applicantName()}
				<a href="/disclaimer" class="ml-2 hover:underline" style="color:{CAROLINA_BLUE};">Logout</a>
			</div>

			<div class="flex items-start justify-between">
				<div class="flex-1">
					<div class="mb-8 flex gap-4">
						<button
							on:click={() => (activeTab = 'Admissions Status')}
							class="px-10 py-2.5 text-[13px] font-semibold uppercase tracking-wide text-white"
							style="background-color:{CAROLINA_NAVY};opacity:{activeTab === 'Admissions Status' ? 1 : 0.85};"
						>
							Decision
						</button>
						<button
							on:click={() => (activeTab = 'Application')}
							class="px-10 py-2.5 text-[13px] font-semibold uppercase tracking-wide text-white"
							style="background-color:{CAROLINA_NAVY};opacity:{activeTab === 'Application' ? 1 : 0.85};"
						>
							Application
						</button>
					</div>

					{#if activeTab === 'Admissions Status'}
						<p class="mb-4 text-[14px] text-gray-800">
							An update to your application was last posted {school.statusLastPosted}.
						</p>
						<button
							on:click={handleViewUpdate}
							class="text-[16px] font-bold underline underline-offset-2"
							style="color:{CAROLINA_BLUE};"
						>
							View your decision.
						</button>
					{:else}
						<div class="max-w-lg border border-gray-200 bg-gray-50 p-5 text-[13px] text-gray-600">
							<p class="mb-1 text-[15px] font-semibold text-gray-800">Application Summary</p>
							<p>
								Reference Number: {school.referenceNumber} &middot; {school.round}. Your submitted
								application materials and checklist are available here.
							</p>
						</div>
					{/if}
				</div>

				<div class="ml-8 flex w-40 flex-col items-center gap-4 pt-1">
					<a
						href="/disclaimer"
						class="flex items-center gap-1.5 rounded-full px-5 py-1.5 text-[12px] font-medium"
						style="background-color:#cfe4f2;color:{CAROLINA_NAVY};"
					>
						<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5z" />
						</svg>
						MY ACCOUNT
					</a>
					<div class="flex gap-3 text-black">
						<a href="/disclaimer" aria-label="Facebook">
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z"/></svg>
						</a>
						<a href="/disclaimer" aria-label="Instagram">
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.9 3.9 0 01-1.4-.9 3.9 3.9 0 01-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1018.6 12 6.6 6.6 0 0012 5.4zm0 10.9A4.3 4.3 0 1116.3 12 4.3 4.3 0 0112 16.3zm6.8-11.1a1.5 1.5 0 11-1.5-1.5 1.5 1.5 0 011.5 1.5z"/></svg>
						</a>
						<a href="/disclaimer" aria-label="X">
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7 8 8.3 12h-6.5l-5-7-5.8 7H2l7.5-9L1.6 2h6.6l4.6 6.6L18.9 2zm-1.1 18h1.8L7.3 4H5.4l12.4 16z"/></svg>
						</a>
						<a href="/disclaimer" aria-label="YouTube">
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 00-1.7-1.8C19.3 5 12 5 12 5s-7.3 0-8.9.5A2.5 2.5 0 001.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 001.7 1.8C4.7 19 12 19 12 19s7.3 0 8.9-.5a2.5 2.5 0 001.7-1.8C23 15.2 23 12 23 12zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z"/></svg>
						</a>
					</div>
				</div>
			</div>
		</main>
	{:else if shownDecision === 'admit'}
		<UNCAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<UNCDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}

	<footer class="mt-4 bg-[#f2f2f2] py-6 text-center text-[11px] text-gray-500">
		2025 The University of North Carolina at Chapel Hill
	</footer>
</div>
