<script lang="ts">
	import { MAJORS } from '$lib/config/majors';
	import { onMount } from 'svelte';

	export let value = '';
	export let placeholder = 'e.g. Computer Science';
	export let id = '';

	let filteredMajors: string[] = [];
	let showDropdown = false;
	let selectedIndex = -1;
	let inputElement: HTMLInputElement;

	// Filter majors based on input
	function handleInput() {
		const q = value.trim().toLowerCase();
		if (q.length > 0) {
			filteredMajors = MAJORS.filter((m) => m.toLowerCase().includes(q)).slice(0, 5);
			showDropdown = filteredMajors.length > 0;
		} else {
			filteredMajors = [];
			showDropdown = false;
		}
		selectedIndex = -1;
	}

	// Handle keyboard navigation
	function handleKeydown(e: KeyboardEvent) {
		if (!showDropdown || filteredMajors.length === 0) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % filteredMajors.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = (selectedIndex - 1 + filteredMajors.length) % filteredMajors.length;
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (selectedIndex >= 0 && selectedIndex < filteredMajors.length) {
				selectMajor(filteredMajors[selectedIndex]);
			} else {
				// If nothing selected but results exist, maybe select top result?
				// Or just let Enter do nothing if no item specifically highlighted.
				// Let's stick to explicit selection for now.
				if (filteredMajors.length > 0) {
					selectMajor(filteredMajors[0]);
				}
			}
		} else if (e.key === 'Escape') {
			showDropdown = false;
		}
	}

	function selectMajor(major: string) {
		value = major;
		showDropdown = false;
		filteredMajors = [];
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (inputElement && !inputElement.contains(event.target as Node)) {
			// Also check if clicked inside dropdown?
			// The dropdown is sibling/child. Actually, easier to just delay close
			// or check closest.
			// For simplicity with this structure:
			// wrapper div contains input and ul.
			// If click is not in wrapper, close.
		}
	}

	// Actually, standard way:
	let wrapper: HTMLDivElement;

	onMount(() => {
		const onClick = (e: MouseEvent) => {
			if (wrapper && !wrapper.contains(e.target as Node)) {
				showDropdown = false;
			}
		};
		document.addEventListener('click', onClick);
		return () => document.removeEventListener('click', onClick);
	});
</script>

<div class="relative w-full" bind:this={wrapper}>
	<input
		{id}
		type="text"
		bind:this={inputElement}
		bind:value
		on:input={handleInput}
		on:keydown={handleKeydown}
		on:focus={() => {
			if (value) handleInput();
		}}
		class="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-inner"
		{placeholder}
		autocomplete="off"
	/>

	{#if showDropdown}
		<ul
			class="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
		>
			{#each filteredMajors as major, index}
				<li>
					<button
						type="button"
						class="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-slate-700 transition-colors {index ===
						selectedIndex
							? 'bg-blue-50 text-blue-700 font-medium'
							: ''}"
						on:click={() => selectMajor(major)}
						on:mouseenter={() => (selectedIndex = index)}
					>
						{major}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
