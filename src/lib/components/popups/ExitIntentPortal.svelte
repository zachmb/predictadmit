<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';

	let visible = false;
	let hasTriggered = false;

	onMount(() => {
		const handleMouseLeave = (e: MouseEvent) => {
			if (e.clientY <= 0 && !hasTriggered) {
				visible = true;
				hasTriggered = true;
			}
		};

		document.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			document.removeEventListener('mouseleave', handleMouseLeave);
		};
	});

	function dismiss() {
		visible = false;
	}
</script>

{#if visible}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
		transition:fade={{ duration: 200 }}
	>
		<div class="w-full max-w-md relative" transition:fly={{ y: 20, duration: 300 }}>
			<!-- CLOSE BUTTON -->
			<button
				on:click={dismiss}
				class="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"
					></line></svg
				>
			</button>

			<Card class="bg-white shadow-2xl overflow-hidden border-0">
				<!-- HEADER: Mock Harvard Login -->
				<div class="bg-[#A51C30] px-6 py-4 flex items-center gap-3">
					<div
						class="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white font-serif font-bold"
					>
						H
					</div>
					<div class="text-white font-serif tracking-tight font-semibold">HarvardKey</div>
				</div>

				<div class="p-8 space-y-6 text-center">
					<div class="space-y-2">
						<h2 class="text-2xl font-bold text-slate-900">Wait.</h2>
						<p class="text-slate-600 text-lg leading-relaxed">
							Are you ready to see this screen<br />
							<span class="font-bold text-[#A51C30]">for real</span> in 6 months?
						</p>
					</div>

					<div class="bg-slate-50 p-4 rounded-lg border border-slate-200 text-left space-y-3">
						<div
							class="flex items-center justify-between text-xs text-slate-500 uppercase tracking-wider font-semibold"
						>
							<span>Class of 2027 Stats</span>
							<span class="text-[#A51C30]">LIVE DATA</span>
						</div>
						<div class="space-y-2 text-sm text-slate-700">
							<div class="flex justify-between">
								<span>Acceptance Rate</span>
								<span class="font-bold">3.41%</span>
							</div>
							<div class="flex justify-between">
								<span>Avg SAT</span>
								<span class="font-bold">1540</span>
							</div>
							<div class="flex justify-between">
								<span>Unweighted GPA</span>
								<span class="font-bold">3.98/4.0</span>
							</div>
						</div>
					</div>

					<div class="space-y-3">
						<Button
							class="w-full py-3 text-base shadow-lg shadow-[#A51C30]/20 bg-[#A51C30] hover:bg-[#8a1225] border-none text-white"
						>
							Simulate My Decision Now
						</Button>
						<button
							on:click={dismiss}
							class="text-sm text-slate-400 hover:text-slate-600 transition-colors"
						>
							I'll take my chances
						</button>
					</div>
				</div>
			</Card>
		</div>
	</div>
{/if}
