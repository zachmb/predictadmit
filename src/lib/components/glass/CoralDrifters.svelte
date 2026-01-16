<script lang="ts">
	// CoralDrifters.svelte
	// Floating, blurry organic shapes to sit at z-0 behind content.
</script>

<div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
	<!-- Drifter 1 -->
	<div
		class="absolute w-[40vw] h-[40vw] top-[10%] -left-[10%] rounded-full bg-living-coral/10 blur-[100px] animate-float"
	></div>

	<!-- Drifter 2 -->
	<div
		class="absolute w-[35vw] h-[35vw] bottom-[20%] -right-[5%] rounded-full bg-[#4FD1C5]/10 blur-[80px] animate-float delay-1000"
	></div>

	<!-- Drifter 3 (Smaller, more central) -->
	<div
		class="absolute w-[20vw] h-[20vw] top-[40%] left-[40%] rounded-full bg-white/5 blur-[60px] animate-pulse delay-2000"
	></div>
</div>

<style>
	.animate-float {
		animation: float 20s ease-in-out infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translate(0, 0);
		}
		33% {
			transform: translate(30px, -50px);
		}
		66% {
			transform: translate(-20px, 20px);
		}
	}
</style>
