<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Wake Forest University';
	export let primaryColor: string = '#9E7E38'; // Wake Forest Old Gold
	export let footerDomain: string = 'wfu.edu';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';

	$: session = $page.data.session;

	let googleSignedIn = false;

	$: googleSignedIn = !!session?.user;

	import { decisionsBySlug } from '$lib/stores/results';
	const viewAnalysis = () => {
		goto('/results/wakeforest');
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
					Deep Dive: Why did I get {$decisionsBySlug['wakeforest']}?
				</button>
			</div>
		{/if}

		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-bold text-xl mr-4 font-serif"
					style="background-color: {primaryColor};"
				>
					WF
				</div>
				<div>
					<h1 class="text-2xl font-bold tracking-tight" style="color: {primaryColor};">
						WAKE FOREST UNIVERSITY
					</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admissions<br />
						Porter B. Byrum Welcome Center, P.O. Box 7305 Reynolda Station<br />
						Winston-Salem, North Carolina 27109 &bull; Telephone 336-758-5201
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 24, 2026</div>
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
				It is my great privilege to congratulate you on your admission to the Wake Forest University
				Class of 2030. On behalf of the entire Committee on Admissions, welcome to the Forest. This
				is a moment worth celebrating, and it is one you have earned through years of dedication,
				curiosity, and character.
			</p>

			<p>
				Wake Forest reviews every application individually and holistically. Because we are
				test-optional, our decision rested on the full picture of who you are: the rigor of your
				coursework, the strength of your writing, the recommendations of those who know you best, and
				the ways you have engaged your community. We were genuinely impressed, and we are confident
				that you will thrive within our close-knit community of teacher-scholars.
			</p>

			<p>
				At Wake Forest you will find a university small enough to know you and ambitious enough to
				challenge you &mdash; a place where our motto, <em>Pro Humanitate</em>, "for humanity," is
				lived out daily. We invite you to join us for one of our admitted-student programs this
				spring to experience Mother, So Dear firsthand, meet your future classmates and professors,
				and imagine the difference you will make here.
			</p>

			<p>
				To secure your place in the class, please submit your enrollment deposit and Decision Reply
				Form through your applicant status page by <strong>May 1, 2026</strong>. If you applied for
				financial aid, your award information will be posted to your portal shortly. Our team is here
				to help every step of the way.
			</p>

			<p>
				Congratulations once again. We cannot wait to welcome you to Winston-Salem and to call you a
				Demon Deacon.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2 text-2xl italic" style="color: {primaryColor};">Eric J. Maguire</div>
			<div class="font-bold">Eric J. Maguire</div>
			<div class="text-sm text-gray-600">
				Vice President for Enrollment<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Pro Humanitate:</strong><br />
					A Private Liberal Arts University in Winston-Salem, North Carolina. Founded 1834. We educate
					the whole person to lead lives of purpose, meaning, and service.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:admissions@wfu.edu" class="hover:underline">admissions@wfu.edu</a><br />
					Phone: 336-758-5201<br />
					Website:
					<a href={`https://admissions.${footerDomain}`} class="hover:underline"
						>admissions.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Wake Forest University.
		</div>
	</div>
</main>
