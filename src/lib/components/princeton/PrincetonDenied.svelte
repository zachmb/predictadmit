<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
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
				I am sorry to share that Princeton University is not able to offer you admission this year.
			</p>

			<p>
				This year's applicant pool was both large and exceptionally talented, with many students
				whose records merited serious consideration. During the past several weeks, our admission
				officers read applications with care and thought, weighing each student's achievements,
				talents, and skills in the context of their secondary school setting. We also considered
				the wide range of learning environments represented in the pool.
			</p>

			<p>
				The admission committee appreciated the time, care, and effort reflected in the materials you
				submitted. Ultimately, the strength and size of this year's pool shaped our choices, and even
				candidates with exceptional credentials could not be guaranteed a place in the class.
			</p>

			<p>
				I understand that this is not the outcome you hoped to receive. While our decisions are
				final, and we cannot consider appeals or provide individual feedback, please know that the
				committee's conclusion is not a judgment on your ability to succeed in a rigorous college
				environment.
			</p>

			<p>
				Thank you for your interest in Princeton and for allowing us the opportunity to review your
				application.
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
