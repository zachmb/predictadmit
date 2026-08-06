<script lang="ts">
	// Favente Connect — the "Get paid to create about PredictAdmit" floating offer.
	// It used to load unconditionally on every page (a static <script> in app.html).
	// Now it stays hidden until the visitor has actually USED the product, so the
	// recruit-a-creator offer lands after they've felt the value — not on a cold
	// first paint. Unlock triggers (any one, remembered in localStorage):
	//   • ran their own AI chance simulation        (/ai)
	//   • simulated a real portal decision           ($portalDecisionViewed)
	//   • opened their account page for the first time (/account)
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { portalDecisionViewed } from '$lib/stores/ui';

	const FLAG = 'predictadmit:favente-connect-unlocked';
	let injected = false;

	function inject() {
		if (injected || !browser) return;
		if (document.querySelector('script[data-favente-connect]')) {
			injected = true;
			return;
		}
		const s = document.createElement('script');
		s.async = true;
		s.src = 'https://api.favente.so/embed/predictadmit/init.js';
		s.dataset.mode = 'fab';
		s.dataset.label = 'Get paid to create about PredictAdmit';
		s.dataset.position = 'bottom-right';
		s.setAttribute('data-favente-connect', '');
		document.head.appendChild(s);
		injected = true;
	}

	function unlock() {
		if (!browser) return;
		try {
			localStorage.setItem(FLAG, '1');
		} catch {
			/* ignore storage errors — still inject for this session */
		}
		inject();
	}

	onMount(() => {
		try {
			if (localStorage.getItem(FLAG) === '1') inject();
		} catch {
			/* ignore */
		}
	});

	// Fire the unlock the moment the visitor hits any milestone.
	$: if (browser) {
		const p = $page.url.pathname;
		if (p === '/account' || p === '/ai' || p.startsWith('/ai/') || $portalDecisionViewed) {
			unlock();
		}
	}
</script>
