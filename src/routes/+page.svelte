<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	// Icons
	import {
		Play,
		Check,
		FileCheck,
		Zap,
		Layers,
		Cpu,
		Globe,
		Crosshair,
		FileText,
		Smartphone
	} from 'lucide-svelte';

	// Config
	// (Retaining logic imports to keep build clean if needed later, but they are unused in this layout)
	import { schoolConfigs } from '$lib/config/schools';

	// Components
	import CoralDrifters from '$lib/components/glass/CoralDrifters.svelte';
	import DeepfakeChart from '$lib/components/glass/DeepfakeChart.svelte';
	import BentoCard from '$lib/components/glass/BentoCard.svelte';
	// DeepfakeChart and BentoCard are now used.

	let scrollY = 0;
	let activeTab = 'conversations';

	const tabs = [
		{ id: 'conversations', label: 'Conversations', icon: Smartphone },
		{ id: 'documents', label: 'Documents', icon: FileCheck },
		{ id: 'media', label: 'Images & Video', icon: Layers },
		{ id: 'social', label: 'Social Media', icon: Globe }
	];

	function setActiveTab(id: string) {
		activeTab = id;
	}

	// Simple scroll-based reveal helper
	function reveal(node: HTMLElement) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						node.classList.add('visible');
						observer.unobserve(node);
					}
				});
			},
			{ threshold: 0.15 }
		);

		observer.observe(node);
		return {
			destroy() {
				observer.disconnect();
			}
		};
	}
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>GlassCoral - Clarity Starts Here</title>
	<meta name="description" content="AI-powered fact-checking and media verification." />
</svelte:head>

<CoralDrifters />

<div class="relative z-10 w-full min-h-screen overflow-hidden">
	<!-- SECTION 1: THE HERO -->
	<section class="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
		<div class="max-w-4xl space-y-8" in:fly={{ y: 30, duration: 1000, easing: cubicOut }}>
			<h1 class="text-7xl md:text-8xl font-medium tracking-tight text-white leading-[1.1]">
				<span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50"
					>Clarity</span
				> starts here.
			</h1>
			<p class="text-xl text-white/60 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
				AI-powered fact-checking and media verification from live meetings to articles, images, and
				videos.
			</p>

			<div class="flex items-center justify-center gap-6 pt-4">
				<button
					class="px-8 py-4 rounded-full bg-living-coral text-white font-semibold shadow-[0_0_30px_-5px_rgba(255,140,105,0.4)] hover:scale-105 active:scale-95 transition-transform duration-300"
				>
					Get Early Access
				</button>
				<button
					class="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold backdrop-blur-md flex items-center gap-2 hover:bg-white/10 transition-colors"
				>
					Watch Demo <Play size={16} />
				</button>
			</div>
		</div>
	</section>

	<!-- SECTION 2: INTERACTIVE TABS ("See through the Glass") -->
	<section class="py-32 px-6 max-w-6xl mx-auto" use:reveal>
		<div
			class="text-center mb-16 space-y-4 opacity-0 transition-all duration-1000 translate-y-8 reveal-target"
		>
			<h2 class="text-4xl md:text-5xl font-medium text-white tracking-tight">
				See through the Glass
			</h2>
			<p class="text-lg text-white/50 max-w-2xl mx-auto">
				Glass works in the background, scanning the world around you — text, images, audio, and
				video — to separate fact from fiction in real time.
			</p>
		</div>

		<!-- Horizontal Tab Scroll -->
		<div
			class="flex justify-center gap-4 mb-12 flex-wrap opacity-0 transition-all duration-1000 delay-200 translate-y-8 reveal-target"
		>
			{#each tabs as tab}
				<button
					on:click={() => setActiveTab(tab.id)}
					class="flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300
                           {activeTab === tab.id
						? 'bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
						: 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.05] hover:text-white/80'}"
				>
					<svelte:component this={tab.icon} size={16} />
					<span class="font-medium text-sm">{tab.label}</span>
				</button>
			{/each}
		</div>

		<!-- Central Glass Pane Mockup -->
		<div
			class="relative w-full max-w-4xl mx-auto h-[500px] bg-black/40 rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl opacity-0 transition-all duration-1000 delay-300 translate-y-8 reveal-target"
		>
			<div class="absolute inset-0 flex items-center justify-center text-white/20 font-mono">
				<!-- Placeholder for dynamic image based on tab -->
				Scanning: {activeTab.toUpperCase()}...
			</div>

			<!-- Scanning Line Animation -->
			<div
				class="absolute top-0 left-0 w-full h-[2px] bg-living-coral shadow-[0_0_20px_#FF8C69] animate-scan"
			></div>
		</div>
	</section>

	<!-- SECTION 3: DATA STORY (Holographic Chart) -->
	<section class="py-32 px-6 max-w-5xl mx-auto" use:reveal>
		<div class="grid md:grid-cols-2 gap-16 items-center">
			<div class="space-y-6 opacity-0 transition-all duration-1000 translate-y-8 reveal-target">
				<h2 class="text-4xl font-medium text-white tracking-tight">
					The truth shouldn't be blurry.
				</h2>
				<p class="text-white/60 text-lg leading-relaxed">
					Every day, fake news, AI-generated content, and distorted information flood our feeds.
					It's harder than ever to know what's real and what's not. Glass gives you clarity.
				</p>
			</div>
			<div class="opacity-0 transition-all duration-1000 delay-200 translate-y-8 reveal-target">
				<DeepfakeChart />
			</div>
		</div>
	</section>

	<!-- SECTION 4: BENTO GRID ("Why Glass") -->
	<section class="py-32 px-6 max-w-6xl mx-auto" use:reveal>
		<div
			class="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0 transition-all duration-1000 translate-y-8 reveal-target"
		>
			<BentoCard
				title="Sharp Accuracy"
				description="Every claim, every source, every detail checked against the strongest signals. No fluff—just truth."
			>
				<div slot="icon"><Crosshair size={24} /></div>
				<div slot="visual" class="h-2 flex items-center gap-1">
					<div class="h-full w-20 bg-living-coral/50 rounded-full animate-pulse"></div>
					<Check size={12} class="text-living-coral" />
				</div>
			</BentoCard>

			<BentoCard
				title="Transparent Proof"
				description="We don't just say what's real—we show you why. Evidence, context, and reasoning you can trust."
			>
				<div slot="icon"><FileText size={24} /></div>
				<div slot="visual" class="flex gap-2 opacity-50">
					{#each [1, 2, 3] as i}
						<div class="w-8 h-10 bg-white/10 border border-white/10 rounded"></div>
					{/each}
				</div>
			</BentoCard>

			<BentoCard
				title="Built for Speed"
				description="Get Answers in seconds. Forget hours of digging. Hit ⌘+/ to fact-check instantly—right where you are."
			>
				<div slot="icon"><Zap size={24} /></div>
				<div
					slot="visual"
					class="flex items-center gap-2 font-mono text-xs text-white/40 border border-white/10 rounded px-2 py-1 w-fit bg-black/20"
				>
					<span>⌘ + /</span>
				</div>
			</BentoCard>

			<BentoCard
				title="Always With You"
				description="Glass lives where you are—your browser, your chats, your workflow. No switching apps, no friction."
			>
				<div slot="icon"><Cpu size={24} /></div>
				<div slot="visual" class="flex -space-x-2">
					{#each [1, 2, 3, 4] as i}
						<div
							class="w-8 h-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
						></div>
					{/each}
				</div>
			</BentoCard>
		</div>
	</section>

	<!-- SECTION 5: STEP FLOW ("How Glass Works") -->
	<section class="py-32 px-6 max-w-6xl mx-auto" use:reveal>
		<div class="grid md:grid-cols-2 gap-16">
			<!-- Sticky Steps -->
			<div class="space-y-12 opacity-0 transition-all duration-1000 translate-y-8 reveal-target">
				<div>
					<div class="text-living-coral font-medium mb-2">01. Overlay</div>
					<h3 class="text-2xl text-white mb-2">Built for Speed.</h3>
					<p class="text-white/50">Select text on any site, hit ⌘+/ (or Ctrl+/), get results.</p>
				</div>
				<div>
					<div class="text-living-coral font-medium mb-2">02. Dashboard</div>
					<h3 class="text-2xl text-white mb-2">Context on the go.</h3>
					<p class="text-white/50">See fact-checks, source bias, credibility instantly.</p>
				</div>
				<div>
					<div class="text-living-coral font-medium mb-2">03. Stay in flow</div>
					<h3 class="text-2xl text-white mb-2">No tab-switching.</h3>
					<p class="text-white/50">
						Glass follows you around. Social posts, news articles, PDFs — if you can see it, you can
						Glass it.
					</p>
				</div>
			</div>

			<!-- Visual -->
			<div
				class="relative h-[400px] bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden opacity-0 transition-all duration-1000 delay-200 translate-y-8 reveal-target"
			>
				<div class="absolute inset-0 bg-gradient-to-b from-transparent to-abyss/50"></div>
				<div
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 font-bold text-6xl"
				>
					FLOW
				</div>
			</div>
		</div>
	</section>

	<!-- SECTION 6: TITAN FOOTER -->
	<footer class="relative pt-32 pb-0 overflow-hidden text-center" use:reveal>
		<div
			class="opacity-0 transition-all duration-1000 translate-y-8 reveal-target relative z-10 mb-8 px-6"
		>
			<p class="text-white/40 text-sm max-w-md mx-auto">
				AI-powered fact-checking and media verification — from live meetings to articles, images,
				and videos.
			</p>
		</div>

		<div
			class="relative z-0 select-none pointer-events-none opacity-0 transition-all duration-1500 delay-300 translate-y-20 reveal-target leading-none"
		>
			<h1
				class="text-[12rem] md:text-[20rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent translate-y-[30%]"
			>
				GLASSCORAL
			</h1>
		</div>
	</footer>
</div>

<style>
	:global(.reveal-target) {
		/* Initial state handled by utility classes in marker but overridden here via specificity if needed */
	}
	:global(.visible .reveal-target) {
		opacity: 1 !important;
		transform: translateY(0) !important;
	}

	@keyframes scan {
		0% {
			top: 0;
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			top: 100%;
			opacity: 0;
		}
	}
	.animate-scan {
		animation: scan 3s ease-in-out infinite;
	}
</style>
