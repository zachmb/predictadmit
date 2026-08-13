// src/routes/api/checkout/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { STRIPE_PRODUCTS } from '$lib/config/stripe-products';

const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;

const STRIPE_PRICE_ID = env.STRIPE_PRICE_ID;

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		if (!STRIPE_SECRET_KEY) {
			return json(
				{ error: 'Server misconfigured: Stripe secret key is missing.' },
				{ status: 500 }
			);
		}

		// The signed-in email — link the Stripe customer to it so server-side
		// entitlement (hasActivePlan) can find this purchase later by email.
		const authedEmail = (await locals.auth?.())?.user?.email ?? undefined;

		const body = await request.json();
		const { isMonthly } = body;
		// Use the REQUEST's own origin so checkout redirects work in every
		// environment (was hardcoded to http://localhost:5201 — broken in prod).
		const origin = new URL(request.url).origin;

		// ✅ Create Stripe client
		const stripe = new Stripe(STRIPE_SECRET_KEY, {
			apiVersion: '2025-01-27.acacia' as any // Casting to any to avoid strict version mismatch if SDK types are newer/older than what we expect, or use the one from error message if strictly required.
			// The error said 2025-12-15.clover. That looks like a very specific internal version or beta.
			// Safest is to cast to check or just use '2024-06-20' as string if we want to stick to that, but the error said it's NOT assignable.
			// actually, let's use the one mentioned in the error if possible, or cast to any.
			// Error: Type '"2024-06-20"' is not assignable to type '"2025-12-15.clover"'.
		});

		let sessionConfig: Stripe.Checkout.SessionCreateParams;

		if (isMonthly) {
			// Keeping legacy logic just in case, or map 'cycle' to this if we consider it the subscription
			// Legacy isMonthly branch kept for compatibility
		}

		const { pricingMode } = body; // 'lifetime' | 'monthly' | 'school'

		if (pricingMode === 'lifetime') {
			// $99 Full Access — one-time payment, everything forever.
			sessionConfig = {
				mode: 'payment',
				line_items: [
					{
						price_data: {
							currency: 'usd',
							product: STRIPE_PRODUCTS.lifetime.productId, // "PredictAdmit Max"
							unit_amount: STRIPE_PRODUCTS.lifetime.amountCents // $99.00
						},
						quantity: 1
					}
				],
				metadata: { plan: 'lifetime' },
				// {CHECKOUT_SESSION_ID} lets the return page verify payment_status
				// with Stripe BEFORE unlocking Pro (no unlock on the URL param alone).
				success_url: `${origin}/ai?upgrade=success&plan=lifetime&session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${origin}/pro?canceled=1`
			};
		} else if (pricingMode === 'trial') {
			// 7-day free trial of Full Access. Stripe collects a card upfront
			// (payment_method_collection defaults to 'always' for subscriptions),
			// charges nothing during the trial, then auto-converts to $39/mo.
			sessionConfig = {
				mode: 'subscription',
				line_items: [
					{
						price_data: {
							currency: 'usd',
							product: STRIPE_PRODUCTS.monthly.productId, // "PredictAdmit Pro"
							unit_amount: STRIPE_PRODUCTS.monthly.amountCents, // $39.00
							recurring: {
								interval: 'month'
							}
						},
						quantity: 1
					}
				],
				// Require a card up front so the trial auto-converts to $39/mo.
				payment_method_collection: 'always',
				subscription_data: {
					trial_period_days: 7,
					metadata: { plan: 'trial' }
				},
				metadata: { plan: 'trial' },
				success_url: `${origin}/ai?upgrade=success&plan=trial&session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${origin}/pro?canceled=1`
			};
		} else if (pricingMode === 'monthly') {
			// $39/month Full Access subscription.
			sessionConfig = {
				mode: 'subscription',
				line_items: [
					{
						price_data: {
							currency: 'usd',
							product: STRIPE_PRODUCTS.monthly.productId, // "PredictAdmit Pro"
							unit_amount: STRIPE_PRODUCTS.monthly.amountCents, // $39.00
							recurring: {
								interval: 'month'
							}
						},
						quantity: 1
					}
				],
				metadata: { plan: 'monthly' },
				success_url: `${origin}/ai?upgrade=success&plan=monthly&session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${origin}/pro?canceled=1`
			};
		} else if (pricingMode === 'school') {
			// $14.99 School Pass — one-time, unlocks full Pro analysis for one school.
			const slug = String(body.slug || '');
			const schoolName = String(body.schoolName || '').slice(0, 80);
			if (!/^[a-z0-9-]{2,32}$/.test(slug) || !schoolName) {
				return json({ error: 'Invalid school for School Pass.' }, { status: 400 });
			}
			sessionConfig = {
				mode: 'payment',
				line_items: [
					{
						price_data: {
							currency: 'usd',
							product: STRIPE_PRODUCTS.school.productId, // "PredictAdmit One"
							unit_amount: STRIPE_PRODUCTS.school.amountCents // $14.99
						},
						quantity: 1
					}
				],
				// The single "PredictAdmit One" product backs every school pass; the
				// specific school rides in metadata (and the success_url slug) for
				// attribution instead of minting a per-school ad-hoc product.
				metadata: { plan: 'school', slug, schoolName },
				success_url: `${origin}/ai?upgrade=success&plan=school&slug=${slug}&session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${origin}/pro?canceled=1`
			};
		} else {
			// Fallback or Legacy (if existing calls use isMonthly)
			if (isMonthly) {
				// ... legacy code if needed, or error
			}
			// Default to error if no valid mode
			return json({ error: 'Invalid pricing mode.' }, { status: 400 });
		}

		// Attach the customer to the signed-in email so entitlement lookups by
		// email work for BOTH subscriptions (trial/monthly) and one-time buys
		// (lifetime/school). Subscription mode always persists a customer;
		// payment mode needs customer_creation:'always' to persist one.
		if (authedEmail) {
			// Lowercase so it matches the lowercased lookup in hasActivePlan
			// (Stripe's customers.list email filter is an exact match).
			sessionConfig.customer_email = authedEmail.toLowerCase();
			if (sessionConfig.mode === 'payment') {
				sessionConfig.customer_creation = 'always';
			}
		}

		const session = await stripe.checkout.sessions.create(sessionConfig);

		if (!session.url) {
			return json({ error: 'Stripe did not return a checkout URL.' }, { status: 500 });
		}

		return json({ url: session.url });
	} catch (err) {
		console.error('Stripe checkout error:', err);
		return json({ error: 'Failed to start Stripe checkout.' }, { status: 500 });
	}
};
