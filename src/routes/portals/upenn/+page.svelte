<script lang="ts">
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	import PennAccepted from '$lib/components/upenn/PennAccepted.svelte';
	import PennDenied from '$lib/components/upenn/PennDenied.svelte';

	// ----------------- CONFIGURATION -----------------
	const SLUG = 'upenn';
	const school = {
		schoolName: 'University of Pennsylvania',
		primaryColor: '#011F5B', // Penn blue
		accentColor: '#990000', // Penn red
		footerDomain: 'upenn.edu',
		statusLastPosted: 'March 13, 2026',
		round: 'Regular Decision',
		referenceNumber: '47215906'
	};

	// ----------------- STATE -----------------
	let profile: UserProfile = { ...defaultProfile };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;
	let activeTab = 'Admissions Status';

	// ----------------- REACTIVE DERIVATIONS -----------------
	$: profile = $userProfile;
	const applicantName = () => profile.name || 'Applicant';

	// Default decision when the prediction store has no entry for this slug:
	const DEFAULT_DECISION = 'deny';
	$: shownDecision = $decisionsBySlug[SLUG] ?? DEFAULT_DECISION;

	// ----------------- HANDLERS -----------------
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
	<title>{school.schoolName} — Admissions</title>
</svelte:head>

<div class="min-h-screen font-sans text-slate-900 bg-white">
	{#if !authenticated}
		<!-- ================= LOGIN ================= -->
		<header class="bg-[#011F5B] text-white">
			<div class="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
				<!-- Penn shield -->
				<svg viewBox="0 0 44 52" class="w-9 h-11 shrink-0" aria-hidden="true">
					<path
						d="M4 3 H40 V30 C40 42 22 49 22 49 C22 49 4 42 4 30 Z"
						fill="#ffffff"
						stroke="#011F5B"
						stroke-width="1.5"
					/>
					<path d="M4 3 H40 V14 H4 Z" fill="#990000" />
					<circle cx="13" cy="8.5" r="2.4" fill="#ffffff" />
					<circle cx="22" cy="8.5" r="2.4" fill="#ffffff" />
					<circle cx="31" cy="8.5" r="2.4" fill="#ffffff" />
					<path d="M13 22 Q22 15 31 22 Q26 31 22 33 Q18 31 13 22 Z" fill="#011F5B" />
				</svg>
				<div class="leading-tight">
					<div class="text-3xl font-serif tracking-wide">Penn</div>
					<div class="text-lg font-serif tracking-wide -mt-1">Admissions</div>
				</div>
			</div>
		</header>

		<main class="bg-white min-h-[520px] py-10">
			<div class="max-w-5xl mx-auto px-6">
				<h1 class="text-4xl font-bold font-serif text-[#011F5B] mb-4">Login</h1>

				<div
					class="border-l-4 border-[#8a9a2c] bg-[#eef2d3] px-4 py-3 mb-6 text-[15px] text-slate-800 max-w-3xl"
				>
					To log in, please enter your email address and password.
				</div>

				<form class="space-y-3" on:submit={autoLogin}>
					{#if error}
						<p
							class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2 max-w-md"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-3">
						<label for="portal-email" class="text-[14px] text-slate-800 w-32">Email Address</label>
						<input
							id="portal-email"
							type="email"
							class="border border-slate-400 bg-white px-2 py-1 text-[14px] w-72"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-3">
						<label for="portal-password" class="text-[14px] text-slate-800 w-32">Password</label>
						<input
							id="portal-password"
							type="password"
							class="border border-slate-400 bg-white px-2 py-1 text-[14px] w-72"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a
							href="/disclaimer"
							class="text-[14px] text-[#011F5B] font-semibold hover:underline ml-2 whitespace-nowrap"
						>
							Forgot Your Password?
						</a>
					</div>

					<div class="pt-5 pl-[140px] flex items-center gap-4">
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="bg-[#011F5B] text-white rounded-full px-8 py-2 text-[13px] font-bold tracking-widest uppercase hover:bg-[#022a7a]"
						>
							Login
						</button>
						</div>

					<div class="pt-6 text-[14px] text-slate-800 leading-relaxed max-w-4xl">
						<p class="mb-1">
							<span class="font-bold">PLEASE NOTE:</span> It can take up to 48 hours from the time you
							submit your application until the time you receive an email with your login credentials.
						</p>
						<p>
							Supported browsers: Chrome, Firefox, Safari - If you have technical trouble and are
							using Internet Explorer, please try another browser.
						</p>
						<p class="mt-1">
							For this simulation, use the same email address and password that you saved on the
							PredictAdmit.com home page. No real application data is used, and all information is
							stored only in your browser.
						</p>
					</div>
				</form>
			</div>
		</main>

		<!-- Footer -->
		<footer class="bg-[#011F5B] text-white">
			<div class="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<svg viewBox="0 0 44 52" class="w-9 h-11 shrink-0" aria-hidden="true">
						<path
							d="M4 3 H40 V30 C40 42 22 49 22 49 C22 49 4 42 4 30 Z"
							fill="#ffffff"
							stroke="#011F5B"
							stroke-width="1.5"
						/>
						<path d="M4 3 H40 V14 H4 Z" fill="#990000" />
						<circle cx="13" cy="8.5" r="2.4" fill="#ffffff" />
						<circle cx="22" cy="8.5" r="2.4" fill="#ffffff" />
						<circle cx="31" cy="8.5" r="2.4" fill="#ffffff" />
						<path d="M13 22 Q22 15 31 22 Q26 31 22 33 Q18 31 13 22 Z" fill="#011F5B" />
					</svg>
					<div class="leading-tight">
						<div class="text-2xl font-serif tracking-wide">Penn</div>
						<div class="text-[9px] tracking-[0.15em] font-serif -mt-0.5">
							UNIVERSITY of PENNSYLVANIA
						</div>
					</div>
				</div>
				<div class="flex items-center gap-3">
					{#each ['IG', 'TT', 'YT', 'f'] as icon}
						<span
							class="w-7 h-7 rounded-full border border-white/70 flex items-center justify-center text-[10px]"
						>
							{icon}
						</span>
					{/each}
				</div>
			</div>
			<div class="border-t border-white/20">
				<div class="max-w-6xl mx-auto px-6 py-3 flex flex-wrap gap-6 text-[13px]">
					<a href="/disclaimer" class="hover:underline">Join the mailing list</a>
					<a href="/disclaimer" class="hover:underline">Contact Us</a>
					<a href="/disclaimer" class="hover:underline">Accessibility</a>
					<a href="/disclaimer" class="hover:underline">Privacy Policy</a>
					<a href="/disclaimer" class="hover:underline">NACAC Partnership Agreement</a>
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ================= PORTAL ================= -->
		<header class="bg-[#011F5B] text-white">
			<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<svg viewBox="0 0 44 52" class="w-9 h-11 shrink-0" aria-hidden="true">
						<path
							d="M4 3 H40 V30 C40 42 22 49 22 49 C22 49 4 42 4 30 Z"
							fill="#ffffff"
							stroke="#011F5B"
							stroke-width="1.5"
						/>
						<path d="M4 3 H40 V14 H4 Z" fill="#990000" />
						<circle cx="13" cy="8.5" r="2.4" fill="#ffffff" />
						<circle cx="22" cy="8.5" r="2.4" fill="#ffffff" />
						<circle cx="31" cy="8.5" r="2.4" fill="#ffffff" />
						<path d="M13 22 Q22 15 31 22 Q26 31 22 33 Q18 31 13 22 Z" fill="#011F5B" />
					</svg>
					<div class="leading-tight">
						<div class="text-3xl font-serif tracking-wide">Penn</div>
						<div class="text-lg font-serif tracking-wide -mt-1">Admissions</div>
					</div>
				</div>
				<div class="text-right leading-tight">
					<div class="text-sm font-semibold">{applicantName()}</div>
					<a href="/disclaimer" class="text-[11px] text-white/80 hover:underline">Logout</a>
				</div>
			</div>
		</header>

		<main class="bg-white min-h-[520px]">
			<div class="max-w-6xl mx-auto px-6 py-8">
				<!-- Decorative Penn banner -->
				<div class="relative w-full h-52 overflow-hidden bg-[#3a5a7a] mb-8">
					<div
						class="absolute inset-0"
						style="background: linear-gradient(120deg, #4a6b8a 0%, #5f7d99 40%, #8aa0b5 100%);"
					></div>
					<!-- red stripes -->
					<div
						class="absolute top-0 left-8 w-24 h-full opacity-80 bg-[#990000]"
						style="transform: skewX(-18deg);"
					></div>
					<div
						class="absolute top-0 left-40 w-6 h-full opacity-80 bg-[#990000]"
						style="transform: skewX(-18deg);"
					></div>
					<!-- blue stripes -->
					<div
						class="absolute top-0 right-16 w-8 h-full opacity-80 bg-[#011F5B]"
						style="transform: skewX(-18deg);"
					></div>
					<div
						class="absolute top-0 right-4 w-16 h-full opacity-80 bg-[#011F5B]"
						style="transform: skewX(-18deg);"
					></div>
				</div>

				<div class="max-w-3xl">
					<h2 class="text-xl font-bold text-[#011F5B] mb-3">Status Update</h2>
					<p class="text-[15px] text-slate-700 mb-5">
						An update to your application was last posted {school.statusLastPosted}.
					</p>
					<button
						on:click={handleViewUpdate}
						class="text-[15px] font-bold text-[#011F5B] hover:underline"
					>
						View Simulated Status Update &gt;&gt;
					</button>
				</div>
			</div>
		</main>

		<!-- Footer -->
		<footer class="bg-[#011F5B] text-white">
			<div class="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<svg viewBox="0 0 44 52" class="w-9 h-11 shrink-0" aria-hidden="true">
						<path
							d="M4 3 H40 V30 C40 42 22 49 22 49 C22 49 4 42 4 30 Z"
							fill="#ffffff"
							stroke="#011F5B"
							stroke-width="1.5"
						/>
						<path d="M4 3 H40 V14 H4 Z" fill="#990000" />
						<circle cx="13" cy="8.5" r="2.4" fill="#ffffff" />
						<circle cx="22" cy="8.5" r="2.4" fill="#ffffff" />
						<circle cx="31" cy="8.5" r="2.4" fill="#ffffff" />
						<path d="M13 22 Q22 15 31 22 Q26 31 22 33 Q18 31 13 22 Z" fill="#011F5B" />
					</svg>
					<div class="leading-tight">
						<div class="text-2xl font-serif tracking-wide">Penn</div>
						<div class="text-[9px] tracking-[0.15em] font-serif -mt-0.5">
							UNIVERSITY of PENNSYLVANIA
						</div>
					</div>
				</div>
				<div class="flex items-center gap-3">
					{#each ['IG', 'TT', 'YT', 'f'] as icon}
						<span
							class="w-7 h-7 rounded-full border border-white/70 flex items-center justify-center text-[10px]"
						>
							{icon}
						</span>
					{/each}
				</div>
			</div>
			<div class="border-t border-white/20">
				<div class="max-w-6xl mx-auto px-6 py-3 flex flex-wrap gap-6 text-[13px]">
					<a href="/disclaimer" class="hover:underline">Join the mailing list</a>
					<a href="/disclaimer" class="hover:underline">Contact Us</a>
					<a href="/disclaimer" class="hover:underline">Accessibility</a>
					<a href="/disclaimer" class="hover:underline">Privacy Policy</a>
					<a href="/disclaimer" class="hover:underline">NACAC Partnership Agreement</a>
				</div>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<PennAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<PennDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
