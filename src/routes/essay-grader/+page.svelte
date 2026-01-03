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
    const session = $derived($page.data.session);
    const googleSignedIn = $derived(!!session?.user);

 

    // Form inputs
    let major = $state('');
    let selectedSchool = $state(portals[0].name);
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
    $effect(() => {
        if (googleSignedIn && !$userProfile.isPro) {
            goto('/essay');
        }
    });
</script>

<div class="max-w-5xl mx-auto p-6 pt-12 min-h-screen pb-32">
    {#if !googleSignedIn}
    <div class="max-w-2xl mx-auto py-20 px-6">
        <Card class="relative overflow-hidden border-none shadow-2xl bg-white/80 backdrop-blur-xl p-1">
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>

            <div class="relative z-10 text-center py-16 px-8 border border-slate-100 rounded-[1.5rem] bg-white">
                <div class="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-blue-100/50 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>

                <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-4">
                    Unlock Premium Analysis
                </h2>
                
                <p class="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto mb-10">
                    Sign in to access the DeepSeek-V3 grading engine and get institutional feedback on your essays.
                </p>

                <button 
                    onclick={()  => signIn('google', { callbackUrl: '/ai' })}
                    class="group relative flex items-center justify-center gap-3 w-full max-w-xs mx-auto py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-200"
                >
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                    
                    <div class="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <p class="mt-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Secure 256-bit Encrypted Session
                </p>
            </div>
        </Card>
    </div>

    {:else if results}
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
                    <Card class="overflow-hidden border-slate-200 shadow-xl">
                        <div class="bg-slate-900 px-8 py-3 flex justify-between items-center">
                            <div class="flex items-center gap-4">
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    {essayType === 'supplemental' ? `Supplemental Essay #${currentEssayIndex + 1} of ${results.essays.length}` : 'Personal Statement'}
                                </span>
                                
                                {#if essayType === 'supplemental' && results.essays.length > 1}
                                    <div class="flex items-center gap-2 border-l border-slate-700 ml-2 pl-4">
                                        <button 
                                            disabled={currentEssayIndex === 0}
                                            onclick={() => currentEssayIndex--}
                                            class="text-white hover:text-blue-400 disabled:opacity-30 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                        </button>
                                        <button 
                                            disabled={currentEssayIndex === results.essays.length - 1}
                                            onclick={() => currentEssayIndex++}
                                            class="text-white hover:text-blue-400 disabled:opacity-30 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                        </button>
                                    </div>
                                {/if}
                            </div>
                            <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest hidden sm:inline">Verified by DeepSeek-V3</span>
                        </div>

                        <div class="p-8 space-y-10">
                            {#if essayType === 'supplemental' && essay.prompt}
                                <div class="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                                    <label class="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Detected Prompt</label>
                                    <p class="text-sm text-blue-900 italic">"{essay.prompt}"</p>
                                </div>
                            {/if}

                            <div class="grid gap-10">
                                {#each Object.entries(essay.scores) as [category, data]}
                                    <div class="group">
                                        <div class="flex justify-between items-end mb-3">
                                            <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">{formatLabel(category)}</h4>
                                            <div class="flex items-baseline gap-1">
                                                <span class="text-2xl font-black text-blue-600 tracking-tighter">{data.score}</span>
                                                <span class="text-xs font-bold text-slate-300">/10</span>
                                            </div>
                                        </div>
                                        <div class="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                                            <div class="h-full bg-blue-600 transition-all duration-1000 ease-out" style="width: {data.score * 10}%"></div>
                                        </div>
                                        <div class="relative bg-slate-50 border border-slate-200 p-4 rounded-xl">
                                            <p class="text-[13px] text-slate-600 leading-relaxed italic">"{data.explanation}"</p>
                                        </div>
                                    </div>
                                {/each}
                            </div>

                            <div class="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <div class="min-w-[5rem] h-auto p-6 w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                                        {essay.average}
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-slate-900">Institutional Strength Score</p>
                                        <p class="text-xs text-slate-500">Based on {selectedSchool}'s unique freshman profile.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                {/key}
            {/if}
        </div>

    {:else}
        <div class="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-2">Essay Grader</h1>
                <p class="text-slate-500 font-medium italic">"The admissions committee is now in session."</p>
            </header>

            <Card class="p-8 space-y-8 shadow-2xl border-slate-200">
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-xs font-black uppercase tracking-widest text-slate-400">Intended Major</label>
                        <input bind:value={major} placeholder="e.g. Finance, Biology" class="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-black uppercase tracking-widest text-slate-400">Target University</label>
                        <select bind:value={selectedSchool} class="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                            {#each portals as school}
                                <option value={school.name}>{school.name}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="space-y-4">
                    <label class="text-xs font-black uppercase tracking-widest text-slate-400">Submission Type</label>
                    <div class="grid grid-cols-2 gap-4">
                        <button onclick={() => essayType = 'personal'} class="py-4 border-2 rounded-xl font-bold transition-all {essayType === 'personal' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}">
                            Common App Personal
                        </button>
                        <button onclick={() => essayType = 'supplemental'} class="py-4 border-2 rounded-xl font-bold transition-all {essayType === 'supplemental' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}">
                            School Supplements
                        </button>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-xs font-black uppercase tracking-widest text-slate-400">
                        {essayType === 'personal' ? 'Your Essay' : 'Paste Prompts & Responses'}
                    </label>
                    <textarea 
                        bind:value={content} 
                        rows="12" 
                        placeholder={essayType === 'personal' ? 'Paste your 650-word statement here...' : 'Prompt 1: Why NYU?\nResponse: [Your text]\n\nPrompt 2: ...'}
                        class="w-full bg-slate-50 border border-slate-200 p-6 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-serif text-lg leading-relaxed"
                    ></textarea>
                </div>

                <button 
                    disabled={!major || !content || isAnalyzing}
                    onclick={handleAnalyze}
                    class="w-full bg-blue-600 text-white py-8 rounded-2xl font-black text-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-200"
                >
                    {isAnalyzing ? 'Processing via DeepSeek-V3...' : 'Analyze My Essays'}
                </button>
            </Card>
        </div>
    {/if}
</div>