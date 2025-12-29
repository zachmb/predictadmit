<script lang="ts">
	import RadarChart from '$lib/components/common/RadarChart.svelte';
	import SchoolTracker from '$lib/components/pro/SchoolTracker.svelte';
	import SupplementalAnalyzer from '$lib/components/pro/SupplementalAnalyzer.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import { goto } from '$app/navigation';
	import { userProfile } from '$lib/stores/user';
	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// Local state for the form
	let gpa = '';
	let essays = '';
	let activities = '';
	let awards = '';
	let rigor = '';
	let isSaved = false;

	// Load initial data from store
	onMount(() => {
		if ($userProfile.applicationProfile) {
			gpa = $userProfile.applicationProfile.gpa || '';
			essays = $userProfile.applicationProfile.essays || '';
			activities = $userProfile.applicationProfile.activities || '';
			awards = $userProfile.applicationProfile.awards || '';
			rigor = $userProfile.applicationProfile.rigor || '';
		}
	});

	function saveProfile() {
		userProfile.update((u) => ({
			...u,
			applicationProfile: {
				gpa,
				essays,
				activities,
				awards,
				rigor
			}
		}));
		isSaved = true;
		setTimeout(() => (isSaved = false), 3000);
	}

	function calculateChartData() {
		// Mock logic to turn input length/presence into a score for the chart
		// In a real app, this would be a more sophisticated analysis
		const getScore = (val: string, maxLen = 500) =>
			Math.min(100, Math.max(20, (val.length / maxLen) * 100));

		return [
			{ label: 'GPA', value: gpa ? 90 : 30 }, // Placeholder logic
			{ label: 'Essays', value: getScore(essays, 2000) },
			{ label: 'Rigor', value: getScore(rigor, 200) },
			{ label: 'Awards', value: getScore(awards, 300) },
			{ label: 'ECs', value: getScore(activities, 500) }
		];
	}

	$: chartData = calculateChartData();
	$: session = $page.data.session;
	$: isPro = $userProfile.isPro;
	$: hasAccess = session && isPro;
</script>

<svelte:head>
	<title>PredictAdmit Pro - {isPro ? 'My Hub' : 'Upgrade'}</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
	<div class="flex-1 flex flex-col">
		{#if hasAccess}
			<!-- PRO HUB VIEW -->
			<div class="max-w-7xl mx-auto w-full px-6 py-12 space-y-16">
				<header
					class="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-8 gap-6"
				>
					<div>
						<div class="flex items-center gap-2 mb-2">
							<span
								class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700"
							>
								<span class="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
								Active Pro Member
							</span>
						</div>
						<h1 class="text-3xl font-bold text-slate-900">Admissions Command Center</h1>
						<p class="text-slate-600 mt-2">
							Manage your application strategy, track schools, and analyze essays.
						</p>
					</div>
					<div class="flex gap-4">
						<button
							on:click={() => goto('/account')}
							class="text-sm font-semibold text-slate-600 hover:text-slate-900"
						>
							Manage Account
						</button>
						<button
							on:click={() => goto('/ai')}
							class="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-slate-800 transition-all"
						>
							Run AI Simulation
						</button>
					</div>
				</header>

				<!-- TOP ROW: Master Profile & Analytics -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
					<!-- LEFT: Master Profile Form -->
					<div class="lg:col-span-2 space-y-8">
						<div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
							<div class="flex items-center justify-between mb-6">
								<h2 class="text-xl font-bold text-slate-900">Master Application Profile</h2>
								<button
									on:click={saveProfile}
									class="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors {isSaved
										? 'bg-emerald-100 text-emerald-700'
										: 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
								>
									{isSaved ? 'Saved!' : 'Save Changes'}
								</button>
							</div>

							<div class="space-y-6">
								<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div class="space-y-2">
										<label class="text-xs font-bold uppercase tracking-wider text-slate-500"
											>GPA / Stats</label
										>
										<input
											bind:value={gpa}
											type="text"
											placeholder="e.g. 3.9 UW, 1550 SAT"
											class="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
										/>
									</div>
									<div class="space-y-2">
										<label class="text-xs font-bold uppercase tracking-wider text-slate-500"
											>Course Rigor</label
										>
										<input
											bind:value={rigor}
											type="text"
											placeholder="e.g. 10 APs, Multivariable Calc"
											class="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
										/>
									</div>
								</div>

								<div class="space-y-2">
									<label class="text-xs font-bold uppercase tracking-wider text-slate-500"
										>Activities & Leadership</label
									>
									<textarea
										bind:value={activities}
										rows="4"
										placeholder="Paste your main activities list here..."
										class="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
									></textarea>
								</div>

								<div class="space-y-2">
									<label class="text-xs font-bold uppercase tracking-wider text-slate-500"
										>Honors & Awards</label
									>
									<textarea
										bind:value={awards}
										rows="2"
										placeholder="List your top awards..."
										class="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
									></textarea>
								</div>

								<div class="space-y-2">
									<label class="text-xs font-bold uppercase tracking-wider text-slate-500"
										>Main Essay Draft</label
									>
									<textarea
										bind:value={essays}
										rows="6"
										placeholder="Paste your personal statement..."
										class="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
									></textarea>
								</div>
							</div>
						</div>
					</div>

					<!-- RIGHT: Analytics & Tools -->
					<div class="space-y-8">
						<!-- Live Analysis Card -->
						<div
							class="bg-slate-900 rounded-2xl p-8 text-center text-white relative overflow-hidden shadow-xl"
						>
							<div
								class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-500/10 to-transparent"
							></div>

							<h3
								class="relative z-10 text-xs font-bold uppercase tracking-widest text-emerald-400"
							>
								Live Analysis
							</h3>
							<div class="relative z-10 mt-6 flex justify-center">
								<RadarChart data={chartData} size={220} color="text-emerald-400" />
							</div>
							<p class="relative z-10 mt-6 text-xs text-slate-400">
								Visualize how your profile stacks up against T20 admits. Update your profile to see
								changes.
							</p>
						</div>
					</div>
				</div>

				<!-- MIDDLE: School List Tracker -->
				<div class="space-y-6">
					<div class="flex items-end justify-between border-b border-slate-200 pb-4">
						<h2 class="text-2xl font-bold text-slate-900">School List Tracker</h2>
					</div>
					<SchoolTracker />
				</div>

				<!-- BOTTOM: Supplemental Analyzer -->
				<div class="space-y-6">
					<div class="flex items-end justify-between border-b border-slate-200 pb-4">
						<h2 class="text-2xl font-bold text-slate-900">Supplemental Essay Analyzer</h2>
					</div>
					<div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
						<SupplementalAnalyzer />
					</div>
				</div>
			</div>
		{:else}
			<!-- SALES PAGE (Existing Content) -->
			<section class="flex-1 flex flex-col md:flex-row bg-white">
				<!-- Feature Selling Point Side (Left) -->
				<div class="p-8 md:p-20 flex-1 space-y-12 flex flex-col justify-center">
					<header class="space-y-4">
						<div class="flex items-center gap-2">
							<span
								class="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700"
							>
								<span class="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
								PredictAdmit / Pro
							</span>
						</div>
						<h1 class="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">
							Unlock the full simulation suite.
						</h1>
						<p class="text-slate-600 text-lg leading-relaxed max-w-lg">
							You've seen the verdict. Now get the tools to change it. Unlimited simulations, deep
							adcom insights, and precision analytics.
						</p>
					</header>

					<div class="space-y-6">
						<div class="flex gap-5">
							<div
								class="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-5 h-5"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<div>
								<h3 class="font-bold text-slate-900 text-base">Unlimited Simulations</h3>
								<p class="text-sm text-slate-500 leading-relaxed mt-1 max-w-md">
									Run unlimited variations of your profile. Test different essays, spikes, and
									activities lists to see what cracks the code.
								</p>
							</div>
						</div>

						<div class="flex gap-5">
							<div
								class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-5 h-5"
								>
									<path
										d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 011.5 0v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 011.5 0v1.5A2.25 2.25 0 0118.75 6.25v2.5a.75.75 0 001.5 0v-2.5A3.75 3.75 0 0016.5 2.5V1.75a.75.75 0 00-1.5 0v.75a2.25 2.25 0 01-4.5 0v-.75a.75.75 0 00-1.5 0v.75A3.75 3.75 0 005.25 6.25v11A2.25 2.25 0 007.5 19.5h5a2.25 2.25 0 002.25-2.25v-1.19l-3.37-3.37a.75.75 0 00-1.06 1.06l1.964 1.964a.75.75 0 11-1.06 1.06l-2.5-2.5a.75.75 0 010-1.06l2.5-2.5a.75.75 0 011.06 1.06l-1.964 1.964H16.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-5A.75.75 0 0110.75 17.25v-11z"
									/>
									<path
										fill-rule="evenodd"
										d="M5.25 2.5A2.25 2.25 0 003 4.75v11a.75.75 0 001.5 0v-11A.75.75 0 015.25 4h9a.75.75 0 01.75.75v6.5a.75.75 0 001.5 0v-6.5A2.25 2.25 0 0014.25 2.5h-9z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<div>
								<h3 class="font-bold text-slate-900 text-base">Committee Dialogue Simulator</h3>
								<p class="text-sm text-slate-500 leading-relaxed mt-1 max-w-md">
									Listen in on the simulated adcom debate. Hear the exact arguments for and against
									your admission in real time.
								</p>
							</div>
						</div>

						<div class="flex gap-5">
							<div
								class="flex-shrink-0 w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-5 h-5"
								>
									<path
										fill-rule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<div>
								<h3 class="font-bold text-slate-900 text-base">Tailored Supplemental Analysis</h3>
								<p class="text-sm text-slate-500 leading-relaxed mt-1 max-w-md">
									Get school-specific feedback on your supplemental essays based on successful past
									applicant data.
								</p>
							</div>
						</div>
					</div>

					<div class="pt-4">
						<button
							type="button"
							class="inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-slate-800 transition-all w-full md:w-auto"
							class:opacity-50={isPro}
							disabled={isPro}
							on:click={() => {
								if (isPro) return;
								goto('/pricing');
							}}
						>
							<span>{isPro ? 'Pro Active' : 'Get PredictAdmit Pro'}</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-5 h-5"
							>
								<path
									fill-rule="evenodd"
									d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
						<p class="mt-4 text-xs text-slate-400">One-time payment. No subscription.</p>
					</div>
				</div>

				<!-- Visual/Chart Side (Right) -->
				<div
					class="bg-slate-900 p-8 md:p-20 flex flex-col items-center justify-center text-center relative overflow-hidden flex-1"
				>
					<div
						class="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-500/10 to-transparent"
					></div>
					<div
						class="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-emerald-500/10 to-transparent"
					></div>

					<div class="relative z-10 space-y-8">
						<div>
							<h3 class="text-white font-bold tracking-[0.2em] uppercase text-sm mb-2">
								Application Analyzer
							</h3>
							<p class="text-slate-400 text-sm">Visualized Profile Strengths</p>
						</div>

						<!-- Radar Chart Component -->
						<div
							class="bg-white/5 rounded-full p-8 backdrop-blur-sm border border-white/10 shadow-2xl"
						>
							<RadarChart
								data={[
									{ label: 'GPA', value: 95 },
									{ label: 'Essays', value: 85 },
									{ label: 'Rigor', value: 92 },
									{ label: 'Awards', value: 78 },
									{ label: 'ECs', value: 88 }
								]}
								size={260}
								color="text-emerald-400"
							/>
						</div>

						<p class="text-xs text-slate-500 max-w-xs mx-auto">
							* Visualization is just one of the many tools available in Pro.
						</p>
					</div>
				</div>
			</section>

			<!-- Junior Promotional Section -->
			<section class="bg-slate-50 text-slate-900 py-20 px-6 border-t border-slate-200">
				<div class="max-w-5xl mx-auto text-center space-y-10">
					<div class="space-y-4">
						<span
							class="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest"
						>
							Class of 2026 & 2027
						</span>

						<h2 class="text-3xl md:text-5xl font-bold tracking-tight">
							Sophomores & Juniors: <br /><span class="text-blue-600"
								>Start winning before senior year.</span
							>
						</h2>

						<p class="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
							The most competitive applicants don't wait until fall of senior year. Use PredictAdmit
							Pro <strong>right now</strong> to identify your spikes, plan your summer, and secure your
							best possible recommendations.
						</p>
					</div>

					<div class="grid md:grid-cols-3 gap-8 text-left py-4">
						<!-- ECs -->
						<div
							class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
						>
							<div
								class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6"
							>
								<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/></svg
								>
							</div>
							<h3 class="font-bold text-slate-900 text-lg mb-3">Find High-Impact ECs</h3>
							<p class="text-slate-600 text-sm leading-relaxed">
								Stop guessing which activities matter. Simulate your profile to see exactly which
								extracurriculars move the needle for your dream school.
							</p>
						</div>

						<!-- Narrative -->
						<div
							class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
						>
							<div
								class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6"
							>
								<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/></svg
								>
							</div>
							<h3 class="font-bold text-slate-900 text-lg mb-3">Craft Your Narrative</h3>
							<p class="text-slate-600 text-sm leading-relaxed">
								Don't just list achievements. Learn how to weave your stats and interests into a
								cohesive "spike" that admissions officers can't ignore.
							</p>
						</div>

						<!-- LORs -->
						<div
							class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
						>
							<div
								class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6"
							>
								<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/></svg
								>
							</div>
							<h3 class="font-bold text-slate-900 text-lg mb-3">LOR Strategy</h3>
							<p class="text-slate-600 text-sm leading-relaxed">
								Know exactly what your recommenders need to say. Use our tools to draft "brag
								sheets" that guide your teachers to write stellar letters.
							</p>
						</div>
					</div>

					<div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
						<button
							on:click={() => goto('/pricing')}
							class="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all hover:-translate-y-0.5 shadow-lg shadow-slate-200"
						>
							Get the Full Application Cycle Plan
						</button>
						<a
							href="/junior-diagnostic"
							class="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-2 transition-colors px-4 py-2"
						>
							Take the Junior Diagnostic <span aria-hidden="true">&rarr;</span>
						</a>
					</div>
				</div>
			</section>
		{/if}
	</div>
	<SiteFooter />
</main>
