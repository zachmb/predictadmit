<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
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
				Thank you for applying to the University of Notre Dame and for giving us the opportunity to
				consider you for a place in our Class of 2031. I know how much thought and effort went into
				your application, and the Committee on Admissions gave it the care and attention it
				deserved.
			</p>

			<p>
				This year brought a record number of applications from exceptionally talented students, and
				we could offer admission to only a small fraction of them. After a careful and holistic
				review, we are unable to offer you a place in the incoming class. I understand this is not
				the news you hoped for, and I do not deliver it lightly.
			</p>

			<p>
				Please know that this decision is no judgment of your ability or your worth. It speaks to
				the extraordinary strength of this year's applicant pool and the limited number of places
				available to offer. The accomplishments and character evident throughout your application
				are real and meaningful, and they will continue to serve you well.
			</p>

			<p>
				We are grateful for your interest in Notre Dame and for the chance to come to know you. I am
				confident you will find a community in which you flourish, and I wish you every success in
				your studies and in all that lies ahead.
			</p>

			<p>With warm regards and sincere best wishes for your future,</p>
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
