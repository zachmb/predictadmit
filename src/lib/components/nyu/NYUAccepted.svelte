<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'New York University';
	export let primaryColor: string = '#57068C'; // NYU Violet
	export let footerDomain: string = 'nyu.edu';
	import { page } from '$app/stores';

	$: session = $page.data.session;

	let googleEmail = '';
	let googleName = '';

	$: {
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="nyu" color={primaryColor} />

		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-extrabold text-2xl mr-4 tracking-tight"
					style="background-color: {primaryColor};"
				>
					NYU
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">New York University</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admissions<br />
						383 Lafayette Street, New York, New York 10003<br />
						Telephone 212-998-4500
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 25, 2027</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Congratulations, {applicantName || 'Applicant'}!
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				It is my privilege and honor to tell you that you have been admitted to New York University
				and the Class of 2031. Based on your credentials and the interests described in your
				application, we are pleased to offer you admission to the College of Arts and Science.
			</p>

			<p>
				At NYU, your ambition will find room to grow to its full scale. You will join a community of
				scholars, artists, and innovators who chose NYU to test their limits and define their
				purpose. Here, at one of the world's most influential institutions of higher learning,
				students like you don't simply study the greatest challenges of our time; you immerse
				yourself in them. Since 1831, the NYU community has at its core been one of bridge builders,
				committed to engaging wide-ranging perspectives because of the possibilities created when
				bold ideas converge.
			</p>

			<p>
				Your status page has been updated and will serve as your admitted student information hub,
				or Home Base, over the coming months. There you will find information about accepting your
				offer of admission — your deadline is May 1, 2027 — and about viewing your financial aid
				offer, if you applied for aid. Beyond the checklist of next steps, it also holds plenty of
				resources for learning more about academics, student life, and financial aid.
			</p>

			<p>
				Please note that your offer of admission is contingent on your successfully completing your
				current academic program at a level of performance comparable to that presented in your
				application. Visit the admitted student section of our website to review our expectations
				for admitted students.
			</p>

			<p>
				{applicantName || 'Applicant'}, we offered you admission not merely because you meet our
				standards, but because we believe you will raise them. We look forward eagerly to the unique
				contributions you will bring to our vibrant community, in New York and around the world.
			</p>

			<p>We can't wait to welcome you home.</p>
		</div>

		<div class="mt-12">
			<div class="mb-2 text-lg" style="color: {primaryColor};">Sincerely,</div>
			<div class="font-bold">Warren Selby</div>
			<div class="text-sm text-gray-600">
				Assistant Vice President of Undergraduate Admissions<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Main Campuses:</strong><br />
					New York &nbsp;•&nbsp; Abu Dhabi &nbsp;•&nbsp; Shanghai
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:admissions@nyu.edu" class="hover:underline">admissions@nyu.edu</a><br />
					Phone: 212-998-4500<br />
					Website:
					<a href={`https://www.${footerDomain}`} class="hover:underline">www.{footerDomain}</a>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from New York University.
		</div>
	</div>
</main>
