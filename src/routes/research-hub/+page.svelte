<script lang="ts">
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import { goto } from '$app/navigation';

	let activeCategory = 'All Roles';

	const listings = [
		{
			title: 'Cognitive Behavioral Therapy Assistant',
			org: 'The Prestige Project',
			location: 'San Francisco (Remote)',
			tags: ['Psychology', 'Leadership'],
			category: 'STEM Research', // Mapping "Psychology" roughly to STEM/Social Science
			icon: 'SF',
			iconBg: 'bg-indigo-50',
			iconColor: 'text-indigo-700'
		},
		{
			title: 'Climate Data Analyst (Junior Fellow)',
			org: 'ClimateResilience.org',
			location: 'Remote',
			tags: ['Data Science', 'Environment'],
			category: 'STEM Research',
			icon: 'CR',
			iconBg: 'bg-green-50',
			iconColor: 'text-green-700'
		},
		{
			title: 'LLM Training Data Specialist',
			org: 'OpenSource AI Collective',
			location: 'Remote',
			tags: ['Computer Science', 'Research'],
			category: 'STEM Research',
			icon: 'AI',
			iconBg: 'bg-sky-50',
			iconColor: 'text-sky-700'
		},
		// Adding a humanities one to test filtering
		{
			title: 'Digital Archives Intern',
			org: 'Global History Museum',
			location: 'Remote',
			tags: ['History', 'Archival'],
			category: 'Humanities',
			icon: 'GH',
			iconBg: 'bg-amber-50',
			iconColor: 'text-amber-700'
		},
		{
			title: 'Youth Advocacy Lead',
			org: 'Future Leaders Org',
			location: 'Remote',
			tags: ['Non-Profit', 'Policy'],
			category: 'Non-Profit Leadership',
			icon: 'FL',
			iconBg: 'bg-rose-50',
			iconColor: 'text-rose-700'
		}
	];

	$: filteredListings =
		activeCategory === 'All Roles'
			? listings
			: listings.filter((l) => l.category === activeCategory);
</script>

<svelte:head>
	<title>Research Hub | PredictAdmit</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 font-sans flex flex-col animate-enter">
	<div class="flex-1 w-full max-w-[1000px] mx-auto px-6 py-12 space-y-12">
		<!-- HEADER -->
		<section class="text-center space-y-4 max-w-2xl mx-auto">
			<h1 class="text-3xl font-bold text-slate-900">Research & Internship Hub</h1>
			<p class="text-slate-600 leading-relaxed">
				Exclusive roles for PredictAdmit members.
				<br />
				Build your "Spike" with high-impact, verifyable non-profit work.
			</p>
		</section>

		<!-- FILTER BAR -->
		<div class="flex flex-wrap gap-2 justify-center">
			{#each ['All Roles', 'STEM Research', 'Non-Profit Leadership', 'Humanities'] as category}
				<button
					class="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border {activeCategory ===
					category
						? 'bg-slate-900 text-white border-slate-900'
						: 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}"
					on:click={() => (activeCategory = category)}>{category}</button
				>
			{/each}
		</div>

		<!-- JOB LISTINGS -->
		<section class="space-y-4">
			{#each filteredListings as job}
				<Card
					class="bg-white border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group"
				>
					<div class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
						<div class="flex items-start gap-4">
							<div
								class="w-12 h-12 rounded {job.iconBg} {job.iconColor} flex items-center justify-center font-bold text-lg shrink-0"
							>
								{job.icon}
							</div>
							<div>
								<h3 class="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
									{job.title}
								</h3>
								<div class="text-sm text-slate-500 font-medium mb-2">
									{job.location} • {job.org}
								</div>
								<div class="flex gap-2">
									{#each job.tags as tag}
										<span
											class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase"
											>{tag}</span
										>
									{/each}
								</div>
							</div>
						</div>
						<div class="flex-shrink-0">
							<Button class="w-full md:w-auto text-sm">Apply Now</Button>
						</div>
					</div>
				</Card>
			{/each}
		</section>

		<!-- LOCKED STATE -->
		<section
			class="bg-white border border-slate-200 shadow-lg rounded-xl p-8 text-center text-slate-900 relative overflow-hidden"
		>
			<div class="relative z-10 space-y-6">
				<div
					class="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-xl"
				>
					🔒
				</div>
				<h3 class="text-2xl font-bold text-slate-900">Unlock 50+ More Opportunities</h3>
				<p class="text-slate-600 max-w-lg mx-auto">
					Premium members get access to our full database of professor-led research positions and
					verified non-profit board seats.
				</p>
				<Button
					class="bg-slate-900 text-white hover:bg-slate-800 border-none px-8 shadow-xl"
					on:click={() => goto('/pro')}>Upgrade to View All</Button
				>
			</div>

			<!-- Decorative Background -->
			<div
				class="absolute inset-0 opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
			></div>
		</section>
	</div>

	<SiteFooter />
</main>
