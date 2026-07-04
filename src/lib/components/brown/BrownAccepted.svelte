<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	import Confetti from '$lib/components/common/Confetti.svelte';
	export let applicantName: string = 'Applicant';
	export let schoolName: string = 'Brown University';
	export let primaryColor: string = '#4E3629';
	export let footerDomain: string = 'brown.edu';
	import { page } from '$app/stores';

	$: session = $page.data.session;

	let googleEmail = '';
	let googleName = '';

	$: {
		googleEmail = (session?.user?.email as string) ?? '';
		googleName = (session?.user?.name as string) ?? '';
	}

	const handleImageError = (event: Event) => {
		const img = event.target as HTMLImageElement;
		img.style.display = 'none';
	};
</script>

<Confetti primary={primaryColor} />

<div class="min-h-screen bg-white p-8 font-serif">
	<div class="max-w-2xl mx-auto">
		<DeepDiveButton slug="brown" color={primaryColor} />
		<!-- Letterhead - Brown University uses brown and red -->
		<div class="border-b-2 border-[#4E3629] pb-4 mb-8">
			<div class="flex items-center mb-4">
				<div
					class="w-12 h-12 bg-[#4E3629] rounded-full mr-4 flex items-center justify-center relative overflow-hidden"
				>
					<!-- Brown "B" with red accent -->
					<span class="text-white text-xl font-bold z-10">B</span>
					<div class="absolute inset-0 bg-[#ED1C24] opacity-20"></div>
				</div>
				<div>
					<h1 class="text-2xl font-bold text-[#4E3629]">Brown University</h1>
					<p class="text-[#ED1C24] text-sm font-medium">Office of College Admission</p>
				</div>
			</div>
			<div class="text-sm text-gray-600">
				<p>45 Prospect Street</p>
				<p>Providence, Rhode Island 02912</p>
				<p>Tel: 401-863-2378 | Fax: 401-863-9300</p>
			</div>
		</div>

		<!-- Date -->
		<p class="mb-8 text-gray-700">
			{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
		</p>

		<!-- Applicant Info -->
		<div class="mb-8">
			<p class="text-lg font-medium">{applicantName}</p>
			<p class="text-gray-600">Regular Decision Applicant</p>
		</div>

		<!-- Letter Body -->
		<div class="mb-8 leading-relaxed text-gray-800">
			<p class="mb-4">Dear {applicantName},</p>

			<p class="mb-4">
				It gives me great pleasure to inform you that you have been admitted to Brown University's
				Class of 2031. On behalf of the Office of College Admission and the entire Brown community,
				please accept our warmest congratulations.
			</p>

			<p class="mb-4">
				Among more than 50,000 candidates—one of the most competitive pools in Brown's history—your
				application stood out. The admissions committee was struck by your intellectual curiosity,
				your commitment to your community, and your distinctive perspective. We were especially
				impressed by your thoughtful reflections on learning and by your dedication to the
				collaborative spirit that defines the Brown community.
			</p>

			<div class="my-8 p-6 bg-[#F8F5F2] border-l-4 border-[#ED1C24] italic">
				<p class="mb-2 font-semibold text-[#4E3629]">Welcome to Brown's Open Curriculum</p>
				<p class="text-gray-700">
					At Brown, you will chart your own course of study, unbound by distribution requirements.
					You'll work with peers who share your passion for inquiry and alongside faculty who lead
					their fields. Here, education is an active, collaborative endeavor—one that encourages
					you to take intellectual risks and to pursue knowledge for its own sake.
				</p>
			</div>

			<p class="mb-4">
				In the coming weeks, admitted students will receive full information about next steps,
				including Brown's admitted student programs, housing, and course registration. You can also
				expect to hear directly from current students, faculty, and alumni eager to welcome you to
				College Hill.
			</p>

			<p class="mb-4">
				Please take a moment to celebrate this remarkable accomplishment with the family, teachers,
				and friends who have supported you along the way. We look forward to greeting you in
				Providence this fall.
			</p>
		</div>

		<!-- Signature -->
		<div class="mt-12">
			<p class="mb-1">With warm congratulations,</p>
			<div class="mb-8">
				<div
					class="h-12 mb-2 flex items-center text-3xl italic text-[#4E3629]"
					style="font-family: 'Segoe Script', 'Brush Script MT', cursive;"
				>
					Landon Pierce
				</div>
				<p class="font-semibold text-[#4E3629]">Landon Pierce</p>
				<p class="text-sm text-[#ED1C24]">Dean of Admission</p>
				<p class="text-sm text-gray-600">Brown University</p>
			</div>

			<div class="mt-12 p-6 bg-[#F8F5F2] rounded-lg border border-[#4E3629]">
				<p class="text-sm text-gray-700 mb-2">
					<strong class="text-[#4E3629]">Next Steps:</strong> Your official admission packet will arrive
					by mail within 7-10 business days. Please log into your Brown portal to view your financial
					aid award (if applicable) and to confirm your enrollment by May 1.
				</p>
			</div>
		</div>
	</div>
</div>
