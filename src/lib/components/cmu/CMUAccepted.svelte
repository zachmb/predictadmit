<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Carnegie Mellon University';
	export let primaryColor: string = '#C41230';
	export let footerDomain: string = 'cmu.edu';
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

<main class="min-h-screen bg-white text-gray-800 p-6" style="font-family: 'Open Sans', system-ui, sans-serif;">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="cmu" color={primaryColor} />

		<!-- Letterhead -->
		<div class="mb-10">
			<div class="text-2xl font-bold tracking-tight text-gray-900">Carnegie Mellon University</div>
			<div class="text-sm uppercase tracking-widest font-semibold" style="color: {primaryColor};">
				Office of Admission
			</div>
		</div>

		<div class="mb-8">
			<div class="text-sm text-gray-600 mb-6">March 15, 2027</div>
			<div class="space-y-1 text-[15px]">
				<div>{applicantName || 'Applicant'}</div>
				<div>2847 Birchwood Ln</div>
				<div>Naperville, IL 60540-4417</div>
			</div>
		</div>

		<div class="mb-4 text-[15px]">Dear {applicantName || 'Applicant'},</div>

		<div class="space-y-4 mb-8 text-[15px] leading-relaxed">
			<p>
				Congratulations! The Carnegie Mellon University Admission Committee is pleased to offer you
				admission to the Department of Mechanical Engineering in the College of Engineering on the
				Pittsburgh campus for Fall 2027.
			</p>

			<p>
				To accept your offer of admission, please complete the enrollment reply form and submit your
				deposit in your <em>Where Am I in the Process?</em> portal. For next steps, admitted student
				visit opportunities and important dates, visit the admitted student website at
				<a href="/disclaimer" class="underline" style="color: {primaryColor};"
					>cmu.edu/admission/admitted</a
				>. If you applied for financial aid, stay tuned for further updates about your financial aid
				status and eligibility in the coming weeks.
			</p>

			<p>
				Please keep in mind that all Carnegie Mellon offers of admission are contingent upon students
				upholding the academic and personal conduct standards on which their admission was based. The
				university reserves the right to rescind an offer of admission if circumstances warrant.
			</p>

			<p>
				On behalf of our faculty and staff, congratulations and welcome to the Tartan community!
				We're here to support you every step of the way. If you have any questions now or at any
				point during your transition to Carnegie Mellon, don't hesitate to contact the Office of
				Admission.
			</p>
		</div>

		<div class="mb-12 text-[15px]">
			<div class="mb-4">Sincerely,</div>
			<div class="font-bold">Miguel Alvarez</div>
			<div class="text-sm text-gray-600">Executive Director of Admission</div>
		</div>

		<div
			class="pt-4 text-center text-[13px] text-gray-700"
			style="border-top: 2px solid {primaryColor};"
		>
			Carnegie Mellon University | Office of Admission | Division of Enrollment Management<br />
			<span class="text-[12px]"
				>5000 Forbes Avenue, Pittsburgh, PA, 15213<br />
				t: 412.268.2082 |
				<a href="/disclaimer" class="hover:underline" style="color: {primaryColor};"
					>admission@andrew.{footerDomain}</a
				></span
			>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Carnegie Mellon University.
		</div>
	</div>
</main>
