<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { decisionsBySlug } from '$lib/stores/results';

	export let slug: string;
	export let color = '#003262';

	let visible = false;

	onMount(() => {
		const timer = setTimeout(() => {
			visible = true;
		}, 4000);

		return () => clearTimeout(timer);
	});

	$: session = $page.data.session;
	$: googleSignedIn = !!session?.user;
	// Surface on every decision the applicant received — any source — so the
	// deep dive is reachable from all 39 schools' letters, not just AI ones.
	$: decision = $decisionsBySlug[slug];
</script>

{#if visible && googleSignedIn && decision}
	<div
		class="fixed right-4 z-40 sm:right-6"
		style="bottom: calc(5.25rem + env(safe-area-inset-bottom));"
		transition:fade={{ duration: 300 }}
	>
		<button
			on:click={() => goto(`/results/${slug}`)}
			class="flex items-center gap-2 rounded-full px-4 py-3 font-sans text-sm font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl active:scale-95 sm:px-5"
			style="background-color: {color};"
		>
			<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M13 10V3L4 14h7v7l9-11h-7z"
				/>
			</svg>
			<span class="hidden sm:inline">Deep Dive: Why did I get {decision}?</span>
			<span class="sm:hidden">Deep Dive</span>
		</button>
	</div>
{/if}
