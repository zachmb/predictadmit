<!-- src/routes/pricing/+page.svelte -->
<script lang="ts">
  import AIHeader from '$lib/components/layout/AIHeader.svelte';
  import AIFooter from '$lib/components/layout/AIFooter.svelte';

  let isLoading = false;
  let errorMessage = '';

 async function startCheckout() {
  isLoading = true;
  errorMessage = '';

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    const text = await res.text();

    let data: any = {};
    try {
      data = JSON.parse(text || '{}');
    } catch (jsonErr) {
      console.error('Non-JSON response from /api/checkout:', text);
      errorMessage = 'Server returned an invalid response.';
      return;
    }

    if (!res.ok || !data.url) {
      console.error('Checkout error payload:', data);
      errorMessage =
        data?.error ??
        `Could not start checkout (status ${res.status}).`;
      return;
    }

    window.location.href = data.url;
  } catch (err) {
    console.error('Fetch to /api/checkout failed:', err);
    errorMessage = 'Network error starting checkout.';
  } finally {
    isLoading = false;
  }
}

</script>

<svelte:head>
  <title>PredictAdmit – Pricing</title>
</svelte:head>

<AIHeader />

<main class="min-h-screen bg-slate-950 text-slate-50">
  <div class="max-w-4xl mx-auto px-4 py-12 space-y-8">
    <header class="space-y-2">
      <div class="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">
        <span class="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true"></span>
        <span>AI LAB · PRO UPGRADE</span>
      </div>

      <h1 class="text-3xl font-semibold tracking-tight">
        Unlock full admissions clarity
      </h1>
      <p class="text-sm text-slate-300 max-w-xl">
        Your first Common App simulation is free. To see why each decision happened—and to keep
        iterating on your profile—you’ll need PredictAdmit Pro.
      </p>
    </header>

    <section class="grid gap-6 md:grid-cols-[1.4fr_minmax(0,1fr)] items-start">
      <!-- Emotional copy -->
      <div class="space-y-4 text-sm text-slate-200">
        <p>
          You just watched an entire HYPSM+ inbox light up with admits, denies, and deferrals. That
          stomach drop when your dream school said “deny”? Or the disbelief when a reach turned into
          an admit?
        </p>
        <p>
          Right now, all you have is the verdict. But every decision hides a story: how your rigor,
          awards, and essays landed in the room, what quietly held you back, and where you’re
          already overperforming.
        </p>
        <p class="text-slate-300">
          <span class="font-semibold text-cyan-300">PredictAdmit Pro</span> opens that black box.
          For each school, you’ll see an adcom-style breakdown of <span class="italic">why</span> they
          said yes, no, or not yet—plus concrete moves to change the ending next time.
        </p>
        <p class="text-slate-400 text-xs">
          No admissions officer will ever hand you this post-mortem in real life. This is your one
          place to practice, experiment, and learn the logic behind the verdicts <span class="italic">before</span> 
          they’re permanent.
        </p>
      </div>

      <!-- Pricing card -->
      <div class="rounded-2xl border border-cyan-500/40 bg-slate-900/80 p-5 shadow-[0_0_35px_rgba(34,211,238,0.35)] flex flex-col gap-3">
        <div class="flex items-baseline justify-between">
          <h2 class="text-sm font-semibold text-cyan-200 tracking-[0.18em] uppercase">
            PredictAdmit Pro
          </h2>
          <span class="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-200 border border-cyan-400/60">
            Early access
          </span>
        </div>

        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-semibold text-slate-50">$29</span>
          <span class="text-xs text-slate-400">one-time launch price</span>
        </div>

        <ul class="mt-2 space-y-1.5 text-[11px] text-slate-200">
          <li>• Unlimited AI inbox runs on updated profiles</li>
          <li>• Deep-dive explanations unlocked for all schools</li>
          <li>• Concrete “what to fix next” guidance for each verdict</li>
          <li>• Lifetime access to this version of the simulator</li>
        </ul>

        {#if errorMessage}
          <p class="text-[11px] text-rose-300 bg-rose-500/10 border border-rose-500/40 rounded-lg px-3 py-2 mt-2">
            {errorMessage}
          </p>
        {/if}

        <button
          type="button"
          class="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.7)] hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed"
          on:click={startCheckout}
          disabled={isLoading}
        >
          {#if isLoading}
            <span class="h-3 w-3 animate-spin rounded-full border border-slate-900 border-t-transparent"></span>
            <span>Connecting to secure checkout…</span>
          {:else}
            <span>Continue to secure checkout</span>
          {/if}
        </button>

        <p class="mt-2 text-[10px] text-slate-500">
          Payments are processed by <span class="font-semibold text-slate-200">Stripe</span>. We never see
          your full card number.
        </p>
      </div>
    </section>
  </div>
</main>

<AIFooter />
