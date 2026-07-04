<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of California, Los Angeles';
	export let primaryColor: string = '#2774AE';
	export let footerDomain: string = 'ucla.edu';




</script>

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
					We have completed a careful review of your application, and I am sorry to inform you that we
					cannot offer you admission for Fall 2027. UCLA continues to receive far more applications
					than our first-year class can accommodate. For Fall 2027, we received over 146,000
					first-year applications and admitted fewer than one in ten. The difficulty we face lies not
					only in the volume of applications but in the quality of the students who choose to apply
					to our campus.
				</p>
				<p>
					Every application is unique, and every student brings wonderful qualities and potential. Our
					work is difficult, but our commitment to a thorough review process is sincere. Each
					application is read at least twice, with attention to achievements both inside and outside
					the classroom, and we remain mindful of the opportunities and challenges students navigate
					while accomplishing so much in their schools and communities. In the end, no single
					attribute or achievement guarantees admission&mdash;there are simply far more well-qualified,
					accomplished, and capable applicants than there are first-year spaces available at UCLA.
				</p>
				<p>
					If attending UCLA remains your goal, please know that another path to admission exists later
					in your academic career: applying as a junior-level transfer student. More information about
					the transfer option is available at
					<a href="/disclaimer" class="underline" style="color: {primaryColor};">www.admission.ucla.edu/transfer</a>.
				</p>
				<p>
					No words in a decision letter can soften the disappointment you may feel, but please know
					that we recognize the emotional investment you have made in this process and take our
					responsibility very seriously. We wish you every success in your collegiate experience.
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
