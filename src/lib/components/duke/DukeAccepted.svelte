<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Duke University';
	export let primaryColor: string = '#00539B';
	export let footerDomain: string = 'duke.edu';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';

	$: session = $page.data.session;

	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	const viewAnalysis = () => {
		goto('/results/duke');
	};
</script>

<svelte:head>
	<title>{schoolName} — Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-[#eef1f5] font-serif text-gray-900">
	<!-- Top brand bar -->
	<div style="background-color: {primaryColor};" class="h-10 w-full"></div>

	<div class="mx-auto max-w-3xl px-6 py-10">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="rounded-lg px-4 py-2 font-sans text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
					style="background-color: {primaryColor};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['duke']}?
				</button>
			</div>
		{/if}

		<div class="mb-2 text-[13px] font-bold text-gray-900">March 26, 2026</div>

		<!-- Letter sheet -->
		<div class="bg-white px-12 py-14 shadow-sm">
			<!-- Letterhead -->
			<div class="mb-6 text-center">
				<div class="font-serif text-5xl font-bold tracking-tight" style="color: {primaryColor};">
					Duke<span class="ml-2 align-middle text-[15px] font-semibold tracking-[0.35em]"
						>UNIVERSITY</span
					>
				</div>
				<div class="mt-4 text-[13px] font-bold uppercase tracking-wide text-gray-900">
					Office of Undergraduate Admissions
				</div>
				<div class="text-[12px] text-gray-700">
					2138 Campus Drive, Box 90586 &bull; Durham, North Carolina 27708-0586 &bull; (919) 684-3214
				</div>
			</div>

			<div class="mb-6 text-[14px] leading-relaxed text-gray-900">
				<p class="mb-5">Dear {applicantName || 'Applicant'},</p>

				<p class="mb-5">
					It is with great pleasure that I write to offer you admission to Duke University as a member
					of the Class of 2030. On behalf of the Admissions Committee, congratulations. From a pool of
					more than 61,000 applicants competing for just 1,775 places in the first-year class, you
					distinguished yourself as one of the exceptionally accomplished and talented students we are
					proud to welcome to Durham this fall.
				</p>

				<p class="mb-5">
					My staff and I were genuinely impressed by the effort you have put forth both inside and
					outside the classroom. Your record of achievement, intellectual curiosity, and the qualities
					of character revealed throughout your application convinced us that you will thrive within
					the vibrant, collaborative community of students and faculty that defines Duke.
				</p>

				<p class="mb-5">
					In the coming days you will receive additional information through your applicant portal,
					including details about your financial aid award, Blue Devil Days for admitted students, and
					the steps to confirm your enrollment. To reserve your place in the class, please submit your
					enrollment response and deposit through your online portal by May 1, 2026.
				</p>

				<p class="mb-8">
					Congratulations once again on this well-earned achievement. We look forward to welcoming you
					to Duke and to all that lies ahead.
				</p>

				<p class="mb-8">Sincerely,</p>

				<div class="mb-1 font-[cursive] text-2xl italic text-gray-800">Kathy L. Phillips</div>
				<div class="text-[14px] font-bold text-gray-900">Kathy L. Phillips</div>
				<div class="text-[13px] text-gray-700">Interim Dean of Undergraduate Admissions</div>
			</div>
		</div>

		<div class="mt-8 text-center">
			<a href="/disclaimer" class="text-[14px] hover:underline" style="color: {primaryColor};">
				Return to Application Status
			</a>
		</div>

		<!-- Disclaimer -->
		<div class="mx-auto mt-8 max-w-2xl rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 font-sans">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from {schoolName}.
		</div>
	</div>

	<!-- Footer -->
	<footer style="background-color: {primaryColor};" class="text-white">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-[12px] font-sans">
			<span class="font-bold uppercase tracking-wide">&copy; DUKE.EDU</span>
			<nav class="flex gap-6">
				<a href="/disclaimer" class="hover:underline">Counselors</a>
				<a href="/disclaimer" class="hover:underline">Families</a>
				<a href="/disclaimer" class="hover:underline">Resources</a>
				<a href="/disclaimer" class="hover:underline">FAQs</a>
				<a href="/disclaimer" class="hover:underline">Contact</a>
			</nav>
			<a href={`https://${footerDomain}`} class="hover:underline">{footerDomain}</a>
		</div>
	</footer>
</main>
