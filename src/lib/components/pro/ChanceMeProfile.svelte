<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	const ACADEMICS_KEY = 'predictadmit:pro:academics';

	type Academics = {
		sat: number | '';
		act: number | '';
		weightedGpa: number | '';
		unweightedGpa: number | '';
	};

	// ---- Local academics state (persisted to localStorage) ----
	let academics = $state<Academics>({ sat: '', act: '', weightedGpa: '', unweightedGpa: '' });
	let loaded = $state(false);

	$effect(() => {
		if (!browser || loaded) return;
		try {
			const raw = window.localStorage.getItem(ACADEMICS_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				academics = {
					sat: parsed.sat === '' || parsed.sat == null ? '' : Number(parsed.sat),
					act: parsed.act === '' || parsed.act == null ? '' : Number(parsed.act),
					weightedGpa:
						parsed.weightedGpa === '' || parsed.weightedGpa == null
							? ''
							: Number(parsed.weightedGpa),
					unweightedGpa:
						parsed.unweightedGpa === '' || parsed.unweightedGpa == null
							? ''
							: Number(parsed.unweightedGpa)
				};
			}
		} catch {
			// ignore
		}
		loaded = true;
	});

	// Persist academics on change (after initial load).
	$effect(() => {
		// touch fields so the effect re-runs on change
		const snapshot = {
			sat: academics.sat,
			act: academics.act,
			weightedGpa: academics.weightedGpa,
			unweightedGpa: academics.unweightedGpa
		};
		if (!browser || !loaded) return;
		try {
			window.localStorage.setItem(ACADEMICS_KEY, JSON.stringify(snapshot));
		} catch {
			// ignore
		}
	});

	// ---- Identity: prefer Google session, fall back to userProfile ----
	const displayName = $derived(
		$page.data?.session?.user?.name || $userProfile.name || 'Future Applicant'
	);
	const firstName = $derived(displayName.split(' ')[0]);
	const avatarImage = $derived($page.data?.session?.user?.image || '');
	const initials = $derived(
		displayName
			.split(' ')
			.map((p: string) => p[0])
			.filter(Boolean)
			.slice(0, 2)
			.join('')
			.toUpperCase()
	);

	// ---- Loose fields stored on userProfile (major/gradYear/bio) ----
	const profileAny = $derived($userProfile as unknown as Record<string, unknown>);
	const intendedMajor = $derived((profileAny.intendedMajor as string) ?? '');
	const gradYear = $derived((profileAny.gradYear as string) ?? '');
	const bio = $derived((profileAny.bio as string) ?? '');

	function setLoose(key: string, value: string) {
		userProfile.update((u) => ({ ...u, [key]: value }));
	}
	function setNameField(value: string) {
		userProfile.update((u) => ({ ...u, name: value }));
	}
	function setAppProfile(key: 'activities' | 'awards' | 'essays', value: string) {
		userProfile.update((u) => ({
			...u,
			applicationProfile: { ...u.applicationProfile, [key]: value }
		}));
	}

	// ---- Completion tracking ----
	type Section = {
		id: string;
		title: string;
		hint: string;
		complete: boolean;
	};

	const sections = $derived<Section[]>([
		{
			id: 'bio',
			title: 'Bio',
			hint: 'A short intro that gives context to your story.',
			complete: bio.trim().length > 0
		},
		{
			id: 'gradmajor',
			title: 'Grad Year & Major',
			hint: 'When you graduate and what you plan to study.',
			complete: gradYear.trim().length > 0 && intendedMajor.trim().length > 0
		},
		{
			id: 'academics',
			title: 'Academics',
			hint: 'Test scores and GPA to benchmark against admits.',
			complete:
				academics.sat !== '' ||
				academics.act !== '' ||
				academics.weightedGpa !== '' ||
				academics.unweightedGpa !== ''
		},
		{
			id: 'activities',
			title: 'Extracurriculars',
			hint: 'The clubs, jobs, and projects that show your impact.',
			complete: ($userProfile.applicationProfile.activities || '').trim().length > 0
		},
		{
			id: 'awards',
			title: 'Awards',
			hint: 'Honors and recognitions that make you stand out.',
			complete: ($userProfile.applicationProfile.awards || '').trim().length > 0
		},
		{
			id: 'essays',
			title: 'Essays',
			hint: 'Your personal statement and supplemental drafts.',
			complete: ($userProfile.applicationProfile.essays || '').trim().length > 0
		},
		{
			id: 'targets',
			title: 'Target Universities',
			hint: 'The schools on your list to chance and track.',
			complete: $userProfile.schoolList.length > 0
		}
	]);

	const completeCount = $derived(sections.filter((s) => s.complete).length);
	const totalCount = $derived(sections.length);
	const completionPct = $derived(Math.round((completeCount / totalCount) * 100));

	// Which section card is expanded for inline editing.
	let openSection = $state<string | null>(null);
	function toggleSection(id: string) {
		openSection = openSection === id ? null : id;
	}

	const gradYears = ['2027', '2028', '2029', '2030', '2031'];

	// ---- Admit distribution charts ----
	type Bucket = { label: string; min: number; max: number; pct: number };

	// Realistic, rising-then-peak distributions of *admitted* students.
	const satBuckets: Bucket[] = [
		{ label: '400–790', min: 400, max: 790, pct: 2 },
		{ label: '800–990', min: 800, max: 990, pct: 5 },
		{ label: '1000–1190', min: 1000, max: 1190, pct: 12 },
		{ label: '1200–1390', min: 1200, max: 1390, pct: 24 },
		{ label: '1400–1590', min: 1400, max: 1590, pct: 42 },
		{ label: '1600', min: 1600, max: 1600, pct: 15 }
	];
	const actBuckets: Bucket[] = [
		{ label: '1–15', min: 1, max: 15, pct: 2 },
		{ label: '16–20', min: 16, max: 20, pct: 6 },
		{ label: '21–25', min: 21, max: 25, pct: 14 },
		{ label: '26–29', min: 26, max: 29, pct: 24 },
		{ label: '30–33', min: 30, max: 33, pct: 38 },
		{ label: '34–36', min: 34, max: 36, pct: 16 }
	];
	const gpaBuckets: Bucket[] = [
		{ label: '<3.0', min: 0, max: 2.99, pct: 2 },
		{ label: '3.0–3.4', min: 3.0, max: 3.49, pct: 6 },
		{ label: '3.5–3.7', min: 3.5, max: 3.79, pct: 14 },
		{ label: '3.8–4.0', min: 3.8, max: 4.09, pct: 30 },
		{ label: '4.1–4.4', min: 4.1, max: 4.49, pct: 33 },
		{ label: '4.5+', min: 4.5, max: 99, pct: 15 }
	];

	function bucketIndex(buckets: Bucket[], value: number | ''): number {
		if (value === '') return -1;
		const v = Number(value);
		for (let i = 0; i < buckets.length; i++) {
			if (v >= buckets[i].min && v <= buckets[i].max) return i;
		}
		// Clamp above the top bucket / below the first.
		if (v > buckets[buckets.length - 1].max) return buckets.length - 1;
		if (v < buckets[0].min) return 0;
		return -1;
	}

	// "Top X% of admitted students" — % of admits scoring at or above the
	// student's bucket (lower is better / more selective company).
	function topPercent(buckets: Bucket[], idx: number): number {
		if (idx < 0) return 0;
		let atOrAbove = 0;
		for (let i = idx; i < buckets.length; i++) atOrAbove += buckets[i].pct;
		return Math.max(1, Math.round(atOrAbove));
	}

	const satIdx = $derived(bucketIndex(satBuckets, academics.sat));
	const actIdx = $derived(bucketIndex(actBuckets, academics.act));
	const gpaIdx = $derived(bucketIndex(gpaBuckets, academics.weightedGpa));

	const maxSat = Math.max(...satBuckets.map((b) => b.pct));
	const maxAct = Math.max(...actBuckets.map((b) => b.pct));
	const maxGpa = Math.max(...gpaBuckets.map((b) => b.pct));

	function clampNum(v: string, min: number, max: number): number | '' {
		if (v === '') return '';
		let n = Number(v);
		if (Number.isNaN(n)) return '';
		if (n < min) n = min;
		if (n > max) n = max;
		return n;
	}
</script>

<div class="flex-1 min-h-0 overflow-y-auto bg-slate-50">
	<div class="max-w-6xl mx-auto px-6 md:px-10 py-8">
		<!-- Header -->
		<header class="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
			<div class="flex items-center gap-4">
				{#if avatarImage}
					<img
						src={avatarImage}
						alt={displayName}
						class="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-sm"
					/>
				{:else}
					<div
						class="h-14 w-14 rounded-full grid place-items-center text-white font-semibold text-lg shadow-sm"
						style="background:#0052CC"
					>
						{initials || 'FA'}
					</div>
				{/if}
				<div>
					<h1 class="text-2xl font-bold text-slate-900 tracking-tight">
						{firstName}'s Chance Me profile
					</h1>
					<p class="text-sm text-slate-500 mt-0.5">
						Complete your profile to get sharper, personalized admissions odds.
					</p>
				</div>
			</div>

			<!-- Completion meter -->
			<div class="w-full md:w-64 rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
				<div class="flex items-baseline justify-between">
					<span class="text-xs font-semibold uppercase tracking-wide text-slate-500"
						>Profile</span
					>
					<span class="text-sm font-bold text-slate-900"
						>{completeCount} / {totalCount} sections</span
					>
				</div>
				<div class="mt-2 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
					<div
						class="h-full rounded-full transition-all duration-500"
						style="width:{completionPct}%;background:#0052CC"
					></div>
				</div>
				<p class="mt-2 text-xs text-slate-500">
					{#if completeCount === totalCount}
						All set — your profile is complete!
					{:else}
						{completionPct}% complete — keep going.
					{/if}
				</p>
			</div>
		</header>

		<!-- Name field (editable, backs userProfile.name) -->
		<div class="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
			<label
				for="cm-name"
				class="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5"
				>Display name</label
			>
			<input
				id="cm-name"
				type="text"
				value={$userProfile.name}
				placeholder="Your name"
				oninput={(e) => setNameField(e.currentTarget.value)}
				class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/40 focus:border-[#0052CC]"
			/>
			<p class="mt-1.5 text-xs text-slate-400">
				{#if $page.data?.session?.user?.name}
					Signed in as {$page.data.session.user.name}.
				{:else}
					This name shows on your Chance Me profile.
				{/if}
			</p>
		</div>

		<!-- Section checklist -->
		<section class="mt-6">
			<h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
				Complete profile
			</h2>
			<div class="space-y-3">
				{#each sections as section (section.id)}
					<div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
						<div class="flex items-center gap-4 p-4">
							<!-- Status circle -->
							{#if section.complete}
								<span
									class="grid place-items-center h-8 w-8 rounded-full text-white shrink-0"
									style="background:#0052CC"
									aria-label="Complete"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										class="h-4 w-4"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
									</svg>
								</span>
							{:else}
								<span
									class="h-8 w-8 rounded-full border-2 border-dashed border-slate-300 shrink-0"
									aria-label="Incomplete"
								></span>
							{/if}

							<div class="flex-1 min-w-0">
								<h3 class="text-sm font-semibold text-slate-900">{section.title}</h3>
								<p class="text-xs text-slate-500 truncate">{section.hint}</p>
							</div>

							{#if section.id === 'targets'}
								<span class="text-xs font-medium text-slate-400 shrink-0">
									{$userProfile.schoolList.length} tracked
								</span>
							{:else}
								<button
									onclick={() => toggleSection(section.id)}
									class="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors {openSection ===
									section.id
										? 'bg-[#0052CC] text-white'
										: 'text-[#0052CC] hover:bg-blue-50'}"
								>
									{openSection === section.id
										? 'Done'
										: section.complete
											? 'Edit'
											: 'Add'}
								</button>
							{/if}
						</div>

						<!-- Expandable editor -->
						{#if openSection === section.id}
							<div class="border-t border-slate-100 bg-slate-50/60 p-4">
								{#if section.id === 'bio'}
									<textarea
										rows="4"
										value={bio}
										placeholder="Tell your story in a few sentences — who you are, what drives you..."
										oninput={(e) => setLoose('bio', e.currentTarget.value)}
										class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/40 focus:border-[#0052CC]"
									></textarea>
								{:else if section.id === 'gradmajor'}
									<div class="grid sm:grid-cols-2 gap-4">
										<div>
											<label
												for="cm-gradyear"
												class="block text-xs font-semibold text-slate-600 mb-1.5"
												>Graduation year</label
											>
											<select
												id="cm-gradyear"
												value={gradYear}
												onchange={(e) => setLoose('gradYear', e.currentTarget.value)}
												class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/40 focus:border-[#0052CC]"
											>
												<option value="">Select…</option>
												{#each gradYears as y}
													<option value={y}>Class of {y}</option>
												{/each}
											</select>
										</div>
										<div>
											<label
												for="cm-major"
												class="block text-xs font-semibold text-slate-600 mb-1.5"
												>Intended major</label
											>
											<input
												id="cm-major"
												type="text"
												value={intendedMajor}
												placeholder="e.g. Computer Science"
												oninput={(e) => setLoose('intendedMajor', e.currentTarget.value)}
												class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/40 focus:border-[#0052CC]"
											/>
										</div>
									</div>
								{:else if section.id === 'academics'}
									<p class="text-xs text-slate-500">
										Scroll down to the Academics panel to enter scores and see how you
										compare to admits.
									</p>
								{:else if section.id === 'activities'}
									<textarea
										rows="5"
										value={$userProfile.applicationProfile.activities}
										placeholder="List your extracurriculars — role, organization, and impact for each."
										oninput={(e) => setAppProfile('activities', e.currentTarget.value)}
										class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/40 focus:border-[#0052CC]"
									></textarea>
								{:else if section.id === 'awards'}
									<textarea
										rows="4"
										value={$userProfile.applicationProfile.awards}
										placeholder="List honors and awards, with the level (school / regional / national)."
										oninput={(e) => setAppProfile('awards', e.currentTarget.value)}
										class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/40 focus:border-[#0052CC]"
									></textarea>
								{:else if section.id === 'essays'}
									<textarea
										rows="6"
										value={$userProfile.applicationProfile.essays}
										placeholder="Paste your personal statement draft or notes here."
										oninput={(e) => setAppProfile('essays', e.currentTarget.value)}
										class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/40 focus:border-[#0052CC]"
									></textarea>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>

		<!-- Academics block -->
		<section class="mt-8">
			<h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
				Academics
			</h2>

			<div class="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
				<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<div>
						<label for="cm-sat" class="block text-xs font-semibold text-slate-600 mb-1.5"
							>SAT (400–1600)</label
						>
						<input
							id="cm-sat"
							type="number"
							min="400"
							max="1600"
							value={academics.sat}
							placeholder="—"
							oninput={(e) => (academics.sat = clampNum(e.currentTarget.value, 400, 1600))}
							class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/40 focus:border-[#0052CC]"
						/>
					</div>
					<div>
						<label for="cm-act" class="block text-xs font-semibold text-slate-600 mb-1.5"
							>ACT (1–36)</label
						>
						<input
							id="cm-act"
							type="number"
							min="1"
							max="36"
							value={academics.act}
							placeholder="—"
							oninput={(e) => (academics.act = clampNum(e.currentTarget.value, 1, 36))}
							class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/40 focus:border-[#0052CC]"
						/>
					</div>
					<div>
						<label for="cm-wgpa" class="block text-xs font-semibold text-slate-600 mb-1.5"
							>Weighted GPA</label
						>
						<input
							id="cm-wgpa"
							type="number"
							step="0.01"
							min="0"
							max="5"
							value={academics.weightedGpa}
							placeholder="—"
							oninput={(e) =>
								(academics.weightedGpa = clampNum(e.currentTarget.value, 0, 5))}
							class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/40 focus:border-[#0052CC]"
						/>
					</div>
					<div>
						<label for="cm-ugpa" class="block text-xs font-semibold text-slate-600 mb-1.5"
							>Unweighted GPA</label
						>
						<input
							id="cm-ugpa"
							type="number"
							step="0.01"
							min="0"
							max="4"
							value={academics.unweightedGpa}
							placeholder="—"
							oninput={(e) =>
								(academics.unweightedGpa = clampNum(e.currentTarget.value, 0, 4))}
							class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/40 focus:border-[#0052CC]"
						/>
					</div>
				</div>
			</div>
		</section>

		<!-- Admit distribution charts -->
		<section class="mt-8">
			<h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
				Admit distributions
			</h2>
			<p class="text-sm text-slate-500 mb-4 -mt-1">
				How admitted students at competitive universities are distributed — your value is
				highlighted in blue.
			</p>

			<div class="grid lg:grid-cols-3 gap-5">
				<!-- SAT -->
				{@render distChart('SAT', satBuckets, satIdx, maxSat, academics.sat, 'points')}
				<!-- ACT -->
				{@render distChart('ACT', actBuckets, actIdx, maxAct, academics.act, 'composite')}
				<!-- Weighted GPA -->
				{@render distChart('Weighted GPA', gpaBuckets, gpaIdx, maxGpa, academics.weightedGpa, '')}
			</div>
		</section>
	</div>
</div>

{#snippet distChart(
	title: string,
	buckets: { label: string; min: number; max: number; pct: number }[],
	activeIdx: number,
	max: number,
	value: number | '',
	unit: string
)}
	<div class="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col">
		<div class="flex items-center justify-between">
			<h3 class="text-sm font-semibold text-slate-900">{title}</h3>
			{#if value !== ''}
				<span
					class="text-xs font-bold px-2 py-0.5 rounded-full"
					style="background:rgba(0,82,204,0.1);color:#0052CC"
				>
					You: {value}{unit ? ' ' + unit : ''}
				</span>
			{/if}
		</div>

		<!-- Bars -->
		<div class="mt-4 flex items-end gap-1.5 h-36">
			{#each buckets as b, i}
				<div class="flex-1 flex flex-col items-center justify-end h-full">
					<span
						class="text-[10px] font-semibold mb-1 {i === activeIdx
							? 'text-[#0052CC]'
							: 'text-slate-400'}"
					>
						{b.pct}%
					</span>
					<div
						class="w-full rounded-t-md transition-all duration-300 {i === activeIdx
							? ''
							: 'bg-slate-200'}"
						style="height:{Math.max(4, (b.pct / max) * 100)}%;{i === activeIdx
							? 'background:#0052CC'
							: ''}"
					></div>
				</div>
			{/each}
		</div>

		<!-- Axis labels -->
		<div class="mt-2 flex gap-1.5">
			{#each buckets as b, i}
				<div
					class="flex-1 text-center text-[9px] leading-tight {i === activeIdx
						? 'text-[#0052CC] font-semibold'
						: 'text-slate-400'}"
				>
					{b.label}
				</div>
			{/each}
		</div>

		<!-- Caption -->
		<p class="mt-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
			{#if value === ''}
				Enter your {title} above to see where you land.
			{:else}
				You're in the <span class="font-semibold text-[#0052CC]"
					>top {topPercent(buckets, activeIdx)}%</span
				>
				of admitted students by {title}.
			{/if}
		</p>
	</div>
{/snippet}
