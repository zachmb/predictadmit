<script lang="ts">
	export let variant: 'primary' | 'secondary' = 'primary';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let disabled = false;
	export let fullWidth = false;
	let className = '';
	export { className as class };

	// PraiseHive specifications:
	// - Border Radius: 8px (--radius-btn)
	// - Padding: 20px horizontal
	// - Primary: Solid fill
	// - Secondary: Ghost/Subtle Gray
</script>

<button
	{type}
	{disabled}
	class={`
    inline-flex items-center justify-center font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed
    px-[20px] py-2 rounded-[var(--radius-btn)] text-sm
    ${fullWidth ? 'w-full' : ''}
    ${
			variant === 'primary'
				? 'bg-[var(--color-brand-primary)] text-white hover:bg-slate-800'
				: 'bg-transparent text-[var(--color-brand-primary)] border border-slate-300 hover:bg-slate-50'
		}
    ${className}
  `}
	on:click
>
	<slot />
</button>
