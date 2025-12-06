// src/lib/stores/user.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'predictadmit:user';

export type UserProfile = {
  name: string;
  email: string;
  password: string;
};

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  password: ''
};

function loadInitial(): UserProfile {
  if (!browser) return defaultProfile;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile;
    const parsed = JSON.parse(raw);
    return { ...defaultProfile, ...parsed };
  } catch {
    return defaultProfile;
  }
}

export const userProfile = writable<UserProfile>(loadInitial());

if (browser) {
  userProfile.subscribe((value) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // ignore storage errors
    }
  });
}
