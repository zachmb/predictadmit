<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import { portals } from '$lib/config/admitMail';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Card from '$lib/components/common/Card.svelte';
	import { fade } from 'svelte/transition';
	import { signIn } from '@auth/sveltekit/client';

	// --- TYPES ---
	interface ScoreDetail {
		score: number;
		explanation: string;
	}

	interface Essay {
		prompt: string | null;
		scores: Record<string, ScoreDetail>;
		average: number;
	}

	interface GradingResult {
		essays: Essay[];
	}

	// --- STATE & AUTH ---
	// Use $derived for values that change based on other stores/props
	const session = $derived($page.data.session);
	const googleSignedIn = $derived(!!session?.user);

	// Form inputs - Using $state for Svelte 5 reactivity
	let major = $state('');

	// School Pass holders can grade essays for their unlocked school(s) without Full Access.
	const passSchools = $derived(
		portals.filter((p) => ($userProfile.proSchools ?? []).includes(p.slug))
	);
	const graderUnlocked = $derived($userProfile.isPro || passSchools.length > 0);
	// Without Full Access, the school selector is limited to School Pass schools.
	const selectableSchools = $derived($userProfile.isPro ? portals : passSchools);

	// SAFETY FIX: Check if portals exists before accessing index 0
	let selectedSchool = $state(portals && portals.length > 0 ? portals[0].name : '');

	$effect(() => {
		if (!$userProfile.isPro && passSchools.length > 0 && !passSchools.some((p) => p.name === selectedSchool)) {
			selectedSchool = passSchools[0].name;
		}
	});

	let essayType = $state<'personal' | 'supplemental'>('personal');
	let content = $state('');
	let isAnalyzing = $state(false);
	let results = $state<GradingResult | null>(null);
	let currentEssayIndex = $state(0);
	let analysisStep = $state('');
	let progressPercent = $state(0);

	// --- LOGIC ---
	async function handleAnalyze() {
		if (!content || !major) return;

		isAnalyzing = true;
		analysisStep = 'Initializing...';
		progressPercent = 0;

		try {
			// Optimistic Progress Simulation
			const progressInterval = setInterval(() => {
				if (progressPercent < 90) progressPercent += 1;
			}, 100);

			analysisStep = 'Parsing Essay Structure...';
			await new Promise((r) => setTimeout(r, 800));

			analysisStep = 'Analyzing Institutional Alignment...';

			const res = await fetch('/essay-grader', {
				method: 'POST',
				body: JSON.stringify({ major, selectedSchool, essayType, content }),
				headers: { 'Content-Type': 'application/json' }
			});

			clearInterval(progressInterval);
			progressPercent = 100;
			analysisStep = 'Finalizing Report...';

			if (!res.ok) throw new Error('Grading failed');
			results = (await res.json()) as GradingResult;
		} catch (e) {
			console.error(e);
			alert('Analysis failed. Please try again.');
		} finally {
			isAnalyzing = false;
		}
	}

	function restart() {
		results = null;
		content = '';
		currentEssayIndex = 0;
	}

	const formatLabel = (str: string) => str.replace(/([A-Z])/g, ' $1').trim();
</script>

<div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
	<div
		class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-paper-deep rounded-full blur-[120px]"
	></div>
	<div
		class="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-paper-deep rounded-full blur-[120px]"
	></div>
</div>

<div class="max-w-6xl mx-auto p-6 pt-12 min-h-screen pb-32">
	<div class="flex items-center justify-center gap-2 mb-12">
		<div class="pa-inset p-1 flex gap-1">
			<button class="px-6 py-2 rounded-xl text-sm font-bold bg-card text-navy shadow-sm"
				>Essay Grader</button
			>
			<button
				onclick={() => goto('/ai')}
				class="px-6 py-2 rounded-xl text-sm font-bold text-muted hover:text-navy transition-colors italic"
				>AI Simulator</button
			>
		</div>
	</div>

	{#if !googleSignedIn}
		<div class="max-w-2xl mx-auto py-20 px-6">
			<Card
				class="pa-card relative overflow-hidden p-1"
			>
				<div
					class="relative z-10 text-center py-16 px-8 pa-inset"
				>
					<div
						class="w-20 h-20 bg-blue text-white rounded-3xl flex items-center justify-center mx-auto mb-8 border-2 border-navy transform -rotate-3 hover:rotate-0 transition-transform duration-500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path
								d="M7 11V7a5 5 0 0 1 10 0v4"
							/></svg
						>
					</div>
					<h2 class="text-3xl font-display text-navy tracking-tight mb-4">
						Sign in to grade your essay
					</h2>
					<p class="text-muted leading-relaxed max-w-sm mx-auto mb-10">
						The grader reads your draft and tells you what an admissions officer would think, then marks exactly what to fix.
					</p>
					<button
						onclick={() => signIn('google', { callbackUrl: '/ai' })}
						class="btn btn-primary group w-full max-w-xs mx-auto"
					>
						Continue with Google
					</button>
				</div>
			</Card>
		</div>
	{:else if !graderUnlocked}
		<div class="max-w-2xl mx-auto py-20 px-6">
			<Card
				class="pa-card relative overflow-hidden p-1"
			>
				<div
					class="relative z-10 text-center py-16 px-8 pa-inset"
				>
					<div
						class="w-20 h-20 bg-blue text-white rounded-3xl flex items-center justify-center mx-auto mb-8 border-2 border-navy transform rotate-3 hover:rotate-0 transition-transform duration-500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path
								d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
							/></svg
						>
					</div>
					<h2 class="text-3xl font-display text-navy tracking-tight mb-3">Read like an admissions officer would</h2>
					<p class="text-muted leading-relaxed max-w-sm mx-auto mb-6">
						Line-by-line notes on every supplement: the honest read a reader gives, with the weak lines marked and why. You write every word; it just makes them land.
					</p>
					<ul class="mx-auto mb-8 max-w-xs space-y-2 text-left">
						{#each ['10 inline annotations per draft', 'Blunt, specific AO-style critique', 'Targeted to each school you apply to'] as f}
							<li class="flex items-center gap-2.5 text-sm text-muted">
								<svg class="h-4 w-4 flex-none text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
								{f}
							</li>
						{/each}
					</ul>
					<button
						onclick={() => goto('/pro')}
						class="btn btn-primary group w-full max-w-xs mx-auto"
					>
						Unlock essay editing · $25 once
					</button>
					<p class="mt-3 text-xs text-muted">Your first prediction is free · then $25 once or $9.99/mo</p>
				</div>
			</Card>
		</div>
	{:else if results}
		<div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
			<div
				class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-navy pb-6"
			>
				<div>
					<h2 class="text-3xl font-display text-navy tracking-tight">Your read</h2>
					<p class="text-muted tracking-tight">
						Graded against <span class="text-navy font-semibold">{selectedSchool}</span> • {major}
					</p>
				</div>
				<button
					onclick={restart}
					class="btn btn-secondary text-sm"
				>
					New Analysis
				</button>
			</div>

			{#if results.essays[currentEssayIndex]}
				{@const essay = results.essays[currentEssayIndex]}
				{#key currentEssayIndex}
					<div in:fade={{ duration: 200 }}>
						<Card class="pa-card overflow-hidden p-0">
							<div class="bg-navy px-8 py-3 flex justify-between items-center">
								<div class="flex items-center gap-4">
									<span class="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">
										{essayType === 'supplemental'
											? `Supplemental Essay #${currentEssayIndex + 1} of ${results.essays.length}`
											: 'Personal Statement'}
									</span>
									{#if essayType === 'supplemental' && results.essays.length > 1}
										<div class="flex items-center gap-2 border-l border-white/20 ml-2 pl-4">
											<button
												disabled={currentEssayIndex === 0}
												onclick={() => currentEssayIndex--}
												class="text-white hover:text-cyan disabled:opacity-30 transition-colors"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="3"
													stroke-linecap="round"
													stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg
												>
											</button>
											<button
												disabled={currentEssayIndex === results.essays.length - 1}
												onclick={() => currentEssayIndex++}
												class="text-white hover:text-cyan disabled:opacity-30 transition-colors"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="3"
													stroke-linecap="round"
													stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
												>
											</button>
										</div>
									{/if}
								</div>
							</div>

							<div class="p-8 space-y-10">
								{#if essayType === 'supplemental' && essay.prompt}
									<div class="pa-inset p-4">
										<label
											class="block text-[10px] font-black text-muted uppercase tracking-widest mb-1"
											>Detected Prompt</label
										>
										<p class="text-sm text-navy italic">"{essay.prompt}"</p>
									</div>
								{/if}

								<div class="grid gap-10">
									{#each Object.entries(essay.scores) as [category, data]}
										<div class="group">
											<div class="flex justify-between items-end mb-3">
												<h4 class="text-xs font-black text-navy uppercase tracking-wider">
													{formatLabel(category)}
												</h4>
												<div class="flex items-baseline gap-1">
													<span class="text-2xl font-display text-blue tracking-tighter"
														>{data.score}</span
													>
													<span class="text-xs font-bold text-muted">/10</span>
												</div>
											</div>
											<div class="h-2 bg-paper-deep rounded-full overflow-hidden mb-4">
												<div
													class="h-full bg-blue transition-all duration-1000 ease-out"
													style="width: {data.score * 10}%"
												></div>
											</div>
											<div class="pa-inset relative p-4">
												<p class="text-[13px] text-muted leading-relaxed italic">
													"{data.explanation}"
												</p>
											</div>
										</div>
									{/each}
								</div>

								<div class="mt-8 pt-8 pa-rule-top flex items-center justify-between">
									<div class="flex items-center gap-4">
										<div
											class="min-w-[5rem] h-auto p-6 w-14 h-14 bg-blue rounded-2xl flex items-center justify-center text-white font-display text-2xl shadow-lg"
										>
											{essay.average}
										</div>
										<div>
											<p class="text-sm font-bold text-navy">Overall score</p>
											<p class="text-xs text-muted">
												Scored against the kind of applicant {selectedSchool} tends to admit.
											</p>
										</div>
									</div>
								</div>
							</div>
						</Card>
					</div>
				{/key}
			{/if}
		</div>
	{:else}
		<div class="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
			<header>
				<h1 class="text-4xl font-display text-navy tracking-tight mb-2">Essay Grader</h1>
				<p class="text-muted italic">
					"Paste a draft. Get the notes an admissions officer would scribble in the margin, with the weak lines marked and why."
				</p>
			</header>

			<Card class="pa-card p-8 space-y-8">
				<div class="grid md:grid-cols-2 gap-6">
					<div class="space-y-2">
						<label class="text-xs font-black uppercase tracking-widest text-muted"
							>Intended Major</label
						>
						<input
							bind:value={major}
							placeholder="e.g. Finance, Biology"
							class="w-full border-2 border-navy bg-card p-4 rounded-xl focus:border-blue outline-none transition-all"
						/>
					</div>
					<div class="space-y-2">
						<label class="text-xs font-black uppercase tracking-widest text-muted"
							>Target University</label
						>
						<select
							bind:value={selectedSchool}
							class="w-full border-2 border-navy bg-card p-4 rounded-xl focus:border-blue outline-none transition-all appearance-none"
						>
							{#each selectableSchools as school}
								<option value={school.name}>{school.name}</option>
							{/each}
						</select>
						{#if !$userProfile.isPro && passSchools.length > 0}
							<p class="text-[11px] text-muted">
								Your School Pass covers {passSchools.map((p) => p.name).join(', ')}. Full Access
								unlocks every school.
							</p>
						{/if}
					</div>
				</div>

				<div class="space-y-4">
					<label class="text-xs font-black uppercase tracking-widest text-muted"
						>Submission Type</label
					>
					<div class="grid grid-cols-2 gap-4">
						<button
							onclick={() => (essayType = 'personal')}
							class="py-4 border-2 rounded-xl font-bold transition-all {essayType === 'personal'
								? 'border-navy bg-navy text-white'
								: 'border-navy/20 text-muted hover:border-navy'}"
						>
							Common App Personal
						</button>
						<button
							onclick={() => (essayType = 'supplemental')}
							class="py-4 border-2 rounded-xl font-bold transition-all {essayType === 'supplemental'
								? 'border-navy bg-navy text-white'
								: 'border-navy/20 text-muted hover:border-navy'}"
						>
							School Supplements
						</button>
					</div>
				</div>

				<div class="space-y-2">
					<label class="text-xs font-black uppercase tracking-widest text-muted">
						{essayType === 'personal' ? 'Your Essay' : 'Paste Prompts & Responses'}
					</label>
					<textarea
						bind:value={content}
						rows="12"
						placeholder={essayType === 'personal'
							? 'Paste your 650-word statement here...'
							: 'Prompt 1: Why NYU?\nResponse: [Your text]\n\nPrompt 2: ...'}
						class="w-full border-2 border-navy bg-card p-6 rounded-xl focus:border-blue outline-none transition-all font-body text-lg leading-relaxed"
					></textarea>
				</div>

				{#if isAnalyzing}
					<div class="py-8 text-center space-y-4">
						<div class="relative h-24 w-24 mx-auto">
							<svg class="h-full w-full transform -rotate-90">
								<circle
									class="text-paper-deep"
									stroke-width="8"
									stroke="currentColor"
									fill="transparent"
									r="42"
									cx="48"
									cy="48"
								/>
								<circle
									class="text-blue transition-all duration-300 ease-out"
									stroke-width="8"
									stroke-dasharray={264}
									stroke-dashoffset={264 - (264 * progressPercent) / 100}
									stroke-linecap="round"
									stroke="currentColor"
									fill="transparent"
									r="42"
									cx="48"
									cy="48"
								/>
							</svg>
							<div class="absolute inset-0 flex items-center justify-center">
								<span class="text-xl font-display text-navy">{progressPercent}%</span>
							</div>
						</div>
						<p class="text-lg font-bold text-navy animate-pulse">{analysisStep}</p>
					</div>
				{:else}
					<button
						disabled={!major || !content}
						onclick={handleAnalyze}
						class="btn btn-primary btn-block text-xl disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Analyze My Essays
					</button>
				{/if}
			</Card>
		</div>
	{/if}
</div>
