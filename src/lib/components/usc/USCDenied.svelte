<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of Southern California';
	export let primaryColor: string = '#990000'; // USC Cardinal
	export let footerDomain: string = 'usc.edu';
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
		goto('/results/usc');
	};

	const accentGold = '#FFCC00';
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
					Deep Dive: Why did I get {$decisionsBySlug['usc']}?
				</button>
			</div>
		{/if}

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
			<div class="text-right text-sm text-gray-600 mb-4">Reference ID: 108037714</div>
			<div class="space-y-1">
				<div>{applicantName || 'Applicant'}</div>
				<div>2550 Waterview Dr, Unit 347</div>
				<div>Northbrook, IL 60062</div>
			</div>
		</div>

		<div class="mb-6">
			<div class="text-xl font-bold" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8">
			<p>
				We have arrived at the end of our application review period, and I am sorry to say that we
				are unable to offer you a space in this year&rsquo;s incoming class.
			</p>

			<p>
				Please understand that our decision is driven primarily by space limitations and is in no way
				a judgment about you as a person nor any kind of statement about your ability to succeed in
				college. Be proud of your accomplishments and press on in your pursuit of higher education.
			</p>

			<p>
				Admission to USC was as competitive as ever. We could not accommodate thousands of
				exceptional candidates, including many with pristine academic records, remarkable talent,
				strong character, enriching experiences and unique perspectives. I hope you can find some
				comfort in knowing that none of us enjoys turning away outstanding students.
			</p>

			<p>
				Numbers cannot tell the whole story, but I hope you find the context helpful: We received
				roughly 79,000 applications for admission. Our anticipated enrollment of 3,650 students
				limits us to offering fall admission to roughly one in nine candidates. Of those admitted,
				most achieved nearly straight-A averages in a rigorous schedule of classes. Every candidate
				offers real strengths.
			</p>

			<p>
				Beyond the academic record, we considered many other factors presented in your application
				materials. Ours is a qualitative process, in which opinions are weighed with facts. Your
				application was carefully, respectfully and thoughtfully reviewed multiple times. If you
				decide that you still wish to explore a path to USC, consider applying next year as a
				transfer student. Although our transfer process is selective and there are no guarantees,
				with careful planning and continued hard work in school, you could transfer as early as your
				sophomore year.
			</p>

			<p>Thank you for considering USC. We wish you all the best in your college plans.</p>
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
			<div class="font-bold">Kirk Brennan</div>
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
