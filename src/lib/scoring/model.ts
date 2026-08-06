// src/lib/scoring/model.ts
//
// Single source of truth for turning a student's academic profile into an
// admissions prediction. Extracted from the /pro dashboard so the Portal
// Simulator, the /stats funnel, and the Pro dashboard all share ONE
// deterministic model instead of each inventing their own (or falling back to
// a hardcoded per-school decision).
//
// The model is a pure function of (profile, school). Given the same inputs it
// always returns the same outcome — no Math.random, no server round-trip.

import { schoolConfigs, type SchoolConfig } from '$lib/config/schools';
import type { AiDecision, DecisionOutcome } from '$lib/stores/results';

export type Rigor = 'Regular' | 'Honors' | 'AP/IB';
export type GradeTrend = 'Rising' | 'Steady' | 'Dipping';
export type LowestGrade = 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';

/**
 * The structured academic profile the whole funnel scores against.
 * Numeric fields are strings so they can bind directly to <input> elements and
 * round-trip cleanly through localStorage; the model parses them defensively.
 */
export interface ScoringProfile {
	/** Unweighted GPA on a 4.0 scale, e.g. "3.85". */
	gpaUnweighted: string;
	/** Weighted GPA (usually 0–5), e.g. "4.4". Optional. */
	gpaWeighted: string;
	/** SAT total (400–1600). Leave blank if submitting ACT instead. */
	sat: string;
	/** ACT composite (1–36). Leave blank if submitting SAT instead. */
	act: string;
	rigor: Rigor;
	gradeTrend: GradeTrend;
	lowestGrade: LowestGrade;
	/** Free-text activities / résumé — lightly scored via keyword heuristics. */
	activities: string;
	/** Free-text honors & awards. */
	awards: string;
	/** Intended major. */
	major: string;
	/** Optional pasted personal-statement text. */
	essay: string;
}

export const emptyScoringProfile: ScoringProfile = {
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

/**
 * Academic Index (0–240). Mirrors the /pro formula exactly:
 *   test component (max 80) + gpa component (max 80), scaled *1.5.
 * ACT is mapped onto the SAT scale so a single testScore drives the math.
 */
export function computeAcademicIndex(p: ScoringProfile): number {
	const gpaUw = parseFloat(p.gpaUnweighted) || 0;
	const gpaW = parseFloat(p.gpaWeighted) || gpaUw;

	// Prefer SAT; otherwise fall back to ACT (stored on the SAT scale below).
	const sat = parseFloat(p.sat) || 0;
	const act = parseFloat(p.act) || 0;
	let test = sat;
	if (!test && act) {
		// ACT → SAT-equivalent so the same normalization applies (36 ≈ 1600).
		test = act * 44.44;
	}

	// 1. Test Score Component (max 80). 1600 SAT → 80 pts.
	let normalizedTest = test;
	if (test > 0 && test < 37) {
		// A raw ACT slipped through — map it up.
		normalizedTest = test * 44.44;
	}
	const testComponent = Math.min(80, (normalizedTest / 1600) * 80);

	// 2. GPA Component (max 80).
	const effectiveGpa = gpaW > 0 ? Math.min(5.0, gpaW) : Math.min(4.0, gpaUw);
	let gpaScore = (effectiveGpa / 4.0) * 70;

	if (p.rigor === 'AP/IB') gpaScore += 8;
	else if (p.rigor === 'Honors') gpaScore += 4;

	if (p.gradeTrend === 'Rising') gpaScore += 3;
	else if (p.gradeTrend === 'Dipping') gpaScore -= 5;

	const lowGrades: LowestGrade[] = ['C', 'C-', 'D', 'F'];
	const midGrades: LowestGrade[] = ['B-', 'C+'];
	if (lowGrades.includes(p.lowestGrade)) {
		gpaScore -= 10;
		if (p.lowestGrade === 'D' || p.lowestGrade === 'F') gpaScore -= 15;
	} else if (midGrades.includes(p.lowestGrade)) {
		gpaScore -= 3;
	}

	const gpaComponent = Math.min(80, Math.max(0, gpaScore));
	const total = testComponent + gpaComponent;
	return Math.max(0, Math.round(total * 1.5));
}

/**
 * Extracurricular strength (0–10) from keyword heuristics over the
 * activities + awards + essay text. Same spirit as the /pro holistic score.
 */
export function computeExtracurricularScore(p: ScoringProfile): number {
	const text = `${p.activities} ${p.awards} ${p.essay}`.toLowerCase();
	let score = 3;
	if (text.trim().length > 50) score += 1;
	if (text.trim().length > 200) score += 1;
	if (/(president|founder|captain|editor.?in.?chief|ceo|director)/.test(text)) score += 2;
	if (/(state|national|international|olympiad|nationals|world)/.test(text)) score += 2;
	if (/(award|honor|medal|scholarship|finalist|first place|gold)/.test(text)) score += 1;
	return Math.min(10, score);
}

/**
 * Admissions odds (percentage, 2–80) for one school given the profile.
 * Identical formula to /pro's calculateAdmissionsOdds, driven by the school's
 * difficulty + baseRate. Extracurricular strength nudges the academic index so
 * activities/awards actually move the needle.
 */
export function computeOdds(p: ScoringProfile, school: SchoolConfig): number {
	if (!school || school.baseRate === undefined || school.difficulty === undefined) return 5;

	// Let a strong (or weak) EC profile shift the effective academic index a bit,
	// so the softer factors matter without ever overriding the academic gate.
	const ecScore = computeExtracurricularScore(p); // 3–10
	const ecAdjust = (ecScore - 6) * 4; // roughly -12 … +16 index points
	const effectiveIndex = computeAcademicIndex(p) + ecAdjust;

	const targetAI = 130 + school.difficulty * 10;
	const delta = effectiveIndex - targetAI;

	let multiplier = 1;
	if (delta >= 0) {
		multiplier = 1 + Math.min(3, delta / 30);
	} else {
		multiplier = Math.pow(1.5, delta / 15);
	}

	const rawOdds = school.baseRate * 100 * multiplier;
	const maxCap = school.difficulty >= 9 ? 35 : 80;
	const minFloor = 2;
	return Math.round(Math.max(minFloor, Math.min(maxCap, rawOdds)));
}

export interface DecisionResult {
	slug: string;
	school: string;
	outcome: DecisionOutcome;
	odds: number; // 0–100 admit probability
	academicIndex: number; // 0–240
	extracurricularScore: number; // 0–10
}

/**
 * Deterministic admit/deny/waitlist for one school — no RNG, so the SAME
 * profile always yields the SAME decision and better stats can only ever help.
 *
 * The outcome is driven by how the applicant's effective academic index compares
 * to the school's target index (`130 + difficulty*10`). Using the delta rather
 * than the capped odds means even the most selective schools (whose admit odds
 * are capped at ~35%) can still flip to an admit for a genuinely strong
 * applicant, while a weak applicant is denied everywhere selective. The odds are
 * still surfaced to the user as the headline probability.
 */
export function computeDecisionForSchool(p: ScoringProfile, slug: string): DecisionResult {
	const school = schoolConfigs[slug];
	const odds = school ? computeOdds(p, school) : 0;

	let outcome: DecisionOutcome = 'deny';
	if (school) {
		const ecScore = computeExtracurricularScore(p);
		const ecAdjust = (ecScore - 6) * 4;
		const effectiveIndex = computeAcademicIndex(p) + ecAdjust;
		const targetAI = 130 + school.difficulty * 10;
		const delta = effectiveIndex - targetAI;

		// At/above the school's bar → admit. Just short → waitlist band. Below → deny.
		if (delta >= 0) outcome = 'admit';
		else if (delta >= -15) outcome = 'waitlist';
		else outcome = 'deny';
	}

	return {
		slug,
		school: school?.schoolName ?? slug,
		outcome,
		odds,
		academicIndex: computeAcademicIndex(p),
		extracurricularScore: computeExtracurricularScore(p)
	};
}

/** Compute decisions for every school we simulate. */
export function computeAllDecisions(p: ScoringProfile): DecisionResult[] {
	return Object.keys(schoolConfigs).map((slug) => computeDecisionForSchool(p, slug));
}

/** Short, encouraging one-liner explaining a stats-derived outcome. */
function explainDecision(r: DecisionResult): string {
	if (r.outcome === 'admit') {
		return `Your profile clears the bar here — roughly a ${r.odds}% admit chance given your stats, rigor, and activities.`;
	}
	if (r.outcome === 'waitlist') {
		return `You're on the bubble (about ${r.odds}% admit chance). Stronger stats or a sharper activity spike could tip this to an admit.`;
	}
	return `This is a reach at your current profile (about ${r.odds}% admit chance). Raising your GPA/test scores or deepening your activities would move the needle.`;
}

/**
 * Convert a stats DecisionResult into the AiDecision shape the results store,
 * portals, and AdmitMail inbox all consume — tagged source:'stats'.
 */
export function decisionResultToAiDecision(r: DecisionResult): AiDecision {
	const academic10 = Math.round((r.academicIndex / 240) * 10);
	const explanation = explainDecision(r);
	return {
		school: r.school,
		slug: r.slug,
		outcome: r.outcome,
		source: 'stats',
		odds: r.odds,
		academic_score: academic10,
		academic_explanation: explanation,
		extracurricular_score: r.extracurricularScore,
		extracurricular_explanation: explanation,
		fit_score: academic10,
		fit_explanation: explanation,
		intellectual_score: academic10,
		intellectual_explanation: explanation,
		character_score: r.extracurricularScore,
		character_explanation: explanation,
		improvement_tips: ''
	};
}

/** Build the full stats-derived decision set ready to drop into the store. */
export function computeAllAiDecisions(p: ScoringProfile): AiDecision[] {
	return computeAllDecisions(p).map(decisionResultToAiDecision);
}

/** True once the student has entered enough to score meaningfully. */
export function hasEnoughToScore(p: ScoringProfile): boolean {
	const hasGpa = (parseFloat(p.gpaUnweighted) || parseFloat(p.gpaWeighted) || 0) > 0;
	const hasTest = (parseFloat(p.sat) || parseFloat(p.act) || 0) > 0;
	return hasGpa && hasTest;
}
