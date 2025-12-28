<script lang="ts">
  import { goto } from '$app/navigation';
  
  type DecisionMode = 'random' | 'accepted' | 'denied';
  
  // List of all available portals with decision state
  let portals = [
    { name: 'Brown University', slug: 'brown', color: '#4E3629', decision: 'random' as DecisionMode },
    { name: 'California Institute of Technology', slug: 'caltech', color: '#F48221', decision: 'random' as DecisionMode },
    { name: 'Columbia University', slug: 'columbia', color: '#004A8D', decision: 'random' as DecisionMode },
    { name: 'Cornell University', slug: 'cornell', color: '#B31B1B', decision: 'random' as DecisionMode },
    { name: 'Dartmouth College', slug: 'dartmouth', color: '#00743F', decision: 'random' as DecisionMode },
    { name: 'Duke University', slug: 'duke', color: '#00539C', decision: 'random' as DecisionMode },
    { name: 'Harvard College', slug: 'harvard', color: '#A41034', decision: 'random' as DecisionMode },
    { name: 'Johns Hopkins University', slug: 'jhu', color: '#002D72', decision: 'random' as DecisionMode },
    { name: 'Massachusetts Institute of Technology', slug: 'mit', color: '#A31F34', decision: 'random' as DecisionMode },
    { name: 'Northwestern University', slug: 'northwestern', color: '#4E6588', decision: 'random' as DecisionMode },
    { name: 'Princeton University', slug: 'princeton', color: '#FE7A22', decision: 'random' as DecisionMode },
    { name: 'Rice University', slug: 'rice', color: '#003D5B', decision: 'random' as DecisionMode },
    { name: 'Stanford University', slug: 'stanford', color: '#8C1515', decision: 'random' as DecisionMode },
    { name: 'University of California, Berkeley', slug: 'ucberkeley', color: '#003262', decision: 'random' as DecisionMode },
    { name: 'University of Chicago', slug: 'uchicago', color: '#800000', decision: 'random' as DecisionMode },
    { name: 'University of California, Los Angeles', slug: 'ucla', color: '#2774AE', decision: 'random' as DecisionMode },
    { name: 'University of Pennsylvania', slug: 'upenn', color: '#012265', decision: 'random' as DecisionMode },
    { name: 'Vanderbilt University', slug: 'vanderbilt', color: '#8C6633', decision: 'random' as DecisionMode },
    { name: 'Washington University in St. Louis', slug: 'wustl', color: '#5A2B82', decision: 'random' as DecisionMode },
    { name: 'Yale University', slug: 'yale', color: '#0E4A84', decision: 'random' as DecisionMode }
  ];

  let globalMode: DecisionMode = 'random';

  const handlePortalClick = (slug: string, decision: DecisionMode) => {
    // Store decision preference in sessionStorage for the individual portal
    sessionStorage.setItem(`decision-${slug}`, decision);
    goto(`/portals/${slug}`);
  };

  const handlePortalDecisionChange = (slug: string, decision: DecisionMode) => {
    portals = portals.map(p => 
      p.slug === slug ? { ...p, decision } : p
    );
  };

  const handleGlobalModeChange = (mode: DecisionMode) => {
    globalMode = mode;
    portals = portals.map(p => ({ ...p, decision: mode }));
  };

  const getDecisionLabel = (decision: DecisionMode) => {
    switch (decision) {
      case 'accepted': return 'Accepted';
      case 'denied': return 'Denied';
      case 'random': return 'Random';
    }
  };

  const getDecisionColor = (decision: DecisionMode) => {
    switch (decision) {
      case 'accepted': return 'text-green-600 bg-green-50 border-green-200';
      case 'denied': return 'text-red-600 bg-red-50 border-red-200';
      case 'random': return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };
</script>

<svelte:head>
  <title>All College Portals - PredictAdmit</title>
</svelte:head>

<main class="min-h-screen bg-slate-200 text-slate-900 font-serif">
  <div class="max-w-6xl mx-auto px-4 py-10">
    <div class="bg-white border border-slate-400 shadow-md rounded-md overflow-hidden">
      <div class="border-b border-slate-300 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 px-5 py-4">
        <h1 class="text-3xl font-bold text-slate-900 mb-2">All College Portals</h1>
        <p class="text-slate-700 mb-4">
          Explore individual college admission portals. Each portal simulates the real application status page for that institution.
        </p>
        
        <!-- Global Decision Mode Control -->
        <div class="flex flex-wrap items-center gap-4 p-3 bg-white border border-slate-200 rounded-md">
          <span class="text-sm font-semibold text-slate-700">Set all decisions to:</span>
          <div class="flex gap-2">
            <button
              type="button"
              class={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
                globalMode === 'random' 
                  ? 'bg-slate-600 text-white border-slate-600' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              on:click={() => handleGlobalModeChange('random')}
            >
              Random
            </button>
            <button
              type="button"
              class={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
                globalMode === 'accepted' 
                  ? 'bg-green-600 text-white border-green-600' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-green-50'
              }`}
              on:click={() => handleGlobalModeChange('accepted')}
            >
              All Accepted
            </button>
            <button
              type="button"
              class={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
                globalMode === 'denied' 
                  ? 'bg-red-600 text-white border-red-600' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-red-50'
              }`}
              on:click={() => handleGlobalModeChange('denied')}
            >
              All Denied
            </button>
          </div>
        </div>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each portals as portal}
            <div class="border border-slate-300 rounded-md hover:border-slate-400 hover:shadow-md transition-all duration-200 bg-white">
              <button
                type="button"
                class="w-full p-4 text-left"
                on:click={() => handlePortalClick(portal.slug, portal.decision)}
              >
                <div class="flex items-center gap-3 mb-2">
                  <div 
                    class="w-3 h-3 rounded-full" 
                    style="background-color: {portal.color}"
                  ></div>
                  <h3 class="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {portal.name}
                  </h3>
                </div>
                <p class="text-sm text-slate-600 mb-3">
                  View the {portal.name} admission portal simulation
                </p>
                <div class="flex items-center justify-between">
                  <div class="text-xs text-blue-600 font-medium group-hover:text-blue-700">
                    Visit Portal →
                  </div>
                  <div class={`px-2 py-1 text-xs font-medium rounded border ${getDecisionColor(portal.decision)}`}>
                    {getDecisionLabel(portal.decision)}
                  </div>
                </div>
              </button>
              
              <!-- Individual Decision Toggle -->
              <div class="px-4 pb-3 pt-0 border-t border-slate-100">
                <div class="flex items-center gap-1 mt-2">
                  <span class="text-xs text-slate-600 mr-2">Decision:</span>
                  <button
                    type="button"
                    class={`px-2 py-0.5 text-xs font-medium rounded border transition-colors ${
                      portal.decision === 'random' 
                        ? 'bg-slate-600 text-white border-slate-600' 
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                    on:click={() => handlePortalDecisionChange(portal.slug, 'random')}
                  >
                    Random
                  </button>
                  <button
                    type="button"
                    class={`px-2 py-0.5 text-xs font-medium rounded border transition-colors ${
                      portal.decision === 'accepted' 
                        ? 'bg-green-600 text-white border-green-600' 
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-green-50'
                    }`}
                    on:click={() => handlePortalDecisionChange(portal.slug, 'accepted')}
                  >
                    Accepted
                  </button>
                  <button
                    type="button"
                    class={`px-2 py-0.5 text-xs font-medium rounded border transition-colors ${
                      portal.decision === 'denied' 
                        ? 'bg-red-600 text-white border-red-600' 
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-red-50'
                    }`}
                    on:click={() => handlePortalDecisionChange(portal.slug, 'denied')}
                  >
                    Denied
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
        
        <div class="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-md">
          <p class="text-sm text-slate-700 mb-2">
            <strong>Note:</strong> These are simulated portals for educational purposes. They use the same login credentials you set up on the main PredictAdmit page. No real application data is used.
          </p>
          <p class="text-sm text-slate-700">
            <strong>Decision Modes:</strong> "Random" simulates realistic admission chances, "Accepted" shows the acceptance letter, and "Denied" shows the rejection letter. Individual portal settings override global settings.
          </p>
        </div>
      </div>
    </div>
  </div>
</main>
