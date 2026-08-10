<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import { headerVisible, portalDecisionHeaderVisible, portalDecisionViewed } from '$lib/stores/ui';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';

	$: isPortal = $page.url.pathname.startsWith('/portals/');
	// During an AI simulation, viewing a school's decision page, the nav morphs
	// into a "mail" nav so the user can jump straight back to their inbox and open
	// another decision instead of hunting for the browser back button.
	$: mailMode = isPortal && $userProfile.usingAI;
	// Active-route highlight for the primary nav (exact match or a sub-path).
	$: path = $page.url.pathname;
	const isActive = (p: string) => path === p || path.startsWith(p + '/');
	// The "Portal Simulator" chip lights only on the simulator index — NOT on an
	// individual school's portal/decision page (/portals/stanford), where a filled
	// nav chip reads as a stuck highlight after you've "tried one portal".
	$: isPortalsIndex = path === '/portals';

	let showHeader = true;
	let timer: ReturnType<typeof setTimeout> | undefined;

	$: session = $page.data.session;
	$: isLandingPage = $page.url.pathname === '/';
	// Portal decision pages get the floating "dynamic island" pill (the header
	// only ever shows there after a decision is viewed), matching the home page.
	$: floatingIsland = isLandingPage || isPortal;

	$: {
		if (isPortal) {
			if ($portalDecisionViewed) {
				// When decision is viewed, wait 4 seconds then show
				showHeader = false;
				portalDecisionHeaderVisible.set(false);
				clearTimeout(timer);
				timer = setTimeout(() => {
					showHeader = true;
					portalDecisionHeaderVisible.set(true);
				}, 4000);
			} else {
				// Hide header by default on portal login/wait pages
				showHeader = false;
				portalDecisionHeaderVisible.set(false);
			}
		} else {
			// Always show on normal pages
			showHeader = $headerVisible;
			portalDecisionHeaderVisible.set(false);
		}
	}

	onDestroy(() => {
		clearTimeout(timer);
		portalDecisionHeaderVisible.set(false);
	});
</script>

{#if showHeader}
	{#if !isLandingPage && !isPortal}
		<!-- Placeholder to prevent content overlap on inner pages without animating height -->
		<div class="w-full h-[76px] transition-none"></div>
	{/if}

	<header
		class="fixed left-1/2 -translate-x-1/2 z-[9999] bg-white/80 backdrop-blur-xl transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden
		{floatingIsland
			? 'top-6 h-[68px] border border-slate-200/80 rounded-full px-2'
			: 'top-0 h-[76px] border-b border-transparent lg:border-slate-200/80 rounded-none px-4'}"
		style="width: {floatingIsland ? 'calc(100% - 32px)' : '100%'}; max-width: {floatingIsland
			? '1060px'
			: '100%'};"
	>
		<div
			class="w-full h-full flex items-center justify-between mx-auto transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
			style="max-width: {floatingIsland ? '100%' : '1200px'};"
		>
			<div class="pl-4">
				{#if mailMode}
					<!-- Mail-nav mode: one tap back to the decision inbox. -->
					<a
						href="/ai"
						class="inline-flex items-center gap-2 rounded-full bg-[#0052CC] px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#0041a3]"
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5m0 0 7 7m-7-7 7-7"/></svg>
						Back to Inbox
					</a>
				{:else}
					<a href="/" class="text-xl font-[700] tracking-tight text-slate-900 transition-colors">
						predictadmit<span class="text-[#0052CC]">.com</span>
					</a>
				{/if}
			</div>

			<!-- CENTERED NAVIGATION — the three things a visitor comes to do, spelled
			     out plainly (was terse "Portals / Predict / Pro"): predict their own
			     odds, run every school's real portal, and upgrade. Bigger + clearer;
			     each carries a small glyph, and "Go Pro" is an accent pill so the
			     paid action reads instantly. Active route gets a filled chip. -->
			<nav class="hidden lg:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
				<a
					href="/ai"
					aria-current={isActive('/ai') ? 'page' : undefined}
					on:click={(e) => e.currentTarget.blur()}
					class="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 text-[15px] font-semibold px-4 py-2.5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC]/40 {isActive('/ai')
						? 'text-[#0052CC]'
						: 'text-slate-600 hover:text-slate-900'}"
				>
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v2m0 14v2M3 12h2m14 0h2m-3.5-6.5-1.4 1.4M6.9 17.1l-1.4 1.4m0-13 1.4 1.4m11.6 11.6-1.4-1.4"/><circle cx="12" cy="12" r="4"/></svg>
					Predict My Decisions</a
				>
				<a
					href="/portals"
					aria-current={isPortalsIndex ? 'page' : undefined}
					on:click={(e) => e.currentTarget.blur()}
					class="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 text-[15px] font-semibold px-4 py-2.5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC]/40 {isPortalsIndex
						? 'text-[#0052CC]'
						: 'text-slate-600 hover:text-slate-900'}"
				>
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
					Portal Simulator</a
				>
				<a
					href="/pro"
					aria-current={isActive('/pro') ? 'page' : undefined}
					on:click={(e) => e.currentTarget.blur()}
					class="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 text-[15px] font-bold px-4 py-2.5 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC]/40 {isActive('/pro')
						? 'text-white bg-[#0052CC]'
						: 'text-[#0052CC] bg-[#0052CC]/10 hover:bg-[#0052CC]/15'}"
				>
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.4 7.4H22l-6 4.6 2.3 7.4L12 17l-6.3 4.4L8 14 2 9.4h7.6z"/></svg>
					Go Pro</a
				>
				<a
					href="/about"
					aria-current={isActive('/about') ? 'page' : undefined}
					on:click={(e) => e.currentTarget.blur()}
					class="whitespace-nowrap shrink-0 text-[14px] font-medium text-slate-400 hover:text-slate-700 px-3 py-2.5 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC]/40"
					>About</a
				>
			</nav>

			<div class="flex items-center pr-1">
				<a
					href="/account"
					class="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-black transition-colors font-semibold text-sm shadow-sm"
				>
					{#if session}
						{#if session.user?.image}
							<img
								src={session.user.image}
								alt={session.user.name}
								class="w-5 h-5 rounded-full border border-slate-700"
							/>
						{:else}
							<div
								class="w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center text-[10px] text-white"
							>
								{session.user?.name?.charAt(0) || 'U'}
							</div>
						{/if}
						<span class="max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap text-xs">
							{session.user?.name || 'Account'}
						</span>
					{:else}
						<svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						<span class="text-xs">Sign in</span>
					{/if}
				</a>
			</div>
		</div>
	</header>
{/if}
