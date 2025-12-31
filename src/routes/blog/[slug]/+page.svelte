<script lang="ts">
	import { page } from '$app/stores';
	import { blogPosts, type BlogPost } from '$lib/config/blogPosts';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import Button from '$lib/components/common/Button.svelte';

	$: slug = $page.params.slug;
	$: post = blogPosts.find((p) => p.slug === slug);
</script>

<svelte:head>
	<title>{post ? post.title : 'Article Not Found'} | PredictAdmit Blog</title>
	{#if post}
		<meta name="description" content={post.excerpt} />
	{/if}
</svelte:head>
<div class="min-h-screen bg-white font-sans flex flex-col">
	{#if post}
		<article class="flex-1 animate-enter">
			<!-- Header -->
			<header
				class="bg-gradient-to-r from-blue-900 to-indigo-900 border-b border-blue-800 py-20 px-6 relative overflow-hidden"
			>
				<div class="absolute inset-0 bg-black/20"></div>
				<!-- Back Tab -->
				<div class="absolute top-6 left-6 z-20">
					<a
						href="/blog"
						class="inline-flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full transition-all group"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-4 h-4 group-hover:-translate-x-1 transition-transform"
						>
							<path
								fill-rule="evenodd"
								d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
								clip-rule="evenodd"
							/>
						</svg>
						Back to Insights
					</a>
				</div>
				<div class="relative z-10 max-w-3xl mx-auto text-center space-y-6">
					<div
						class="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-200"
					>
						{#each post.tags as tag}
							<span class="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">{tag}</span>
						{/each}
					</div>
					<h1 class="text-4xl md:text-6xl font-bold text-white leading-tight">
						{post.title}
					</h1>
					<div class="flex items-center justify-center gap-3 text-blue-200 font-medium">
						<span>{post.date}</span>
						<span>&bull;</span>
						<span>By {post.author}</span>
					</div>
				</div>
			</header>

			<!-- Content -->
			<div class="max-w-3xl mx-auto px-6 py-16">
				<div
					class="prose prose-lg prose-slate prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800"
				>
					<p class="lead text-xl text-slate-600 mb-10 font-medium">{post.excerpt}</p>
					{@html post.content}
				</div>

				<!-- CTA -->
				<div class="mt-20 p-8 bg-slate-900 rounded-2xl text-center space-y-6 shadow-2xl">
					<h3 class="text-2xl font-bold text-white">Don't Just Read About It. Simulate It.</h3>
					<p class="text-slate-300 max-w-lg mx-auto">
						See exactly how your application performs against our AI admissions committee. Get
						instant, calibrated feedback.
					</p>
					<div class="pt-2">
						<a
							href="/ai"
							class="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-8 py-3 text-lg rounded-lg transition-colors"
						>
							Run Free Simulation &rarr;
						</a>
					</div>
				</div>
			</div>
		</article>
	{:else}
		<div class="flex-1 flex flex-col items-center justify-center py-32 text-center px-6">
			<h1 class="text-4xl font-bold text-slate-900 mb-4">Article Not Found</h1>
			<p class="text-slate-600 mb-8">
				The article you are looking for does not exist or has been moved.
			</p>
			<a
				href="/blog"
				class="inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
				>Back to Blog</a
			>
		</div>
	{/if}

	<SiteFooter />
</div>
