<script lang="ts">
  import { onMount } from 'svelte';
  import AIHeader from '$lib/components/layout/AIHeader.svelte';
  import AIFooter from '$lib/components/layout/AIFooter.svelte';

  type DecisionOutcome = 'admit' | 'deny' | 'waitlist' | 'defer';

  type AiDecision = {
    school: string;
    slug: string;
    outcome: DecisionOutcome;
    short_reason: string;
  };

  type DeepDiveItem = {
    school: string;
    slug: string;
    outcome: DecisionOutcome;
    explanation: string;
  };

  // Application inputs (can be typed or filled via OCR)
  let essay = '';
  let activities = '';
  let honors = '';
  let transcript = '';

  // OCR state
  let ocrUploading = false;
  let ocrError = '';
  let ocrText = '';

  // Free-tier limits (persisted per browser)
  let hasUsedFreeSimulation = false; // one full HYPSM+ run
  let hasUsedFreePdfOcr = false; // one Common App PDF upload

  // Paywall modal state
  let showPaywallModal = false;
  let paywallMode: 'simulation' | 'ocr' | 'deepDive' | null = null;
  let paywallContextDecision: AiDecision | null = null;

  // In a real app this would come from your backend / Stripe webhook
  const hasDeepDiveAccess = false;

  // Google sign-in (simulated for now)
  let googleSignedIn = false;
  let googleEmail = '';
  let googleName = '';

  // ED selection
  const ED_SCHOOLS = [
    { slug: 'harvard', label: 'Harvard (REA)' },
    { slug: 'stanford', label: 'Stanford (REA)' },
    { slug: 'yale', label: 'Yale (SCEA)' },
    { slug: 'princeton', label: 'Princeton (SCEA)' },
    { slug: 'duke', label: 'Duke (ED)' },
    { slug: 'u-penn', label: 'Penn (ED)' },
    { slug: 'brown', label: 'Brown (ED)' },
    { slug: 'northwestern', label: 'Northwestern (ED)' },
    { slug: 'dartmouth', label: 'Dartmouth (ED)' },
    { slug: 'vanderbilt', label: 'Vanderbilt (ED I/II)' }
  ];

  let edSlug: string = '';

  let isSubmitting = false;
  let aiError = '';
  let aiDecisions: AiDecision[] = [];
  let selectedDecision: AiDecision | null = null;

  let activeFolder: 'inbox' | 'deepDive' = 'inbox';
  let viewMode: 'list' | 'detail' = 'list';

  let deepDiveItems: DeepDiveItem[] = [];
  let deepDiveLoadingSlug: string | null = null;

  // Summary of all materials returned from the evaluate endpoint.
  let applicantSummary = '';

  // Restore free-tier usage from localStorage
  onMount(() => {
    if (typeof localStorage !== 'undefined') {
      hasUsedFreeSimulation =
        localStorage.getItem('predictadmit_hasUsedFreeSimulation') === 'true';
      hasUsedFreePdfOcr =
        localStorage.getItem('predictadmit_hasUsedFreePdfOcr') === 'true';
    }
  });

  function outcomeLabel(outcome: DecisionOutcome): string {
    if (outcome === 'admit') return 'Admitted';
    if (outcome === 'deny') return 'Denied';
    if (outcome === 'waitlist') return 'Waitlisted';
    return 'Deferred';
  }

  function outcomeClasses(outcome: DecisionOutcome): string {
    if (outcome === 'admit') {
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/70';
    }
    if (outcome === 'deny') {
      return 'bg-rose-500/10 text-rose-300 border-rose-400/70';
    }
    if (outcome === 'waitlist') {
      return 'bg-amber-500/15 text-amber-300 border-amber-400/70';
    }
    return 'bg-sky-500/15 text-sky-300 border-sky-400/70';
  }

  function isEDDecision(decision: AiDecision): boolean {
    return !!edSlug && decision.slug === edSlug;
  }

  function resetInboxState() {
    aiDecisions = [];
    selectedDecision = null;
    deepDiveItems = [];
    applicantSummary = '';
    viewMode = 'list';
    activeFolder = 'inbox';
  }

  function simulateGoogleSignIn() {
    googleSignedIn = true;
    googleEmail = 'you@predictadmit.ai';
    googleName = 'PredictAdmit User';
  }

  function ensureHasSomeInput(): boolean {
    return (
      !!essay.trim() ||
      !!activities.trim() ||
      !!honors.trim() ||
      !!transcript.trim()
    );
  }

  function openPaywall(mode: 'simulation' | 'ocr' | 'deepDive', decision?: AiDecision) {
    paywallMode = mode;
    paywallContextDecision = decision ?? null;
    showPaywallModal = true;
  }

  function closePaywall() {
    showPaywallModal = false;
    paywallMode = null;
    paywallContextDecision = null;
  }

  async function runEvaluation() {
    aiError = '';

    if (!googleSignedIn) {
      aiError = 'Please sign in with Google first to create your AI application.';
      return;
    }

    if (!ensureHasSomeInput()) {
      aiError =
        'Add at least one piece of application data (essay, activities, honors, or transcript text) before applying to the AI simulator.';
      return;
    }

    // 🔒 Free tier: one full HYPSM+ simulation per browser
    if (hasUsedFreeSimulation) {
      openPaywall('simulation');
      return;
    }

    isSubmitting = true;
    selectedDecision = null;
    viewMode = 'list';
    activeFolder = 'inbox';
    deepDiveItems = [];

    try {
      const payload: Record<string, unknown> = {
        essay,
        activities,
        honors,
        transcript,
        edSlug,
        googleEmail,
        googleName
      };

      const res = await fetch('/api/ai-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        aiError = data?.error ?? 'Something went wrong talking to the AI evaluator.';
        return;
      }

      aiDecisions = (data.decisions ?? []) as AiDecision[];
      applicantSummary = (data.applicantSummary ?? '') as string;

      if (!aiDecisions.length) {
        aiError =
          'The AI did not return any decisions. Try adding more detail to your application and apply again.';
      } else {
        // Mark free simulation as used after a successful run
        hasUsedFreeSimulation = true;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('predictadmit_hasUsedFreeSimulation', 'true');
        }
      }
    } catch (err) {
      console.error(err);
      aiError = 'Network or server error while calling the AI evaluator.';
    } finally {
      isSubmitting = false;
    }
  }

  function openDecision(decision: AiDecision) {
    selectedDecision = decision;
    viewMode = 'detail';
    activeFolder = 'inbox';
  }

  function backToList() {
    viewMode = 'list';
    selectedDecision = null;
  }

  function openDeepDiveFolder() {
    activeFolder = 'deepDive';
    viewMode = 'list';
    selectedDecision = null;
  }

  // 🔒 Deep Dive is fully paywalled – no API call until they upgrade
  async function requestDeepDive(decision: AiDecision) {
    if (!hasDeepDiveAccess) {
      openPaywall('deepDive', decision);
      return;
    }

    if (!applicantSummary) {
      applicantSummary = [
        essay && `Personal essay:\n${essay}`,
        activities && `Activities / extracurriculars:\n${activities}`,
        honors && `Honors & awards:\n${honors}`,
        transcript && `Transcript / GPA & coursework:\n${transcript}`
      ]
        .filter(Boolean)
        .join('\n\n');
    }

    aiError = '';
    deepDiveLoadingSlug = decision.slug;

    try {
      const res = await fetch('/api/ai-deep-dive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school: decision.school,
          slug: decision.slug,
          outcome: decision.outcome,
          short_reason: decision.short_reason,
          applicantSummary,
          edSlug
        })
      });

      const data = await res.json();

      if (!res.ok) {
        aiError = data?.error ?? 'Something went wrong generating the deep dive.';
        return;
      }

      const deepDive = data.deepDive as DeepDiveItem | undefined;

      if (deepDive) {
        deepDiveItems = [
          ...deepDiveItems.filter((d) => d.slug !== deepDive.slug),
          deepDive
        ];
        activeFolder = 'deepDive';
        viewMode = 'list';
        selectedDecision = null;
      }
    } catch (err) {
      console.error(err);
      aiError = 'Network or server error while calling the AI deep dive.';
    } finally {
      deepDiveLoadingSlug = null;
    }
  }

  // === OCR handler ===
  async function handleOcrChange(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    const file = target.files?.[0];

    ocrError = '';
    ocrText = '';

    if (!file) return;

    // 🔒 Free tier: one Common App PDF OCR per browser
    if (hasUsedFreePdfOcr) {
      openPaywall('ocr');
      // reset file input so they can pick again later if they upgrade
      target.value = '';
      return;
    }

    // Guard: only PDFs
    if (file.type !== 'application/pdf') {
      ocrError = 'Please upload a PDF file.';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    ocrUploading = true;

    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('OCR error:', text);
        ocrError = 'OCR failed on this file. Try another PDF or copy–paste manually.';
        return;
      }

      const data = (await res.json()) as { text?: string };
      ocrText = (data.text ?? '').trim();

      if (!ocrText) {
        ocrError = 'OCR completed but returned no text. The PDF might be image-only or locked.';
      } else {
        // Mark free OCR as used after a successful extraction
        hasUsedFreePdfOcr = true;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('predictadmit_hasUsedFreePdfOcr', 'true');
        }
      }
    } catch (err) {
      console.error(err);
      ocrError = 'Network error while calling OCR. Please try again.';
    } finally {
      ocrUploading = false;
    }
  }

  function applyOcrToEssay() {
    if (!ocrText) return;
    essay = ocrText;
  }
</script>

<svelte:head>
  <title>PredictAdmit – AI Admissions Inbox</title>
</svelte:head>

<AIHeader />

<main class="min-h-screen bg-slate-950 text-slate-50">
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <!-- Hero -->
    <header class="space-y-3">
      <div class="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">
        <span class="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true"></span>
        <span>AI LAB · PREMIUM SIMULATION</span>
      </div>

      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
            PredictAdmit <span class="text-cyan-300">/AI</span>
          </h1>
          <p class="mt-1 max-w-2xl text-sm text-slate-300">
            Connect with Google, upload or paste your Common App materials, choose an ED
            school, and click <span class="font-semibold text-cyan-300">Apply</span>. The model
            simulates your decisions for the same HYPSM+ list as admitMail, then delivers them into a
            dark-mode inbox with adcom-style explanations.
          </p>
          <p class="mt-2 max-w-2xl text-[11px] text-slate-400">
            If your materials live in a PDF, you can either
            <span class="font-semibold text-cyan-300"> copy–paste the text</span> into the boxes below
            or upload the Common App PDF to our <span class="font-semibold text-slate-100">OCR beta</span>,
            which will extract the text and drop it into your essay box.
          </p>
          <p class="mt-2 max-w-2xl text-[11px] text-slate-400">
            This is a training ground, not a crystal ball. Use it the way you’d use UWorld: iterate on
            your “answers” (your profile), see how the results change, and learn from detailed
            breakdowns—not just one-word verdicts.
          </p>
        </div>
        <p class="mt-2 text-[11px] text-slate-400 max-w-xs md:text-right">
          Your inputs are sent only to the AI API for evaluation. PredictAdmit
          does <span class="font-semibold text-slate-200">not</span> store, reuse, or sell your data.
          Nothing is ever sent to real universities.
        </p>
      </div>
    </header>

    <!-- Application builder + AI controls -->
    <section class="space-y-6">
      <!-- Application card -->
      <div
        class="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-[0_0_40px_rgba(34,211,238,0.25)]"
      >
        <!-- Google sign-in bar -->
        <div class="border-b border-cyan-500/20 px-5 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="space-y-1">
            <h2 class="text-sm font-semibold text-cyan-200 uppercase tracking-[0.22em]">
              Step 1 · Sign in with Google
            </h2>
            <p class="text-xs text-slate-300 max-w-md">
              We simulate a Google-based applicant login. In production, this can be wired to real
              OAuth—but here, it’s just a gate before your AI application is created.
            </p>
          </div>

          <div class="flex items-center gap-3">
            {#if googleSignedIn}
              <div class="text-[11px] text-slate-300 text-right">
                <div class="font-semibold text-cyan-200">
                  {googleName || 'Signed in'}
                </div>
                <div class="text-slate-400">
                  {googleEmail}
                </div>
              </div>
            {:else}
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                on:click={simulateGoogleSignIn}
              >
                <span class="h-4 w-4 rounded bg-cyan-500/10 border border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                  G
                </span>
                <span>Continue with Google</span>
              </button>
            {/if}
          </div>
        </div>

        <!-- Application inputs -->
        <form
          class="px-5 py-4 space-y-5 text-sm relative"
          on:submit|preventDefault={runEvaluation}
          aria-label="AI admissions evaluation form"
        >
          {#if !googleSignedIn}
            <div class="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-[1px] z-10">
              <div class="rounded-xl border border-cyan-500/40 bg-slate-950/90 px-5 py-4 max-w-xs text-center space-y-2">
                <p class="text-xs text-cyan-200 font-semibold uppercase tracking-[0.18em]">
                  Google sign-in required
                </p>
                <p class="text-[11px] text-slate-300">
                  Click <span class="font-semibold text-cyan-300">Continue with Google</span> above to
                  unlock the AI application builder.
                </p>
              </div>
            </div>
          {/if}

          <!-- PDF info + OCR upload area -->
          <div class="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
            <div
              class="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100"
            >
              PDFs can be messy. For the cleanest results, you can still
              <span class="font-semibold">copy–paste</span> your essay, activities, and transcript text into
              the boxes below.
              <br /><br />
              Or try the <span class="font-semibold text-amber-50">Common App PDF OCR beta</span> on the
              right and send the extracted text straight into your essay box.
              {#if hasUsedFreePdfOcr}
                <span class="mt-1 block text-[10px] text-amber-200">
                  You’ve already used your free Common App PDF scan. Further uploads require unlocking
                  PredictAdmit /AI.
                </span>
              {/if}
            </div>

            <div class="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-3 space-y-2">
              <h3 class="text-[11px] font-medium text-cyan-100 uppercase tracking-[0.2em]">
                Common App PDF · OCR beta
              </h3>
              <p class="text-[10px] text-slate-400">
                Upload the PDF you downloaded from the Common App. We’ll run OCR and show the extracted
                text below. Then click
                <span class="font-semibold text-cyan-200">Use in essay</span> to copy it into the Personal
                Essay box.
              </p>

              <label class="mt-1 flex items-center justify-between gap-2 text-[11px] text-slate-200">
                <span>
                  Upload PDF
                  {#if hasUsedFreePdfOcr}
                    <span class="ml-1 text-[10px] text-amber-300">
                      · Free scan used
                    </span>
                  {/if}
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  class="block w-40 text-[10px] text-slate-200 file:mr-2 file:rounded-full file:border-none file:bg-cyan-500 file:px-3 file:py-1 file:text-[10px] file:font-semibold file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer"
                  on:change={handleOcrChange}
                />
              </label>

              {#if ocrUploading}
                <p class="mt-2 text-[10px] text-cyan-300 flex items-center gap-2">
                  <span class="h-3 w-3 animate-spin rounded-full border border-cyan-400 border-t-transparent"></span>
                  Running OCR on your PDF…
                </p>
              {/if}

              {#if ocrError}
                <p class="mt-2 text-[10px] text-rose-300 bg-rose-500/10 border border-rose-500/40 rounded px-2 py-1">
                  {ocrError}
                </p>
              {/if}

              {#if ocrText}
                <div class="mt-2 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] text-slate-400">
                      OCR preview (first few hundred words)
                    </span>
                    <button
                      type="button"
                      class="text-[10px] rounded-full border border-cyan-500/50 px-2 py-1 text-cyan-200 hover:bg-cyan-500/10"
                      on:click={applyOcrToEssay}
                    >
                      Use in essay
                    </button>
                  </div>
                  <div class="max-h-40 overflow-auto rounded border border-slate-700 bg-slate-950/70 p-2 text-[10px] text-slate-200 whitespace-pre-wrap">
                    {ocrText}
                  </div>
                </div>
              {/if}
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <!-- Essay -->
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <label
                  for="essay"
                  class="block text-[11px] font-medium text-cyan-100 uppercase tracking-[0.2em]"
                >
                  Personal Essay
                </label>
              </div>
              <textarea
                id="essay"
                bind:value={essay}
                rows="4"
                class="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 resize-y"
                placeholder="Paste your Common App-style personal statement or use the OCR beta above to auto-fill from your PDF."
              ></textarea>
            </div>

            <!-- Activities -->
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <label
                  for="activities"
                  class="block text-[11px] font-medium text-cyan-100 uppercase tracking-[0.2em]"
                >
                  Activities / Résumé
                </label>
              </div>
              <textarea
                id="activities"
                bind:value={activities}
                rows="4"
                class="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 resize-y"
                placeholder="Paste your activities list or résumé bullets here. If they’re in a PDF, copy–paste the text."
              ></textarea>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <!-- Honors -->
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <label
                  for="honors"
                  class="block text-[11px] font-medium text-cyan-100 uppercase tracking-[0.2em]"
                >
                  Honors & Awards
                </label>
              </div>
              <textarea
                id="honors"
                bind:value={honors}
                rows="3"
                class="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 resize-y"
                placeholder="List major competitions, scholarships, and distinctions. Copy–paste from your app if needed."
              ></textarea>
            </div>

            <!-- Transcript -->
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <label
                  for="transcript"
                  class="block text-[11px] font-medium text-cyan-100 uppercase tracking-[0.2em]"
                >
                  Transcript / GPA
                </label>
              </div>
              <textarea
                id="transcript"
                bind:value={transcript}
                rows="3"
                class="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 resize-y"
                placeholder="Include GPA, course rigor, key grades, testing, and any school context. Copy–paste from your transcript if needed."
              ></textarea>
            </div>
          </div>

          <!-- ED selection + privacy note -->
          <div class="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
            <div class="space-y-2">
              <label
                for="edSchool"
                class="block text-[11px] font-medium text-cyan-100 uppercase tracking-[0.2em]"
              >
                Early Decision / REA (Optional)
              </label>
              <select
                id="edSchool"
                bind:value={edSlug}
                class="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-50 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
              >
                <option value="">No ED selected (all RD)</option>
                {#each ED_SCHOOLS as school}
                  <option value={school.slug}>{school.label}</option>
                {/each}
              </select>
              <p class="text-[10px] text-slate-400">
                This tells the AI which school to treat as your binding early choice, so decisions and
                explanations can reflect ED vs RD dynamics.
              </p>
            </div>

            <div class="space-y-1 text-[10px] text-slate-500">
              <p>
                Your text inputs are packaged into a single application payload and sent directly
                from your browser to the AI API. PredictAdmit’s servers do not store your application
                materials, and nothing is forwarded to real colleges.
              </p>
            </div>
          </div>

          {#if aiError}
            <p class="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/40 rounded-lg px-3 py-2">
              {aiError}
            </p>
          {/if}

          <!-- Apply controls -->
          <div class="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting || !googleSignedIn}
            >
              {#if isSubmitting}
                <span class="h-3 w-3 animate-spin rounded-full border border-slate-900 border-t-transparent"></span>
                <span>AI is judging your application…</span>
              {:else}
                {#if hasUsedFreeSimulation}
                  <span>Upgrade to re-run HYPSM+</span>
                {:else}
                  <span>Apply to HYPSM+ with AI</span>
                {/if}
              {/if}
            </button>

            <button
              type="button"
              class="text-[11px] text-slate-400 hover:text-slate-200 underline decoration-dotted"
              on:click={resetInboxState}
            >
              Clear AI inbox
            </button>

            <p class="text-[10px] text-slate-500">
              Once your application is processed, AIMail below will populate with simulated decisions
              for the same school list as your main admitMail inbox.
            </p>
          </div>

          {#if applicantSummary}
            <details class="mt-3 text-[10px] text-slate-400">
              <summary class="cursor-pointer text-cyan-300">
                Preview what the AI sees (text only)
              </summary>
              <pre
                class="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-[10px] text-slate-200 border border-slate-700 rounded-lg p-2 bg-slate-950/70"
              >
{applicantSummary}
              </pre>
            </details>
          {/if}
        </form>
      </div>

      <!-- AIMail Inbox -->
      <div
        class="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900/95 shadow-[0_0_40px_rgba(15,23,42,0.9)]"
      >
        <!-- Top bar -->
        <div class="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                AIMail · AI Admissions Inbox
              </span>
              <span class="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-cyan-300 border border-cyan-500/40">
                Model-generated decisions
              </span>
            </div>
            <p class="mt-1 text-xs text-slate-400">
              Inbox shows raw AI decisions. The Deep Dive folder stores tagged explanations per school—like
              detailed answer keys for why a decision swung admit, deny, defer, or waitlist.
            </p>
          </div>
          <div class="text-right text-[10px] text-slate-500">
            <div>Signed in as: <span class="text-slate-300">{googleEmail || 'you@predictadmit.ai'}</span></div>
            <div>Mode: <span class="text-cyan-300">AI Admissions Simulator</span></div>
          </div>
        </div>

        {#if isSubmitting}
          <div class="border-b border-slate-800 bg-slate-900/80 px-4 py-2 flex items-center gap-2 text-[11px] text-slate-300">
            <span class="h-3 w-3 animate-spin rounded-full border border-cyan-400 border-t-transparent"></span>
            <span>
              Your AI application is in the reading queue. Simulated adcoms are reviewing your file across
              HYPSM+…
            </span>
          </div>
        {/if}

        <div class="flex flex-col h-[520px] text-xs">
          <div class="flex border-b border-slate-800 text-[10px] uppercase tracking-[0.2em]">
            <button
              type="button"
              class="px-4 py-2 border-b-2"
              class:border-cyan-400={activeFolder === 'inbox'}
              class:border-transparent={activeFolder !== 'inbox'}
              class:text-cyan-200={activeFolder === 'inbox'}
              class:text-slate-500={activeFolder !== 'inbox'}
              on:click={() => {
                activeFolder = 'inbox';
                viewMode = 'list';
              }}
            >
              Inbox
            </button>
            <button
              type="button"
              class="px-4 py-2 border-b-2"
              class:border-cyan-400={activeFolder === 'deepDive'}
              class:border-transparent={activeFolder !== 'deepDive'}
              class:text-cyan-200={activeFolder === 'deepDive'}
              class:text-slate-500={activeFolder !== 'deepDive'}
              on:click={openDeepDiveFolder}
            >
              Deep Dive
            </button>
          </div>

          {#if activeFolder === 'inbox'}
            {#if !aiDecisions.length}
              <div class="flex-1 flex items-center justify-center px-6 text-xs text-slate-500 text-center">
                <p>
                  Your AI inbox is empty. Build your application above, connect with Google, and click
                  <span class="text-cyan-300 font-medium"> Apply to HYPSM+ with AI</span> to generate
                  simulated decisions.
                </p>
              </div>
            {:else}
              {#if viewMode === 'list'}
                <div class="flex-1 overflow-auto">
                  <table class="min-w-full text-xs">
                    <tbody>
                      {#each aiDecisions as decision (decision.slug)}
                        <tr
                          class="border-b border-slate-800/80 hover:bg-slate-900 cursor-pointer"
                          on:click={() => openDecision(decision)}
                        >
                          <td class="px-3 py-2 w-8 align-top">
                            <input
                              type="checkbox"
                              aria-label={`Select ${decision.school} decision`}
                              class="h-3 w-3 rounded border-slate-600 bg-slate-900 text-cyan-400"
                            />
                          </td>
                          <td class="px-1 py-2 w-6 align-top">
                            <span class="inline-block h-3 w-3 rounded-full bg-cyan-400/60" aria-hidden="true"></span>
                          </td>
                          <td class="px-2 py-2 align-top">
                            <div class="flex items-center gap-2 flex-wrap">
                              <span class="font-medium text-slate-100">
                                {decision.school}
                              </span>
                              <span
                                class={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium ${outcomeClasses(
                                  decision.outcome
                                )}`}
                              >
                                {outcomeLabel(decision.outcome)}
                              </span>
                              {#if isEDDecision(decision)}
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full border border-cyan-500/70 bg-cyan-500/10 text-[10px] text-cyan-200 font-medium">
                                  ED / REA
                                </span>
                              {/if}
                            </div>
                            <div class="mt-0.5 text-[11px] text-slate-300">
                              Application Status – AI simulation result available in your portal.
                            </div>
                            <div class="mt-0.5 text-[11px] text-slate-500 line-clamp-2">
                              {decision.short_reason}
                            </div>
                          </td>
                          <td class="px-3 py-2 align-top text-right whitespace-nowrap">
                            <button
                              type="button"
                              class="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 px-2.5 py-1 text-[10px] text-cyan-200 hover:bg-cyan-500/10 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                              on:click|stopPropagation={() => requestDeepDive(decision)}
                              disabled={deepDiveLoadingSlug === decision.slug}
                            >
                              {#if deepDiveLoadingSlug === decision.slug}
                                <span
                                  class="h-3 w-3 animate-spin rounded-full border border-cyan-300 border-t-transparent"
                                ></span>
                                <span>Deep diving…</span>
                              {:else}
                                <span>Deep dive</span>
                              {/if}
                            </button>
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {:else}
                {#if selectedDecision}
                  <div class="flex-1 flex flex-col">
                    <div class="flex items-center justify-between border-b border-slate-800 px-4 py-2">
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          class="rounded-full border border-slate-600 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                          on:click={backToList}
                        >
                          ← Back to inbox
                        </button>
                        <span class="text-[11px] text-slate-500">
                          AI decision details
                        </span>
                      </div>
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 px-3 py-1.5 text-[11px] text-cyan-200 hover:bg-cyan-500/10 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        on:click={() => requestDeepDive(selectedDecision)}
                        disabled={deepDiveLoadingSlug === selectedDecision.slug}
                      >
                        {#if deepDiveLoadingSlug === selectedDecision.slug}
                          <span
                            class="h-3 w-3 animate-spin rounded-full border border-cyan-300 border-t-transparent"
                          ></span>
                          <span>Tag for Deep Dive</span>
                        {:else}
                          <span>Tag for Deep Dive</span>
                        {/if}
                      </button>
                    </div>

                    <div class="flex-1 overflow-auto px-5 py-4 space-y-3 text-xs">
                      <div class="space-y-1">
                        <h3 class="text-sm font-semibold text-slate-50">
                          {selectedDecision.school} – Application Status (AI Simulation)
                        </h3>
                        <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                          <span>From: PredictAdmit AI &lt;no-reply@predictadmit.ai&gt;</span>
                          <span>·</span>
                          <span>To: {googleEmail || 'you@predictadmit.ai'}</span>
                          <span>·</span>
                          <span
                            class={`inline-flex items-center px-2 py-0.5 rounded-full border ${outcomeClasses(
                              selectedDecision.outcome
                            )}`}
                          >
                            {outcomeLabel(selectedDecision.outcome)}
                          </span>
                          {#if isEDDecision(selectedDecision)}
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full border border-cyan-500/70 bg-cyan-500/10 text-[10px] text-cyan-200 font-medium">
                              ED / REA
                            </span>
                          {/if}
                        </div>
                      </div>

                      <div class="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

                      <p class="text-slate-200">
                        The AI simulator has generated a predicted decision for your application to
                        <span class="font-medium"> {selectedDecision.school}</span> based on the materials you
                        provided.
                      </p>

                      <p class="text-slate-300">
                        <span class="font-semibold">Summary rationale:</span>
                        <br />
                        {selectedDecision.short_reason}
                      </p>

                      <p class="text-slate-400">
                        For a more detailed, school-voice explanation, tag this email for a
                        <span class="text-cyan-300"> Deep dive</span>. The Deep Dive folder will hold a full
                        breakdown written as if by {selectedDecision.school}'s admissions committee—so you get
                        something closer to an annotated answer explanation, not just a one-word verdict.
                      </p>
                    </div>
                  </div>
                {/if}
              {/if}
            {/if}
          {:else}
            {#if !deepDiveItems.length}
              <div class="flex-1 flex items-center justify-center px-6 text-xs text-slate-500 text-center">
                <p>
                  No deep dives yet. From the Inbox, click the
                  <span class="text-cyan-300 font-medium"> Deep dive</span> button on any AI decision to
                  generate a full explanation from that school’s perspective—your personalized
                  “solutions manual” for the admissions process.
                </p>
              </div>
            {:else}
              <div class="flex-1 overflow-auto px-5 py-4 space-y-5 text-xs">
                {#each deepDiveItems as item (item.slug)}
                  <article class="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 space-y-2">
                    <header class="flex flex-wrap items-center justify-between gap-2">
                      <div class="space-y-0.5">
                        <h3 class="text-sm font-semibold text-slate-50">
                          {item.school} – Deep Dive (AI Simulation)
                        </h3>
                        <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                          <span>Folder: Deep Dive</span>
                          <span>·</span>
                          <span>From: Simulated adcom</span>
                        </div>
                      </div>
                      <span
                        class={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${outcomeClasses(
                          item.outcome
                        )}`}
                      >
                        {outcomeLabel(item.outcome)}
                      </span>
                    </header>

                    <div class="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

                    <div class="prose prose-invert prose-slate max-w-none text-[11px] leading-relaxed">
                      {@html item.explanation.replace(/\n/g, '<br />')}
                    </div>
                  </article>
                {/each}
              </div>
            {/if}
          {/if}
        </div>
      </div>
    </section>
  </div>

  {#if showPaywallModal && paywallMode}
    <!-- Paywall modal overlay -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div class="max-w-md w-full rounded-2xl border border-cyan-500/40 bg-slate-950 px-6 py-5 shadow-[0_0_40px_rgba(34,211,238,0.5)] space-y-4">
        <div class="flex items-center justify-between gap-3">
          <div class="space-y-1">
            <p class="text-[11px] uppercase tracking-[0.22em] text-cyan-300">
              {#if paywallMode === 'deepDive'}
                Locked · Deep Dive Explanation
              {:else if paywallMode === 'simulation'}
                Locked · Extra AI Simulations
              {:else}
                Locked · Extra PDF Uploads
              {/if}
            </p>
            <h2 class="text-lg font-semibold text-slate-50">
              {#if paywallMode === 'deepDive' && paywallContextDecision}
                You know the verdict. Now learn <span class="text-cyan-300">why</span>.
              {:else if paywallMode === 'simulation'}
                One full HYPSM+ run is free. The rest are premium.
              {:else}
                You’ve used your free Common App scan.
              {/if}
            </h2>
          </div>
          <button
            type="button"
            class="h-7 w-7 rounded-full border border-slate-700 text-slate-400 text-xs flex items-center justify-center hover:bg-slate-800"
            on:click={closePaywall}
          >
            ✕
          </button>
        </div>

        <div class="space-y-3 text-[13px] text-slate-300">
          {#if paywallMode === 'deepDive' && paywallContextDecision}
            <p>
              Right now you’re staring at a single line — <span class="font-semibold">{outcomeLabel(
                paywallContextDecision.outcome
              )}</span> from <span class="font-semibold">{paywallContextDecision.school}</span>.
              That’s how real portals work: one word, no context.
            </p>
            <p>
              The Deep Dive turns that verdict into a full, adcom-style breakdown:
              what helped you, what quietly hurt you, and what they’d need to see
              to flip this decision next cycle.
            </p>
            <p class="text-slate-400 text-[12px]">
              If this school is living rent-free in your head, this is where you finally
              get to see the story <span class="italic">behind</span> the decision instead of
              imagining the worst.
            </p>
          {:else if paywallMode === 'simulation'}
            <p>
              You’ve already used your free full HYPSM+ simulation on this device.
              That first run is meant to feel like decision day: twenty verdicts,
              one unified story of how the top schools are reading you <span class="italic">right now</span>.
            </p>
            <p>
              To rerun with a new draft, different activities, or a rebalanced spike,
              you’ll need to unlock PredictAdmit <span class="text-cyan-300">/AI Premium</span>.
            </p>
            <p class="text-slate-400 text-[12px]">
              The value isn’t in a single “yes” or “no”. It’s in iterating:
              tweak your profile, re-apply, and watch how the map of admits/denies shifts.
            </p>
          {:else}
            <p>
              You get <span class="font-semibold">one</span> free Common App PDF scan.
              You’ve used it — which means you’ve already seen your application stripped
              down to the raw text an AI reader actually sees.
            </p>
            <p>
              To upload new versions, alternate essays, or a different Common App file,
              you’ll need to unlock PredictAdmit <span class="text-cyan-300">/AI Premium</span>.
            </p>
            <p class="text-slate-400 text-[12px]">
              Most applicants never see their own file the way a reader does.
              Once you’ve seen it once, it’s hard not to want to revise and resubmit.
            </p>
          {/if}
        </div>

        <div class="space-y-2">
          <a
            href="/pricing"
            class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.7)] hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            {#if paywallMode === 'deepDive'}
              Unlock Deep Dive explanations
            {:else if paywallMode === 'simulation'}
              Unlock more HYPSM+ simulations
            {:else}
              Unlock more Common App uploads
            {/if}
          </a>
          <button
            type="button"
            class="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-[11px] text-slate-300 hover:bg-slate-900"
            on:click={closePaywall}
          >
            Not now · keep the free run
          </button>
          <p class="text-[10px] text-slate-500 text-center">
            No real applications are affected. This is a training ground, not a crystal ball.
          </p>
        </div>
      </div>
    </div>
  {/if}
</main>

<AIFooter />
