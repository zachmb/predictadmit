<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	const PREFS_KEY = 'predictadmit:pro:prefs';

	// Session (Google) takes precedence; fall back to the local userProfile store.
	const sessionUser = $derived($page.data.session?.user ?? null);
	const displayName = $derived(sessionUser?.name || $userProfile.name || 'Applicant');
	const displayEmail = $derived(sessionUser?.email || $userProfile.email || '');
	const avatarImage = $derived(sessionUser?.image ?? null);
	const initial = $derived((displayName || 'A').trim().charAt(0).toUpperCase() || 'A');

	// Friendly joined date — a static, trustworthy label.
	const joined = 'Joined 2026';

	// Preferences — marketing toggle persisted to localStorage.
	let marketing = $state(false);

	$effect(() => {
		if (!browser) return;
		try {
			const raw = window.localStorage.getItem(PREFS_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				marketing = !!parsed.marketing;
			}
		} catch {
			// ignore malformed prefs
		}
	});

	const toggleMarketing = () => {
		marketing = !marketing;
		if (browser) {
			try {
				window.localStorage.setItem(PREFS_KEY, JSON.stringify({ marketing }));
			} catch {
				// ignore storage errors
			}
		}
	};

	// Danger zone — delete flow.
	let confirmingDelete = $state(false);

	const deleteAccount = () => {
		if (browser) {
			const keys = [
				'predictadmit:user',
				'predictadmit:pro:academics',
				'predictadmit:pro:counselor',
				'predictadmit:pro:prefs',
				'ai_results_cache'
			];
			for (const k of keys) {
				try {
					window.localStorage.removeItem(k);
				} catch {
					// ignore
				}
			}
			window.location.href = '/';
		}
	};
</script>

<div class="flex-1 min-h-0 overflow-y-auto bg-slate-50">
	<div class="max-w-6xl mx-auto px-6 md:px-10 py-8">
		<!-- Header -->
		<header class="mb-8">
			<h1 class="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
			<p class="mt-1 text-sm text-slate-500">
				Manage your account, plan, and preferences.
			</p>
		</header>

		<div class="grid gap-6">
			<!-- Account -->
			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
				<h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Account</h2>

				<div class="mt-5 flex items-center gap-4">
					{#if avatarImage}
						<img
							src={avatarImage}
							alt={displayName}
							class="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow"
						/>
					{:else}
						<div
							class="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-semibold text-white shadow"
							style="background-color: #0052CC;"
						>
							{initial}
						</div>
					{/if}
					<div class="min-w-0">
						<div class="flex items-center gap-2">
							<p class="truncate text-lg font-semibold text-slate-900">{displayName}</p>
							<span
								class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200"
							>
								<svg viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5" aria-hidden="true">
									<path
										fill-rule="evenodd"
										d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
										clip-rule="evenodd"
									/>
								</svg>
								Verified
							</span>
						</div>
						<p class="truncate text-sm text-slate-500">{displayEmail}</p>
					</div>
				</div>

				<dl class="mt-6 divide-y divide-slate-100 border-t border-slate-100">
					<div class="flex items-center justify-between py-3">
						<dt class="text-sm text-slate-500">Role</dt>
						<dd class="text-sm font-medium text-slate-900">Applicant</dd>
					</div>
					<div class="flex items-center justify-between py-3">
						<dt class="text-sm text-slate-500">Status</dt>
						<dd class="text-sm font-medium text-emerald-700">Verified</dd>
					</div>
					<div class="flex items-center justify-between py-3">
						<dt class="text-sm text-slate-500">Joined</dt>
						<dd class="text-sm font-medium text-slate-900">{joined}</dd>
					</div>
				</dl>

				<div class="mt-6">
					<a
						href="/"
						class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
					>
						<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" class="h-4 w-4" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13 4H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h7" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M16 10H8m0 0 2.5-2.5M8 10l2.5 2.5" />
						</svg>
						Log out
					</a>
				</div>
			</section>

			<!-- Current plan -->
			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
				<h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Current plan</h2>

				<div class="mt-5 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
					<div class="flex items-start gap-4">
						<div
							class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow"
							style="background-color: #0052CC;"
						>
							<svg viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6" aria-hidden="true">
								<path
									d="m9.653 2.298-1.6 3.243-3.58.52a.75.75 0 0 0-.416 1.28l2.59 2.524-.611 3.566a.75.75 0 0 0 1.088.79L10 12.518l3.204 1.684a.75.75 0 0 0 1.088-.79l-.611-3.566 2.59-2.525a.75.75 0 0 0-.416-1.28l-3.58-.519-1.6-3.243a.75.75 0 0 0-1.346 0Z"
								/>
							</svg>
						</div>
						<div>
							<div class="flex items-center gap-2">
								<p class="text-base font-semibold text-slate-900">PredictAdmit Pro</p>
								<span
									class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200"
								>
									<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
									Active
								</span>
							</div>
							<p class="mt-1 text-sm font-medium text-slate-700">Free — unlocked</p>
							<p class="mt-0.5 text-sm text-slate-500">
								Every Pro feature is included. No card, no limits.
							</p>
						</div>
					</div>
					<div class="text-right">
						<p class="text-2xl font-bold text-slate-900">$0<span class="text-sm font-medium text-slate-400">/mo</span></p>
					</div>
				</div>
			</section>

			<!-- Preferences -->
			<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
				<h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">Preferences</h2>

				<div class="mt-5 divide-y divide-slate-100">
					<!-- Transactional (locked on) -->
					<div class="flex items-center justify-between gap-4 py-4">
						<div class="min-w-0">
							<p class="text-sm font-medium text-slate-900">Transactional emails</p>
							<p class="text-sm text-slate-500">Login links and account notices</p>
						</div>
						<button
							type="button"
							role="switch"
							aria-checked="true"
							aria-label="Transactional emails (always on)"
							disabled
							class="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full transition-colors"
							style="background-color: #0052CC; opacity: 0.55;"
						>
							<span class="inline-block h-5 w-5 translate-x-[22px] transform rounded-full bg-white shadow transition mt-0.5 ml-0.5"></span>
						</button>
					</div>

					<!-- Marketing (toggleable) -->
					<div class="flex items-center justify-between gap-4 py-4">
						<div class="min-w-0">
							<p class="text-sm font-medium text-slate-900">Marketing emails</p>
							<p class="text-sm text-slate-500">Product tips, new features, and admissions insights</p>
						</div>
						<button
							type="button"
							role="switch"
							aria-checked={marketing}
							aria-label="Marketing emails"
							onclick={toggleMarketing}
							class="relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors {marketing ? '' : 'bg-slate-200'}"
							style={marketing ? 'background-color: #0052CC;' : ''}
						>
							<span
								class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition mt-0.5 ml-0.5 {marketing ? 'translate-x-[22px]' : 'translate-x-0'}"
							></span>
						</button>
					</div>
				</div>
			</section>

			<!-- Danger zone -->
			<section class="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 shadow-sm md:p-8">
				<h2 class="text-xs font-semibold uppercase tracking-wide text-rose-600">Danger zone</h2>

				<div class="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div class="min-w-0">
						<p class="text-sm font-semibold text-slate-900">Delete account</p>
						<p class="mt-1 max-w-xl text-sm text-slate-600">
							Permanently clear your PredictAdmit profile and data from this browser. This cannot be
							undone.
						</p>
					</div>

					{#if confirmingDelete}
						<div class="flex shrink-0 items-center gap-2">
							<span class="text-sm font-medium text-rose-700">Are you sure?</span>
							<button
								type="button"
								onclick={() => (confirmingDelete = false)}
								class="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
							>
								Cancel
							</button>
							<button
								type="button"
								onclick={deleteAccount}
								class="rounded-lg bg-rose-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
							>
								Yes, delete
							</button>
						</div>
					{:else}
						<button
							type="button"
							onclick={() => (confirmingDelete = true)}
							class="inline-flex shrink-0 items-center gap-2 rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50"
						>
							<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" class="h-4 w-4" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m3 0-.5 9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2L5 6" />
							</svg>
							Delete
						</button>
					{/if}
				</div>
			</section>
		</div>
	</div>
</div>
