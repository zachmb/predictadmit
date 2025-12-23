<script lang="ts">
// Svelte Stores and Types
import { userProfile } from '$lib/stores/user';
import type { UserProfile } from '$lib/stores/user';

// Shared Components and Configuration
import { schoolConfigs } from '$lib/config/schools';

// School-Specific Components (Decision Letters)
import DartmouthAccepted from '$lib/components/dartmouth/DartmouthAccepted.svelte';
import DartmouthDenied from '$lib/components/dartmouth/DartmouthDenied.svelte';

// --- Component Configuration ---
const SCHOOL_DATA = schoolConfigs.dartmouth; // Ensure 'dartmouth' exists in your config
const DARTMOUTH_GREEN = '#00693E';
const DARK_FOOTER_BG = '#1e2023'; // Deep green/black for the footer

// --- State Variables ---
let profile: UserProfile = { name: '', email: '', password: '' };
let emailInput = '';
let passwordInput = '';
let error = '';
let authenticated = false;
let hasViewedUpdate = false;

// Subscribe to the global user profile store
$: profile = $userProfile;

// Dynamic Data Helpers
const applicantName = () => profile.name || 'Applicant';
const applicantEmail = () => profile.email || 'applicant@email.com';

// --- Handlers ---
const handleLoadSavedLogin = () => {
	if (!profile.email || !profile.password) {
		error = 'No saved PredictAdmit login found. Please save it on the main page first.';
		return;
	}
	emailInput = profile.email;
	passwordInput = profile.password;
	error = '';
};

const handleLogin = (event: SubmitEvent) => {
	event.preventDefault();
	if (!SCHOOL_DATA) {
		error = 'Unknown portal.';
		authenticated = false;
		return;
	}
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
};
</script>

<svelte:head>
	<title>{SCHOOL_DATA.schoolName} Admissions Portal</title>
</svelte:head>

<div class="bg-white text-slate-900 font-sans flex flex-col {authenticated ? 'min-h-screen' : ''}">
	
	{#if !authenticated}
		<div class="bg-white">
			<header class="bg-white border-b border-slate-300">
				<div class="max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
					<div class="flex items-baseline gap-3">
						<span class="text-3xl font-serif" style={`color: ${SCHOOL_DATA.primaryColor};`}>
							{SCHOOL_DATA.logoPrimary}
						</span>
						<span class="text-[11px] tracking-[0.18em] uppercase text-slate-700">
							{SCHOOL_DATA.logoSecondary}
						</span>
					</div>
					<div class="text-[11px] text-slate-700">
						{applicantName()}
					</div>
				</div>
				<div class="h-8" style={`background-color: ${SCHOOL_DATA.primaryColor};`}></div>
			</header>

			<section class="bg-white">
				<div class="max-w-5xl mx-auto px-10 py-10">
					<h1 class="text-3xl font-normal mb-6">Login</h1>

					<div class="border border-lime-700 bg-lime-100 px-4 py-3 mb-8 text-[12px] text-slate-900">
						To log in, please enter your email address and password.
					</div>

					<form class="space-y-4 text-sm" on:submit={handleLogin}>
						{#if error}
							<p class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2" role="alert">
								{error}
							</p>
						{/if}

						<div class="flex items-center gap-4">
							<label for="portal-email" class="w-32 text-[12px] font-semibold text-slate-900 text-right">Email Address</label>
							<input id="portal-email" type="email" class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80" bind:value={emailInput} autocomplete="email" />
						</div>

						<div class="flex items-center gap-4">
							<label for="portal-password" class="w-32 text-[12px] font-semibold text-slate-900 text-right">Password</label>
							<input id="portal-password" type="password" class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80" bind:value={passwordInput} autocomplete="current-password" />
							<a href="/disclaimer" class="text-[12px] text-blue-800 underline hover:no-underline">Forgot Your Password?</a>
						</div>

						<div class="flex items-center gap-4 pt-4">
							<div class="w-32"></div>
							<div class="flex flex-wrap items-center gap-3">
								<button type="submit" class="border border-slate-500 bg-slate-300 px-4 py-1 text-[12px] font-semibold hover:bg-slate-400 active:bg-slate-500">Login</button>
								<button type="button" class="border border-slate-400 bg-slate-100 px-3 py-1 text-[11px] hover:bg-slate-200 active:bg-slate-300" on:click={handleLoadSavedLogin}>Load saved PredictAdmit login</button>
							</div>
						</div>

						<p class="pt-4 text-[10px] leading-relaxed text-slate-600 max-w-xl">
							For this simulation, use the same email address and password that you saved on the PredictAdmit.com home page. No real application data is used, and all information is stored only in your browser.
						</p>
					</form>
				</div>
			</section>
		</div>

		<footer class="mt-8">
			<div class="h-10 flex items-center" style={`background-color: ${SCHOOL_DATA.primaryColor};`}>
				<div class="max-w-5xl mx-auto px-6 w-full flex items-center justify-between text-[11px] text-white">
					<span>&copy; {SCHOOL_DATA.footerDomain} 2019</span>
					<span class="opacity-80">PredictAdmit.com simulation · Not affiliated with {SCHOOL_DATA.schoolName}</span>
				</div>
			</div>
		</footer>

	{:else}
		{#if !hasViewedUpdate}
			<div class="flex-grow flex flex-col min-h-screen bg-white">
				
				<header class="w-full">
					<div class="w-full py-3 text-center text-white font-bold tracking-wide text-sm" style={`background-color: ${DARTMOUTH_GREEN};`}>
						Undergraduate Admissions
					</div>
					<div class="w-full border-b border-gray-200 py-3">
						<nav class="max-w-6xl mx-auto flex justify-center space-x-8 text-[11px] font-bold text-green-800 uppercase tracking-wider">
							<a href="#" class="hover:underline">About</a>
							<a href="#" class="hover:underline">Academics</a>
							<a href="#" class="hover:underline">Life at Dartmouth</a>
							<a href="#" class="hover:underline">Visit</a>
							<a href="#" class="hover:underline">Apply</a>
							<a href="#" class="hover:underline">Afford</a>
							<a href="#" class="hover:underline">Follow</a>
						</nav>
					</div>
				</header>

				<main class="max-w-5xl mx-auto px-6 py-8 w-full flex-1">
					<div class="flex justify-end text-[10px] text-gray-600 mb-6">
						{applicantName()} <a href="/" class="text-green-700 ml-1 hover:underline">Logout</a>
					</div>

					<h1 class="text-3xl font-bold text-black mb-6">Welcome, {applicantName()}</h1>

					<div class="mb-8">
						<h2 class="text-lg font-bold text-black mb-2">Verify Address</h2>
						<p class="text-xs text-gray-800 mb-3">We have your address listed as follows:</p>
						<div class="text-xs text-gray-800 mb-3">
							<p class="font-bold">Permanent Address</p>
							<p>123 College Way</p>
							<p>Pasadena, CA 91101</p>
							<p>United States</p>
						</div>
						<a href="#" class="text-xs text-green-700 hover:underline">Edit Addresses</a>
					</div>

					<div class="mb-8">
						<h2 class="text-lg font-bold text-black mb-2">Status Update</h2>
						<div class="bg-yellow-100 p-4 border border-yellow-200">
							<p class="text-xs font-bold text-black mb-1">New updates to your application were posted March 26th, 2020</p>
							<p class="text-xs text-black mb-3">View your admission decision. If applicable, your financial aid award is located below your admission letter.</p>
							<button on:click={handleViewUpdate} class="bg-gray-100 border border-gray-300 text-black text-xs font-bold px-3 py-1 shadow-sm hover:bg-gray-200">
								View Update >>
							</button>
						</div>
					</div>

					<div class="flex space-x-1 mb-4">
						<button class="bg-gray-100 border border-gray-300 border-b-0 px-4 py-2 text-xs font-bold text-black">Admissions</button>
						<button class="bg-white border-b border-gray-300 px-4 py-2 text-xs text-blue-600 hover:underline">Financial Aid</button>
					</div>

					<div class="mb-8">
						<h2 class="text-lg font-bold text-black mb-2">Application Checklist</h2>
						<table class="w-full text-xs text-left border-collapse">
							<thead>
								<tr class="border-b border-gray-300">
									<th class="py-2 font-bold text-black">Status</th>
									<th class="py-2 font-bold text-black">Details</th>
									<th class="py-2 font-bold text-black text-right">Date</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-b border-gray-200"><td class="py-2 text-green-600 font-bold">✓ Received</td><td class="py-2">Application Fee</td><td class="py-2 text-right">01/03/2020</td></tr>
								<tr class="border-b border-gray-200"><td class="py-2 text-green-600 font-bold">✓ Received</td><td class="py-2">Application</td><td class="py-2 text-right">01/03/2020</td></tr>
								<tr class="border-b border-gray-200"><td class="py-2 text-green-600 font-bold">✓ Received</td><td class="py-2">Mid-Year Grades</td><td class="py-2 text-right">02/13/2020</td></tr>
								<tr class="border-b border-gray-200"><td class="py-2 text-green-600 font-bold">✓ Received</td><td class="py-2">Writing Supplement</td><td class="py-2 text-right">01/03/2020</td></tr>
								<tr class="border-b border-gray-200"><td class="py-2 text-green-600 font-bold">✓ Received</td><td class="py-2">School Report</td><td class="py-2 text-right">01/03/2020</td></tr>
								<tr class="border-b border-gray-200"><td class="py-2 text-green-600 font-bold">✓ Received</td><td class="py-2">School Report Recommendation</td><td class="py-2 text-right">01/03/2020</td></tr>
								<tr class="border-b border-gray-200"><td class="py-2 text-green-600 font-bold">✓ Received</td><td class="py-2">School Report Transcript</td><td class="py-2 text-right">01/03/2020</td></tr>
								<tr class="border-b border-gray-200"><td class="py-2 text-green-600 font-bold">✓ Received</td><td class="py-2">SAT/ACT Test Scores</td><td class="py-2 text-right">01/03/2020</td></tr>
								<tr class="border-b border-gray-200"><td class="py-2">Optional</td><td class="py-2">SAT Subject Test Scores (Recommended)</td><td class="py-2 text-right"></td></tr>
								<tr class="border-b border-gray-200"><td class="py-2 text-green-600 font-bold">✓ Received</td><td class="py-2">Teacher Recommendation 1</td><td class="py-2 text-right">01/03/2020</td></tr>
								<tr class="border-b border-gray-200"><td class="py-2 text-green-600 font-bold">✓ Received</td><td class="py-2">Teacher Recommendation 2</td><td class="py-2 text-right">01/03/2020</td></tr>
								<tr class="border-b border-gray-200"><td class="py-2">Optional</td><td class="py-2">Peer Recommendation (Recommended)</td><td class="py-2 text-right"></td></tr>
							</tbody>
						</table>
					</div>

					<div class="mb-12">
						<h2 class="text-lg font-bold text-black mb-2">Test Scores Received</h2>
						<p class="text-xs text-gray-800 mb-4">
							Below you will find all scores that have been received by our office and matched to your record. Please note that the admissions
							committee will only evaluate your top score for each type of test taken. Self-reported scores are permissible for admission purposes.
							Official scores are required prior to enrollment.
						</p>
						<table class="w-full text-xs text-left border border-black">
							<thead class="bg-gray-100 border-b border-black">
								<tr>
									<th class="py-1 px-2 border-r border-black font-normal">Test Date</th>
									<th class="py-1 px-2 border-r border-black font-normal">Test Name</th>
									<th class="py-1 px-2 border-r border-black font-normal">Test Score</th>
									<th class="py-1 px-2 font-normal">Test Status</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-black">
								<tr><td class="py-1 px-2 border-r border-black">09/2019</td><td class="py-1 px-2 border-r border-black">ACT</td><td class="py-1 px-2 border-r border-black">34</td><td class="py-1 px-2">Official</td></tr>
								<tr><td class="py-1 px-2 border-r border-black">09/2019</td><td class="py-1 px-2 border-r border-black">ACT</td><td class="py-1 px-2 border-r border-black">34</td><td class="py-1 px-2">Self-Reported</td></tr>
								<tr><td class="py-1 px-2 border-r border-black">08/2019</td><td class="py-1 px-2 border-r border-black">SAT II Physics</td><td class="py-1 px-2 border-r border-black">800</td><td class="py-1 px-2">Official</td></tr>
								<tr><td class="py-1 px-2 border-r border-black">08/2019</td><td class="py-1 px-2 border-r border-black">SAT II Physics</td><td class="py-1 px-2 border-r border-black">800</td><td class="py-1 px-2">Self-Reported</td></tr>
								<tr><td class="py-1 px-2 border-r border-black">05/2019</td><td class="py-1 px-2 border-r border-black">AP Macroeconomics</td><td class="py-1 px-2 border-r border-black">5</td><td class="py-1 px-2">Self-Reported</td></tr>
								<tr><td class="py-1 px-2 border-r border-black">05/2019</td><td class="py-1 px-2 border-r border-black">AP Calculus (AB)</td><td class="py-1 px-2 border-r border-black">5</td><td class="py-1 px-2">Self-Reported</td></tr>
								<tr><td class="py-1 px-2 border-r border-black">05/2019</td><td class="py-1 px-2 border-r border-black">AP Microeconomics</td><td class="py-1 px-2 border-r border-black">5</td><td class="py-1 px-2">Self-Reported</td></tr>
								<tr><td class="py-1 px-2 border-r border-black">05/2019</td><td class="py-1 px-2 border-r border-black">AP Physics 2</td><td class="py-1 px-2 border-r border-black">4</td><td class="py-1 px-2">Self-Reported</td></tr>
								<tr><td class="py-1 px-2 border-r border-black">05/2019</td><td class="py-1 px-2 border-r border-black">AP Physics 1</td><td class="py-1 px-2 border-r border-black">4</td><td class="py-1 px-2">Self-Reported</td></tr>
								<tr><td class="py-1 px-2 border-r border-black">05/2018</td><td class="py-1 px-2 border-r border-black">AP Computer Science (A)</td><td class="py-1 px-2 border-r border-black">4</td><td class="py-1 px-2">Self-Reported</td></tr>
							</tbody>
						</table>
					</div>
				</main>

				<footer class="w-full text-white pt-10 mt-auto" style={`background-color: ${DARK_FOOTER_BG};`}>
					<div class="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs pb-10">
						<div>
							<h3 class="font-bold mb-3 uppercase tracking-wider text-green-300">MY DARTMOUTH</h3>
							<ul class="space-y-1">
								<li><a href="#" class="hover:underline">Students</a></li>
								<li><a href="#" class="hover:underline">Faculty</a></li>
								<li><a href="#" class="hover:underline">Staff</a></li>
								<li><a href="#" class="hover:underline">Alumni</a></li>
								<li><a href="#" class="hover:underline">Families</a></li>
							</ul>
						</div>

						<div>
							<h3 class="font-bold mb-3 uppercase tracking-wider text-green-300">FIND IT FAST</h3>
							<ul class="space-y-1">
								<li><a href="#" class="hover:underline">Campus Map</a></li>
								<li><a href="#" class="hover:underline">Directory</a></li>
								<li><a href="#" class="hover:underline">Events</a></li>
								<li><a href="#" class="hover:underline">News</a></li>
								<li><a href="#" class="hover:underline">Visit</a></li>
							</ul>
						</div>

						<div>
							<h3 class="font-bold mb-3 uppercase tracking-wider text-green-300">RESOURCES</h3>
							<ul class="space-y-1">
								<li><a href="#" class="hover:underline">Dartmouth at a Glance</a></li>
								<li><a href="#" class="hover:underline">Accessibility</a></li>
								<li><a href="#" class="hover:underline">Administrative Offices</a></li>
								<li><a href="#" class="hover:underline">Emergency Preparedness</a></li>
								<li><a href="#" class="hover:underline">Careers</a></li>
								<li><a href="#" class="hover:underline">Sexual Respect & Title IX</a></li>
							</ul>
						</div>

						<div>
							<h3 class="font-bold mb-3 uppercase tracking-wider text-green-300">CONNECT WITH US</h3>
							<ul class="space-y-1">
								<li><a href="#" class="hover:underline">facebook</a></li>
								<li><a href="#" class="hover:underline">twitter</a></li>
								<li><a href="#" class="hover:underline">flickr</a></li>
								<li><a href="#" class="hover:underline">Instagram</a></li>
								<li><a href="#" class="hover:underline">YouTube</a></li>
							</ul>
						</div>
					</div>

					<div class="border-t border-gray-700 py-3 text-center text-[10px] bg-slate-800">
						&copy; Copyright 2022 **Dartmouth College** | <a href="#" class="hover:underline">Privacy</a> | <a href="#" class="hover:underline">A-Z Index</a> | <a href="#" class="hover:underline">Contact</a>
					</div>
					<div class="py-1 text-center text-[9px] bg-slate-900">
						PredictAdmit.com Simulation. Not affiliated with Dartmouth College.
					</div>
				</footer>
			</div>
		{:else}
			{#if SCHOOL_DATA.decision === 'admit'}
				<DartmouthAccepted applicantName={applicantName()} />
			{:else}
				<DartmouthDenied applicantName={applicantName()} />
			{/if}
		{/if}
	{/if}
</div>