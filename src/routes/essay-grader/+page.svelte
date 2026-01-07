<script lang="ts">
    import { userProfile } from '$lib/stores/user';
    import { portals } from '$lib/config/admitMail';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import Card from '$lib/components/common/Card.svelte';
    import { fade } from 'svelte/transition';
    import { signIn } from '@auth/sveltekit/client';

    // --- TYPES ---
    interface ScoreDetail {
        score: number;
        explanation: string;
    }

    interface Essay {
        prompt: string | null;
        scores: Record<string, ScoreDetail>;
        average: number;
    }

    interface GradingResult {
        essays: Essay[];
    }
    
    // --- STATE & AUTH ---
    // Use $derived for values that change based on other stores/props
    const session = $derived($page.data.session);
    const googleSignedIn = $derived(!!session?.user);

    // Form inputs - Using $state for Svelte 5 reactivity
    let major = $state('');
    
    // SAFETY FIX: Check if portals exists before accessing index 0
    let selectedSchool = $state(portals && portals.length > 0 ? portals[0].name : '');
    
    let essayType = $state<'personal' | 'supplemental'>('personal');
    let content = $state('');
    let isAnalyzing = $state(false);
    let results = $state<GradingResult | null>(null);
    let currentEssayIndex = $state(0);

    // --- LOGIC ---
    async function handleAnalyze() {
        if (!content || !major) return;
        
        isAnalyzing = true;
        try {
            const res = await fetch('/essay-grader', {
                method: 'POST',
                body: JSON.stringify({ major, selectedSchool, essayType, content }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) throw new Error('Grading failed');
            results = (await res.json()) as GradingResult;
        } catch (e) {
            console.error(e);
            alert("Analysis failed. Please try again.");
        } finally {
            isAnalyzing = false;
        }
    }

    function restart() {
        results = null;
        content = '';
        currentEssayIndex = 0;
    }

    const formatLabel = (str: string) => str.replace(/([A-Z])/g, ' $1').trim();

    
</script>

<div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
    <div class="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
</div>

<div class="max-w-6xl mx-auto p-6 pt-12 min-h-screen pb-32">
    
    <div class="flex items-center justify-center gap-2 mb-12">
        <div class="bg-slate-100 p-1 rounded-2xl flex gap-1 border border-slate-200 shadow-sm">
            <button class="px-6 py-2 rounded-xl text-sm font-bold bg-white text-slate-900 shadow-sm">Essay Grader</button>
            <button onclick={() => goto('/ai')} class="px-6 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors italic">AI Simulator</button>
        </div>
    </div>

    {#if !googleSignedIn}
        <div class="max-w-2xl mx-auto py-20 px-6">
            <Card class="relative overflow-hidden border-none shadow-2xl bg-white/80 backdrop-blur-xl p-1">
                <div class="relative z-10 text-center py-16 px-8 border border-slate-100 rounded-[1.5rem] bg-white">
                    <div class="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-blue-100/50 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-4">Unlock Premium Analysis</h2>
                    <p class="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto mb-10">Sign in to access the DeepSeek-V3 grading engine and get institutional feedback.</p>
                    <button onclick={() => signIn('google', { callbackUrl: '/ai' })} class="group relative flex items-center justify-center gap-3 w-full max-w-xs mx-auto py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                        Continue with Google
                    </button>
                </div>
            </Card>
        </div>

    {:else if results}
        <div class="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
            <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 tracking-tight">Admissions Evaluation</h2>
                        <p class="text-slate-500 font-medium tracking-tight">Reviewing for <span class="text-blue-600">{selectedSchool}</span> • {major}</p>
                    </div>
                    <button onclick={restart} class="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
                        New Analysis
                    </button>
                </div>

                {#if results.essays[currentEssayIndex]}
                    {@const essay = results.essays[currentEssayIndex]}
                    {#key currentEssayIndex}
                    <div in:fade={{ duration: 200 }}>
                        <Card class="overflow-hidden border-slate-200 shadow-xl bg-white">
                            <div class="bg-slate-900 px-8 py-3 flex justify-between items-center text-white">
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    {essayType === 'supplemental' ? `Supplement #${currentEssayIndex + 1}` : 'Personal Statement'}
                                </span>
                                <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">DeepSeek-V3 Verified</span>
                            </div>

                            <div class="p-8 space-y-10">
                                {#each Object.entries(essay.scores) as [category, data]}
                                    <div class="group">
                                        <div class="flex justify-between items-end mb-3">
                                            <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">{formatLabel(category)}</h4>
                                            <div class="flex items-baseline gap-1">
                                                <span class="text-2xl font-black text-blue-600">{data.score}</span>
                                                <span class="text-xs font-bold text-slate-300">/10</span>
                                            </div>
                                        </div>
                                        <div class="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                                            <div class="h-full bg-blue-600" style="width: {data.score * 10}%"></div>
                                        </div>
                                        <div class="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                                            <p class="text-[13px] text-slate-600 leading-relaxed italic">"{data.explanation}"</p>
                                        </div>
                                    </div>
                                {/each}
                                
                                <div class="mt-8 pt-8 border-t border-slate-100 flex items-center gap-6">
                                    <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-200">
                                        {essay.average}
                                    </div>
                                    <div>
                                        <p class="text-sm font-black text-slate-900 tracking-tight">Institutional Strength</p>
                                        <p class="text-xs text-slate-500 font-medium">Predicted Adcom Rating for {selectedSchool}.</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    {/key}
                {/if}
            </div>

            <aside class="space-y-6 lg:sticky lg:top-8">
                <Card class="bg-slate-900 border-none p-6 text-white overflow-hidden relative">
                    <div class="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
                    <h3 class="text-xl font-black tracking-tight mb-2">The Full Verdict</h3>
                    <p class="text-slate-400 text-[11px] leading-relaxed mb-6 font-medium">Simulate your entire profile against 20 top-tier universities in real-time.</p>
                    
                    <button onclick={() => goto('/ai')} class="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-sm transition-all shadow-lg shadow-blue-900/40">
                        Launch AI Simulator
                    </button>
                </Card>
            </aside>
        </div>

    {:else}
        <div class="max-w-6xl mx-auto grid lg:grid-cols-[1fr_380px] gap-12 items-start">
            <div class="space-y-8">
                <header>
                    <div class="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100">Grade & Refine</div>
                    <h1 class="text-5xl font-black text-slate-900 tracking-tighter mb-4 italic">Essay Grader.</h1>
                    <p class="text-slate-500 font-medium text-lg max-w-xl">Get granular, school-specific feedback on your writing from our trained admissions engine.</p>
                </header>

                <Card class="p-8 space-y-8 shadow-2xl border-slate-200 bg-white/80 backdrop-blur-md">
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Intended Major</label>
                            <input bind:value={major} placeholder="e.g. Finance, Biology" class="w-full bg-slate-50/50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Target University</label>
                            <select bind:value={selectedSchool} class="w-full bg-slate-50/50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none font-medium">
                                {#if portals}
                                    {#each portals as school}
                                        <option value={school.name}>{school.name}</option>
                                    {/each}
                                {/if}
                            </select>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Submission Type</label>
                        <div class="grid grid-cols-2 gap-4">
                            <button onclick={() => essayType = 'personal'} class="py-4 border-2 rounded-2xl font-black text-sm transition-all {essayType === 'personal' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-200'}">
                                Personal Statement
                            </button>
                            <button onclick={() => essayType = 'supplemental'} class="py-4 border-2 rounded-2xl font-black text-sm transition-all {essayType === 'supplemental' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-200'}">
                                School Supplements
                            </button>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Content</label>
                        <textarea 
                            bind:value={content} 
                            rows="10" 
                            placeholder={essayType === 'personal' ? 'Paste your statement here...' : 'Paste your prompts and responses...'}
                            class="w-full bg-slate-50/50 border border-slate-200 p-6 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-serif text-lg leading-relaxed shadow-inner"
                        ></textarea>
                    </div>

                    <button 
                        disabled={!major || !content || isAnalyzing}
                        onclick={handleAnalyze}
                        class="group relative w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xl hover:bg-slate-800 disabled:opacity-50 transition-all overflow-hidden"
                    >
                        {#if isAnalyzing}
                            <div class="flex items-center justify-center gap-3">
                                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Grading...
                            </div>
                        {:else}
                            Analyze Essays
                        {/if}
                    </button>
                </Card>
            </div>

            <div class="lg:pt-32 space-y-12">
                <div class="space-y-6">
                    <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <h4 class="text-xl font-black text-slate-900 mb-2 tracking-tight">Unlimited Simulation</h4>
                        <p class="text-sm font-medium text-slate-500 leading-relaxed">Test different essays, spikes, and activities to see what cracks the code.</p>
                    </div>
                </div>

                <button 
                    onclick={() => goto('/ai')}
                    class="w-full group p-8 bg-blue-600 rounded-[2rem] text-left relative overflow-hidden transition-all hover:scale-[1.02] shadow-2xl shadow-blue-200"
                >
                    <div class="relative z-10">
                        <span class="text-[10px] font-black text-blue-200 uppercase tracking-widest block mb-2">New Feature</span>
                        <h3 class="text-2xl font-black text-white leading-tight mb-4 italic">AI Simulator Suite →</h3>
                        <p class="text-blue-100 text-[11px] font-bold opacity-80 leading-relaxed">Go beyond the essay. See your actual admissions results in real-time.</p>
                    </div>
                </button>
            </div>
        </div>
    {/if}
</div>