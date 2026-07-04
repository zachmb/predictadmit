<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of Notre Dame';
	export let primaryColor: string = '#0C2340'; // Notre Dame navy
	export let footerDomain: string = 'nd.edu';
	import { page } from '$app/stores';

	const ND_GOLD = '#C99700';

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
		<DeepDiveButton slug="notredame" color={primaryColor} />

		<div class="border-b-2 pb-4 mb-8" style="border-color: {ND_GOLD};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-serif font-bold text-2xl mr-4"
					style="background-color: {primaryColor};"
				>
					ND
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">University of Notre Dame</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admissions<br />
						McKenna Hall, Notre Dame, Indiana 46556<br />
						Telephone 574-631-7505 &bull; admissions@nd.edu
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 25, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				With great enthusiasm, I write to congratulate you on your admission to the University of
				Notre Dame Class of 2031. Following a thorough and holistic review of an extraordinary
				applicant pool, the Committee on Admissions came away deeply impressed by your academic
				accomplishments, your character, and the difference you have already made in your community.
			</p>

			<p>
				This year a record number of remarkable students from around the world applied, and
				admission was highly selective. Your acceptance is a true achievement, reflecting both the
				person you are and the promise the Committee sees in you. We are confident that you will
				thrive within our community of scholars, and that you will both contribute to and be shaped
				by the mission of this University.
			</p>

			<p>
				Notre Dame is a special place &mdash; a community rooted in faith, scholarship, and service,
				where you will be challenged to become a force for good in the world. We warmly invite you to
				Notre Dame Days, our official program for admitted students this April, where you can explore
				campus, meet faculty and current students, and picture your life under the Golden Dome.
				Details will be posted to your applicant status portal.
			</p>

			<p>
				To reserve your place in the class, please submit your enrollment response and deposit
				through your applicant status portal by <strong>May 1, 2027</strong>. Details about your
				financial aid award, housing, and next steps are also available in the portal.
			</p>

			<p>
				On behalf of the whole Notre Dame family, congratulations once more. We look forward to
				welcoming you home to Notre Dame this fall.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2 text-2xl italic" style="color: {primaryColor};">Diane E. Jasper</div>
			<div class="font-bold">Diane E. Jasper</div>
			<div class="text-sm text-gray-600">
				Assistant Vice President of Undergraduate Admissions<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The Notre Dame Mission:</strong><br />
					As a Catholic university, Notre Dame is dedicated to the pursuit and sharing of truth for its
					own sake, cultivating a disciplined sensibility to the poverty, injustice, and oppression that
					burden the lives of so many.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:admissions@nd.edu" class="hover:underline">admissions@nd.edu</a><br />
					Phone: 574-631-7505<br />
					Website:
					<a href={`https://admissions.${footerDomain}`} class="hover:underline"
						>admissions.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of Notre Dame.
		</div>
	</div>
</main>
