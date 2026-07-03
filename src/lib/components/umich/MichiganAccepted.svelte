<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of Michigan';
	export let primaryColor: string = '#00274C'; // Michigan Blue
	export let footerDomain: string = 'umich.edu';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';

	const MAIZE = '#FFCB05';

	$: session = $page.data.session;

	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	import { decisionsBySlug } from '$lib/stores/results';
	const viewAnalysis = () => {
		goto('/results/umich');
	};

	$: firstName = (applicantName || 'Applicant').trim().split(' ')[0];
</script>

<Confetti primary={primaryColor} />

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
					Deep Dive: Why did I get {$decisionsBySlug['umich']}?
				</button>
			</div>
		{/if}

		<!-- Letterhead -->
		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 flex items-center justify-center font-black text-3xl mr-4"
					style="background-color: {primaryColor}; color: {MAIZE};"
				>
					M
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">UNIVERSITY OF MICHIGAN</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admissions<br />
						1220 Student Activities Building, 515 E. Jefferson St.<br />
						Ann Arbor, Michigan 48109-1316 • 734-764-7433
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-sm text-gray-600 mb-4 font-bold">March 28, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Congratulations, {firstName}!
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				I am pleased to inform you that you have been admitted to the University of Michigan College
				of Engineering class entering fall 2027.
			</p>

			<p>
				We are thrilled to welcome you into a vibrant, lifelong academic community of scholars and
				alumni who are making a difference everywhere in the world. Once you become a Wolverine, you
				will always be distinguished by this achievement.
			</p>

			<p>
				Your academic and personal successes are excellent preparation for the exciting challenges of
				university life. The University of Michigan offers you abundant opportunities to learn and
				share your intellect, creativity, discipline, and individual perspective. The value of a
				Michigan education comes from a distinguished faculty, world-class resources, inspiring peers,
				an endless variety of educational opportunities, and <strong>YOU</strong>.
			</p>

			<p>
				Respond to your admissions offer in Enrollment Connect no later than May 1, 2027 at 11:59
				p.m. Eastern Time. On behalf of the entire University of Michigan community, I applaud your
				impressive scholastic achievement and look forward to welcoming you, <strong>{firstName}</strong>,
				to the Michigan family of the Leaders and Best.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-1 text-lg">Sincerely,</div>
			<div class="font-bold italic text-xl" style="color: {primaryColor};">Erica L. Sanders</div>
			<div class="font-bold">Erica L. Sanders</div>
			<div class="text-sm text-gray-600">
				Assistant Vice Provost and Executive Director<br />
				Office of Undergraduate Admissions, {schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The Michigan Difference:</strong><br />
					To serve the people of Michigan and the world through preeminence in creating, communicating,
					preserving, and applying knowledge, art, and academic values.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href={`mailto:admissions@${footerDomain}`} class="hover:underline"
						>admissions@{footerDomain}</a
					><br />
					Phone: 734-764-7433<br />
					Website:
					<a href={`https://admissions.${footerDomain}`} class="hover:underline"
						>admissions.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of Michigan.
		</div>
	</div>
</main>
