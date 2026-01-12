<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>Junior Diagnostic | PredictAdmit</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 font-sans flex flex-col">
	<!-- HERO SECTION -->
	<section class="bg-white border-b border-slate-200">
		<div class="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center space-y-8">
			<div
				class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-[#0052CC] uppercase tracking-wide"
			>
				<span class="w-1.5 h-1.5 rounded-full bg-[#0052CC]"></span>
				For Class of 2027
			</div>

			<h1 class="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
				Find your <span class="text-[#0052CC]">Application Gap</span> <br />
				before admissions does.
			</h1>

			<p class="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
				Most students walk into senior fall blind. We project your current stats into next year's
				applicant pool to calculate your rejection probability—and how to fix it.
			</p>

			<div class="flex flex-col sm:flex-row justify-center gap-4 pt-6">
				<Button
					on:click={() => goto('/ai')}
					class="px-8 py-4 text-base font-bold bg-[#0052CC] text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
				>
					Start Free AI Diagnostic
				</Button>
				<Button
					variant="secondary"
					class="px-8 py-4 text-base font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
				>
					View Sample Report
				</Button>
			</div>
		</div>
	</section>

	<div class="flex-1 w-full max-w-6xl mx-auto px-6 py-20 space-y-24">
		<!-- VISUAL: Gap Analysis -->
		<section class="grid md:grid-cols-12 gap-12 items-center">
			<!-- Chart Column -->
			<div
				class="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden"
			>
				<!-- Mock Chart UI -->
				<div class="space-y-8 relative z-10">
					<div class="flex items-center justify-between border-b border-slate-100 pb-4">
						<h3 class="font-bold text-slate-900">Gap Analysis: Stanford '26</h3>
						<span class="text-xs font-bold bg-red-50 text-red-600 px-2 py-1 rounded">High Risk</span
						>
					</div>

					<div class="space-y-6">
						<!-- Metric 1 -->
						<div class="space-y-2">
							<div class="flex justify-between text-sm">
								<span class="font-bold text-slate-700">Course Rigor</span>
								<span class="font-bold text-red-600">-15% Deficit</span>
							</div>
							<div class="h-4 bg-slate-100 rounded-full overflow-hidden flex">
								<div class="bg-slate-300 w-[65%] h-full rounded-r-sm"></div>
								<div
									class="flex-1 border-l-2 border-dashed border-slate-300 relative group cursor-help"
								>
									<div class="absolute inset-0 bg-red-50/50"></div>
									<span class="absolute top-5 right-0 text-[10px] text-slate-400 font-mono"
										>Target Threshold</span
									>
								</div>
							</div>
						</div>

						<!-- Metric 2 -->
						<div class="space-y-2">
							<div class="flex justify-between text-sm">
								<span class="font-bold text-slate-700">Extracurricular Impact</span>
								<span class="font-bold text-[#0052CC]">Top 5%</span>
							</div>
							<div class="h-4 bg-slate-100 rounded-full overflow-hidden relative">
								<div
									class="bg-[#0052CC] w-[95%] h-full rounded-full shadow-[0_0_10px_rgba(0,82,204,0.3)]"
								></div>
							</div>
						</div>

						<!-- Metric 3 -->
						<div class="space-y-2">
							<div class="flex justify-between text-sm">
								<span class="font-bold text-slate-700">Intellectual Vitality (Essays)</span>
								<span class="font-bold text-amber-600">Needs Development</span>
							</div>
							<div class="h-4 bg-slate-100 rounded-full overflow-hidden flex">
								<div class="bg-amber-400 w-[55%] h-full rounded-r-sm"></div>
							</div>
						</div>
					</div>

					<div class="p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-4 items-start">
						<div
							class="w-8 h-8 rounded-full bg-[#0052CC] text-white flex items-center justify-center font-bold text-sm shrink-0"
						>
							AI
						</div>
						<div>
							<p class="text-sm text-slate-700 leading-relaxed font-medium">
								<strong class="text-slate-900">Insight:</strong> While your extracurricular profile
								is Ivy-tier, your course rigor falls short for Stanford Engineering. Adding
								<em class="text-slate-900">AP Physics C</em> next year can close this gap by 8%.
							</p>
						</div>
					</div>
				</div>

				<!-- Grid Pattern BG -->
				<div
					class="absolute inset-0 opacity-[0.03] bg-[linear-gradient(right,#80808012_1px,transparent_1px),linear-gradient(bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
				></div>
			</div>

			<!-- Text Column -->
			<div class="md:col-span-5 space-y-8">
				<div class="space-y-4">
					<h2 class="text-3xl font-bold text-slate-900">Data-driven brutal honesty.</h2>
					<p class="text-slate-500 leading-relaxed">
						Your school counselor sees 500 students. Our AI sees millions of data points from
						historical admissions cycles. We don't just tell you "good job"—we tell you exactly why
						you might get rejected.
					</p>
				</div>

				<ul class="space-y-6">
					<li class="flex gap-4">
						<div
							class="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold text-lg"
						>
							1
						</div>
						<div>
							<h4 class="font-bold text-slate-900">Transcript Audit</h4>
							<p class="text-sm text-slate-500 mt-1">
								We scan your grades against 5 years of admitted student data from your region.
							</p>
						</div>
					</li>
					<li class="flex gap-4">
						<div
							class="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold text-lg"
						>
							2
						</div>
						<div>
							<h4 class="font-bold text-slate-900">Activity Valuator</h4>
							<p class="text-sm text-slate-500 mt-1">
								Is your "Founder" title worthless? We objectively score your leadership impact.
							</p>
						</div>
					</li>
					<li class="flex gap-4">
						<div
							class="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold text-lg"
						>
							3
						</div>
						<div>
							<h4 class="font-bold text-slate-900">Demographic Context</h4>
							<p class="text-sm text-slate-500 mt-1">
								How you compare specifically to your peer group and zip code.
							</p>
						</div>
					</li>
				</ul>
			</div>
		</section>

		<!-- DEEP DIVE CARDS -->
		<section class="grid md:grid-cols-3 gap-8">
			<Card class="bg-white border-slate-200 hover:border-[#0052CC] transition-colors group">
				<div class="p-8 h-full flex flex-col justify-between space-y-6">
					<div class="space-y-4">
						<div
							class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
						>
							📈
						</div>
						<h3 class="text-xl font-bold text-slate-900">Score Projection</h3>
						<p class="text-slate-500 leading-relaxed text-sm">
							Input your current standardized test scores and GPA. We'll forecast your final
							academic index based on your trajectory.
						</p>
					</div>
					<div class="text-[#0052CC] font-bold text-sm flex items-center gap-2">
						Analyze Trends <span class="group-hover:translate-x-1 transition-transform">&rarr;</span
						>
					</div>
				</div>
			</Card>

			<Card class="bg-white border-slate-200 hover:border-[#0052CC] transition-colors group">
				<div class="p-8 h-full flex flex-col justify-between space-y-6">
					<div class="space-y-4">
						<div
							class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
						>
							🎯
						</div>
						<h3 class="text-xl font-bold text-slate-900">School List Builder</h3>
						<p class="text-slate-500 leading-relaxed text-sm">
							Stop applying blindly. We generate a balanced list of Reach, Target, and Safety
							schools perfectly matched to your Data Profile.
						</p>
					</div>
					<div class="text-[#0052CC] font-bold text-sm flex items-center gap-2">
						Build List <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
					</div>
				</div>
			</Card>

			<Card class="bg-[#0052CC] border-[#0052CC] text-white shadow-xl shadow-blue-200">
				<div class="p-8 h-full flex flex-col justify-between space-y-6">
					<div class="space-y-4">
						<div
							class="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center text-2xl"
						>
							🚀
						</div>
						<h3 class="text-xl font-bold">Fix the Gap</h3>
						<p class="text-blue-100 leading-relaxed text-sm">
							Identify your weaknesses before they become rejections. Get your personalized roadmap
							today.
						</p>
					</div>
					<Button
						on:click={() => goto('/ai')}
						class="w-full bg-white text-[#0052CC] hover:bg-blue-50 font-bold border-none"
					>
						Get My Diagnostic
					</Button>
				</div>
			</Card>
		</section>
	</div>

	<SiteFooter />
</main>
