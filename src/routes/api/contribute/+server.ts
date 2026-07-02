import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

/**
 * Consented data-flywheel intake. A student can opt in to share their
 * (optionally anonymized) profile + outcome to grow the community corpus that
 * powers the Community Admits view and future real admit-stat distributions.
 *
 * With no database in this repo, we forward the payload to a configurable
 * webhook (env CONTRIBUTE_WEBHOOK_URL — e.g. a Google Apps Script, Airtable,
 * Zapier, or Slack Incoming Webhook). If unset, we accept and no-op so the UX
 * still works locally. We only ever store/forward what the user submitted.
 */
export const POST: RequestHandler = async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	if (!body?.consent) {
		return json({ error: 'Consent is required to contribute.' }, { status: 400 });
	}

	// Whitelist fields — never forward anything the client didn't intend.
	const record = {
		submittedAt: new Date().toISOString(),
		anonymous: !!body.anonymous,
		displayName: body.anonymous ? 'Anonymous applicant' : String(body.displayName || '').slice(0, 80),
		gradYear: body.gradYear ?? null,
		major: String(body.major || '').slice(0, 120),
		gpaWeighted: body.gpaWeighted ?? null,
		gpaUnweighted: body.gpaUnweighted ?? null,
		sat: body.sat ?? null,
		act: body.act ?? null,
		activities: String(body.activities || '').slice(0, 4000),
		awards: String(body.awards || '').slice(0, 2000),
		results: Array.isArray(body.results)
			? body.results.slice(0, 60).map((r: any) => ({
					school: String(r.school || r.slug || '').slice(0, 120),
					slug: String(r.slug || '').slice(0, 60),
					outcome: String(r.outcome || '').slice(0, 20)
				}))
			: []
	};

	const webhook = env.CONTRIBUTE_WEBHOOK_URL;
	if (webhook) {
		try {
			await fetch(webhook, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(record)
			});
		} catch (e) {
			console.error('[Contribute] webhook forward failed', e);
			// Still succeed for the user — we don't want to lose their goodwill.
		}
	} else {
		console.log('[Contribute] received (no webhook configured):', record.displayName, record.results.length, 'results');
	}

	return json({ ok: true });
};
