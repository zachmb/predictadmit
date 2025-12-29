<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
</script>

<svelte:head>
	<title>About - PredictAdmit</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 font-sans text-slate-900">
	<!-- Hero Section -->
	<section class="max-w-4xl mx-auto px-6 py-24 text-center">
		<h1 class="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
			Democratizing Admissions Transparency.
		</h1>
		<p class="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
			We believe that the college admissions process shouldn't be a black box. PredictAdmit uses
			data-driven simulations to reveal the "why" behind the decision.
		</p>
	</section>

	<!-- Mission / Vision -->
	<section class="max-w-4xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-12">
		<div>
			<h2 class="text-2xl font-bold text-slate-900 mb-4">The Mission</h2>
			<p class="text-slate-600 leading-relaxed mb-4">
				Every year, millions of students apply to college with no idea how their application is
				actually viewed. They spend months crafting essays, only to receive a generic rejection
				letter.
			</p>
			<p class="text-slate-600 leading-relaxed">
				Our mission is to change that. By simulating the admissions committee's perspective, we give
				students the feedback they need *before* they hit submit.
			</p>
		</div>

		<div>
			<h2 class="text-2xl font-bold text-slate-900 mb-4">The Engine</h2>
			<p class="text-slate-600 leading-relaxed mb-4">
				PredictAdmit isn't just a calculator. It's a comprehensive simulation engine that models the
				holistic review process used by top universities.
			</p>
			<p class="text-slate-600 leading-relaxed">
				From transcript analysis to essay sentiment scoring, we break down your application into the
				metrics that matter most to admissions officers.
			</p>
		</div>
	</section>

	<!-- Team (Mock) -->
	<section class="bg-white border-y border-slate-200 py-24">
		<div class="max-w-4xl mx-auto px-6 text-center">
			<h2 class="text-3xl font-bold text-slate-900 mb-12">Built by Insiders</h2>
			<div class="flex flex-col md:flex-row justify-center gap-12">
				<div class="flex flex-col items-center">
					<div
						class="w-24 h-24 bg-slate-100 rounded-full mb-4 flex items-center justify-center text-3xl"
					>
						👨‍💻
					</div>
					<h3 class="font-bold text-lg">Dread Pirate Roberts</h3>
					<p class="text-blue-600 font-medium text-sm mb-2">Founder & Lead Engineer</p>
					<p class="text-slate-500 text-sm max-w-xs">
						Building the tools I wish I had when I applied.
					</p>
				</div>
				<div class="flex flex-col items-center">
					<div
						class="w-24 h-24 bg-slate-100 rounded-full mb-4 flex items-center justify-center text-3xl"
					>
						🤖
					</div>
					<h3 class="font-bold text-lg">The Algorithm</h3>
					<p class="text-blue-600 font-medium text-sm mb-2">Chief Admissions Officer</p>
					<p class="text-slate-500 text-sm max-w-xs">
						Trained on thousands of real decision outcomes.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="py-24 text-center">
		<h2 class="text-3xl font-bold text-slate-900 mb-6">Ready to see where you stand?</h2>
		<a
			href="/"
			class="inline-flex items-center justify-center font-bold text-sm bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/10"
		>
			Run Simulation
		</a>
	</section>

	<SiteFooter />
</main>
