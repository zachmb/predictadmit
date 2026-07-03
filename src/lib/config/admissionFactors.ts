// src/lib/config/admissionFactors.ts
// Single source of truth for how PredictAdmit weighs application factors.
//
// The factor table below is NACAC's "Factors in the Admission Decision"
// (State of College Admission Report): the percentage of member four-year
// colleges attributing each level of importance to each factor for first-time
// freshmen, Fall 2023 cycle (N ≈ 185). PredictAdmit's formula weights are
// derived from this table, then calibrated against admitted-student profiles
// from HYPSM and Top-20 universities in the 2026 admissions cycle (see
// /methodology). NACAC is not affiliated with and does not endorse PredictAdmit.

export const NACAC_SOURCE = {
	org: 'National Association for College Admission Counseling (NACAC)',
	orgShort: 'NACAC',
	report: 'Factors in the Admission Decision — State of College Admission Report',
	cycle: 'Fall 2023 admission cycle',
	sampleSize: 185,
	about:
		'Founded in 1937, NACAC is a nonprofit association of more than 28,000 admission and counseling professionals worldwide, and the leading authority on the transition from high school to college.',
	calibration:
		'Weights derived from the NACAC factor table, calibrated against HYPSM and Top-20 admitted-student profiles from the 2026 admissions cycle.'
} as const;

export interface AdmissionFactor {
	key: string;
	label: string;
	/** % of colleges rating the factor of considerable importance */
	considerable: number;
	/** % moderate importance */
	moderate: number;
	/** % limited importance */
	limited: number;
	/** % no importance */
	none: number;
}

/** NACAC Fall 2023 — percentage of colleges attributing each level of importance. */
export const admissionFactors: AdmissionFactor[] = [
	{ key: 'gradesPrep', label: 'High school grades in college prep courses', considerable: 76.8, moderate: 15.1, limited: 4.9, none: 3.2 },
	{ key: 'gradesAll', label: 'Total high school grades (all courses)', considerable: 74.1, moderate: 18.9, limited: 5.4, none: 1.6 },
	{ key: 'curriculum', label: 'Strength of high school curriculum', considerable: 63.8, moderate: 22.7, limited: 10.3, none: 3.2 },
	{ key: 'character', label: 'Positive character attributes', considerable: 28.3, moderate: 37.5, limited: 18.5, none: 15.8 },
	{ key: 'essay', label: 'Essay or writing sample', considerable: 18.9, moderate: 37.3, limited: 26.5, none: 17.3 },
	{ key: 'interest', label: "Student's interest in attending", considerable: 15.7, moderate: 27.6, limited: 25.4, none: 31.4 },
	{ key: 'counselorRec', label: 'Counselor recommendation', considerable: 11.9, moderate: 40.0, limited: 27.6, none: 20.5 },
	{ key: 'teacherRec', label: 'Teacher recommendation', considerable: 10.8, moderate: 40.5, limited: 28.1, none: 20.5 },
	{ key: 'extracurriculars', label: 'Extracurricular activities', considerable: 6.5, moderate: 44.3, limited: 30.8, none: 18.4 },
	{ key: 'classRank', label: 'High school class rank', considerable: 5.5, moderate: 22.4, limited: 43.2, none: 29.0 },
	{ key: 'testScores', label: 'Admission test scores (ACT, SAT)', considerable: 4.9, moderate: 25.4, limited: 38.9, none: 30.8 },
	{ key: 'portfolio', label: 'Portfolio', considerable: 4.9, moderate: 10.8, limited: 24.3, none: 60.0 },
	{ key: 'interview', label: 'Interview', considerable: 4.3, moderate: 8.6, limited: 32.4, none: 54.6 },
	{ key: 'work', label: 'Work', considerable: 2.2, moderate: 30.8, limited: 40.0, none: 27.0 },
	{ key: 'stateExams', label: 'State graduation exam scores', considerable: 1.6, moderate: 6.5, limited: 18.4, none: 73.5 },
	{ key: 'subjectTests', label: 'Subject test scores (AP, IB)', considerable: 1.1, moderate: 22.2, limited: 25.9, none: 50.8 }
];

/**
 * Collapse a factor's four importance percentages into one score:
 * considerable counts fully, moderate half, limited a quarter.
 */
export function factorScore(f: AdmissionFactor): number {
	return f.considerable + 0.5 * f.moderate + 0.25 * f.limited;
}

const byKey = Object.fromEntries(admissionFactors.map((f) => [f.key, f]));
const score = (key: string) => factorScore(byKey[key]);

// ---- Derived weight: grades vs. test scores (academic index) ----------------
// The academic index blends weighted GPA (which captures grades + rigor) and
// SAT/ACT. Per NACAC, grades and curriculum strength dwarf test scores, so the
// split falls out of the table instead of being hand-picked.
const gradesSignal = (score('gradesPrep') + score('gradesAll') + score('curriculum')) / 3;
const testSignal = score('testScores');

/** NACAC-derived share of the academic index carried by grades/rigor (~0.75). */
export const GPA_WEIGHT = gradesSignal / (gradesSignal + testSignal);
/** NACAC-derived share of the academic index carried by SAT/ACT (~0.25). */
export const TEST_WEIGHT = testSignal / (gradesSignal + testSignal);

// ---- Derived weights: the five holistic-read dimensions ---------------------
// PredictAdmit's AI evaluation scores five dimensions. Each dimension pools the
// NACAC factors it covers; its weight is that pool's share of the whole table.
const dimensionPools: Record<string, string[]> = {
	academic: ['gradesPrep', 'gradesAll', 'curriculum', 'classRank', 'testScores', 'stateExams', 'subjectTests'],
	character: ['character', 'counselorRec', 'teacherRec'],
	extracurricular: ['extracurriculars', 'work', 'portfolio'],
	fit: ['interest', 'interview'],
	intellectual: ['essay']
};

const totalScore = admissionFactors.reduce((sum, f) => sum + factorScore(f), 0);

/** NACAC-derived weight (0–1) of each evaluation dimension in the overall read. */
export const dimensionWeights: Record<string, number> = Object.fromEntries(
	Object.entries(dimensionPools).map(([dim, keys]) => [
		dim,
		keys.reduce((sum, k) => sum + score(k), 0) / totalScore
	])
);

/** Human-readable weight summary, e.g. for AI prompts: "academic 52%, character 20%, …" */
export function dimensionWeightSummary(): string {
	return Object.entries(dimensionWeights)
		.sort(([, a], [, b]) => b - a)
		.map(([dim, w]) => `${dim} ${Math.round(w * 100)}%`)
		.join(', ');
}

/** Compact factor table for AI prompts, most important first. */
export function factorTableForPrompt(): string {
	return admissionFactors
		.map((f) => `- ${f.label}: ${f.considerable.toFixed(1)}% considerable / ${f.moderate.toFixed(1)}% moderate importance`)
		.join('\n');
}
