<script lang="ts">
	import { tick } from 'svelte';
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';
	import GeorgiaTechAccepted from '$lib/components/georgiatech/GeorgiaTechAccepted.svelte';
	import GeorgiaTechDenied from '$lib/components/georgiatech/GeorgiaTechDenied.svelte';

	const SLUG = 'georgiatech';
	const school = {
		schoolName: 'Georgia Institute of Technology',
		primaryColor: '#003057',
		accentColor: '#B3A369',
		footerDomain: 'gatech.edu',
		statusLastPosted: 'March 8, 2026',
		round: 'Regular Decision',
		referenceNumber: '20260012'
	};

	let profile: UserProfile = { ...defaultProfile };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;
	let activeTab = 'Admissions Status';

	$: profile = $userProfile;

	const applicantName = () => profile.name || 'Applicant';
	const firstName = () => (profile.name ? profile.name.split(' ')[0] : 'Applicant');

	// Default decision when the prediction store has no entry for this slug:
	const DEFAULT_DECISION = 'deny';
	$: shownDecision = $decisionsBySlug[SLUG] ?? DEFAULT_DECISION;

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
</script>

<svelte:head>
	<title>Georgia Tech — Undergraduate Admission</title>
</svelte:head>

{#if !authenticated}
	<!-- ============================= LOGIN ============================= -->
	<div class="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
		<!-- Gold masthead -->
		<header class="bg-[#B3A369]">
			<div class="max-w-6xl mx-auto px-6 h-14 flex items-center gap-3">
				<span
					class="inline-flex items-center justify-center text-white font-black text-2xl tracking-tighter leading-none"
					style="font-family: Georgia, 'Times New Roman', serif;"
				>
					GT
				</span>
				<span class="text-white text-xl font-semibold" style="font-family: Georgia, serif;">
					Georgia Tech
				</span>
			</div>
		</header>

		<main class="flex-grow">
			<div class="max-w-6xl mx-auto px-6">
				<h1 class="text-3xl font-normal text-[#003057] mt-8 mb-6">Undergraduate Admission</h1>

				<h2 class="text-lg font-bold text-slate-800 mb-3">Login</h2>

				<div
					class="border-l-4 border-green-600 bg-green-50 px-4 py-2.5 mb-6 text-[13px] text-slate-800"
				>
					To log in, please enter your email address and password.
				</div>

				<form class="text-sm" on:submit={handleLogin}>
					{#if error}
						<p
							class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-3 max-w-lg"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-3 mb-2">
						<label for="gt-email" class="w-28 text-[13px] text-slate-800">Email Address</label>
						<input
							id="gt-email"
							type="email"
							class="border border-slate-400 bg-white px-2 py-1 text-[13px] w-64"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-3 mb-4">
						<label for="gt-password" class="w-28 text-[13px] text-slate-800">Password</label>
						<input
							id="gt-password"
							type="password"
							class="border border-slate-400 bg-white px-2 py-1 text-[13px] w-64"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a
							href="/disclaimer"
							class="text-[13px] font-bold text-[#003057] underline hover:no-underline ml-4"
						>
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-3">
						<div class="w-28"></div>
						<button
							type="submit"
							class="border border-slate-500 bg-slate-200 px-4 py-1 text-[12px] font-semibold text-slate-800 hover:bg-slate-300 active:bg-slate-400"
						>
							Login
						</button>
						<button
							type="button"
							class="border border-slate-400 bg-slate-100 px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-200"
							on:click={handleLoadSavedLogin}
						>
							Load saved PredictAdmit login
						</button>
					</div>

					<p class="pt-6 text-[11px] leading-relaxed text-slate-500 max-w-xl">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<!-- Gold footer -->
		<footer class="bg-[#B3A369] text-white text-[11px] mt-16">
			<div class="max-w-6xl mx-auto px-6 py-8">
				<div class="flex justify-end gap-3 mb-6 text-white/90 text-sm">
					<span>f</span><span>◎</span><span>▶</span><span>◉</span><span>❦</span>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div>
						<p class="font-semibold">Georgia Institute of Technology</p>
						<p>North Avenue, Atlanta, GA 30332</p>
						<p>404.894.2000</p>
						<p><a href="/disclaimer" class="underline hover:no-underline">Campus Map</a></p>
						<p><a href="/disclaimer" class="underline hover:no-underline">Enable Accessibility</a></p>
					</div>
					<div>
						<p class="font-semibold">General</p>
						<p><a href="/disclaimer" class="underline hover:no-underline">Directory</a></p>
						<p><a href="/disclaimer" class="underline hover:no-underline">Employment</a></p>
						<p><a href="/disclaimer" class="underline hover:no-underline">Emergency Information</a></p>
						<p>
							<a href="/disclaimer" class="underline hover:no-underline"
								>Download Adobe Acrobat Reader</a
							>
						</p>
					</div>
					<div>
						<p class="font-semibold">Legal</p>
						<p>
							<a href="/disclaimer" class="underline hover:no-underline"
								>Equal Opportunity Nondiscrimination, and Anti-Harassment Policy</a
							>
						</p>
						<p>
							<a href="/disclaimer" class="underline hover:no-underline">Privacy Information</a>
						</p>
						<p><a href="/disclaimer" class="underline hover:no-underline">Accessibility</a></p>
						<p><a href="/disclaimer" class="underline hover:no-underline">Accountability</a></p>
						<p><a href="/disclaimer" class="underline hover:no-underline">Accreditation</a></p>
					</div>
					<div class="flex flex-col items-start md:items-end justify-end">
						<div class="flex items-center gap-2">
							<span class="font-black text-2xl" style="font-family: Georgia, serif;">GT</span>
							<span class="leading-tight"
								>Georgia Institute<br />of Technology</span
							>
						</div>
						<p class="mt-2 text-white/80">&copy;2026 Georgia Institute of Technology</p>
					</div>
				</div>
			</div>
		</footer>
	</div>
{:else if authenticated && !hasViewedUpdate}
	<!-- ============================= PORTAL ============================= -->
	<div class="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
		<!-- Gold masthead -->
		<header class="bg-[#B3A369]">
			<div class="max-w-6xl mx-auto px-6 h-14 flex items-center gap-3">
				<span
					class="text-white font-black text-2xl tracking-tighter leading-none"
					style="font-family: Georgia, serif;"
				>
					GT
				</span>
				<span class="text-white text-xl font-semibold" style="font-family: Georgia, serif;">
					Georgia Tech
				</span>
			</div>
		</header>

		<div class="max-w-4xl mx-auto w-full px-6 flex-grow">
			<!-- Applicant / logout row -->
			<div class="flex justify-end items-center gap-2 py-3 text-[12px] text-slate-700">
				<span>{applicantName()}</span>
				<a href="/disclaimer" class="text-[#003057] hover:underline">Logout</a>
			</div>

			<!-- Hero banner -->
			<div
				class="relative overflow-hidden border border-[#B3A369] mb-5"
				style="background: linear-gradient(120deg, #0b2a1f 0%, #14342a 40%, #1c2b24 100%);"
			>
				<div class="flex items-center justify-between px-8 py-10">
					<div>
						<h1 class="text-4xl font-bold text-[#B3A369] mb-2" style="font-family: Georgia, serif;">
							Hi, {firstName()}!
						</h1>
						<p class="text-white text-sm mb-4">First-year 2026 &nbsp;|&nbsp; Computational Media</p>
						<button
							on:click={handleViewUpdate}
							class="bg-[#B3A369] text-[#003057] text-[12px] font-bold uppercase tracking-wide px-4 py-2 hover:brightness-105"
						>
							Decision Letter
						</button>
					</div>
					<a
						href="/disclaimer"
						class="bg-[#003057] text-white text-[12px] font-bold uppercase tracking-wide px-5 py-3 hover:brightness-125"
					>
						Quick Links
					</a>
				</div>
			</div>

			<!-- Transfer opt-in banner -->
			<div class="border border-[#B3A369] p-3 mb-5 text-center">
				<p class="text-[12px] font-semibold text-[#003057] mb-2">
					Considering a future transfer to Georgia Tech? Opt-in to receive communications using the
					form below.
				</p>
				<a
					href="/disclaimer"
					class="block bg-[#003057] text-white text-lg font-bold py-3 tracking-wide hover:brightness-125"
				>
					OPT-IN FOR TRANSFER COMMUNICATIONS
				</a>
			</div>

			<!-- Checklist -->
			<div class="border-2 border-[#003057] p-4 mb-6">
				<div class="border border-slate-200 p-4">
					<h2 class="text-center text-xl font-bold text-[#003057] mb-4">CHECKLIST</h2>
					<table class="w-full text-[13px]">
						<thead>
							<tr class="border-b border-slate-300 text-slate-700">
								<th class="py-2 text-left font-bold w-16">Status</th>
								<th class="py-2 text-left font-bold">Subject</th>
								<th class="py-2 text-right font-bold w-28">Date</th>
							</tr>
						</thead>
						<tbody>
							<tr class="border-b border-slate-200">
								<td class="py-3 text-[#B3A369] text-lg text-center">✔</td>
								<td class="py-3">
									<a href="/disclaimer" class="text-[#003057] font-semibold hover:underline"
										>ACT or SAT Scores (Self-Reported)</a
									>
								</td>
								<td class="py-3 text-right text-slate-600">11/02/2025</td>
							</tr>
							<tr>
								<td class="py-3 text-[#B3A369] text-lg text-center">✔</td>
								<td class="py-3 text-slate-800">
									High School Transcript (Glenbrook North High School)
								</td>
								<td class="py-3 text-right text-slate-600">11/05/2025</td>
							</tr>
						</tbody>
					</table>
					<div class="mt-4 bg-[#1d6b6b] text-white text-center text-lg font-bold py-3">
						Documents Received
					</div>
				</div>
			</div>

			<!-- Helpful contacts -->
			<div class="border border-[#B3A369] p-5 mb-10">
				<h2 class="text-center text-xl font-bold text-[#003057] mb-5">HELPFUL CONTACTS</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div class="border border-slate-200 p-4">
						<h3 class="text-sm font-bold text-[#003057] mb-2">Office of Undergraduate Admission</h3>
						<p class="text-[12px] text-slate-700 mb-3 leading-relaxed">
							If you have any questions about the application process or require further assistance,
							please do not hesitate to contact our office.
						</p>
						<p class="text-[12px] text-slate-700">404.894.4154</p>
						<a href="/disclaimer" class="text-[12px] font-semibold text-[#003057] hover:underline"
							>admission@gatech.edu</a
						>
					</div>
					<div class="border border-slate-200 p-4">
						<h3 class="text-sm font-bold text-[#003057] mb-2">
							Office of Scholarship and Financial Aid
						</h3>
						<p class="text-[12px] text-slate-700 mb-3 leading-relaxed">
							Learn more by visiting
							<a href="/disclaimer" class="font-semibold text-[#003057] hover:underline">our website</a
							>.
						</p>
						<p class="text-[12px] text-slate-700">404.894.4160</p>
						<a href="/disclaimer" class="text-[12px] font-semibold text-[#003057] hover:underline"
							>finaid@gatech.edu</a
						>
					</div>
				</div>
			</div>
		</div>

		<!-- Gold footer -->
		<footer class="bg-[#B3A369] text-white text-[11px]">
			<div class="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
				<span>&copy; 2026 Georgia Institute of Technology</span>
				<span class="text-white/80"
					>PredictAdmit simulation · Not affiliated with the Georgia Institute of Technology</span
				>
			</div>
		</footer>
	</div>
{:else if shownDecision === 'admit'}
	<GeorgiaTechAccepted
		applicantName={applicantName()}
		schoolName={school.schoolName}
		primaryColor={school.primaryColor}
		footerDomain={school.footerDomain}
	/>
{:else}
	<GeorgiaTechDenied
		applicantName={applicantName()}
		schoolName={school.schoolName}
		primaryColor={school.primaryColor}
		footerDomain={school.footerDomain}
	/>
{/if}
