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
	honest_feedback: string;
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
	console.log('[Essay Grader] Request received');

	let requestData;
	try {
		requestData = await request.json();
	} catch (e) {
		console.error('[Essay Grader] Failed to parse request JSON', e);
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const { major, selectedSchool, essayType, content, profile } = requestData;

	if (!env.CLAUDE_API_KEY) {
		console.error('[Essay Grader] Missing CLAUDE_API_KEY');
		return json({ error: 'Server Config Error: Missing CLAUDE_API_KEY' }, { status: 500 });
	}

	// Construct Profile Context with Activities
	let profileContext = '';
	if (profile && typeof profile === 'object') {
		let activityText = '';
		if (profile.activities && Array.isArray(profile.activities) && profile.activities.length > 0) {
			activityText = profile.activities
				.map(
					(a: any, i: number) =>
						`${i + 1}. ${a.name} (${a.role}) - ${a.hoursPerWeek} hrs/wk\n   ${a.description || ''}`
				)
				.join('\n');
		} else {
			activityText = profile.ecs || 'N/A';
		}

		profileContext = `\nAPPLICANT STATS:\nGPA: ${profile.gpa || 'N/A'}\nTest Scores: ${profile.testScore || 'N/A'}\nExtracurriculars:\n${activityText}\n`;
	}

	const claudeSystemPrompt = `You are an elite, extremely critical Admissions Officer at ${selectedSchool || 'a top university'}. 
    Review the following ${essayType || 'college'} essay(s) for a ${major || 'undecided'} applicant.
    
    YOUR MAIN TASK: Identify parts of the essay where an AO would be **confused** or generally need more clarity.
    
    SCORING INSTRUCTIONS (CRITICAL):
    - You are a customized "Harsh Grader". **DO NOT INFLATE SCORES.**
    - A 5/10 is an AVERAGE good essay. 
    - A 7/10 is EXCELLENT (Top 10%).
    - A 9/10 or 10/10 is practically IMPOSSIBLE (Pulitzer-prize level).
    - If the essay is generic, cliche, or boring, score it in the 3-5 range.
    - Be vicious specifically on "Growth" and "Contribution" - most students fake this.
    - For Supplemental Essays: Be especially harsh on "School Fit" and "Major Fit". If they mention generic things like "good professors" or "nice campus", give them a 2/10 or 3/10 for those categories.
    
    CRITICAL: Evaluate how well the essay matches the applicant's Extracurriculars/Honors. Does the narrative make sense given their background?
    
    For EACH essay in the input, you must:
    1. Identify EXACTLY 10 distinct areas (phrases/sentences) where clarity is lacking or the narrative is confusing.
    2. For each area, provide the "quote" and a "comment" that asks a specific question to clarify that confusion.
    3. Score the essay on the specified categories using the HARSH scale above.

    ACADEMIC-INTEGRITY HARD RULE: you give feedback ONLY. Never write, rewrite, or suggest replacement wording, sentences, or phrases the student could paste into their essay — no "try saying X instead", no example rewrites, no model sentences. Comments must be questions or observations about THEIR text, never new application prose.

    Categories to Score (1-10): ${essayType === 'personal' ? 'selfReflection, personality/Character, writingQuality, growth, institutionalAlignment' : 'personalityCharacter, majorFit, schoolFit, potentialContribution, promptAlignment'}

    Return ONLY a JSON object with this exact structure: 
    { 
        "essays": [{ 
            "prompt": "prompt text if detected, else null", 
            "scores": { 
                "categoryKey": { "score": number, "explanation": "string" } 
            }, 
            "average": number,
            "annotations": [
                // MUST have exactly 10 annotations per essay
                { "quote": "exact substring from text", "comment": "How...? / Why...? / What does this mean...?", "type": "critical" }
            ]
        }] 
    }`;

	const deepSeekSystemPrompt = `You are a cynical, overworked Ivy League admissions officer who has read 5,000 applications this season. You are tired of generic essays.
    
    Your Role:
    1. The Cynic (Brutal): Tear this essay apart. What is your first negative impression? Ignore the positives.
    2. The Realist (Honest): Provide a balanced check. What works, what doesn't, and what is the realistic outcome?

    ACADEMIC-INTEGRITY HARD RULE: feedback only — never write or suggest replacement sentences, wording, or any text the student could paste into their essay.
 
    Return ONLY JSON:
    { 
        "harsh_feedback": "string (single paragraph focusing on the 3 weakest lines and red flags)",
        "honest_feedback": "string (single paragraph with realistic Pros/Cons)"
    }`;

	const userPrompt = `${profileContext}\nContent (may contain multiple essays separated by delimiters):\n${content}`;

	try {
		// Helper to call Claude with fallback
		async function callClaudeWithFallback(prompt: string) {
			const models = ['claude-sonnet-4-6', 'claude-haiku-4-5'];
			let lastError;

			for (const model of models) {
				try {
					console.log(`[Essay Grader] Attempting Claude model: ${model}`);
					const res = await fetch('https://api.anthropic.com/v1/messages', {
						method: 'POST',
						headers: {
							'x-api-key': env.CLAUDE_API_KEY || '',
							'anthropic-version': '2023-06-01',
							'content-type': 'application/json'
						},
						body: JSON.stringify({
							model,
							max_tokens: 4096,
							system: claudeSystemPrompt,
							messages: [{ role: 'user', content: prompt }]
						})
					});

					if (!res.ok) {
						const errText = await res.text();
						console.warn(`[Essay Grader] Model ${model} failed (${res.status}): ${errText}`);
						lastError = new Error(`Claude API Error (${model}): ${res.status} - ${errText}`);
						continue; // Try next model
					}

					return res;
				} catch (e) {
					console.error(`[Essay Grader] Network error for ${model}`, e);
					lastError = e;
				}
			}
			throw lastError || new Error('All Claude models failed');
		}

		// Parallel execution: Claude (with fallback) and DeepSeek
		const promises: Promise<Response | null>[] = [callClaudeWithFallback(userPrompt)];

		// Add DeepSeek promise only if key exists
		if (env.DEEPSEEK_API_KEY) {
			promises.push(
				fetch('https://api.deepseek.com/chat/completions', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						model: 'deepseek-chat',
						messages: [
							{ role: 'system', content: deepSeekSystemPrompt },
							{ role: 'user', content: userPrompt }
						],
						response_format: { type: 'json_object' }
					})
				}).catch((e) => {
					console.error('[Essay Grader] DeepSeek Network Error', e);
					return null;
				})
			);
		} else {
			console.log('[Essay Grader] Skipping DeepSeek (No API Key)');
			promises.push(Promise.resolve(null));
		}

		const [claudeRes, deepSeekRes] = await Promise.all(promises);

		// Claude is mandatory
		if (!claudeRes) throw new Error('Claude Response is null'); // Should be caught by the .then throw above

		const claudeData = await claudeRes.json();
		const claudeText = claudeData.content?.[0]?.text || '';

		console.log('[Essay Grader] Claude Raw Response:', claudeText.substring(0, 200) + '...');

		// DeepSeek is optional
		let deepSeekFeedback = '';
		if (deepSeekRes && deepSeekRes.ok) {
			try {
				const deepSeekData = await deepSeekRes.json();
				const dsContent = deepSeekData.choices?.[0]?.message?.content;
				if (dsContent) {
					const dsJson = JSON.parse(dsContent);
					deepSeekFeedback = dsJson.harsh_feedback;
				}
			} catch (e) {
				console.error('[Essay Grader] DeepSeek Parse Error', e);
			}
		} else if (deepSeekRes) {
			const errText = await deepSeekRes.text();
			console.warn('[Essay Grader] DeepSeek API Error:', deepSeekRes.status, errText);
		}

		// Parse Claude JSON safely
		let parsedContent: AIResponsePayload;
		try {
			// Find JSON object start/end
			// Updated regex to handle potentially nested braces slightly better or just capture specifically the main object
			// Also, we'll try to fallback if the regex fails to match a full object.
			const jsonMatch = claudeText.match(/\{[\s\S]*\}/);
			const jsonStr = jsonMatch ? jsonMatch[0] : claudeText;
			parsedContent = JSON.parse(jsonStr) as AIResponsePayload;
		} catch (e) {
			console.error('[Essay Grader] Claude JSON Parse Failed:', e);
			console.error('[Essay Grader] Raw Text:', claudeText);

			// ATTEMPT REPAIR: Sometimes it outputs text before the JSON or markdown blocks.
			// Try to find the FIRST "{" and LAST "}"
			try {
				const firstBrace = claudeText.indexOf('{');
				const lastBrace = claudeText.lastIndexOf('}');
				if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
					const extracted = claudeText.substring(firstBrace, lastBrace + 1);
					parsedContent = JSON.parse(extracted) as AIResponsePayload;
				} else {
					throw e; // Original Error
				}
			} catch (retryErr) {
				return json(
					{
						error: 'Failed to parse AI grading response.',
						details:
							'AI response was not valid JSON. Please try again or simplify your essay format.',
						raw: claudeText.substring(0, 500) // Send snippet for client debug if needed
					},
					{ status: 500 }
				);
			}
		}

		// Merge DeepSeek feedback
		if (parsedContent.essays && parsedContent.essays.length > 0) {
			parsedContent.essays[0].harsh_feedback = deepSeekFeedback;
		}

		return json(parsedContent);
	} catch (e: any) {
		console.error('[Essay Grader] Critical Error', e);
		return json({ error: e.message || 'Internal Server Error' }, { status: 500 });
	}
};
