<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of Virginia';
	export let primaryColor: string = '#232D4B'; // UVA Jefferson Blue
	export let footerDomain: string = 'virginia.edu';
	const accentColor = '#E57200'; // UVA Rotunda Orange




</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-slate-800 font-serif p-4 sm:p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="uva" color={primaryColor} />

		<!-- Letterhead -->
		<div class="border-b-4 pb-4 mb-8" style="border-color: {accentColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 shrink-0 text-white flex items-center justify-center font-bold text-3xl mr-4 rounded-sm"
					style="background-color: {accentColor};"
				>
					V
				</div>
				<div class="min-w-0">
					<h1 class="text-2xl font-bold tracking-wide" style="color: {primaryColor};">
						UNIVERSITY OF VIRGINIA
					</h1>
					<div class="text-sm text-slate-600 break-words">
						Office of Undergraduate Admission<br />
						190 McCormick Road, P.O. Box 400160, Charlottesville, VA 22904<br />
						Telephone (434) 982-5300
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-slate-600 mb-2">March 21, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8 leading-relaxed">
			<p>
				I am deeply sorry to tell you that we cannot offer you admission to the University of
				Virginia. I understand this is not the decision you had hoped to receive, and I regret that
				I must be the one to share it with you.
			</p>

			<p>
				Your application made clear that you are a capable student with a bright future ahead of
				you. We only wish the first-year class had more room, and that decisions like this one were
				not so difficult to make &mdash; and harder still to receive. We do our absolute best to
				weigh every applicant fairly and to treat each one with the care and respect they deserve.
				Even so, we regret having to disappoint so many students who we know will succeed in college
				and well beyond it.
			</p>

			<p>
				It may feel too soon to think about next steps, but I want to emphasize that the door to the
				University remains open. Many candidates who are not admitted as first-year students choose
				to reapply after a year or two of study elsewhere, and others apply to our graduate or
				professional schools once they have completed their undergraduate degrees. If your interest
				in the University continues, we sincerely hope you'll stay in touch with us.
			</p>

			<p>
				Again, I am sorry that we cannot offer you admission. Everyone in the Office of
				Undergraduate Admission remains grateful for the interest you have shown in the University,
				and we wish you well as your education continues.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2 text-slate-700">Sincerely,</div>
			<div class="font-bold" style="color: {primaryColor};">Gerald W. Rutherford</div>
			<div class="text-sm text-slate-600">
				Associate Vice Provost of Enrollment and<br />
				Dean of Admission<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-slate-200 text-xs text-slate-500">
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
				<div>
					<strong>The University's Purpose:</strong><br />
					To advance human knowledge, educate leaders, and cultivate an informed citizenry founded on
					the belief that ideas can change the world for the better.
				</div>
				<div class="break-words">
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:undergradadmission@virginia.edu" class="hover:underline"
						>undergradadmission@{footerDomain}</a
					><br />
					Phone: (434) 982-5300<br />
					Website:
					<a href={`https://admission.${footerDomain}`} class="hover:underline"
						>admission.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of Virginia.
		</div>
	</div>
</main>
