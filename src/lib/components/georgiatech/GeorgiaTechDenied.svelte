<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	export let applicantName: string;
	export let schoolName: string = 'Georgia Institute of Technology';
	export let primaryColor: string = '#003057';
	export let footerDomain: string = 'gatech.edu';


	const accent = '#B3A369';


	$: firstName = applicantName ? applicantName.split(' ')[0] : 'Applicant';

</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<div class="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
	<!-- Gold masthead -->
	<header class="bg-[#B3A369]">
		<div class="max-w-4xl mx-auto px-6 h-14 flex items-center gap-3">
			<span class="text-white font-black text-2xl tracking-tighter leading-none" style="font-family: Georgia, serif;">GT</span>
			<span class="text-white text-xl font-semibold" style="font-family: Georgia, serif;">Georgia Tech</span>
		</div>
	</header>

	<main class="flex-grow">
		<div class="max-w-4xl mx-auto px-6 w-full">
			<!-- Applicant / links row -->
			<div class="flex justify-end items-center gap-2 py-2 text-[12px] text-slate-700">
				<span>{applicantName || 'Applicant'}</span>
				<a href="/disclaimer" class="text-[#003057] hover:underline">Logout</a>
			</div>

			<div class="flex justify-between items-start">
				<h1 class="text-2xl font-normal text-[#003057]">Undergraduate Admission</h1>
				<a href="/disclaimer" class="text-[13px] font-bold text-[#003057] underline hover:no-underline"
					>Download PDF</a
				>
			</div>

			<DeepDiveButton slug="georgiatech" color={primaryColor} />

			<!-- Seal + wordmark -->
			<div class="flex items-center justify-center gap-4 my-10">
				<div
					class="w-16 h-16 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-center leading-tight"
					style="border-color: {accent}; color: {accent};"
				>
					GT<br />1885
				</div>
				<div class="text-2xl font-semibold text-[#003057] leading-tight" style="font-family: Georgia, serif;">
					Georgia Institute<br />of Technology
				</div>
			</div>

			<!-- Letter body -->
			<div class="max-w-2xl mx-auto text-[13px] leading-relaxed text-slate-800">
				<p class="mb-6 font-semibold">January 30, 2027</p>

				<div class="mb-6">
					<p>{applicantName || 'Applicant'}</p>
					<p>2847 Birchwood Ln</p>
					<p>Naperville, IL 60540-4417</p>
				</div>

				<p class="mb-4">{firstName},</p>

				<p class="mb-4">
					Thank you for applying to the Georgia Institute of Technology. Given the volume of
					applications we received from highly qualified students, we are unable to offer you a
					place in the incoming first-year class.
				</p>

				<p class="mb-4">
					Every application is read holistically by several members of our staff. Given how
					competitive this year's pool was, each student's credentials were weighed carefully,
					both on their own and in comparison with others, to ensure a thorough process.
				</p>

				<p class="mb-6">
					We are grateful for your interest in Georgia Tech and wish you every success going forward.
				</p>

				<p class="mb-1">Sincerely,</p>
				<p class="text-2xl mb-1" style="font-family: 'Brush Script MT', 'Segoe Script', cursive; color: {primaryColor};">
					Margaret T. Winslow
				</p>
				<p class="font-semibold">Margaret T. Winslow</p>
				<p class="text-slate-700">Executive Director | Undergraduate Admission</p>
			</div>

			<div class="text-center my-10">
				<a href="/disclaimer" class="text-[13px] font-bold text-[#003057] underline hover:no-underline"
					>Return to Application Status</a
				>
			</div>

			<div class="max-w-2xl mx-auto mb-10 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
				<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
				is not a real admission decision from the {schoolName}.
			</div>
		</div>
	</main>

	<!-- Gold footer -->
	<footer class="bg-[#B3A369] text-white text-[11px]">
		<div class="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
			<div>
				<p class="font-semibold">Georgia Institute of Technology</p>
				<p>North Avenue, Atlanta, GA 30332 · 404.894.2000</p>
				<p><a href="/disclaimer" class="underline hover:no-underline">admission.{footerDomain}</a></p>
			</div>
			<span class="text-white/80 text-right"
				>PredictAdmit simulation · Not affiliated with the Georgia Institute of Technology</span
			>
		</div>
	</footer>
</div>
