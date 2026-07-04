<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	import BackToInboxButton from '$lib/components/common/BackToInboxButton.svelte';

	export let applicantName: string = 'Applicant';
	export let schoolName: string = 'Western Washington University';
	export let primaryColor: string = '#0a3a63';
	export let footerDomain: string = 'wwu.edu';
</script>

<Confetti primary={primaryColor} />

<div class="min-h-screen bg-[#f4f7f9] text-slate-900 font-sans flex flex-col">
	<header class="bg-[#0a3a63] text-white">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
			<div>
				<div class="text-xl font-semibold tracking-wide">WESTERN WASHINGTON UNIVERSITY</div>
				<div class="mt-1 text-[11px] font-semibold tracking-[0.28em] text-[#c4dd3b]">
					OFFICE OF ADMISSIONS
				</div>
			</div>
			<div class="text-right text-[12px] text-white/80">
				{applicantName}
			</div>
		</div>
	</header>

	<section class="flex-1 bg-white">
		<div class="relative mx-auto max-w-4xl px-8 py-10">
			<BackToInboxButton />

			<p class="mb-6 text-[12px] text-slate-600">March 28, 2027</p>
			<p class="mb-6 text-[13px] text-slate-800">{applicantName}</p>

			<h1 class="mb-6 text-2xl font-semibold text-[#0a3a63]">
				Welcome to Western Washington University
			</h1>

			<p class="mb-4 text-[14px] leading-7 text-slate-800">Dear {applicantName},</p>

			<p class="mb-4 text-[14px] leading-7 text-slate-800">
				Congratulations! We are happy to offer you admission to {schoolName} for Fall 2027. Your
				application showed the curiosity, preparation, and community-minded spirit Western hopes to
				see in its incoming class.
			</p>

			<p class="mb-4 text-[14px] leading-7 text-slate-800">
				Your admitted student checklist will outline the next steps for confirming enrollment,
				reviewing financial aid details, applying for housing, and preparing for orientation in
				Bellingham.
			</p>

			<p class="mb-4 text-[14px] leading-7 text-slate-800">
				We hope you will bring your voice and energy to the Western community. Again,
				congratulations on your admission.
			</p>

			<p class="mt-8 text-[14px] leading-7 text-slate-800">
				Sincerely,<br />
				<span class="font-semibold">Office of Admissions</span><br />
				Western Washington University
			</p>

			<div class="mt-8 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
				<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
				is not a real admission decision from Western Washington University.
			</div>
		</div>
	</section>

	<footer class="bg-[#0a3a63] py-4 text-[11px] text-white/75">
		<div class="mx-auto flex max-w-5xl justify-between px-6">
			<span>&copy; {footerDomain} 2027</span>
			<span>PredictAdmit.com simulation · Not affiliated with {schoolName}</span>
		</div>
	</footer>
</div>
