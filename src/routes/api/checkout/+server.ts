// src/routes/api/checkout/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_PRICE_ID } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
  try {
    if (!STRIPE_SECRET_KEY) {
      return json({ error: 'Server misconfigured: Stripe secret key is missing.' }, { status: 500 });
    }

    const body = await request.json();
    const { isMonthly } = body;

    // ✅ Create Stripe client
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20'
    });

    let sessionConfig: Stripe.Checkout.SessionCreateParams;

    if (isMonthly) {
      // Monthly Subscription ($19/mo) - Uses env var price ID (assumed to be the monthly price)
      if (!STRIPE_PRICE_ID) {
        return json({ error: 'Server misconfigured: Monthly price ID is missing.' }, { status: 500 });
      }
      sessionConfig = {
        mode: 'subscription',
        line_items: [
          {
            price: STRIPE_PRICE_ID,
            quantity: 1
          }
        ],
        success_url: 'http://localhost:5201/ai?upgrade=success&plan=monthly',
        cancel_url: 'http://localhost:5201/pricing?canceled=1'
      };
    } else {
      // Full Application Cycle ($29 one-time) - Uses provided Product ID
      // We use price_data to specify the amount and currency inline, linked to the product.
      sessionConfig = {
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product: 'prod_ThAtfBHvk7fSZZ', // Provided by user
              unit_amount: 2900, // $29.00
              product_data: undefined // We provide 'product' ID directly, so product_data object isn't needed if product exists
            },
            quantity: 1
          }
        ],
        success_url: 'http://localhost:5201/ai?upgrade=success&plan=full_cycle',
        cancel_url: 'http://localhost:5201/pricing?canceled=1'
      };
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
