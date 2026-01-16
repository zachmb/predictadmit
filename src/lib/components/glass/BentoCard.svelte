<script lang="ts">
	import { spring } from 'svelte/motion';

	export let title: string;
	export let description: string;
	export let className = '';
	// Slot for icon/visual

	const scale = spring(1, {
		stiffness: 0.1,
		damping: 0.3
	});

	const borderOpacity = spring(0.05, {
		stiffness: 0.1,
		damping: 0.5
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="relative group rounded-[2rem] bg-white/[0.03] backdrop-blur-2xl backdrop-saturate-150
         flex flex-col p-8 overflow-hidden transition-colors duration-500
         {className}"
	style="transform: scale({$scale}); border: 1px solid rgba(255,255,255,{$borderOpacity}); 
         box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.15), 0 4px 24px -1px rgba(0,0,0,0.3);"
	onmouseenter={() => {
		scale.set(1.02);
		borderOpacity.set(0.15);
	}}
	onmouseleave={() => {
		scale.set(1);
		borderOpacity.set(0.05);
	}}
>
	<!-- Noise/Grain overlay for texture -->
	<div class="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none"></div>

	<!-- Content -->
	<div class="relative z-10 flex-1 flex flex-col gap-4">
		<div class="text-living-coral mb-2">
			<slot name="icon"></slot>
		</div>
		<h3 class="text-2xl font-medium text-white tracking-tight">{title}</h3>
		<p class="text-white/60 leading-relaxed text-sm">{description}</p>

		<div class="mt-auto pt-8 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
			<slot name="visual"></slot>
		</div>
	</div>

	<!-- Hover Gradient -->
	<div
		class="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
	></div>
</div>
