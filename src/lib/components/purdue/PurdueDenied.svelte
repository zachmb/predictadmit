<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Purdue University';
	export let primaryColor: string = '#000000';
	export let footerDomain: string = 'purdue.edu';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';

	const GOLD = '#CFB991';

	$: session = $page.data.session;

	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	import { decisionsBySlug } from '$lib/stores/results';
	const viewAnalysis = () => {
		goto('/results/purdue');
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
					class="group flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-sans font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
					style="background-color: #000;"
				>
					Deep Dive: Why did I get {$decisionsBySlug['purdue']}?
				</button>
			</div>
		{/if}

		<!-- Letterhead -->
		<div class="border-b-4 pb-4 mb-8" style="border-color: {GOLD};">
			<div class="flex items-center">
				<div
					class="px-3 py-2 mr-4 font-extrabold text-2xl tracking-tight text-white"
					style="background-color: {primaryColor};"
				>
					PURDUE
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">Purdue University</h1>
					<div class="text-sm text-gray-600">
						Office of Admissions<br />
						128 Memorial Mall, West Lafayette, Indiana 47907<br />
						Telephone (765) 494-1776 • admissions@purdue.edu
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 10, 2026</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>Applicant, Fall 2026 First-Year Class</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				Thank you for your application to Purdue University for the Fall 2026 semester, and for the time
				and care you invested in it. This year we received a record number of applications from an
				exceptionally talented group of students, and the Office of Admissions reviewed every one with
				great attention.
			</p>

			<p>
				After a thorough and holistic review of your application, I am sorry to inform you that we are
				unable to offer you admission to your requested program at this time. Because our applicant pool
				far exceeds the number of spaces available, we must make many difficult decisions among highly
				qualified candidates — and this outcome is a reflection of that competition, not of your ability
				or your potential.
			</p>

			<p>
				I know this news is disappointing, and I do not want it to discourage you. Many successful
				Boilermakers began their journeys elsewhere and joined Purdue as transfer students. If Purdue
				remains your goal, I encourage you to explore our transfer pathways and to stay connected with
				our Office of Admissions, whose counselors are glad to help you plan your next steps.
			</p>

			<p>
				You have accomplished a great deal, and those accomplishments will continue to open doors for
				you. We wish you every success as you begin the next chapter of your education.
			</p>

			<p>Thank you again for your interest in Purdue University.</p>
		</div>

		<div class="mt-12">
			<div class="text-2xl mb-1" style="font-family: 'Brush Script MT', cursive; color: {primaryColor};">
				Kris Wong Davis
			</div>
			<div class="font-bold">Kris Wong Davis</div>
			<div class="text-sm text-gray-600">
				Vice Provost for Enrollment Management<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Boiler Up:</strong><br />
					Purdue University advances the frontiers of knowledge and equips students to take their next
					giant leaps in a persistently affordable, world-class education.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:admissions@purdue.edu" class="hover:underline">admissions@purdue.edu</a><br />
					Phone: (765) 494-1776<br />
					Website:
					<a href={`https://admissions.${footerDomain}`} class="hover:underline">admissions.{footerDomain}</a>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Purdue University.
		</div>
	</div>
</main>
