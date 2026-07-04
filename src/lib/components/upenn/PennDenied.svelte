<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// Props passed from the portal route
	export let applicantName: string;
	export let schoolName: string = 'University of Pennsylvania';
	export let primaryColor: string = '#011F5B';
	export let footerDomain: string = 'upenn.edu';





	$: firstName = (applicantName || 'Applicant').trim().split(' ')[0];
</script>

<svelte:head>
	<title>{schoolName} — Admission Decision</title>
</svelte:head>

<div class="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
	<!-- Header -->
	<header class="bg-[#011F5B] text-white">
		<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<svg viewBox="0 0 44 52" class="w-9 h-11 shrink-0" aria-hidden="true">
					<path
						d="M4 3 H40 V30 C40 42 22 49 22 49 C22 49 4 42 4 30 Z"
						fill="#ffffff"
						stroke="#011F5B"
						stroke-width="1.5"
					/>
					<path d="M4 3 H40 V14 H4 Z" fill="#990000" />
					<circle cx="13" cy="8.5" r="2.4" fill="#ffffff" />
					<circle cx="22" cy="8.5" r="2.4" fill="#ffffff" />
					<circle cx="31" cy="8.5" r="2.4" fill="#ffffff" />
					<path d="M13 22 Q22 15 31 22 Q26 31 22 33 Q18 31 13 22 Z" fill="#011F5B" />
				</svg>
				<div class="leading-tight">
					<div class="text-3xl font-serif tracking-wide">Penn</div>
					<div class="text-lg font-serif tracking-wide -mt-1">Admissions</div>
				</div>
			</div>
			<div class="text-right leading-tight">
				<div class="text-sm font-semibold">{applicantName || 'Applicant'}</div>
				<a href="/disclaimer" class="text-[11px] text-white/80 hover:underline">Logout</a>
			</div>
		</div>
	</header>

	<!-- Letter body -->
	<main class="flex-grow bg-white">
		<div class="max-w-3xl mx-auto px-6 py-12 text-[15px] leading-relaxed text-slate-800">
			<DeepDiveButton slug="upenn" color={primaryColor} />

			<p class="font-bold mb-8">March 26, 2027</p>

			<p class="mb-6">Dear {firstName},</p>

			<p class="mb-6">
				After completing a careful review of your application, I regret to inform you that we are not
				able to offer you admission to the {schoolName}.
			</p>

			<p class="mb-6">
				We recognize that this is not the decision you were hoping to receive. I wish we could offer
				admission to all the impressive applicants we see, but our space is limited.
			</p>

			<p class="mb-6">
				On behalf of the entire application review committee, thank you for the time and energy that
				you put into your application. We are grateful for the opportunity to learn about you and
				your many accomplishments, interests, and aspirations. We hope you approach your next steps
				with the same commitment and enthusiasm that you have shown throughout this process.
			</p>

			<p class="mb-8">
				Thank you for including Penn in your college search. We wish you great success in your
				educational pursuits and the many opportunities that will come your way.
			</p>

			<p class="mb-2">Sincerely,</p>

			<!-- Signature -->
			<div class="mb-1">
				<span class="text-3xl italic text-slate-900" style="font-family: 'Segoe Script', 'Brush Script MT', cursive;">
					E. Whitney Soule
				</span>
			</div>
			<p class="font-semibold">E. Whitney Soule</p>
			<p class="text-slate-700 mb-8">Vice Provost and Dean of Admissions</p>

			<a href="/disclaimer" class="text-[#011F5B] font-medium hover:underline">
				Decision Frequently Asked Questions (FAQs)
			</a>

			<div class="text-center mt-12">
				<a href="/disclaimer" class="text-[#011F5B] hover:underline">Return to Application Status</a>
			</div>

			<!-- Simulation disclaimer -->
			<div class="mt-12 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
				<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only.
				This is not a real admission decision from the University of Pennsylvania.
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="bg-[#011F5B] text-white">
		<div class="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<svg viewBox="0 0 44 52" class="w-9 h-11 shrink-0" aria-hidden="true">
					<path
						d="M4 3 H40 V30 C40 42 22 49 22 49 C22 49 4 42 4 30 Z"
						fill="#ffffff"
						stroke="#011F5B"
						stroke-width="1.5"
					/>
					<path d="M4 3 H40 V14 H4 Z" fill="#990000" />
					<circle cx="13" cy="8.5" r="2.4" fill="#ffffff" />
					<circle cx="22" cy="8.5" r="2.4" fill="#ffffff" />
					<circle cx="31" cy="8.5" r="2.4" fill="#ffffff" />
					<path d="M13 22 Q22 15 31 22 Q26 31 22 33 Q18 31 13 22 Z" fill="#011F5B" />
				</svg>
				<div class="leading-tight">
					<div class="text-2xl font-serif tracking-wide">Penn</div>
					<div class="text-[9px] tracking-[0.15em] font-serif -mt-0.5">
						UNIVERSITY of PENNSYLVANIA
					</div>
				</div>
			</div>
			<div class="flex items-center gap-3">
				{#each ['IG', 'TT', 'YT', 'f'] as icon}
					<span
						class="w-7 h-7 rounded-full border border-white/70 flex items-center justify-center text-[10px]"
					>
						{icon}
					</span>
				{/each}
			</div>
		</div>
		<div class="border-t border-white/20">
			<div class="max-w-6xl mx-auto px-6 py-3 flex flex-wrap gap-6 text-[13px]">
				<a href="/disclaimer" class="hover:underline">Join the mailing list</a>
				<a href="/disclaimer" class="hover:underline">Contact Us</a>
				<a href="/disclaimer" class="hover:underline">Accessibility</a>
				<a href="/disclaimer" class="hover:underline">Privacy Policy</a>
				<a href="/disclaimer" class="hover:underline">NACAC Partnership Agreement</a>
			</div>
		</div>
	</footer>
</div>
