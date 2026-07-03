<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
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
				Congratulations, {applicantName || 'Applicant'}!
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				It is my honor and privilege to share with you that you have been admitted to New York
				University and the Class of 2031. On the basis of your credentials and the interests stated in
				your application, we are pleased to offer you admission to the College of Arts and Science.
			</p>

			<p>
				At NYU, your ambition will find its true scale. You will join a mosaic of scholars, artists,
				and innovators who chose NYU to test their limits and define their purpose. Here, in one of
				the most influential institutions of higher learning in the world, students like you don't
				just study the world's greatest challenges; you actively immerse yourself in them. Since our
				founding in 1831, the NYU community has been, at its core, one of bridge builders committed to
				engaging with wide-ranging perspectives, because we believe in the possibilities that are
				created where bold ideas converge.
			</p>

			<p>
				Your status page has been updated and will serve as your admitted student information hub, or
				Home Base, over the next few months. There, you will see information about accepting your
				offer of admission — your deadline is May 1, 2027 — and viewing your financial aid offer, if
				you applied for aid. Beyond your checklist of next steps, you'll find plenty of resources to
				help you learn more about academics, student life, and financial aid there, too.
			</p>

			<p>
				Please know that your offer of admission is contingent upon successful completion of your
				existing academic program at a performance level comparable to the one presented in your
				application. Visit the admitted student section of our website to review our expectations for
				admitted students.
			</p>

			<p>
				{applicantName || 'Applicant'}, we have offered you admission not just because you meet our
				standards, but because we believe you will raise them. We eagerly anticipate the unique
				contributions you will bring to our vibrant community, both in New York and around the world.
			</p>

			<p>We can't wait to welcome you home.</p>
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
