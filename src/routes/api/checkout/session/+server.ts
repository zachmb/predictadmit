import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;

const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20'
});

export const GET: RequestHandler = async ({ url }) => {
  if (!STRIPE_SECRET_KEY) {
    return json({ error: 'Stripe not configured on server' }, { status: 500 });
  }

  const sessionId = url.searchParams.get('session_id');

  if (!sessionId) {
    return json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return json({
      id: session.id,
      payment_status: session.payment_status,
      status: session.status,
      customer_email: session.customer_details?.email ?? null
    });
  } catch (err) {
    console.error('Error fetching checkout session:', err);
    return json({ error: 'Failed to fetch session' }, { status: 500 });
  }
};
