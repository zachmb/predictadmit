<script lang="ts">
	import { tick } from 'svelte';
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';
	import FloridaAccepted from '$lib/components/uf/FloridaAccepted.svelte';
	import FloridaDenied from '$lib/components/uf/FloridaDenied.svelte';

	const SLUG = 'uf';
	const school = {
		schoolName: 'University of Florida',
		primaryColor: '#0021A5',
		accentColor: '#FA4616',
		footerDomain: 'ufl.edu',
		statusLastPosted: 'February 27, 2026',
		round: 'Regular Decision',
		referenceNumber: '84120563'
	};

	let profile: UserProfile = { ...defaultProfile };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;
	let activeTab = 'Application Materials';

	$: profile = $userProfile;

	const applicantName = () => profile.name || 'Applicant';
	const firstName = () => (profile.name ? profile.name.split(' ')[0] : 'Applicant');

	// Default decision when the prediction store has no entry for this slug:
	const DEFAULT_DECISION = 'admit';
	$: shownDecision = $decisionsBySlug[SLUG] ?? DEFAULT_DECISION;

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

	const handleViewUpdate = async () => {
		hasViewedUpdate = true;
		portalDecisionViewed.set(true);
		await tick();
		window.scrollTo(0, 0);
	};

	const navTabs = [
		'Application Materials',
		'Admitted Student Events',
		'Admitted Student Campus Tours',
		'Housing'
	];

	const checklist = [
		{ status: 'Awaiting', detail: 'Enrollment Confirmation' },
		{ status: 'Awaiting', detail: 'Enrollment Deposit' }
	];

	const testScores = [
		{ type: 'SAT', detail: 'Verified', date: '6/1/2025' },
		{ type: 'ACT', detail: 'Verified', date: '6/1/2025' }
	];

	const schools = [
		{
			name: 'Glenbrook North High School',
			degree: 'High School Diploma',
			level: 'High School',
			state: 'IL',
			country: 'United States'
		},
		{
			name: 'Oakton Community College',
			degree: 'No degree',
			level: 'College',
			state: 'IL',
			country: 'United States'
		},
		{
			name: 'Northern Illinois University',
			degree: 'No degree',
			level: 'College',
			state: 'IL',
			country: 'United States'
		}
	];
</script>

<svelte:head>
	<title>University of Florida — Gator Portal</title>
</svelte:head>

{#if !authenticated}
	<!-- ============================= LOGIN ============================= -->
	<div class="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
		<header class="bg-[#0021A5] text-white">
			<div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
				<div class="flex items-baseline gap-2">
					<span class="text-2xl font-black italic tracking-tight leading-none">UF</span>
					<span class="text-sm font-semibold tracking-[0.2em] uppercase">Admissions</span>
				</div>
				<nav class="flex items-center gap-8 text-sm font-medium">
					<a href="/disclaimer" class="hover:underline">Gator Portal</a>
					<a href="/disclaimer" class="hover:underline">Visit and Events</a>
					<a href="/disclaimer" class="hover:underline">Contact</a>
				</nav>
			</div>
		</header>

		<main class="flex-grow bg-white">
			<div class="max-w-4xl mx-auto px-6 py-10">
				<div class="border border-slate-200 rounded-sm shadow-sm px-8 py-8">
					<h1 class="text-2xl font-semibold text-[#0021A5] mb-5">GATOR PORTAL LOGIN</h1>

					<div class="border-l-4 border-[#77a02a] bg-[#eef4d8] px-4 py-2 mb-6 text-sm text-slate-800">
						To log in, please enter your email address and password.
					</div>

					<form class="space-y-4" on:submit={autoLogin}>
						{#if error}
							<p
								class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2"
								role="alert"
							>
								{error}
							</p>
						{/if}

						<div class="flex items-center gap-4">
							<label for="portal-email" class="text-sm text-slate-700 w-28">Email Address</label>
							<input
								id="portal-email"
								type="email"
								class="border border-slate-300 bg-slate-50 px-2 py-1.5 text-sm w-64 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0021A5]"
								bind:value={emailInput}
								autocomplete="email"
							/>
						</div>

						<div class="flex items-center gap-4">
							<label for="portal-password" class="text-sm text-slate-700 w-28">Password</label>
							<input
								id="portal-password"
								type="password"
								class="border border-slate-300 bg-slate-50 px-2 py-1.5 text-sm w-64 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0021A5]"
								bind:value={passwordInput}
								autocomplete="current-password"
							/>
							<a href="/disclaimer" class="text-sm text-[#0021A5] font-semibold hover:underline"
								>Forgot Your Password?</a
							>
						</div>

						<div class="flex items-center gap-3 pt-2">
							<div class="w-28"></div>
							<button
								type="button" on:click={autoLogin} disabled={isAutoLoggingIn}
								class="bg-[#0021A5] text-white text-sm font-semibold px-5 py-1.5 rounded-sm hover:bg-[#001a85]"
							>
								Login
							</button>
							</div>

						<p class="pt-4 text-[11px] leading-relaxed text-slate-500 max-w-xl">
							For this simulation, use the same email address and password that you saved on the
							PredictAdmit.com home page. No real application data is used, and all information is
							stored only in your browser.
						</p>
					</form>
				</div>
			</div>
		</main>

		<!-- Footer -->
		<footer class="bg-[#0021A5] text-white text-sm">
			<div class="max-w-6xl mx-auto px-6 py-8">
				<div class="border-t border-white/20 mb-6"></div>
				<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<div class="flex items-center gap-2 mb-4">
							<span class="text-3xl font-black italic leading-none">UF</span>
							<span class="border-l-2 border-[#FA4616] pl-2 leading-tight">
								<span class="block text-[10px] tracking-wide">UNIVERSITY <span class="italic">of</span></span>
								<span class="block text-lg font-bold leading-none">FLORIDA</span>
							</span>
						</div>
						<div class="text-[11px] leading-relaxed text-white/80">
							Office Of Admissions<br />
							Division Of Enrollment Management<br />
							201 Criser Hall - PO Box 114000<br />
							Gainesville, FL 32611-4000<br />
							352-392-1365
						</div>
						<div class="flex gap-2 mt-4 text-white/80">
							{#each ['◎', '@', 'f', '✻', '▶'] as ic}
								<span
									class="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center text-[11px]"
									>{ic}</span
								>
							{/each}
						</div>
					</div>
					<div>
						<h3 class="text-[11px] font-bold tracking-wide text-[#8aa0ff] uppercase mb-3">Resources</h3>
						<ul class="space-y-1.5 text-[12px]">
							{#each ['Publications', 'For Counselors', 'GatorLink', 'ONE.UF', 'UFID', 'Policies', 'Privacy', 'Written Student Complaints', 'Consumer Disclosures'] as link}
								<li><a href="/disclaimer" class="hover:underline">{link}</a></li>
							{/each}
						</ul>
					</div>
					<div>
						<h3 class="text-[11px] font-bold tracking-wide text-[#8aa0ff] uppercase mb-3">Campus</h3>
						<ul class="space-y-1.5 text-[12px]">
							{#each ['Calendars', 'Campus Safety', 'Preview/Orientation'] as link}
								<li><a href="/disclaimer" class="hover:underline">{link}</a></li>
							{/each}
						</ul>
					</div>
					<div>
						<h3 class="text-[11px] font-bold tracking-wide text-[#8aa0ff] uppercase mb-3">Connect</h3>
						<ul class="space-y-1.5 text-[12px]">
							<li><a href="/disclaimer" class="hover:underline">Contact</a></li>
						</ul>
					</div>
				</div>
				<div class="border-t border-white/20 mt-8 pt-4 flex justify-between text-[11px] text-white/70">
					<span>&copy; 2026 University of Florida</span>
					<span>PredictAdmit Simulation — Not affiliated with the University of Florida</span>
				</div>
			</div>
		</footer>
	</div>
{:else if authenticated && !hasViewedUpdate}
	<!-- ============================= PORTAL ============================= -->
	<div class="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
		<header class="bg-[#0021A5] text-white">
			<div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
				<div class="flex items-baseline gap-2">
					<span class="text-2xl font-black italic tracking-tight leading-none">UF</span>
					<span class="text-sm font-semibold tracking-[0.2em] uppercase">Admissions</span>
				</div>
				<nav class="flex items-center gap-8 text-sm font-medium">
					<a href="/disclaimer" class="hover:underline">Gator Portal</a>
					<a href="/disclaimer" class="hover:underline">Visit and Events</a>
					<a href="/disclaimer" class="hover:underline">Contact</a>
				</nav>
			</div>
			<div class="max-w-6xl mx-auto px-6 pb-1 flex items-center gap-3 text-[11px] text-white/80">
				<span>{applicantName()}</span>
				<a href="/disclaimer" class="underline">Logout</a>
			</div>
		</header>

		<!-- Sub nav tabs -->
		<div class="bg-[#e6eaf5] border-b border-slate-300">
			<div class="max-w-6xl mx-auto px-6 flex flex-wrap gap-1">
				{#each navTabs as tab}
					<button
						on:click={() => (activeTab = tab)}
						class="px-4 py-2 text-[13px] transition-colors"
						class:bg-white={activeTab === tab}
						class:text-[#0021A5]={activeTab === tab}
						class:font-semibold={activeTab === tab}
						class:text-slate-600={activeTab !== tab}
					>
						{tab}
					</button>
				{/each}
			</div>
		</div>

		<!-- Deadline banner -->
		<div class="bg-[#0021A5] text-white text-center text-sm py-2 font-medium">
			Enrollment Confirmation Deadline — May 1st
		</div>

		<!-- Hero -->
		<div
			class="bg-gradient-to-r from-amber-400 via-orange-500 to-[#FA4616] text-white text-center py-10 px-6"
		>
			<h1 class="text-3xl font-bold text-white">Hi, {firstName()}!</h1>
			<p class="text-2xl font-light mt-1">Welcome to your Gator Portal.</p>
			<div
				class="mt-6 mx-auto max-w-md aspect-video bg-black/70 rounded-lg flex items-center justify-center border-4 border-white/30"
			>
				<div class="text-center">
					<div
						class="w-14 h-10 bg-red-600 rounded-md flex items-center justify-center mx-auto mb-2"
					>
						<span class="text-white text-lg">▶</span>
					</div>
					<span class="text-xs text-white/80">Why UF? | Gator Student Body President Olivia Taks</span>
				</div>
			</div>
		</div>

		<main class="flex-grow max-w-4xl mx-auto w-full px-6 py-10 space-y-10">
			<!-- Status update -->
			<div class="border border-rose-200 bg-rose-50 rounded-md p-5">
				<div class="text-[11px] uppercase tracking-wide text-rose-700 font-semibold mb-1">
					Status Update
				</div>
				<p class="text-sm text-slate-700 mb-3">
					An update to your application was posted <strong>{school.statusLastPosted}</strong>.
				</p>
				<button
					on:click={handleViewUpdate}
					class="text-sm font-semibold px-4 py-1.5 text-white bg-[#0021A5] rounded-sm hover:bg-[#001a85]"
				>
					View Simulated Status Update &raquo;
				</button>
			</div>

			<!-- YOUR UFID -->
			<section>
				<h2 class="text-xl font-semibold text-[#0021A5] border-b border-slate-200 pb-2 mb-3">
					YOUR UFID
				</h2>
				<p class="text-sm text-slate-600 leading-relaxed">
					Your UFID is assigned to you by the university and becomes the identifier for all
					transactions and services where personally identifiable information (PII) is required. Using
					your UFID helps protect you from identity theft, and protects UF from potential data and
					records theft that could expose personal information of students, faculty, and staff.
				</p>
				<button
					class="mt-3 text-sm font-semibold px-4 py-1.5 text-white bg-[#0021A5] rounded-sm hover:bg-[#001a85]"
					>Show/Hide your UFID</button
				>
			</section>

			<!-- NEXT STEPS CHECKLIST -->
			<section>
				<h2 class="text-xl font-semibold text-[#0021A5] border-b border-slate-200 pb-2 mb-3">
					NEXT STEPS CHECKLIST
				</h2>
				<table class="w-full text-sm text-left border border-slate-200">
					<thead class="bg-slate-50 text-slate-600">
						<tr>
							<th class="px-4 py-2 font-semibold">Status</th>
							<th class="px-4 py-2 font-semibold">Details</th>
							<th class="px-4 py-2 font-semibold">Date</th>
						</tr>
					</thead>
					<tbody>
						{#each checklist as item}
							<tr class="border-t border-slate-200">
								<td class="px-4 py-2 text-[#FA4616] font-medium">◌ {item.status}</td>
								<td class="px-4 py-2">{item.detail}</td>
								<td class="px-4 py-2 text-slate-400">—</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</section>

			<!-- FORMS -->
			<section>
				<h2 class="text-xl font-semibold text-[#0021A5] border-b border-slate-200 pb-2 mb-3">
					FORMS
				</h2>
				<div class="flex items-center gap-4">
					<span class="text-sm font-semibold text-[#FA4616]">Required</span>
					<button
						on:click={handleViewUpdate}
						class="text-sm font-semibold px-4 py-1.5 text-white bg-[#0021A5] rounded-sm hover:bg-[#001a85]"
						>View Simulated Enrollment Decision</button
					>
				</div>
			</section>

			<!-- APPLICATION MATERIALS -->
			<h2 class="text-2xl font-bold text-[#FA4616] text-center pt-4">APPLICATION MATERIALS</h2>

			<!-- Residency -->
			<section>
				<h2 class="text-xl font-semibold text-[#0021A5] border-b border-slate-200 pb-2 mb-3">
					CHECK YOUR RESIDENCY FOR TUITION PURPOSES
				</h2>
				<p class="text-sm text-slate-600">Your residency for tuition purposes is:</p>
				<p class="text-lg font-semibold text-slate-800 mt-1">Non-Florida</p>
			</section>

			<!-- Test scores -->
			<section>
				<h2 class="text-xl font-semibold text-[#0021A5] border-b border-slate-200 pb-2 mb-3">
					TEST SCORES
				</h2>
				<p class="text-sm text-slate-600 mb-3">
					UF requires standardized test scores to be considered for admission. You may self-report
					scores and double-check your official scores below. Once we receive your official scores and
					determine they match the self-reported scores, the status will be updated to "verified."
				</p>
				<table class="w-full text-sm text-left border border-slate-200">
					<thead class="bg-slate-50 text-slate-600">
						<tr>
							<th class="px-4 py-2 font-semibold">Test Type</th>
							<th class="px-4 py-2 font-semibold">Details</th>
							<th class="px-4 py-2 font-semibold">Test Date</th>
						</tr>
					</thead>
					<tbody>
						{#each testScores as row}
							<tr class="border-t border-slate-200">
								<td class="px-4 py-2 font-medium">{row.type}</td>
								<td class="px-4 py-2 text-green-700">{row.detail}</td>
								<td class="px-4 py-2">{row.date}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</section>

			<!-- School information -->
			<section>
				<h2 class="text-xl font-semibold text-[#0021A5] border-b border-slate-200 pb-2 mb-3">
					SCHOOL INFORMATION
				</h2>
				<p class="text-sm text-slate-600 mb-3">
					Below is a list of schools we have on record for you. If any schools are missing or you
					believe a school is listed in error, please email
					<a href="/disclaimer" class="text-[#0021A5] hover:underline">freshman@admissions.ufl.edu</a>
					to request an update.
				</p>
				<table class="w-full text-sm text-left border border-slate-200">
					<thead class="bg-slate-50 text-slate-600">
						<tr>
							<th class="px-4 py-2 font-semibold">Name</th>
							<th class="px-4 py-2 font-semibold">Degree</th>
							<th class="px-4 py-2 font-semibold">Level</th>
							<th class="px-4 py-2 font-semibold">State</th>
							<th class="px-4 py-2 font-semibold">Country</th>
						</tr>
					</thead>
					<tbody>
						{#each schools as row}
							<tr class="border-t border-slate-200">
								<td class="px-4 py-2">{row.name}</td>
								<td class="px-4 py-2">{row.degree}</td>
								<td class="px-4 py-2">{row.level}</td>
								<td class="px-4 py-2">{row.state}</td>
								<td class="px-4 py-2">{row.country}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</section>

			<!-- Upload materials -->
			<section>
				<h2 class="text-xl font-semibold text-[#0021A5] border-b border-slate-200 pb-2 mb-3">
					UPLOAD MATERIALS
				</h2>
				<p class="text-sm text-slate-600 mb-3">
					If we have requested transcripts or other documents, you may upload a copy of them here for
					review.
				</p>
				<div class="flex items-center gap-3">
					<span class="border border-slate-300 bg-slate-50 text-sm px-3 py-1.5 rounded-sm text-slate-500"
						>Choose File</span
					>
					<span class="text-sm text-slate-400">No file selected</span>
					<button
						class="text-sm font-semibold px-4 py-1.5 text-white bg-[#0021A5] rounded-sm hover:bg-[#001a85]"
						>Upload</button
					>
				</div>
			</section>
		</main>

		<!-- Footer -->
		<footer class="bg-[#0021A5] text-white text-sm">
			<div class="max-w-6xl mx-auto px-6 py-8">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<div class="flex items-center gap-2 mb-4">
							<span class="text-3xl font-black italic leading-none">UF</span>
							<span class="border-l-2 border-[#FA4616] pl-2 leading-tight">
								<span class="block text-[10px] tracking-wide">UNIVERSITY <span class="italic">of</span></span>
								<span class="block text-lg font-bold leading-none">FLORIDA</span>
							</span>
						</div>
						<div class="text-[11px] leading-relaxed text-white/80">
							Office Of Admissions<br />
							Division Of Enrollment Management<br />
							201 Criser Hall - PO Box 114000<br />
							Gainesville, FL 32611-4000<br />
							352-392-1365
						</div>
					</div>
					<div>
						<h3 class="text-[11px] font-bold tracking-wide text-[#8aa0ff] uppercase mb-3">Resources</h3>
						<ul class="space-y-1.5 text-[12px]">
							{#each ['Publications', 'For Counselors', 'GatorLink', 'ONE.UF', 'UFID', 'Policies', 'Privacy', 'Written Student Complaints', 'Consumer Disclosures'] as link}
								<li><a href="/disclaimer" class="hover:underline">{link}</a></li>
							{/each}
						</ul>
					</div>
					<div>
						<h3 class="text-[11px] font-bold tracking-wide text-[#8aa0ff] uppercase mb-3">Campus</h3>
						<ul class="space-y-1.5 text-[12px]">
							{#each ['Calendars', 'Campus Safety', 'Preview/Orientation'] as link}
								<li><a href="/disclaimer" class="hover:underline">{link}</a></li>
							{/each}
						</ul>
					</div>
					<div>
						<h3 class="text-[11px] font-bold tracking-wide text-[#8aa0ff] uppercase mb-3">Connect</h3>
						<ul class="space-y-1.5 text-[12px]">
							<li><a href="/disclaimer" class="hover:underline">Contact</a></li>
						</ul>
					</div>
				</div>
				<div class="border-t border-white/20 mt-8 pt-4 flex justify-between text-[11px] text-white/70">
					<span>&copy; 2026 University of Florida</span>
					<span>PredictAdmit Simulation — Not affiliated with the University of Florida</span>
				</div>
			</div>
		</footer>
	</div>
{:else if shownDecision === 'admit'}
	<FloridaAccepted
		applicantName={applicantName()}
		schoolName={school.schoolName}
		primaryColor={school.primaryColor}
		footerDomain={school.footerDomain}
	/>
{:else}
	<FloridaDenied
		applicantName={applicantName()}
		schoolName={school.schoolName}
		primaryColor={school.primaryColor}
		footerDomain={school.footerDomain}
	/>
{/if}
