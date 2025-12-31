import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
    const DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;

    if (!DEEPSEEK_API_KEY) {
        console.error('DEEPSEEK_API_KEY is not set.');
        return json({ error: 'AI service configuration error.' }, { status: 500 });
    }

    let body: any;
    try {
        body = await request.json();
    } catch {
        return json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const {
        gradeLevel, // e.g. "Junior", "Sophomore"
        essay,
        activities,
        honors,
        transcript,
        major,
        testScores
    } = body;

    const sections: string[] = [];
    if (gradeLevel) sections.push(`Current Grade Level: ${gradeLevel}`);
    if (major) sections.push(`Intended Major: ${major}`);
    if (testScores) sections.push(`Test Scores: ${testScores}`);
    if (transcript) sections.push(`Transcript / GPA / Coursework:\n${transcript}`);
    if (activities) sections.push(`Activities / Extracurriculars:\n${activities}`);
    if (honors) sections.push(`Honors & Awards:\n${honors}`);
    if (essay) sections.push(`Rough Draft / Notes on Personal Statement:\n${essay}`);

    const applicantSummary = sections.join('\n\n').trim();

    if (!applicantSummary) {
        return json({ error: 'Please provide application data.' }, { status: 400 });
    }

    const systemPrompt = `You are an expert college admissions consultant for high school juniors.
Analyze the student's profile and provide a "Junior Diagnostic".

Output a JSON object with:
1. "radar_chart": 5 axis scores (1-100) for [Academic, Extracurricular, Intellectual, Personal, Leadership].
2. "predictions": A list of 6 schools (2 Reach, 2 Target, 2 Safety) with "school" name, "outcome" (Likely, Target, Reach, Far Reach), and "chance" (percentage string).
3. "trajectory_graph": Data for a graph showing "Admission Probability" over the next 12 months.
    - "months": ["Month 1", "Month 3", "Month 6", "Month 9", "Application"]
    - "current_path": [5 values illustrating slow growth without intervention]
    - "potential_path": [5 values illustrating rapid growth with expert guidance/PredictAdmit Pro]
4. "analysis": A brief 2-sentence summary of their current standing.

RESPONSE FORMAT: Valid JSON only.`;

    const userPrompt = `Student Profile:
${applicantSummary}

Provide the diagnostic JSON.`;

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
        const result = JSON.parse(content);

        return json({ result });
    } catch (error) {
        console.error('Junior Diagnostic Error:', error);
        return json({ error: 'Diagnostic failed.' }, { status: 500 });
    }
};
