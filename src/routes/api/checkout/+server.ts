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

		const { pricingMode } = body; // 'single' | 'monthly' | 'lifetime'

		// Ladder: One School $4.99 (one-time) · Monthly $9.99/mo · Lifetime $25 (one-time).
		// Free first prediction is the hook. Every price is built INLINE by name so
		// checkout stays account-agnostic (never depends on a live product id).
		if (pricingMode === 'lifetime') {
			// $25 — THE TARGET. Full access forever.
			sessionConfig = {
				mode: 'payment',
				line_items: [
					{
						price_data: {
							currency: 'usd',
							product_data: { name: STRIPE_PRODUCTS.lifetime.name },
							unit_amount: STRIPE_PRODUCTS.lifetime.amountCents // $25.00
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
		} else if (pricingMode === 'monthly') {
			// $9.99/month — full access while subscribed. No trial (charges the first
			// month immediately, so there's no "bills me later" surprise). The free
			// first prediction already delivered the aha before this wall.
			sessionConfig = {
				mode: 'subscription',
				line_items: [
					{
						price_data: {
							currency: 'usd',
							product_data: { name: STRIPE_PRODUCTS.monthly.name },
							unit_amount: STRIPE_PRODUCTS.monthly.amountCents, // $9.99
							recurring: { interval: 'month' }
						},
						quantity: 1
					}
				],
				metadata: { plan: 'monthly' },
				subscription_data: { metadata: { plan: 'monthly' } },
				success_url: `${origin}/ai?upgrade=success&plan=monthly&session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${origin}/pro?canceled=1`
			};
		} else if (pricingMode === 'single') {
			// $4.99 — one school's full deep-dive + verdict (per-school; not full access).
			const slug = String(body.slug || '');
			const schoolName = String(body.schoolName || '').slice(0, 80);
			if (!/^[a-z0-9-]{2,32}$/.test(slug) || !schoolName) {
				return json({ error: 'Invalid school for the single-school deep-dive.' }, { status: 400 });
			}
			sessionConfig = {
				mode: 'payment',
				line_items: [
					{
						price_data: {
							currency: 'usd',
							product_data: { name: STRIPE_PRODUCTS.single.name },
							unit_amount: STRIPE_PRODUCTS.single.amountCents // $4.99
						},
						quantity: 1
					}
				],
				// One product backs every single-school unlock; the specific school
				// rides in metadata (and the success_url slug) for attribution.
				metadata: { plan: 'single', slug, schoolName },
				success_url: `${origin}/ai?upgrade=success&plan=single&slug=${slug}&session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${origin}/pro?canceled=1`
			};
		} else {
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
