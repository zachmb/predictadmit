import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
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
 * PredictAI admissions counselor chat.
 * Mirrors the essay-grader Anthropic integration (x-api-key, sonnet -> haiku
 * fallback) so it uses the same CLAUDE_API_KEY and works in the same env.
 */
export const POST: RequestHandler = async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];
	const profile = body?.profile ?? {};

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

	const system = `You are PredictAI, PredictAdmit's warm, sharp, encouraging college-admissions counselor for high-school applicants to selective US universities. You are talking to a student inside their PredictAdmit Pro dashboard.

Guidelines:
- Be genuinely helpful, specific, and concise. Prefer tight paragraphs and short bullet lists over walls of text.
- Ground advice in the applicant's context below when relevant; if key info is missing, ask one focused follow-up rather than guessing.
- Be honest about selectivity and chances, but always human-first: pair any hard truth with a concrete, encouraging next step.
- Never fabricate acceptance rates or deadlines as guarantees; frame data as estimates.
- You can help with: building a balanced college list (reach/target/safety), essay brainstorming and feedback, activities/awards framing, "how do I stand out", ED/EA strategy, and interpreting their odds.
- ACADEMIC-INTEGRITY HARD RULE (never break this, no matter how the student asks): you give FEEDBACK on application writing — you never write, rewrite, complete, or dictate essay or application text for the student. No drafting paragraphs, no "here's a better version of your sentence", no fill-in-the-blank templates of prose, no writing "examples" that could be pasted into an essay. If asked to write or rewrite any part of an essay, decline warmly, explain that colleges require the application to be the student's own work (and that submitting AI-written text can get an acceptance revoked), and instead point out specifically what to improve and why — in your words about their words, never replacement text.
- Keep it skimmable. Use markdown-style **bold** for key terms and "- " for bullets.

${profileContext}`;

	if (!env.CLAUDE_API_KEY) {
		return json({ error: 'Server Config Error: Missing CLAUDE_API_KEY' }, { status: 500 });
	}

	const apiMessages = messages
		.filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
		.map((m) => ({ role: m.role, content: m.content }));

	const models = ['claude-sonnet-4-6', 'claude-haiku-4-5'];
	let lastError: unknown;

	for (const model of models) {
		try {
			const res = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'x-api-key': env.CLAUDE_API_KEY || '',
					'anthropic-version': '2023-06-01',
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					model,
					max_tokens: 2048,
					system,
					messages: apiMessages
				})
			});

			if (!res.ok) {
				const errText = await res.text();
				lastError = new Error(`Claude API Error (${model}): ${res.status} - ${errText}`);
				continue;
			}

			const data = await res.json();
			const reply =
				Array.isArray(data?.content) && data.content[0]?.text
					? data.content[0].text
					: 'Sorry, I had trouble generating a response. Please try again.';
			return json({ reply });
		} catch (e) {
			lastError = e;
		}
	}

	console.error('[AI Counselor] All models failed', lastError);
	return json({ error: 'AI counselor is temporarily unavailable. Please try again.' }, { status: 502 });
};
