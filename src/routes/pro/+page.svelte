<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import { page } from '$app/stores';
	import { signIn } from '@auth/sveltekit/client';
	import { fly, fade, slide } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import RadarChart from '$lib/components/common/RadarChart.svelte';
	import { schoolConfigs } from '$lib/config/schools';
	import { schoolPrompts } from '$lib/config/prompts';
	import { majors } from '$lib/config/majors';
	import { states } from '$lib/config/states';
	import { onMount } from 'svelte';
	import DashboardHome from '$lib/components/pro/DashboardHome.svelte';
	import AICounselor from '$lib/components/pro/AICounselor.svelte';
	import SchoolsExplorer from '$lib/components/pro/SchoolsExplorer.svelte';
	import ChanceMeProfile from '$lib/components/pro/ChanceMeProfile.svelte';
	import SettingsView from '$lib/components/pro/SettingsView.svelte';
	import UpgradeCarousel from '$lib/components/UpgradeCarousel.svelte';

	// --- RUNES STATE ---
	let { data } = $props();

	// Mind Map AI State
	let isGeneratingMindMap = $state(false);

	async function generateMindMap() {
		if (isGeneratingMindMap) return;
		isGeneratingMindMap = true;
		try {
			const res = await fetch('/api/ai/generate-mindmap', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ profile })
			});
			const data = await res.json();
			if (data.nodes) {
				mindMapNodes = data.nodes;
				mindMapConnections = data.connections;
			}
		} catch (e) {
			console.error(e);
		} finally {
			isGeneratingMindMap = false;
		}
	}

	function removeMindMapNode(id: string) {
		mindMapNodes = mindMapNodes.filter((n) => n.id !== id);
		mindMapConnections = mindMapConnections.filter((c) => c.from !== id && c.to !== id);
	}

	function resetMindMap() {
		if (confirm('Are you sure you want to clear the entire mind map?')) {
			mindMapNodes = [];
			mindMapConnections = [];
			mindMapAnalysis = '';
		}
	}

	// Auth & Pro State
	let session = $derived($page.data.session);
	let googleSignedIn = $derived(!!session?.user);
	let isPro = $derived($userProfile.isPro);

	// Mobile navigation: the workspace sidebar collapses into an off-canvas drawer
	// on phones (it is always visible from md up). Toggled by the mobile top bar.
	let sidebarOpen = $state(false);

	// Sales/Pricing State
	let pricingMode = $state<'lifetime' | 'monthly'>('monthly');
	// Ticker Animation
	const displayedPrice = tweened(39, {
		duration: 800,
		easing: cubicOut
	});

	$effect(() => {
		if (pricingMode === 'monthly') {
			displayedPrice.set(39);
		} else {
			displayedPrice.set(99);
		}
	});

	let promoCode = $state('');
	let promoError = $state('');
	let isProcessing = $state(false);

	// VIEW STATE
	let currentView = $state<
		| 'dashboard'
		| 'editor'
		| 'mindmap'
		| 'counselor'
		| 'schools'
		| 'chanceme'
		| 'settings'
	>('dashboard');

	// Mind Map State
	type MindMapNode = {
		id: string;
		x: number;
		y: number;
		text: string;
	};
	let mindMapNodes = $state<MindMapNode[]>([]);
	let mindMapConnections = $state<{ from: string; to: string }[]>([]);
	let mindMapAnalysis = $state('');
	let isAnalyzingMindMap = $state(false);

	let draggingNodeId = $state<string | null>(null);

	function addMindMapNode(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('.node-input')) return;
		if (draggingNodeId) return;

		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const id = Math.random().toString(36).substring(2, 9);
		const newNode = { id, x, y, text: '' };

		if (mindMapNodes.length > 0) {
			// Connect to the last node
			mindMapConnections = [
				...mindMapConnections,
				{
					from: mindMapNodes[mindMapNodes.length - 1].id,
					to: id
				}
			];
		}

		mindMapNodes = [...mindMapNodes, newNode];
	}

	function handleNodeMouseDown(e: MouseEvent, id: string) {
		e.stopPropagation();
		draggingNodeId = id;
	}

	function handleContainerMouseMove(e: MouseEvent) {
		if (!draggingNodeId) return;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		mindMapNodes = mindMapNodes.map((n) => {
			if (n.id === draggingNodeId) {
				return { ...n, x, y };
			}
			return n;
		});
	}

	function handleContainerMouseUp() {
		draggingNodeId = null;
	}

	async function analyzeMindMap() {
		if (isAnalyzingMindMap) return;
		isAnalyzingMindMap = true;
		// Mock analysis
		await new Promise((r) => setTimeout(r, 1500));

		const themes = [
			'Resilience',
			'Intellectual Vitality',
			'Community Leadership',
			'Cultural Identity'
		];
		const randomTheme = themes[Math.floor(Math.random() * themes.length)];

		mindMapAnalysis = `**Theme that keeps showing up: ${randomTheme}**\n\nReading your notes, most of them point back to ${randomTheme.toLowerCase()}. That's your thread. Write the personal statement about how it changed for you over time, not about the trait in the abstract.`;
		isAnalyzingMindMap = false;
	}

	// IDE State
	type File = {
		id: string;
		name: string;
		language: 'markdown' | 'text';
		content: string;
		school?: string; // If linked to a specific school's logic
		isOpen: boolean;
		isModified: boolean;
		lastAnalysis?: any;
	};

	let files = $state<File[]>([
		{
			id: 'common-app',
			name: 'Common App Personal',
			language: 'markdown',
			content:
				'# Personal Statement\n\n### Prompt\nSome students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.\n\n[Paste your essay here...]',
			school: 'Common App',
			isOpen: true,
			isModified: false
		},
		...Object.values(schoolConfigs).map((config) => {
			const prompts = schoolPrompts[config.slug] || [];
			const promptsContent = prompts
				.map((p) => `### ${p.title}\n${p.description}\n\n[Paste your essay here...]\n\n`)
				.join('---\n\n');
			const finalContent = `# ${config.schoolName} Supplement\n\n${promptsContent.length > 0 ? promptsContent : '### Prompt\n[Paste prompt here]\n\n[Paste essay here]'}`;

			return {
				id: config.slug + '-supplement',
				name: config.logoPrimary, // e.g. "Harvard", "MIT"
				language: 'markdown' as const,
				content: finalContent,
				school: config.schoolName,
				isOpen: true,
				isModified: false
			};
		})
	]);

	let activeFileIndex = $state(0);
	// Safety check in case index is out of bounds
	let activeFile = $derived(files[activeFileIndex] || files[0]);

	// Stats / Profile State
	type Activity = {
		id: string;
		name: string;
		role: string;
		hoursPerWeek: string;
		description: string;
	};

	type Honor = {
		id: string;
		title: string;
		gradeLevel: '9' | '10' | '11' | '12';
		level: 'School' | 'State' | 'National' | 'International';
		description: string;
	};

	let profile = $state({
		gpa_uw: '',
		gpa_w: '',
		testScore: '',
		ecs: '', // Legacy string field, kept for compatibility if needed or migrated
		activities: [] as Activity[],
		honors: [] as Honor[], // Added Honors
		rigor: 'Regular' as 'Regular' | 'Honors' | 'AP/IB',
		gradeTrend: 'Steady' as 'Rising' | 'Steady' | 'Dipping',
		lowestGrade: 'A' as 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F',
		major: '',
		state: '',
		environment: 'Urban' as 'Urban' | 'Suburban' | 'Rural',
		living: 'On Campus' as 'On Campus' | 'Off Campus' | 'Commuter'
	});

	// State Autofill logic
	let showStateSuggestions = $state(false);
	let filteredStates = $derived(
		states.filter((s) => s.toLowerCase().includes((profile.state || '').toLowerCase()))
	);

	function addActivity() {
		profile.activities = [
			...profile.activities,
			{
				id: Math.random().toString(36).substring(2, 9),
				name: '',
				role: '',
				hoursPerWeek: '',
				description: ''
			}
		];
	}

	function removeActivity(id: string) {
		profile.activities = profile.activities.filter((a) => a.id !== id);
	}

	function addHonor() {
		profile.honors = [
			...profile.honors,
			{
				id: Math.random().toString(36).substring(2, 9),
				title: '',
				gradeLevel: '12',
				level: 'School',
				description: ''
			}
		];
	}

	function removeHonor(id: string) {
		profile.honors = profile.honors.filter((h) => h.id !== id);
	}

	// Activities Import Logic
	let showImportModal = $state(false);
	let importText = $state('');

	function parseAndImportActivities() {
		if (!importText.trim()) return;

		const lines = importText.split('\n').filter((l) => l.trim().length > 0);
		// Simple heuristic: Title - Role - Hours (or just Title)
		const newActivities = lines.map((line) => {
			const parts = line.split(/[-|–]/); // Split by common separators
			return {
				id: Math.random().toString(36).substring(2, 9),
				name: parts[0]?.trim() || 'Activity',
				role: parts[1]?.trim() || 'Member',
				hoursPerWeek: parts[2]?.trim() || '2', // Default assumption
				description: ''
			};
		});

		profile.activities = [...profile.activities, ...newActivities];
		importText = '';
		showImportModal = false;
	}

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

	// Academic Index (AI) - Improved Formula
	let academicIndex = $derived.by(() => {
		// Parse Inputs
		const gpaUw = parseFloat(profile.gpa_uw) || 0;
		const gpaW = parseFloat(profile.gpa_w) || gpaUw;
		const test = parseFloat(profile.testScore) || 0;

		// 1. Test Score Component (Max 80)
		// Normalized to 80 points (AI standard usually scales CR+M / 20)
		// 1600 SAT -> 80 pts. 36 ACT -> 80 pts.
		let normalizedTest = test;
		if (test > 0 && test < 37) {
			// ACT Mapping
			// 36->1600, 35->1560, 34->1520 approx
			normalizedTest = test * 44.44;
		}
		const testComponent = Math.min(80, (normalizedTest / 1600) * 80);

		// 2. GPA Component (Max 80)
		// AI uses "Converted Rank Score" often, but we proxy with GPA.
		// Base off Weighted if available, but cap boost to prevent grade inflation skew.
		const effectiveGpa = gpaW > 0 ? Math.min(5.0, gpaW) : Math.min(4.0, gpaUw);

		// 4.0 UW is typically ~75-80 depending on school profile.
		// Let's say 4.0 = 70 pts base. Rigor & Trends add on top.
		let gpaScore = (effectiveGpa / 4.0) * 70;

		// Rigor Bonus (More robust now)
		if (profile.rigor === 'AP/IB') gpaScore += 8;
		else if (profile.rigor === 'Honors') gpaScore += 4;

		// Grade Trend Adjustment
		if (profile.gradeTrend === 'Rising') gpaScore += 3;
		else if (profile.gradeTrend === 'Dipping') gpaScore -= 5;

		// Lowest Grade Penalty (Red Flag Check)
		const lowGrades = ['C', 'C-', 'D', 'F'];
		const midGrades = ['B-', 'C+'];

		if (lowGrades.includes(profile.lowestGrade)) {
			// Significant penalty for C or lower
			gpaScore -= 10;
			if (profile.lowestGrade === 'D' || profile.lowestGrade === 'F') gpaScore -= 15; // Extra penalty
		} else if (midGrades.includes(profile.lowestGrade)) {
			gpaScore -= 3;
		}

		// Cap GPA component at 80 (perfect score)
		// But allow exceptional candidates (5.0 GPA + AP + Rising) to hit it easily
		const gpaComponent = Math.min(80, Math.max(0, gpaScore));

		let total = testComponent + gpaComponent;

		// Scale to typical 240 index (80+80=160 -> *1.5 = 240)
		return Math.max(0, Math.round(total * 1.5));
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
	let addedSchoolSlugs = $state<string[]>(Object.keys(schoolConfigs)); // Default ALL schools
	let selectedSchoolForDeepDive = $state<string | null>(null);
	let schoolStrategies = $state<Record<string, string>>({});

	// Load Strategies
	onMount(() => {
		const savedStrategies = localStorage.getItem('predictadmit_strategies');
		if (savedStrategies) {
			try {
				schoolStrategies = JSON.parse(savedStrategies);
			} catch (e) {}
		}
	});

	// Save Strategies
	$effect(() => {
		localStorage.setItem('predictadmit_strategies', JSON.stringify(schoolStrategies));
	});

	// Analysis/Terminal State
	let isBuilding = $state(false);
	let buildOutput = $state<string[]>([]);
	let analysisResult = $state<any>(null); // Store the grade result here
	let showTerminal = $state(false); // Changed default to false to be cleaner
	let activeTab = $state<'terminal' | 'output' | 'editor' | 'feedback'>('editor');

	// New Progress State
	let analysisStep = $state('');
	let estimatedTime = $state('');
	let progressPercent = $state(0);
	let activeAnnotationIndex = $state<number | null>(null);
	let showProfileEditor = $state(false);

	function handleAnnotationClick(idx: string) {
		const index = parseInt(idx);
		if (!isNaN(index)) {
			activeAnnotationIndex = index;
			showTerminal = true;
			activeTab = 'output'; // Ensure we are on the results tab

			// Scroll sidebar to item
			setTimeout(() => {
				const el = document.getElementById(`annotation-${index}`);
				if (el) {
					el.scrollIntoView({ behavior: 'smooth', block: 'center' });
					el.classList.add('bg-blue-50', 'ring-2', 'ring-blue-200');
					setTimeout(() => el.classList.remove('bg-blue-50', 'ring-2', 'ring-blue-200'), 2000);
				}
			}, 100);
		}
	}

	// --- PERSISTENCE LOGIC ---
	onMount(() => {
		// Load Profile
		const savedProfile = localStorage.getItem('predictadmit_profile');
		if (savedProfile) {
			try {
				const p = JSON.parse(savedProfile);
				profile = { ...profile, ...p };
			} catch (e) {
				console.error('Failed to load profile', e);
			}
		}

		// Load Mind Map
		const savedNodes = localStorage.getItem('predictadmit_mindmap_nodes');
		if (savedNodes) {
			try {
				mindMapNodes = JSON.parse(savedNodes);
			} catch (e) {}
		}
		const savedConns = localStorage.getItem('predictadmit_mindmap_connections');
		if (savedConns) {
			try {
				mindMapConnections = JSON.parse(savedConns);
			} catch (e) {}
		}

		// Load Files
		const savedFilesRes = localStorage.getItem('predictadmit_files');
		if (savedFilesRes) {
			try {
				const savedFiles = JSON.parse(savedFilesRes) as File[];
				// Merge strategy: Overwrite content for matching IDs, add new files if they don't exist
				// But we also want to keep the new logic for prompts if we updated the site?
				// User preference: Saved content overrides default prompt.
				files = files.map((f) => {
					const saved = savedFiles.find((s) => s.id === f.id);
					if (saved)
						return {
							...f,
							content: saved.content,
							isOpen: saved.isOpen,
							isModified: saved.isModified,
							lastAnalysis: saved.lastAnalysis
						};
					return f;
				});

				// Add custom created files that are not in the default list
				const defaultIds = new Set(files.map((f) => f.id));
				const customFiles = savedFiles.filter((s) => !defaultIds.has(s.id));
				if (customFiles.length > 0) {
					files = [...files, ...customFiles];
				}
			} catch (e) {
				console.error('Failed to load files', e);
			}
		}

		// Load Active File
		const savedActiveIdx = localStorage.getItem('predictadmit_active_file_idx');
		if (savedActiveIdx) {
			const idx = parseInt(savedActiveIdx);
			if (!isNaN(idx) && idx >= 0 && idx < files.length) {
				activeFileIndex = idx;
			}
		}

		// Load Added Schools (to keep the list consistent)
		const savedSchoolSlugs = localStorage.getItem('predictadmit_added_schools');
		if (savedSchoolSlugs) {
			try {
				addedSchoolSlugs = JSON.parse(savedSchoolSlugs);
			} catch (e) {}
		}
	});

	// Save Effect
	$effect(() => {
		// This runs whenever dependencies change
		// Debouncing is optional but good. For now, direct save is fine for text scale.
		localStorage.setItem('predictadmit_profile', JSON.stringify(profile));
		localStorage.setItem('predictadmit_mindmap_nodes', JSON.stringify(mindMapNodes));
		localStorage.setItem('predictadmit_mindmap_connections', JSON.stringify(mindMapConnections));
		localStorage.setItem('predictadmit_files', JSON.stringify(files));
		localStorage.setItem('predictadmit_active_file_idx', activeFileIndex.toString());
		localStorage.setItem('predictadmit_added_schools', JSON.stringify(addedSchoolSlugs));
	});

	// Radar Chart Data Helper
	let radarData = $derived(
		analysisResult?.essays?.[0]?.scores
			? Object.entries(analysisResult.essays[0].scores).map(([k, v]: [string, any]) => ({
					label: k.replace(/([A-Z])/g, ' $1').trim(), // split camelCase
					value: (v.score || 0) * 10
				}))
			: []
	);

	// --- ODDS CALCULATION LOGIC ---
	function calculateAdmissionsOdds(schoolSlug: string): number {
		const config = schoolConfigs[schoolSlug];
		// Safety check if config or new fields are missing
		if (!config || config.baseRate === undefined || config.difficulty === undefined) return 5;

		// 1. Determine Target AI based on difficulty (1-10)
		// Scale: Diff 10 (Harvard) -> 230 AI (Near perfect)
		// Diff 8.5 (UCLA) -> 215 AI
		const targetAI = 130 + config.difficulty * 10;

		// 2. Calculate Delta (User AI vs Target)
		const delta = academicIndex - targetAI;

		// 3. Multiplier Calculation
		let multiplier = 1;

		if (delta >= 0) {
			// Boost: Positive delta boosts odds.
			// e.g. +30 points above target -> ~2x boost. Max cap 4x.
			multiplier = 1 + Math.min(3, delta / 30);
		} else {
			// Penalty: Negative delta punishes exponentially.
			// e.g. -20 points -> ~0.44x odds
			multiplier = Math.pow(1.5, delta / 15);
		}

		// 4. Base Rate Adjustment
		let rawOdds = config.baseRate * 100 * multiplier;

		// 5. Hooks / Caps
		// Extremely selective schools (Diff 9+) rarely go above 35-40% even for perfect stats
		const maxCap = config.difficulty >= 9 ? 35 : 80;
		const minFloor = 2; // Always a non-zero chance

		return Math.round(Math.max(minFloor, Math.min(maxCap, rawOdds)));
	}

	function getOddsColor(odds: number) {
		if (odds < 15) return 'text-rose-600 bg-rose-50'; // Reach
		if (odds < 40) return 'text-amber-600 bg-amber-50'; // Target
		return 'text-emerald-600 bg-emerald-50'; // Likely
	}

	function getBarColor(odds: number) {
		if (odds < 15) return 'bg-rose-500';
		if (odds < 40) return 'bg-amber-500';
		return 'bg-emerald-500';
	}

	// --- ACTIONS ---

	function handlePromo() {
		// Promo codes no longer grant Pro from the client — the old
		// `strawberrylemonade` string shipped in the JS bundle, so anyone could
		// self-grant free Pro (and unlimited free sims). Pro now requires a real
		// trial/subscription. For a promo, apply a Stripe coupon to the trial
		// checkout (server-validated) instead of unlocking client-side.
		promoError = 'To unlock, choose a plan above.';
		setTimeout(() => (promoError = ''), 4000);
	}

	// Show the benefit carousel before Stripe on the upgrade tiers (same as /ai).
	let showUpgradeCarousel = $state(false);
	let carouselPlan = $state<'monthly' | 'lifetime'>('lifetime');
	function startUpgrade(plan: 'monthly' | 'lifetime') {
		carouselPlan = plan;
		showUpgradeCarousel = true;
	}

	async function handleCheckout(plan: 'monthly' | 'lifetime') {
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
		analysisResult = activeFile.lastAnalysis || null; // Restore analysis if exists
		showTerminal = false; // Hide sidebar initially
		// Default to editor, but if analysis exists, user might want to see it? Let's stick to editor.
		activeTab = 'editor';
		currentView = 'editor';
	}

	function downloadFile() {
		const element = document.createElement('a');
		const file = new Blob([activeFile.content], { type: 'text/markdown' });
		element.href = URL.createObjectURL(file);
		element.download = activeFile.name.endsWith('.md') ? activeFile.name : activeFile.name + '.md';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	function addNewSupplemental() {
		const id = Math.random().toString(36).substring(7);
		const newFile: File = {
			id: `supp-${id}`,
			name: 'New Supplement',
			language: 'markdown',
			content:
				'# Supplemental Essay\n\n### Prompt\n[Paste your prompt here...]\n\n[Paste your essay here...]',
			school: 'General',
			isOpen: true,
			isModified: false
		};
		files = [...files, newFile];
		activeFileIndex = files.length - 1;
		currentView = 'editor';
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
		progressPercent = 0;
		analysisStep = 'Initializing...';
		estimatedTime = 'Calculating...';

		// Stepped progress simulation

		// Step 1: Parsing
		analysisStep = 'Parsing Document Structure';
		estimatedTime = '12s remaining';
		progressPercent = 10;
		await new Promise((r) => setTimeout(r, 800));
		buildOutput = [...buildOutput, '> Parsing markdown...', '> Detecting essay structure...'];

		// Step 2: Identification
		analysisStep = 'Identifying University Prompts';
		estimatedTime = '9s remaining';
		progressPercent = 30;
		await new Promise((r) => setTimeout(r, 1200));
		buildOutput = [
			...buildOutput,
			'> Integrating applicant profile...',
			'> Profile loaded: ' + profile.gpa_uw
		];

		// Step 3: Analysis
		analysisStep = 'Analyzing Institutional Alignment';
		estimatedTime = '5s remaining';
		progressPercent = 60;
		buildOutput = [...buildOutput, '> Handshake with PredictAdmit AI engine...'];

		try {
			// Re-use the existing essay-grader API logic
			// Adapt old profile structure to new one for API compatibility if needed
			const legacyProfile = {
				gpa: profile.gpa_uw + ' (UW) / ' + profile.gpa_w + ' (W)',
				testScore: profile.testScore,
				ecs: profile.ecs,
				activities: profile.activities
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

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.error || 'Grading failed');
			}
			const data = await res.json();

			analysisStep = 'Generating Feedback';
			estimatedTime = 'Almost done...';
			progressPercent = 90;
			await new Promise((r) => setTimeout(r, 800)); // Final polish wait

			analysisResult = data;

			// Save analysis to file
			const newFiles = [...files];
			newFiles[activeFileIndex] = { ...activeFile, lastAnalysis: data };
			files = newFiles;

			buildOutput = [...buildOutput, '> Build Successful.', '> Analysis ready.'];
			progressPercent = 100;

			// Auto switch to result
			setTimeout(() => {
				activeTab = 'feedback';
				showTerminal = true; // Show sidebar for details
			}, 500);
		} catch (e: any) {
			console.error(e);
			buildOutput = [
				...buildOutput,
				'> Error: Build Failed.',
				'> ' + (e.message || 'Unknown error')
			];
			analysisStep = 'Error';
			estimatedTime = '';
		} finally {
			isBuilding = false;
		}
	}

	// Annotation Helper
	function getHighlightedContent(
		content: string,
		annotations: any[],
		activeIndex: number | null = null
	) {
		if (!annotations || annotations.length === 0) return content.replace(/\n/g, '<br/>');

		// 1. Escape HTML in the content first (so we match against the rendered text)
		let html = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

		// 2. Sort annotations by length (longest first) to prevent shorter sub-matches from breaking longer ones
		// We make a copy to avoid mutating the original array if it matters (though flatMap created a new one)
		const sortedanns = [...annotations]
			.map((a, i) => ({ ...a, originalIndex: i }))
			.sort((a, b) => b.quote.length - a.quote.length);

		sortedanns.forEach((ann: any) => {
			const quote = ann.quote.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			if (quote.length < 5) return;

			// Robust Match:
			// 1. Escape regex characters in the quote
			const escapedQuote = quote.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			// 2. Allow any whitespace (newlines etc) where spaces are
			const flexibleQuote = escapedQuote.replace(/\s+/g, '[\\s\\n\\r]+');

			const regex = new RegExp(`(${flexibleQuote})`, 'i');

			// Apply Active Class if index matches
			const isActive = ann.originalIndex === activeIndex;
			const activeClasses = isActive
				? 'bg-yellow-300 border-yellow-500 ring-2 ring-yellow-400 z-10'
				: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200';

			// We use the ORIGINAL index for the data-idx so it matches the sidebar
			html = html.replace(
				regex,
				`<span class="${activeClasses} border-b-2 cursor-pointer transition-colors relative group/highlight highlight-span" data-idx="${ann.originalIndex}">$1</span>`
			);
		});

		return html.replace(/\n/g, '<br/>');
	}

	// FAQ State
	let openFaqIndex = $state<number | null>(null);
	// ... kept faqs ...
	const faqs = [
		{
			q: 'Does a good prediction mean I get in?',
			a: "No, and anyone who tells you otherwise is lying. We run the odds off real historical data. Admissions officers are humans reading on a Tuesday afternoon, and no model gets inside their heads. Treat the number as a sharp estimate, not a verdict."
		},
		{
			q: 'Is this a subscription?',
			a: "Two ways: Lifetime is a single $25 payment — no recurring charge, nothing to cancel, yours forever. Or Monthly at $9.99/mo while you're applying (2½ months of Monthly = Lifetime, so most people just get Lifetime). Both cover all 39 schools, unlimited re-runs, and the essay workshop. Your first prediction is free, so you see the value before you pay."
		},
		{
			q: 'What if I only care about one school?',
			a: "Run your free prediction first, then unlock the full deep-dive for any one school for a one-time $4.99 — the AI decision simulation, the breakdown of why, and essay grading for that school."
		},
		{
			q: 'How good is the essay grader, really?',
			a: "It was built on thousands of essays that actually got people into Top 20 schools. It reads for structure, voice, and whether the essay fits the specific school you are targeting, then tells you where it is weak. It grades and gives notes. It never writes a line for you."
		}
	];

	function toggleFaq(index: number) {
		openFaqIndex = openFaqIndex === index ? null : index;
	}
</script>

<svelte:head>
	<title>PredictAdmit Pro — see your real decisions before they land</title>
	<meta
		name="description"
		content="Pro runs the AI on your actual profile: predicted decisions across 39 schools, deep-dive analysis, and blunt essay grading. Your first prediction is free, then $25 once for lifetime access (or $9.99/mo)."
	/>
</svelte:head>

{#if isPro}
	<!-- PREDICTADMIT PRO INTERFACE — gated on an active Pro plan (Stripe trial or
	     purchase), NOT on mere Google sign-in. Free signed-in users fall through
	     to the pricing/paywall branch below. -->

	<div class="relative flex h-[100dvh] w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
		<!-- Mobile drawer backdrop -->
		{#if sidebarOpen}
			<div
				class="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
				onclick={() => (sidebarOpen = false)}
				role="presentation"
			></div>
		{/if}

		<!-- SIDEBAR NAVIGATION (off-canvas drawer on mobile, static from md up) -->
		<aside
			class="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 md:static md:translate-x-0 {sidebarOpen
				? 'translate-x-0 shadow-2xl'
				: '-translate-x-full'} md:shadow-none"
		>
			<!-- Branding -->
			<div class="h-14 px-4 flex items-center shrink-0">
				<div class="flex items-center gap-2.5 min-w-0">
					<!-- Logo Icon -->
					<div class="w-6 h-6 rounded-md bg-[#0052CC] flex items-center justify-center shrink-0">
						<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/></svg
						>
					</div>
					<span class="text-sm font-semibold tracking-tight text-slate-900 truncate"
						>PredictAdmit</span
					>
					<span
						class="rounded-md border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0052CC]"
						>Pro</span
					>
				</div>
			</div>

			<!-- Views -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="flex-1 overflow-y-auto px-2 py-2 space-y-px"
				onclick={() => (sidebarOpen = false)}
			>
				<!-- DASHBOARD TAB -->
				<button
					onclick={() => (currentView = 'dashboard')}
					class="w-full h-9 flex items-center rounded-md text-left transition-colors {currentView ===
					'dashboard'
						? 'bg-slate-100 text-slate-900'
						: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
				>
					<span
						class="w-9 h-9 grid place-content-center shrink-0 {currentView === 'dashboard'
							? 'text-[#0052CC]'
							: ''}"
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
							/></svg
						>
					</span>
					<span class="text-[13px] font-medium truncate">Hub & Stats</span>
				</button>

				<!-- MIND MAP TAB -->
				<button
					onclick={() => (currentView = 'mindmap')}
					class="w-full h-9 flex items-center rounded-md text-left transition-colors {currentView ===
					'mindmap'
						? 'bg-slate-100 text-slate-900'
						: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
				>
					<span
						class="w-9 h-9 grid place-content-center shrink-0 {currentView === 'mindmap'
							? 'text-[#0052CC]'
							: ''}"
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
							/>
						</svg>
					</span>
					<span class="text-[13px] font-medium truncate">Mind Map / Inspo</span>
				</button>

				<!-- AI COUNSELOR TAB -->
				<button
					onclick={() => (currentView = 'counselor')}
					class="w-full h-9 flex items-center rounded-md text-left transition-colors {currentView ===
					'counselor'
						? 'bg-slate-100 text-slate-900'
						: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
				>
					<span
						class="w-9 h-9 grid place-content-center shrink-0 {currentView === 'counselor'
							? 'text-[#0052CC]'
							: ''}"
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 3v-3z"
							/></svg
						>
					</span>
					<span class="text-[13px] font-medium truncate">AI Counselor</span>
				</button>

				<!-- SCHOOLS TAB -->
				<button
					onclick={() => (currentView = 'schools')}
					class="w-full h-9 flex items-center rounded-md text-left transition-colors {currentView ===
					'schools'
						? 'bg-slate-100 text-slate-900'
						: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
				>
					<span
						class="w-9 h-9 grid place-content-center shrink-0 {currentView === 'schools'
							? 'text-[#0052CC]'
							: ''}"
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 14l9-5-9-5-9 5 9 5z"
							/><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 14l6.16-3.422A12.083 12.083 0 0121 12.11c0 .93-.14 1.83-.4 2.68L12 21l-8.6-6.21A11.98 11.98 0 013 12.11c0-.9.14-1.79.4-2.63L12 14z"
							/></svg
						>
					</span>
					<span class="text-[13px] font-medium truncate">Universities</span>
				</button>

				<!-- CHANCE ME TAB -->
				<button
					onclick={() => (currentView = 'chanceme')}
					class="w-full h-9 flex items-center rounded-md text-left transition-colors {currentView ===
					'chanceme'
						? 'bg-slate-100 text-slate-900'
						: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'}"
				>
					<span
						class="w-9 h-9 grid place-content-center shrink-0 {currentView === 'chanceme'
							? 'text-[#0052CC]'
							: ''}"
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/></svg
						>
					</span>
					<span class="text-[13px] font-medium truncate">Chance Me</span>
				</button>

				<div class="mt-5 mb-1 px-3 flex items-center justify-between">
					<span class="text-[11px] font-medium uppercase tracking-wider text-slate-400">Essays</span>
					<button
						onclick={addNewSupplemental}
						class="p-1 rounded-md text-slate-300 hover:text-slate-700 hover:bg-slate-100 transition-colors"
						title="New Supplemental Essay"
					>
						<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
					</button>
				</div>

				{#each files as file, i}
					<button
						onclick={() => switchFile(i)}
						class="w-full h-8 flex items-center gap-2 rounded-md px-3 text-left transition-colors {currentView ===
							'editor' && activeFileIndex === i
							? 'bg-slate-100 text-slate-900'
							: 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'}"
					>
						<svg
							class="w-3.5 h-3.5 shrink-0 {currentView === 'editor' && activeFileIndex === i
								? 'text-[#0052CC]'
								: 'text-slate-400'}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<span class="text-[13px] font-medium truncate flex-1">{file.name.replace(/.md|.txt/g, '')}</span>
					</button>
				{/each}

				<button
					onclick={addNewSupplemental}
					class="w-full h-8 flex items-center gap-2 rounded-md px-3 text-left text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 transition-colors"
				>
					<svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					<span class="text-[13px] font-medium">Add New Essay</span>
				</button>

				<!-- Import Modal -->
				{#if showImportModal}
					<div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
						<div
							class="absolute inset-0 bg-black/40 backdrop-blur-sm"
							onclick={() => (showImportModal = false)}
						></div>
						<div class="bg-white rounded-xl shadow-2xl w-full max-w-lg relative z-10 p-6 space-y-4">
							<h3 class="text-lg font-bold">Import Activities</h3>
							<p class="text-sm text-slate-500">
								Paste straight from your resume, one activity per line. <br />We'll split each on the dashes:
								<code class="bg-slate-100 px-1 rounded">Name - Role - Hours</code>
							</p>
							<textarea
								bind:value={importText}
								class="w-full h-40 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0052CC] outline-none"
								placeholder="Debate Club - Captain - 5&#10;Varsity Soccer - Starter - 10"
							></textarea>
							<div class="flex justify-end gap-2">
								<button
									onclick={() => (showImportModal = false)}
									class="px-4 py-2 text-slate-500 font-bold text-sm">Cancel</button
								>
								<button
									onclick={parseAndImportActivities}
									class="px-4 py-2 bg-[#0052CC] text-white font-bold rounded-lg text-sm"
									>Import</button
								>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- User Menu — h-24 to line up with the essay editor's bottom action bar -->
			<div class="h-24 px-3 border-t border-slate-200/80 flex items-center shrink-0">
				<button
					onclick={() => {
						currentView = 'settings';
						sidebarOpen = false;
					}}
					title="Settings"
					class="flex items-center gap-2.5 w-full h-10 px-2 rounded-md transition-colors {currentView ===
					'settings'
						? 'bg-slate-100'
						: 'hover:bg-slate-100/70'}"
				>
					{#if session?.user?.image}
						<img
							src={session.user.image}
							alt={session.user.name}
							referrerpolicy="no-referrer"
							class="w-6 h-6 rounded-full shrink-0"
						/>
					{:else}
						<div
							class="w-6 h-6 rounded-full bg-[#0052CC] flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
						>
							{session?.user?.name?.[0] || 'U'}
						</div>
					{/if}
					<div class="text-left flex-1 min-w-0">
						<div class="text-[13px] font-medium text-slate-900 truncate">{session?.user?.name}</div>
					</div>
					<svg
						class="w-4 h-4 text-slate-400 shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/></svg
					>
				</button>
			</div>
		</aside>

		<!-- MAIN AREA -->
		<main class="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
			<!-- Mobile top bar: opens the workspace drawer (hidden from md up) -->
			<div
				class="md:hidden h-14 shrink-0 flex items-center gap-3 px-4 border-b border-slate-200 bg-white z-30"
			>
				<button
					onclick={() => (sidebarOpen = true)}
					aria-label="Open menu"
					class="p-2 -ml-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
				>
					<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/></svg
					>
				</button>
				<div class="flex items-center gap-2 min-w-0">
					<span class="text-sm font-semibold tracking-tight text-slate-900 truncate">PredictAdmit</span>
					<span
						class="rounded-md border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0052CC]"
						>Pro</span
					>
				</div>
			</div>

			{#if currentView === 'dashboard'}
					<DashboardHome setView={(v) => (currentView = v as typeof currentView)} />

				<!-- PROFILE EDITOR MODAL / SLIDE-OVER -->
				{#if showProfileEditor}
					<div class="fixed inset-0 z-50 flex justify-end">
						<div
							class="absolute inset-0 bg-slate-900/60 transition-opacity"
							onclick={() => (showProfileEditor = false)}
						></div>

						<div
							class="w-full max-w-3xl bg-slate-50 h-full shadow-2xl relative flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
						>
							<div class="flex items-center justify-between p-6 bg-white border-b border-slate-200">
								<div>
									<h2 class="text-xl font-bold text-slate-900">Applicant Profile</h2>
									<p class="text-sm text-slate-500">
										The more of this you fill in, the closer the predictions get to reality.
									</p>
								</div>
								<button
									onclick={() => (showProfileEditor = false)}
									class="p-2 hover:bg-slate-100 rounded-full text-slate-500"
								>
									<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/></svg
									>
								</button>
							</div>

							<div class="flex-1 overflow-y-auto p-6 space-y-8">
								<!-- Paste existing Profile Form contents here -->
								<!-- ACADEMIC CARD -->
								<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
									<h3
										class="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2"
									>
										Academic Profile
									</h3>
									<div class="grid grid-cols-2 gap-4">
										<!-- ... form fields from previous line 1120-1229 ... -->
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
												<option>Regular</option><option>Honors</option><option>AP/IB</option>
											</select>
										</div>
										<div>
											<label class="block text-xs font-bold uppercase text-slate-500 mb-2"
												>Grade Trend</label
											>
											<select
												bind:value={profile.gradeTrend}
												class="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC] font-bold text-slate-900"
											>
												<option>Rising</option><option>Steady</option><option>Dipping</option>
											</select>
										</div>
										<div>
											<label class="block text-xs font-bold uppercase text-slate-500 mb-2"
												>Lowest Grade</label
											>
											<select
												bind:value={profile.lowestGrade}
												class="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC] font-bold text-slate-900"
											>
												<option>A</option><option>A-</option><option>B+</option><option>B</option
												><option>B-</option><option>C+</option><option>C</option><option>C-</option
												><option>D</option><option>F</option>
											</select>
										</div>
										<div class="relative col-span-2">
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
															>{major}</button
														>
													{/each}
												</div>
											{/if}
										</div>
									</div>
								</div>

								<!-- DEMOGRAPHICS CARD -->
								<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
									<h3
										class="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2"
									>
										Demographics
									</h3>
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label class="block text-xs font-bold uppercase text-slate-500 mb-2"
												>State of Residence</label
											>
											<div class="relative">
												<input
													bind:value={profile.state}
													onfocus={() => (showStateSuggestions = true)}
													onblur={() => setTimeout(() => (showStateSuggestions = false), 200)}
													type="text"
													placeholder="e.g. California"
													class="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC] font-bold text-slate-900"
												/>
												{#if showStateSuggestions && filteredStates.length > 0}
													<div
														class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
													>
														{#each filteredStates as st}
															<button
																class="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium text-slate-700 text-sm"
																onclick={() => {
																	profile.state = st;
																	showStateSuggestions = false;
																}}>{st}</button
															>
														{/each}
													</div>
												{/if}
											</div>
										</div>
										<div>
											<label class="block text-xs font-bold uppercase text-slate-500 mb-2"
												>Environment</label
											>
											<select
												bind:value={profile.environment}
												class="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC] font-bold text-slate-900"
											>
												<option>Urban</option><option>Suburban</option><option>Rural</option>
											</select>
										</div>
										<div class="col-span-2">
											<label class="block text-xs font-bold uppercase text-slate-500 mb-2"
												>Living Preference</label
											>
											<div class="flex gap-2">
												{#each ['On Campus', 'Off Campus', 'Commuter'] as opt}
													<button
														class="flex-1 py-2 text-xs font-bold rounded-lg border transition-all {profile.living ===
														opt
															? 'bg-[#0052CC] text-white border-[#0052CC]'
															: 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}"
														onclick={() =>
															(profile.living = opt as 'On Campus' | 'Off Campus' | 'Commuter')}
														>{opt}</button
													>
												{/each}
											</div>
										</div>
									</div>
								</div>

								<!-- ACTIVITIES / HONORS -->
								<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
									<div
										class="flex items-center justify-between mb-4 border-b border-slate-100 pb-2"
									>
										<h3 class="text-sm font-bold text-slate-900 uppercase tracking-widest">
											Activities & Honors
										</h3>
										<div class="flex gap-2">
											<button
												onclick={() => (showImportModal = true)}
												class="text-xs font-bold text-slate-500 hover:text-slate-900">Import</button
											>
											<button onclick={addActivity} class="text-xs font-bold text-[#0052CC]"
												>+ Actv.</button
											>
											<button onclick={addHonor} class="text-xs font-bold text-purple-600"
												>+ Honor</button
											>
										</div>
									</div>

									<div class="space-y-4">
										{#each profile.activities as activity (activity.id)}
											<!-- Minimized Activity rendering for space -->
											<div
												class="flex gap-2 items-start p-3 bg-slate-50 rounded-lg border border-slate-200"
											>
												<div class="flex-1 space-y-2">
													<div class="flex gap-2">
														<input
															bind:value={activity.name}
															placeholder="Name"
															class="w-1/2 px-2 py-1 text-sm border rounded"
														/>
														<input
															bind:value={activity.role}
															placeholder="Role"
															class="w-1/3 px-2 py-1 text-sm border rounded"
														/>
														<input
															bind:value={activity.hoursPerWeek}
															placeholder="Hrs"
															class="w-1/6 px-2 py-1 text-sm border rounded"
														/>
													</div>
													<textarea
														bind:value={activity.description}
														rows="1"
														placeholder="Description"
														class="w-full px-2 py-1 text-sm border rounded resize-none"
													></textarea>
												</div>
												<button onclick={() => removeActivity(activity.id)} class="text-red-400 p-1"
													>&times;</button
												>
											</div>
										{/each}
										{#each profile.honors as honor (honor.id)}
											<div
												class="flex gap-2 items-start p-3 bg-slate-50 rounded-lg border border-slate-200 border-l-purple-400 border-l-4"
											>
												<div class="flex-1 space-y-2">
													<div class="flex gap-2">
														<input
															bind:value={honor.title}
															placeholder="Honor Title"
															class="w-1/2 px-2 py-1 text-sm border rounded"
														/>
														<select
															bind:value={honor.level}
															class="w-1/4 px-2 py-1 text-sm border rounded"
															><option>School</option><option>State</option><option>National</option
															></select
														>
														<select
															bind:value={honor.gradeLevel}
															class="w-1/4 px-2 py-1 text-sm border rounded"
															><option>9</option><option>10</option><option>11</option><option
																>12</option
															></select
														>
													</div>
													<textarea
														bind:value={honor.description}
														rows="1"
														placeholder="Description"
														class="w-full px-2 py-1 text-sm border rounded resize-none"
													></textarea>
												</div>
												<button onclick={() => removeHonor(honor.id)} class="text-red-400 p-1"
													>&times;</button
												>
											</div>
										{/each}
									</div>
								</div>
							</div>

							<div class="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
								<button
									onclick={() => (showProfileEditor = false)}
									class="bg-[#0052CC] hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors shadow-sm"
								>
									Done
								</button>
							</div>
						</div>
					</div>
				{/if}
			{:else if currentView === 'mindmap'}
				<!-- MIND MAP VIEW -->
				<div class="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">
					<div
						class="h-16 px-4 md:px-8 flex items-center justify-between gap-3 bg-white border-b border-slate-200 shadow-sm z-10"
					>
						<h2 class="text-base md:text-xl font-bold text-slate-900 truncate min-w-0">
							<span class="hidden sm:inline">Application </span>Mind Map
						</h2>
						<div class="flex items-center gap-1.5 md:gap-2 shrink-0">
							<button
								onclick={resetMindMap}
								class="px-3 py-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg text-sm font-bold transition-colors"
								title="Reset Board"
							>
								<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/></svg
								>
							</button>
							<div class="h-6 w-px bg-slate-200"></div>

							<!-- AI Generator -->
							<button
								onclick={generateMindMap}
								disabled={isGeneratingMindMap}
								class="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-all flex items-center gap-2 text-sm"
							>
								{#if isGeneratingMindMap}
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
									<span>Brainstorming...</span>
								{:else}
									<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/></svg
									>
									<span><span class="hidden sm:inline">AI </span>Brainstorm</span>
								{/if}
							</button>

							<button
								onclick={analyzeMindMap}
								disabled={isAnalyzingMindMap || mindMapNodes.length === 0}
								class="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center gap-2 text-sm"
							>
								{#if isAnalyzingMindMap}
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
									Analyzing...
								{:else}
									<span class="hidden sm:inline">Analyze&nbsp;</span>Themes
								{/if}
							</button>
						</div>
					</div>

					<div
						class="flex-1 relative overflow-hidden cursor-crosshair"
						role="button"
						tabindex="0"
						onkeydown={(e) => {}}
						onmousemove={handleContainerMouseMove}
						onmouseup={handleContainerMouseUp}
						onmouseleave={handleContainerMouseUp}
						onclick={addMindMapNode}
					>
						<!-- SVG Connections -->
						<svg class="absolute inset-0 w-full h-full pointer-events-none z-0">
							{#each mindMapConnections as conn}
								{@const from = mindMapNodes.find((n) => n.id === conn.from)}
								{@const to = mindMapNodes.find((n) => n.id === conn.to)}
								{#if from && to}
									<line
										x1={from.x}
										y1={from.y}
										x2={to.x}
										y2={to.y}
										stroke="#94a3b8"
										stroke-width="2"
										stroke-dasharray="4"
									/>
								{/if}
							{/each}
						</svg>

						<!-- Nodes -->
						{#each mindMapNodes as node}
							<div
								class="absolute transform -translate-x-1/2 -translate-y-1/2 min-w-[150px] bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-10 node-input group {draggingNodeId ===
								node.id
									? 'z-50 shadow-xl scale-105 cursor-grabbing'
									: 'cursor-grab'}"
								style="left: {node.x}px; top: {node.y}px"
								onclick={(e) => e.stopPropagation()}
								role="button"
								tabindex="0"
								onkeydown={() => {}}
								onmousedown={(e) => handleNodeMouseDown(e, node.id)}
							>
								<button
									class="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-50 hover:bg-rose-600"
									onclick={(e) => {
										e.stopPropagation();
										removeMindMapNode(node.id);
									}}
								>
									<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/></svg
									>
								</button>
								<textarea
									bind:value={node.text}
									placeholder="Idea..."
									class="w-full text-sm font-medium text-slate-800 outline-none resize-none bg-transparent text-center"
									rows="2"
									autofocus
								></textarea>
							</div>
						{/each}

						{#if mindMapNodes.length === 0}
							<div
								class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40"
							>
								<p class="text-xl font-bold text-slate-400">Click anywhere to add ideas</p>
							</div>
						{/if}
					</div>

					{#if mindMapAnalysis}
						<div class="h-48 bg-purple-50 border-t border-purple-100 p-6 overflow-y-auto">
							<h3 class="text-xs font-bold uppercase text-purple-600 mb-2">AI Analysis</h3>
							<p class="text-sm text-slate-800 whitespace-pre-line">{mindMapAnalysis}</p>
						</div>
					{/if}
				</div>
			{:else if currentView === 'editor'}
				<!-- EDITOR VIEW -->
				<!-- Header/Breadcrumbs -->
				<div
					class="h-16 px-4 md:px-8 flex items-center justify-between gap-3 bg-white border-b border-slate-200 shadow-sm z-10"
				>
					<div class="flex items-center gap-2 text-sm min-w-0">
						<span class="text-slate-400 font-medium hidden sm:inline">Editor</span>
						<span class="text-slate-300 hidden sm:inline">/</span>
						<span class="font-bold text-slate-900 truncate">{activeFile.name.replace('.md', '')}</span>
					</div>
					<div class="flex items-center gap-2 md:gap-4 shrink-0">
						<!-- View Toggles -->
						<div class="flex bg-slate-100 p-1 rounded-lg">
							<button
								onclick={() => (activeTab = 'editor')}
								class="px-4 py-1.5 text-xs font-bold rounded-md transition-all {activeTab ===
								'editor'
									? 'bg-white text-slate-900 shadow-sm'
									: 'text-slate-500 hover:text-slate-700'}"
							>
								Write
							</button>
							<button
								onclick={() => (activeTab = 'feedback')}
								class="px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 {activeTab ===
								'feedback'
									? 'bg-white text-slate-900 shadow-sm'
									: 'text-slate-500 hover:text-slate-700'}"
								disabled={!analysisResult}
							>
								AI Feedback
								{#if !analysisResult}
									<svg
										class="w-3 h-3 text-slate-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/></svg
									>
								{/if}
							</button>
						</div>

						<div class="w-px h-6 bg-slate-200 hidden md:block"></div>

						<span
							class="text-xs font-medium hidden md:inline {profile.gpa_uw
								? 'text-emerald-500'
								: 'text-amber-500'}"
						>
							{profile.gpa_uw ? 'Profile Linked' : 'No Profile Linked'}
						</span>
						<span class="text-slate-300 hidden md:inline">|</span>
						<span class="text-xs font-medium text-slate-400 hidden md:inline">
							{activeFile.content.length} chars
						</span>
						<button
							class="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-slate-600"
							title="Download Essay"
							onclick={downloadFile}
						>
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
						</button>
					</div>
				</div>

				<!-- Editor Wrapper -->
				<div class="flex-1 overflow-hidden flex relative">
					<!-- Text Editor -->
					<div class="flex-1 relative flex flex-col">
						<div class="flex-1 relative overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-12">
							{#if analysisResult && activeTab === 'feedback'}
								<!-- MODE: ANNOTATED VIEW (Interactive Highlight) -->
								<div class="relative">
									<!-- Exit Button -->
									<div class="sticky top-0 z-20 flex justify-end mb-4">
										<button
											onclick={() => {
												activeTab = 'editor';
												// Don't clear analysisResult, just switch tab
												// showTerminal = false;
											}}
											class="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
										>
											<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
												/>
											</svg>
											Back to Editor
										</button>
									</div>

									<!-- Content Area -->
									<div
										class="w-full bg-slate-50 text-slate-800 font-serif text-lg leading-loose p-4 md:p-8 rounded-xl border border-slate-100"
										onclick={(e) => {
											// @ts-ignore
											const span = e.target.closest('.highlight-span');
											if (span && span instanceof HTMLElement) {
												e.stopPropagation();
												handleAnnotationClick(span.dataset.idx || '');
											}
										}}
										role="button"
										tabindex="0"
										onkeydown={() => {}}
									>
										<!-- Interactive Highlight Render -->
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										{@html getHighlightedContent(
											activeFile.content,
											analysisResult.essays
												? analysisResult.essays.flatMap((e: any) => e.annotations)
												: [],
											activeAnnotationIndex
										)}
									</div>
								</div>
							{:else}
								<!-- MODE: SINGLE EDITOR -->
								<div class="space-y-4 h-full flex flex-col">
									<div class="relative group flex-1 flex flex-col">
										<textarea
											bind:value={activeFile.content}
											class="w-full flex-1 bg-white text-slate-800 p-4 md:p-8 rounded-2xl border border-slate-200 focus:border-[#0052CC] focus:ring-4 focus:ring-blue-500/10 outline-none font-serif text-base md:text-lg leading-loose shadow-sm transition-all resize-none"
											placeholder="# Prompt\nPaste prompt here...\n\n# Response\nStart writing..."
											spellcheck="false"
										></textarea>
										<div
											class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
										>
											<span
												class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded"
												>Markdown Supported</span
											>
										</div>
									</div>
								</div>
							{/if}
						</div>

						<!-- Bottom Action Bar — h-24 to line up with the sidebar user menu -->
						<div
							class="h-24 bg-white border-t border-slate-200 flex items-center justify-between gap-3 px-4 md:px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50"
						>
							<div class="hidden md:flex items-center gap-6 flex-1">
								<div class="text-xs text-slate-500 font-medium">
									{analysisResult
										? 'Viewing Analysis'
										: profile.gpa_uw
											? 'Profile Active'
											: 'Update Stats in Dashboard for better results'}
								</div>
								<!-- Filler Content -->
								<div class="h-8 w-px bg-slate-200"></div>
								<div class="flex items-center gap-4">
									<div class="flex flex-col">
										<span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider"
											>Word Count</span
										>
										<span class="text-xs font-bold text-slate-700"
											>{activeFile.content.length} chars</span
										>
									</div>
									<div class="flex flex-col">
										<span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider"
											>Reading Time</span
										>
										<span class="text-xs font-bold text-slate-700"
											>~{Math.ceil(activeFile.content.split(' ').length / 200)} min</span
										>
									</div>
								</div>
							</div>

							<div class="flex items-center gap-4 flex-1 md:flex-none justify-end">
								<button
									onclick={runBuild}
									disabled={isBuilding}
									class="flex items-center justify-center gap-3 w-full md:w-auto px-5 md:px-8 py-3.5 md:py-4 bg-[#0052CC] text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 disabled:shadow-none transform active:scale-95 duration-200 text-base md:text-lg"
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
							class="fixed inset-y-0 right-0 w-full max-w-sm md:max-w-none md:static md:w-96 border-l border-slate-200 bg-white flex flex-col shadow-2xl z-30"
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
								{#if activeTab === 'terminal'}
									<div class="space-y-8 py-10">
										<!-- Progress Circle -->
										<div class="relative h-32 w-32 mx-auto">
											<svg class="h-full w-full transform -rotate-90">
												<circle
													class="text-slate-100"
													stroke-width="8"
													stroke="currentColor"
													fill="transparent"
													r="58"
													cx="64"
													cy="64"
												/>
												<circle
													class="text-[#0052CC] transition-all duration-500 ease-out"
													stroke-width="8"
													stroke-dasharray={365}
													stroke-dashoffset={365 - (365 * progressPercent) / 100}
													stroke-linecap="round"
													stroke="currentColor"
													fill="transparent"
													r="58"
													cx="64"
													cy="64"
												/>
											</svg>
											<div class="absolute inset-0 flex items-center justify-center flex-col">
												<span class="text-2xl font-black text-slate-900">{progressPercent}%</span>
											</div>
										</div>

										<div class="text-center space-y-2">
											<h3 class="text-lg font-bold text-slate-900 animate-pulse">{analysisStep}</h3>
											<p class="text-xs font-mono text-slate-400">{estimatedTime}</p>
										</div>

										<div
											class="space-y-1 pl-4 border-l-2 border-indigo-500/30 opacity-80 bg-slate-900 rounded-r-lg p-2 font-mono text-[10px] text-green-400 shadow-inner"
										>
											{#each buildOutput.slice(-4) as line}
												<div class="truncate">
													<span class="text-blue-400 mr-2">➜</span>{line}
												</div>
											{/each}
										</div>
									</div>
								{:else if analysisResult}
									<div class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
										<!-- GLOBAL SCORE SUMMARY (Optional, showing avg of first essay for now or we can avg all) -->
										<!-- We will loop through essays below instead of a single top card if appropriate, 
											 but preserving the top card for the *first* essay is a good default for single essays. 
											 Let's iterate instead. -->

										{#each analysisResult.essays as essay, essayIndex}
											<div
												class="border-b border-slate-100 pb-8 mb-8 last:border-0 last:mb-0 last:pb-0"
											>
												<h3
													class="font-bold text-slate-900 text-sm mb-4 uppercase tracking-widest bg-slate-100 inline-block px-2 py-1 rounded"
												>
													{essay.prompt ? 'Essay ' + (essayIndex + 1) : 'Essay Analysis'}
												</h3>

												<!-- SCORE CARD -->
												<div
													class="p-6 bg-[#F0F7FF] rounded-2xl border border-blue-100 text-center relative overflow-hidden mb-8"
												>
													<div class="relative z-10">
														<div
															class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1"
														>
															Institutional Score
														</div>
														<div class="text-5xl font-mono text-slate-900 tracking-tight">
															{essay.average ?? 'N/A'}<span class="text-xl text-slate-400">/10</span
															>
														</div>
													</div>
												</div>

												<!-- RADAR CHART (Per Essay) -->
												{#if essay.scores}
													<div class="flex justify-center my-8 transform scale-100">
														<RadarChart
															data={Object.entries(essay.scores).map(([k, v]) => ({
																label: k.replace(/([A-Z])/g, ' $1').trim(),
																value: ((v as any).score || 0) * 10
															}))}
															size={220}
															max={100}
															color="text-[#0052CC]"
														/>
													</div>
												{/if}

												<!-- ANNOTATIONS LIST -->
												{#if essay.annotations?.length}
													<div class="space-y-3 mb-8">
														<h3
															class="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2"
														>
															Critique
														</h3>
														{#each essay.annotations as note, i}
															{@const globalIndex =
																analysisResult.essays
																	.slice(0, essayIndex)
																	.reduce(
																		(acc: number, e: any) => acc + (e.annotations?.length || 0),
																		0
																	) + i}
															<div
																id={`annotation-${globalIndex}`}
																class="p-3 rounded-lg bg-yellow-50 border border-yellow-100 text-xs space-y-1 hover:border-yellow-300 transition-all cursor-pointer group scroll-mt-20 {activeAnnotationIndex ===
																globalIndex
																	? 'ring-2 ring-blue-400 bg-blue-50'
																	: ''}"
																onclick={() => handleAnnotationClick(globalIndex.toString())}
																onkeydown={(e) =>
																	e.key === 'Enter' &&
																	handleAnnotationClick(globalIndex.toString())}
																role="button"
																tabindex="0"
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

												<!-- FEEDBACK SECTIONS -->
												<div class="space-y-6 mb-8">
													{#if essay.harsh_feedback}
														<div class="p-5 bg-rose-50 rounded-xl border border-rose-100">
															<h3
																class="text-xs font-bold text-rose-700 uppercase tracking-widest mb-2 flex items-center gap-2"
															>
																<svg
																	class="w-4 h-4"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																	><path
																		stroke-linecap="round"
																		stroke-linejoin="round"
																		stroke-width="2"
																		d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
																	/></svg
																>
																Brutal Feedback
															</h3>
															<p class="text-sm text-slate-700 leading-relaxed">
																{essay.harsh_feedback}
															</p>
														</div>
													{/if}

													{#if essay.honest_feedback}
														<div class="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
															<h3
																class="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2 flex items-center gap-2"
															>
																<svg
																	class="w-4 h-4"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																	><path
																		stroke-linecap="round"
																		stroke-linejoin="round"
																		stroke-width="2"
																		d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
																	/></svg
																>
																Honest Feedback
															</h3>
															<p class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
																{essay.honest_feedback}
															</p>
														</div>
													{/if}
												</div>
											</div>
										{/each}
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
											Run the analysis and the notes show up here.
										</p>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
				{:else if currentView === 'counselor'}
					<AICounselor />
				{:else if currentView === 'schools'}
					<SchoolsExplorer />
				{:else if currentView === 'chanceme'}
					<ChanceMeProfile />
				{:else if currentView === 'settings'}
					<SettingsView />
			{/if}
		</main>
	</div>
{:else}
	<!-- SIGN IN PROMPT -->
	<main class="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center pt-24 pb-24 px-6 relative overflow-hidden">
		<div class="max-w-4xl w-full mx-auto space-y-16 relative z-10">
			<!-- Hero Header -->
			<div class="text-center space-y-6 max-w-3xl mx-auto">
				<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 backdrop-blur-sm mb-4">
					<span class="w-2 h-2 bg-[#0052CC] rounded-full animate-pulse"></span>
					<span class="text-xs font-bold text-[#0052CC] tracking-wide uppercase">Lifetime access · $25 once</span>
				</div>
				<h1 class="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
					PredictAdmit <span class="text-[#0052CC]">Pro</span><br />
					<span class="text-slate-500">Less than a pizza. For good.</span>
				</h1>
				<p class="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed mt-6">
					Your first prediction is free. Full access — the AI reading your <span class="italic">actual</span> profile and calling your decisions across every school, then breaking down why and grading your essays — is <span class="font-semibold text-slate-700">$25 once</span> (or $9.99/mo). A fraction of what a private counselor charges.
				</p>
			</div>

			<!-- Main Content Grid -->
			<div class="grid md:grid-cols-2 gap-12 items-center">
				<!-- Pricing card — good-better-best, one-time -->
				<div class="relative group group/card perspective-1000">
					<div class="relative rounded-[2rem] bg-white p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 space-y-4">
						<p class="text-center text-xs leading-relaxed text-slate-500">
							A private admissions counselor runs <span class="font-semibold text-slate-700">$5,000+</span> a season. Pick your plan:
						</p>

						<!-- Lifetime — the target -->
						<button
							onclick={() => startUpgrade('lifetime')}
							disabled={isProcessing}
							class="relative w-full overflow-hidden rounded-2xl border-2 border-[#0052CC] bg-[#0052CC] px-6 py-5 text-left text-white shadow-xl transition hover:bg-[#0047b3] hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
						>
							<span class="absolute right-4 top-4 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-white/30">Best value</span>
							<span class="block text-2xl font-black">{isProcessing ? 'Taking you to checkout…' : 'Lifetime — $25 once'}</span>
							<span class="mt-1 block max-w-[18rem] text-sm leading-relaxed text-blue-100">All 39 schools, unlimited re-runs, every deep-dive, and the essay workshop — forever, no subscription.</span>
						</button>

						<!-- Monthly -->
						<button
							onclick={() => startUpgrade('monthly')}
							disabled={isProcessing}
							class="w-full rounded-2xl border border-slate-200 px-6 py-4 text-left transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
						>
							<span class="flex items-baseline justify-between gap-2">
								<span class="text-base font-bold text-slate-900">Monthly</span>
								<span class="text-base font-bold text-slate-900">$9.99<span class="text-sm font-medium text-slate-400">/mo</span></span>
							</span>
							<span class="mt-0.5 block text-sm leading-relaxed text-slate-500">Full access while you're applying. Cancel anytime. (2½ months = Lifetime.)</span>
						</button>

						<!-- Single school — the floor (needs a chosen school, so start free in /ai) -->
						<a
							href="/ai"
							class="block w-full rounded-2xl border border-slate-200 px-6 py-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
						>
							<span class="flex items-baseline justify-between gap-2">
								<span class="text-base font-bold text-slate-900">Just one school</span>
								<span class="text-base font-bold text-slate-900">$4.99</span>
							</span>
							<span class="mt-0.5 block text-sm leading-relaxed text-slate-500">Run your free prediction first, then unlock the deep-dive for any one school.</span>
						</a>

						<p class="text-center text-xs text-slate-400">
							{googleSignedIn
								? 'One-time payment · instant access · secure checkout by Stripe'
								: 'Sign in with Google at checkout — then it’s yours.'}
						</p>
					</div>
				</div>

				<!-- Features List -->
				<div class="space-y-8">
					<h3 class="text-2xl font-bold text-slate-900">What Pro actually gives you</h3>
					<p class="-mt-4 text-slate-500">Two things: <span class="font-semibold text-slate-700">unlimited simulations</span> to see exactly where you stand, and <span class="font-semibold text-slate-700">the workshop</span> to actually fix it.</p>
					<div class="grid gap-6">
						<!-- Pillar 1: unlimited AI simulations (the headline benefit) -->
						<div class="flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 -m-4">
							<div class="w-10 h-10 rounded-xl bg-[#0052CC] flex items-center justify-center shrink-0">
								<svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
							</div>
							<div>
								<p class="font-bold text-slate-900">Unlimited AI decision simulations</p>
								<p class="text-sm text-slate-500">Run your real application through the AI and get your predicted decision — accept, deny, or waitlist — at all 39 top schools. Then change an essay, an activity, a score, and <span class="font-semibold text-slate-700">re-run it as many times as you want</span> to watch your odds move. Running the simulation is free; Pro unlocks every decision to read plus the deep-dive on each — no cap.</p>
							</div>
						</div>

						<!-- Pillar 2: the workshop -->
						<p class="text-xs font-bold uppercase tracking-wider text-slate-400 pt-1">The workshop — where you fix it</p>
						<!-- Feature item -->
						<div class="flex items-start gap-4">
							<div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
								<svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" /></svg>
							</div>
							<div>
								<p class="font-bold text-slate-900">Narrative Mind Map</p>
								<p class="text-sm text-slate-500">Dump the experiences, jobs, and obsessions that make you you onto a board, and the AI finds the thread that ties them into one application story.</p>
							</div>
						</div>
						
						<div class="flex items-start gap-4">
							<div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
								<svg class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
							</div>
							<div>
								<p class="font-bold text-slate-900">Essay editor with AI feedback</p>
								<p class="text-sm text-slate-500">Draft every supplement in one place, then hand it to the AI for the kind of notes an admissions reader would give. It marks up your lines and tells you what's weak. You write every word — it never writes for you.</p>
							</div>
						</div>

						<div class="flex items-start gap-4">
							<div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
								<svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
							</div>
							<div>
								<p class="font-bold text-slate-900">Per-school strategy notes</p>
								<p class="text-sm text-slate-500">What each of the top 50+ schools actually weighs, and how to angle your application for that specific reader instead of writing one generic app for all of them.</p>
							</div>
						</div>

						<!-- Pro tier -->
						<div class="flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 -m-4">
							<div class="w-10 h-10 rounded-xl bg-[#0052CC] flex items-center justify-center shrink-0">
								<svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
							</div>
							<div>
								<div class="flex items-center gap-2">
									<p class="font-bold text-slate-900">All of it, no limits, with Pro</p>
									<span class="text-[10px] uppercase font-bold tracking-wide text-[#0052CC] bg-white border border-blue-100 rounded-full px-2 py-0.5">$25 lifetime</span>
								</div>
								<p class="text-sm text-slate-500">Run the decision simulation as often as you like, read the full deep-dive on every school, grade essays until they're right. Your first prediction is free; $25 once (or $9.99/mo) unlocks the rest.</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Vision Section -->
			<div class="pt-16 border-t border-slate-200">
				<div class="bg-blue-900 rounded-[2.5rem] p-12 text-center text-white space-y-6">
					<h3 class="text-3xl font-bold text-white">The consultant's read, without the consultant's bill.</h3>
					<p class="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
						Private counselors charge thousands a season for the same judgment call: is this kid getting in, and what should they fix. Lifetime access is $25, once. Every simulation, every deep dive, every essay pass, forever. Your first prediction is free, so you only pay once it's already told you something you didn't know.
					</p>
				</div>
			</div>
		</div>
	</main>
{/if}

<!-- Pre-checkout benefit carousel (Monthly/Lifetime upgrade path) -->
<UpgradeCarousel
	bind:open={showUpgradeCarousel}
	plan={carouselPlan}
	loading={isProcessing}
	oncontinue={() => handleCheckout(carouselPlan)}
/>

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
