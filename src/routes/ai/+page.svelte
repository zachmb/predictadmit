<script>
  import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
  import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
</script>

<svelte:head>
  <title>Stress-test your application in 5 minutes – PredictAdmit AI</title>
  <meta
    name="description"
    content="PredictAdmit AI is a purpose-built college app engine that reads your application like an AO and helps you refine the story — not auto-generate it."
  />
</svelte:head>

<SiteHeader />

<main class="min-h-screen bg-slate-950 text-slate-50">
  <div class="max-w-6xl mx-auto px-4 py-10 space-y-16">
    <!-- HERO -->
    <section class="grid gap-10 md:grid-cols-2 items-center">
      <div class="space-y-4">
        <p class="text-xs uppercase tracking-[0.3em] text-sky-400/80">
          Decision day prep · PredictAdmit AI
        </p>
        <h1 class="text-3xl md:text-4xl font-bold leading-tight space-y-1">
          <span class="block">Stress-test your application</span>
          <span class="block text-sky-300">
            with an AI that reads the whole story.
          </span>
        </h1>
        <p class="text-sm md:text-base text-slate-300 max-w-xl">
          PredictAdmit AI doesn’t spit out new essays. It reads what you already have — essays,
          activities, context — and tells you how the narrative actually lands in an AO’s head.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 mt-4">
          <a
            href="https://discord.gg"
            target="_blank"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-sm border border-slate-700 bg-slate-900 hover:bg-slate-800"
          >
            Join the PredictAdmit Discord
          </a>
          <a
            href="#pricing"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-sm border border-sky-500 bg-sky-400 text-slate-900 hover:bg-sky-300 hover:border-sky-400"
          >
            Run a 5-minute AI stress test
          </a>
        </div>

        <p class="text-[11px] text-slate-400 mt-2">
          No credit card. Built by students who lived decision day — and trained the AI to focus on
          narrative, coherence, and spike instead of auto-writing for you.
        </p>
      </div>

      <!-- Live preview card -->
      <div class="relative">
        <div class="absolute -inset-4 bg-sky-500/10 blur-3xl rounded-full"></div>
        <div class="relative border border-slate-800 bg-slate-900 rounded-xl p-5 shadow-2xl">
          <p class="text-[11px] font-semibold tracking-[0.2em] uppercase text-slate-400 mb-2">
            Live preview · committee brain
          </p>
          <h2 class="text-lg font-semibold text-slate-50">
            “Read this like a top-20 AO in committee. Is this a yes, maybe, or no — and what’s
            killing the story or carrying it?”
          </h2>
          <p class="mt-3 text-sm text-slate-300">
            Under the hood, PredictAdmit AI runs your existing file through layered rubrics,
            simulated admit files, and committee-style reasoning — surfacing how your narrative
            plays when someone has 6 minutes and 40 other apps to read.
          </p>
          <div class="mt-4 text-[11px] text-slate-400">
            Coherence checks, spike checks, and consistency filters stacked on top of advanced
            models — so it behaves less like a text generator and more like a brutally honest reader
            living in your laptop.
          </div>
        </div>
      </div>
    </section>

    <!-- MAIN FEATURES: BUILT AROUND STRESS-TESTING -->
    <section class="space-y-6">
      <div>
        <p class="text-xs uppercase tracking-[0.25em] text-sky-400/80 mb-1">
          What PredictAdmit AI actually does
        </p>
        <h2 class="text-xl md:text-2xl font-bold">
          Not “write my essay.” A
          <span class="text-sky-300">college application reader</span>
          plugged into the PredictAdmit sim.
        </h2>
        <p class="text-sm text-slate-300 max-w-xl mt-1">
          You bring drafts, activities, and context. PredictAdmit AI brings the committee brain:
          where your story threads connect, where they drop, and what the overall file is really
          saying about you.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- Feature 1: 5-minute narrative lab -->
        <article class="border border-slate-800 bg-slate-900/60 rounded-lg p-5 flex flex-col gap-3">
          <div>
            <h3 class="text-sm font-semibold">5-minute narrative lab</h3>
            <p class="text-xs text-slate-400">
              When the pieces are there but the story isn’t.
            </p>
          </div>
          <p class="text-sm text-slate-200">
            Paste in your existing essay and a quick snapshot of the rest of your app. The lab maps
            what story those pieces are telling now — then points out gaps, contradictions, and
            missed through-lines, so you know what to cut, move, or rewrite yourself.
          </p>
          <div class="mt-2 border-t border-slate-800 pt-3 text-[11px] text-slate-300 italic">
            “I WILL be recommending this to all of my friends as we go through this college journey
            together!”
            <span class="not-italic font-semibold"> — Joseph R, Student</span>
          </div>
        </article>

        <!-- Feature 2: AO-style feedback -->
        <article class="border border-slate-800 bg-slate-900/60 rounded-lg p-5 flex flex-col gap-3">
          <div>
            <h3 class="text-sm font-semibold">AO-style essay feedback</h3>
            <p class="text-xs text-slate-400">
              Reads your draft like a real file, not a blank page.
            </p>
          </div>
          <p class="text-sm text-slate-200">
            You don’t get a new essay — you get margin notes: what’s memorable, what feels generic,
            what parts of your spike are underplayed, and how this essay fits (or clashes) with your
            activities and goals. It’s narrative triage, not auto-writing.
          </p>
          <div class="mt-2 border-t border-slate-800 pt-3 text-[11px] text-slate-300 italic">
            “It’s definitely convenient to access all my writing documents in one spot while having
            AI integrated into the same platform.”
            <span class="not-italic font-semibold"> — Matieis M, Student</span>
          </div>
        </article>

        <!-- Feature 3: Activity & spike builder -->
        <article class="border border-slate-800 bg-slate-900/60 rounded-lg p-5 flex flex-col gap-3">
          <div>
            <h3 class="text-sm font-semibold">Activity &amp; spike alignment</h3>
            <p class="text-xs text-slate-400">
              Makes your 150 characters match the story, not fight it.
            </p>
          </div>
          <p class="text-sm text-slate-200">
            Feed in how you currently describe an activity. PredictAdmit AI flags jargon, fluff, and
            buried impact — then suggests tighter framing and emphasis so your descriptions echo
            the same spike your essays are trying to sell.
          </p>
          <div class="mt-2 border-t border-slate-800 pt-3 text-[11px] text-slate-300 italic">
            “I was able to write perfect essays — it gives you a skeleton to work off of and helps
            you generate everything you need.”
            <span class="not-italic font-semibold"> — Isa A, Student</span>
          </div>
        </article>

        <!-- Feature 4: Example essays & patterns -->
        <article class="border border-slate-800 bg-slate-900/60 rounded-lg p-5 flex flex-col gap-3">
          <div>
            <h3 class="text-sm font-semibold">Example patterns, not copy-paste</h3>
            <p class="text-xs text-slate-400">
              Shows you how strong files are assembled.
            </p>
          </div>
          <p class="text-sm text-slate-200">
            Instead of “here, copy this essay,” the engine highlights how successful essays move:
            where they pivot, when they zoom out, how they land the ending — then points to spots in
            <em>your</em> draft where a similar move would sharpen the story.
          </p>
          <div class="mt-2 border-t border-slate-800 pt-3 text-[11px] text-slate-300 italic">
            “I felt like this was really easy to use ngl.”
            <span class="not-italic font-semibold"> — Alex L, Student</span>
          </div>
        </article>
      </div>
    </section>

    <!-- MORE FEATURES: APPLICATION LAB -->
    <section class="space-y-6">
      <div>
        <p class="text-xs uppercase tracking-[0.25em] text-sky-400/80 mb-1">
          Application lab · beyond essays
        </p>
        <h2 class="text-xl md:text-2xl font-bold">
          Less “AI wrote this,” more
          <span class="text-sky-300">“my whole file finally makes sense.”</span>
        </h2>
      </div>

      <div class="grid gap-4 md:grid-cols-3 text-sm">
        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="text-sm font-semibold mb-1">AI college strategist</h3>
          <p class="text-xs text-slate-400 mb-2">
            Looks at the file like a human strategist would.
          </p>
          <p class="text-xs text-slate-300">
            Upload your stats, activities, and targets. Instead of rewriting anything, the engine
            calls out where your list, your spike, and your current materials don’t line up — and
            where a small tweak could make the story more believable.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="text-sm font-semibold mb-1">Opening line surgery</h3>
          <p class="text-xs text-slate-400 mb-2">
            Fixes what’s already there, not inventing a new persona.
          </p>
          <p class="text-xs text-slate-300">
            Paste your existing intro. PredictAdmit AI flags clichés, slow starts, and confusing
            pivots — then offers concrete edits and alternatives that still sound like you, but
            land faster in a skim read.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="text-sm font-semibold mb-1">“What next?” structure hints</h3>
          <p class="text-xs text-slate-400 mb-2">
            Keeps the narrative moving instead of bloating it.
          </p>
          <p class="text-xs text-slate-300">
            If you’re stuck mid-draft, the system doesn’t write the next paragraph for you; it
            points to the next <em>move</em> that keeps your spike in view — reflect, zoom out,
            counterpoint, tighten, etc.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="text-sm font-semibold mb-1">Activities polish</h3>
          <p class="text-xs text-slate-400 mb-2">
            Makes each line support the same story.
          </p>
          <p class="text-xs text-slate-300">
            Rewrites are tuned for AO skim speed: role → impact → scale. You see before/after
            phrasings so you can decide what feels most like you while still backing up your
            narrative.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="text-sm font-semibold mb-1">Continue in your voice</h3>
          <p class="text-xs text-slate-400 mb-2">
            Protects tone while you make the edits.
          </p>
          <p class="text-xs text-slate-300">
            The engine studies your earlier paragraphs, then proposes tweaks and additions in that
            same register. You accept, reject, and rewrite — it’s scaffolding, not a ghostwriter.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="text-sm font-semibold mb-1">Modern AI engine</h3>
          <p class="text-xs text-slate-400 mb-2">
            Built to edit and evaluate, not to take over.
          </p>
          <p class="text-xs text-slate-300">
            Underneath is a cutting-edge reasoning model, but the real value is the college app
            layer on top — rubrics, checks, and flows that stay focused on refining your narrative,
            not replacing it with AI-sounding prose.
          </p>
        </div>
      </div>
    </section>

    <!-- PRICING -->
    <section id="pricing" class="space-y-6">
      <div class="space-y-1">
        <p class="text-xs uppercase tracking-[0.25em] text-sky-400/80 mb-1">
          Pricing
        </p>
        <h2 class="text-xl md:text-2xl font-bold">
          Start free. Upgrade if it changes how your file reads.
        </h2>
        <p class="text-sm text-slate-300 max-w-xl">
          The free tier is enough to feel the difference between “AI helped me write” and “AI
          helped me finally see my application as a story.”
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-5">
        <!-- Free plan -->
        <article
          class="flex-1 border border-slate-800 bg-slate-900/70 rounded-lg p-5 flex flex-col"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">
            Free · first stress test
          </p>
          <h3 class="text-lg font-bold mb-1">Run PredictAdmit AI on real drafts.</h3>
          <p class="text-sm text-slate-300 mb-4">
            Enough usage to see how your current essays and activities land in a narrative pass —
            without changing a single school on your list or writing anything from scratch.
          </p>
          <div class="flex items-baseline gap-1 mb-4">
            <span class="text-3xl font-bold">$0</span>
            <span class="text-xs text-slate-400">/mo · free forever</span>
          </div>
          <button
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-sm border border-slate-600 bg-slate-50 text-slate-900 hover:bg-slate-200"
          >
            Try for free
          </button>
          <ul class="mt-4 space-y-1 text-xs text-slate-300">
            <li>• 10,000 tokens for narrative passes</li>
            <li>• 3 example application breakdowns</li>
            <li>• Unlimited essay &amp; activity reviews</li>
            <li>• Unlimited projects to keep drafts organized</li>
          </ul>
        </article>

        <!-- Pro plan -->
        <article
          class="flex-1 border border-sky-500 bg-slate-900 rounded-lg p-5 flex flex-col relative overflow-hidden"
        >
          <span
            class="absolute right-3 top-3 text-[10px] uppercase tracking-[0.2em] bg-sky-500 text-slate-900 px-2 py-1 rounded-sm font-semibold"
          >
            Best for full app cycle
          </span>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300 mb-1">
            Pro · full decision-day prep
          </p>
          <h3 class="text-lg font-bold mb-1">Keep the “narrative AO” on call all year.</h3>
          <p class="text-sm text-slate-200 mb-4">
            For students who want that godsend feeling — a tuned reader that keeps the whole story
            aligned — from first messy draft to the final “submit” and portal refresh.
          </p>
          <div class="flex items-baseline gap-1 mb-4">
            <span class="text-3xl font-bold">$19</span>
            <span class="text-xs text-slate-300">/mo · for the full application cycle</span>
          </div>
          <button
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-sm border border-sky-500 bg-sky-400 text-slate-900 hover:bg-sky-300"
          >
            Purchase now
          </button>
          <ul class="mt-4 space-y-1 text-xs text-slate-100">
            <li>• Effectively unlimited narrative passes</li>
            <li>• Access to 500+ example essay breakdowns</li>
            <li>• Full feedback suite for essays &amp; supplements</li>
            <li>• Activity list framing &amp; polish tools</li>
            <li>• Priority support via Discord community</li>
          </ul>
        </article>
      </div>
    </section>

    <!-- FAQ -->
    <section class="space-y-6">
      <div>
        <p class="text-xs uppercase tracking-[0.25em] text-sky-400/80 mb-1">
          Frequently asked questions
        </p>
        <h2 class="text-xl md:text-2xl font-bold">
          How this is different from “just using ChatGPT for my essays.”
        </h2>
      </div>

      <div class="grid gap-4 md:grid-cols-2 text-sm">
        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="font-semibold text-sm mb-1">What is PredictAdmit AI’s mission?</h3>
          <p class="text-xs text-slate-300">
            To give you structured, committee-style reads on the story your file tells — something
            families usually only get from expensive counselors, not from a generic “rewrite this”
            chatbot.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="font-semibold text-sm mb-1">Can’t I just copy your prompts into another AI?</h3>
          <p class="text-xs text-slate-300">
            The value isn’t a magic prompt. It’s the sequence of checks — narrative, spike,
            coherence, context — chained together around the assumption that you already wrote the
            draft and just need to see it the way a reader will.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="font-semibold text-sm mb-1">Will colleges know if I use it?</h3>
          <p class="text-xs text-slate-300">
            Not when you use it as a reader and editor. You’re still doing the writing; the system
            is just holding up a mirror to how your pieces fit together. If it doesn’t sound like
            you, you change it until it does.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="font-semibold text-sm mb-1">How does this connect to the portal sim?</h3>
          <p class="text-xs text-slate-300">
            PredictAdmit AI refines what’s in the file. The PredictAdmit simulator lets you feel
            what that file leads to on decision day. Together they cover both: the narrative and the
            emotional punch of opening those portals.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="font-semibold text-sm mb-1">Is using this ethical?</h3>
          <p class="text-xs text-slate-300">
            Yes, when you treat it as a narrative coach. We ask you to revise, fact-check, and make
            final calls. The goal is to sharpen your story, not erase it under AI prose.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="font-semibold text-sm mb-1">What is your refund policy?</h3>
          <p class="text-xs text-slate-300">
            If you don’t feel a meaningful difference in how your app reads within 7 days, reach
            out and we’ll make it right. This should feel like the reader you wish you had from day
            one — not just another tool.
          </p>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section
      class="border border-sky-500/80 bg-sky-500/10 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div class="space-y-2">
        <p class="text-xs uppercase tracking-[0.25em] text-sky-300">
          Next step
        </p>
        <h2 class="text-xl md:text-2xl font-bold">
          Give it one draft and see if your story gets clearer.
        </h2>
        <p class="text-sm text-slate-200 max-w-xl">
          PredictAdmit AI is meant to be the reader who gets the big picture when you’re too deep in
          the weeds — the tool that makes you say, “Oh. <em>That’s</em> what my app is actually
          saying about me.”
        </p>
        <p class="text-[11px] text-slate-300 italic">
          “This is actually going to change the applying-to-college game forever.”
          <span class="not-italic font-semibold"> — Adam G, Student</span>
        </p>
      </div>
      <div>
        <a
          href="#pricing"
          class="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-sm border border-sky-500 bg-sky-400 text-slate-900 hover:bg-sky-300"
        >
          Get started, it’s free
        </a>
      </div>
    </section>
  </div>

  <SiteFooter />
</main>
