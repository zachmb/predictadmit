<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Princeton University';
	export let primaryColor: string = '#FF8F00'; // Princeton orange
	export let footerDomain: string = 'princeton.edu';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';

	$: session = $page.data.session;

	let googleSignedIn = false;
	let googleEmail = '';
	let googleName = '';

	$: {
		googleSignedIn = !!session?.user;
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}

	$: firstName = applicantName ? applicantName.split(' ')[0] : '';

	const viewAnalysis = () => {
		goto('/results/princeton');
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
					class="group flex items-center px-4 py-2 bg-black text-white rounded-lg text-sm font-sans font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
					</svg>
					Deep Dive: Why did I get {$decisionsBySlug['princeton']}?
				</button>
			</div>
		{/if}

		<!-- Letterhead -->
		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 flex items-center justify-center font-serif font-bold text-2xl mr-4 text-black"
					style="background-color: {primaryColor};"
				>
					P
				</div>
				<div>
					<h1 class="text-2xl font-bold text-black">PRINCETON UNIVERSITY</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admission<br />
						P.O. Box 430, Princeton, New Jersey 08542<br />
						Telephone 609-258-3060
					</div>
				</div>
			</div>
		</div>

		<!-- Date -->
		<div class="mb-8">
			<div class="text-sm text-gray-700 mb-6">March 12, 2027</div>
		</div>

		<!-- Salutation -->
		<div class="mb-6">
			<div class="text-lg">Dear {firstName || applicantName || 'Applicant'},</div>
		</div>

		<!-- Letter Body (from the real Princeton denial letter) -->
		<div class="space-y-4 mb-8 leading-relaxed">
			<p>
				I am sorry to inform you that we are unable to admit you to Princeton University this year.
			</p>

			<p>
				Our large and talented applicant pool contained many students who were in the admissible
				range. Over the past several weeks, our admission officers reviewed files diligently,
				thoughtfully and carefully. As we do each year, we made every effort to weigh each student's
				achievements, talents and skills within the context of their secondary school setting. We
				also took into consideration the vast differences among the various learning environments
				represented in the pool.
			</p>

			<p>
				The admission committee appreciated the time, care and effort you put into the materials you
				submitted. Ultimately, the strength and size of this year's pool dictated our choices and
				even candidates who had exceptional credentials could not be guaranteed a spot in the class.
			</p>

			<p>
				I recognize that this is not the decision you wanted to receive. While all our decisions are
				final and we do not consider appeals, nor can we offer individual feedback, please know that
				the committee's conclusion does not at all reflect your ability to succeed in a rigorous
				college environment.
			</p>

			<p>
				Thank you for your interest in Princeton and for giving us the opportunity to consider your
				application.
			</p>
		</div>

		<!-- Signature -->
		<div class="mt-12">
			<p class="mb-4">Best wishes,</p>
			<div class="mb-2">
				<div class="h-1 w-32" style="background-color: {primaryColor};"></div>
			</div>
			<div class="font-bold">Karen Richardson ’93</div>
			<div class="text-sm text-gray-600">
				Dean of Admission and Financial Aid<br />
				{schoolName}
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<p class="italic mb-4">
				"In the Nation's Service and the Service of Humanity" — Princeton University
			</p>
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Princeton University Mission:</strong><br />
					Princeton University advances learning through scholarship, research, and teaching of unsurpassed
					quality, with an emphasis on undergraduate and doctoral education that is distinctive among the
					world's great universities.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:uaoffice@princeton.edu" class="hover:underline">uaoffice@princeton.edu</a
					><br />
					Phone: 609-258-3060<br />
					Website:
					<a href={`https://admission.${footerDomain}`} class="hover:underline"
						>admission.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<!-- Simulation Note -->
		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Princeton University.
		</div>
	</div>
</main>
