<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Duke University';
	export let primaryColor: string = '#00539B';
	export let footerDomain: string = 'duke.edu';




</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} — Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-[#eef1f5] font-serif text-gray-900">
	<!-- Top brand bar -->
	<div style="background-color: {primaryColor};" class="h-10 w-full"></div>

	<div class="mx-auto max-w-3xl px-6 py-10">
		<DeepDiveButton slug="duke" color={primaryColor} />

		<div class="mb-2 text-[13px] font-bold text-gray-900">March 26, 2027</div>

		<!-- Letter sheet -->
		<div class="bg-white px-6 py-10 shadow-sm sm:px-12 sm:py-14">
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
				<div class="text-[12px] text-gray-700 break-words">
					2138 Campus Drive, Box 90586 &bull; Durham, North Carolina 27708-0586 &bull; (919) 684-3214
				</div>
			</div>

			<div class="mb-6 text-[14px] leading-relaxed text-gray-900">
				<p class="mb-5">Dear {applicantName || 'Applicant'},</p>

				<p class="mb-5">
					I am delighted to write with an offer of admission to Duke University as a member of the
					Class of 2031. On behalf of the Admissions Committee, congratulations. Among more than
					61,000 applicants competing for just 1,775 places in the first-year class, you stood out
					as one of the remarkably accomplished and talented students we are proud to welcome to
					Durham this fall.
				</p>

				<p class="mb-5">
					My colleagues and I were genuinely impressed by all you have accomplished both in and
					beyond the classroom. Your record of achievement, your intellectual curiosity, and the
					character that came through in your application persuaded us that you will flourish in
					the vibrant, collaborative community of students and faculty that defines Duke.
				</p>

				<p class="mb-5">
					Over the coming days, additional information will arrive through your applicant portal,
					including details about your financial aid award, Blue Devil Days for admitted students,
					and how to confirm your enrollment. To hold your place in the class, please submit your
					enrollment response and deposit through your online portal by May 1, 2027.
				</p>

				<p class="mb-8">
					Once again, congratulations on an achievement you have truly earned. We look forward to
					welcoming you to Duke and to everything that lies ahead.
				</p>

				<p class="mb-8">Sincerely,</p>

				<div class="mb-1 font-[cursive] text-2xl italic text-gray-800">Karen L. Prescott</div>
				<div class="text-[14px] font-bold text-gray-900">Karen L. Prescott</div>
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
		<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4 text-[12px] font-sans">
			<span class="font-bold uppercase tracking-wide">&copy; DUKE.EDU</span>
			<nav class="flex flex-wrap gap-x-6 gap-y-2">
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
