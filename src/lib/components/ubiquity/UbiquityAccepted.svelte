<script lang="ts">
	export let applicantName: string;
	export let schoolName: string;
	export let primaryColor: string;
	export let footerDomain: string;
	import BackToInboxButton from '$lib/components/common/BackToInboxButton.svelte';
</script>

<div class="min-h-screen bg-slate-200 text-slate-900 font-serif flex flex-col">
	<!-- HEADER -->
	<header class="bg-white border-b border-slate-300">
		<div class="max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
			<div>
				<div class="flex items-center gap-2">
					<div class="text-2xl font-bold" style={`color: ${primaryColor};`}>
						{schoolName}
					</div>
					<!-- ALIEN WRITING SVG -->
					<svg width="100" height="30" viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M10,20 Q15,5 20,20 T30,20"
							stroke={primaryColor}
							stroke-width="2"
							fill="none"
						/>
						<circle cx="15" cy="10" r="2" fill={primaryColor} />
						<path d="M35,10 L45,25 L55,10" stroke={primaryColor} stroke-width="2" fill="none" />
						<rect x="42" y="5" width="6" height="6" fill={primaryColor} />
						<path
							d="M60,15 C60,5 70,5 70,15 S80,25 80,15"
							stroke={primaryColor}
							stroke-width="2"
							fill="none"
						/>
						<line x1="85" y1="5" x2="85" y2="25" stroke={primaryColor} stroke-width="2" />
						<circle cx="95" cy="15" r="3" stroke={primaryColor} stroke-width="2" fill="none" />
						<circle cx="95" cy="15" r="1" fill={primaryColor} />
					</svg>
				</div>
				<div class="text-[11px] tracking-[0.15em] uppercase text-slate-700">
					TransDimensional Admissions
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

			<p class="text-[11px] text-slate-700 mb-4">March 20, 2026</p>

			<p class="text-[12px] text-slate-900 mb-4">
				{applicantName}
			</p>

			<p class="text-[12px] leading-relaxed text-slate-900 mb-3">
				Greetings, Earthling {applicantName},
			</p>

			<p class="text-[12px] leading-relaxed text-slate-900 mb-3">
				It is with cosmic pleasure (and a slight temporal displacement) that I write to inform you
				of your acceptance to
				<span class="font-semibold"> {schoolName}</span> for the TransDimensional Mapping program, commencing
				in the star cycle of 2026.
			</p>

			<p class="text-[12px] leading-relaxed text-slate-900 mb-3">
				The Galactic Admissions Council was deeply impressed by your neural patterns, 3rd-density
				resilience, and potential for navigating non-Euclidean geometries. Your application vibrated
				at a frequency compatible with our higher-learning matrix.
			</p>

			<p class="text-[12px] leading-relaxed text-slate-900 mb-3">
				Prepare for your quantum leap. Information regarding wormhole transport, telepathic housing,
				and nutrient synthesis will be beamed directly to your cortex shortly.
			</p>

			<p class="text-[12px] leading-relaxed text-slate-900 mb-3">
				Welcome to the void. We await your arrival.
			</p>

			<p class="text-[12px] leading-relaxed text-slate-900 mt-4">
				Transdimensionally yours,<br />
				<span class="font-semibold">Birdie Jaworski</span><br />
				Interdimensional Dean of Admissions<br />
				{schoolName}
			</p>
		</div>
	</section>

	<!-- FOOTER -->
	<footer class="mt-auto">
		<div class="h-10 flex items-center" style={`background-color: ${primaryColor};`}>
			<div
				class="max-w-5xl mx-auto px-6 w-full flex items-center justify-between text-[11px] text-white"
			>
				<span>&copy; {footerDomain} ∞</span>
				<span class="opacity-80">
					PredictAdmit.com simulation · Not affiliated with the Galactic Federation
				</span>
			</div>
		</div>
	</footer>
</div>
