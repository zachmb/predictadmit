<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Harvard College'; // Default
	export let primaryColor: string = '#A41034'; // Default Harvard Crimson
	export let footerDomain: string = 'harvard.edu'; // Default
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		
		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div class="w-16 h-16 text-white flex items-center justify-center font-bold text-2xl mr-4" style="background-color: {primaryColor};">
					H
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">HARVARD COLLEGE</h1>
					<div class="text-sm text-gray-600">
						Office of Admissions and Financial Aid<br>
						86 Brattle Street, Cambridge, Massachusetts 02138<br>
						Telephone 617-495-1551 • Fax 617-495-8821
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">
				March 26, 2020
			</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>1600 Massachusetts Ave</div>
				<div>Cambridge, MA 02138</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">Dear {applicantName || 'Applicant'},</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				It is my distinct pleasure to offer you admission to the Harvard College Class of 2024. Your application demonstrated exceptional academic achievement, intellectual curiosity, and a deep commitment to serving others. The Admissions Committee was profoundly impressed by your potential to contribute to the rich and vibrant life of Harvard University.
			</p>

			<p>
				This year, we received a record number of applications from around the world. Your acceptance places you among a select and highly distinguished group of incoming students, and we sincerely hope you will accept our offer. We believe your unique perspectives, talents, and experiences are essential to the future of our community.
			</p>

			<p>
				We invite you to attend **Visitas**, our official visiting program for admitted students, held from April 18-20, 2020. This is the best opportunity to experience the academic and extracurricular life of the college, meet faculty, and connect with your future classmates. Details are available in your applicant portal.
			</p>

			<p>
				To confirm your enrollment, please submit the signed Candidate's Reply Form and the non-refundable enrollment deposit through your online admissions portal by **May 1, 2020**. Please review the enclosed financial aid award for information on your generous financial assistance package.
			</p>

			<p>
				Congratulations again on your remarkable achievement. We look forward to welcoming you to Harvard Yard in the fall.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2">
				<img 
					src="/signature-placeholder.png" 
					alt="Signature" 
					class="h-12" 
					style="filter: invert(15%) sepia(85%) saturate(1500%) hue-rotate(330deg) brightness(30%) contrast(100%);"
				>
			</div>
			<div class="font-bold">William R. Fitzsimmons</div>
			<div class="text-sm text-gray-600">
				Dean of Admissions and Financial Aid<br>
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The Harvard Mission:</strong><br>
					To educate the citizens and citizen-leaders for our society. We do this through our commitment to the transformative power of a liberal arts and sciences education.
				</div>
				<div>
					<strong>Contact Information:</strong><br>
					Email: <a href="mailto:admissions@harvard.edu" class="hover:underline">admissions@harvard.edu</a><br>
					Phone: 617-495-1551<br>
					Website: <a href={`https://college.${footerDomain}`} class="hover:underline">college.{footerDomain}</a>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. 
			This is not a real admission decision from Harvard University.
		</div>
	</div>
</main>