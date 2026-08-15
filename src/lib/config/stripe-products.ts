// Stripe plan catalog for PredictAdmit — NAME + AMOUNT are the source of truth.
//
// Checkout creates the price INLINE via `price_data.product_data.name` (see
// checkout/+server.ts), NOT via a product id. That's deliberate and hard-won
// (2026-08-13): the old `prod_Uyyo…` ids lived in a DIFFERENT Stripe account
// (Deo Favente, Corp.) than PredictAdmit's prod `sk_live` key (acct …looplessapp),
// so every checkout 500'd with "No such product". Inline `product_data` makes
// checkout ACCOUNT-AGNOSTIC — it works with whatever Stripe key is in prod, so a
// cross-account / test-vs-live id mismatch can NEVER break revenue again.
// PRICING MODEL (2026-08-15, Zach): impulse-priced good-better-best.
//   One School $4.99 (one-time) · Monthly $9.99/mo · Lifetime $25 (one-time).
// Free first prediction is the hook; then this ladder. Lifetime is the TARGET —
// 2.5 months of Monthly already equals it, so Monthly makes Lifetime the obvious
// buy. `productId` is unused (checkout builds the price inline via product_data.name).
export const STRIPE_PRODUCTS = {
	// $4.99 one-time — one school's full deep-dive + verdict. Per-school (sets
	// proSchools), does NOT grant full access. The floor / downsell.
	single: {
		productId: '', // none in live — checkout uses product_data.name (account-agnostic)
		name: 'PredictAdmit — Single School Deep-Dive',
		amountCents: 499,
		recurring: false
	},
	// $9.99 / month — full access while subscribed (all 39 schools, unlimited
	// re-runs, deep-dives, essay workshop). Sets isPro while active. No trial.
	monthly: {
		productId: '', // none in live — checkout uses product_data.name below
		name: 'PredictAdmit Pro — Monthly',
		amountCents: 999,
		recurring: true
	},
	// $25 one-time — THE TARGET. Full access forever: all 39 schools, unlimited
	// re-runs, every deep-dive, the essay workshop + AI counselor. Sets isPro.
	lifetime: {
		productId: '', // none in live — checkout uses product_data.name below
		name: 'PredictAdmit Pro — Lifetime',
		amountCents: 2500,
		recurring: false
	},

	// ── LEGACY (retired offers) — kept ONLY so entitlement + the return handler
	//    still honor earlier purchases. Never surfaced in new checkout.
	//    season/seasonPlus = the 2026-08-14 one-time passes; school = old $14.99 single.
	season: {
		productId: '',
		name: 'PredictAdmit — Full Season (All 39 Schools)',
		amountCents: 2900,
		recurring: false
	},
	seasonPlus: {
		productId: '',
		name: 'PredictAdmit — Full Season + Essay Review',
		amountCents: 5900,
		recurring: false
	},
	school: {
		productId: '',
		name: 'PredictAdmit School Pass',
		amountCents: 1499,
		recurring: false
	}
} as const;

export type StripePlanKey = keyof typeof STRIPE_PRODUCTS;
