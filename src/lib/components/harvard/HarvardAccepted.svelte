<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Harvard College';
	export let primaryColor: string = '#A51C30';
	export let footerDomain: string = 'harvard.edu';




</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-[#f4f4f4] font-serif text-gray-800">
	<div class="mx-auto max-w-3xl px-6 py-10">
		<DeepDiveButton slug="harvard" color={primaryColor} />

		<!-- Date + crimson rule -->
		<div class="mb-0 text-[13px] font-semibold text-gray-700">March 26, 2027</div>
		<div class="mt-2 mb-6 border-t-2" style="border-color: {primaryColor};"></div>

		<!-- Letter card -->
		<div class="bg-white px-10 py-10 shadow-sm">
			<!-- Letterhead -->
			<div class="mb-8 flex items-center gap-3">
				<svg viewBox="0 0 100 112" class="h-12 w-12" aria-hidden="true">
					<path d="M6 4 H94 V64 C94 88 74 102 50 110 C26 102 6 88 6 64 Z" fill={primaryColor} />
					<rect x="18" y="26" width="18" height="14" rx="1.5" fill="white" />
					<rect x="41" y="26" width="18" height="14" rx="1.5" fill="white" />
					<rect x="64" y="26" width="18" height="14" rx="1.5" fill="white" />
					<text x="27" y="36" font-size="8" text-anchor="middle" fill={primaryColor} font-family="serif">VE</text>
					<text x="50" y="36" font-size="8" text-anchor="middle" fill={primaryColor} font-family="serif">RI</text>
					<text x="73" y="36" font-size="7" text-anchor="middle" fill={primaryColor} font-family="serif">TAS</text>
				</svg>
				<div class="leading-tight">
					<div class="text-sm font-bold tracking-[0.15em] text-gray-900">HARVARD COLLEGE</div>
					<div class="text-[11px] italic text-gray-500">Admissions and Financial Aid</div>
				</div>
			</div>

			<div class="mb-6 text-[15px] text-gray-900">Dear {applicantName || 'Applicant'},</div>

			<div class="space-y-4 text-[14px] leading-relaxed text-gray-800">
				<p>
					The Committee on Admissions has concluded its meetings, and it is with great pleasure
					that I write to offer you a place in the Harvard College Class of 2031. Please accept
					my personal congratulations on your remarkable achievements, which set you apart within
					an exceptionally talented and highly qualified group of applicants.
				</p>
				<p>
					The Committee reads many thousands of applications each year for the sixteen hundred and
					fifty places in the first-year class, and it extends admission to only a small number
					of candidates whose intellectual curiosity, character, and accomplishments promise to
					enrich the life of the College. We are confident that you will thrive at Harvard and
					contribute meaningfully to our community.
				</p>
				<p>
					Detailed information will reach you soon about enrollment, financial aid, and Visitas,
					our program for admitted students — the best way to experience the academic and
					extracurricular life of the College, to meet faculty, and to get to know your future
					classmates. To hold your place in the class, please confirm your intention to enroll
					through your applicant portal by May 1, 2027.
				</p>
				<p>
					We very much hope you will decide to join us. On behalf of the entire Committee,
					congratulations once more — we look forward to greeting you in Harvard Yard this fall.
				</p>
			</div>

			<div class="mt-8 text-[14px] text-gray-800">Sincerely,</div>
			<div class="mt-3">
				<div
					class="text-3xl italic text-gray-800"
					style="font-family: 'Segoe Script', 'Brush Script MT', cursive;"
				>
					Edward C. Mansfield
				</div>
				<div class="mt-2 text-[14px] font-semibold text-gray-900">Edward C. Mansfield</div>
				<div class="text-[13px] text-gray-600">Dean of Admissions and Financial Aid</div>
			</div>

			<!-- Contact letterhead block -->
			<div class="mt-12 flex items-start gap-3 border-t border-gray-200 pt-6">
				<svg viewBox="0 0 100 112" class="h-10 w-10 shrink-0" aria-hidden="true">
					<path d="M6 4 H94 V64 C94 88 74 102 50 110 C26 102 6 88 6 64 Z" fill={primaryColor} />
					<rect x="18" y="26" width="18" height="14" rx="1.5" fill="white" />
					<rect x="41" y="26" width="18" height="14" rx="1.5" fill="white" />
					<rect x="64" y="26" width="18" height="14" rx="1.5" fill="white" />
				</svg>
				<div class="text-[11px] leading-relaxed text-gray-500">
					<div class="text-[12px] font-bold tracking-[0.15em] text-gray-800">HARVARD COLLEGE</div>
					<div class="italic">Admissions and Financial Aid</div>
					<div class="mt-2">
						86 Brattle Street, Cambridge, MA 02138<br />
						(617) 495-1551 &middot; Office of Admissions<br />
						(617) 495-1581 &middot; Griffin Financial Aid Office<br />
						college.{footerDomain}
					</div>
				</div>
			</div>

			<!-- Simulated-letter disclaimer -->
			<div class="mt-8 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
				<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only.
				This is not a real admission decision from Harvard University.
			</div>
		</div>

		<div class="mt-8 text-center">
			<a href="/disclaimer" class="text-[13px] underline" style="color: {primaryColor};"
				>Return to Application Status</a
			>
		</div>
	</div>
</main>
