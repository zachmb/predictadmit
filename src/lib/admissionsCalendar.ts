// Honest, real scarcity — the next actual admissions milestone, computed from the
// calendar (NOT a per-user timer that resets on refresh, which Reddit would roast).
// Anxious applicants have genuine deadlines; surfacing the real one is legitimate
// urgency that converts without being scammy.

export type Milestone = { label: string; date: Date; daysUntil: number };

// Approximate but real US undergrad milestones (month is 0-indexed).
// Kept deliberately simple: the point is a truthful "deadlines are near" nudge,
// not per-school precision.
const MILESTONES: { m: number; d: number; label: string }[] = [
	{ m: 10, d: 1, label: 'Early Decision & Early Action deadlines' }, // ~Nov 1
	{ m: 0, d: 1, label: 'Regular Decision deadlines' }, //               ~Jan 1
	{ m: 2, d: 15, label: 'Ivy Day & Regular Decision results' } //       ~late March
];

/** The next upcoming milestone from `now`, wrapping across the year. */
export function nextMilestone(now: Date = new Date()): Milestone {
	const year = now.getFullYear();
	const candidates: Milestone[] = [];
	for (const offset of [0, 1]) {
		for (const ms of MILESTONES) {
			const date = new Date(year + offset, ms.m, ms.d);
			const daysUntil = Math.ceil((date.getTime() - now.getTime()) / 86_400_000);
			if (daysUntil >= 0) candidates.push({ label: ms.label, date, daysUntil });
		}
	}
	candidates.sort((a, b) => a.daysUntil - b.daysUntil);
	return candidates[0];
}

/** A short human phrase, e.g. "11 weeks until Early Decision & Early Action deadlines". */
export function nextMilestonePhrase(now: Date = new Date()): string {
	const ms = nextMilestone(now);
	if (ms.daysUntil <= 0) return `${ms.label} are here`;
	if (ms.daysUntil <= 14) return `${ms.daysUntil} days until ${ms.label}`;
	const weeks = Math.round(ms.daysUntil / 7);
	return `${weeks} weeks until ${ms.label}`;
}
