<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Johns Hopkins University';
	export let primaryColor: string = '#002D72'; // JHU Blue
	export let footerDomain: string = 'jhu.edu';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';

	$: session = $page.data.session;

	let googleSignedIn = false;

	$: googleSignedIn = !!session?.user;

	import { decisionsBySlug } from '$lib/stores/results';
	const viewAnalysis = () => {
		goto('/results/jhu');
	};
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif">
	<!-- Brand header bar -->
	<header class="border-b border-gray-200 bg-white">
		<div class="max-w-3xl mx-auto px-6 py-4 flex items-center font-sans">
			<div class="flex items-center gap-3 pr-6">
				<div
					class="w-9 h-11 flex items-center justify-center text-white text-[10px] font-serif font-bold"
					style="background-color: {primaryColor}; clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);"
				>
					JHU
				</div>
				<div class="leading-tight">
					<div class="font-serif text-xl font-bold" style="color: {primaryColor};">
						Johns Hopkins
					</div>
					<div class="text-[10px] tracking-[0.35em] text-gray-600 uppercase">University</div>
				</div>
			</div>
			<div class="border-l border-gray-300 pl-6 hidden sm:block">
				<div class="text-[11px] font-bold tracking-wider text-[#0074d9] uppercase leading-tight">
					Undergraduate<br />Admissions
				</div>
			</div>
		</div>
	</header>

	<div class="max-w-3xl mx-auto px-6 pt-10 pb-16">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end font-sans">
				<button
					on:click={viewAnalysis}
					class="group flex items-center px-4 py-2 text-white rounded-lg text-sm font-bold transition-all shadow-md active:scale-95"
					style="background-color: {primaryColor};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['jhu']}?
				</button>
			</div>
		{/if}

		<div class="text-sm text-gray-600 mb-8 font-sans font-bold">March 18, 2027</div>

		<!-- Welcome banner -->
		<div class="mb-10 text-center font-sans">
			<div class="text-sm tracking-[0.25em] uppercase text-gray-500 mb-1">
				Welcome to the Class of 2031
			</div>
			<div class="text-4xl font-extrabold tracking-wide" style="color: {primaryColor};">
				YOU'RE ADMITTED!
			</div>
			<div class="mt-4 h-1 w-24 mx-auto" style="background-color: {primaryColor};"></div>
		</div>

		<div class="mb-6">
			<div class="text-lg" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8 leading-relaxed">
			<p>
				<strong>Congratulations!</strong> You have been admitted to Johns Hopkins University—a place
				where firsts lead you forward.
			</p>

			<p>
				We're excited to welcome you to our community of scholars at this historic moment, as we
				celebrate our 150th anniversary. Over the next four years, you'll have the opportunity to
				engage with new perspectives, contribute to some of the most important conversations of our
				time, and thrive within a community fueled by the next great pursuit of knowledge.
			</p>

			<p class="italic pl-4 border-l-2" style="border-color: {primaryColor};">
				"Our simple aim is to make scholars, strong, bright, useful, and true."
			</p>

			<p>
				The words of Daniel Coit Gilman, the first president of the university, continue to define
				the Hopkins community as one that works together to make real and meaningful impact on causes
				that matter.
			</p>

			<p>
				Your time at Hopkins will be shaped by all of the first steps you take, the connections you
				pursue, and the relationships you build. As a Blue Jay, you will explore what you care about
				most, meet your next best friends, and be part of a community that's so glad you're here.
			</p>

			<p>
				At Hopkins you'll have the flexibility and resources to turn your biggest questions into
				answers, and the network of the leading research university to support you at each step of
				your journey.
			</p>

			<p>
				When you're ready to enroll, submit your Reply Form to secure your spot in the class. You'll
				also receive an official admit packet in the mail in the near future.
			</p>

			<p>
				Congratulations once again—and welcome to Hopkins! We know this is just the beginning, and we
				look forward to the questions you will ask, the discoveries you will make, and the lasting
				impact you will have on our community and the world around you.
			</p>
		</div>

		<div class="mt-10">
			<div class="mb-1">Sincerely,</div>
			<div class="font-bold tracking-wide uppercase" style="color: {primaryColor};">
				Calvin Wise III
			</div>
			<div class="text-sm text-gray-600">
				Dean of Undergraduate Admissions<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-10 flex flex-wrap gap-3 font-sans">
			<a
				href="/disclaimer"
				class="px-5 py-2 text-white text-sm font-bold tracking-wider uppercase"
				style="background-color: {primaryColor};"
			>
				Next Steps
			</a>
			<a
				href="/disclaimer"
				class="px-5 py-2 border text-sm font-bold tracking-wider uppercase"
				style="border-color: {primaryColor}; color: {primaryColor};"
			>
				View Your Financial Aid Status
			</a>
		</div>

		<div class="mt-12 pt-8 border-t border-gray-200 text-xs text-gray-500 font-sans">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Mail Only Correspondence:</strong><br />
					Office of Undergraduate Admissions<br />
					Johns Hopkins University<br />
					3400 N. Charles St., Mason Hall<br />
					Baltimore, MD 21218-2683 USA
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="/disclaimer" class="hover:underline">gotojhu@jhu.edu</a><br />
					Website:
					<a href={`https://apply.${footerDomain}`} class="hover:underline">apply.{footerDomain}</a>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 font-sans">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Johns Hopkins University.
		</div>
	</div>
</main>
