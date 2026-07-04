<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Columbia University';
	export let primaryColor: string = '#003D6B';
	export let footerDomain: string = 'columbia.edu';


	const COLUMBIA_BLUE = '#B9D9EB';



</script>

<svelte:head>
	<title>{schoolName} — Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 p-6" style="font-family: Georgia, 'Times New Roman', serif;">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="columbia" color={primaryColor} />

		<!-- Letterhead -->
		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div class="w-16 h-16 flex items-center justify-center mr-4" style="background-color: {primaryColor};">
					<svg viewBox="0 0 60 46" class="w-10 h-8" aria-hidden="true">
						<path d="M4 40 L6 16 L18 26 L30 6 L42 26 L54 16 L56 40 Z" fill={COLUMBIA_BLUE} />
						<rect x="4" y="40" width="52" height="5" fill={COLUMBIA_BLUE} />
						<circle cx="6" cy="14" r="3" fill={COLUMBIA_BLUE} />
						<circle cx="30" cy="4" r="3.5" fill={COLUMBIA_BLUE} />
						<circle cx="54" cy="14" r="3" fill={COLUMBIA_BLUE} />
					</svg>
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">COLUMBIA UNIVERSITY</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admissions<br />
						212 Hamilton Hall, Mail Code 2807 · 1130 Amsterdam Avenue<br />
						New York, New York 10027 · Telephone 212-854-2522
					</div>
				</div>
			</div>
		</div>

		<!-- Date + address -->
		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 13, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>Regular Decision Applicant</div>
				<div>Columbia College</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				Thank you for your application to Columbia University and for allowing us to consider you for
				a place in the Class of 2031. I know how much thought and effort you invested in your
				application, and the Committee on Admissions read it with genuine care and attention.
			</p>

			<p>
				This year we received one of the largest and most accomplished applicant pools in Columbia's
				history for a very limited number of places. Because of this, we were forced to make many
				difficult decisions among candidates of remarkable promise. After a thorough and thoughtful
				review, I am sorry to tell you that we are unable to offer you admission.
			</p>

			<p>
				I want to be clear that this decision is not a judgment of your ability or your worth. Our
				choices reflect the extraordinary competitiveness of this year's pool and the constraints of
				our class size far more than any shortcoming in your candidacy. The accomplishments and
				character evident throughout your application are real, and they will continue to open doors
				for you.
			</p>

			<p>
				Wherever you continue your education, I am confident you will bring energy, curiosity, and
				distinction to that community. On behalf of the entire Committee, I thank you for your
				interest in Columbia and wish you every success in the years ahead.
			</p>

			<p>With warm regards and best wishes,</p>
		</div>

		<div class="mt-12">
			<div class="mb-2">
				<img
					src="/signature-placeholder.png"
					alt="Signature"
					class="h-12"
					style="filter: invert(15%) sepia(60%) saturate(1200%) hue-rotate(180deg) brightness(45%) contrast(100%);"
				/>
			</div>
			<div class="font-bold">Jessica Marinaccio</div>
			<div class="text-sm text-gray-600">
				Dean of Undergraduate Admissions and Financial Aid<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Columbia's Mission:</strong><br />
					To advance knowledge and learning at the highest level and to convey the products of its efforts
					to the world, grounded in the shared intellectual experience of the Core Curriculum.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:ugrad-ask@columbia.edu" class="hover:underline">ugrad-ask@columbia.edu</a
					><br />
					Phone: 212-854-2522<br />
					Website:
					<a href={`https://undergrad.admissions.${footerDomain}`} class="hover:underline"
						>undergrad.admissions.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Columbia University.
		</div>
	</div>
</main>
