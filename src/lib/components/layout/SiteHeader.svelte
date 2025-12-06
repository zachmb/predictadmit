<script lang="ts">
  import { userProfile } from '$lib/stores/user';
</script>

<header class="bg-white border-b border-slate-400 shadow-sm">
  <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
    <a
      href="https://predictadmit.com/"
      class="text-2xl md:text-3xl font-bold tracking-tight text-slate-900"
    >
      predictadmit<span class="text-blue-900">.com</span>
    </a>

    <div class="hidden md:block text-xs text-slate-600 text-right">
      {#if $userProfile.name}
        Logged in as:<br />
        <span class="font-semibold">{$userProfile.name}</span>
      {:else}
        Not signed in
      {/if}
    </div>
  </div>
</header>
