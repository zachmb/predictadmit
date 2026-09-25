<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';

	const stats = [
		{ value: '5,000+', label: 'Students on PredictAdmit' },
		{ value: '39', label: 'School scenarios' },
		{ value: '$25', label: 'Lifetime, one-time' },
		{ value: 'Free', label: 'First prediction' }
	];

	const differentiators = [
		{
			icon: '🎯',
			title: 'Rehearse decision day',
			body: 'Open a fictional portal, status page, or decision letter for any of 39 schools and feel the moment before it counts. Every screen says "simulation" on it. That is the point: you get to flinch here instead of on the real day.'
		},
		{
			icon: '✍️',
			title: 'The portal sims are free',
			body: 'Open any decision portal and rehearse it (accepted, denied, waitlisted) as many times as you want, no card required. The AI tools (essay grader, counselor, chances predictor, mind-map) you can try before you pay for anything.'
		},
		{
			icon: '⚡',
			title: 'Pro is the AI prediction',
			body: 'Pro is where the AI reads your actual application and predicts your likely decision at every school, with the full analysis behind it and unlimited essay grading. Your first prediction is free; Lifetime access is $25 once (or $9.99/mo), or $4.99 for a single school. Cheaper than an hour with a private consultant.'
		},
		{
			icon: '🔍',
			title: 'We tell you what is fake',
			body: 'Every simulated screen is labeled fictional and independent. We do not guarantee admission and we never dress up a prediction as an official decision. The AI critiques your writing. It does not write it. The essay stays yours.'
		}
	];

	const testimonials = [
		{
			quote: 'ts was lowkenuinely accurate',
			name: 'Miao S.',
			role: "Accepted to Northwestern '30"
		}
	];

	const faqs: { q: string; a: string; link?: { href: string; label: string } }[] = [
		{
			q: 'Is PredictAdmit free?',
			a: 'The portal decision simulations are free. Open any school, rehearse the moment, no card required. Your first AI prediction is free too. After that, Lifetime access is $25 once (or $9.99/mo) for all 39 schools, unlimited re-runs, and the essay workshop. Care about one school only? A single-school unlock is $4.99.'
		},
		{
			q: 'Are the decision letters real?',
			a: 'No. The portals, status pages, and letters are made up, and every screen says so. They are here so decision day is not the first time you feel it. Nothing on this site comes from an actual university.'
		},
		{
			q: 'What does Pro include?',
			a: 'The AI reading of your application across all 39 schools, the full analysis behind each prediction (five scored dimensions plus what to fix), unlimited essay grading, the AI counselor, and the mind-map planner. One payment, no add-ons.'
		},
		{
			q: 'How accurate is the predictor?',
			a: 'It is an estimate, not a promise. It tells you how an application like yours tends to do so you can build a sane list and spend your effort where it moves the needle. No model can guarantee a real decision, and we do not pretend otherwise.'
		},
		{
			q: 'Where does the prediction data come from?',
			a: 'The factor weights come from NACAC (the National Association for College Admission Counseling, the professional body for 28,000+ admission officers and counselors) and their "Factors in the Admission Decision" survey, which reports how much four-year colleges weight grades, rigor, test scores, essays, and the rest. We then calibrate those weights against admitted-student profiles from HYPSM and Top-20 universities in the 2026 cycle, and against our own founding team\'s results. NACAC is independent and does not endorse PredictAdmit.',
			link: { href: '/methodology', label: 'Read the full methodology →' }
		}
	];
</script>

<svelte:head>
	<title>About PredictAdmit: Rehearse decision day before it counts</title>
	<meta
		name="description"
		content="PredictAdmit lets students rehearse decision day on fictional portals, grade essays with AI, and predict their real decisions. Portal sims are free and your first prediction is free; Lifetime access is $25 once (or $9.99/mo). Everything simulated is labeled."
	/>
	<meta property="og:title" content="About PredictAdmit: Rehearse decision day before it counts" />
	<meta
		property="og:description"
		content="Rehearse decision day on clearly-labeled fictional portals and sharpen your essays with AI. Portal sims are free. Pro predicts your real decisions for $25 once (or $9.99/mo)."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="About PredictAdmit" />
	<meta
		name="twitter:description"
		content="Rehearse decision day on fictional portals, grade your essays with AI, predict your real decisions. Free to start. Pro is $25 once (or $9.99/mo)."
	/>
</svelte:head>

<main class="min-h-screen font-sans text-ink">
	<!-- Hero -->
	<section class="relative overflow-hidden pa-hero-bg pa-rule-top">
		<div class="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
			<p
				class="inline-block mb-6 text-xs font-semibold tracking-widest uppercase bg-yellow text-navy px-3 py-1"
			>
				About PredictAdmit
			</p>
			<h1 class="font-display text-navy text-4xl md:text-6xl mb-6 text-balance">
				Feel decision day before it counts.
			</h1>
			<p class="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mx-auto mb-10">
				Rehearse the moment on a fictional portal. Grade your essays against a tough read. See where
				you actually stand. All of it for less than lunch.
			</p>
			<div class="flex flex-col sm:flex-row gap-3 justify-center">
				<a
					href="/pro"
					class="btn btn-primary"
				>
					Start free →
				</a>
				<a
					href="/pricing"
					class="btn btn-secondary"
				>
					See Pro pricing
				</a>
			</div>
			<div class="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
				<span class="inline-flex items-center gap-0.5 text-navy">
					{#each Array(5) as _}
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.3a1 1 0 00.95.68h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.83-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.4 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.68l1.07-3.3z" /></svg>
					{/each}
				</span>
				Trusted by 5,000+ students
			</div>
		</div>
	</section>

	<!-- By the numbers -->
	<section class="max-w-5xl mx-auto px-6 py-20">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			{#each stats as stat}
				<div class="pa-card p-6 text-center">
					<div class="font-display text-3xl md:text-4xl text-navy mb-1">{stat.value}</div>
					<div class="text-sm text-muted leading-snug">{stat.label}</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Why different -->
	<section class="pa-grid pa-rule-top py-24">
		<div class="max-w-5xl mx-auto px-6">
			<div class="text-center max-w-2xl mx-auto mb-14">
				<h2 class="font-display text-navy text-3xl md:text-4xl mb-4">
					What makes this different
				</h2>
				<p class="text-lg text-muted leading-relaxed">
					A real decision-day rehearsal plus a full AI toolkit, priced for students. One rule we do
					not bend: we are honest about what is simulated and what is not.
				</p>
			</div>
			<div class="grid md:grid-cols-2 gap-5">
				{#each differentiators as item}
					<div
						class="pa-card p-8"
					>
						<div class="text-3xl mb-4">{item.icon}</div>
						<h3 class="font-display text-navy text-xl mb-2">{item.title}</h3>
						<p class="text-muted leading-relaxed">{item.body}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Pro -->
	<section id="pro" class="max-w-6xl mx-auto px-6 py-24 scroll-mt-16">
		<div class="text-center max-w-2xl mx-auto mb-14">
			<h2 class="font-display text-navy text-3xl md:text-4xl mb-4">
				One upgrade. Every limit gone.
			</h2>
			<p class="text-lg text-muted leading-relaxed">
				The portal sims are free. Pro is where the AI reads your real application, for less than a
				private consultant charges per minute.
			</p>
		</div>
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
			{#each [
				{ icon: '🔮', title: 'Unlimited AI predictions', body: 'Run your real profile against all 39 schools as often as you like. Change an essay, rerun, see what moved. That is the loop consultants bill by the hour.' },
				{ icon: '🔬', title: 'The full analysis', body: 'Every prediction comes with five scored dimensions, a committee-style written critique, and a ranked list of what to fix for that school. The why, not just the verdict.' },
				{ icon: '📝', title: 'Unlimited essay grading', body: 'Ten inline notes plus a harsh read and an honest admissions-officer read on every draft. See it before a real committee does.' }
			] as f}
				<div class="flex flex-col pa-card p-6">
					<div class="text-3xl mb-3">{f.icon}</div>
					<div class="font-display text-navy mb-2">{f.title}</div>
					<p class="text-sm text-muted leading-relaxed">{f.body}</p>
				</div>
			{/each}
		</div>
		<div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
			<a
				href="/pricing"
				class="btn btn-primary"
			>
				Get PredictAdmit for $9.99/mo →
			</a>
			<span class="text-sm text-muted">Free simulation included. No credit card to start.</span>
		</div>
	</section>

	<!-- Testimonials -->
	<section class="pa-grid pa-rule-top py-24">
		<div class="max-w-5xl mx-auto px-6">
			<div class="text-center max-w-2xl mx-auto mb-14">
				<h2 class="font-display text-navy text-3xl md:text-4xl mb-4">
					What students tell us
				</h2>
				<p class="text-sm text-muted">From students who used PredictAdmit before their real decisions.</p>
			</div>
			<div class="max-w-xl mx-auto">
				{#each testimonials as t}
					<figure class="pa-card-cyan p-8 text-center">
						<blockquote class="text-xl leading-relaxed text-navy mb-5">"{t.quote}"</blockquote>
						<figcaption class="text-sm">
							<span class="font-semibold text-navy">{t.name}</span>
							<span class="text-muted"> · {t.role}</span>
						</figcaption>
					</figure>
				{/each}
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="max-w-3xl mx-auto px-6 py-24">
		<h2 class="font-display text-navy text-3xl md:text-4xl mb-12 text-center">
			Frequently asked questions
		</h2>
		<div class="divide-y divide-navy/15 border-y border-navy/20">
			{#each faqs as faq}
				<details class="group py-5">
					<summary
						class="flex cursor-pointer items-center justify-between gap-4 font-semibold text-navy list-none"
					>
						{faq.q}
						<span class="text-navy text-xl transition-transform group-open:rotate-45">+</span>
					</summary>
					<p class="mt-3 text-muted leading-relaxed">{faq.a}</p>
					{#if faq.link}
						<a
							href={faq.link.href}
							class="mt-2 inline-block text-sm font-semibold text-blue hover:underline"
						>
							{faq.link.label}
						</a>
					{/if}
				</details>
			{/each}
		</div>
	</section>

	<!-- Closing CTA -->
	<section class="cta-band">
		<div class="max-w-4xl mx-auto px-6 py-24 text-center">
			<h2 class="font-display text-white text-3xl md:text-4xl mb-4">
				Want to see where you stand?
			</h2>
			<p class="text-lg text-white/80 leading-relaxed max-w-xl mx-auto mb-10">
				Rehearse a fictional decision on any school, free. Try the AI tools while you are here.
			</p>
			<div class="flex flex-col sm:flex-row gap-3 justify-center">
				<a
					href="/pro"
					class="btn btn-light"
				>
					Start free →
				</a>
				<a
					href="/portals"
					class="btn btn-ghost"
				>
					Try the rehearsal
				</a>
			</div>
		</div>
	</section>

	<SiteFooter />
</main>
