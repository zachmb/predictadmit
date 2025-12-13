<script lang="ts">
	export let applicantName: string;
	export let schoolName: string = 'Johns Hopkins University';
	export let primaryColor: string = '#002D72'; // JHU Blue
	export let footerDomain: string = 'jhu.edu';

	const currentDate = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
</script>

<svelte:head>
	<title>Johns Hopkins University - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<div class="absolute left-1/2 transform -translate-x-1/2 max-w-3xl w-full" style="top: 2rem;">
			<a
				href="/"
				class="inline-block border border-slate-500 bg-slate-100 px-3 py-1 text-[11px] font-semibold hover:bg-slate-200 active:bg-slate-300 transition-colors shadow-sm"
				style="position: absolute; left: 0; top: 0;"
			>
				&#8592; Back to PredictAdmit admitMail
			</a>
		</div>

		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div class="w-16 h-16 text-white flex items-center justify-center font-bold text-2xl mr-4" style="background-color: {primaryColor};">
					JHU
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">JOHNS HOPKINS UNIVERSITY</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admissions<br>
						3400 N. Charles St., Baltimore, Maryland 21218<br>
						Telephone (410) 516-8171 • Fax (410) 516-6585
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">
				{currentDate}
			</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>100 Blue Jay Way</div>
				<div>Baltimore, MD 21218</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-lg font-bold" style="color: {primaryColor};">Congratulations!</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				On behalf of the Admissions Committee, I am delighted to inform you that you have been admitted to the Johns Hopkins University Class of 2029. Your application impressed us with its depth, intellectual promise, and commitment to scholarship, and we believe that you will contribute significantly to the Hopkins community.
			</p>

			<p>
				This year, Johns Hopkins received a record number of applications for our entering class. Your admission is a tremendous accomplishment, and we hope you will join us next fall in Baltimore. The diverse perspectives, talents, and experiences you bring will enrich our campus in meaningful ways.
			</p>

			<p>
				You are invited to attend our admitted students program, **Hopkins Hosting**, from April 16-18, 2025. This program will give you the opportunity to experience life at Hopkins firsthand, meet current students and faculty, and connect with your future classmates.
			</p>

			<p>
				To accept your offer of admission, please complete the reply form available in your admissions portal by <strong>May 1, 2025</strong>. You will also find important information about financial aid, housing, and next steps in your portal.
			</p>

			<p>
				Again, congratulations on this outstanding achievement. We look forward to welcoming you to the Johns Hopkins family in August.
			</p>
		</div>

		<div class="mt-12">
			<div class="h-12 mb-2 w-40 bg-gray-100 flex items-center justify-center text-xs text-slate-500">
				[Dean's Signature Placeholder]
			</div>
			<div class="font-bold">Dean Robert Johnson</div>
			<div class="text-sm text-gray-600">
				Dean of Undergraduate Admissions<br>
				Johns Hopkins University
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Johns Hopkins Mission:</strong><br>
					The mission of The Johns Hopkins University is to educate its students and cultivate their capacity for life-long learning, and to advance the frontiers of knowledge and discovery through research.
				</div>
				<div>
					<strong>Contact Information:</strong><br>
					Email: gotojhu@{footerDomain}<br>
					Phone: (410) 516-8171<br>
					Website: <a href="http://apply.jhu.edu" class="text-blue-600 hover:underline">apply.jhu.edu</a>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only.
			This is not a real admission decision from Johns Hopkins University.
		</div>
	</div>
</main>