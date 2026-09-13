<script lang="ts">
	// A pinned massive-zoom heading (crisp, font-size driven like ScrollZoomStory).
	// The eyebrow + subcopy show first, then the headline zooms from small to huge
	// as you scroll through the pinned stage, then fades to reveal what follows.
	// Used to introduce the "See inside Pro" screenshots. Reduced-motion → static.
	import { onMount } from 'svelte';

	let {
		eyebrow = '',
		pre = '',
		accent = '',
		sub = ''
	}: { eyebrow?: string; pre?: string; accent?: string; sub?: string } = $props();

	let section = $state<HTMLElement | null>(null);
	let p = $state(0);
	let reduced = $state(false);

	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) return;
		let raf = 0;
		const update = () => {
			raf = 0;
			if (!section) return;
			const rect = section.getBoundingClientRect();
			const total = rect.height - window.innerHeight;
			const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
			p = total > 0 ? scrolled / total : 0;
		};
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		update();
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});

	const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b);
	const seg = (x: number, a: number, b: number) => clamp((x - a) / (b - a));

	// Headline zoom: starts small (0.5x), accelerates to massive (~10x), then fades.
	let s = $derived(0.5 + Math.pow(seg(p, 0.04, 0.62), 2) * 9.5);
	let headOpacity = $derived(1 - seg(p, 0.68, 0.86));
	// Eyebrow + sub are visible up front, then clear as the zoom takes over.
	let auxOpacity = $derived((1 - seg(p, 0.14, 0.34)) * seg(p, 0, 0.05));
</script>

{#if reduced}
	<div class="mx-auto max-w-2xl px-6 pt-24 pb-10 text-center space-y-4">
		{#if eyebrow}<span class="inline-block px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full">{eyebrow}</span>{/if}
		<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-slate-900 leading-[1.05]">
			{pre} <span class="text-[#1A4CFF]">{accent}</span>
		</h2>
		{#if sub}<p class="text-lg text-slate-500 leading-relaxed">{sub}</p>{/if}
	</div>
{:else}
	<section bind:this={section} class="relative h-[240vh] bg-slate-50">
		<div class="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
			{#if eyebrow}
				<span
					class="mb-6 inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600"
					style="opacity:{auxOpacity}"
				>{eyebrow}</span>
			{/if}

			<!-- Headline (font-size zoom = crisp). nowrap so its layout never reflows as
			     it grows — it just overflows off-screen. -->
			<h2
				class="font-serif font-medium tracking-tight text-slate-900 whitespace-nowrap"
				style="--s:{s}; font-size: calc(clamp(1.5rem, 7vw, 6rem) * var(--s)); line-height: 1.02; opacity:{headOpacity};"
			>
				{pre} <span class="text-[#1A4CFF]">{accent}</span>
			</h2>

			{#if sub}
				<p class="mt-6 max-w-lg text-lg leading-relaxed text-slate-500" style="opacity:{auxOpacity}">{sub}</p>
			{/if}
		</div>
	</section>
{/if}
