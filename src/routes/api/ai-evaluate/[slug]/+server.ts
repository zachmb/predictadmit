import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { guardAi } from '$lib/server/guard';
import {
	dimensionWeightSummary,
	factorTableForPrompt,
	NACAC_SOURCE
} from '$lib/config/admissionFactors';

// Helper to find the full school name from the slug
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
	vanderbilt: 'Vanderbilt University',
	rice: 'Rice University',
	wustl: 'Washington University in St. Louis',
	cornell: 'Cornell University',
	ucla: 'University of California, Los Angeles',
	ucberkeley: 'University of California, Berkeley'
};

function truncateForModel(text: string, maxChars = 14000): string {
	if (text.length <= maxChars) return text;
	return text.slice(0, maxChars) + '\n\n[Truncated for length]';
}

// DeepSeek call — lift the serverless timeout off the default so a slow model
// response doesn't 504 (60s = Hobby-tier max).
export const config = { maxDuration: 60 };

export const POST: RequestHandler = async (event) => {
	const g = await guardAi(event);
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
		return json({ error: 'DEEPSEEK_API_KEY is not set.' }, { status: 500 });
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

		const completion = await response.json();
		const content = completion?.choices?.[0]?.message?.content;
		const decision = JSON.parse(content);

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
		console.error(`Error in ${slug} evaluation:`, error);
		return json({ error: `Evaluation for ${schoolName} failed.` }, { status: 500 });
	}
};
