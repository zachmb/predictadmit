<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import Card from '$lib/components/common/Card.svelte';

	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	$: session = $page.data.session;
	$: isSignedIn = !!session;
	$: userEmail = session?.user?.email || '';
	$: userName = session?.user?.name || '';
	$: userImage = session?.user?.image || '';

	let subscriptionStatus: 'free' | 'pro' = 'free';

	const handleGoogleSignIn = () => {
		signIn('google');
	};

	const handleSignOut = () => {
		signOut();
	};
</script>

<svelte:head>
	<title>Account - PredictAdmit</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 flex flex-col">
	<main class="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
		<h1 class="text-4xl font-bold text-slate-900 mb-8">Account Settings</h1>

		{#if !isSignedIn}
			<!-- Not signed in -->
			<Card class="bg-white border-slate-200">
				<div class="p-8 text-center space-y-6">
					<div class="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center">
						<svg
							class="w-8 h-8 text-slate-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>

					<h2 class="text-2xl font-bold text-slate-900">Sign in to your account</h2>
					<p class="text-slate-600">
						Access your subscription, saved data, and personalized features
					</p>

					<button
						on:click={handleGoogleSignIn}
						class="inline-flex items-center gap-3 bg-white border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
					>
						<svg class="w-5 h-5" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Sign in with Google
					</button>

					<p class="text-xs text-slate-500">
						By signing in, you agree to our Terms of Service and Privacy Policy
					</p>
				</div>
			</Card>
		{:else}
			<!-- Signed in -->
			<div class="space-y-6">
				<!-- Profile Card -->
				<Card class="bg-white border-slate-200">
					<div class="p-6">
						<h2 class="text-xl font-bold text-slate-900 mb-4">Profile</h2>
						<div class="flex items-center gap-4">
							{#if userImage}
								<img
									src={userImage}
									alt={userName}
									class="w-16 h-16 rounded-full border border-slate-200"
								/>
							{:else}
								<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
									<span class="text-2xl font-bold text-blue-600">{userName.charAt(0)}</span>
								</div>
							{/if}
							<div>
								<p class="font-semibold text-slate-900">{userName}</p>
								<p class="text-sm text-slate-600">{userEmail}</p>
							</div>
						</div>
						<button
							on:click={handleSignOut}
							class="mt-4 text-sm text-red-600 hover:text-red-700 font-semibold"
						>
							Sign Out
						</button>
					</div>
				</Card>

				<!-- Subscription Card -->
				<Card class="bg-white border-slate-200">
					<div class="p-6">
						<h2 class="text-xl font-bold text-slate-900 mb-4">Subscription</h2>
						<div class="flex items-center justify-between">
							<div>
								<p class="font-semibold text-slate-900 capitalize">{subscriptionStatus} Plan</p>
								<p class="text-sm text-slate-600">
									{#if subscriptionStatus === 'free'}
										Upgrade to Pro for AI-powered predictions
									{:else}
										Access to all Pro features
									{/if}
								</p>
							</div>
							{#if subscriptionStatus === 'free'}
								<a
									href="/ai"
									class="inline-flex items-center justify-center font-bold text-sm bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
								>
									Upgrade to Pro
								</a>
							{/if}
						</div>
					</div>
				</Card>
			</div>
		{/if}
	</main>

	<SiteFooter />
</div>
