<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of Wisconsin-Madison';
	export let primaryColor: string = '#C5050C'; // Badger red
	export let footerDomain: string = 'wisc.edu';




</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="wisconsin" color={primaryColor} />

		<div class="border-b-4 pb-4 mb-8" style="border-color: {primaryColor};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-bold text-xl mr-4 rounded"
					style="background-color: {primaryColor};"
				>
					W
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">
						UNIVERSITY OF WISCONSIN-MADISON
					</h1>
					<div class="text-sm text-gray-600">
						Office of Admissions and Recruitment<br />
						702 W. Johnson Street, Suite 1101, Madison, Wisconsin 53715<br />
						Telephone 608-262-3961 &bull; onwisconsin@admissions.wisc.edu
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 15, 2027</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>Application Number 03158246</div>
				<div>Fall 2027-2027 &bull; Mechanical Engineering BS</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				Congratulations! I am pleased to offer you admission to the University of Wisconsin-Madison
				for the Fall 2027 term. On behalf of our university community, welcome to the Badger family.
				This is a meaningful accomplishment, and you should feel proud of all that brought you here.
			</p>

			<p>
				Admission to UW-Madison is highly selective, and your accomplishments stood out within an
				exceptionally strong applicant pool. The Admissions Committee admired your academic record,
				your curiosity, and the ways you have contributed to your school and community. We believe
				you will thrive here and bring something meaningful to our campus.
			</p>

			<p>
				You have been admitted to the College of Engineering with an intended major in Mechanical
				Engineering. At UW-Madison, you will join a community long committed to searching for truth,
				with world-class faculty, hands-on research, and the Wisconsin Idea, the belief that the
				university's reach extends across the state and beyond.
			</p>

			<p>
				To claim your place in the class, please log in to your Applicant Portal and submit your
				enrollment confirmation by <strong>May 1, 2027</strong>. The portal will also guide you
				through housing, Student Orientation, Advising, and Registration, and the next steps for
				connecting with your college. If you applied for financial aid, your award notification will
				be posted there shortly.
			</p>

			<p>
				We look forward to welcoming you to Bascom Hill this fall. Once a Badger, always a Badger.
				On, Wisconsin!
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
			<div class="font-bold">André Phillips</div>
			<div class="text-sm text-gray-600">
				Director, Office of Admissions and Recruitment<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The Wisconsin Idea:</strong><br />
					That the boundaries of the university are the boundaries of the state, and that education should
					influence and improve people's lives beyond the classroom.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:onwisconsin@admissions.wisc.edu" class="hover:underline"
						>onwisconsin@admissions.wisc.edu</a
					><br />
					Phone: 608-262-3961<br />
					Website:
					<a href={`https://admissions.${footerDomain}`} class="hover:underline"
						>admissions.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of Wisconsin-Madison.
		</div>
	</div>
</main>
