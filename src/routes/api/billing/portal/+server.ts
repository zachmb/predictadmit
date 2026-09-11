// src/routes/api/billing/portal/+server.ts
//
// Opens the Stripe Customer Billing Portal so a customer can edit their own
// subscription: update the card, cancel monthly, or download invoices. We do the
// cancel/update through Stripe's hosted portal on purpose. It is the money-safe
// path (no custom cancel logic to get wrong), and it only ever shows what the
// customer actually has in Stripe.
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!STRIPE_SECRET_KEY) {
		return json({ error: 'Billing is not configured right now.' }, { status: 500 });
	}

	const email = (await locals.auth?.())?.user?.email?.toLowerCase();
	if (!email) {
		return json({ error: 'Please sign in to manage your subscription.' }, { status: 401 });
	}

	const origin = new URL(request.url).origin;
	const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any });

	try {
		// A customer may have more than one record (e.g. a separate one-time buy).
		// Prefer the one that actually carries a subscription so the portal opens on
		// something manageable; otherwise fall back to the most recent.
		const customers = await stripe.customers.list({ email, limit: 5 });
		if (customers.data.length === 0) {
			return json(
				{
					error: 'no_billing',
					message:
						"We couldn't find a billing account for this email. If you paid with a different address, reach out and we'll link it."
				},
				{ status: 404 }
			);
		}

		let customerId = customers.data[0].id;
		for (const c of customers.data) {
			const subs = await stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 1 });
			if (subs.data.length > 0) {
				customerId = c.id;
				break;
			}
		}

		const session = await stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: `${origin}/account`
		});

		return json({ url: session.url });
	} catch (err) {
		// The most common cause is the Customer Portal not being enabled in the
		// Stripe dashboard yet. Report a friendly message and log the real error.
		console.error('Stripe billing portal error:', err);
		return json(
			{
				error:
					'We could not open the billing portal. Please try again in a moment, or contact support.'
			},
			{ status: 500 }
		);
	}
};
