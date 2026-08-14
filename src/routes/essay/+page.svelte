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

<div class="min-h-screen bg-white pb-24">
	<section class="relative pt-20 pb-16 overflow-hidden">
		<div class="max-w-7xl mx-auto px-6 relative z-10">
			<div class="text-center max-w-3xl mx-auto">
				<span
					class="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4"
				>
					Essay Grader
				</span>
				<h1
					class="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight"
				>
					Find out where your essay <span class="text-blue-600">actually stands.</span>
				</h1>
				<p class="text-xl text-slate-600 font-medium leading-relaxed mb-10">
					Waitlist versus accept often comes down to one paragraph. Paste your draft and see the
					notes an admissions officer would write, plus what to change. The grader never writes the essay for you.
				</p>

				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onclick={() => goto('/pro')}
						class="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl text-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-200"
					>
						Run your first prediction free
					</button>
				</div>
			</div>
		</div>

		<div
			class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-10 pointer-events-none"
		>
			<div class="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-[120px]"></div>
			<div
				class="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-[150px]"
			></div>
		</div>
	</section>

	<section class="max-w-6xl mx-auto px-6 py-12">
		<div class="grid md:grid-cols-2 gap-8">
			{#each features as feature, i}
				<div
					in:fly={{ y: 20, delay: i * 100 }}
					class="p-8 bg-slate-50 border border-slate-100 rounded-3xl group hover:bg-white hover:shadow-2xl hover:border-blue-100 transition-all duration-500"
				>
					<h3 class="text-xl font-black text-slate-900 mb-3">{feature.title}</h3>
					<p class="text-slate-600 leading-relaxed font-medium">
						{feature.desc}
					</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="max-w-5xl mx-auto px-6 mt-20">
		<Card
			class="bg-slate-900 border-none p-0 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]"
		>
			<div class="grid md:grid-cols-5">
				<div
					class="md:col-span-2 p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10"
				>
					<h2 class="text-white text-3xl font-black tracking-tight mb-4">See what they see.</h2>
					<p class="text-slate-400 font-medium">
						Real admissions notes are short, blunt, and unsentimental. This is what that sounds like when it's pointed at your draft.
					</p>
				</div>
				<div class="md:col-span-3 p-10 bg-white/5 backdrop-blur-sm">
					<div class="space-y-4">
						<div class="p-4 bg-white/10 rounded-xl border border-white/10">
							<p class="text-[10px] text-blue-400 font-black uppercase mb-1">
								Self-Reflection: 3/10
							</p>
							<p class="text-sm text-black-700 italic">
								"Lists a lot of wins, never says what any of them changed. Reads like a resume, not a person."
							</p>
						</div>
						<div class="p-4 bg-white/10 rounded-xl border border-white/10 opacity-50">
							<p class="text-[10px] text-emerald-700 font-black uppercase mb-1">
								Growth: 8/10
							</p>
							<p class="text-sm text-black-800 italic">
								"The arc lands. Letting yourself look unsure early is doing real work here..."
							</p>
						</div>
					</div>
				</div>
			</div>
		</Card>
	</section>

	<section class="max-w-3xl mx-auto px-6 mt-32 text-center">
		<h2 class="py-10 text-4xl font-black text-slate-900 mb-6">Cheaper than one hour with a consultant.</h2>

		<div
			class="p-12 rounded-[2rem] bg-gradient-to-b from-blue-600 to-indigo-700 shadow-2xl shadow-blue-300 relative"
		>
			<div class="absolute -top-1 left-1/2 -translate-x-1/2 text-white px-6 py-9 font-white">
				LIFETIME ACCESS
			</div>

			<div class="text-white mb-8">
				<hr class="my-8 border-slate-200" />

				<span class="text-7xl font-black tracking-tighter">$99</span>

				<span
					class="text-blue-200 font-bold ml-2 underline decoration-blue-400 underline-offset-4 tracking-tight"
					>One-time payment</span
				>
			</div>

			<ul class="text-left max-w-xs mx-auto space-y-4 mb-10">
				<li class="flex items-center text-white font-medium">
					<svg class="w-5 h-5 mr-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"
						><path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						></path></svg
					>
					Grade as many drafts as you want
				</li>
				<li class="flex items-center text-white font-medium">
					<svg class="w-5 h-5 mr-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"
						><path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						></path></svg
					>
					Personal statement and supplements
				</li>
				<li class="flex items-center text-white font-medium">
					<svg class="w-5 h-5 mr-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"
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
				class="w-full bg-white text-blue-600 py-5 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all shadow-xl"
			>
				Upgrade Now
			</button>
			<p class="text-white text-xs mt-6 font-bold uppercase tracking-widest">
				Your first prediction is free · then one-time $99 for the whole season
			</p>
		</div>
	</section>
</div>
