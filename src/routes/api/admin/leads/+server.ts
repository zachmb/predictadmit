// Admin-only: view/export every captured sign-in email (all Stripe customers,
// which includes everyone who signed in, upgraded or not). Protected by
// ADMIN_TOKEN (env), same as /api/admin/broadcast.
//
// JSON:  GET https://predictadmit.com/api/admin/leads?token=<ADMIN_TOKEN>
// CSV:   GET https://predictadmit.com/api/admin/leads?token=<ADMIN_TOKEN>&format=csv
import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { listSignInLeads } from '$lib/server/leadCapture';

export const GET: RequestHandler = async ({ url }) => {
	const ADMIN = env.ADMIN_TOKEN;
	if (!ADMIN) return json({ error: 'ADMIN_TOKEN not set' }, { status: 503 });
	if (url.searchParams.get('token') !== ADMIN)
		return json({ error: 'forbidden' }, { status: 403 });

	const leads = await listSignInLeads();

	if (url.searchParams.get('format') === 'csv') {
		const esc = (s: string) => `"${(s ?? '').replace(/"/g, '""')}"`;
		const rows = ['email,name,source,created_iso'];
		for (const l of leads) {
			const created = new Date(l.created * 1000).toISOString();
			rows.push([esc(l.email), esc(l.name ?? ''), esc(l.source), esc(created)].join(','));
		}
		return new Response(rows.join('\n'), {
			headers: {
				'content-type': 'text/csv; charset=utf-8',
				'content-disposition': 'attachment; filename="predictadmit-leads.csv"'
			}
		});
	}

	// Quick breakdown so you can see at a glance how many came from sign-in vs Stripe.
	const bySource: Record<string, number> = {};
	for (const l of leads) bySource[l.source] = (bySource[l.source] ?? 0) + 1;

	return json({ count: leads.length, bySource, leads });
};
