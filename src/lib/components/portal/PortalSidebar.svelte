<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let showDeepDive = false;
	export let decisionOutcome: 'admit' | 'deny' | 'waitlist' | 'defer' | undefined = undefined;

	const dispatch = createEventDispatcher();

	let visible = false;
	let saved = false;

	onMount(() => {
		// Slight delay to slide in after the page loads, mimicking an IDE extension or overlay
		setTimeout(() => {
			visible = true;
		}, 800);
	});

	function handleSave() {
		saved = true;
		dispatch('save');
		// Revert saved state after a couple seconds
		setTimeout(() => {
			saved = false;
		}, 3000);
	}

	function handleDeepDive() {
		dispatch('deepDive');
	}

	function handleHome() {
		dispatch('home');
	}
</script>

{#if visible}
	<aside
		class="fixed z-50 flex flex-col gap-3 max-md:bottom-6 max-md:left-4 md:left-4 md:top-1/2 md:-translate-y-1/2"
		in:fly={{ x: -20, duration: 600 }}
	>
		<!-- Home / Back -->
		<button
			on:click={handleHome}
			class="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 shadow-lg transition-all hover:scale-110 hover:bg-slate-800 border border-slate-700/50"
			title="Back to Dashboard"
		>
			<svg class="h-4 w-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
		</button>

		<!-- Save Decision -->
		<button
			on:click={handleSave}
			class="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 shadow-lg transition-all hover:scale-110 hover:bg-slate-800 border border-slate-700/50 relative"
			title="Save Decision to Mind Map"
		>
			{#if saved}
				<svg
					class="h-4 w-4 text-emerald-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					in:fade
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			{:else}
				<svg
					class="h-4 w-4 text-slate-200"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					in:fade
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
					/>
				</svg>
			{/if}
		</button>

		{#if showDeepDive}
			<!-- Deep Dive -->
			<button
				on:click={handleDeepDive}
				class="group flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 shadow-lg transition-all hover:scale-110 hover:bg-indigo-500 border border-indigo-400/50"
				title="Analyze "
			>
				<svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
				<span
					class="absolute left-full ml-3 w-max rounded-md bg-slate-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
				>
					Explain this decision
				</span>
			</button>
		{/if}
	</aside>
{/if}
