<script lang="ts">
	// Portal login screens are a SIMULATION — the email/password fields are
	// decorative and you just click "Login" to continue. This layout wraps every
	// portal page and, for any email/password input, blocks typing (they're not
	// needed). If the applicant CLEARLY gets stuck — sits on the login screen for a
	// while, or actually tries to type credentials — we show ONE gentle reminder to
	// click Login. It never fires on a quick Login click, on focus, or more than
	// once per session.
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { portalDecisionHeaderVisible } from '$lib/stores/ui';

	const SHOWN_KEY = 'pa_portal_nudge_shown';
	const STUCK_MS = 8000; // "clearly stuck" = this long on a login screen with no progress

	let showNudge = false;
	let hideTimer: ReturnType<typeof setTimeout> | null = null;
	let idleTimer: ReturnType<typeof setTimeout> | null = null;

	function alreadyShown() {
		try {
			return sessionStorage.getItem(SHOWN_KEY) === '1';
		} catch {
			return false;
		}
	}

	// Show the reminder at most once per session.
	function nudgeOnce() {
		if (showNudge || alreadyShown()) return;
		try {
			sessionStorage.setItem(SHOWN_KEY, '1');
		} catch {
			/* ignore */
		}
		showNudge = true;
		if (hideTimer) clearTimeout(hideTimer);
		hideTimer = setTimeout(() => (showNudge = false), 7000);
	}

	function armStuckTimer() {
		if (alreadyShown()) return;
		if (idleTimer) clearTimeout(idleTimer);
		idleTimer = setTimeout(nudgeOnce, STUCK_MS);
	}

	function lockField(el: HTMLInputElement) {
		if (el.dataset.simLocked === '1') return;
		el.dataset.simLocked = '1';
		el.readOnly = true;
		el.style.cursor = 'not-allowed';
		// An ACTUAL typing attempt (a character / backspace / enter) is a clear sign
		// they think they must fill this in — block it and nudge once. Focus, clicks,
		// and tabbing through do NOT nudge, so a quick Login click never triggers it.
		el.addEventListener('keydown', (e) => {
			if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
				e.preventDefault();
				nudgeOnce();
			}
		});
		el.addEventListener('paste', (e) => {
			e.preventDefault();
			nudgeOnce();
		});
		if (el.type === 'password') armStuckTimer();
	}

	function scan(root: ParentNode) {
		root
			.querySelectorAll?.('input[type="email"], input[type="password"]')
			.forEach((n) => lockField(n as HTMLInputElement));
	}

	// They've moved past the login screen (logged in) — cancel any pending
	// "stuck" nudge so it never fires after the password field is gone.
	function cancelStuckIfLoggedIn() {
		if (!document.querySelector('input[type="password"]') && idleTimer) {
			clearTimeout(idleTimer);
			idleTimer = null;
		}
	}

	onMount(() => {
		scan(document);
		// Lock inputs that appear after client-side nav between portals; cancel the
		// stuck-timer when the login form disappears.
		const mo = new MutationObserver((mutations) => {
			for (const m of mutations) {
				m.addedNodes.forEach((n) => {
					if (n instanceof HTMLInputElement) lockField(n);
					else if (n instanceof HTMLElement) scan(n);
				});
			}
			cancelStuckIfLoggedIn();
		});
		mo.observe(document.body, { childList: true, subtree: true });

		return () => {
			mo.disconnect();
			if (hideTimer) clearTimeout(hideTimer);
			if (idleTimer) clearTimeout(idleTimer);
		};
	});
</script>

<!-- Blank backing space for the floating nav. On a decision letter the site nav
     fades in ~4s after the decision is viewed; without this the floating pill
     overlapped the top of the simulated letter/portal. This spacer grows in with
     the nav so it sits on clean blank ground and covers nothing. -->
<div
	class="w-full bg-[#f4f4f0] transition-[height] duration-300 ease-out"
	style="height: {$portalDecisionHeaderVisible ? '104px' : '0px'}"
	aria-hidden="true"
></div>

<slot />

{#if showNudge}
	<div
		class="fixed bottom-6 left-1/2 z-[9999] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2.5 rounded-full bg-[#0c0c09] py-2 pl-2 pr-5 text-[13px] font-medium leading-snug text-white shadow-[0_16px_40px_-12px_rgba(12,12,9,0.5)]"
		style="bottom: calc(1.5rem + env(safe-area-inset-bottom));"
		role="status"
		aria-live="polite"
		transition:fly={{ y: 10, duration: 220 }}
	>
		<span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-white">
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
				/>
			</svg>
		</span>
		<span
			>No password needed. This is a simulation. Just tap <strong class="font-semibold"
				>Login</strong
			> to continue.</span
		>
	</div>
{/if}
