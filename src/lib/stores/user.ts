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


export type SavedDecision = {
  id: string; // uuid or slug
  school: string;
  slug: string;
  outcome: 'admit' | 'deny' | 'waitlist' | 'defer';
  dateSaved: string;
  notes?: string;
  // Snapshot of scores for the mind map
  stats: {
    academic: number;
    extracurricular: number;
    fit: number;
    intellectual: number;
    character: number;
  };
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
<<<<<<< HEAD
  isSubmitting: boolean;
=======
  savedDecisions: SavedDecision[];
>>>>>>> cc39bb1ad6d8333d6608035c04e03bd6534a8301
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
<<<<<<< HEAD
  isSubmitting: false
=======
  savedDecisions: []
>>>>>>> cc39bb1ad6d8333d6608035c04e03bd6534a8301
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
