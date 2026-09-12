<script lang="ts">
	// Scroll-scrubbed zoom story for the Pro section. A tall section pins a
	// full-screen stage; as you scroll, line 1 ("Pro can do waaaaay more") zooms in
	// and tilts until one letter fills the screen and it goes black, then two more
	// lines rise out of the black. Pure transform/opacity driven off scroll progress,
	// rAF-throttled. Honors prefers-reduced-motion with a static stacked fallback.
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

	// Line 1 — accelerating zoom (ease-in) + a slight tilt, fading out as the
	// background blacks over right when the letters swallow the screen.
	let s1 = $derived(1 + Math.pow(seg(p, 0, 0.34), 2) * 42);
	let r1 = $derived(seg(p, 0, 0.34) * 5);
	let o1 = $derived(1 - seg(p, 0.29, 0.35));
	let bg = $derived(seg(p, 0.22, 0.34));

	// Line 2 — zooms out of the black to readable, crossfades into line 3.
	let s2 = $derived(2.4 - seg(p, 0.3, 0.52) * 1.4);
	let o2 = $derived(clamp(seg(p, 0.33, 0.42) - seg(p, 0.6, 0.68)));

	// Line 3 — settles and holds to the end.
	let s3 = $derived(2.4 - seg(p, 0.62, 0.84) * 1.4);
	let o3 = $derived(seg(p, 0.62, 0.7));
</script>

{#if reduced}
	<div class="mx-auto max-w-3xl px-6 py-24 text-center space-y-6">
		<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-slate-900 leading-[1.05]">
			Pro can do <span class="text-[#1A4CFF]">waaaaay more</span>
		</h2>
		<p class="text-lg leading-relaxed text-slate-500">
			Re-run infinite predictions and see what'll happen. Our tools improve your essays with
			line-by-line feedback, trained on successful applications.
		</p>
	</div>
{:else}
	<section bind:this={section} class="relative h-[300vh] bg-white">
		<div class="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
			<!-- Black wash that fills as line 1 swallows the screen -->
			<div class="pointer-events-none absolute inset-0 bg-slate-950" style="opacity:{bg}"></div>

			<!-- Line 1 -->
			<h2
				class="absolute px-6 text-center font-serif font-medium tracking-tight text-slate-900 will-change-transform"
				style="transform: scale({s1}) rotate({r1}deg); opacity:{o1}; font-size: clamp(2.5rem, 9vw, 6.5rem); line-height: 1;"
			>
				Pro can do <span class="text-[#1A4CFF]">waaaaay more</span>
			</h2>

			<!-- Line 2 -->
			<h2
				class="absolute max-w-4xl px-6 text-center font-serif font-medium tracking-tight text-white will-change-transform"
				style="transform: scale({s2}); opacity:{o2}; font-size: clamp(2rem, 6.5vw, 4.75rem); line-height: 1.05;"
			>
				Re-run infinite predictions. <span class="text-[#6f9bff]">See what'll happen.</span>
			</h2>

			<!-- Line 3 -->
			<p
				class="absolute max-w-3xl px-6 text-center font-serif font-medium tracking-tight text-white will-change-transform"
				style="transform: scale({s3}); opacity:{o3}; font-size: clamp(1.6rem, 5vw, 3.25rem); line-height: 1.15;"
			>
				Improve your essays with line-by-line feedback, trained on successful applications.
			</p>

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
