<script lang="ts">
	// Svelte Stores and Types
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import { page } from '$app/stores'; // <-- Added back for consistent structure
	
	// Shared Components and Configuration
	import AdmissionsPortalTemplate from '$lib/components/portal/AdmissionsPortalTemplate.svelte';
	import { schoolConfigs } from '$lib/config/schools';

	// Decision Components (Yale-specific or generic)
	import GenericAcceptedLetter from '$lib/components/portal/GenericAcceptedLetter.svelte';
	import GenericDeniedLetter from '$lib/components/portal/GenericDeniedLetter.svelte';
	import YaleAccepted from '$lib/components/yale/YaleAccepted.svelte';
	import YaleDenied from '$lib/components/yale/YaleDenied.svelte';

	// Define Letter Components structure for reuse
	type LetterComponents = {
		accepted: typeof GenericAcceptedLetter;
		denied: typeof GenericDeniedLetter;
	};

	// Register custom letters for Yale
	const letterComponentsBySlug: Record<string, LetterComponents> = {
		yale: {
			accepted: YaleAccepted,
			denied: YaleDenied
		}
	};

	const getLetterComponentsForSlug = (slug: string): LetterComponents => {
		return letterComponentsBySlug[slug] ?? {
			accepted: GenericAcceptedLetter,
			denied: GenericDeniedLetter
		};
	};

	// ----------------- STATE -----------------

	let profile: UserProfile = { name: '', email: '', password: '' };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;

	// Route + school state (adapted from the dynamic page structure)
	let currentSlug = 'yale'; // Hardcode slug for this specific +page.svelte file
	let school: (typeof schoolConfigs)['yale'] = schoolConfigs.yale; // Use the direct config
	let pageTitle = 'PredictAdmit – Yale Admissions Portal';

	// ----------------- REACTIVE DERIVATIONS -----------------

	$: profile = $userProfile;

	$: pageTitle = school
		? `${school.schoolName} Undergraduate Admissions Portal`
		: 'PredictAdmit – Unknown Portal';

	const applicantName = () => profile.name || 'Applicant';

	// ----------------- HANDLERS -----------------

	const handleLoadSavedLogin = () => {
		if (!profile.email || !profile.password) {
			error = 'No saved PredictAdmit login found. Please save it on the main page first.';
			return;
		}
		emailInput = profile.email;
		passwordInput = profile.password;
		error = '';
	};

	const handleLogin = (event: SubmitEvent) => {
		event.preventDefault();

		if (!school) {
			error = 'Unknown portal.';
			authenticated = false;
			return;
		}

		if (!profile.email || !profile.password) {
			error = 'Please set your PredictAdmit email and password on the main page.';
			authenticated = false;
			return;
		}

		if (emailInput.trim() === profile.email && passwordInput === profile.password) {
			authenticated = true;
			error = '';
		} else {
			error = 'Invalid email or password.';
			authenticated = false;
		}
	};

	const handleViewUpdate = () => {
		hasViewedUpdate = true;
	};
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<div class="min-h-screen bg-slate-200 text-slate-900 font-serif">
	{#if !authenticated}
		<header class="bg-white border-b border-slate-300">
			<div class="max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
				<div class="flex items-baseline gap-3">
					<span class="text-3xl font-serif" style={`color: ${school.primaryColor};`}>
						{school.logoPrimary}
					</span>
					<span class="text-[11px] tracking-[0.18em] uppercase text-slate-700">
						{school.logoSecondary}
					</span>
				</div>
				<div class="text-[11px] text-slate-700">
					{applicantName()}
				</div>
			</div>
			<div class="h-8" style={`background-color: ${school.primaryColor};`}></div>
		</header>

		<section class="bg-white">
			<div class="max-w-5xl mx-auto px-10 py-10">
				<h1 class="text-3xl font-normal mb-6">
					Login
				</h1>

				<div class="border border-lime-700 bg-lime-100 px-4 py-3 mb-8 text-[12px] text-slate-900">
					To log in, please enter your email address and password.
				</div>

				<form class="space-y-4 text-sm" on:submit={handleLogin}>
					{#if error}
						<p
							class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2"
							role="alert"
						>
							{error}
						</p>
					{/if}

					<div class="flex items-center gap-4">
						<label
							for="portal-email"
							class="w-32 text-[12px] font-semibold text-slate-900 text-right"
						>
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-4">
						<label
							for="portal-password"
							class="w-32 text-[12px] font-semibold text-slate-900 text-right"
						>
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a
							href="/disclaimer"
							class="text-[12px] text-blue-800 underline hover:no-underline"
						>
							Forgot Your Password?
						</a>
					</div>

					<div class="flex items-center gap-4 pt-4">
						<div class="w-32"></div>
						<div class="flex flex-wrap items-center gap-3">
							<button
								type="submit"
								class="border border-slate-500 bg-slate-300 px-4 py-1 text-[12px] font-semibold hover:bg-slate-400 active:bg-slate-500"
							>
								Login
							</button>
							<button
								type="button"
								class="border border-slate-400 bg-slate-100 px-3 py-1 text-[11px] hover:bg-slate-200 active:bg-slate-300"
								on:click={handleLoadSavedLogin}
							>
								Load saved PredictAdmit login
							</button>
						</div>
					</div>

					<p class="pt-4 text-[10px] leading-relaxed text-slate-600 max-w-xl">
						For this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</section>

		<footer class="mt-8">
			<div
				class="h-10 flex items-center"
				style={`background-color: ${school.primaryColor};`}
			>
				<div class="max-w-5xl mx-auto px-6 w-full flex items-center justify-between text-[11px] text-white">
					<span>&copy; {school.footerDomain} 2019</span>
					<span class="opacity-80">
						PredictAdmit.com simulation · Not affiliated with {school.schoolName}
					</span>
				</div>
			</div>
		</footer>
	{:else}
		{#if !hasViewedUpdate}
			<AdmissionsPortalTemplate
				logoPrimary={school.logoPrimary}
				logoSecondary={school.logoSecondary}
				schoolName={school.schoolName}
				primaryColor={school.primaryColor}
				applicantName={applicantName()}
				admissionsId={school.admissionsId}
				financialAidId={school.financialAidId}
				bannerText={school.bannerText}
				noticeText={school.noticeText}
				statusLastPosted={school.statusLastPosted}
				statusLinkLabel={school.statusLinkLabel}
				onViewUpdate={handleViewUpdate}
			>
				<h2 class="text-lg font-bold text-gray-800 mb-2">Application Updates and Questions</h2>
				<ul class="list-disc list-inside text-sm mb-4 pl-4 space-y-1">
					<li>
						<a href="#" class="text-blue-600 hover:underline">Update Application</a> - Use this form to notify Yale of changes or updates to your application.
					</li>
					<li>
						<a href="#" class="text-blue-600 hover:underline">Change Name or Phone Number</a> - Use this form to request a change of name or phone number.
					</li>
				</ul>
				<p class="text-sm mb-6">
					If you have a question that is not answered on our <a href="#" class="text-blue-600 hover:underline">website</a>, you may <a href="mailto:admissions@yale.edu" class="text-blue-600 hover:underline">email a question to the admissions office</a> or call 203-432-9300 Mon-Fri 8:30am-4:30pm.
				</p>

				<h2 class="text-lg font-bold text-gray-800 mb-2">Verify Address</h2>
				<p class="text-sm mb-4">We have your addresses listed as follows:</p>

				<div class="flex text-xs space-x-12">
					<div>
						<p class="font-bold mb-1">Mailing Address</p>
						<p>1600 Pennsylvania Ave</p>
						<p>Washington, DC 20500</p>
						<p>United States</p>
					</div>
					<div>
						<p class="font-bold mb-1">Permanent Address</p>
						<p>1600 Pennsylvania Ave</p>
						<p>Washington, DC 20500</p>
						<p>United States</p>
					</div>
				</div>
				<a href="#" class="text-blue-600 hover:underline text-sm mt-3 inline-block">Edit Addresses</a>

				<div class="mt-8 pt-4 border-t border-gray-300 flex justify-center space-x-6 text-xs">
					<a href="#" class="text-blue-600 hover:underline">Change Email Address</a>
					<a href="#" class="text-blue-600 hover:underline">Change Password</a>
					<a href="#" class="text-blue-600 hover:underline">Logout</a>
				</div>
			</AdmissionsPortalTemplate>
		{:else}
			{#key school.slug}
				{#if school.decision === 'admit'}
					<svelte:component
						this={getLetterComponentsForSlug(school.slug).accepted}
						applicantName={applicantName()}
						schoolName={school.schoolName}
						primaryColor={school.primaryColor}
						footerDomain={school.footerDomain}
					/>
				{:else}
					<svelte:component
						this={getLetterComponentsForSlug(school.slug).denied}
						applicantName={applicantName()}
						schoolName={school.schoolName}
						primaryColor={school.primaryColor}
						footerDomain={school.footerDomain}
					/>
				{/if}
			{/key}
		{/if}
	{/if}
</div>