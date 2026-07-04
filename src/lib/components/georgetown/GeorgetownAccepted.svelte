<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Georgetown University';
	export let primaryColor: string = '#041E42'; // Georgetown blue
	export let footerDomain: string = 'georgetown.edu';
	import { page } from '$app/stores';

	$: session = $page.data.session;

	$: {
	}
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="georgetown" color={primaryColor} />

		<!-- Letterhead -->
		<div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-bold text-3xl mr-4 font-serif"
					style="background-color: {primaryColor};"
				>
					G
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">GEORGETOWN UNIVERSITY</h1>
					<div class="text-sm text-gray-600">
						Office of Undergraduate Admissions<br />
						37th and O Streets, N.W., Washington, D.C. 20057<br />
						Telephone (202) 687-3600
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 20, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>Regular Decision Applicant</div>
				<div>Class of 2031</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				On behalf of the Committee on Admissions, it is my great pleasure to offer you admission to
				Georgetown University and the Class of 2031. Congratulations. Your candidacy stood out within
				an exceptionally accomplished and competitive pool, and the Committee was deeply impressed by
				your academic achievement, intellectual curiosity, and the character you brought to every
				part of your application.
			</p>

			<p>
				Founded in 1789 as the nation's first Catholic and Jesuit university, Georgetown is animated
				by the ideal of <em>cura personalis</em> — care for the whole person — and by a commitment to
				educating women and men who will be thoughtful, principled leaders in service to others. We
				believe you will both thrive in and add to this community, and we are excited by all that you
				will contribute on the Hilltop.
			</p>

			<p>
				Enclosed with this letter, and available through your applicant portal, you will find
				information regarding your enrollment, your financial aid award, and the many opportunities to
				connect with current students, faculty, and fellow admitted members of the Class of 2031. We
				encourage you to visit campus this spring to experience Georgetown firsthand.
			</p>

			<p>
				To reserve your place in the entering class, please submit your enrollment response and
				deposit through your online portal by <strong>May 1, 2027</strong>. Should you have any
				questions as you make this important decision, our office and your admissions officer are
				here to help.
			</p>

			<p>
				Congratulations once again on this well-earned achievement. We very much hope you will choose
				to join us, and we look forward to welcoming you to the Hilltop in the fall.
			</p>
		</div>

		<div class="mt-12">
			<div class="mb-2">
				<img
					src="/signature-placeholder.png"
					alt="Signature"
					class="h-12"
					style="filter: invert(11%) sepia(35%) saturate(2000%) hue-rotate(200deg) brightness(45%) contrast(95%);"
				/>
			</div>
			<div class="font-bold">Charles A. Deacon</div>
			<div class="text-sm text-gray-600">
				Dean of Undergraduate Admissions<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The Georgetown Mission:</strong><br />
					As the nation's oldest Catholic and Jesuit university, Georgetown educates women and men to
					be reflective lifelong learners and responsible, active participants in civic life, in service
					to others.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href={`mailto:guadmiss@${footerDomain}`} class="hover:underline">guadmiss@{footerDomain}</a
					><br />
					Phone: (202) 687-3600<br />
					Website:
					<a href={`https://uadmissions.${footerDomain}`} class="hover:underline"
						>uadmissions.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Georgetown University.
		</div>
	</div>
</main>
