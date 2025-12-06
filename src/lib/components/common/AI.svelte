<!-- src/lib/components/IvyEssaysHero.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';

  const dispatch = createEventDispatcher();

  const handleGetStarted = () => {
    // keep old behavior for parent listeners
    dispatch('getStarted');
    // navigate to the AI landing page
    goto('/ai');
  };
</script>

<section class="bg-slate-900 text-slate-50 rounded-sm shadow-md border border-slate-900 flex flex-col justify-between relative overflow-hidden">
  <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-900/0 via-slate-900/40 to-slate-900/70"></div>

  <div class="relative px-5 pt-5 pb-4">
    <p class="text-[11px] font-semibold tracking-[0.2em] uppercase text-slate-300 mb-2">
      Ivy League essays
    </p>

    <h2 class="text-2xl md:text-3xl font-bold leading-tight">
      Standout essays in
      <span class="underline decoration-sky-400 decoration-2 underline-offset-4">
        5 minutes
      </span>
    </h2>

    <p class="mt-3 text-[12px] md:text-sm text-slate-100 max-w-sm">
      Turn your stats, activities, and school list into clear, targeted essay angles. No generic AI
      sludge, no copy-paste prompts.
    </p>

    <div class="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
      <button
        type="button"
        class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-sm border border-sky-500 bg-sky-400 text-slate-900 hover:bg-sky-300 hover:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
        on:click={handleGetStarted}
      >
        Get started, it’s free
      </button>
      <p class="text-[11px] text-slate-300 max-w-xs">
        No credit card. No email spam. Just a cleaner strategy for what each essay should actually do.
      </p>
    </div>
  </div>

  <div class="relative border-t border-slate-800 bg-slate-950/60 px-5 py-3 text-[11px] text-slate-300">
    <span class="font-semibold">PredictAdmit AI</span>
    <span class="mx-1 text-slate-500">•</span>
    Simulate the emails. Stress-test the essays. Walk into decision day prepared.
  </div>
</section>
