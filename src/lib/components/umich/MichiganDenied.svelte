<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of Michigan';
	export let primaryColor: string = '#00274C'; // Michigan Blue
	export let footerDomain: string = 'umich.edu';

	const MAIZE = '#FFCB05';




	$: firstName = (applicantName || 'Applicant').trim().split(' ')[0];
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="umich" color={primaryColor} />

		<!-- Letterhead -->
		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 flex items-center justify-center font-black text-3xl mr-4"
					style="background-color: {primaryColor}; color: {MAIZE};"
				>
					M
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">UNIVERSITY OF MICHIGAN</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admissions<br />
						1220 Student Activities Building, 515 E. Jefferson St.<br />
						Ann Arbor, Michigan 48109-1316 • 734-764-7433
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-sm text-gray-600 mb-4 font-bold">March 28, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {firstName},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				Thank you for applying to the University of Michigan College of Engineering for the class
				entering fall 2027. I know how much thought and effort you put into your application, and the
				admissions committee is grateful for the opportunity to learn about your accomplishments and
				aspirations.
			</p>

			<p>
				This year we received a record number of applications from an exceptionally talented pool of
				students from across the country and around the world. After a careful and holistic review of
				your application, I am sorry to share that we are unable to offer you admission. With far more
				deserving candidates than we have space to enroll, many outstanding students could not be
				admitted.
			</p>

			<p>
				Please know that this decision is not a judgment of your ability or your potential to succeed.
				The strength of our applicant pool made these decisions extraordinarily difficult, and this
				outcome reflects the limits of our capacity far more than any shortcoming in your record. Your
				achievements to date are real and meaningful, and they will continue to open doors for you.
			</p>

			<p>
				On behalf of the University of Michigan, thank you for your interest in becoming a Wolverine.
				We wish you success as you continue your education, and we are confident you will thrive
				wherever your path leads, {firstName}.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-1 text-lg">Sincerely,</div>
			<div class="font-bold italic text-xl" style="color: {primaryColor};">Elaine R. Sutton</div>
			<div class="font-bold">Elaine R. Sutton</div>
			<div class="text-sm text-gray-600">
				Assistant Vice Provost and Executive Director<br />
				Office of Undergraduate Admissions, {schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The Michigan Difference:</strong><br />
					To serve the people of Michigan and the world through preeminence in creating, communicating,
					preserving, and applying knowledge, art, and academic values.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href={`mailto:admissions@${footerDomain}`} class="hover:underline"
						>admissions@{footerDomain}</a
					><br />
					Phone: 734-764-7433<br />
					Website:
					<a href={`https://admissions.${footerDomain}`} class="hover:underline"
						>admissions.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of Michigan.
		</div>
	</div>
</main>
