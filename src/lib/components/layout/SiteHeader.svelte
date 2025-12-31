<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import { headerVisible, portalDecisionViewed } from '$lib/stores/ui';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	$: isPortal = $page.url.pathname.startsWith('/portals/');

	let showHeader = true;
	let mobileMenuOpen = false;
	let timer: ReturnType<typeof setTimeout>;

	$: session = $page.data.session;

	$: {
		if (isPortal) {
			if ($portalDecisionViewed) {
				// When decision is viewed, wait 4 seconds then show
				showHeader = false;
				clearTimeout(timer);
				timer = setTimeout(() => {
					showHeader = true;
				}, 4000);
			} else {
				// Hide header by default on portal login/wait pages
				showHeader = false;
			}
		} else {
			// Always show on normal pages
			showHeader = $headerVisible;
		}
	}
</script>

{#if showHeader}
	<header
		class="sticky top-0 z-[9999] border-b border-slate-200/50 bg-white/95 backdrop-blur-md transition-all h-[64px] flex items-center shadow-sm"
	>
		<div class="max-w-[1200px] w-full mx-auto px-6 h-full flex items-center justify-between">
			<!-- LOGO -->
			<a
				href="/"
				class="text-xl font-bold tracking-tight text-[var(--color-brand-primary)] relative z-[1001]"
			>
				predictadmit<span class="text-blue-900">.com</span>
			</a>

			<!-- DESKTOP NAVIGATION -->
			<nav class="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
				<a
					href="/portals"
					class="text-lg font-bold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
					>Portals</a
				>
				<a
					href="/ai"
					class="text-lg font-bold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
					>Predict</a
				>
				<a
					href="/pro"
					class="text-lg font-bold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
					>Pro</a
				>
				<a
					href="/about"
					class="text-lg font-bold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
					>About</a
				>
			</nav>

			<!-- RIGHT SIDE (Account / Sign In) -->
			<div class="flex items-center gap-3 relative z-[1001]">
				<a
					href="/account"
					class="hidden md:inline-flex items-center gap-2 bg-white border-2 border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors font-bold text-base"
				>
					{#if session}
						{#if session.user?.image}
							<img
								src={session.user.image}
								alt={session.user.name}
								class="w-6 h-6 rounded-full border border-slate-200"
							/>
						{:else}
							<div
								class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600"
							>
								{session.user?.name?.charAt(0) || 'U'}
							</div>
						{/if}
						<span class="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
							{session.user?.name || 'Account'}
						</span>
					{:else}
						<svg class="w-5 h-5" viewBox="0 0 24 24">
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
						Sign in
					{/if}
				</a>
				<a
					href="/pro"
					class="hidden md:inline-flex items-center justify-center font-bold text-lg bg-blue-600 text-white px-8 py-3 rounded-[var(--radius-btn)] hover:bg-blue-700 transition-colors"
				>
					Get Pro
				</a>

				<!-- MOBILE HAMBURGER -->
				<button
					class="md:hidden p-2 text-slate-800"
					on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
					aria-label="Toggle menu"
				>
					{#if mobileMenuOpen}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path></svg
						>
					{:else}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							></path></svg
						>
					{/if}
				</button>
			</div>
		</div>

		<!-- MOBILE MENU OVERLAY -->
		{#if mobileMenuOpen}
			<div
				class="fixed inset-0 top-[64px] bg-white z-[1000] p-6 flex flex-col gap-6 md:hidden animate-fade-in text-center"
			>
				<nav class="flex flex-col gap-6 text-lg font-bold text-slate-800">
					<a href="/portals" on:click={() => (mobileMenuOpen = false)}>Portals</a>
					<a href="/ai" on:click={() => (mobileMenuOpen = false)}>Predict Results</a>
					<a href="/research-hub" on:click={() => (mobileMenuOpen = false)}>Research Hub</a>
					<a href="/junior-diagnostic" on:click={() => (mobileMenuOpen = false)}
						>Junior Diagnostic</a
					>
					<a href="/about" on:click={() => (mobileMenuOpen = false)}>About</a>
				</nav>
				<div class="border-t border-slate-100 pt-6 flex flex-col gap-4">
					<a
						href="/account"
						on:click={() => (mobileMenuOpen = false)}
						class="inline-flex justify-center items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold"
					>
						{#if session}
							{session.user?.name || 'Account'}
						{:else}
							Sign In
						{/if}
					</a>
					<a
						href="/pro"
						on:click={() => (mobileMenuOpen = false)}
						class="inline-flex justify-center items-center font-bold text-lg bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-200"
					>
						Get Pro Access
					</a>
				</div>
			</div>
		{/if}
	</header>
{/if}
