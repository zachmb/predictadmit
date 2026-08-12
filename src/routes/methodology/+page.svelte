<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import {
		admissionFactors,
		factorScore,
		dimensionWeights,
		GPA_WEIGHT,
		TEST_WEIGHT,
		NACAC_SOURCE
	} from '$lib/config/admissionFactors';

	const sortedFactors = [...admissionFactors].sort((a, b) => factorScore(b) - factorScore(a));
	const maxScore = factorScore(sortedFactors[0]);

	const dimensionLabels: Record<string, { label: string; covers: string }> = {
		academic: {
			label: 'Academic',
			covers: 'Grades in college-prep courses, all-course grades, curriculum strength, class rank, SAT/ACT, AP/IB and state exams'
		},
		character: {
			label: 'Character',
			covers: 'Positive character attributes, counselor and teacher recommendations'
		},
		extracurricular: {
			label: 'Extracurricular',
			covers: 'Extracurricular activities, work experience, portfolio'
		},
		fit: {
			label: 'Fit',
			covers: "Student's demonstrated interest in attending, interview"
		},
		intellectual: {
			label: 'Intellectual',
			covers: 'Essay or writing sample'
		}
	};

	const dims = Object.entries(dimensionWeights)
		.sort(([, a], [, b]) => b - a)
		.map(([key, w]) => ({ ...dimensionLabels[key], weight: Math.round(w * 100) }));

	const pct = (n: number) => `${n.toFixed(1)}%`;
</script>

<svelte:head>
	<title>Methodology — Where PredictAdmit's predictions come from</title>
	<meta
		name="description"
		content="PredictAdmit's factor weights come from NACAC's Factors in the Admission Decision survey, then calibrated against HYPSM and Top-20 admitted-student profiles from the 2026 cycle and our own team's results."
	/>
</svelte:head>

<main class="min-h-screen bg-white font-sans text-slate-900">
	<!-- Hero -->
	<section class="border-b border-slate-100">
		<div class="max-w-3xl mx-auto px-6 py-20 md:py-28">
			<p
				class="inline-block mb-6 text-xs font-semibold tracking-widest uppercase text-[#0052CC] bg-[#0052CC]/10 px-3 py-1 rounded-full"
			>
				Methodology
			</p>
			<h1 class="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 text-balance">
				Where our predictions come from
			</h1>
			<p class="text-lg text-slate-500 leading-relaxed">
				We don't guess how much each part of your application counts. The factor weights come from
				NACAC's national survey of what colleges themselves say drives their decisions. We then
				calibrate those weights against admitted-student profiles from HYPSM and Top-20 universities
				in the 2026 cycle — and against our own founding team's results.
			</p>
		</div>
	</section>

	<!-- What is NACAC -->
	<section class="max-w-3xl mx-auto px-6 py-16">
		<h2 class="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-4">
			Our primary source: NACAC
		</h2>
		<p class="text-slate-600 leading-relaxed mb-4">
			The <strong>National Association for College Admission Counseling (NACAC)</strong>, founded in
			1937, is a nonprofit association of more than 28,000 admission officers, school counselors,
			and enrollment professionals worldwide — the professional body for the people who actually
			read applications and make admission decisions.
		</p>
		<p class="text-slate-600 leading-relaxed mb-4">
			As part of its <em>State of College Admission Report</em>, NACAC asks its member four-year
			colleges how much weight they put on each factor in the admission decision. The most recent
			factor survey ({NACAC_SOURCE.cycle}, {NACAC_SOURCE.sampleSize} colleges) is what our weighting
			is built on. It is about as close as you can get to admission officers, in aggregate, telling
			you what actually moves a decision.
		</p>
		<p class="text-slate-600 leading-relaxed">
			The headline finding barely changes year to year: <strong>grades in college-prep courses and
			the strength of your curriculum outweigh everything else</strong> — test scores, essays,
			recommendations, extracurriculars, all of it.
		</p>
	</section>

	<!-- Factor table -->
	<section class="bg-slate-50 border-y border-slate-100 py-16">
		<div class="max-w-4xl mx-auto px-6">
			<h2 class="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
				What colleges say matters
			</h2>
			<p class="text-sm text-slate-500 mb-8">
				Percentage of NACAC member four-year colleges attributing each level of importance to
				factors in admission decisions — first-time freshmen, {NACAC_SOURCE.cycle}.
			</p>

			<div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
							<th class="px-4 py-3">Factor</th>
							<th class="px-4 py-3 text-right">Considerable</th>
							<th class="px-4 py-3 text-right hidden sm:table-cell">Moderate</th>
							<th class="px-4 py-3 text-right hidden md:table-cell">Limited</th>
							<th class="px-4 py-3 text-right hidden md:table-cell">None</th>
							<th class="px-4 py-3 w-32 hidden sm:table-cell">Weight signal</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#each sortedFactors as f}
							<tr>
								<td class="px-4 py-3 font-medium text-slate-900">{f.label}</td>
								<td class="px-4 py-3 text-right font-semibold text-[#0052CC]">{pct(f.considerable)}</td>
								<td class="px-4 py-3 text-right text-slate-600 hidden sm:table-cell">{pct(f.moderate)}</td>
								<td class="px-4 py-3 text-right text-slate-600 hidden md:table-cell">{pct(f.limited)}</td>
								<td class="px-4 py-3 text-right text-slate-600 hidden md:table-cell">{pct(f.none)}</td>
								<td class="px-4 py-3 hidden sm:table-cell">
									<div class="h-2 rounded-full bg-slate-100">
										<div
											class="h-2 rounded-full bg-[#0052CC]"
											style="width: {(factorScore(f) / maxScore) * 100}%"
										></div>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<p class="mt-4 text-xs text-slate-400">
				Source: {NACAC_SOURCE.org}, "{NACAC_SOURCE.report}." The weight signal collapses the four
				columns into one score (considerable counted fully, moderate half, limited a quarter).
			</p>
		</div>
	</section>

	<!-- How we use it -->
	<section class="max-w-3xl mx-auto px-6 py-16">
		<h2 class="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-4">
			How the table becomes our formulas
		</h2>
		<div class="space-y-6 text-slate-600 leading-relaxed">
			<p>
				<strong class="text-slate-900">Academic index.</strong> Your academic index (0–100) blends
				weighted GPA and SAT/ACT. We didn't pick the split by feel — it drops straight out of the
				table. Grades and curriculum strength against admission tests lands at roughly
				<strong>{Math.round(GPA_WEIGHT * 100)}% grades &amp; rigor / {Math.round(TEST_WEIGHT * 100)}%
				test scores</strong>.
			</p>
			<p>
				<strong class="text-slate-900">Holistic read.</strong> The AI read scores five dimensions.
				Each one pools the NACAC factors it covers, and how much it counts toward your overall read
				is that pool's share of the table:
			</p>
			<div class="space-y-3">
				{#each dims as d}
					<div class="rounded-xl border border-slate-100 bg-slate-50 p-4">
						<div class="flex items-center justify-between mb-1">
							<span class="font-semibold text-slate-900">{d.label}</span>
							<span class="font-bold text-[#0052CC]">~{d.weight}%</span>
						</div>
						<div class="mb-2 h-2 rounded-full bg-slate-200">
							<div class="h-2 rounded-full bg-[#0052CC]" style="width: {d.weight}%"></div>
						</div>
						<p class="text-xs text-slate-500">{d.covers}</p>
					</div>
				{/each}
			</div>
			<p>
				<strong class="text-slate-900">Chance estimates &amp; reach/target/safety.</strong> We hold
				your academic index up against each school's selectivity to get a chance estimate and a
				reach/target/safety label. Same NACAC weighting behind it, whether you're looking at the
				chances predictor or the counselor's advice.
			</p>
		</div>
	</section>

	<!-- Calibration -->
	<section class="bg-slate-50 border-y border-slate-100 py-16">
		<div class="max-w-3xl mx-auto px-6">
			<h2 class="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-4">
				Calibrated on HYPSM &amp; Top-20 admits, 2026 cycle
			</h2>
			<div class="space-y-4 text-slate-600 leading-relaxed">
				<p>
					NACAC's survey spans four-year colleges at every selectivity level, and NACAC itself says
					factor importance shifts by institution type. We care about highly selective admissions,
					so we calibrate the NACAC-derived weights against
					<strong>admitted-student profiles from HYPSM (Harvard, Yale, Princeton, Stanford, MIT)
					and Top-20 universities in the 2026 cycle</strong>, plus our own founding team's results.
				</p>
				<p>
					That's why our school baselines — average SAT/ACT and weighted GPA of admits, acceptance
					rates — track the current cycle. It's also why academics act as a gate at the top: at
					those schools near-perfect grades and rigor are just the price of entry, and it's
					character, essays, and a real extracurricular spike that separate the applicants who
					already cleared the bar.
				</p>
			</div>
		</div>
	</section>

	<!-- Honest limits -->
	<section class="max-w-3xl mx-auto px-6 py-16">
		<h2 class="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-4">Honest limits</h2>
		<ul class="space-y-3 text-slate-600 leading-relaxed list-disc pl-5">
			<li>
				Predictions are <strong>estimates, not promises</strong>. No model can guarantee an
				admission outcome, and a real committee weighs context — a compelling backstory, a program's
				needs that year — that a simulator never sees.
			</li>
			<li>
				NACAC is an independent professional association. It is
				<strong>not affiliated with PredictAdmit and does not endorse</strong> this site. We just
				build on its published survey findings.
			</li>
			<li>
				School stats are approximate public figures for the 2026 cycle, used to make the simulation
				feel real.
			</li>
		</ul>
		<div class="mt-10 flex flex-col sm:flex-row gap-3">
			<a
				href="/pro"
				class="inline-flex items-center justify-center font-semibold text-sm bg-[#0052CC] text-white px-8 py-3.5 rounded-lg hover:bg-[#003d99] transition-colors shadow-lg shadow-[#0052CC]/20"
			>
				See your chances →
			</a>
			<a
				href="/about"
				class="inline-flex items-center justify-center font-semibold text-sm bg-white text-slate-900 px-8 py-3.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
			>
				About PredictAdmit
			</a>
		</div>
	</section>

	<SiteFooter />
</main>
