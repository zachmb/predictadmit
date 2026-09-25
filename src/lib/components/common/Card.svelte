<script lang="ts">
	let className = '';
	export { className as class };
	// "Study-guide" card: paper-white fill, 2px navy border, solid offset shadow
	// (no blur), 10px radius. Consumers can override via the class prop.
</script>

<div
	class={`bg-card rounded-[var(--radius-card)] shadow-[var(--shadow-offset)] border-2 border-navy overflow-hidden ${className}`}
>
	<slot />
</div>
