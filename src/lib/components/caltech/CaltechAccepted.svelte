<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	// Props passed from the main portal page
	export let applicantName: string;
	export let schoolName: string;
	export let primaryColor: string; // Caltech Orange: #E15000
	export let footerDomain: string;
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
		goto('/results/caltech');
	};
</script>

<Confetti primary={primaryColor} />

<div class="min-h-screen bg-white text-gray-800 font-sans p-6">
	<main class="max-w-3xl mx-auto mt-10">
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
					Deep Dive: Why did I get {$decisionsBySlug['caltech']}?
				</button>
			</div>
		{/if}
		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-bold text-2xl mr-4"
					style="background-color: {primaryColor};"
				>
					C
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">
						CALIFORNIA INSTITUTE OF TECHNOLOGY
					</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admissions<br />
						1200 E California Blvd, Pasadena, California 91125<br />
						Telephone 626-395-6341 • Fax 626-449-9742
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 14, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>1600 Pennsylvania Avenue NW</div>
				<div>Washington, DC 20500</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-lg font-bold text-green-700">Congratulations!</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				The Undergraduate Admissions Committee is delighted to inform you that you have been offered
				admission to the California Institute of Technology Class of 2031. Your application
				demonstrated exceptional intellectual prowess, a deep curiosity for scientific inquiry, and
				the resilience needed to thrive in Caltech’s rigorous academic environment.
			</p>

			<p>
				We received over 13,000 applications this year for a class of approximately 235 students.
				Your admission is a profound honor that reflects our belief in your potential to contribute
				significantly to discovery and innovation. We are eager for you to join our community of
				passionate scientists and engineers.
			</p>

			<p>
				You are invited to attend Preview Weekend, our admitted students program, from April 13-15,
				2027. This is your opportunity to visit our campus in Pasadena, meet the faculty, engage
				with current students (the Caltech Beavers!), and experience the unique Caltech culture.
			</p>

			<p>
				To officially accept your offer of admission, please complete the reply form available in
				your admissions portal by <strong>May 1, 2027</strong>. Further details regarding financial
				aid, housing, and enrollment will also be found there.
			</p>

			<p>
				Again, congratulations on this outstanding achievement. We look forward to welcoming you to
				Caltech next fall.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2 h-12 flex items-end">
				<div class="text-xl italic font-serif" style="color: {primaryColor};">
					Grant's Signature
				</div>
			</div>
			<div class="font-bold">Grant D. Currin</div>
			<div class="text-sm text-gray-600">
				Director of Undergraduate Admissions<br />
				Caltech
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Caltech Mission:</strong><br />
					To expand human knowledge and benefit society through research integrated with education, in
					a highly collegial, interdisciplinary atmosphere.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email: ugadmissions@caltech.edu<br />
					Phone: 626-395-6341<br />
					Website: admissions.caltech.edu
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only.  This
			is not a real admission decision from Caltech.
		</div>
	</main>
</div>
