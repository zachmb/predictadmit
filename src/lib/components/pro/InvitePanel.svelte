<script lang="ts">
	import { streak, recordVisit } from '$lib/stores/streak';
	import {
		DISCORD_URL,
		INVITE_REWARD,
		buildReferralLink,
		referralCodeFor
	} from '$lib/config/community';
	import { userProfile } from '$lib/stores/user';

	// Record today's visit on mount to advance/reset the retention streak.
	$effect(() => {
		recordVisit();
	});

	const referralLink = $derived(
		buildReferralLink(referralCodeFor($userProfile.email || $userProfile.name))
	);

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
		const shareText = `Chart your college admissions odds with PredictAdmit — join me and earn +${INVITE_REWARD.credits} credits.`;
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
				+{INVITE_REWARD.credits}
			</span>
		</div>
		<p class="mt-3 text-sm font-semibold text-slate-900">
			Invite friends, earn +{INVITE_REWARD.credits} credits
		</p>
		<p class="mt-1 text-xs leading-snug text-slate-500">
			Share your link — you both get rewarded when they join.
		</p>
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

	<!-- 3. Community (Discord) -->
	<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
		<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Community</p>
		<div class="mt-3 flex items-center gap-3">
			<span
				class="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white"
				style="background-color:#5865F2;"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.036A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.096 2.157 2.42 0 1.332-.955 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.096 2.157 2.42 0 1.332-.946 2.418-2.157 2.418Z"
					/>
				</svg>
			</span>
			<div>
				<p class="text-sm font-semibold text-slate-900">Join 3,000+ applicants</p>
				<p class="text-xs text-slate-500">Swap essays, tips & decisions on Discord</p>
			</div>
		</div>
		<a
			href={DISCORD_URL}
			target="_blank"
			rel="noopener"
			class="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
			style="background-color:#5865F2;"
		>
			Join
			<span aria-hidden="true">→</span>
		</a>
	</div>
</section>
