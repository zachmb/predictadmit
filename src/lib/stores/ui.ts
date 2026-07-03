import { writable } from 'svelte/store';

// Header visibility is managed here to allow portals to hide/show it dynamically
export const headerVisible = writable(true);

// portalDecisionViewed triggers the 4-second delay logic in SiteHeader
export const portalDecisionViewed = writable(false);

// Tracks when the delayed portal header has actually reappeared
export const portalDecisionHeaderVisible = writable(false);
