<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
</script>

<svelte:head>
	<title>How PredictAdmit simulations work · Disclaimer</title>
	<meta
		name="description"
		content="PredictAdmit's admission portals are unofficial simulations for practice — not real decisions, not affiliated with any university. Here's how it works and what's free."
	/>
</svelte:head>

<main class="min-h-screen bg-slate-50 font-sans text-slate-800">
	<div class="mx-auto max-w-2xl px-6 py-16">
		<span
			class="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-[11px] font-bold tracking-widest text-amber-800 uppercase"
		>
			<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
				/>
			</svg>
			Simulation · not a real decision
		</span>

		<h1 class="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
			These admission portals are simulations.
		</h1>
		<p class="mt-4 text-lg leading-relaxed text-slate-600">
			Every decision portal here is a practice replica. Nothing you see is a real admissions
			decision, and PredictAdmit is
			<strong class="font-semibold text-slate-900">not affiliated with, endorsed by, or connected to</strong>
			any university. School names, logos, and portal designs belong to their owners. We show them so
			the rehearsal feels like the real thing.
		</p>

		<!-- What's free vs. paid -->
		<div class="mt-10 grid gap-4 sm:grid-cols-2">
			<div class="rounded-2xl border border-slate-200 bg-white p-6">
				<div class="flex items-center gap-2">
					<span
						class="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</span>
					<span class="text-[11px] font-bold tracking-wider text-emerald-700 uppercase">Free</span>
				</div>
				<h2 class="mt-3 text-base font-bold text-slate-900">Portal decision simulations</h2>
				<p class="mt-1.5 text-sm leading-relaxed text-slate-600">
					Open any school's portal and rehearse opening day — accepted, denied, waitlisted. As many
					times as you want, no card required.
				</p>
			</div>

			<div class="rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
				<div class="flex items-center gap-2">
					<span class="grid h-8 w-8 place-items-center rounded-lg bg-[#0052CC] text-white">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</span>
					<span class="text-[11px] font-bold tracking-wider text-[#0052CC] uppercase">Pro</span>
				</div>
				<h2 class="mt-3 text-base font-bold text-slate-900">AI decision predictions</h2>
				<p class="mt-1.5 text-sm leading-relaxed text-slate-600">
					Having the AI read your real application and predict your likely decision at each school is
					a Pro feature — 7-day free trial, then $39/month or $99 once. It's an estimate. Not a
					guarantee, and never an official decision.
				</p>
			</div>
		</div>

		<!-- Details -->
		<div class="mt-10 space-y-6 text-sm leading-relaxed text-slate-600">
			<div>
				<h3 class="text-sm font-bold text-slate-900">For entertainment and educational use</h3>
				<p class="mt-1.5">
					PredictAdmit is here to help you prepare: rehearse the moment, pressure-test your
					application, sharpen your essays. It can't admit or reject you anywhere. A real decision
					only ever comes from the university itself, through its own portal.
				</p>
			</div>
			<div>
				<h3 class="text-sm font-bold text-slate-900">Your data stays in your browser</h3>
				<p class="mt-1.5">
					Whatever you enter to run a simulation is stored locally in your browser, not tied to any
					real application. You never use or need real university credentials to open a portal here.
				</p>
			</div>
		</div>

		<!-- CTAs -->
		<div class="mt-12 flex flex-col gap-3 sm:flex-row">
			<a
				href="/"
				class="inline-flex flex-1 items-center justify-center rounded-xl bg-[#0052CC] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0047b3]"
			>
				Open a decision portal
			</a>
			<a
				href="/ai"
				class="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
			>
				Predict my real decisions
			</a>
		</div>

		<p class="mt-8 text-center text-xs text-slate-400">
			Questions? Email <a href="mailto:hello@predictadmit.com" class="underline hover:text-slate-600">hello@predictadmit.com</a>.
		</p>
	</div>

	<SiteFooter />
</main>
