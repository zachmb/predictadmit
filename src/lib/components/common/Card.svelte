<script lang="ts">
	let className = '';
	export { className as class };
	// PraiseHive/Hybrid specifications:
	// - Border Radius: 16px (--radius-card)
	// - Shadow: Soft Default, Glow optional
	// - Border: 1px, slate-200 (Light) or slate-800 (Dark)
	// - Background: White (Default)
</script>

<div
	class={`bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-slate-200 overflow-hidden ${className}`}
>
	<slot />
</div>
