// src/routes/api/checkout/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;

const STRIPE_PRICE_ID = env.STRIPE_PRICE_ID;

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
      // Keeping legacy logic just in case, or map 'cycle' to this if we consider it the subscription
      // But requirements said "$9 for full cycle"
    }

    const { pricingMode } = body; // 'cycle' | 'one_time'

    if (pricingMode === 'cycle') {
      // $9.00 Full Cycle
      sessionConfig = {
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'PredictAdmit Pro - Full Application Cycle',
                description: 'Unlimited access for the entire application cycle.'
              },
              unit_amount: 900, // $9.00
            },
            quantity: 1
          }
        ],
        success_url: 'http://localhost:5201/ai?upgrade=success&plan=cycle',
        cancel_url: 'http://localhost:5201/pro?canceled=1'
      };
    } else if (pricingMode === 'monthly') {
      // $5.00 Monthly Subscription
      sessionConfig = {
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'PredictAdmit Pro - Monthly Access',
                description: 'Monthly subscription. Cancel anytime.'
              },
              unit_amount: 500, // $5.00
              recurring: {
                interval: 'month'
              }
            },
            quantity: 1
          }
        ],
        success_url: 'http://localhost:5201/ai?upgrade=success&plan=monthly',
        cancel_url: 'http://localhost:5201/pro?canceled=1'
      };
    } else {
      // Fallback or Legacy (if existing calls use isMonthly)
      if (isMonthly) {
        // ... legacy code if needed, or error
      }
      // Default to error if no valid mode
      return json({ error: 'Invalid pricing mode.' }, { status: 400 });
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
