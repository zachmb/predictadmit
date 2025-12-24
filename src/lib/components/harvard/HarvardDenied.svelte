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
				Thank you for your interest in {schoolName} and for your competitive application to the Class of 2024. This year, we received a deeply impressive pool of applications from students around the world. The review process was exceptionally rigorous, reflecting the extraordinary caliber of the applicant pool.
			</p>

			<p>
				The Committee reviewed your credentials with great care and attention, but due to the overwhelming number of highly qualified candidates and the limited capacity of our first-year class, we regret to inform you that we are unable to offer you admission to {schoolName}.
			</p>

			<p>
				We recognize the tremendous effort and achievement represented by your application, and we know that this decision will be disappointing. Please know that this decision reflects only the competitive realities of our selection process, and not a lack of confidence in your abilities or potential for future success.
			</p>

			<p>
				We wish you the very best as you pursue your education and future endeavors at another outstanding institution. You should take great pride in the accomplishments you have already achieved.
			</p>

			<p>
				Thank you once again for considering Harvard College.
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