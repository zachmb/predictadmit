import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;

const stripe = STRIPE_SECRET_KEY
	? new Stripe(STRIPE_SECRET_KEY, {
			apiVersion: '2025-01-27.acacia' as any
		})
	: null;

export const GET: RequestHandler = async ({ url }) => {
	if (!stripe) {
		return json({ error: 'Stripe not configured on server' }, { status: 500 });
	}

	const sessionId = url.searchParams.get('session_id');

	if (!sessionId) {
		return json({ error: 'Missing session_id' }, { status: 400 });
	}

	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		// Return the plan/slug FROM STRIPE METADATA (not the client's URL) so the
		// return page grants exactly what was paid for — a user can't replay a
		// $14.99 school session while claiming plan=lifetime.
		return json({
			id: session.id,
			payment_status: session.payment_status,
			status: session.status,
			plan: (session.metadata?.plan as string) ?? null,
			slug: (session.metadata?.slug as string) ?? null,
			customer_email: session.customer_details?.email ?? null
		});
	} catch (err) {
		console.error('Error fetching checkout session:', err);
		return json({ error: 'Failed to fetch session' }, { status: 500 });
	}
};
