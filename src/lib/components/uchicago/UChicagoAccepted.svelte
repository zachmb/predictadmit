<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'The University of Chicago';
	export let primaryColor: string = '#800000'; // UChicago maroon
	export let footerDomain: string = 'uchicago.edu';
	import { page } from '$app/stores';

	$: session = $page.data.session;

	let googleEmail = '';
	let googleName = '';

	$: {
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="uchicago" color={primaryColor} />

		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-bold text-3xl mr-4 font-serif"
					style="background-color: {primaryColor};"
				>
					UC
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">THE UNIVERSITY OF CHICAGO</h1>
					<div class="text-sm text-gray-600">
						Office of College Admissions<br />
						1101 East 58th Street, Rosenwald Hall 105, Chicago, Illinois 60637<br />
						Telephone 773.702.8650 &bull; collegeadmissions@uchicago.edu
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 16, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>2847 Birchwood Ln</div>
				<div>Naperville, IL 60540</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				Congratulations! I am tremendously pleased to offer you admission to the College of the
				University of Chicago as a member of the Class of 2031. On behalf of the Committee on
				Admissions, welcome to our community of scholars.
			</p>

			<p>
				This year we reviewed one of the largest and most talented applicant pools in the history of
				the University. Your candidacy stood out for its intellectual daring, your genuine love of
				ideas, and the distinctive way you engaged the questions we posed. The Committee especially
				admired the originality of your thinking &mdash; a quality central to life on our campus,
				where inquiry is relentless and no idea is taken for granted.
			</p>

			<p>
				At UChicago you will join faculty and classmates who share your curiosity and who will
				challenge you to sharpen every argument, question every assumption, and pursue knowledge for
				its own sake. From the Core to the seminar table to late nights in the Reg, this is a place
				built for people who cannot stop asking &ldquo;why.&rdquo;
			</p>

			<p>
				To learn more about your enrollment, financial aid, and the many opportunities that await
				you, please visit your UChicago Account. We invite you to join us for our admitted students
				program this spring to experience the life of the mind firsthand. Your reply and enrollment
				deposit are due by <strong>May 1, 2027</strong>.
			</p>

			<p>
				Congratulations once again on this remarkable achievement. We look forward to seeing what you
				will make of your time in Hyde Park.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2">
				<img
					src="/signature-placeholder.png"
					alt="Signature"
					class="h-12"
					style="filter: invert(15%) sepia(85%) saturate(1500%) hue-rotate(330deg) brightness(30%) contrast(100%);"
				/>
			</div>
			<div class="font-bold">Jonathan P. Merriweather</div>
			<div class="text-sm text-gray-600">
				Vice President and Dean of Admissions and Financial Aid<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Crescat scientia; vita excolatur.</strong><br />
					&ldquo;Let knowledge grow from more to more; and so be human life enriched.&rdquo; The
					motto of the University of Chicago.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:collegeadmissions@uchicago.edu" class="hover:underline"
						>collegeadmissions@uchicago.edu</a
					><br />
					Phone: 773.702.8650<br />
					Website:
					<a href={`https://collegeadmissions.${footerDomain}`} class="hover:underline"
						>collegeadmissions.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from The University of Chicago.
		</div>
	</div>
</main>
