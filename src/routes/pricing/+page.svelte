<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import { fly } from 'svelte/transition';
</script>

<svelte:head>
	<title>PredictAdmit – Pricing (Now Free)</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 text-slate-900">
	<div class="max-w-4xl mx-auto px-4 py-12 space-y-12">
		<header class="text-center space-y-4">
			<h1 class="text-5xl font-bold tracking-tight text-slate-900">PredictAdmit is now Free</h1>
			<p class="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
				We've moved to a completely free model. Premium admissions tools are now accessible to every student, everywhere.
			</p>
		</header>

		<section class="grid gap-12 md:grid-cols-2 items-center max-w-5xl mx-auto">
			<!-- Value Props -->
			<div class="space-y-8 text-slate-700 pr-8">
				<div class="space-y-4">
					<h3 class="text-3xl font-bold text-slate-900 tracking-tight">
						Mission-Driven Admissions
					</h3>
					<p class="text-slate-600 text-lg">
						The most powerful admissions tools, now available to all students. No paywalls, no "pro" tiers, just pure access.
					</p>
				</div>

				<ul class="space-y-6">
					<li class="flex items-start gap-4">
						<div class="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
							<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
						<div>
							<strong class="block text-slate-900 font-semibold mb-1">Unlimited AI Simulations</strong>
							<span class="text-slate-600 leading-relaxed"
								>Run as many simulations as you need to perfect your profile. No token limits.</span
							>
						</div>
					</li>
					<li class="flex items-start gap-4">
						<div class="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
							<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<div>
							<strong class="block text-slate-900 font-semibold mb-1">Deep-Dive Explanations</strong
							>
							<span class="text-slate-600 leading-relaxed"
								>Get detailed reasoning behind every simulated decision, fully unlocked.</span
							>
						</div>
					</li>
					<li class="flex items-start gap-4">
						<div class="p-2 bg-emerald-100 rounded-lg text-emerald-600 shrink-0">
							<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<strong class="block text-slate-900 font-semibold mb-1">Actionable Guidance</strong>
							<span class="text-slate-600 leading-relaxed"
								>Concrete steps to improve your application before submission.</span
							>
						</div>
					</li>
				</ul>
			</div>

			<!-- Pricing Card -->
			<div class="relative group group/card perspective-1000 z-10">
				<div
					class="relative rounded-[1.5rem] bg-white/80 backdrop-blur-2xl p-8 lg:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] flex flex-col items-center text-center border border-white/60"
				>
					<div class="h-8 mb-6 flex items-center justify-center w-full">
						<span
							class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] uppercase font-bold tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/30"
						>
							Free Forever
						</span>
					</div>

					<h2 class="text-sm font-bold text-slate-500 tracking-[0.25em] uppercase mb-8">
						PredictAdmit Pro
					</h2>

					<div class="flex items-end gap-2 mb-8 h-24 overflow-visible">
						<span class="text-7xl font-bold text-slate-900 tracking-tighter tabular-nums pb-1">
							$0
						</span>
						<span class="text-lg text-slate-500 font-medium mb-4 opacity-80"> / forever </span>
					</div>

					<div class="h-6 w-full relative mb-8 overflow-hidden">
						<p class="text-sm font-medium text-slate-600 transition-all duration-300 transform">
							Completely free for all students.
						</p>
					</div>

					<a
						href="/ai"
						class="w-full relative group/btn overflow-hidden rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-xl hover:shadow-2xl hover:bg-slate-800 transition-all duration-300 hover:-translate-y-0.5 text-center"
					>
						<div
							class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"
						></div>
						<div class="relative flex items-center justify-center gap-2">
							<span>Start Your Simulation</span>
							<svg
								class="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M14 5l7 7m0 0l-7 7m7-7H3"
								/>
							</svg>
						</div>
					</a>

					<p
						class="mt-6 text-[10px] text-slate-400 flex items-center gap-1.5 justify-center opacity-70"
					>
						No payment details required
					</p>
				</div>
			</div>
		</section>

		<!-- Message Section -->
		<section class="max-w-xl mx-auto pt-16 pb-12 text-center">
			<div class="relative p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
				<div class="flex flex-col items-center gap-6">
					<div class="space-y-4">
						<h3 class="text-2xl font-bold text-blue-900">Why are we free?</h3>
						<p class="text-lg text-slate-600 font-medium leading-relaxed">
							The college admissions landscape is becoming increasingly expensive and gatekept. We believe every student deserves high-quality feedback on their application, regardless of their family's income.
						</p>
						<p class="text-slate-500 italic">
							"Democratizing elite admissions through technology."
						</p>
					</div>
				</div>
			</div>
		</section>
	</div>
</main>

<SiteFooter />
