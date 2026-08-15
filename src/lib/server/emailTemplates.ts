// PredictAdmit email templates — HONEST subjects only.
//
// These lean on the real inbox/portal metaphor truthfully (the user actually ran
// a simulation and has predictions waiting) — never a faked "your portal was
// updated" that impersonates a real admissions decision. Every template ends with
// the CAN-SPAM footer (physical address + unsubscribe).
import { env } from '$env/dynamic/private';

const BLUE = '#0052CC';
const SITE = 'https://predictadmit.com';
// CAN-SPAM requires a real physical postal address on commercial email. Set this
// in env before going live; the placeholder is intentionally obvious.
const POSTAL = env.EMAIL_POSTAL_ADDRESS || 'PredictAdmit — [set EMAIL_POSTAL_ADDRESS]';

function layout(bodyHtml: string, opts: { preheader?: string } = {}): string {
	return `<!doctype html><html><body style="margin:0;background:#f5f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
	${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>` : ''}
	<div style="max-width:520px;margin:0 auto;padding:32px 20px;">
		<div style="font-weight:800;font-size:18px;color:${BLUE};letter-spacing:-0.02em;margin-bottom:24px;">PredictAdmit</div>
		<div style="background:#ffffff;border:1px solid #e6ebf5;border-radius:20px;padding:28px;">
			${bodyHtml}
		</div>
		<p style="margin:22px 4px 0;font-size:11px;line-height:1.6;color:#94a3b8;">
			You're getting this because you signed in to PredictAdmit with this email.
			PredictAdmit runs admissions <em>simulations</em> — nothing here is a real or official decision, and we're not affiliated with any university.<br />
			${POSTAL}<br />
			<a href="{{RESEND_UNSUBSCRIBE_URL}}" style="color:#94a3b8;text-decoration:underline;">Unsubscribe</a>
		</p>
	</div>
</body></html>`;
}

function button(href: string, label: string): string {
	return `<a href="${href}" style="display:inline-block;background:${BLUE};color:#fff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 22px;border-radius:14px;">${label}</a>`;
}

const firstName = (name?: string) => (name && name.trim() ? name.trim().split(/\s+/)[0] : 'there');

/** Sent right after a user first signs in — their predictions are waiting. */
export function welcomeEmail(name?: string): { subject: string; html: string } {
	return {
		subject: 'Your 39 admissions predictions are ready to open',
		html: layout(
			`<h1 style="margin:0 0 12px;font-size:22px;font-weight:800;">Hi ${firstName(name)} — your predictions are waiting.</h1>
			<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#475569;">
				PredictAdmit's AI reads your real application and calls your likely decision — accept, deny, or waitlist — at all 39 top schools. Your first one is free to open.
			</p>
			${button(`${SITE}/ai`, 'Open my predictions →')}
			<p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#94a3b8;">It's an estimate calibrated on real admissions results, not an official decision.</p>`,
			{ preheader: 'Open your first prediction free — accept, deny, or waitlist at 39 top schools.' }
		)
	};
}

/** Nudge after they've opened their one free decision but haven't upgraded. */
export function seeTheRestEmail(name?: string): { subject: string; html: string } {
	return {
		subject: 'You opened 1 of your 39 — here’s what the rest say',
		html: layout(
			`<h1 style="margin:0 0 12px;font-size:22px;font-weight:800;">Curious about the other 38, ${firstName(name)}?</h1>
			<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#475569;">
				You've seen one predicted decision. Open any other for $4.99 (deep-dive on why included), or unlock all 39 — plus unlimited re-runs and Pro essay editing — for $25 once (or $9.99/mo).
			</p>
			${button(`${SITE}/ai`, 'See the rest of my decisions →')}
			<p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#94a3b8;">A private counselor runs $5,000+ a season. This is a fraction of one hour.</p>`,
			{ preheader: 'Open any decision for $4.99, or unlock all 39 for $25 once.' }
		)
	};
}

/** Value-forward upgrade nudge — leans on the essay editing rising seniors pay for. */
export function upgradeEmail(name?: string): { subject: string; html: string } {
	return {
		subject: 'Your essays, read like an admissions officer would',
		html: layout(
			`<h1 style="margin:0 0 12px;font-size:22px;font-weight:800;">More than predictions, ${firstName(name)}.</h1>
			<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#475569;">
				Pro includes unlimited AI essay editing — line-by-line notes an admissions reader would give — plus every school's deep-dive and the AI counselor. Everything, $25 once (or $9.99/mo).
			</p>
			${button(`${SITE}/pro`, 'See everything Pro includes →')}`,
			{ preheader: 'Unlimited essay editing, every deep-dive, the AI counselor — $25 once.' }
		)
	};
}
