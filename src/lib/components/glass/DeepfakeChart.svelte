<script lang="ts">
	import { onMount } from 'svelte';

	let mounted = false;
	onMount(() => {
		setTimeout(() => (mounted = true), 500); // Trigger animation on mount
	});
</script>

<div
	class="relative w-full h-[300px] md:h-[400px] bg-white/[0.02] rounded-2xl border border-white/5 backdrop-blur-sm p-8 flex items-end justify-center overflow-hidden"
>
	<!-- Grid Lines -->
	<div class="absolute inset-0 z-0">
		{#each [1, 2, 3, 4] as i}
			<div class="absolute w-full h-px bg-white/5" style="bottom: {i * 20}%;"></div>
		{/each}
		{#each [1, 2, 3, 4] as i}
			<div class="absolute h-full w-px bg-white/5" style="left: {i * 20}%;"></div>
		{/each}
	</div>

	<!-- The Chart Data -->
	<div class="relative z-10 w-full h-full flex items-end justify-between px-12 pb-8">
		<!-- 2019 Point -->
		<div class="flex flex-col items-center gap-2 group">
			<div
				class="text-white/40 text-sm font-mono mb-2 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-forwards"
			>
				8k
			</div>
			<div
				class="w-3 h-3 rounded-full bg-white/20 ring-2 ring-white/10 group-hover:bg-living-coral transition-colors duration-300"
			></div>
			<div class="h-[10%] w-px bg-gradient-to-t from-white/10 to-transparent"></div>
			<div class="text-white/40 text-xs mt-2">2019</div>
		</div>

		<!-- Connection Line (SVG) -->
		<svg class="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
			<!-- Gradient Definition -->
			<defs>
				<linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="#FF8C69" stop-opacity="0.2" />
					<stop offset="100%" stop-color="#FF8C69" stop-opacity="0" />
				</linearGradient>
				<filter id="glow">
					<feGaussianBlur stdDeviation="2" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			<!-- Path: 2019 (approx 10% height) to 2025 (approx 80% height) -->
			{#if mounted}
				<path
					d="M 60,350 C 200,340 400,300 600,80"
					fill="none"
					stroke="#FF8C69"
					stroke-width="3"
					filter="url(#glow)"
					class="path-draw"
				/>
				<path
					d="M 60,350 C 200,340 400,300 600,80 V 400 H 60 Z"
					fill="url(#chartGradient)"
					class="opacity-0 animate-fade-in delay-1000 duration-1000 fill-mode-forwards"
				/>
			{/if}
		</svg>

		<!-- Annotation -->
		<div
			class="absolute top-[30%] left-[40%] text-living-coral text-sm font-bold tracking-wide opacity-0 animate-in fade-in zoom-in duration-700 delay-1500 fill-mode-forwards pointer-events-none"
		>
			+6,600% INCREASE
		</div>

		<!-- 2025 Point -->
		<div class="flex flex-col items-center gap-2 group relative top-[-60%]">
			<!-- Manually positioned for '80%' height relative to container -->
			<div
				class="text-living-coral text-lg font-bold font-mono mb-2 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1200 fill-mode-forwards"
			>
				550k
			</div>
			<div
				class="w-4 h-4 rounded-full bg-living-coral shadow-[0_0_20px_rgba(255,140,105,0.8)] animate-pulse"
			></div>
			<div class="h-[80%] w-px bg-gradient-to-t from-living-coral/50 to-transparent"></div>
			<div class="text-white text-xs mt-2 font-bold">2025</div>
		</div>
	</div>
</div>

<style>
	.path-draw {
		stroke-dasharray: 1000;
		stroke-dashoffset: 1000;
		animation: draw 2s ease-out forwards;
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	.fill-mode-forwards {
		animation-fill-mode: forwards;
	}
</style>
