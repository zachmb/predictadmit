<script lang="ts">
	import { spring } from 'svelte/motion';

	let expanded = false;

	// Spring physics for smooth expansion
	const width = spring(120, {
		stiffness: 0.12,
		damping: 0.4
	});
	const height = spring(48, {
		stiffness: 0.12,
		damping: 0.4
	});

	function expand() {
		expanded = true;
		width.set(480);
		height.set(56);
	}

	function contract() {
		expanded = false;
		width.set(120);
		height.set(48);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center overflow-hidden
         bg-black/20 backdrop-blur-2xl rounded-full border border-white/5
         shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_4px_24px_-1px_rgba(0,0,0,0.3)]
         hover:cursor-pointer transition-colors duration-300"
	style="width: {$width}px; height: {$height}px;"
	onmouseenter={expand}
	onmouseleave={contract}
>
	{#if !expanded}
		<div
			class="flex items-center justify-center gap-2 px-4 w-full h-full animate-in fade-in zoom-in duration-300"
		>
			<div class="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
				<!-- Simple Logo Icon -->
				<div class="w-3 h-3 bg-white/80 rounded-full"></div>
			</div>
			<span class="text-white/80 font-medium text-sm">Menu</span>
		</div>
	{:else}
		<nav
			class="flex items-center justify-between w-full px-8 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100"
		>
			<div class="text-white font-bold tracking-tight">GlassCoral</div>
			<div class="flex gap-6 text-sm">
				<a href="#features" class="text-white/60 hover:text-white transition-colors">Features</a>
				<a href="/pricing" class="text-white/60 hover:text-white transition-colors">Pricing</a>
				<a href="/login" class="text-white/60 hover:text-white transition-colors">Login</a>
			</div>
		</nav>
	{/if}
</div>
