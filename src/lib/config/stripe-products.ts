// Stripe plan catalog for PredictAdmit — NAME + AMOUNT are the source of truth.
//
// Checkout creates the price INLINE via `price_data.product_data.name` (see
// checkout/+server.ts), NOT via a product id. That's deliberate and hard-won
// (2026-08-13): the old `prod_Uyyo…` ids lived in a DIFFERENT Stripe account
// (Deo Favente, Corp.) than PredictAdmit's prod `sk_live` key (acct …looplessapp),
// so every checkout 500'd with "No such product". Inline `product_data` makes
// checkout ACCOUNT-AGNOSTIC — it works with whatever Stripe key is in prod, so a
// cross-account / test-vs-live id mismatch can NEVER break revenue again.
// `productId` below is unused (kept only for reference); amounts mirror /pro.
export const STRIPE_PRODUCTS = {
	// $39/month subscription — Full Access. Also backs the 7-day free trial.
	monthly: {
		productId: '', // unused — checkout uses product_data.name (account-agnostic)
		name: 'PredictAdmit Pro — Full Access (Monthly)',
		amountCents: 3900,
		recurring: true
	},
	// $99 one-time — everything, forever. Checkout creates it inline via
	// price_data.product_data.name (see checkout
	// +server.ts). `productId` is intentionally unused for one-time plans.
	lifetime: {
		productId: '', // none in live — checkout uses product_data.name below
		name: 'PredictAdmit Pro — Full Access (Lifetime)',
		amountCents: 9900,
		recurring: false
	},
	// $14.99 one-time — full Pro analysis for a single school. Same as lifetime:
	// no live product, checkout creates it inline via product_data.name.
	school: {
		productId: '', // none in live — checkout uses product_data.name below
		name: 'PredictAdmit School Pass',
		amountCents: 1499,
		recurring: false
	}
} as const;

export type StripePlanKey = keyof typeof STRIPE_PRODUCTS;
