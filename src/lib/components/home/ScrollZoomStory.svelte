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
	// Stable viewport height in px, LOCKED at mount. On mobile the address bar
	// shows/hides as you scroll, which changes `100vh` — if the tall pin section
	// were sized in vh it would resize mid-scroll and the browser would re-anchor,
	// yanking the page back up ("scrolls back after you let go"). We measure once
	// and only re-measure on a real orientation/width change, never on the
	// address-bar-driven height wobble. The section + inner stage use this px value.
	let vh = $state(0);

	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) return;
		let raf = 0;
		let lastW = window.innerWidth;
		const measure = () => {
			vh = window.innerHeight;
		};
		const update = () => {
			raf = 0;
			if (!section || !vh) return;
			const rect = section.getBoundingClientRect();
			const total = rect.height - vh;
			const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
			p = total > 0 ? scrolled / total : 0;
		};
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};
		const onResize = () => {
			// Only relock height on a genuine layout change (orientation / width),
			// NOT on the pure-height wobble from the mobile URL bar.
			if (Math.abs(window.innerWidth - lastW) > 40) {
				lastW = window.innerWidth;
				measure();
			}
			onScroll();
		};
		measure();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize, { passive: true });
		window.addEventListener('orientationchange', measure, { passive: true });
		update();
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
			window.removeEventListener('orientationchange', measure);
		};
	});

	const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b);
	const seg = (x: number, a: number, b: number) => clamp((x - a) / (b - a));

	// Line 1 — three phases so impatient fast-scrollers can still READ it:
	//   grow   (0    → 0.09): zoom from 0.32x up to a comfortable readable size (1x)
	//   HOLD   (0.09 → 0.30): PAUSE at readable size — the line sits still-and-legible
	//                         for a big stretch of scroll before the dramatic zoom
	//   explode(0.30 → 0.44): ease-in to fill the screen + tilt, then fade to black
	// Driven by font-size (crisp), not transform:scale.
	let grow = $derived(seg(p, 0, 0.09));
	let explode = $derived(seg(p, 0.3, 0.44));
	let s1 = $derived(0.32 + grow * 0.68 + Math.pow(explode, 2) * 44);
	let r1 = $derived(explode * 5);
	let o1 = $derived(1 - seg(p, 0.39, 0.45));
	let bg = $derived(seg(p, 0.32, 0.44));

	// Lines 2 & 3 do NOT resize — they rise + fade in at a CONSTANT font size so
	// their wrapping (line count, words per line) is identical every frame. Only the
	// single-line headlines do the dramatic zoom. y2/y3 are a small translate for the
	// "rise out of the black" feel; opacity handles the reveal/crossfade.
	let o2 = $derived(clamp(seg(p, 0.44, 0.52) - seg(p, 0.66, 0.74)));
	let y2 = $derived((1 - seg(p, 0.44, 0.56)) * 24);

	let o3 = $derived(seg(p, 0.68, 0.78));
	let y3 = $derived((1 - seg(p, 0.68, 0.81)) * 24);
	let o4 = $derived(seg(p, 0.86, 0.95));
</script>

{#if reduced}
	<div class="mx-auto max-w-3xl px-6 py-24 text-center space-y-6">
		<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-slate-900 leading-[1.05]">
			Pro can do <span class="text-[#0c0c09]">waaaaay more</span>
		</h2>
		<p class="text-lg leading-relaxed text-slate-500">
			Re-run infinite predictions and see what'll happen. Our tools improve your essays with
			line-by-line feedback, trained on successful applications. And more.
		</p>
	</div>
{:else}
	<section bind:this={section} class="relative bg-white" style={vh ? `height:${vh * 5.4}px` : 'height:540svh'}>
		<div class="sticky top-0 flex items-center justify-center overflow-hidden" style={vh ? `height:${vh}px` : 'height:100svh'}>
			<!-- Black wash that fills as line 1 swallows the screen -->
			<div class="pointer-events-none absolute inset-0 bg-slate-950" style="opacity:{bg}"></div>

			<!-- Line 1 (font-size zoom = crisp). nowrap so its layout never reflows as it
			     grows — it just overflows off-screen (a letter fills the view). -->
			<h2
				class="absolute px-6 text-center font-serif font-medium tracking-tight text-slate-900 whitespace-nowrap"
				style="--s:{s1}; font-size: calc(clamp(1.6rem, 8vw, 6.25rem) * var(--s)); line-height: 1; transform: rotate({r1}deg); opacity:{o1};"
			>
				Pro can do <span class="text-[#0c0c09]">waaaaay more</span>
			</h2>

			<!-- Line 2 — constant size, rises + fades in (no resize = no reflow) -->
			<h2
				class="absolute max-w-[22ch] px-6 text-center font-serif text-3xl font-medium leading-tight tracking-tight text-white sm:max-w-2xl sm:text-5xl"
				style="opacity:{o2}; transform: translateY({y2}px);"
			>
				Re-run infinite predictions. <span class="text-[#474739]">See what'll happen.</span>
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
					<svg class="h-6 w-6 animate-bounce text-[#474739]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
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
