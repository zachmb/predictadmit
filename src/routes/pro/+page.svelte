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

	// --- RUNES STATE ---
	let { data } = $props();

	// State Autofill logic
	let showStateSuggestions = $state(false);
	let filteredStates = $derived(
		states.filter((s) => s.toLowerCase().includes((profile.state || '').toLowerCase()))
	);

	// Mind Map AI State
	let isGeneratingMindMap = $state(false);
	let isDraftingEssay = $state(false);
	let selectedDraftSchool = $state('');

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

	async function draftEssayFromMindMap() {
		if (isDraftingEssay || !selectedDraftSchool) return;
		isDraftingEssay = true;

		// Find prompt if school selected
		let prompt = 'Personal Statement';
		if (selectedDraftSchool !== 'General') {
			// quick lookup or pass the slug to backend
		}

		try {
			const res = await fetch('/api/ai/draft-essay', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					profile,
					mindMap: { nodes: mindMapNodes, connections: mindMapConnections },
					targetSchool: selectedDraftSchool
				})
			});
			const data = await res.json();

			if (data.content) {
				const fileName = `Draft_${selectedDraftSchool}_${Date.now()}.md`;
				const newFile = {
					id: Math.random().toString(36).substring(7),
					name: fileName,
					content: data.content,
					language: 'markdown' as const,
					isOpen: true,
					isModified: false,
					school: selectedDraftSchool // Added school property
				};
				// @ts-ignore
				files = [...files, newFile];
				// @ts-ignore
				activeFile = newFile;
				currentView = 'editor';
			}
		} catch (e) {
			console.error(e);
		} finally {
			isDraftingEssay = false;
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

	// Sales/Pricing State
	let pricingMode = $state<'lifetime' | 'monthly'>('monthly');
	// Ticker Animation
	const displayedPrice = tweened(5, {
		duration: 800,
		easing: cubicOut
	});

	$effect(() => {
		if (pricingMode === 'monthly') {
			displayedPrice.set(5);
		} else {
			displayedPrice.set(9);
		}
	});

	let promoCode = $state('');
	let promoError = $state('');
	let isProcessing = $state(false);

	// VIEW STATE
	let currentView = $state<'dashboard' | 'editor' | 'mindmap' | 'universities'>('dashboard');

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

		mindMapAnalysis = `**Core Theme Detected: ${randomTheme}**\n\nBased on your notes, your application narrative circles around the idea of ${randomTheme.toLowerCase()}. Consider focusing your personal statement on how this trait has evolved over time.`;
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
	};

	let profile = $state({
		gpa_uw: '',
		gpa_w: '',
		testScore: '',
		ecs: '', // Legacy string field, kept for compatibility if needed or migrated
		activities: [] as Activity[],
		rigor: 'Regular' as 'Regular' | 'Honors' | 'AP/IB',
		major: '',
		state: '',
		environment: 'Urban' as 'Urban' | 'Suburban' | 'Rural',
		living: 'On Campus' as 'On Campus' | 'Off Campus' | 'Commuter'
	});

	function addActivity() {
		profile.activities = [
			...profile.activities,
			{
				id: Math.random().toString(36).substring(2, 9),
				name: '',
				role: '',
				hoursPerWeek: ''
			}
		];
	}

	function removeActivity(id: string) {
		profile.activities = profile.activities.filter((a) => a.id !== id);
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
				hoursPerWeek: parts[2]?.trim() || '2' // Default assumption
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
		// Let's say 4.0 = 75 pts base. +5 for Rigor.
		let gpaScore = (effectiveGpa / 4.0) * 75;

		// Rigor Bonus
		if (profile.rigor === 'AP/IB') gpaScore += 5;
		else if (profile.rigor === 'Honors') gpaScore += 2;

		const gpaComponent = Math.min(80, gpaScore); // Cap at 80

		let total = testComponent + gpaComponent;

		return Math.max(0, Math.round(total * 1.5)); // Scale to typical 240 index (80+80=160 -> *1.5 = 240)
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
	let activeTab = $state<'terminal' | 'output'>('output');

	// New Progress State
	let analysisStep = $state('');
	let estimatedTime = $state('');
	let progressPercent = $state(0);
	let activeAnnotationIndex = $state<number | null>(null);

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
							isModified: saved.isModified
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
		if (promoCode.trim().toLowerCase() === 'strawberrylemonade') {
			userProfile.update((u) => ({ ...u, isPro: true }));
			alert('Promo code applied! Access Granted.');
			// Refreshes the view automatically due to reactivity
		} else {
			promoError = 'Invalid promo code';
			setTimeout(() => (promoError = ''), 3000);
		}
	}

	async function handleCheckout(plan: 'lifetime' | 'monthly') {
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
		estimatedTime = 'Calculcating...';

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

			analysisStep = 'Generating Feedback';
			estimatedTime = 'Almost done...';
			progressPercent = 90;
			await new Promise((r) => setTimeout(r, 800)); // Final polish wait

			analysisResult = data;
			buildOutput = [...buildOutput, '> Build Successful.', '> Analysis ready.'];
			progressPercent = 100;

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
			analysisStep = 'Error';
			estimatedTime = '';
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

			// Interactive span with data-idx for event delegation
			html = html.replace(
				regex,
				`<span class="bg-yellow-100 border-b-2 border-yellow-300 cursor-pointer hover:bg-yellow-200 transition-colors relative group/highlight highlight-span" data-idx="${idx}" title="${ann.comment.replace(/"/g, '&quot;')}">$1</span>`
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

				<!-- MIND MAP TAB -->
				<button
					onclick={() => (currentView = 'mindmap')}
					class="w-full text-left px-6 py-3 text-sm font-bold flex items-center gap-3 transition-all border-l-4 {currentView ===
					'mindmap'
						? 'bg-purple-50 text-purple-600 border-purple-600'
						: 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-50'}"
				>
					<svg class="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
						/>
					</svg>
					<span>Mind Map / Inspo</span>
				</button>

				<!-- UNIVERSITIES TAB -->
				<button
					onclick={() => (currentView = 'universities')}
					class="w-full text-left px-6 py-3 text-sm font-bold flex items-center gap-3 transition-all border-l-4 {currentView ===
					'universities'
						? 'bg-emerald-50 text-emerald-600 border-emerald-600'
						: 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-50'}"
				>
					<svg class="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path d="M12 14l9-5-9-5-9 5 9 5z" />
						<path
							d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
						/>
					</svg>
					<span>Universities</span>
				</button>

				<div
					class="mt-4 px-6 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between group"
				>
					<span>Essays</span>
					<button
						onclick={addNewSupplemental}
						class="text-slate-300 hover:text-[#0052CC] p-1 rounded hover:bg-blue-50 transition-colors"
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
								Paste your resume activities here. One activity per line. <br />Format:
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
						<!-- ACADEMIC & DEMOGRAPHICS GRID -->
						<div class="grid md:grid-cols-3 gap-6">
							<!-- INPUTS COLUMN -->
							<div class="md:col-span-2 space-y-6">
								<!-- ACADEMIC CARD -->
								<div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
									<h3
										class="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2"
									>
										Academic Profile
									</h3>
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
														>
															{major}
														</button>
													{/each}
												</div>
											{/if}
										</div>
									</div>
								</div>

								<!-- DEMOGRAPHICS CARD -->
								<div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
									<h3
										class="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2"
									>
										Demographics & Preferences
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
																}}
															>
																{st}
															</button>
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
												<option>Urban</option>
												<option>Suburban</option>
												<option>Rural</option>
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
													>
														{opt}
													</button>
												{/each}
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- ACADEMIC INDEX CARD (Sticky) -->
							<div class="md:col-span-1">
								<div
									class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between sticky top-8"
								>
									<div>
										<div class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
											Academic Index
										</div>
										<div class="flex items-baseline gap-2">
											<div class="text-7xl font-black tracking-tighter text-slate-900 leading-none">
												{academicIndex}
											</div>
											<div class="text-xl text-slate-400 font-medium mb-2">/240</div>
										</div>
										<p class="text-[10px] text-slate-400 mt-3 leading-relaxed max-w-[200px]">
											Calculated using the Ivy League formula (2/3 Test + 1/3 GPA).
										</p>
									</div>

									<div class="mt-8 space-y-4">
										<div
											class="flex justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-2"
										>
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
										<div class="space-y-3">
											<div class="flex items-center gap-3">
												<span
													class="text-[10px] w-12 text-slate-400 font-bold uppercase tracking-wide"
													>Acad</span
												>
												<div
													class="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100"
												>
													<div
														class="h-full bg-slate-800 rounded-full transition-all duration-500"
														style="width: {holisticMetrics.academics * 10}%"
													></div>
												</div>
											</div>
											<div class="flex items-center gap-3">
												<span
													class="text-[10px] w-12 text-slate-400 font-bold uppercase tracking-wide"
													>Extrac</span
												>
												<div
													class="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100"
												>
													<div
														class="h-full bg-slate-800 rounded-full transition-all duration-500"
														style="width: {holisticMetrics.ecs * 10}%"
													></div>
												</div>
											</div>
											<div class="flex items-center gap-2">
												<span
													class="text-[10px] w-12 text-slate-400 font-bold uppercase tracking-wide"
													>Pers</span
												>
												<div
													class="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100"
												>
													<div class="h-full bg-slate-300 rounded-full" style="width: 50%"></div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- ACTIVITIES LIST -->
						<div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
							<div class="flex items-center justify-between mb-6 border-b border-slate-100 pb-2">
								<h3 class="text-sm font-bold text-slate-900 uppercase tracking-widest">
									Activities & Honors
								</h3>
								<div class="flex gap-2">
									<button
										onclick={() => (showImportModal = true)}
										class="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
									>
										Import
									</button>
									<button
										onclick={addActivity}
										class="text-xs font-bold text-[#0052CC] hover:text-blue-700 flex items-center gap-1"
									>
										<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 4v16m8-8H4"
											/></svg
										>
										Add Activity
									</button>
								</div>
							</div>

							{#if profile.activities.length === 0}
								<div
									class="text-center py-8 text-slate-400 text-sm font-medium border-2 border-dashed border-slate-100 rounded-xl"
								>
									No activities added yet. Click "Add Activity" to start building your profile.
								</div>
							{:else}
								<div class="space-y-4">
									{#each profile.activities as activity (activity.id)}
										<div
											class="flex gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-100 group animate-in fade-in slide-in-from-bottom-2"
										>
											<div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
												<div class="md:col-span-1">
													<label class="block text-[10px] font-bold uppercase text-slate-400 mb-1"
														>Activity Name</label
													>
													<input
														bind:value={activity.name}
														placeholder="e.g. Debate Club"
														class="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0052CC]"
													/>
												</div>
												<div class="md:col-span-1">
													<label class="block text-[10px] font-bold uppercase text-slate-400 mb-1"
														>Role / Position</label
													>
													<input
														bind:value={activity.role}
														placeholder="e.g. Captain"
														class="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0052CC]"
													/>
												</div>
												<div class="md:col-span-1 relative">
													<label class="block text-[10px] font-bold uppercase text-slate-400 mb-1"
														>Hours/Week</label
													>
													<input
														bind:value={activity.hoursPerWeek}
														placeholder="e.g. 5"
														class="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0052CC]"
													/>
												</div>
											</div>
											<button
												onclick={() => removeActivity(activity.id)}
												class="text-slate-300 hover:text-red-500 p-2 transition-colors mt-4"
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
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>
			{:else if currentView === 'mindmap'}
				<!-- MIND MAP VIEW -->
				<div class="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">
					<div
						class="h-16 px-8 flex items-center justify-between bg-white border-b border-slate-200 shadow-sm z-10"
					>
						<h2 class="text-xl font-bold text-slate-900">Application Mind Map</h2>
						<div class="flex items-center gap-2">
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
									<span>AI Brainstorm</span>
								{/if}
							</button>

							<!-- Essay Drafter -->
							<div
								class="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200"
							>
								<select
									bind:value={selectedDraftSchool}
									class="bg-transparent text-sm font-bold text-slate-600 border-none focus:ring-0 py-1 pl-2 pr-8 w-32"
								>
									<option value="" disabled selected>Draft Essay...</option>
									<option value="General">General Personal Statement</option>
									{#each Object.values(schoolConfigs) as s}
										<option value={s.slug}>{s.schoolName}</option>
									{/each}
								</select>
								<button
									onclick={draftEssayFromMindMap}
									disabled={isDraftingEssay || !selectedDraftSchool}
									class="p-1.5 bg-slate-900 text-white rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors"
								>
									{#if isDraftingEssay}
										<svg class="animate-spin h-3 w-3" viewBox="0 0 24 24"
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
									{:else}
										<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
											/></svg
										>
									{/if}
								</button>
							</div>

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
									Analyze Themes
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
			{:else if currentView === 'universities'}
				<!-- UNIVERSITIES VIEW -->
				<div class="flex-1 overflow-y-auto p-8 md:p-12 bg-slate-50 relative">
					<div class="max-w-6xl mx-auto space-y-8">
						<div class="flex items-end justify-between">
							<div>
								<h2 class="text-3xl font-black text-slate-900 tracking-tight">
									University Strategy
								</h2>
								<div class="text-sm text-slate-500 font-medium mt-1">
									Craft your narrative and track your progress for top schools.
								</div>
							</div>
						</div>

						<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{#each Object.values(schoolConfigs) as config}
								{@const odds = calculateAdmissionsOdds(config.slug)}
								<div
									class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all group relative flex flex-col h-full"
								>
									<!-- Header -->
									<div class="flex items-start justify-between mb-4">
										<div
											class="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold bg-slate-50 text-slate-700 border border-slate-100 shadow-sm"
										>
											{config.schoolName[0]}
										</div>
										<div class="flex flex-col items-end">
											<span class="text-xs font-bold text-slate-400 uppercase tracking-widest"
												>Chance</span
											>
											<span
												class="text-xl font-black {odds < 15
													? 'text-rose-500'
													: odds < 40
														? 'text-amber-500'
														: 'text-emerald-500'}"
											>
												{odds}%
											</span>
										</div>
									</div>

									<!-- Content -->
									<div class="space-y-4 flex-1 flex flex-col">
										<div>
											<h3 class="font-bold text-slate-900 text-lg leading-tight">
												{config.schoolName}
											</h3>
											<p class="text-xs text-slate-400 mt-1 font-medium">
												Acceptance Rate: {(config.baseRate * 100).toFixed(1)}%
											</p>
										</div>

										<!-- Strategy Input -->
										<div
											class="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100 focus-within:border-blue-200 focus-within:ring-2 focus-within:ring-blue-50 transition-all"
										>
											<label class="block text-[10px] font-bold text-slate-400 uppercase mb-2"
												>My Application Strategy</label
											>
											<textarea
												bind:value={schoolStrategies[config.slug]}
												placeholder="e.g. Focus on cultural identity essay..."
												class="w-full bg-transparent border-none text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none focus:ring-0 p-0 h-24"
											></textarea>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- DEEP DIVE MODAL -->
					{#if selectedSchoolForDeepDive}
						{@const deepConf = schoolConfigs[selectedSchoolForDeepDive]}
						{@const deepOdds = calculateAdmissionsOdds(selectedSchoolForDeepDive)}
						<div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
							<!-- Backdrop -->
							<div
								class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
								onclick={() => (selectedSchoolForDeepDive = null)}
								role="button"
								tabindex="0"
								onkeydown={(e) => e.key === 'Escape' && (selectedSchoolForDeepDive = null)}
							></div>

							<!-- Modal -->
							<div
								class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200"
							>
								<!-- Modal Header -->
								<div
									class="p-8 border-b border-slate-100 flex items-start justify-between bg-slate-50/50"
								>
									<div class="flex items-center gap-4">
										<div
											class="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-3xl font-black text-slate-800"
										>
											{deepConf.schoolName[0]}
										</div>
										<div>
											<h3 class="text-2xl font-black text-slate-900">{deepConf.schoolName}</h3>
											<div class="flex items-center gap-2 mt-1">
												<span
													class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-200 text-slate-600"
													>Difficulty: {deepConf.difficulty}/10</span
												>
												<span
													class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-200 text-slate-600"
													>Rate: {(deepConf.baseRate * 100).toFixed(1)}%</span
												>
											</div>
										</div>
									</div>
									<button
										onclick={() => (selectedSchoolForDeepDive = null)}
										class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-300 transition-colors"
									>
										<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"
											/></svg
										>
									</button>
								</div>

								<!-- Modal Content -->
								<div class="p-8 space-y-8">
									<!-- AI Prediction Section -->
									<div
										class="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex items-center gap-6"
									>
										<div class="flex-1">
											<div class="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">
												Your Predicted Odds
											</div>
											<div class="text-4xl font-black text-indigo-900">{deepOdds}%</div>
											<p class="text-sm text-indigo-800/70 mt-2 font-medium">
												Based on your Academic Index ({academicIndex}) and holistic profile rating.
											</p>
										</div>
										<div class="w-32 h-32 relative hidden md:block">
											<!-- Simple visual circle -->
											<svg class="w-full h-full transform -rotate-90">
												<circle
													cx="64"
													cy="64"
													r="56"
													fill="none"
													stroke="#E0E7FF"
													stroke-width="12"
												/>
												<circle
													cx="64"
													cy="64"
													r="56"
													fill="none"
													stroke="#4F46E5"
													stroke-width="12"
													stroke-dasharray="351"
													stroke-dashoffset={351 - (351 * deepOdds) / 100}
													stroke-linecap="round"
												/>
											</svg>
											<div
												class="absolute inset-0 flex items-center justify-center text-indigo-600 font-bold text-lg"
											>
												{deepOdds}%
											</div>
										</div>
									</div>

									<!-- Recommendations -->
									<div class="space-y-4">
										<h4 class="text-lg font-bold text-slate-900 border-l-4 border-slate-900 pl-3">
											Strategy & Recommendations
										</h4>
										<div class="grid gap-4">
											<div class="p-4 rounded-xl border border-slate-200 bg-slate-50">
												<div class="font-bold text-slate-900 text-sm mb-1">
													Target AI Score: {130 + deepConf.difficulty * 10}
												</div>
												<p class="text-sm text-slate-500">
													{academicIndex >= 130 + deepConf.difficulty * 10
														? 'Your stats are competitive for this school. Focus on essays.'
														: 'Your stats are slightly below the typical range. Exceptional essays and ECs are required.'}
												</p>
											</div>
											<div class="p-4 rounded-xl border border-slate-200 bg-slate-50">
												<div class="font-bold text-slate-900 text-sm mb-1">Essay Strategy</div>
												<p class="text-sm text-slate-500">
													{deepConf.schoolName} values intellectual vitality and community impact. Ensure
													your essays highlight specific contributions.
												</p>
											</div>
										</div>
									</div>

									<!-- Action -->
									<div class="flex justify-end pt-4">
										<button
											class="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"
											onclick={() => {
												selectedSchoolForDeepDive = null;
												// Ideally verify file exists or create it
												// For now, assuming user will handle file creation via sidebar
												currentView = 'editor';
											}}
										>
											Start Drafting Essays
											<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M17 8l4 4m0 0l-4 4m4-4H3"
												/></svg
											>
										</button>
									</div>
								</div>
							</div>
						</div>
					{/if}
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
				<div class="flex-1 overflow-hidden flex relative mb-[12vh]">
					<!-- Text Editor -->
					<div class="flex-1 relative flex flex-col">
						<div class="flex-1 relative overflow-y-auto custom-scrollbar p-8 space-y-12">
							{#if analysisResult && activeTab === 'output'}
								<!-- MODE: ANNOTATED VIEW (Interactive Highlight) -->
								<div class="relative">
									<!-- Exit Button -->
									<div class="sticky top-0 z-20 flex justify-end mb-4">
										<button
											onclick={() => {
												activeTab = 'terminal';
												analysisResult = null;
												showTerminal = false;
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
										class="w-full bg-slate-50 text-slate-800 font-serif text-lg leading-loose p-8 rounded-xl border border-slate-100"
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
												: []
										)}
									</div>
								</div>
							{:else}
								<!-- MODE: SINGLE EDITOR -->
								<div class="space-y-4 h-full flex flex-col">
									<div class="relative group flex-1 flex flex-col">
										<textarea
											bind:value={activeFile.content}
											class="w-full flex-1 bg-white text-slate-800 p-8 rounded-2xl border border-slate-200 focus:border-[#0052CC] focus:ring-4 focus:ring-blue-500/10 outline-none font-serif text-lg leading-loose shadow-sm transition-all resize-none"
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

						<!-- Bottom Action Bar -->
						<div
							class="h-24 bg-white border-t border-slate-200 flex items-center justify-between px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 pb-2"
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
									onclick={runBuild}
									disabled={isBuilding}
									class="flex items-center gap-3 px-8 py-4 bg-[#0052CC] text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 disabled:shadow-none transform active:scale-95 duration-200 text-lg"
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
														<div class="text-5xl font-black text-[#0052CC] tracking-tighter">
															{essay.average ?? 'N/A'}<span class="text-xl text-blue-300">/10</span>
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
															size={280}
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

												<!-- HARSH FEEDBACK -->
												{#if essay.harsh_feedback}
													<div class="space-y-3">
														<h3
															class="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 text-rose-600"
														>
															Brutal Honest Feedback
														</h3>
														<div
															class="p-4 bg-rose-50 rounded-xl border border-rose-100 text-sm text-rose-900 leading-relaxed italic"
														>
															{essay.harsh_feedback}
														</div>
													</div>
												{/if}
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
						<div
							class="relative bg-slate-200/50 p-1.5 rounded-full flex items-center shadow-inner w-64 h-12 cursor-pointer"
							onclick={() => (pricingMode = pricingMode === 'monthly' ? 'lifetime' : 'monthly')}
							onkeydown={(e) =>
								e.key === 'Enter' &&
								(pricingMode = pricingMode === 'monthly' ? 'lifetime' : 'monthly')}
							role="button"
							tabindex="0"
						>
							<!-- Sliding Background -->
							<div
								class="absolute top-1.5 bottom-1.5 bg-white rounded-full shadow-lg border border-slate-100 transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1) w-[calc(50%-6px)]"
								style="left: 6px; transform: translateX({pricingMode === 'monthly'
									? '100%'
									: '0%'})"
							></div>

							<button
								onclick={(e) => {
									e.stopPropagation();
									pricingMode = 'lifetime';
								}}
								class="relative z-10 w-1/2 text-sm font-bold transition-colors duration-300 {pricingMode ===
								'lifetime'
									? 'text-slate-900'
									: 'text-slate-500'}"
							>
								Cycle Pass
							</button>
							<button
								onclick={(e) => {
									e.stopPropagation();
									pricingMode = 'monthly';
								}}
								class="relative z-10 w-1/2 text-sm font-bold transition-colors duration-300 {pricingMode ===
								'monthly'
									? 'text-slate-900'
									: 'text-slate-500'}"
							>
								Monthly
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
							<h3 class="text-2xl font-bold text-slate-900">Free Tier</h3>
							<div class="flex items-baseline gap-1 mt-2">
								<span class="text-4xl font-black text-slate-900">$0</span>
								<span class="text-sm text-slate-500 font-medium">/ forever</span>
							</div>
							<p class="text-sm text-slate-400 mt-3 leading-relaxed">
								Perfect for fun simulations and testing your application.
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
						class="bg-[#0052CC] rounded-3xl p-1 shadow-2xl relative overflow-hidden flex flex-col"
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
											PredictAdmit <span class="text-[#0052CC]">Pro</span>
										</h3>
										<div class="flex items-baseline gap-1 mt-2 h-10">
											<div class="flex items-baseline gap-1">
												<span class="text-4xl font-black text-[#0052CC]">
													${Math.round($displayedPrice)}
												</span>
												<span class="text-sm text-slate-500 font-medium">
													{pricingMode === 'monthly' ? '/ month' : '/ one-time'}
												</span>
											</div>
										</div>
									</div>
									{#if pricingMode === 'lifetime'}
										<div
											class="bg-blue-100 text-[#0052CC] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
										>
											Most Popular
										</div>
									{/if}
								</div>
								<p class="text-sm text-slate-400 mt-3 leading-relaxed">
									{pricingMode === 'monthly'
										? 'Cancel anytime. Flexible access.'
										: pricingMode === 'lifetime'
											? 'One-time payment. Forever access.'
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
											: pricingMode === 'lifetime'
												? 'Get Lifetime Access'
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
