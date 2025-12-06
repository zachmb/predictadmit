<script lang="ts">
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

  // Application inputs (text)
  let essay = '';
  let activities = '';
  let honors = '';
  let transcript = '';

  // Optional PDF uploads
  let essayFile: File | null = null;
  let activitiesFile: File | null = null;
  let honorsFile: File | null = null;
  let transcriptFile: File | null = null;

  let essayFileName = '';
  let activitiesFileName = '';
  let honorsFileName = '';
  let transcriptFileName = '';

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

  function handleFileChange(
    event: Event,
    field: 'essay' | 'activities' | 'honors' | 'transcript'
  ) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (field === 'essay') {
      essayFile = file;
      essayFileName = file ? file.name : '';
    } else if (field === 'activities') {
      activitiesFile = file;
      activitiesFileName = file ? file.name : '';
    } else if (field === 'honors') {
      honorsFile = file;
      honorsFileName = file ? file.name : '';
    } else if (field === 'transcript') {
      transcriptFile = file;
      transcriptFileName = file ? file.name : '';
    }
  }

  function simulateGoogleSignIn() {
    // Front-end-only: this is a simulated Google sign-in.
    // You can later replace this with a real OAuth flow if you want.
    googleSignedIn = true;
    googleEmail = 'you@predictadmit.ai';
    googleName = 'PredictAdmit User';
  }

  function ensureHasSomeInput(): boolean {
    return (
      !!essay.trim() ||
      !!activities.trim() ||
      !!honors.trim() ||
      !!transcript.trim() ||
      !!essayFile ||
      !!activitiesFile ||
      !!honorsFile ||
      !!transcriptFile
    );
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Unexpected file reader result'));
        }
      };
      reader.readAsDataURL(file);
    });
  }

  async function runEvaluation() {
    aiError = '';

    if (!googleSignedIn) {
      aiError = 'Please sign in with Google first to create your AI application.';
      return;
    }

    if (!ensureHasSomeInput()) {
      aiError =
        'Add at least one piece of application data (text or PDF) before applying to the AI simulator.';
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

      const filePromises: Promise<void>[] = [];

      if (essayFile) {
        filePromises.push(
          fileToBase64(essayFile).then((b64) => {
            payload.essayPdf = b64;
            payload.essayPdfName = essayFileName;
          })
        );
      }

      if (activitiesFile) {
        filePromises.push(
          fileToBase64(activitiesFile).then((b64) => {
            payload.activitiesPdf = b64;
            payload.activitiesPdfName = activitiesFileName;
          })
        );
      }

      if (honorsFile) {
        filePromises.push(
          fileToBase64(honorsFile).then((b64) => {
            payload.honorsPdf = b64;
            payload.honorsPdfName = honorsFileName;
          })
        );
      }

      if (transcriptFile) {
        filePromises.push(
          fileToBase64(transcriptFile).then((b64) => {
            payload.transcriptPdf = b64;
            payload.transcriptPdfName = transcriptFileName;
          })
        );
      }

      if (filePromises.length) {
        await Promise.all(filePromises);
      }

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
          'The AI did not return any decisions. Try adding more detail (or PDFs) to your application and apply again.';
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

  async function requestDeepDive(decision: AiDecision) {
    if (!applicantSummary) {
      // Fallback: reconstruct very rough summary on client if needed.
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
        // Replace any existing deep dive for this school.
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
            Connect with Google, upload your Common App PDFs or paste your text, choose an ED school,
            and click <span class="font-semibold text-cyan-300">Apply</span>. DeepSeek simulates your
            decisions for the same HYPSM+ list as admitMail, then delivers them into a dark-mode inbox
            with adcom-style explanations.
          </p>
          <p class="mt-2 max-w-2xl text-[11px] text-slate-400">
            This is a training ground, not a crystal ball. Use it the way you’d use UWorld: iterate on
            your “answers” (your profile), see how the results change, and learn from detailed
            breakdowns—not just one-word verdicts.
          </p>
        </div>
        <p class="text-[11px] text-slate-400 max-w-xs md:text-right">
          Your inputs (text and PDFs) are sent only to the DeepSeek API for evaluation. PredictAdmit
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
                <label class="relative inline-flex items-center gap-1 text-[10px] text-slate-400">
                  <input
                    type="file"
                    accept="application/pdf"
                    class="absolute inset-0 opacity-0 cursor-pointer"
                    on:change={(e) => handleFileChange(e, 'essay')}
                  />
                  <span class="border border-slate-600 rounded-full px-2 py-0.5 bg-slate-900/70">
                    Upload PDF
                  </span>
                </label>
              </div>
              {#if essayFileName}
                <p class="text-[10px] text-slate-400 mb-1">
                  Uploaded: <span class="text-cyan-300">{essayFileName}</span>
                </p>
              {/if}
              <textarea
                id="essay"
                bind:value={essay}
                rows="4"
                class="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 resize-y"
                placeholder="Paste your Common App-style personal statement or a realistic draft. You can also just upload your Common App PDF above."
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
                <label class="relative inline-flex items-center gap-1 text-[10px] text-slate-400">
                  <input
                    type="file"
                    accept="application/pdf"
                    class="absolute inset-0 opacity-0 cursor-pointer"
                    on:change={(e) => handleFileChange(e, 'activities')}
                  />
                  <span class="border border-slate-600 rounded-full px-2 py-0.5 bg-slate-900/70">
                    Upload PDF
                  </span>
                </label>
              </div>
              {#if activitiesFileName}
                <p class="text-[10px] text-slate-400 mb-1">
                  Uploaded: <span class="text-cyan-300">{activitiesFileName}</span>
                </p>
              {/if}
              <textarea
                id="activities"
                bind:value={activities}
                rows="4"
                class="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 resize-y"
                placeholder="Paste your activities list, résumé bullets, or upload your activities section as a PDF."
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
                <label class="relative inline-flex items-center gap-1 text-[10px] text-slate-400">
                  <input
                    type="file"
                    accept="application/pdf"
                    class="absolute inset-0 opacity-0 cursor-pointer"
                    on:change={(e) => handleFileChange(e, 'honors')}
                  />
                  <span class="border border-slate-600 rounded-full px-2 py-0.5 bg-slate-900/70">
                    Upload PDF
                  </span>
                </label>
              </div>
              {#if honorsFileName}
                <p class="text-[10px] text-slate-400 mb-1">
                  Uploaded: <span class="text-cyan-300">{honorsFileName}</span>
                </p>
              {/if}
              <textarea
                id="honors"
                bind:value={honors}
                rows="3"
                class="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 resize-y"
                placeholder="Major competitions, scholarships, distinctions, or upload the relevant section from your app."
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
                <label class="relative inline-flex items-center gap-1 text-[10px] text-slate-400">
                  <input
                    type="file"
                    accept="application/pdf"
                    class="absolute inset-0 opacity-0 cursor-pointer"
                    on:change={(e) => handleFileChange(e, 'transcript')}
                  />
                  <span class="border border-slate-600 rounded-full px-2 py-0.5 bg-slate-900/70">
                    Upload PDF
                  </span>
                </label>
              </div>
              {#if transcriptFileName}
                <p class="text-[10px] text-slate-400 mb-1">
                  Uploaded: <span class="text-cyan-300">{transcriptFileName}</span>
                </p>
              {/if}
              <textarea
                id="transcript"
                bind:value={transcript}
                rows="3"
                class="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 resize-y"
                placeholder="GPA, rank (if any), course rigor, key grades, testing, and school context—or upload your transcript PDF."
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
                Your PDFs and text are packaged into a single application payload and sent directly
                from your browser to DeepSeek. PredictAdmit’s servers do not store your application
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
                <span>Apply to HYPSM+ with AI</span>
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
                Preview what the AI sees (text + PDFs)
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

      <!-- AIMail Inbox (stacked below the application card) -->
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
                DeepSeek-generated decisions
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

        <!-- Judging banner -->
        {#if isSubmitting}
          <div class="border-b border-slate-800 bg-slate-900/80 px-4 py-2 flex items-center gap-2 text-[11px] text-slate-300">
            <span class="h-3 w-3 animate-spin rounded-full border border-cyan-400 border-t-transparent"></span>
            <span>
              Your AI application is in the reading queue. Simulated adcoms are reviewing your file across
              HYPSM+…
            </span>
          </div>
        {/if}

        <!-- Main content: inbox + deep dive -->
        <div class="flex flex-col h-[520px] text-xs">
          <!-- Tabs -->
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

          <!-- Folder content -->
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
                <!-- Detail view for one decision -->
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
            <!-- Deep Dive folder -->
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
</main>

<AIFooter />
