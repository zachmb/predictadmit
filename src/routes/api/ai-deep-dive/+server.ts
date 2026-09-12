// src/routes/api/ai-deep-dive/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { guardAi } from '$lib/server/guard';

type DecisionOutcome = 'admit' | 'deny' | 'waitlist' | 'defer';

// DeepSeek call — lift the serverless timeout off the default (60s = Hobby max).
export const config = { maxDuration: 60 };

export const POST: RequestHandler = async (event) => {
	const g = await guardAi(event);
	if (!g.ok) return g.response;
	const { request } = event;
	// 🔑 Read env at request time so it's never stale
	const DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;

	if (!DEEPSEEK_API_KEY) {
		return json(
			{
				error:
					'DEEPSEEK_API_KEY is not set on the server. Add it to your .env file (DEEPSEEK_API_KEY=...) and restart the dev server.'
			},
			{ status: 500 }
		);
	}

	let body: unknown;

	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON body.' }, { status: 400 });
	}

	const { school, slug, outcome, short_reason, applicantSummary, edSlug } = (body ?? {}) as {
		school?: string;
		slug?: string;
		outcome?: DecisionOutcome;
		short_reason?: string;
		applicantSummary?: string;
		edSlug?: string;
	};

	const isEarlyRound = !!edSlug && edSlug === slug;

	if (!school || !slug || !outcome || !applicantSummary) {
		return json(
			{
				error:
					'Missing required fields. Need school, slug, outcome, and applicantSummary to generate a deep dive.'
			},
			{ status: 400 }
		);
	}

	const systemPrompt = `You simulate a full admissions committee at ${school} deliberating over one applicant's file.
The committee has five readers, each with their own lens. They do NOT always agree — that tension is the point.
After the readers speak, the committee chair weighs the room and explains the decision.
Be candid, nuanced, specific to THIS applicant, and humane. No generic filler.
ACADEMIC-INTEGRITY HARD RULE: advice describes WHAT to improve and WHY — never write, rewrite, or suggest replacement essay wording or any text the student could paste into an application.
Return ONLY valid JSON (no markdown, no code fences).`;

	const userPrompt = `The committee at ${school} has decided to ${outcome.toUpperCase()} this applicant.

Round: ${isEarlyRound ? 'Early (ED/REA) — this is the applicant\'s early-round school, decided in mid-December. A non-admit here is a defer or a deny, never a waitlist.' : 'Regular Decision — decided in late March. A near-miss here is a waitlist, never a defer.'}

Rationale from the prediction engine: ${short_reason ?? '(none provided)'}

Applicant materials (confidential application content):
${applicantSummary}

Produce the committee's deliberation as JSON with EXACTLY this shape:
{
  "readers": [
    { "role": "Academic reader", "lean": "for" | "against" | "mixed", "take": "2-3 sentences on rigor, grades, and academic context for THIS file" },
    { "role": "Essays & narrative reader", "lean": "for|against|mixed", "take": "2-3 sentences on the writing and story" },
    { "role": "Activities & impact reader", "lean": "for|against|mixed", "take": "2-3 sentences on extracurricular depth and impact" },
    { "role": "Fit reader", "lean": "for|against|mixed", "take": "2-3 sentences on fit with ${school}'s specific priorities" },
    { "role": "Character reader", "lean": "for|against|mixed", "take": "2-3 sentences on personal qualities and context" }
  ],
  "tension": "1-2 sentences naming the specific point the readers disagreed on for this file",
  "chair": "3-4 sentences on how the chair weighed the room and why the decision landed on ${outcome}",
  "advice": ["3 to 5 concrete next steps, each describing what to improve and why, NEVER replacement essay text"]
}
Speak to the student in second person inside the takes and chair. Every field must be specific to this applicant, not boilerplate.`;

	try {
		const response = await fetch('https://api.deepseek.com/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${DEEPSEEK_API_KEY}`
			},
			body: JSON.stringify({
				model: 'deepseek-chat',
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: userPrompt }
				],
				temperature: 0.65,
				max_tokens: 3000,
				response_format: { type: 'json_object' }
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('DeepSeek deep-dive error:', errorText);
			return json(
				{ error: 'DeepSeek API error while generating deep dive.', details: errorText },
				{ status: 502 }
			);
		}

		const completion = await response.json();
		const content = completion?.choices?.[0]?.message?.content;

		if (!content || typeof content !== 'string') {
			return json({ error: 'DeepSeek returned empty content for deep dive.' }, { status: 502 });
		}

		// Parse the committee JSON. Strip any stray code fences, and fall back to
		// rendering the raw content as the explanation if it isn't valid JSON, so a
		// malformed model response still produces a usable deep dive.
		const stripFences = (t: string) =>
			t.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

		let readers: unknown = undefined;
		let tension: unknown = undefined;
		let chair: unknown = undefined;
		let advice: unknown = undefined;
		let explanation = content;

		try {
			const parsed = JSON.parse(stripFences(content));
			if (parsed && Array.isArray(parsed.readers)) {
				readers = parsed.readers;
				tension = typeof parsed.tension === 'string' ? parsed.tension : undefined;
				chair = typeof parsed.chair === 'string' ? parsed.chair : undefined;
				advice = Array.isArray(parsed.advice) ? parsed.advice : undefined;
				// Build a plain-text fallback from the structured parts.
				explanation = [
					...(parsed.readers as Array<{ role?: string; take?: string }>).map(
						(r) => `${r.role}: ${r.take}`
					),
					tension ? `Where they disagreed: ${tension}` : '',
					chair ? `The chair: ${chair}` : ''
				]
					.filter(Boolean)
					.join('\n\n');
			}
		} catch {
			// Not JSON: keep the raw content as the explanation (markdown fallback).
		}

		return json({
			deepDive: {
				school,
				slug,
				outcome,
				explanation,
				readers,
				tension,
				chair,
				advice
			}
		});
	} catch (error) {
		console.error('Unexpected DeepSeek deep-dive error:', error);
		return json(
			{ error: 'Unexpected server error while calling DeepSeek for deep dive.' },
			{ status: 500 }
		);
	}
};
