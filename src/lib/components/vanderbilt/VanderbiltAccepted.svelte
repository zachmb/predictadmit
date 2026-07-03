<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Vanderbilt University';
	export let primaryColor: string = '#866D4B';
	export let footerDomain: string = 'vanderbilt.edu';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';

	$: session = $page.data.session;

	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	const viewAnalysis = () => {
		goto('/results/vanderbilt');
	};
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800" style="font-family: Georgia, 'Times New Roman', serif;">
	<div class="mx-auto max-w-4xl px-6 py-10">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
					style="background-color: {primaryColor};"
				>
					Deep Dive: Why did I get {$decisionsBySlug['vanderbilt']}?
				</button>
			</div>
		{/if}

		<!-- Top bar: applicant name + download -->
		<div class="flex items-center justify-between text-[14px]">
			<div class="font-semibold text-gray-800">March 25, 2026</div>
			<div class="flex items-center gap-8">
				<span class="text-gray-800"
					>{applicantName || 'Applicant'}
					<a href="/disclaimer" class="ml-1 text-[11px] text-gray-500">Logout</a></span
				>
				<a href="/disclaimer" class="font-semibold" style="color: {primaryColor};">Download PDF</a>
			</div>
		</div>

		<!-- Letterhead -->
		<div class="mt-8 flex items-center justify-between border-b border-gray-200 pb-6">
			<div class="flex items-center gap-3">
				<svg viewBox="0 0 100 100" class="h-12 w-12 shrink-0" aria-hidden="true">
					<path d="M10 8 L34 8 L50 58 L66 8 L90 8 L58 94 L42 94 Z" fill={primaryColor} />
				</svg>
				<div class="leading-none">
					<div class="text-xl font-normal tracking-wide text-gray-800">VANDERBILT</div>
					<div class="text-xl font-normal tracking-wide text-gray-800">UNIVERSITY</div>
				</div>
			</div>
			<div class="text-[15px] italic text-gray-500">Undergraduate Admissions</div>
		</div>

		<!-- Date + recipient -->
		<div class="mt-8 text-[14px] text-gray-800">March 25, 2026</div>
		<div class="mt-6 text-[14px] leading-relaxed text-gray-800">
			<div>{applicantName || 'Applicant'}</div>
			<div>1824 Smith Rd</div>
			<div>Northbrook, IL 60062-5830</div>
		</div>

		<div class="mt-8 text-[15px] text-gray-800">Dear {applicantName || 'Applicant'},</div>

		<div class="mt-6 space-y-5 text-[15px] leading-relaxed text-gray-800">
			<p>
				Our office has now completed its evaluation of the Regular Decision applicant pool for fall
				2026, and it is with great pleasure that I write to offer you admission to the Vanderbilt
				University Class of 2030. Congratulations! Your accomplishments distinguished you within an
				exceptionally talented and competitive pool of applicants, and the Committee on Admissions was
				genuinely impressed by all that you have achieved inside and outside of the classroom.
			</p>
			<p>
				As you consider this offer, I hope you will take pride in this achievement. We reviewed your
				application carefully within the context of our applicant pool, getting to know you through
				your academic and co-curricular record and your high school circumstances, and we are
				confident that you will thrive within our community of scholars and contribute meaningfully to
				life on campus. We are excited about the energy, curiosity, and perspective you will bring to
				Vanderbilt.
			</p>
			<p>
				In the coming days you will receive detailed information about enrolling, financial aid, and
				our programs for admitted students, including opportunities to visit campus, connect with
				current students and faculty, and meet your future classmates. To reserve your place in the
				class, please confirm your intention to enroll through your MyAppVU portal by May 1, 2026.
			</p>
			<p>
				On behalf of all of us at Vanderbilt, congratulations once again. We very much hope that you
				will choose to join us, and we look forward to welcoming you to Nashville in the fall. Please
				do not hesitate to contact me if I can be of any service to you.
			</p>
		</div>

		<div class="mt-8 text-[15px] text-gray-800">Sincerely,</div>
		<div class="mt-3">
			<div
				class="text-3xl italic text-gray-800"
				style="font-family: 'Segoe Script', 'Brush Script MT', cursive;"
			>
				Douglas L. Christiansen
			</div>
			<div class="mt-2 text-[15px] text-gray-800">Douglas L. Christiansen, Ph.D.</div>
			<div class="text-[15px] text-gray-800">Vice Provost for University Enrollment Affairs</div>
			<div class="text-[15px] text-gray-800">Dean of Admissions and Financial Aid</div>
		</div>

		<!-- Contact / return row -->
		<div class="mt-16 flex items-start justify-between border-t border-gray-200 pt-6">
			<a href="/disclaimer" class="text-[14px]" style="color: {primaryColor};"
				>Return to Application Status</a
			>
			<div class="flex gap-8 text-[11px] leading-relaxed text-gray-500">
				<div>
					2305 West End Avenue<br />
					Nashville, TN 37203-1727
				</div>
				<div>
					T 615-322-2561<br />
					800-288-0432<br />
					admissions.{footerDomain}
				</div>
			</div>
		</div>

		<!-- Simulated-letter disclaimer -->
		<div class="mt-8 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Vanderbilt University.
		</div>
	</div>

	<!-- Footer -->
	<footer class="border-t border-gray-200 bg-white">
		<div class="mx-auto max-w-4xl px-6 py-12 text-center">
			<div class="flex items-center justify-center gap-3">
				<svg viewBox="0 0 100 100" class="h-12 w-12 shrink-0" aria-hidden="true">
					<path d="M10 8 L34 8 L50 58 L66 8 L90 8 L58 94 L42 94 Z" fill={primaryColor} />
				</svg>
				<div class="text-left leading-none">
					<div class="text-2xl font-normal tracking-wide text-gray-800">VANDERBILT</div>
					<div class="text-2xl font-normal tracking-wide text-gray-800">UNIVERSITY</div>
				</div>
			</div>
			<div class="mt-4 text-[13px] text-gray-600">Nashville, Tennessee 37240</div>
			<div class="mt-1 text-[13px] text-gray-600">
				615-322-2561 | 800-288-0432 &middot;
				<a href="/disclaimer" class="hover:underline" style="color: {primaryColor};">Contact Us</a>
			</div>
			<p class="mx-auto mt-6 max-w-3xl text-[11px] leading-relaxed text-gray-500">
				Vanderbilt University is committed to principles of equal opportunity and affirmative action.
				Vanderbilt University does not discriminate against individuals on the basis of their race,
				sex, sexual orientation, gender identity, religion, color, national or ethnic origin, age,
				disability, military service, or genetic information in its administration of educational
				policies, programs, or activities; admissions policies; scholarship and loan programs;
				athletic or other University-administered programs; or employment. Accessibility information.
				Vanderbilt&reg;, Vanderbilt University&reg; and the Vanderbilt logos are trademarks of The
				Vanderbilt University. Site Development: Digital Strategies (Communications and Marketing.)
				&copy;2026
			</p>
		</div>
	</footer>
</main>
