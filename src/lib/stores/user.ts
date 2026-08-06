// src/lib/stores/user.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'predictadmit:user';

export type SchoolStatus =
	| 'researching'
	| 'writing'
	| 'submitted'
	| 'accepted'
	| 'denied'
	| 'waitlisted';

export type TrackedSchool = {
	slug: string;
	name: string;
	deadline?: string;
	status: SchoolStatus;
	supplements: { prompt: string; draft: string; aiFeedback?: string }[];
};

// Structured academic profile the /stats funnel collects and the shared
// scoring model (src/lib/scoring/model.ts) turns into real, deterministic
// decisions. Entered once, reused across every school + portal.
export type StatsProfile = {
	gpaUnweighted: string;
	gpaWeighted: string;
	sat: string;
	act: string;
	rigor: 'Regular' | 'Honors' | 'AP/IB';
	gradeTrend: 'Rising' | 'Steady' | 'Dipping';
	lowestGrade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
	activities: string;
	awards: string;
	major: string;
	essay: string;
};

export const defaultStats: StatsProfile = {
	gpaUnweighted: '',
	gpaWeighted: '',
	sat: '',
	act: '',
	rigor: 'Regular',
	gradeTrend: 'Steady',
	lowestGrade: 'A',
	activities: '',
	awards: '',
	major: '',
	essay: ''
};

export type UserProfile = {
	name: string;
	email: string;
	password: string;
	isPro: boolean;
	// One-time $14.99 School Pass purchases — slugs with full Pro analysis unlocked.
	proSchools: string[];
	requestCount: number;
	applicationProfile: {
		gpa: string;
		essays: string;
		activities: string;
		awards: string;
		rigor: string;
	};
	// Structured stats that drive the deterministic prediction funnel.
	stats: StatsProfile;
	schoolList: TrackedSchool[];
	isSubmitting: boolean;
	isSubmittingAI: boolean;
	usingAI: boolean;
};

export const defaultProfile: UserProfile = {
	name: '',
	email: '',
	password: '',
	isPro: false,
	proSchools: [],
	requestCount: 0,
	applicationProfile: {
		gpa: '',
		essays: '',
		activities: '',
		awards: '',
		rigor: ''
	},
	stats: { ...defaultStats },
	schoolList: [],
	isSubmitting: false,
	isSubmittingAI: false,
	usingAI: false
};

function loadInitial(): UserProfile {
	if (!browser) return defaultProfile;

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return defaultProfile;
		const parsed = JSON.parse(raw);
		return {
			...defaultProfile,
			...parsed,
			// Deep-merge nested shapes so profiles cached before these fields
			// existed still get every key the app expects.
			applicationProfile: {
				...defaultProfile.applicationProfile,
				...(parsed.applicationProfile ?? {})
			},
			stats: { ...defaultStats, ...(parsed.stats ?? {}) }
		};
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
