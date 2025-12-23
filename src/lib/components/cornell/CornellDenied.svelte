<script lang="ts">
  export let applicantName: string;

  // Cornell Red
  const primaryColor = '#B31B1B';
</script>

<svelte:head>
  <title>Cornell University - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6 leading-relaxed">
  <div class="max-w-3xl mx-auto mt-10 relative">
    <div class="absolute left-0 -top-12 w-full">
      <a
        href="/"
        class="inline-block border border-slate-500 bg-slate-100 px-3 py-1 text-[11px] font-semibold hover:bg-slate-200 active:bg-slate-300 transition-colors shadow-sm no-underline text-slate-800"
      >
        &#8592; Back to PredictAdmit admitMail
      </a>
    </div>

    <div class="border-b-4 pb-4 mb-8" style={`border-color: ${primaryColor};`}>
      <div class="flex items-center">
        <div
          class="w-16 h-16 text-white flex items-center justify-center font-bold text-2xl mr-4 rounded-full border-2 border-current"
          style={`background-color: ${primaryColor}; color: white;`}
        >
          CU
        </div>
        <div>
          <h1 class="text-2xl font-bold" style={`color: ${primaryColor};`}>
            CORNELL UNIVERSITY
          </h1>
          <div class="text-sm text-gray-600 leading-snug">
            Undergraduate Admissions Office<br />
            410 Thurston Avenue, Ithaca, NY 14850<br />
            Telephone 607.255.5241 • Fax 607.255.0659
          </div>
        </div>
      </div>
    </div>

    <div class="mb-10">
      <div class="text-right text-sm text-gray-600 mb-6">March 26, 2020</div>
      <div class="space-y-1 font-semibold text-lg">
        <div>{applicantName || 'Applicant'}</div>
      </div>
    </div>

    <div class="mb-6">
      <div class="text-xl font-bold text-gray-700">An Admissions Decision</div>
    </div>

    <div class="space-y-6 mb-12 text-[15px]">
      <p>
        Thank you for your application to Cornell University for the Class of 2024. We appreciate
        the time and care you took to share your achievements and aspirations with us.
      </p>

      <p>
        This year, we received an historically high number of applications for a limited number of
        spaces in the first-year class. The selection process was incredibly difficult, involving a
        comprehensive and holistic review of every applicant's academic record, essays, and
        extracurricular engagement.
      </p>

      <p>
        After careful consideration by the Admissions Committee, I regret to inform you that we are
        unable to offer you admission at this time. Please know that this decision is not a reflection
        of your potential for success, but rather a consequence of the extraordinary competitiveness
        of this year's applicant pool.
      </p>

      <p>
        We know that this is disappointing news. We wish you the very best in all your future academic
        and personal endeavors.
      </p>
    </div>

    <div class="mt-12">
      <div class="mb-4">
        <img
          src="/yale-signature.png"
          alt="Signature"
          class="h-16"
          style="filter: invert(16%) sepia(78%) saturate(3315%) hue-rotate(346deg) brightness(85%) contrast(102%); opacity: 0.9;"
        />
      </div>
      <div class="font-bold text-lg">Shawn L. Abbott</div>
      <div class="text-sm text-gray-600 leading-snug">
        Vice Provost for Enrollment<br />
        Dean of Undergraduate Admissions
      </div>
    </div>

    <div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500 leading-normal">
      <div class="grid grid-cols-2 gap-8">
        <div>
          <strong>Cornell University Mission:</strong><br />
          Cornell is a private, Ivy League research university and a land-grant institution of New York
          State. We aim to discover, preserve, and disseminate knowledge, to educate the next generation
          of global citizens, and to promote a culture of broad inquiry throughout and beyond the Cornell
          community.
        </div>
        <div>
          <strong>Contact Information:</strong><br />
          Email: admissions@cornell.edu<br />
          Phone: 607.255.5241<br />
          Website: admissions.cornell.edu
        </div>
      </div>
    </div>

    <div
      class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800"
    >
      <strong>Note:</strong> This is a simulated admission letter for entertainment purposes only.
      This is not a real admission decision from Cornell University.
    </div>
  </div>
</main>