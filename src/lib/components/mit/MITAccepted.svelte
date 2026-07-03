<script lang="ts">
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Massachusetts Institute of Technology';
	export let primaryColor: string = '#A31F34';
	export let footerDomain: string = 'mit.edu';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { decisionsBySlug } from '$lib/stores/results';

	$: session = $page.data.session;

	let googleSignedIn = false;
	$: googleSignedIn = !!session?.user;

	const viewAnalysis = () => {
		goto('/results/mit');
	};
</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>MIT Admissions - Admission Decision</title>
</svelte:head>

<div class="min-h-screen font-sans bg-white text-[#16283c] flex flex-col">
	<!-- MIT header -->
	<div class="h-1 w-full bg-gradient-to-r from-[#7ab52b] via-[#39a7a0] to-[#2f6fb0]"></div>
	<header class="border-b border-gray-200">
		<div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
			<a href="/disclaimer" class="flex items-end gap-2 text-black">
				<svg viewBox="0 0 64 32" class="h-6 w-auto" aria-label="MIT" fill="currentColor">
					<rect x="0" y="0" width="5" height="32" />
					<rect x="7" y="0" width="5" height="22" />
					<rect x="14" y="0" width="5" height="32" />
					<rect x="26" y="0" width="5" height="32" />
					<rect x="37" y="0" width="27" height="5" />
					<rect x="49" y="7" width="5" height="25" fill={primaryColor} />
				</svg>
				<span class="text-[19px] font-semibold tracking-tight leading-none pb-[1px]">Admissions</span>
			</a>
			<nav class="hidden sm:flex items-center gap-6 text-[13px] font-semibold text-[#16283c]">
				<a href="/disclaimer" class="hover:text-[#A31F34]">Discover</a>
				<a href="/disclaimer" class="hover:text-[#A31F34]">Apply</a>
				<a href="/disclaimer" class="hover:text-[#A31F34]">Afford</a>
				<a href="/disclaimer" class="hover:text-[#A31F34]">Visit</a>
				<a href="/disclaimer" class="hover:text-[#A31F34]">Help</a>
				<a href="/disclaimer" class="hover:text-[#A31F34]">Blogs</a>
			</nav>
		</div>
	</header>

	<main class="flex-grow max-w-4xl w-full mx-auto px-6 py-10">
		<div class="text-right text-[12px] text-gray-600 mb-1">
			{applicantName || 'Applicant'} <a href="/disclaimer" class="underline ml-1">Logout</a>
		</div>
		<div class="text-right mb-8">
			<a href="/disclaimer" class="text-[13px] text-[#2f6fb0] underline">Download PDF</a>
		</div>

		{#if googleSignedIn && $userProfile.usingAI}
			<div class="mb-6 flex justify-end">
				<button
					on:click={viewAnalysis}
					class="px-4 py-2 bg-[#14243a] text-white rounded text-sm font-semibold hover:bg-[#0f1c2e] transition-all shadow-md active:scale-95"
				>
					Deep Dive: Why did I get {$decisionsBySlug['mit']}?
				</button>
			</div>
		{/if}

		<div class="text-[15px] leading-relaxed text-[#16283c]">
			<p class="font-bold mb-6">March 14, 2026</p>

			<p class="mb-5">Dear {applicantName || 'Applicant'},</p>

			<p class="mb-5">
				The Admissions Committee has completed its review of your application, and it is my great
				pleasure to tell you that you have been admitted to the MIT Class of 2030. Congratulations! On
				behalf of the entire Admissions Committee, welcome to MIT.
			</p>

			<p class="mb-5">
				Every year we are astonished by the talent, curiosity, and character of our applicants, and
				this year was no exception. Your application stood out among more than 28,000 candidates. We
				chose you not only because of what you have accomplished, but because of who you are and what
				you will bring to our community. We cannot wait to see the problems you will choose to solve
				here.
			</p>

			<p class="mb-5">
				Over the coming weeks you will receive information about Campus Preview Weekend (CPW), our
				celebration for admitted students, along with details on financial aid, housing, and next
				steps. To reserve your place in the class, please confirm your enrollment through your
				applicant portal by May 1, 2026.
			</p>

			<p class="mb-8">
				We are thrilled to welcome you to MIT and cannot wait to see everything you will accomplish
				here. Congratulations once again.
			</p>

			<p class="mb-2">Sincerely,</p>

			<div class="mb-2 h-14" aria-hidden="true">
				<svg viewBox="0 0 180 50" class="h-14" fill="none" stroke="#1f3d7a" stroke-width="2">
					<path
						d="M8 38 C 22 8, 30 8, 26 30 C 24 42, 34 20, 44 22 C 54 24, 46 40, 56 34 C 70 26, 62 10, 74 16 C 84 21, 78 40, 92 30 C 108 18, 120 40, 138 22 C 150 10, 160 30, 174 18"
					/>
				</svg>
			</div>
			<p class="font-semibold">Stuart Schmill</p>
			<p class="text-[13px] text-gray-600">Dean of Admissions and Student Financial Services</p>
		</div>

		<div class="text-center mt-12 mb-4">
			<a href="/disclaimer" class="text-[13px] text-[#2f6fb0] underline">Return to Application Status</a>
		</div>

		<div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from {schoolName}.
		</div>
	</main>

	<!-- Shared MIT footer -->
	<footer class="mt-10">
		<div class="bg-[#14243a] text-white">
			<div class="max-w-6xl mx-auto px-6 py-8 flex items-start justify-between gap-8">
				<div class="max-w-xl">
					<h2 class="text-2xl font-bold mb-3">MIT Admissions</h2>
					<p class="text-[12px] leading-relaxed text-gray-300">
						At MIT Admissions, we recruit and enroll a talented and diverse class of undergraduates who
						will learn to use science, technology, and other areas of scholarship to serve the nation
						and the world in the 21st century.
					</p>
				</div>
				<svg
					viewBox="0 0 140 70"
					class="hidden md:block w-40 text-gray-200"
					fill="none"
					stroke="currentColor"
					stroke-width="1"
				>
					<path d="M20 60 Q70 20 120 60" />
					<path d="M20 60 L120 60" />
					<line x1="35" y1="60" x2="35" y2="48" />
					<line x1="50" y1="60" x2="50" y2="42" />
					<line x1="70" y1="60" x2="70" y2="38" />
					<line x1="90" y1="60" x2="90" y2="42" />
					<line x1="105" y1="60" x2="105" y2="48" />
					<path d="M118 18 l1.5 3 3 .5 -2 2 .5 3 -3-1.5 -3 1.5 .5-3 -2-2 3-.5z" />
					<path d="M100 10 l1 2 2 .3 -1.5 1.4 .4 2 -1.9-1 -1.9 1 .4-2 -1.5-1.4 2-.3z" />
				</svg>
			</div>
		</div>
		<div class="bg-[#0f1c2e] text-gray-300 text-[11px]">
			<div class="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
				<div class="flex items-center gap-2 text-white">
					<svg viewBox="0 0 64 32" class="h-5 w-auto" aria-label="MIT" fill="currentColor">
						<rect x="0" y="0" width="5" height="32" />
						<rect x="7" y="0" width="5" height="22" />
						<rect x="14" y="0" width="5" height="32" />
						<rect x="26" y="0" width="5" height="32" />
						<rect x="37" y="0" width="27" height="5" />
						<rect x="49" y="7" width="5" height="25" />
					</svg>
					<span class="leading-tight text-[9px] font-semibold">
						Massachusetts<br />Institute of<br />Technology
					</span>
				</div>
				<div class="text-right">
					MIT Admissions, 77 Massachusetts Avenue, Room E38-200, Cambridge, MA 02139 &middot; Tel:
					617.253.3400 | <a href="/disclaimer" class="underline">About</a> |
					<a href="/disclaimer" class="underline">Policies</a> |
					<a href="/disclaimer" class="underline">En Español</a> |
					<a href={`https://${footerDomain}`} class="underline">Instagram</a>
				</div>
			</div>
		</div>
	</footer>
</div>
