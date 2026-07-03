<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Rice University';
	export let primaryColor: string = '#00205B';
	export let footerDomain: string = 'rice.edu';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';

	$: session = $page.data.session;

	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	$: firstName = (applicantName || 'Applicant').split(' ')[0];

	const viewAnalysis = () => {
		goto('/results/rice');
	};

	const shieldSvg = `
		<svg viewBox="0 0 120 148" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path d="M6 6 H114 V86 C114 118 88 136 60 146 C32 136 6 118 6 86 Z" fill="#1b2f66"/>
			<path d="M22 84 L60 56 L98 84 L98 100 L60 72 L22 100 Z" fill="#ffffff"/>
			<g fill="#ffffff">
				<ellipse cx="30" cy="34" rx="9" ry="11"/>
				<ellipse cx="90" cy="34" rx="9" ry="11"/>
				<ellipse cx="60" cy="118" rx="9" ry="11"/>
			</g>
			<g fill="#1b2f66">
				<circle cx="26" cy="32" r="2.2"/><circle cx="34" cy="32" r="2.2"/>
				<circle cx="86" cy="32" r="2.2"/><circle cx="94" cy="32" r="2.2"/>
				<circle cx="56" cy="116" r="2.2"/><circle cx="64" cy="116" r="2.2"/>
			</g>
		</svg>`;
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-[#f4f4f4] font-serif text-gray-800">
	<div class="mx-auto max-w-3xl px-6 py-10">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="flex items-center gap-2 rounded-lg px-4 py-2 font-sans text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
					style="background-color: {primaryColor};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['rice']}?
				</button>
			</div>
		{/if}

		<!-- Date + navy rule -->
		<div class="mb-0 text-[13px] font-semibold text-gray-700">March 25, 2027</div>
		<div class="mt-2 mb-6 border-t-2" style="border-color: {primaryColor};"></div>

		<!-- Letter card -->
		<div class="bg-white px-10 py-10 shadow-sm">
			<!-- Letterhead -->
			<div class="mb-10 flex items-start justify-between">
				<div class="flex items-center gap-3">
					<span class="h-12 w-10">{@html shieldSvg}</span>
					<span class="text-3xl font-normal tracking-tight" style="color: {primaryColor};">RICE</span>
				</div>
				<div class="pt-1 text-[11px] font-bold tracking-wide text-gray-700">Office of Enrollment</div>
			</div>

			<div class="mb-6 text-[13px] text-gray-700">March 25, 2027</div>

			<div class="mb-6 text-[14px] leading-relaxed text-gray-900">
				{applicantName || 'Applicant'}<br />
				1924 Smith Rd<br />
				Northbrook, IL 60062-5830
			</div>

			<div class="mb-6 text-[15px] text-gray-900">Dear {firstName},</div>

			<div class="space-y-4 text-[14px] leading-relaxed text-gray-800">
				<p>
					Congratulations! It is my great pleasure to offer you admission to Rice University and to
					welcome you to the Class of 2031. On behalf of the entire admission committee, I want you to
					know how genuinely impressed we were by your accomplishments, your character, and the
					distinct perspective you will bring to our residential colleges.
				</p>
				<p>
					This year, Rice received over 38,000 applications from extraordinary students around the
					world, and our decisions were extremely difficult. Your application stood out for its
					curiosity, dedication, and resilience, along with a clear interest in driving positive
					change. We are confident that you will not only thrive at Rice, but that you will make our
					community stronger because you are part of it.
				</p>
				<p>
					In the coming days you will receive information about your financial aid award, your
					residential college assignment, and Owl Days, our celebration for admitted students. Please
					take the time to review the enrollment materials in your applicant portal, and know that our
					office is here to answer any questions as you make this important decision. We hope you will
					choose to say yes to Rice.
				</p>
				<p>
					Once again, congratulations on this well-earned achievement. We cannot wait to see all that
					you will accomplish here, and we look forward to welcoming you to Houston.
				</p>
			</div>

			<div class="mt-8 text-[14px] text-gray-800">Sincerely,</div>
			<div class="mt-3">
				<div
					class="text-3xl italic text-gray-800"
					style="font-family: 'Segoe Script', 'Brush Script MT', cursive;"
				>
					Yvonne Romero
				</div>
				<div class="mt-2 text-[14px] font-semibold text-gray-900">Dr. Yvonne M. Romero</div>
				<div class="text-[13px] text-gray-600">Vice President for Enrollment</div>
				<div class="text-[13px] text-gray-600">Dean of Admission and Financial Aid</div>
			</div>

			<!-- Contact letterhead footer -->
			<div class="mt-12 border-t border-gray-200 pt-4 text-center text-[10px] text-gray-500">
				Rice University Office of Enrollment &middot; 6100 Main St. &middot; Houston, TX 77005-1892
				&middot; www.{footerDomain}
			</div>

			<!-- Simulated-letter disclaimer -->
			<div class="mt-8 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
				<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only.
				This is not a real admission decision from Rice University.
			</div>
		</div>

		<div class="mt-8 text-center">
			<a href="/disclaimer" class="text-[13px] underline" style="color: {primaryColor};"
				>Return to Application Status</a
			>
		</div>
	</div>
</main>
