<script lang="ts">
	// Props passed from the main portal page
	export let applicantName: string;
	export let schoolName: string;
	export let primaryColor: string; // Duke Blue: #003366
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
		goto('/results/duke');
	};
</script>

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
					Deep Dive: Why did I get {$decisionsBySlug['duke']}?
				</button>
			</div>
		{/if}
		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-bold text-2xl mr-4"
					style="background-color: {primaryColor};"
				>
					D
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">DUKE UNIVERSITY</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admissions<br />
						2138 Campus Drive, Durham, North Carolina 27708<br />
						Telephone 919-684-3214 • Fax 919-684-8133
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 26, 2020</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>1600 Pennsylvania Avenue NW</div>
				<div>Washington, DC 20500</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-lg font-bold text-red-700">Decision Notification</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				Thank you for your interest in Duke University and for the time and care you put into
				completing your application. This year, we received a record number of applications from
				exceptional students around the world.
			</p>

			<p>
				The Admissions Committee has completed a comprehensive review of your candidacy, and we
				regret to inform you that we are unable to offer you admission to the Class of 2024. This
				was a particularly challenging year due to the truly outstanding quality of the applicant
				pool and the necessity of limiting our first-year enrollment.
			</p>

			<p>
				Please know that this decision reflects the competitive nature of our selection process
				rather than a lack of confidence in your ability to succeed. We were impressed by your
				achievements and thank you for considering Duke.
			</p>

			<p>
				You may log in to your admissions portal for additional information regarding our decision.
			</p>

			<p>
				We wish you the very best in your future academic pursuits and every success in the years to
				come.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2 h-12 flex items-end">
				<div class="text-xl italic font-serif" style="color: {primaryColor};">
					Christoph's Signature
				</div>
			</div>
			<div class="font-bold">Christoph Guttentag</div>
			<div class="text-sm text-gray-600">
				Dean of Undergraduate Admissions<br />
				Duke University
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Duke University Mission:</strong><br />
					To provide a superior liberal arts education, utilizing the best of the university's research
					and scholarly resources to nurture the next generation of leaders in every sector of society.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email: undergraduate.admissions@duke.edu<br />
					Phone: 919-684-3214<br />
					Website: admissions.duke.edu
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only.  This
			is not a real admission decision from Duke University.
		</div>
	</main>
</div>
