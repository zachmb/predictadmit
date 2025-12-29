<script lang="ts">
	import { tick } from 'svelte';
	import { userProfile, defaultProfile } from '$lib/stores/user';
	import type { UserProfile } from '$lib/stores/user';
	import UCLAAccepted from '$lib/components/ucla/UCLAAccepted.svelte';
	import UCLADenied from '$lib/components/ucla/UCLADenied.svelte';
	import { decisionsBySlug } from '$lib/stores/results';
	import { portalDecisionViewed } from '$lib/stores/ui';

	const DECISION: 'admit' | 'deny' = 'admit';

	let profile: UserProfile = { ...defaultProfile };
	let lastNameInput = '';
	let applicationIdInput = '';
	let dateOfBirthInput = '';
	let cityOfBirthInput = '';
	let error = '';
	let authenticated = false;
	let hasViewedUpdate = false;

	$: profile = $userProfile;

	const applicantName = () => profile.name || 'Applicant';

	const handleLogin = async (event: SubmitEvent) => {
		event.preventDefault();

		if (!profile.email || !profile.password) {
			error = 'Please set your PredictAdmit email and password on the main page.';
			authenticated = false;
			return;
		}

		// Simple validation - just check if fields are filled
		if (lastNameInput && applicationIdInput && dateOfBirthInput && cityOfBirthInput) {
			authenticated = true;
			error = '';
			await tick();
			window.scrollTo(0, 0);
		} else {
			error = 'Please fill in all fields.';
			authenticated = false;
		}
	};

	const handleViewUpdate = () => {
		hasViewedUpdate = true;
		portalDecisionViewed.set(true);
		window.scrollTo(0, 0);
	};

	const handleLoadSavedLogin = () => {
		lastNameInput = profile.name ? profile.name.split(' ').pop() || 'Doe' : 'Doe';
		applicationIdInput = '123456789';
		dateOfBirthInput = '01/01/2007';
		cityOfBirthInput = 'San Francisco';
		// Ensure profile is robust
		if (!profile.email) {
			userProfile.update((u) => ({ ...u, ...defaultProfile, name: 'John Doe' }));
		}
		// Directly authenticate
		authenticated = true;
		error = '';
	};
</script>

<svelte:head>
	<title>UCLA - Application Status</title>
</svelte:head>

{#if !authenticated}
	<!-- UCLA login screen -->
	<div class="min-h-screen bg-stone-200 border-8 border-[#2774AE] p-8">
		<div class="bg-stone-200 max-w-5xl mx-auto">
			<!-- UCLA Logo and Title -->
			<div class="mb-8">
				<div class="flex items-center gap-2 mb-4">
					<div class="text-6xl font-bold text-[#2774AE] italic" style="font-family: serif;">
						UCLA
					</div>
					<div class="text-sm text-[#2774AE] mt-4">Home</div>
				</div>
				<h1 class="text-4xl font-bold text-stone-700 mb-2">Application Status</h1>
				<p class="text-stone-600">
					Applicants for 2025 may check their application status by logging in below.
				</p>
			</div>

			<div class="grid grid-cols-2 gap-8">
				<!-- Login Form -->
				<div class="bg-white border border-stone-300 p-8">
					<h2 class="text-lg font-semibold text-stone-700 mb-6">Login</h2>

					{#if error}
						<div
							class="bg-red-50 border border-red-300 text-red-800 px-4 py-3 text-sm mb-6"
							role="alert"
						>
							{error}
						</div>
					{/if}

					<form class="space-y-6" on:submit={handleLogin}>
						<div>
							<label for="last-name" class="block text-sm text-stone-600 mb-2"> Last Name: </label>
							<input
								id="last-name"
								type="text"
								class="w-full border border-stone-400 bg-stone-100 px-3 py-2 text-sm focus:outline-none focus:border-[#2774AE]"
								bind:value={lastNameInput}
								required
							/>
						</div>

						<div>
							<label for="app-id" class="block text-sm text-stone-600 mb-2">
								Application ID: <a href="#" class="text-[#2774AE] text-xs hover:underline"
									>What is this?</a
								>
							</label>
							<input
								id="app-id"
								type="password"
								class="w-full border border-stone-400 bg-stone-100 px-3 py-2 text-sm focus:outline-none focus:border-[#2774AE]"
								bind:value={applicationIdInput}
								required
							/>
						</div>

						<div>
							<label for="dob" class="block text-sm text-stone-600 mb-2"> Date of Birth: </label>
							<input
								id="dob"
								type="text"
								placeholder="MM/DD/YYYY"
								class="w-full border border-pink-400 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#2774AE]"
								bind:value={dateOfBirthInput}
								required
							/>
						</div>

						<div>
							<label for="city-birth" class="block text-sm text-stone-600 mb-2">
								City of Birth:
							</label>
							<input
								id="city-birth"
								type="password"
								class="w-full border border-stone-400 bg-stone-100 px-3 py-2 text-sm focus:outline-none focus:border-[#2774AE]"
								bind:value={cityOfBirthInput}
								required
							/>
						</div>

						<div class="pt-2 flex items-center gap-4">
							<button
								type="submit"
								class="bg-[#2774AE] text-white px-8 py-2 text-sm font-semibold hover:bg-[#1e5a8a] transition-colors"
							>
								Login
							</button>
							<button
								type="button"
								on:click={handleLoadSavedLogin}
								class="text-xs text-[#2774AE] hover:underline"
							>
								Use PredictAdmit Profile?
							</button>
						</div>

						<p class="pt-6 text-xs text-stone-600 leading-relaxed border-t border-stone-300">
							For this simulation, simply fill in any values for the fields above. No real
							application data is used, and all information is stored only in your browser.
						</p>
					</form>
				</div>

				<!-- Right side - empty space in original -->
				<div></div>
			</div>
		</div>
	</div>
{:else if !hasViewedUpdate}
	<!-- UCLA Status Page -->
	<div class="min-h-screen bg-stone-100">
		<div class="bg-[#2774AE] text-white p-4">
			<div class="max-w-5xl mx-auto flex justify-between items-center">
				<div class="text-2xl font-bold italic" style="font-family: serif;">UCLA</div>
				<div class="text-sm">Prospective Student Portal</div>
			</div>
		</div>

		<div class="max-w-5xl mx-auto py-12 px-8">
			<div class="bg-white border border-stone-300 p-8 shadow-sm">
				<h2 class="text-2xl font-bold text-stone-800 mb-6">Welcome, {applicantName()}!</h2>

				<div class="bg-blue-50 border-l-4 border-[#2774AE] p-4 mb-8">
					<p class="text-stone-700 italic">
						"Congratulations on completing your application to UCLA. We appreciate your interest in
						our university."
					</p>
				</div>

				<div class="space-y-6">
					<div class="border-b border-stone-200 pb-4">
						<h3 class="text-lg font-semibold text-[#2774AE] mb-2">Status Update</h3>
						<p class="text-stone-600 mb-4">
							A new update has been posted to your application as of March 28, 2025.
						</p>
						<button
							on:click={handleViewUpdate}
							class="bg-[#2774AE] text-white px-6 py-2 text-sm font-semibold hover:bg-[#1e5a8a]"
						>
							View Update
						</button>
					</div>

					<div>
						<h3 class="text-lg font-semibold text-stone-700 mb-2">Application Checklist</h3>
						<div class="overflow-x-auto">
							<table class="w-full text-sm">
								<thead>
									<tr class="border-b border-stone-300">
										<th class="text-left py-2 font-semibold">Requirement</th>
										<th class="text-left py-2 font-semibold">Status</th>
										<th class="text-left py-2 font-semibold">Date</th>
									</tr>
								</thead>
								<tbody>
									<tr class="border-b border-stone-100">
										<td class="py-3">UC Application</td>
										<td class="py-3 text-green-600 font-medium">Received</td>
										<td class="py-3 text-stone-500">11/30/2024</td>
									</tr>
									<tr>
										<td class="py-3">Application Fee</td>
										<td class="py-3 text-green-600 font-medium">Paid</td>
										<td class="py-3 text-stone-500">11/30/2024</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else if $decisionsBySlug['ucla'] === 'admit'}
	<UCLAAccepted applicantName={applicantName()} />
{:else}
	<UCLADenied applicantName={applicantName()} />
{/if}
