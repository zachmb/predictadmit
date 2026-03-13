<script>
  const applications = [
    {
      type: "Undergraduate Application",
      term: "Fall 2026 First Year Main Campus",
      status: "Submitted",
      started: "11/24/2025",
      submitted: "11/24/2025"
    }
  ];
</script>

<div class="min-h-screen flex bg-[#0a3a63] text-white font-sans">
  <!-- LEFT SIDEBAR -->
  <aside class="w-[260px] shrink-0 px-8 pt-10 pb-8 border-r border-white/10">
    <!-- Logo Area -->
    <div class="mb-12">
      <div class="text-[22px] leading-[1.1] font-semibold tracking-wide">
        WESTERN<br />
        WASHINGTON<br />
        UNIVERSITY
      </div>
      <div class="mt-2 text-[12px] tracking-[0.25em] text-white/70">
        MAKE WAVES.
      </div>
    </div>

    <!-- Nav -->
    <nav class="space-y-6 text-[15px] tracking-wide font-semibold">
      <div class="hover:text-[#c4dd3b] cursor-pointer">ADMISSIONS</div>
      <div class="hover:text-[#c4dd3b] cursor-pointer">APPLY</div>
      <div class="hover:text-[#c4dd3b] cursor-pointer">VISIT</div>
    </nav>
  </aside>

  <!-- MAIN CONTENT -->
  <main class="flex-1 px-[70px] pt-[60px] pb-[80px]">
    <!-- Top Right User -->
    <div class="flex justify-end items-center mb-[60px]">
      <div class="text-[15px] mr-4">Zachary Basinger</div>
      <button
        class="text-[12px] border border-white/50 px-4 py-1 rounded-sm tracking-wide hover:bg-white hover:text-[#0a3a63] transition"
      >
        LOGOUT
      </button>
    </div>

    <!-- Title -->
    <h1 class="text-[38px] leading-[1.2] font-bold max-w-[900px] mb-6">
      WWU Undergraduate Application for Admission and Scholarships
    </h1>

    <p class="text-white/80 text-[15px] leading-relaxed max-w-[760px] mb-[60px]">
      Welcome! To begin the application process, please create an account under the
      first-time users section. If you have already started a WWU application on
      this site, you can login in the returning users section.
    </p>

    <!-- APPLICATIONS SECTION -->
    <div class="border-t border-white/30 pt-[30px]">
      <h2 class="text-[22px] font-semibold mb-6">Your Applications</h2>

      <!-- Header Row -->
      <div class="grid grid-cols-12 text-white/70 text-[14px] font-semibold pb-3 border-b border-white/30">
        <div class="col-span-5">Type</div>
        <div class="col-span-2">Status</div>
        <div class="col-span-2">Started</div>
        <div class="col-span-3 text-right">Submitted</div>
      </div>

      <!-- Info Row -->
      <div class="text-white/70 text-[14px] py-4 border-b border-white/10">
        You have started 1 application, listed below, using this account.
      </div>

      <!-- Application Row -->
      {#each applications as app}
        <div class="grid grid-cols-12 items-center py-5 border-b border-white/10 text-[15px]">
          <div class="col-span-5">
            <div class="text-[#8ec6ff] hover:underline cursor-pointer">
              {app.type}
            </div>
            <div class="text-[#c4dd3b]">
              {app.term}
            </div>
          </div>

          <div class="col-span-2">{app.status}</div>
          <div class="col-span-2">{app.started}</div>
          <div class="col-span-3 text-right">{app.submitted}</div>
        </div>
      {/each}

      <!-- Button -->
      <div class="mt-[45px]">
        <button
          class="bg-[#c4dd3b] text-[#0a3a63] text-[14px] font-semibold px-10 py-4 tracking-wide shadow-sm hover:brightness-95 transition"
        >
          START NEW APPLICATION
        </button>
      </div>
    </div>

    <!-- FOOTER AREA -->
    <div class="mt-[90px] border-t border-white/30 pt-[40px] grid grid-cols-2 gap-[100px]">
      <!-- Office -->
      <div>
        <h3 class="text-[16px] font-semibold tracking-[0.15em] mb-6">
          OFFICE OF ADMISSIONS
        </h3>

        <div class="space-y-3 text-[14px] text-white/80">
          <div class="hover:underline cursor-pointer">CONTACT</div>
          <div class="hover:underline cursor-pointer">REQUEST INFO</div>
          <div class="hover:underline cursor-pointer">Accessibility</div>
          <div class="hover:underline cursor-pointer">
            Website Privacy Statement
          </div>
        </div>
      </div>

      <!-- Tribal Lands -->
      <div>
        <h3 class="text-[16px] font-semibold tracking-[0.15em] text-[#c4dd3b] mb-6">
          TRIBAL LANDS STATEMENT
        </h3>

        <p class="text-[14px] text-white/80 leading-relaxed">
          Western Washington University's main campus is situated on the ancestral
          homelands of the Coast Salish Peoples, who have lived in the Salish Sea
          basin, all throughout the San Juan Islands and the North Cascades watershed
          from time immemorial. We express our deepest respect and gratitude to our
          Indigenous neighbors, for their enduring care and protection of our shared
          lands and waterways.
          <span class="text-[#8ec6ff] hover:underline cursor-pointer">
            Access our inclusive Tribal Lands Statement.
          </span>
        </p>
      </div>
    </div>
  </main>
</div>