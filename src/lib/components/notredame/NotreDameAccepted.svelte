<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of Notre Dame';
	export let primaryColor: string = '#0C2340'; // Notre Dame navy
	export let footerDomain: string = 'nd.edu';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';

	const ND_GOLD = '#C99700';

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
		goto('/results/notredame');
	};
</script>

<Confetti primary={primaryColor} />

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
					Deep Dive: Why did I get {$decisionsBySlug['notredame']}?
				</button>
			</div>
		{/if}

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
			<div class="text-right text-sm text-gray-600 mb-2">March 25, 2026</div>
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
				It is with great enthusiasm that I congratulate you on your admission to the University of
				Notre Dame Class of 2030. After a thorough and holistic review of an extraordinary applicant
				pool, the Committee on Admissions was deeply impressed by your academic accomplishments, your
				character, and the ways you have already made a difference in your community.
			</p>

			<p>
				This year we received a record number of applications from remarkable students around the
				world, and admission was highly selective. Your acceptance is a genuine achievement and a
				reflection of the person you are and the promise the Committee sees in you. We are confident
				that you will thrive within our community of scholars, and that you will both contribute to
				and be shaped by the mission of this University.
			</p>

			<p>
				Notre Dame is a special place &mdash; a community grounded in faith, scholarship, and service,
				where you will be challenged to become a force for good in the world. We warmly invite you to
				Notre Dame Days, our official program for admitted students this April, where you can explore
				campus, meet faculty and current students, and imagine your life under the Golden Dome.
				Details will be posted to your applicant status portal.
			</p>

			<p>
				To secure your place in the class, please submit your enrollment response and deposit through
				your applicant status portal by <strong>May 1, 2026</strong>. Information regarding your
				financial aid award, housing, and next steps is also available in the portal.
			</p>

			<p>
				On behalf of the entire Notre Dame family, congratulations once again. We cannot wait to
				welcome you home to Notre Dame this fall.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2 text-2xl italic" style="color: {primaryColor};">Debra E. Johns</div>
			<div class="font-bold">Debra E. Johns</div>
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
