<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { computeAcademicIndex } from '$lib/config/schoolStats';
	import InvitePanel from '$lib/components/pro/InvitePanel.svelte';
	import ContributeCard from '$lib/components/pro/ContributeCard.svelte';

	let { setView } = $props<{ setView: (view: string) => void }>();

	// ---- Greeting -------------------------------------------------------------
	const hour = new Date().getHours();
	const timeGreeting =
		hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

	const firstName = $derived.by(() => {
		const sessionName = $page.data.session?.user?.name as string | undefined;
		const raw = (sessionName || $userProfile.name || '').trim();
		if (!raw) return 'there';
		return raw.split(/\s+/)[0];
	});

	// ---- Live countdown -------------------------------------------------------
	// Midnight CST (UTC-6) on Nov 1, 2026 — the classic early-application deadline.
	const target = new Date('2026-11-01T00:00:00-06:00');
	let now = $state(Date.now());

	$effect(() => {
		const id = setInterval(() => {
			now = Date.now();
		}, 1000);
		return () => clearInterval(id);
	});

	const countdown = $derived.by(() => {
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

	const pad = (n: number) => String(n).padStart(2, '0');

	// ---- Profile-derived data -------------------------------------------------
	const schoolCount = $derived($userProfile.schoolList.length);
	const gpaPresent = $derived(!!$userProfile.applicationProfile.gpa?.trim());
	const listStarted = $derived(schoolCount > 0);
	const essayStarted = $derived(
		$userProfile.schoolList.some((s) =>
			s.supplements.some((sup) => (sup.draft || '').trim().length > 0)
		)
	);
	const essaysInProgress = $derived(
		$userProfile.schoolList.reduce(
			(acc, s) =>
				acc + s.supplements.filter((sup) => (sup.draft || '').trim().length > 0).length,
			0
		)
	);

	// ---- Academic index from localStorage ------------------------------------
	let academicIndex = $state<number | null>(null);

	$effect(() => {
		if (!browser) return;
		try {
			const raw = window.localStorage.getItem('predictadmit:pro:academics');
			if (!raw) return;
			const parsed = JSON.parse(raw);
			const sat = Number(parsed.sat) || undefined;
			const act = Number(parsed.act) || undefined;
			const gpa =
				Number(parsed.weightedGpa ?? parsed.gpa) ||
				Number($userProfile.applicationProfile.gpa) ||
				undefined;
			if (sat || act || gpa) {
				academicIndex = computeAcademicIndex(sat, act, gpa);
			}
		} catch {
			// ignore malformed storage
		}
	});

	// ---- Recommended cards ----------------------------------------------------
	type Rec = {
		title: string;
		desc: string;
		done: boolean;
		action: () => void;
		href?: string;
		icon: 'profile' | 'list' | 'essay' | 'chat' | 'predict';
	};

	const recs = $derived<Rec[]>([
		{
			title: 'Complete your Chance-Me profile',
			desc: 'Add your GPA, scores, and activities for sharper predictions.',
			done: gpaPresent,
			action: () => setView('chanceme'),
			icon: 'profile'
		},
		{
			title: 'Build your college list',
			desc: 'Track reaches, targets, and safeties in one place.',
			done: listStarted,
			action: () => setView('schools'),
			icon: 'list'
		},
		{
			title: 'Start writing your essay',
			desc: 'Draft supplements and get AI feedback as you go.',
			done: essayStarted,
			action: () => setView('editor'),
			icon: 'essay'
		},
		{
			title: 'Ask the AI Counselor',
			desc: 'Instant, personalized answers to any application question.',
			done: false,
			action: () => setView('counselor'),
			icon: 'chat'
		},
		{
			title: 'Run an admissions prediction',
			desc: 'See your real odds at any school in seconds.',
			done: false,
			action: () => {},
			href: '/ai',
			icon: 'predict'
		}
	]);
</script>

<div class="flex-1 min-h-0 overflow-y-auto bg-slate-50">
	<div class="max-w-6xl mx-auto px-6 md:px-10 py-8">
		<!-- Greeting -->
		<header class="mb-8">
			<h1 class="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
				{timeGreeting}, {firstName}
			</h1>
			<p class="mt-1 text-slate-500">Here's your application command center.</p>
		</header>

		<!-- Hero + Countdown -->
		<div class="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-8">
			<!-- AI Counselor hero -->
			<div
				class="lg:col-span-3 relative overflow-hidden rounded-2xl border border-[#0052CC]/20 bg-gradient-to-br from-[#0052CC] to-[#0a63e6] p-7 md:p-8 shadow-sm"
			>
				<div
					class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
					aria-hidden="true"
				></div>
				<div class="relative">
					<span
						class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-3.5 w-3.5"
						>
							<path d="M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15l-1.9-4.1L5.5 9l4.6-1.4L12 3z" />
						</svg>
						AI Counselor
					</span>
					<h2 class="mt-4 text-2xl md:text-3xl font-bold text-white">Meet your AI Counselor</h2>
					<p class="mt-2 max-w-lg text-white/85 leading-relaxed">
						Get personalized advice and instant answers to any college-application question.
					</p>
					<button
						type="button"
						onclick={() => setView('counselor')}
						class="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0052CC] shadow-sm transition hover:bg-slate-100 active:scale-[0.98]"
					>
						Chat with PredictAI
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-4 w-4"
						>
							<path d="M5 12h14M13 6l6 6-6 6" />
						</svg>
					</button>
				</div>
			</div>

			<!-- Countdown -->
			<div class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Countdown</p>
						<h3 class="mt-0.5 text-lg font-bold text-slate-900">Early Deadlines · Nov 1, 2026</h3>
					</div>
					<span class="flex items-center gap-1.5 text-xs font-semibold text-[#0052CC]">
						<span class="relative flex h-2 w-2">
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0052CC] opacity-75"
							></span>
							<span class="relative inline-flex h-2 w-2 rounded-full bg-[#0052CC]"></span>
						</span>
						LIVE
					</span>
				</div>
				<div class="mt-5 grid grid-cols-4 gap-2">
					{#each [{ label: 'Days', value: countdown.days }, { label: 'Hours', value: countdown.hours }, { label: 'Min', value: countdown.minutes }, { label: 'Sec', value: countdown.seconds }] as box}
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
		</div>

		<!-- Retention + community widgets -->
		<div class="mb-8">
			<InvitePanel />
		</div>

		<!-- Recommended for you -->
		<section class="mb-8">
			<div class="mb-4 flex items-baseline justify-between">
				<h2 class="text-lg font-bold text-slate-900">Recommended for you</h2>
				<span class="text-sm text-slate-400">Your next best moves</span>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each recs as rec}
					{#if rec.href}
						<a
							href={rec.href}
							class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#0052CC]/40 hover:shadow-md"
						>
							<div class="flex items-start justify-between">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0052CC]/10 text-[#0052CC]"
								>
									{@render icon(rec.icon)}
								</div>
								{#if rec.done}
									<span
										class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600"
										>Done ✓</span
									>
								{/if}
							</div>
							<h3 class="mt-4 font-semibold text-slate-900">{rec.title}</h3>
							<p class="mt-1 text-sm text-slate-500 leading-relaxed">{rec.desc}</p>
							<span
								class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0052CC] group-hover:gap-2 transition-all"
							>
								Open →
							</span>
						</a>
					{:else}
						<button
							type="button"
							onclick={rec.action}
							class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#0052CC]/40 hover:shadow-md"
						>
							<div class="flex items-start justify-between">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0052CC]/10 text-[#0052CC]"
								>
									{@render icon(rec.icon)}
								</div>
								{#if rec.done}
									<span
										class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600"
										>Done ✓</span
									>
								{/if}
							</div>
							<h3 class="mt-4 font-semibold text-slate-900">{rec.title}</h3>
							<p class="mt-1 text-sm text-slate-500 leading-relaxed">{rec.desc}</p>
							<span
								class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0052CC] group-hover:gap-2 transition-all"
							>
								Open →
							</span>
						</button>
					{/if}
				{/each}
			</div>
		</section>

		<!-- Quick stats -->
		<section>
			<h2 class="mb-4 text-lg font-bold text-slate-900">Quick stats</h2>
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<!-- Academic Index -->
				<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
					<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Academic Index</p>
					{#if academicIndex !== null}
						<div class="mt-2 flex items-baseline gap-1">
							<span class="text-3xl font-bold text-slate-900">{academicIndex}</span>
							<span class="text-sm text-slate-400">/ 100</span>
						</div>
						<div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
							<div
								class="h-full rounded-full bg-[#0052CC]"
								style="width: {academicIndex}%"
							></div>
						</div>
					{:else}
						<div class="mt-2 text-3xl font-bold text-slate-300">—</div>
						<button
							type="button"
							onclick={() => setView('chanceme')}
							class="mt-3 text-sm font-semibold text-[#0052CC] hover:underline"
						>
							Complete profile →
						</button>
					{/if}
				</div>

				<!-- Schools on list -->
				<button
					type="button"
					onclick={() => setView('schools')}
					class="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#0052CC]/40 hover:shadow-md"
				>
					<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Schools on list</p>
					<div class="mt-2 text-3xl font-bold text-slate-900">{schoolCount}</div>
					<p class="mt-3 text-sm text-slate-400">
						{schoolCount === 0 ? 'Add your first school →' : 'Manage your list →'}
					</p>
				</button>

				<!-- Essays in progress -->
				<button
					type="button"
					onclick={() => setView('editor')}
					class="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#0052CC]/40 hover:shadow-md"
				>
					<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
						Essays in progress
					</p>
					<div class="mt-2 text-3xl font-bold text-slate-900">{essaysInProgress}</div>
					<p class="mt-3 text-sm text-slate-400">
						{essaysInProgress === 0 ? 'Start an essay →' : 'Keep writing →'}
					</p>
				</button>
			</div>
		</section>

		<!-- Data flywheel: consented contribution -->
		<div class="mt-8">
			<ContributeCard />
		</div>
	</div>
</div>

{#snippet icon(name: 'profile' | 'list' | 'essay' | 'chat' | 'predict')}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="h-5 w-5"
	>
		{#if name === 'profile'}
			<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		{:else if name === 'list'}
			<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
		{:else if name === 'essay'}
			<path d="M12 20h9" />
			<path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
		{:else if name === 'chat'}
			<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
		{:else}
			<path d="M3 3v18h18" />
			<path d="M7 14l4-4 3 3 5-6" />
		{/if}
	</svg>
{/snippet}
