// src/lib/stores/streak.ts
// Lightweight daily-visit streak, persisted in localStorage. Retention loop.
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const KEY = 'predictadmit:pro:streak';

export type StreakState = {
	count: number; // current consecutive-day streak
	best: number; // best streak ever
	lastVisit: string; // YYYY-MM-DD of last counted visit
};

const empty: StreakState = { count: 0, best: 0, lastVisit: '' };

function todayKey(): string {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysBetween(a: string, b: string): number {
	if (!a || !b) return Infinity;
	const [ay, am, ad] = a.split('-').map(Number);
	const [by, bm, bd] = b.split('-').map(Number);
	const da = Date.UTC(ay, am - 1, ad);
	const db = Date.UTC(by, bm - 1, bd);
	return Math.round((db - da) / 86400000);
}

function load(): StreakState {
	if (!browser) return empty;
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? { ...empty, ...JSON.parse(raw) } : empty;
	} catch {
		return empty;
	}
}

export const streak = writable<StreakState>(load());

if (browser) {
	streak.subscribe((v) => {
		try {
			localStorage.setItem(KEY, JSON.stringify(v));
		} catch {
			/* ignore */
		}
	});
}

/** Call once on Pro mount to record today's visit and advance/reset the streak. */
export function recordVisit() {
	if (!browser) return;
	streak.update((s) => {
		const today = todayKey();
		if (s.lastVisit === today) return s; // already counted today
		const gap = daysBetween(s.lastVisit, today);
		const count = gap === 1 ? s.count + 1 : 1; // consecutive day -> +1, else reset to 1
		const best = Math.max(s.best, count);
		return { count, best, lastVisit: today };
	});
}
