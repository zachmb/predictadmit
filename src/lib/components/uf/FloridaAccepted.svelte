<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	export let applicantName: string;
	export let schoolName: string = 'University of Florida';
	export let primaryColor: string = '#0021A5';
	export let footerDomain: string = 'ufl.edu';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';

	$: session = $page.data.session;
	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	import { decisionsBySlug } from '$lib/stores/results';
	const viewAnalysis = () => {
		goto('/results/uf');
	};

	const accent = '#FA4616';
	$: firstName = applicantName ? applicantName.split(' ')[0] : 'Applicant';
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-slate-800 font-sans">
	<!-- Top admissions bar -->
	<header class="bg-[#0021A5] text-white">
		<div class="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
			<div class="flex items-baseline gap-2">
				<span class="text-2xl font-black italic tracking-tight leading-none">UF</span>
				<span class="text-sm font-semibold tracking-[0.2em] uppercase">Admissions</span>
			</div>
			<nav class="flex items-center gap-6 text-sm font-medium">
				<a href="/disclaimer" class="hover:underline">Gator Portal</a>
				<a href="/disclaimer" class="hover:underline">Visit and Events</a>
				<a href="/disclaimer" class="hover:underline">Contact</a>
			</nav>
		</div>
	</header>

	<div class="max-w-3xl mx-auto px-6 py-10">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="flex items-center px-4 py-2 bg-[#0021A5] text-white rounded-lg text-sm font-bold hover:bg-[#001a85] transition-all shadow-md active:scale-95"
				>
					Deep Dive: Why did I get {$decisionsBySlug['uf']}?
				</button>
			</div>
		{/if}

		<div class="flex justify-between items-start text-sm text-slate-600 mb-6">
			<span>January 23, 2027</span>
			<a href="/disclaimer" class="text-[#0021A5] font-medium hover:underline">Download PDF</a>
		</div>

		<!-- Letterhead: UF / FLORIDA logo + office + address -->
		<div class="flex justify-between items-start mb-8">
			<div>
				<div class="flex items-center gap-3">
					<span class="text-5xl font-black italic leading-none" style="color: {primaryColor};"
						>UF</span
					>
					<span class="leading-tight" style="color: {primaryColor};">
						<span class="block text-lg tracking-wide">UNIVERSITY <span class="italic font-light">of</span></span>
						<span class="block text-3xl font-black leading-none" style="color: {accent};">FLORIDA</span>
					</span>
				</div>
				<div class="text-xs text-slate-600 mt-3 leading-relaxed">
					Office of Admissions<br />
					Division of Enrollment Management
				</div>
			</div>
			<div class="text-[11px] text-slate-500 leading-relaxed text-left">
				201 Criser Hall<br />
				PO Box 114000<br />
				Gainesville, FL 32611-4000<br />
				352-392-1365<br />
				352-392-2115 Fax · Undergraduate<br />
				352-392-1853 · Graduate<br />
				www.admissions.ufl.edu
			</div>
		</div>

		<!-- Applicant address -->
		<div class="text-sm text-slate-700 mb-6 leading-relaxed">
			{applicantName || 'Applicant'}<br />
			1924 Smith Rd<br />
			Northbrook, IL 60062-5830
		</div>

		<!-- Salutation -->
		<div class="text-base font-semibold text-slate-900 mb-4">
			Congratulations, {firstName}!
		</div>

		<!-- Body -->
		<div class="space-y-4 text-sm leading-relaxed text-slate-800">
			<p>
				On behalf of our faculty, staff, and students, I am thrilled to offer you admission to the
				University of Florida. Your academic and extracurricular accomplishments impressed our review
				committee, and you will make a significant contribution to our community. Welcome to The Gator
				Nation!
			</p>
			<p>
				When you arrive at UF, the possibilities are endless! Jump into groundbreaking research with
				professors who are leaders in their fields, land internships that will launch your career, and
				take part in hands-on projects that create a real impact. Outside the classroom, lead campus
				initiatives, meet friends at the Reitz Student Union for fun workshops, or experience the
				electric energy of campus and the school spirit you can only find in the Southeastern
				Conference (SEC).
			</p>
			<p>
				You are admitted to the Fall term, which begins on August 20, 2027. To secure your place in
				the Class of 2031, visit your Gator Portal, confirm your enrollment, and submit your $200
				enrollment deposit by 11:59 pm on <strong>May 1, 2027</strong>.
			</p>
			<p>
				To help you keep track of your next steps, we created a custom welcome site for all newly
				admitted students:
				<a href="/disclaimer" class="text-[#0021A5] hover:underline">our.ufl.edu/uf30welcome</a>.
			</p>
			<p>
				If you or your family need any assistance as you make your final college decision, please let
				us know. Go Gators!
			</p>
		</div>

		<!-- Signature -->
		<div class="mt-8">
			<p class="text-sm text-slate-800 mb-3">Warm regards,</p>
			<div
				class="font-serif italic text-2xl text-slate-700"
				style="font-family: 'Brush Script MT', cursive;"
			>
				Lee H. Melvin
			</div>
			<div class="text-sm font-semibold text-slate-900 mt-1">Lee H. Melvin</div>
			<div class="text-xs text-slate-600">
				Associate Vice President and Executive Director of Admissions
			</div>
		</div>

		<!-- Important contingency -->
		<div class="mt-8 text-xs text-slate-600 leading-relaxed">
			<strong class="text-slate-800">Important contingency:</strong> This offer of admission is
			tentative until we receive your official test scores and final high school and/or college
			transcript(s), and we verify your eligibility. You must remain at the same academic level and
			graduate from high school on time. Your final transcript(s) and test scores should be sent as
			soon as they become available, no later than July 1, 2027.
		</div>

		<div class="mt-8 text-center">
			<a href="/disclaimer" class="text-sm text-[#0021A5] hover:underline">Return to Application Status</a>
		</div>

		<!-- Simulation disclaimer -->
		<div class="mt-10 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of Florida.
		</div>
	</div>

	<!-- Footer -->
	<footer class="bg-[#0021A5] text-white text-sm mt-10">
		<div class="max-w-5xl mx-auto px-6 py-8">
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
				<span>&copy; 2027 University of Florida · www.{footerDomain}</span>
				<span>PredictAdmit Simulation — Not affiliated with the University of Florida</span>
			</div>
		</div>
	</footer>
</main>
