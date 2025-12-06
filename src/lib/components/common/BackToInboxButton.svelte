<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  export let href = '/';
  export let hash = '#inboxSection';
  export let label = 'Back to admitMail inbox';
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

    // Navigate back to /
    await goto(target, { noScroll: true }); // don't force scroll to top

    // Then scroll to the inbox section
    if (typeof document !== 'undefined' && hash) {
      // small delay in case layout needs a tick
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
    class={`inline-flex items-center gap-1 rounded-sm border border-slate-400 bg-white px-3 py-1 text-[11px] font-semibold text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-opacity duration-300 opacity-100 ${className}`}
  >
    <span aria-hidden="true">←</span>
    <span>{label}</span>
  </button>
{/if}
