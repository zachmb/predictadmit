// Server-side guards for the AI endpoints.
//
// WHY: every /api/ai* + parse/ocr route was previously unauthenticated and
// unmetered, so an anonymous script could hammer DeepSeek/Claude and run up an
// unbounded bill (and the "paywall" protected nothing). These guards make the
// expensive routes require a signed-in user and throttle bursts.
//
// Auth is the real cutoff (no anonymous access). The rate limiter is in-memory
// and therefore best-effort on serverless (state resets on cold start), but it
// still throttles a sustained loop on a warm instance — meaningful defense in
// depth layered on top of auth. If a hard, cross-instance cap is later needed,
// swap `buckets` for a shared store (Upstash/KV) behind the same interface.
import { json, type RequestEvent } from '@sveltejs/kit';
import { hasActivePlan } from './entitlement';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/** Sliding fixed-window limiter. Returns true if the call is allowed. */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
	const now = Date.now();
	const b = buckets.get(key);
	if (!b || now >= b.resetAt) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return true;
	}
	if (b.count >= max) return false;
	b.count += 1;
	return true;
}

export type GuardOk = { ok: true; email: string; ip: string };
export type GuardFail = { ok: false; response: Response };

/**
 * Require a signed-in user + apply per-user and per-IP rate limits. Returns the
 * caller identity on success, or a ready-to-return error Response on failure
 * (401 unauthenticated / 429 throttled) — keeping the `{ error }` JSON shape the
 * frontend already expects.
 */
export async function guardAi(
	event: RequestEvent,
	opts?: { max?: number; windowMs?: number; requirePlan?: boolean }
): Promise<GuardOk | GuardFail> {
	const session = await event.locals.auth?.();
	const email = session?.user?.email;
	if (!email) {
		return {
			ok: false,
			response: json({ error: 'Please sign in to use this feature.' }, { status: 401 })
		};
	}
	const ip = event.getClientAddress?.() ?? 'unknown';
	const max = opts?.max ?? 20; // per user per window
	const windowMs = opts?.windowMs ?? 60_000; // 1 minute
	// Per-user cap is the primary gate; a looser per-IP cap catches one account
	// scripting many parallel calls without punishing shared-NAT classmates.
	if (!rateLimit(`ai:${email}`, max, windowMs) || !rateLimit(`ip:${ip}`, max * 4, windowMs)) {
		return {
			ok: false,
			response: json(
				{ error: 'You’re going a bit fast — give it a moment and try again.' },
				{ status: 429 }
			)
		};
	}
	// Plan gate (the unforgeable cutoff): the client `isPro` flag lives in
	// localStorage, so a forged flag could reach this route. Confirm a real plan
	// with Stripe. hasActivePlan is cached + coalesced (one lookup per sim burst)
	// and FAIL-OPEN, so a Stripe hiccup never blocks a paying customer.
	if (opts?.requirePlan && !(await hasActivePlan(email))) {
		return {
			ok: false,
			response: json(
				{ error: 'Start your free trial to run predictions.', code: 'plan_required' },
				{ status: 402 }
			)
		};
	}
	return { ok: true, email, ip };
}

// One free simulation, then the wall. A signed-in non-Pro user gets their FIRST
// full run free — that's the aha moment that converts anxious applicants. We meter
// it with an httpOnly cookie counting non-Pro evaluate calls: a single simulation
// fans out to ~39 school requests, so a budget of 45 covers exactly one run (plus a
// little slack for the odd retry) and then returns 402 plan_required.
//
// This is a CONVERSION gate, not a security boundary — the real cost ceiling is the
// auth + rate limit inside guardAi. Clearing the cookie yields at most one more
// metered run, an acceptable leak for a growth lever (and still auth'd + throttled).
const FREE_SIM_CALL_BUDGET = 45;
const FREE_COOKIE = 'pa_free_used';

export async function guardEvaluation(event: RequestEvent): Promise<GuardOk | GuardFail> {
	// Auth + per-user/IP rate limit — but NOT requirePlan, so the free run passes.
	const g = await guardAi(event, { max: 60, windowMs: 60_000 });
	if (!g.ok) return g;

	// Pro / trial customers are unlimited.
	if (await hasActivePlan(g.email)) return g;

	// Non-Pro: meter the single free simulation.
	const used = Number.parseInt(event.cookies.get(FREE_COOKIE) ?? '0', 10) || 0;
	if (used >= FREE_SIM_CALL_BUDGET) {
		return {
			ok: false,
			response: json(
				{
					error: 'That was your free prediction — start your trial for unlimited runs.',
					code: 'plan_required'
				},
				{ status: 402 }
			)
		};
	}
	event.cookies.set(FREE_COOKIE, String(used + 1), {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 365
	});
	return g;
}
