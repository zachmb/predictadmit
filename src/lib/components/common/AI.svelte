<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';

  const dispatch = createEventDispatcher();

  const handleGetStarted = () => {
    dispatch('getStarted');
    goto('/ai');
  };
</script>

<section
  class="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 shadow-[0_18px_45px_rgba(15,23,42,0.9)]"
>
  <!-- glow / grid overlay -->
  <div class="pointer-events-none absolute inset-0">
    <div class="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl"></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25)_0,_transparent_55%)]"
    ></div>
  </div>

  <div class="relative px-5 pt-5 pb-4 md:px-6 md:pt-6 md:pb-5 space-y-4">
    <!-- label row -->
    <div class="flex items-center justify-between gap-3">
      <div
        class="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse"></span>
        <span class="text-[11px] font-medium uppercase tracking-[0.22em] text-sky-100">
          Ivy &amp; T20 app lab
        </span>
      </div>
      <span class="hidden text-[10px] text-slate-400 md:inline">
        Built for serious applicants
      </span>
    </div>

    <!-- main headline -->
    <div class="space-y-3">
      <h2 class="text-2xl md:text-3xl font-semibold leading-snug tracking-tight space-y-1">
        <span class="block text-slate-100">
          <span class="underline decoration-sky-400/80 decoration-2 underline-offset-[6px]">
            Stress-test your application
          </span>
        </span>

        <span
          class="mt-1 flex items-center justify-center gap-2 text-slate-300 md:justify-start"
        >
          <span>and refine it in</span>
          <span
            class="inline-flex items-center justify-center rounded-full border border-sky-400/60 bg-sky-400/10 px-3 py-1"
          >
            <span
              class="font-mono text-lg md:text-xl font-semibold text-sky-200 underline decoration-sky-400/70 decoration-2 underline-offset-4"
            >
              5 min
            </span>
          </span>
        </span>
      </h2>

      <!-- 1-line explainer -->
      <p class="max-w-md text-[12px] md:text-sm text-slate-200/90">
        Quick pass on essays, activities, and school list—before AOs ever see them.
      </p>
    </div>

    <!-- quick value pills -->
    <div class="flex flex-wrap gap-2 text-[11px] md:text-xs">
      <span
        class="inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-900/40 px-2.5 py-1"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        Essay angles
      </span>
      <span
        class="inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-900/40 px-2.5 py-1"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
        Activity polish
      </span>
      <span
        class="inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-900/40 px-2.5 py-1"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-violet-400"></span>
        School list check
      </span>
    </div>

    <!-- CTA row -->
    <div class="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center">
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-400/80 bg-sky-400 text-slate-950 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-sky-500/30 transition hover:-translate-y-[1px] hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:ring-offset-2 focus:ring-offset-slate-900"
        on:click={handleGetStarted}
      >
        Get started, it’s free
        <span class="text-xs font-normal text-slate-900/70">~5 min flow</span>
      </button>

      <p class="max-w-xs text-[11px] text-slate-300">
        You stay in control. We just surface where the app feels soft.
      </p>
    </div>
  </div>

  <div
    class="relative border-t border-slate-800/80 bg-slate-950/80 px-5 py-3 text-[11px] text-slate-300 flex flex-wrap items-center gap-2"
  >
    <span class="font-semibold">PredictAdmit AI</span>
    <span class="text-slate-500">•</span>
    <span>Stress-test your essays and app before decision day.</span>
  </div>
</section>
