<script lang="ts">
	// Scroll-scrubbed zoom story for the Pro section. A tall section pins a
	// full-screen stage; as you scroll, line 1 ("Pro can do waaaaay more") zooms in
	// and tilts until a letter fills the screen and it goes black, then more lines
	// rise out of the black.
	//
	// CRISP TEXT: the zoom is driven by FONT-SIZE, not transform:scale. Scaling a
	// rasterized layer blurs; changing font-size re-rasterizes the glyphs at the new
	// size every frame, so text stays razor-sharp at any zoom. Only the tilt uses
	// transform (rotate never blurs). Honors prefers-reduced-motion.
	import { onMount } from 'svelte';

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

	// Line 1 — starts well zoomed OUT (0.32x), accelerates (ease-in) to fill the
	// screen and tilt, fading out just as the black wash swallows it.
	let s1 = $derived(0.32 + Math.pow(seg(p, 0, 0.34), 2) * 44);
	let r1 = $derived(seg(p, 0, 0.34) * 5);
	let o1 = $derived(1 - seg(p, 0.29, 0.35));
	let bg = $derived(seg(p, 0.22, 0.34));

	// Lines 2 & 3 do NOT resize — they rise + fade in at a CONSTANT font size so
	// their wrapping (line count, words per line) is identical every frame. Only the
	// single-line headlines do the dramatic zoom. y2/y3 are a small translate for the
	// "rise out of the black" feel; opacity handles the reveal/crossfade.
	let o2 = $derived(clamp(seg(p, 0.33, 0.42) - seg(p, 0.6, 0.68)));
	let y2 = $derived((1 - seg(p, 0.33, 0.46)) * 24);

	let o3 = $derived(seg(p, 0.62, 0.72));
	let y3 = $derived((1 - seg(p, 0.62, 0.75)) * 24);
	let o4 = $derived(seg(p, 0.82, 0.92));
</script>

{#if reduced}
	<div class="mx-auto max-w-3xl px-6 py-24 text-center space-y-6">
		<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-slate-900 leading-[1.05]">
			Pro can do <span class="text-[#1A4CFF]">waaaaay more</span>
		</h2>
		<p class="text-lg leading-relaxed text-slate-500">
			Re-run infinite predictions and see what'll happen. Our tools improve your essays with
			line-by-line feedback, trained on successful applications. And more.
		</p>
	</div>
{:else}
	<section bind:this={section} class="relative h-[320vh] bg-white">
		<div class="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
			<!-- Black wash that fills as line 1 swallows the screen -->
			<div class="pointer-events-none absolute inset-0 bg-slate-950" style="opacity:{bg}"></div>

			<!-- Line 1 (font-size zoom = crisp). nowrap so its layout never reflows as it
			     grows — it just overflows off-screen (a letter fills the view). -->
			<h2
				class="absolute px-6 text-center font-serif font-medium tracking-tight text-slate-900 whitespace-nowrap"
				style="--s:{s1}; font-size: calc(clamp(1.6rem, 8vw, 6.25rem) * var(--s)); line-height: 1; transform: rotate({r1}deg); opacity:{o1};"
			>
				Pro can do <span class="text-[#1A4CFF]">waaaaay more</span>
			</h2>

			<!-- Line 2 — constant size, rises + fades in (no resize = no reflow) -->
			<h2
				class="absolute max-w-[22ch] px-6 text-center font-serif text-3xl font-medium leading-tight tracking-tight text-white sm:max-w-2xl sm:text-5xl"
				style="opacity:{o2}; transform: translateY({y2}px);"
			>
				Re-run infinite predictions. <span class="text-[#6f9bff]">See what'll happen.</span>
			</h2>

			<!-- Line 3 + "and more" — constant size, rises + fades in -->
			<div class="absolute max-w-[24ch] px-6 text-center text-white sm:max-w-2xl" style="opacity:{o3}; transform: translateY({y3}px);">
				<p class="font-serif text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
					Improve your essays with line-by-line feedback, trained on successful applications.
				</p>
				<div
					class="mt-8 flex flex-col items-center gap-2 text-slate-300"
					style="opacity:{o4}"
				>
					<span class="text-lg font-semibold tracking-tight md:text-2xl">and more</span>
					<svg class="h-6 w-6 animate-bounce text-[#6f9bff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
				</div>
			</div>

			<!-- Scroll affordance, fades once you've engaged -->
			<div
				class="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
				style="opacity:{1 - seg(p, 0, 0.08)}"
			>
				Scroll
			</div>
		</div>
	</section>
{/if}
