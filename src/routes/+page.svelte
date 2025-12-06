<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { userProfile } from '$lib/stores/user';
  import AI from '$lib/components/common/AI.svelte';
  import type { UserProfile } from '$lib/stores/user';

  import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
  import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
  import ApplicationTimeline from '$lib/components/home/ApplicationTimeline.svelte';
  import AdmitMail from '$lib/components/AdmitMail.svelte';

  import {
    portals,
    sentEmails,
    calendarDates,
    ED_DATE_LABEL,
    RD_DATE_LABEL,
    type PortalEmail,
    type SentEmail,
    type ApplicationPhase,
    type PersistedState
  } from '$lib/config/admitMail';

  let name = '';
  let email = '';
  let password = '';
  let saveMessage = '';

  // Search query for admitMail inbox
  let searchQuery = '';

  // Filtered view based on search
  let filteredPortals: PortalEmail[] = [];

  // Inbox auto-scroll
  let inboxSection: HTMLElement | null = null;
  let hasAutoScrolledToInbox = false;

  // Sorted view of visible portals (newest first)
  let sortedVisiblePortals: PortalEmail[] = [];

  let selectedPortal: PortalEmail | null = null;
  let selectedSent: SentEmail | null = null;

  // Which folder is active in the mail sidebar
  let activeFolder: 'inbox' | 'sent' = 'inbox';

  // Are we looking at the list or a full email view?
  let viewMode: 'inbox' | 'email' = 'inbox';

  // Track which inbox emails have been "read" (clicked)
  let readPortalSlugs: Set<string> = new Set();

  // Application flow state
  let showAccountForm = false;
  let showPassword = false;

  // AI hero state
  let aiExpanded = false;

  const handleAiGetStarted = () => {
    aiExpanded = true;
  };

  const handleStartSimulationClick = () => {
    showAccountForm = true;
  };

  let hasApplied = false;
  let hasSavedProfile = false;
  let visiblePortals: PortalEmail[] = [];
  let isApplying = false;

  let applicationPhase: ApplicationPhase = 'idle';

  let calendarIndex = 0;
  let calendarIntervalId: number | null = null;

  // ED / REA choice
  let edChoiceSlug = '';
  let currentEdPortal: PortalEmail | null = null;
  let edEmailMustBeViewed = false;
  let hasViewedEdEmail = false;
  let edEmailRevealed = false;
  let rdTimelineStarted = false;

  // Timeouts used both for animation & email drip
  let applyTimeoutIds: number[] = [];

  // Apply button enabled?
  let canApply = false;

  const PERSIST_KEY = 'predictadmit_state_v1';

  const saveState = () => {
    if (typeof localStorage === 'undefined') return;

    const state: PersistedState = {
      hasApplied,
      hasSavedProfile,
      calendarIndex,
      applicationPhase,
      edChoiceSlug,
      currentEdSlug: currentEdPortal ? currentEdPortal.slug : null,
      edEmailMustBeViewed,
      hasViewedEdEmail,
      edEmailRevealed,
      rdTimelineStarted,
      visiblePortalSlugs: visiblePortals.map((p) => p.slug),
      readPortalSlugs: Array.from(readPortalSlugs)
    };

    try {
      localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to persist PredictAdmit state', err);
    }
  };

  const loadState = () => {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return;

    try {
      const state = JSON.parse(raw) as Partial<PersistedState>;

      hasApplied = !!state.hasApplied;
      hasSavedProfile = !!state.hasSavedProfile;

      if (typeof state.calendarIndex === 'number') {
        calendarIndex = Math.min(
          Math.max(state.calendarIndex, 0),
          calendarDates.length - 1
        );
      }

      if (state.applicationPhase) {
        applicationPhase = state.applicationPhase;
      }

      if (typeof state.edChoiceSlug === 'string') {
        edChoiceSlug = state.edChoiceSlug;
      }

      if (typeof state.currentEdSlug === 'string' && state.currentEdSlug) {
        currentEdPortal = portals.find((p) => p.slug === state.currentEdSlug) ?? null;
      } else {
        currentEdPortal = null;
      }

      edEmailMustBeViewed = !!state.edEmailMustBeViewed;
      hasViewedEdEmail = !!state.hasViewedEdEmail;
      edEmailRevealed = !!state.edEmailRevealed;
      rdTimelineStarted = !!state.rdTimelineStarted;

      if (Array.isArray(state.visiblePortalSlugs)) {
        visiblePortals = state.visiblePortalSlugs
          .map((slug) => portals.find((p) => p.slug === slug) || null)
          .filter((p): p is PortalEmail => p !== null);
      }

      if (Array.isArray(state.readPortalSlugs)) {
        readPortalSlugs = new Set(state.readPortalSlugs);
      }

      // if we had a saved profile before, surface the account form again
      if (hasSavedProfile) {
        showAccountForm = true;
        aiExpanded = true;
      }
    } catch (err) {
      console.error('Failed to load PredictAdmit state', err);
    }
  };

  onMount(() => {
    loadState();
  });

  // Sync local fields with store
  $: {
    const profile: UserProfile = $userProfile;
    if (profile) {
      name = profile.name;
      email = profile.email;
      password = profile.password;
    }
  }

  $: canApply = Boolean(name.trim() && email.trim() && password);

  // Nice display strings for children
  $: displayNameStr = name.trim() || 'Applicant';
  $: displayEmailStr = email.trim() || 'you@example.com';

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    userProfile.set({
      name: trimmedName,
      email: trimmedEmail,
      password // keep as typed
    });

    hasSavedProfile = true;
    saveMessage = 'Fake login saved.';
    showAccountForm = true;
    saveState();
  };

  const handleSelectPortal = (portal: PortalEmail) => {
    selectedPortal = portal;
    selectedSent = null;
    activeFolder = 'inbox';
    viewMode = 'email';

    const next = new Set(readPortalSlugs);
    next.add(portal.slug);
    readPortalSlugs = next;

    if (currentEdPortal && portal.slug === currentEdPortal.slug) {
      hasViewedEdEmail = true;
    }

    saveState();
  };

  const handleSelectSent = (message: SentEmail) => {
    selectedSent = message;
    selectedPortal = null;
    activeFolder = 'sent';
    viewMode = 'email';
  };

  const openInboxList = () => {
    viewMode = 'inbox';
  };

  const switchFolder = (folder: 'inbox' | 'sent') => {
    activeFolder = folder;
    viewMode = 'inbox';
  };

  const startCalendar = () => {
    if (calendarIntervalId !== null) {
      clearInterval(calendarIntervalId);
    }
    calendarIntervalId = window.setInterval(() => {
      if (calendarIndex < calendarDates.length - 1) {
        calendarIndex += 1;
      } else if (calendarIntervalId !== null) {
        clearInterval(calendarIntervalId);
        calendarIntervalId = null;
      }
    }, 700);
  };

  const startRdEmailTimeline = (edPortal: PortalEmail | null) => {
    const rdPortals = edPortal ? portals.filter((p) => p.slug !== edPortal.slug) : portals;

    rdPortals.forEach((portal, index) => {
      const timeoutId = window.setTimeout(() => {
        // avoid duplicates
        if (!visiblePortals.some((vp) => vp.slug === portal.slug)) {
          visiblePortals = [...visiblePortals, portal];
        }
      }, (index + 1) * 1000);
      applyTimeoutIds.push(timeoutId);
    });
  };

  const formatTime = (hour24: number, minute: number) => {
    const isPM = hour24 >= 12;
    let h12 = hour24 > 12 ? hour24 - 12 : hour24;
    if (h12 === 0) h12 = 12;
    const mStr = minute.toString().padStart(2, '0');
    const suffix = isPM ? 'PM' : 'AM';
    return `${h12}:${mStr} ${suffix}`;
  };

  const getPortalIndex = (portal: PortalEmail) =>
    portals.findIndex((p) => p.slug === portal.slug);

  const getReceivedLabel = (portal: PortalEmail): string => {
    const idx = getPortalIndex(portal);
    if (currentEdPortal && portal.slug === currentEdPortal.slug) {
      // Early decision time block, around 4 PM
      const minute = 5 + idx * 2;
      const time = formatTime(16, minute);
      return `${ED_DATE_LABEL}, ${time}`;
    } else {
      // Regular decision time block, around 5 PM
      const minute = 1 + idx * 2;
      const time = formatTime(17, minute);
      return `${RD_DATE_LABEL}, ${time}`;
    }
  };

  // Keep inbox sorted newest → oldest and auto-scroll to inbox when ready
  $: if (hasApplied && applicationPhase === 'finished') {
    // Sort visible portals by their actual received date/time (newest first)
    sortedVisiblePortals = [...visiblePortals].sort((a, b) => {
      const timeA = new Date(getReceivedLabel(a)).getTime();
      const timeB = new Date(getReceivedLabel(b)).getTime();
      return timeB - timeA;
    });

    // Once inbox section exists, scroll to it once
    if (inboxSection && !hasAutoScrolledToInbox) {
      inboxSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      hasAutoScrolledToInbox = true;
    }
  } else {
    // If simulation not finished yet, keep sorted list in sync but no scroll
    sortedVisiblePortals = [...visiblePortals];
  }

  // 🔍 Apply search filter to sorted portals
  $: {
    const q = searchQuery.trim().toLowerCase();

    if (!q) {
      filteredPortals = sortedVisiblePortals;
    } else {
      filteredPortals = sortedVisiblePortals.filter((portal) => {
        return (
          portal.name.toLowerCase().includes(q) ||
          portal.slug.toLowerCase().includes(q)
        );
      });
    }
  }

  const startApplicationAnimation = () => {
    isApplying = true;
    applicationPhase = 'commonapp';

    const phaseSchedule: { phase: ApplicationPhase; delay: number }[] = [
      { phase: 'fee', delay: 2500 },
      { phase: 'transcript', delay: 5000 },
      { phase: 'act', delay: 7500 },
      { phase: 'finished', delay: 10000 }
    ];

    phaseSchedule.forEach(({ phase, delay }) => {
      const timeoutId = window.setTimeout(() => {
        applicationPhase = phase;
        if (phase === 'finished') {
          isApplying = false;
          // After this, calendar + reactive block will unlock ED/RD emails
        }
        saveState();
      }, delay);
      applyTimeoutIds.push(timeoutId);
    });
  };

  const handleApply = () => {
    if (!canApply) {
      saveMessage = 'Fill out name, email, and password first.';
      return;
    }
    if (hasApplied) return;

    hasApplied = true;

    // Set up ED choice & reset inbox-related state
    currentEdPortal = edChoiceSlug ? portals.find((p) => p.slug === edChoiceSlug) ?? null : null;
    visiblePortals = [];
    selectedPortal = null;
    selectedSent = null;
    readPortalSlugs = new Set();
    hasViewedEdEmail = false;
    edEmailMustBeViewed = false;
    edEmailRevealed = false;
    rdTimelineStarted = false;
    hasAutoScrolledToInbox = false;

    applyTimeoutIds.forEach((id) => clearTimeout(id));
    applyTimeoutIds = [];

    calendarIndex = 0;
    startCalendar();
    startApplicationAnimation();
    saveState();
  };

  // 🔄 Reset the whole simulation (profile, state, localStorage)
  const resetSimulation = () => {
    // clear timers
    applyTimeoutIds.forEach((id) => clearTimeout(id));
    applyTimeoutIds = [];
    if (calendarIntervalId !== null) {
      clearInterval(calendarIntervalId);
      calendarIntervalId = null;
    }

    // clear global store
    userProfile.set({
      name: '',
      email: '',
      password: ''
    });

    // clear local fields
    name = '';
    email = '';
    password = '';
    saveMessage = 'Simulation reset. Start fresh with a new fake login.';

    // reset flow flags
    hasApplied = false;
    hasSavedProfile = false;
    showAccountForm = false;
    showPassword = false;
    aiExpanded = false;

    // reset inbox / portals
    selectedPortal = null;
    selectedSent = null;
    activeFolder = 'inbox';
    viewMode = 'inbox';
    readPortalSlugs = new Set();
    visiblePortals = [];
    isApplying = false;

    // reset calendar & phases
    applicationPhase = 'idle';
    calendarIndex = 0;
    hasAutoScrolledToInbox = false;

    // reset ED / RD
    edChoiceSlug = '';
    currentEdPortal = null;
    edEmailMustBeViewed = false;
    hasViewedEdEmail = false;
    edEmailRevealed = false;
    rdTimelineStarted = false;

    // clear persisted state
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(PERSIST_KEY);
      } catch (err) {
        console.error('Failed to clear PredictAdmit state', err);
      }
    }
  };

  // Unlock ED / RD emails as the calendar + application phase progress
  $: if (hasApplied) {
    const currentDate = calendarDates[calendarIndex];

    // --- ED/REA handling: stop time on ED date and show ONLY the ED email ---
    if (currentEdPortal && !edEmailRevealed && currentDate === ED_DATE_LABEL) {
      visiblePortals = [currentEdPortal];
      edEmailRevealed = true;
      edEmailMustBeViewed = true;

      // Pause the calendar at the ED date
      if (calendarIntervalId !== null) {
        clearInterval(calendarIntervalId);
        calendarIntervalId = null;
      }
    }

    // --- Resume calendar AFTER ED email is viewed AND user returns to inbox ---
    if (
      currentEdPortal &&
      edEmailRevealed &&
      hasViewedEdEmail &&
      viewMode === 'inbox' &&
      calendarIntervalId === null &&
      !rdTimelineStarted &&
      calendarIndex < calendarDates.length - 1
    ) {
      calendarIntervalId = window.setInterval(() => {
        if (calendarIndex < calendarDates.length - 1) {
          calendarIndex += 1;
        } else if (calendarIntervalId !== null) {
          clearInterval(calendarIntervalId);
          calendarIntervalId = null;
        }
      }, 700);
    }

    // --- Start RD drip on RD date (March 20), only after ED has been viewed if applicable ---
    if (
      !rdTimelineStarted &&
      currentDate === RD_DATE_LABEL &&
      (!currentEdPortal || hasViewedEdEmail)
    ) {
      rdTimelineStarted = true;
      startRdEmailTimeline(currentEdPortal);

      // Once RD emails start, we can stop the calendar
      if (calendarIntervalId !== null) {
        clearInterval(calendarIntervalId);
        calendarIntervalId = null;
      }
    }

    // persist any changes from this tick
    saveState();
  }

  onDestroy(() => {
    applyTimeoutIds.forEach((id) => clearTimeout(id));
    if (calendarIntervalId !== null) {
      clearInterval(calendarIntervalId);
    }
  });
</script>

<svelte:head>
  <title>PredictAdmit.com – College Admissions Portal Simulator</title>
</svelte:head>

<main class="min-h-screen bg-slate-200 text-slate-900 font-serif flex flex-col">
  <SiteHeader />

  <div class="flex-1">
    <div class="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <!-- HERO -->
      <section class="bg-white border border-slate-400 shadow-md rounded-md overflow-hidden">
        <div
          class="border-b border-slate-300 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div class="space-y-1">
            <h1 class="text-2xl md:text-3xl font-bold text-slate-900">
              Practice college decision day before it’s real.
            </h1>
            <p class="text-sm md:text-base text-slate-700 max-w-2xl">
              Simulate the inbox, the portal, and the “we regret to inform you” emails now, so the
              real day hurts less — and your application is better.
            </p>
          </div>
          <div class="hidden md:flex flex-col items-end text-xs text-slate-600 space-y-1">
            <span
              class="px-2 py-1 border border-emerald-400 bg-emerald-50 text-emerald-800 rounded-sm"
            >
              Built by Ivy admits
            </span>
            <span>Free simulator &amp; premium AI.</span>
          </div>
        </div>

        <div class="px-5 py-6 space-y-8">
          <!-- HERO GRID -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <!-- LEFT: FREE SIM CARD (light / gray, but same design language) -->
            <div
              class="relative overflow-hidden rounded-md border border-slate-300 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 shadow-inner flex flex-col justify-between"
            >
              <!-- soft glow -->
              <div class="pointer-events-none absolute inset-0">
                <div
                  class="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-slate-200/70 blur-3xl"
                ></div>
                <div
                  class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.22)_0,_transparent_55%)]"
                ></div>
              </div>

              <div class="relative flex flex-col h-full">
                <!-- header / label row -->
                <div
                  class="px-4 pt-4 pb-3 border-b border-slate-200 flex items-center justify-between gap-3"
                >
                  <div
                    class="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-900">
                      Free decision sim
                    </span>
                  </div>
                  <span class="text-[10px] text-slate-500">
                    Static · non-AI · always free
                  </span>
                </div>

                <!-- body copy -->
                <div class="px-4 py-4 text-sm text-slate-800 space-y-3 leading-relaxed flex-1">
                  <p class="text-sm md:text-base font-semibold text-slate-900">
                   Free random decision simulator.
                  </p>
                  <p>
                    <span class="font-semibold">Desensitize yourself.</span><br />
                    Watch realistic decision emails hit your fake inbox so the real “accepted” and
                    “denied” messages don’t feel like the first punch.
                  </p>
                  <p>
                    <span class="font-semibold">Static simulator only.</span><br />
                    This mode never reads your actual application. It’s there to make the inbox and
                    portals feel real — the PredictAdmit AI engine is what stress-tests your real
                    narrative.
                  </p>
                </div>

                <!-- footer / CTA -->
                <div
                  class="px-4 pb-4 pt-3 text-xs md:text-sm text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200"
                >
                  <p class="max-w-xs">
                    Powered by predictadmit.com. Start here, then upgrade to Pro if you want the AI
                    to read your actual app.
                  </p>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md border border-emerald-700 bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                    on:click={handleStartSimulationClick}
                  >
                    {hasApplied
                      ? isApplying
                        ? 'Simulating…'
                        : 'Simulation started'
                      : 'Start free simulation'}
                  </button>
                </div>
              </div>
            </div>

            <!-- RIGHT: PREMIUM AI box (navy / cyan) -->
            <div
              class="bg-slate-900 text-slate-50 rounded-md shadow-md border border-slate-900 flex flex-col justify-between relative overflow-hidden"
            >
              <div
                class="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-900/0 via-slate-900/40 to-slate-900/70"
              ></div>

              <AI on:getStarted={handleAiGetStarted} />
            </div>
          </div>

          {#if showAccountForm}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left: Form -->
              <form class="space-y-4" on:submit={handleSubmit}>
                <p class="text-xs md:text-sm text-slate-700">
                  Set up a fake login. It powers the portals and never leaves your browser.
                </p>

                <div>
                  <label
                    class="block text-sm font-semibold text-slate-800 mb-1"
                    for="applicant-name"
                  >
                    Name
                  </label>
                  <input
                    id="applicant-name"
                    type="text"
                    class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm rounded-md shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-800 focus:border-blue-800"
                    bind:value={name}
                    placeholder="e.g., Ben Dover"
                    autocomplete="name"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-semibold text-slate-800 mb-1"
                    for="applicant-email"
                  >
                    Email
                  </label>
                  <input
                    id="applicant-email"
                    type="email"
                    class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm rounded-md shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-800 focus:border-blue-800"
                    bind:value={email}
                    placeholder="you@example.com"
                    autocomplete="email"
                  />
                  <p class="text-xs text-slate-700 mt-1">
                    Fake emails are totally fine.
                  </p>
                </div>

                <div>
                  <label
                    class="block text-sm font-semibold text-slate-800 mb-1"
                    for="applicant-password"
                  >
                    Password
                  </label>
                  <div class="flex items-center gap-2">
                    <input
                      id="applicant-password"
                      type={showPassword ? 'text' : 'password'}
                      class="w-full border border-slate-500 bg-slate-50 px-3 py-2 text-sm rounded-md shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-800 focus:border-blue-800"
                      bind:value={password}
                      placeholder="Make one up"
                      autocomplete="new-password"
                    />
                    <button
                      type="button"
                      class="text-xs border border-slate-400 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200"
                      on:click={() => (showPassword = !showPassword)}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <p class="text-xs text-slate-700 mt-1">
                    Used only to “log in” to portals here.
                  </p>
                </div>

                <div class="mt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    class="inline-block bg-blue-900 text-white text-sm font-semibold px-4 py-2 rounded-md border border-blue-800 shadow hover:bg-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  >
                    Save login
                  </button>

                  {#if saveMessage}
                    <span class="text-xs text-emerald-700">
                      {saveMessage}
                    </span>
                  {/if}
                </div>
              </form>

              <!-- Right: ED/REA choice & explanation -->
              <div class="border border-slate-400 bg-slate-50 h-full text-sm flex flex-col rounded-md">
                <div class="border-b border-slate-300 bg-slate-200 px-3 py-2 rounded-t-md">
                  <span class="text-xs font-bold text-slate-900 uppercase">
                    Early Decision / REA
                  </span>
                </div>
                <div class="px-3 py-3 space-y-3 text-xs md:text-sm leading-relaxed text-slate-800 flex-1">
                  <p>
                    Pick one school as your ED / REA. Its email hits first—just like real life.
                  </p>
                  <div class="mt-1">
                    <label
                      for="ed-choice"
                      class="block text-xs font-semibold mb-1 text-slate-800"
                    >
                      ED / REA school
                    </label>
                    <select
                      id="ed-choice"
                      class="w-full border border-slate-500 bg-white px-2 py-2 text-xs rounded-md"
                      bind:value={edChoiceSlug}
                    >
                      <option value="">None – RD only</option>
                      {#each portals as portal}
                        <option value={portal.slug}>{portal.name}</option>
                      {/each}
                    </select>
                  </div>
                  <p class="mt-1 text-xs text-slate-700">
                    Leave it as “None” if you only want Regular Decision results.
                  </p>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </section>

      <!-- APPLY BUTTON / INBOX ANIMATION CONTROL -->
      {#if showAccountForm && hasSavedProfile}
        <section
          class="bg-white border border-slate-400 shadow-sm rounded-md px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-3"
        >
          <div class="text-sm text-slate-800 space-y-1">
            <p class="font-semibold">Run the simulation.</p>
            <p>
              Click <span class="font-semibold">Apply</span> to fast-forward from August to decision day and
              watch the emails roll in.
            </p>
          </div>
          <div class="ml-0 md:ml-4 text-right space-y-1">
            <button
              type="button"
              class={`text-sm font-semibold px-5 py-2 rounded-md border shadow focus:outline-none focus:ring-1 ${
                !canApply
                  ? 'bg-slate-200 text-slate-500 border-slate-400 cursor-not-allowed'
                  : hasApplied
                  ? 'bg-green-900 text-white border-green-950 cursor-default'
                  : 'bg-green-700 text-white border-green-900 hover:bg-green-600'
              }`}
              on:click={handleApply}
              disabled={!canApply || hasApplied}
            >
              {hasApplied
                ? isApplying
                  ? 'Simulating…'
                  : 'Simulation started'
                : 'Apply'}
            </button>
            {#if !canApply}
              <p class="text-xs text-slate-600">
                Fill in name, email, and password first.
              </p>
            {:else if hasApplied && visiblePortals.length === 0}
              <p class="text-xs text-slate-600">
                Sending apps and waiting…
              </p>
            {:else if hasApplied}
              <p class="text-xs text-slate-600">
                Decisions are loading into admitMail.
              </p>
            {/if}
          </div>
        </section>
      {/if}

      <!-- APPLICATION ANIMATION -->
      {#if hasApplied}
        <ApplicationTimeline
          {hasApplied}
          {calendarIndex}
          {applicationPhase}
          displayName={displayNameStr}
          displayEmail={displayEmailStr}
        />
      {/if}

      <!-- admitMail INBOX / EMAIL VIEW -->
      {#if hasApplied && applicationPhase === 'finished'}
        <AdmitMail
          bind:inboxSection
          {viewMode}
          {activeFolder}
          bind:searchQuery
          {filteredPortals}
          {sortedVisiblePortals}
          {visiblePortals}
          {currentEdPortal}
          {edEmailMustBeViewed}
          {hasViewedEdEmail}
          {readPortalSlugs}
          {selectedPortal}
          {selectedSent}
          {sentEmails}
          displayName={displayNameStr}
          displayEmail={displayEmailStr}
          {getReceivedLabel}
          resetSimulation={resetSimulation}
          selectPortal={handleSelectPortal}
          selectSent={handleSelectSent}
          switchFolder={switchFolder}
          openInboxList={openInboxList}
        />
      {/if}
    </div>
  </div>

  <SiteFooter />
</main>
