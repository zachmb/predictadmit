<script lang="ts">
	// Props passed from the main portal page
	export let applicantName: string;
	export let schoolName: string;
	export let primaryColor: string; // Duke Blue: #003366
	export let footerDomain: string;
	import { goto } from '$app/navigation';

import { decisionsBySlug } from '$lib/stores/results';
const viewAnalysis = () => {
  goto('/results/duke');
};

	// Duke-specific content
	const DUKE_ACCENT_COLOR = '#99CCFF'; // Light Blue
</script>

<div class="min-h-screen bg-white text-gray-800 font-sans p-6">
	<main class="max-w-3xl mx-auto mt-10">
		<div class="mb-6 flex justify-end">
			<button 
			  on:click={viewAnalysis}
			  class="group flex items-center px-4 py-2 bg-[#003262] text-white rounded-lg text-sm font-sans font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
			>
			  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			  </svg>
			  Deep Dive: Why did I get {$decisionsBySlug['duke']}?
			</button>
		  </div>
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
			<div class="text-lg font-bold" style="color: {primaryColor};">Congratulations!</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				On behalf of the Admissions Committee, I am delighted to inform you that you have been
				admitted to the Duke University Class of 2024. Your application impressed us with its depth,
				intellectual curiosity, and remarkable potential, and we are confident that you will
				contribute significantly to the Duke community.
			</p>

			<p>
				This year, Duke received over 45,000 applications for the approximately 1,740 places in the
				first-year class. Your admission is a tremendous accomplishment, and we hope you will choose
				to join us next fall. The diverse perspectives, talents, and experiences you bring will
				enrich our campus in meaningful ways.
			</p>

			<p>
				You are invited to attend Blue Devil Days, our admitted students program, from April 16-18,
				2020. This program will give you the opportunity to experience life at Duke firsthand, meet
				current students and faculty, and connect with your future classmates.
			</p>

			<p>
				To accept your offer of admission, please complete the reply form available in your
				admissions portal by <strong>May 1, 2020</strong>. You will also find important information
				about financial aid, housing, and next steps in your portal.
			</p>

			<p>
				Again, congratulations on this outstanding achievement. We look forward to welcoming you to
				Durham. Go Blue Devils!
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
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Duke University.
		</div>
	</main>
</div>
