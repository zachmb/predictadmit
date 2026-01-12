import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { env } from '$env/dynamic/private';

// Get environment variables with fallbacks for development (or undefined if missing)
const GOOGLE_ID = env.GOOGLE_CLIENT_ID || env.GOOGLE_ID;
const GOOGLE_SECRET = env.GOOGLE_CLIENT_SECRET || env.GOOGLE_SECRET;
const AUTH_SECRET = env.AUTH_SECRET;

// New API: destructure `handle` from SvelteKitAuth(...)
export const { handle } = SvelteKitAuth({
  providers: [
    Google({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET
    })
  ],
  trustHost: true,
  secret: AUTH_SECRET
});
