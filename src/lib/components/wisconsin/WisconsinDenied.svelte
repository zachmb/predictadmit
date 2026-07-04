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
			<div class="text-right text-sm text-gray-600 mb-2">March 15, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>Application Number 03158246</div>
				<div>Fall 2027-2027 &bull; Mechanical Engineering BS</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				Thank you for your application to the University of Wisconsin-Madison for the Fall 2027 term.
				We appreciate the time and thought you put into applying, and we are grateful for your interest
				in becoming a Badger.
			</p>

			<p>
				This year UW-Madison received a record number of applications from an extraordinarily talented
				group of students. After a thorough and holistic review of your academic record,
				accomplishments, and personal qualities, I am sorry to tell you that we are unable to offer you
				admission at this time. With far more qualified applicants than we have space to enroll, many
				capable and deserving students, including you, could not be admitted.
			</p>

			<p>
				Please understand that this decision is not a judgment of your ability or your promise. The
				strength of our applicant pool made this an exceptionally difficult process, and a decision not
				to admit reflects the limits of our capacity far more than any shortcoming in your application.
			</p>

			<p>
				If you plan to continue your education elsewhere, know that transfer options to UW-Madison may
				be available in the future, and information about the transfer process can be found on our
				admissions website. We encourage you to pursue the many outstanding opportunities ahead of you
				with confidence.
			</p>

			<p>
				We wish you every success in your college search and in all that lies ahead. Thank you again
				for considering the University of Wisconsin-Madison.
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
