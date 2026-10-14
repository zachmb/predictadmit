<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import { aiResults } from '$lib/stores/results';
	import { signIn } from '@auth/sveltekit/client';

	type ChatMessage = { role: 'user' | 'assistant'; content: string };

	// `embedded` renders the chat inside a page section (the free teaser on /pro)
	// instead of the full-height Pro dashboard view. `signedIn` gates the composer:
	// the counselor API requires a signed-in user, so a signed-out visitor gets a
	// Google sign-in prompt instead of a dead textarea. Both default to the existing
	// Pro-dashboard behaviour so that usage is unchanged.
	let { embedded = false, signedIn = true }: { embedded?: boolean; signedIn?: boolean } =
		$props();

	const STORAGE_KEY = 'predictadmit:pro:counselor';

	const SUGGESTIONS = [
		'Rate my college list — no sugarcoating',
		"What's the hard truth about my chances?",
		'Paste my essay and tell me what is actually weak',
		'Should I apply Early Decision or Regular?',
		'What is secretly dragging my application down?',
		'Which of my activities are just résumé padding?'
	];

	let messages = $state<ChatMessage[]>([]);
	let draft = $state('');
	let isThinking = $state(false);
	let errorMsg = $state('');
	let needsSignIn = $state(false);
	let hydrated = $state(false);

	let scrollEl = $state<HTMLDivElement | null>(null);
	let textareaEl = $state<HTMLTextAreaElement | null>(null);

	// Load persisted conversation on mount.
	$effect(() => {
		if (hydrated) return;
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) {
					messages = parsed.filter(
						(m) =>
							m &&
							(m.role === 'user' || m.role === 'assistant') &&
							typeof m.content === 'string'
					);
				}
			}
		} catch {
			// ignore corrupt storage
		}
		hydrated = true;
	});

	// Persist conversation whenever it changes (after hydration).
	$effect(() => {
		if (!hydrated) return;
		const snapshot = $state.snapshot(messages);
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
		} catch {
			// ignore storage errors
		}
	});

	// Auto-scroll to newest message when the conversation or pending state changes.
	$effect(() => {
		// touch dependencies
		messages.length;
		isThinking;
		if (scrollEl) {
			requestAnimationFrame(() => {
				if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
			});
		}
	});

	function buildProfile() {
		const u = $userProfile;
		return {
			name: u.name,
			email: u.email,
			// Everything we know, so PredictAI "remembers" the whole applicant:
			// intended major, structured stats, and their essays/activities/awards.
			major: u.stats?.major,
			stats: u.stats,
			applicationProfile: { ...u.applicationProfile },
			schoolList: u.schoolList.map((s) => ({
				slug: s.slug,
				name: s.name,
				status: s.status,
				deadline: s.deadline
			}))
		};
	}

	// The student's full predicted slate (every school they ran) in a compact
	// shape — passed so the counselor reasons across ALL their decisions, not just
	// the one in front of them.
	function buildDecisions() {
		const decisions = $aiResults?.decisions;
		if (!Array.isArray(decisions)) return [];
		return decisions.slice(0, 40).map((d) => ({
			school: d.school,
			slug: d.slug,
			outcome: d.outcome,
			academic_score: d.academic_score,
			extracurricular_score: d.extracurricular_score,
			intellectual_score: d.intellectual_score,
			character_score: d.character_score,
			fit_score: d.fit_score
		}));
	}

	async function send(text: string) {
		const content = text.trim();
		if (!content || isThinking) return;
		// Signed-out visitors can't call the (auth-guarded) counselor API — prompt
		// sign-in up front instead of firing a request that will 401.
		if (!signedIn) {
			needsSignIn = true;
			return;
		}

		errorMsg = '';
		const outgoing: ChatMessage = { role: 'user', content };
		messages = [...messages, outgoing];
		draft = '';
		if (textareaEl) textareaEl.style.height = 'auto';
		isThinking = true;

		try {
			const res = await fetch('/api/ai/counselor', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					messages: $state.snapshot(messages),
					profile: buildProfile(),
					decisions: buildDecisions(),
					academics: (() => {
						try {
							return JSON.parse(localStorage.getItem('predictadmit:pro:academics') || '{}');
						} catch {
							return {};
						}
					})()
				})
			});

			// Session expired / never signed in — flip to the sign-in prompt and
			// drop the optimistic user bubble so the thread isn't left dangling.
			if (res.status === 401) {
				needsSignIn = true;
				messages = messages.slice(0, -1);
				return;
			}

			const data = await res.json().catch(() => ({}));

			if (!res.ok || data?.error) {
				errorMsg =
					data?.error || 'Something went wrong reaching your counselor. Please try again.';
			} else if (typeof data?.reply === 'string') {
				messages = [...messages, { role: 'assistant', content: data.reply }];
			} else {
				errorMsg = 'Your counselor returned an empty response. Please try again.';
			}
		} catch {
			errorMsg = 'Network error. Check your connection and try again.';
		} finally {
			isThinking = false;
			requestAnimationFrame(() => textareaEl?.focus());
		}
	}

	function handleSuggestion(prompt: string) {
		send(prompt);
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		send(draft);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send(draft);
		}
	}

	function autoGrow() {
		if (!textareaEl) return;
		textareaEl.style.height = 'auto';
		textareaEl.style.height = Math.min(textareaEl.scrollHeight, 200) + 'px';
	}

	function newChat() {
		messages = [];
		draft = '';
		errorMsg = '';
		try {
			window.localStorage.removeItem(STORAGE_KEY);
		} catch {
			// ignore
		}
		requestAnimationFrame(() => textareaEl?.focus());
	}

	// --- Safe light-markdown rendering ---------------------------------------
	function escapeHtml(str: string): string {
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function inlineFormat(escaped: string): string {
		// Bold: **text** -> <strong>text</strong> (operates on already-escaped text)
		return escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	}

	function renderMarkdown(raw: string): string {
		const escaped = escapeHtml(raw);
		const lines = escaped.split(/\r?\n/);
		const html: string[] = [];
		let listItems: string[] = [];
		let paragraph: string[] = [];

		const flushList = () => {
			if (listItems.length) {
				html.push(
					`<ul class="my-2 list-disc space-y-1 pl-5">${listItems
						.map((li) => `<li>${inlineFormat(li)}</li>`)
						.join('')}</ul>`
				);
				listItems = [];
			}
		};
		const flushParagraph = () => {
			if (paragraph.length) {
				html.push(`<p class="mb-2 last:mb-0">${inlineFormat(paragraph.join('<br>'))}</p>`);
				paragraph = [];
			}
		};

		for (const line of lines) {
			const trimmed = line.trim();
			if (/^[-*]\s+/.test(trimmed)) {
				flushParagraph();
				listItems.push(trimmed.replace(/^[-*]\s+/, ''));
			} else if (trimmed === '') {
				flushList();
				flushParagraph();
			} else {
				flushList();
				paragraph.push(line);
			}
		}
		flushList();
		flushParagraph();
		return html.join('');
	}
</script>

<div class={embedded ? '' : 'flex-1 min-h-0 overflow-y-auto bg-slate-50'}>
	<div class={embedded ? '' : 'max-w-6xl mx-auto px-6 md:px-10 py-8'}>
		<div
			class="flex {embedded
				? 'h-[520px] sm:h-[560px]'
				: 'h-[calc(100vh-8rem)] min-h-[560px]'} flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
		>
			<!-- Header -->
			<header
				class="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
						style="background-color:#316DE4"
						aria-hidden="true"
					>
						AI
					</div>
					<div class="leading-tight">
						<h2 class="text-base font-semibold text-slate-900">AI Counselor</h2>
						<p class="flex items-center gap-1.5 text-xs text-slate-500">
							<span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
							PredictAI · online
						</p>
					</div>
				</div>
				<button
					type="button"
					onclick={newChat}
					class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M12 5v14M5 12h14" />
					</svg>
					New chat
				</button>
			</header>

			<!-- Conversation / empty state -->
			<div bind:this={scrollEl} class="flex-1 min-h-0 overflow-y-auto px-5 py-6">
				{#if messages.length === 0 && !isThinking}
					<div
						class="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center"
					>
						<div
							class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-sm"
							style="background-color:#316DE4"
							aria-hidden="true"
						>
							AI
						</div>
						<h3 class="text-xl font-semibold text-slate-900">Ask me anything. I'll give it to you straight.</h3>
						<p class="mt-2 text-sm text-slate-500">
							Your list, your essays, your activities, your real odds — the honest read a
							counselor won't give you. No sugarcoating.
						</p>

						<div class="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
							{#each SUGGESTIONS as prompt}
								<button
									type="button"
									onclick={() => handleSuggestion(prompt)}
									class="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#316DE4] hover:text-slate-900 hover:shadow"
								>
									<span
										class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#316DE4] transition group-hover:bg-[#316DE4] group-hover:text-white"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M5 12h14M13 6l6 6-6 6" />
										</svg>
									</span>
									<span>{prompt}</span>
								</button>
							{/each}
						</div>

					</div>
				{:else}
					<div class="mx-auto flex max-w-3xl flex-col gap-4">
						{#each messages as message, i (i)}
							{#if message.role === 'user'}
								<div class="flex justify-end">
									<div
										class="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md px-4 py-2.5 text-sm text-white shadow-sm"
										style="background-color:#316DE4"
									>
										{message.content}
									</div>
								</div>
							{:else}
								<div class="flex items-start gap-2.5">
									<div
										class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
										style="background-color:#316DE4"
										aria-hidden="true"
									>
										AI
									</div>
									<div
										class="max-w-[85%] break-words rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-sm"
									>
										<!-- markdown is escaped before transforms in renderMarkdown() -->
										{@html renderMarkdown(message.content)}
									</div>
								</div>
							{/if}
						{/each}

						{#if isThinking}
							<div class="flex items-start gap-2.5">
								<div
									class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
									style="background-color:#316DE4"
									aria-hidden="true"
								>
									AI
								</div>
								<div
									class="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3.5 shadow-sm"
								>
									<div class="flex items-center gap-1.5">
										<span class="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]"></span>
										<span class="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]"></span>
										<span class="h-2 w-2 animate-bounce rounded-full bg-slate-300"></span>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Composer -->
			<div class="border-t border-slate-200 px-5 py-4">
				{#if errorMsg}
					<div
						class="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
						role="alert"
					>
						<svg
							class="mt-0.5 shrink-0"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M12 8v4M12 16h.01" />
						</svg>
						<span>{errorMsg}</span>
					</div>
				{/if}

				{#if needsSignIn || !signedIn}
					<!-- Signed-out: the counselor API needs a session, so prompt Google
					     sign-in rather than fire a request that 401s. Free to chat after. -->
					<button
						type="button"
						onclick={() => signIn('google', { callbackUrl: '/pro' })}
						class="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#316DE4] hover:text-slate-900"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
							<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
							<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
							<path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
							<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
						</svg>
						Sign in with Google to chat free
					</button>
					<p class="mt-2 text-center text-[11px] text-slate-400">
						Free, no card. PredictAI remembers your profile and decisions once you're in.
					</p>
				{:else}
					<form
						onsubmit={handleSubmit}
						class="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-[#316DE4] focus-within:bg-white"
					>
						<textarea
							bind:this={textareaEl}
							bind:value={draft}
							oninput={autoGrow}
							onkeydown={handleKeydown}
							rows="1"
							placeholder="Message your AI Counselor…"
							disabled={isThinking}
							class="max-h-[200px] flex-1 resize-none bg-transparent py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
						></textarea>
						<button
							type="submit"
							disabled={isThinking || draft.trim() === ''}
							aria-label="Send message"
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white transition disabled:cursor-not-allowed disabled:opacity-40"
							style="background-color:#316DE4"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
							</svg>
						</button>
					</form>
					<div class="mt-2 flex items-center justify-center gap-x-3 gap-y-1 flex-wrap text-[11px] text-slate-400">
						<span>PredictAI can make mistakes. Verify details with official sources.</span>
						{#if embedded}
							<span class="text-slate-300">·</span>
							<a href="/essay-grader" class="font-semibold text-[#316DE4] hover:underline">
								Get your essay graded line-by-line →
							</a>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
