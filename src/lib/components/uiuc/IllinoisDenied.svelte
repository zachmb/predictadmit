<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of Illinois Urbana-Champaign';
	export let primaryColor: string = '#13294B'; // Illinois Blue
	export let footerDomain: string = 'illinois.edu';

	const ILLINI_ORANGE = '#E84A27';



</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="uiuc" color={primaryColor} />

		<!-- Letterhead -->
		<div class="border-b-2 pb-4 mb-10 flex items-start justify-between" style="border-color: {primaryColor};">
			<div class="flex items-center gap-4">
				<div
					class="w-12 h-16 flex items-center justify-center font-serif font-black text-white text-3xl leading-none border-2"
					style="background-color: {ILLINI_ORANGE}; border-color: {primaryColor};"
				>
					I
				</div>
				<div class="leading-tight" style="color: {primaryColor};">
					<div class="text-xs font-sans tracking-[0.2em] font-semibold">UNIVERSITY OF</div>
					<div class="text-2xl font-sans font-black tracking-tight">ILLINOIS</div>
					<div class="text-[10px] font-sans tracking-[0.3em] font-semibold">URBANA-CHAMPAIGN</div>
				</div>
			</div>
			<div class="text-right" style="color: {primaryColor};">
				<div class="text-sm font-sans font-bold tracking-wide">OFFICE OF UNDERGRADUATE ADMISSIONS</div>
				<div class="text-xs text-gray-600 font-sans mt-1">
					Admissions and Records Building<br />
					901 West Illinois Street, Suite 103<br />
					Urbana, IL 61801-3445 USA
				</div>
			</div>
		</div>

		<!-- Recipient + date -->
		<div class="mb-8 flex justify-between items-start">
			<div class="space-y-1 text-[15px]">
				<div>{applicantName || 'Applicant'}</div>
			</div>
			<div class="text-sm text-gray-700">February 2, 2027</div>
		</div>

		<!-- Salutation -->
		<div class="mb-6 text-[15px]">
			Dear {applicantName ? applicantName.split(' ')[0] : 'Applicant'},
		</div>

		<!-- Body -->
		<div class="space-y-4 mb-8 text-[15px] leading-relaxed">
			<p>
				Thank you for applying to the University of Illinois Urbana-Champaign and for allowing us to
				consider you for the Fall 2027 semester. We know how much thought and effort went into your
				application, and we're grateful for the time you spent sharing your story with us.
			</p>

			<p>
				This year we received a remarkable number of applications from talented students across
				Illinois, the nation, and the world. After a careful and holistic review of your
				accomplishments, I'm sorry to share that we are unable to offer you admission to your
				requested program at this time. With more outstanding applicants than we have spaces
				available, these decisions are among the most difficult we make.
			</p>

			<p>
				Please know that this outcome is not a reflection of your ability or your promise. The
				strengths you demonstrated are real, and they will continue to open doors for you. Many
				accomplished students go on to thrive at another institution, and some choose to reapply to
				Illinois as transfer students after a successful first year elsewhere.
			</p>

			<p>
				If you would like your application reconsidered, a Decision Appeal Form is available in
				myIllini at myillini.illinois.edu. Should you have any questions, please don't hesitate to
				reach out to us at admissions@illinois.edu or 217-333-0302.
			</p>

			<p>
				We wish you every success as you take your next steps, and we thank you again for your
				interest in Illinois.
			</p>
		</div>

		<!-- Signature -->
		<div class="mt-12">
			<div class="mb-1 text-[15px]">Sincerely,</div>
			<div class="mb-2">
				<img
					src="/signature-placeholder.png"
					alt="Signature"
					class="h-12"
					style="filter: invert(12%) sepia(38%) saturate(1800%) hue-rotate(190deg) brightness(40%) contrast(95%);"
				/>
			</div>
			<div class="font-bold" style="color: {primaryColor};">Sara MacKenzie</div>
			<div class="text-sm text-gray-600">Executive Director of Undergraduate Admissions</div>
		</div>

		<!-- Footer -->
		<div class="mt-16 pt-6 border-t-2 text-center" style="border-color: {primaryColor};">
			<div class="text-sm font-sans font-bold tracking-wide" style="color: {primaryColor};">
				UNIVERSITY OF ILLINOIS AT URBANA-CHAMPAIGN
			</div>
			<div class="text-xs text-gray-600 font-sans mt-1">
				217-333-0302 &middot;
				<a href="mailto:admissions@{footerDomain}" class="hover:underline">admissions@{footerDomain}</a>
				&middot;
				<a href={`https://admissions.${footerDomain}`} class="hover:underline"
					>admissions.{footerDomain}</a
				>
			</div>
		</div>

		<!-- Simulation disclaimer -->
		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 font-sans">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of Illinois Urbana-Champaign.
		</div>
	</div>
</main>
