<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { aiDecisionsBySlug } from '$lib/stores/results';

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
	// Only decisions tagged source:'ai' — manual/random sim decisions never show the button.
	$: decision = $aiDecisionsBySlug[slug];
</script>

{#if visible && googleSignedIn && decision}
	<div class="fixed bottom-20 right-6 z-40" transition:fade={{ duration: 300 }}>
		<button
			on:click={() => goto(`/results/${slug}`)}
			class="flex items-center gap-2 rounded-full px-5 py-3 font-sans text-sm font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl active:scale-95"
			style="background-color: {color};"
		>
			Deep Dive: Why did I get {decision}?
		</button>
	</div>
{/if}
