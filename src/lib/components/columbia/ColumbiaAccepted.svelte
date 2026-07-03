<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Columbia University';
	export let primaryColor: string = '#003D6B';
	export let footerDomain: string = 'columbia.edu';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';

	const COLUMBIA_BLUE = '#B9D9EB';

	$: session = $page.data.session;

	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	const viewAnalysis = () => {
		goto('/results/columbia');
	};
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} — Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 p-6" style="font-family: Georgia, 'Times New Roman', serif;">
	<div class="max-w-3xl mx-auto mt-10">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="group flex items-center px-4 py-2 text-white rounded-lg text-sm font-sans font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
					style="background-color: {primaryColor};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['columbia']}?
				</button>
			</div>
		{/if}

		<!-- Letterhead -->
		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div class="w-16 h-16 flex items-center justify-center mr-4" style="background-color: {primaryColor};">
					<svg viewBox="0 0 60 46" class="w-10 h-8" aria-hidden="true">
						<path d="M4 40 L6 16 L18 26 L30 6 L42 26 L54 16 L56 40 Z" fill={COLUMBIA_BLUE} />
						<rect x="4" y="40" width="52" height="5" fill={COLUMBIA_BLUE} />
						<circle cx="6" cy="14" r="3" fill={COLUMBIA_BLUE} />
						<circle cx="30" cy="4" r="3.5" fill={COLUMBIA_BLUE} />
						<circle cx="54" cy="14" r="3" fill={COLUMBIA_BLUE} />
					</svg>
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">COLUMBIA UNIVERSITY</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admissions<br />
						212 Hamilton Hall, Mail Code 2807 · 1130 Amsterdam Avenue<br />
						New York, New York 10027 · Telephone 212-854-2522
					</div>
				</div>
			</div>
		</div>

		<!-- Date + address -->
		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 13, 2026</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>Regular Decision Applicant</div>
				<div>Columbia College</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				On behalf of the Committee on Admissions, it is my great pleasure to offer you admission to
				the Columbia University Class of 2030. Congratulations! After a remarkably competitive review
				of applicants from every corner of the world, you distinguished yourself as someone who will
				thrive in and contribute meaningfully to our community here in the City of New York.
			</p>

			<p>
				The Committee was genuinely impressed by the intellectual curiosity, character, and
				accomplishment evident throughout your application. At Columbia, you will join a community of
				scholars defined by the Core Curriculum — a shared intellectual experience that has, for more
				than a century, invited students to grapple with the great questions of human thought
				alongside faculty and classmates of extraordinary talent.
			</p>

			<p>
				To confirm your place in the class, please submit your enrollment response and deposit
				through your applicant portal by <strong>May 1, 2026</strong>. We also warmly invite you to
				experience our campus firsthand at Days on Campus, our program for admitted students; details
				and registration are available in your portal. If you applied for financial aid, your award
				package from Columbia Financial Aid and Educational Financing — which meets 100% of your
				demonstrated need — accompanies this letter.
			</p>

			<p>
				We recognize that you likely have many outstanding options, and we hope you will choose to
				call Morningside Heights home. The entire Columbia community looks forward to welcoming you.
			</p>

			<p>Congratulations once again on this well-deserved achievement.</p>
		</div>

		<div class="mt-12">
			<div class="mb-2">
				<img
					src="/signature-placeholder.png"
					alt="Signature"
					class="h-12"
					style="filter: invert(15%) sepia(60%) saturate(1200%) hue-rotate(180deg) brightness(45%) contrast(100%);"
				/>
			</div>
			<div class="font-bold">Jessica Marinaccio</div>
			<div class="text-sm text-gray-600">
				Dean of Undergraduate Admissions and Financial Aid<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Columbia's Mission:</strong><br />
					To advance knowledge and learning at the highest level and to convey the products of its efforts
					to the world, grounded in the shared intellectual experience of the Core Curriculum.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:ugrad-ask@columbia.edu" class="hover:underline">ugrad-ask@columbia.edu</a
					><br />
					Phone: 212-854-2522<br />
					Website:
					<a href={`https://undergrad.admissions.${footerDomain}`} class="hover:underline"
						>undergrad.admissions.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Columbia University.
		</div>
	</div>
</main>
