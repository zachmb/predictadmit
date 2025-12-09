<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  // Defaults: send user back to the AI route + its inbox anchor
  export let href = '/ai';
  export let hash = '#aiInboxSection';
  export let label = 'Back to PredictAdmit /AI inbox';
  export let className = '';

  let visible = false;

  onMount(() => {
    const timer = setTimeout(() => {
      visible = true;
    }, 4000);

    return () => clearTimeout(timer);
  });

  const buildTarget = () => {
    if (href.includes('#')) return href;
    return hash ? `${href}${hash}` : href;
  };

  const handleClick = async (event: MouseEvent) => {
    event.preventDefault();

    const target = buildTarget();

    // Navigate back to AI route
    await goto(target, { noScroll: true });

    // Then scroll to the inbox section
    if (typeof document !== 'undefined' && hash) {
      setTimeout(() => {
        const el = document.querySelector(hash) as HTMLElement | null;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    }
  };
</script>

{#if visible}
  <button
    type="button"
    on:click={handleClick}
    class={`inline-flex items-center gap-1 rounded-full border border-cyan-500/60 bg-slate-950/90 px-3 py-1.5 text-[11px] font-semibold text-cyan-100 shadow-[0_0_12px_rgba(8,47,73,0.6)] hover:bg-slate-900 hover:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-300 transition-all duration-300 opacity-100 ${className}`}
  >
    <span aria-hidden="true" class="text-cyan-300">←</span>
    <span>{label}</span>
  </button>
{/if}
