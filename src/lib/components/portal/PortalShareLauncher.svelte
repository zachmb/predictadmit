<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { portalDecisionViewed } from '$lib/stores/ui';
	import { schoolConfigs } from '$lib/config/schools';
	import { decisionsBySlug } from '$lib/stores/results';
	import { userProfile } from '$lib/stores/user';
	import { Share2, Copy, Check, Download, X, Twitter, Facebook } from 'lucide-svelte';

	// --- Resolve the current portal slug from the pathname ---
	const slug = $derived.by(() => {
		const m = $page.url.pathname.match(/^\/portals\/([^/]+)\/?$/);
		return m ? m[1] : null;
	});

	const school = $derived(slug ? schoolConfigs[slug] : undefined);

	// Only surface the launcher for AI-simulation decisions (usingAI), not the
	// manual portal sim, after the decision is viewed on a valid portal page.
	const active = $derived(
		!!slug && !!school && $portalDecisionViewed && $userProfile.usingAI
	);

	const outcome = $derived.by(() => {
		if (!slug || !school) return 'deny';
		return $decisionsBySlug[slug] ?? school.decision;
	});
	const isAdmit = $derived(outcome === 'admit');

	const schoolName = $derived(school?.schoolName ?? '');
	const color = $derived(school?.primaryColor ?? '#111827');

	// First name only, safely trimmed. Falls back to "I" per spec.
	const firstName = $derived.by(() => {
		const raw = ($userProfile.name ?? '').trim();
		if (!raw) return 'I';
		return raw.split(/\s+/)[0].slice(0, 40);
	});

	const headline = $derived(isAdmit ? `Accepted to ${schoolName}! \u{1F389}` : `My ${schoolName} decision`);

	const origin = $derived(browser ? window.location.origin : 'https://predictadmit.com');
	const shareUrl = $derived(
		`${origin}/share?school=${encodeURIComponent(slug ?? '')}&outcome=${encodeURIComponent(
			outcome
		)}&name=${encodeURIComponent(firstName)}`
	);
	const shareText = $derived(
		isAdmit
			? `I just got into ${schoolName}! ${firstName === 'I' ? '' : firstName + ' '}\u{1F389}`.trim()
			: `My ${schoolName} admissions decision.`
	);

	// --- UI state ---
	let open = $state(false);
	let copied = $state(false);
	let canShare = $state(false);

	$effect(() => {
		canShare = browser && typeof navigator !== 'undefined' && typeof navigator.share === 'function';
	});

	// Reset transient states whenever the modal closes.
	$effect(() => {
		if (!open) copied = false;
	});

	function openModal() {
		open = true;
	}
	function closeModal() {
		open = false;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeModal();
	}

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(shareUrl);
		} catch {
			// Fallback for older browsers.
			const ta = document.createElement('textarea');
			ta.value = shareUrl;
			ta.style.position = 'fixed';
			ta.style.opacity = '0';
			document.body.appendChild(ta);
			ta.select();
			try {
				document.execCommand('copy');
			} catch {
				/* ignore */
			}
			document.body.removeChild(ta);
		}
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	async function nativeShare() {
		try {
			await navigator.share({ title: headline, text: shareText, url: shareUrl });
		} catch {
			/* user cancelled or unsupported */
		}
	}

	function postToX() {
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
			shareText
		)}&url=${encodeURIComponent(shareUrl)}`;
		window.open(url, '_blank', 'noopener,noreferrer');
	}

	function postToFacebook() {
		const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
		window.open(url, '_blank', 'noopener,noreferrer');
	}

	// --- Canvas rendering for the downloadable social card ---
	function roundRect(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		w: number,
		h: number,
		r: number
	) {
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.arcTo(x + w, y, x + w, y + h, r);
		ctx.arcTo(x + w, y + h, x, y + h, r);
		ctx.arcTo(x, y + h, x, y, r);
		ctx.arcTo(x, y, x + w, y, r);
		ctx.closePath();
	}

	function downloadImage() {
		const W = 1200;
		const H = 630;
		const canvas = document.createElement('canvas');
		canvas.width = W;
		canvas.height = H;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Background
		ctx.fillStyle = '#f3f4f6';
		ctx.fillRect(0, 0, W, H);

		// Card
		const pad = 48;
		const cardX = pad;
		const cardY = pad;
		const cardW = W - pad * 2;
		const cardH = H - pad * 2;
		const radius = 32;

		ctx.save();
		ctx.shadowColor = 'rgba(0,0,0,0.18)';
		ctx.shadowBlur = 40;
		ctx.shadowOffsetY = 16;
		ctx.fillStyle = '#ffffff';
		roundRect(ctx, cardX, cardY, cardW, cardH, radius);
		ctx.fill();
		ctx.restore();

		// Clip to rounded card so the header band respects the corners.
		ctx.save();
		roundRect(ctx, cardX, cardY, cardW, cardH, radius);
		ctx.clip();

		// School-color header band
		const bandH = 150;
		ctx.fillStyle = color;
		ctx.fillRect(cardX, cardY, cardW, bandH);

		// Wordmark in the band
		ctx.fillStyle = 'rgba(255,255,255,0.95)';
		ctx.font = '600 34px Inter, system-ui, sans-serif';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'left';
		ctx.fillText('predictadmit.com', cardX + 56, cardY + bandH / 2);

		ctx.restore();

		const centerX = cardX + cardW / 2;

		// Headline
		ctx.fillStyle = '#111827';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'alphabetic';
		ctx.font = '800 64px Inter, system-ui, sans-serif';
		wrapText(ctx, headline, centerX, cardY + bandH + 150, cardW - 160, 74);

		// Applicant name
		ctx.fillStyle = color;
		ctx.font = '600 40px Inter, system-ui, sans-serif';
		const nameLine = firstName === 'I' ? 'A PredictAdmit applicant' : firstName;
		ctx.fillText(nameLine, centerX, cardY + bandH + 260);

		// Simulated disclaimer
		ctx.fillStyle = '#b45309';
		ctx.font = '700 24px Inter, system-ui, sans-serif';
		ctx.fillText('SIMULATION · NOT A REAL DECISION · predictadmit.com', centerX, cardY + cardH - 44);

		// Trigger download
		const link = document.createElement('a');
		link.download = `predictadmit-${slug ?? 'decision'}.png`;
		link.href = canvas.toDataURL('image/png');
		link.click();
	}

	function wrapText(
		ctx: CanvasRenderingContext2D,
		text: string,
		x: number,
		y: number,
		maxWidth: number,
		lineHeight: number
	) {
		const words = text.split(' ');
		let line = '';
		const lines: string[] = [];
		for (const word of words) {
			const test = line ? `${line} ${word}` : word;
			if (ctx.measureText(test).width > maxWidth && line) {
				lines.push(line);
				line = word;
			} else {
				line = test;
			}
		}
		if (line) lines.push(line);
		const startY = y - ((lines.length - 1) * lineHeight) / 2;
		lines.forEach((ln, i) => ctx.fillText(ln, x, startY + i * lineHeight));
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if active}
	<!-- Floating launcher -->
	<button
		type="button"
		class="share-launcher fixed right-4 z-50 flex items-center gap-2 rounded-full px-4 py-3 font-[Inter,system-ui,sans-serif] text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 focus:ring-4 focus:ring-black/10 focus:outline-none sm:right-5 sm:px-5"
		style="background-color: {color}; bottom: calc(1.25rem + env(safe-area-inset-bottom));"
		onclick={openModal}
	>
		<Share2 size={18} strokeWidth={2.4} />
		<span class="hidden sm:inline">Share your decision</span>
		<span class="sm:hidden">Share</span>
	</button>

	{#if open}
		<!-- Backdrop -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-[Inter,system-ui,sans-serif] backdrop-blur-sm"
			role="presentation"
			onclick={(e) => {
				if (e.target === e.currentTarget) closeModal();
			}}
		>
			<!-- Modal -->
			<div
				class="modal-panel relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
				role="dialog"
				aria-modal="true"
				aria-label="Share your decision"
				tabindex="-1"
			>
				<button
					type="button"
					class="absolute top-3 right-3 z-10 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
					aria-label="Close"
					onclick={closeModal}
				>
					<X size={20} />
				</button>

				<!-- Shareable result card -->
				<div class="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
					<div class="px-5 py-3" style="background-color: {color};">
						<span class="text-sm font-semibold tracking-tight text-white/95">predictadmit.com</span>
					</div>
					<div class="px-6 py-8 text-center">
						<h2 class="text-2xl leading-tight font-extrabold text-gray-900">{headline}</h2>
						<p class="mt-3 text-lg font-semibold" style="color: {color};">
							{firstName === 'I' ? 'A PredictAdmit applicant' : firstName}
						</p>
						<div class="mt-5 flex justify-center">
							<span
								class="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-800 uppercase"
							>
								Simulation · not a real decision
							</span>
						</div>
						<p class="mt-2 text-[10px] font-medium tracking-wide text-gray-400 uppercase">
							predictadmit.com
						</p>
					</div>
				</div>

				<!-- Actions -->
				<div class="mt-5 grid grid-cols-2 gap-2.5">
					<button
						type="button"
						class="col-span-2 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
						style="background-color: {color};"
						onclick={copyLink}
					>
						{#if copied}
							<Check size={17} /> Copied!
						{:else}
							<Copy size={17} /> Copy link
						{/if}
					</button>

					{#if canShare}
						<button
							type="button"
							class="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
							onclick={nativeShare}
						>
							<Share2 size={17} /> Share
						</button>
					{/if}

					<button
						type="button"
						class="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
						onclick={postToX}
					>
						<Twitter size={17} /> Post to X
					</button>
					<button
						type="button"
						class="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
						onclick={postToFacebook}
					>
						<Facebook size={17} /> Facebook
					</button>

					<button
						type="button"
						class="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
						onclick={downloadImage}
					>
						<Download size={17} /> Download image
					</button>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	.share-launcher {
		animation: launcher-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
	}
	@keyframes launcher-in {
		from {
			opacity: 0;
			transform: translateY(16px) scale(0.96);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
	.modal-panel {
		animation: panel-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
	}
	@keyframes panel-in {
		from {
			opacity: 0;
			transform: translateY(12px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.share-launcher,
		.modal-panel {
			animation: none;
		}
	}
</style>
