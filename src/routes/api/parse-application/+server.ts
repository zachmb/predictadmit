// src/routes/api/parse-application/+server.ts
//
// "Paste everything you've got" → structured application fields.
//
// A student drops in one big blob — a resume, a brag sheet, a Common App
// export, OCR'd PDF text, or messy notes — and this splits it into the exact
// fields the simulator scores (transcript, activities, honors, essay, major),
// so they don't have to re-type anything into five boxes. Uses the same
// DeepSeek model as the evaluator; stays fail-closed (safe error) if the key
// isn't set.
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { guardAi } from '$lib/server/guard';

const SYSTEM_PROMPT = `You are a parser that extracts a US college applicant's materials into structured fields.

You are given ONE blob of text — it may be a resume, a "brag sheet", a Common App activities export, OCR'd PDF text, or unstructured notes. Split it into these fields and return STRICT JSON with exactly these keys (all string values):

{
  "transcript": "GPA (weighted and/or unweighted), class rank if present, standardized test scores (SAT/ACT), AP/IB/honors count and scores, and notable rigor/coursework — as a concise readable summary.",
  "activities": "Extracurricular activities, one per line, in the style 'Role, Organization — what they did (hours/weeks if given)'. Include leadership, work, sports, arts, research, volunteering.",
  "honors": "Awards and honors, one per line, with the level (school/regional/state/national/international) if stated.",
  "essay": "The personal statement / main application essay VERBATIM if one is clearly present in the text. If there is no essay, use an empty string. Do NOT write or invent an essay.",
  "major": "The intended major or academic interest if stated, else an empty string."
}

Rules:
- Extract only what is actually in the text. NEVER invent facts, scores, awards, or an essay.
- If a field is not present, use an empty string "".
- Keep the applicant's own wording where possible; lightly clean formatting only.
- Return ONLY the JSON object, nothing else.`;

// DeepSeek call — lift the serverless timeout off the default (60s = Hobby max).
export const config = { maxDuration: 60 };

export const POST: RequestHandler = async (event) => {
	const g = await guardAi(event);
	if (!g.ok) return g.response;
	const { request } = event;
	const DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
	if (!DEEPSEEK_API_KEY) {
		return json({ error: 'Parsing is temporarily unavailable.' }, { status: 503 });
	}

	let text = '';
	try {
		const body = (await request.json()) as { text?: string };
		text = (body.text ?? '').trim();
	} catch {
		return json({ error: 'Invalid request.' }, { status: 400 });
	}

	if (text.length < 20) {
		return json({ error: 'Not enough text to parse. Paste more of your materials.' }, {
			status: 400
		});
	}
	// Guard the model call against pathological inputs.
	if (text.length > 24000) text = text.slice(0, 24000);

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
					{ role: 'system', content: SYSTEM_PROMPT },
					{ role: 'user', content: text }
				],
				temperature: 0.1,
				response_format: { type: 'json_object' }
			})
		});

		if (!response.ok) {
			return json({ error: 'Could not parse your materials. Please try again.' }, { status: 502 });
		}

		const completion = await response.json();
		const content = completion?.choices?.[0]?.message?.content ?? '{}';
		const parsed = JSON.parse(content) as Record<string, unknown>;

		const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
		const fields = {
			transcript: str(parsed.transcript),
			activities: str(parsed.activities),
			honors: str(parsed.honors),
			essay: str(parsed.essay),
			major: str(parsed.major)
		};

		const filled = Object.values(fields).filter((v) => v.length > 0).length;
		if (filled === 0) {
			return json(
				{ error: "Couldn't find application details in that text. Try pasting your resume or brag sheet." },
				{ status: 422 }
			);
		}

		return json({ fields, filled });
	} catch (error) {
		console.error('parse-application error:', error);
		return json({ error: 'Could not parse your materials. Please try again.' }, { status: 500 });
	}
};
