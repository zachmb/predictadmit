<script lang="ts">
	import { browser } from '$app/environment';
	import { userProfile } from '$lib/stores/user';

	const ACADEMICS_KEY = 'predictadmit:pro:academics';

	type Academics = {
		sat: number | '';
		act: number | '';
		weightedGpa: number | '';
		unweightedGpa: number | '';
	};

	let {
		onClose,
		onSaved
	}: {
		onClose: () => void;
		onSaved?: (academics: Academics) => void;
	} = $props();

	// Prefill from whatever is already saved so the wizard doubles as an editor.
	function loadAcademics(): Academics {
		const empty: Academics = { sat: '', act: '', weightedGpa: '', unweightedGpa: '' };
		if (!browser) return empty;
		try {
			const raw = window.localStorage.getItem(ACADEMICS_KEY);
			if (!raw) return empty;
			const parsed = JSON.parse(raw);
			const num = (v: unknown) => (v === '' || v == null ? '' : Number(v));
			return {
				sat: num(parsed.sat),
				act: num(parsed.act),
				weightedGpa: num(parsed.weightedGpa),
				unweightedGpa: num(parsed.unweightedGpa)
			} as Academics;
		} catch {
			return empty;
		}
	}

	let academics = $state<Academics>(loadAcademics());
	let rigor = $state($userProfile.applicationProfile.rigor || '');
	let activities = $state($userProfile.applicationProfile.activities || '');
	let awards = $state($userProfile.applicationProfile.awards || '');

	const RIGOR_OPTIONS = [
		'Most demanding available',
		'Very demanding',
		'Demanding',
		'Standard'
	];

	const steps = [
		{ title: 'Your GPA', blurb: 'The single biggest input to every prediction.' },
		{ title: 'Test scores', blurb: 'SAT or ACT — add whichever you have (or skip).' },
		{ title: 'Course rigor', blurb: 'How demanding is your schedule vs. what your school offers?' },
		{ title: 'Activities', blurb: 'One per line — clubs, sports, jobs, projects.' },
		{ title: 'Awards & honors', blurb: 'One per line — school, regional, or national.' }
	] as const;

	let step = $state(0);
	const isLast = $derived(step === steps.length - 1);

	function save() {
		if (browser) {
			try {
				window.localStorage.setItem(ACADEMICS_KEY, JSON.stringify(academics));
			} catch {
				/* ignore */
			}
		}
		userProfile.update((u) => ({
			...u,
			applicationProfile: {
				...u.applicationProfile,
				gpa: academics.unweightedGpa === '' ? u.applicationProfile.gpa : String(academics.unweightedGpa),
				rigor,
				activities,
				awards
			}
		}));
		onSaved?.(academics);
		onClose();
	}

	function next() {
		if (isLast) save();
		else step += 1;
	}
</script>

<div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
	<div
		class="absolute inset-0 bg-black/40 backdrop-blur-sm"
		onclick={onClose}
		role="presentation"
	></div>

	<div class="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
		<!-- Progress -->
		<div class="flex items-center justify-between">
			<p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
				Step {step + 1} of {steps.length}
			</p>
			<button
				type="button"
				onclick={onClose}
				aria-label="Close"
				class="text-slate-400 transition-colors hover:text-slate-600"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
					><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg
				>
			</button>
		</div>
		<div class="mt-3 flex gap-1.5">
			{#each steps as _, i}
				<div
					class="h-1.5 flex-1 rounded-full transition-colors"
					style="background-color: {i <= step ? '#0052CC' : '#e2e8f0'};"
				></div>
			{/each}
		</div>

		<h2 class="mt-5 text-xl font-bold text-slate-900">{steps[step].title}</h2>
		<p class="mt-1 text-sm text-slate-500">{steps[step].blurb}</p>

		<div class="mt-5 min-h-[152px]">
			{#if step === 0}
				<div class="grid grid-cols-2 gap-3">
					<label class="block">
						<span class="text-xs font-semibold text-slate-600">Unweighted GPA</span>
						<input
							type="number"
							min="0"
							max="4"
							step="0.01"
							placeholder="3.85"
							bind:value={academics.unweightedGpa}
							class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-500/20"
						/>
					</label>
					<label class="block">
						<span class="text-xs font-semibold text-slate-600">Weighted GPA</span>
						<input
							type="number"
							min="0"
							max="6"
							step="0.01"
							placeholder="4.3"
							bind:value={academics.weightedGpa}
							class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-500/20"
						/>
					</label>
				</div>
			{:else if step === 1}
				<div class="grid grid-cols-2 gap-3">
					<label class="block">
						<span class="text-xs font-semibold text-slate-600">SAT (400–1600)</span>
						<input
							type="number"
							min="400"
							max="1600"
							step="10"
							placeholder="1450"
							bind:value={academics.sat}
							class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-500/20"
						/>
					</label>
					<label class="block">
						<span class="text-xs font-semibold text-slate-600">ACT (1–36)</span>
						<input
							type="number"
							min="1"
							max="36"
							placeholder="32"
							bind:value={academics.act}
							class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-500/20"
						/>
					</label>
				</div>
			{:else if step === 2}
				<div class="space-y-2">
					{#each RIGOR_OPTIONS as option}
						<button
							type="button"
							onclick={() => (rigor = option)}
							class="w-full rounded-lg border px-4 py-2.5 text-left text-sm font-semibold transition-colors {rigor ===
							option
								? 'border-[#0052CC] bg-blue-50 text-[#0052CC]'
								: 'border-slate-200 text-slate-600 hover:bg-slate-50'}"
						>
							{option}
						</button>
					{/each}
				</div>
			{:else if step === 3}
				<textarea
					bind:value={activities}
					rows="6"
					placeholder="Debate Club — Captain&#10;Varsity Soccer — Starter&#10;Part-time job at local cafe"
					class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-500/20"
				></textarea>
			{:else}
				<textarea
					bind:value={awards}
					rows="6"
					placeholder="National Merit Semifinalist&#10;AP Scholar with Distinction"
					class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-500/20"
				></textarea>
			{/if}
		</div>

		<div class="mt-6 flex items-center justify-between">
			{#if step > 0}
				<button
					type="button"
					onclick={() => (step -= 1)}
					class="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
				>
					Back
				</button>
			{:else}
				<span></span>
			{/if}
			<button
				type="button"
				onclick={next}
				class="rounded-lg px-6 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
				style="background-color:#0052CC;"
			>
				{isLast ? 'Save my stats' : 'Next'}
			</button>
		</div>
	</div>
</div>
