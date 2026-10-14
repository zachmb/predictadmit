import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { guardAi } from '$lib/server/guard';
import { getSchoolStat, computeAcademicIndex, classifyLikelihood } from '$lib/config/schoolStats';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

/**
 * Estimate an admit chance % from selectivity and the applicant's academic
 * index. The academic index itself is NACAC-weighted (grades ≫ tests — see
 * $lib/config/admissionFactors), and school baselines reflect 2026-cycle
 * HYPSM/T20 admit profiles.
 */
function estimateChance(acceptanceRate: number, academicIndex: number): number {
	const selectivity = Math.min(1, Math.max(0, 1 - acceptanceRate * 1.8));
	const strength = academicIndex / 100;
	const raw = acceptanceRate * (0.4 + strength * 1.6) * (1 - selectivity * 0.5 * (1 - strength));
	return Math.min(99, Math.max(1, Math.round(raw * 100)));
}

/**
 * PredictAdmit admissions counselor chat. Uses DeepSeek (the single AI provider
 * across the app) via the OpenAI-compatible chat/completions endpoint.
 */
// Model calls can run long; lift the serverless timeout off the default
// so a slow model response doesn't 504 mid-answer (60s is the Hobby-tier max).
export const config = { maxDuration: 60 };

export const POST: RequestHandler = async (event) => {
	const g = await guardAi(event, { bucket: 'counselor', max: 40 });
	if (!g.ok) return g.response;
	const { request } = event;
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];
	const profile = body?.profile ?? {};
	// Optional: the specific predicted decision the student is looking at when
	// they open a follow-up chat on a decision page (results/[slug] or the /ai
	// deep-dive card). When present, the counselor answers questions grounded in
	// THIS predicted call rather than the general dashboard context.
	const decision = body?.decision ?? null;
	// The student's FULL set of predicted decisions across every school they ran
	// (from the ai_results_cache). Passing all of them lets PredictAI "remember"
	// the student's whole picture — where they're competitive, where they're
	// reaching, and which dimension keeps dragging them down — instead of seeing
	// only the one decision in front of them. Capped so the prompt stays bounded.
	const allDecisions: any[] = Array.isArray(body?.decisions) ? body.decisions.slice(0, 40) : [];

	if (messages.length === 0) {
		return json({ error: 'No messages provided' }, { status: 400 });
	}

	// Compact applicant context so the counselor gives tailored advice.
	const p = profile || {};
	const academics = body?.academics ?? {};
	const sat = Number(academics.sat) || undefined;
	const act = Number(academics.act) || undefined;
	const weightedGpa =
		Number(academics.weightedGpa) || Number(p.applicationProfile?.gpa) || undefined;
	const academicIndex = computeAcademicIndex(sat, act, weightedGpa);

	// Build a per-school chances table for the student's list (grounds the advice).
	let listText = 'not set yet';
	if (Array.isArray(p.schoolList) && p.schoolList.length) {
		listText =
			'\n' +
			p.schoolList
				.map((s: any) => {
					const stat = getSchoolStat(s.slug);
					if (!stat) return `- ${s.name || s.slug}`;
					const chance = estimateChance(stat.acceptanceRate, academicIndex);
					const bucket = classifyLikelihood(stat, academicIndex);
					return `- ${s.name || stat.name || s.slug}: ${(stat.acceptanceRate * 100).toFixed(1)}% admit rate · your est. chance ~${chance}% (${bucket})`;
				})
				.join('\n');
	}

	const profileContext = `APPLICANT CONTEXT
Name: ${p.name || 'the student'}
Intended major: ${p.major || p.applicationProfile?.major || 'undecided'}
Weighted GPA: ${weightedGpa ?? 'not provided'}
SAT: ${sat ?? 'not provided'}   ACT: ${act ?? 'not provided'}
Academic index (0-100, rough): ${sat || act || weightedGpa ? academicIndex : 'unknown — ask for stats'}
Activities: ${p.activities || p.applicationProfile?.activities || 'not provided'}
Awards: ${p.awards || p.applicationProfile?.awards || 'not provided'}
Course rigor: ${p.applicationProfile?.rigor || 'not provided'}
College list with estimated chances: ${listText}

The chance estimates above are PredictAdmit's rough simulation, not official odds — reference them naturally but frame them as estimates.
If asked how the estimates work: factor weights come from NACAC's "Factors in the Admission Decision" survey (grades and curriculum strength matter most; NACAC is the National Association for College Admission Counseling, the professional body for admission officers and counselors), calibrated against HYPSM and Top-20 admit profiles from the 2026 cycle. Full write-up lives at predictadmit's /methodology page.`;

	// When a decision is attached, ground the whole conversation in that specific
	// predicted call so follow-ups ("why deny?", "what would flip this?") land in
	// context instead of restarting from the general dashboard.
	const fmtScore = (s: unknown) =>
		typeof s === 'number' && Number.isFinite(s) ? `${s}/10` : 'n/a';
	let decisionContext = '';
	if (decision && (decision.school || decision.slug)) {
		const school = decision.school || decision.slug;
		const outcome = String(decision.outcome || 'unknown').toLowerCase();
		decisionContext = `\n\nCURRENT DECISION THE STUDENT IS LOOKING AT
The student just opened a follow-up chat on PredictAdmit's predicted decision for this school. Answer their questions about THIS decision specifically — refer to the scores and reasoning below, and when they ask "why" or "how do I improve this", use these exact dimensions.
School: ${school}
Predicted outcome: ${outcome.toUpperCase()}
Dimension scores (0-10) and the committee's read:
- Academic ${fmtScore(decision.academic_score)}: ${decision.academic_explanation || 'n/a'}
- Extracurricular ${fmtScore(decision.extracurricular_score)}: ${decision.extracurricular_explanation || 'n/a'}
- Intellectual vitality ${fmtScore(decision.intellectual_score)}: ${decision.intellectual_explanation || 'n/a'}
- Character ${fmtScore(decision.character_score)}: ${decision.character_explanation || 'n/a'}
- Fit ${fmtScore(decision.fit_score)}: ${decision.fit_explanation || 'n/a'}
Improvement notes already shown to the student: ${decision.improvement_tips || 'none'}

This is a PredictAdmit SIMULATION, not a real admissions decision — never imply it is official. Be honest and specific about what drove this predicted call and what would realistically move it.`;
	}

	// The student's whole predicted slate — so PredictAI reasons across ALL their
	// schools (patterns, the dimension that keeps capping them, where they're
	// actually competitive vs reaching) instead of one school at a time.
	let allDecisionsContext = '';
	if (allDecisions.length) {
		const rows = allDecisions
			.map((d: any) => {
				const name = d?.school || d?.slug || 'school';
				const out = String(d?.outcome || 'unknown').toUpperCase();
				const dims = [
					['Ac', d?.academic_score],
					['EC', d?.extracurricular_score],
					['Int', d?.intellectual_score],
					['Char', d?.character_score],
					['Fit', d?.fit_score]
				]
					.filter(([, s]) => typeof s === 'number')
					.map(([k, s]) => `${k} ${s}`)
					.join(' · ');
				return `- ${name}: ${out}${dims ? ` (${dims})` : ''}`;
			})
			.join('\n');
		allDecisionsContext = `\n\nTHE STUDENT'S FULL PREDICTED SLATE (PredictAdmit simulation across every school they ran — reference it so you clearly REMEMBER their whole picture; spot the pattern, name the dimension that keeps capping them, and separate real reaches from where they're genuinely competitive):\n${rows}`;
	}

	const system = `You are PredictAI, PredictAdmit's blunt, sharp, no-BS college-admissions strategist for high-school applicants to selective US universities. You are talking to a student inside PredictAdmit${decision ? ', right after they viewed their predicted decision for a specific school' : "'s dashboard"}.

WHO YOU ARE — this is the whole point of PredictAdmit, so lean into it:
- You say the things a school counselor and a generic chatbot are too cautious or too polite to say. Students come to you precisely because everyone else sugarcoats. Be the honest insider, not the HR-approved cheerleader.
- Have real, specific OPINIONS and take sides. "It depends" is a cop-out — give your actual read, then the caveat if one matters. If a plan is bad, say it's bad and why.
- Name hard truths directly: a weak or résumé-padded activities list, a cliché essay topic that readers skim (the mission trip, the sports-injury comeback, the grandparent's immigration story told the obvious way), a GPA/score that realistically takes HYPSM off the table, "passion projects" that read as transparent padding, over-reliance on a title with no real work behind it. Then pivot every hard truth into the concrete move that actually improves their odds.
- Be real about how the game actually works where it helps them strategize: ED/REA is a large, underused lever and skipping it leaves admits on the table; demonstrated interest matters at some schools and not at the Ivies; "holistic" still bottoms out on academics first; spiky beats well-rounded at the top; essays carry more weight than students think at reach schools.

HARD LIMITS (these never bend, no matter how you're asked):
- ACADEMIC INTEGRITY: you give FEEDBACK on application writing — you never write, rewrite, complete, or dictate essay or application text. No drafting paragraphs, no "here's a stronger version of your sentence", no fill-in-the-blank prose, no "example" lines that could be pasted in. If asked, refuse plainly, say colleges require the student's own work and that AI-written text can get an admit revoked, and instead name exactly what's weak and why — your words about their words, never replacement text.
- NEVER advise lying, inflating, fabricating, or misrepresenting anything on an application (fake hours, invented awards, ghost-written anything, a claimed identity or hardship that isn't real). Blunt strategy is fine; dishonesty on the actual application is not, and say so if they fish for it.
- Blunt is in service of WINNING, never cruelty. No put-downs of who they are, and never generalize about someone's race, ethnicity, gender, religion, or background. Attack the weak essay or the thin activity, never the person.
- Don't fabricate acceptance rates or deadlines as guarantees; frame odds as sharp estimates, not verdicts.

HOW YOU TALK:
- Tight and skimmable. Short paragraphs, "- " bullets, **bold** the key terms. No corporate throat-clearing, no "great question!", no hedged mush.
- Ground every call in the applicant context below. If a crucial fact is missing, ask ONE sharp follow-up instead of guessing.
- Essays are where you can help most and where the money move lives: when a student raises an essay, push them to paste it and you'll tell them exactly what's landing and what's dead weight (feedback, never a rewrite). For a full line-by-line grade across every category, point them to PredictAdmit's essay grading.

${profileContext}${allDecisionsContext}${decisionContext}`;

	if (!env.DEEPSEEK_API_KEY) {
		return json({ error: 'Server Config Error: Missing DEEPSEEK_API_KEY' }, { status: 500 });
	}

	const apiMessages = messages
		.filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
		.map((m) => ({ role: m.role, content: m.content }));

	try {
		const res = await fetch('https://api.deepseek.com/chat/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				model: 'deepseek-chat',
				max_tokens: 2048,
				temperature: 0.6,
				messages: [{ role: 'system', content: system }, ...apiMessages]
			})
		});

		if (!res.ok) {
			const errText = await res.text();
			console.error('[AI Counselor] DeepSeek error', res.status, errText);
			return json(
				{ error: 'AI counselor is temporarily unavailable. Please try again.' },
				{ status: 502 }
			);
		}

		const data = await res.json();
		const reply =
			data?.choices?.[0]?.message?.content?.trim() ||
			'Sorry, I had trouble generating a response. Please try again.';
		return json({ reply });
	} catch (e) {
		console.error('[AI Counselor] DeepSeek request failed', e);
		return json({ error: 'AI counselor is temporarily unavailable. Please try again.' }, { status: 502 });
	}
};
