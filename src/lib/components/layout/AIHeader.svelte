<script lang="ts">
  import { userProfile } from '$lib/stores/user';
</script>

<header class="bg-slate-950 border-b border-slate-800 shadow-[0_0_30px_rgba(15,23,42,0.9)]">
  <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
    <a
      href="/ai"
      class="text-2xl md:text-3xl font-bold tracking-tight text-slate-50"
    >
      predictadmit<span class="text-cyan-300">.com</span>
      <span class="ml-1 align-middle text-[13px] font-semibold uppercase tracking-[0.22em] text-cyan-400">
        /AI
      </span>
    </a>

    <div class="hidden md:block text-xs text-right">
      {#if $userProfile.name}
        <div class="text-slate-400">
          Logged in as:
        </div>
        <div class="font-semibold text-cyan-200">
          {$userProfile.name}
        </div>
        <div class="mt-1 text-[10px] text-slate-500">
          AI Admissions Simulator · Premium lane
        </div>
      {:else}
        <div class="text-slate-400">
          Not signed in
        </div>
        <div class="mt-1 text-[10px] text-slate-500">
          Set your fake login on the main page to sync portals.
        </div>
      {/if}
    </div>
  </div>
</header>
