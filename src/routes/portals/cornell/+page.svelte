<script lang="ts">
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';

	// School Config
	import { schoolConfigs } from '$lib/config/schools';

	// Cornell Specific Components
	import CornellAccepted from '$lib/components/cornell/CornellAccepted.svelte';
	import CornellDenied from '$lib/components/cornell/CornellDenied.svelte';

	// ----------------- CONFIGURATION -----------------

	const SLUG = 'cornell';
	const school = schoolConfigs[SLUG];

	// ----------------- STATE -----------------

	let profile: UserProfile = { name: '', email: '', password: '' };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;

	// ----------------- REACTIVE DERIVATIONS -----------------

	$: profile = $userProfile;
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
	<title>{school.schoolName} Undergraduate Admissions Portal</title>
</svelte:head>

<div class="min-h-screen font-sans text-slate-900 bg-[#f7f7f7]">
	{#if !authenticated}
		<header class="bg-white border-b border-slate-300">
			<div class="max-w-4xl mx-auto px-6 pt-4 pb-2 flex items-baseline justify-between">
				<div class="flex items-end gap-3">
					<span class="text-3xl font-serif font-bold text-[#B31B1B]">
						Cornell University
					</span>
					<span class="text-[11px] tracking-[0.18em] uppercase text-slate-700 pb-[3px]">
						Undergraduate Admissions
					</span>
				</div>
				<div class="text-[11px] text-slate-700">
					{applicantName()}
				</div>
			</div>
			<div class="h-6 bg-[#B31B1B]"></div>
		</header>

		<section class="bg-white min-h-[500px] py-10">
			<div class="max-w-4xl mx-auto px-10">
				<div class="bg-white max-w-[450px] text-[13px]">

					<h1 class="text-2xl font-normal mb-5 font-serif text-[#B31B1B]">Login</h1>

					<div class="border border-green-700 bg-[#E0FFE0] px-4 py-3 mb-6 text-[13px] text-slate-900 font-normal">
						To log in, please enter your email address and password.
					</div>

					<form class="space-y-4" on:submit={handleLogin}>
						{#if error}
							<p class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2" role="alert">{error}</p>
						{/if}

						<div class="flex flex-col gap-1">
							<label
								for="portal-email"
								class="text-[13px] font-normal text-slate-900"
							>Email Address
							</label>
							<input
								id="portal-email"
								type="email"
                                class="border border-slate-400 bg-white px-2 py-1 text-[13px] w-96 shadow-inner"
								bind:value={emailInput}
								autocomplete="email"
							/>
						</div>

						<div class="flex flex-col gap-1">
							<label
								for="portal-password"
								class="text-[13px] font-normal text-slate-900"
							>
								Password
							</label>
                            <div class="flex items-center justify-between max-w-lg">
                                <input
                                    id="portal-password"
                                    type="password"
                                    class="border border-slate-400 bg-white px-2 py-1 text-[13px] w-80 shadow-inner"
                                    bind:value={passwordInput}
                                    autocomplete="current-password"
                                />
                                <a
                                    href="/disclaimer"
                                    class="text-[12px] text-blue-800 underline hover:no-underline ml-4 whitespace-nowrap"
                                >
                                    Forgot Your Password?
                                </a>
                            </div>
						</div>


						<div class="flex items-center gap-3 pt-3">
							<button
								type="submit"
								class="border border-slate-600 bg-slate-300 px-4 py-1 text-[12px] font-semibold text-black
										shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
							>
								Login
							</button>
							<button
								type="button"
								class="border border-slate-400 bg-slate-100 px-3 py-1 text-[11px] text-slate-700
										shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:bg-slate-200 active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
								on:click={handleLoadSavedLogin}
							>
								Load saved PredictAdmit login
							</button>
						</div>

						<p class="pt-6 text-[11px] leading-relaxed text-slate-600 max-w-xl">
							For this simulation, use the same email address and password that you saved on the
							PredictAdmit.com home page. No real application data is used, and all information is
							stored only in your browser.
						</p>
					</form>
				</div>
			</div>
		</section>

		<footer class="bg-[#B31B1B] h-8 flex items-center justify-center text-white text-[11px] font-normal">
			<div class="max-w-4xl mx-auto flex justify-between w-full px-10">
				<span>&copy; 2017</span>
				<span>PredictAdmit Simulation - Not affiliated with Cornell University</span>
			</div>
		</footer>

	{:else}
		{#if !hasViewedUpdate}

			<header class="bg-[#B31B1B] text-white">
				<div class="max-w-[960px] mx-auto px-4 pt-8 pb-4">
					<div class="mb-4">
						<div class="flex items-center gap-3">
							<div class="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center font-serif font-bold text-lg leading-none">
								CU
							</div>
							<span class="font-serif text-2xl tracking-wide">Cornell University</span>
						</div>
					</div>

					<div class="flex items-end justify-between border-t border-white/20 pt-3 mt-4">
						<h2 class="font-serif text-xl tracking-wide">Undergraduate Admissions</h2>

						<nav>
							<ul class="flex gap-6 text-[13px] font-bold">
								<li><a href="/disclaimer" class="hover:underline text-white">Apply</a></li>
								<li><a href="/disclaimer" class="hover:underline text-white">Costs & Aid</a></li>
								<li><a href="/disclaimer" class="hover:underline text-white">Learn</a></li>
								<li><a href="/disclaimer" class="hover:underline text-white">Living</a></li>
								<li><a href="/disclaimer" class="hover:underline text-white">Facts</a></li>
								<li><a href="/disclaimer" class="hover:underline text-white">Visit</a></li>
								<li><a href="/disclaimer" class="hover:underline text-white">Contact</a></li>
							</ul>
						</nav>
					</div>
				</div>
			</header>

			<main class="bg-[#F8F8F8] py-10 min-h-[500px]">
				<div class="max-w-[960px] mx-auto bg-white shadow-sm min-h-[400px] p-8 relative">

					<div class="flex gap-6 items-start">

						<div class="flex-grow bg-[#FFFFE0] p-6 text-sm text-slate-800">
							<h3 class="font-bold text-[#555] text-lg mb-2">Status Update</h3>
							<p class="mb-4 text-black">
								New Updates to your application were posted {school.statusLastPosted}.
							</p>
							<button
								on:click={handleViewUpdate}
								class="text-[#B31B1B] font-bold text-sm hover:underline"
							>
								{school.statusLinkLabel}
							</button>
						</div>

						<div class="w-64 text-[12px] font-bold leading-snug text-black pt-1">
							If you need to contact us regarding your application, provide your name and this reference number: <span class="text-black">{school.admissionsId}</span>.
						</div>

					</div>

				</div>
			</main>

			<footer class="bg-[#403C3B] text-[#ccc] py-10 font-sans">
				<div class="max-w-[960px] mx-auto px-4 grid grid-cols-2 gap-12">

					<div>
						<h4 class="text-white font-bold text-lg mb-4">Contact Us</h4>
						<p class="text-[13px] leading-relaxed mb-6">
							From your first questions about Cornell to the completion of your application, the Undergraduate Admissions Office can help you find the information you need.
						</p>
						<a href="/disclaimer" class="text-[13px] text-[#ccc] hover:text-white underline decoration-1 underline-offset-2">Website Feedback</a>
					</div>

					<div>
						<h4 class="text-white font-bold text-[13px] mb-4">Undergraduate Admissions Office</h4>
						<div class="text-[13px] grid grid-cols-2 gap-x-8 gap-y-1">
							<span>Cornell University</span>
							<span><a href="mailto:admissions@cornell.edu" class="hover:text-white">admissions@cornell.edu</a></span>

							<span>410 Thurston Avenue</span>
							<span>Tel: 607.255.5241</span>

							<span>Ithaca, NY 14850</span>
							<span>Fax: 607.255.0659</span>
						</div>
					</div>
				</div>

				<div class="max-w-[960px] mx-auto px-4 mt-12 pt-4 border-t border-[#555] flex justify-between text-[12px] text-[#999]">
					<span>&copy; 2017 Cornell University</span>
					<div class="flex gap-4">
						<a href="/disclaimer" class="hover:text-white">Admissions</a>
						<a href="/disclaimer" class="hover:text-white">Financial Aid</a>
						<a href="/disclaimer" class="hover:text-white">Student Employment</a>
					</div>
				</div>
			</footer>

		{:else}
			{#if school.decision === 'admit'}
				<CornellAccepted
					applicantName={applicantName()}
					schoolName={school.schoolName}
					primaryColor={school.primaryColor}
					footerDomain={school.footerDomain}
				/>
			{:else}
				<CornellDenied
					applicantName={applicantName()}
					schoolName={school.schoolName}
					primaryColor={school.primaryColor}
					footerDomain={school.footerDomain}
				/>
			{/if}
		{/if}
	{/if}
</div>