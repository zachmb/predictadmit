<script lang="ts">
	// FAST PATH TO THE PAID AHA (2026-09-12, Zach's pick).
	//
	// The full /ai flow buries the emotional payoff behind heavy input (paste your
	// whole app) + a 39-school fan-out. Most engaged users never reach it, so they
	// never hit a paywall worth paying at. This route is the 20-second version: pick
	// ONE dream school, give the minimum (GPA + a quick paste), and get the REAL,
	// unknown-outcome AI verdict — the suspense the one paying customer described as
	// exciting. Then the wall: everything else (all 39 + the committee's full "why" +
	// essay grading) is Pro. Value before the ask, at the emotional peak.
	//
	// Reuses the existing /api/ai-evaluate/[slug] engine + its free-sim server meter
	// (guardEvaluation) so it's the same one-free-prediction economics, just faster.
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { signIn } from '@auth/sveltekit/client';
	import { portals } from '$lib/config/admitMail';
	import { userProfile } from '$lib/stores/user';
	import { track } from '$lib/analytics';

	const signedIn = $derived(!!$page.data.session?.user);
	const displayEmail = $derived($page.data.session?.user?.email ?? '');
	const displayName = $derived($page.data.session?.user?.name ?? '');

	// School picker options (name + slug for all 39), alphabetized for scanning.
	const schoolOptions = [...portals]
		.map((p) => ({ slug: p.slug, name: p.name }))
		.sort((a, b) => a.name.localeCompare(b.name));

	let schoolSlug = $state('');
	let gpa = $state('');
	let testScore = $state('');
	let extras = $state('');
	let major = $state('');

	type Phase = 'input' | 'reading' | 'result';
	let phase = $state<Phase>('input');
	let error = $state('');
	let planRequired = $state(false);

	type Verdict = {
		school: string;
		slug: string;
		outcome: 'admit' | 'deny' | 'waitlist' | 'defer';
		academic_explanation?: string;
	};
	let verdict = $state<Verdict | null>(null);

	const selectedSchoolName = $derived(
		schoolOptions.find((s) => s.slug === schoolSlug)?.name ?? ''
	);

	const outcomeMeta: Record<string, { label: string; ring: string; text: string; bg: string }> = {
		admit: { label: 'Likely Admit', ring: 'ring-emerald-200', text: 'text-emerald-700', bg: 'bg-emerald-50' },
		deny: { label: 'Likely Deny', ring: 'ring-rose-200', text: 'text-rose-700', bg: 'bg-rose-50' },
		waitlist: { label: 'Likely Waitlist', ring: 'ring-amber-200', text: 'text-amber-700', bg: 'bg-amber-50' },
		defer: { label: 'Likely Defer', ring: 'ring-blue-200', text: 'text-blue-700', bg: 'bg-blue-50' }
	};

	function persistForFullRun() {
		// Carry what they entered into the profile so a later full /ai run is
		// pre-filled — cutting the friction to the paid all-39 value too.
		userProfile.update((u) => {
			const looksLikeSat = /^\d{3,4}$/.test(testScore.trim()) && Number(testScore) >= 400;
			return {
				...u,
				stats: {
					...u.stats,
					gpaUnweighted: u.stats.gpaUnweighted || gpa,
					sat: u.stats.sat || (looksLikeSat ? testScore.trim() : u.stats.sat),
					act: u.stats.act || (!looksLikeSat && testScore.trim() ? testScore.trim() : u.stats.act),
					activities: u.stats.activities || extras,
					major: u.stats.major || major
				},
				applicationProfile: {
					...u.applicationProfile,
					activities: u.applicationProfile.activities || extras
				}
			};
		});
	}

	async function revealVerdict() {
		error = '';
		if (!schoolSlug) {
			error = 'Pick the school you most want to get into.';
			return;
		}
		if (!gpa.trim()) {
			error = 'Add your unweighted GPA so the read is real.';
			return;
		}

		phase = 'reading';
		track('quick_verdict_start', { school: schoolSlug });

		// Pack the minimum into the shape /api/ai-evaluate expects. GPA/testing goes in
		// the transcript field (that's where the model reads academics — the gate).
		const transcript =
			`Unweighted GPA: ${gpa.trim()}.` + (testScore.trim() ? ` Test score: ${testScore.trim()}.` : '');
		const payload = {
			essay: '',
			activities: extras,
			honors: '',
			transcript,
			major,
			supplementals: '',
			edSlug: '',
			googleEmail: displayEmail,
			googleName: displayName
		};

		try {
			const res = await fetch(`/api/ai-evaluate/${schoolSlug}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const data = await res.json().catch(() => null);

			if (res.status === 402 || data?.code === 'plan_required') {
				// Free prediction already spent on this browser — send them to the value.
				planRequired = true;
				phase = 'result';
				track('quick_verdict_plan_required', { school: schoolSlug });
				return;
			}
			if (!res.ok || !data?.decision) {
				error =
					data?.code === 'ai_upstream' || res.status >= 500
						? "Our engine hit a snag reading your file. That's on us, not you — try again in a moment."
						: 'That read did not come back. Add a bit more and try again.';
				phase = 'input';
				return;
			}

			verdict = data.decision as Verdict;
			persistForFullRun();
			phase = 'result';
			track('quick_verdict_complete', { school: schoolSlug, outcome: verdict.outcome });
		} catch {
			error = "Couldn't reach the engine. Check your connection and try again.";
			phase = 'input';
		}
	}

	// One-click checkout straight to Stripe — no detour through /pro. The user is
	// already signed in (they signed in for the verdict) and at the emotional peak,
	// so take the yes here. Defaults to $9.99/mo (the plan that converts). Falls back
	// to /pro only if the checkout session can't be created.
	let checkingOut = $state(false);
	async function unlockAll() {
		if (checkingOut) return;
		checkingOut = true;
		track('quick_verdict_upsell_click', { where: 'unlock_all', school: schoolSlug });
		track('checkout_step_1', { plan: 'monthly', where: 'verdict' });
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pricingMode: 'monthly' })
			});
			const data = await res.json().catch(() => null);
			if (data?.url) {
				window.location.href = data.url;
				return;
			}
			goto('/pro');
		} catch {
			goto('/pro');
		} finally {
			checkingOut = false;
		}
	}
</script>

<svelte:head>
	<title>Your real admission verdict, in 20 seconds — PredictAdmit</title>
	<meta
		name="description"
		content="Pick your dream school, add your stats, and see your real AI admission verdict in about 20 seconds. Accept, deny, or waitlist — free. Then unlock all 39 schools."
	/>
</svelte:head>

<main class="min-h-screen bg-[#FAFAFA] font-sans text-slate-900">
	<div class="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
		<!-- Header copy stays constant across phases so it reads as one moment. -->
		<div class="text-center">
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">PredictAdmit</p>
			<h1 class="mt-4 font-serif text-4xl font-medium leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
				Find out now. <span class="text-[#1A4CFF]">Not in March.</span>
			</h1>
			<p class="mx-auto mt-4 max-w-md text-lg leading-relaxed text-slate-500">
				Your real AI verdict at one dream school, in about 20 seconds. Free.
			</p>
		</div>

		{#if !signedIn}
			<!-- Sign-in is the only gate besides school + stats: it captures the email and
			     is the server-side cost/abuse boundary for the engine. -->
			<div class="mt-10 rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm">
				<p class="text-[15px] leading-relaxed text-slate-600">
					Sign in to run your application through the engine. Your first verdict is free, no card.
				</p>
				<button
					onclick={() => signIn('google', { callbackUrl: '/verdict' })}
					class="mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-slate-900 px-6 py-4 text-base font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 11v2.5h4.9c-.2 1.2-1.5 3.6-4.9 3.6-2.9 0-5.3-2.4-5.3-5.4S9 6.3 12 6.3c1.7 0 2.8.7 3.4 1.3l1.8-1.8C16.9 4.5 14.7 3.6 12 3.6 7.4 3.6 3.7 7.3 3.7 12s3.7 8.4 8.3 8.4c4.8 0 8-3.4 8-8.1 0-.5 0-.9-.1-1.3H12z"/></svg>
					Continue with Google
				</button>
				<p class="mt-4 text-xs text-slate-400">Free first verdict · nothing to install</p>
			</div>
		{:else if phase === 'input'}
			<div class="mt-10 space-y-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
				<div>
					<label for="school" class="block text-sm font-semibold text-slate-900">Your dream school</label>
					<select
						id="school"
						bind:value={schoolSlug}
						class="mt-2 w-full cursor-pointer rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition hover:border-slate-300 focus:border-[#1A4CFF] focus:outline-none focus:ring-4 focus:ring-[#1A4CFF]/10"
					>
						<option value="" disabled selected>Pick the one you most want →</option>
						{#each schoolOptions as s}
							<option value={s.slug}>{s.name}</option>
						{/each}
					</select>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="gpa" class="block text-sm font-semibold text-slate-900">Unweighted GPA</label>
						<input
							id="gpa"
							bind:value={gpa}
							inputmode="decimal"
							placeholder="3.9"
							class="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition hover:border-slate-300 focus:border-[#1A4CFF] focus:outline-none focus:ring-4 focus:ring-[#1A4CFF]/10"
						/>
					</div>
					<div>
						<label for="test" class="block text-sm font-semibold text-slate-900">SAT / ACT <span class="font-normal text-slate-400">· optional</span></label>
						<input
							id="test"
							bind:value={testScore}
							placeholder="1520"
							class="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition hover:border-slate-300 focus:border-[#1A4CFF] focus:outline-none focus:ring-4 focus:ring-[#1A4CFF]/10"
						/>
					</div>
				</div>

				<div>
					<label for="major" class="block text-sm font-semibold text-slate-900">Intended major <span class="font-normal text-slate-400">· optional</span></label>
					<input
						id="major"
						bind:value={major}
						placeholder="Computer Science"
						class="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition hover:border-slate-300 focus:border-[#1A4CFF] focus:outline-none focus:ring-4 focus:ring-[#1A4CFF]/10"
					/>
				</div>

				<div>
					<label for="extras" class="block text-sm font-semibold text-slate-900">
						Anything that makes you you <span class="font-normal text-slate-400">· optional</span>
					</label>
					<textarea
						id="extras"
						bind:value={extras}
						rows="3"
						placeholder="Activities, awards, a line about your essay. The more you add, the sharper the read."
						class="mt-2 w-full resize-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition hover:border-slate-300 focus:border-[#1A4CFF] focus:outline-none focus:ring-4 focus:ring-[#1A4CFF]/10"
					></textarea>
				</div>

				{#if error}
					<p class="text-sm font-medium text-rose-600">{error}</p>
				{/if}

				<button
					onclick={revealVerdict}
					class="w-full rounded-full bg-slate-900 px-6 py-4 text-base font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
				>
					Reveal my verdict →
				</button>
				<p class="text-center text-xs text-slate-400">
					A real AI read of your file. Not a real or official decision; not affiliated with any school.
				</p>
			</div>
		{:else if phase === 'reading'}
			<div class="mt-10 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
				<div class="mx-auto grid h-14 w-14 animate-pulse place-items-center rounded-full bg-[#1A4CFF]/10">
					<svg class="h-7 w-7 text-[#1A4CFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
				</div>
				<p class="mt-5 font-serif text-2xl font-medium tracking-tight text-slate-900">
					The committee is reading your file…
				</p>
				<p class="mt-2 text-sm text-slate-500">{selectedSchoolName}</p>
			</div>
		{:else if phase === 'result'}
			{#if planRequired}
				<div class="mt-10 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
					<h2 class="font-serif text-2xl font-medium tracking-tight text-slate-900">That was your free verdict.</h2>
					<p class="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-slate-600">
						Unlock your verdict at all 39 top schools, the committee's full breakdown of each, and
						essay grading before you submit.
					</p>
					<button onclick={unlockAll} disabled={checkingOut} class="mt-6 w-full rounded-full bg-slate-900 px-6 py-4 text-base font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60">
						{checkingOut ? 'Opening checkout…' : 'Unlock all 39 verdicts · $9.99/mo →'}
					</button>
					<a href="/pro" class="mt-3 inline-block text-xs font-semibold text-slate-400 hover:text-slate-600">See everything in Pro first →</a>
				</div>
			{:else if verdict}
				<div class="mt-10 space-y-5">
					<!-- The reveal: real, unknown-outcome verdict. This is the aha. -->
					<div class="animate-in fade-in zoom-in-95 duration-500 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
						<p class="text-xs font-bold uppercase tracking-wide text-slate-500">{verdict.school}</p>
						<div class="mt-4 flex justify-center">
							<span class="rounded-full px-6 py-2 text-xl font-black uppercase tracking-wide ring-2 {outcomeMeta[verdict.outcome]?.bg} {outcomeMeta[verdict.outcome]?.text} {outcomeMeta[verdict.outcome]?.ring}">
								{outcomeMeta[verdict.outcome]?.label ?? verdict.outcome}
							</span>
						</div>
						{#if verdict.academic_explanation}
							<p class="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-slate-600">
								{verdict.academic_explanation.slice(0, 220)}{verdict.academic_explanation.length > 220 ? '…' : ''}
							</p>
						{/if}
						<p class="mt-5 text-[11px] leading-relaxed text-slate-400">
							A PredictAdmit AI simulation, not a real or official admission decision. Not affiliated with any university.
						</p>
					</div>

					<!-- The wall: the depth + the other 38 are Pro. Sold at the peak. -->
					<div class="rounded-3xl border-2 border-slate-900 bg-slate-900 p-7 text-center text-white">
						<h2 class="font-serif text-2xl font-medium tracking-tight">That's 1 of 39.</h2>
						<p class="mx-auto mt-2.5 max-w-sm text-[15px] leading-relaxed text-slate-300">
							See your verdict at every top school, the five-reader committee's full reasoning on
							each, and your essays graded before you submit.
						</p>
						<button onclick={unlockAll} disabled={checkingOut} class="mt-6 w-full rounded-full bg-white px-6 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-100 active:scale-[0.99] disabled:opacity-60">
							{checkingOut ? 'Opening checkout…' : 'Unlock all 39 verdicts + why · $9.99/mo →'}
						</button>
						<p class="mt-3 text-xs text-slate-400">
							cancel anytime · or $25 once ·
							<a href="/pro" class="underline hover:text-slate-200">see details</a>
						</p>
					</div>

					<button onclick={() => { phase = 'input'; verdict = null; }} class="w-full py-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
						← Try another school
					</button>
				</div>
			{/if}
		{/if}
	</div>
</main>
