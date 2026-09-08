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

type Params = Record<string, unknown>;

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
//
// CRITICAL: GA4's ecommerce reports + the default "Purchase journey" funnel
// (View product → Add to cart → Begin checkout → Purchase) only count these
// events when they carry the ecommerce `items` array. Bare events with just
// value/currency are recorded but IGNORED by the ecommerce funnel — that's why
// the funnel read 0 across every step. Every money event below now ships `items`.
function planItems(plan: string, valueUsd: number) {
	return [
		{
			item_id: plan,
			item_name: `PredictAdmit ${plan}`,
			item_category: 'subscription',
			price: valueUsd,
			quantity: 1
		}
	];
}

/** Step 2 — "View product": the paywall / pricing / upgrade page is shown. */
export function trackViewItem(plan: string, valueUsd: number): void {
	track('view_item', { currency: 'USD', value: valueUsd, items: planItems(plan, valueUsd) });
}

/** Step 3 — "Add to cart": the user picks a plan (before Stripe). */
export function trackAddToCart(plan: string, valueUsd: number): void {
	track('add_to_cart', { currency: 'USD', value: valueUsd, items: planItems(plan, valueUsd) });
}

/** Step 4 — "Begin checkout": Stripe checkout is about to open. */
export function trackBeginCheckout(plan: string, valueUsd: number): void {
	track('begin_checkout', { plan, currency: 'USD', value: valueUsd, items: planItems(plan, valueUsd) });
}

export function trackTrialStart(): void {
	track('trial_start', { plan: 'trial', value: 0, currency: 'USD' });
}

/** Step 5 — "Purchase": payment confirmed (fired on the /ai return handler). */
export function trackPurchase(plan: string, valueUsd: number, transactionId?: string): void {
	track('purchase', {
		plan,
		value: valueUsd,
		currency: 'USD',
		transaction_id: transactionId,
		items: planItems(plan, valueUsd)
	});
}
