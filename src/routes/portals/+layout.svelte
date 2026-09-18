<script lang="ts">
	// Portal login screens are a SIMULATION — the email/password fields are
	// decorative and you just click "Login" to continue. This layout wraps every
	// portal page and, for any email/password input, blocks typing (they're not
	// needed). If the applicant CLEARLY gets stuck — sits on the login screen for a
	// while, or actually tries to type credentials — we show ONE gentle reminder to
	// click Login. It never fires on a quick Login click, on focus, or more than
	// once per session.
	import { onMount } from 'svelte';

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

	onMount(() => {
		scan(document);
		// Lock inputs that appear after client-side nav between portals.
		const mo = new MutationObserver((mutations) => {
			for (const m of mutations) {
				m.addedNodes.forEach((n) => {
					if (n instanceof HTMLInputElement) lockField(n);
					else if (n instanceof HTMLElement) scan(n);
				});
			}
		});
		mo.observe(document.body, { childList: true, subtree: true });

		return () => {
			mo.disconnect();
			if (hideTimer) clearTimeout(hideTimer);
			if (idleTimer) clearTimeout(idleTimer);
		};
	});
</script>

<slot />

{#if showNudge}
	<div class="sim-nudge" role="status" aria-live="polite">
		<span class="sim-nudge-dot"></span>
		No password needed — this is a simulation. Just click <strong>Login</strong> to continue.
	</div>
{/if}

<style>
	.sim-nudge {
		position: fixed;
		left: 50%;
		bottom: 24px;
		transform: translateX(-50%);
		z-index: 9999;
		display: flex;
		align-items: center;
		gap: 8px;
		max-width: calc(100vw - 32px);
		padding: 10px 16px;
		border-radius: 9999px;
		background: #0f172a;
		color: #fff;
		font-size: 13px;
		font-weight: 500;
		line-height: 1.35;
		box-shadow: 0 12px 30px -8px rgba(15, 23, 42, 0.45);
		animation: sim-nudge-in 0.25s ease-out both;
	}
	.sim-nudge strong {
		font-weight: 700;
	}
	.sim-nudge-dot {
		width: 8px;
		height: 8px;
		border-radius: 9999px;
		background: #1a4cff;
		box-shadow: 0 0 0 4px rgba(26, 76, 255, 0.25);
		flex-shrink: 0;
	}
	@keyframes sim-nudge-in {
		from {
			opacity: 0;
			transform: translate(-50%, 8px);
		}
		to {
			opacity: 1;
			transform: translate(-50%, 0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sim-nudge {
			animation: none;
		}
	}
</style>
