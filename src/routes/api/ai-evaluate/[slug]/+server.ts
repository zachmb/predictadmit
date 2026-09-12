import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { guardEvaluation } from '$lib/server/guard';
import {
	dimensionWeightSummary,
	factorTableForPrompt,
	NACAC_SOURCE
} from '$lib/config/admissionFactors';

// Helper to find the full school name from the slug
// Every school here must have a matching /portals/<slug> page (the "View
// Simulated Decision" link) AND match the frontend SCHOOLS list in
// src/routes/ai/+page.svelte so the full simulation runs across all of them.
const SCHOOL_MAP: Record<string, string> = {
	harvard: 'Harvard University',
	stanford: 'Stanford University',
	mit: 'Massachusetts Institute of Technology',
	princeton: 'Princeton University',
	yale: 'Yale University',
	columbia: 'Columbia University',
	uchicago: 'University of Chicago',
	upenn: 'University of Pennsylvania',
	caltech: 'California Institute of Technology',
	duke: 'Duke University',
	jhu: 'Johns Hopkins University',
	northwestern: 'Northwestern University',
	dartmouth: 'Dartmouth College',
	brown: 'Brown University',
	cornell: 'Cornell University',
	vanderbilt: 'Vanderbilt University',
	rice: 'Rice University',
	wustl: 'Washington University in St. Louis',
	notredame: 'University of Notre Dame',
	georgetown: 'Georgetown University',
	emory: 'Emory University',
	ucberkeley: 'University of California, Berkeley',
	ucla: 'University of California, Los Angeles',
	usc: 'University of Southern California',
	umich: 'University of Michigan',
	unc: 'University of North Carolina at Chapel Hill',
	uva: 'University of Virginia',
	nyu: 'New York University',
	cmu: 'Carnegie Mellon University',
	georgiatech: 'Georgia Institute of Technology',
	ucsd: 'University of California, San Diego',
	uci: 'University of California, Irvine',
	ucdavis: 'University of California, Davis',
	wakeforest: 'Wake Forest University',
	uf: 'University of Florida',
	wisconsin: 'University of Wisconsin–Madison',
	purdue: 'Purdue University',
	osu: 'The Ohio State University',
	wwu: 'Western Washington University'
};

function truncateForModel(text: string, maxChars = 14000): string {
	if (text.length <= maxChars) return text;
	return text.slice(0, maxChars) + '\n\n[Truncated for length]';
}

// DeepSeek occasionally wraps JSON in ```json fences despite response_format —
// strip them before parsing so a well-formed answer isn't lost to a fence.
function stripCodeFences(raw: string): string {
	const t = raw.trim();
	if (!t.startsWith('```')) return t;
	return t
		.replace(/^```(?:json)?\s*/i, '')
		.replace(/\s*```$/i, '')
		.trim();
}

// DeepSeek call — lift the serverless timeout off the default so a slow model
// response doesn't 504 (60s = Hobby-tier max).
export const config = { maxDuration: 60 };

export const POST: RequestHandler = async (event) => {
	// One simulation fans out to ~39 schools in a burst. guardEvaluation gives a
	// signed-in non-Pro user their FIRST full run free (the aha moment), meters it
	// server-side via an httpOnly cookie, then walls further runs with 402
	// plan_required. Pro/trial users are unlimited. Auth + rate limit still apply.
	const g = await guardEvaluation(event);
	if (!g.ok) return g.response;
	const { params, request } = event;
	const DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
	const { slug } = params;

	// Validate the school exists in our map
	const schoolName = SCHOOL_MAP[slug];
	if (!schoolName) {
		return json({ error: 'Invalid school slug.' }, { status: 400 });
	}

	if (!DEEPSEEK_API_KEY) {
		// A config outage is on us, not the applicant — flag it as an engine failure
		// so the client shows the honest "try again, you weren't charged" message.
		console.error('DEEPSEEK_API_KEY is not set — cannot run evaluations.');
		return json(
			{
				error: 'The prediction engine is temporarily unavailable. Please try again shortly.',
				code: 'ai_upstream'
			},
			{ status: 502 }
		);
	}

	let body: any;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON body.' }, { status: 400 });
	}

	const { essay, activities, honors, transcript, major, supplementals, edSlug } = body;

	const sections: string[] = [];
	if (major) sections.push(`Intended Major: ${major}`);
	if (essay) sections.push(`Personal Essay:\n${essay}`);
	if (supplementals) sections.push(`Supplemental Essays:\n${supplementals}`);
	if (activities) sections.push(`Activities / Résumé:\n${activities}`);
	if (honors) sections.push(`Honors & Awards:\n${honors}`);
	if (transcript) sections.push(`Transcript / GPA / Testing:\n${transcript}`);

	let applicantSummary = truncateForModel(sections.join('\n\n').trim());

	if (!applicantSummary) {
		return json({ error: 'Please provide application data.' }, { status: 400 });
	}

	const systemPrompt = `You are a harsh, brutally honest, realistic admissions officer for ${schoolName}.
Evaluate the applicant strictly based on ${schoolName}'s specific institutional values, culture, and academic rigor.

Provide a decision and five granular scores (1-10):
1. **Academic**: Stats/rigor fit for ${schoolName}.
2. **Extracurricular**: Strength and major-alignment.
3. **Fit**: Alignment with ${schoolName}'s specific "vibe" and campus culture.
4. **Intellectual**: Curiosity and achievement.
5. **Character**: Personality and "human" qualities.

WEIGHTING METHODOLOGY (follow this when forming the overall decision):
Your read is grounded in the ${NACAC_SOURCE.orgShort} "${NACAC_SOURCE.report}" survey (${NACAC_SOURCE.cycle}), which reports how four-year colleges weight each application factor:
${factorTableForPrompt()}

Derived dimension weights for the overall decision: ${dimensionWeightSummary()}.
Grades in college-prep courses and strength of curriculum dominate; nothing offsets a weak transcript. NACAC notes importance shifts by institution type — and your calibration set is admitted-student profiles from HYPSM and Top-20 universities in the 2026 admissions cycle, where near-perfect academics are the baseline and test scores carry more weight than at the average NACAC college. Treat academics as the gate, then let character, essays, extracurricular spikes, and demonstrated fit decide among academically qualified applicants.

BE BRUTALLY HONEST. Act like an actual admissions officer at one of the top of universities that only takes the best of the best.
Don't manufacture issues that aren't there, but be harsh and forthright if there are problems. Your job is to be as accurate as possible when judging 
what the applicant's decision will be. 

That said, there is some randomness to college applications. If an applicant is borderline, or maybe lacking slightly in some areas, 
if their essays or other parts of their application really stood out to the admissions officer or really aligned with the institution
that could be the difference between a denial and acceptance. Obviously, be extremely careful when dishing out these nuances, and never give
someone who is clearly underqualified this benefit. Like an actual admissions officer, only give this to those who were close but maybe not 
"spikey" or special enough to be auto-admit at a top university. 

For each score provide a very thorough and detailed explanation on why that score was given. All the explanations need to be from the perspective of the Admissions Officer. 
For instance: "we were impressed by your growth in your personal essay, but we feel the writing quality was a bit unpolished in places." These explanations must be 
specific and detailed.

Take into account the competitiveness of the applicant's selected major at ${schoolName}, and what types of people are usually admitted to this major at the school.

Be brutally honest and realistic. If you admit someone you should have rejected or rejected someone you should have admitted, your job is on the line.

ROUND MATTERS — the applicant metadata tells you whether ${schoolName} is this applicant's ED/REA (early-round) choice:
- If it IS their ED/REA choice, they applied in the early round. A non-admit is EITHER "defer" (their strong-but-not-clear file is pushed to the regular round for another look — the most common early non-admit) OR a hard "deny". NEVER use "waitlist" for an early-round applicant; the waitlist does not exist in the early round.
- If it is NOT their ED/REA choice, they applied Regular Decision. A near-miss is "waitlist". NEVER use "defer" for a Regular Decision applicant; deferral only happens in the early round.

RESPONSE FORMAT: Valid JSON only.
Structure:
{
  "school": "${schoolName}",
  "slug": "${slug}",
  "outcome": "admit" | "deny" | "waitlist" | "defer",
  "academic_score": number,
  "academic_explanation": "string",
  "extracurricular_score": number,
  "extracurricular_explanation": "string",
  "fit_score": number,
  "fit_explanation": "string",
  "intellectual_score": number,
  "intellectual_explanation": "string",
  "character_score": number,
  "character_explanation": "string",
  "improvement_tips": "string (5-7 specific bullet points, ordered by expected impact for THIS school — each names the weakness, why it matters to this school's committee, and a concrete action; never write or suggest replacement essay wording, sentences, or any text the applicant could paste into their application)"
}`;

	const userPrompt = `Applicant materials:
${applicantSummary}

Metadata:
- Intended Major: ${major || 'Undecided'}
- This school is the applicant's ED/REA choice: ${edSlug === slug ? 'YES' : 'NO'}`;

	// A single simulation fans out to ~39 of these calls, so a paying customer only
	// gets a full inbox if this route is resilient. The old code did
	// `JSON.parse(completion.choices[0].message.content)` with NO upstream-status
	// check — so ANY DeepSeek error (depleted balance → 402, rate limit → 429,
	// bad key → 401, transient 5xx) or empty/fenced content threw and every school
	// returned a generic 500. The client silently skipped all 39 and showed "No
	// predictions came back. Add more detail and try again." — blaming the user for
	// an outage they paid to avoid. We now (a) check response.ok, (b) retry
	// transient upstream failures, (c) guard empty/fenced content, and (d) surface a
	// distinct `code: 'ai_upstream'` (502) so the client can say "our engine is
	// down, you weren't charged" instead of "your input is too thin."
	const MAX_ATTEMPTS = 3;
	let lastUpstreamDetail = 'unknown error';

	for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
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
					temperature: 0.3,
					response_format: { type: 'json_object' }
				})
			});

			if (!response.ok) {
				// Read the upstream body for logs (best-effort) so we can see WHY.
				const detail = await response.text().catch(() => '');
				lastUpstreamDetail = `HTTP ${response.status} ${detail.slice(0, 500)}`;
				console.error(`DeepSeek ${response.status} for ${slug} (attempt ${attempt}):`, detail);
				// 429/5xx are transient — retry. Everything else (401 bad key, 402
				// insufficient balance, 400 bad request) won't fix itself on retry.
				const retryable = response.status === 429 || response.status >= 500;
				if (retryable && attempt < MAX_ATTEMPTS) continue;
				break;
			}

			const completion = await response.json();
			const content = completion?.choices?.[0]?.message?.content;
			if (!content || !String(content).trim()) {
				lastUpstreamDetail = 'empty completion content';
				console.error(`DeepSeek returned empty content for ${slug} (attempt ${attempt}).`);
				if (attempt < MAX_ATTEMPTS) continue;
				break;
			}

			let decision: any;
			try {
				decision = JSON.parse(stripCodeFences(String(content)));
			} catch (parseErr) {
				lastUpstreamDetail = 'unparseable model output';
				console.error(`Unparseable DeepSeek output for ${slug} (attempt ${attempt}):`, content);
				if (attempt < MAX_ATTEMPTS) continue;
				break;
			}

			// Normalize outcome. HONESTY: never fabricate a rejection when the model
			// didn't actually return a clear verdict — fall back to the neutral
			// 'waitlist' and flag it uncertain rather than showing a hard 'deny' the
			// model never gave.
			const normalized = String(decision.outcome || '').toLowerCase();
			if (['admit', 'deny', 'waitlist', 'defer'].includes(normalized)) {
				decision.outcome = normalized;
			} else {
				decision.outcome = 'waitlist';
				decision.uncertain = true;
			}

			return json({ decision, applicantSummary });
		} catch (error) {
			// Network-level throw (fetch rejected, JSON body read failed). Retry.
			lastUpstreamDetail = error instanceof Error ? error.message : String(error);
			console.error(`Error in ${slug} evaluation (attempt ${attempt}):`, error);
			if (attempt < MAX_ATTEMPTS) continue;
		}
	}

	// All attempts exhausted: this is an UPSTREAM/engine failure, not bad user
	// input. The distinct code lets the client show an honest, non-blaming message.
	return json(
		{
			error: `The prediction engine didn't respond for ${schoolName}. This is on us, not your application. Please try again in a moment.`,
			code: 'ai_upstream',
			detail: lastUpstreamDetail
		},
		{ status: 502 }
	);
};
