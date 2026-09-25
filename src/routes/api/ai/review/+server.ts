import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { guardAi } from '$lib/server/guard';

export const config = { maxDuration: 60 };

// Unified application-review endpoint powering two Pro tools:
//   - rec_letter: an AO-style read of a recommendation letter (how much it helps).
//   - final_read: a whole-application pre-submit read → prioritized fix list.
// Signed-in + rate-limited via guardAi (COGS/abuse safety). DeepSeek only, no
// credits charged. Fails closed and never returns a partial/garbage result.

const SYSTEMS: Record<string, string> = {
	rec_letter: `You are a selective-college admissions officer reading a LETTER OF RECOMMENDATION submitted for an applicant. Judge how much this letter actually MOVES the decision.
- A strong letter is specific, tells a story only this teacher could tell, and shows the student's impact on others — not a list of adjectives.
- A weak letter is generic ("hardworking, kind, a pleasure to have in class"), could describe anyone, or just restates the transcript.
Judge ONLY what the letter says. Do not invent details. If the student can still ask the recommender for a tweak, name the single most valuable thing to add.`,
	final_read: `You are a selective-college admissions officer doing a FINAL READ of a student's WHOLE application right before they hit submit (essays, activities, honors, and stats together). Read it as one story.
- Does the application cohere around a clear theme/"spike", or does it read as scattered?
- Do the essays, activities, and stats reinforce each other or contradict?
- What is the ONE thing most likely to cost them an admit that they can still fix before submitting?
Judge ONLY what they provided. Never invent activities, awards, or achievements.`
};

interface ReviewPayload {
	summary: string;
	strengths: string[];
	fixes: string[];
}

export const POST: RequestHandler = async (event) => {
	const g = await guardAi(event, { bucket: 'review', max: 15 });
	if (!g.ok) return g.response;

	if (!env.DEEPSEEK_API_KEY) {
		return json(
			{ error: 'This review tool is temporarily unavailable. Please try again later.' },
			{ status: 503 }
		);
	}

	let body: any;
	try {
		body = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const kind: string | null =
		body?.kind === 'rec_letter' ? 'rec_letter' : body?.kind === 'final_read' ? 'final_read' : null;
	if (!kind) return json({ error: 'Unknown review type.' }, { status: 400 });

	const content = String(body?.content || '').slice(0, 9000).trim();
	if (content.length < 40) {
		return json(
			{ error: kind === 'rec_letter' ? 'Paste the recommendation letter first.' : 'Add your essays, activities, and stats first.' },
			{ status: 400 }
		);
	}

	const system = `${SYSTEMS[kind]}

Return ONLY a JSON object:
{
  "summary": "1-2 blunt sentences: your overall verdict",
  "strengths": ["2-4 specific things that are genuinely working"],
  "fixes": ["2-5 specific, actionable fixes in priority order, most important first"]
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
				max_tokens: 2500,
				temperature: 0.5,
				messages: [
					{ role: 'system', content: system },
					{ role: 'user', content }
				],
				response_format: { type: 'json_object' }
			})
		});

		if (!res.ok) {
			console.error('[Review] DeepSeek error', res.status, await res.text().catch(() => ''));
			return json(
				{ error: 'The review tool is temporarily unavailable. Please try again.' },
				{ status: 502 }
			);
		}

		const data = await res.json();
		const raw = data?.choices?.[0]?.message?.content || '';
		let parsed: ReviewPayload | null = null;
		try {
			const first = raw.indexOf('{');
			const last = raw.lastIndexOf('}');
			parsed = JSON.parse(first !== -1 && last > first ? raw.slice(first, last + 1) : raw);
		} catch {
			parsed = null;
		}

		if (!parsed || typeof parsed.summary !== 'string' || parsed.summary.trim().length < 5) {
			return json({ error: 'The review came back malformed. Please try again.' }, { status: 502 });
		}

		return json({
			summary: parsed.summary.trim(),
			strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 5) : [],
			fixes: Array.isArray(parsed.fixes) ? parsed.fixes.slice(0, 6) : []
		});
	} catch (e: any) {
		console.error('[Review] Critical error', e);
		return json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
	}
};
