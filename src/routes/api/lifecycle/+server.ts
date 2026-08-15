// Lifecycle capture: called once (client-guarded) after a user signs in with
// Google. Adds them to the Resend Audience (so campaigns can reach them) and
// sends the honest "your predictions are ready" welcome. Fail-closed: if Resend
// isn't configured, this is a clean no-op and returns { ok:true, skipped:true }.
import { json, type RequestHandler } from '@sveltejs/kit';
import { emailConfigured, sendEmail, upsertContact } from '$lib/server/email';
import { welcomeEmail } from '$lib/server/emailTemplates';

export const POST: RequestHandler = async (event) => {
	const session = await event.locals.auth?.();
	const email = session?.user?.email;
	if (!email) return json({ ok: false, error: 'not signed in' }, { status: 401 });

	// Dormant until Resend creds are set — never error, just skip.
	if (!emailConfigured()) return json({ ok: true, skipped: true });

	const name = session.user?.name ?? undefined;
	// Build the list first (this is the durable "everyone who signed up" audience),
	// then send the welcome. Both are best-effort; failures don't block the app.
	await upsertContact(email, name);
	const { subject, html } = welcomeEmail(name);
	const sent = await sendEmail({ to: email, subject, html });
	return json({ ok: sent.ok, skipped: sent.skipped });
};
