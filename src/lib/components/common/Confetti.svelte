<script lang="ts">
	import { onMount } from 'svelte';

	// duration: how long the burst lasts (ms).
	// primary: the school's brand hex — confetti is themed to the school's colors.
	let { duration = 4000, primary = '' }: { duration?: number; primary?: string } = $props();

	// Build a lively, school-themed palette from a single brand color: the brand
	// color plus lighter/darker tints and white "paper" flecks for contrast.
	function toRgb(hex: string): [number, number, number] | null {
		const h = hex.replace('#', '').trim();
		const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
		if (f.length < 6) return null;
		return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
	}
	function mix([r, g, b]: [number, number, number], t: number, target: number): string {
		const m = (c: number) => Math.round(c + (target - c) * t);
		return `rgb(${m(r)}, ${m(g)}, ${m(b)})`;
	}
	function buildPalette(hex: string): string[] {
		const rgb = toRgb(hex);
		const fallback = ['#FDBB2D', '#22c55e', '#3b82f6', '#ef4444', '#a855f7', '#f97316'];
		if (!rgb) return fallback;
		return [
			`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`, // brand
			mix(rgb, 0.4, 255), // lighter tint
			mix(rgb, 0.65, 255), // lightest tint
			mix(rgb, 0.25, 0), // darker shade
			'#ffffff', // paper flecks
			'#ffffff'
		];
	}

	let canvas: HTMLCanvasElement;

	onMount(() => {
		if (typeof window === 'undefined') return;
		// Respect users who prefer reduced motion — no confetti for them.
		if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let W = (canvas.width = window.innerWidth);
		let H = (canvas.height = window.innerHeight);
		const onResize = () => {
			W = canvas.width = window.innerWidth;
			H = canvas.height = window.innerHeight;
		};
		window.addEventListener('resize', onResize);

		const colors = buildPalette(primary);

		type Particle = {
			x: number;
			y: number;
			vx: number;
			vy: number;
			size: number;
			color: string;
			rot: number;
			vrot: number;
			shape: number;
		};

		const count = Math.min(260, Math.max(120, Math.floor(W / 5)));
		const parts: Particle[] = [];
		for (let i = 0; i < count; i++) {
			parts.push({
				x: Math.random() * W,
				y: Math.random() * -H * 0.6 - 20,
				vx: (Math.random() - 0.5) * 3.5,
				vy: Math.random() * 3 + 2,
				size: Math.random() * 8 + 5,
				color: colors[(Math.random() * colors.length) | 0],
				rot: Math.random() * Math.PI * 2,
				vrot: (Math.random() - 0.5) * 0.25,
				shape: (Math.random() * 2) | 0
			});
		}

		const start = performance.now();
		let raf = 0;

		const tick = (now: number) => {
			const t = now - start;
			ctx.clearRect(0, 0, W, H);
			const fade = t > duration - 900 ? Math.max(0, (duration - t) / 900) : 1;
			for (const p of parts) {
				p.vy += 0.05; // gravity
				p.vx *= 0.995;
				p.x += p.vx;
				p.y += p.vy;
				p.rot += p.vrot;
				if (p.y > H + 30) p.y = -20; // recycle while active
				ctx.save();
				ctx.globalAlpha = fade;
				ctx.translate(p.x, p.y);
				ctx.rotate(p.rot);
				ctx.fillStyle = p.color;
				if (p.shape === 0) {
					ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
				} else {
					ctx.beginPath();
					ctx.ellipse(0, 0, p.size / 2, p.size / 2.4, 0, 0, Math.PI * 2);
					ctx.fill();
				}
				ctx.restore();
			}
			if (t < duration) {
				raf = requestAnimationFrame(tick);
			} else {
				ctx.clearRect(0, 0, W, H);
			}
		};
		raf = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none fixed inset-0 z-40"
	aria-hidden="true"
></canvas>
