<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	// Props passed from the portal route
	export let applicantName: string;
	export let schoolName = 'Washington University in St. Louis';
	export let primaryColor = '#A51417';
	export let footerDomain = 'wustl.edu';

	$: firstName = (applicantName || 'Applicant').split(' ')[0];
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<div class="min-h-screen bg-white font-serif text-gray-900">
	<!-- Top brand bar -->
	<div class="h-1.5 w-full" style="background-color: {primaryColor};"></div>

	<!-- Header -->
	<header class="bg-white">
		<div class="mx-auto flex max-w-4xl items-start justify-between px-6 pt-6">
			<div class="flex items-center gap-2.5">
				<svg viewBox="0 0 64 74" class="h-8 w-8" aria-hidden="true">
					<path d="M4 3 H60 V36 C60 55 47 67 32 73 C17 67 4 55 4 36 Z" fill="white" stroke={primaryColor} stroke-width="2.5" />
					<path d="M4 3 H60 V15 H4 Z" fill={primaryColor} />
					<rect x="11" y="6.5" width="6" height="6" fill="white" />
					<rect x="29" y="6.5" width="6" height="6" fill="white" />
					<rect x="47" y="6.5" width="6" height="6" fill="white" />
					<path d="M14 24 L32 34 L50 24" fill="none" stroke={primaryColor} stroke-width="2.5" />
					<path d="M14 40 L32 50 L50 40" fill="none" stroke={primaryColor} stroke-width="2.5" />
				</svg>
				<span class="text-3xl font-normal text-gray-900" style="font-family: Georgia, 'Times New Roman', serif;">WashU</span>
			</div>
			<div class="text-right text-[13px]">
				<div>
					<span class="font-semibold text-gray-800">{applicantName || 'Applicant'}</span>
					<a href="/disclaimer" class="ml-2 text-[12px] underline" style="color: {primaryColor};">Logout</a>
				</div>
				<a href="/disclaimer" class="mt-2 inline-block text-[13px] font-semibold underline" style="color: {primaryColor};">Download PDF</a>
			</div>
		</div>
	</header>

	<!-- Letter body -->
	<main class="mx-auto max-w-4xl px-6 pb-16 pt-8">
		<div class="mb-8 text-[15px] font-bold text-gray-900">March 20, 2027</div>

		<div class="mb-6 text-[14px] text-gray-900">Dear {firstName},</div>

		<div class="space-y-5 text-[14px] leading-relaxed text-gray-800">
			<p>
				Congratulations! On behalf of the Admissions Committee, it is my great pleasure to offer you
				admission to Washington University in St. Louis and to welcome you to the Class of 2031. In
				an exceptionally talented pool of applicants, your accomplishments set you apart, and we are
				thrilled at the prospect of you joining the WashU community.
			</p>
			<p>
				Your academic record, your talents, and the character and curiosity that come through in
				your application deeply impressed the Admissions Committee. We are confident you will thrive
				on our collaborative, park-like campus and add meaningfully to the intellectual and cultural
				life of the university.
			</p>
			<p>
				Over the coming days, detailed information about next steps will appear in your applicant
				portal, including financial aid, housing, course planning, and WashU Preview&mdash;our
				program for admitted students. To secure your place in the Class of 2031, please confirm
				your intention to enroll through your portal by May 1, 2027.
			</p>
			<p>
				Please take a moment to celebrate this achievement with the family, teachers, and friends
				who helped you along the way. We look forward to welcoming you to St. Louis in the fall.
			</p>
		</div>

		<div class="mt-10 text-center">
			<a href="/disclaimer" class="text-[14px] underline" style="color: {primaryColor};">
				Return to Application Status
			</a>
		</div>

		<!-- Simulated-letter disclaimer -->
		<div class="mx-auto mt-10 max-w-2xl rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from {schoolName}.
		</div>
	</main>

	<!-- Footer -->
	<footer class="bg-black text-white">
		<div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2">
			<div class="font-sans text-[13px] leading-relaxed text-gray-200">
				<div>MSC 1089-105-05</div>
				<div>One Brookings Drive</div>
				<div>St. Louis, MO 63130-4899</div>
				<div class="mt-4">314-935-6000 | 800-638-0700</div>
				<a href="/disclaimer" class="underline">admissions@{footerDomain}</a>
				<div class="mt-4 flex items-center gap-2.5">
					<a href="/disclaimer" aria-label="Facebook" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.8v8h3.1z"/></svg></a>
					<a href="/disclaimer" aria-label="X" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18.9 2H22l-7.5 8.6L23 22h-6.9l-5.4-7-6.2 7H1.4l8-9.2L1 2h7l4.9 6.5L18.9 2zM17.7 20h1.9L7.4 4H5.4L17.7 20z"/></svg></a>
					<a href="/disclaimer" aria-label="YouTube" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.5.5-3 .5-4.5s-.1-3-.5-4.5zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z"/></svg></a>
					<a href="/disclaimer" aria-label="Instagram" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.1a6.7 6.7 0 1 0 0 13.4 6.7 6.7 0 0 0 0-13.4zm0 11a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6zm6.5-11.3a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0z"/></svg></a>
					<a href="/disclaimer" aria-label="Snapchat" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c2.7 0 4.9 2.2 4.9 4.9 0 .6 0 1.5-.1 2.3.2.1.5.2.8.2.5 0 1-.3 1.4-.5.1-.1.3-.1.4-.1.4 0 .8.3.8.7 0 .3-.2.6-.7.8-.4.2-1.2.4-1.4.9-.1.3 0 .6.2.9.5.9 1.4 1.7 2.5 2 .3.1.5.3.5.6 0 .5-1 .9-1.7 1-.1.2-.1.5-.2.7-.1.2-.2.3-.5.3-.4 0-.9-.2-1.6-.2-.9 0-1.3.1-1.9.6-.6.5-1.4 1.1-2.7 1.1s-2.1-.6-2.7-1.1c-.6-.5-1-.6-1.9-.6-.7 0-1.2.2-1.6.2-.3 0-.4-.1-.5-.3-.1-.2-.1-.5-.2-.7-.7-.1-1.7-.5-1.7-1 0-.3.2-.5.5-.6 1.1-.3 2-1.1 2.5-2 .2-.3.3-.6.2-.9-.2-.5-1-.7-1.4-.9-.5-.2-.7-.5-.7-.8 0-.4.4-.7.8-.7.1 0 .3 0 .4.1.4.2.9.5 1.4.5.3 0 .6-.1.8-.2-.1-.8-.1-1.7-.1-2.3C7.1 4.2 9.3 2 12 2z"/></svg></a>
					<a href="/disclaimer" aria-label="TikTok" class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black"><svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 0h-3.3v13.6a2.3 2.3 0 1 1-2.3-2.3c.2 0 .4 0 .6.1V8a5.6 5.6 0 1 0 4.7 5.5V6.7a6.7 6.7 0 0 0 3.9 1.2V4.6a3.9 3.9 0 0 1-3.6-4.6z"/></svg></a>
				</div>
			</div>
			<div>
				<h2 class="mb-3 font-sans text-[15px] font-bold tracking-wide text-white">RESOURCES</h2>
				<ul class="space-y-2 font-sans text-[13px]">
					<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">Admissions</a></li>
					<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">Financial Aid</a></li>
					<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">College Prep Program</a></li>
					<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">Academics</a></li>
					<li><a href="/disclaimer" class="text-gray-200 underline hover:text-white">Report Website Issue</a></li>
				</ul>
			</div>
		</div>
		<div class="border-t border-gray-700">
			<div class="mx-auto max-w-6xl px-6 py-4 font-sans text-[12px] text-gray-300">
				&copy;2027 Washington University in St. Louis
			</div>
		</div>
	</footer>
</div>
