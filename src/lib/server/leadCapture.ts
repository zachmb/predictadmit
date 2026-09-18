// Capture every Google sign-in email so there is ONE place to see + export the
// full list of people who've signed into PredictAdmit.
//
// WHERE IT LANDS: a Stripe Customer (Stripe Dashboard → Customers, exportable as
// CSV). We reuse the Stripe key that already powers billing — no new datastore,
// no new env var, and the list is deduped by email.
//
// SAFETY: best-effort + FAIL-CLOSED. If Stripe isn't configured, or anything
// throws, this no-ops — a capture hiccup can NEVER block someone from signing in.
// Creating a bare customer does NOT grant a plan (entitlement requires an active
// subscription), so this never touches the paywall.
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
const stripe = STRIPE_SECRET_KEY
	? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any })
	: null;

// Warm-instance cache so a returning user doesn't trigger a Stripe lookup on
// every sign-in. Resets on cold start — that's fine, the create call is still
// idempotent (we list-before-create).
const seen = new Set<string>();

/**
 * Record a signed-in email as a Stripe Customer, idempotently. Called from the
 * Auth.js `signIn` event on every successful Google login.
 */
export async function captureSignInEmail(
	email: string | null | undefined,
	name?: string | null
): Promise<void> {
	if (!stripe) return; // billing not configured → dormant, no-op
	const clean = (email ?? '').trim().toLowerCase();
	if (!clean || !clean.includes('@')) return;
	if (seen.has(clean)) return;

	try {
		const existing = await stripe.customers.list({ email: clean, limit: 1 });
		if (existing.data.length === 0) {
			await stripe.customers.create({
				email: clean,
				name: name ?? undefined,
				metadata: { source: 'google_signin', product: 'predictadmit' }
			});
		}
		seen.add(clean);
	} catch (err) {
		// Never let a capture failure surface to the sign-in flow.
		console.error('[leadCapture] could not record sign-in email:', err);
	}
}
