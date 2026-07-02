<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of Virginia';
	export let primaryColor: string = '#232D4B'; // UVA Jefferson Blue
	export let footerDomain: string = 'virginia.edu';
	const accentColor = '#E57200'; // UVA Rotunda Orange

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';

	$: session = $page.data.session;

	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	const viewAnalysis = () => {
		goto('/results/uva');
	};
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-slate-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="group flex items-center px-4 py-2 text-white rounded-lg text-sm font-sans font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
					style="background-color: {primaryColor};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['uva']}?
				</button>
			</div>
		{/if}

		<!-- Letterhead -->
		<div class="border-b-4 pb-4 mb-8" style="border-color: {accentColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-bold text-3xl mr-4 rounded-sm"
					style="background-color: {accentColor};"
				>
					V
				</div>
				<div>
					<h1 class="text-2xl font-bold tracking-wide" style="color: {primaryColor};">
						UNIVERSITY OF VIRGINIA
					</h1>
					<div class="text-sm text-slate-600">
						Office of Undergraduate Admission<br />
						190 McCormick Road, P.O. Box 400160, Charlottesville, VA 22904<br />
						Telephone (434) 982-5300
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-slate-600 mb-2">March 21, 2026</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8 leading-relaxed">
			<p>
				I am deeply sorry to inform you that we are not able to offer you admission to the University
				of Virginia. I can appreciate that this decision is not the one you had hoped to receive, and
				I regret having to share it with you.
			</p>

			<p>
				Your application demonstrated that you are a capable student with a bright future. We wish
				that we had more places in the first-year class and that our decisions were not so hard to
				make and especially so hard to bear. We do our absolute best to consider all applicants
				fairly, and to treat them with the care and respect they deserve. Still, we regret that we
				must disappoint many students who we know will be successful in college and far beyond.
			</p>

			<p>
				Although it may be too early to begin thinking of next steps, I want to emphasize that the
				door to the University remains open. Many candidates who are not admitted as first-year
				students reapply after one or two years of study elsewhere. Others apply to our graduate or
				professional schools after completing their undergraduate degrees. Should you remain
				interested in the University, we sincerely hope that you'll stay in touch with us.
			</p>

			<p>
				Again, I am sorry that we are not able to offer you admission. All of us in the Office of
				Undergraduate Admission remain grateful for the interest you have shown in the University, and
				we wish you well as you continue your education.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2 text-slate-700">Sincerely,</div>
			<div class="font-bold" style="color: {primaryColor};">Greg W. Roberts</div>
			<div class="text-sm text-slate-600">
				Associate Vice Provost of Enrollment and<br />
				Dean of Admission<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-slate-200 text-xs text-slate-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The University's Purpose:</strong><br />
					To advance human knowledge, educate leaders, and cultivate an informed citizenry founded on
					the belief that ideas can change the world for the better.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:undergradadmission@virginia.edu" class="hover:underline"
						>undergradadmission@{footerDomain}</a
					><br />
					Phone: (434) 982-5300<br />
					Website:
					<a href={`https://admission.${footerDomain}`} class="hover:underline"
						>admission.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of Virginia.
		</div>
	</div>
</main>
