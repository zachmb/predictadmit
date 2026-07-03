// src/lib/stores/points.ts
// Invite/engagement points ledger, persisted in localStorage.
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const KEY = 'predictadmit:pro:points';

export type PointsEntry = {
	key: string; // idempotency key, e.g. 'invitee-join' or 'referral:<code>:<n>'
	points: number;
	note: string;
	at: string; // ISO timestamp
};

export type PointsState = {
	total: number;
	entries: PointsEntry[];
};

const empty: PointsState = { total: 0, entries: [] };

function load(): PointsState {
	if (!browser) return empty;
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? { ...empty, ...JSON.parse(raw) } : empty;
	} catch {
		return empty;
	}
}

export const points = writable<PointsState>(load());

if (browser) {
	points.subscribe((v) => {
		try {
			localStorage.setItem(KEY, JSON.stringify(v));
		} catch {
			/* ignore */
		}
	});
}

/** Award points once per key — safe to call repeatedly. Returns true if newly awarded. */
export function awardPoints(key: string, amount: number, note: string): boolean {
	if (!browser) return false;
	let awarded = false;
	points.update((s) => {
		if (s.entries.some((e) => e.key === key)) return s;
		awarded = true;
		return {
			total: s.total + amount,
			entries: [...s.entries, { key, points: amount, note, at: new Date().toISOString() }]
		};
	});
	return awarded;
}
