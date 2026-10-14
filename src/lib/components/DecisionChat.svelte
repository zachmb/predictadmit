<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import { aiResults } from '$lib/stores/results';

	// A compact, reusable follow-up chat grounded in ONE predicted decision. Drops
	// onto any decision-read surface (results/[slug], the /ai deep-dive card) and
	// lets the student ask PredictAI why they got that call and how to move it.
	// Reuses the same /api/ai/counselor brain as the Pro AI Counselor, but passes
	// the on-screen decision so answers are scoped to this school.

	type ChatMessage = { role: 'user' | 'assistant'; content: string };

	// The decision shape lines up with AiDecision on the /ai page and the
	// per-slug stores the results page reads — every field is optional so a
	// partially-loaded decision still renders a working chat.
	type Decision = {
		school?: string;
		slug?: string;
		outcome?: string;
		academic_score?: number;
		academic_explanation?: string;
		extracurricular_score?: number;
		extracurricular_explanation?: string;
		intellectual_score?: number;
		intellectual_explanation?: string;
		character_score?: number;
		character_explanation?: string;
		fit_score?: number;
		fit_explanation?: string;
		improvement_tips?: string;
	};

	let { decision }: { decision: Decision } = $props();

	const slug = $derived(decision?.slug || decision?.school || 'decision');
	const school = $derived(decision?.school || 'this school');
	// Conversation is persisted PER SCHOOL so each decision keeps its own thread
	// across reloads — like the rest of the app's data.
	const storageKey = $derived(`predictadmit:decisionchat:${slug}`);

	const outcomeWord = $derived(String(decision?.outcome || '').toLowerCase());
	const suggestions = $derived([
		outcomeWord === 'admit'
			? `Why did I get in to ${school}?`
			: outcomeWord === 'deny'
				? `Why was I denied from ${school}?`
				: `Why did I get this call from ${school}?`,
		outcomeWord === 'admit'
			? `How do I make sure I stay competitive?`
			: `What would flip this to an admit?`,
		`What's my weakest dimension here, and how do I fix it?`,
		`What should I focus on before I apply?`
	]);

	let messages = $state<ChatMessage[]>([]);
	let draft = $state('');
	let isThinking = $state(false);
	let errorMsg = $state('');
	let loadedKey = $state('');
	// Tappable multiple-choice chips the AI offers each turn (tap = send it).
	let latestOptions = $state<string[]>([]);

	let scrollEl = $state<HTMLDivElement | null>(null);
	let textareaEl = $state<HTMLTextAreaElement | null>(null);

	// Load this school's persisted thread whenever the slug changes.
	$effect(() => {
		const key = storageKey;
		if (loadedKey === key) return;
		let restored: ChatMessage[] = [];
		try {
			const raw = window.localStorage.getItem(key);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) {
					restored = parsed.filter(
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
		messages = restored;
		loadedKey = key;
	});

	// Persist after every change (only once the current slug's thread is loaded).
	$effect(() => {
		if (loadedKey !== storageKey) return;
		const snapshot = $state.snapshot(messages);
		try {
			window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
		} catch {
			// ignore storage errors
		}
	});

	// Auto-scroll to the newest message.
	$effect(() => {
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
			major: u.stats?.major,
			applicationProfile: { ...u.applicationProfile },
			schoolList: u.schoolList.map((s) => ({
				slug: s.slug,
				name: s.name,
				status: s.status,
				deadline: s.deadline
			}))
		};
	}

	// The student's full predicted slate — so PredictAI remembers their whole
	// picture even inside a single-decision follow-up.
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

		errorMsg = '';
		latestOptions = [];
		messages = [...messages, { role: 'user', content }];
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
					decision,
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

			const data = await res.json().catch(() => ({}));

			if (!res.ok || data?.error) {
				errorMsg = data?.error || 'Something went wrong reaching PredictAI. Please try again.';
			} else if (typeof data?.reply === 'string') {
				messages = [...messages, { role: 'assistant', content: data.reply }];
				latestOptions = Array.isArray(data?.options)
					? data.options.filter((o: unknown) => typeof o === 'string' && o.trim()).slice(0, 4)
					: [];
			} else {
				errorMsg = 'PredictAI returned an empty response. Please try again.';
			}
		} catch {
			errorMsg = 'Network error. Check your connection and try again.';
		} finally {
			isThinking = false;
			requestAnimationFrame(() => textareaEl?.focus());
		}
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
		textareaEl.style.height = Math.min(textareaEl.scrollHeight, 160) + 'px';
	}

	function clearThread() {
		messages = [];
		draft = '';
		errorMsg = '';
		try {
			window.localStorage.removeItem(storageKey);
		} catch {
			// ignore
		}
		requestAnimationFrame(() => textareaEl?.focus());
	}

	// --- Safe light-markdown rendering (mirrors AICounselor) ------------------
	function escapeHtml(str: string): string {
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function inlineFormat(escaped: string): string {
		// Accent-blue bold so key terms pop with colour (the Appybara look).
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

<div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
	<header class="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
		<div class="flex items-center gap-3">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
				style="background-color:#0c0c09"
				aria-hidden="true"
			>
				AI
			</div>
			<div class="leading-tight">
				<h3 class="text-base font-semibold text-slate-900">Ask PredictAI about this decision</h3>
				<p class="text-xs text-slate-500">Follow-up questions about your {school} prediction.</p>
			</div>
		</div>
		{#if messages.length > 0}
			<button
				type="button"
				onclick={clearThread}
				class="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
			>
				Clear
			</button>
		{/if}
	</header>

	<div bind:this={scrollEl} class="max-h-[420px] min-h-[120px] overflow-y-auto px-5 py-5">
		{#if messages.length === 0 && !isThinking}
			<div class="space-y-3">
				<p class="text-sm text-slate-500">
					This is a PredictAdmit simulation, not a real decision. Ask why you got this call, or what
					would move it:
				</p>
				<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
					{#each suggestions as prompt}
						<button
							type="button"
							onclick={() => send(prompt)}
							class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0c0c09] hover:text-slate-900 hover:shadow"
						>
							{prompt}
						</button>
					{/each}
				</div>
			</div>
		{:else}
			<div class="flex flex-col gap-4">
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
						<div class="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
							<div class="flex items-center gap-1.5">
								<span class="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]"></span>
								<span class="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]"></span>
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
								class="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-[#0c0c09] transition hover:border-[#0c0c09] hover:bg-[#0c0c09] hover:text-white active:scale-[0.98]"
							>
								{opt}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="border-t border-slate-100 px-5 py-4">
		{#if errorMsg}
			<div
				class="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
				role="alert"
			>
				<span>{errorMsg}</span>
			</div>
		{/if}

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
				placeholder="Ask a follow-up about this decision…"
				disabled={isThinking}
				class="max-h-[160px] flex-1 resize-none bg-transparent py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
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
		<p class="mt-2 text-[11px] text-slate-400">
			PredictAI can make mistakes, and this is a simulation — not a real admissions decision.
		</p>
	</div>
</div>
