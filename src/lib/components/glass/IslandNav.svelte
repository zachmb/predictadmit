<script lang="ts">
	import { spring } from 'svelte/motion';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';

	// Access session from page data
	let session = $derived($page.data.session);

	let expanded = false;

	// Spring physics for smooth expansion
	const width = spring(240, {
		stiffness: 0.12,
		damping: 0.4
	});
	const height = spring(48, {
		stiffness: 0.12,
		damping: 0.4
	});

	function expand() {
		expanded = true;
		width.set(680); // Width to fit all items
		height.set(64);
	}

	function contract() {
		expanded = false;
		width.set(240); // Base width for "predictadmit.com/path"
		height.set(48);
	}

	function getDisplayPath(pathname: string) {
		if (pathname === '/') return '';
		return pathname;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center justify-center overflow-hidden
         bg-black/40 backdrop-blur-2xl rounded-full border border-white/10
         shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_8px_32px_-4px_rgba(0,0,0,0.5)]
         hover:cursor-default transition-colors duration-300 pointer-events-auto"
	style="width: {$width}px; height: {$height}px;"
	onmouseenter={expand}
	onmouseleave={contract}
>
	{#if !expanded}
		<div
			class="flex items-center justify-center gap-2 px-4 w-full h-full animate-in fade-in zoom-in duration-300 absolute inset-0 text-nowrap pointer-events-none"
		>
			<span class="text-white/90 font-medium text-sm tracking-tight">
				predictadmit.com<span class="text-white/50">{getDisplayPath($page.url.pathname)}</span>
			</span>
		</div>
	{:else}
		<nav
			class="flex items-center justify-between w-full px-6 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75 h-full gap-4 pointer-events-auto"
		>
			<!-- Logo Area (Left) -->
			<a
				href="/"
				class="text-white font-bold tracking-tight shrink-0 hover:text-cyan-400 transition-colors"
			>
				predictadmit<span class="text-white/50">.com</span>
			</a>

			<!-- Navigation Links (Center) -->
			<div class="flex items-center gap-1">
				<a
					href="/portals"
					class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
					{$page.url.pathname.startsWith('/portals')
						? 'bg-white/15 text-white'
						: 'text-white/70 hover:text-white hover:bg-white/10'}">Portals</a
				>
				<a
					href="/ai"
					class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
					{$page.url.pathname.startsWith('/ai')
						? 'bg-white/15 text-white'
						: 'text-white/70 hover:text-white hover:bg-white/10'}">Predict</a
				>
				<a
					href="/pro"
					class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
					{$page.url.pathname.startsWith('/pro')
						? 'bg-white/15 text-white'
						: 'text-white/70 hover:text-white hover:bg-white/10'}">Pro</a
				>
				<a
					href="/about"
					class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
					{$page.url.pathname.startsWith('/about')
						? 'bg-white/15 text-white'
						: 'text-white/70 hover:text-white hover:bg-white/10'}">About</a
				>
			</div>

			<!-- Account / Sign In (Right) -->
			<div class="shrink-0">
				<a
					href="/account"
					class="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-1.5 rounded-full hover:bg-slate-100 transition-colors font-semibold text-xs"
				>
					{#if session}
						{#if session.user?.image}
							<img
								src={session.user.image}
								alt={session.user.name}
								class="w-5 h-5 rounded-full border border-slate-200"
							/>
						{:else}
							<div
								class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px] text-blue-600"
							>
								{session.user?.name?.charAt(0) || 'U'}
							</div>
						{/if}
						<span class="max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap">
							Account
						</span>
					{:else}
						<!-- Google Icon -->
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
						Sign in
					{/if}
				</a>
			</div>
		</nav>
	{/if}
</div>
