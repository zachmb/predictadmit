<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of California, Los Angeles';
	export let primaryColor: string = '#2774AE';
	export let footerDomain: string = 'ucla.edu';




</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-[#f4f4f4] font-serif text-gray-800">
	<div class="mx-auto max-w-3xl px-6 py-10">
		<DeepDiveButton slug="ucla" color={primaryColor} />

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
					Congratulations! I am delighted to offer you admission to the University of California,
					Los Angeles, for Fall 2027. On behalf of our entire campus community, welcome to the Bruin
					family. You have truly earned this distinction.
				</p>
				<p>
					For Fall 2027, UCLA received over 146,000 first-year applications and admitted fewer than
					one in ten. Each application is reviewed at least twice, with careful attention to
					achievements inside the classroom and beyond it. Your record of accomplishment, your
					intellectual curiosity, and the strength of character evident across your application set
					you apart in an exceptionally talented pool. We are confident you will thrive here and add
					meaningfully to the life of our university.
				</p>
				<p>
					Over the coming weeks, detailed information about financial aid, housing, orientation, and
					your next enrollment steps will arrive through your applicant portal. We encourage you to
					explore everything UCLA has to offer and to join us for Bruin Day, our program for admitted
					students, to experience firsthand the academics and vibrant campus life that await you in
					Westwood.
				</p>
				<p>
					To hold your place in the Fall 2027 class, please submit your Statement of Intent to
					Register (SIR) through your applicant portal by <strong>May 1, 2027</strong>. We sincerely
					hope you will decide to become a Bruin, and we look forward to welcoming you to campus this
					fall.
				</p>
			</div>

			<div class="mt-8 text-[14px] text-gray-800">Sincerely,</div>
			<div class="mt-3">
				<div
					class="text-3xl italic text-gray-800"
					style="font-family: 'Segoe Script', 'Brush Script MT', cursive;"
				>
					Bronwyn Hale
				</div>
				<div class="mt-2 text-[14px] font-semibold text-gray-900">Bronwyn Hale</div>
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
