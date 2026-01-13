import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import type { RequestHandler } from './$types';

interface CategoryResult {
    score: number;
    explanation: string;
}

interface Annotation {
    quote: string;
    comment: string;
    type: 'critical' | 'suggestion';
}

interface EssayEvaluation {
    prompt: string | null;
    scores: Record<string, CategoryResult>;
    average: number;
    annotations: Annotation[];
    harsh_feedback: string;
}

interface AIResponsePayload {
    essays: EssayEvaluation[];
}

interface AIProviderResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

export const POST: RequestHandler = async ({ request }) => {
    const { major, selectedSchool, essayType, content, profile } = await request.json();

    const profileContext = profile
        ? `\nAPPLICANT STATS:\nGPA: ${profile.gpa}\nTest Scores: ${profile.testScore}\nExtracurriculars: ${profile.ecs}\n`
        : '';

    const systemPrompt = `You are a brutally honest, realistic, and elite Admissions Officer at ${selectedSchool}. 
    Review the following ${essayType} essay(s) for a ${major} applicant.
    
    YOUR MAIN TASK: Identify parts of the essay where an AO would be **confused** or generally need more clarity.
    
    For EACH essay in the input, you must:
    1. Identify EXACTLY 5 distinct areas (phrases/sentences) where clarity is lacking or the narrative is confusing.
    2. For each area, provide the "quote" and a "comment" that asks a specific question to clarify that confusion.
    3. Also provide a "harsh_feedback" summary and score the essay on the specified categories.

    Categories to Score (1-10): ${essayType === 'personal' ? "selfReflection, personality/Character, writingQuality, growth, institutionalAlignment" : "personalityCharacter, majorFit, schoolFit, potentialContribution, promptAlignment"}

    Return ONLY a JSON object with this exact structure: 
    { 
        "essays": [{ 
            "prompt": "prompt text if detected, else null", 
            "scores": { 
                "categoryKey": { "score": number, "explanation": "string" } 
            }, 
            "average": number,
            "harsh_feedback": "string",
            "annotations": [
                // MUST have exactly 5 annotations per essay
                { "quote": "exact substring from text", "comment": "How...? / Why...? / What does this mean...?", "type": "critical" }
            ]
        }] 
    }`;

    const userPrompt = `${profileContext}\nContent (may contain multiple essays separated by delimiters):\n${content}`;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': env.CLAUDE_API_KEY || '',
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 4096,
                system: systemPrompt,
                messages: [
                    { role: "user", content: userPrompt }
                ]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Anthropic API Error:', errText);
            return json({ error: 'AI Provider Error' }, { status: 500 });
        }

        const data = await response.json();
        const textContent = data.content[0].text;

        // Locate JSON in response (in case of extra text)
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : textContent;

        const parsedContent = JSON.parse(jsonStr) as AIResponsePayload;
        return json(parsedContent);

    } catch (e) {
        console.error('Essay Grader Error', e);
        return json({ error: 'Failed to process essay' }, { status: 500 });
    }
};