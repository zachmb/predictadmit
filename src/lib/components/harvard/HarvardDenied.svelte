<script lang="ts">
  export let applicantName: string;
  export let schoolName: string = 'Harvard College';
  export let primaryColor: string;
  export let footerDomain: string = 'HARVARD.EDU';
  import BackToInboxButton from '$lib/components/common/BackToInboxButton.svelte';
</script>

<div class="min-h-screen bg-slate-200 text-slate-900 font-serif flex flex-col">
  <!-- HEADER -->
  <header class="bg-white border-b border-slate-300">
    <div class="max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
      <div class="flex items-baseline gap-3">
        <span class="text-3xl font-serif" style={`color: ${primaryColor};`}>
          Harvard
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

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        Dear {applicantName},
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        Thank you for applying for admission to {schoolName}; I am sorry to tell you that we are
        unable to offer you admission next fall.
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        I want to assure you that our decision is more a reflection of the number of applications
        received and the limited space we have available for our incoming class rather than about any
        shortcomings in your application. We received thousands of Early Decision applications this
        year for a comparatively small number of places; we had to disappoint many accomplished,
        talented, and fully deserving young people.
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        Because you applied under our Early Decision notification plan and this is a final decision,
        you will not be able to apply through our Regular Decision plan. You have our best wishes as
        you continue your senior year and for the remainder of your college search.
      </p>

      <p class="text-[12px] leading-relaxed text-slate-900 mb-3">
        I know this is not the letter you hoped to receive, especially since you demonstrated such a
        strong interest in attending {schoolName}. I know you have great potential for success in
        college and beyond, and I truly appreciate that we were your first choice.
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
