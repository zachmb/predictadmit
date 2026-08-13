// Server-side plan entitlement — the real cutoff behind the /ai trial gate.
//
// The client gate trusts `isPro` in localStorage, which a determined user could
// forge. This module answers "does this signed-in email actually have a plan?"
// straight from Stripe, so a forged localStorage flag can't run a real
// simulation.
//
// SAFETY (money/auth code): this is FAIL-OPEN. On any Stripe error — or when
// billing isn't configured — we return `true` so a real, paying customer is
// NEVER blocked by a transient issue. We only return `false` when Stripe
// POSITIVELY reports no active plan for the email. The AI routes are already
// auth + rate-limited, so the bounded downside of fail-open is a rare, throttled
// bypass window, not an unbounded bill.
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
const stripe = STRIPE_SECRET_KEY
	? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any })
	: null;

// Manual grandfather / comp list (comma-separated emails, env-configurable). A
// safety valve: any existing payer whose Stripe customer email doesn't match
// their Google login (pre-`customer_email` checkouts), plus any staff/comp, is
// always entitled — no code change needed to unblock someone.
const GRANDFATHERED = new Set(
	(env.PRO_GRANDFATHER_EMAILS ?? '')
		.split(',')
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean)
);

// A subscription in any of these states means full access (trial or paid
// monthly) is currently usable.
const ACTIVE_SUB = new Set(['trialing', 'active', 'past_due']);
// One-time purchases that grant FULL access. NOTE: a $14.99 'school' pass unlocks
// ONE school's deep-dive only (tracked per-school in proSchools), NOT the full
// simulator — so it is intentionally excluded here, matching the client gate
// (which requires isPro, and a school pass does not set isPro).
const PAID_ONE_TIME = new Set(['lifetime']);

type Entry = { entitled: boolean; expiresAt: number };
const cache = new Map<string, Entry>();
const pending = new Map<string, Promise<boolean>>();
// A confirmed plan is stable — cache it a while. A confirmed-free result is
// cached only briefly so someone who just started a trial unlocks within seconds.
const POS_TTL_MS = 5 * 60_000;
const NEG_TTL_MS = 15_000;

async function lookupFromStripe(email: string): Promise<boolean> {
	if (!stripe) return true; // billing unconfigured → can't enforce; never block
	const customers = await stripe.customers.list({ email, limit: 5 });
	for (const c of customers.data) {
		const subs = await stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 10 });
		if (subs.data.some((s) => ACTIVE_SUB.has(s.status))) return true;
		const sessions = await stripe.checkout.sessions.list({ customer: c.id, limit: 20 });
		if (
			sessions.data.some(
				(s) => s.payment_status === 'paid' && PAID_ONE_TIME.has((s.metadata?.plan as string) ?? '')
			)
		) {
			return true;
		}
	}
	return false;
}

/**
 * Does this signed-in email have an active plan (trial/monthly subscription, or a
 * paid lifetime/school purchase)? Cached + request-coalesced, so one simulation
 * (which fans out to ~38 school requests at once) triggers a SINGLE Stripe lookup.
 * Fail-open on error/unconfigured — see the file header.
 */
export async function hasActivePlan(email: string): Promise<boolean> {
	const key = email.trim().toLowerCase();
	if (!key) return false;
	if (GRANDFATHERED.has(key)) return true;
	const now = Date.now();

	const hit = cache.get(key);
	if (hit && now < hit.expiresAt) return hit.entitled;

	const inflight = pending.get(key);
	if (inflight) return inflight;

	const promise = (async () => {
		let entitled: boolean;
		let ttl: number;
		try {
			entitled = await lookupFromStripe(key);
			ttl = entitled ? POS_TTL_MS : NEG_TTL_MS;
		} catch {
			// Transient Stripe failure: reuse the last known answer if we have one,
			// otherwise fail-open (true). Cache only briefly so we re-check soon.
			entitled = hit?.entitled ?? true;
			ttl = NEG_TTL_MS;
		}
		cache.set(key, { entitled, expiresAt: Date.now() + ttl });
		pending.delete(key);
		return entitled;
	})();

	pending.set(key, promise);
	return promise;
}
