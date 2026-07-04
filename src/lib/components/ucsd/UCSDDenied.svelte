<script lang="ts">
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
			<p>
				Thank you for your application to the University of California San Diego for Fall 2027. I know
				how much thought and effort went into your application, and on behalf of the entire Office of
				Admissions, I want to thank you for considering UC San Diego as your future home.
			</p>

			<p>
				This year, UC San Diego received more than 168,000 applications from an exceptionally talented
				group of students. After a careful and holistic review of your academic record,
				accomplishments and personal insight questions, I regret to inform you that we are unable to
				offer you admission to the Triton Class of 2031. Because the number of highly qualified
				applicants far exceeds the space available in our entering class, we were not able to admit
				many outstanding students, including you.
			</p>

			<p>
				Please understand that this decision is not a judgment of your ability or your potential. The
				strength of this year's applicant pool made our selection process extraordinarily competitive,
				and a decision not to offer admission reflects the limits of our capacity far more than any
				shortcoming in your application.
			</p>

			<p>
				If you are a California resident, you may still have options within the University of
				California system. We encourage you to review referral opportunities to other UC campuses
				through your UC Application, and to explore transfer pathways that can bring you to UC San
				Diego in the future. Many successful Tritons begin their journey elsewhere and join us later.
			</p>

			<p>
				You should be genuinely proud of everything you have accomplished. I have every confidence that
				you will thrive at the institution you attend, and I wish you tremendous success in your
				studies and in all that lies ahead.
			</p>

			<p>Thank you again for your interest in UC San Diego.</p>
		</div>

		<!-- Signature -->
		<div class="mt-10 text-[15px]">
			<div>Sincerely,</div>
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
