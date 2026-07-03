<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import PortalShareLauncher from '$lib/components/portal/PortalShareLauncher.svelte';
	import SimulationBadge from '$lib/components/portal/SimulationBadge.svelte';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { portalDecisionHeaderVisible, portalDecisionViewed, headerVisible } from '$lib/stores/ui';

	let { children } = $props();

	// Reset portal view state when navigating between schools or back home
	$effect(() => {
		if ($page.url.pathname) {
			portalDecisionViewed.set(false);
			portalDecisionHeaderVisible.set(false);
			headerVisible.set(true);
		}
	});

	// Automatically grant Pro status to signed-in users
	$effect(() => {
		const session = $page.data.session;
		if (session?.user) {
			userProfile.update((u) => {
				if (!u.isPro) {
					return { ...u, isPro: true };
				}
				return u;
			});
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SiteHeader />

<div class="relative z-10 min-h-screen">
	{@render children()}
</div>

<PortalShareLauncher />
<SimulationBadge />
