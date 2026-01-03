// src/lib/stores/user.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'predictadmit:user';


export type SchoolStatus = 'researching' | 'writing' | 'submitted' | 'accepted' | 'denied' | 'waitlisted';

export type TrackedSchool = {
  slug: string;
  name: string;
  deadline?: string;
  status: SchoolStatus;
  supplements: { prompt: string; draft: string; aiFeedback?: string }[];
};

export type UserProfile = {
  name: string;
  email: string;
  password: string;
  isPro: boolean;
  requestCount: number;
  applicationProfile: {
    gpa: string;
    essays: string;
    activities: string;
    awards: string;
    rigor: string;
  };
  schoolList: TrackedSchool[];
  isSubmitting: boolean;
};

export const defaultProfile: UserProfile = {
  name: '',
  email: '',
  password: '',
  isPro: false,
  requestCount: 0,
  applicationProfile: {
    gpa: '',
    essays: '',
    activities: '',
    awards: '',
    rigor: ''
  },
  schoolList: [],
  isSubmitting: false
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
