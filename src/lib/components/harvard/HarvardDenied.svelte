<script lang="ts">
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Harvard College';
	export let primaryColor: string = '#A51C30';
	export let footerDomain: string = 'harvard.edu';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';

	$: session = $page.data.session;

	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	const viewAnalysis = () => {
		goto('/results/harvard');
	};
</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-[#f4f4f4] font-serif text-gray-800">
	<div class="mx-auto max-w-3xl px-6 py-10">
		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="flex items-center gap-2 rounded-lg bg-[#003262] px-4 py-2 font-sans text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-95"
				>
					Deep Dive: Why did I get {$decisionsBySlug['harvard']}?
				</button>
			</div>
		{/if}

		<!-- Date + crimson rule -->
		<div class="mb-0 text-[13px] font-semibold text-gray-700">March 26, 2027</div>
		<div class="mt-2 mb-6 border-t-2" style="border-color: {primaryColor};"></div>

		<!-- Letter card -->
		<div class="bg-white px-10 py-10 shadow-sm">
			<!-- Letterhead -->
			<div class="mb-8 flex items-center gap-3">
				<svg viewBox="0 0 100 112" class="h-12 w-12" aria-hidden="true">
					<path d="M6 4 H94 V64 C94 88 74 102 50 110 C26 102 6 88 6 64 Z" fill={primaryColor} />
					<rect x="18" y="26" width="18" height="14" rx="1.5" fill="white" />
					<rect x="41" y="26" width="18" height="14" rx="1.5" fill="white" />
					<rect x="64" y="26" width="18" height="14" rx="1.5" fill="white" />
					<text x="27" y="36" font-size="8" text-anchor="middle" fill={primaryColor} font-family="serif">VE</text>
					<text x="50" y="36" font-size="8" text-anchor="middle" fill={primaryColor} font-family="serif">RI</text>
					<text x="73" y="36" font-size="7" text-anchor="middle" fill={primaryColor} font-family="serif">TAS</text>
				</svg>
				<div class="leading-tight">
					<div class="text-sm font-bold tracking-[0.15em] text-gray-900">HARVARD COLLEGE</div>
					<div class="text-[11px] italic text-gray-500">Admissions and Financial Aid</div>
				</div>
			</div>

			<div class="mb-6 text-[15px] text-gray-900">Dear {applicantName || 'Applicant'},</div>

			<div class="space-y-4 text-[14px] leading-relaxed text-gray-800">
				<p>
					The Committee on Admissions has completed its meetings, and I am very sorry to inform you
					that we cannot offer you admission to the Class of 2031. I wish that a different decision
					had been possible, but I hope that receiving this final decision now will be helpful to you
					as you make your college plans.
				</p>
				<p>
					In recent years, the Committee has been faced with increasingly difficult decisions; many
					thousands of students now apply for the sixteen hundred and fifty places in the first-year
					class, and the great majority of our applicants could be successful here academically. In
					addition, most candidates present strong co-curricular credentials. The Committee has,
					therefore, been faced with the necessity of choosing a first-year class from a great many
					more talented and highly qualified students than it has room to admit.
				</p>
				<p>
					We wish we could admit more of our fine applicants, and we understand how difficult the
					college application process can be for students and their families. While the Committee
					conducted its deliberations with the utmost care, we know that no one can predict with
					certainty what an individual will accomplish during college or beyond. Experience suggests
					that the particular college a student attends is far less important than developing the
					strengths and talents that a student brings to campus over the next four years.
				</p>
				<p>
					We very much appreciate the interest you have shown in Harvard, and we hope you will accept
					the best wishes of the Committee for success in all your future endeavors.
				</p>
			</div>

			<div class="mt-8 text-[14px] text-gray-800">Sincerely,</div>
			<div class="mt-3">
				<div
					class="text-3xl italic text-gray-800"
					style="font-family: 'Segoe Script', 'Brush Script MT', cursive;"
				>
					William R. Fitzsimmons
				</div>
				<div class="mt-2 text-[14px] font-semibold text-gray-900">William R. Fitzsimmons</div>
				<div class="text-[13px] text-gray-600">Dean of Admissions and Financial Aid</div>
			</div>

			<!-- Contact letterhead block -->
			<div class="mt-12 flex items-start gap-3 border-t border-gray-200 pt-6">
				<svg viewBox="0 0 100 112" class="h-10 w-10 shrink-0" aria-hidden="true">
					<path d="M6 4 H94 V64 C94 88 74 102 50 110 C26 102 6 88 6 64 Z" fill={primaryColor} />
					<rect x="18" y="26" width="18" height="14" rx="1.5" fill="white" />
					<rect x="41" y="26" width="18" height="14" rx="1.5" fill="white" />
					<rect x="64" y="26" width="18" height="14" rx="1.5" fill="white" />
				</svg>
				<div class="text-[11px] leading-relaxed text-gray-500">
					<div class="text-[12px] font-bold tracking-[0.15em] text-gray-800">HARVARD COLLEGE</div>
					<div class="italic">Admissions and Financial Aid</div>
					<div class="mt-2">
						86 Brattle Street, Cambridge, MA 02138<br />
						(617) 495-1551 &middot; Office of Admissions<br />
						(617) 495-1581 &middot; Griffin Financial Aid Office<br />
						college.{footerDomain}
					</div>
				</div>
			</div>

			<!-- Simulated-letter disclaimer -->
			<div class="mt-8 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
				<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only.
				This is not a real admission decision from Harvard University.
			</div>
		</div>

		<div class="mt-8 text-center">
			<a href="/disclaimer" class="text-[13px] underline" style="color: {primaryColor};"
				>Return to Application Status</a
			>
		</div>
	</div>
</main>
