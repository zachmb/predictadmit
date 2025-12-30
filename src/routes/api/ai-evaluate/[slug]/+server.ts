import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

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

export const POST: RequestHandler = async ({ params, request }) => {
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

  const {
    essay,
    activities,
    honors,
    transcript,
    major,
    supplementals,
    edSlug
  } = body;

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

  const systemPrompt = `You are an elite US college admissions simulation engine for ${schoolName}.
Evaluate the applicant strictly based on ${schoolName}'s specific institutional values, culture, and academic rigor.

Provide a decision and five granular scores (1-10):
1. **Academic**: Stats/rigor fit for ${schoolName}.
2. **Extracurricular**: Strength and major-alignment.
3. **Fit**: Alignment with ${schoolName}'s specific "vibe" and campus culture.
4. **Intellectual**: Curiosity and achievement.
5. **Character**: Personality and "human" qualities.

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
  "improvement_tips": "string (3-4 specific bullet points)"
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

    // Normalize outcome
    const normalized = (decision.outcome || 'deny').toLowerCase();
    decision.outcome = ['admit', 'deny', 'waitlist', 'defer'].includes(normalized) ? normalized : 'deny';

    return json({ decision, applicantSummary });
  } catch (error) {
    console.error(`Error in ${slug} evaluation:`, error);
    return json({ error: `Evaluation for ${schoolName} failed.` }, { status: 500 });
  }
};