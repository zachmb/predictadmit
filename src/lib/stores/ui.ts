import { writable } from 'svelte/store';

// Header visibility is managed here to allow portals to hide/show it dynamically
export const headerVisible = writable(true);

// portalDecisionViewed triggers the 4-second delay logic in SiteHeader
export const portalDecisionViewed = writable(false);

// Tracks when the delayed portal header has actually reappeared
export const portalDecisionHeaderVisible = writable(false);

// Count of active overlays (modals, paywall, carousel, toasts). When > 0 the nav
// dims + goes non-interactive so nothing competes with the overlay. Every overlay
// should, while open, run:  $effect(() => { pushOverlay(); return popOverlay; });
export const overlayActive = writable(0);
export function pushOverlay() {
	overlayActive.update((n) => n + 1);
}
export function popOverlay() {
	overlayActive.update((n) => Math.max(0, n - 1));
}
