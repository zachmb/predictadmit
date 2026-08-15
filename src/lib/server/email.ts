// Resend email client for PredictAdmit — lifecycle + conversion email.
//
// DORMANT + FAIL-CLOSED (hard rule): every function is a safe no-op until
// RESEND_API_KEY (and, for list capture, RESEND_AUDIENCE_ID) are set in env. No
// key → we never throw and never half-send; the app behaves exactly as before.
// This lets us ship the wiring now and flip it live by adding env + verifying a
// sending domain in Resend, with zero code change.
//
// CAN-SPAM: marketing sends MUST carry an unsubscribe + a physical postal address
// and an honest, non-deceptive subject. We NEVER fake an admissions "portal status
// update" — that's illegal (deceptive subject), nukes deliverability, and betrays
// the product's whole "everything is clearly a simulation" honesty. Templates live
// in emailTemplates.ts and all include the required footer.
import { env } from '$env/dynamic/private';

const API = 'https://api.resend.com';
const KEY = env.RESEND_API_KEY;
const AUDIENCE_ID = env.RESEND_AUDIENCE_ID;
// Must be a verified-domain sender in the Resend account, e.g.
// "PredictAdmit <hello@predictadmit.com>".
const FROM = env.EMAIL_FROM || 'PredictAdmit <hello@predictadmit.com>';

export function emailConfigured(): boolean {
	return !!KEY;
}

type Result = { ok: boolean; skipped?: boolean; id?: string; error?: string };

async function call(path: string, body: unknown, method = 'POST'): Promise<Result> {
	if (!KEY) return { ok: false, skipped: true };
	try {
		const res = await fetch(`${API}${path}`, {
			method,
			headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
			body: method === 'GET' ? undefined : JSON.stringify(body)
		});
		const data = await res.json().catch(() => ({}));
		if (!res.ok) return { ok: false, error: data?.message || `HTTP ${res.status}` };
		return { ok: true, id: data?.id };
	} catch (err) {
		return { ok: false, error: (err as Error).message };
	}
}

/** Send one transactional/lifecycle email. No-op (ok:false, skipped) if unconfigured. */
export async function sendEmail(opts: {
	to: string;
	subject: string;
	html: string;
	replyTo?: string;
}): Promise<Result> {
	return call('/emails', {
		from: FROM,
		to: opts.to,
		subject: opts.subject,
		html: opts.html,
		reply_to: opts.replyTo,
		// Broad list-unsubscribe so even lifecycle mail is one-click out — protects
		// domain reputation and keeps us on the right side of CAN-SPAM.
		headers: { 'List-Unsubscribe': '<mailto:unsubscribe@predictadmit.com>' }
	});
}

/**
 * Add/refresh a signed-up user in the Resend Audience so campaigns can reach them.
 * Idempotent on Resend's side (same email upserts). Skipped if no audience is set.
 */
export async function upsertContact(email: string, firstName?: string): Promise<Result> {
	if (!AUDIENCE_ID) return { ok: false, skipped: true };
	return call(`/audiences/${AUDIENCE_ID}/contacts`, {
		email: email.toLowerCase(),
		first_name: firstName,
		unsubscribed: false
	});
}

/**
 * Create + send a broadcast to the WHOLE audience (every signed-up user). Resend
 * handles per-recipient one-click unsubscribe for audience broadcasts (the
 * {{RESEND_UNSUBSCRIBE_URL}} token in the template is substituted). Skipped unless
 * both the key and an audience are configured.
 */
export async function sendBroadcast(subject: string, html: string): Promise<Result> {
	if (!KEY || !AUDIENCE_ID) return { ok: false, skipped: true };
	const created = await call('/broadcasts', {
		audience_id: AUDIENCE_ID,
		from: FROM,
		subject,
		html
	});
	if (!created.ok || !created.id) return created;
	return call(`/broadcasts/${created.id}/send`, {});
}
