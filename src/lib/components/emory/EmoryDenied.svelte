<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Emory University';
	export let primaryColor: string = '#012169';
	export let footerDomain: string = 'emory.edu';
	import { page } from '$app/stores';

	$: session = $page.data.session;

	let googleEmail = '';
	let googleName = '';

	$: {
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}

	const EMORY_GOLD = '#B58500';
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="emory" color={primaryColor} />

		<div class="border-b-2 pb-4 mb-8" style="border-color: {EMORY_GOLD};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-serif font-bold text-xl mr-4"
					style="background-color: {primaryColor};"
				>
					E
				</div>
				<div>
					<h1 class="text-2xl font-bold tracking-tight" style="color: {primaryColor};">
						EMORY UNIVERSITY
					</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admission<br />
						1390 Oxford Road NE, Atlanta, Georgia 30322-1016<br />
						Telephone 404-727-6036 &bull; admission@emory.edu
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 25, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>2847 Birchwood Ln</div>
				<div>Naperville, IL 60540-4417</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				The Admission Committee has completed the review of our Regular Decision candidates, and we
				regret to inform you that we are unable to offer you admission to Emory College of Arts and
				Sciences. I know this is not the news you had hoped to receive, and I do not share it
				lightly.
			</p>

			<p>
				Each year we receive applications from many more highly qualified students from around the
				world than we are able to admit. Because our entering class is limited in size, we are
				unfortunately unable to offer a place to everyone who has the talent and potential to succeed
				at Emory. Decisions such as this one are among the most difficult that we make.
			</p>

			<p>
				Please know that this decision is not a judgment of your ability or your worth. We recognize
				the time, effort, and thoughtfulness you invested in your application, and we acknowledge the
				impressive accomplishments that you have already achieved. We are confident that you will
				find success and fulfillment in the opportunities ahead of you.
			</p>

			<p>
				Should your interest in Emory University continue, you may be eligible to apply again as a
				transfer student to Emory College of Arts and Sciences after completing two full semesters of
				college coursework in a degree-seeking program.
			</p>

			<p>
				We thank you sincerely for your interest in Emory, and we offer you our very best wishes for a
				productive and rewarding college experience.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2 text-2xl italic" style="color: {primaryColor};">Kelley A. Lips</div>
			<div class="font-bold">Kelley A. Lips, Ed.D.</div>
			<div class="text-sm text-gray-600">
				Vice Provost for Undergraduate Enrollment, Admissions<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The Emory Mission:</strong><br />
					To create, preserve, teach, and apply knowledge in the service of humanity — grounded in the
					courageous inquiry of an ethically engaged community.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:admission@emory.edu" class="hover:underline">admission@emory.edu</a><br />
					Phone: 404-727-6036<br />
					Website:
					<a href={`https://apply.${footerDomain}`} class="hover:underline">apply.{footerDomain}</a>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Emory University.
		</div>
	</div>
</main>
