<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Duke University';
	export let primaryColor: string = '#00539B';
	export let footerDomain: string = 'duke.edu';




</script>

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
					I am sorry to write that we cannot offer you admission to Duke this fall. I know this
					news is disappointing, and I want you to know that reaching this decision was far from
					easy. This year we received over 61,000 applications for just 1,775 places in the
					first-year class, which meant admission could be extended to only a small fraction of a
					remarkably accomplished and talented group of applicants.
				</p>

				<p class="mb-5">
					My colleagues and I recognize the dedication it took to reach such a high level of
					excellence both in and beyond the classroom. This decision reflects no weakness on your
					part; it is simply the result of far more qualified applicants than we have room to
					accommodate. I must also note that we are unable to offer an appeal or reconsideration
					process, whether for admission or for a place on our waiting list.
				</p>

				<p class="mb-5">
					I understand this is not the letter you hoped to receive. We are grateful that you shared
					so much of yourself with us in your application; it is evident that you hold great
					promise for success in college and well beyond, and we trust you will realize that
					success in the years ahead.
				</p>

				<p class="mb-8">Thank you once more for your interest in Duke.</p>

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
