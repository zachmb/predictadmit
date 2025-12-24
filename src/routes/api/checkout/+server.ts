// src/routes/api/checkout/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_PRICE_ID } from '$env/static/private';

export const POST: RequestHandler = async () => {
  try {
    if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID) {
      console.error('Missing Stripe env vars:', {
        hasSecret: !!STRIPE_SECRET_KEY,
        priceId: STRIPE_PRICE_ID
      });

      return json(
        { error: 'Server misconfigured: Stripe keys are missing.' },
        { status: 500 }
      );
    }

    // ✅ Create Stripe client *inside* the handler so any errors are caught
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20'
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      success_url: 'http://localhost:5201/ai?upgrade=success',
      cancel_url: 'http://localhost:5201/pricing?canceled=1'
    });

    if (!session.url) {
      console.error('Stripe session missing URL:', session);

      return json(
        { error: 'Stripe did not return a checkout URL.' },
        { status: 500 }
      );
    }

    // ✅ Always return valid JSON
    return json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);

    return json(
      { error: 'Failed to start Stripe checkout.' },
      { status: 500 }
    );
  }
};
