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
					It is with regret that I write to let you know that we are unable to offer you admission to
					Duke this fall. I realize this is disappointing news, and I want to assure you that our
					decision was not an easy one. We received over 61,000 applications this year for just 1,775
					places in the first-year class; unfortunately we could offer admission to only a small
					percentage of our many exceptionally accomplished and talented applicants.
				</p>

				<p class="mb-5">
					My staff and I appreciate the effort you have put forth both inside and outside the
					classroom to achieve a high level of excellence. Our decision is not an indication of any
					weakness on your part but rather the result of having many more qualified applicants than we
					can accommodate. Unfortunately, we do not have an appeal or reconsideration process, either
					for admission or for a place on our waiting list.
				</p>

				<p class="mb-5">
					I know this is not the letter you wanted to receive. My colleagues and I thank you for
					sharing so much of yourself with us through your application; it's clear that you have great
					potential for much success in college and beyond and that you will achieve that success in
					the years to come.
				</p>

				<p class="mb-8">Thank you again for considering Duke.</p>

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
