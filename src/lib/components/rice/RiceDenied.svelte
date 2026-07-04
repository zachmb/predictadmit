<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Rice University';
	export let primaryColor: string = '#00205B';
	export let footerDomain: string = 'rice.edu';




	$: firstName = (applicantName || 'Applicant').split(' ')[0];


	const shieldSvg = `
		<svg viewBox="0 0 120 148" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path d="M6 6 H114 V86 C114 118 88 136 60 146 C32 136 6 118 6 86 Z" fill="#1b2f66"/>
			<path d="M22 84 L60 56 L98 84 L98 100 L60 72 L22 100 Z" fill="#ffffff"/>
			<g fill="#ffffff">
				<ellipse cx="30" cy="34" rx="9" ry="11"/>
				<ellipse cx="90" cy="34" rx="9" ry="11"/>
				<ellipse cx="60" cy="118" rx="9" ry="11"/>
			</g>
			<g fill="#1b2f66">
				<circle cx="26" cy="32" r="2.2"/><circle cx="34" cy="32" r="2.2"/>
				<circle cx="86" cy="32" r="2.2"/><circle cx="94" cy="32" r="2.2"/>
				<circle cx="56" cy="116" r="2.2"/><circle cx="64" cy="116" r="2.2"/>
			</g>
		</svg>`;
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-[#f4f4f4] font-serif text-gray-800">
	<div class="mx-auto max-w-3xl px-6 py-10">
		<DeepDiveButton slug="rice" color={primaryColor} />

		<!-- Date + navy rule -->
		<div class="mb-0 text-[13px] font-semibold text-gray-700">March 25, 2027</div>
		<div class="mt-2 mb-6 border-t-2" style="border-color: {primaryColor};"></div>

		<!-- Letter card -->
		<div class="bg-white px-10 py-10 shadow-sm">
			<!-- Letterhead -->
			<div class="mb-10 flex items-start justify-between">
				<div class="flex items-center gap-3">
					<span class="h-12 w-10">{@html shieldSvg}</span>
					<span class="text-3xl font-normal tracking-tight" style="color: {primaryColor};">RICE</span>
				</div>
				<div class="pt-1 text-[11px] font-bold tracking-wide text-gray-700">Office of Enrollment</div>
			</div>

			<div class="mb-6 text-[13px] text-gray-700">March 25, 2027</div>

			<div class="mb-6 text-[14px] leading-relaxed text-gray-900">
				{applicantName || 'Applicant'}<br />
				2847 Birchwood Ln<br />
				Naperville, IL 60540-4417
			</div>

			<div class="mb-6 text-[15px] text-gray-900">Dear {firstName},</div>

			<div class="space-y-4 text-[14px] leading-relaxed text-gray-800">
				<p>
					After careful consideration, I am sorry to share that we cannot offer you admission to Rice
					University for the Class of 2031. This is probably not the news you were hoping for, and we
					want you to know how much we appreciate the time, care, and effort you devoted to your
					application. Applying to college is an incredibly demanding process, and our admission
					committee is honored that you chose to share your journey and aspirations with us.
				</p>
				<p>
					Because we place great value on the individual stories and experiences that shape each
					student's perspective, our team reads and reviews every application we receive in full.
					Across this year's applications we noticed a shared thread of dedication and resilience,
					along with a genuine desire to make a positive difference.
				</p>
				<p>
					Rice received more than 38,000 applications for the Class of 2031 this year. Even as our
					university continues to grow, we simply cannot admit every applicant who would flourish at
					Rice. Please know that this outcome speaks to the limits of our class size, not to the
					limits of what you can achieve. Our decision is final and appeals cannot be considered, but
					we hope you will carry the same curiosity and dedication we saw in your application into
					everything you pursue next. We wish you the very best as you begin your next chapter.
				</p>
			</div>

			<div class="mt-8 text-[14px] text-gray-800">Sincerely,</div>
			<div class="mt-3">
				<div
					class="text-3xl italic text-gray-800"
					style="font-family: 'Segoe Script', 'Brush Script MT', cursive;"
				>
					Veronica Salas
				</div>
				<div class="mt-2 text-[14px] font-semibold text-gray-900">Dr. Veronica M. Salas</div>
				<div class="text-[13px] text-gray-600">Vice President for Enrollment</div>
				<div class="text-[13px] text-gray-600">Dean of Admission and Financial Aid</div>
			</div>

			<!-- Contact letterhead footer -->
			<div class="mt-12 border-t border-gray-200 pt-4 text-center text-[10px] text-gray-500">
				Rice University Office of Enrollment &middot; 6100 Main St. &middot; Houston, TX 77005-1892
				&middot; www.{footerDomain}
			</div>

			<!-- Simulated-letter disclaimer -->
			<div class="mt-8 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
				<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only.
				This is not a real admission decision from Rice University.
			</div>
		</div>

		<div class="mt-8 text-center">
			<a href="/disclaimer" class="text-[13px] underline" style="color: {primaryColor};"
				>Return to Application Status</a
			>
		</div>
	</div>
</main>
