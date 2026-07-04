<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Northwestern University';
	export let primaryColor: string = '#4E2A84';
	export let footerDomain: string = 'northwestern.edu';




	const firstName = () => (applicantName || 'Applicant').split(' ')[0];

</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white font-sans text-gray-800">
	<!-- Purple wordmark bar -->
	<div style="background-color: {primaryColor};">
		<div class="mx-auto max-w-6xl px-6 py-3">
			<span class="font-serif text-lg text-white">Northwestern</span>
		</div>
	</div>

	<!-- White header -->
	<header class="border-b border-gray-200 bg-white">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
			<div class="text-2xl font-normal tracking-wide" style="color: {primaryColor};">
				UNDERGRADUATE ADMISSIONS
			</div>
			<div class="flex items-center gap-2 border-b border-gray-300 pb-1 text-gray-400">
				<span class="text-[12px]">Search this site</span>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<circle cx="11" cy="11" r="7" stroke-width="2" />
					<path d="M21 21l-4.3-4.3" stroke-width="2" stroke-linecap="round" />
				</svg>
			</div>
		</div>
		<div class="border-t border-gray-200">
			<nav
				class="mx-auto flex max-w-6xl flex-wrap items-center gap-8 px-6 py-4 text-[15px] font-semibold"
				style="color: {primaryColor};"
			>
				{#each ['Academics', 'Student Life', 'Student Success', 'Cost and Aid', 'Visit and Engage', 'Apply', 'FAQs'] as item}
					<a href="/disclaimer" class="hover:underline">{item}</a>
				{/each}
			</nav>
		</div>
	</header>

	<div class="mx-auto max-w-3xl px-6 py-10">
		<DeepDiveButton slug="northwestern" color={primaryColor} />

		<!-- Date + Download PDF -->
		<div class="flex items-center justify-between">
			<div class="text-[13px] text-gray-700">March 17, 2027</div>
			<a
				href="/disclaimer"
				class="text-[13px] font-semibold hover:underline"
				style="color: {primaryColor};">Download PDF</a
			>
		</div>

		<!-- Letterhead title -->
		<h1 class="mt-6 font-serif text-4xl font-normal" style="color: {primaryColor};">
			Northwestern University
		</h1>

		<div class="mt-8 text-[14px] text-gray-900">Dear {firstName()}:</div>

		<div class="mt-4 space-y-4 text-[14px] leading-relaxed text-gray-800">
			<p>
				The admission committee has completed its evaluation of this year's applicants to
				Northwestern. We are sorry that we cannot offer you a place in the first-year class.
			</p>
			<p>
				Because our applicant pool is so large and strong relative to the limited spaces in our
				incoming class, we cannot admit every qualified student who applies to Northwestern. Please
				do not take our decision as a negative reflection on you or your potential as a college
				student. We are simply unable to admit each candidate who presents a strong record of
				achievement.
			</p>
			<p>
				Our admission committee weighs each application carefully as we work to shape an incoming
				class. We are unable to offer explanations of individual admission decisions; however,
				<a href="/disclaimer" class="italic underline" style="color: {primaryColor};"
					>A Statement from the Vice President of Enrollment</a
				>, linked to this letter, may answer some of your questions about our admission process.
			</p>
			<p>
				The admission committee is grateful for the time and care you invested in your application
				to Northwestern. We wish you great success in your continued education.
			</p>
		</div>

		<div class="mt-8 text-[14px] text-gray-800">Sincerely,</div>

		<div class="mt-6 flex flex-wrap gap-16">
			<div>
				<div
					class="text-2xl italic text-gray-800"
					style="font-family: 'Segoe Script', 'Brush Script MT', cursive;"
				>
					Sandra Kirchner
				</div>
				<div class="mt-2 text-[13px] text-gray-900">Sandra Kirchner</div>
				<div class="text-[13px] text-gray-600">Vice President of Enrollment</div>
			</div>
			<div>
				<div
					class="text-2xl italic text-gray-800"
					style="font-family: 'Segoe Script', 'Brush Script MT', cursive;"
				>
					Eleanor Kessler
				</div>
				<div class="mt-2 text-[13px] text-gray-900">Eleanor Kessler</div>
				<div class="text-[13px] text-gray-600">Dean of Undergraduate Admission</div>
			</div>
		</div>

		<!-- Simulated-letter disclaimer -->
		<div class="mt-10 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Northwestern University.
		</div>

		<div class="mt-8 text-right">
			<a href="/disclaimer" class="text-[13px] font-semibold hover:underline" style="color: {primaryColor};"
				>Return to Application Status</a
			>
		</div>
	</div>

	<!-- Dark footer -->
	<footer class="bg-[#1c1319] text-gray-300">
		<div class="mx-auto max-w-6xl px-6 py-12">
			<div class="grid gap-10 md:grid-cols-3">
				<div>
					<div class="font-serif text-2xl text-white">Northwestern University</div>
					<div class="mt-2 text-[15px] font-semibold text-gray-200">
						Office of Undergraduate Admission
					</div>
					<div class="mt-6 space-y-2 text-[13px] text-gray-400">
						<div>1801 Hinman Avenue<br />Evanston, IL 60208</div>
						<div>(847) 491-7271</div>
						<a href="/disclaimer" class="underline">ug-admission@{footerDomain}</a>
					</div>
				</div>
				<div>
					<div class="text-[13px] font-bold tracking-wide text-white">Connect</div>
					<div class="mt-4 flex items-center gap-3">
						{#each ['YouTube', 'Instagram', 'TikTok', 'Facebook'] as social}
							<a
								href="/disclaimer"
								aria-label={social}
								class="flex h-9 w-9 items-center justify-center rounded-full"
								style="background-color: {primaryColor};"
							>
								<span class="text-[10px] font-bold text-white">{social[0]}</span>
							</a>
						{/each}
					</div>
					<a
						href="/disclaimer"
						class="mt-6 inline-flex items-center border border-gray-500 px-4 py-2 text-[12px] font-semibold uppercase tracking-wide text-white hover:bg-white/10"
					>
						Request Information &rarr;
					</a>
				</div>
				<div>
					<div class="text-[13px] font-bold tracking-wide text-white">Northwestern Resources</div>
					<div class="mt-4 space-y-2 text-[13px] text-gray-300">
						<a href="/disclaimer" class="block underline">Building Access</a>
						<a href="/disclaimer" class="block underline">Campus Emergency Information</a>
						<a href="/disclaimer" class="block underline">Careers</a>
						<a href="/disclaimer" class="block underline">Contact Northwestern University</a>
						<a href="/disclaimer" class="block underline">University Policies</a>
					</div>
				</div>
			</div>
		</div>
		<div style="background-color: {primaryColor};">
			<div class="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-3 text-[12px] text-gray-200">
				<span>&copy; 2027 Northwestern University</span>
				<a href="/disclaimer" class="font-semibold underline">Accessibility</a>
				<a href="/disclaimer" class="font-semibold underline">Disclaimer</a>
				<a href="/disclaimer" class="font-semibold underline">Privacy Statement</a>
				<a href="/disclaimer" class="font-semibold underline">Report a Concern</a>
			</div>
		</div>
	</footer>
</main>
