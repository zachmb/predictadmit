import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

/**
 * Referral redemptions. Mirrors /api/contribute: with no database in this repo,
 * each redemption is forwarded to a configurable webhook (REFERRAL_WEBHOOK_URL,
 * falling back to CONTRIBUTE_WEBHOOK_URL) and tallied in memory so the
 * inviter's client can poll GET ?code= to collect credit. The in-memory tally
 * resets on redeploy/cold start — point the webhook at a sheet/Zap for a
 * durable record.
 */
const tallies = new Map<string, number>();

function normalizeCode(raw: unknown): string {
	return String(raw || '')
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '')
		.slice(0, 40);
}

export const POST: RequestHandler = async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const code = normalizeCode(body?.code);
	if (!code) return json({ error: 'Missing referral code' }, { status: 400 });

	tallies.set(code, (tallies.get(code) || 0) + 1);

	const record = {
		type: 'referral',
		redeemedAt: new Date().toISOString(),
		code,
		joined: String(body?.joined || '').slice(0, 80)
	};

	const webhook = env.REFERRAL_WEBHOOK_URL || env.CONTRIBUTE_WEBHOOK_URL;
	if (webhook) {
		try {
			await fetch(webhook, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(record)
			});
		} catch (e) {
			console.error('[Referrals] webhook forward failed', e);
			// Still succeed — the invitee's reward was already granted client-side.
		}
	} else {
		console.log('[Referrals] redemption (no webhook configured):', record.code);
	}

	return json({ ok: true, count: tallies.get(code) });
};

export const GET: RequestHandler = async ({ url }) => {
	const code = normalizeCode(url.searchParams.get('code'));
	return json({ code, count: tallies.get(code) || 0 });
};
