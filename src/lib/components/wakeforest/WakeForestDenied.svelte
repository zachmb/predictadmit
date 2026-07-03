<script lang="ts">
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
			<div class="text-right text-sm text-gray-600 mb-2">March 24, 2027</div>
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
				Thank you for applying to Wake Forest University and for allowing us to consider you for a
				place in the Class of 2031. I know how much thought and effort went into your application, and
				I want you to know that the Committee on Admissions read it with genuine care and attention.
			</p>

			<p>
				This year we received an extraordinary number of applications from remarkable students around
				the world. Because Wake Forest is test-optional, we evaluated each candidate holistically
				&mdash; considering academic record, writing, recommendations, and personal context. After
				the most thoughtful review we could give it, I am sorry to tell you that we are not able to
				offer you admission. With so many outstanding applicants and a limited number of places, we
				had to make many difficult decisions, and this was among the hardest.
			</p>

			<p>
				Please understand that this outcome is not a judgment of your ability or your worth. The
				qualities that make you a strong student and a good person are unchanged by this letter, and
				they will carry you far. Admissions decisions at highly selective universities turn on many
				factors, and a denial here says far more about the depth of our applicant pool than about
				your potential.
			</p>

			<p>
				I hope you will take real pride in all you have accomplished, and I am confident you will
				flourish at a university that is fortunate to have you. On behalf of everyone at Wake Forest,
				I wish you every success and happiness in the years ahead.
			</p>

			<p>With warm regards and best wishes, <em>Pro Humanitate</em>.</p>
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
