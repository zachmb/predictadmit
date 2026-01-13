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

    const claudeSystemPrompt = `You are an elite Admissions Officer at ${selectedSchool}. 
    Review the following ${essayType} essay(s) for a ${major} applicant.
    
    YOUR MAIN TASK: Identify parts of the essay where an AO would be **confused** or generally need more clarity.
    
    For EACH essay in the input, you must:
    1. Identify EXACTLY 5 distinct areas (phrases/sentences) where clarity is lacking or the narrative is confusing.
    2. For each area, provide the "quote" and a "comment" that asks a specific question to clarify that confusion.
    3. Score the essay on the specified categories.

    Categories to Score (1-10): ${essayType === 'personal' ? "selfReflection, personality/Character, writingQuality, growth, institutionalAlignment" : "personalityCharacter, majorFit, schoolFit, potentialContribution, promptAlignment"}

    Return ONLY a JSON object with this exact structure: 
    { 
        "essays": [{ 
            "prompt": "prompt text if detected, else null", 
            "scores": { 
                "categoryKey": { "score": number, "explanation": "string" } 
            }, 
            "average": number,
            "annotations": [
                // MUST have exactly 5 annotations per essay
                { "quote": "exact substring from text", "comment": "How...? / Why...? / What does this mean...?", "type": "critical" }
            ]
        }] 
    }`;

    const deepSeekSystemPrompt = `You are a brutally honest, cynical Ivy League admissions officer. 
    Your goal is to tear apart this essay and explain exactly why it might fail. DO NOT holding back.
    Provide a single paragraph of "harsh_feedback" validation.
    
    Return ONLY JSON:
    { "harsh_feedback": "string" }`;

    const userPrompt = `${profileContext}\nContent (may contain multiple essays separated by delimiters):\n${content}`;

    try {
        // Parallel execution: Claude for structure/grades, DeepSeek for brutal feedback
        const [claudeRes, deepSeekRes] = await Promise.all([
            fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': env.CLAUDE_API_KEY || '',
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    model: "claude-3-5-sonnet-20240620",
                    max_tokens: 4096,
                    system: claudeSystemPrompt,
                    messages: [{ role: "user", content: userPrompt }]
                })
            }),
            fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.DEEPSEEK_API_KEY || ''}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        { role: "system", content: deepSeekSystemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    response_format: { type: "json_object" }
                })
            }).catch(e => {
                console.error('DeepSeek Network Error', e);
                return null;
            })
        ]);

        if (!claudeRes.ok) throw new Error('Claude API Error');

        const claudeData = await claudeRes.json();
        const claudeText = claudeData.content[0].text;

        // DeepSeek is optional but preferred
        let deepSeekFeedback = '';
        if (deepSeekRes && deepSeekRes.ok) {
            try {
                const deepSeekData = await deepSeekRes.json();
                const dsContent = deepSeekData.choices[0].message.content;
                const dsJson = JSON.parse(dsContent);
                deepSeekFeedback = dsJson.harsh_feedback;
            } catch (e) {
                console.error('DeepSeek Parse Error', e);
                // Fallback probably not needed if JSON parse failed, but we can verify
            }
        } else if (deepSeekRes) {
            console.error('DeepSeek API Error Status:', deepSeekRes.status, await deepSeekRes.text());
        }

        // Parse Claude JSON
        const jsonMatch = claudeText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : claudeText;
        const parsedContent = JSON.parse(jsonStr) as AIResponsePayload;

        // Merge DeepSeek feedback into the first essay (or all? usually first is main)
        if (parsedContent.essays.length > 0) {
            parsedContent.essays[0].harsh_feedback = deepSeekFeedback;
        }

        return json(parsedContent);

    } catch (e) {
        console.error('Essay Grader Error', e);
        return json({ error: 'Failed to process essay' }, { status: 500 });
    }
};