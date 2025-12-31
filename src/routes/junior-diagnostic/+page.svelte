<script lang="ts">
	import { onMount } from 'svelte';
	import { signIn } from '@auth/sveltekit/client';
	import type { PageData } from './$types';
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import RadarChart from '$lib/components/common/RadarChart.svelte';

	export let data: PageData;
	const session = data.session;

	// === State ===
	let step: 'input' | 'loading' | 'results' | 'paywall' = 'input';

	// Input Fields
	let gradeLevel = 'Junior';
	let major = '';
	let gpa = '';
	let testScores = '';
	let activities = '';
	let honors = '';
	let essayNotes = '';

	// Results
	let diagnosticResult: any = null;
	let radarData: { label: string; value: number }[] = [];

	// Auth State
	let googleSignedIn = false;
	let googleName = '';

	$: {
		googleSignedIn = !!session?.user;
		googleName = session?.user?.name || '';
	}

	// LocalStorage Key
	const FREE_USE_KEY = 'predictadmit_junior_diagnostic_used';
	let hasUsedFree = false;

	onMount(() => {
		if (typeof localStorage !== 'undefined') {
			hasUsedFree = localStorage.getItem(FREE_USE_KEY) === 'true';
		}
	});

	async function runDiagnostic() {
		if (!googleSignedIn) {
			signIn('google', { callbackUrl: '/junior-diagnostic' });
			return;
		}

		if (hasUsedFree) {
			step = 'paywall';
			return;
		}

		step = 'loading';

		try {
			const res = await fetch('/api/junior-diagnostic', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					gradeLevel,
					major,
					transcript: gpa,
					testScores,
					activities,
					honors,
					essay: essayNotes
				})
			});

			if (!res.ok) throw new Error('Failed to run diagnostic');

			const data = await res.json();
			diagnosticResult = data.result;

			// Format Radar Data
			const scores = diagnosticResult.radar_chart;
			radarData = [
				{ label: 'Academic', value: scores.Academic ?? scores.academic ?? 50 },
				{ label: 'Extracurricular', value: scores.Extracurricular ?? scores.extracurricular ?? 50 },
				{ label: 'Intellectual', value: scores.Intellectual ?? scores.intellectual ?? 50 },
				{ label: 'Personal', value: scores.Personal ?? scores.personal ?? 50 },
				{ label: 'Leadership', value: scores.Leadership ?? scores.leadership ?? 50 }
			];

			// Mark as used
			localStorage.setItem(FREE_USE_KEY, 'true');
			hasUsedFree = true;
			step = 'results';
		} catch (e) {
			console.error(e);
			alert('Something went wrong. Please try again.');
			step = 'input';
		}
	}

	function unlockPro() {
		window.location.href = '/pro';
	}
</script>

<svelte:head>
	<title>Junior Diagnostic | PredictAdmit</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 font-sans py-12 px-6 animate-enter">
	<div class="max-w-4xl mx-auto space-y-12">
		<!-- Header -->
		<div class="text-center space-y-4">
			<h1 class="text-4xl font-bold text-slate-900">Junior Diagnostic</h1>
			<p class="text-slate-600 max-w-2xl mx-auto">
				Get a comprehensive baseline of your admissions profile. See where you stand, where you'll
				get in, and how much you can improve before application season.
			</p>
		</div>

		{#if !googleSignedIn && step === 'input'}
			<!-- Auth Gating Card -->
			<Card class="max-w-lg mx-auto bg-white p-8 text-center space-y-6 shadow-xl border-slate-200">
				<div
					class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
				>
					<svg
						class="w-8 h-8 text-emerald-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						/>
					</svg>
				</div>
				<div>
					<h2 class="text-2xl font-bold text-slate-900 mb-2">Sign in to Start</h2>
					<p class="text-slate-600">
						Please sign in with Google to run your diagnostic. We save your results to your profile
						so you can track your progress.
					</p>
				</div>
				<Button
					fullWidth
					type="button"
					on:click={() => signIn('google', { callbackUrl: '/junior-diagnostic' })}
					class="bg-slate-900 text-white hover:bg-slate-800 py-3"
				>
					<span class="flex items-center justify-center gap-2">
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.347.533 12S5.867 24 12.48 24c3.44 0 6.013-1.147 8.027-3.24 2.053-2.053 2.627-5.067 2.627-7.467 0-.747-.053-1.467-.16-2.16h-10.5z"
							/>
						</svg>
						Continue with Google
					</span>
				</Button>
				<p class="text-xs text-slate-400">Your data is private and secure.</p>
			</Card>
		{:else if step === 'input'}
			<Card class="max-w-2xl mx-auto bg-white p-8">
				<div class="mb-6 flex justify-between items-center border-b border-slate-100 pb-4">
					<h2 class="font-bold text-lg text-slate-800">My Profile</h2>
					{#if googleSignedIn}
						<div class="text-xs text-right">
							<div class="font-bold text-slate-900">{googleName}</div>
							<div class="text-slate-500">Signed in</div>
						</div>
					{/if}
				</div>

				<form on:submit|preventDefault={runDiagnostic} class="space-y-6">
					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2">
							<label class="block text-sm font-bold text-slate-900">Grade Level</label>
							<select bind:value={gradeLevel} class="w-full border rounded-lg p-3 text-sm bg-white">
								<option>Freshman</option>
								<option>Sophomore</option>
								<option>Junior</option>
								<option>Senior</option>
							</select>
						</div>
						<div class="space-y-2">
							<label class="block text-sm font-bold text-slate-900">Intended Major</label>
							<input
								bind:value={major}
								class="w-full border rounded-lg p-3 text-sm"
								placeholder="e.g. CS, Bio..."
							/>
						</div>
					</div>

					<div class="space-y-2">
						<label class="block text-sm font-bold text-slate-900">GPA & Course Rigor</label>
						<textarea
							bind:value={gpa}
							rows="2"
							class="w-full border rounded-lg p-3 text-sm"
							placeholder="3.8 UW, 5 APs..."
						></textarea>
					</div>

					<div class="space-y-2">
						<label class="block text-sm font-bold text-slate-900">Test Scores (SAT/ACT)</label>
						<input
							bind:value={testScores}
							class="w-full border rounded-lg p-3 text-sm"
							placeholder="1500 SAT or 34 ACT..."
						/>
					</div>

					<div class="space-y-2">
						<label class="block text-sm font-bold text-slate-900">Activities</label>
						<textarea
							bind:value={activities}
							rows="3"
							class="w-full border rounded-lg p-3 text-sm"
							placeholder="Debate captain, Research..."
						></textarea>
					</div>

					<div class="space-y-2">
						<label class="block text-sm font-bold text-slate-900">Honors</label>
						<textarea
							bind:value={honors}
							rows="2"
							class="w-full border rounded-lg p-3 text-sm"
							placeholder="National Merit..."
						></textarea>
					</div>

					<div class="space-y-2">
						<label class="block text-sm font-bold text-slate-900">One thing knowing about you</label
						>
						<textarea
							bind:value={essayNotes}
							rows="2"
							class="w-full border rounded-lg p-3 text-sm"
							placeholder="I love building rockets..."
						></textarea>
					</div>

					<div class="pt-4">
						<Button
							type="submit"
							fullWidth
							disabled={hasUsedFree}
							class="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
						>
							{hasUsedFree ? 'Free Diagnostic Already Used' : 'Run My Diagnostic (Free)'}
						</Button>
					</div>

					{#if hasUsedFree}
						<p
							class="text-center text-xs text-rose-500 font-bold mt-2 cursor-pointer hover:underline"
							on:click={() => (step = 'paywall')}
						>
							Unlock another run &rarr;
						</p>
					{/if}
				</form>
			</Card>
		{:else if step === 'loading'}
			<div class="text-center py-24 space-y-4">
				<div
					class="animate-spin w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full mx-auto"
				></div>
				<h3 class="text-xl font-bold text-slate-700">PredictAdmit AI is analyzing...</h3>
				<p class="text-slate-500">Projecting admissions outcomes and trajectory.</p>
			</div>
		{:else if step === 'results' && diagnosticResult}
			<div class="space-y-8 animate-fade-in">
				<!-- Top Summary -->
				<section class="bg-white rounded-xl p-8 border border-slate-200 shadow-sm text-center">
					<h2 class="text-2xl font-bold text-slate-900 mb-2">Diagnostic Complete</h2>
					<p class="text-slate-600">{diagnosticResult.analysis}</p>
				</section>

				<div class="grid md:grid-cols-2 gap-8">
					<!-- Radar Chart -->
					<Card class="p-6 bg-white flex flex-col items-center">
						<div class="text-center mb-6">
							<h3 class="font-bold text-lg text-slate-900">Your Profile Shape</h3>
							<p class="text-xs text-slate-500 max-w-xs mx-auto mt-1">
								Visualizes your relative strengths across the 5 dimensions colleges care about.
							</p>
						</div>
						<RadarChart data={radarData} max={100} size={250} />
					</Card>

					<!-- Predictions List -->
					<Card class="p-6 bg-white">
						<h3 class="font-bold text-lg mb-4 text-slate-900">Projected Outcomes</h3>
						<div class="space-y-3">
							{#each diagnosticResult.predictions as p}
								<div
									class="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-100"
								>
									<div class="font-bold text-slate-800">{p.school}</div>
									<div class="flex items-center gap-2">
										<span class="text-[10px] uppercase tracking-wider font-bold text-slate-400"
											>{p.outcome}</span
										>
										<span
											class="text-sm font-bold
                                            {p.chance.includes('High') || parseInt(p.chance) > 50
												? 'text-emerald-600'
												: p.chance.includes('Low') || parseInt(p.chance) < 20
													? 'text-rose-600'
													: 'text-amber-600'}"
										>
											{p.chance}
										</span>
									</div>
								</div>
							{/each}
						</div>
					</Card>
				</div>

				<!-- Trajectory Graph (Improved UI) -->
				<Card
					class="p-0 bg-slate-900 text-white relative overflow-hidden group border border-slate-800 shadow-2xl"
				>
					<!-- Background Glow -->
					<div
						class="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"
					></div>

					<div class="p-8 md:p-10 relative z-10">
						<div class="flex flex-col md:flex-row md:items-start justify-between gap-8">
							<!-- Graph Section -->
							<div class="flex-1">
								<h3 class="font-bold text-2xl mb-2 text-white flex items-center gap-2">
									<svg
										class="w-6 h-6 text-emerald-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
										></path></svg
									>
									Your Admissions Trajectory
								</h3>
								<p class="text-slate-400 text-sm mb-10 max-w-lg leading-relaxed">
									Without intervention, your profile curve flattens. With <span
										class="text-emerald-400 font-semibold">PredictAdmit Pro</span
									>, we target your weak points to accelerate your growth curve by 3x.
								</p>

								<!-- Graph Container -->
								<div class="h-64 w-full relative pt-6 pr-4">
									<!-- Y-Axis Grid -->
									<div
										class="absolute inset-0 flex flex-col justify-between pointer-events-none select-none"
									>
										<div class="w-full border-t border-slate-700/50 relative">
											<span class="absolute -top-3 -left-0 text-[10px] text-slate-600"
												>Ivy League Path</span
											>
										</div>
										<div class="w-full border-t border-slate-700/30"></div>
										<div class="w-full border-t border-slate-700/30"></div>
										<div class="w-full border-b border-slate-700/50"></div>
									</div>

									<!-- Bars -->
									<div
										class="absolute inset-0 flex items-end justify-between gap-2 md:gap-4 pl-2 pb-[1px]"
									>
										{#each diagnosticResult.trajectory_graph.months as month, i}
											<div
												class="flex-1 flex flex-col justify-end items-center h-full group/col relative"
											>
												<div
													class="w-full flex items-end justify-center h-full gap-1 sm:gap-2 relative"
												>
													<!-- Current Path -->
													<div
														class="w-3 sm:w-6 bg-slate-700/80 rounded-t-sm backdrop-blur-sm transition-all duration-700 ease-out"
														style="height: {diagnosticResult.trajectory_graph.current_path[i]}%;"
													></div>

													<!-- Potential Path -->
													<div
														class="w-3 sm:w-6 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all duration-700 ease-out delay-100 relative"
														style="height: {diagnosticResult.trajectory_graph.potential_path[i]}%;"
													>
														{#if i === diagnosticResult.trajectory_graph.months.length - 1}
															<div
																class="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap animate-bounce flex items-center gap-1"
															>
																<span>3x Uplift</span>
															</div>
														{/if}
													</div>
												</div>

												<!-- Month Label -->
												<div
													class="absolute -bottom-8 text-[10px] font-bold text-slate-500 uppercase tracking-wider"
												>
													{month}
												</div>
											</div>
										{/each}
									</div>
								</div>
							</div>

							<!-- Call to Action Section -->
							<div
								class="md:w-72 flex flex-col justify-center space-y-6 md:border-l md:border-slate-800 md:pl-8 pt-8 md:pt-0"
							>
								<div class="space-y-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
									<div class="flex items-center gap-3">
										<div class="w-3 h-3 bg-slate-600 rounded-full"></div>
										<div class="text-xs text-slate-400">
											<span class="block text-slate-300 font-semibold">Standard Path</span>
											Current trajectory
										</div>
									</div>
									<div class="flex items-center gap-3">
										<div
											class="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"
										></div>
										<div class="text-xs text-emerald-100">
											<span class="block text-emerald-400 font-bold">PredictAdmit Pro</span>
											Optimized trajectory
										</div>
									</div>
								</div>

								<div>
									<Button
										on:click={unlockPro}
										fullWidth
										class="bg-white text-slate-900 hover:bg-emerald-50 font-bold border-none shadow-[0_0_20px_rgba(255,255,255,0.2)] py-4 text-base"
									>
										Unlock Your Potential &rarr;
									</Button>
									<p class="text-[10px] text-center text-slate-500 mt-3">
										Try risk-free with our 30-day guarantee.
									</p>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</div>
		{:else if step === 'paywall'}
			<div class="max-w-md mx-auto text-center py-24 space-y-6 animate-fade-in">
				<div class="text-6xl mb-4">🔒</div>
				<h2 class="text-3xl font-bold text-slate-900">Free Diagnostic Limit Reached</h2>
				<div class="bg-white p-6 rounded-xl shadow-lg border border-slate-200 text-left space-y-4">
					<h3 class="font-bold text-slate-900 border-b border-slate-100 pb-2">
						Upgrade to PredictAdmit Pro
					</h3>
					<ul class="space-y-3 text-sm text-slate-600">
						<li class="flex items-center gap-2">
							<span class="text-emerald-500">✓</span> Unlimited AI Diagnostics
						</li>
						<li class="flex items-center gap-2">
							<span class="text-emerald-500">✓</span> Deep Dive Analysis for Any School
						</li>
						<li class="flex items-center gap-2">
							<span class="text-emerald-500">✓</span> Essay Editor & Improver
						</li>
						<li class="flex items-center gap-2">
							<span class="text-emerald-500">✓</span> Access to 500+ Verified Research Roles
						</li>
					</ul>
				</div>
				<div class="pt-4 space-y-3">
					<Button
						fullWidth
						on:click={unlockPro}
						class="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl"
						>Get PredictAdmit Pro</Button
					>
					<button on:click={() => (step = 'input')} class="text-slate-400 text-sm hover:underline"
						>Go Back</button
					>
				</div>
			</div>
		{/if}
	</div>
</main>
