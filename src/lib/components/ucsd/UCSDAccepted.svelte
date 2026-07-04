<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of California, San Diego';
	export let primaryColor: string = '#182B49';
	export let footerDomain: string = 'ucsd.edu';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';

	$: session = $page.data.session;

	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	const viewAnalysis = () => {
		goto('/results/ucsd');
	};
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} — Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-slate-700 font-sans p-6">
	<div class="max-w-3xl mx-auto">
		<div class="h-1 w-full" style="background-color: {primaryColor};"></div>

		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mt-6 mb-2 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="group flex items-center px-4 py-2 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
					style="background-color: {primaryColor};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['ucsd']}?
				</button>
			</div>
		{/if}

		<!-- Letterhead -->
		<div class="pt-8 pb-6">
			<span
				class="text-3xl font-serif tracking-tight border-b-2 pb-0.5"
				style="color: {primaryColor}; border-color: {primaryColor};"
			>
				UC San Diego
			</span>
		</div>

		<!-- Recipient + date -->
		<div class="flex justify-between items-start mb-8 text-sm">
			<div>{applicantName || 'Applicant'}</div>
			<div class="text-right leading-relaxed">
				<div>March 20, 2027</div>
				<div>Application ID: 31709284</div>
			</div>
		</div>

		<!-- Salutation -->
		<div class="mb-6 text-base">Dear {applicantName || 'Applicant'},</div>

		<div class="space-y-5 text-[15px] leading-relaxed">
			<p class="font-semibold text-slate-800">
				Congratulations! We are pleased to offer you admission for Fall 2027 to the University of
				California San Diego as an Undeclared major in Warren College.
			</p>

			<p>
				Your selection for the Triton Class of 2031 is an extraordinary accomplishment, given that UC
				San Diego received more than 168,000 total applications! We believe you have the talent,
				skills, knowledge and passion to be a powerful contributing member of the Triton family.
				Please accept my personal congratulations on your outstanding achievement.
			</p>

			<p>
				UC San Diego is one of the top 10 public universities in the world. Here, you will have
				unparalleled opportunities to learn from professors who are leading experts across the arts,
				humanities and sciences. You will be exposed to new methodologies, pioneering ideas and
				state-of-the-art facilities. You will gain access to internships and professional settings
				where you can practice what you learn, explore your career options and leave a lasting mark on
				society.
			</p>

			<p>
				At UC San Diego, your voice will be heard. Our dynamic community will ensure you feel at home
				and allow you to leverage the powerful education you have earned. This is the place for you to
				discover who you are as a person, a scholar and a member of a community that values diversity,
				inclusion and collaboration.
			</p>

			<p>
				There are more than 256,000 influential Triton alumni worldwide. You'll be joining a community
				that takes risks, pushes the frontiers of knowledge and challenges conventional thinking to
				create a more prosperous and equitable society for all people.
			</p>

			<p>
				To accept your offer, return to your Application Status page and submit the Accept Your Offer
				form by <strong>May 1</strong> and pay your $250 deposit (if applicable). You will then be
				given access to your pre-enrollment checklist which includes your on-campus housing
				application, orientation information and important official documents you must submit by July
				1. We also invite you to join us on campus during Triton Days. Information about admitted
				student events is available on the Events tab.
			</p>

			<p>
				I am confident the Class of 2031 will be a passionate and resilient group of students, ready to
				make their mark on our evolving world. I cannot wait to see the unique impact you will have at
				UC San Diego and beyond.
			</p>

			<p>
				Again, congratulations on your remarkable achievement. I look forward to welcoming you to the
				Triton family this fall.
			</p>
		</div>

		<!-- Signature -->
		<div class="mt-10 text-[15px]">
			<div>With Triton pride,</div>
			<div class="mt-6 font-semibold text-slate-800">James Rujimora</div>
			<div class="text-sm text-slate-600">
				Assistant Vice Chancellor, Enrollment Management<br />
				Office of Admissions, {schoolName}
			</div>
		</div>

		<div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Office of Admissions</strong><br />
					Student Services Center, MC 0021<br />
					9500 Gilman Drive, La Jolla, CA 92093-0021<br />
					Telephone (858) 534-4831
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="mailto:admissions@ucsd.edu" class="hover:underline">admissions@{footerDomain}</a><br />
					Website:
					<a href={`https://admissions.${footerDomain}`} class="hover:underline">admissions.{footerDomain}</a>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from the University of California, San Diego.
		</div>
	</div>
</main>
