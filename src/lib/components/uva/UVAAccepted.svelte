<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of Virginia';
	export let primaryColor: string = '#232D4B'; // UVA Jefferson Blue
	export let footerDomain: string = 'virginia.edu';
	const accentColor = '#E57200'; // UVA Rotunda Orange




</script>

<Confetti primary={primaryColor} />

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
				It is my genuine pleasure to offer you admission to the University of Virginia.
				Congratulations, on behalf of the entire Office of Undergraduate Admission. In an
				extraordinarily talented and accomplished pool, your application stood out, and we are truly
				excited about all that you will bring to Grounds.
			</p>

			<p>
				Every application is read with great care, with attention not only to academic achievement
				but to character, curiosity, and the ways a student might contribute to and grow within our
				community. Both your record of accomplishment and the person we came to know through your
				application convinced us that you belong here. We are confident you will thrive at UVA and
				help make this University an even better place.
			</p>

			<p>
				We hope you will join us this spring for <strong>Days on the Lawn</strong>, our celebration
				for admitted students. There is no better way to experience the University's academic life,
				traditions, and community firsthand, meet faculty and current students, and picture yourself
				as a Wahoo. Details and registration are available in your MyUVA Application Portal.
			</p>

			<p>
				To secure your place in the entering class, please submit your enrollment decision through
				your applicant portal by <strong>May 1, 2027</strong>. If you applied for financial aid,
				your award package will come separately from Student Financial Services; please do not let
				cost stand between you and this opportunity before speaking with our office.
			</p>

			<p>
				Once again, congratulations. We are honored that you considered the University of Virginia,
				and we very much hope to welcome you to Mr. Jefferson's University this fall.
			</p>
		</div>

		<div class="mt-12">
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
