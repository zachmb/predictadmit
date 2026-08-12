<script lang="ts">
	import { page } from '$app/stores';
	import { portalDecisionViewed } from '$lib/stores/ui';

	// Show the moment a decision letter is revealed (not on the delay the badge
	// uses) so a screenshot can never be passed off as a real, official decision.
	const show = $derived($page.url.pathname.startsWith('/portals/') && $portalDecisionViewed);
</script>

{#if show}
	<!-- Tiled diagonal "SIMULATED" mark across the whole decision. Small per-tile
	     but repeated everywhere, so it can't be cropped out of a screenshot.
	     pointer-events-none so it never blocks the portal UI. -->
	<div
		class="watermark pointer-events-none fixed inset-0 z-30 select-none"
		aria-hidden="true"
	></div>
{/if}

<style>
	.watermark {
		background-image: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='240'%20height='160'%3E%3Ctext%20x='120'%20y='84'%20font-family='Arial,Helvetica,sans-serif'%20font-size='20'%20font-weight='700'%20letter-spacing='3'%20text-anchor='middle'%20transform='rotate(-28%20120%2080)'%20fill='%230f172a'%20fill-opacity='0.13'%3ESIMULATED%3C/text%3E%3C/svg%3E");
		background-repeat: repeat;
	}
	/* Keep the mark in screenshots AND printouts. */
	@media print {
		.watermark {
			display: block !important;
		}
	}
</style>
