import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { profile, mindMap, targetSchool, prompt } = await request.json();

        const systemPrompt = `You are an expert college essay coach. 
        Your task is to draft a college admissions essay for ${targetSchool || 'a general personal statement'}.
        
        Use the provided "Mind Map" which represents the student's brainstormed themes and connections. 
        Weave these nodes together into a cohesive narrative.
        
        Applicant Context:
        Major: ${profile.major || 'Undecided'}
        Activities: ${JSON.stringify(profile.activities || [])}
        
        Instructions:
        1. Write in a voice that is authentic, engaging, and personal.
        2. Use the connections in the mind map to build logical transitions.
        3. Addressing the prompt: "${prompt || 'Tell us about who you are.'}"
        
        Return ONLY a JSON object:
        {
            "content": "# Draft Essay\\n\\n[The essay content in markdown...]"
        }`;

        const userPrompt = `Mind Map Nodes: ${JSON.stringify(mindMap.nodes)}
        Mind Map Connections: ${JSON.stringify(mindMap.connections)}
        
        Draft the essay.`;

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
            const err = await response.text();
            console.error('AI Error:', err);
            return json({ error: 'Failed to draft essay' }, { status: 500 });
        }

        const data = await response.json();
        const textContent = data.content[0].text;

        // Extract JSON
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : textContent;

        const result = JSON.parse(jsonStr);
        return json(result);

    } catch (e) {
        console.error('Essay Draft Error', e);
        return json({ error: 'Server Error' }, { status: 500 });
    }
};
