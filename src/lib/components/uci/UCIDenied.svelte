<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of California, Irvine';
	export let primaryColor: string = '#0064A4'; // UCI blue
	export let footerDomain: string = 'uci.edu';
	import { page } from '$app/stores';

	$: session = $page.data.session;


	$: {
	}
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white p-6 font-serif text-gray-800">
	<div class="mx-auto mt-10 max-w-3xl">
		<DeepDiveButton slug="uci" color={primaryColor} />

		<!-- Letterhead -->
		<div class="mb-8 border-b-2 pb-4" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="mr-4 flex h-16 w-16 items-center justify-center text-xl font-extrabold text-white"
					style="background-color: {primaryColor};"
				>
					UCI
				</div>
				<div>
					<h1 class="text-2xl font-bold uppercase" style="color: {primaryColor};">
						University of California, Irvine
					</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admissions<br />
						260 Aldrich Hall, Irvine, California 92697-1075<br />
						Telephone 949-824-6703
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="mb-2 text-right text-sm text-gray-600">March 20, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>Application ID: 5273046</div>
				<div>Fall 2027 &bull; First Year</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="mb-8 space-y-4">
			<p>
				Thank you for applying to the University of California, Irvine for the Fall 2027 term, and for
				allowing us the opportunity to review your application. We know that a great deal of thought
				and effort went into your candidacy, and we are grateful for your interest in becoming an
				Anteater.
			</p>

			<p>
				This year UCI received a record number of applications from an exceptionally talented and
				accomplished group of students. Because the number of highly qualified applicants far
				exceeds the space available in our entering class, our selection process was extraordinarily
				competitive. After a careful and holistic review of your application, I regret to inform you
				that we are unable to offer you admission to UCI at this time.
			</p>

			<p>
				Please understand that this decision is in no way a reflection of your ability or your
				potential. Many outstanding students who would succeed at UCI could not be offered admission
				simply because of the limited number of spaces. We recognize the very real achievements
				represented in your application, and we hope you will take genuine pride in all that you have
				accomplished.
			</p>

			<p>
				We encourage you to explore the many excellent options within the University of California
				system and beyond. Wherever your path leads, we are confident you will continue to grow and
				thrive, and we wish you every success in your future studies and endeavors.
			</p>

			<p>Thank you again for your interest in the University of California, Irvine.</p>
		</div>

		<div class="mt-12">
			<div class="mb-2 font-serif text-2xl italic" style="color: {primaryColor};">Dale Leaman</div>
			<div class="font-bold">Dale Leaman</div>
			<div class="text-sm text-gray-600">
				Executive Director of Undergraduate Admissions<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 border-t border-gray-200 pt-8 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The UCI Mission:</strong><br />
					To cultivate the free exchange of ideas and to advance discovery through research, teaching,
					and public service &mdash; giving every student the tools to brighten their world.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:admissions@uci.edu" class="hover:underline">admissions@uci.edu</a><br />
					Phone: 949-824-6703<br />
					Website:
					<a href={`https://admissions.${footerDomain}`} class="hover:underline"
						>admissions.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of California, Irvine.
		</div>
	</div>
</main>
