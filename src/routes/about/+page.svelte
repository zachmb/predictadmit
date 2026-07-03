<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import { counselors } from '$lib/config/counselors';
	import { readableTextColor } from '$lib/config/schoolStats';

	// Show a handful of mentors on the About page.
	const featuredMentors = counselors.slice(0, 6);

	const stats = [
		{ value: '5,000+', label: 'Students on PredictAdmit' },
		{ value: '40', label: 'Universities simulated' },
		{ value: '8', label: 'Verified T20 mentors' },
		{ value: '$0', label: 'AI tools are free' }
	];

	const differentiators = [
		{
			icon: '🎯',
			title: 'Practice on the real thing',
			body: 'Log into pixel-accurate recreations of 40 real applicant portals and open a simulated decision letter. Feel the moment before it happens for real — every screen is clearly labeled as a simulation.'
		},
		{
			icon: '✍️',
			title: 'Free AI essay workshop',
			body: 'PredictAdmit Pro gives you an essay grader, an AI counselor, a chances predictor, and a mind-map to plan your list — all free. No credit card, no trial timer.'
		},
		{
			icon: '🎓',
			title: 'Mentors who just did it',
			body: 'Our 1:1 counselors are verified current students who got into a Top-20 this cycle. You get advice from someone who navigated the same portals months ago — not decades ago.'
		},
		{
			icon: '🔍',
			title: 'Honest by design',
			body: 'Everything simulated is labeled a simulation. We never claim to guarantee admission or fake an acceptance. The predictor gives you an honest read on where you stand.'
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
				'The free essay grader caught the cliché opening I would have submitted. My intro call with a mentor turned a rambling draft into something that sounded like me.',
			name: 'Marcus',
			role: 'First-gen applicant'
		},
		{
			quote:
				'Talking to someone who got into my dream school this year — not ten years ago — was the single most useful hour of my whole application process.',
			name: 'Elena',
			role: 'Class of 2026 applicant'
		}
	];

	const faqs = [
		{
			q: 'Is PredictAdmit free?',
			a: 'Yes — the AI tools inside PredictAdmit Pro (essay grader, AI counselor, chances predictor, and mind-map) and the admissions simulator are all free to use. Booking a 1:1 human mentor for a working session is paid, but every mentor offers a free intro call first.'
		},
		{
			q: 'Are the decision letters real?',
			a: 'No. The portals and decision letters in the simulator are recreations built for practice, and every screen is clearly labeled as a simulation. They exist to help you prepare for the real thing — they are not official communications from any university.'
		},
		{
			q: 'Are the mentors real T20 students?',
			a: 'Yes. Every 1:1 counselor is a verified current student who was admitted to a Top-20 university in the most recent admissions cycle. Their profiles list exactly which schools they were accepted to as the trust proof.'
		},
		{
			q: 'How do I book a mentor?',
			a: 'Head to PredictAdmit Pro and open the Human Counselors tab. Browse mentors by school and specialty, start with a free intro call, and book a paid working session or package if it feels like the right fit.'
		},
		{
			q: 'How accurate is the predictor?',
			a: 'The chances predictor is a data-informed estimate, not a promise. It reflects how an application like yours tends to fare, and it is meant to help you build a balanced list and focus your effort — not to guarantee any outcome.'
		}
	];
</script>

<svelte:head>
	<title>About PredictAdmit — Your unfair advantage in college admissions</title>
	<meta
		name="description"
		content="PredictAdmit gives students a hyper-realistic admissions simulator, a free AI essay workshop and chances predictor, and 1:1 mentorship from verified current Top-20 students. Everything simulated is clearly labeled."
	/>
	<meta property="og:title" content="About PredictAdmit — Your unfair advantage in college admissions" />
	<meta
		property="og:description"
		content="Practice on pixel-accurate applicant portals, sharpen your essays with free AI tools, and book mentors who got into a Top-20 this cycle."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="About PredictAdmit" />
	<meta
		name="twitter:description"
		content="A hyper-realistic admissions simulator, a free AI essay workshop, and 1:1 mentors who just got into a Top-20."
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
				We help students practice on the real thing, sharpen their essays with free AI, and learn
				from mentors who just walked through the same doors.
			</p>
			<div class="flex flex-col sm:flex-row gap-3 justify-center">
				<a
					href="/pro"
					class="inline-flex items-center justify-center font-semibold text-sm bg-[#0052CC] text-white px-8 py-3.5 rounded-lg hover:bg-[#003d99] transition-colors shadow-lg shadow-[#0052CC]/20"
				>
					Start free →
				</a>
				<a
					href="#mentors"
					class="inline-flex items-center justify-center font-semibold text-sm bg-white text-slate-900 px-8 py-3.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
				>
					Meet our mentors
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
					Three pillars — a realistic simulator, free AI tools, and real human mentors — with one
					rule: total honesty about what is real and what is practice.
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

	<!-- Meet our mentors -->
	<section id="mentors" class="max-w-6xl mx-auto px-6 py-24 scroll-mt-16">
		<div class="text-center max-w-2xl mx-auto mb-14">
			<h2 class="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
				Meet our mentors
			</h2>
			<p class="text-lg text-slate-500 leading-relaxed">
				Verified current students who got into a Top-20 this cycle. Start with a free intro call —
				book a working session only if it clicks.
			</p>
		</div>
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
			{#each featuredMentors as mentor}
				{@const firstName = mentor.name.split(' ')[0]}
				<div class="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 hover:shadow-md transition-shadow">
					<div class="flex items-center gap-4 mb-4">
						<div
							class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold"
							style="background-color: {mentor.color}; color: {readableTextColor(mentor.color)};"
						>
							{firstName[0]}
						</div>
						<div>
							<div class="font-bold text-slate-900 leading-tight">{mentor.name}</div>
							<div class="text-sm text-[#0052CC] font-medium">{mentor.school}</div>
						</div>
					</div>
					<p class="text-sm text-slate-600 leading-relaxed mb-4">{mentor.headline}</p>
					<div class="flex flex-wrap gap-1.5 mb-4">
						{#each mentor.specialties.slice(0, 3) as tag}
							<span class="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
								{tag}
							</span>
						{/each}
					</div>
					<div class="mt-auto pt-4 border-t border-slate-100">
						<div class="text-xs text-slate-400 mb-3">
							<span class="font-semibold text-slate-500">Accepted to:</span>
							{mentor.acceptedTo.join(', ')}
						</div>
						<a
							href="/pro"
							class="inline-flex items-center justify-center w-full font-semibold text-sm bg-[#0052CC] text-white px-4 py-2.5 rounded-lg hover:bg-[#003d99] transition-colors"
						>
							Book {firstName} →
						</a>
					</div>
				</div>
			{/each}
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
