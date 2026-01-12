<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';
</script>

<svelte:head>
	<title>Research Hub | PredictAdmit</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 font-sans flex flex-col">
	<div class="flex-1 w-full max-w-5xl mx-auto px-6 py-24 md:py-32 space-y-20">
		<!-- HEADER -->
		<section class="text-center space-y-6 max-w-3xl mx-auto">
			<h1 class="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
				Build your <span class="text-[#0052CC]">Spike.</span>
			</h1>
			<p class="text-lg text-slate-500 leading-relaxed font-light">
				Admissions officers ignore "generic" clubs. You need high-impact, verifiable roles to stand
				out. Browse our database of exclusive research and non-profit opportunities.
			</p>
		</section>

		<!-- FILTER BAR -->
		<div class="flex flex-wrap gap-3 justify-center">
			<button
				class="px-5 py-2 rounded-full bg-[#0052CC] text-white text-sm font-bold shadow-md shadow-blue-200"
				>All Roles</button
			>
			<button
				class="px-5 py-2 rounded-full bg-white text-slate-600 border border-slate-200 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
				>STEM Research</button
			>
			<button
				class="px-5 py-2 rounded-full bg-white text-slate-600 border border-slate-200 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
				>Non-Profit Leadership</button
			>
			<button
				class="px-5 py-2 rounded-full bg-white text-slate-600 border border-slate-200 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
				>Humanities</button
			>
		</div>

		<!-- JOB LISTINGS -->
		<section class="space-y-4">
			<!-- LISTING 1 -->
			<div
				class="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#0052CC] hover:shadow-lg transition-all cursor-pointer group"
			>
				<div class="flex items-start gap-5">
					<div
						class="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xl shrink-0 border border-indigo-100"
					>
						SF
					</div>
					<div>
						<h3
							class="font-bold text-lg text-slate-900 group-hover:text-[#0052CC] transition-colors"
						>
							Cognitive Behavioral Therapy Assistant
						</h3>
						<div class="text-sm text-slate-500 font-medium mb-3 flex items-center gap-2">
							<span>San Francisco (Remote)</span>
							<span class="w-1 h-1 rounded-full bg-slate-300"></span>
							<span>The Prestige Project</span>
						</div>
						<div class="flex gap-2">
							<span
								class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wide"
								>Psychology</span
							>
							<span
								class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wide"
								>Leadership</span
							>
						</div>
					</div>
				</div>
				<div class="flex-shrink-0">
					<button
						class="w-full md:w-auto px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors text-sm"
						>Apply Now</button
					>
				</div>
			</div>

			<!-- LISTING 2 -->
			<div
				class="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#0052CC] hover:shadow-lg transition-all cursor-pointer group"
			>
				<div class="flex items-start gap-5">
					<div
						class="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xl shrink-0 border border-emerald-100"
					>
						CR
					</div>
					<div>
						<h3
							class="font-bold text-lg text-slate-900 group-hover:text-[#0052CC] transition-colors"
						>
							Climate Data Analyst (Junior Fellow)
						</h3>
						<div class="text-sm text-slate-500 font-medium mb-3 flex items-center gap-2">
							<span>Remote</span>
							<span class="w-1 h-1 rounded-full bg-slate-300"></span>
							<span>ClimateResilience.org</span>
						</div>
						<div class="flex gap-2">
							<span
								class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wide"
								>Data Science</span
							>
							<span
								class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wide"
								>Environment</span
							>
						</div>
					</div>
				</div>
				<div class="flex-shrink-0">
					<button
						class="w-full md:w-auto px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors text-sm"
						>Apply Now</button
					>
				</div>
			</div>

			<!-- LISTING 3 -->
			<div
				class="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#0052CC] hover:shadow-lg transition-all cursor-pointer group"
			>
				<div class="flex items-start gap-5">
					<div
						class="w-14 h-14 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-black text-xl shrink-0 border border-sky-100"
					>
						AI
					</div>
					<div>
						<h3
							class="font-bold text-lg text-slate-900 group-hover:text-[#0052CC] transition-colors"
						>
							LLM Training Data Specialist
						</h3>
						<div class="text-sm text-slate-500 font-medium mb-3 flex items-center gap-2">
							<span>Remote</span>
							<span class="w-1 h-1 rounded-full bg-slate-300"></span>
							<span>OpenSource AI Collective</span>
						</div>
						<div class="flex gap-2">
							<span
								class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wide"
								>Computer Science</span
							>
							<span
								class="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wide"
								>Research</span
							>
						</div>
					</div>
				</div>
				<div class="flex-shrink-0">
					<button
						class="w-full md:w-auto px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors text-sm"
						>Apply Now</button
					>
				</div>
			</div>
		</section>

		<!-- LOCKED STATE -->
		<section
			class="bg-gradient-to-br from-[#001F3F] to-[#003366] rounded-3xl p-10 text-center text-white relative overflow-hidden shadow-2xl"
		>
			<div class="relative z-10 space-y-8">
				<div
					class="w-16 h-16 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-3xl backdrop-blur-sm"
				>
					🔒
				</div>
				<div class="space-y-4 max-w-lg mx-auto">
					<h3 class="text-3xl font-bold tracking-tight">Unlock 50+ More Opportunities</h3>
					<p class="text-blue-100 text-lg">
						Premium members get access to our full database of professor-led research positions and
						verified non-profit board seats.
					</p>
				</div>
				<a
					href="/pro"
					class="inline-block bg-white text-[#001F3F] hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 shadow-lg"
				>
					Upgrade to Unlock Hub
				</a>
			</div>

			<!-- Decorative Background -->
			<div
				class="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"
			></div>
		</section>
	</div>

	<SiteFooter />
</main>
