<script lang="ts">
	import { userProfile } from '$lib/stores/user';

	type ChatMessage = { role: 'user' | 'assistant'; content: string };

	const STORAGE_KEY = 'predictadmit:pro:counselor';

	const SUGGESTIONS = [
		'Rate my college list',
		'How do I stand out as an applicant?',
		'What are the best extracurriculars for my major?',
		'Should I apply Early Decision or Regular?',
		'How can I improve my activities list?',
		'Help me brainstorm my personal statement'
	];

	let messages = $state<ChatMessage[]>([]);
	let draft = $state('');
	let isThinking = $state(false);
	let errorMsg = $state('');
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
			applicationProfile: { ...u.applicationProfile },
			schoolList: u.schoolList.map((s) => ({
				slug: s.slug,
				name: s.name,
				status: s.status,
				deadline: s.deadline
			}))
		};
	}

	async function send(text: string) {
		const content = text.trim();
		if (!content || isThinking) return;

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
					academics: (() => {
						try {
							return JSON.parse(localStorage.getItem('predictadmit:pro:academics') || '{}');
						} catch {
							return {};
						}
					})()
				})
			});

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
			errorMsg = 'Network error — check your connection and try again.';
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

<div class="flex-1 min-h-0 overflow-y-auto bg-slate-50">
	<div class="max-w-6xl mx-auto px-6 md:px-10 py-8">
		<div
			class="flex h-[calc(100vh-8rem)] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
		>
			<!-- Header -->
			<header
				class="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
						style="background-color:#0052CC"
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
							style="background-color:#0052CC"
							aria-hidden="true"
						>
							AI
						</div>
						<h3 class="text-xl font-semibold text-slate-900">How can I help you today?</h3>
						<p class="mt-2 text-sm text-slate-500">
							Ask me anything about your college list, essays, activities, or admissions
							strategy.
						</p>

						<div class="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
							{#each SUGGESTIONS as prompt}
								<button
									type="button"
									onclick={() => handleSuggestion(prompt)}
									class="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0052CC] hover:text-slate-900 hover:shadow"
								>
									<span
										class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0052CC] transition group-hover:bg-[#0052CC] group-hover:text-white"
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
										style="background-color:#0052CC"
									>
										{message.content}
									</div>
								</div>
							{:else}
								<div class="flex items-start gap-2.5">
									<div
										class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
										style="background-color:#0052CC"
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
									style="background-color:#0052CC"
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

				<form
					onsubmit={handleSubmit}
					class="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-[#0052CC] focus-within:bg-white"
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
						style="background-color:#0052CC"
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
				<p class="mt-2 text-center text-[11px] text-slate-400">
					PredictAI can make mistakes. Verify deadlines and details with official sources.
				</p>
			</div>
		</div>
	</div>
</div>
