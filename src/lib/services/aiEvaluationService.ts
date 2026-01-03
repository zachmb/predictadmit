
import { get } from 'svelte/store';
import { aiResults } from '$lib/stores/results';
import { userProfile } from '$lib/stores/user';
import { SCHOOLS as EVAL_SCHOOLS } from '$lib/config/aiSchools';

export const aiEvaluationService = {
    async startEvaluation(payload: {
        essay: string;
        activities: string;
        honors: string;
        transcript: string;
        major: string;
        supplementals: string;
        edSlug: string;
        googleEmail: string;
        googleName: string;
    }) {
        if (get(aiResults).isEvaluating) return; // Prevent double submit

        // 1. Reset state
        aiResults.startEvaluation();

        // 2. Loop
        for (const { slug } of EVAL_SCHOOLS) {
            try {
                const res = await fetch(`/api/ai-evaluate/${slug}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error(`Error evaluating ${slug}:`, data?.error);
                    continue;
                }

                // 3. Add to store
                aiResults.addDecision(data.decision, {
                    major: payload.major,
                    applicantSummary: data.applicantSummary
                });
            } catch (err) {
                console.error(`Network error for ${slug}`, err);
            }
        }

        // 4. Finish
        aiResults.finishEvaluation();

        // 5. Update User Profile Request Count
        const currentProfile = get(userProfile);

        // Persist hasUsedFreeSimulation locally as well
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('predictadmit_hasUsedFreeSimulation', 'true');
        }

        userProfile.update((u) => {
            const newProfile = { ...u.applicationProfile };
            if (!newProfile.essays && payload.essay) newProfile.essays = payload.essay;
            if (!newProfile.activities && payload.activities) newProfile.activities = payload.activities;
            if (!newProfile.awards && payload.honors) newProfile.awards = payload.honors;
            if (!newProfile.rigor && payload.transcript) newProfile.rigor = payload.transcript;

            return {
                ...u,
                requestCount: (u.requestCount || 0) + 1,
                applicationProfile: newProfile
            };
        });
    },

    async requestDeepDive(
        decision: {
            school: string;
            slug: string;
            outcome: string;
            academic_score: number;
            academic_explanation: string;
            extracurricular_score: number;
            extracurricular_explanation: string;
            fit_score: number;
            fit_explanation: string;
            intellectual_score: number;
            intellectual_explanation: string;
            character_score: number;
            character_explanation: string;
            improvement_tips: string;
        },
        applicantSummary: string,
        edSlug: string
    ) {
        const res = await fetch('/api/ai-deep-dive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                school: decision.school,
                slug: decision.slug,
                outcome: decision.outcome,
                academic_score: decision.academic_score,
                academic_explanation: decision.academic_explanation,
                extracurricular_score: decision.extracurricular_score,
                extracurricular_explanation: decision.extracurricular_explanation,
                fit_score: decision.fit_score,
                fit_explanation: decision.fit_explanation,
                intellectual_score: decision.intellectual_score,
                intellectual_explanation: decision.intellectual_explanation,
                character_score: decision.character_score,
                character_explanation: decision.character_explanation,
                improvement_tips: decision.improvement_tips,
                applicantSummary,
                edSlug
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data?.error ?? 'Something went wrong generating the deep dive.');
        }

        return data.deepDive;
    }
};
