<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import {
		headerVisible,
		portalDecisionHeaderVisible,
		portalDecisionViewed,
		overlayActive
	} from '$lib/stores/ui';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';

	$: isPortal = $page.url.pathname.startsWith('/portals/');
	// During an AI simulation, viewing a school's decision page, the nav morphs
	// into a "mail" nav so the user can jump straight back to their inbox and open
	// another decision instead of hunting for the browser back button.
	$: mailMode = isPortal && $userProfile.usingAI;
	$: path = $page.url.pathname;

	// Reactive nav model. Reference `path` directly so Svelte tracks it.
	$: navLinks = [
		{ href: '/ai', label: 'Predict My Decisions', active: path === '/ai' || path.startsWith('/ai/') },
		{ href: '/portals', label: 'Portal Simulator', active: path === '/portals' },
		{ href: '/pro', label: 'Go Pro', active: path === '/pro' || path.startsWith('/pro/') },
		{ href: '/about', label: 'About', active: path === '/about' || path.startsWith('/about/') }
	];

	let showHeader = true;
	let menuOpen = false;
	let timer: ReturnType<typeof setTimeout> | undefined;

	// Match the Mr. Sinn nav: JS present → mobile nav collapses behind the toggle.
	// Without JS the links stay visible, so a stale bundle never hides the nav.
	onMount(() => {
		document.documentElement.classList.add('js');
	});

	$: session = $page.data.session;
	// When any overlay/toast is up, the nav grays out + goes non-interactive.
	$: dimmed = $overlayActive > 0;

	// Collapse the mobile menu on navigation.
	$: if (path) menuOpen = false;

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
	<header
		class="site-header"
		class:is-dimmed={dimmed}
	>
		<div class="container header-inner">
			{#if mailMode}
				<!-- Mail-nav mode: one tap back to the decision inbox. -->
				<a href="/ai" class="btn btn-secondary logo-link">← Back to inbox</a>
			{:else}
				<a href="/" class="logo-link">
					<span class="brand-word">predictadmit<span class="brand-dot">.com</span></span>
				</a>
			{/if}

			{#if !mailMode}
				<button
					class="nav-toggle"
					type="button"
					aria-expanded={menuOpen}
					aria-label="Menu"
					on:click={() => (menuOpen = !menuOpen)}
				>
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
				</button>

				<nav class="site-nav" class:is-open={menuOpen} aria-label="Primary">
					<ul>
						{#each navLinks as link}
							<li>
								<a href={link.href} aria-current={link.active ? 'page' : undefined}>{link.label}</a>
							</li>
						{/each}
						<li>
							<a href="/account" class="btn btn-primary nav-account">
								{#if session}
									{session.user?.name || 'Account'}
								{:else}
									Sign in
								{/if}
							</a>
						</li>
					</ul>
				</nav>
			{/if}
		</div>
	</header>
{/if}

<style>
	.brand-word {
		font-family: var(--font-display);
		font-size: 1.35rem;
		color: var(--navy);
		letter-spacing: 0;
	}
	.brand-dot {
		color: var(--blue);
	}
	.logo-link:hover .brand-dot {
		color: var(--blue-dark);
	}
	.nav-account {
		padding: 0.5rem 1.1rem;
		font-size: 0.85rem;
	}
	/* The Sign in / Account button is an <a> inside .site-nav, so the global
	   `.site-nav a { color: navy }` (and its yellow hover) were beating
	   .btn-primary and painting dark text on the blue fill. Force white text +
	   the proper blue hover with a two-class selector so it always wins. */
	.nav-account.btn-primary,
	.nav-account.btn-primary:hover,
	.nav-account.btn-primary:focus {
		color: #fff;
	}
	.nav-account.btn-primary:hover {
		background: var(--blue-dark);
	}
	/* Mail-mode back button reuses .btn but shouldn't stretch */
	.logo-link.btn {
		font-size: 0.85rem;
		padding: 0.5rem 1.1rem;
	}
	.site-header.is-dimmed {
		opacity: 0.3;
		pointer-events: none;
		filter: grayscale(1);
	}
	@media (min-width: 768px) {
		.site-nav :global(ul) {
			gap: 0.15rem 0.35rem;
		}
	}
</style>
