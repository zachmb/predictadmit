// src/lib/config/community.ts
// Community + growth configuration. Update DISCORD_URL to your real invite.

export const DISCORD_URL = 'https://discord.gg/predictadmit';

// Reward shown for successful invites (cosmetic — mirrors Appybara's "+30 +1").
export const INVITE_REWARD = { credits: 30, energy: 1 };

/** Build a referral link that tags the inviter. Safe on server (falls back to prod origin). */
export function buildReferralLink(code: string, origin?: string): string {
	const base = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://predictadmit.com');
	const ref = encodeURIComponent(code || 'friend');
	return `${base}/?ref=${ref}`;
}

/** Derive a stable, shareable referral code from a name/email. */
export function referralCodeFor(nameOrEmail: string): string {
	const seed = (nameOrEmail || 'friend').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
	return seed || 'friend';
}
