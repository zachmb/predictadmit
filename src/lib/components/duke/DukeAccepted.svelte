<script lang="ts">
  export let applicantName: string;
  export let schoolName: string = 'Duke University';
  export let primaryColor: string = '#00539B';
  export let footerDomain: string = 'DUKE.EDU';
  import BackToInboxButton from '$lib/components/common/BackToInboxButton.svelte';
</script>

<div class="min-h-screen bg-slate-200 text-slate-900 font-serif flex flex-col">
  <!-- HEADER -->
  <header class="bg-white border-b border-slate-300">
    <div class="max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
      <div class="flex items-baseline gap-3">
        <span class="text-3xl font-serif" style={`color: ${primaryColor};`}>
          Duke
        </span>
        <span class="text-[11px] tracking-[0.18em] uppercase text-slate-700">
          Undergraduate Admissions
        </span>
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
      <!-- Fade-in back button -->
      <a
        href="/"
        class="fade-in-button inline-block border border-slate-500 bg-slate-100 px-3 py-1 text-[11px] font-semibold hover:bg-slate-200 active:bg-slate-300 absolute left-0 -top-8"
      >
        &#8592; Back to PredictAdmit admitMail
      </a>

      <p class="text-[11px] text-slate-700 mb-4">
        December 12, 2019
      </p>

      <p class="text-[12px] text-slate-900 mb-4">
        {applicantName}
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        Dear {applicantName},
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        Congratulations! It is my pleasure to offer you admission to
        <span class="font-semibold"> {schoolName}</span> as a member of the Class of 2024.
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        The Admissions Committee was impressed by your academic record, your curiosity, and the many
        ways you have invested in your school and community. We believe you will make important
        contributions to the Duke community both inside and outside of the classroom.
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        In the coming weeks, your admitted student portal will include information about financial aid,
        housing, and programs designed to help you learn more about Duke. Please review these materials
        carefully and submit your enrollment decision by the reply date listed in your portal.
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        All of us in Undergraduate Admissions join me in congratulating you on your accomplishments.
        We hope you will choose to join us in Durham.
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mt-4">
        Sincerely,<br />
        <span class="font-semibold">Christoph Guttentag</span><br />
        Dean of Undergraduate Admissions<br />
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
