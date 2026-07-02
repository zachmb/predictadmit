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
				It is with great pleasure that I write on behalf of the Yale Admissions Committee to offer you
				admission to the Yale College Class of 2030. Congratulations! From a pool of more than fifty
				thousand exceptionally talented applicants, you distinguished yourself as one of the few whom
				we are proud to welcome to Yale.
			</p>

			<p>
				Our decision is the result of a deliberate and careful process. The Committee was drawn to the
				intellectual curiosity, character, and promise evident throughout your application, and we are
				confident that you will both contribute to and thrive within our community. We were impressed
				not only by what you have already accomplished, but by the person you are becoming and the
				energy you will bring to Yale's classrooms, residential colleges, and campus life.
			</p>

			<p>
				In the coming days you will receive further information about enrolling, including details
				about your financial aid award, first-year advising, and Bulldog Days, our program for
				admitted students held this April in New Haven. I encourage you to visit us and to picture
				yourself as a member of the Yale community. To reserve your place in the Class of 2030, please
				submit your reply through your applicant status portal by May 1, 2026.
			</p>

			<p>
				On behalf of all of us in the Office of Undergraduate Admissions, congratulations once again.
				We cannot wait to welcome you to Yale.
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
