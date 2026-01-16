<script lang="ts">
	export let className = '';
	// Removed unused 'delay' prop to fix lint warning
</script>

<div
	class="relative group rounded-[2rem] bg-white/[0.03] backdrop-blur-2xl backdrop-saturate-150
         border border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_4px_24px_-1px_rgba(0,0,0,0.3)]
         overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:bg-white/[0.05]
         animate-breathing {className}"
>
	<!-- Glare Effect on Hover -->
	<div
		class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0
           opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
	></div>

	<!-- Content -->
	<div class="relative z-10 p-8 h-full">
		<slot />
	</div>
</div>
