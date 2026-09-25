<script lang="ts">
	// Reusable review tool used by the "Letters of Rec" and "Final Read" Pro views.
	// Paste text → /api/ai/review → verdict + what's working + prioritized fixes.
	// It only ever critiques what the student provided (the endpoint refuses to
	// invent details), so it's honest feedback, not fabrication.
	let {
		kind,
		title,
		description,
		placeholder,
		cta = 'Review it'
	}: {
		kind: 'rec_letter' | 'final_read';
		title: string;
		description: string;
		placeholder: string;
		cta?: string;
	} = $props();

	let content = $state('');
	let loading = $state(false);
	let error = $state('');
	let result = $state<{ summary: string; strengths: string[]; fixes: string[] } | null>(null);

	async function run() {
		if (loading) return;
		if (content.trim().length < 40) {
			error = 'Add a bit more first.';
			result = null;
			return;
		}
		loading = true;
		error = '';
		result = null;
		try {
			const res = await fetch('/api/ai/review', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ kind, content })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Review failed');
			result = {
				summary: data.summary,
				strengths: Array.isArray(data.strengths) ? data.strengths : [],
				fixes: Array.isArray(data.fixes) ? data.fixes : []
			};
		} catch (e: any) {
			error = e.message || 'Something went wrong. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
	<h1 class="font-display text-navy text-3xl md:text-4xl">{title}</h1>
	<p class="mt-2 leading-relaxed text-muted">{description}</p>

	<textarea
		bind:value={content}
		{placeholder}
		class="mt-6 h-56 w-full resize-y rounded-xl border-2 border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 outline-none transition focus:border-blue"
	></textarea>

	<div class="mt-3 flex flex-wrap items-center gap-3">
		<button onclick={run} disabled={loading} class="btn btn-primary">
			{loading ? 'Reading…' : cta}
		</button>
		{#if error}<span class="text-sm font-medium text-stamp-red">{error}</span>{/if}
	</div>

	{#if result}
		<div class="mt-8 space-y-6">
			<div class="pa-card p-5">
				<p class="text-[11px] font-bold uppercase tracking-wider text-muted">The verdict</p>
				<p class="mt-1.5 text-[15px] leading-relaxed text-ink">{result.summary}</p>
			</div>
			{#if result.strengths.length}
				<div>
					<h3 class="font-display text-navy text-lg">What's working</h3>
					<ul class="mt-2 space-y-1.5">
						{#each result.strengths as s}
							<li class="flex gap-2 text-sm leading-relaxed text-muted"><span class="text-blue">✓</span>{s}</li>
						{/each}
					</ul>
				</div>
			{/if}
			{#if result.fixes.length}
				<div>
					<h3 class="font-display text-navy text-lg">Fix these first</h3>
					<ol class="mt-2 list-inside list-decimal space-y-1.5">
						{#each result.fixes as f}
							<li class="text-sm leading-relaxed text-muted">{f}</li>
						{/each}
					</ol>
				</div>
			{/if}
		</div>
	{/if}
</div>
