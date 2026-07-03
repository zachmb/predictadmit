<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Stanford University';
	export let primaryColor: string = '#8C1515';
	export let footerDomain: string = 'stanford.edu';
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
		goto('/results/stanford');
	};

	$: firstName = (applicantName || 'Applicant').split(' ')[0];
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-[#2e2d29] font-serif p-6">
	<div class="max-w-3xl mx-auto mt-4">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-4 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="group flex items-center px-4 py-2 text-white rounded-lg text-sm font-sans font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
					style="background-color: {primaryColor};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['stanford']}?
				</button>
			</div>
		{/if}

		<!-- Date + Download row -->
		<div class="flex justify-between items-center text-[11px] text-gray-600 mb-6">
			<span class="font-bold">March 14, 2026</span>
			<a href="/disclaimer" class="text-[#8C1515] underline hover:no-underline">Download PDF</a>
		</div>

		<!-- Letter card -->
		<div class="border border-black px-10 py-8 max-w-2xl mx-auto">
			<!-- Letterhead: seal + Stanford University -->
			<div class="flex items-start justify-between mb-6">
				<div class="flex items-center gap-3">
					<div
						class="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-serif font-bold"
						style="background-color: {primaryColor};"
					>
						SU
					</div>
					<span class="text-xl font-bold" style="color: {primaryColor};">Stanford University</span>
				</div>
			</div>

			<div class="text-[13px] leading-relaxed space-y-4">
				<div>
					<div>{applicantName || 'Applicant'}</div>
					<div>Stanford ID: 17552444</div>
				</div>

				<p>Dear {firstName},</p>

				<p class="font-bold">Congratulations! You have been admitted to the Stanford Class of 2030!</p>

				<p>
					The admission committee was inspired by your passion, determination, accomplishments, and
					heart. We celebrate all that you have worked for with the good news this letter brings.
				</p>

				<p>
					You are a fantastic match with Stanford. Here, you join a campus community with a shared
					determination to make our world better. Indeed, Leland and Jane Stanford founded the
					University &ldquo;to promote the public welfare by exercising an influence on behalf of
					humanity and civilization.&rdquo; That influence begins in an academic community committed
					to mastering the known and developing an intuitive capacity to imagine the unknown.
				</p>

				<p>
					We are excited to share more about Stanford with you. Mark your calendar now for Admit
					Weekend 2026, which will take place on campus April 23&ndash;25. In addition, Stanford
					alumni are organizing gatherings for admitted students in many locations. Information about
					these events will be sent to the same email address you use to log in to your Stanford
					portal. You can learn more by visiting our
					<a href="/disclaimer" class="text-[#827252] underline">Admitted Student Website</a>.
				</p>

				<p>
					When you are ready to make a decision about your enrollment, please complete the
					<a href="/disclaimer" class="text-[#827252] underline">Admission Response Form</a> at any time
					on or before May 1, 2026. The Additional Background Information Form, located in your portal,
					is also required. If you applied for financial aid by February 15, a reply from the Financial
					Aid Office is below this letter.
				</p>

				<p>
					In order to keep your place in the class, we expect you to maintain the quality of your
					character and to return a strong performance in the academic courses reported in your
					application. If you plan to make any changes to these courses, you must first submit the
					Course Change Request Form in your portal. Any changes must be approved in advance by the
					Office of Undergraduate Admission.
				</p>

				<p>
					Please share this wonderful news with everyone whose love and support helped you reach this
					moment. We are thrilled to offer you admission. Welcome to the Stanford family.
				</p>

				<p>With my congratulations and very best wishes,</p>

				<div>
					<img
						src="/signature-placeholder.png"
						alt="Signature"
						class="h-10"
						style="filter: invert(12%) sepia(90%) saturate(2000%) hue-rotate(345deg) brightness(35%) contrast(95%);"
					/>
					<div class="mt-1">Richard H. Shaw</div>
					<div>Dean of Admission and Financial Aid</div>
				</div>
			</div>

			<!-- Letter footer -->
			<div class="mt-8 pt-4 border-t border-gray-300 text-[10px] text-gray-600">
				<div class="font-bold">Office of Undergraduate Admissions</div>
				<div>
					Montag Hall &bull; 355 Galvez Street &bull; Stanford, CA 94305-6106 &bull; T 650.723.2091
					&bull; F 650.725.2846
				</div>
			</div>
		</div>

		<p class="text-center text-[13px] mt-6">
			<a href="/disclaimer" class="text-[#827252] underline hover:no-underline"
				>Return to Application Status</a
			>
		</p>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 font-sans">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from {schoolName}.
		</div>
	</div>
</main>
