<script lang="ts">
  export let applicantName: string;
  export let schoolName: string;
  export let primaryColor: string;
  export let footerDomain: string;
  import BackToInboxButton from '$lib/components/common/BackToInboxButton.svelte';
</script>

<div class="min-h-screen bg-slate-200 text-slate-900 font-serif flex flex-col">
  <!-- HEADER -->
  <header class="bg-white border-b border-slate-300">
    <div class="max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
      <div>
        <div class="text-2xl font-bold" style={`color: ${primaryColor};`}>
          {schoolName}
        </div>
        <div class="text-[11px] tracking-[0.15em] uppercase text-slate-700">
          Undergraduate Admissions
        </div>
      </div>
      <div class="text-[11px] text-slate-700">
        {applicantName}{' '}
        <span class="text-slate-400">&nbsp;|&nbsp;</span>
        <a href="/" class="text-blue-800 underline hover:no-underline">
          Logout
        </a>
      </div>
    </div>
    <div class="h-8" style={`background-color: ${primaryColor};`}></div>
  </header>

  <!-- LETTER -->
  <section class="flex-1 bg-white">
    <div class="max-w-5xl mx-auto px-10 py-10 relative">
      <!-- Fade-in back button top-left -->
      <BackToInboxButton />

      <p class="text-[11px] text-slate-700 mb-4">
        March 28, 2026
      </p>

      <p class="text-[12px] text-slate-900 mb-4">
        {applicantName}
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        Dear {applicantName},
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        The Admissions Committee has completed its review of your application to
        <span class="font-semibold"> {schoolName}</span>. I regret to inform you that we are unable to
        offer you admission to the entering class of 2026.
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        This decision in no way diminishes the accomplishments you have achieved in your academic work
        and in your community. We simply receive far more qualified applications than we are able to
        accommodate in our entering class.
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        We appreciate the time and care you devoted to your application and your interest in {schoolName}.
        We wish you the very best in your future academic and personal endeavors.
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mt-4">
        Sincerely,<br />
        <span class="font-semibold">Director of Undergraduate Admissions</span><br />
        {schoolName}
      </p>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="mt-auto">
    <div
      class="h-10 flex items-center"
      style={`background-color: ${primaryColor};`}
    >
      <div class="max-w-5xl mx-auto px-6 w-full flex items-center justify-between text-[11px] text-white">
        <span>&copy; {footerDomain} 2019</span>
        <span class="opacity-80">
          PredictAdmit.com simulation · Not affiliated with {schoolName}
        </span>
      </div>
    </div>
  </footer>
</div>

<style>
  .fade-in-button {
    opacity: 0;
    animation: fade-in-button 0.6s ease-out 0.2s forwards;
  }

  @keyframes fade-in-button {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
