import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { profile } = await request.json();

		const systemPrompt = `You are an expert college admissions consultant. 
        Your task is to analyze a student's profile (GPA, Test Scores, Extracurriculars, Demographics) and brainstorm 5-8 core themes, values, or "nodes" that represent their strongest narrative threads.
        
        You must also define connections between these nodes to show how different parts of their application relate (e.g., "Robotics Club" connects to "Leadership" via "Project Management").

        Return ONLY a valid JSON object with this exact structure:
        {
            "nodes": [
                { "id": "unique_string", "text": "Short Theme/Activity Name", "x": number (0-800), "y": number (0-600) }
            ],
            "connections": [
                { "from": "id_of_source_node", "to": "id_of_target_node" }
            ]
        }
        
        Spatial Layout: Distribute the nodes visually in a logical way (e.g. central theme in middle, supporting evidence around it). Avoid overlapping coordinates.`;

		const userPrompt = `Applicant Profile:
        GPA: ${profile.gpa} (${profile.gpa_uw} UW)
        Test Score: ${profile.testScore}
        State: ${profile.state || 'Unknown'}
        Env: ${profile.environment || 'Unknown'}
        Major: ${profile.major || 'Unknown'}
        Activities: ${JSON.stringify(profile.activities || [])}
        
        Generate a mind map for this student.`;

		const response = await fetch('https://api.anthropic.com/v1/messages', {
			method: 'POST',
			headers: {
				'x-api-key': env.CLAUDE_API_KEY || '',
				'anthropic-version': '2023-06-01',
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				model: 'claude-3-5-sonnet-20240620',
				max_tokens: 4096,
				system: systemPrompt,
				messages: [{ role: 'user', content: userPrompt }]
			})
		});

		if (!response.ok) {
			const err = await response.text();
			console.error('AI Error:', err);
			return json({ error: 'Failed to generate mind map' }, { status: 500 });
		}

		const data = await response.json();
		const textContent = data.content[0].text;

		// Extract JSON
		const jsonMatch = textContent.match(/\{[\s\S]*\}/);
		const jsonStr = jsonMatch ? jsonMatch[0] : textContent;

		const result = JSON.parse(jsonStr);
		return json(result);
	} catch (e) {
		console.error('MindMap Generation Error', e);
		return json({ error: 'Server Error' }, { status: 500 });
	}
};
