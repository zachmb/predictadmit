<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
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

<Confetti primary={primaryColor} />

<div class="min-h-screen bg-white p-8 font-serif">
	<div class="max-w-2xl mx-auto">
		<DeepDiveButton slug="dartmouth" color={primaryColor} />
		<!-- Letterhead - Dartmouth Green -->
		<div class="border-b-4 border-[#00693E] pb-4 mb-8">
			<div class="flex items-center mb-4">
				<!-- Dartmouth Pine Logo -->
				<div class="w-12 h-12 bg-[#00693E] rounded-full mr-4 flex items-center justify-center">
					<span class="text-white text-xl font-bold">D</span>
				</div>
				<div>
					<h1 class="text-2xl font-bold text-[#00693E]">Dartmouth College</h1>
					<p class="text-gray-700 text-sm">Office of Admissions</p>
				</div>
			</div>
			<div class="text-sm text-gray-600">
				<p>6016 McNutt Hall</p>
				<p>Hanover, New Hampshire 03755</p>
				<p>Tel: 603-646-2875</p>
			</div>
		</div>

		<!-- Date -->
		<p class="mb-8 text-gray-700">
			{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
		</p>

		<!-- Applicant Info -->
		<div class="mb-8">
			<p class="text-lg font-medium text-gray-800">{applicantName}</p>
			<p class="text-gray-600">Regular Decision Applicant</p>
		</div>

		<!-- Letter Body -->
		<div class="mb-8 leading-relaxed text-gray-800">
			<p class="mb-4">Dear {applicantName},</p>

			<p class="mb-4">
				On behalf of Dartmouth College, I am delighted to offer you a place in the Class of 2031.
				Welcome to the Dartmouth family!
			</p>

			<p class="mb-4">
				Your application was reviewed within a remarkably competitive worldwide pool of candidates.
				The Admissions Committee was impressed by your intellectual curiosity, your record of
				academic accomplishment, and your evident dedication to both scholarship and community
				engagement. Your distinctive perspective and capacity for leadership speak directly to
				Dartmouth's mission of educating promising students and preparing them for a lifetime of
				learning and responsible leadership.
			</p>

			<div class="my-8 p-6 bg-green-50 border-l-4 border-[#00693E] italic">
				<p class="mb-2 font-semibold text-[#00693E]">Welcome to the Dartmouth Experience</p>
				<p class="text-gray-700">
					At Dartmouth, you will become part of a close-knit community of scholars set in New
					Hampshire's beautiful Upper Valley. You'll take advantage of our distinctive D-Plan
					(quarter system), study alongside world-renowned faculty in small classes, and join the
					vibrant outdoor and social traditions that define life here—from the Dartmouth Outing
					Club to Winter Carnival.
				</p>
			</div>

			<p class="mb-4">
				In the weeks ahead, you will receive detailed information about next steps, including
				Dartmouth's admitted student programs (Dimensions of Dartmouth), housing, course
				registration, and financial aid (if applicable). Current students, faculty, and alumni who
				are eager to welcome you to our community will also be reaching out to you directly.
			</p>

			<p class="mb-4">
				This offer of admission is contingent upon your successful completion of the current
				academic year. We expect that you will maintain the high standards of achievement and
				personal conduct that characterized your secondary school record.
			</p>

			<p class="mb-4">
				Take a moment to celebrate this milestone with the family, teachers, and friends who have
				supported you along the way. We look forward to greeting you in Hanover this fall.
			</p>
		</div>

		<!-- Signature -->
		<div class="mt-12">
			<p class="mb-1">Sincerely,</p>
			<div class="mb-8">
				<div class="h-12 mb-2 flex items-center text-[#00693E] font-bold text-lg">
					Dartmouth College
				</div>
				<p class="font-semibold text-[#00693E]">Marcus T. Fielding</p>
				<p class="text-sm text-gray-700">
					Vice Provost for Enrollment and Dean of Admissions and Financial Aid
				</p>
				<p class="text-sm text-gray-600">Dartmouth College</p>
			</div>

			<div class="mt-12 p-6 bg-green-50 rounded-lg border border-green-200">
				<p class="text-sm text-gray-700 mb-2">
					<strong class="text-[#00693E]">Next Steps:</strong> Your official admission packet will arrive
					by mail within 7-10 business days. Please log into your Dartmouth Application Portal to view
					your financial aid award (if applicable) and to confirm your enrollment by May 1.
				</p>
				<p class="text-sm text-gray-700">
					<strong class="text-[#00693E]">Important:</strong> Admitted students are invited to attend
					<em>Dimensions of Dartmouth</em>, our admitted student program, in April. Registration
					information will be available in your portal.
				</p>
			</div>

			<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
				<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
				is not a real admission decision from Dartmouth College.
			</div>
		</div>
	</div>
</div>
