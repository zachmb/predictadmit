<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Johns Hopkins University';
	export let primaryColor: string = '#002D72'; // JHU Blue
	export let footerDomain: string = 'jhu.edu';





</script>

<Confetti primary={primaryColor} />

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif">
	<!-- Brand header bar -->
	<header class="border-b border-gray-200 bg-white">
		<div class="max-w-3xl mx-auto px-6 py-4 flex items-center font-sans">
			<div class="flex items-center gap-3 pr-6">
				<div
					class="w-9 h-11 flex items-center justify-center text-white text-[10px] font-serif font-bold"
					style="background-color: {primaryColor}; clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);"
				>
					JHU
				</div>
				<div class="leading-tight">
					<div class="font-serif text-xl font-bold" style="color: {primaryColor};">
						Johns Hopkins
					</div>
					<div class="text-[10px] tracking-[0.35em] text-gray-600 uppercase">University</div>
				</div>
			</div>
			<div class="border-l border-gray-300 pl-6 hidden sm:block">
				<div class="text-[11px] font-bold tracking-wider text-[#0074d9] uppercase leading-tight">
					Undergraduate<br />Admissions
				</div>
			</div>
		</div>
	</header>

	<div class="max-w-3xl mx-auto px-6 pt-10 pb-16">
		<DeepDiveButton slug="jhu" color={primaryColor} />

		<div class="text-sm text-gray-600 mb-8 font-sans font-bold">March 18, 2027</div>

		<!-- Welcome banner -->
		<div class="mb-10 text-center font-sans">
			<div class="text-sm tracking-[0.25em] uppercase text-gray-500 mb-1">
				Welcome to the Class of 2031
			</div>
			<div class="text-4xl font-extrabold tracking-wide" style="color: {primaryColor};">
				YOU'RE ADMITTED!
			</div>
			<div class="mt-4 h-1 w-24 mx-auto" style="background-color: {primaryColor};"></div>
		</div>

		<div class="mb-6">
			<div class="text-lg" style="color: {primaryColor};">
				Dear {applicantName || 'Applicant'},
			</div>
		</div>

		<div class="space-y-4 mb-8 leading-relaxed">
			<p>
				<strong>Congratulations!</strong> We are delighted to offer you admission to Johns Hopkins
				University—a place where firsts carry you forward.
			</p>

			<p>
				You join our community of scholars at a historic moment, as we celebrate our 150th
				anniversary. Over the next four years, you'll have the chance to encounter new
				perspectives, take part in some of the defining conversations of our time, and flourish in
				a community energized by the next great pursuit of knowledge.
			</p>

			<p class="italic pl-4 border-l-2" style="border-color: {primaryColor};">
				"Our simple aim is to make scholars, strong, bright, useful, and true."
			</p>

			<p>
				These words from Daniel Coit Gilman, the university's first president, still capture the
				Hopkins community—one that works together to create real, meaningful impact on the causes
				that matter.
			</p>

			<p>
				Your years at Hopkins will be shaped by the first steps you take, the connections you seek
				out, and the relationships you form. As a Blue Jay, you'll dig into what matters most to
				you, find your next best friends, and join a community that is so glad you're here.
			</p>

			<p>
				At Hopkins you'll find the flexibility and resources to turn your biggest questions into
				answers, along with the network of a leading research university supporting every step of
				your journey.
			</p>

			<p>
				When you're ready to enroll, complete your Reply Form to claim your place in the class. An
				official admit packet will also be arriving in the mail soon.
			</p>

			<p>
				Once again, congratulations—and welcome to Hopkins! This is only the beginning, and we look
				forward to the questions you'll ask, the discoveries you'll make, and the lasting mark
				you'll leave on our community and the world around you.
			</p>
		</div>

		<div class="mt-10">
			<div class="mb-1">Sincerely,</div>
			<div class="font-bold tracking-wide uppercase" style="color: {primaryColor};">
				Nathaniel Boone III
			</div>
			<div class="text-sm text-gray-600">
				Dean of Undergraduate Admissions<br />
				{schoolName}
			</div>
		</div>

		<div class="mt-10 flex flex-wrap gap-3 font-sans">
			<a
				href="/disclaimer"
				class="px-5 py-2 text-white text-sm font-bold tracking-wider uppercase"
				style="background-color: {primaryColor};"
			>
				Next Steps
			</a>
			<a
				href="/disclaimer"
				class="px-5 py-2 border text-sm font-bold tracking-wider uppercase"
				style="border-color: {primaryColor}; color: {primaryColor};"
			>
				View Your Financial Aid Status
			</a>
		</div>

		<div class="mt-12 pt-8 border-t border-gray-200 text-xs text-gray-500 font-sans">
			<div class="grid grid-cols-2 gap-8">
				<div>
					<strong>Mail Only Correspondence:</strong><br />
					Office of Undergraduate Admissions<br />
					Johns Hopkins University<br />
					3400 N. Charles St., Mason Hall<br />
					Baltimore, MD 21218-2683 USA
				</div>
				<div>
					<strong>Contact Information:</strong><br />
					Email:
					<a href="/disclaimer" class="hover:underline">gotojhu@jhu.edu</a><br />
					Website:
					<a href={`https://apply.${footerDomain}`} class="hover:underline">apply.{footerDomain}</a>
				</div>
			</div>
		</div>

		<div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 font-sans">
			<strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. This
			is not a real admission decision from Johns Hopkins University.
		</div>
	</div>
</main>
