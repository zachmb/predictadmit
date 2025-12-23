<script lang="ts">
	// Svelte Stores and Types
	import { userProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';

	// Shared Components and Configuration
	import { schoolConfigs } from '$lib/config/schools';

	// School-Specific Components (Decision Letters - assuming they exist or will be created)
	// NOTE: I am referencing UchicagoAccepted/Denied components. You will need to create these files.
	import UchicagoAccepted from '$lib/components/uchicago/UchicagoAccepted.svelte';
	import UchicagoDenied from '$lib/components/uchicago/UchicagoDenied.svelte';

	// --- Component Configuration ---
	const SCHOOL_KEY = 'uchicago';
	const SCHOOL_DATA = schoolConfigs[SCHOOL_KEY]; // Ensure 'uchicago' exists in your config
	const UCHICAGO_MAROON = '#800000'; // UChicago main color

	// --- State Variables ---
	let profile: UserProfile = { name: '', email: '', password: '' };
	let emailInput = '';
	let passwordInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;

	// Subscribe to the global user profile store
	$: profile = $userProfile;

	// Dynamic Data Helpers
	const applicantName = () => profile.name || 'John Doe';
	const applicantEmail = () => profile.email || 'johndoe@email.com';

	// --- Login Handlers (Using a standard login for consistency across portals) ---
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
		if (!SCHOOL_DATA) {
			error = 'Unknown portal.';
			authenticated = false;
			return;
		}
		if (!profile.email || !profile.password) {
			error = 'Please set your PredictAdmit email and password on the main page.';
			authenticated = false;
			return;
		}
		// Authenticate against the saved PredictAdmit credentials
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
	<title>{SCHOOL_DATA.schoolName} Admissions Portal</title>
</svelte:head>

<div class="bg-white text-slate-900 font-sans flex flex-col {authenticated ? 'min-h-screen' : ''}">
	
	{#if !authenticated}
		<div class="bg-white">
			<header class="bg-white border-b border-slate-300">
				<div class="max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
					<div class="flex items-baseline gap-3">
						<span class="text-3xl font-serif text-slate-900">
							The University of Chicago
						</span>
						<span class="text-[11px] tracking-[0.18em] uppercase text-slate-700">
							College Admissions
						</span>
					</div>
					<div class="text-[11px] text-slate-700">
						{applicantName()}
					</div>
				</div>
				<div class="h-8" style={`background-color: ${UCHICAGO_MAROON};`}></div>
			</header>

			<section class="bg-white">
				<div class="max-w-5xl mx-auto px-10 py-10">
					<h1 class="text-3xl font-normal mb-6">Application Status Login</h1>

					<div class="border border-red-700 bg-red-100 px-4 py-3 mb-8 text-[12px] text-slate-900">
						Please use your saved PredictAdmit credentials to log in to this simulated portal.
					</div>

					<form class="space-y-4 text-sm" on:submit={handleLogin}>
						{#if error}
							<p class="text-xs text-red-800 border border-red-300 bg-red-50 px-3 py-2 mb-2" role="alert">
								{error}
							</p>
						{/if}

						<div class="flex items-center gap-4">
							<label for="portal-email" class="w-32 text-[12px] font-semibold text-slate-900 text-right">Email Address</label>
							<input id="portal-email" type="email" class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80" bind:value={emailInput} autocomplete="email" />
						</div>

						<div class="flex items-center gap-4">
							<label for="portal-password" class="w-32 text-[12px] font-semibold text-slate-900 text-right">Password</label>
							<input id="portal-password" type="password" class="border border-slate-500 bg-white px-2 py-1 text-[13px] w-80" bind:value={passwordInput} autocomplete="current-password" />
							<a href="/disclaimer" class="text-[12px] text-blue-800 underline hover:no-underline">Forgot Your Password?</a>
						</div>

						<div class="flex items-center gap-4 pt-4">
							<div class="w-32"></div>
							<div class="flex flex-wrap items-center gap-3">
								<button type="submit" class="border border-slate-500 bg-slate-300 px-4 py-1 text-[12px] font-semibold hover:bg-slate-400 active:bg-slate-500">Login</button>
								<button type="button" class="border border-slate-400 bg-slate-100 px-3 py-1 text-[11px] hover:bg-slate-200 active:bg-slate-300" on:click={handleLoadSavedLogin}>Load saved PredictAdmit login</button>
							</div>
						</div>

						<p class="pt-4 text-[10px] leading-relaxed text-slate-600 max-w-xl">
							This is a simulation. Use the same email and password saved on the PredictAdmit.com home page.
						</p>
					</form>
				</div>
			</section>
		</div>

		<footer class="mt-8">
			<div class="h-10 flex items-center" style={`background-color: ${UCHICAGO_MAROON};`}>
				<div class="max-w-5xl mx-auto px-6 w-full flex items-center justify-between text-[11px] text-white">
					<span>&copy; {SCHOOL_DATA.footerDomain} 2019</span>
					<span class="opacity-80">PredictAdmit.com simulation · Not affiliated with {SCHOOL_DATA.schoolName}</span>
				</div>
			</div>
		</footer>

	{:else}
		<div class="flex-grow flex flex-col min-h-screen bg-white">
			
			<header class="w-full">
				<div class="w-full py-2 text-white" style={`background-color: ${UCHICAGO_MAROON};`}>
					<div class="max-w-6xl mx-auto px-6">
						<div class="text-xs flex justify-end">
							<a href="#" class="hover:underline">Login</a>
							<span class="mx-1">|</span>
							<a href="#" class="hover:underline">Account (App Status...)</a>
						</div>
					</div>
				</div>

				<div class="w-full text-white pt-2 pb-0.5" style={`background-color: #A00000;`}>
					<div class="max-w-6xl mx-auto px-6 flex justify-between items-end">
						<h1 class="text-3xl font-serif font-bold tracking-wide">
							College Admissions
						</h1>
						<nav class="text-[11px] font-bold uppercase tracking-wider space-x-4">
							<a href="#" class="hover:underline">Apply</a>
							<a href="#" class="hover:underline">Visit</a>
							<a href="#" class="hover:underline">Academics</a>
							<a href="#" class="hover:underline">Student Life</a>
							<a href="#" class="hover:underline">New Graduates</a>
							<a href="#" class="hover:underline">Cost & Aid</a>
							<a href="#" class="hover:underline">Contact Us</a>
						</nav>
					</div>
				</div>
				<div class="border-t border-slate-700"></div>
			</header>

			<main class="max-w-6xl mx-auto px-6 py-8 w-full flex-1 flex">
				
				<div class="w-3/4 pr-10">
					{#if !hasViewedUpdate}
						<div class="flex justify-between items-start mb-6">
							<h2 class="text-xl font-bold">Welcome, {applicantName()}</h2>
							<div class="text-[10px] text-red-700 font-bold flex flex-col items-end">
								<a href="#" class="hover:underline text-blue-600">Print Job/Facebook</a>
								<a href="#" class="hover:underline text-blue-600">Follow us on Twitter</a>
							</div>
						</div>

						<p class="text-[11px] leading-relaxed mb-4">
							Thank you for submitting an application to the College. We are pleased to provide you with your name and reference number: **42004200**.
						</p>

						<div class="border border-gray-300 p-4 mb-6">
							<h3 class="text-xs font-bold text-red-700 mb-2">Your UChicago Account is your resource to:</h3>
							<ul class="text-[11px] space-y-1 ml-4 list-disc text-gray-800">
								<li>Complete and update your profile.</li>
								<li>Change your <a href="#" class="text-blue-700 underline">password</a>.</li>
								<li>Check your <a href="#" class="text-blue-700 underline">mailing status</a>.</li>
								<li>Upload your institutional and additional resources.</li>
								<li>View your admission decision letter.</li>
							</ul>
						</div>

						<p class="text-[11px] leading-relaxed mb-4 text-gray-700">
							You can always contact the <a href="#" class="text-blue-700 underline">Admissions Office</a> or your <a href="#" class="text-blue-700 underline">regional admissions manager</a> for help or to change your decision plan, for logistical issues related to your application process, or about the application itself.
						</p>

						<div class="border border-red-700 bg-red-50 p-4 mb-6">
							<p class="text-[11px] italic leading-relaxed text-gray-800">
								We want to take this moment to say thank thank you—you are ALL amazing. You have invented new companies, contributed to the mysteries of the Divine, taken to stage, etc. We can only imagine the difficulty our team faced in selecting a limited number of qualified students to join us. We hope you're proud of your accomplishments, and will continue to do great work wherever you go.
							</p>
							<p class="text-[10px] italic text-gray-700 mt-2">
								**Sincerely,**<br>
								**James G. Rosendorf**<br>
								**Dean of Admissions & Financial Aid**
							</p>
						</div>

						<div class="mb-6">
							<div class="bg-blue-800 text-white font-bold p-2 text-xs mb-2">Status Update</div>
							<p class="text-[11px] text-gray-700">An update to your application was posted **March 15, 2020**</p>
							<button on:click={handleViewUpdate} class="text-red-700 font-bold text-xs mt-1 hover:underline">
								View Update >>
							</button>
						</div>

						<div class="mb-6">
							<div class="bg-blue-800 text-white font-bold p-2 text-xs mb-2">Portfolio</div>
							<div class="text-[11px] text-gray-700 mb-3">
								<p>In this section, you can upload all supplemental arts materials. Uploading materials will automatically submit them to the admissions office. Please read the instructions and file-type specifications. **We strongly encourage you to submit all materials online if possible.**</p>
								<p class="mt-2">For uploading the optional video profile, please edit the file after upload and update the title to: **Optional Video Profile.**</p>
							</div>

							<p class="text-[11px] text-gray-700 mb-2">We have received the following portfolio submissions from you:</p>
							<div class="border border-gray-300 p-2 text-xs mb-3">
								<table class="w-full text-left">
									<thead>
										<tr class="text-gray-600">
											<th class="font-bold pb-1">Title</th>
											<th class="font-bold pb-1">Format</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td class="pt-1">Optional Video Profile</td>
											<td class="pt-1">video, 00:01:57</td>
										</tr>
									</tbody>
								</table>
								<a href="#" class="text-red-700 font-bold text-xs mt-2 inline-block hover:underline">Edit Portfolios</a>
							</div>
						</div>

						<div class="mb-6">
							<div class="bg-blue-800 text-white font-bold p-2 text-xs mb-2">Forms</div>
							<div class="flex items-center text-[11px] text-gray-700">
								<span class="text-green-600 font-bold mr-2">✔</span> Delivered Student Response Form - <a href="#" class="text-blue-700 underline ml-1">Display</a>
							</div>
						</div>

						<div class="mb-6">
							<div class="bg-blue-800 text-white font-bold p-2 text-xs mb-2">Upload Materials</div>
							<p class="text-[11px] text-gray-700 mb-3">
								If you need to upload additional forms for your application or financial aid, please use the links below. Only *one* document can be uploaded at a time. Do not attempt to upload materials already received, like your transcript.
							</p>
							<p class="text-[10px] text-gray-600 mb-3">
								**NOTE:** Only documents that can be submitted through your UChicago Account will appear here.
							</p>

							<div class="text-[10px] text-gray-800 space-y-1 mb-4">
								<p>1/30/2019 12:12 AM - Financial Aid - Parents 2018 Federal Income Tax Return</p>
								<p>1/30/2019 12:12 AM - Financial Aid - Student 2018 Federal Income Tax Return</p>
								<p>2/25/2019 04:59 AM - College Supplement</p>
							</div>

							<div class="flex items-center space-x-4">
								<input type="file" id="file-upload" class="text-[11px] p-1 border border-gray-400" />
								<button class="bg-gray-200 border border-gray-400 text-xs px-4 py-1 hover:bg-gray-300">
									Upload
								</button>
							</div>
						</div>
						
						<div class="mb-6">
							<div class="bg-blue-800 text-white font-bold p-2 text-xs mb-2">Verify Address</div>
							<div class="border border-gray-300 p-4 text-[11px] text-gray-700">
								<div class="flex gap-8">
									<div>
										<p class="font-bold">Mailing Address</p>
										<p>1600 Pennsylvania Ave</p>
										<p>NW</p>
										<p>Washington, DC 20500</p>
										<p>United States</p>
									</div>
									<div>
										<p class="font-bold">Permanent Address</p>
										<p>1600 Pennsylvania Ave</p>
										<p>NW</p>
										<p>Washington, DC 20500</p>
										<p>United States</p>
									</div>
								</div>
								<a href="#" class="text-red-700 font-bold text-xs mt-2 inline-block hover:underline">Edit Addresses</a>
							</div>
						</div>
					{:else}
						{#if SCHOOL_DATA.decision === 'admit'}
							<UchicagoAccepted applicantName={applicantName()} />
						{:else}
							<UchicagoDenied applicantName={applicantName()} />
						{/if}
					{/if}
				</div> <div class="w-1/4 pt-10">
					<div class="p-4 border border-gray-300 text-[11px] text-gray-700 bg-gray-50">
						<p class="font-bold mb-2">UChicago Quick Links</p>
						<ul class="space-y-1 list-disc ml-4">
							<li><a href="#" class="text-blue-700 hover:underline">Campus Map</a></li>
							<li><a href="#" class="text-blue-700 hover:underline">Financial Aid Policies</a></li>
							<li><a href="#" class="text-blue-700 hover:underline">Student Life Blog</a></li>
							<li><a href="#" class="text-blue-700 hover:underline">Academic Programs</a></li>
						</ul>
					</div>

					<div class="p-4 border border-gray-300 text-[11px] text-gray-700 bg-gray-50 mt-4">
						<p class="font-bold mb-2">Contact</p>
						<p>College Admissions</p>
						<p>123 Fake Street</p>
						<p>Chicago, IL 60637</p>
						<p>Phone: (773) 702-8650</p>
					</div>
				</div>
			</main>

			<footer class="w-full mt-8 bg-gray-700 text-white text-[11px] py-10">
				<div class="max-w-6xl mx-auto px-6 grid grid-cols-4 gap-4">
					<div class="col-span-1">
						<p class="text-xs">&copy; 2018 The University of Chicago</p>
					</div>
					
					<div class="col-span-1 space-y-1">
						<p class="font-bold">College Admissions</p>
						<p>1101 E. 58th Street</p>
						<p>Rosenwald Hall 105</p>
						<p>Chicago, Illinois 60637</p>
						<p>Phone: 773.702.8650</p>
					</div>

					<div class="col-span-2 grid grid-cols-2">
						<div class="space-y-1">
							<a href="#" class="block hover:underline">Apply Online</a>
							<a href="#" class="block hover:underline">Request Information</a>
							<a href="#" class="block hover:underline">Privacy Information</a>
							<a href="#" class="block hover:underline">Non-Discrimination</a>
						</div>
						<div></div>
					</div>
				</div>
				<div class="max-w-6xl mx-auto px-6 text-[10px] text-center mt-4 opacity-70">
					PredictAdmit.com simulation. Not affiliated with The University of Chicago.
				</div>
			</footer>
		</div>
	{/if}
</div>