<script lang="ts">
	// Shared early-deadline countdown card (Nov 1, 2026 EA/ED). Visual twin of the
	// Pro dashboard card (pro/DashboardHome.svelte) so the /ai predict page and
	// /verdict show the exact same card the logged-in dashboard does.
	let {
		wrapperClass = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
	}: { wrapperClass?: string } = $props();

	// Midnight CST (UTC-6) on Nov 1, 2026 — the classic early-application deadline.
	const target = new Date('2026-11-01T00:00:00-06:00');
	let now = $state(Date.now());

	$effect(() => {
		const id = setInterval(() => {
			now = Date.now();
		}, 1000);
		return () => clearInterval(id);
	});

	const pad = (n: number) => String(n).padStart(2, '0');

	const cd = $derived.by(() => {
		let diff = Math.max(0, target.getTime() - now);
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
	<div class="flex items-center justify-between">
		<div>
			<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Countdown</p>
			<h3 class="mt-0.5 text-lg font-bold text-slate-900">Early Deadlines · Nov 1, 2026</h3>
		</div>
		<span class="flex items-center gap-1.5 text-xs font-semibold text-[#0c0c09]">
			<span class="relative flex h-2 w-2">
				<span
					class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0c0c09] opacity-75"
				></span>
				<span class="relative inline-flex h-2 w-2 rounded-full bg-[#0c0c09]"></span>
			</span>
			LIVE
		</span>
	</div>
	<div class="mt-5 grid grid-cols-4 gap-2">
		{#each [{ label: 'Days', value: cd.days }, { label: 'Hours', value: cd.hours }, { label: 'Min', value: cd.minutes }, { label: 'Sec', value: cd.seconds }] as box}
			<div class="rounded-xl bg-slate-50 border border-slate-100 py-3 text-center">
				<div class="text-2xl font-bold tabular-nums text-slate-900">
					{box.label === 'Days' ? box.value : pad(box.value)}
				</div>
				<div class="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
					{box.label}
				</div>
			</div>
		{/each}
	</div>
</div>
