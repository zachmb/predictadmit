<script lang="ts">
	import { page } from '$app/stores';
	import { portalDecisionHeaderVisible } from '$lib/stores/ui';
	import { schoolConfigs } from '$lib/config/schools';

	const slug = $derived.by(() => {
		const m = $page.url.pathname.match(/^\/portals\/([^/]+)\/?$/);
		return m ? m[1] : null;
	});
	const schoolName = $derived(slug ? (schoolConfigs[slug]?.schoolName ?? '') : '');

	// Show the badge only once the delayed portal header has reappeared.
	const show = $derived(
		$page.url.pathname.startsWith('/portals/') && $portalDecisionHeaderVisible
	);
</script>

{#if show}
	<a
		href="/disclaimer"
		class="group fixed bottom-4 left-4 z-50 flex max-w-[62vw] items-center gap-2 rounded-full border border-amber-300/70 bg-white/90 py-1.5 pr-3 pl-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur transition-colors hover:border-amber-400 hover:bg-white print:hidden"
		style="bottom: calc(1rem + env(safe-area-inset-bottom));"
		aria-label={`This is an unofficial simulation${schoolName ? `, not ${schoolName}'s real portal` : ''}. Learn more.`}
	>
		<span
			class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"
		>
			<svg
				class="h-3.5 w-3.5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2.2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
				/>
			</svg>
		</span>
		<span class="min-w-0 leading-tight">
			<span class="block truncate text-[11px] font-bold text-slate-800">
				<span class="sm:hidden">Simulation</span>
				<span class="hidden sm:inline"
					>Unofficial simulation{schoolName
						? ` · not ${schoolName}'s portal`
						: ' · not a real decision'}</span
				>
			</span>
			<span
				class="block text-[9px] font-semibold tracking-wider text-amber-600 uppercase group-hover:underline"
			>
				Why am I seeing this?
			</span>
		</span>
	</a>
{/if}
