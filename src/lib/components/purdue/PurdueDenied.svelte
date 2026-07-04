<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Purdue University';
	export let primaryColor: string = '#000000';
	export let footerDomain: string = 'purdue.edu';

	const GOLD = '#CFB991';



</script>

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
				Thank you for applying to Purdue University for the Fall 2027 semester, and for the time and
				care your application reflects. This year the Office of Admissions received a record number of
				applications from an exceptionally talented group of students, and each one was reviewed with
				great attention.
			</p>

			<p>
				Following a thorough and holistic review of your application, I am sorry to inform you that we
				cannot offer you admission to your requested program at this time. With an applicant pool far
				larger than the number of available spaces, we face many difficult choices among highly
				qualified candidates — this outcome reflects that competition, not your ability or your
				potential.
			</p>

			<p>
				I know this news is disappointing, but I hope it does not discourage you. Many successful
				Boilermakers started their journeys elsewhere before joining Purdue as transfer students. If
				Purdue remains your goal, I encourage you to look into our transfer pathways and keep in touch
				with our Office of Admissions — our counselors are glad to help you plan your next steps.
			</p>

			<p>
				You have accomplished a great deal, and those achievements will keep opening doors for you. As
				you begin the next chapter of your education, we wish you every success.
			</p>

			<p>Thank you again for your interest in Purdue University.</p>
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
