<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	export let applicantName: string = 'Applicant';
	export let schoolName: string = 'Dartmouth College';
	export let primaryColor: string = '#00693E';
	export let footerDomain: string = 'dartmouth.edu';
	import { page } from '$app/stores';

	$: session = $page.data.session;

	let googleEmail = '';
	let googleName = '';

	$: {
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}
</script>

<div class="min-h-screen bg-white p-8 font-serif">
	<div class="max-w-2xl mx-auto">
		<DeepDiveButton slug="dartmouth" color={primaryColor} />
		<!-- Letterhead -->
		<div class="border-b-2 border-gray-300 pb-4 mb-8">
			<div class="flex items-center mb-4">
				<div class="w-12 h-12 bg-[#00693E] rounded-full mr-4 flex items-center justify-center">
					<span class="text-white text-xl font-bold">D</span>
				</div>
				<div>
					<h1 class="text-2xl font-bold text-gray-700">Dartmouth College</h1>
					<p class="text-gray-600 text-sm">Office of Admissions</p>
				</div>
			</div>
			<div class="text-sm text-gray-600">
				<p>6016 McNutt Hall</p>
				<p>Hanover, New Hampshire 03755</p>
			</div>
		</div>

		<!-- Date -->
		<p class="mb-8 text-gray-700">
			{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
		</p>

		<!-- Applicant Info -->
		<div class="mb-8">
			<p class="text-gray-800">{applicantName}</p>
			<p class="text-gray-600">Regular Decision Applicant</p>
		</div>

		<!-- Letter Body -->
		<div class="mb-8 leading-relaxed text-gray-800">
			<p class="mb-4">Dear {applicantName},</p>

			<p class="mb-4">
				Thank you for applying to Dartmouth College. After thorough review by our Admissions
				Committee, I am sorry to tell you that we cannot offer you a place in the Class of 2031.
			</p>

			<p class="mb-4">
				Dartmouth considered applications this year from a remarkably accomplished group of
				candidates with strong academic records and clear leadership potential. We evaluated every
				application holistically, weighing academic achievement, personal qualities,
				extracurricular involvement, and the contributions each student might make to our
				close-knit community in Hanover.
			</p>

			<div class="my-8 p-6 bg-gray-50 border-l-4 border-[#00693E] italic">
				<p class="mb-2 font-semibold text-gray-700">About Our Selection Process</p>
				<p class="text-gray-600">
					Dartmouth looks for students with exceptional intellectual ability, curiosity, and a
					commitment to community engagement. Your accomplishments are clearly significant, yet
					the constraints of our class size mean we must turn away many outstanding students who
					would undoubtedly thrive here.
				</p>
			</div>

			<p class="mb-4">
				Please understand that this outcome speaks to the extraordinary selectivity of our
				applicant pool, not to any shortcoming in your abilities or promise. We are confident you
				will thrive and contribute meaningfully at another excellent institution.
			</p>

			<p class="mb-4">
				We are grateful for the care and effort you put into your application, and we wish you
				every success in your future academic pursuits.
			</p>
		</div>

		<!-- Signature -->
		<div class="mt-12">
			<p class="mb-1">Sincerely,</p>
			<div class="mb-8">
				<p class="font-semibold text-gray-700">Office of Admissions</p>
				<p class="text-sm text-gray-600">Dartmouth College</p>
			</div>

			<div class="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-300 text-sm">
				<p class="text-gray-700 mb-2">
					This decision is final for the 2026-2027 application cycle. We encourage you to explore
					other excellent institutions where your talents will be valued and nurtured.
				</p>
			</div>

			<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
				<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
				is not a real admission decision from Dartmouth College.
			</div>
		</div>
	</div>
</div>
