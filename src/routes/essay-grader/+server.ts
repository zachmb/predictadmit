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

interface DeepSeekResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

export const POST: RequestHandler = async ({ request }) => {
    const { major, selectedSchool, essayType, content, profile } = await request.json();

    // Define specific categories based on instructions
    const categories = essayType === 'personal'
        ? "selfReflection, personality/Character, writingQuality, growth, institutionalAlignment"
        : "personalityCharacter, majorFit, schoolFit, potentialContribution, promptAlignment";

    const profileContext = profile
        ? `\nAPPLICANT STATS:\nGPA: ${profile.gpa}\nTest Scores: ${profile.testScore}\nExtracurriculars: ${profile.ecs}\n`
        : '';

    const systemPrompt = `You are a brutally honest, realistic, and elite Admissions Officer at ${selectedSchool}. 
    Review the following ${essayType} essay(s) for a ${major} applicant. 
    Be forthright and harsh. Do not manufacture problems, but reject fluff.

    For EACH essay, you MUST provide:
    1. Scores (1-10) and a explanation for these categories: ${categories}.
    2. A "harsh_feedback" summary that provides a overall critique.
    3. "annotations": specific phrases from the text that need improvement.

    Return ONLY a JSON object with this exact structure: 
    { 
        "essays": [{ 
            "prompt": "string or null", 
            "scores": { 
                "categoryKey": { "score": number, "explanation": "string" } 
            }, 
            "average": number,
            "harsh_feedback": "string",
            "annotations": [{ "quote": "exact substring from text", "comment": "string", "type": "critical" }]
        }] 
    }`;

    const userPrompt = `${profileContext}\nContent: ${content}`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: 'json_object' }
        })
    });

    const rawData = (await response.json()) as DeepSeekResponse;

    if (!rawData.choices?.[0]?.message?.content) {
        return json({ error: 'Invalid response from AI' }, { status: 500 });
    }

    try {
        const parsedContent = JSON.parse(rawData.choices[0].message.content) as AIResponsePayload;
        return json(parsedContent);
    } catch (e) {
        console.error('AI Parse Error', e);
        return json({ error: 'Failed to parse AI response' }, { status: 500 });
    }
};