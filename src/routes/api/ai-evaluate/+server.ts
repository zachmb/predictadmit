// src/routes/api/ai-evaluate/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { DEEPSEEK_API_KEY } from '$env/static/private';
import { env as privateEnv } from '$env/dynamic/private';

const OCR_SPACE_API_KEY = privateEnv.OCR_SPACE_API_KEY; // optional OCR fallback

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

// --- PDF & OCR HELPERS ------------------------------------------------------

// Decode a data: URL or raw base64 string into a Buffer
function bufferFromDataUrl(dataUrlOrBase64: string): Buffer {
  const base64 = dataUrlOrBase64.includes(',')
    ? dataUrlOrBase64.split(',')[1]
    : dataUrlOrBase64;
  return Buffer.from(base64, 'base64');
}

// Call OCR.space as a fallback for scanned/image-only PDFs
async function ocrSpaceFromDataUrl(dataUrl: string): Promise<string> {
  if (!OCR_SPACE_API_KEY) return '';

  try {
    const params = new URLSearchParams({
      base64Image: dataUrl, // keep the data:application/pdf;base64,... prefix
      language: 'eng',
      filetype: 'pdf',
      isOverlayRequired: 'false'
    });

    const res = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        apikey: OCR_SPACE_API_KEY
      },
      body: params.toString()
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error('OCR.space HTTP error:', res.status, txt);
      return '';
    }

    const data = await res.json();

    // Even if IsErroredOnProcessing is true (e.g. "max page limit 3"),
    // OCR.space often STILL returns ParsedResults with partial text.
    const parsedResults = data.ParsedResults;
    let combined = '';

    if (Array.isArray(parsedResults) && parsedResults.length > 0) {
      combined = parsedResults
        .map((r: any) => (typeof r.ParsedText === 'string' ? r.ParsedText : ''))
        .filter(Boolean)
        .join('\n\n')
        .trim();
    }

    if (combined) {
      if (data.IsErroredOnProcessing) {
        console.warn(
          'OCR.space reported an error but returned partial text:',
          data.ErrorMessage || data.ErrorDetails || data.OCRExitCode
        );
      }
      return combined;
    }

    // If there *is* an error and we got no ParsedResults, then treat as failure
    if (data.IsErroredOnProcessing) {
      console.error(
        'OCR.space processing error with no text:',
        data.ErrorMessage || data.ErrorDetails || data.OCRExitCode
      );
    }

    return '';
  } catch (err) {
    console.error('OCR.space request failed:', err);
    return '';
  }
}

// Extract text using pdf-parse first; if empty or broken, fall back to OCR.space
async function extractTextFromPdfDataUrl(
  value?: unknown
): Promise<{ text: string; usedOcr: boolean }> {
  if (!value || typeof value !== 'string') return { text: '', usedOcr: false };

  // 1) Try pdf-parse via dynamic import, but *only* call it if it's actually a function
  try {
    const buf = bufferFromDataUrl(value);
    const pdfModule: any = await import('pdf-parse');
    const pdfFn: any = pdfModule.default || pdfModule;

    if (typeof pdfFn === 'function') {
      const result = await pdfFn(buf);
      const rawText = (result?.text ?? '').toString();
      const normalized = rawText
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      if (normalized) {
        return { text: normalized, usedOcr: false };
      }
    } else {
      console.warn(
        'pdf-parse module did not export a function; falling back to OCR.',
        pdfModule
      );
    }
  } catch (err) {
    console.error('pdf-parse failed (will fall back to OCR):', err);
  }

  // 2) Fallback to OCR.space for scanned/image-only PDFs or when pdf-parse misbehaves
  const ocrText = await ocrSpaceFromDataUrl(value);
  if (ocrText) {
    const normalized = ocrText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    return { text: normalized, usedOcr: true };
  }

  return { text: '', usedOcr: false };
}

// Hard cap to avoid sending insane amounts of text to DeepSeek
function truncateForModel(text: string, maxChars = 12000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '\n\n[Truncated for length]';
}

// Try to salvage "almost JSON" from DeepSeek when it truncates the tail
function attemptJsonRepair(raw: string): { decisions?: AiDecision[] } | null {
  try {
    // If this works, great.
    return JSON.parse(raw);
  } catch {
    // fall through to manual repair
  }

  // Find the first '{' that starts the JSON, and the last '}' that closes a full object
  const start = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');

  if (start === -1 || lastBrace === -1 || lastBrace <= start) {
    return null;
  }

  let core = raw.slice(start, lastBrace + 1).trim();

  // If it already ends with "]}" or "}]}", assume it's complete-ish
  if (!core.endsWith(']}') && !core.endsWith('}]')) {
    // Very common structure here is:
    // { "decisions": [ { ... }, { ... }, { ... }   <- truncated after last object
    // so we just close the array and root object.
    if (core.endsWith('}')) {
      core = core + '\n  ]\n}';
    } else {
      core = core + '\n}\n  ]\n}';
    }
  } else if (core.endsWith('}]')) {
    // if ends with "}]", wrap with outer braces if missing
    if (!core.trimStart().startsWith('{')) {
      core = '{ "decisions": ' + core + '}';
    } else {
      core = core + '}';
    }
  }

  try {
    return JSON.parse(core);
  } catch (err) {
    console.error('JSON repair attempt failed:', err, 'core:', core);
    return null;
  }
}

// --- MAIN HANDLER -----------------------------------------------------------

export const POST: RequestHandler = async ({ request }) => {
  if (!DEEPSEEK_API_KEY) {
    return json(
      { error: 'DEEPSEEK_API_KEY is not set on the server. Add it to your .env file.' },
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
    // typed inputs
    essay: essayTextInput,
    activities: activitiesTextInput,
    honors: honorsTextInput,
    transcript: transcriptTextInput,
    // PDFs (base64 data URLs from the client)
    essayPdf,
    essayPdfName,
    activitiesPdf,
    activitiesPdfName,
    honorsPdf,
    honorsPdfName,
    transcriptPdf,
    transcriptPdfName,
    // other metadata (ED, fake Google identity)
    edSlug,
    googleEmail,
    googleName
  } = (body ?? {}) as {
    essay?: string;
    activities?: string;
    honors?: string;
    transcript?: string;
    essayPdf?: string;
    essayPdfName?: string;
    activitiesPdf?: string;
    activitiesPdfName?: string;
    honorsPdf?: string;
    honorsPdfName?: string;
    transcriptPdf?: string;
    transcriptPdfName?: string;
    edSlug?: string;
    googleEmail?: string;
    googleName?: string;
  };

  // Debug: ensure PDFs are actually arriving
  const bodyKeys = Object.keys(body ?? {});
  console.log('ai-evaluate body keys:', bodyKeys);
  console.log(
    'essayPdf type/len:',
    typeof essayPdf,
    typeof essayPdf === 'string' ? essayPdf.length : 'n/a'
  );
  console.log(
    'activitiesPdf type/len:',
    typeof activitiesPdf,
    typeof activitiesPdf === 'string' ? activitiesPdf.length : 'n/a'
  );
  console.log(
    'honorsPdf type/len:',
    typeof honorsPdf,
    typeof honorsPdf === 'string' ? honorsPdf.length : 'n/a'
  );
  console.log(
    'transcriptPdf type/len:',
    typeof transcriptPdf,
    typeof transcriptPdf === 'string' ? transcriptPdf.length : 'n/a'
  );

  // If literally nothing was sent, short-circuit
  if (
    !essayTextInput &&
    !activitiesTextInput &&
    !honorsTextInput &&
    !transcriptTextInput &&
    !essayPdf &&
    !activitiesPdf &&
    !honorsPdf &&
    !transcriptPdf
  ) {
    return json(
      {
        error:
          'Please provide at least one of: essay, activities, honors, transcript, or a PDF.'
      },
      { status: 400 }
    );
  }

  // Initial typed text
  let essayText = (essayTextInput ?? '').trim();
  let activitiesText = (activitiesTextInput ?? '').trim();
  let honorsText = (honorsTextInput ?? '').trim();
  let transcriptText = (transcriptTextInput ?? '').trim();

  // Extract PDF text in parallel (with OCR fallback for scanned docs)
  const [essayExtract, activitiesExtract, honorsExtract, transcriptExtract] =
    await Promise.all([
      extractTextFromPdfDataUrl(essayPdf),
      extractTextFromPdfDataUrl(activitiesPdf),
      extractTextFromPdfDataUrl(honorsPdf),
      extractTextFromPdfDataUrl(transcriptPdf)
    ]);

  if (essayExtract.text) {
    const label = essayExtract.usedOcr ? 'PDF essay (via OCR)' : 'PDF essay';
    const nameLabel = essayPdfName ? ` (file: ${essayPdfName})` : '';
    essayText = [essayText, `${label}${nameLabel}:\n${essayExtract.text}`]
      .filter(Boolean)
      .join('\n\n');
  }

  if (activitiesExtract.text) {
    const label = activitiesExtract.usedOcr ? 'PDF activities (via OCR)' : 'PDF activities';
    const nameLabel = activitiesPdfName ? ` (file: ${activitiesPdfName})` : '';
    activitiesText = [activitiesText, `${label}${nameLabel}:\n${activitiesExtract.text}`]
      .filter(Boolean)
      .join('\n\n');
  }

  if (honorsExtract.text) {
    const label = honorsExtract.usedOcr ? 'PDF honors (via OCR)' : 'PDF honors';
    const nameLabel = honorsPdfName ? ` (file: ${honorsPdfName})` : '';
    honorsText = [honorsText, `${label}${nameLabel}:\n${honorsExtract.text}`]
      .filter(Boolean)
      .join('\n\n');
  }

  if (transcriptExtract.text) {
    const label = transcriptExtract.usedOcr ? 'PDF transcript (via OCR)' : 'PDF transcript';
    const nameLabel = transcriptPdfName ? ` (file: ${transcriptPdfName})` : '';
    transcriptText = [transcriptText, `${label}${nameLabel}:\n${transcriptExtract.text}`]
      .filter(Boolean)
      .join('\n\n');
  }

  const sections: string[] = [];

  if (essayText.trim()) sections.push(`Personal essay:\n${essayText.trim()}`);
  if (activitiesText.trim())
    sections.push(`Activities / extracurriculars:\n${activitiesText.trim()}`);
  if (honorsText.trim()) sections.push(`Honors & awards:\n${honorsText.trim()}`);
  if (transcriptText.trim())
    sections.push(`Transcript / GPA & coursework / testing:\n${transcriptText.trim()}`);

  let applicantSummary = sections.join('\n\n');

  // After typed + pdf + OCR, if still nothing, then *really* no usable text
  if (!applicantSummary.trim()) {
    const uploadedNames = [
      essayPdfName && `Essay: ${essayPdfName}`,
      activitiesPdfName && `Activities: ${activitiesPdfName}`,
      honorsPdfName && `Honors: ${honorsPdfName}`,
      transcriptPdfName && `Transcript: ${transcriptPdfName}`
    ]
      .filter(Boolean)
      .join('; ');

    const uploadedSummary = uploadedNames
      ? `Uploaded files detected but no extractable text (even via OCR): ${uploadedNames}.`
      : 'No usable text found in any input.';

    return json(
      {
        error:
          'No usable text could be extracted from your inputs. Make sure your PDFs are not password-protected and contain readable text.',
        details: uploadedSummary
      },
      { status: 400 }
    );
  }

  applicantSummary = truncateForModel(applicantSummary, 12000);

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
        max_tokens: 1200
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

    let parsed: { decisions?: AiDecision[] } | null = null;

    try {
      parsed = attemptJsonRepair(content);
    } catch (err) {
      console.error('Unexpected error in JSON repair:', err);
    }

    if (!parsed) {
      console.error('Failed to parse DeepSeek JSON even after repair.', 'content:', content);
      return json(
        {
          error: 'Failed to parse DeepSeek JSON output. Try again or simplify your inputs.',
          raw: content
        },
        { status: 502 }
      );
    }

    const rawDecisions = parsed.decisions ?? [];

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
