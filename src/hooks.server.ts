import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { captureSignInEmail } from '$lib/server/leadCapture';

// Accept either naming convention for the Google credentials so a rename in the
// env file can't silently break sign-in.
const GOOGLE_ID = env.GOOGLE_CLIENT_ID || env.GOOGLE_ID;
const GOOGLE_SECRET = env.GOOGLE_CLIENT_SECRET || env.GOOGLE_SECRET;
const AUTH_SECRET = env.AUTH_SECRET;

// Fail loudly (in the server log) if a required secret is missing, instead of
// letting Auth.js throw an opaque "Configuration" error at request time.
if (!GOOGLE_ID || !GOOGLE_SECRET) {
	console.error(
		'[auth] Missing Google OAuth credentials. Set GOOGLE_ID/GOOGLE_CLIENT_ID and ' +
			'GOOGLE_SECRET/GOOGLE_CLIENT_SECRET in the environment. Google sign-in will fail until then.'
	);
}
if (!AUTH_SECRET) {
	console.error('[auth] Missing AUTH_SECRET. Set it in the environment or sign-in will fail.');
}

// IMPORTANT — Google Cloud console must register the callback URL that matches
// this basePath. With basePath `/auth`, the Authorized redirect URI is:
//   http://localhost:5173/auth/callback/google   (local dev — default vite port)
//   https://predictadmit.com/auth/callback/google (production)
// A mismatch here is what produces Google's "Error 400: redirect_uri_mismatch".
const { handle: authHandle } = SvelteKitAuth({
	providers: [
		Google({
			clientId: GOOGLE_ID,
			clientSecret: GOOGLE_SECRET
		})
	],
	// Pin the mount path so the OAuth callback URL is deterministic and stays in
	// sync with what's registered in the Google console.
	basePath: '/auth',
	// Derive the callback/redirect origin from the incoming request host, so the
	// same client works on localhost, preview deploys, and prod without a
	// hardcoded URL. (No AUTH_URL needed.)
	trustHost: true,
	secret: AUTH_SECRET,
	callbacks: {
		// PRIMARY capture point. The jwt callback is always awaited before the
		// session is issued, and `account` is only present on a fresh sign-in — so
		// this reliably logs EVERY new sign-in (Pro or not) on serverless, where a
		// fire-and-forget event could be cut off. Returns the token unchanged, so
		// the default session shape is preserved.
		async jwt({ token, account, user, profile }) {
			if (account) {
				const email =
					user?.email ?? (token.email as string | undefined) ?? (profile as any)?.email;
				const name = user?.name ?? (token.name as string | undefined) ?? (profile as any)?.name;
				await captureSignInEmail(email, name);
			}
			return token;
		}
	},
	events: {
		// Belt-and-suspenders: also capture from the signIn event. Deduped by the
		// list-before-create + warm-instance cache, so no duplicate customers.
		async signIn({ user }) {
			await captureSignInEmail(user?.email, user?.name);
		}
	}
});

// Canonical host: force apex predictadmit.com. Because trustHost derives the
// OAuth redirect_uri from the request host, a visitor on www.predictadmit.com
// would send Google `https://www.predictadmit.com/auth/callback/google` — which
// is NOT the registered redirect URI, producing "Error 400: redirect_uri_mismatch".
// Redirecting www → apex up front (before the auth handle) keeps the entire
// OAuth flow on the one host Google knows about. Only the exact prod www host is
// touched, so localhost and *.vercel.app previews are unaffected.
const canonicalHost: Handle = async ({ event, resolve }) => {
	if (event.url.hostname === 'www.predictadmit.com') {
		const dest = new URL(event.request.url);
		dest.hostname = 'predictadmit.com';
		return new Response(null, {
			status: 308,
			headers: { location: dest.toString() }
		});
	}
	return resolve(event);
};

export const handle = sequence(canonicalHost, authHandle);
