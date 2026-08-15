// Admin-only: send one honest campaign to the entire signed-up audience.
// Protected by ADMIN_TOKEN (env) — POST { token, template } where template is one
// of the honest lifecycle templates. Dormant/fail-closed until Resend is set.
//
// Usage: curl -X POST https://predictadmit.com/api/admin/broadcast \
//   -H 'content-type: application/json' -d '{"token":"<ADMIN_TOKEN>","template":"seeTheRest"}'
import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { sendBroadcast, emailConfigured } from '$lib/server/email';
import { seeTheRestEmail, upgradeEmail } from '$lib/server/emailTemplates';

const TEMPLATES: Record<string, () => { subject: string; html: string }> = {
	seeTheRest: () => seeTheRestEmail(),
	upgrade: () => upgradeEmail()
};

export const POST: RequestHandler = async ({ request }) => {
	const ADMIN = env.ADMIN_TOKEN;
	if (!ADMIN) return json({ error: 'ADMIN_TOKEN not set' }, { status: 503 });

	const body = await request.json().catch(() => ({}));
	if (body?.token !== ADMIN) return json({ error: 'forbidden' }, { status: 403 });
	if (!emailConfigured()) return json({ ok: true, skipped: true, reason: 'Resend not configured' });

	const make = TEMPLATES[body?.template as string];
	if (!make) return json({ error: `unknown template; use one of ${Object.keys(TEMPLATES).join(', ')}` }, { status: 400 });

	const { subject, html } = make();
	const res = await sendBroadcast(subject, html);
	return json(res, { status: res.ok || res.skipped ? 200 : 500 });
};
