<script lang="ts">
	import { userProfile, type TrackedSchool } from '$lib/stores/user';
	import Button from '$lib/components/common/Button.svelte';

	let selectedSchoolSlug = '';
	let newPrompt = '';
	let isAnalyzing = false;

	$: school = $userProfile.schoolList.find((s) => s.slug === selectedSchoolSlug);

	$: if ($userProfile.schoolList.length > 0 && !selectedSchoolSlug) {
		selectedSchoolSlug = $userProfile.schoolList[0].slug;
	}

	const addSupplement = () => {
		if (!school || !newPrompt.trim()) return;

		userProfile.update((u) => ({
			...u,
			schoolList: u.schoolList.map((s) =>
				s.slug === school?.slug
					? {
							...s,
							supplements: [
								...s.supplements,
								{ prompt: newPrompt, draft: '', aiFeedback: undefined }
							]
						}
					: s
			)
		}));
		newPrompt = '';
	};

	const updateDraft = (schoolSlug: string, index: number, draft: string) => {
		userProfile.update((u) => ({
			...u,
			schoolList: u.schoolList.map((s) =>
				s.slug === schoolSlug
					? {
							...s,
							supplements: s.supplements.map((supp, i) => (i === index ? { ...supp, draft } : supp))
						}
					: s
			)
		}));
	};

	const analyzeDraft = (index: number) => {
		if (!school) return;
		isAnalyzing = true;

		// Mock AI analysis for now
		setTimeout(() => {
			const feedback =
				"Strong narrative voice! However, you could connect your 'Why Major' reason more directly to specific courses at " +
				school.name +
				'. Consider mentioning a professor or lab.';

			userProfile.update((u) => ({
				...u,
				schoolList: u.schoolList.map((s) =>
					s.slug === school?.slug
						? {
								...s,
								supplements: s.supplements.map((supp, i) =>
									i === index ? { ...supp, aiFeedback: feedback } : supp
								)
							}
						: s
				)
			}));
			isAnalyzing = false;
		}, 2000);
	};

	const removeSupplement = (index: number) => {
		if (!confirm('Delete this essay?')) return;
		userProfile.update((u) => ({
			...u,
			schoolList: u.schoolList.map((s) =>
				s.slug === school?.slug
					? {
							...s,
							supplements: s.supplements.filter((_, i) => i !== index)
						}
					: s
			)
		}));
	};
</script>

<div class="space-y-8">
	<!-- School Selector -->
	{#if $userProfile.schoolList.length === 0}
		<div class="text-center py-12 bg-slate-50 rounded-xl">
			<p class="text-slate-500">Track a school first to start writing supplements.</p>
		</div>
	{:else}
		<div class="flex overflow-x-auto gap-2 pb-2">
			{#each $userProfile.schoolList as s}
				<button
					class={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${
						selectedSchoolSlug === s.slug
							? 'bg-slate-900 text-white border-slate-900'
							: 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
					}`}
					on:click={() => (selectedSchoolSlug = s.slug)}
				>
					{s.name}
				</button>
			{/each}
		</div>

		{#if school}
			<div class="space-y-8">
				<!-- Add New Prompt -->
				<div class="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
					<input
						type="text"
						bind:value={newPrompt}
						placeholder="Paste a new supplemental prompt here..."
						class="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						on:click={addSupplement}
						class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700"
					>
						Add
					</button>
				</div>

				<!-- List Supplements -->
				{#if school.supplements.length === 0}
					<p class="text-center text-slate-500 text-sm py-8">No supplements added yet.</p>
				{:else}
					{#each school.supplements as supp, i}
						<div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
							<div class="flex justify-between items-start gap-4">
								<div>
									<span class="text-[10px] font-bold uppercase tracking-widest text-slate-400"
										>Prompt {i + 1}</span
									>
									<p class="text-sm font-medium text-slate-900 mt-1">{supp.prompt}</p>
								</div>
								<button
									on:click={() => removeSupplement(i)}
									class="text-slate-400 hover:text-red-500">✕</button
								>
							</div>

							<textarea
								value={supp.draft}
								on:input={(e) => updateDraft(school.slug, i, e.currentTarget.value)}
								rows="6"
								placeholder="Start writing your draft..."
								class="w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
							></textarea>

							<div class="flex items-center justify-between">
								<div class="text-xs text-slate-400">
									{supp.draft.split(/\s+/).filter((w) => w.length > 0).length} words
								</div>
								<Button
									disabled={isAnalyzing || !supp.draft}
									on:click={() => analyzeDraft(i)}
									class="bg-emerald-600 text-white px-4 py-2 text-xs font-bold rounded-lg hover:bg-emerald-700"
								>
									{isAnalyzing ? 'Analyzing...' : 'AI Feedback'}
								</Button>
							</div>

							{#if supp.aiFeedback}
								<div
									class="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-sm text-emerald-800 animate-in fade-in slide-in-from-top-2"
								>
									<h4
										class="font-bold text-xs uppercase tracking-wide mb-1 flex items-center gap-2"
									>
										<span class="text-emerald-500">✨</span> AI Feedback
									</h4>
									{supp.aiFeedback}
								</div>
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		{/if}
	{/if}
</div>
