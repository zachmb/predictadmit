<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';
</script>

<svelte:head>
	<title>Research Hub | PredictAdmit</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 font-sans flex flex-col">
	<div class="flex-1 w-full max-w-[1000px] mx-auto px-6 py-12 space-y-12">
		<!-- HEADER -->
		<section class="text-center space-y-4 max-w-2xl mx-auto">
			<h1 class="text-3xl font-bold text-slate-900">Research & Internship Hub</h1>
			<p class="text-slate-600 leading-relaxed">
				Exclusive roles for PredictAdmit members.
				<br />
				Build your "Spike" with high-impact, verifyable non-profit work.
			</p>
		</section>

		<!-- FILTER BAR -->
		<div class="flex flex-wrap gap-2 justify-center">
			<button class="px-4 py-1.5 rounded-full bg-slate-900 text-white text-sm font-semibold"
				>All Roles</button
			>
			<button
				class="px-4 py-1.5 rounded-full bg-white text-slate-600 border border-slate-200 text-sm hover:bg-slate-50"
				>STEM Research</button
			>
			<button
				class="px-4 py-1.5 rounded-full bg-white text-slate-600 border border-slate-200 text-sm hover:bg-slate-50"
				>Non-Profit Leadership</button
			>
			<button
				class="px-4 py-1.5 rounded-full bg-white text-slate-600 border border-slate-200 text-sm hover:bg-slate-50"
				>Humanities</button
			>
		</div>

		<!-- JOB LISTINGS -->
		<section class="space-y-4">
			<!-- LISTING 1 -->
			<Card
				class="bg-white border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group"
			>
				<div class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div class="flex items-start gap-4">
						<div
							class="w-12 h-12 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-lg shrink-0"
						>
							SF
						</div>
						<div>
							<h3 class="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
								Cognitive Behavioral Therapy Assistant
							</h3>
							<div class="text-sm text-slate-500 font-medium mb-2">
								San Francisco (Remote) • The Prestige Project
							</div>
							<div class="flex gap-2">
								<span
									class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase"
									>Psychology</span
								>
								<span
									class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase"
									>Leadership</span
								>
							</div>
						</div>
					</div>
					<div class="flex-shrink-0">
						<Button class="w-full md:w-auto text-sm">Apply Now</Button>
					</div>
				</div>
			</Card>

			<!-- LISTING 2 -->
			<Card
				class="bg-white border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group"
			>
				<div class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div class="flex items-start gap-4">
						<div
							class="w-12 h-12 rounded bg-green-50 text-green-700 flex items-center justify-center font-bold text-lg shrink-0"
						>
							CR
						</div>
						<div>
							<h3 class="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
								Climate Data Analyst (Junior Fellow)
							</h3>
							<div class="text-sm text-slate-500 font-medium mb-2">
								Remote • ClimateResilience.org
							</div>
							<div class="flex gap-2">
								<span
									class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase"
									>Data Science</span
								>
								<span
									class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase"
									>Environment</span
								>
							</div>
						</div>
					</div>
					<div class="flex-shrink-0">
						<Button class="w-full md:w-auto text-sm">Apply Now</Button>
					</div>
				</div>
			</Card>

			<!-- LISTING 3 -->
			<Card
				class="bg-white border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group"
			>
				<div class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div class="flex items-start gap-4">
						<div
							class="w-12 h-12 rounded bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-lg shrink-0"
						>
							AI
						</div>
						<div>
							<h3 class="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
								LLM Training Data Specialist
							</h3>
							<div class="text-sm text-slate-500 font-medium mb-2">
								Remote • OpenSource AI Collective
							</div>
							<div class="flex gap-2">
								<span
									class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase"
									>Computer Science</span
								>
								<span
									class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase"
									>Research</span
								>
							</div>
						</div>
					</div>
					<div class="flex-shrink-0">
						<Button class="w-full md:w-auto text-sm">Apply Now</Button>
					</div>
				</div>
			</Card>
		</section>

		<!-- LOCKED STATE -->
		<section
			class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 text-center text-white relative overflow-hidden"
		>
			<div class="relative z-10 space-y-6">
				<div
					class="w-12 h-12 rounded-full bg-slate-700 mx-auto flex items-center justify-center text-xl"
				>
					🔒
				</div>
				<h3 class="text-2xl font-bold">Unlock 50+ More Opportunities</h3>
				<p class="text-slate-300 max-w-lg mx-auto">
					Premium members get access to our full database of professor-led research positions and
					verified non-profit board seats.
				</p>
				<Button class="bg-white text-slate-900 hover:bg-slate-100 border-none px-8"
					>Upgrade to View All</Button
				>
			</div>

			<!-- Decorative Background -->
			<div
				class="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
			></div>
		</section>
	</div>

	<SiteFooter />
</main>
