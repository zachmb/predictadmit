<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import PortalShareLauncher from '$lib/components/portal/PortalShareLauncher.svelte';
	import SimulationBadge from '$lib/components/portal/SimulationBadge.svelte';
	import { page } from '$app/stores';
	import { userProfile } from '$lib/stores/user';
	import { portalDecisionHeaderVisible, portalDecisionViewed, headerVisible } from '$lib/stores/ui';
	import { captureReferral, redeemReferralIfJoined } from '$lib/referral';
	import { captureAttribution } from '$lib/attribution';
	import AiUpsell from '$lib/components/portal/AiUpsell.svelte';
	import { decisionsBySlug } from '$lib/stores/results';
	import { schoolConfigs } from '$lib/config/schools';
	import { computeDecisionForSchool, hasEnoughToScore } from '$lib/scoring/model';

	let { children } = $props();

	// Reset portal view state when navigating between schools or back home
	$effect(() => {
		if ($page.url.pathname) {
			portalDecisionViewed.set(false);
			portalDecisionHeaderVisible.set(false);
			headerVisible.set(true);
		}
	});

	// Remember the decision the user just viewed so the /portals index can flash
	// that school's card green/red on return. Outcome resolution mirrors
	// PortalShareLauncher: store result, else the school's configured default.
	$effect(() => {
		if (!$portalDecisionViewed) return;
		const match = $page.url.pathname.match(/^\/portals\/([^/]+)\/?$/);
		const slug = match?.[1];
		if (!slug) return;
		const stats = $userProfile.stats;
		const outcome =
			$decisionsBySlug[slug] ??
			(stats && hasEnoughToScore(stats)
				? computeDecisionForSchool(stats, slug).outcome
				: (schoolConfigs[slug]?.decision ?? 'deny'));
		try {
			sessionStorage.setItem(
				'predictadmit:lastDecision',
				JSON.stringify({ slug, outcome, at: Date.now() })
			);
		} catch {
			/* ignore storage errors */
		}
	});

	// Invite loop: remember which friend's ?ref= link brought this visitor here,
	// then reward both sides once the visitor has an identity (signed in / named).
	$effect(() => {
		captureReferral($page.url);
		captureAttribution($page.url); // first-touch source for revenue attribution
	});

	$effect(() => {
		const who = $page.data.session?.user?.email || $userProfile.email || $userProfile.name;
		if (who) redeemReferralIfJoined(who);
	});

	// Signed-in users: adopt the Google account name/email as the display
	// identity. Do NOT grant Pro here — Pro is unlocked ONLY by a completed
	// one-time Stripe purchase (Full Season / Season+Essay), verified on return
	// in /ai's onMount. Signing in with Google is the free tier (one free run).
	$effect(() => {
		const session = $page.data.session;
		if (!session?.user) return;
		const name = session.user.name || '';
		const email = session.user.email || '';
		userProfile.update((u) => {
			if ((!name || u.name === name) && (!email || u.email === email)) return u;
			return {
				...u,
				name: name || u.name,
				email: email || u.email
			};
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SiteHeader />

<div class="relative z-10 min-h-screen">
	{@render children()}
</div>

<PortalShareLauncher />
<SimulationBadge />
<AiUpsell />
