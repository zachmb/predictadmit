<script lang="ts">
import SiteFooter from '$lib/components/layout/SiteFooter.svelte'; import Button from
'$lib/components/common/Button.svelte'; import Card from '$lib/components/common/Card.svelte';
import {goto} from '$app/navigation';
</script>
<svelte:head>
	<title>Junior Diagnostic | PredictAdmit</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 font-sans flex flex-col">
	<div class="flex-1 w-full max-w-[1000px] mx-auto px-6 py-24 space-y-20">
		<!-- HERO SECTION: The Proposition -->
		<section class="text-center space-y-6">
			<div
				class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 uppercase tracking-wide"
			>
				For Class of 2027
			</div>
			<h1 class="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
				Don't guess.<br />
				<span class="text-blue-700">Project your rejection.</span>
			</h1>
			<p class="text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed">
				Most juniors walk into senior fall blind. We built a diagnostic engine that projects your
				current stats into next year's applicant pool to find your <span
					class="font-bold text-slate-900">Application Gap</span
				>.
			</p>

			<div class="flex justify-center gap-4 pt-4">
				<Button
					on:click={() => goto('/ai')}
					class="px-8 py-3 text-base shadow-lg shadow-slate-200 border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 font-bold"
				>
					Start Free AI Diagnostic
				</Button>
				<Button
					variant="secondary"
					class="px-8 py-3 text-base bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
					>View Sample Report</Button
				>
			</div>
		</section>

		<!-- VISUAL: Gap Analysis Chart (Mock) -->
		<section
			class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12 overflow-hidden relative"
		>
			<div class="absolute top-0 right-0 p-4 opacity-10">
				<svg
					width="200"
					height="200"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1"
					class="text-slate-900"
					><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg
				>
			</div>

			<div class="grid md:grid-cols-2 gap-12 items-center relative z-10">
				<div class="space-y-8">
					<div>
						<h3 class="text-xl font-bold text-slate-900 mb-2">The Application Gap</h3>
						<p class="text-base text-slate-600 font-medium">
							Your profile vs. Admitted Average (Stanford '26)
						</p>
					</div>

					<div class="space-y-6">
						<!-- Metric 1 -->
						<div>
							<div class="flex justify-between text-sm font-bold mb-2">
								<span class="text-slate-800">Academic Rigor</span>
								<span class="text-red-600">-12% Gap</span>
							</div>
							<div class="h-3 bg-slate-100 rounded-full overflow-hidden">
								<div class="h-full bg-slate-400 w-[78%] rounded-full relative">
									<div class="absolute right-0 top-0 bottom-0 w-1 bg-white"></div>
								</div>
								<!-- Target marker (simulated by width of container vs filled) -->
							</div>
						</div>

						<!-- Metric 2 -->
						<div>
							<div class="flex justify-between text-sm font-bold mb-2">
								<span class="text-slate-800">Extracurricular Impact</span>
								<span class="text-emerald-700">On Track</span>
							</div>
							<div class="h-3 bg-slate-100 rounded-full overflow-hidden">
								<div class="h-full bg-emerald-500 w-[95%] rounded-full"></div>
							</div>
						</div>

						<!-- Metric 3 -->
						<div>
							<div class="flex justify-between text-sm font-bold mb-2">
								<span class="text-slate-800">Reader Engagement (Essays)</span>
								<span class="text-red-600">Critical Gap</span>
							</div>
							<div class="h-3 bg-slate-100 rounded-full overflow-hidden">
								<div class="h-full bg-slate-400 w-[40%] rounded-full"></div>
							</div>
						</div>
					</div>

					<div class="pt-2">
						<div
							class="bg-red-50 border border-red-100 rounded-xl p-5 text-sm text-red-900 flex gap-3 items-start shadow-sm"
						>
							<span class="font-bold text-red-700 text-lg">⚠</span>
							<span class="leading-relaxed font-medium"
								><span class="font-bold">PROJECTION:</span> Current trajectory indicates a
								<span class="font-extrabold">94% rejection probability</span>
								for T10 universities. Intervention required in: <u>Course Selection</u>,
								<u>Summer Planning</u>.</span
							>
						</div>
					</div>
				</div>

				<div class="space-y-8 border-l border-slate-200 md:pl-12">
					<h3 class="text-xl font-bold text-slate-900">What we analyze</h3>
					<ul class="space-y-6">
						<li class="flex gap-4 text-base text-slate-700">
							<span
								class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 text-sm font-bold"
								>1</span
							>
							<span class="pt-1.5"
								><strong class="text-slate-900 block mb-1">Transcript Rigor</strong> Are you taking the
								hardest classes available to you?</span
							>
						</li>
						<li class="flex gap-4 text-base text-slate-700">
							<span
								class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 text-sm font-bold"
								>2</span
							>
							<span class="pt-1.5"
								><strong class="text-slate-900 block mb-1">Activity Spike</strong> Do you have a clear
								narrative or just a laundry list of clubs?</span
							>
						</li>
						<li class="flex gap-4 text-base text-slate-700">
							<span
								class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 text-sm font-bold"
								>3</span
							>
							<span class="pt-1.5"
								><strong class="text-slate-900 block mb-1">Demographic Context</strong> How you compare
								specifically to your peer group and zip code.</span
							>
						</li>
					</ul>
				</div>
			</div>
		</section>

		<!-- CALL TO ACTION -->
		<section class="grid md:grid-cols-3 gap-6">
			<Card class="bg-white hover:border-slate-300 transition-colors shadow-sm">
				<div class="p-6 h-full flex flex-col justify-between space-y-4">
					<div class="space-y-2">
						<div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
							📄
						</div>
						<h3 class="font-bold text-slate-900">Transcript Audit</h3>
						<p class="text-base text-slate-600 leading-relaxed font-medium">
							We scan your grades against 5 years of admitted student data from your region.
						</p>
					</div>
				</div>
			</Card>
			<Card class="bg-white hover:border-slate-300 transition-colors shadow-sm">
				<div class="p-6 h-full flex flex-col justify-between space-y-4">
					<div class="space-y-2">
						<div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
							🏆
						</div>
						<h3 class="font-bold text-slate-900">Activity Valuator</h3>
						<p class="text-base text-slate-600 leading-relaxed font-medium">
							Is your "Founder" title worthless? We tell you the truth about your ECs.
						</p>
					</div>
				</div>
			</Card>
			<Card class="bg-white border-slate-200 shadow-xl shadow-slate-200/50">
				<div class="p-6 h-full flex flex-col justify-between space-y-4">
					<div class="space-y-4">
						<h3 class="text-xl font-bold text-slate-900">Fix the Gap.</h3>
						<p class="text-base text-slate-600 leading-relaxed font-medium">
							Identify your weaknesses before they become rejections.
						</p>
					</div>
					<Button class="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold shadow-lg">
						Get My Score
					</Button>
				</div>
			</Card>
		</section>
	</div>

	<SiteFooter />
</main>
