<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of California, Davis';
	export let primaryColor: string = '#022851'; // UC Davis navy (Aggie Blue)
	export let footerDomain: string = 'ucdavis.edu';
	const accentGold = '#FFBF00';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';

	$: session = $page.data.session;

	let googleSignedIn = false;

	$: {
		googleSignedIn = !!session?.user;
	}
	import { decisionsBySlug } from '$lib/stores/results';
	const viewAnalysis = () => {
		goto('/results/ucdavis');
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
					Deep Dive: Why did I get {$decisionsBySlug['ucdavis']}?
				</button>
			</div>
		{/if}

		<div class="border-b-4 pb-4 mb-8" style="border-color: {accentGold};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 flex items-center justify-center font-extrabold text-lg mr-4 tracking-tight"
					style="background-color: {primaryColor};"
				>
					<span style="color: {accentGold};">UC</span><span class="text-white">D</span>
				</div>
				<div>
					<h1 class="text-2xl font-extrabold tracking-tight" style="color: {primaryColor};">
						<span style="color: {accentGold};">UC</span>DAVIS
					</h1>
					<div class="text-sm text-gray-600">
						Undergraduate Admissions<br />
						One Shields Avenue, Davis, California 95616<br />
						Telephone 530-752-2971
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 20, 2026</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>Fall Quarter 2026 · Economics</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				<strong>Congratulations!</strong> It is our pleasure to notify you that you are admitted to the
				University of California, Davis, for fall quarter 2026 in the Economics major. We applaud your
				hard work toward this important milestone and would be honored to have you as a member of our UC
				Davis community.
			</p>

			<p>
				Your admission reflects the strength of your academic record and the promise the Admissions
				Committee sees in your future contributions to our campus. Each year we review applications
				from an extraordinary pool of students, and you have distinguished yourself as one who will
				thrive here in California's college town.
			</p>

			<p>
				To join the Aggie family, you must submit your Statement of Intent to Register (SIR) or
				decline your offer of admission on your MyAdmissions website by 11:45 pm (Pacific Time) on
				<strong>May 1, 2026</strong>. To accept, you must pay a non-refundable, non-transferable $250
				deposit. You may return to MyAdmissions as many times as you wish before the SIR deadline.
			</p>

			<p>
				We encourage you to explore your financial aid and scholarship information through the
				MyAwards portal, and to register for Aggie Day — your introduction to dining, housing,
				student groups, and everything you need to jumpstart your Aggie experience.
			</p>

			<p>
				Congratulations once again on this outstanding achievement. We look forward to welcoming you
				to UC Davis this fall. Say "Yes" to UC Davis!
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2 text-2xl italic" style="color: {primaryColor};">Ebony M. Lewis</div>
			<div class="font-bold">Ebony M. Lewis</div>
			<div class="text-sm text-gray-600">
				Executive Director of Undergraduate Admissions<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The UC Davis Principles of Community:</strong><br />
					We affirm the dignity inherent in all of us, and we strive to maintain a climate of equity and
					justice, demonstrated by respect for one another.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:undergraduateadmissions@ucdavis.edu" class="hover:underline"
						>undergraduateadmissions@{footerDomain}</a
					><br />
					Phone: 530-752-2971<br />
					Website:
					<a href={`https://admissions.${footerDomain}`} class="hover:underline"
						>admissions.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of California, Davis.
		</div>
	</div>
</main>
