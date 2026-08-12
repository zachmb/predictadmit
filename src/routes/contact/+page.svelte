<script>
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
</script>

<svelte:head>
	<title>Contact Us | PredictAdmit</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
	<div class="flex-1 flex flex-col justify-center items-center px-6 py-24">
		<div
			class="max-w-2xl w-full bg-white border border-slate-200 rounded-3xl p-12 shadow-xl shadow-slate-200/50 text-center space-y-8"
		>
			<div
				class="w-16 h-16 bg-blue-50 text-[#0052CC] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
			>
				✉️
			</div>
			<h1 class="text-4xl font-bold tracking-tight text-slate-900">Get in touch</h1>
			<p class="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
				Question about how the simulation works, or a billing issue on your Pro account? Email us. A real person reads it.
			</p>

			<div class="py-8">
				<a
					href="mailto:hello@predictadmit.com"
					class="inline-flex items-center gap-3 text-2xl font-bold text-[#0052CC] hover:text-blue-700 transition-colors border-b-2 border-blue-100 hover:border-[#0052CC] pb-1"
				>
					hello@predictadmit.com
				</a>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-4">
				<div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
					<h3 class="font-bold text-slate-900 mb-1">Support</h3>
					<p class="text-sm text-slate-500">Account trouble, refunds, billing.</p>
				</div>
				<div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
					<h3 class="font-bold text-slate-900 mb-1">Partnerships</h3>
					<p class="text-sm text-slate-500">Schools and counselors, start here.</p>
				</div>
			</div>
		</div>
	</div>
	<SiteFooter />
</main>
