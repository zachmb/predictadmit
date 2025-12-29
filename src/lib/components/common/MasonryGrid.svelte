<script lang="ts">
  export let items: any[] = [];
  
  // Simple 3-column masonry logic or use CSS columns
  // PraiseHive specs: 3-column grid collapsing to 1-column on mobile.
</script>

<div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
  {#each items as item}
    <div class="break-inside-avoid mb-6">
      <slot {item} />
    </div>
  {/each}
</div>
