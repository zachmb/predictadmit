<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import Card from '$lib/components/common/Card.svelte';

	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { userProfile } from '$lib/stores/user';

	$: session = $page.data.session;
	$: isSignedIn = !!session;
	$: userEmail = session?.user?.email || '';
	$: userName = session?.user?.name || '';
	$: userImage = session?.user?.image || '';

	$: subscriptionStatus = $userProfile.isPro ? 'pro' : 'free';

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

{#if !isSignedIn}
	<div class="min-h-[calc(100vh-64px)] flex flex-col md:flex-row bg-white">
		<!-- Left Side - Brand Display (Hidden mobile, ~45% width desktop) -->
		<div
			class="hidden md:flex md:w-[45%] lg:w-[42%] bg-gradient-to-br from-[#3b1b85] via-[#522eae] to-[#6c40db] relative overflow-hidden flex-col justify-center p-12 lg:p-16 xl:p-20"
		>
			<!-- Decorative Background Waves -->
			<div class="absolute inset-0 opacity-15 pointer-events-none">
				<svg
					class="absolute top-0 right-[-10%] w-[150%] h-[150%] transform -rotate-12"
					viewBox="0 0 1440 320"
					preserveAspectRatio="none"
				>
					<path
						fill="#ffffff"
						fill-opacity="1"
						d="M0,96L80,112C160,128,320,160,480,149.3C640,139,800,85,960,101.3C1120,117,1280,203,1360,245.3L1440,288L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
					></path>
				</svg>
				<svg
					class="absolute bottom-0 left-[-20%] w-[200%] h-[60%] transform rotate-6 scale-125"
					viewBox="0 0 1440 320"
					preserveAspectRatio="none"
				>
					<path
						fill="#000000"
						fill-opacity="0.2"
						d="M0,288L60,266.7C120,245,240,203,360,208C480,213,600,267,720,266.7C840,267,960,213,1080,181.3C1200,149,1320,139,1380,133.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
					></path>
				</svg>
			</div>

			<!-- Main Brand Content -->
			<div class="relative z-10 w-full flex-1 flex flex-col justify-center">
				<h1 class="text-white text-4xl lg:text-[44px] font-medium leading-[1.2] tracking-tight">
					Register for PredictAdmit<span class="text-blue-300">!</span>
				</h1>
			</div>

			<!-- Bottom Logo -->
			<div class="relative z-10 flex items-center gap-2 mt-auto text-white/90">
				<!-- PredictAdmit stacked logo style from screenshot -->
				<div class="flex items-center gap-2">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-white">
						<path d="M4 18h16l-3-4H7l-3 4z" fill="currentColor" />
						<path d="M7 12h10l-2-3H9l-2 3z" fill="currentColor" />
						<path d="M9 7h6l-1.5-2h-3L9 7z" fill="currentColor" />
					</svg>
					<span class="font-semibold text-lg tracking-tight">predictadmit</span>
				</div>
			</div>
		</div>

		<!-- Right Side - Sign Up Form Container -->
		<main
			class="w-full md:w-[55%] lg:w-[58%] flex items-center justify-center p-6 sm:p-12 min-h-[calc(100vh-64px)] md:min-h-0 bg-white"
		>
			<div class="w-full max-w-[440px] flex flex-col relative bottom-[5%]">
				<!-- Header -->
				<div class="mb-8">
					<h2 class="text-[28px] font-normal text-slate-800 tracking-tight mb-2">
						Sign in to PredictAdmit
					</h2>
					<p class="text-[15px] text-slate-600">One tap with Google — we don't do passwords.</p>
				</div>

					<!-- Google-only auth -->
					<div class="space-y-5">
						<button
							on:click={handleGoogleSignIn}
							class="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-[6px] transition-colors flex items-center justify-center gap-2.5 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
						>
							<svg class="w-5 h-5" viewBox="0 0 24 24">
								<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
								<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
								<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
								<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
							</svg>
							Continue with Google
						</button>

						<p class="text-[13px] text-slate-500 text-center leading-relaxed">
							PredictAdmit uses Google sign-in only — no passwords to create or remember.
						</p>

						<p class="text-[12px] text-slate-400 text-center leading-[1.6]">
							By continuing you agree to our
							<a href="/terms" class="text-[#7A52E1] hover:underline">Terms</a> and
							<a href="/privacy" class="text-[#7A52E1] hover:underline">Privacy Policy</a>.
						</p>
			</div>
		</main>
	</div>
{:else}
	<div class="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col">
		<main class="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
			<h1 class="text-4xl font-bold text-slate-900 mb-8">Account Settings</h1>

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
		</main>

		<SiteFooter />
	</div>
{/if}
