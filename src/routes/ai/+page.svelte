<svelte:head>
  <title>Ivy League essays in 5 minutes – PredictAdmit AI</title>
  <meta
    name="description"
    content="PredictAdmit AI helps you draft standout college essays, generate extracurricular ideas, and get AI-powered feedback in minutes."
  />
</svelte:head>

<script>
    import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
</script>

<SiteHeader />
<main class="min-h-screen bg-slate-950 text-slate-50">
  <div class="max-w-6xl mx-auto px-4 py-10 space-y-16">
    <!-- HERO -->
    <section class="grid gap-10 md:grid-cols-2 items-center">
      <div class="space-y-4">
        <p class="text-xs uppercase tracking-[0.3em] text-sky-400/80">
          Ivy League essays · in 5 minutes
        </p>
        <h1 class="text-3xl md:text-4xl font-bold leading-tight">
          The AI-powered platform for
          <span class="block text-sky-300">
            standout college applications.
          </span>
        </h1>
        <p class="text-sm md:text-base text-slate-300 max-w-xl">
          PredictAdmit AI helps you turn your stats, activities, and story into essays, activities,
          and a narrative that actually stands out — without sounding like AI sludge.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 mt-4">
          <a
            href="https://discord.gg"
            target="_blank"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-sm border border-slate-600 bg-slate-900 hover:bg-slate-800"
          >
            Join the Discord
          </a>
          <a
            href="#pricing"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-sm border border-sky-500 bg-sky-400 text-slate-900 hover:bg-sky-300 hover:border-sky-400"
          >
            Get started, it’s free
          </a>
        </div>

        <p class="text-[11px] text-slate-400 mt-2">
          No credit card required. Built by students who actually went through this.
        </p>
      </div>

      <div class="relative">
        <div class="absolute -inset-4 bg-sky-500/10 blur-3xl rounded-full"></div>
        <div class="relative border border-slate-800 bg-slate-900 rounded-xl p-5 shadow-2xl">
          <p class="text-[11px] font-semibold tracking-[0.2em] uppercase text-slate-400 mb-2">
            Live preview
          </p>
          <h2 class="text-lg font-semibold text-slate-50">
            “Rewrite my Common App essay to sound like me, but 20% more polished.”
          </h2>
          <p class="mt-3 text-sm text-slate-300">
            PredictAdmit AI analyzes your draft, your voice, and your goals — then suggests
            edits, structures, and hooks tailored to you, not some generic template.
          </p>
          <div class="mt-4 text-[11px] text-slate-400">
            Powered by GPT-5 level reasoning, tuned specifically for college applications.
          </div>
        </div>
      </div>
    </section>

    <!-- MAIN FEATURES -->
    <section class="space-y-6">
      <div>
        <p class="text-xs uppercase tracking-[0.25em] text-sky-400/80 mb-1">
          Our main features 🦸🏼
        </p>
        <h2 class="text-xl md:text-2xl font-bold">
          Standout applications, <span class="text-sky-300">powered by AI.</span>
        </h2>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- Feature 1: AI Essay Generator -->
        <article class="border border-slate-800 bg-slate-900/60 rounded-lg p-5 flex flex-col gap-3">
          <div>
            <h3 class="text-sm font-semibold">AI Essay Generator</h3>
            <p class="text-xs text-slate-400">
              Draft an Ivy League–level essay in just 5 minutes.
            </p>
          </div>
          <p class="text-sm text-slate-200">
            Generate and refine your college essays through a personalized 5-step process — where
            PredictAdmit AI will ask about your values, help you find a personal anecdote, suggest
            a structure, and finally draft something you can adapt into your own words.
          </p>
          <div class="mt-2 border-t border-slate-800 pt-3 text-[11px] text-slate-300 italic">
            “I WILL be recommending this to all of my friends as we go through this college journey
            together!”
            <span class="not-italic font-semibold"> — Joseph R, Student</span>
          </div>
        </article>

        <!-- Feature 2: AI Essay Feedback -->
        <article class="border border-slate-800 bg-slate-900/60 rounded-lg p-5 flex flex-col gap-3">
          <div>
            <h3 class="text-sm font-semibold">AI Essay Feedback</h3>
            <p class="text-xs text-slate-400">
              One-click, high-quality feedback on any draft.
            </p>
          </div>
          <p class="text-sm text-slate-200">
            PredictAdmit AI analyzes your essay with advanced models, giving targeted comments on
            clarity, structure, voice, and impact — in seconds. No more vague “this is good” feedback.
          </p>
          <div class="mt-2 border-t border-slate-800 pt-3 text-[11px] text-slate-300 italic">
            “It’s definitely convenient to access all my writing documents in one spot while having
            AI integrated into the same platform.”
            <span class="not-italic font-semibold"> — Matieis M, Student</span>
          </div>
        </article>

        <!-- Feature 3: AI Extracurricular Generator -->
        <article class="border border-slate-800 bg-slate-900/60 rounded-lg p-5 flex flex-col gap-3">
          <div>
            <h3 class="text-sm font-semibold">AI Extracurricular Generator</h3>
            <p class="text-xs text-slate-400">
              Get personalized extracurricular activity ideas.
            </p>
          </div>
          <p class="text-sm text-slate-200">
            Generate tailored extracurricular ideas based on your interests, time, and goals. Choose
            your favorites and get concrete overviews, example Common App descriptions, and actionable
            to-do plans.
          </p>
          <div class="mt-2 border-t border-slate-800 pt-3 text-[11px] text-slate-300 italic">
            “I was able to write perfect essays — it gives you a skeleton to work off of and helps
            you generate everything you need.”
            <span class="not-italic font-semibold"> — Isa A, Student</span>
          </div>
        </article>

        <!-- Feature 4: Example Essays -->
        <article class="border border-slate-800 bg-slate-900/60 rounded-lg p-5 flex flex-col gap-3">
          <div>
            <h3 class="text-sm font-semibold">Example Essays</h3>
            <p class="text-xs text-slate-400">
              Get inspired by top-notch example essays.
            </p>
          </div>
          <p class="text-sm text-slate-200">
            Explore a curated library of 500+ high-quality example essays from top schools. Use them
            as models for structure, tone, and narrative — without ever copying a single line.
          </p>
          <div class="mt-2 border-t border-slate-800 pt-3 text-[11px] text-slate-300 italic">
            “I felt like this was really easy to use ngl.”
            <span class="not-italic font-semibold"> — Alex L, Student</span>
          </div>
        </article>
      </div>
    </section>

    <!-- MORE FEATURES -->
    <section class="space-y-6">
      <div>
        <p class="text-xs uppercase tracking-[0.25em] text-sky-400/80 mb-1">
          And so much more… 💼
        </p>
        <h2 class="text-xl md:text-2xl font-bold">
          Our tools quietly <span class="text-sky-300">revolutionize</span> applying to college.
        </h2>
      </div>

      <div class="grid gap-4 md:grid-cols-3 text-sm">
        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="text-sm font-semibold mb-1">AI College Consultant</h3>
          <p class="text-xs text-slate-400 mb-2">
            Fully personalized college consultant at your fingertips.
          </p>
          <p class="text-xs text-slate-300">
            Upload your stats, activities, and essays and get school-by-school strategy,
            suggestions, and risk ranges — all in one place.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="text-sm font-semibold mb-1">Generate Hook</h3>
          <p class="text-xs text-slate-400 mb-2">
            Instantly create an engaging opening.
          </p>
          <p class="text-xs text-slate-300">
            Turn a boring first sentence into a memorable hook that makes an overworked AO keep
            reading.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="text-sm font-semibold mb-1">Write About Next</h3>
          <p class="text-xs text-slate-400 mb-2">
            Never get stuck mid-essay again.
          </p>
          <p class="text-xs text-slate-300">
            Receive real-time suggestions for the most compelling themes and ideas to develop next.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="text-sm font-semibold mb-1">Extracurriculars</h3>
          <p class="text-xs text-slate-400 mb-2">
            Upgrade your activities list.
          </p>
          <p class="text-xs text-slate-300">
            Rewrite your activities in Common App format with stronger verbs, clearer impact, and
            tighter character counts.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="text-sm font-semibold mb-1">Continue Writing</h3>
          <p class="text-xs text-slate-400 mb-2">
            Pick up exactly where you left off.
          </p>
          <p class="text-xs text-slate-300">
            Prompt the AI to continue in your voice and style so drafts don’t die as half-finished docs.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="text-sm font-semibold mb-1">GPT-5-level engine</h3>
          <p class="text-xs text-slate-400 mb-2">
            Built on cutting-edge models.
          </p>
          <p class="text-xs text-slate-300">
            Leverage state-of-the-art reasoning models to level up the sophistication and nuance of
            every essay draft.
          </p>
        </div>
      </div>
    </section>

    <!-- PRICING -->
    <section id="pricing" class="space-y-6">
      <div class="space-y-1">
        <p class="text-xs uppercase tracking-[0.25em] text-sky-400/80 mb-1">
          Pricing 💰
        </p>
        <h2 class="text-xl md:text-2xl font-bold">
          Unleash your application’s potential.
        </h2>
        <p class="text-sm text-slate-300 max-w-xl">
          Start free and upgrade only if it actually moves the needle for your applications.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-5">
        <!-- Free plan -->
        <article class="flex-1 border border-slate-800 bg-slate-900/70 rounded-lg p-5 flex flex-col">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">
            Free
          </p>
          <h3 class="text-lg font-bold mb-1">Get a feel before paying anything.</h3>
          <p class="text-sm text-slate-300 mb-4">
            Try PredictAdmit AI on real essays and ideas, with enough usage to see if it fits your workflow.
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
            <li>• 10,000 tokens</li>
            <li>• 3 example essays</li>
            <li>• Unlimited ideas & brainstorming</li>
            <li>• Unlimited essay projects</li>
          </ul>
        </article>

        <!-- Pro plan -->
        <article class="flex-1 border border-sky-500 bg-slate-900 rounded-lg p-5 flex flex-col relative overflow-hidden">
          <span
            class="absolute right-3 top-3 text-[10px] uppercase tracking-[0.2em] bg-sky-500 text-slate-900 px-2 py-1 rounded-sm font-semibold"
          >
            Best deal 🔥
          </span>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300 mb-1">
            Pro · Full cycle
          </p>
          <h3 class="text-lg font-bold mb-1">Get the full PredictAdmit AI experience.</h3>
          <p class="text-sm text-slate-200 mb-4">
            For students who want a serious edge from the first draft to the final “submit” click.
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
            <li>• Unlimited tokens</li>
            <li>• Access to 500+ example essays</li>
            <li>• Full AI essay writing suite</li>
            <li>• Extracurricular recommendation & polishing tools</li>
            <li>• Priority support via Discord community</li>
          </ul>
        </article>
      </div>
    </section>

    <!-- FAQ -->
    <section class="space-y-6">
      <div>
        <p class="text-xs uppercase tracking-[0.25em] text-sky-400/80 mb-1">
          Frequently asked questions 📣
        </p>
        <h2 class="text-xl md:text-2xl font-bold">
          Questions about AI, ethics, and how this fits into your process.
        </h2>
      </div>

      <div class="grid gap-4 md:grid-cols-2 text-sm">
        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="font-semibold text-sm mb-1">What is PredictAdmit AI’s mission?</h3>
          <p class="text-xs text-slate-300">
            To make high-quality guidance accessible to students who don’t have $5,000+ for private
            consultants — while still respecting integrity and your own voice.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="font-semibold text-sm mb-1">Is using this ethical?</h3>
          <p class="text-xs text-slate-300">
            Yes, when used correctly. PredictAdmit AI is a brainstorming and editing assistant. You
            stay in control of the ideas, stories, and final wording.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="font-semibold text-sm mb-1">Will colleges know if I use it?</h3>
          <p class="text-xs text-slate-300">
            Colleges can’t “detect” tools like this when you write your own work and use AI as an
            assistant rather than a ghostwriter.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="font-semibold text-sm mb-1">What’s your stance on AI in applications?</h3>
          <p class="text-xs text-slate-300">
            We think AI should make the process fairer — not replace your story. Our tooling is
            explicitly designed to keep you in the loop.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="font-semibold text-sm mb-1">How do you ensure academic integrity?</h3>
          <p class="text-xs text-slate-300">
            We encourage revision, reflection, and personalization. The best outcomes happen when
            students use AI drafts as scaffolding, then heavily rewrite in their own voice.
          </p>
        </div>

        <div class="border border-slate-800 bg-slate-900/70 rounded-lg p-4">
          <h3 class="font-semibold text-sm mb-1">What is your refund policy?</h3>
          <p class="text-xs text-slate-300">
            If you don’t find value in the Pro plan within 7 days, reach out and we’ll make it right.
          </p>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="border border-sky-500/80 bg-sky-500/10 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div class="space-y-2">
        <p class="text-xs uppercase tracking-[0.25em] text-sky-300">
          Last call ! 🚀
        </p>
        <h2 class="text-xl md:text-2xl font-bold">
          Ready to start?
        </h2>
        <p class="text-sm text-slate-200 max-w-xl">
          You won’t regret it. PredictAdmit AI helps you reach your potential and walk into decision
          day with essays you’re proud of.
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
</main>
