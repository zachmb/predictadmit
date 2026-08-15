// Extracurricular Helper — analyzes a student's activities list and returns a
// tiered impact assessment + concrete moves, matching (and beating) the dedicated
// "Extracurricular Helper" competitors ship. DeepSeek (the confirmed sim provider),
// signed-in only, honest: it critiques what they LISTED, never invents activities.
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { guardAi } from '$lib/server/guard';

export const config = { maxDuration: 60 };

export const POST: RequestHandler = async (event) => {
	const g = await guardAi(event);
	if (!g.ok) return g.response;

	const DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
	if (!DEEPSEEK_API_KEY) return json({ error: 'DEEPSEEK_API_KEY is not set.' }, { status: 500 });

	let body: any;
	try {
		body = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON body.' }, { status: 400 });
	}
	const activities = String(body.activities || '').slice(0, 6000).trim();
	const major = String(body.major || '').slice(0, 120);
	if (!activities) return json({ error: 'Add your activities first.' }, { status: 400 });

	const systemPrompt = `You are a blunt, expert college admissions reader assessing a student's EXTRACURRICULARS the way a selective-school AO would.

Rate each activity into a tier based on the "4 tiers of extracurriculars" framework AOs use:
- "Standout": national/international distinction, or a genuinely rare, self-driven impact (founded something real, top national award, published/recruited).
- "Strong": significant leadership or achievement at the state/regional level, or deep sustained commitment with real results.
- "Solid": school-level leadership or steady involvement — good, common, expected of strong applicants.
- "Filler": brief, passive, or resume-padding participation with little impact.

Judge only what the student LISTED — never invent activities, hours, or awards. Identify their "spike" (the coherent theme/angle that ties their strongest activities together), or say plainly if there isn't one.

Return ONLY valid JSON:
{
  "overall": "2-3 sentence honest read of the overall EC profile strength for selective schools",
  "spike": "one sentence naming their spike/theme, or that they lack a clear one and what it should be",
  "activities": [
    { "name": "short activity label from their list", "tier": "Standout|Strong|Solid|Filler", "why": "one specific sentence", "improve": "one concrete, doable move to raise its impact" }
  ],
  "next_moves": ["2-4 concrete, prioritized strategic moves for the months ahead"]
}`;

	const userPrompt = `Intended major: ${major || 'undecided'}\n\nActivities / résumé (verbatim):\n${activities}`;

	try {
		const response = await fetch('https://api.deepseek.com/chat/completions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DEEPSEEK_API_KEY}` },
			body: JSON.stringify({
				model: 'deepseek-chat',
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: userPrompt }
				],
				temperature: 0.3,
				response_format: { type: 'json_object' }
			})
		});
		if (!response.ok) return json({ error: 'The analysis service is busy — try again.' }, { status: 502 });
		const data = await response.json();
		const content = data?.choices?.[0]?.message?.content;
		if (!content) return json({ error: 'No analysis came back.' }, { status: 502 });
		let parsed: any;
		try {
			parsed = JSON.parse(content);
		} catch {
			return json({ error: 'Malformed analysis — try again.' }, { status: 502 });
		}
		return json({ analysis: parsed });
	} catch (err) {
		console.error('extracurricular helper error', err);
		return json({ error: 'Something broke on the way to the AI.' }, { status: 500 });
	}
};
