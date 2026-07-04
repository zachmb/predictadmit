<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
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
				Thank you for your interest in Carnegie Mellon University and for the care you invested in
				your application for Fall 2027. Our Admission Committee gave your application close and
				careful attention, and I know how much thought and effort it represents.
			</p>

			<p>
				We received a remarkable number of applications this year from exceptionally talented
				students across the country and around the world. After a thorough and holistic review, I am
				sorry to tell you that we cannot offer you admission. Because qualified applicants far
				outnumber the places in our incoming class, we faced many genuinely difficult decisions, and
				this was one of them.
			</p>

			<p>
				Please understand that this outcome is not a verdict on your ability or your promise. The
				accomplishments your application reflects are real, and they will keep opening doors for
				you. Many students who were not admitted to Carnegie Mellon go on to flourish at
				outstanding institutions and in careers they love.
			</p>

			<p>
				On behalf of the entire Office of Admission, thank you once more for considering Carnegie
				Mellon. We wish you every success in your studies and in everything that lies ahead.
			</p>
		</div>

		<div class="mb-12 text-[15px]">
			<div class="mb-4">Sincerely,</div>
			<div class="font-bold">Rafael M. Ortiz</div>
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
