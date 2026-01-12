<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import { page } from '$app/stores';
	import { signIn } from '@auth/sveltekit/client';
	import { fly, fade, slide } from 'svelte/transition';
	import RadarChart from '$lib/components/common/RadarChart.svelte';
	import { schoolConfigs } from '$lib/config/schools';
	import { schoolPrompts } from '$lib/config/prompts';
	import { majors } from '$lib/config/majors';

	// --- RUNES STATE ---
	let { data } = $props();

	// Auth & Pro State
	let session = $derived($page.data.session);
	let googleSignedIn = $derived(!!session?.user);
	let isPro = $derived($userProfile.isPro);

	// Sales/Pricing State
	let pricingMode = $state<'cycle' | 'monthly'>('cycle');
	let promoCode = $state('');
	let promoError = $state('');
	let isProcessing = $state(false);

	// VIEW STATE
	let currentView = $state<'dashboard' | 'editor'>('dashboard');

	// IDE State
	type File = {
		id: string;
		name: string;
		language: 'markdown' | 'text';
		content: string;
		school?: string; // If linked to a specific school's logic
		isOpen: boolean;
		isModified: boolean;
	};

	let files = $state<File[]>([
		{
			id: 'common-app',
			name: 'Common App Personal',
			language: 'markdown',
			content:
				'# Personal Statement\n\nPrompt: Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.\n\n---\n\nStart writing here...',
			school: 'Common App',
			isOpen: true,
			isModified: false
		}
	]);

	let activeFileIndex = $state(0);
	// Safety check in case index is out of bounds
	let activeFile = $derived(files[activeFileIndex] || files[0]);

	// Stats / Profile State
	let profile = $state({
		gpa_uw: '',
		gpa_w: '',
		testScore: '',
		ecs: '',
		rigor: 'Regular' as 'Regular' | 'Honors' | 'AP/IB',
		major: ''
	});

	let majorSuggestions = $derived(
		profile.major.length > 0
			? majors
					.filter(
						(m) => m.toLowerCase().includes(profile.major.toLowerCase()) && m !== profile.major
					)
					.slice(0, 5)
			: []
	);
	let showMajorDropdown = $state(false);

	// --- METRICS CALCULATION ---

	// Academic Index (AI) - Max 240
	let academicIndex = $derived.by(() => {
		// Parse Inputs
		const gpa = parseFloat(profile.gpa_uw) || 0;
		const test = parseFloat(profile.testScore) || 0;

		// 1. Test Score Component (Max 160)
		// Normalized to 1600 scale (Assuming SAT). If ACT (max 36), convert roughly.
		// Simple logic: if < 37, assume ACT and multiply by ~44
		let normalizedTest = test;
		if (test > 0 && test < 37) normalizedTest = test * 44.44; // 36 * 44.44 = 1600

		const testComponent = Math.min(160, (normalizedTest / 1600) * 160);

		// 2. GPA Component (Max 80)
		const gpaComponent = Math.min(80, (gpa / 4.0) * 80);

		return Math.round(testComponent + gpaComponent);
	});

	// Holistic Scores (Heuristics)
	let holisticMetrics = $derived.by(() => {
		const ecText = profile.ecs.toLowerCase();
		let ecScore = 3; // Base score

		// Simple keyword heuristics
		if (ecText.length > 50) ecScore += 1;
		if (ecText.length > 200) ecScore += 1;
		if (ecText.includes('president') || ecText.includes('founder') || ecText.includes('captain'))
			ecScore += 2;
		if (ecText.includes('state') || ecText.includes('national') || ecText.includes('international'))
			ecScore += 2;
		if (ecText.includes('award') || ecText.includes('honor')) ecScore += 1;

		return {
			academics: Math.round((academicIndex / 240) * 10),
			ecs: Math.min(10, ecScore),
			personal: 5 // Placeholder: requires essay analysis for real score
		};
	});

	// Add School State
	let showAddSchoolModal = $state(false);
	let schoolSearchQuery = $state('');
	let addedSchoolSlugs = $state<string[]>([]); // Tracks schools added to dashboard

	// Analysis/Terminal State
	let isBuilding = $state(false);
	let buildOutput = $state<string[]>([]);
	let analysisResult = $state<any>(null); // Store the grade result here
	let showTerminal = $state(false); // Changed default to false to be cleaner
	let activeTab = $state<'terminal' | 'output'>('output');

	// --- ACTIONS ---

	function handlePromo() {
		if (promoCode.trim().toLowerCase() === 'strawberrylemonade') {
			userProfile.update((u) => ({ ...u, isPro: true }));
			alert('Promo code applied! Access Granted.');
			// Refreshes the view automatically due to reactivity
		} else {
			promoError = 'Invalid promo code';
			setTimeout(() => (promoError = ''), 3000);
		}
	}

	async function handleCheckout(plan: 'cycle' | 'monthly') {
		if (isProcessing) return;

		if (!googleSignedIn) {
			signIn('google', { callbackUrl: '/pro' });
			return;
		}

		isProcessing = true;
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pricingMode: plan })
			});
			const data = await res.json();
			if (data.url) {
				window.location.href = data.url;
			} else {
				alert('Checkout error: ' + (data.error || 'Unknown error'));
			}
		} catch (e) {
			console.error(e);
			alert('Checkout error');
		} finally {
			isProcessing = false;
		}
	}

	// IDE Actions
	function switchFile(index: number) {
		activeFileIndex = index;
		analysisResult = null; // Clear analysis on switch
		showTerminal = false;
		currentView = 'editor';
	}

	function addSchool(slug: string) {
		if (addedSchoolSlugs.includes(slug)) return;

		addedSchoolSlugs = [...addedSchoolSlugs, slug];
		const config = schoolConfigs[slug];

		// Fetch Prompts
		const prompts = schoolPrompts[slug] || [];

		// Create files for prompts
		// Create ONE master file for the school
		const promptsContent = prompts
			.map((p) => `### ${p.title}\n${p.description}\n\nStart writing here...\n\n`)
			.join('---\n\n');

		const finalContent = `# ${config.schoolName} Supplement\n\n${promptsContent.length > 0 ? promptsContent : 'No specific prompts found. Start writing...'}`;

		const newFile: File = {
			id: slug + '-supplement',
			name: `${config.schoolName.split(' ')[0]} Supplement`, // e.g. "Harvard Supplement"
			language: 'markdown',
			content: finalContent,
			school: config.schoolName,
			isOpen: true, // Auto-open the new file
			isModified: false
		};

		files = [...files, newFile];
		// Switch to the new file immediately
		activeFileIndex = files.length - 1;
		currentView = 'editor';
		showAddSchoolModal = false;
		schoolSearchQuery = '';
	}

	async function runBuild() {
		if (isBuilding) return;
		isBuilding = true;
		showTerminal = true;
		activeTab = 'terminal';
		buildOutput = [
			'> Initializing PredictAdmit Compiler v1.0...',
			'> Target: ' + activeFile.school
		];
		analysisResult = null;

		// Simulate "build" steps
		await new Promise((r) => setTimeout(r, 600));
		buildOutput = [...buildOutput, '> Parsing markdown...', '> Detecting essay structure...'];

		await new Promise((r) => setTimeout(r, 800));
		buildOutput = [
			...buildOutput,
			'> Integrating applicant profile...',
			'> Handshake with DeepSeek inference engine...'
		];

		try {
			// Re-use the existing essay-grader API logic
			// Adapt old profile structure to new one for API compatibility if needed
			const legacyProfile = {
				gpa: profile.gpa_uw + ' (UW) / ' + profile.gpa_w + ' (W)',
				testScore: profile.testScore,
				ecs: profile.ecs
			};

			const res = await fetch('/essay-grader', {
				method: 'POST',
				body: JSON.stringify({
					major: 'Undecided', // TODO: Add major config to IDE?
					selectedSchool: activeFile.school || 'General',
					essayType: activeFile.name.includes('Common') ? 'personal' : 'supplemental',
					content: activeFile.content,
					profile: legacyProfile
				}),
				headers: { 'Content-Type': 'application/json' }
			});

			if (!res.ok) throw new Error('Grading failed');
			const data = await res.json();

			analysisResult = data;
			buildOutput = [...buildOutput, '> Build Successful.', '> Analysis ready.'];

			// Auto switch to result
			setTimeout(() => {
				activeTab = 'output';
			}, 500);
		} catch (e: any) {
			console.error(e);
			buildOutput = [
				...buildOutput,
				'> Error: Build Failed.',
				'> ' + (e.message || 'Unknown error')
			];
		} finally {
			isBuilding = false;
		}
	}

	// Annotation Helper
	function getHighlightedContent(content: string, annotations: any[]) {
		if (!annotations || annotations.length === 0) return content;

		// Very basic replace logic - in production use a robust token-based highlighter
		// This just replaces the first occurrence safely
		let html = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

		annotations.forEach((ann: any, idx: number) => {
			const quote = ann.quote.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			if (quote.length < 5) return; // Skip too short quotes to avoid noise

			// Escape regex special chars
			const escapedQuote = quote.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = new RegExp(`(${escapedQuote})`, 'i'); // Case insensitive match

			// We use a specific class that interacts with the sidebar hover logic if needed,
			// but for now simple visual highlight + tooltip title is MVP
			html = html.replace(
				regex,
				`<span class="bg-yellow-100 border-b-2 border-yellow-300 cursor-help relative group/highlight highlight-span" title="${ann.comment.replace(/"/g, '&quot;')}">$1</span>`
			);
		});

		// Preserve newlines
		return html.replace(/\n/g, '<br/>');
	}

	// FAQ State
	let openFaqIndex = $state<number | null>(null);
	const faqs = [
		{
			q: 'Does the simulation guarantee admission?',
			a: 'No. PredictAdmit calculates probabilities based on historical data, but real admissions decisions involve human factors we cannot fully predict.'
		},
		{
			q: 'Can I cancel the monthly plan?',
			a: 'Yes, you can cancel your monthly subscription at any time from your account settings. You will retain access until the end of your billing period.'
		},
		{
			q: 'What is included in the Cycle Pass?',
			a: 'The Cycle Pass is a one-time payment that gives you unlimited access to simulations, essay grading, and deep dive analysis for the entire current application cycle.'
		},
		{
			q: 'How accurate is the essay grader?',
			a: "Our grader is trained on thousands of successful essays from Top 20 universities. It evaluates structure, tone, and 'fit' for specific schools, providing institutional-grade feedback."
		}
	];

	function toggleFaq(index: number) {
		openFaqIndex = openFaqIndex === index ? null : index;
	}
</script>

<svelte:head>
	<title>PredictAdmit Pro</title>
</svelte:head>

{#if googleSignedIn && isPro}
	<!-- PREDICTADMIT PRO INTERFACE -->
	<div class="flex h-screen w-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
		<!-- SIDEBAR NAVIGATION -->
		<aside
			class="w-64 flex flex-col border-r border-slate-200 bg-white z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
		>
			<!-- Branding -->
			<div class="p-6 border-b border-slate-100">
				<div class="flex items-center gap-2 text-[#0052CC]">
					<!-- Logo Icon -->
					<div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/></svg
						>
					</div>
					<span class="font-bold tracking-tight text-lg"
						>PredictAdmit <span class="text-slate-900">Pro</span></span
					>
				</div>
			</div>

			<!-- Views -->
			<div class="flex-1 overflow-y-auto py-4 space-y-1">
				<!-- DASHBOARD TAB -->
				<button
					onclick={() => (currentView = 'dashboard')}
					class="w-full text-left px-6 py-3 text-sm font-bold flex items-center gap-3 transition-all border-l-4 {currentView ===
					'dashboard'
						? 'bg-blue-50 text-[#0052CC] border-[#0052CC]'
						: 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-50'}"
				>
					<svg class="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
						/></svg
					>
					<span>Hub & Stats</span>
				</button>

				<div class="mt-4 px-6 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
					Essays
				</div>

				{#each files as file, i}
					<button
						onclick={() => switchFile(i)}
						class="w-full text-left px-6 py-2.5 text-xs font-medium flex items-center justify-between gap-2 transition-all border-l-4 {currentView ===
							'editor' && activeFileIndex === i
							? 'bg-blue-50 text-[#0052CC] border-[#0052CC]'
							: 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900'}"
					>
						<span class="truncate">{file.name.replace(/.md|.txt/g, '')}</span>
						{#if currentView === 'editor' && activeFileIndex === i}
							<div class="h-1.5 w-1.5 rounded-full bg-[#0052CC]"></div>
						{/if}
					</button>
				{/each}

				<div class="px-6 pt-4">
					<button
						onclick={() => (showAddSchoolModal = true)}
						class="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-400 hover:text-[#0052CC] hover:border-[#0052CC] transition-colors flex items-center justify-center gap-2"
					>
						<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/></svg
						>
						<span>Add University</span>
					</button>
				</div>
			</div>

			<!-- User Menu -->
			<div class="p-4 border-t border-slate-100 bg-slate-50/50">
				<button
					onclick={() => goto('/account')}
					class="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200"
				>
					<div
						class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-700 font-bold border border-indigo-200"
					>
						{session?.user?.name?.[0] || 'U'}
					</div>
					<div class="text-left">
						<div class="text-xs font-bold text-slate-900">{session?.user?.name}</div>
						<div class="text-[10px] text-slate-500">Pro Member</div>
					</div>
				</button>
			</div>
		</aside>

		<!-- MAIN AREA -->
		<main class="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
			{#if currentView === 'dashboard'}
				<!-- DASHBOARD VIEW -->
				<div class="flex-1 overflow-y-auto p-8 md:p-12">
					<div class="max-w-5xl mx-auto space-y-8">
						<!-- METRICS ROW -->
						<div class="grid md:grid-cols-3 gap-6">
							<!-- STATS INPUTS -->
							<div class="md:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
								<div class="grid grid-cols-2 gap-4">
									<div>
										<label class="block text-xs font-bold uppercase text-slate-500 mb-2"
											>Unweighted GPA</label
										>
										<input
											bind:value={profile.gpa_uw}
											type="text"
											placeholder="4.0"
											class="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC] font-bold text-slate-900"
										/>
									</div>
									<div>
										<label class="block text-xs font-bold uppercase text-slate-500 mb-2"
											>Weighted GPA</label
										>
										<input
											bind:value={profile.gpa_w}
											type="text"
											placeholder="4.5"
											class="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC] font-bold text-slate-900"
										/>
									</div>
									<div>
										<label class="block text-xs font-bold uppercase text-slate-500 mb-2"
											>SAT / ACT</label
										>
										<input
											bind:value={profile.testScore}
											type="text"
											placeholder="1500"
											class="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC] font-bold text-slate-900"
										/>
									</div>
									<div>
										<label class="block text-xs font-bold uppercase text-slate-500 mb-2"
											>Course Rigor</label
										>
										<select
											bind:value={profile.rigor}
											class="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC] font-bold text-slate-900"
										>
											<option>Regular</option>
											<option>Honors</option>
											<option>AP/IB</option>
										</select>
									</div>
									<div class="relative">
										<label class="block text-xs font-bold uppercase text-slate-500 mb-2"
											>Intended Major</label
										>
										<input
											bind:value={profile.major}
											onfocus={() => (showMajorDropdown = true)}
											onblur={() => setTimeout(() => (showMajorDropdown = false), 200)}
											type="text"
											placeholder="Computer Science"
											class="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC] font-bold text-slate-900"
										/>
										{#if showMajorDropdown && majorSuggestions.length > 0}
											<div
												class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50"
											>
												{#each majorSuggestions as major}
													<button
														onclick={() => {
															profile.major = major;
															showMajorDropdown = false;
														}}
														class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
													>
														{major}
													</button>
												{/each}
											</div>
										{/if}
									</div>
									<div class="col-span-2 mt-2">
										<label class="block text-xs font-bold uppercase text-slate-500 mb-2"
											>Top Activities & Honors</label
										>
										<textarea
											bind:value={profile.ecs}
											rows="3"
											placeholder="List your leadership, awards, and key activities..."
											class="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC] font-medium resize-none"
										></textarea>
									</div>
								</div>
							</div>

							<!-- ACADEMIC INDEX CARD (Clean White) -->
							<div
								class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between"
							>
								<div>
									<div class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
										Academic Index
									</div>
									<div class="text-5xl font-black tracking-tighter text-slate-900">
										{academicIndex}<span class="text-lg text-slate-400 font-medium">/240</span>
									</div>
									<p class="text-xs text-slate-400 mt-2 leading-relaxed">
										Calculated using the Ivy League formula (2/3 Test + 1/3 GPA).
									</p>
								</div>

								<div class="mt-8 space-y-3">
									<div class="flex justify-between text-xs font-bold text-slate-500">
										<span>Holistic Rating</span>
										<span class="text-slate-900"
											>{Math.round(
												((holisticMetrics.academics +
													holisticMetrics.ecs +
													holisticMetrics.personal) /
													3) *
													10
											)}%</span
										>
									</div>
									<!-- Mini Bars for Metrics -->
									<div class="space-y-2">
										<div class="flex items-center gap-2">
											<span class="text-[10px] w-12 text-slate-400 font-bold uppercase">Acad</span>
											<div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
												<div
													class="h-full bg-slate-900 rounded-full"
													style="width: {holisticMetrics.academics * 10}%"
												></div>
											</div>
										</div>
										<div class="flex items-center gap-2">
											<span class="text-[10px] w-12 text-slate-400 font-bold uppercase">Extrac</span
											>
											<div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
												<div
													class="h-full bg-slate-900 rounded-full"
													style="width: {holisticMetrics.ecs * 10}%"
												></div>
											</div>
										</div>
										<div class="flex items-center gap-2">
											<span class="text-[10px] w-12 text-slate-400 font-bold uppercase">Pers</span>
											<div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
												<div class="h-full bg-slate-300 rounded-full" style="width: 50%"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- University Map / List -->
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<h2 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
									<svg
										class="w-6 h-6 text-[#0052CC]"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										><path d="M12 14l9-5-9-5-9 5 9 5z" /><path
											d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
										/><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
										/></svg
									>
									Your University List
								</h2>
								<button
									onclick={() => (showAddSchoolModal = true)}
									class="text-sm font-bold text-[#0052CC] hover:underline">+ Add School</button
								>
							</div>

							{#if addedSchoolSlugs.length === 0}
								<div
									class="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400"
								>
									<p class="font-medium">No schools added yet.</p>
									<p class="text-sm mt-1">
										Add a school to see deadlines and start writing essays.
									</p>
								</div>
							{:else}
								<div class="grid md:grid-cols-2 gap-4">
									{#each addedSchoolSlugs as slug}
										{@const conf = schoolConfigs[slug]}
										<div
											class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all"
										>
											<div class="flex items-start justify-between mb-4">
												<div>
													<div
														class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1"
													>
														Target
													</div>
													<h3 class="font-bold text-slate-900">{conf.schoolName}</h3>
												</div>
												<!-- Mock Progress -->
												<div
													class="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-[#0052CC]"
												>
													20%
												</div>
											</div>

											<div class="space-y-3">
												<div class="flex justify-between text-xs">
													<span class="text-slate-500">Deadline</span>
													<span class="font-medium text-slate-900">Jan 1st (RD)</span>
												</div>
												<div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
													<div class="bg-[#0052CC] h-full rounded-full" style="width: 20%"></div>
												</div>
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>
			{:else if currentView === 'editor'}
				<!-- EDITOR VIEW -->
				<!-- Header/Breadcrumbs -->
				<div
					class="h-16 px-8 flex items-center justify-between bg-white border-b border-slate-200 shadow-sm z-10"
				>
					<div class="flex items-center gap-2 text-sm">
						<span class="text-slate-400 font-medium">Editor</span>
						<span class="text-slate-300">/</span>
						<span class="font-bold text-slate-900">{activeFile.name.replace('.md', '')}</span>
					</div>
					<div class="flex items-center gap-3">
						<span
							class="text-xs font-medium {profile.gpa_uw ? 'text-emerald-500' : 'text-amber-500'}"
						>
							{profile.gpa_uw ? 'Profile Linked' : 'No Profile Linked'}
						</span>
						<span class="text-slate-300">|</span>
						<span class="text-xs font-medium text-slate-400">
							{activeFile.content.length} chars
						</span>
					</div>
				</div>

				<!-- Editor Wrapper -->
				<div class="flex-1 overflow-hidden flex relative">
					<!-- Text Editor -->
					<div class="flex-1 relative flex flex-col">
						<div class="flex-1 relative overflow-y-auto custom-scrollbar">
							{#if analysisResult && activeTab === 'output'}
								<!-- MODE: ANNOTATED VIEW -->
								<div
									class="w-full min-h-full bg-slate-50 text-slate-800 p-8 font-serif text-lg leading-loose outline-none"
								>
									<!-- Interactive Highlight Render -->
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html getHighlightedContent(
										activeFile.content,
										analysisResult.essays?.[0]?.annotations
									)}
								</div>

								<!-- Reset Button Overlay -->
								<button
									onclick={() => {
										activeTab = 'terminal';
										analysisResult = null;
									}}
									class="absolute top-4 right-4 bg-white shadow-md border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-500 hover:text-slate-900 z-10"
								>
									Edit Mode
								</button>
							{:else}
								<!-- MODE: EDIT -->
								<textarea
									bind:value={activeFile.content}
									class="w-full h-full bg-slate-50 text-slate-800 p-8 resize-none outline-none font-sans text-base leading-relaxed custom-scrollbar placeholder:text-slate-300"
									placeholder="Start writing your supplemental essay here..."
									spellcheck="false"
								></textarea>
							{/if}
						</div>

						<!-- Bottom Action Bar -->
						<div
							class="h-20 bg-white border-t border-slate-200 flex items-center justify-between px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20"
						>
							<div class="text-xs text-slate-500 font-medium">
								{analysisResult
									? 'Viewing Analysis'
									: profile.gpa_uw
										? 'Profile Active'
										: 'Update Stats in Dashboard for better results'}
							</div>
							<div class="flex items-center gap-4">
								<button
									onclick={() => (showTerminal = !showTerminal)}
									class="text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors"
								>
									{showTerminal ? 'Hide Analysis' : 'Show Analysis'}
								</button>
								<button
									onclick={runBuild}
									disabled={isBuilding}
									class="flex items-center gap-2 px-6 py-3 bg-[#0052CC] text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transform active:scale-95 duration-200"
								>
									{#if isBuilding}
										<svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"
											><circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											></circle><path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path></svg
										>
										<span class="tracking-wide">Analyzing...</span>
									{:else}
										<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
											/></svg
										>
										<span class="tracking-wide">AI Feedback</span>
									{/if}
								</button>
							</div>
						</div>
					</div>

					<!-- Analysis Sidebar -->
					{#if showTerminal}
						<div
							class="w-96 border-l border-slate-200 bg-white flex flex-col shadow-2xl relative z-30"
							transition:slide={{ axis: 'x', duration: 300 }}
						>
							<div
								class="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50/50"
							>
								<span class="font-bold text-slate-900">Analysis Results</span>
								<button
									onclick={() => (showTerminal = false)}
									class="text-slate-400 hover:text-slate-600"
								>
									<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/></svg
									>
								</button>
							</div>

							<div class="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar pb-20">
								{#if activeTab === 'terminal' && isBuilding}
									<div class="space-y-4">
										<div class="flex items-center gap-3 text-slate-500 text-sm">
											<span class="h-2 w-2 rounded-full bg-[#0052CC] animate-ping"></span>
											Connecting to DeepSeek Engine...
										</div>
										<div class="space-y-2 pl-5 border-l-2 border-slate-100">
											{#each buildOutput as line}
												<div class="text-xs text-slate-400 font-mono">{line}</div>
											{/each}
										</div>
									</div>
								{:else if analysisResult}
									<div class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
										<!-- SCORE CARD -->
										<div
											class="p-6 bg-[#F0F7FF] rounded-2xl border border-blue-100 text-center relative overflow-hidden"
										>
											<div class="relative z-10">
												<div
													class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1"
												>
													Institutional Score
												</div>
												<div class="text-5xl font-black text-[#0052CC] tracking-tighter">
													{analysisResult.essays?.[0]?.average ?? 'N/A'}<span
														class="text-xl text-blue-300">/10</span
													>
												</div>
											</div>
										</div>

										<!-- RADAR CHART -->
										<div class="flex justify-center -my-4">
											{#if analysisResult.essays?.[0]}
												{@const scores = Object.entries(analysisResult.essays[0].scores).map(
													([k, v]: [string, any]) => ({ label: k.substring(0, 6), value: v.score })
												)}
												<RadarChart data={scores} max={10} size={250} color="text-[#0052CC]" />
											{/if}
										</div>

										<!-- ANNOTATIONS LIST -->
										{#if analysisResult.essays?.[0]?.annotations?.length}
											<div class="space-y-3">
												<h3
													class="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2"
												>
													Line-by-Line Critique
												</h3>
												{#each analysisResult.essays[0].annotations as note}
													<div
														class="p-3 rounded-lg bg-yellow-50 border border-yellow-100 text-xs space-y-1 hover:border-yellow-300 transition-colors cursor-pointer group"
													>
														<div
															class="font-serif italic text-slate-600 border-l-2 border-yellow-400 pl-2"
														>
															"{note.quote}"
														</div>
														<div class="text-slate-800 font-medium">{note.comment}</div>
													</div>
												{/each}
											</div>
										{/if}

										<!-- HARSH FEEDBACK -->
										{#if analysisResult.essays?.[0]?.harsh_feedback}
											<div class="space-y-3">
												<h3
													class="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 text-rose-600"
												>
													Brutal Honest Feedback
												</h3>
												<div
													class="p-4 bg-rose-50 rounded-xl border border-rose-100 text-sm text-rose-900 leading-relaxed italic"
												>
													{analysisResult.essays[0].harsh_feedback}
												</div>
											</div>
										{/if}
									</div>
								{:else}
									<div
										class="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50"
									>
										<div
											class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300"
										>
											<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
												/></svg
											>
										</div>
										<p class="text-sm font-medium text-slate-400 max-w-[200px]">
											Run an AI analysis to see feedback here.
										</p>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</main>
	</div>

	<!-- ADD SCHOOL MODAL -->
	{#if showAddSchoolModal}
		<div
			class="fixed inset-0 z-[100] flex items-center justify-center"
			transition:fade={{ duration: 150 }}
		>
			<div
				class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
				onclick={() => (showAddSchoolModal = false)}
			></div>
			<div
				class="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg relative z-10 border border-slate-200"
				transition:fly={{ y: 20, duration: 300 }}
			>
				<div class="p-6 border-b border-slate-100">
					<h2 class="text-xl font-bold text-slate-900">Add University</h2>
					<p class="text-sm text-slate-500">Search for a school to add its supplemental essays.</p>
				</div>

				<div class="p-6 space-y-4">
					<div class="relative">
						<svg
							class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/></svg
						>
						<input
							bind:value={schoolSearchQuery}
							type="text"
							placeholder="Harvard, Stanford, Yale..."
							class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052CC] font-medium"
							autofocus
						/>
					</div>

					<div class="max-h-60 overflow-y-auto space-y-2">
						{#each Object.entries(schoolConfigs).filter(([slug, conf]) => conf.schoolName
								.toLowerCase()
								.includes(schoolSearchQuery.toLowerCase())) as [slug, conf]}
							<button
								onclick={() => addSchool(slug)}
								class="w-full text-left p-3 rounded-lg hover:bg-slate-50 flex items-center justify-between group transition-colors"
							>
								<div class="flex items-center gap-3">
									<div
										class="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500"
									>
										{conf.schoolName[0]}
									</div>
									<span class="font-medium text-slate-700 group-hover:text-slate-900"
										>{conf.schoolName}</span
									>
								</div>
								{#if addedSchoolSlugs.includes(slug)}
									<span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md"
										>Added</span
									>
								{:else}
									<span
										class="text-xs font-bold text-[#0052CC] opacity-0 group-hover:opacity-100 transition-opacity"
										>+ Add</span
									>
								{/if}
							</button>
						{/each}
						{#if schoolSearchQuery && Object.entries(schoolConfigs).filter( ([slug, conf]) => conf.schoolName
										.toLowerCase()
										.includes(schoolSearchQuery.toLowerCase()) ).length === 0}
							<div class="text-center py-8 text-slate-400 text-sm">
								No schools found (try 'Harvard' or 'Stanford')
							</div>
						{/if}
					</div>
				</div>

				<div class="p-4 bg-slate-50 flex justify-end">
					<button
						onclick={() => (showAddSchoolModal = false)}
						class="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-800">Cancel</button
					>
				</div>
			</div>
		</div>
	{/if}
{:else}
	<!-- SALES PAGE -->
	<main class="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
		<div class="flex-1 flex flex-col items-center pt-24 pb-24 px-6 relative overflow-hidden">
			<div class="max-w-6xl w-full mx-auto space-y-16 relative z-10">
				<!-- Header -->
				<div class="text-center space-y-6 max-w-3xl mx-auto">
					<h1 class="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
						Master your application. <br />
						<span class="text-[#0052CC]">Predict your future.</span>
					</h1>
					<p class="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
						Join thousands of students using AI to craft the perfect application and estimate their
						admissions chances.
					</p>

					<!-- TOGGLE -->
					<div class="flex justify-center mt-8">
						<div class="bg-slate-200 p-1 rounded-full flex relative">
							<button
								onclick={() => (pricingMode = 'monthly')}
								class="relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-all {pricingMode ===
								'monthly'
									? 'text-[#0052CC] bg-white shadow-sm'
									: 'text-slate-500 hover:text-slate-700'}"
							>
								Monthly
							</button>
							<button
								onclick={() => (pricingMode = 'cycle')}
								class="relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-all {pricingMode ===
								'cycle'
									? 'text-[#0052CC] bg-white shadow-sm'
									: 'text-slate-500 hover:text-slate-700'}"
							>
								Cycle Pass
							</button>
						</div>
					</div>
				</div>

				<!-- Pricing Cards Container -->
				<div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
					<!-- CARD A: Free / Candidate -->
					<div
						class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col"
					>
						<div class="mb-6">
							<h3 class="text-2xl font-bold text-slate-900">Candidate</h3>
							<div class="flex items-baseline gap-1 mt-2">
								<span class="text-4xl font-black text-slate-900">$0</span>
								<span class="text-sm text-slate-500 font-medium">/ forever</span>
							</div>
							<p class="text-sm text-slate-400 mt-3 leading-relaxed">
								Perfect for getting started with your list and basic simulations.
							</p>
						</div>

						<div class="space-y-4 pt-6 border-t border-slate-100 flex-1">
							<ul class="space-y-4">
								<li class="flex items-start gap-3 text-sm text-slate-600">
									<div
										class="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5"
									>
										<svg
											class="w-3 h-3 text-slate-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="3"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M5 13l4 4L19 7"
											/></svg
										>
									</div>
									<span class="font-bold text-slate-900">Unlimited Simulations</span>
								</li>
								<li class="flex items-start gap-3 text-sm text-slate-600">
									<div
										class="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5"
									>
										<svg
											class="w-3 h-3 text-slate-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="3"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M5 13l4 4L19 7"
											/></svg
										>
									</div>
									<span>Basic Decision Dates</span>
								</li>
								<li class="flex items-start gap-3 text-sm text-slate-600">
									<div
										class="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5"
									>
										<svg
											class="w-3 h-3 text-slate-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="3"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M5 13l4 4L19 7"
											/></svg
										>
									</div>
									<span>Community Access</span>
								</li>
							</ul>
						</div>

						<div class="mt-8">
							<a
								href="/"
								class="block w-full text-center py-4 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
							>
								Start Free
							</a>
						</div>
					</div>

					<!-- CARD B: Pro / Admit -->
					<div
						class="bg-[#0052CC] rounded-3xl p-1 shadow-2xl relative overflow-hidden transform md:-translate-y-4 flex flex-col"
					>
						<div class="bg-white rounded-[20px] h-full p-8 flex flex-col relative overflow-hidden">
							<!-- Background Decoration -->
							<div
								class="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"
							></div>

							<div class="mb-6 relative z-10">
								<div class="flex justify-between items-start">
									<div>
										<h3 class="text-2xl font-bold text-slate-900">
											Admit <span class="text-[#0052CC]">Pro</span>
										</h3>
										<div class="flex items-baseline gap-1 mt-2 h-10">
											{#if pricingMode === 'monthly'}
												<div in:fly={{ y: 10, duration: 200 }} class="flex items-baseline gap-1">
													<span class="text-4xl font-black text-[#0052CC]">$5</span>
													<span class="text-sm text-slate-500 font-medium">/ month</span>
												</div>
											{:else}
												<div in:fly={{ y: 10, duration: 200 }} class="flex items-baseline gap-1">
													<span class="text-4xl font-black text-[#0052CC]">$9</span>
													<span class="text-sm text-slate-500 font-medium">/ one-time</span>
												</div>
											{/if}
										</div>
									</div>
									<div
										class="bg-blue-100 text-[#0052CC] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
									>
										Most Popular
									</div>
								</div>
								<p class="text-sm text-slate-400 mt-3 leading-relaxed">
									{pricingMode === 'monthly'
										? 'Cancel anytime. Flexible access.'
										: 'Access for the full application cycle.'}
								</p>
							</div>

							<!-- IDE TEASER VISUAL -->
							<div
								class="my-6 relative rounded-xl border border-slate-200 bg-slate-50 shadow-inner overflow-hidden h-40 group"
							>
								<!-- Mock Sidebar -->
								<div
									class="absolute left-0 top-0 bottom-0 w-12 border-r border-slate-200 bg-white flex flex-col items-center py-3 gap-2"
								>
									<div class="w-6 h-6 rounded-md bg-blue-100"></div>
									<div class="w-4 h-4 rounded-full bg-slate-100"></div>
									<div class="w-4 h-4 rounded-full bg-slate-100"></div>
								</div>
								<!-- Mock Header -->
								<div
									class="absolute left-12 top-0 right-0 h-8 border-b border-slate-200 bg-white flex items-center px-3 gap-2"
								>
									<div class="w-20 h-2 rounded-full bg-slate-100"></div>
								</div>
								<!-- Mock Content -->
								<div class="absolute left-12 top-8 right-0 bottom-0 p-3 space-y-2">
									<div class="w-3/4 h-2 rounded-full bg-slate-200"></div>
									<div class="w-full h-2 rounded-full bg-slate-100"></div>
									<div class="w-5/6 h-2 rounded-full bg-slate-100"></div>
									<!-- Creating an animated cursor/typing effect -->
									<div class="w-1/2 h-2 rounded-full bg-slate-100 relative">
										<div
											class="absolute right-0 -mr-1 top-0 bottom-0 w-0.5 bg-[#0052CC] animate-pulse"
										></div>
									</div>
								</div>
								<!-- Mock Floating Action Button -->
								<div
									class="absolute bottom-3 right-3 bg-[#0052CC] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1"
								>
									<span>AI Feedback</span>
								</div>

								<!-- Overlay Label -->
								<div
									class="absolute inset-0 bg-slate-900/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<span
										class="bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm"
									>
										Included
									</span>
								</div>
							</div>
							<!-- END TEASER -->

							<div class="space-y-4 flex-1">
								<ul class="space-y-3">
									{#each ['Unlimited AI Essay Grading', 'Deep Dive Application Analysis', 'Smart Extracurricular Optimizer', 'Ivy-League Style Feedback'] as feature}
										<li class="flex items-start gap-3 text-sm text-slate-600">
											<div
												class="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5"
											>
												<svg
													class="w-3 h-3 text-[#0052CC]"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													stroke-width="3"
													><path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M5 13l4 4L19 7"
													/></svg
												>
											</div>
											<span>{feature}</span>
										</li>
									{/each}
								</ul>
							</div>

							<div class="mt-8">
								<button
									onclick={() => handleCheckout(pricingMode)}
									disabled={isProcessing}
									class="w-full py-4 rounded-xl font-bold bg-[#0052CC] text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 transform active:scale-95"
								>
									{googleSignedIn
										? pricingMode === 'monthly'
											? 'Start Monthly Plan'
											: 'Get Cycle Pass'
										: 'Sign in to Upgrade'}
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Promo Code -->
				<div class="text-center relative z-20">
					{#if googleSignedIn}
						<details class="group inline-block text-left">
							<summary
								class="text-xs text-slate-400 cursor-pointer hover:text-[#0052CC] transition-colors list-none select-none"
								>Have a promo code?</summary
							>
							<div
								class="absolute left-1/2 -translate-x-1/2 mt-4 flex items-center justify-center gap-2 animate-in slide-in-from-top-2 duration-200 bg-white p-2 rounded-xl shadow-lg border border-slate-100 min-w-[300px]"
							>
								<input
									type="text"
									bind:value={promoCode}
									placeholder="Enter code"
									class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
								/>
								<button
									onclick={handlePromo}
									class="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg text-sm hover:bg-slate-200 transition-colors"
								>
									Apply
								</button>
							</div>
						</details>
					{:else}
						<p class="text-xs text-slate-400">Sign in to redeem promo codes.</p>
					{/if}
				</div>

				<!-- FAQ Section -->
				<div class="max-w-2xl mx-auto pt-12 space-y-8">
					<div class="text-center">
						<h2 class="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
					</div>

					<div
						class="rounded-2xl border border-slate-200 bg-[#F9FCFF] overflow-hidden divide-y divide-[#F3F4F6]"
					>
						{#each faqs as faq, i}
							<button
								onclick={() => toggleFaq(i)}
								class="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-white transition-colors"
							>
								<span class="font-bold text-sm text-slate-800">{faq.q}</span>
								<span
									class="text-slate-400 transition-transform duration-200 {openFaqIndex === i
										? 'rotate-45'
										: ''}"
								>
									<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 4v16m8-8H4"
										/></svg
									>
								</span>
							</button>
							{#if openFaqIndex === i}
								<div
									transition:slide={{ duration: 200 }}
									class="p-6 pt-0 text-sm text-slate-500 bg-white leading-relaxed"
								>
									{faq.a}
								</div>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		</div>
		<SiteFooter />
	</main>
{/if}

<style>
	/* Styling for the IDE scrollbars */
	.custom-scrollbar::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: #f1f5f9;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 5px;
		border: 2px solid #f1f5f9;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
</style>
