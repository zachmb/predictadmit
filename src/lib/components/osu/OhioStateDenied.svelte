<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'The Ohio State University';
	export let primaryColor: string = '#BB0000'; // Ohio State Scarlet
	export let footerDomain: string = 'osu.edu';

	const GRAY = '#666666';




	$: firstName = (applicantName || 'Applicant').trim().split(' ')[0];
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="osu" color={primaryColor} />

		<!-- Letterhead -->
		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 flex items-center justify-center font-serif font-black text-3xl mr-4 text-white"
					style="background-color: {primaryColor};"
				>
					O
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">THE OHIO STATE UNIVERSITY</h1>
					<div class="text-sm" style="color: {GRAY};">
						Office of Undergraduate Admissions<br />
						Enarson Classroom Building, 154 W. 12th Avenue<br />
						Columbus, Ohio 43210 • 614-292-3980
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-sm text-gray-600 mb-4 font-bold">March 12, 2027</div>
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
				Thank you for your application to The Ohio State University and for your interest in becoming
				a Buckeye. I know how much thought and effort went into your application, and it was a genuine
				pleasure to learn about your accomplishments, your goals, and all that you would bring to a
				university community.
			</p>

			<p>
				This year we received a remarkable number of applications from an exceptionally talented group
				of students — far more qualified applicants than we have places in our incoming class. After a
				careful and thorough review of your application, I am sorry to share that we are unable to
				offer you admission for the autumn semester of 2027.
			</p>

			<p>
				Please understand that this decision is not a judgment of your ability or your worth. With so
				many outstanding candidates, many capable students who would succeed here cannot be admitted.
				This outcome does not diminish in any way the very real achievements you have earned or the
				bright future ahead of you.
			</p>

			<p>
				I encourage you to move forward with confidence. The qualities that made your application
				compelling — your curiosity, your perseverance, and your commitment — will serve you well
				wherever your path leads. Many successful people have thrived after a decision like this one.
			</p>

			<p>
				On behalf of the Office of Undergraduate Admissions, thank you again for considering Ohio
				State. We wish you every success in your college search and in all that lies ahead.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-1 text-lg">Sincerely,</div>
			<div class="font-bold italic text-xl" style="color: {primaryColor};">Vern Granger</div>
			<div class="font-bold">Vern Granger</div>
			<div class="text-sm" style="color: {GRAY};">
				Director of Undergraduate Admissions<br />
				Office of Undergraduate Admissions, {schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The Ohio State Mission:</strong><br />
					Through teaching, research, and outreach, Ohio State advances the well-being of the people of
					Ohio and the global community — education for citizenship, discovery, and service.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href={`mailto:askabuckeye@${footerDomain}`} class="hover:underline"
						>askabuckeye@{footerDomain}</a
					><br />
					Phone: 614-292-3980<br />
					Website:
					<a href={`https://undergrad.osu.edu`} class="hover:underline">undergrad.{footerDomain}</a>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from The Ohio State University.
		</div>
	</div>
</main>
