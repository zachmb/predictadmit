<script lang="ts">
	// Shared early-deadline countdown card (Nov 1, 2026 EA/ED). Visual twin of the
	// Pro dashboard card (pro/DashboardHome.svelte) so the /ai predict page and
	// /verdict show the exact same card the logged-in dashboard does.
	// size='md' is the Pro-dashboard twin (default). size='lg' is the big,
	// Appybara-scale variant used on the /ai predict page.
	let {
		wrapperClass = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm',
		size = 'md'
	}: { wrapperClass?: string; size?: 'md' | 'lg' } = $props();

	const big = $derived(size === 'lg');

	let now = $state(Date.now());

	$effect(() => {
		const id = setInterval(() => {
			now = Date.now();
		}, 1000);
		return () => clearInterval(id);
	});

	const pad = (n: number) => String(n).padStart(2, '0');

	// The live deadline rolls automatically through the application cycle:
	//   Jan 1 → Oct 31  → counts down to Nov 1 (Early / EA·ED)
	//   Nov 1 → Dec 31  → counts down to Jan 1 (Regular Decision)
	// So after Nov 1 passes it flips to Jan 1, and after Jan 1 passes the new
	// year's Jan–Oct window points back to Nov 1 again.
	const deadline = $derived.by(() => {
		const d = new Date(now);
		const year = d.getFullYear();
		const nov1 = new Date(year, 10, 1).getTime(); // Nov 1 (local midnight)
		if (now < nov1) {
			return { target: nov1, label: 'Early Deadlines', date: `Nov 1, ${year}` };
		}
		const jan1 = new Date(year + 1, 0, 1).getTime(); // Jan 1 next year
		return { target: jan1, label: 'Regular Deadlines', date: `Jan 1, ${year + 1}` };
	});

	const cd = $derived.by(() => {
		let diff = Math.max(0, deadline.target - now);
		const days = Math.floor(diff / 86_400_000);
		diff -= days * 86_400_000;
		const hours = Math.floor(diff / 3_600_000);
		diff -= hours * 3_600_000;
		const minutes = Math.floor(diff / 60_000);
		diff -= minutes * 60_000;
		const seconds = Math.floor(diff / 1000);
		return { days, hours, minutes, seconds };
	});
</script>

<div class={wrapperClass}>
	<div class="flex items-center justify-between gap-3">
		<div>
			<h3 class={`font-bold text-slate-900 ${big ? 'text-2xl tracking-tight' : 'text-lg'}`}>
				{deadline.label} · {deadline.date}
			</h3>
		</div>
		<span
			class={`flex shrink-0 items-center gap-1.5 font-semibold text-[#0c0c09] ${big ? 'text-sm' : 'text-xs'}`}
		>
			<span class="relative flex h-2 w-2">
				<span
					class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0c0c09] opacity-75"
				></span>
				<span class="relative inline-flex h-2 w-2 rounded-full bg-[#0c0c09]"></span>
			</span>
			LIVE
		</span>
	</div>
	<div class={`grid grid-cols-4 ${big ? 'mt-7 gap-3' : 'mt-5 gap-2'}`}>
		{#each [{ label: 'Days', value: cd.days }, { label: 'Hours', value: cd.hours }, { label: 'Min', value: cd.minutes }, { label: 'Sec', value: cd.seconds }] as box}
			<div
				class={`rounded-xl bg-slate-50 border border-slate-100 text-center ${big ? 'py-5' : 'py-3'}`}
			>
				<div class={`font-bold tabular-nums text-slate-900 ${big ? 'text-4xl' : 'text-2xl'}`}>
					{box.label === 'Days' ? box.value : pad(box.value)}
				</div>
				<div
					class={`mt-0.5 font-medium uppercase tracking-wide text-slate-400 ${big ? 'text-xs' : 'text-[11px]'}`}
				>
					{box.label}
				</div>
			</div>
		{/each}
	</div>
</div>
