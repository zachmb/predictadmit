<script lang="ts">
	import { page } from '$app/stores';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// Show the moment a decision letter is revealed (not on the delay the badge
	// uses) so a screenshot can never be passed off as a real, official decision.
	const show = $derived($page.url.pathname.startsWith('/portals/') && $portalDecisionViewed);
</script>

{#if show}
	<!-- A single diagonal "SIMULATED" stamp across the decision. Noticeable but
	     unobtrusive; pointer-events-none so it never blocks the portal UI. -->
	<div
		class="watermark pointer-events-none fixed inset-0 z-30 flex select-none items-center justify-center"
		aria-hidden="true"
	>
		<span
			class="-rotate-[24deg] text-5xl font-black tracking-[0.3em] text-slate-900/15 uppercase sm:text-7xl"
		>
			Simulated
		</span>
	</div>
{/if}

<style>
	/* Keep the mark in printouts (and any screenshot). */
	@media print {
		.watermark {
			display: flex !important;
		}
	}
</style>
