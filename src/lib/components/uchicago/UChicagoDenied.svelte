<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'The University of Chicago';
	export let primaryColor: string = '#800000'; // UChicago maroon
	export let footerDomain: string = 'uchicago.edu';
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
		goto('/results/uchicago');
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
					Deep Dive: Why did I get {$decisionsBySlug['uchicago']}?
				</button>
			</div>
		{/if}

		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-bold text-3xl mr-4 font-serif"
					style="background-color: {primaryColor};"
				>
					UC
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">THE UNIVERSITY OF CHICAGO</h1>
					<div class="text-sm text-gray-600">
						Office of College Admissions<br />
						1101 East 58th Street, Rosenwald Hall 105, Chicago, Illinois 60637<br />
						Telephone 773.702.8650 &bull; collegeadmissions@uchicago.edu
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 16, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>2847 Birchwood Ln</div>
				<div>Naperville, IL 60540</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				Thank you for applying to the College of the University of Chicago and for sharing your
				ideas and aspirations with our Committee on Admissions. I know how much thought and effort
				you devoted to your application, and I want you to know that it received a careful, complete,
				and genuinely appreciative reading.
			</p>

			<p>
				This year we received a truly extraordinary number of applications from remarkable students
				around the world &mdash; far more than we could possibly admit to a single entering class.
				After the most rigorous and difficult deliberations, I am sorry to tell you that we are
				unable to offer you a place in the Class of 2031.
			</p>

			<p>
				Please understand that a decision like this is never a judgment of your ability, your
				character, or your promise. With so many outstanding candidates and so few seats, we were
				forced to make painful choices among applicants we admire deeply. The strength of your
				application speaks for itself, and it in no way diminishes what you have accomplished or
				what lies ahead of you.
			</p>

			<p>
				The qualities that drew our attention &mdash; your curiosity, your seriousness of purpose,
				and your love of learning &mdash; will serve you extraordinarily well wherever you enroll.
				We have every confidence that you will thrive and that you will find a community eager to
				welcome all that you have to offer.
			</p>

			<p>
				Thank you again for considering the University of Chicago. We wish you every success and
				much happiness in the years to come.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2">
				<img
					src="/signature-placeholder.png"
					alt="Signature"
					class="h-12"
					style="filter: invert(15%) sepia(85%) saturate(1500%) hue-rotate(330deg) brightness(30%) contrast(100%);"
				/>
			</div>
			<div class="font-bold">James G. Nondorf</div>
			<div class="text-sm text-gray-600">
				Vice President and Dean of Admissions and Financial Aid<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Crescat scientia; vita excolatur.</strong><br />
					&ldquo;Let knowledge grow from more to more; and so be human life enriched.&rdquo; The
					motto of the University of Chicago.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:collegeadmissions@uchicago.edu" class="hover:underline"
						>collegeadmissions@uchicago.edu</a
					><br />
					Phone: 773.702.8650<br />
					Website:
					<a href={`https://collegeadmissions.${footerDomain}`} class="hover:underline"
						>collegeadmissions.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from The University of Chicago.
		</div>
	</div>
</main>
