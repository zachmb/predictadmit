<script lang="ts">
	export let variant: 'primary' | 'secondary' = 'primary';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let disabled = false;
	export let fullWidth = false;
	let className = '';
	export { className as class };

	// Routes through the global "study-guide" button system (.btn in sinn-system.css):
	// flat, 2.5px navy border, solid offset shadow, Archivo Black. Primary = bright
	// blue fill; secondary = paper with a yellow hover.
</script>

<button
	{type}
	{disabled}
	class={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${fullWidth ? 'btn-block' : ''} ${className}`}
	on:click
>
	<slot />
</button>
