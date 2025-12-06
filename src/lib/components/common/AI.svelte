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
        <span class="text-[10px] font-semibold uppercase tracking-[0.26em] text-sky-100">
          PredictAdmit Pro
        </span>
      </div>
      <span class="hidden text-[10px] text-slate-400 md:inline">
        Premium AI narrative engine
      </span>
    </div>

    <!-- main headline -->
    <div class="space-y-3">
      <h2 class="text-2xl md:text-3xl font-semibold leading-snug tracking-tight space-y-1">
        <span class="block text-slate-100">
          <span class="underline decoration-sky-400/80 decoration-2 underline-offset-[6px]">
            AI-powered platform
          </span>
        </span>

        <span class="mt-1 flex items-center justify-center gap-2 text-slate-300 md:justify-start">
          <span>for standout college applications</span>
          <span
            class="inline-flex items-center rounded-full border border-sky-400/60 bg-sky-400/10 px-2 py-0.5 text-[10px] font-medium text-sky-100 uppercase tracking-[0.18em]"
          >
            Start Free
          </span>
        </span>
      </h2>

      <!-- 1-line explainer -->
      <p class="max-w-md text-[12px] md:text-sm text-slate-200/90">
        Simulate your predicted decisions hitting your inbox and get the help you need to turn every one of them into 'congratulations'.
      </p>
    </div>

    <!-- quick value pills -->
    <div class="flex flex-wrap gap-2 text-[11px] md:text-xs">
      <span
        class="inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-900/40 px-2.5 py-1"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        Narrative alignment
      </span>
      <span
        class="inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-900/40 px-2.5 py-1"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
        Activity framing
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
        Get AI help, free
      </button>

      <p class="max-w-xs text-[11px] text-slate-300">
        Run the static decision sim for free. Upgrade to Pro to stress-test the actual narrative
        sitting in your file.
      </p>
    </div>
  </div>

  <div
    class="relative border-t border-slate-800/80 bg-slate-950/80 px-5 py-3 text-[11px] text-slate-300 flex flex-wrap items-center gap-2"
  >
    <span class="font-semibold">PredictAdmit Pro</span>
    <span class="text-slate-500">•</span>
    <span>Premium narrative, activity, and school-list analysis layered on top of the sim.</span>
  </div>
</section>
