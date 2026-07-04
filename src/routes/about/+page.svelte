<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';

	const stats = [
		{ value: '5,000+', label: 'Students on PredictAdmit' },
		{ value: '39', label: 'Universities simulated' },
		{ value: '$9', label: 'Lifetime Pro access' },
		{ value: '1', label: 'Free simulation to start' }
	];

	const differentiators = [
		{
			icon: '🎯',
			title: 'Practice the real moment',
			body: 'Log into realistic simulated applicant portals for 39 universities and open a simulated decision letter. Feel the moment before it happens for real — every screen is clearly labeled as a simulation.'
		},
		{
			icon: '✍️',
			title: 'Try everything free',
			body: 'Every account starts with a free AI simulation and a taste of the full toolkit — essay grader, AI counselor, chances predictor, and mind-map. No credit card required to start.'
		},
		{
			icon: '⚡',
			title: 'Pro unlocks it all',
			body: 'PredictAdmit Pro removes every limit: unlimited AI simulations, full deep-dive decision analyses, and unlimited essay grading — $5/month or $9 once for lifetime access. Less than a private consultant charges per minute.'
		},
		{
			icon: '🔍',
			title: 'Honest by design',
			body: 'Everything simulated is labeled a simulation. We never claim to guarantee admission or fake an acceptance. And the AI gives feedback on your writing — it never writes your essays for you. Your application stays 100% your own work.'
		}
	];

	const testimonials = [
		{
			quote:
				'Opening the simulated Stanford portal was terrifying in the best way. It made me take my essays way more seriously before the real deadlines hit.',
			name: 'Priya',
			role: 'Class of 2025 applicant'
		},
		{
			quote:
				'The essay grader caught the cliché opening I would have submitted. The deep dive on my rejection showed me exactly which part of my application was weakest.',
			name: 'Marcus',
			role: 'First-gen applicant'
		},
		{
			quote:
				'Nine dollars for unlimited runs was the easiest decision of my application season. I stress-tested my list until every school on it made sense.',
			name: 'Elena',
			role: 'Class of 2026 applicant'
		}
	];

	const faqs: { q: string; a: string; link?: { href: string; label: string } }[] = [
		{
			q: 'Is PredictAdmit free?',
			a: 'You can start free: every account gets a free AI simulation and access to try the tools, no credit card required. PredictAdmit Pro unlocks unlimited simulations, full deep-dive analyses, and unlimited essay grading for $5/month — or $9 once for lifetime access.'
		},
		{
			q: 'Are the decision letters real?',
			a: 'No. The portals and decision letters in the simulator are simulations built for practice, and every screen is clearly labeled as one. They exist to help you prepare for the real thing — they are not official communications from any university.'
		},
		{
			q: 'What exactly does Pro include?',
			a: 'Unlimited AI admissions simulations across all 39 universities, the full deep-dive analysis behind every decision (five scored dimensions plus improvement tips), unlimited essay grading, the AI counselor, and the mind-map planner. One payment covers everything — there are no add-ons.'
		},
		{
			q: 'How accurate is the predictor?',
			a: 'The chances predictor is a data-informed estimate, not a promise. It reflects how an application like yours tends to fare, and it is meant to help you build a balanced list and focus your effort — not to guarantee any outcome.'
		},
		{
			q: 'Where does the prediction data come from?',
			a: 'Our factor weights are based on the "Factors in the Admission Decision" survey published by NACAC — the National Association for College Admission Counseling, the professional association of 28,000+ admission officers and counselors — which reports how much four-year colleges weight grades, curriculum rigor, test scores, essays, and other factors. Those weights are calibrated against admitted-student profiles from HYPSM and Top-20 universities in the 2026 admissions cycle. NACAC is not affiliated with and does not endorse PredictAdmit.',
			link: { href: '/methodology', label: 'Read the full methodology →' }
		}
	];
</script>

<svelte:head>
	<title>About PredictAdmit — Your unfair advantage in college admissions</title>
	<meta
		name="description"
		content="PredictAdmit gives students a realistic admissions simulator, an AI essay workshop, and a chances predictor. Start with a free simulation; Pro unlocks everything for $9. Everything simulated is clearly labeled."
	/>
	<meta property="og:title" content="About PredictAdmit — Your unfair advantage in college admissions" />
	<meta
		property="og:description"
		content="Practice on realistic simulated applicant portals and sharpen your essays with AI. One free simulation to start — Pro unlocks unlimited for $9."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="About PredictAdmit" />
	<meta
		name="twitter:description"
		content="A realistic admissions simulator, an AI essay workshop, and a chances predictor. Free to try — Pro unlocks unlimited for $9."
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
				Your unfair advantage in college admissions.
			</h1>
			<p class="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-10">
				We help students feel decision day before it's real, sharpen their essays with AI, and know
				exactly where they stand — for less than the cost of lunch.
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
					Why PredictAdmit is different
				</h2>
				<p class="text-lg text-slate-500 leading-relaxed">
					A realistic simulator and a full AI toolkit — priced for students, with one rule: total
					honesty about what is real and what is practice.
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
				One upgrade. Everything unlocked.
			</h2>
			<p class="text-lg text-slate-500 leading-relaxed">
				Start with a free simulation. When you're ready, Pro removes every limit — for less than a
				private consultant charges per minute.
			</p>
		</div>
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
			{#each [
				{ icon: '🔮', title: 'Unlimited AI simulations', body: 'Run your profile against all 39 universities as many times as you want. Change your essay, rerun, and watch what moves.' },
				{ icon: '🔬', title: 'Full deep-dive analyses', body: 'Every decision comes with five scored dimensions and specific improvement tips — the "why" behind the outcome, unblurred.' },
				{ icon: '📝', title: 'Unlimited essay grading', body: 'Grade every draft of every essay. The AI reads like a coded, blunt admissions officer — before a real one does.' }
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
				Go Pro — $5/mo or $9 lifetime →
			</a>
			<span class="text-sm text-slate-400">Free simulation included. No credit card to start.</span>
		</div>
	</section>

	<!-- Testimonials -->
	<section class="bg-slate-50 border-y border-slate-100 py-24">
		<div class="max-w-5xl mx-auto px-6">
			<div class="text-center max-w-2xl mx-auto mb-14">
				<h2 class="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
					What students say
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
				Ready to see where you stand?
			</h2>
			<p class="text-lg text-white/80 leading-relaxed max-w-xl mx-auto mb-10">
				Start with the free AI tools, or step into a simulated portal and feel the moment before it's
				real.
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
					Try the simulator
				</a>
			</div>
		</div>
	</section>

	<SiteFooter />
</main>
