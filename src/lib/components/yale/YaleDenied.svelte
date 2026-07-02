<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Yale College';
	export let primaryColor: string = '#00356B';
	export let footerDomain: string = 'yale.edu';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';

	$: session = $page.data.session;

	let googleSignedIn = false;
	let googleEmail = '';
	let googleName = '';

	$: {
		googleSignedIn = !!session?.user;
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}
	import { decisionsBySlug } from '$lib/stores/results';
	const viewAnalysis = () => {
		goto('/results/yale');
	};

	$: firstName = (applicantName || 'Applicant').split(' ')[0];
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-900 font-serif">
	<!-- Header -->
	<header class="border-b-2 pb-2 pt-5 px-8" style="border-color: {primaryColor};">
		<div class="flex items-end justify-between">
			<span class="text-4xl font-serif" style="color: {primaryColor};">Yale</span>
			<div class="text-[11px] text-gray-600 pb-1">
				{applicantName || 'Applicant'}
				<a href="/disclaimer" class="underline ml-1" style="color: {primaryColor};">Logout</a>
			</div>
		</div>
	</header>

	<div class="max-w-3xl mx-auto px-6 pt-10 text-[13px] leading-relaxed">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end font-sans">
				<button
					on:click={viewAnalysis}
					class="px-4 py-2 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
					style="background-color: {primaryColor};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['yale']}?
				</button>
			</div>
		{/if}

		<!-- Date -->
		<div class="font-bold mb-6">March 26, 2026</div>

		<!-- Salutation -->
		<p class="mb-4">Dear {firstName},</p>

		<div class="space-y-4">
			<p>
				The Yale Admissions Committee has completed its evaluation of this year's candidates, and I am
				genuinely sorry that we are not able to offer you a place in the Class of 2030.
			</p>

			<p>
				I realize that this decision may come as a real disappointment. I hope you will understand
				that the decision reflects the extraordinary range of talents represented in our applicant
				pool and not a judgment about your own abilities or potential. Of the more than fifty
				thousand individuals who applied to Yale this year, most are fully capable of doing
				outstanding work and making a unique contribution to a campus community. It is painful to us
				that we must turn away so many superbly talented students.
			</p>

			<p>
				You may be tempted to ask what was lacking in your application. In truth, it is usually
				difficult for us to point to obvious weaknesses when so many applicants have demonstrated real
				achievement and potential for the future. Our decisions say far more about the small number of
				spaces available and the difficult choices we make than they do about a candidate's personal
				and academic promise.
			</p>

			<p>
				I hope that the replies you receive from other colleges will soon erase any disappointment
				regarding Yale's decision, and that you will go on to great success in your educational
				pursuits.
			</p>
		</div>

		<!-- Signature -->
		<div class="mt-6">
			<p class="mb-4">Sincerely,</p>
			<p class="italic font-serif text-lg mb-1" style="color: {primaryColor};">Jeremiah Quinlan</p>
			<p>Jeremiah Quinlan</p>
			<p>Dean of Undergraduate Admissions and Financial Aid</p>
		</div>

		<!-- Return link -->
		<div class="text-center mt-10 mb-6">
			<a href="/disclaimer" class="underline" style="color: {primaryColor};">
				Return to Application Status
			</a>
		</div>

		<!-- Simulation disclaimer -->
		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 font-sans">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Yale University.
		</div>
	</div>

	<!-- Footer -->
	<footer class="px-8 mt-12">
		<div class="border-t border-gray-200 pt-6 max-w-3xl mx-auto">
			<div class="text-2xl leading-tight font-serif" style="color: {primaryColor};">
				Yale College<br />Undergraduate<br />Admissions
			</div>
			<p class="mt-4 text-[11px] text-gray-500 pb-8">
				Copyright &copy;2026 Yale University. All rights reserved
			</p>
		</div>
	</footer>
</main>
