<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Stanford University';
	export let primaryColor: string = '#8C1515';
	export let footerDomain: string = 'stanford.edu';
	import { page } from '$app/stores';

	$: session = $page.data.session;

	let googleEmail = '';
	let googleName = '';

	$: {
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}

	$: firstName = (applicantName || 'Applicant').split(' ')[0];
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-[#2e2d29] font-serif p-6">
	<div class="max-w-3xl mx-auto mt-4">
		<DeepDiveButton slug="stanford" color={primaryColor} />

		<!-- Date + Download row -->
		<div class="flex justify-between items-center text-[11px] text-gray-600 mb-6">
			<span class="font-bold">March 14, 2027</span>
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
					<div>Stanford ID: 24831067</div>
				</div>

				<p>Dear {firstName},</p>

				<p class="font-bold">Congratulations! You have been admitted to the Stanford Class of 2031!</p>

				<p>
					Your passion, determination, accomplishments, and heart inspired the admission committee.
					With the good news this letter carries, we celebrate everything you have worked toward.
				</p>

				<p>
					Stanford is a wonderful match for you. Here you will join a campus community united by a
					shared determination to improve our world. Leland and Jane Stanford, after all, founded the
					University &ldquo;to promote the public welfare by exercising an influence on behalf of
					humanity and civilization.&rdquo; That influence takes root in an academic community devoted
					to understanding what is known while cultivating the imagination to explore what is not.
				</p>

				<p>
					There is so much more about Stanford we are eager to share with you. Mark your calendar now
					for Admit Weekend 2027, taking place on campus April 23&ndash;25. Stanford alumni are also
					organizing gatherings for admitted students in many locations. Details about these events
					will go to the same email address you use to log in to your Stanford portal. You can learn
					more by visiting our
					<a href="/disclaimer" class="text-[#827252] underline">Admitted Student Website</a>.
				</p>

				<p>
					When you are ready to make a decision about your enrollment, please complete the
					<a href="/disclaimer" class="text-[#827252] underline">Admission Response Form</a> at any time
					on or before May 1, 2027. The Additional Background Information Form, located in your portal,
					is also required. If you applied for financial aid by February 15, a reply from the Financial
					Aid Office is below this letter.
				</p>

				<p>
					To hold your place in the class, we expect you to uphold the quality of your character and
					to finish strong in the academic courses listed on your application. Should you plan any
					changes to these courses, you must first submit the Course Change Request Form in your
					portal; the Office of Undergraduate Admission must approve all changes in advance.
				</p>

				<p>
					Please share this wonderful news with all of the people whose love and support carried you to
					this moment. We are thrilled to be offering you admission. Welcome to the Stanford family.
				</p>

				<p>With my congratulations and very best wishes,</p>

				<div>
					<img
						src="/signature-placeholder.png"
						alt="Signature"
						class="h-10"
						style="filter: invert(12%) sepia(90%) saturate(2000%) hue-rotate(345deg) brightness(35%) contrast(95%);"
					/>
					<div class="mt-1">Daniel R. Prentiss</div>
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
