<script lang="ts">
	import { page } from '$app/stores';
	import { portalDecisionHeaderVisible } from '$lib/stores/ui';

	// Show the badge only once the delayed portal header has reappeared.
	const show = $derived($page.url.pathname.startsWith('/portals/') && $portalDecisionHeaderVisible);
</script>

{#if show}
	<div class="pointer-events-none fixed bottom-4 left-4 z-50 select-none print:hidden" aria-hidden="true">
		<div
			class="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-800 shadow-lg backdrop-blur"
		>
			<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
				/>
			</svg>
			Simulation · Not a real decision
		</div>
	</div>
{/if}
