<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of North Carolina at Chapel Hill';
	export let primaryColor: string = '#4B9CD3'; // Carolina Blue
	export let footerDomain: string = 'unc.edu';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';

	const CAROLINA_NAVY = '#13294B';

	$: session = $page.data.session;
	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	$: firstName = (applicantName || 'Applicant').trim().split(' ')[0];

	const viewAnalysis = () => {
		goto('/results/unc');
	};
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white font-sans text-gray-800">
	<!-- Header -->
	<header style="background-color: {CAROLINA_NAVY};" class="w-full">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-2.5">
			<div class="flex items-center gap-3">
				<span class="font-serif text-3xl font-black leading-none tracking-tighter" style="color: {primaryColor};">
					NC
				</span>
				<div class="border-l border-white/30 pl-3 font-serif text-[10px] leading-tight text-white">
					The University<br />of North Carolina<br />at Chapel Hill
				</div>
			</div>
		</div>
	</header>

	<!-- Hero: the Old Well -->
	<div class="mx-auto max-w-6xl px-6 pt-6">
		<div
			class="relative flex h-24 w-full items-end justify-center overflow-hidden rounded-sm"
			style="background: linear-gradient(180deg,#3f6b2f 0%,#4e7c33 45%,#6f8a3f 70%,#b7a06a 100%);"
		>
			<div class="pointer-events-none absolute bottom-1 left-0 right-0 flex justify-between px-4 opacity-80">
				{#each Array(28) as _, i}
					<span class="h-1.5 w-1.5 rounded-full" style="background:{i % 3 === 0 ? '#c0392b' : '#d65a4e'}"></span>
				{/each}
			</div>
			<svg viewBox="0 0 200 130" class="relative h-[88px] w-[120px]" aria-hidden="true">
				<circle cx="100" cy="20" r="2.5" fill="#eef2f3" />
				<path d="M62 60 Q100 12 138 60 Z" fill="#eef2f3" />
				<ellipse cx="100" cy="60" rx="40" ry="5" fill="#dbe3e5" />
				<rect x="58" y="60" width="84" height="7" fill="#f3f6f7" />
				{#each [64, 78, 92, 106, 120] as x}
					<rect {x} y="67" width="6" height="42" fill="#f6f9fa" />
				{/each}
				<rect x="54" y="109" width="92" height="7" fill="#e4eaec" />
				<rect x="49" y="116" width="102" height="6" fill="#d3dcde" />
			</svg>
		</div>
	</div>

	<div class="mx-auto max-w-6xl px-6 pb-16 pt-4">
		<div class="mb-2 text-right text-[13px] text-gray-700">
			{applicantName || 'Applicant'}
			<a href="/disclaimer" class="ml-2 hover:underline" style="color:{primaryColor};">Logout</a>
		</div>

		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-4 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="rounded-lg px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
					style="background-color:{CAROLINA_NAVY};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['unc']}?
				</button>
			</div>
		{/if}

		<div class="mb-6 text-right">
			<a href="/disclaimer" class="text-[13px] hover:underline" style="color:{primaryColor};">Download PDF</a>
		</div>

		<!-- Letter body -->
		<div class="mx-auto max-w-4xl text-[13px] leading-relaxed text-gray-800">
			<p class="mb-5 font-semibold">March 20, 2027</p>

			<p class="mb-4">Dear {firstName},</p>

			<p class="mb-4">
				Our admissions committee has completed our thorough review of applications and has determined
				that we will not be able to offer you admission to the University of North Carolina at Chapel
				Hill. We appreciate the time, energy, and heart you put into applying to Carolina, and we're
				grateful that you gave us the opportunity to get to know you.
			</p>

			<p class="mb-4">
				Although it may be too early to begin thinking of next steps, I hope you will remember that
				there are many paths to Carolina. Many candidates reapply as transfer students and enroll
				after one or two years elsewhere. Others enroll in our graduate and professional schools after
				earning their undergraduate degrees. Should you remain interested in Carolina, we hope you
				will stay in touch. We would welcome the chance to help.
			</p>

			<p class="mb-6">
				Thank you for your interest in the University and we wish you well in all of your future
				endeavors.
			</p>

			<p class="mb-3">Sincerely,</p>

			<p class="mb-1 text-2xl leading-none text-gray-900" style="font-family: 'Segoe Script','Bradley Hand',cursive;">
				Jared Rosenberg
			</p>
			<p class="font-semibold">Jared Rosenberg</p>
			<p class="text-gray-600">Associate Provost and Director of Undergraduate Admissions</p>
		</div>

		<div class="mt-12 text-center">
			<a href="/disclaimer" class="text-[13px] hover:underline" style="color:{primaryColor};">
				Return to Application Status
			</a>
		</div>

		<div class="mx-auto mt-10 max-w-4xl rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of North Carolina at Chapel Hill.
		</div>
	</div>

	<footer class="bg-[#f2f2f2] py-6 text-center text-[11px] text-gray-500">
		2027 The University of North Carolina at Chapel Hill
	</footer>
</main>
