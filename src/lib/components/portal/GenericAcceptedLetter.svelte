<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	export let applicantName: string;
	export let schoolName: string;
	export let primaryColor: string;
	export let footerDomain: string;
	import BackToInboxButton from '$lib/components/common/BackToInboxButton.svelte';
</script>

<Confetti primary={primaryColor} />

<div class="min-h-screen bg-slate-200 text-slate-900 font-serif flex flex-col">
	<!-- HEADER -->
	<header class="bg-white border-b border-slate-300">
		<div class="max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
			<div>
				<div class="text-2xl font-bold" style={`color: ${primaryColor};`}>
					{schoolName}
				</div>
				<div class="text-[11px] tracking-[0.15em] uppercase text-slate-700">
					Undergraduate Admissions
				</div>
			</div>
			<div class="text-[11px] text-slate-700">
				{applicantName}{' '}
				<span class="text-slate-400">&nbsp;|&nbsp;</span>
				<a href="/" class="text-blue-800 underline hover:no-underline"> Logout </a>
			</div>
		</div>
		<div class="h-8" style={`background-color: ${primaryColor};`}></div>
	</header>

	<!-- LETTER -->
	<section class="flex-1 bg-white">
		<div class="max-w-5xl mx-auto px-10 py-10 relative">
			<!-- Fade-in back button top-left -->
			<BackToInboxButton />

			<p class="text-[11px] text-slate-700 mb-4">March 28, 2027</p>

			<p class="text-[12px] text-slate-900 mb-4">
				{applicantName}
			</p>

			<p class="text-[12px] leading-relaxed text-slate-900 mb-3">
				Dear {applicantName},
			</p>

			<p class="text-[12px] leading-relaxed text-slate-900 mb-3">
				I am very pleased to share that you have been admitted to
				<span class="font-semibold"> {schoolName}</span> as a member of the Class of 2031.
			</p>

			<p class="text-[12px] leading-relaxed text-slate-900 mb-3">
				The admissions committee was impressed by your academic achievement, intellectual curiosity,
				and the initiative you have shown in your academic and personal pursuits.
			</p>

			<p class="text-[12px] leading-relaxed text-slate-900 mb-3">
				In the coming weeks, your admitted student portal will provide details about financial aid,
				housing, orientation, and key enrollment deadlines. Please review those materials carefully
				and respond by the stated reply date.
			</p>

			<p class="text-[12px] leading-relaxed text-slate-900 mb-3">
				On behalf of the faculty and staff of {schoolName}, congratulations on your admission. We
				hope to welcome you into our community this fall.
			</p>

			<p class="text-[12px] leading-relaxed text-slate-900 mt-4">
				Sincerely,<br />
				<span class="font-semibold">Director of Undergraduate Admissions</span><br />
				{schoolName}
			</p>

			<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
				<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
				is not a real admission decision from {schoolName}.
			</div>
		</div>
	</section>

	<!-- FOOTER -->
	<footer class="mt-auto">
		<div class="h-10 flex items-center" style={`background-color: ${primaryColor};`}>
			<div
				class="max-w-5xl mx-auto px-6 w-full flex items-center justify-between text-[11px] text-white"
			>
				<span>&copy; {footerDomain} 2027</span>
				<span class="opacity-80">
					PredictAdmit.com simulation · Not affiliated with {schoolName}
				</span>
			</div>
		</div>
	</footer>
</div>

<style>
</style>
