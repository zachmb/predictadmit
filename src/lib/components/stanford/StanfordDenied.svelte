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
					It is with real regret that I write to tell you we cannot offer you admission to Stanford.
					Please know that this decision does nothing to diminish the thoughtfulness and care we know
					you poured into your application.
				</p>

				<p>
					The hopes and dreams reflected in your application inspired us, and the talent, commitment,
					and heart you devote to your academics, activities, work, and family responsibilities left
					us humbled. Put simply, we only wish the first-year class had room for more students like
					you.
				</p>

				<p>
					From the moment an application is first opened to the time it reaches the admission
					committee, every stage of our process receives the greatest possible care. In the end, these
					hard decisions are reached with clarity and conviction, and we do not offer an appeals
					process.
				</p>

				<p>
					You can visit our page of <a href="/disclaimer" class="text-[#827252] underline"
						>frequently asked questions</a
					> for answers about our admission process. I would also like to share a
					<a href="/disclaimer" class="text-[#827252] underline">letter</a> to students and families,
					in which I reflect on what an admission decision means within an educational journey that
					spans a lifetime.
				</p>

				<p>
					Thank you for applying to Stanford. It was a pleasure to learn about you, and we are certain
					you will flourish wherever your education leads.
				</p>

				<p>With very best wishes,</p>

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
