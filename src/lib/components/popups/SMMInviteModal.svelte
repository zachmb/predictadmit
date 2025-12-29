<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';

	export let visible = false;
	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function accept() {
		dispatch('accept');
	}
</script>

{#if visible}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
		transition:fade={{ duration: 200 }}
	>
		<div class="w-full max-w-sm relative" transition:scale={{ start: 0.95, duration: 300 }}>
			<Card class="bg-white shadow-2xl overflow-hidden border-0 relative">
				<!-- DECORATIVE BG -->
				<div class="absolute top-0 inset-x-0 h-1bg-gradient-to-r from-blue-600 to-indigo-600"></div>

				<div class="p-8 text-center space-y-6">
					<div
						class="w-16 h-16 bg-blue-50 rounded-full mx-auto flex items-center justify-center text-3xl shadow-inner"
					>
						📉
					</div>

					<div class="space-y-2">
						<h3 class="text-xl font-bold text-slate-900">Leadership Score: Low</h3>
						<p class="text-slate-600 text-sm leading-relaxed">
							Our simulation detected a <span class="font-bold text-slate-900">critical gap</span> in
							your extracurricular leadership profile.
						</p>
					</div>

					<div class="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left">
						<p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
							Recommended Fix
						</p>
						<p class="text-sm font-medium text-slate-900">
							Join the <span class="text-blue-700">SMM Lead Program</span>. Manage a social media
							portfolio and gain verified leadership hours.
						</p>
					</div>

					<div class="space-y-3">
						<Button
							on:click={accept}
							class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-900/20"
						>
							View Available Roles
						</Button>
						<button
							on:click={close}
							class="text-xs text-slate-400 hover:text-slate-600 transition-colors"
						>
							Dismiss Recommendation
						</button>
					</div>
				</div>
			</Card>
		</div>
	</div>
{/if}
