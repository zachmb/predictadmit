// Thin wrapper over the GA4 gtag loaded globally in app.html (G-W6WB354WGW).
// Fire funnel events from anywhere; it's a safe no-op during SSR, or if gtag
// isn't present (ad-blockers), and never throws into the app.
//
// The events below let you build GA4 Funnel Exploration / Path reports on the
// PredictAdmit conversion path:
//   login → simulation_start → paywall_view → view_pricing → begin_checkout
//         → trial_start / purchase
//
// GA4-recommended names (login, begin_checkout, purchase) are used where they
// fit so GA's built-in reports light up; the rest are descriptive custom events.

import { getAttribution } from './attribution';

type Params = Record<string, string | number | boolean | undefined>;

export function track(event: string, params: Params = {}): void {
	if (typeof window === 'undefined') return;
	const gtag = (window as { gtag?: (...a: unknown[]) => void }).gtag;
	if (typeof gtag !== 'function') return;
	try {
		// Stamp first-touch source/campaign on EVERY event so the funnel (and
		// revenue) can be sliced by acquisition source in GA — the OAuth roundtrip
		// can otherwise strip the original UTM before a conversion fires.
		const a = getAttribution();
		gtag('event', event, {
			...(a.source ? { source: a.source } : {}),
			...(a.campaign ? { campaign: a.campaign } : {}),
			...(a.medium ? { medium: a.medium } : {}),
			...params
		});
	} catch {
		/* analytics must never break the app */
	}
}

// Convenience wrappers for the money path (value/currency populate GA revenue).
export function trackBeginCheckout(plan: string, valueUsd: number): void {
	track('begin_checkout', { plan, value: valueUsd, currency: 'USD' });
}

export function trackTrialStart(): void {
	track('trial_start', { plan: 'trial', value: 0, currency: 'USD' });
}

export function trackPurchase(plan: string, valueUsd: number, transactionId?: string): void {
	track('purchase', {
		plan,
		value: valueUsd,
		currency: 'USD',
		transaction_id: transactionId
	});
}
