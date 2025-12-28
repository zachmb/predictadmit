import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';

// Get environment variables with fallbacks for development
const GOOGLE_ID = process.env.GOOGLE_ID || 'placeholder_google_id';
const GOOGLE_SECRET = process.env.GOOGLE_SECRET || 'placeholder_google_secret';
const AUTH_SECRET = process.env.AUTH_SECRET || 'placeholder_auth_secret';

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
