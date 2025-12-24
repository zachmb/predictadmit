// src/routes/api/ai-evaluate/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

type DecisionOutcome = 'admit' | 'deny' | 'waitlist' | 'defer';

type AiDecision = {
  school: string;
  slug: string;
  outcome: DecisionOutcome | string;
  short_reason: string;
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

// Hard cap to avoid sending insane amounts of text to DeepSeek
function truncateForModel(text: string, maxChars = 12000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '\n\n[Truncated for length]';
}

export const POST: RequestHandler = async ({ request }) => {
  // 🔑 Read env at request time
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

  const {
    essay: essayTextInput,
    activities: activitiesTextInput,
    honors: honorsTextInput,
    transcript: transcriptTextInput,
    edSlug,
    googleEmail,
    googleName
  } = (body ?? {}) as {
    essay?: string;
    activities?: string;
    honors?: string;
    transcript?: string;
    edSlug?: string;
    googleEmail?: string;
    googleName?: string;
  };

  console.log('ai-evaluate body keys:', Object.keys(body ?? {}));

  // Require at least one text input
  if (
    !essayTextInput?.trim() &&
    !activitiesTextInput?.trim() &&
    !honorsTextInput?.trim() &&
    !transcriptTextInput?.trim()
  ) {
    return json(
      {
        error:
          'Please provide at least one of: essay, activities, honors, or transcript text. PDFs are not supported yet—copy and paste your text into the boxes.'
      },
      { status: 400 }
    );
  }

  const essayText = (essayTextInput ?? '').trim();
  const activitiesText = (activitiesTextInput ?? '').trim();
  const honorsText = (honorsTextInput ?? '').trim();
  const transcriptText = (transcriptTextInput ?? '').trim();

  const sections: string[] = [];

  if (essayText) sections.push(`Personal essay:\n${essayText}`);
  if (activitiesText) sections.push(`Activities / extracurriculars:\n${activitiesText}`);
  if (honorsText) sections.push(`Honors & awards:\n${honorsText}`);
  if (transcriptText)
    sections.push(`Transcript / GPA & coursework / testing:\n${transcriptText}`);

  let applicantSummary = sections.join('\n\n').trim();

  if (!applicantSummary) {
    return json(
      {
        error:
          'No usable text could be extracted from your inputs. Make sure you paste your essay, activities, honors, or transcript text into the boxes. PDFs are not supported yet.'
      },
      { status: 400 }
    );
  }

  applicantSummary = truncateForModel(applicantSummary, 12000);

  // --- DeepSeek admissions simulation ----------------------------------

  const systemPrompt = `You are an elite US college admissions simulation engine.
You will receive an applicant's materials and a fixed list of highly selective US universities.
Your job is to predict outcomes and briefly explain them.

You must respond with JSON only (valid json), and nothing else.
The JSON must be an object with a single key "decisions" which is an array of objects.

Each decision object must have:
- "school": string, the school name exactly as provided
- "slug": string, the slug exactly as provided
- "outcome": one of "admit", "deny", "waitlist", or "defer"
- "short_reason": string, 1–3 sentences explaining the decision.

Only use information present in the applicant's materials. Do NOT hallucinate extra awards, stats, or achievements.

Example JSON (structure only):

{
  "decisions": [
    {
      "school": "Harvard University",
      "slug": "harvard",
      "outcome": "deny",
      "short_reason": "Example rationale."
    }
  ]
}

The word "json" appears in this prompt so you know you must output valid JSON.`;

  const schoolListText = SCHOOLS.map(
    (s, i) => `${i + 1}. ${s.school} (slug: ${s.slug})`
  ).join('\n');

  const userPrompt = `Applicant materials:

${applicantSummary}

Applicant metadata:
- Declared ED/REA slug (may be empty): ${edSlug || 'none'}
- Simulated Google identity: ${googleName || 'N/A'} <${googleEmail || 'N/A'}>

Now evaluate this applicant for the following universities:
${schoolListText}

Return json only in the format described above.`;

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
        temperature: 0.4,
        response_format: { type: 'json_object' },
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek evaluate error:', errorText);
      return json(
        { error: 'DeepSeek API error while generating decisions.', details: errorText },
        { status: 502 }
      );
    }

    const completion = await response.json();
    const content = completion?.choices?.[0]?.message?.content;

    if (!content || typeof content !== 'string') {
      return json({ error: 'DeepSeek returned empty content.' }, { status: 502 });
    }

    let parsed: { decisions?: AiDecision[] };

    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.error('Failed to parse DeepSeek JSON:', err, 'content:', content);
      return json(
        {
          error: 'Failed to parse DeepSeek JSON output. Try again or simplify your inputs.',
          raw: content
        },
        { status: 502 }
      );
    }

    const rawDecisions = parsed?.decisions ?? [];

    const decisions = rawDecisions
      .filter(
        (d): d is AiDecision =>
          typeof d.school === 'string' &&
          typeof d.slug === 'string' &&
          typeof d.outcome === 'string' &&
          typeof d.short_reason === 'string'
      )
      .map((d) => {
        const normalized = d.outcome.toLowerCase();
        const outcome: DecisionOutcome =
          normalized === 'admit' ||
          normalized === 'deny' ||
          normalized === 'waitlist' ||
          normalized === 'defer'
            ? (normalized as DecisionOutcome)
            : 'deny';

        return {
          school: d.school,
          slug: d.slug,
          outcome,
          short_reason: d.short_reason
        };
      });

    return json({
      decisions,
      schools: SCHOOLS,
      applicantSummary
    });
  } catch (error) {
    console.error('Unexpected DeepSeek evaluate error:', error);
    return json(
      { error: 'Unexpected server error while calling DeepSeek for evaluation.' },
      { status: 500 }
    );
  }
};
