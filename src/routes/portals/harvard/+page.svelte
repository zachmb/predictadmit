<script lang="ts">
	// Svelte Stores and Types
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';

	// Shared Configuration (Mocked for immediate runtime)
	// NOTE: Replace this mock with your actual import if the external file is ready.
	const schoolConfigs = {
		harvard: {
			// If you set this to 'defer', it will now display the Denied component, 
			// consistent with the typical simulation goal of showing a final letter.
			decision: 'defer', 
		}
	};
	
	// School-Specific Components (Decision Letters)
	import HarvardAccepted from '$lib/components/harvard/HarvardAccepted.svelte';
	import HarvardDenied from '$lib/components/harvard/HarvardDenied.svelte';

	// --- Component Configuration ---
	const SLUG = 'harvard';
	const HARVARD_CRIMSON = '#A41034'; // Harvard Crimson
	const HARVARD_STATUS_BG = '#F0F0F0'; // Light gray background for the status box

	// Mocked Data structure for the school
	const school = {
		schoolName: 'Harvard College',
		applicantName: '',
		round: '2022 Early Action',
		referenceNumber: '12345678',
		statusLastPosted: 'December 8, 2021',
		primaryColor: HARVARD_CRIMSON,
		decision: schoolConfigs[SLUG]?.decision || 'defer',
		footerDomain: 'harvard.edu'
	};

	// --- State Variables ---
	let profile: UserProfile = { name: '', email: '', password: '' };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;
	let activeTab = 'Admissions Status'; // Required for the portal view

	// Subscribe to the global user profile store
	$: profile = $userProfile;

	// Dynamic Data Helpers
	const applicantName = () => profile.name || school.applicantName;

	// --- Handlers ---
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
    
	// --- Forms Table Data ---
    const formData = [
        { status: '✔ Received', detail: 'Common Application', date: '10/30/2021', color: 'text-green-700', link: false },
        { status: '✔ Received', detail: 'High School Transcript', date: '11/01/2021', color: 'text-green-700', link: false },
        { status: '✔ Received', detail: 'Counselor Recommendation (Teacher Report)', date: '11/02/2021', color: 'text-green-700', link: false },
        { status: '✔ Received', detail: 'Teacher Recommendation 1 (Math/Science)', date: '11/03/2021', color: 'text-green-700', link: false },
        { status: '! Awaiting', detail: 'Optional Arts Supplement', date: '--', color: 'text-red-600', link: false },
        { status: '✔ Posted', detail: '2022 Admitted Student Reply Form', date: school.statusLastPosted.replace('December 8, 2021', '12/08/2021'), color: 'text-green-700', link: true },
    ];
</script>

<svelte:head>
	<title>{school.schoolName}</title>
</svelte:head>

<div class="min-h-screen font-sans bg-white text-gray-800">

	{#if !authenticated}
		<header class="h-10 border-b border-gray-300">
			<div class="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
				<div class="flex items-center gap-3">
					<span class="text-xl font-serif font-extrabold tracking-wide" style="color: {school.primaryColor};">
						HARVARD COLLEGE
					</span>
					<span class="text-[10px] uppercase tracking-wider text-slate-600 border-l border-slate-300 pl-2">
						UNDERGRADUATE ADMISSIONS
					</span>
				</div>
				<div class="text-[11px] text-slate-600">
					{applicantName()}
				</div>
			</div>
		</header>
        
        <div style="background-color: {school.primaryColor};" class="py-4 text-white text-center text-sm font-semibold tracking-wide uppercase">
           
        </div>
        <main class="bg-white min-h-[500px] py-20">
			<div class="max-w-xl mx-auto px-6 text-base">
				
				<h1 class="text-3xl font-normal mb-8 text-slate-900">
					Applicant Portal Login
				</h1>

				<div class="border border-green-700 bg-[#E0FFE0] px-4 py-3 mb-6 text-[13px] text-slate-900 font-normal max-w-full">
					To access your status page, please enter your registered email address and password.
				</div>

				<form class="space-y-4 max-w-[500px]" on:submit={handleLogin}>
					{#if error}
						<p class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2" role="alert">{error}</p>
					{/if}

					<div class="flex items-center gap-2">
						<label
							for="portal-email"
							class="text-[13px] font-normal text-slate-900 w-32 text-right"
						>
							Email Address
						</label>
						<input
							id="portal-email"
							type="email"
							class="border border-slate-400 bg-white px-2 py-1 text-[13px] w-64 shadow-inner"
							bind:value={emailInput}
							autocomplete="email"
						/>
					</div>

					<div class="flex items-center gap-2">
						<label
							for="portal-password"
							class="text-[13px] font-normal text-slate-900 w-32 text-right"
						>
							Password
						</label>
						<input
							id="portal-password"
							type="password"
							class="border border-slate-400 bg-white px-2 py-1 text-[13px] w-32 shadow-inner"
							bind:value={passwordInput}
							autocomplete="current-password"
						/>
						<a
							href="/disclaimer"
							class="text-[12px] text-blue-800 hover:underline ml-4 whitespace-nowrap"
						>
							Forgot Your Password?
						</a>
					</div>


					<div class="flex items-center gap-3 pt-3">
						<div class="w-32"></div>
						
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

					<p class="pt-6 text-[11px] leading-relaxed text-slate-600">
						for this simulation, use the same email address and password that you saved on the
						PredictAdmit.com home page. No real application data is used, and all information is
						stored only in your browser.
					</p>
				</form>
			</div>
		</main>

		<footer class="bg-[#A41034] h-8 flex items-center justify-center text-white text-[11px] font-normal">
			<div class="max-w-4xl mx-auto flex justify-between w-full px-10">
				<span>&copy; 2021 Harvard University</span>
				<span>PredictAdmit Simulation - Not affiliated with Harvard College</span>
			</div>
		</footer>

	{:else if authenticated && !hasViewedUpdate}
		<header class="border-b border-gray-300" style="background-color: #FFFFFF;">
			<div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
				<div class="flex items-center gap-3">
					<div class="text-xs font-bold uppercase tracking-wide text-gray-800">
						<span class="text-xl font-serif font-bold mr-1" style="color: {HARVARD_CRIMSON};">H</span>HARVARD COLLEGE
					</div>
				</div>
				<div class="text-[13px] text-gray-700 space-x-6 flex items-center">
					<span class="text-right">college.{school.footerDomain}</span>
				</div>
			</div>
		</header>

		<div class="max-w-7xl mx-auto px-6 mt-6 pb-12 flex flex-col">
			<div class="w-full">
				
				<div class="flex justify-between items-end mb-8 border-b border-gray-300 pb-2">
					<h1 class="text-3xl font-normal text-gray-800">Applicant Portal</h1>
					<div class="text-xs flex items-center text-gray-600 space-x-4">
						<span><strong>Applicant Name:</strong> {applicantName()}</span>
						<span><strong>Round:</strong> {school.round}</span>
						<span><strong>Reference Number:</strong> {school.referenceNumber}</span>
					</div>
				</div>

				<div class="w-full">
					<nav class="flex border-b border-gray-300 mb-6 relative">
						{#each ['Admissions Status', 'Application Information', 'Profile'] as tab}
							<button
								on:click={() => (activeTab = tab)}
								class="px-4 py-2 text-sm font-semibold border border-b-0 transition-colors duration-150 relative top-[1px]"
								class:bg-white={activeTab === tab}
								class:text-gray-900={activeTab === tab}
								class:border-gray-300={activeTab === tab}
								class:bg-gray-100={activeTab !== tab}
								class:text-gray-600={activeTab !== tab}
								class:border-transparent={activeTab !== tab}
							>
								{tab}
							</button>
						{/each}
						<div class="flex-grow border-b border-gray-300"></div>
						<div class="text-sm text-gray-600 self-end mb-1 absolute right-0 bottom-1">
							<a href="/disclaimer" class="text-red-600 hover:underline flex items-center">
								<span class="text-base mr-1 text-red-600">ⓘ</span> Contact & Resources
							</a>
						</div>
					</nav>

					<div class="flex w-full">
						<div class="w-1/4 pr-8 pt-2">
							{#if activeTab === 'Admissions Status'}
								<h2 class="text-lg font-semibold mb-3 text-gray-800">Admission Status</h2>
								<nav class="text-sm space-y-1">
									<a href="/disclaimer" class="block py-1 px-2 font-bold bg-gray-200 border-l-4 border-gray-700 text-gray-900">
										Status Update
									</a>
									<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">
										Forms
									</a>
									<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">
										Conditions of Admission
									</a>
									<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">
										Financial Aid Information
									</a>
									<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">
										Admitted Students Website
									</a>
									<a href="/disclaimer" class="block py-1 px-2 text-gray-700 hover:bg-gray-100">
										Harvard University ID Number
									</a>
								</nav>
							{/if}
						</div>

						<div class="w-3/4 pl-8 border-l border-gray-300">
							{#if activeTab === 'Admissions Status'}
								
								<div class="mb-8">
									<h2 class="text-xl font-semibold mb-4 text-gray-700 flex items-center">
										<span class="text-2xl mr-2 font-serif" style="color: {HARVARD_CRIMSON};"></span> Status Update
									</h2>

									<div 
										class="p-4 border-2 border-gray-300" 
										style="background-color: {HARVARD_STATUS_BG}; border-color: {HARVARD_CRIMSON};"
									>
										<p class="text-base text-gray-700 mb-4">
											An update to your application was last posted **{school.statusLastPosted}**.
										</p>
										<button
											on:click={handleViewUpdate}
											class="text-sm font-semibold px-4 py-1 text-white bg-[#A41034] border border-gray-400 shadow-md hover:bg-[#8F0C2C] active:shadow-inner"
										>
											View Update >>
										</button>
									</div>
								</div>

								<div class="mb-8">
									<h2 class="text-xl font-semibold mb-4 text-gray-700 flex items-center">
										<span class="text-gray-500 text-2xl mr-2"></span> Forms
									</h2>
									<table class="w-full text-sm text-left border border-gray-300">
										<thead class="bg-gray-100">
											<tr>
												<th class="px-4 py-2 font-bold">Status</th>
												<th class="px-4 py-2 font-bold">Details</th>
												<th class="px-4 py-2 font-bold">Date Received</th>
											</tr>
										</thead>
										<tbody>{#each formData as item}
											<tr class="border-b border-gray-200">
												<td class="px-4 py-2 font-semibold" class:text-green-700={item.color === 'text-green-700'} class:text-red-600={item.color === 'text-red-600'}>
													{item.status}
												</td>
												<td class="px-4 py-2">
													{item.detail}
													{#if item.link}
														<a href="/disclaimer" class="text-blue-600 hover:underline ml-1">Display</a>
													{/if}
												</td>
												<td class="px-4 py-2">{item.date}</td>
											</tr>
										{/each}</tbody>
									</table>
								</div>
								
								<div class="mb-8">
									<h2 class="text-xl font-semibold mb-4 text-gray-700 flex items-center">
										<span class="text-gray-500 text-2xl mr-2"></span> Interview Status
									</h2>
									<div class="p-4 border border-gray-300 bg-gray-50 text-sm">
										<p class="mb-2">
											We have received your request for an interview. A local alumni volunteer will contact you directly via email or phone if one is available.
										</p>
										<p class="font-semibold">
											Status: Currently Waiting for Alumni Contact
										</p>
									</div>
								</div>


							{:else if activeTab === 'Application Information'}
								<div class="p-6 bg-gray-100 border border-gray-300">
									<p class="text-lg font-semibold">Application Information</p>
									<p class="text-sm text-gray-600 mt-2">Details about your submitted application, including essays and school information, will be available here.</p>
								</div>
							{:else if activeTab === 'Profile'}
								<div class="p-6 bg-gray-100 border border-gray-300">
									<p class="text-lg font-semibold">Profile</p>
									<p class="text-sm text-gray-600 mt-2">Review and update your contact details and biographical information.</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>


		<footer class="bg-gray-100 text-gray-700 py-6 text-sm font-normal border-t border-gray-300 mt-12">
			<div class="max-w-7xl mx-auto px-6 flex justify-between w-full text-[11px]">
				<span>&copy; 2021 Harvard University. All rights reserved.</span>
				<span>PredictAdmit Simulation - Not affiliated with Harvard College</span>
			</div>
		</footer>

	{:else}
		{#if school.decision === 'admit'}
			<HarvardAccepted
				applicantName={applicantName()}
				schoolName={school.schoolName}
				primaryColor={school.primaryColor}
				footerDomain={school.footerDomain}
			/>
		{:else}
			<HarvardDenied
				applicantName={applicantName()}
				schoolName={school.schoolName}
				primaryColor={school.primaryColor}
				footerDomain={school.footerDomain}
			/>
		{/if}
	{/if}
</div>