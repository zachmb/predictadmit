<script lang="ts">
	// QUICK ENTRY INTO THE FULL SIMULATION (2026-09-12).
	//
	// A low-friction way in: collect a quick profile (dream school + GPA + a couple
	// optional lines), then hand off to /ai and auto-run the FULL 39-school
	// simulation — the whole inbox experience, not one school. The prefill + autorun
	// flag ride in sessionStorage (survives the OAuth round-trip), so a signed-out
	// user signs in once and lands straight in a running full sim.
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { signIn } from '@auth/sveltekit/client';
	import { portals } from '$lib/config/admitMail';
	import { userProfile } from '$lib/stores/user';
	import { majors } from '$lib/config/majors';
	import { track } from '$lib/analytics';

	const signedIn = $derived(!!$page.data.session?.user);

	// School picker options (name + slug for all 39), alphabetized for scanning.
	const schoolOptions = [...portals]
		.map((p) => ({ slug: p.slug, name: p.name }))
		.sort((a, b) => a.name.localeCompare(b.name));

	let schoolSlug = $state('');
	let gpa = $state('');
	let testScore = $state('');
	let extras = $state('');
	let major = $state('');
	let error = $state('');
	let launching = $state(false);

	// Intended-major autofill (same list the full builder uses).
	let showMajorDropdown = $state(false);
	let majorSuggestions = $derived(
		major.trim().length > 0
			? majors
					.filter((m) => m.toLowerCase().includes(major.toLowerCase()) && m !== major)
					.slice(0, 5)
			: []
	);

	function persistForFullRun() {
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

	// Build the /ai builder prefill and hand off to the full 39-school simulation.
	function launchFullSim() {
		error = '';
		if (!gpa.trim()) {
			error = 'Add your unweighted GPA so the read is real.';
			return;
		}
		launching = true;
		track('verdict_launch_full_sim', { school: schoolSlug || '(none)' });

		const transcript =
			`Unweighted GPA: ${gpa.trim()}.` + (testScore.trim() ? ` Test score: ${testScore.trim()}.` : '');
		persistForFullRun();
		try {
			sessionStorage.setItem(
				'pa_sim_prefill',
				JSON.stringify({ transcript, activities: extras, major, essay: '', honors: '' })
			);
			sessionStorage.setItem('pa_autorun_sim', '1');
			// Remember their dream school so /ai can spotlight it in the inbox later.
			if (schoolSlug) sessionStorage.setItem('pa_dream_school', schoolSlug);
		} catch {
			/* storage blocked — /ai will still open, just without the prefill */
		}

		if (signedIn) {
			goto('/ai');
		} else {
			// sessionStorage survives the OAuth redirect; after sign-in /ai autoruns.
			signIn('google', { callbackUrl: '/ai' });
		}
	}
</script>

<svelte:head>
	<title>Run your full admission simulation — PredictAdmit</title>
	<meta
		name="description"
		content="Add your stats and run your real AI admission simulation across all 39 top schools in about 20 seconds. Accept, deny, or waitlist at every school. First run free."
	/>
</svelte:head>

<main class="min-h-screen pa-grid font-sans text-navy">
	<div class="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
		<!-- Header copy stays constant across phases so it reads as one moment. -->
		<div class="text-center">
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted">PredictAdmit</p>
			<h1 class="mt-4 font-display text-4xl leading-[1.05] text-navy sm:text-5xl">
				Perfect your applications <span class="text-blue">before it's too late.</span>
			</h1>
			<p class="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted">
				Your real AI verdict at every top school, in about 20 seconds. Free.
			</p>
		</div>

		<div class="mt-10 space-y-5 pa-card p-7">
			<div>
				<label for="school" class="block text-sm font-semibold text-navy">Your dream school <span class="font-normal text-muted">· optional</span></label>
				<select
					id="school"
					bind:value={schoolSlug}
					class="mt-2 w-full cursor-pointer rounded-xl border-2 border-navy bg-card px-4 py-3 text-sm text-navy transition focus:border-blue focus:outline-none"
				>
					<option value="">All 39 schools</option>
					{#each schoolOptions as s}
						<option value={s.slug}>{s.name}</option>
					{/each}
				</select>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="gpa" class="block text-sm font-semibold text-navy">Unweighted GPA</label>
					<input
						id="gpa"
						bind:value={gpa}
						inputmode="decimal"
						placeholder="3.9"
						class="mt-2 w-full rounded-xl border-2 border-navy bg-card px-4 py-3 text-sm text-navy transition focus:border-blue focus:outline-none"
					/>
				</div>
				<div>
					<label for="test" class="block text-sm font-semibold text-navy">SAT / ACT <span class="font-normal text-muted">· optional</span></label>
					<input
						id="test"
						bind:value={testScore}
						placeholder="1520"
						class="mt-2 w-full rounded-xl border-2 border-navy bg-card px-4 py-3 text-sm text-navy transition focus:border-blue focus:outline-none"
					/>
				</div>
			</div>

			<div class="relative">
				<label for="major" class="block text-sm font-semibold text-navy">Intended major <span class="font-normal text-muted">· optional</span></label>
				<input
					id="major"
					bind:value={major}
					autocomplete="off"
					placeholder="Computer Science"
					onfocus={() => (showMajorDropdown = true)}
					onblur={() => setTimeout(() => (showMajorDropdown = false), 200)}
					class="mt-2 w-full rounded-xl border-2 border-navy bg-card px-4 py-3 text-sm text-navy transition focus:border-blue focus:outline-none"
				/>
				{#if showMajorDropdown && majorSuggestions.length > 0}
					<div class="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border-2 border-navy bg-card shadow-2xl">
						{#each majorSuggestions as m}
							<button
								type="button"
								onclick={() => {
									major = m;
									showMajorDropdown = false;
								}}
								class="w-full border-b border-paper-deep px-4 py-3 text-left text-sm font-medium text-navy transition-colors last:border-0 hover:bg-cyan hover:text-navy"
							>
								{m}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<div>
				<label for="extras" class="block text-sm font-semibold text-navy">
					Anything that makes you you <span class="font-normal text-muted">· optional</span>
				</label>
				<textarea
					id="extras"
					bind:value={extras}
					rows="3"
					placeholder="Activities, awards, a line about your essay. The more you add, the sharper the read."
					class="mt-2 w-full resize-none rounded-xl border-2 border-navy bg-card px-4 py-3 text-sm text-navy transition focus:border-blue focus:outline-none"
				></textarea>
			</div>

			{#if error}
				<p class="text-sm font-medium text-stamp-red">{error}</p>
			{/if}

			<button
				onclick={launchFullSim}
				disabled={launching}
				class="btn btn-primary btn-block disabled:opacity-60"
			>
				{launching ? 'Starting your simulation…' : 'Run my full simulation →'}
			</button>
			<p class="text-center text-xs text-muted">
				A real AI read of your file across all 39 schools. Not a real or official decision; not affiliated with any school.
			</p>
		</div>
	</div>
</main>
