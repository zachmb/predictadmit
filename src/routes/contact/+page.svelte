<script>
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
</script>

<svelte:head>
	<title>Contact Us | PredictAdmit</title>
</svelte:head>

<main class="min-h-screen pa-grid font-sans text-navy flex flex-col">
	<div class="flex-1 flex flex-col justify-center items-center px-6 py-24">
		<div
			class="max-w-2xl w-full pa-card p-12 text-center space-y-8"
		>
			<div
				class="w-16 h-16 bg-blue text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
			>
				✉️
			</div>
			<h1 class="text-4xl font-display text-navy">Get in touch</h1>
			<p class="text-lg text-muted max-w-lg mx-auto leading-relaxed">
				Question about how the simulation works, or a billing issue on your Pro account? Email us. A real person reads it.
			</p>

			<div class="py-8">
				<a
					href="mailto:hello@predictadmit.com"
					class="inline-flex items-center gap-3 text-2xl font-display text-blue hover:text-blue-dark transition-colors border-b-2 border-cyan hover:border-blue pb-1"
				>
					hello@predictadmit.com
				</a>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-4">
				<div class="p-4 pa-inset">
					<h3 class="font-display text-navy mb-1">Support</h3>
					<p class="text-sm text-muted">Account trouble, refunds, billing.</p>
				</div>
				<div class="p-4 pa-inset">
					<h3 class="font-display text-navy mb-1">Partnerships</h3>
					<p class="text-sm text-muted">Schools and counselors, start here.</p>
				</div>
			</div>
		</div>
	</div>
	<SiteFooter />
</main>
