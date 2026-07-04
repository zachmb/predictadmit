<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Stanford University';
	export let primaryColor: string = '#8C1515';
	export let footerDomain: string = 'stanford.edu';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';

	$: session = $page.data.session;

	let googleEmail = '';
	let googleName = '';

	$: {
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}

	$: firstName = (applicantName || 'Applicant').split(' ')[0];
</script>

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
		<div class="border border-gray-400 px-10 py-8 max-w-2xl mx-auto">
			<!-- Letterhead: seal + Stanford University -->
			<div class="flex items-center gap-3 mb-6">
				<div
					class="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-serif font-bold"
					style="background-color: {primaryColor};"
				>
					SU
				</div>
				<span class="text-xl font-bold" style="color: {primaryColor};">Stanford University</span>
			</div>

			<div class="text-[13px] leading-relaxed space-y-4">
				<div>
					<div>{applicantName || 'Applicant'}</div>
					<div>{$userProfile.email || 'applicant@example.com'}</div>
				</div>

				<p>Dear {firstName},</p>

				<p>
					I am very sorry to let you know that we are unable to offer you admission to Stanford. This
					decision in no way takes away from the thoughtfulness and care that we know went into your
					application.
				</p>

				<p>
					We were inspired by the hopes and dreams your application represents. We were humbled by the
					talent, commitment, and heart you bring to your academics, extracurricular activities, work,
					and family responsibilities. Simply put, we wish that we had more space in the first-year
					class.
				</p>

				<p>
					At every step in our process, from the moment we open an application to its eventual
					presentation in the admission committee, we bring the highest level of consideration to our
					decisions. Ultimately, these difficult decisions are made with conviction and clarity, and
					we do not conduct an appeals process.
				</p>

				<p>
					You can visit our page of <a href="/disclaimer" class="text-[#827252] underline"
						>frequently asked questions</a
					> for answers about our admission process. I also want to share a
					<a href="/disclaimer" class="text-[#827252] underline">letter</a> to students and families.
					In it, I reflect on admission decisions in the context of educational journeys that
					encompass a lifetime.
				</p>

				<p>
					Thank you for applying to Stanford. We enjoyed learning about you, and we know that you will
					thrive wherever your education takes you.
				</p>

				<p>With very best wishes,</p>

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
