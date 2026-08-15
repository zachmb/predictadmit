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
// PRICING MODEL (2026-08-14): freemium → one-time "season pass", NO subscription.
// College admissions is a bounded, seasonal life event — a monthly sub churns the
// day decisions drop, and a recurring "free trial" was the exact friction that
// converted 0/18 in live Stripe. One-time payment removes the "it'll bill me later"
// fear AND fits the season. Anchored against private-counselor spend ($5k–$7k), not
// the free chancing calculators. Good-better-best 3 tiers; `season` is the target.
export const STRIPE_PRODUCTS = {
	// $9 one-time — one school's full deep-dive + verdict. Per-school (sets
	// proSchools), does NOT grant full access. The low anchor / downsell.
	single: {
		productId: '', // none in live — checkout uses product_data.name (account-agnostic)
		name: 'PredictAdmit — Single School Deep-Dive',
		amountCents: 900,
		recurring: false
	},
	// $29 one-time — THE TARGET. Full access: all 39 schools, unlimited re-runs the
	// whole cycle, every deep-dive, the essay workshop + AI counselor. Sets isPro.
	// Impulse-priced (2026-08-15, Zach: "waaay lower") against the $5k counselor anchor.
	season: {
		productId: '', // none in live — checkout uses product_data.name below
		name: 'PredictAdmit — Full Season (All 39 Schools)',
		amountCents: 2900,
		recurring: false
	},
	// $59 one-time — everything in Season plus hands-on essay review. The high
	// anchor that makes $29 read as the smart-money pick. Sets isPro.
	seasonPlus: {
		productId: '', // none in live — checkout uses product_data.name below
		name: 'PredictAdmit — Full Season + Essay Review',
		amountCents: 5900,
		recurring: false
	},

	// ── LEGACY (retired offers) — kept ONLY so entitlement + the return handler
	//    still honor purchases made before the 2026-08-14 model change. Never
	//    surfaced in new checkout. `lifetime` = old $99 full access (== season);
	//    `school` = old $14.99 single school; `monthly`/trial = old subscription.
	lifetime: {
		productId: '',
		name: 'PredictAdmit Pro — Full Access (Lifetime)',
		amountCents: 9900,
		recurring: false
	},
	school: {
		productId: '',
		name: 'PredictAdmit School Pass',
		amountCents: 1499,
		recurring: false
	},
	monthly: {
		productId: '',
		name: 'PredictAdmit Pro — Full Access (Monthly)',
		amountCents: 3900,
		recurring: true
	}
} as const;

export type StripePlanKey = keyof typeof STRIPE_PRODUCTS;
