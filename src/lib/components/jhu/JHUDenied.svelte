<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Johns Hopkins University';
	export let primaryColor: string = '#002D72'; // JHU Blue
	export let footerDomain: string = 'jhu.edu';





</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif">
	<!-- Brand header bar -->
	<header class="border-b border-gray-200 bg-white">
		<div class="max-w-3xl mx-auto px-6 py-4 flex items-center font-sans">
			<div class="flex items-center gap-3 pr-6">
				<div
					class="w-9 h-11 flex items-center justify-center text-white text-[10px] font-serif font-bold"
					style="background-color: {primaryColor}; clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);"
				>
					JHU
				</div>
				<div class="leading-tight">
					<div class="font-serif text-xl font-bold" style="color: {primaryColor};">
						Johns Hopkins
					</div>
					<div class="text-[10px] tracking-[0.35em] text-gray-600 uppercase">University</div>
				</div>
			</div>
			<div class="border-l border-gray-300 pl-6 hidden sm:block">
				<div class="text-[11px] font-bold tracking-wider text-[#0074d9] uppercase leading-tight">
					Undergraduate<br />Admissions
				</div>
			</div>
		</div>
	</header>

	<div class="max-w-3xl mx-auto px-6 pt-10 pb-16">
		<DeepDiveButton slug="jhu" color={primaryColor} />

		<div class="text-sm text-gray-800 mb-8 font-sans font-bold">March 18, 2027</div>

		<div class="mb-4">
			<div class="text-base">Dear {applicantName || 'Applicant'},</div>
		</div>

		<div class="space-y-4 mb-8 leading-relaxed">
			<p>
				Thank you for your interest in Johns Hopkins University. After a thorough review of your
				application, we regret to inform you that we are not able to offer you admission.
			</p>

			<p>
				Every year we receive a large number of applications from talented students, making admission
				to Hopkins a highly selective process. For answers to some common questions, please see the
				<a href="/disclaimer" class="hover:underline" style="color: {primaryColor};">FAQ</a> below.
			</p>

			<p>We wish you the best with your future educational and personal goals.</p>
		</div>

		<div class="mb-10">
			<div class="mb-1">Sincerely,</div>
			<div>Office of Undergraduate Admissions</div>
			<div>Johns Hopkins University</div>
		</div>

		<hr class="border-gray-300 mb-8" />

		<!-- FAQ -->
		<div class="mb-10">
			<h2 class="text-lg font-bold mb-5 font-sans" style="color: {primaryColor};">FAQ</h2>

			<div class="space-y-6 text-[15px] leading-relaxed">
				<div>
					<div class="font-bold mb-1">Can I appeal my decision?</div>
					<p>
						Johns Hopkins University does not accept appeals of admissions decisions, nor will we
						re-evaluate applications with new information. The decisions of the admissions committee
						are final and are based on the information provided by the application deadline.
					</p>
				</div>

				<div>
					<div class="font-bold mb-1">Can I find out why I was denied?</div>
					<p>
						We are not able to discuss the specific factors that go into the final decisions nor
						provide students with a detailed analysis of their specific application evaluation.
					</p>
				</div>

				<div>
					<div class="font-bold mb-1">Can I apply again?</div>
					<p>Yes, you may apply again during next year's admissions cycle.</p>
				</div>
			</div>
		</div>

		<hr class="border-gray-300 mb-8" />

		<div class="text-center mb-4 font-sans">
			<a
				href="/disclaimer"
				class="text-sm font-bold tracking-wider uppercase hover:underline"
				style="color: {primaryColor};">Log Out</a
			>
		</div>

		<div class="mt-12 pt-8 border-t border-gray-200 text-xs text-gray-500 font-sans">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Mail Only Correspondence:</strong><br />
					Office of Undergraduate Admissions<br />
					Johns Hopkins University<br />
					3400 N. Charles St., Mason Hall<br />
					Baltimore, MD 21218-2683 USA
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="/disclaimer" class="hover:underline">gotojhu@jhu.edu</a><br />
					Website:
					<a href={`https://apply.${footerDomain}`} class="hover:underline">apply.{footerDomain}</a>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 font-sans">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Johns Hopkins University.
		</div>
	</div>
</main>
