<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of California, Los Angeles';
	export let primaryColor: string = '#2774AE';
	export let footerDomain: string = 'ucla.edu';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';

	$: session = $page.data.session;

	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	const viewAnalysis = () => {
		goto('/results/ucla');
	};
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-[#f4f4f4] font-serif text-gray-800">
	<div class="mx-auto max-w-3xl px-6 py-10">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="flex items-center gap-2 rounded-lg px-4 py-2 font-sans text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
					style="background-color: {primaryColor};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['ucla']}?
				</button>
			</div>
		{/if}

		<!-- Date + blue rule -->
		<div class="mb-0 text-[13px] font-semibold text-gray-700">March 20, 2027</div>
		<div class="mt-2 mb-6 border-t-2" style="border-color: {primaryColor};"></div>

		<!-- Letter card -->
		<div class="bg-white px-10 py-10 shadow-sm">
			<!-- Letterhead -->
			<div class="mb-8 flex items-center gap-3">
				<span class="text-4xl font-extrabold italic tracking-tight" style="color: {primaryColor};">UCLA</span>
				<div class="leading-tight">
					<div class="text-sm font-bold tracking-[0.1em] text-gray-900">UCLA</div>
					<div class="text-[11px] italic text-gray-500">Office of Undergraduate Admission</div>
				</div>
			</div>

			<div class="mb-6 text-[14px] leading-relaxed text-gray-900">
				{applicantName || 'Applicant'}<br />
				Fall 2027 First-Year Applicant
			</div>

			<div class="mb-6 text-[15px] text-gray-900">Dear {applicantName || 'Applicant'},</div>

			<div class="space-y-4 text-[14px] leading-relaxed text-gray-800">
				<p>
					After careful review of your application for admission, we regret to inform you that we are
					unable to offer you admission for Fall 2027. UCLA continues to receive far more applications
					for admission than we can accommodate in our first-year class. For Fall 2027, we received
					over 146,000 first-year applications and were able to admit fewer than one in ten. Our
					challenge lies not only in our volume of applications but in the quality of the students who
					choose to apply to our campus.
				</p>
				<p>
					Each application is unique, and each student presents wonderful attributes and potential. Our
					work is challenging but our commitment to being thorough in our review process is sincere.
					Every application is read at least twice with consideration given to accomplishments both in
					and outside of the classroom and we are mindful of the opportunities and challenges students
					face while achieving so much in their schools and communities. Ultimately, no single
					attribute or achievement guarantees admission&mdash;there are simply too many well-qualified,
					accomplished, and capable applicants for the number of first-year spaces available at UCLA.
				</p>
				<p>
					If attending UCLA remains your ambition, you should know that there is another opportunity for
					admission later in your academic career: applying as a junior-level transfer student. You can
					learn more about the transfer option at
					<a href="/disclaimer" class="underline" style="color: {primaryColor};">www.admission.ucla.edu/transfer</a>.
				</p>
				<p>
					While no language in a decision letter can lessen the disappointment you may feel, please know
					that we understand the emotional investment you have made in this process and take this
					responsibility very seriously. We wish you all the best in your collegiate experience.
				</p>
			</div>

			<div class="mt-8 text-[14px] text-gray-800">Sincerely,</div>
			<div class="mt-3">
				<div
					class="text-3xl italic text-gray-800"
					style="font-family: 'Segoe Script', 'Brush Script MT', cursive;"
				>
					Ffiona Rees
				</div>
				<div class="mt-2 text-[14px] font-semibold text-gray-900">Ffiona Rees</div>
				<div class="text-[13px] text-gray-600">Executive Director, Undergraduate Admission</div>
			</div>

			<!-- Contact letterhead block -->
			<div class="mt-12 flex items-start gap-3 border-t border-gray-200 pt-6">
				<span class="shrink-0 text-3xl font-extrabold italic tracking-tight" style="color: {primaryColor};">UCLA</span>
				<div class="text-[11px] leading-relaxed text-gray-500">
					<div class="text-[12px] font-bold tracking-[0.1em] text-gray-800">UCLA Undergraduate Admission</div>
					<div class="mt-2">
						1147 Murphy Hall, Box 951436<br />
						Los Angeles, CA 90095-1436<br />
						admission.{footerDomain}
					</div>
				</div>
			</div>

			<!-- Simulated-letter disclaimer -->
			<div class="mt-8 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
				<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only.
				This is not a real admission decision from the University of California, Los Angeles.
			</div>
		</div>

		<div class="mt-8 text-center">
			<a href="/disclaimer" class="text-[13px] underline" style="color: {primaryColor};"
				>Return to Application Status</a
			>
		</div>
	</div>
</main>
