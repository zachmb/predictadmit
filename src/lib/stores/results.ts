// src/lib/stores/results.ts
import { writable, derived } from 'svelte/store';

export type DecisionOutcome = 'admit' | 'deny' | 'waitlist' | 'defer';

export type AiDecision = {
  school: string;
  slug: string;
  outcome: DecisionOutcome;
  short_reason?: string;
};

export type AiResultsPayload = {
  decisions: AiDecision[];
  // You can store extra stuff (deep dive, raw JSON, etc.) if you want.
  raw?: unknown;
};

function createResultsStore() {
  const { subscribe, set, update } = writable<AiResultsPayload>({
    decisions: [],
    raw: null
  });

  return {
    subscribe,

    /**
     * Use this when you get the JSON back from the AI endpoint.
     * It expects an object with a `decisions` array.
     */
    setFromApi: (payload: unknown) => {
      const anyPayload = payload as { decisions?: AiDecision[] };
      set({
        decisions: anyPayload.decisions ?? [],
        raw: payload
      });
    },

    /**
     * Manually replace just the decisions array.
     */
    setDecisions: (decisions: AiDecision[]) =>
      update((prev) => ({ ...prev, decisions })),

    /**
     * Reset everything (e.g. new simulation).
     */
    clear: () =>
      set({
        decisions: [],
        raw: null
      })
  };
}

export const aiResults = createResultsStore();

/**
 * Derived store: map slug -> outcome for quick lookup in portals.
 */
export const decisionsBySlug = derived(aiResults, ($results) => {
  const map: Record<string, DecisionOutcome> = {};
  for (const d of $results.decisions) {
    if (d.slug) {
      map[d.slug] = d.outcome;
    }
  }
  return map;
});

/**
 * Helper you can use in components if you want a small utility.
 */
export function resolveOutcomeForSlug(
  slug: string,
  decisionsMap: Record<string, DecisionOutcome>,
  fallback: DecisionOutcome
): DecisionOutcome {
  return decisionsMap[slug] ?? fallback;
}
