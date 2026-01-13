<!-- src/routes/pricing/+page.svelte -->
<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let isLoading = false;
	let errorMessage = '';
	let isMonthly = false;

	const tweenedPrice = tweened(9, {
		duration: 400,
		easing: cubicOut
	});

	$: tweenedPrice.set(isMonthly ? 5 : 9);

	async function startCheckout() {
		isLoading = true;
		errorMessage = '';

		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					isMonthly
				})
			});

			const text = await res.text();

			let data: any = {};
			try {
				data = JSON.parse(text || '{}');
			} catch (jsonErr) {
				console.error('Non-JSON response from /api/checkout:', text);
				errorMessage = 'Server returned an invalid response.';
				return;
			}

			if (!res.ok || !data.url) {
				console.error('Checkout error payload:', data);
				errorMessage = data?.error ?? `Could not start checkout (status ${res.status}).`;
				return;
			}

			window.location.href = data.url;
		} catch (err) {
			console.error('Fetch to /api/checkout failed:', err);
			errorMessage = 'Network error starting checkout.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>PredictAdmit Pro – Pricing</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 text-slate-900">
	<div class="max-w-4xl mx-auto px-4 py-12 space-y-12">
		<header class="text-center space-y-4">
			<h1 class="text-5xl font-bold tracking-tight text-slate-900">Simple, transparent pricing</h1>
			<p class="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
				Unlock the full potential of your application with PredictAdmit Pro. No hidden fees, ever.
			</p>
		</header>

		<!-- Toggle Switch -->
		<div class="flex justify-center">
			<div
				class="relative bg-slate-200 p-1.5 rounded-full flex items-center shadow-inner w-64 h-12 cursor-pointer"
				on:click={() => (isMonthly = !isMonthly)}
				on:keydown={(e) => e.key === 'Enter' && (isMonthly = !isMonthly)}
				role="button"
				tabindex="0"
			>
				<!-- Sliding Background -->
				<div
					class="absolute top-1.5 bottom-1.5 bg-white rounded-full shadow-sm border border-slate-100 transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1) w-[calc(50%-6px)]"
					style="left: 6px; transform: translateX({isMonthly ? '100%' : '0%'})"
				></div>

				<button
					class="relative z-10 w-1/2 text-sm font-bold transition-colors duration-300 {!isMonthly
						? 'text-slate-900'
						: 'text-slate-500'}"
					on:click|stopPropagation={() => (isMonthly = false)}
				>
					Full Cycle
				</button>
				<button
					class="relative z-10 w-1/2 text-sm font-bold transition-colors duration-300 {isMonthly
						? 'text-slate-900'
						: 'text-slate-500'}"
					on:click|stopPropagation={() => (isMonthly = true)}
				>
					Monthly
				</button>
			</div>
		</div>

		<section class="grid gap-12 md:grid-cols-2 items-center max-w-5xl mx-auto">
			<!-- Value Props -->
			<div class="space-y-8 text-slate-700 pr-8">
				<div class="space-y-4">
					<h3 class="text-3xl font-bold text-slate-900 tracking-tight">
						Everything you need to succeed
					</h3>
					<p class="text-slate-600 text-lg">
						Comprehensive tools to perfect your application strategy.
					</p>
				</div>

				<ul class="space-y-6">
					<li class="flex items-start gap-4">
						<div class="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
							<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
						<div>
							<strong class="block text-slate-900 font-semibold mb-1">Unlimited AI Inboxes</strong>
							<span class="text-slate-600 leading-relaxed"
								>Run simulations on updated profiles as many times as you need.</span
							>
						</div>
					</li>
					<li class="flex items-start gap-4">
						<div class="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
							<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<div>
							<strong class="block text-slate-900 font-semibold mb-1">Deep-Dive Explanations</strong
							>
							<span class="text-slate-600 leading-relaxed"
								>Understand the "why" behind every admit, deny, and deferral.</span
							>
						</div>
					</li>
					<li class="flex items-start gap-4">
						<div class="p-2 bg-emerald-100 rounded-lg text-emerald-600 shrink-0">
							<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<strong class="block text-slate-900 font-semibold mb-1">Actionable Guidance</strong>
							<span class="text-slate-600 leading-relaxed"
								>Get concrete steps to improve your application before you submit.</span
							>
						</div>
					</li>
				</ul>
			</div>

			<!-- Pricing Card -->
			<div class="relative group group/card perspective-1000 z-10">
				<!-- Glow effect -->
				<div
					class="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-[2rem] opacity-0 blur-3xl transition duration-1000 group-hover:opacity-20 group-hover/card:opacity-20"
				></div>

				<div
					class="relative rounded-[1.5rem] bg-white/80 backdrop-blur-2xl p-8 lg:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] flex flex-col items-center text-center border border-white/60"
				>
					<!-- Badge Container -->
					<div class="h-8 mb-6 flex items-center justify-center w-full">
						<div
							class="transition-all duration-500 ease-out transform {isMonthly
								? 'opacity-0 scale-90'
								: 'opacity-100 scale-100'}"
						>
							{#if !isMonthly}
								<span
									class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] uppercase font-bold tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/30"
								>
									Most Popular
								</span>
							{/if}
						</div>
					</div>

					<h2 class="text-sm font-bold text-slate-500 tracking-[0.25em] uppercase mb-8">
						PredictAdmit Pro
					</h2>

					<div class="flex items-end gap-2 mb-8 h-24 overflow-visible">
						<span class="text-7xl font-bold text-slate-900 tracking-tighter tabular-nums pb-1">
							${$tweenedPrice.toFixed(0)}
						</span>
						<span class="text-lg text-slate-500 font-medium mb-4 opacity-80">
							/{isMonthly ? 'mo' : 'cycle'}
						</span>
					</div>

					<div class="h-6 w-full relative mb-8 overflow-hidden">
						{#key isMonthly}
							<p
								class="text-sm font-medium text-slate-600 absolute w-full left-0 transition-all duration-300 transform"
								in:fly={{ y: 20, duration: 300, easing: cubicOut }}
								out:fly={{ y: -20, duration: 300, easing: cubicOut }}
							>
								{isMonthly
									? 'Billed monthly. Cancel anytime.'
									: 'One-time payment for the full cycle.'}
							</p>
						{/key}
					</div>

					{#if errorMessage}
						<div class="w-full mb-6">
							<p
								class="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 w-full"
							>
								{errorMessage}
							</p>
						</div>
					{/if}

					<button
						type="button"
						class="w-full relative group/btn overflow-hidden rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-xl hover:shadow-2xl hover:bg-slate-800 transition-all duration-300 hover:-translate-y-0.5"
						on:click={startCheckout}
						disabled={isLoading}
					>
						<div
							class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"
						></div>
						<div class="relative flex items-center justify-center gap-2">
							{#if isLoading}
								<span
									class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
								></span>
								<span>Processing...</span>
							{:else}
								<span>Get Started Now</span>
								<svg
									class="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M14 5l7 7m0 0l-7 7m7-7H3"
									/>
								</svg>
							{/if}
						</div>
					</button>

					<p
						class="mt-6 text-[10px] text-slate-400 flex items-center gap-1.5 justify-center opacity-70"
					>
						<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"
							><path
								d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
							/></svg
						>
						Secure payment via Stripe
					</p>
				</div>
			</div>
		</section>

		<!-- Stanford Comparison Section -->
		<section class="max-w-xl mx-auto pt-16 pb-12 text-center">
			<div class="relative p-8 bg-[#8C1515]/5 rounded-3xl border border-[#8C1515]/10">
				<!-- Hand-drawn arrow pointing to price -->
				<div class="absolute -top-12 -right-12 hidden md:block opacity-50 transform rotate-12">
					<svg
						width="100"
						height="100"
						viewBox="0 0 100 100"
						fill="none"
						stroke="currentColor"
						class="text-slate-400"
					>
						<path d="M20,80 Q50,20 80,40" stroke-width="2" marker-end="url(#arrowhead)" />
						<defs>
							<marker
								id="arrowhead"
								markerWidth="10"
								markerHeight="7"
								refX="0"
								refY="3.5"
								orient="auto"
							>
								<polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
							</marker>
						</defs>
					</svg>
					<span
						class="absolute top-0 right-0 text-sm font-handwriting transform rotate-12 text-slate-500"
						>Only 9% of this!</span
					>
				</div>

				<div class="flex flex-col items-center gap-6">
					<div class="w-16 h-16 relative">
						<!-- Stanford Tree (Simplified SVG representation) -->
						<svg
							viewBox="0 0 100 150"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="text-[#8C1515]"
						>
							<path d="M50 10 L80 120 H20 L50 10 Z" fill="currentColor" opacity="0.8" />
							<path d="M50 0 L90 120 H10 L50 0 Z" stroke="currentColor" stroke-width="4" />
							<rect x="40" y="120" width="20" height="30" fill="currentColor" />
						</svg>
					</div>

					<div class="space-y-2">
						<h3 class="text-2xl font-bold text-[#8C1515]">Stanford Application Fee</h3>
						<div class="text-5xl font-black text-slate-900">$100</div>
					</div>

					<div class="relative">
						<p class="text-lg text-slate-600 font-medium">
							For just <span
								class="text-[#8C1515] font-bold underline decoration-wavy decoration-from-font"
								>$9</span
							>, PredictAdmit Pro gives you unlimited feedback to crack the code.
						</p>

						<!-- Underline graphic -->
						<svg
							class="absolute w-full h-3 -bottom-2 text-[#8C1515] opacity-30"
							viewBox="0 0 200 9"
							fill="none"
						>
							<path
								d="M2.00025 7.00003C52.8875 1.57962 136.082 -3.42539 198.001 5.99999"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
							/>
						</svg>
					</div>
				</div>
			</div>
		</section>
	</div>
</main>

<SiteFooter />
