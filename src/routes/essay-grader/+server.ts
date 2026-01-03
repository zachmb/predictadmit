import { json } from '@sveltejs/kit';
import { DEEPSEEK_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

interface CategoryResult {
    score: number;
    explanation: string;
}

interface EssayEvaluation {
    prompt: string | null;
    scores: Record<string, CategoryResult>;
    average: number;
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
    const { major, selectedSchool, essayType, content } = await request.json();

    // Define specific categories based on instructions
    const categories = essayType === 'personal' 
        ? "selfReflection, personality/Character, writingQuality, growth, institutionalAlignment"
        : "personalityCharacter, majorFit, schoolFit, potentialContribution, promptAlignment";

    const systemPrompt = `You are a brutally honest, realistic, and elite Admissions Officer at ${selectedSchool}. 
    Review the following ${essayType} essay(s) for a ${major} applicant. 
    Be forthright and harsh. Do not manufacture problems, but reject fluff.

    For EACH essay, you MUST provide scores (1-10) and a detailed, harsh explanation for EXACTLY these categories:
    ${categories}.

    Return ONLY a JSON object with this exact structure: 
    { 
        "essays": [{ 
            "prompt": "string or null", 
            "scores": { 
                "categoryKey": { "score": number, "explanation": "string" } 
            }, 
            "average": number 
        }] 
    }`;

    const userPrompt = `Content: ${content}`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
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

    const parsedContent = JSON.parse(rawData.choices[0].message.content) as AIResponsePayload;

    return json(parsedContent);
};