<script lang="ts">
	import { browser } from '$app/environment';
	import { streak, recordVisit } from '$lib/stores/streak';
	import { INVITE_REWARD, buildReferralLink, referralCodeFor } from '$lib/config/community';
	import { userProfile } from '$lib/stores/user';
	import { points } from '$lib/stores/points';
	import { syncInviterRewards } from '$lib/referral';
	import StatsWizard from '$lib/components/pro/StatsWizard.svelte';

	const ACADEMICS_KEY = 'predictadmit:pro:academics';

	// Record today's visit on mount to advance/reset the retention streak.
	$effect(() => {
		recordVisit();
	});

	const referralCode = $derived(referralCodeFor($userProfile.email || $userProfile.name));
	const referralLink = $derived(buildReferralLink(referralCode));

	// Collect any invite rewards earned since last visit (friends who joined with our link).
	$effect(() => {
		if (referralCode) syncInviterRewards(referralCode);
	});

	const streakBlurb = $derived.by(() => {
		const c = $streak.count;
		if (c <= 1) return 'Show up tomorrow to start a streak worth bragging about.';
		return 'Come back tomorrow to keep your streak alive.';
	});

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(referralLink);
		} catch {
			/* clipboard blocked — still show feedback */
		}
		copied = true;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = false), 1800);
	}

	async function shareLink() {
		const shareText = `Chart your college admissions odds with PredictAdmit — join me and earn +${INVITE_REWARD.points} points.`;
		if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
			try {
				await navigator.share({ title: 'PredictAdmit', text: shareText, url: referralLink });
				return;
			} catch {
				/* user cancelled or unsupported — fall through to X intent */
			}
		}
		const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
			shareText
		)}&url=${encodeURIComponent(referralLink)}`;
		if (typeof window !== 'undefined') window.open(intent, '_blank', 'noopener');
	}

	// ---- Stats card -----------------------------------------------------------
	type Academics = {
		sat: number | '';
		act: number | '';
		weightedGpa: number | '';
		unweightedGpa: number | '';
	};

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
	let wizardOpen = $state(false);

	const hasStats = $derived(
		academics.sat !== '' ||
			academics.act !== '' ||
			academics.weightedGpa !== '' ||
			academics.unweightedGpa !== ''
	);

	const statRows = $derived([
		{ label: 'SAT', value: academics.sat },
		{ label: 'ACT', value: academics.act },
		{ label: 'W GPA', value: academics.weightedGpa },
		{ label: 'UW GPA', value: academics.unweightedGpa }
	]);
</script>

<section class="grid gap-4 sm:grid-cols-3">
	<!-- 1. Streak -->
	<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
		<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Daily streak</p>
		<div class="mt-3 flex items-baseline gap-2">
			<span class="text-2xl leading-none" aria-hidden="true">🔥</span>
			<span class="text-3xl font-bold text-slate-900">{$streak.count}</span>
			<span class="text-sm font-medium text-slate-500">
				{$streak.count === 1 ? 'day' : 'days'}
			</span>
		</div>
		<p class="mt-1 text-xs font-medium text-slate-400">Best: {$streak.best}</p>
		<p class="mt-3 text-sm leading-snug text-slate-600">{streakBlurb}</p>
	</div>

	<!-- 2. Invite friends -->
	<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
		<div class="flex items-center justify-between">
			<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Invite friends</p>
			<span
				class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold text-white"
				style="background-color:#0052CC;"
			>
				+{INVITE_REWARD.points}
			</span>
		</div>
		<p class="mt-3 text-sm font-semibold text-slate-900">
			Invite friends, earn +{INVITE_REWARD.points} points
		</p>
		<p class="mt-1 text-xs leading-snug text-slate-500">
			Share your link — you both get rewarded when they join.
		</p>
		{#if $points.total > 0}
			<p class="mt-1 text-xs font-semibold text-[#0052CC]">
				🎉 You've earned {$points.total} points
			</p>
		{/if}
		<div class="mt-4 flex items-center gap-2">
			<button
				type="button"
				onclick={copyLink}
				class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
				style="background-color:#0052CC;"
			>
				{#if copied}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
					Copied!
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
					</svg>
					Copy invite link
				{/if}
			</button>
			<button
				type="button"
				onclick={shareLink}
				aria-label="Share invite link"
				class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="18" cy="5" r="3" />
					<circle cx="6" cy="12" r="3" />
					<circle cx="18" cy="19" r="3" />
					<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
					<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
				</svg>
			</button>
		</div>
	</div>

	<!-- 3. Your stats -->
	<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
		<div class="flex items-center justify-between">
			<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Your stats</p>
			{#if hasStats}
				<button
					type="button"
					onclick={() => (wizardOpen = true)}
					class="text-xs font-semibold text-[#0052CC] hover:underline"
				>
					Edit
				</button>
			{/if}
		</div>
		{#if hasStats}
			<dl class="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
				{#each statRows as row}
					<div>
						<dt class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
							{row.label}
						</dt>
						<dd class="text-sm font-bold text-slate-900">{row.value === '' ? '—' : row.value}</dd>
					</div>
				{/each}
			</dl>
			<p class="mt-3 text-xs leading-snug text-slate-500">
				Powering your predictions across every school.
			</p>
		{:else}
			<p class="mt-3 text-sm font-semibold text-slate-900">Add your stats</p>
			<p class="mt-1 text-xs leading-snug text-slate-500">
				GPA, test scores, activities & awards sharpen every prediction — takes under a minute.
			</p>
			<button
				type="button"
				onclick={() => (wizardOpen = true)}
				class="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
				style="background-color:#0052CC;"
			>
				Enter my stats
				<span aria-hidden="true">→</span>
			</button>
		{/if}
	</div>
</section>

{#if wizardOpen}
	<StatsWizard onClose={() => (wizardOpen = false)} onSaved={(a) => (academics = a)} />
{/if}
