<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'The Ohio State University';
	export let primaryColor: string = '#BB0000'; // Ohio State Scarlet
	export let footerDomain: string = 'osu.edu';

	const GRAY = '#666666';




	$: firstName = (applicantName || 'Applicant').trim().split(' ')[0];
</script>

<Confetti primary={primaryColor} />

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
				Congratulations, {firstName}!
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				I am very pleased to offer you admission to The Ohio State University for the autumn semester
				of 2027. On behalf of our university community, welcome to Buckeye Nation. Your admission
				reflects the strength of your academic record, your character, and the promise you have shown
				as a future leader.
			</p>

			<p>
				This year we reviewed one of the largest and most accomplished applicant pools in the
				university's history. Earning a place in the incoming class is a meaningful achievement, and
				one you should be proud of. We were impressed by all you have accomplished and believe you
				will thrive in our vibrant community of scholars, researchers, and doers.
			</p>

			<p>
				At Ohio State, you will join a community of more than 60,000 students and a worldwide network
				of Buckeyes who are making a difference in their fields and their communities. From
				world-class faculty and research opportunities to a spirited campus life in Columbus, you
				will find countless ways to explore your interests, be challenged, and grow.
			</p>

			<p>
				To accept our offer of admission and confirm your enrollment, please submit your Enrollment
				Acceptance and non-refundable deposit through your applicant portal no later than
				<strong>May 1, 2027</strong>. You will also find important information there regarding
				financial aid, scholarships, housing, and orientation. If you have any questions, our staff
				is here to help every step of the way.
			</p>

			<p>
				Once again, congratulations, {firstName}. We look forward to welcoming you to campus and
				calling you a Buckeye. O-H!
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-1 text-lg">Sincerely,</div>
			<div class="font-bold italic text-xl" style="color: {primaryColor};">Victor Hollis</div>
			<div class="font-bold">Victor Hollis</div>
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
