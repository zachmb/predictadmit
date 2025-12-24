// src/routes/api/ai-deep-dive/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

type DecisionOutcome = 'admit' | 'deny' | 'waitlist' | 'defer';

export const POST: RequestHandler = async ({ request }) => {
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

  const { school, slug, outcome, short_reason, applicantSummary } = (body ?? {}) as {
    school?: string;
    slug?: string;
    outcome?: DecisionOutcome;
    short_reason?: string;
    applicantSummary?: string;
  };

  if (!school || !slug || !outcome || !applicantSummary) {
    return json(
      {
        error:
          'Missing required fields. Need school, slug, outcome, and applicantSummary to generate a deep dive.'
      },
      { status: 400 }
    );
  }

  const systemPrompt = `You are an experienced admissions officer at ${school}.
You are writing a confidential, internal-style explanation for why this applicant received their decision.
Be candid, nuanced, and constructive – but always professional and humane.`;

  const userPrompt = `You are simulating ${school}'s admissions committee explaining why they chose to ${outcome.toUpperCase()} this applicant.

Decision outcome: ${outcome}
Short summary of rationale from the prediction engine: ${short_reason ?? '(none provided)'}

Applicant materials (summary – treat this as confidential application content):
${applicantSummary}

Write a detailed explanation of this decision AS IF you were the admissions committee at ${school}.
Structure your answer with short markdown headings and clear sections, covering at least:

1. Academic preparation (rigor, grades, context).
2. Extracurricular impact and leadership.
3. Personal qualities, background, and context.
4. Overall fit with ${school}'s institutional priorities.
5. Concrete advice for what this student could do next (appeals, transfers, future apps, etc.).

Speak directly to the student in the second person, but keep a professional, steady tone.
Do not include JSON – just write readable markdown text.`;

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
        max_tokens: 1600
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

    return json({
      deepDive: {
        school,
        slug,
        outcome,
        explanation: content
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
