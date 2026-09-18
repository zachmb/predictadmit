<script lang="ts">
	// Portal login screens are a SIMULATION — the email/password fields are
	// decorative and you just click "Login" to continue. Applicants kept trying to
	// type real credentials and stalling. This layout wraps EVERY portal page and,
	// for any email/password input rendered underneath it, (1) blocks typing and
	// (2) nudges the user to just click Login — on an interaction attempt, or after
	// a few idle seconds on a login screen. Done once here (not per-portal) so it
	// covers all 40+ portals and any added later. A MutationObserver re-applies it
	// after client-side navigation between portals.
	import { onMount } from 'svelte';

	let showNudge = false;
	let hideTimer: ReturnType<typeof setTimeout> | null = null;
	let idleTimer: ReturnType<typeof setTimeout> | null = null;

	function flashNudge() {
		showNudge = true;
		if (hideTimer) clearTimeout(hideTimer);
		hideTimer = setTimeout(() => (showNudge = false), 6000);
	}

	// Wait a few idle seconds on a login screen, then remind them.
	function armIdleNudge() {
		if (idleTimer) clearTimeout(idleTimer);
		idleTimer = setTimeout(() => flashNudge(), 4500);
	}

	function lockField(el: HTMLInputElement) {
		if (el.dataset.simLocked === '1') return;
		el.dataset.simLocked = '1';
		el.readOnly = true;
		el.style.cursor = 'not-allowed';
		const nudgeAndBounce = () => {
			flashNudge();
			el.blur();
		};
		el.addEventListener('focus', nudgeAndBounce);
		el.addEventListener('mousedown', (e) => {
			e.preventDefault();
			flashNudge();
		});
		el.addEventListener('keydown', (e) => {
			e.preventDefault();
			flashNudge();
		});
		el.addEventListener('paste', (e) => {
			e.preventDefault();
			flashNudge();
		});
		if (el.type === 'password') armIdleNudge();
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
