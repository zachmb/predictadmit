<script lang="ts">
	// The money moment: after a visitor sees a FREE simulated decision (the Reddit
	// hook), convert that emotional beat into a paid-trial start. Appears a beat
	// after the decision lands, on portal pages, to non-Pro users only.
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { portalDecisionViewed } from '$lib/stores/ui';
	import { userProfile } from '$lib/stores/user';
	import { track } from '$lib/analytics';

	let dismissed = $state(false);
	let ready = $state(false);

	const onPortal = $derived($page.url.pathname.startsWith('/portals/'));
	const show = $derived(
		onPortal && $portalDecisionViewed && !$userProfile.isPro && !dismissed && ready
	);

	// Let the simulated decision land first (~2.6s), then surface the upsell.
	$effect(() => {
		if (onPortal && $portalDecisionViewed && !ready) {
			const t = setTimeout(() => {
				ready = true;
				if (!$userProfile.isPro && !dismissed) track('upsell_view', { placement: 'portal_decision' });
			}, 2600);
			return () => clearTimeout(t);
		}
	});

	function go() {
		track('upsell_click', { placement: 'portal_decision' });
		goto('/ai');
	}
</script>

{#if show}
	<div
		class="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2"
		transition:fly={{ y: 26, duration: 280 }}
	>
		<div class="relative overflow-hidden rounded-2xl bg-[#0052CC] p-4 pr-10 text-white shadow-2xl shadow-blue-900/30 ring-1 ring-white/10">
			<button
				onclick={() => (dismissed = true)}
				aria-label="Dismiss"
				class="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
			</button>
			<p class="text-sm font-bold leading-snug">That was a simulation. Want your real one?</p>
			<p class="mt-1 text-xs leading-relaxed text-blue-100">
				PredictAdmit's AI reads your actual application and predicts your decision at all 39 top
				schools — free for 7 days.
			</p>
			<button
				onclick={go}
				class="mt-3 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0052CC] transition hover:bg-blue-50 active:scale-[0.99]"
			>
				See my real odds →
			</button>
		</div>
	</div>
{/if}
