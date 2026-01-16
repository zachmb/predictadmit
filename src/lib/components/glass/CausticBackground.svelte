<script lang="ts">
	// CausticBackground.svelte
	// Three slow-moving radial gradients simulating light refracting through deep water.
</script>

<div class="fixed inset-0 overflow-hidden pointer-events-none -z-10">
	<div
		class="absolute w-[80vw] h-[80vw] top-[-20%] left-[-10%] rounded-full bg-[#4FD1C5] opacity-20 blur-[140px] animate-pulse mix-blend-soft-light filter"
	></div>
	<div
		class="absolute w-[70vw] h-[70vw] bottom-[-10%] right-[-10%] rounded-full bg-[#FF7F50] opacity-15 blur-[140px] animate-pulse delay-1000 mix-blend-soft-light filter"
	></div>
	<div
		class="absolute w-[60vw] h-[60vw] top-[40%] left-[30%] rounded-full bg-[#60A5FA] opacity-20 blur-[140px] animate-pulse delay-2000 mix-blend-soft-light filter"
	></div>
</div>

<style>
	/* Optional: Custom keyframes for more complex movement if 'animate-pulse' is too simple */
</style>
