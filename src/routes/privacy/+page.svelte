<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
</script>

<svelte:head>
	<title>Privacy Policy | PredictAdmit</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 font-sans flex flex-col">
	<main class="flex-1 max-w-4xl mx-auto px-6 py-12 w-full animate-enter">
		<h1 class="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
		<div class="prose prose-slate max-w-none">
			<p>Last updated: October 2025</p>
			<h3>1. Data Collection</h3>
			<p>
				We collect information you provide directly to us, such as when you create an account, input
				your academic profile, or contact us. This includes GPA, test scores, extracurriculars, and
				essays.
			</p>
			<h3>2. Use of Data</h3>
			<div>
				We use your data to:
				<ul class="list-disc pl-5 mt-2 space-y-1">
					<li>Provide and improve our simulation services.</li>
					<li>Train our AI models (anonymized data only).</li>
					<li>Communicate with you about your account.</li>
				</ul>
			</div>
			<h3>3. Data Sharing</h3>
			<p>
				We do not sell your personal data to third parties. We may share data with service providers
				who help us operate our platform (e.g., hosting, analytics).
			</p>
			<h3>4. Data Security</h3>
			<p>
				We implement reasonable security measures to protect your information. However, no method of
				transmission over the internet is 100% secure.
			</p>
		</div>
	</main>

	<SiteFooter />
</div>
