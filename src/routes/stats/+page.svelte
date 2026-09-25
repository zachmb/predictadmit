<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import { userProfile } from '$lib/stores/user';
	import { aiResults } from '$lib/stores/results';
	import { majors } from '$lib/config/majors';
	import {
		computeAcademicIndex,
		computeExtracurricularScore,
		computeAllAiDecisions,
		hasEnoughToScore,
		type ScoringProfile
	} from '$lib/scoring/model';

	// Seed the form from the persisted stats profile so it's entered once and
	// reused across schools + visits.
	let stats = $state<ScoringProfile>({ ...$userProfile.stats });
	let name = $state($userProfile.name);

	// ---- Steps ----
	// 1: Academics (GPA + test) · 2: Rigor & trend · 3: Activities/awards/essay · 4: Major
	let step = $state(1);
	const totalSteps = 4;

	// Persist to the store on every change so nothing is lost between steps/visits.
	$effect(() => {
		userProfile.update((u) => ({ ...u, stats: { ...stats }, name }));
	});

	// Live preview of how the model reads the profile so far.
	let academicIndex = $derived(computeAcademicIndex(stats));
	let ecScore = $derived(computeExtracurricularScore(stats));
	let canScore = $derived(hasEnoughToScore(stats));

	// ---- Validation gates per step ----
	let step1Valid = $derived(
		(parseFloat(stats.gpaUnweighted) > 0 || parseFloat(stats.gpaWeighted) > 0) &&
			(parseFloat(stats.sat) > 0 || parseFloat(stats.act) > 0)
	);

	function clamp(v: string, min: number, max: number): string {
		if (v === '') return '';
		let n = Number(v);
		if (Number.isNaN(n)) return '';
		if (n < min) n = min;
		if (n > max) n = max;
		return String(n);
	}

	// Major autocomplete
	let showMajorDropdown = $state(false);
	let majorSuggestions = $derived(
		stats.major.length > 0
			? majors
					.filter((m) => m.toLowerCase().includes(stats.major.toLowerCase()) && m !== stats.major)
					.slice(0, 6)
			: []
	);

	function next() {
		if (step < totalSteps) step += 1;
	}
	function back() {
		if (step > 1) step -= 1;
	}

	// ---- Finish: compute deterministic decisions for every school and route
	// into the Portal Simulator, where the cinematic reveal plays the outcome. ----
	function finish() {
		if (!canScore) {
			step = 1;
			return;
		}
		// Make sure a login identity exists so every portal auto-logs in cleanly.
		userProfile.update((u) => {
			const slug = (name || u.name)
				.trim()
				.toLowerCase()
				.replace(/[^a-z0-9\s]/g, '')
				.replace(/\s+/g, '.');
			return {
				...u,
				name: name || u.name,
				email: u.email || (slug ? `${slug}@gmail.com` : ''),
				password: u.password || 'password123',
				usingAI: false
			};
		});

		const decisions = computeAllAiDecisions(stats);
		aiResults.setStatsDecisions(decisions);
		goto('/portals');
	}

	const rigorOptions = ['Regular', 'Honors', 'AP/IB'] as const;
	const trendOptions = ['Rising', 'Steady', 'Dipping'] as const;
	const lowestOptions = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'] as const;

	const stepTitles = ['Academics', 'Course rigor', 'Activities & essay', 'Intended major'];
</script>

<svelte:head>
	<title>Enter Your Stats · PredictAdmit</title>
</svelte:head>

<main class="min-h-screen pa-grid text-ink font-sans flex flex-col">
	<div class="flex-1">
		<div class="max-w-3xl mx-auto px-4 py-12 md:py-16">
			<!-- Header -->
			<header class="text-center mb-8">
				<span
					class="inline-flex items-center gap-2 px-3 py-1 bg-yellow text-navy text-xs font-bold tracking-wide"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-blue"></span>
					STEP {step} OF {totalSteps} · {stepTitles[step - 1].toUpperCase()}
				</span>
				<h1 class="mt-4 font-display text-navy text-3xl md:text-4xl">
					Tell us your academic profile
				</h1>
				<p class="mt-2 text-muted max-w-xl mx-auto">
					Predictions run off <strong>your</strong> actual numbers: GPA, tests, course rigor, activities. Nothing random. Enter it once and every school reuses it.
				</p>
			</header>

			<!-- Progress bar -->
			<div class="mb-8">
				<div class="h-2 w-full rounded-full bg-paper-deep overflow-hidden">
					<div
						class="h-full rounded-full transition-all duration-500 bg-blue"
						style="width:{(step / totalSteps) * 100}%"
					></div>
				</div>
			</div>

			<!-- Card -->
			<div class="pa-card p-6 md:p-8">
				{#key step}
					<div in:fly={{ y: 12, duration: 250 }}>
						{#if step === 1}
							<!-- ACADEMICS -->
							<div class="space-y-6">
								<div>
									<label for="s-name" class="block text-sm font-bold text-navy mb-1.5"
										>Your name</label
									>
									<input
										id="s-name"
										type="text"
										bind:value={name}
										placeholder="e.g. Jordan Lee"
										class="w-full rounded-lg border-2 border-navy bg-card px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue"
									/>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label for="s-ugpa" class="block text-sm font-bold text-navy mb-1.5"
											>Unweighted GPA <span class="text-muted font-normal">(0–4.0)</span></label
										>
										<input
											id="s-ugpa"
											type="number"
											step="0.01"
											min="0"
											max="4"
											bind:value={stats.gpaUnweighted}
											oninput={(e) =>
												(stats.gpaUnweighted = clamp(e.currentTarget.value, 0, 4))}
											placeholder="e.g. 3.9"
											class="w-full rounded-lg border-2 border-navy bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue"
										/>
									</div>
									<div>
										<label for="s-wgpa" class="block text-sm font-bold text-navy mb-1.5"
											>Weighted GPA <span class="text-muted font-normal">(optional)</span></label
										>
										<input
											id="s-wgpa"
											type="number"
											step="0.01"
											min="0"
											max="5"
											bind:value={stats.gpaWeighted}
											oninput={(e) => (stats.gpaWeighted = clamp(e.currentTarget.value, 0, 5))}
											placeholder="e.g. 4.4"
											class="w-full rounded-lg border-2 border-navy bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue"
										/>
									</div>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label for="s-sat" class="block text-sm font-bold text-navy mb-1.5"
											>SAT <span class="text-muted font-normal">(400–1600)</span></label
										>
										<input
											id="s-sat"
											type="number"
											min="400"
											max="1600"
											bind:value={stats.sat}
											oninput={(e) => (stats.sat = clamp(e.currentTarget.value, 400, 1600))}
											placeholder="e.g. 1500"
											class="w-full rounded-lg border-2 border-navy bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue"
										/>
									</div>
									<div>
										<label for="s-act" class="block text-sm font-bold text-navy mb-1.5"
											>ACT <span class="text-muted font-normal">(1–36, if no SAT)</span></label
										>
										<input
											id="s-act"
											type="number"
											min="1"
											max="36"
											bind:value={stats.act}
											oninput={(e) => (stats.act = clamp(e.currentTarget.value, 1, 36))}
											placeholder="e.g. 34"
											class="w-full rounded-lg border-2 border-navy bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue"
										/>
									</div>
								</div>
								{#if !step1Valid}
									<p class="text-xs text-muted">
										Enter at least a GPA and one test score to continue.
									</p>
								{/if}
							</div>
						{:else if step === 2}
							<!-- RIGOR & TREND -->
							<div class="space-y-6">
								<div>
									<span class="block text-sm font-bold text-navy mb-2">Course rigor</span>
									<div class="flex flex-wrap gap-2">
										{#each rigorOptions as opt}
											<button
												type="button"
												onclick={() => (stats.rigor = opt)}
												class="px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-colors {stats.rigor ===
												opt
													? 'bg-navy text-white border-navy'
													: 'bg-card text-navy border-navy hover:bg-paper-deep'}"
											>
												{opt}
											</button>
										{/each}
									</div>
								</div>
								<div>
									<span class="block text-sm font-bold text-navy mb-2">Grade trend</span>
									<div class="flex flex-wrap gap-2">
										{#each trendOptions as opt}
											<button
												type="button"
												onclick={() => (stats.gradeTrend = opt)}
												class="px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-colors {stats.gradeTrend ===
												opt
													? 'bg-navy text-white border-navy'
													: 'bg-card text-navy border-navy hover:bg-paper-deep'}"
											>
												{opt}
											</button>
										{/each}
									</div>
								</div>
								<div>
									<label for="s-low" class="block text-sm font-bold text-navy mb-2"
										>Lowest grade received</label
									>
									<select
										id="s-low"
										bind:value={stats.lowestGrade}
										class="w-full sm:w-48 rounded-lg border-2 border-navy bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue"
									>
										{#each lowestOptions as g}
											<option value={g}>{g}</option>
										{/each}
									</select>
								</div>
							</div>
						{:else if step === 3}
							<!-- ACTIVITIES / AWARDS / ESSAY -->
							<div class="space-y-6">
								<div>
									<label for="s-acts" class="block text-sm font-bold text-navy mb-1.5"
										>Activities / résumé</label
									>
									<textarea
										id="s-acts"
										rows="5"
										bind:value={stats.activities}
										placeholder="List clubs, jobs, projects. Include role, organization, and impact for each. Leadership and state/national scope help most."
										class="w-full rounded-lg border-2 border-navy bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue"
									></textarea>
								</div>
								<div>
									<label for="s-awards" class="block text-sm font-bold text-navy mb-1.5"
										>Honors & awards</label
									>
									<textarea
										id="s-awards"
										rows="3"
										bind:value={stats.awards}
										placeholder="Competitions, scholarships, distinctions, with the level for each (school / state / national)."
										class="w-full rounded-lg border-2 border-navy bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue"
									></textarea>
								</div>
								<div>
									<label for="s-essay" class="block text-sm font-bold text-navy mb-1.5"
										>Personal essay <span class="text-muted font-normal">(optional)</span></label
									>
									<textarea
										id="s-essay"
										rows="4"
										bind:value={stats.essay}
										placeholder="Paste your personal statement draft here."
										class="w-full rounded-lg border-2 border-navy bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue"
									></textarea>
								</div>
							</div>
						{:else if step === 4}
							<!-- MAJOR -->
							<div class="space-y-6">
								<div class="relative">
									<label for="s-major" class="block text-sm font-bold text-navy mb-1.5"
										>Intended major</label
									>
									<input
										id="s-major"
										type="text"
										bind:value={stats.major}
										placeholder="e.g. Computer Science"
										onfocus={() => (showMajorDropdown = true)}
										onblur={() => setTimeout(() => (showMajorDropdown = false), 150)}
										class="w-full rounded-lg border-2 border-navy bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue"
									/>
									{#if showMajorDropdown && majorSuggestions.length > 0}
										<div
											class="absolute top-full left-0 right-0 mt-1 bg-card border-2 border-navy rounded-lg z-50 overflow-hidden"
										>
											{#each majorSuggestions as m}
												<button
													type="button"
													onclick={() => {
														stats.major = m;
														showMajorDropdown = false;
													}}
													class="w-full text-left px-4 py-2.5 text-sm text-navy hover:bg-paper-deep border-b border-navy/10 last:border-0"
												>
													{m}
												</button>
											{/each}
										</div>
									{/if}
								</div>

								<!-- Live model read-out -->
								<div class="pa-inset p-5">
									<h3 class="text-sm font-bold text-navy mb-3">How the model reads you so far</h3>
									<div class="grid grid-cols-2 gap-4">
										<div>
											<div class="text-xs text-muted mb-1">Academic Index</div>
											<div class="font-display text-2xl text-navy">
												{academicIndex}<span class="text-sm text-muted font-semibold"> / 240</span>
											</div>
										</div>
										<div>
											<div class="text-xs text-muted mb-1">Activity strength</div>
											<div class="font-display text-2xl text-navy">
												{ecScore}<span class="text-sm text-muted font-semibold"> / 10</span>
											</div>
										</div>
									</div>
									<p class="mt-3 text-xs text-muted">
										These get compared against each school's selectivity to produce a
										decision. It's an estimate, not a real outcome. Same stats in, same
										result out.
									</p>
								</div>
							</div>
						{/if}
					</div>
				{/key}

				<!-- Nav buttons -->
				<div class="mt-8 flex items-center justify-between">
					<button
						type="button"
						onclick={back}
						disabled={step === 1}
						class="btn btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
					>
						Back
					</button>

					{#if step < totalSteps}
						<button
							type="button"
							onclick={next}
							disabled={step === 1 && !step1Valid}
							class="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
						>
							Continue
						</button>
					{:else}
						<button
							type="button"
							onclick={finish}
							disabled={!canScore}
							class="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
						>
							See my decisions →
						</button>
					{/if}
				</div>
			</div>

			<p class="mt-6 text-center text-xs text-muted max-w-lg mx-auto">
				Everything stays in your browser. This is an independent educational simulation and is not
				affiliated with any college.
			</p>
		</div>
	</div>

	<SiteFooter />
</main>
