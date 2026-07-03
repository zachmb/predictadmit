<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'New York University';
	export let primaryColor: string = '#57068C'; // NYU Violet
	export let footerDomain: string = 'nyu.edu';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';

	$: session = $page.data.session;

	let googleSignedIn = false;
	let googleEmail = '';
	let googleName = '';

	$: {
		googleSignedIn = !!session?.user;
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}
	import { decisionsBySlug } from '$lib/stores/results';
	const viewAnalysis = () => {
		goto('/results/nyu');
	};
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="group flex items-center px-4 py-2 text-white rounded-lg text-sm font-sans font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
					style="background-color: {primaryColor};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['nyu']}?
				</button>
			</div>
		{/if}

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
				The admissions committee at New York University has carefully considered your application for
				all programs to which you have requested consideration. It is with regret that I must inform
				you that we are unable to offer you admission to NYU.
			</p>

			<p>
				Over the many years that I have been doing this work, one thing has proven true time and
				again: one setback is never the defining moment of an ambitious student. My foremost wish is
				that you will find an academic institution where you will continue to thrive. If, after
				matriculating elsewhere, you remain interested in finding a path to NYU, you are welcome to
				reapply as a transfer candidate to our campus in New York. In the meantime, we do not have any
				process by which you can submit an appeal or reconsideration request.
			</p>

			<p>
				On behalf of the NYU community, I wish you the best as you continue your education.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2 text-lg" style="color: {primaryColor};">Sincerely,</div>
			<div class="font-bold">William Sichel</div>
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
