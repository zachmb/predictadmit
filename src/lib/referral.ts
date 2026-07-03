// src/lib/referral.ts
// Client side of the invite loop: capture ?ref= on landing, reward both sides
// when the invited visitor joins. Pairs with /api/referrals.
import { browser } from '$app/environment';
import { awardPoints } from '$lib/stores/points';
import { INVITE_REWARD, referralCodeFor } from '$lib/config/community';

const PENDING_KEY = 'predictadmit:referral:pending';
const REDEEMED_KEY = 'predictadmit:referral:redeemed';
const CREDITED_KEY = 'predictadmit:referral:credited';

/** Stash the inviter's code from a ?ref= URL so we can credit them when this visitor joins. */
export function captureReferral(url: URL) {
	if (!browser) return;
	const ref = url.searchParams.get('ref');
	if (!ref) return;
	try {
		if (localStorage.getItem(REDEEMED_KEY)) return; // already joined via a referral
		if (!localStorage.getItem(PENDING_KEY)) {
			localStorage.setItem(PENDING_KEY, ref.slice(0, 40).toLowerCase());
		}
	} catch {
		/* ignore storage errors */
	}
}

/**
 * Call whenever the current user has an identity (signed in / named). If they
 * arrived via a friend's invite link and haven't been rewarded yet, award the
 * invitee's points and report the redemption so the inviter gets credited too.
 */
export function redeemReferralIfJoined(nameOrEmail: string) {
	if (!browser || !nameOrEmail) return;
	let code: string | null = null;
	try {
		if (localStorage.getItem(REDEEMED_KEY)) return;
		code = localStorage.getItem(PENDING_KEY);
	} catch {
		return;
	}
	if (!code) return;
	if (code === referralCodeFor(nameOrEmail)) return; // can't refer yourself
	try {
		localStorage.setItem(REDEEMED_KEY, new Date().toISOString());
		localStorage.removeItem(PENDING_KEY);
	} catch {
		/* ignore */
	}
	awardPoints('invitee-join', INVITE_REWARD.points, "Joined from a friend's invite link");
	fetch('/api/referrals', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ code, joined: nameOrEmail.slice(0, 80) })
	}).catch(() => {
		/* reward already granted locally; reporting is best-effort */
	});
}

/**
 * Inviter side: ask the server how many people joined with our code and award
 * points for any redemptions not yet credited locally.
 */
export async function syncInviterRewards(selfCode: string): Promise<number> {
	if (!browser || !selfCode) return 0;
	try {
		const res = await fetch(`/api/referrals?code=${encodeURIComponent(selfCode)}`);
		if (!res.ok) return 0;
		const data = await res.json();
		const count = Number(data?.count) || 0;
		const credited = Number(localStorage.getItem(CREDITED_KEY) || 0);
		for (let i = credited; i < count; i++) {
			awardPoints(
				`referral:${selfCode}:${i}`,
				INVITE_REWARD.points,
				'A friend joined with your invite link'
			);
		}
		if (count > credited) localStorage.setItem(CREDITED_KEY, String(count));
		return Math.max(0, count - credited);
	} catch {
		return 0;
	}
}
