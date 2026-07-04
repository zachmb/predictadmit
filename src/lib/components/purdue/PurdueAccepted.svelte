<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Purdue University';
	export let primaryColor: string = '#000000';
	export let footerDomain: string = 'purdue.edu';

	const GOLD = '#CFB991';



</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="purdue" color={primaryColor} />

		<!-- Letterhead -->
		<div class="border-b-4 pb-4 mb-8" style="border-color: {GOLD};">
			<div class="flex items-center">
				<div
					class="px-3 py-2 mr-4 font-extrabold text-2xl tracking-tight text-white"
					style="background-color: {primaryColor};"
				>
					PURDUE
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">Purdue University</h1>
					<div class="text-sm text-gray-600">
						Office of Admissions<br />
						128 Memorial Mall, West Lafayette, Indiana 47907<br />
						Telephone (765) 494-1776 • admissions@purdue.edu
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 10, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>Applicant, Fall 2027 First-Year Class</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				Congratulations! I am delighted to offer you admission to Purdue University for the
				Fall 2027 semester. On behalf of the Office of Admissions, welcome to the Boilermaker family.
				In one of the largest and most competitive applicant pools Purdue has ever seen, your record
				of academic achievement, persistence, and promise truly stood out.
			</p>

			<p>
				Purdue is where the next giant leaps take shape — in engineering, agriculture, business,
				science, the liberal arts, and beyond. What you have accomplished so far genuinely impressed
				us, and we are confident you will thrive here and add real value to our community of doers,
				makers, and problem-solvers.
			</p>

			<p>
				To claim your spot in the class, please log in to your applicant portal and accept your
				offer of admission. We also encourage you to file your
				<strong>Free Application for Federal Student Aid (FAFSA)</strong> using Purdue's Federal School
				code <strong>001825</strong> before the April 15 priority filing date to maximize your financial
				aid and scholarship eligibility.
			</p>

			<p>
				We also invite you to visit campus in West Lafayette. Walking past the Engineering Fountain,
				touring a residence hall, and meeting the faculty and students who will become your community
				is the best way to picture your future here. You will find details for admitted-student
				programs in your portal.
			</p>

			<p>
				Once again, congratulations on this outstanding accomplishment. We cannot wait to welcome you
				to Purdue and to watch all that you will achieve. Boiler Up! Hammer Down!
			</p>
		</div>

		<div class="mt-12">
			<div class="text-2xl mb-1" style="font-family: 'Brush Script MT', cursive; color: {primaryColor};">
				Dana Wong Ellis
			</div>
			<div class="font-bold">Dana Wong Ellis</div>
			<div class="text-sm text-gray-600">
				Vice Provost for Enrollment Management<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Boiler Up:</strong><br />
					Purdue University advances the frontiers of knowledge and equips students to take their next
					giant leaps in a persistently affordable, world-class education.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:admissions@purdue.edu" class="hover:underline">admissions@purdue.edu</a><br />
					Phone: (765) 494-1776<br />
					Website:
					<a href={`https://admissions.${footerDomain}`} class="hover:underline">admissions.{footerDomain}</a>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Purdue University.
		</div>
	</div>
</main>
