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
			body: 'Open a fictional portal, status page, or decision letter for any of 39 schools and feel the moment before it counts. Every screen says "simulation" on it. That is the point — you get to flinch here instead of on the real day.'
		},
		{
			icon: '✍️',
			title: 'The portal sims are free',
			body: 'Open any decision portal and rehearse it — accepted, denied, waitlisted — as many times as you want, no card required. The AI tools (essay grader, counselor, chances predictor, mind-map) you can try before you pay for anything.'
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
			quote:
				'Opening the fake Stanford portal genuinely scared me. Then I went back and rewrote two essays I had thought were fine. Worth it.',
			name: 'Priya',
			role: 'Class of 2025 applicant'
		},
		{
			quote:
				'The essay grader flagged the cliché opening I was about to submit. And the breakdown on my simulated rejection pointed straight at the weakest part of my application.',
			name: 'Marcus',
			role: 'First-gen applicant'
		},
		{
			quote:
				'I ran my list against every school until the ones that did not fit fell off on their own. Easiest money I spent all season.',
			name: 'Elena',
			role: 'Class of 2026 applicant'
		}
	];

	const faqs: { q: string; a: string; link?: { href: string; label: string } }[] = [
		{
			q: 'Is PredictAdmit free?',
			a: 'The portal decision simulations are free — open any school, rehearse the moment, no card required. Your first AI prediction is free too. After that, Lifetime access is $25 once (or $9.99/mo) for all 39 schools, unlimited re-runs, and the essay workshop. Care about one school only? A single-school unlock is $4.99.'
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
			a: 'The factor weights come from NACAC — the National Association for College Admission Counseling, the professional body for 28,000+ admission officers and counselors — and their "Factors in the Admission Decision" survey, which reports how much four-year colleges weight grades, rigor, test scores, essays, and the rest. We then calibrate those weights against admitted-student profiles from HYPSM and Top-20 universities in the 2026 cycle, and against our own founding team\'s results. NACAC is independent and does not endorse PredictAdmit.',
			link: { href: '/methodology', label: 'Read the full methodology →' }
		}
	];
</script>

<svelte:head>
	<title>About PredictAdmit — Rehearse decision day before it counts</title>
	<meta
		name="description"
		content="PredictAdmit lets students rehearse decision day on fictional portals, grade essays with AI, and predict their real decisions. Portal sims are free and your first prediction is free; Lifetime access is $25 once (or $9.99/mo). Everything simulated is labeled."
	/>
	<meta property="og:title" content="About PredictAdmit — Rehearse decision day before it counts" />
	<meta
		property="og:description"
		content="Rehearse decision day on clearly-labeled fictional portals and sharpen your essays with AI. Portal sims are free — Pro predicts your real decisions for $25 once (or $9.99/mo)."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="About PredictAdmit" />
	<meta
		name="twitter:description"
		content="Rehearse decision day on fictional portals, grade your essays with AI, predict your real decisions. Free to start — Pro is $25 once (or $9.99/mo)."
	/>
</svelte:head>

<main class="min-h-screen bg-white font-sans text-slate-900">
	<!-- Hero -->
	<section class="relative overflow-hidden border-b border-slate-100">
		<div class="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
			<p
				class="inline-block mb-6 text-xs font-semibold tracking-widest uppercase text-[#0052CC] bg-[#0052CC]/10 px-3 py-1 rounded-full"
			>
				About PredictAdmit
			</p>
			<h1 class="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 text-balance">
				Feel decision day before it counts.
			</h1>
			<p class="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-10">
				Rehearse the moment on a fictional portal. Grade your essays against a tough read. See where
				you actually stand. All of it for less than lunch.
			</p>
			<div class="flex flex-col sm:flex-row gap-3 justify-center">
				<a
					href="/pro"
					class="inline-flex items-center justify-center font-semibold text-sm bg-[#0052CC] text-white px-8 py-3.5 rounded-lg hover:bg-[#003d99] transition-colors shadow-lg shadow-[#0052CC]/20"
				>
					Start free →
				</a>
				<a
					href="/pricing"
					class="inline-flex items-center justify-center font-semibold text-sm bg-white text-slate-900 px-8 py-3.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
				>
					See Pro pricing
				</a>
			</div>
			<p class="mt-6 text-sm text-slate-400">Trusted by 5,000+ students.</p>
		</div>
	</section>

	<!-- By the numbers -->
	<section class="max-w-5xl mx-auto px-6 py-20">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			{#each stats as stat}
				<div class="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center">
					<div class="text-3xl md:text-4xl font-bold text-[#0052CC] mb-1">{stat.value}</div>
					<div class="text-sm text-slate-500 leading-snug">{stat.label}</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Why different -->
	<section class="bg-slate-50 border-y border-slate-100 py-24">
		<div class="max-w-5xl mx-auto px-6">
			<div class="text-center max-w-2xl mx-auto mb-14">
				<h2 class="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
					What makes this different
				</h2>
				<p class="text-lg text-slate-500 leading-relaxed">
					A real decision-day rehearsal plus a full AI toolkit, priced for students. One rule we do
					not bend: we are honest about what is simulated and what is not.
				</p>
			</div>
			<div class="grid md:grid-cols-2 gap-5">
				{#each differentiators as item}
					<div
						class="rounded-2xl bg-white border border-slate-100 p-8 hover:border-[#0052CC]/30 hover:shadow-sm transition-all"
					>
						<div class="text-3xl mb-4">{item.icon}</div>
						<h3 class="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
						<p class="text-slate-500 leading-relaxed">{item.body}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Pro -->
	<section id="pro" class="max-w-6xl mx-auto px-6 py-24 scroll-mt-16">
		<div class="text-center max-w-2xl mx-auto mb-14">
			<h2 class="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
				One upgrade. Every limit gone.
			</h2>
			<p class="text-lg text-slate-500 leading-relaxed">
				The portal sims are free. Pro is where the AI reads your real application — for less than a
				private consultant charges per minute.
			</p>
		</div>
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
			{#each [
				{ icon: '🔮', title: 'Unlimited AI predictions', body: 'Run your real profile against all 39 schools as often as you like. Change an essay, rerun, see what moved. That is the loop consultants bill by the hour.' },
				{ icon: '🔬', title: 'The full analysis', body: 'Every prediction comes with five scored dimensions, a committee-style written critique, and a ranked list of what to fix for that school. The why, not just the verdict.' },
				{ icon: '📝', title: 'Unlimited essay grading', body: 'Ten inline notes plus a harsh read and an honest admissions-officer read on every draft. See it before a real committee does.' }
			] as f}
				<div class="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 hover:shadow-md transition-shadow">
					<div class="text-3xl mb-3">{f.icon}</div>
					<div class="font-bold text-slate-900 mb-2">{f.title}</div>
					<p class="text-sm text-slate-600 leading-relaxed">{f.body}</p>
				</div>
			{/each}
		</div>
		<div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
			<a
				href="/pricing"
				class="inline-flex items-center justify-center font-semibold text-sm bg-[#0052CC] text-white px-8 py-3.5 rounded-lg hover:bg-[#003d99] transition-colors shadow-lg shadow-[#0052CC]/20"
			>
				Get Lifetime — $25 once →
			</a>
			<span class="text-sm text-slate-400">Free simulation included. No credit card to start.</span>
		</div>
	</section>

	<!-- Testimonials -->
	<section class="bg-slate-50 border-y border-slate-100 py-24">
		<div class="max-w-5xl mx-auto px-6">
			<div class="text-center max-w-2xl mx-auto mb-14">
				<h2 class="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
					What students tell us
				</h2>
				<p class="text-sm text-slate-400">Illustrative quotes from students using PredictAdmit.</p>
			</div>
			<div class="grid md:grid-cols-3 gap-5">
				{#each testimonials as t}
					<figure class="flex flex-col rounded-2xl bg-white border border-slate-100 p-8">
						<blockquote class="text-slate-700 leading-relaxed mb-6 grow">"{t.quote}"</blockquote>
						<figcaption class="text-sm">
							<span class="font-semibold text-slate-900">{t.name}</span>
							<span class="text-slate-400"> · {t.role}</span>
						</figcaption>
					</figure>
				{/each}
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="max-w-3xl mx-auto px-6 py-24">
		<h2 class="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-12 text-center">
			Frequently asked questions
		</h2>
		<div class="divide-y divide-slate-100 border-y border-slate-100">
			{#each faqs as faq}
				<details class="group py-5">
					<summary
						class="flex cursor-pointer items-center justify-between gap-4 font-semibold text-slate-900 list-none"
					>
						{faq.q}
						<span class="text-[#0052CC] text-xl transition-transform group-open:rotate-45">+</span>
					</summary>
					<p class="mt-3 text-slate-500 leading-relaxed">{faq.a}</p>
					{#if faq.link}
						<a
							href={faq.link.href}
							class="mt-2 inline-block text-sm font-semibold text-[#0052CC] hover:underline"
						>
							{faq.link.label}
						</a>
					{/if}
				</details>
			{/each}
		</div>
	</section>

	<!-- Closing CTA -->
	<section class="bg-[#0052CC]">
		<div class="max-w-4xl mx-auto px-6 py-24 text-center">
			<h2 class="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
				Want to see where you stand?
			</h2>
			<p class="text-lg text-white/80 leading-relaxed max-w-xl mx-auto mb-10">
				Rehearse a fictional decision on any school, free. Try the AI tools while you are here.
			</p>
			<div class="flex flex-col sm:flex-row gap-3 justify-center">
				<a
					href="/pro"
					class="inline-flex items-center justify-center font-semibold text-sm bg-white text-[#0052CC] px-8 py-3.5 rounded-lg hover:bg-slate-100 transition-colors shadow-lg"
				>
					Start free →
				</a>
				<a
					href="/portals"
					class="inline-flex items-center justify-center font-semibold text-sm bg-transparent text-white px-8 py-3.5 rounded-lg border border-white/40 hover:bg-white/10 transition-colors"
				>
					Try the rehearsal
				</a>
			</div>
		</div>
	</section>

	<SiteFooter />
</main>
