<script lang="ts">
	// Svelte Stores and Types
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// School-Specific Components (Decision Letters)
	import PurdueAccepted from '$lib/components/purdue/PurdueAccepted.svelte';
	import PurdueDenied from '$lib/components/purdue/PurdueDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'purdue';
	const PURDUE_GOLD = '#CFB991'; // Boilermaker Gold
	const PURDUE_BLACK = '#000000';

	const school = {
		schoolName: 'Purdue University',
		primaryColor: PURDUE_BLACK,
		footerDomain: 'purdue.edu',
		statusLastPosted: 'March 10, 2026',
		round: 'Fall 2026 New First Time',
		referenceNumber: '003707497'
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

	// Left-hand portal navigation (from the real Slate portal)
	const portalMenu = [
		{ label: 'Dashboard', active: true },
		{ label: 'Checklist', active: false },
		{ label: 'Application', active: false, heading: true },
		{ label: 'Status', active: false, sub: true },
		{ label: 'Documents', active: false, sub: true },
		{ label: 'Test Scores', active: false, sub: true },
		{ label: 'Update Courses & Grades', active: false, sub: true },
		{ label: 'Change Requests', active: false, sub: true },
		{ label: 'Cancel Application', active: false, sub: true },
		{ label: 'Engage', active: false, heading: true },
		{ label: 'My Events', active: false, sub: true },
		{ label: 'Visit Campus', active: false, sub: true },
		{ label: 'Contact Us', active: false, heading: true },
		{ label: 'FAQ', active: false, sub: true },
		{ label: 'Account Help', active: false, sub: true },
		{ label: 'Who to Contact', active: false, sub: true },
		{ label: 'My Account', active: false, heading: true },
		{ label: 'Addresses', active: false, sub: true },
		{ label: 'Account Tools', active: false, sub: true }
	];
</script>

<svelte:head>
	<title>{school.schoolName} — Application Status</title>
</svelte:head>

<div class="min-h-screen bg-white text-gray-900" style="font-family: 'Franklin Gothic', 'Segoe UI', Arial, sans-serif;">
	{#if !authenticated}
		<!-- ================= LOGIN ================= -->
		<header class="bg-white border-b border-gray-200">
			<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
				<div class="flex items-center gap-4">
					<span class="text-2xl font-extrabold tracking-tight text-black">PURDUE</span>
					<span class="hidden sm:inline-block h-6 w-px bg-[#555960]"></span>
					<a href="/disclaimer" class="text-[22px] font-bold text-black hover:text-black whitespace-nowrap">
						Undergraduate Admissions
					</a>
				</div>
				<a href="/disclaimer" aria-label="Menu" class="text-black">
					<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
						<path stroke-linecap="butt" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</a>
			</div>
		</header>

		<div class="h-2 w-full" style="background-color: {PURDUE_GOLD};"></div>

		<main class="bg-white min-h-[520px] py-16">
			<div class="max-w-2xl mx-auto px-6">
				<h1 class="text-3xl font-bold mb-6 text-black">Purdue Login Credentials</h1>

				<div class="border-l-4 pl-4 py-2 mb-8 text-[15px] text-gray-800 bg-[#F5F1E8]" style="border-color: {PURDUE_GOLD};">
					To log in, please enter your email address and password.
				</div>

				<form class="space-y-5" on:submit={autoLogin}>
					{#if error}
						<p class="text-sm text-red-800 border border-red-300 bg-red-50 px-3 py-2" role="alert">
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-3">
						<label for="portal-email" class="text-[14px] font-semibold text-black w-36">
							Email Address <span class="text-red-600">*</span>
						</label>
						<input
							id="portal-email"
							type="email"
							class="border border-gray-400 bg-white px-2 py-1.5 text-[14px] w-64 focus:outline-none focus:ring-2"
							style="--tw-ring-color: {PURDUE_GOLD};"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-3">
						<label for="portal-password" class="text-[14px] font-semibold text-black w-36">
							Password <span class="text-red-600">*</span>
						</label>
						<input
							id="portal-password"
							type="password"
							class="border border-gray-400 bg-white px-2 py-1.5 text-[14px] w-64 focus:outline-none focus:ring-2"
							style="--tw-ring-color: {PURDUE_GOLD};"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a href="/disclaimer" class="text-[13px] text-[#8E6F3E] hover:underline whitespace-nowrap">
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-4 pt-4">
						<div class="w-36 hidden sm:block"></div>
						<button
							type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
							class="px-8 py-2.5 text-[14px] font-bold text-black transition-colors border-2 border-transparent hover:text-white hover:border-[#CFB991]"
							style="background-color: {PURDUE_GOLD};"
							on:mouseenter={(e) => (e.currentTarget.style.backgroundColor = '#000')}
							on:mouseleave={(e) => (e.currentTarget.style.backgroundColor = PURDUE_GOLD)}
						>
							Login
						</button>
						</div>

					<div class="pt-8 max-w-xl text-[12px] leading-relaxed text-gray-700 italic">
						<strong>
							Your login email is most likely the student email you used to apply to Purdue or register
							for a Purdue visit. The Forgot Your Password link will allow you to reset your password with
							that email address. For this simulation, use the same email address and password
							that you saved on the PredictAdmit.com home page. No real application data is used, and all
							information is stored only in your browser.
						</strong>
					</div>
				</form>
			</div>
		</main>

		<footer class="text-white py-10" style="background-color: #0f0f0f;">
			<div class="max-w-5xl mx-auto px-6 grid gap-8 md:grid-cols-[250px_1fr]">
				<div>
					<div class="text-2xl font-extrabold tracking-tight mb-4">PURDUE</div>
					<address class="not-italic text-[13px] leading-relaxed tracking-wide">
						Office of Admissions<br />
						128 Memorial Mall<br />
						West Lafayette, IN 47907<br />
						<span class="mt-2 inline-block" style="color: {PURDUE_GOLD};">(765) 494-1776</span>
					</address>
				</div>
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-[12px]">
					{#each [{ h: 'EXPLORE', l: ['Majors', 'Visit', 'Cost and Financial Aid', 'First-Year Scholarships', 'Student Life'] }, { h: 'APPLY', l: ['Apply Now', 'Guide to Applying', 'Deadlines', 'First-Year Class Profile', 'Closed Programs'] }, { h: 'INFORMATION FOR', l: ['First-Year Students', 'Admitted Students', 'Transfer Students', 'International Students'] }, { h: 'COMMUNICATION', l: ['Annual Security Report', 'Emergency', 'Purdue News', 'Purdue Hotline'] }] as group}
						<div>
							<span class="block font-extrabold tracking-widest mb-3" style="color: {PURDUE_GOLD};">{group.h}</span>
							<ul class="space-y-2">
								{#each group.l as link}
									<li><a href="/disclaimer" class="hover:underline">{link}</a></li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</div>
			<div class="max-w-5xl mx-auto px-6 mt-8 pt-4 border-t border-white/20 text-[11px] text-white/70 flex justify-between flex-wrap gap-2">
				<span>&copy; 2026 Purdue University</span>
				<span>PredictAdmit Simulation — Not affiliated with Purdue University</span>
			</div>
		</footer>
	{:else if authenticated && !hasViewedUpdate}
		<!-- ================= PORTAL ================= -->
		<header class="bg-white border-b border-gray-200">
			<div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
				<div class="flex items-center gap-4">
					<span class="text-2xl font-extrabold tracking-tight text-black">PURDUE</span>
					<span class="hidden sm:inline-block h-6 w-px bg-[#555960]"></span>
					<a href="/disclaimer" class="text-[22px] font-bold text-black whitespace-nowrap">
						Undergraduate Admissions
					</a>
				</div>
				<div class="text-[13px] text-gray-700 flex items-center gap-4">
					<span>{applicantName()}</span>
					<a href="/disclaimer" class="text-[#8E6F3E] hover:underline font-semibold">Logout</a>
				</div>
			</div>
		</header>

		<div class="max-w-7xl mx-auto px-6 pt-6 pb-12">
			<h1 class="text-3xl font-bold text-black">Application Status for {applicantName()}</h1>
			<div class="flex items-center gap-3 mt-4 mb-6">
				<h3 class="text-lg font-semibold text-gray-800">Your Application:</h3>
				<span
					class="inline-block px-4 py-1.5 font-bold text-white"
					style="background-color: {PURDUE_BLACK}; transform: skewX(-15deg);"
				>
					<span style="display:inline-block; transform: skewX(15deg);">{school.round}</span>
				</span>
			</div>

			<div class="flex flex-col md:flex-row gap-8">
				<!-- Left nav -->
				<nav class="w-full md:w-56 shrink-0 border border-gray-200 bg-[#fafafa] text-sm">
					<ul>
						{#each portalMenu as item}
							<li class="border-b border-gray-100 last:border-b-0">
								<a
									href="/disclaimer"
									class="block px-4 py-2 hover:bg-gray-100"
									class:font-bold={item.active}
									class:text-black={item.active || item.heading}
									class:bg-white={item.active}
									class:border-l-4={item.active}
									class:pl-6={item.sub}
									class:text-gray-700={!item.active && !item.heading}
									class:uppercase={item.heading}
									class:tracking-wide={item.heading}
									class:text-xs={item.heading}
									style={item.active ? `border-color: ${PURDUE_GOLD};` : ''}
								>
									{item.label}
								</a>
							</li>
						{/each}
						<li><a href="/disclaimer" class="block px-4 py-2 font-semibold text-[#8E6F3E] hover:bg-gray-100">Logout</a></li>
					</ul>
				</nav>

				<!-- Main content -->
				<div class="flex-1 min-w-0">
					<!-- Banner -->
					<div
						class="w-full py-8 px-6 mb-4 text-center"
						style="background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);"
					>
						<span class="text-2xl md:text-3xl font-extrabold tracking-wide" style="color: {PURDUE_GOLD};">
							APPLICATION STATUS PORTAL
						</span>
					</div>

					<!-- Gold decided bar -->
					<p class="text-center font-bold py-3 px-4" style="background-color: {PURDUE_GOLD}; color: #000;">
						Application Status: Decided ✓
					</p>

					<!-- Reference number bar -->
					<p class="text-center py-3 px-4 text-white text-[13px]" style="background-color: #555960;">
						If you need to contact us regarding your application, provide your name and this reference
						number: {school.referenceNumber}
					</p>

					<!-- Status tracker -->
					<section class="mt-6 border border-[#9D968D] bg-white p-4 shadow-sm">
						<h2 class="text-xl font-extrabold text-black">Application Status</h2>
						<p class="text-sm text-gray-700 mt-1">
							Current Status: <strong>Decided</strong>
						</p>

						<ol class="mt-4 space-y-3">
							{#each [{ n: 1, name: 'Awaiting Materials', current: false }, { n: 2, name: 'Complete', current: false }, { n: 3, name: 'Decided', current: true }] as step}
								<li
									class="flex items-center gap-4 p-3 border"
									class:border-black={step.current}
									class:border-gray-300={!step.current}
									style={step.current ? `border-left: 6px solid ${PURDUE_GOLD};` : ''}
								>
									<span
										class="grid place-items-center w-10 h-10 rounded-full font-bold text-white border-[3px] border-black shrink-0"
										style={`background-color: ${step.current ? PURDUE_GOLD : '#9D968D'}; ${step.current ? 'color:#000;' : ''}`}
									>
										{step.n}
									</span>
									<div>
										<span class="block font-extrabold text-black">{step.name}</span>
										{#if step.current}
											<span class="inline-block text-[11px] font-bold uppercase tracking-wide mt-0.5 mb-1 px-2 py-0.5" style="background-color: #000; color: {PURDUE_GOLD};">
												Current Status
											</span>
											<span class="block text-sm text-gray-700">A decision has been made.</span>
											<button
												on:click={handleViewUpdate}
												class="mt-3 inline-block px-6 py-2 text-sm font-bold text-white hover:opacity-90"
												style="background-color: #000;"
											>
												VIEW YOUR DECISION
											</button>
										{/if}
									</div>
								</li>
							{/each}
						</ol>
					</section>

					<!-- Secondary action buttons -->
					<div class="mt-4 space-y-2">
						{#each ['NEXT STEPS', 'VISIT CAMPUS', 'DECISION LETTERS & DOCUMENTS'] as label}
							<a href="/disclaimer" class="block text-center px-6 py-2.5 text-sm font-bold text-white hover:opacity-90" style="background-color: #000;">
								{label}
							</a>
						{/each}
					</div>

					<!-- Financial aid -->
					<section class="mt-8 border border-gray-200 p-5 bg-[#fafafa]">
						<h2 class="text-lg font-extrabold text-black mb-2">MAXIMIZE FINANCIAL AID</h2>
						<p class="text-sm text-gray-700 leading-relaxed">
							Maximize your financial aid! Submit your
							<a href="/disclaimer" class="text-[#8E6F3E] hover:underline">Free Application for Federal Student Aid (FAFSA)</a>
							as soon as possible and before Purdue's April 15 priority filing date using our Federal School
							code 001825. You also have access to a tool called Scholarship Universe which can be used to
							search and apply for additional, private scholarships.
						</p>
						<a href="/disclaimer" class="mt-4 inline-block px-6 py-2 text-sm font-bold text-black" style="background-color: {PURDUE_GOLD};">
							VISIT SCHOLARSHIP UNIVERSE
						</a>
						<p class="text-xs text-gray-500 mt-4">
							Status last posted {school.statusLastPosted}. Reference Number: {school.referenceNumber} · Round: {school.round}
						</p>
					</section>
				</div>
			</div>
		</div>

		<footer class="text-white py-8 mt-4" style="background-color: #0f0f0f;">
			<div class="max-w-7xl mx-auto px-6 flex justify-between flex-wrap gap-2 text-[11px] text-white/70">
				<span>&copy; 2026 Purdue University. All rights reserved.</span>
				<span>PredictAdmit Simulation — Not affiliated with Purdue University</span>
			</div>
		</footer>
	{:else if shownDecision === 'admit'}
		<PurdueAccepted
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{:else}
		<PurdueDenied
			applicantName={applicantName()}
			schoolName={school.schoolName}
			primaryColor={school.primaryColor}
			footerDomain={school.footerDomain}
		/>
	{/if}
</div>
