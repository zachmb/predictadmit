<script lang="ts">
  export let applicantName: string;
  export let schoolName: string = 'Harvard College';
  export let primaryColor: string;
  export let footerDomain: string = 'HARVARD.EDU';
  import BackToInboxButton from '$lib/components/common/BackToInboxButton.svelte';
</script>

<div class="min-h-screen bg-slate-200 text-slate-900 font-serif flex flex-col">
  <header class="bg-white border-b border-slate-300">
    <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
      <div>
        <div class="text-2xl font-bold" style={`color: ${primaryColor};`}>
          {schoolName}
        </div>
        <div class="text-[11px] tracking-[0.15em] uppercase text-slate-700">
          Office of Admissions and Financial Aid
        </div>
      </div>
      <div class="text-[11px] text-slate-700 text-right">
        {applicantName} ·{' '}
        <a href="/" class="text-blue-800 underline hover:no-underline">
          Logout
        </a>
      </div>
    </div>
    <div class="h-3" style={`background-color: ${primaryColor};`}></div>
  </header>

  <section class="flex-1 bg-white">
    <div class="max-w-4xl mx-auto px-6 py-10 relative">
      <a
        href="/"
        class="fade-in-button inline-block border border-slate-500 bg-slate-100 px-3 py-1 text-[11px] font-semibold hover:bg-slate-200 active:bg-slate-300 absolute left-0 -top-8"
      >
        &#8592; Back to PredictAdmit admitMail
      </a>

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
        It is with great pleasure that I write to inform you of your admission to the
        <span class="font-semibold"> {schoolName} Class of 2026</span>.
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        The Admissions Committee was deeply impressed by your outstanding academic record, your
        intellectual curiosity, and the ways in which you have contributed to your school and
        community.
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        In the coming weeks, you will receive additional information about financial aid, housing,
        and our April visiting programs for admitted students.
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        On behalf of the faculty and students of {schoolName}, congratulations. We hope you will
        choose to join us in Cambridge this fall.
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mt-4">
        Sincerely,<br />
        <span class="font-semibold">William R. Fitzsimmons</span><br />
        Dean of Admissions and Financial Aid<br />
        {schoolName}
      </p>
    </div>
  </section>

  <footer class="mt-auto">
    <div
      class="h-10 flex items-center"
      style={`background-color: ${primaryColor};`}
    >
      <div class="max-w-4xl mx-auto px-6 w-full flex items-center justify-between text-[11px] text-white">
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
