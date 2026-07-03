<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Carnegie Mellon University';
	export let primaryColor: string = '#C41230';
	export let footerDomain: string = 'cmu.edu';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';

	$: session = $page.data.session;

	let googleSignedIn = false;
	let googleEmail = '';
	let googleName = '';

	$: {
		googleSignedIn = !!session?.user;
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}
	import { decisionsBySlug } from '$lib/stores/results';
	const viewAnalysis = () => {
		goto('/results/cmu');
	};
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 p-6" style="font-family: 'Open Sans', system-ui, sans-serif;">
	<div class="max-w-3xl mx-auto mt-10">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="group flex items-center px-4 py-2 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
					style="background-color: {primaryColor};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['cmu']}?
				</button>
			</div>
		{/if}

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
				<div>2550 Waterview Dr Unit 347</div>
				<div>Northbrook, IL 60062-6362</div>
			</div>
		</div>

		<div class="mb-4 text-[15px]">Dear {applicantName || 'Applicant'},</div>

		<div class="space-y-4 mb-8 text-[15px] leading-relaxed">
			<p>
				Thank you for your interest in Carnegie Mellon University and for the time and care you put
				into your application for Fall 2027. Our Admission Committee reviewed your application with
				great attention, and I know how much thought and effort went into it.
			</p>

			<p>
				This year we received a remarkable number of applications from exceptionally talented
				students across the country and around the world. After a thorough and holistic review, I am
				sorry to inform you that we are unable to offer you admission. With far more qualified
				applicants than we have places in our incoming class, we faced many genuinely difficult
				decisions, and this was one of them.
			</p>

			<p>
				Please understand that this outcome is not a judgment of your ability or your promise. The
				accomplishments reflected in your application are real, and they will continue to open doors
				for you. Many students who were not admitted to Carnegie Mellon go on to thrive at
				outstanding institutions and in careers they love.
			</p>

			<p>
				On behalf of the entire Office of Admission, thank you again for considering Carnegie Mellon.
				We wish you every success in your studies and in all that lies ahead.
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
