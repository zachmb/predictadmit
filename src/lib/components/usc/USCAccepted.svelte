<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of Southern California';
	export let primaryColor: string = '#990000'; // USC Cardinal
	export let footerDomain: string = 'usc.edu';
	import { page } from '$app/stores';

	$: session = $page.data.session;

	let googleEmail = '';
	let googleName = '';

	$: {
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}

	const accentGold = '#FFCC00';
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="usc" color={primaryColor} />

		<div class="border-b-4 pb-4 mb-8" style="border-color: {accentGold};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-extrabold text-2xl mr-4"
					style="background-color: {primaryColor};"
				>
					USC
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">
						UNIVERSITY OF SOUTHERN CALIFORNIA
					</h1>
					<div class="text-sm text-gray-600">
						Office of Admission<br />
						University Park Campus, Los Angeles, California 90089-0911<br />
						Telephone 213-740-1111
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 27, 2027</div>
			<div class="text-right text-sm text-gray-600 mb-4">Reference ID: 205719348</div>
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
				It is my sincere pleasure to congratulate you on being admitted to the University of Southern
				California for the fall semester. On behalf of everyone on the admission committee, welcome
				to the Trojan Family.
			</p>

			<p>
				Admission to USC this year was as competitive as it has ever been. From roughly 79,000
				applications submitted by extraordinary students around the world, we could extend offers of
				fall admission to only about one in nine candidates. That you were chosen from such an
				exceptional pool speaks to the strength of your academic record, the quality of your
				character, and the promise you show to contribute to our community. Your accomplishments
				genuinely impressed us.
			</p>

			<p>
				Our review is a qualitative one, and we consider every applicant as an individual. Your
				application was read carefully, respectfully, and thoughtfully &mdash; and it stood out. We
				are confident you will thrive here, and we cannot wait to see everything you accomplish as a
				Trojan.
			</p>

			<p>
				To accept this offer of admission, please submit your enrollment confirmation and deposit
				through your USC applicant portal no later than <strong>May 1, 2027</strong>, the National
				Candidates Reply Date. In your portal you will also find important information about
				financial aid, housing, and our admitted-student events, where you can experience USC
				firsthand and meet your future classmates.
			</p>

			<p>
				Once again, congratulations on this remarkable achievement. We look forward to welcoming you
				to University Park Campus this fall. Fight On!
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2">
				<img
					src="/signature-placeholder.png"
					alt="Signature"
					class="h-12"
					style="filter: invert(11%) sepia(95%) saturate(4000%) hue-rotate(357deg) brightness(70%) contrast(110%);"
				/>
			</div>
			<div class="font-bold">Kent Bradshaw</div>
			<div class="text-sm text-gray-600">
				Associate Dean and Director of Undergraduate Admission<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The USC Mission:</strong><br />
					The development of human beings and society as a whole through the cultivation and
					enrichment of the human mind and spirit.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:admission@usc.edu" class="hover:underline">admission@usc.edu</a><br />
					Phone: 213-740-1111<br />
					Website:
					<a href={`https://admission.${footerDomain}`} class="hover:underline"
						>admission.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of Southern California.
		</div>
	</div>
</main>
