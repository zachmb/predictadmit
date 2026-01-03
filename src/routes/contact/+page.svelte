<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
</script>

<svelte:head>
	<title>Contact Us | PredictAdmit</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 font-sans flex flex-col">
	<main class="flex-1 max-w-4xl mx-auto px-6 py-20 w-full animate-enter text-center">
		<h1 class="text-4xl font-bold text-slate-900 mb-6">Get in Touch</h1>
		<p class="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
			Have a question about the simulation? Found a bug? Just want to say hello? We'd love to hear
			from you.
		</p>

		<div class="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 max-w-xl mx-auto">
			<div class="mb-8">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-12 w-12 text-blue-600 mx-auto mb-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
				<h3 class="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
				<p class="text-slate-500">Our team typically responds within 24 hours.</p>
			</div>

			<a
				href="mailto:hello@predictadmit.com"
				class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-lg w-full"
			>
				hello@predictadmit.com
			</a>
		</div>
	</main>

	<SiteFooter />
</div>
