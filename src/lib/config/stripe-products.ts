// Stripe product catalog for PredictAdmit (live products, created 2026-07-30).
//
// Checkout references these product IDs via `price_data.product` so every charge
// is attributed to the real catalog product instead of an ad-hoc one minted per
// session. Amounts live here too (source of truth mirrored by the /pro page) —
// they match the price configured on each product in Stripe.
export const STRIPE_PRODUCTS = {
	// $39/month subscription — Full Access.
	monthly: {
		productId: 'prod_Uyyovy8Glegwc4', // "PredictAdmit Pro"
		name: 'PredictAdmit Pro — Full Access (Monthly)',
		amountCents: 3900,
		recurring: true
	},
	// $99 one-time — everything, forever.
	lifetime: {
		productId: 'prod_Uyyj80yH4ClsNI', // "PredictAdmit Max"
		name: 'PredictAdmit Pro — Full Access (Lifetime)',
		amountCents: 9900,
		recurring: false
	},
	// $14.99 one-time — full Pro analysis for a single school.
	school: {
		productId: 'prod_UyyiXhyVp1ffut', // "PredictAdmit One"
		name: 'PredictAdmit School Pass',
		amountCents: 1499,
		recurring: false
	}
} as const;

export type StripePlanKey = keyof typeof STRIPE_PRODUCTS;
