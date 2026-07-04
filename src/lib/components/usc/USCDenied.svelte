<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of Southern California';
	export let primaryColor: string = '#990000'; // USC Cardinal
	export let footerDomain: string = 'usc.edu';
	import { page } from '$app/stores';

	$: session = $page.data.session;

	let googleEmail = '';
	let googleName = '';

	$: {
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}

	const accentGold = '#FFCC00';
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
	<div class="max-w-3xl mx-auto mt-10">
		<DeepDiveButton slug="usc" color={primaryColor} />

		<div class="border-b-4 pb-4 mb-8" style="border-color: {accentGold};">
			<div class="flex items-center">
				<div
					class="w-16 h-16 text-white flex items-center justify-center font-extrabold text-2xl mr-4"
					style="background-color: {primaryColor};"
				>
					USC
				</div>
				<div>
					<h1 class="text-2xl font-bold" style="color: {primaryColor};">
						UNIVERSITY OF SOUTHERN CALIFORNIA
					</h1>
					<div class="text-sm text-gray-600">
						Office of Admission<br />
						University Park Campus, Los Angeles, California 90089-0911<br />
						Telephone 213-740-1111
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8">
			<div class="text-right text-sm text-gray-600 mb-2">March 27, 2027</div>
			<div class="text-right text-sm text-gray-600 mb-4">Reference ID: 205719348</div>
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
				Our application review period has now come to a close, and I am sorry to tell you that we
				cannot offer you a place in this year&rsquo;s incoming class.
			</p>

			<p>
				Please know that this decision reflects, above all, the limits of available space; it is not
				a judgment of you as a person, nor any statement about your ability to succeed in college.
				Take pride in what you have accomplished and continue your pursuit of higher education.
			</p>

			<p>
				Admission to USC this year was as competitive as it has ever been. Thousands of exceptional
				candidates could not be accommodated, among them many with superb academic records,
				remarkable talent, strong character, enriching experiences and distinctive perspectives. I
				hope it offers some comfort to know that none of us takes any pleasure in turning away
				outstanding students.
			</p>

			<p>
				Numbers never tell the whole story, but the context may be helpful: we received roughly
				79,000 applications for admission, and with an anticipated enrollment of 3,650 students, we
				could offer fall admission to only about one in nine candidates. Most of those admitted
				earned nearly straight-A averages in a demanding schedule of classes. Every candidate brings
				genuine strengths.
			</p>

			<p>
				We also looked beyond the academic record to the many other factors presented in your
				application materials. Our review is a qualitative process, one in which opinions are
				weighed alongside facts, and your application was read carefully, respectfully and
				thoughtfully more than once. Should you decide that you still wish to pursue a path to USC,
				you may consider applying next year as a transfer student. Our transfer process is selective
				and offers no guarantees, but with careful planning and continued hard work in school, you
				could transfer as early as your sophomore year.
			</p>

			<p>Thank you for your interest in USC. We wish you every success in your college plans.</p>
		</div>

		<div class="mt-12">
			<div class="text-sm text-gray-700 mb-1">Respectfully,</div>
			<div class="mb-2">
				<img
					src="/signature-placeholder.png"
					alt="Signature"
					class="h-12"
					style="filter: invert(11%) sepia(95%) saturate(4000%) hue-rotate(357deg) brightness(70%) contrast(110%);"
				/>
			</div>
			<div class="font-bold">Kent Bradshaw</div>
			<div class="text-sm text-gray-600">
				Associate Dean and Director of Undergraduate Admission<br />
				{schoolName}<br />
				<span class="italic">Fall 2027 First-Year Admission Review</span>
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>The USC Mission:</strong><br />
					The development of human beings and society as a whole through the cultivation and
					enrichment of the human mind and spirit.
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:admission@usc.edu" class="hover:underline">admission@usc.edu</a><br />
					Phone: 213-740-1111<br />
					Website:
					<a href={`https://admission.${footerDomain}`} class="hover:underline"
						>admission.{footerDomain}</a
					>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of Southern California.
		</div>
	</div>
</main>
