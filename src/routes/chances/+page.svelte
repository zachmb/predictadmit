<script lang="ts">
	// FREE, no-signup, instant college chances calculator — the top-of-funnel lead
	// magnet. Runs the deterministic stats model entirely client-side (zero AI cost,
	// no account), shows odds at 39 top schools bucketed Likely/Target/Reach/Hard
	// reach, then converts to the paid AI funnel. SEO-prerendered + shareable.
	import { computeAllDecisions, emptyScoringProfile, type ScoringProfile } from '$lib/scoring/model';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import { track } from '$lib/analytics';

	let gpa = $state('');
	let testType = $state<'SAT' | 'ACT'>('SAT');
	let testScore = $state('');
	let rigor = $state<'Regular' | 'Honors' | 'AP/IB'>('AP/IB');
	let activities = $state('');
	let major = $state('');

	type Row = { slug: string; school: string; odds: number };
	let results = $state<Row[] | null>(null);
	let error = $state('');

	const buckets = [
		{ key: 'Likely', min: 45, tone: 'emerald', label: 'Likely (45%+)' },
		{ key: 'Target', min: 25, tone: 'blue', label: 'Target (25–44%)' },
		{ key: 'Reach', min: 12, tone: 'amber', label: 'Reach (12–24%)' },
		{ key: 'Hard reach', min: 0, tone: 'rose', label: 'Hard reach (<12%)' }
	];
	const toneBar: Record<string, string> = {
		emerald: 'bg-emerald-500',
		blue: 'bg-[#0052CC]',
		amber: 'bg-amber-500',
		rose: 'bg-rose-500'
	};
	const toneChip: Record<string, string> = {
		emerald: 'text-emerald-700',
		blue: 'text-[#0052CC]',
		amber: 'text-amber-700',
		rose: 'text-rose-700'
	};

	function bucketFor(odds: number) {
		return buckets.find((b) => odds >= b.min) ?? buckets[buckets.length - 1];
	}
	const grouped = $derived(
		results
			? buckets.map((b) => ({
					...b,
					rows: results!
						.filter((r) => bucketFor(r.odds).key === b.key)
						.sort((a, z) => z.odds - a.odds)
				}))
			: []
	);

	function calculate() {
		error = '';
		if (!gpa.trim()) {
			error = 'Add your unweighted GPA to start.';
			return;
		}
		const profile: ScoringProfile = {
			...emptyScoringProfile,
			gpaUnweighted: gpa,
			sat: testType === 'SAT' ? testScore : '',
			act: testType === 'ACT' ? testScore : '',
			rigor,
			activities,
			awards: '',
			major
		};
		results = computeAllDecisions(profile).map((d) => ({ slug: d.slug, school: d.school, odds: d.odds }));
		track('free_chances_calculated', { gpa, test: testType, score: testScore });
		requestAnimationFrame(() =>
			document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
		);
	}
</script>

<svelte:head>
	<title>Free College Chances Calculator — Your Odds at 39 Top Schools | PredictAdmit</title>
	<meta
		name="description"
		content="Free college chances calculator — no sign-up. Enter your GPA, test score, and activities to see your admission odds at Harvard, Stanford, MIT and 36 other top schools in seconds, sorted into likely, target, and reach."
	/>
	<link rel="canonical" href="https://predictadmit.com/chances" />
	<meta property="og:title" content="Free College Chances Calculator — Your Odds at 39 Top Schools" />
	<meta property="og:description" content="See your admission odds at 39 top schools in seconds. No sign-up." />
	<meta property="og:url" content="https://predictadmit.com/chances" />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "PredictAdmit Chances Calculator",
			"applicationCategory": "EducationApplication",
			"offers": { "@type": "Offer", "price": "0" },
			"description": "Free college admissions chances calculator for 39 top US universities."
		}
	</script>
</svelte:head>

<main class="min-h-screen bg-slate-50 text-slate-900">
	<div class="mx-auto max-w-2xl px-5 py-14 sm:py-20">
		<header class="text-center">
			<div class="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5">
				<span class="h-1.5 w-1.5 rounded-full bg-[#0052CC]"></span>
				<span class="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0052CC]">Free · No sign-up</span>
			</div>
			<h1 class="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
				College Chances Calculator
			</h1>
			<p class="mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg">
				See your admission odds at <span class="font-semibold text-slate-700">39 top schools</span> in
				about 10 seconds. No account, no credit card — just the math.
			</p>
		</header>

		<!-- Form -->
		<div class="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
			<div class="grid gap-5 sm:grid-cols-2">
				<div>
					<label for="c-gpa" class="block text-xs font-bold uppercase tracking-wide text-slate-500">Unweighted GPA</label>
					<input id="c-gpa" bind:value={gpa} inputmode="decimal" placeholder="3.9" class="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#0052CC] focus:ring-4 focus:ring-blue-600/10" />
				</div>
				<div>
					<span class="block text-xs font-bold uppercase tracking-wide text-slate-500">Test score</span>
					<div class="mt-1.5 flex gap-2">
						<div class="flex rounded-xl border border-slate-200 p-0.5">
							{#each ['SAT', 'ACT'] as t}
								<button type="button" onclick={() => (testType = t as 'SAT' | 'ACT')} class="rounded-lg px-3 py-2 text-xs font-bold transition {testType === t ? 'bg-[#0052CC] text-white' : 'text-slate-500'}">{t}</button>
							{/each}
						</div>
						<input bind:value={testScore} inputmode="numeric" placeholder={testType === 'SAT' ? '1500' : '34'} class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#0052CC] focus:ring-4 focus:ring-blue-600/10" />
					</div>
				</div>
				<div>
					<label for="c-rigor" class="block text-xs font-bold uppercase tracking-wide text-slate-500">Course rigor</label>
					<select id="c-rigor" bind:value={rigor} class="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#0052CC] focus:ring-4 focus:ring-blue-600/10">
						<option value="AP/IB">Most rigorous (many APs/IB)</option>
						<option value="Honors">Honors-heavy</option>
						<option value="Regular">Mostly regular</option>
					</select>
				</div>
				<div>
					<label for="c-major" class="block text-xs font-bold uppercase tracking-wide text-slate-500">Intended major</label>
					<input id="c-major" bind:value={major} placeholder="Computer Science" class="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#0052CC] focus:ring-4 focus:ring-blue-600/10" />
				</div>
			</div>
			<div class="mt-5">
				<label for="c-acts" class="block text-xs font-bold uppercase tracking-wide text-slate-500">Top activities & awards <span class="font-normal normal-case text-slate-400">(optional, boosts accuracy)</span></label>
				<textarea id="c-acts" bind:value={activities} placeholder="e.g. Robotics captain — state finals · Research intern · Varsity soccer" class="mt-1.5 h-20 w-full resize-y rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#0052CC] focus:ring-4 focus:ring-blue-600/10"></textarea>
			</div>
			<button onclick={calculate} class="mt-5 w-full rounded-2xl bg-[#0052CC] px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#0047b3] active:scale-[0.99]">
				Calculate my chances →
			</button>
			{#if error}<p class="mt-3 text-center text-sm font-semibold text-rose-600">{error}</p>{/if}
			<p class="mt-3 text-center text-[11px] text-slate-400">A statistical estimate from NACAC factor weights. Not an official decision.</p>
		</div>

		{#if results}
			<div id="results" class="mt-8 scroll-mt-6 space-y-6">
				{#each grouped as g}
					{#if g.rows.length}
						<div>
							<h2 class="mb-2 text-sm font-black uppercase tracking-wide {toneChip[g.tone]}">{g.label} · {g.rows.length}</h2>
							<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
								{#each g.rows as r}
									<div class="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0">
										<span class="w-40 shrink-0 truncate text-sm font-semibold text-slate-800">{r.school}</span>
										<div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
											<div class="h-full rounded-full {toneBar[g.tone]}" style="width: {Math.max(4, r.odds)}%"></div>
										</div>
										<span class="w-10 shrink-0 text-right text-sm font-black tabular-nums text-slate-900">{r.odds}%</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				{/each}

				<!-- Conversion to the real (AI) product -->
				<div class="rounded-3xl bg-[#0052CC] p-6 text-center text-white sm:p-8">
					<h3 class="text-xl font-black sm:text-2xl">That's the fast math. Want the real read?</h3>
					<p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-blue-100">
						This calculator uses your stats alone. PredictAdmit's AI reads your <span class="font-semibold text-white">actual essays and activities</span> and calls your decision — accept, deny, or waitlist — school by school. Your first prediction is free.
					</p>
					<a href="/ai" onclick={() => track('chances_to_ai_click')} class="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-bold text-[#0052CC] transition hover:bg-blue-50 active:scale-[0.99]">
						Run my real prediction — free →
					</a>
				</div>
			</div>
		{/if}
	</div>
	<SiteFooter />
</main>
