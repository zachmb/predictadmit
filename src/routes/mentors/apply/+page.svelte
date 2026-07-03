<script lang="ts">
	import { mentorSchools, eduDomainFor } from '$lib/config/counselors';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';

	const schools = Array.from(new Set(mentorSchools.map((s) => s.name)));

	type Step = 'basics' | 'enroll' | 'identity' | 'done';
	let step = $state<Step>('basics');

	// basics
	let name = $state('');
	let school = $state('');
	let major = $state('');
	let gradYear = $state('');

	const domain = $derived(school ? eduDomainFor(school) : null);

	// enrollment (.edu OTP)
	let email = $state('');
	let token = $state('');
	let code = $state('');
	let codeSent = $state(false);
	let sending = $state(false);
	let verifying = $state(false);
	let enrollError = $state('');
	let devCode = $state('');
	let verified = $state(false);
	let verifiedDomain = $state('');

	// identity (optional upgrade)
	let idName = $state('');
	let selfieName = $state('');
	let attest = $state(false);
	let submitting = $state(false);

	async function sendCode() {
		enrollError = '';
		sending = true;
		try {
			const res = await fetch('/api/mentor-verify', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ action: 'send', email, school })
			});
			const data = await res.json();
			if (!res.ok) {
				enrollError = data?.error || 'Could not send a code.';
				return;
			}
			token = data.token;
			codeSent = true;
			devCode = data.devCode || '';
		} catch {
			enrollError = 'Network error — try again.';
		} finally {
			sending = false;
		}
	}

	async function verifyCode() {
		enrollError = '';
		verifying = true;
		try {
			const res = await fetch('/api/mentor-verify', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ action: 'verify', email, code, token, school })
			});
			const data = await res.json();
			if (!res.ok || !data?.verified) {
				enrollError = data?.error || 'That code is incorrect.';
				return;
			}
			verified = true;
			verifiedDomain = data.domain || domain || '';
			step = 'identity';
		} catch {
			enrollError = 'Network error — try again.';
		} finally {
			verifying = false;
		}
	}

	function onFile(e: Event, which: 'id' | 'selfie') {
		const f = (e.currentTarget as HTMLInputElement).files?.[0];
		if (which === 'id') idName = f?.name ?? '';
		else selfieName = f?.name ?? '';
	}

	async function submit() {
		submitting = true;
		// The identity docs would upload to a KYC vendor / review queue here.
		await new Promise((r) => setTimeout(r, 500));
		submitting = false;
		step = 'done';
	}

	const canBasics = $derived(!!(name.trim() && school && major.trim() && gradYear.trim()));
</script>

<svelte:head>
	<title>Become a PredictAdmit Mentor — Get Verified</title>
	<meta
		name="description"
		content="Apply to mentor students on PredictAdmit. We verify current enrollment at your Top-20 via your school-issued .edu email — no portal screenshots accepted."
	/>
</svelte:head>

<main class="min-h-screen bg-slate-50 font-sans text-slate-900">
	<div class="mx-auto max-w-2xl px-6 py-12">
		<a href="/pro" class="text-sm font-semibold text-slate-500 hover:text-slate-800">← Back to Pro</a>
		<h1 class="mt-4 text-3xl font-black tracking-tight md:text-4xl">Become a verified mentor</h1>
		<p class="mt-2 text-slate-600">
			Students pay for the real thing, so we verify it. We confirm you're currently enrolled at your
			university through your official <span class="font-semibold">.edu email</span> — the same way
			employers verify students.
		</p>

		<!-- Anti-fraud notice -->
		<div class="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
			<svg class="mt-0.5 h-5 w-5 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
			<p>
				<span class="font-bold">We never accept applicant-portal screenshots or decision letters as proof</span>
				— including ones generated on PredictAdmit. Enrollment is verified only through your
				school-issued email (and, optionally, a student ID + selfie).
			</p>
		</div>

		<!-- Stepper -->
		<ol class="mt-8 flex items-center gap-2 text-xs font-semibold">
			{#each [['basics', 'About you'], ['enroll', 'Verify enrollment'], ['identity', 'Identity (optional)']] as [key, label], i}
				{@const states = ['basics', 'enroll', 'identity', 'done']}
				{@const done = states.indexOf(step) > states.indexOf(key as Step)}
				{@const activeStep = step === key}
				<li class="flex items-center gap-2">
					<span class="grid h-6 w-6 place-items-center rounded-full text-[11px] {done ? 'bg-emerald-500 text-white' : activeStep ? 'bg-[#0052CC] text-white' : 'bg-slate-200 text-slate-500'}">
						{done ? '✓' : i + 1}
					</span>
					<span class={activeStep ? 'text-slate-900' : 'text-slate-400'}>{label}</span>
					{#if i < 2}<span class="mx-1 h-px w-5 bg-slate-200"></span>{/if}
				</li>
			{/each}
		</ol>

		<div class="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
			{#if step === 'basics'}
				<h2 class="text-lg font-bold">About you</h2>
				<div class="mt-4 space-y-4">
					<label class="block">
						<span class="mb-1 block text-sm font-semibold text-slate-700">Full name</span>
						<input bind:value={name} class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-[#0052CC] focus:outline-none" placeholder="Alex Rivera" />
					</label>
					<label class="block">
						<span class="mb-1 block text-sm font-semibold text-slate-700">Your university</span>
						<select bind:value={school} class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-[#0052CC] focus:outline-none">
							<option value="">Select…</option>
							{#each schools as s}<option value={s}>{s}</option>{/each}
						</select>
						{#if domain}<span class="mt-1 block text-xs text-slate-400">We'll verify a code sent to your <b>@{domain}</b> address.</span>{/if}
					</label>
					<div class="grid grid-cols-2 gap-3">
						<label class="block">
							<span class="mb-1 block text-sm font-semibold text-slate-700">Major</span>
							<input bind:value={major} class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-[#0052CC] focus:outline-none" placeholder="Economics" />
						</label>
						<label class="block">
							<span class="mb-1 block text-sm font-semibold text-slate-700">Grad year</span>
							<input bind:value={gradYear} class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-[#0052CC] focus:outline-none" placeholder="2029" />
						</label>
					</div>
				</div>
				<button onclick={() => (step = 'enroll')} disabled={!canBasics} class="mt-6 w-full rounded-xl bg-[#0052CC] px-4 py-3 text-sm font-bold text-white hover:bg-[#0047b3] disabled:opacity-50">
					Continue
				</button>
			{:else if step === 'enroll'}
				<h2 class="text-lg font-bold">Verify your enrollment</h2>
				<p class="mt-1 text-sm text-slate-500">Enter your official <b>@{domain}</b> email. We'll send a 6-digit code.</p>
				<div class="mt-4 space-y-3">
					<div class="flex gap-2">
						<input bind:value={email} type="email" placeholder={`you@${domain}`} class="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-[#0052CC] focus:outline-none" />
						<button onclick={sendCode} disabled={sending || !email} class="whitespace-nowrap rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
							{sending ? 'Sending…' : codeSent ? 'Resend' : 'Send code'}
						</button>
					</div>
					{#if codeSent}
						<div class="rounded-xl bg-slate-50 p-3">
							{#if devCode}
								<p class="mb-2 text-xs text-slate-500">Preview mode (no email provider connected): your code is <b class="text-slate-800">{devCode}</b>.</p>
							{:else}
								<p class="mb-2 text-xs text-slate-500">We sent a code to your inbox. Enter it below.</p>
							{/if}
							<div class="flex gap-2">
								<input bind:value={code} inputmode="numeric" maxlength="6" placeholder="123456" class="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-center text-lg tracking-[0.4em] focus:border-[#0052CC] focus:outline-none" />
								<button onclick={verifyCode} disabled={verifying || code.length < 6} class="whitespace-nowrap rounded-xl bg-[#0052CC] px-4 text-sm font-bold text-white hover:bg-[#0047b3] disabled:opacity-50">
									{verifying ? 'Verifying…' : 'Verify'}
								</button>
							</div>
						</div>
					{/if}
					{#if enrollError}<p class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{enrollError}</p>{/if}
				</div>
				<button onclick={() => (step = 'basics')} class="mt-4 text-sm font-semibold text-slate-500 hover:text-slate-800">← Back</button>
			{:else if step === 'identity'}
				<div class="flex items-center gap-2">
					<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
						<svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clip-rule="evenodd"/></svg>
						Enrollment verified · {verifiedDomain}
					</span>
				</div>
				<h2 class="mt-3 text-lg font-bold">Add an identity check (optional)</h2>
				<p class="mt-1 text-sm text-slate-500">
					Upload your student ID and a selfie to earn an <b>ID-verified</b> badge (higher trust, more bookings). Reviewed by our team; never shown publicly.
				</p>
				<div class="mt-4 grid gap-3 sm:grid-cols-2">
					<label class="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-5 text-center hover:border-[#0052CC]">
						<span class="text-sm font-semibold text-slate-700">Student ID</span>
						<span class="mt-1 text-xs text-slate-400">{idName || 'Tap to upload'}</span>
						<input type="file" accept="image/*" class="hidden" onchange={(e) => onFile(e, 'id')} />
					</label>
					<label class="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-5 text-center hover:border-[#0052CC]">
						<span class="text-sm font-semibold text-slate-700">Selfie</span>
						<span class="mt-1 text-xs text-slate-400">{selfieName || 'Tap to upload'}</span>
						<input type="file" accept="image/*" capture="user" class="hidden" onchange={(e) => onFile(e, 'selfie')} />
					</label>
				</div>
				<label class="mt-5 flex items-start gap-2 text-sm text-slate-600">
					<input type="checkbox" bind:checked={attest} class="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0052CC]" />
					<span>
						I confirm I'm currently enrolled at {school} and that every admit I list is truthful. I understand that portal screenshots or PredictAdmit-generated letters are <b>not</b> accepted as proof, and that misrepresentation removes me from the platform.
					</span>
				</label>
				<button onclick={submit} disabled={!attest || submitting} class="mt-5 w-full rounded-xl bg-[#0052CC] px-4 py-3 text-sm font-bold text-white hover:bg-[#0047b3] disabled:opacity-50">
					{submitting ? 'Submitting…' : idName && selfieName ? 'Submit application' : 'Submit (enrollment-verified only)'}
				</button>
			{:else}
				<div class="py-6 text-center">
					<div class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
						<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
					</div>
					<h2 class="mt-4 text-xl font-bold">Application received</h2>
					<p class="mx-auto mt-2 max-w-sm text-sm text-slate-500">
						Your enrollment at <b>{school}</b> is verified via {verifiedDomain}.
						{#if idName && selfieName}Your ID check is in review (usually &lt;48h).{/if}
						We'll email you to finish your public profile and set your rates.
					</p>
					<a href="/pro" class="mt-5 inline-block rounded-xl bg-[#0052CC] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0047b3]">Back to Pro</a>
				</div>
			{/if}
		</div>
	</div>
	<SiteFooter />
</main>
