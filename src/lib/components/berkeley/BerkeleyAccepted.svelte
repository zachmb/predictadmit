<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'University of California, Berkeley';
	export let primaryColor: string = '#003262';
	export let footerDomain: string = 'berkeley.edu';


	const accent = '#FDB515';



</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-[#f4f4f4] font-serif text-slate-800">
	<!-- Top navy utility bar -->
	<div class="bg-[#003262] text-white">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-2">
			<div class="text-[13px] font-semibold">UC Berkeley</div>
			<div class="flex items-center gap-5 text-[11px]">
				<a href="/disclaimer" class="hover:underline">MAP@Berkeley</a>
				<a href="/disclaimer" class="hover:underline">Sign up for our email list</a>
				<a href="/disclaimer" class="hover:underline">Contact Us</a>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-3xl px-6 py-10">
		<DeepDiveButton slug="ucberkeley" color={primaryColor} />

		<!-- Date + gold rule -->
		<div class="mb-0 text-[13px] font-semibold text-slate-700">March 20, 2027</div>
		<div class="mt-2 mb-6 border-t-4" style="border-color: {accent};"></div>

		<!-- Letter card -->
		<div class="bg-white px-10 py-10 shadow-sm">
			<!-- Letterhead: circular seal + office line -->
			<div class="mb-6 flex flex-col items-center gap-3 text-center">
				<svg viewBox="0 0 100 100" class="h-16 w-16" aria-hidden="true">
					<circle cx="50" cy="50" r="48" fill={primaryColor} />
					<circle cx="50" cy="50" r="38" fill={accent} />
					<circle cx="50" cy="50" r="30" fill="#fff" />
					<path d="M50 34 l4 9 h9 l-7 6 3 9 -9 -5 -9 5 3 -9 -7 -6 h9 z" fill={primaryColor} />
				</svg>
				<div class="leading-tight">
					<div class="font-serif text-[15px] font-bold tracking-[0.05em] text-[#003262]">
						University of California, Berkeley
					</div>
					<div class="text-[11px] italic text-slate-500">Office of Undergraduate Admissions</div>
				</div>
			</div>

			<div class="mb-1 text-[11px] leading-snug tracking-wide text-slate-500">
				OFFICE OF UNDERGRADUATE ADMISSIONS &middot; 103 SPROUL HALL &middot; BERKELEY, CA 94720 &middot;
				ADMISSIONS.{footerDomain.toUpperCase()}
			</div>
			<div class="mb-6 border-t border-slate-200"></div>

			<div class="mb-6 text-[15px] text-slate-900">Dear {applicantName || 'Applicant'},</div>

			<div class="space-y-4 text-[14px] leading-relaxed text-slate-800">
				<p>
					Congratulations, and welcome to the University of California, Berkeley! We are pleased to
					offer you admission to the College of Letters and Science, through the Fall Program for First
					Semester.
				</p>
				<p>
					{applicantName || 'Applicant'}, your remarkable achievements both inside and outside the
					classroom made you stand tall amongst more than 133,000 applicants to the nation's leading
					public university. You, your loved ones, and supporters along the way have every reason to be
					proud of your success!
				</p>
				<p>
					At UC Berkeley, you'll have the opportunity to learn and discover within a welcoming and
					dynamic community united by our mission: education, research, and service to the greater
					good. Our community includes distinguished faculty and scholars &mdash; Nobel laureates,
					MacArthur fellows, and pioneering experts across every field of inquiry. We will encourage
					you to challenge yourself to reach your full potential through the extensive opportunities
					and resources that UC Berkeley provides.
				</p>
				<p>
					All the details of your offer, including your Conditions of Admission, Frequently Asked
					Questions, and more, are below.
				</p>
				<p>
					Our community celebrates you and your unique contributions, and we hope you will join us this
					Fall. Accept your offer of admission in your MAP@Berkeley portal by 11:59 p.m. (Pacific time)
					on May 1, 2027.
				</p>
				<p>Welcome to UC Berkeley.</p>
				<p class="font-semibold text-[#003262]">Go Bears!</p>
			</div>

			<div class="mt-8 text-[14px] text-slate-800">Sincerely,</div>

			<div class="mt-4 space-y-6">
				<div>
					<div
						class="text-2xl italic text-slate-800"
						style="font-family: 'Segoe Script', 'Brush Script MT', cursive;"
					>
						John Marfield
					</div>
					<div class="mt-1 text-[14px] font-semibold text-slate-900">John Marfield, Ph.D.</div>
					<div class="text-[13px] text-slate-600">Assistant Vice Chancellor</div>
					<div class="text-[13px] text-slate-600">Director of Undergraduate Admissions</div>
					<div class="text-[13px] text-slate-600">University of California, Berkeley</div>
				</div>
				<div>
					<div
						class="text-2xl italic text-slate-800"
						style="font-family: 'Segoe Script', 'Brush Script MT', cursive;"
					>
						Olufemi Ogundele
					</div>
					<div class="mt-1 text-[14px] font-semibold text-slate-900">Olufemi Ogundele, Ed.D.</div>
					<div class="text-[13px] text-slate-600">Associate Vice Chancellor of Enrollment</div>
					<div class="text-[13px] text-slate-600">Dean of Undergraduate Admissions</div>
					<div class="text-[13px] text-slate-600">University of California, Berkeley</div>
				</div>
			</div>

			<!-- Contact letterhead block -->
			<div class="mt-12 flex items-start gap-3 border-t border-slate-200 pt-6">
				<svg viewBox="0 0 100 100" class="h-10 w-10 shrink-0" aria-hidden="true">
					<circle cx="50" cy="50" r="48" fill={primaryColor} />
					<circle cx="50" cy="50" r="38" fill={accent} />
					<circle cx="50" cy="50" r="30" fill="#fff" />
					<path d="M50 34 l4 9 h9 l-7 6 3 9 -9 -5 -9 5 3 -9 -7 -6 h9 z" fill={primaryColor} />
				</svg>
				<div class="text-[11px] leading-relaxed text-slate-500">
					<div class="text-[12px] font-bold tracking-[0.05em] text-slate-800">
						UNIVERSITY OF CALIFORNIA, BERKELEY
					</div>
					<div class="italic">Office of Undergraduate Admissions</div>
					<div class="mt-2">
						103 Sproul Hall, Berkeley, CA 94720<br />
						admissions.{footerDomain}
					</div>
				</div>
			</div>

			<!-- Simulated-letter disclaimer -->
			<div class="mt-8 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
				<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only.
				This is not a real admission decision from the University of California, Berkeley.
			</div>
		</div>

		<div class="mt-8 text-center">
			<a href="/disclaimer" class="text-[13px] underline" style="color: {primaryColor};"
				>Return to Application Status</a
			>
		</div>
	</div>
</main>
