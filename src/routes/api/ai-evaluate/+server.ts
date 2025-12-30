import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

type DecisionOutcome = 'admit' | 'deny' | 'waitlist' | 'defer';

type AiDecision = {
  school: string;
  slug: string;
  outcome: DecisionOutcome;
  academic_score: number;
  academic_explanation: string;
  extracurricular_score: number;
  extracurricular_explanation: string;
  fit_score: number;
  fit_explanation: string;
  intellectual_score: number;
  intellectual_explanation: string;
  character_score: number;
  character_explanation: string;
  improvement_tips: string; // NEW: Detailed actionable feedback
};

const SCHOOLS = [
  { school: 'Harvard University', slug: 'harvard' },
  { school: 'Stanford University', slug: 'stanford' },
  { school: 'Massachusetts Institute of Technology', slug: 'mit' },
  { school: 'Princeton University', slug: 'princeton' },
  { school: 'Yale University', slug: 'yale' },
  { school: 'Columbia University', slug: 'columbia' },
  { school: 'University of Chicago', slug: 'uchicago' },
  { school: 'University of Pennsylvania', slug: 'upenn' },
  { school: 'California Institute of Technology', slug: 'caltech' },
  { school: 'Duke University', slug: 'duke' },
  { school: 'Johns Hopkins University', slug: 'jhu' },
  { school: 'Northwestern University', slug: 'northwestern' },
  { school: 'Dartmouth College', slug: 'dartmouth' },
  { school: 'Brown University', slug: 'brown' },
  { school: 'Vanderbilt University', slug: 'vanderbilt' },
  { school: 'Rice University', slug: 'rice' },
  { school: 'Washington University in St. Louis', slug: 'wustl' },
  { school: 'Cornell University', slug: 'cornell' },
  { school: 'University of California, Los Angeles', slug: 'ucla' },
  { school: 'University of California, Berkeley', slug: 'ucberkeley' }
];

function truncateForModel(text: string, maxChars = 14000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '\n\n[Truncated for length]';
}

export const POST: RequestHandler = async ({ request }) => {
  const DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;

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
    edSlug,
    googleEmail,
    googleName
  } = body;

  const sections: string[] = [];
  if (major) sections.push(`Intended Major: ${major}`);
  if (essay) sections.push(`Personal Essay:\n${essay}`);
  if (supplementals) sections.push(`Supplemental Essays:\n${supplementals}`);
  if (activities) sections.push(`Activities / Résumé:\n${activities}`);
  if (honors) sections.push(`Honors & Awards:\n${honors}`);
  if (transcript) sections.push(`Transcript / GPA / Testing:\n${transcript}`);

  let applicantSummary = sections.join('\n\n').trim();

  if (!applicantSummary) {
    return json({ error: 'Please provide application data.' }, { status: 400 });
  }

  applicantSummary = truncateForModel(applicantSummary);

  const systemPrompt = `You are an elite US college admissions simulation engine.
Evaluate the applicant based on their Major, Essays, Supplementals, Activities, Honors, and Transcript.

For each school, provide a decision and five granular scores (1-10):
1. **Academic**: Stats/rigor fit.
2. **Extracurricular**: Strength and major-alignment.
3. **Fit**: Cultural and goal alignment.
4. **Intellectual**: Curiosity and achievement.
5. **Character**: Personality and "human" qualities.

ADDITIONALLY: Provide "improvement_tips". This should be 3-4 specific, actionable bullet points on how this applicant can improve their chances for THIS specific school (e.g., "Take the SAT again for a 1550+", "Lean more into your volunteer work in the supplemental essay", "Clarify your role in the Robotics club").

RESPONSE FORMAT: Valid JSON only.
Structure:
{
  "decisions": [
    {
      "school": "Name",
      "slug": "slug",
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
      "improvement_tips": "string (bulleted list)"
    }
  ]
}`;

  const userPrompt = `Applicant materials:
${applicantSummary}

Metadata:
- Intended Major: ${major || 'Undecided'}
- ED/REA School: ${edSlug || 'None'}

Evaluate for these schools:
${SCHOOLS.map(s => `- ${s.school} (slug: ${s.slug})`).join('\n')}`;

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
    const parsed = JSON.parse(content);

    const decisions = (parsed.decisions || []).map((d: any) => {
      const normalized = (d.outcome || 'deny').toLowerCase();
      return {
        ...d,
        outcome: ['admit', 'deny', 'waitlist', 'defer'].includes(normalized) ? normalized : 'deny',
        academic_score: Number(d.academic_score) || 0,
        extracurricular_score: Number(d.extracurricular_score) || 0,
        fit_score: Number(d.fit_score) || 0,
        intellectual_score: Number(d.intellectual_score) || 0,
        character_score: Number(d.character_score) || 0,
        improvement_tips: d.improvement_tips || "No specific tips provided."
      };
    });

    return json({ decisions, applicantSummary });
  } catch (error) {
    console.error(error);
    return json({ error: 'Evaluation failed.' }, { status: 500 });
  }
};