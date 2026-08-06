import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { env } from '$env/dynamic/private';

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
export const { handle } = SvelteKitAuth({
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
	secret: AUTH_SECRET
});
