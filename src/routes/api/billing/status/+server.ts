// src/routes/api/billing/status/+server.ts
//
// Read-only plan status for the account page, straight from Stripe by email. This
// is what makes the "Current plan" card truthful (monthly vs lifetime vs free)
// and decides whether to show the "Manage subscription" button. It never mutates
// anything. Entitlement enforcement still lives in $lib/server/entitlement.
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;

const ACTIVE_SUB = new Set(['trialing', 'active', 'past_due']);
const PAID_ONE_TIME = new Set(['season', 'season_plus', 'lifetime']);

export const GET: RequestHandler = async ({ locals }) => {
	const email = (await locals.auth?.())?.user?.email?.toLowerCase();
	if (!email) {
		return json({ signedIn: false, plan: 'none', hasBilling: false, billingConfigured: true });
	}

	// Billing not wired up: entitlement fails open, so the user has access but
	// there is nothing to manage. Let the UI show the unlocked state.
	if (!STRIPE_SECRET_KEY) {
		return json({ signedIn: true, plan: 'unknown', hasBilling: false, billingConfigured: false });
	}

	const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any });

	try {
		const customers = await stripe.customers.list({ email, limit: 5 });
		const hasBilling = customers.data.length > 0;

		let plan: 'monthly' | 'lifetime' | 'single' | 'none' = 'none';
		let subscription: {
			status: string;
			cancelAtPeriodEnd: boolean;
			currentPeriodEnd: number | null;
		} | null = null;

		// Active subscription wins (that is the thing a customer can edit/cancel).
		for (const c of customers.data) {
			const subs = await stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 10 });
			const active = subs.data.find((s) => ACTIVE_SUB.has(s.status));
			if (active) {
				plan = 'monthly';
				subscription = {
					status: active.status,
					cancelAtPeriodEnd: active.cancel_at_period_end,
					currentPeriodEnd: (active as any).current_period_end ?? null
				};
				break;
			}
		}

		// No subscription: look for a paid one-time purchase (lifetime, then single).
		if (plan === 'none') {
			for (const c of customers.data) {
				const sessions = await stripe.checkout.sessions.list({ customer: c.id, limit: 25 });
				if (
					sessions.data.some(
						(s) =>
							s.payment_status === 'paid' && PAID_ONE_TIME.has((s.metadata?.plan as string) ?? '')
					)
				) {
					plan = 'lifetime';
					break;
				}
				if (
					sessions.data.some(
						(s) => s.payment_status === 'paid' && (s.metadata?.plan as string) === 'single'
					)
				) {
					plan = 'single';
				}
			}
		}

		return json({ signedIn: true, plan, hasBilling, billingConfigured: true, subscription });
	} catch (err) {
		console.error('Stripe billing status error:', err);
		// Fail soft: the account page still renders, just without live plan detail.
		return json({
			signedIn: true,
			plan: 'unknown',
			hasBilling: false,
			billingConfigured: true,
			error: true
		});
	}
};
