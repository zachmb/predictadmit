// src/lib/utils/portalAuth.ts
import type { UserProfile } from '$lib/stores/user';

export type PortalAuthResult = {
  authenticated: boolean;
  error: string;
};

/**
 * Validates login for any PredictAdmit portal.
 * Uses the email/password stored on the main page (UserProfile).
 */
export function validatePortalLogin(
  profile: UserProfile,
  emailInput: string,
  passwordInput: string
): PortalAuthResult {
  // Require that the user has actually set credentials on the main page
  if (!profile.email || !profile.password) {
    return {
      authenticated: false,
      error: 'Please set your PredictAdmit email and password on the main page.'
    };
  }

  // Check credentials
  if (emailInput.trim() === profile.email && passwordInput === profile.password) {
    return {
      authenticated: true,
      error: ''
    };
  }

  return {
    authenticated: false,
    error: 'Invalid email or password.'
  };
}

/**
 * Shared helper to derive the applicant display name.
 * Falls back to a generic label if no name is set.
 */
export function getApplicantName(profile: UserProfile): string {
  return profile.name?.trim() || 'Applicant';
}
