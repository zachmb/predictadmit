<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Georgetown University';
	export let primaryColor: string = '#041E42'; // Georgetown blue
	export let footerDomain: string = 'georgetown.edu';
	import { page } from '$app/stores';

	$: session = $page.data.session;

	$: {
	}
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="georgetown" color={primaryColor} />

		<!-- Letterhead -->
		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-bold text-3xl mr-4 font-serif"
					style="background-color: {primaryColor};"
				>
					G
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">GEORGETOWN UNIVERSITY</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admissions<br />
						37th and O Streets, N.W., Washington, D.C. 20057<br />
						Telephone (202) 687-3600
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 20, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>Regular Decision Applicant</div>
				<div>Class of 2031</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				On behalf of the Committee on Admissions, thank you for applying to Georgetown University
				and for the thought and care you put into your application. Many months of work went into
				your decision to apply, and we are grateful to have had the chance to learn about your
				accomplishments and aspirations.
			</p>

			<p>
				Georgetown received one of the largest and most talented applicant pools in its history
				this year for a limited number of places in the Class of 2031. After reviewing your
				application carefully, holistically, and more than once, I must regretfully tell you that
				the Committee cannot offer you a place in the entering class.
			</p>

			<p>
				Let me be clear: this decision is no judgment of your ability, your character, or your
				promise. The depth of this year's pool forced many difficult choices among candidates who,
				like you, genuinely deserved admission. This outcome says far more about the realities of
				a highly competitive process than about any shortcoming in your record.
			</p>

			<p>
				I am certain you will find an academic home where you will flourish, and that you will
				bring to it the same energy and dedication you would have brought to the Hilltop. The
				members of the Committee join me in wishing you every success in your studies and in
				everything ahead.
			</p>

			<p>Thank you again for your interest in Georgetown University.</p>
		</div>

		<div class="mt-12">
			<div class="mb-2">
				<img
					src="/signature-placeholder.png"
					alt="Signature"
					class="h-12"
					style="filter: invert(11%) sepia(35%) saturate(2000%) hue-rotate(200deg) brightness(45%) contrast(95%);"
				/>
			</div>
			<div class="font-bold">Walter H. Pembroke</div>
			<div class="text-sm text-gray-600">
				Dean of Undergraduate Admissions<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The Georgetown Mission:</strong><br />
					As the nation's oldest Catholic and Jesuit university, Georgetown educates women and men to
					be reflective lifelong learners and responsible, active participants in civic life, in service
					to others.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href={`mailto:guadmiss@${footerDomain}`} class="hover:underline">guadmiss@{footerDomain}</a
					><br />
					Phone: (202) 687-3600<br />
					Website:
					<a href={`https://uadmissions.${footerDomain}`} class="hover:underline"
						>uadmissions.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Georgetown University.
		</div>
	</div>
</main>
