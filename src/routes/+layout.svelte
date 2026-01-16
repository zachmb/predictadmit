<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	// import SiteHeader from '$lib/components/layout/SiteHeader.svelte'; // Replaced by IslandNav
	import IslandNav from '$lib/components/glass/IslandNav.svelte';
	import CausticBackground from '$lib/components/glass/CausticBackground.svelte';
	import { page } from '$app/stores';
	import { portalDecisionViewed, headerVisible } from '$lib/stores/ui';

	let { children } = $props();

	// Reset portal view state when navigating between schools or back home
	$effect(() => {
		if ($page.url.pathname) {
			portalDecisionViewed.set(false);
			headerVisible.set(true);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<CausticBackground />
<IslandNav />

<div class="relative z-10 min-h-screen">
	{@render children()}
</div>
