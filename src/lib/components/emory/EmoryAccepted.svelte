<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Emory University';
	export let primaryColor: string = '#012169';
	export let footerDomain: string = 'emory.edu';
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
		goto('/results/emory');
	};

	const EMORY_GOLD = '#B58500';
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
					Deep Dive: Why did I get {$decisionsBySlug['emory']}?
				</button>
			</div>
		{/if}

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
			<div class="text-right text-sm text-gray-600 mb-2">March 25, 2026</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>2550 Waterview Dr Unit 347</div>
				<div>Northbrook, IL 60062-6362</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				Congratulations! Based on a careful review of your Regular Decision application, it is my
				great pleasure to offer you admission to Emory College of Arts and Sciences in the Class of
				2030. Your application distinguished itself within an extraordinarily talented and
				competitive pool, and the Admission Committee was genuinely impressed by your academic
				accomplishments and the character you brought to every part of your application.
			</p>

			<p>
				At Emory, you will join a community of scholars, artists, scientists, and leaders who are
				committed to the pursuit of knowledge in the service of humanity. We were drawn to the
				curiosity, integrity, and drive evident throughout your file, and we are confident that you
				will both contribute to and thrive within the intellectual life of our campus in Atlanta.
			</p>

			<p>
				To learn more about the next steps and to celebrate with your fellow admitted students, we
				invite you to explore your admitted student portal and to attend <strong
					>Experience Emory</strong
				>, our official program for admitted students this spring. There you will meet faculty,
				current students, and future classmates, and see firsthand what makes Emory special.
			</p>

			<p>
				To secure your place in the Class of 2030, please submit your enrollment deposit and reply
				form through your applicant portal by <strong>May 1, 2026</strong>. Information regarding your
				financial aid award, if you applied for aid, is available in the portal as well.
			</p>

			<p>
				On behalf of the entire Office of Undergraduate Admission, welcome to Emory. We look forward
				to seeing all that you will accomplish here.
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
