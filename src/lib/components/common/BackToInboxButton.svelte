<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Decision letters are reached from the AI inbox on /ai, so Back returns there
	// (not the landing) and lands the user directly on the inbox card.
	export let href = '/ai';
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

		// Navigate back without forcing a scroll to the top.
		await goto(target, { noScroll: true });

		// Then scroll down to the inbox card. The /ai page mounts a heavy inbox that
		// renders a tick or two after navigation, so retry a few times until the
		// anchor exists instead of a single best-effort attempt.
		if (typeof document !== 'undefined' && hash) {
			// Re-scroll for ~1.5s even after the inbox mounts: the /ai page restores its
			// own inbox state and can scroll a beat later, overriding a one-shot scroll.
			let tries = 0;
			const tick = () => {
				const el = document.querySelector(hash) as HTMLElement | null;
				if (el) el.scrollIntoView({ behavior: tries === 0 ? 'auto' : 'smooth', block: 'start' });
				if (tries++ < 14) setTimeout(tick, 110);
			};
			setTimeout(tick, 60);
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
