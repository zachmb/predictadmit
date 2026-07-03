<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	export let applicantName: string;
	export let schoolName: string = 'Georgia Institute of Technology';
	export let primaryColor: string = '#003057';
	export let footerDomain: string = 'gatech.edu';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';

	const accent = '#B3A369';

	$: session = $page.data.session;
	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	$: firstName = applicantName ? applicantName.split(' ')[0] : 'Applicant';

	const viewAnalysis = () => {
		goto('/results/georgiatech');
	};
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<div class="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
	<!-- Gold masthead -->
	<header class="bg-[#B3A369]">
		<div class="max-w-4xl mx-auto px-6 h-14 flex items-center gap-3">
			<span class="text-white font-black text-2xl tracking-tighter leading-none" style="font-family: Georgia, serif;">GT</span>
			<span class="text-white text-xl font-semibold" style="font-family: Georgia, serif;">Georgia Tech</span>
		</div>
	</header>

	<main class="flex-grow">
		<div class="max-w-4xl mx-auto px-6 w-full">
			<!-- Applicant / links row -->
			<div class="flex justify-end items-center gap-2 py-2 text-[12px] text-slate-700">
				<span>{applicantName || 'Applicant'}</span>
				<a href="/disclaimer" class="text-[#003057] hover:underline">Logout</a>
			</div>

			<div class="flex justify-between items-start">
				<h1 class="text-2xl font-normal text-[#003057]">Undergraduate Admission</h1>
				<a href="/disclaimer" class="text-[13px] font-bold text-[#003057] underline hover:no-underline"
					>Download PDF</a
				>
			</div>

			{#if googleSignedIn && $userProfile.usingAI}
				<div class="mt-4 flex justify-end">
					<button
						on:click={viewAnalysis}
						class="flex items-center px-4 py-2 bg-[#003057] text-white rounded-md text-sm font-bold hover:brightness-125 transition-all shadow-md active:scale-95"
					>
						Deep Dive: Why did I get {$decisionsBySlug['georgiatech'] ?? 'this decision'}?
					</button>
				</div>
			{/if}

			<!-- Seal + wordmark -->
			<div class="flex items-center justify-center gap-4 my-10">
				<div
					class="w-16 h-16 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-center leading-tight"
					style="border-color: {accent}; color: {accent};"
				>
					GT<br />1885
				</div>
				<div class="text-2xl font-semibold text-[#003057] leading-tight" style="font-family: Georgia, serif;">
					Georgia Institute<br />of Technology
				</div>
			</div>

			<!-- Letter body -->
			<div class="max-w-2xl mx-auto text-[13px] leading-relaxed text-slate-800">
				<p class="mb-6 font-semibold">March 8, 2027</p>

				<div class="mb-6">
					<p>{applicantName || 'Applicant'}</p>
					<p>1924 Smith Rd</p>
					<p>Northbrook, IL 60062-5830</p>
				</div>

				<p class="mb-4">Congratulations, {firstName}!</p>

				<p class="mb-4">
					It is my great pleasure to offer you admission to the Georgia Institute of Technology and to
					welcome you to the incoming first-year class. From a remarkably competitive pool of
					applicants, your record of academic achievement, curiosity, and drive to make an impact
					stood out to our review team.
				</p>

				<p class="mb-4">
					Every application is holistically reviewed by multiple staff members who evaluate the
					credentials of each student on an individual and comparative basis. Your admission reflects
					the strength of your accomplishments and our confidence that you will thrive in the
					rigorous, collaborative environment that defines Georgia Tech, where progress and service
					guide everything we do.
				</p>

				<p class="mb-4">
					To secure your place in the class, please log in to your applicant portal to review your
					enrollment steps, financial aid information, and next steps for orientation. We encourage
					you to submit your enrollment confirmation by <strong>May 1, 2027</strong>.
				</p>

				<p class="mb-6">
					We are excited about all that you will contribute to our campus community, and we look
					forward to welcoming you to The Flats. Again, congratulations, and go Jackets!
				</p>

				<p class="mb-1">Sincerely,</p>
				<p class="text-2xl mb-1" style="font-family: 'Brush Script MT', 'Segoe Script', cursive; color: {primaryColor};">
					Mary Tipton Woolley
				</p>
				<p class="font-semibold">Mary Tipton Woolley</p>
				<p class="text-slate-700">Executive Director | Undergraduate Admission</p>
			</div>

			<div class="text-center my-10">
				<a href="/disclaimer" class="text-[13px] font-bold text-[#003057] underline hover:no-underline"
					>Return to Application Status</a
				>
			</div>

			<div class="max-w-2xl mx-auto mb-10 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
				<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
				is not a real admission decision from the {schoolName}.
			</div>
		</div>
	</main>

	<!-- Gold footer -->
	<footer class="bg-[#B3A369] text-white text-[11px]">
		<div class="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
			<div>
				<p class="font-semibold">Georgia Institute of Technology</p>
				<p>North Avenue, Atlanta, GA 30332 · 404.894.2000</p>
				<p><a href="/disclaimer" class="underline hover:no-underline">admission.{footerDomain}</a></p>
			</div>
			<span class="text-white/80 text-right"
				>PredictAdmit simulation · Not affiliated with the Georgia Institute of Technology</span
			>
		</div>
	</footer>
</div>
