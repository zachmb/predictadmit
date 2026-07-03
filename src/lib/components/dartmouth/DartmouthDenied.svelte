<script lang="ts">
	export let applicantName: string = 'Applicant';
	export let schoolName: string = 'Dartmouth College';
	export let primaryColor: string = '#00693E';
	export let footerDomain: string = 'dartmouth.edu';
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
		goto('/results/dartmouth');
	};
</script>

<div class="min-h-screen bg-white p-8 font-serif">
	<div class="max-w-2xl mx-auto">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="group flex items-center px-4 py-2 bg-[#003262] text-white rounded-lg text-sm font-sans font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-4 h-4 transition-transform group-hover:-translate-x-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
					</svg>
					Deep Dive: Why did I get {$decisionsBySlug['dartmouth']}?
				</button>
			</div>
		{/if}
		<!-- Letterhead -->
		<div class="border-b-2 border-gray-300 pb-4 mb-8">
			<div class="flex items-center mb-4">
				<div class="w-12 h-12 bg-[#00693E] rounded-full mr-4 flex items-center justify-center">
					<span class="text-white text-xl font-bold">D</span>
				</div>
				<div>
					<h1 class="text-2xl font-bold text-gray-700">Dartmouth College</h1>
					<p class="text-gray-600 text-sm">Office of Admissions</p>
				</div>
			</div>
			<div class="text-sm text-gray-600">
				<p>6016 McNutt Hall</p>
				<p>Hanover, New Hampshire 03755</p>
			</div>
		</div>

		<!-- Date -->
		<p class="mb-8 text-gray-700">
			{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
		</p>

		<!-- Applicant Info -->
		<div class="mb-8">
			<p class="text-gray-800">{applicantName}</p>
			<p class="text-gray-600">Regular Decision Applicant</p>
		</div>

		<!-- Letter Body -->
		<div class="mb-8 leading-relaxed text-gray-800">
			<p class="mb-4">Dear {applicantName},</p>

			<p class="mb-4">
				Thank you for your application to Dartmouth College. After careful consideration by our
				Admissions Committee, I regret to inform you that we are unable to offer you admission to
				the Class of 2031.
			</p>

			<p class="mb-4">
				This year, Dartmouth reviewed applications from an exceptionally accomplished pool of
				candidates with strong academic backgrounds and demonstrated leadership potential. Each
				application was evaluated holistically, considering academic achievement, personal
				qualities, extracurricular involvement, and potential contributions to our close-knit
				community in Hanover.
			</p>

			<div class="my-8 p-6 bg-gray-50 border-l-4 border-[#00693E] italic">
				<p class="mb-2 font-semibold text-gray-700">About Our Selection Process</p>
				<p class="text-gray-600">
					Dartmouth seeks students who demonstrate exceptional intellectual ability, curiosity, and
					a commitment to community engagement. While you have clearly demonstrated significant
					accomplishments, the limitations of our class size prevent us from admitting many
					outstanding students who would undoubtedly thrive at Dartmouth.
				</p>
			</div>

			<p class="mb-4">
				Please know that this decision reflects the extraordinary selectivity of our applicant pool
				rather than any deficiency in your abilities or potential. We have every confidence that you
				will find success and make meaningful contributions at another excellent institution.
			</p>

			<p class="mb-4">
				We appreciate the time and effort you dedicated to your application and wish you all the
				best in your future academic endeavors.
			</p>
		</div>

		<!-- Signature -->
		<div class="mt-12">
			<p class="mb-1">Sincerely,</p>
			<div class="mb-8">
				<p class="font-semibold text-gray-700">Office of Admissions</p>
				<p class="text-sm text-gray-600">Dartmouth College</p>
			</div>

			<div class="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-300 text-sm">
				<p class="text-gray-700 mb-2">
					This decision is final for the 2026-2027 application cycle. We encourage you to explore
					other excellent institutions where your talents will be valued and nurtured.
				</p>
			</div>
		</div>
	</div>
</div>
