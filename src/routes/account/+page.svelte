<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SettingsView from '$lib/components/pro/SettingsView.svelte';

	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	$: session = $page.data.session;
	$: isSignedIn = !!session;

	const handleGoogleSignIn = () => {
		signIn('google');
	};
</script>

<svelte:head>
	<title>Account - PredictAdmit</title>
</svelte:head>

{#if !isSignedIn}
	<div class="min-h-[calc(100vh-64px)] flex flex-col md:flex-row bg-paper">
		<!-- Left: sign-in (auth) -->
		<main
			class="w-full md:w-1/2 lg:w-[45%] flex items-center justify-center p-6 sm:p-12 min-h-[calc(100vh-64px)] md:min-h-0 bg-paper"
		>
			<div class="w-full max-w-[400px]">
				<a href="/" class="inline-flex items-center gap-2.5">
					<span class="grid h-9 w-9 place-items-center rounded-xl bg-blue text-white shadow-sm">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
							<path d="M4 18h16l-3-4H7l-3 4z" />
							<path d="M7 12h10l-2-3H9l-2 3z" />
							<path d="M9 7h6l-1.5-2h-3L9 7z" />
						</svg>
					</span>
					<span class="text-lg font-display text-navy">predictadmit</span>
				</a>

				<h1 class="mt-10 text-[28px] font-display text-navy">
					Sign in to PredictAdmit
				</h1>
				<p class="mt-2 text-[15px] leading-relaxed text-muted">
					Pick up where you left off. One tap with Google, and you're back in your inbox of
					decisions.
				</p>

				<button
					on:click={handleGoogleSignIn}
					class="btn btn-primary btn-block mt-8 flex items-center justify-center gap-2.5"
				>
					<span class="grid h-5 w-5 place-items-center rounded-full bg-white">
						<svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
							<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
							<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
							<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
							<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
						</svg>
					</span>
					Continue with Google
				</button>

				<p class="mt-4 text-[13px] leading-relaxed text-muted">
					PredictAdmit uses Google sign-in only. No passwords to create or remember.
				</p>

				<p class="mt-10 text-[12px] leading-[1.6] text-muted">
					By continuing you agree to our
					<a href="/terms" class="font-medium text-blue hover:underline">Terms</a> and
					<a href="/privacy" class="font-medium text-blue hover:underline">Privacy Policy</a>.
				</p>
			</div>
		</main>

		<!-- Right: brand-blue product preview (the decision inbox). Hidden on mobile. -->
		<div
			class="hidden md:flex md:w-1/2 lg:w-[55%] relative overflow-hidden cta-band flex-col justify-center p-12 lg:p-16"
		>
			<div class="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
			<div class="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-black/10 blur-3xl"></div>

			<div class="relative z-10 max-w-md">
				<h2 class="text-white text-3xl lg:text-[38px] font-display leading-[1.1]">
					Perfect your applications before it's too late.
				</h2>
				<p class="mt-3 text-cyan text-base leading-relaxed">
					Your real decision at every top school, in one inbox: accept, deny, or waitlist. Then the
					one thing to fix, while you still have months to fix it.
				</p>

				<div class="mt-8 space-y-3">
					<div class="flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-xl">
						<div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue text-sm font-black text-white">S</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-bold text-navy">Stanford University</p>
							<p class="truncate text-xs text-muted">Your predicted decision</p>
						</div>
						<span class="shrink-0 rounded-full bg-blue px-2.5 py-1 text-[11px] font-bold text-white">Admitted</span>
					</div>
					<div class="ml-6 flex items-center gap-3 rounded-2xl bg-card/95 p-3.5 shadow-lg">
						<div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-yellow text-sm font-black text-navy">M</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-bold text-navy">MIT</p>
							<p class="truncate text-xs text-muted">Your predicted decision</p>
						</div>
						<span class="shrink-0 rounded-full bg-yellow px-2.5 py-1 text-[11px] font-bold text-navy">Waitlist</span>
					</div>
					<div class="flex items-center gap-3 rounded-2xl bg-card/90 p-3.5 shadow-md">
						<div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-paper-deep text-sm font-black text-navy">Y</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-bold text-navy">Yale University</p>
							<p class="truncate text-xs text-muted">Your predicted decision</p>
						</div>
						<span class="shrink-0 rounded-full bg-stamp-red px-2.5 py-1 text-[11px] font-bold text-white">Denied</span>
					</div>
				</div>
			</div>

			<div class="relative z-10 mt-12 flex items-center gap-2 text-white/90">
				<span class="text-lg font-semibold tracking-tight">predictadmit</span>
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-[calc(100vh-64px)] pa-grid flex flex-col">
		<SettingsView />
		<SiteFooter />
	</div>
{/if}
