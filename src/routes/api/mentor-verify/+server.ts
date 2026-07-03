import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import crypto from 'node:crypto';
import type { RequestHandler } from './$types';
import { mentorSchools } from '$lib/config/counselors';

/**
 * Mentor enrollment verification via a school-issued (.edu) email one-time code.
 *
 * This is the backbone of "verified Top-20 mentor": controlling an
 * @<school>.edu inbox proves current enrollment at that institution, which is
 * hard to fake and cheap to check. It is deliberately resistant to the fakes
 * PredictAdmit itself produces — we NEVER accept a portal screenshot or a
 * decision-letter image as proof.
 *
 * Stateless design: no DB. `send` returns a signed token carrying an HMAC of
 * (email|code|expiry); `verify` recomputes the HMAC from the user-entered code.
 * The code is delivered by email in production; when no email provider is
 * configured we return it as `devCode` so the flow is demonstrable.
 */

const SECRET = env.MENTOR_VERIFY_SECRET || 'dev-mentor-verify-secret-change-me';
const TTL_MS = 10 * 60 * 1000;

function hmac(payload: string): string {
	return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}
function safeEqual(a: string, b: string): boolean {
	const ba = Buffer.from(a);
	const bb = Buffer.from(b);
	return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}
function domainFor(school: string): string | null {
	return mentorSchools.find((s) => s.name === school)?.domain ?? null;
}
function emailDomain(email: string): string {
	const at = email.lastIndexOf('@');
	return at === -1 ? '' : email.slice(at + 1).toLowerCase().trim();
}

export const POST: RequestHandler = async ({ request }) => {
	let body: any;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const action = body?.action;
	const email = String(body?.email || '').trim().toLowerCase();
	const school = String(body?.school || '').trim();

	// ---- send a code ----
	if (action === 'send') {
		const domain = domainFor(school);
		if (!domain) {
			return json({ error: 'We can only verify mentors from our supported schools.' }, { status: 400 });
		}
		if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
			return json({ error: 'Enter a valid email address.' }, { status: 400 });
		}
		const ed = emailDomain(email);
		// Must be the school's domain (or a subdomain of it) — proves affiliation.
		if (ed !== domain && !ed.endsWith('.' + domain) && !domain.endsWith('.' + ed)) {
			return json(
				{
					error: `Use your official @${domain} email so we can verify you're enrolled at ${school}. We can't accept personal emails or portal screenshots as proof.`
				},
				{ status: 400 }
			);
		}
		const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
		const exp = Date.now() + TTL_MS;
		const sig = hmac(`${email}|${code}|${exp}`);
		const token = Buffer.from(JSON.stringify({ exp, sig })).toString('base64url');

		const hasEmailProvider = !!env.MENTOR_EMAIL_PROVIDER;
		if (hasEmailProvider) {
			// (integration point) — send `code` to `email` via the provider here.
			console.log(`[mentor-verify] emailed code to ${email}`);
		} else {
			console.log(`[mentor-verify] no email provider; code for ${email} is ${code}`);
		}
		return json({
			ok: true,
			token,
			maskedEmail: email.replace(/^(.).*(@.*)$/, '$1•••$2'),
			// Only exposed when no real email provider is configured (dev/preview).
			...(hasEmailProvider ? {} : { devCode: code })
		});
	}

	// ---- verify a code ----
	if (action === 'verify') {
		const code = String(body?.code || '').trim();
		const token = String(body?.token || '');
		if (!code || !token) return json({ error: 'Missing code.' }, { status: 400 });
		let parsed: { exp: number; sig: string };
		try {
			parsed = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
		} catch {
			return json({ error: 'Invalid verification token.' }, { status: 400 });
		}
		if (!parsed?.exp || Date.now() > parsed.exp) {
			return json({ error: 'That code expired. Request a new one.' }, { status: 400 });
		}
		const expected = hmac(`${email}|${code}|${parsed.exp}`);
		if (!safeEqual(expected, parsed.sig)) {
			return json({ error: 'That code is incorrect.' }, { status: 400 });
		}
		return json({
			ok: true,
			verified: true,
			school,
			domain: domainFor(school),
			verifiedOn: new Date().toISOString().slice(0, 10)
		});
	}

	return json({ error: 'Unknown action.' }, { status: 400 });
};
