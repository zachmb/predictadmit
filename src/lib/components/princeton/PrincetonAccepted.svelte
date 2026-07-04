<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Princeton University';
	export let primaryColor: string = '#FF8F00'; // Princeton orange
	export let footerDomain: string = 'princeton.edu';

	import { page } from '$app/stores';

	$: session = $page.data.session;

	let googleEmail = '';
	let googleName = '';

	$: {
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}

	$: firstName = applicantName ? applicantName.split(' ')[0] : '';

</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="princeton" color={primaryColor} />

		<!-- Letterhead -->
		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 flex items-center justify-center font-serif font-bold text-2xl mr-4 text-black"
					style="background-color: {primaryColor};"
				>
					P
				</div>
				<div>
					<h1 class="text-2xl font-bold text-black">PRINCETON UNIVERSITY</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admission<br />
						P.O. Box 430, Princeton, New Jersey 08542<br />
						Telephone 609-258-3060
					</div>
				</div>
			</div>
		</div>

		<!-- Date -->
		<div class="mb-8">
			<div class="text-sm text-gray-700 mb-6">March 12, 2027</div>
		</div>

		<!-- Salutation -->
		<div class="mb-6">
			<div class="text-lg">Dear {firstName || applicantName || 'Applicant'},</div>
		</div>

		<!-- Letter Body -->
		<div class="space-y-4 mb-8 leading-relaxed">
			<p>
				I am delighted to share that the Committee on Admission has offered you a place in
				Princeton University's Class of 2031. Congratulations! In an exceptionally large and
				accomplished applicant group, your application earned our enthusiastic attention.
			</p>

			<p>
				During the past several weeks, our admission officers read applications with care and
				considerable thought. As in every year, we considered each student's achievements, talents,
				and skills in the context of their secondary school setting. Your intellectual curiosity,
				character, and potential to contribute to our community made a strong impression.
			</p>

			<p>
				At Princeton, you will enter a community guided by the ideals of service to the nation and
				to humanity. You will learn with renowned faculty, pursue original research, complete a
				senior thesis, and take part in our distinctive residential college system. Princeton also
				meets the full demonstrated financial need of every admitted student with aid that does not
				need to be repaid.
			</p>

			<p>
				To reserve your place, please submit the online reply form in your applicant portal by
				<strong>May 1, 2027</strong>. We also hope you will join us for Princeton Preview, our
				admitted-student program, where you can explore campus life and meet future classmates.
			</p>

			<p>
				From all of us in the Office of Admission, please accept our warm congratulations on this
				remarkable achievement. We look forward to welcoming you to Princeton this fall.
			</p>
		</div>

		<!-- Signature -->
		<div class="mt-12">
			<p class="mb-4">Best wishes,</p>
			<div class="mb-2">
				<div class="h-1 w-32" style="background-color: {primaryColor};"></div>
			</div>
			<div class="font-bold">Karen Richardson ’93</div>
			<div class="text-sm text-gray-600">
				Dean of Admission and Financial Aid<br />
				{schoolName}
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<p class="italic mb-4">
				"In the Nation's Service and the Service of Humanity" — Princeton University
			</p>
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Princeton University Mission:</strong><br />
					Princeton University advances learning through scholarship, research, and teaching of unsurpassed
					quality, with an emphasis on undergraduate and doctoral education that is distinctive among the
					world's great universities.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:uaoffice@princeton.edu" class="hover:underline">uaoffice@princeton.edu</a
					><br />
					Phone: 609-258-3060<br />
					Website:
					<a href={`https://admission.${footerDomain}`} class="hover:underline"
						>admission.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<!-- Simulation Note -->
		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Princeton University.
		</div>
	</div>
</main>
