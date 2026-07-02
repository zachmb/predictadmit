<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of Wisconsin-Madison';
	export let primaryColor: string = '#C5050C'; // Badger red
	export let footerDomain: string = 'wisc.edu';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';

	$: session = $page.data.session;

	let googleSignedIn = false;

	$: googleSignedIn = !!session?.user;

	import { decisionsBySlug } from '$lib/stores/results';
	const viewAnalysis = () => {
		goto('/results/wisconsin');
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
					class="group flex items-center px-4 py-2 text-white rounded-lg text-sm font-sans font-bold transition-all shadow-md active:scale-95"
					style="background-color: {primaryColor};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['wisconsin']}?
				</button>
			</div>
		{/if}

		<div class="border-b-4 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-bold text-xl mr-4 rounded"
					style="background-color: {primaryColor};"
				>
					W
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">
						UNIVERSITY OF WISCONSIN-MADISON
					</h1>
					<div class="text-sm text-gray-600">
						Office of Admissions and Recruitment<br />
						702 W. Johnson Street, Suite 1101, Madison, Wisconsin 53715<br />
						Telephone 608-262-3961 &bull; onwisconsin@admissions.wisc.edu
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 15, 2026</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>Application Number 02049787</div>
				<div>Fall 2026-2027 &bull; Mechanical Engineering BS</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				Congratulations! It is my great pleasure to offer you admission to the University of
				Wisconsin-Madison for the Fall 2026 term. On behalf of the entire university community, welcome
				to the Badger family. This is a moment worth celebrating, and you have every reason to be
				proud.
			</p>

			<p>
				Admission to UW-Madison is highly selective, and your accomplishments distinguished you within
				an exceptionally strong and talented applicant pool. The Admissions Committee was impressed by
				your academic record, your intellectual curiosity, and the ways you have engaged with your
				school and community. We are confident that you will thrive here and add something meaningful
				to our campus.
			</p>

			<p>
				You have been admitted to the College of Engineering with an intended major in Mechanical
				Engineering. At UW-Madison, you will join a community that has been "sifting and winnowing" in
				the pursuit of truth for more than 170 years, with world-class faculty, hands-on research, and
				a tradition of the Wisconsin Idea, the principle that the boundaries of the university are the
				boundaries of the state and the world.
			</p>

			<p>
				To secure your place in the class, please log in to your Applicant Portal and submit your
				enrollment confirmation by <strong>May 1, 2026</strong>. There you will also find information
				about housing, orientation (Student Orientation, Advising, and Registration), and next steps
				for connecting with your college. If you applied for financial aid, your award notification
				will be available in your portal shortly.
			</p>

			<p>
				We cannot wait to welcome you to Bascom Hill this fall. Once a Badger, always a Badger, on,
				Wisconsin!
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
			<div class="font-bold">André Phillips</div>
			<div class="text-sm text-gray-600">
				Director, Office of Admissions and Recruitment<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The Wisconsin Idea:</strong><br />
					That the boundaries of the university are the boundaries of the state, and that education should
					influence and improve people's lives beyond the classroom.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:onwisconsin@admissions.wisc.edu" class="hover:underline"
						>onwisconsin@admissions.wisc.edu</a
					><br />
					Phone: 608-262-3961<br />
					Website:
					<a href={`https://admissions.${footerDomain}`} class="hover:underline"
						>admissions.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of Wisconsin-Madison.
		</div>
	</div>
</main>
