import { writable, derived } from 'svelte/store';
<<<<<<< HEAD
import { browser } from '$app/environment'; 
=======
import { browser } from '$app/environment';
>>>>>>> cc39bb1ad6d8333d6608035c04e03bd6534a8301

export type DecisionOutcome = 'admit' | 'deny' | 'waitlist' | 'defer';

export type AiDecision = {
  school: string;
  slug: string;
  outcome: DecisionOutcome;
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
  improvement_tips: string; // NEW
};


export type AiResultsPayload = {
  decisions: AiDecision[];
  raw?: any;
  applicantSummary?: string;
  isEvaluating: boolean;
  progress: number; // 0 to 100
};

const AI_PERSIST_KEY = 'predictadmit_ai_results_v2';

function createResultsStore() {
<<<<<<< HEAD
  // 1. Initial Data: Check localStorage if in the browser
  const stored = browser ? localStorage.getItem('ai_results_cache') : null;
  const initialValue: AiResultsPayload = stored 
    ? JSON.parse(stored) 
    : { decisions: [], raw: null };

  const { subscribe, set, update } = writable<AiResultsPayload>(initialValue);

  // 2. Auto-Sync: Save to localStorage whenever the store changes
  if (browser) {
    subscribe((value) => {
      localStorage.setItem('ai_results_cache', JSON.stringify(value));
    });
  }

  return {
    subscribe,
    addDecision: (decision: AiDecision, rawPayload?: any) => {
      update((prev) => ({
        ...prev,
        decisions: [...prev.decisions, decision],
        raw: rawPayload ?? prev.raw
      }));
=======
  // Try to load from localStorage
  let initial: AiResultsPayload = {
    decisions: [],
    raw: null,
    applicantSummary: '',
    isEvaluating: false,
    progress: 0
  };



  if (browser && typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(AI_PERSIST_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Only restore data, not ephemeral state like isEvaluating
        initial = {
          ...initial,
          ...parsed,
          isEvaluating: false,
          progress: parsed.decisions?.length ? 100 : 0
        };
      } catch (e) {
        console.error('Failed to parse stored AI results', e);
      }
    }
  }

  const { subscribe, set, update } = writable<AiResultsPayload>(initial);

  return {
    subscribe,

    startEvaluation: () => {
      update(s => ({ ...s, isEvaluating: true, progress: 0, decisions: [], applicantSummary: '' }));
>>>>>>> cc39bb1ad6d8333d6608035c04e03bd6534a8301
    },

    addDecision: (decision: AiDecision, rawPayload?: any) => {
      update((prev) => {
        const nextDecisions = [...prev.decisions, decision];
        // simple progress estimation based on decision count (assuming ~20 schools)
        // You might want to pass in the total count to be more accurate
        const nextProgress = Math.min(95, Math.floor((nextDecisions.length / 20) * 100));

        const nextState = {
          ...prev,
          decisions: nextDecisions,
          raw: rawPayload ?? prev.raw,
          applicantSummary: rawPayload?.applicantSummary ?? prev.applicantSummary,
          progress: nextProgress
        };

        if (browser && typeof localStorage !== 'undefined') {
          // Don't save isEvaluating to disk usually, but we save data
          localStorage.setItem(AI_PERSIST_KEY, JSON.stringify({
            decisions: nextState.decisions,
            raw: nextState.raw,
            applicantSummary: nextState.applicantSummary
          }));
        }
        return nextState;
      });
    },

    finishEvaluation: () => {
      update(s => ({ ...s, isEvaluating: false, progress: 100 }));
    },

    setFromApi: (payload: any) => {
      const nextState = {
        decisions: payload.decisions ?? [],
        raw: payload,
        applicantSummary: payload.applicantSummary ?? '',
        isEvaluating: false,
        progress: 100
      };
      set(nextState);
      if (browser && typeof localStorage !== 'undefined') {
        localStorage.setItem(AI_PERSIST_KEY, JSON.stringify({
          decisions: nextState.decisions,
          raw: nextState.raw,
          applicantSummary: nextState.applicantSummary
        }));
      }
    },

    setDecisions: (decisions: AiDecision[]) =>
      update((prev) => ({ ...prev, decisions })),
<<<<<<< HEAD
    clear: () => {
      set({ decisions: [], raw: null });
      if (browser) localStorage.removeItem('ai_results_cache');
=======

    clear: () => {
      set({ decisions: [], raw: null, applicantSummary: '', isEvaluating: false, progress: 0 });
      if (browser && typeof localStorage !== 'undefined') {
        localStorage.removeItem(AI_PERSIST_KEY);
      }
>>>>>>> cc39bb1ad6d8333d6608035c04e03bd6534a8301
    }
  };
}

export const aiResults = createResultsStore();
export type OverrideMode = 'random' | 'accepted' | 'denied';
export const manualOverrideMode = writable<OverrideMode>('random');

// --- DERIVED LOOKUP MAPS ---

export const decisionsBySlug = derived(aiResults, ($results) => {
  const map: Record<string, DecisionOutcome> = {};
  for (const d of $results.decisions) { if (d.slug) map[d.slug] = d.outcome; }
  return map;
});

export const academicScoresBySlug = derived(aiResults, ($results) => {
  const map: Record<string, number> = {};
  for (const d of $results.decisions) { if (d.slug) map[d.slug] = d.academic_score; }
  return map;
});

export const academicExplanationsBySlug = derived(aiResults, ($results) => {
  const map: Record<string, string> = {};
  for (const d of $results.decisions) { if (d.slug) map[d.slug] = d.academic_explanation; }
  return map;
});

export const extracurricularScoresBySlug = derived(aiResults, ($results) => {
  const map: Record<string, number> = {};
  for (const d of $results.decisions) { if (d.slug) map[d.slug] = d.extracurricular_score; }
  return map;
});

export const extracurricularExplanationsBySlug = derived(aiResults, ($results) => {
  const map: Record<string, string> = {};
  for (const d of $results.decisions) { if (d.slug) map[d.slug] = d.extracurricular_explanation; }
  return map;
});

export const fitScoresBySlug = derived(aiResults, ($results) => {
  const map: Record<string, number> = {};
  for (const d of $results.decisions) { if (d.slug) map[d.slug] = d.fit_score; }
  return map;
});

export const fitExplanationsBySlug = derived(aiResults, ($results) => {
  const map: Record<string, string> = {};
  for (const d of $results.decisions) { if (d.slug) map[d.slug] = d.fit_explanation; }
  return map;
});

export const intellectualScoresBySlug = derived(aiResults, ($results) => {
  const map: Record<string, number> = {};
  for (const d of $results.decisions) { if (d.slug) map[d.slug] = d.intellectual_score; }
  return map;
});

export const intellectualExplanationsBySlug = derived(aiResults, ($results) => {
  const map: Record<string, string> = {};
  for (const d of $results.decisions) { if (d.slug) map[d.slug] = d.intellectual_explanation; }
  return map;
});

export const characterScoresBySlug = derived(aiResults, ($results) => {
  const map: Record<string, number> = {};
  for (const d of $results.decisions) { if (d.slug) map[d.slug] = d.character_score; }
  return map;
});

export const characterExplanationsBySlug = derived(aiResults, ($results) => {
  const map: Record<string, string> = {};
  for (const d of $results.decisions) { if (d.slug) map[d.slug] = d.character_explanation; }
  return map;
});

// NEW: Improvement Tips Map
export const improvementTipsBySlug = derived(aiResults, ($results) => {
  const map: Record<string, string> = {};
  for (const d of $results.decisions) { if (d.slug) map[d.slug] = d.improvement_tips; }
  return map;
});

// --- HELPER METHODS ---

export function resolveOutcomeForSlug(slug: string, map: Record<string, DecisionOutcome>, fallback: DecisionOutcome): DecisionOutcome {
  return map[slug] ?? fallback;
}

export function resolveAcademicScoreForSlug(slug: string, map: Record<string, number>, fallback: number = 0): number {
  return map[slug] ?? fallback;
}

export function resolveAcademicExplanationForSlug(slug: string, map: Record<string, string>, fallback: string = ''): string {
  return map[slug] ?? fallback;
}

export function resolveExtracurricularScoreForSlug(slug: string, map: Record<string, number>, fallback: number = 0): number {
  return map[slug] ?? fallback;
}

export function resolveExtracurricularExplanationForSlug(slug: string, map: Record<string, string>, fallback: string = ''): string {
  return map[slug] ?? fallback;
}

export function resolveFitScoreForSlug(slug: string, map: Record<string, number>, fallback: number = 0): number {
  return map[slug] ?? fallback;
}

export function resolveFitExplanationForSlug(slug: string, map: Record<string, string>, fallback: string = ''): string {
  return map[slug] ?? fallback;
}

export function resolveIntellectualScoreForSlug(slug: string, map: Record<string, number>, fallback: number = 0): number {
  return map[slug] ?? fallback;
}

export function resolveIntellectualExplanationForSlug(slug: string, map: Record<string, string>, fallback: string = ''): string {
  return map[slug] ?? fallback;
}

export function resolveCharacterScoreForSlug(slug: string, map: Record<string, number>, fallback: number = 0): number {
  return map[slug] ?? fallback;
}

export function resolveCharacterExplanationForSlug(slug: string, map: Record<string, string>, fallback: string = ''): string {
  return map[slug] ?? fallback;
}

// NEW: Resolve Method for Tips
export function resolveImprovementTipsForSlug(slug: string, map: Record<string, string>, fallback: string = ''): string {
  return map[slug] ?? fallback;
}