<script lang="ts">
	import { userProfile, type TrackedSchool, type SchoolStatus } from '$lib/stores/user';
	import { portals } from '$lib/config/admitMail';
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';

	let searchQuery = '';
	let searchResults: typeof portals = [];

	// Filter schools for adding
	$: {
		const q = searchQuery.toLowerCase().trim();
		if (q) {
			searchResults = portals
				.filter(
					(p) =>
						(p.name.toLowerCase().includes(q) || p.slug.includes(q)) &&
						!$userProfile.schoolList.some((s) => s.slug === p.slug)
				)
				.slice(0, 5);
		} else {
			searchResults = [];
		}
	}

	const addSchool = (portal: (typeof portals)[0]) => {
		const newSchool: TrackedSchool = {
			slug: portal.slug,
			name: portal.name,
			status: 'researching',
			supplements: []
		};

		userProfile.update((u) => ({
			...u,
			schoolList: [...u.schoolList, newSchool]
		}));

		searchQuery = '';
		searchResults = [];
	};

	const removeSchool = (slug: string) => {
		if (!confirm('Are you sure? This will delete your tracked supplements for this school.'))
			return;
		userProfile.update((u) => ({
			...u,
			schoolList: u.schoolList.filter((s) => s.slug !== slug)
		}));
	};

	const updateStatus = (slug: string, status: SchoolStatus) => {
		userProfile.update((u) => ({
			...u,
			schoolList: u.schoolList.map((s) => (s.slug === slug ? { ...s, status } : s))
		}));
	};

	const updateDeadline = (slug: string, deadline: string) => {
		userProfile.update((u) => ({
			...u,
			schoolList: u.schoolList.map((s) => (s.slug === slug ? { ...s, deadline } : s))
		}));
	};

	const statusColors: Record<SchoolStatus, string> = {
		researching: 'bg-slate-100 text-slate-600',
		writing: 'bg-blue-100 text-blue-700',
		submitted: 'bg-indigo-100 text-indigo-700',
		accepted: 'bg-emerald-100 text-emerald-700',
		denied: 'bg-rose-100 text-rose-700',
		waitlisted: 'bg-amber-100 text-amber-700'
	};
</script>

<div class="space-y-6">
	<!-- Add School Section -->
	<div class="relative">
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search for a university to add..."
				class="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		{#if searchResults.length > 0}
			<div
				class="absolute top-full left-0 right-0 mt-2 z-20 bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden"
			>
				{#each searchResults as result}
					<button
						class="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 flex justify-between items-center"
						on:click={() => addSchool(result)}
					>
						<span class="font-medium text-slate-900">{result.name}</span>
						<span class="text-xs text-blue-600 font-bold">+ Track</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- School List -->
	<div class="space-y-4">
		{#if $userProfile.schoolList.length === 0}
			<div class="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
				<p class="text-slate-500 text-sm">No schools tracked yet. Add one above!</p>
			</div>
		{:else}
			{#each $userProfile.schoolList as school (school.slug)}
				<div
					class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
				>
					<div class="flex-1">
						<h3 class="font-bold text-slate-900">{school.name}</h3>
						<div class="mt-1 flex items-center gap-2">
							<input
								type="date"
								value={school.deadline || ''}
								on:change={(e) => updateDeadline(school.slug, e.currentTarget.value)}
								class="text-xs text-slate-500 bg-transparent border-0 p-0 focus:ring-0"
							/>
						</div>
					</div>

					<div class="flex items-center gap-3">
						<select
							value={school.status}
							on:change={(e) => updateStatus(school.slug, e.currentTarget.value as SchoolStatus)}
							class={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border-0 cursor-pointer ${statusColors[school.status]}`}
						>
							<option value="researching">Researching</option>
							<option value="writing">Writing</option>
							<option value="submitted">Submitted</option>
							<option value="accepted">Accepted</option>
							<option value="denied">Denied</option>
							<option value="waitlisted">Waitlisted</option>
						</select>

						<button
							on:click={() => removeSchool(school.slug)}
							class="text-slate-400 hover:text-red-500 transition-colors p-2"
							aria-label="Remove school"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-5 h-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
								/>
							</svg>
						</button>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
