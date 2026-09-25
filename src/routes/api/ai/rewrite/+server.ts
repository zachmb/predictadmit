import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { guardAi } from '$lib/server/guard';

export const config = { maxDuration: 60 };

// Essay rewrite-in-your-voice tool. Unlike the grader (which only critiques), this
// returns an improved version of the student's OWN passage — tighter, clearer, more
// vivid — while preserving their voice. Hard guardrail: it EDITS their words, it does
// not INVENT experiences, awards, or facts they didn't write. That keeps it on the
// "great editor" side of the line rather than ghostwriting a fictional applicant.
//
// No credits are charged here (same as /essay-grader): the only cost is the DeepSeek
// call, borne by the platform. The endpoint fails safe — any error returns a clear
// message and never a partial/garbage rewrite the user might trust.

interface RewritePayload {
	rewrite: string;
	changes: string[];
}

export const POST: RequestHandler = async (event) => {
	// Signed-in + rate-limited: keep an anonymous script from hammering DeepSeek.
	const g = await guardAi(event, { bucket: 'rewrite', max: 20 });
	if (!g.ok) return g.response;

	let body: any;
	try {
		body = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const content: string = (body?.content ?? '').toString().trim();
	const essayType: string = body?.essayType || 'college';
	const selectedSchool: string = body?.selectedSchool || '';
	const instruction: string = (body?.instruction ?? '').toString().trim();

	if (!content || content.length < 40) {
		return json(
			{ error: 'Paste a paragraph or more of your own draft first, then rewrite it.' },
			{ status: 400 }
		);
	}
	// Guard against pasting an entire novel into one call.
	const clipped = content.slice(0, 6000);

	if (!env.DEEPSEEK_API_KEY) {
		// Dormant + fail-closed until the key is set — never a half-wired live path.
		return json(
			{ error: 'The rewrite tool is temporarily unavailable. Please try again later.' },
			{ status: 503 }
		);
	}

	const system = `You are an elite college-application essay editor. You rewrite the student's OWN passage so it reads tighter, clearer, and more vivid — while keeping THEIR voice: their tone, their vocabulary level, their sentence rhythm, their point of view. This is line editing, not ghostwriting.

HARD RULES:
- Preserve their meaning and voice. It should still sound like the same 17-year-old wrote it, just a better draft.
- NEVER invent experiences, achievements, awards, statistics, or details the student did not write. You edit their words; you do not fabricate a different applicant.
- Do not add clichés, inflated adjectives, or "admissions-ese." Cut those if they're there.
- Keep it roughly the same length unless the text is padded, then tighten it.
${selectedSchool ? `- Context: this is a ${essayType} essay for ${selectedSchool}.` : `- Context: this is a ${essayType} essay.`}
${instruction ? `- The student also asked: "${instruction}". Honor it within the rules above.` : ''}

Return ONLY a JSON object:
{
  "rewrite": "the full rewritten passage, in their voice",
  "changes": ["3-5 short bullets naming what you improved and why (e.g. 'Cut the throat-clearing opening so the story starts on the action')"]
}`;

	try {
		const res = await fetch('https://api.deepseek.com/chat/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'deepseek-chat',
				max_tokens: 3000,
				temperature: 0.7,
				messages: [
					{ role: 'system', content: system },
					{ role: 'user', content: `My draft:\n\n${clipped}` }
				],
				response_format: { type: 'json_object' }
			})
		});

		if (!res.ok) {
			console.error('[Rewrite] DeepSeek error', res.status, await res.text().catch(() => ''));
			return json(
				{ error: 'The rewrite tool is temporarily unavailable. Please try again.' },
				{ status: 502 }
			);
		}

		const data = await res.json();
		const raw = data?.choices?.[0]?.message?.content || '';
		let parsed: RewritePayload | null = null;
		try {
			const first = raw.indexOf('{');
			const last = raw.lastIndexOf('}');
			parsed = JSON.parse(first !== -1 && last > first ? raw.slice(first, last + 1) : raw);
		} catch {
			parsed = null;
		}

		// Fail safe: never hand back an empty/garbage rewrite the user might paste.
		if (!parsed || typeof parsed.rewrite !== 'string' || parsed.rewrite.trim().length < 20) {
			return json(
				{ error: 'The rewrite came back malformed. Please try again.' },
				{ status: 502 }
			);
		}

		return json({
			rewrite: parsed.rewrite.trim(),
			changes: Array.isArray(parsed.changes) ? parsed.changes.slice(0, 6) : []
		});
	} catch (e: any) {
		console.error('[Rewrite] Critical error', e);
		return json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
	}
};
