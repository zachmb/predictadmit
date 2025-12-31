<script lang="ts">
	import { blogPosts, type BlogPost } from '$lib/config/blogPosts';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import Card from '$lib/components/common/Card.svelte';

	// Highlight the first post as featured
	const featuredPost = blogPosts[0];
	const recentPosts = blogPosts.slice(1);
</script>

<svelte:head>
	<title>Admissions Insights | PredictAdmit Blog</title>
	<meta
		name="description"
		content="Expert insights, data-driven analysis, and deep dives into the college admissions simulation engine."
	/>
</svelte:head>
<div class="min-h-screen bg-slate-50 font-sans flex flex-col">
	<main class="flex-1 max-w-7xl mx-auto px-6 py-16 w-full space-y-20 animate-enter">
		<!-- HERO SECTION -->
		<section class="text-center space-y-6 max-w-3xl mx-auto">
			<h1 class="text-5xl font-bold tracking-tight text-slate-900">
				PredictAdmit <span class="text-blue-600">Insights</span>
			</h1>
			<p class="text-xl text-slate-600 leading-relaxed">
				Decoding the black box of elite admissions. Data science, simulation theory, and the hard
				truths about getting into the Ivy League.
			</p>
		</section>

		<!-- FEATURED POST -->
		<section>
			<a
				href="/blog/{featuredPost.slug}"
				class="group block relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
			>
				<div
					class="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 group-hover:scale-105 transition-transform duration-700"
				></div>
				<div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

				<div class="relative z-10 p-10 md:p-16 flex flex-col justify-center h-full min-h-[400px]">
					<div class="space-y-6 max-w-3xl">
						<div
							class="flex items-center gap-4 text-blue-200 text-sm font-bold uppercase tracking-wider"
						>
							<span>Featured Article</span>
							<span>&bull;</span>
							<span>{featuredPost.date}</span>
						</div>
						<h2 class="text-4xl md:text-5xl font-bold !text-white leading-tight transition-colors">
							{featuredPost.title}
						</h2>
						<p class="text-lg text-blue-100/90 leading-relaxed max-w-2xl">
							{featuredPost.excerpt}
						</p>
						<div class="pt-4">
							<span
								class="inline-flex items-center gap-2 text-white font-bold border-b-2 border-blue-400 pb-1"
							>
								Read Full Article <svg
									class="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									></path></svg
								>
							</span>
						</div>
					</div>
				</div>
			</a>
		</section>

		<!-- RECENT POSTS GRID -->
		<section>
			<h3 class="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
				Latest Articles
				<span class="h-px bg-slate-200 flex-1"></span>
			</h3>
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each recentPosts as post}
					<a
						href="/blog/{post.slug}"
						class="group flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
					>
						<div
							class="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
						></div>
						<div class="p-8 flex-1 flex flex-col">
							<div
								class="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4"
							>
								<span class="text-blue-600">{post.tags[0]}</span>
								<span>&bull;</span>
								<span>{post.date}</span>
							</div>
							<h4
								class="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors"
							>
								{post.title}
							</h4>
							<p class="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
								{post.excerpt}
							</p>
							<div class="flex items-center justify-between text-xs pt-6 border-t border-slate-100">
								<span class="font-medium text-slate-500">By {post.author}</span>
								<span class="text-blue-600 font-bold group-hover:translate-x-1 transition-transform"
									>Read &rarr;</span
								>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</section>
	</main>

	<SiteFooter />
</div>
