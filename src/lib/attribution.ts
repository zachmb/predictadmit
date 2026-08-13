// First-touch traffic attribution — so a paid trial can be traced back to the
// ad/source that brought the visitor in, EVEN THOUGH the Google OAuth roundtrip
// (leaving to accounts.google.com and back) can reset a GA session and strip the
// UTM. We stash the first-touch source in localStorage on landing and attach it
// to every GA event (see analytics.ts), so `begin_checkout` / `trial_start` /
// `purchase` all carry `source` + `campaign`. That's what makes "is the Reddit
// ad actually profitable?" answerable: filter GA by source=reddit through to
// revenue.
import { browser } from '$app/environment';

const KEY = 'predictadmit_attribution';

export type Attribution = {
	source?: string;
	medium?: string;
	campaign?: string;
	referrer?: string;
	landing?: string;
	at?: number;
};

function hostOf(ref: string): string | undefined {
	try {
		return new URL(ref).hostname.replace(/^www\./, '');
	} catch {
		return undefined;
	}
}

/** Record the first-touch source once (never overwritten on later visits). */
export function captureAttribution(url: URL): void {
	if (!browser) return;
	try {
		if (localStorage.getItem(KEY)) return; // first-touch wins
		const q = url.searchParams;
		const utmSource = q.get('utm_source') || undefined;
		const referrer = typeof document !== 'undefined' ? document.referrer || undefined : undefined;
		const extRefHost =
			referrer && !referrer.includes(location.host) ? hostOf(referrer) : undefined;

		// Only record when there's a real signal — a UTM tag or an external
		// referrer. Direct/internal navigation isn't an acquisition source.
		const source = utmSource || extRefHost;
		if (!source) return;

		const a: Attribution = {
			source,
			medium: q.get('utm_medium') || (extRefHost ? 'referral' : undefined),
			campaign: q.get('utm_campaign') || undefined,
			referrer,
			landing: url.pathname,
			at: Date.now()
		};
		localStorage.setItem(KEY, JSON.stringify(a));
	} catch {
		/* ignore storage errors */
	}
}

let _cache: Attribution | null = null;
export function getAttribution(): Attribution {
	if (!browser) return {};
	if (_cache) return _cache;
	try {
		_cache = JSON.parse(localStorage.getItem(KEY) || '{}');
	} catch {
		_cache = {};
	}
	return _cache ?? {};
}
