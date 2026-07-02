<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of Illinois Urbana-Champaign';
	export let primaryColor: string = '#13294B'; // Illinois Blue
	export let footerDomain: string = 'illinois.edu';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';

	const ILLINI_ORANGE = '#E84A27';

	$: session = $page.data.session;

	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	const viewAnalysis = () => {
		goto('/results/uiuc');
	};
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="group flex items-center px-4 py-2 text-white rounded-lg text-sm font-sans font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
					style="background-color: {primaryColor};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['uiuc']}?
				</button>
			</div>
		{/if}

		<!-- Letterhead -->
		<div class="border-b-2 pb-4 mb-10 flex items-start justify-between" style="border-color: {primaryColor};">
			<div class="flex items-center gap-4">
				<div
					class="w-12 h-16 flex items-center justify-center font-serif font-black text-white text-3xl leading-none border-2"
					style="background-color: {ILLINI_ORANGE}; border-color: {primaryColor};"
				>
					I
				</div>
				<div class="leading-tight" style="color: {primaryColor};">
					<div class="text-xs font-sans tracking-[0.2em] font-semibold">UNIVERSITY OF</div>
					<div class="text-2xl font-sans font-black tracking-tight">ILLINOIS</div>
					<div class="text-[10px] font-sans tracking-[0.3em] font-semibold">URBANA-CHAMPAIGN</div>
				</div>
			</div>
			<div class="text-right" style="color: {primaryColor};">
				<div class="text-sm font-sans font-bold tracking-wide">OFFICE OF UNDERGRADUATE ADMISSIONS</div>
				<div class="text-xs text-gray-600 font-sans mt-1">
					Admissions and Records Building<br />
					901 West Illinois Street, Suite 103<br />
					Urbana, IL 61801-3445 USA
				</div>
			</div>
		</div>

		<!-- Recipient + date -->
		<div class="mb-8 flex justify-between items-start">
			<div class="space-y-1 text-[15px]">
				<div>{applicantName || 'Applicant'}</div>
			</div>
			<div class="text-sm text-gray-700">February 2, 2026</div>
		</div>

		<!-- Salutation -->
		<div class="mb-6 text-[15px]">
			Dear {applicantName ? applicantName.split(' ')[0] : 'Applicant'},
		</div>

		<!-- Body -->
		<div class="space-y-4 mb-8 text-[15px] leading-relaxed">
			<p>
				Congratulations! This letter serves to formally offer you admission to the University of
				Illinois Urbana-Champaign. We officially welcome you into your intended program of study in
				The Grainger College of Engineering for the Fall 2026 semester.
			</p>

			<p>
				We're very impressed by you and all of your accomplishments. You're full of talent and even
				more potential, and we think you'd be a wonderful fit at Illinois. I hope you choose to join
				us.
			</p>

			<p>
				Our university upholds a tradition of excellence, with a long reputation as a world-class
				leader of innovation and impact. Here you'll discover a global community rooted in a spirit
				of equity and openness, along with meaningful resources to support you. Your most creative
				ideas will be encouraged and your most ambitious goals realized. Through the power of an
				Illinois degree, you'll move forward prepared to create positive, long-lasting change.
			</p>

			<p>
				Important details about your offer are located on the other side of this letter. Before
				beginning your Illinois experience, you need to complete your Admitted Student Checklist,
				found in myIllini at myillini.illinois.edu. Make sure to review everything carefully, as this
				will help you make a smooth transition. If you have any questions, don't hesitate to reach
				out to us at admissions@illinois.edu or 217-333-0302.
			</p>

			<p class="font-semibold">Welcome to the Illinois family!</p>
		</div>

		<!-- Signature -->
		<div class="mt-12">
			<div class="mb-1 text-[15px]">Sincerely,</div>
			<div class="mb-2">
				<img
					src="/signature-placeholder.png"
					alt="Signature"
					class="h-12"
					style="filter: invert(12%) sepia(38%) saturate(1800%) hue-rotate(190deg) brightness(40%) contrast(95%);"
				/>
			</div>
			<div class="font-bold" style="color: {primaryColor};">Sara MacKenzie</div>
			<div class="text-sm text-gray-600">Executive Director of Undergraduate Admissions</div>
		</div>

		<!-- Footer -->
		<div class="mt-16 pt-6 border-t-2 text-center" style="border-color: {primaryColor};">
			<div class="text-sm font-sans font-bold tracking-wide" style="color: {primaryColor};">
				UNIVERSITY OF ILLINOIS AT URBANA-CHAMPAIGN
			</div>
			<div class="text-xs text-gray-600 font-sans mt-1">
				217-333-0302 &middot;
				<a href="mailto:admissions@{footerDomain}" class="hover:underline">admissions@{footerDomain}</a>
				&middot;
				<a href={`https://admissions.${footerDomain}`} class="hover:underline"
					>admissions.{footerDomain}</a
				>
			</div>
		</div>

		<!-- Simulation disclaimer -->
		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 font-sans">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of Illinois Urbana-Champaign.
		</div>
	</div>
</main>
