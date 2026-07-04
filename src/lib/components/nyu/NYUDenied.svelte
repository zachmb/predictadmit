<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'New York University';
	export let primaryColor: string = '#57068C'; // NYU Violet
	export let footerDomain: string = 'nyu.edu';
	import { page } from '$app/stores';

	$: session = $page.data.session;

	let googleEmail = '';
	let googleName = '';

	$: {
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="nyu" color={primaryColor} />

		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-extrabold text-2xl mr-4 tracking-tight"
					style="background-color: {primaryColor};"
				>
					NYU
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">New York University</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admissions<br />
						383 Lafayette Street, New York, New York 10003<br />
						Telephone 212-998-4500
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 25, 2027</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				The admissions committee at New York University has carefully reviewed your application for
				all programs to which you requested consideration. I regret to share that we are unable to
				offer you admission to NYU.
			</p>

			<p>
				Over the years I have done this work, one thing has proven true again and again: one setback
				is never the defining moment of an ambitious student. My sincere hope is that you will find
				an academic institution where you continue to thrive. If, after matriculating elsewhere, you
				remain interested in finding a path to NYU, you are welcome to reapply as a transfer
				candidate to our campus in New York. At this time, we do not offer an appeal or
				reconsideration process.
			</p>

			<p>
				On behalf of the NYU community, I wish you the best as you continue your education.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2 text-lg" style="color: {primaryColor};">Sincerely,</div>
			<div class="font-bold">Warren Selby</div>
			<div class="text-sm text-gray-600">
				Assistant Vice President of Undergraduate Admissions<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Main Campuses:</strong><br />
					New York &nbsp;•&nbsp; Abu Dhabi &nbsp;•&nbsp; Shanghai
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:admissions@nyu.edu" class="hover:underline">admissions@nyu.edu</a><br />
					Phone: 212-998-4500<br />
					Website:
					<a href={`https://www.${footerDomain}`} class="hover:underline">www.{footerDomain}</a>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from New York University.
		</div>
	</div>
</main>
