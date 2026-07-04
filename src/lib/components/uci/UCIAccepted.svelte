<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
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

<Confetti primary={primaryColor} />

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
				Congratulations! On behalf of our campus community, I am pleased to offer you admission to
				the University of California, Irvine for the Fall 2027 term. In one of the largest and most
				competitive applicant pools in the University of California system, you stood out through your
				academic accomplishments, personal insight, and promise as a future Anteater.
			</p>

			<p>
				Your admission to UCI is a tremendous achievement. The Committee on Admissions admired the
				strength of your academic record and the character reflected throughout your application. We
				are confident you will contribute meaningfully to our vibrant community of scholars,
				innovators, and leaders here in Orange County.
			</p>

			<p>
				To secure your place in the entering class, you must submit your <strong
					>Statement of Intent to Register (SIR)</strong
				>
				through your UC Application account and the UCI Applicant Portal by <strong>May 1, 2027</strong>.
				Detailed instructions regarding enrollment, orientation, housing, and financial aid are available
				in your applicant portal. We encourage you to review your financial aid notification and to explore
				the many resources available to admitted students.
			</p>

			<p>
				We warmly invite you to join us for <strong>Celebrate UCI</strong>, our official program for
				admitted students, where you will meet future classmates, connect with faculty, and
				experience life on our beautiful campus. Zot! Zot! Zot!
			</p>

			<p>
				Once again, congratulations on your admission to UCI. We look forward to welcoming you to the
				Anteater family this fall.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2 font-serif text-2xl italic" style="color: {primaryColor};">Drew Lanford</div>
			<div class="font-bold">Drew Lanford</div>
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
