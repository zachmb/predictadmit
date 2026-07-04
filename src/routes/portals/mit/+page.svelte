<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import MITAccepted from '$lib/components/mit/MITAccepted.svelte';
	import MITDenied from '$lib/components/mit/MITDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'mit';
	const school = {
		schoolName: 'Massachusetts Institute of Technology',
		primaryColor: '#A31F34',
		footerDomain: 'mit.edu',
		statusLastPosted: 'March 14, 2026',
		round: 'Regular Action',
		referenceNumber: '630174285'
	};

	// --- State Variables ---
	let profile: UserProfile = { ...defaultProfile };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;
	let activeTab = 'Application';

	// Subscribe to the global user profile store
	$: profile = $userProfile;

	// Dynamic Data Helpers
	const applicantName = () => profile.name || 'Applicant';
	const firstName = () => (profile.name || 'Applicant').split(' ')[0];

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
	<title>MIT Admissions</title>
</svelte:head>

<div class="min-h-screen font-sans bg-white text-[#16283c] flex flex-col">
	{#if !authenticated}
		<!-- ===================== LOGIN ===================== -->
		<div class="h-1 w-full bg-gradient-to-r from-[#7ab52b] via-[#39a7a0] to-[#2f6fb0]"></div>
		<header class="border-b border-gray-200">
			<div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
				<a href="/disclaimer" class="flex items-end gap-2 text-black">
					<svg viewBox="0 0 64 32" class="h-6 w-auto" aria-label="MIT" fill="currentColor">
						<rect x="0" y="0" width="5" height="32" />
						<rect x="7" y="0" width="5" height="22" />
						<rect x="14" y="0" width="5" height="32" />
						<rect x="26" y="0" width="5" height="32" />
						<rect x="37" y="0" width="27" height="5" />
						<rect x="49" y="7" width="5" height="25" />
					</svg>
					<span class="text-[19px] font-semibold tracking-tight leading-none pb-[1px]">Admissions</span>
				</a>
				<nav class="hidden sm:flex items-center gap-6 text-[13px] font-semibold text-[#16283c]">
					<a href="/disclaimer" class="hover:text-[#A31F34]">Discover</a>
					<a href="/disclaimer" class="hover:text-[#A31F34]">Apply</a>
					<a href="/disclaimer" class="hover:text-[#A31F34]">Afford</a>
					<a href="/disclaimer" class="hover:text-[#A31F34]">Visit</a>
					<a href="/disclaimer" class="hover:text-[#A31F34]">Help</a>
					<a href="/disclaimer" class="hover:text-[#A31F34]">Blogs</a>
				</nav>
			</div>
		</header>

		<main class="flex-grow max-w-6xl w-full mx-auto px-6 py-10">
			<h1 class="text-[40px] font-bold text-[#16283c] mb-5">Login</h1>

			<div
				class="bg-[#eaf1d6] border-l-4 border-[#7ab52b] px-4 py-2.5 mb-6 text-[13px] text-[#16283c]"
			>
				To log in, please enter your email address and password.
			</div>

			<form class="max-w-xl" on:submit={autoLogin}>
				{#if error}
					<p
						class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-3"
						role="alert"
					>
						{error}
					</p>
				{/if}

				<div class="flex items-center mb-3">
					<label for="portal-email" class="w-28 text-[13px] text-[#16283c]">Email Address</label>
					<input
						id="portal-email"
						type="email"
						class="border border-gray-400 bg-white px-2 py-[3px] text-[13px] w-56"
						bind:value={emailInput}
						autocomplete="email"
					/>
				</div>

				<div class="flex items-center mb-5">
					<label for="portal-password" class="w-28 text-[13px] text-[#16283c]">Password</label>
					<input
						id="portal-password"
						type="password"
						class="border border-gray-400 bg-white px-2 py-[3px] text-[13px] w-56"
						bind:value={passwordInput}
						autocomplete="current-password"
					/>
					<a href="/disclaimer" class="text-[13px] text-[#16283c] underline ml-5 whitespace-nowrap">
						Forgot Your Password?
					</a>
				</div>

				<div class="flex items-center gap-3">
					<button
						type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
						class="border border-gray-400 bg-gray-200 px-4 py-[5px] text-[13px] text-[#16283c] hover:bg-gray-300"
					>
						Login
					</button>
					</div>

				<p class="pt-6 text-[11px] leading-relaxed text-gray-500 max-w-lg">
					For this simulation, use the same email address and password that you saved on the
					PredictAdmit.com home page. No real application data is used, and all information is stored
					only in your browser.
				</p>
			</form>
		</main>

		<!-- Shared MIT footer -->
		<footer class="mt-auto">
			<div class="bg-[#14243a] text-white">
				<div class="max-w-6xl mx-auto px-6 py-8 flex items-start justify-between gap-8">
					<div class="max-w-xl">
						<h2 class="text-2xl font-bold mb-3">MIT Admissions</h2>
						<p class="text-[12px] leading-relaxed text-gray-300">
							At MIT Admissions, we recruit and enroll a talented and diverse class of undergraduates
							who will learn to use science, technology, and other areas of scholarship to serve the
							nation and the world in the 21st century.
						</p>
					</div>
					<svg
						viewBox="0 0 140 70"
						class="hidden md:block w-40 text-gray-200"
						fill="none"
						stroke="currentColor"
						stroke-width="1"
					>
						<path d="M20 60 Q70 20 120 60" />
						<path d="M20 60 L120 60" />
						<line x1="35" y1="60" x2="35" y2="48" />
						<line x1="50" y1="60" x2="50" y2="42" />
						<line x1="70" y1="60" x2="70" y2="38" />
						<line x1="90" y1="60" x2="90" y2="42" />
						<line x1="105" y1="60" x2="105" y2="48" />
						<path d="M118 18 l1.5 3 3 .5 -2 2 .5 3 -3-1.5 -3 1.5 .5-3 -2-2 3-.5z" />
						<path d="M100 10 l1 2 2 .3 -1.5 1.4 .4 2 -1.9-1 -1.9 1 .4-2 -1.5-1.4 2-.3z" />
					</svg>
				</div>
			</div>
			<div class="bg-[#0f1c2e] text-gray-300 text-[11px]">
				<div class="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
					<div class="flex items-center gap-2 text-white">
						<svg viewBox="0 0 64 32" class="h-5 w-auto" aria-label="MIT" fill="currentColor">
							<rect x="0" y="0" width="5" height="32" />
							<rect x="7" y="0" width="5" height="22" />
							<rect x="14" y="0" width="5" height="32" />
							<rect x="26" y="0" width="5" height="32" />
							<rect x="37" y="0" width="27" height="5" />
							<rect x="49" y="7" width="5" height="25" />
						</svg>
						<span class="leading-tight text-[9px] font-semibold">
							Massachusetts<br />Institute of<br />Technology
						</span>
					</div>
					<div class="text-right">
						MIT Admissions, 77 Massachusetts Avenue, Room E38-200, Cambridge, MA 02139 &middot; Tel:
						617.253.3400 | <a href="/disclaimer" class="underline">About</a> |
						<a href="/disclaimer" class="underline">Policies</a> |
						<a href="/disclaimer" class="underline">En Español</a> |
						<a href="/disclaimer" class="underline">Instagram</a>
					</div>
				</div>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ===================== STATUS PAGE ===================== -->
		<div class="h-1 w-full bg-gradient-to-r from-[#7ab52b] via-[#39a7a0] to-[#2f6fb0]"></div>
		<header class="border-b border-gray-200">
			<div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
				<a href="/disclaimer" class="flex items-end gap-2 text-black">
					<svg viewBox="0 0 64 32" class="h-6 w-auto" aria-label="MIT" fill="currentColor">
						<rect x="0" y="0" width="5" height="32" />
						<rect x="7" y="0" width="5" height="22" />
						<rect x="14" y="0" width="5" height="32" />
						<rect x="26" y="0" width="5" height="32" />
						<rect x="37" y="0" width="27" height="5" />
						<rect x="49" y="7" width="5" height="25" />
					</svg>
					<span class="text-[19px] font-semibold tracking-tight leading-none pb-[1px]">Admissions</span>
				</a>
				<nav class="hidden sm:flex items-center gap-6 text-[13px] font-semibold text-[#16283c]">
					<a href="/disclaimer" class="hover:text-[#A31F34]">Discover</a>
					<a href="/disclaimer" class="hover:text-[#A31F34]">Apply</a>
					<a href="/disclaimer" class="hover:text-[#A31F34]">Afford</a>
					<a href="/disclaimer" class="hover:text-[#A31F34]">Visit</a>
					<a href="/disclaimer" class="hover:text-[#A31F34]">Help</a>
					<a href="/disclaimer" class="hover:text-[#A31F34]">Blogs</a>
				</nav>
			</div>
		</header>

		<main class="flex-grow max-w-6xl w-full mx-auto px-6 py-8">
			<div class="text-right text-[12px] text-gray-600 mb-4">
				{applicantName()} <a href="/disclaimer" class="underline ml-1">Logout</a>
			</div>

			<h1 class="text-[32px] font-bold text-[#16283c] mb-4">
				Welcome to your status page, {firstName()}!
			</h1>

			<p class="text-[13px] text-[#16283c] mb-3">
				Thank you for applying to MIT! Our records indicate that you applied for first-year admission
				in {school.round}.
			</p>

			<p class="text-[13px] text-[#A31F34] font-semibold mb-6 max-w-3xl">
				Please do not show your decision screen online, especially on social media and/or YouTube. We
				want you to be protected and safe as possible, so make sure to keep your personal information
				private.
			</p>

			<div class="flex flex-col md:flex-row gap-6">
				<!-- Left / status column -->
				<div class="flex-grow">
					<h2 class="text-[15px] font-bold text-[#16283c] mb-1">Status Update</h2>
					<p class="text-[13px] text-[#16283c] mb-1">
						An update to your application was last posted {school.statusLastPosted}.
					</p>
					<button
						on:click={handleViewUpdate}
						class="text-[13px] text-[#2f6fb0] underline hover:text-[#A31F34]"
					>
						View Simulated Status Update &gt;&gt;
					</button>

					<div class="mt-5 border border-gray-300">
						<div class="flex bg-gray-100 border-b border-gray-300 text-[13px]">
							<button
								on:click={() => (activeTab = 'Application')}
								class="px-4 py-1.5 border-r border-gray-300 font-semibold"
								class:bg-white={activeTab === 'Application'}
							>
								Application
							</button>
						</div>
						<div class="h-64 bg-white"></div>
					</div>
				</div>

				<!-- Right / account column -->
				<div class="w-full md:w-64 shrink-0 border border-gray-300 p-3">
					<div class="text-[14px] font-bold text-[#16283c] leading-tight mb-3">
						Application Reference #<br />{school.referenceNumber}
					</div>
					<div class="text-[14px] font-bold text-[#16283c] mb-1">Account Management</div>
					<ul class="text-[12px] text-[#2f6fb0] list-disc list-inside space-y-0.5 mb-4">
						<li><a href="/disclaimer" class="underline">Change your email address</a></li>
						<li><a href="/disclaimer" class="underline">Change your password</a></li>
						<li><a href="/disclaimer" class="underline">Logout</a></li>
					</ul>
					<div class="text-[9px] text-gray-500 mb-1">08/13/2020 7:00:03 PM</div>
					<div class="border border-gray-200 p-2">
						<div class="flex items-end gap-[3px] h-20">
							<div class="w-2 bg-[#8ba3c7]" style="height:40%"></div>
							<div class="w-2 bg-[#b16ba0]" style="height:75%"></div>
							<div class="w-2 bg-[#c98f5a]" style="height:55%"></div>
							<div class="w-2 bg-[#8ba3c7]" style="height:90%"></div>
							<div class="w-2 bg-[#b16ba0]" style="height:60%"></div>
							<div class="w-2 bg-[#c98f5a]" style="height:80%"></div>
							<div class="w-2 bg-[#8ba3c7]" style="height:35%"></div>
							<div class="w-2 bg-[#b16ba0]" style="height:70%"></div>
							<div class="w-2 bg-[#c98f5a]" style="height:50%"></div>
						</div>
						<div class="text-[9px] text-gray-400 mt-1 text-right">art by @knightlivfieldlog</div>
					</div>
				</div>
			</div>

			<div class="mt-10">
				<h2 class="text-[15px] font-bold text-[#16283c] mb-2">Recent Activities</h2>
				<table class="w-full text-[12px] text-left border border-gray-300">
					<thead class="bg-[#14243a] text-white">
						<tr>
							<th class="px-3 py-1.5 font-semibold w-32">DATE</th>
							<th class="px-3 py-1.5 font-semibold">DETAILS</th>
						</tr>
					</thead>
					<tbody>
						<tr class="border-b border-gray-200">
							<td class="px-3 py-2 align-top">01/06/2026</td>
							<td class="px-3 py-2">
								Payment Received: 75.00 USD<br />
								<span class="text-gray-600">Application Fee</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</main>

		<!-- Shared MIT footer -->
		<footer class="mt-10">
			<div class="bg-[#14243a] text-white">
				<div class="max-w-6xl mx-auto px-6 py-8 flex items-start justify-between gap-8">
					<div class="max-w-xl">
						<h2 class="text-2xl font-bold mb-3">MIT Admissions</h2>
						<p class="text-[12px] leading-relaxed text-gray-300">
							At MIT Admissions, we recruit and enroll a talented and diverse class of undergraduates
							who will learn to use science, technology, and other areas of scholarship to serve the
							nation and the world in the 21st century.
						</p>
					</div>
					<svg
						viewBox="0 0 140 70"
						class="hidden md:block w-40 text-gray-200"
						fill="none"
						stroke="currentColor"
						stroke-width="1"
					>
						<path d="M20 60 Q70 20 120 60" />
						<path d="M20 60 L120 60" />
						<line x1="35" y1="60" x2="35" y2="48" />
						<line x1="50" y1="60" x2="50" y2="42" />
						<line x1="70" y1="60" x2="70" y2="38" />
						<line x1="90" y1="60" x2="90" y2="42" />
						<line x1="105" y1="60" x2="105" y2="48" />
						<path d="M118 18 l1.5 3 3 .5 -2 2 .5 3 -3-1.5 -3 1.5 .5-3 -2-2 3-.5z" />
						<path d="M100 10 l1 2 2 .3 -1.5 1.4 .4 2 -1.9-1 -1.9 1 .4-2 -1.5-1.4 2-.3z" />
					</svg>
				</div>
			</div>
			<div class="bg-[#0f1c2e] text-gray-300 text-[11px]">
				<div class="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
					<div class="flex items-center gap-2 text-white">
						<svg viewBox="0 0 64 32" class="h-5 w-auto" aria-label="MIT" fill="currentColor">
							<rect x="0" y="0" width="5" height="32" />
							<rect x="7" y="0" width="5" height="22" />
							<rect x="14" y="0" width="5" height="32" />
							<rect x="26" y="0" width="5" height="32" />
							<rect x="37" y="0" width="27" height="5" />
							<rect x="49" y="7" width="5" height="25" />
						</svg>
						<span class="leading-tight text-[9px] font-semibold">
							Massachusetts<br />Institute of<br />Technology
						</span>
					</div>
					<div class="text-right">
						MIT Admissions, 77 Massachusetts Avenue, Room E38-200, Cambridge, MA 02139 &middot; Tel:
						617.253.3400 | <a href="/disclaimer" class="underline">About</a> |
						<a href="/disclaimer" class="underline">Policies</a> |
						<a href="/disclaimer" class="underline">En Español</a> |
						<a href="/disclaimer" class="underline">Instagram</a>
					</div>
				</div>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<MITAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<MITDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
