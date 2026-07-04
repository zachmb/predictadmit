<script lang="ts">
	import DeepDiveButton from '$lib/components/common/DeepDiveButton.svelte';
	// The parent component passes these props
	export let applicantName: string;
	export let schoolName: string = 'Vanderbilt University';
	export let primaryColor: string = '#866D4B';
	export let footerDomain: string = 'vanderbilt.edu';




</script>

<svelte:head>
	<title>{schoolName} - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800" style="font-family: Georgia, 'Times New Roman', serif;">
	<div class="mx-auto max-w-4xl px-6 py-10">
		<DeepDiveButton slug="vanderbilt" color={primaryColor} />

		<!-- Top bar: applicant name + download -->
		<div class="flex items-center justify-between text-[14px]">
			<div class="font-semibold text-gray-800">March 25, 2027</div>
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
		<div class="mt-8 text-[14px] text-gray-800">March 25, 2027</div>
		<div class="mt-6 text-[14px] leading-relaxed text-gray-800">
			<div>{applicantName || 'Applicant'}</div>
			<div>2847 Birchwood Ln</div>
			<div>Naperville, IL 60540-4417</div>
		</div>

		<div class="mt-8 text-[15px] text-gray-800">Dear {applicantName || 'Applicant'},</div>

		<div class="mt-6 space-y-5 text-[15px] leading-relaxed text-gray-800">
			<p>
				Our office has now completed its evaluation of the Regular Decision applicant pool for fall
				2027, and it is with regret that I write with the news that we are not offering you admission
				to the Class of 2031. We are honored by your interest in Vanderbilt, and we are aware of the
				time, thought, and effort that you put into the application process. Please be assured that
				we reviewed your application carefully within the context of our applicant pool, getting to
				know you through your academic and co-curricular record, and seeking to understand your high
				school circumstances.
			</p>
			<p>
				Virtually every applicant who was not admitted presented a strong combination of academic and
				personal qualities, but we cannot admit all qualified applicants because this year's incoming
				class is limited to 1,600 students. I encourage you to pursue a fulfilling college career
				elsewhere, and I am confident that the school you choose will benefit from your presence
				there. If after a year you find that you are still searching for a better fit college, please
				consider applying as a transfer student to Vanderbilt. Each year we enroll approximately 450
				transfer students, many of whom had applied originally as first-year students.
			</p>
			<p>
				On behalf of all of us at Vanderbilt, I wish you every success in your college career. Please
				do not hesitate to contact me if I can be of any service to you in the future.
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
				&copy;2027
			</p>
		</div>
	</footer>
</main>
