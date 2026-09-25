<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/common/Card.svelte';
	import { fade, fly } from 'svelte/transition';

	const features = [
		{
			title: 'Graded against the school you pick',
			desc: 'The read is tuned to the kind of applicant a given school actually admits. What plays at Stanford is not what plays at UChicago.'
		},
		{
			title: 'The notes, not the pep talk',
			desc: 'No "great start!" filler. You get the blunt margin notes an admissions officer would jot in your file, and one concrete thing to fix.'
		},
		{
			title: 'Scored 1-10 by category',
			desc: 'Separate scores for major fit, writing, and growth, each with a reason. You see exactly which part is dragging the essay down.'
		},
		{
			title: 'Re-grade as many times as you want',
			desc: 'Edit, paste it back, grade again. It gives feedback on every draft. It never writes a word of the essay for you.'
		}
	];
</script>

<div class="min-h-screen pb-24">
	<section class="pa-hero-bg relative pt-20 pb-16 overflow-hidden">
		<div class="max-w-7xl mx-auto px-6 relative z-10">
			<div class="text-center max-w-3xl mx-auto">
				<span
					class="inline-block py-1 px-3 bg-blue text-white text-[10px] font-black uppercase tracking-widest mb-4"
				>
					Essay Grader
				</span>
				<h1
					class="text-5xl md:text-6xl font-display text-navy tracking-tighter mb-6 leading-tight"
				>
					Find out where your essay <span class="text-blue">actually stands.</span>
				</h1>
				<p class="text-xl text-muted leading-relaxed mb-10">
					Waitlist versus accept often comes down to one paragraph. Paste your draft and see the
					notes an admissions officer would write, plus what to change. The grader never writes the essay for you.
				</p>

				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onclick={() => goto('/pro')}
						class="btn btn-primary text-lg"
					>
						Run your first prediction free
					</button>
				</div>
			</div>
		</div>
	</section>

	<section class="max-w-6xl mx-auto px-6 py-12">
		<div class="grid md:grid-cols-2 gap-8">
			{#each features as feature, i}
				<div
					in:fly={{ y: 20, delay: i * 100 }}
					class="pa-card p-8 group"
				>
					<h3 class="text-xl font-display text-navy mb-3">{feature.title}</h3>
					<p class="text-muted leading-relaxed">
						{feature.desc}
					</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="max-w-5xl mx-auto px-6 mt-20">
		<Card
			class="cta-band border-none p-0 overflow-hidden"
		>
			<div class="grid md:grid-cols-5">
				<div
					class="md:col-span-2 p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10"
				>
					<h2 class="text-white text-3xl font-display tracking-tight mb-4">See what they see.</h2>
					<p class="text-white/70">
						Real admissions notes are short, blunt, and unsentimental. This is what that sounds like when it's pointed at your draft.
					</p>
				</div>
				<div class="md:col-span-3 p-10 bg-white/5 backdrop-blur-sm">
					<div class="space-y-4">
						<div class="p-4 bg-white/10 rounded-xl border border-white/10">
							<p class="text-[10px] text-cyan font-black uppercase mb-1">
								Self-Reflection: 3/10
							</p>
							<p class="text-sm text-white/80 italic">
								"Lists a lot of wins, never says what any of them changed. Reads like a resume, not a person."
							</p>
						</div>
						<div class="p-4 bg-white/10 rounded-xl border border-white/10 opacity-50">
							<p class="text-[10px] text-yellow font-black uppercase mb-1">
								Growth: 8/10
							</p>
							<p class="text-sm text-white/80 italic">
								"The arc lands. Letting yourself look unsure early is doing real work here..."
							</p>
						</div>
					</div>
				</div>
			</div>
		</Card>
	</section>

	<section class="max-w-3xl mx-auto px-6 mt-32 text-center">
		<h2 class="py-10 text-4xl font-display text-navy mb-6">Cheaper than one hour with a consultant.</h2>

		<div
			class="cta-band p-12 relative"
		>
			<div class="absolute -top-1 left-1/2 -translate-x-1/2 text-white px-6 py-9">
				LIFETIME ACCESS
			</div>

			<div class="text-white mb-8">
				<hr class="my-8 border-white/20" />

				<span class="text-7xl font-display tracking-tighter">$25</span>

				<span
					class="text-cyan font-bold ml-2 underline decoration-cyan underline-offset-4 tracking-tight"
					>One-time payment</span
				>
			</div>

			<ul class="text-left max-w-xs mx-auto space-y-4 mb-10">
				<li class="flex items-center text-white font-medium">
					<svg class="w-5 h-5 mr-3 text-cyan" fill="currentColor" viewBox="0 0 20 20"
						><path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						></path></svg
					>
					Grade as many drafts as you want
				</li>
				<li class="flex items-center text-white font-medium">
					<svg class="w-5 h-5 mr-3 text-cyan" fill="currentColor" viewBox="0 0 20 20"
						><path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						></path></svg
					>
					Personal statement and supplements
				</li>
				<li class="flex items-center text-white font-medium">
					<svg class="w-5 h-5 mr-3 text-cyan" fill="currentColor" viewBox="0 0 20 20"
						><path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						></path></svg
					>
					Feedback back in seconds, any hour
				</li>
			</ul>

			<button
				onclick={() => goto('/pro')}
				class="btn btn-light btn-block text-xl"
			>
				Upgrade Now
			</button>
			<p class="text-white text-xs mt-6 font-bold uppercase tracking-widest">
				Your first prediction is free · then $25 once for lifetime (or $9.99/mo)
			</p>
		</div>
	</section>
</div>
