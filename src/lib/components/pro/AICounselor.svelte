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
	let { embedded = false, signedIn = true }: { embedded?: boolean; signedIn?: boolean } = $props();

	// Legacy single-conversation key (migrated into a session on first load) and the
	// new multi-session history store.
	const STORAGE_KEY = 'predictadmit:pro:counselor';
	const SESSIONS_KEY = 'predictadmit:pro:counselor:sessions';

	type ChatSession = { id: string; title: string; messages: ChatMessage[]; updatedAt: number };

	const SUGGESTIONS = [
		'Rate my college list — no sugarcoating',
		"What's the hard truth about my chances?",
		'Paste my essay and tell me what is actually weak',
		'Should I apply Early Decision or Regular?',
		'What is secretly dragging my application down?',
		'Which of my activities are just résumé padding?'
	];

	let messages = $state<ChatMessage[]>([]);
	let sessions = $state<ChatSession[]>([]);
	let activeSessionId = $state<string | null>(null);
	let showHistory = $state(false); // mobile history drawer
	let draft = $state('');
	let isThinking = $state(false);
	let errorMsg = $state('');
	let needsSignIn = $state(false);
	let hydrated = $state(false);

	// Most-recent-first list for the history panel.
	let sortedSessions = $derived([...sessions].sort((a, b) => b.updatedAt - a.updatedAt));
	// Tappable multiple-choice chips the AI offers each turn (quiz / next steps) —
	// tapping one sends it, so the student answers without typing.
	let latestOptions = $state<string[]>([]);

	let scrollEl = $state<HTMLDivElement | null>(null);
	let textareaEl = $state<HTMLTextAreaElement | null>(null);

	function genId() {
		try {
			if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
		} catch {
			/* fall through */
		}
		return 'c-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
	}

	function titleFrom(msgs: ChatMessage[]): string {
		const first = msgs.find((m) => m.role === 'user');
		const t = (first?.content || 'New chat').trim().replace(/\s+/g, ' ');
		return t.length > 42 ? t.slice(0, 42) + '…' : t;
	}

	function validMsg(m: any): m is ChatMessage {
		return m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string';
	}

	function persistSessions() {
		try {
			window.localStorage.setItem(SESSIONS_KEY, JSON.stringify($state.snapshot(sessions)));
		} catch {
			// ignore storage errors
		}
	}

	// Fold the live conversation back into its session (lazily creating one once the
	// first message exists), then persist. Called explicitly after each turn so there
	// is no reactive write-loop on the sessions store.
	function syncActiveSession() {
		const snap = $state.snapshot(messages) as ChatMessage[];
		if (!snap.length) return;
		let id = activeSessionId;
		if (!id) {
			id = genId();
			activeSessionId = id;
		}
		const session: ChatSession = {
			id,
			title: titleFrom(snap),
			messages: snap,
			updatedAt: Date.now()
		};
		const idx = sessions.findIndex((s) => s.id === id);
		if (idx === -1) sessions = [session, ...sessions];
		else {
			const copy = [...sessions];
			copy[idx] = session;
			sessions = copy;
		}
		persistSessions();
	}

	// Load session history on mount, migrating any legacy single conversation.
	$effect(() => {
		if (hydrated) return;
		try {
			const rawSessions = window.localStorage.getItem(SESSIONS_KEY);
			if (rawSessions) {
				const parsed = JSON.parse(rawSessions);
				if (Array.isArray(parsed)) {
					sessions = parsed
						.filter((s) => s && typeof s.id === 'string' && Array.isArray(s.messages))
						.map((s) => ({
							id: s.id,
							title: typeof s.title === 'string' ? s.title : titleFrom(s.messages.filter(validMsg)),
							messages: s.messages.filter(validMsg),
							updatedAt: typeof s.updatedAt === 'number' ? s.updatedAt : 0
						}))
						.filter((s) => s.messages.length);
				}
			}
			// Migrate the old single-conversation store into a session.
			if (sessions.length === 0) {
				const raw = window.localStorage.getItem(STORAGE_KEY);
				if (raw) {
					const parsed = JSON.parse(raw);
					if (Array.isArray(parsed)) {
						const msgs = parsed.filter(validMsg);
						if (msgs.length) {
							sessions = [
								{ id: genId(), title: titleFrom(msgs), messages: msgs, updatedAt: Date.now() }
							];
							persistSessions();
						}
					}
					window.localStorage.removeItem(STORAGE_KEY);
				}
			}
			// Open the most recent session so the user resumes where they left off.
			if (sessions.length) {
				const latest = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt)[0];
				activeSessionId = latest.id;
				messages = [...latest.messages];
			}
		} catch {
			// ignore corrupt storage
		}
		hydrated = true;
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
		latestOptions = [];
		const outgoing: ChatMessage = { role: 'user', content };
		messages = [...messages, outgoing];
		syncActiveSession();
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
				errorMsg = data?.error || 'Something went wrong reaching your counselor. Please try again.';
			} else if (typeof data?.reply === 'string') {
				messages = [...messages, { role: 'assistant', content: data.reply }];
				syncActiveSession();
				latestOptions = Array.isArray(data?.options)
					? data.options.filter((o: unknown) => typeof o === 'string' && o.trim()).slice(0, 4)
					: [];
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
		// The prior conversation is already saved to its session on each turn, so a new
		// chat just starts a fresh (unsaved-until-first-message) thread.
		activeSessionId = null;
		messages = [];
		draft = '';
		errorMsg = '';
		latestOptions = [];
		showHistory = false;
		requestAnimationFrame(() => textareaEl?.focus());
	}

	function loadSession(id: string) {
		const s = sessions.find((x) => x.id === id);
		if (!s) return;
		activeSessionId = id;
		messages = [...s.messages];
		errorMsg = '';
		latestOptions = [];
		showHistory = false;
		requestAnimationFrame(() => {
			if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
		});
	}

	function deleteSession(id: string, e: Event) {
		e.stopPropagation();
		sessions = sessions.filter((s) => s.id !== id);
		persistSessions();
		if (activeSessionId === id) {
			activeSessionId = null;
			messages = [];
			latestOptions = [];
		}
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
		// Bold: **text** -> accent-blue strong, so key terms pop with colour
		// (the Appybara look) instead of flat grey text.
		return escaped.replace(
			/\*\*([^*]+)\*\*/g,
			'<strong class="font-semibold text-[#0c0c09]">$1</strong>'
		);
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
			class="relative flex {embedded
				? 'h-[520px] sm:h-[560px]'
				: 'h-[calc(100vh-8rem)] min-h-[560px]'} overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
		>
			{#if !embedded}
				<!-- Chat history drawer (persistent on md+, overlay on mobile) -->
				{#if showHistory}
					<button
						type="button"
						aria-label="Close history"
						class="absolute inset-0 z-20 bg-slate-900/30 md:hidden"
						onclick={() => (showHistory = false)}
					></button>
				{/if}
				<aside
					class="{showHistory
						? 'flex'
						: 'hidden'} absolute inset-y-0 left-0 z-30 w-64 flex-col border-r border-slate-200 bg-slate-50/80 md:static md:z-0 md:flex md:w-60"
				>
					<div class="p-3">
						<button
							type="button"
							onclick={newChat}
							class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0c0c09] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2b2b22]"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"><path d="M12 5v14M5 12h14" /></svg
							>
							New chat
						</button>
					</div>
					<p class="px-4 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
						History
					</p>
					<div class="flex-1 overflow-y-auto px-2 pb-3">
						{#if sortedSessions.length === 0}
							<p class="px-2 py-2 text-xs leading-relaxed text-slate-400">
								Your past chats show up here once you start one.
							</p>
						{:else}
							{#each sortedSessions as s (s.id)}
								<div class="group relative">
									<button
										type="button"
										onclick={() => loadSession(s.id)}
										class="flex w-full items-center gap-2 rounded-lg py-2 pl-2.5 pr-8 text-left text-[13px] font-medium transition {activeSessionId ===
										s.id
											? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
											: 'text-slate-600 hover:bg-white/70 hover:text-slate-900'}"
									>
										<svg
											class="h-3.5 w-3.5 shrink-0 text-slate-400"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											><path
												d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
											/></svg
										>
										<span class="truncate">{s.title}</span>
									</button>
									<button
										type="button"
										aria-label="Delete chat"
										onclick={(e) => deleteSession(s.id, e)}
										class="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-300 opacity-0 transition hover:bg-slate-200 hover:text-rose-500 focus:opacity-100 group-hover:opacity-100"
									>
										<svg
											class="h-3.5 w-3.5"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											><path
												d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
											/></svg
										>
									</button>
								</div>
							{/each}
						{/if}
					</div>
				</aside>
			{/if}
			<div class="flex min-w-0 flex-1 flex-col">
				<!-- Header -->
				<header class="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
					<div class="flex items-center gap-3">
						<div
							class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
							style="background-color:#0c0c09"
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
					<div class="flex items-center gap-2">
						{#if !embedded}
							<button
								type="button"
								onclick={() => (showHistory = !showHistory)}
								aria-label="Chat history"
								class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 md:hidden"
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
									><path d="M12 8v4l3 3M3.05 11a9 9 0 1 1 .5 4" /><path d="M3 4v4h4" /></svg
								>
								History
							</button>
						{/if}
						<button
							type="button"
							onclick={newChat}
							class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 {embedded
								? ''
								: 'md:hidden'}"
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
					</div>
				</header>

				<!-- Conversation / empty state -->
				<div bind:this={scrollEl} class="flex-1 min-h-0 overflow-y-auto px-5 py-6">
					{#if messages.length === 0 && !isThinking}
						<div
							class="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-2 text-center"
						>
							<div
								class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-base font-bold text-white shadow-sm"
								style="background-color:#0c0c09"
								aria-hidden="true"
							>
								AI
							</div>
							<h3 class="font-serif text-[28px] font-medium tracking-tight text-slate-900">
								Ask me anything.
							</h3>
							<p class="mt-2.5 max-w-sm text-[15px] leading-relaxed text-slate-500">
								The honest read on your list, your essays, and your real odds. No sugarcoating.
							</p>

							<div class="mt-7 flex flex-wrap items-center justify-center gap-2">
								{#each SUGGESTIONS as prompt}
									<button
										type="button"
										onclick={() => handleSuggestion(prompt)}
										class="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-600 shadow-sm transition hover:border-[#0c0c09] hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
									>
										{prompt}
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
											style="background-color:#0c0c09"
										>
											{message.content}
										</div>
									</div>
								{:else}
									<div class="flex items-start gap-2.5">
										<div
											class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
											style="background-color:#0c0c09"
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
										style="background-color:#0c0c09"
										aria-hidden="true"
									>
										AI
									</div>
									<div
										class="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3.5 shadow-sm"
									>
										<div class="flex items-center gap-1.5">
											<span
												class="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]"
											></span>
											<span
												class="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]"
											></span>
											<span class="h-2 w-2 animate-bounce rounded-full bg-slate-300"></span>
										</div>
									</div>
								</div>
							{/if}

							{#if latestOptions.length && !isThinking}
								<div class="ml-9 flex flex-wrap gap-2 pt-1">
									{#each latestOptions as opt}
										<button
											type="button"
											onclick={() => send(opt)}
											class="rounded-full border border-[color-mix(in_oklab,#0c0c09_20%,transparent)] bg-[color-mix(in_oklab,#0c0c09_7%,transparent)] px-3.5 py-1.5 text-sm font-medium text-[#0c0c09] transition hover:border-[#0c0c09] hover:bg-[#0c0c09] hover:text-white active:scale-[0.98]"
										>
											{opt}
										</button>
									{/each}
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
							class="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#0c0c09] hover:text-slate-900"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
								<path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
								/>
								<path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
								/>
								<path
									fill="#FBBC05"
									d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
								/>
								<path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
								/>
							</svg>
							Sign in with Google to chat free
						</button>
						<p class="mt-2 text-center text-[11px] text-slate-400">
							Free, no card. PredictAI remembers your profile and decisions once you're in.
						</p>
					{:else}
						<form
							onsubmit={handleSubmit}
							class="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-[#0c0c09] focus-within:bg-white"
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
								style="background-color:#0c0c09"
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
						<div
							class="mt-2 flex items-center justify-center gap-x-3 gap-y-1 flex-wrap text-[11px] text-slate-400"
						>
							<span>PredictAI can make mistakes. Verify details with official sources.</span>
							{#if embedded}
								<span class="text-slate-300">·</span>
								<a href="/essay-grader" class="font-semibold text-[#0c0c09] hover:underline">
									Get your essay graded line-by-line →
								</a>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
