<script lang="ts">
  export let applicantName: string;
</script>

<svelte:head>

  <title>Yale College - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">

  <div class="max-w-3xl mx-auto mt-10">
  <div class="absolute left-1/2 transform -translate-x-1/2 max-w-3xl w-full" style="top: 2rem;">
		<a
			href="/"
			class="inline-block border border-slate-500 bg-slate-100 px-3 py-1 text-[11px] font-semibold hover:bg-slate-200 active:bg-slate-300 transition-colors shadow-sm"
			style="position: absolute; left: 0; top: 0;"
		>
			&#8592; Back to PredictAdmit admitMail
		</a>
	</div>
  
    <!-- Letterhead -->
    <div class="border-b-2 border-[#00356B] pb-4 mb-8">
      <div class="flex items-center">
        <div class="w-16 h-16 bg-[#00356B] text-white flex items-center justify-center font-bold text-2xl mr-4">
          Y
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#00356B]">YALE COLLEGE</h1>
          <div class="text-sm text-gray-600">
            Office of Undergraduate Admissions<br>
            P.O. Box 208234, New Haven, Connecticut 06520-8234<br>
            Telephone 203-432-9300 • Fax 203-432-9392
          </div>
        </div>
      </div>
    </div>

    <!-- Date and Address -->
    <div class="mb-8">
      <div class="text-right text-sm text-gray-600 mb-2">
        March 26, 2020
      </div>
      <div class="space-y-1">
        <div>{applicantName || 'Applicant'}</div>
        <div>1600 Pennsylvania Avenue NW</div>
        <div>Washington, DC 20500</div>
      </div>
    </div>

    <!-- Greeting -->
    <div class="mb-6">
      <div class="text-lg font-bold text-[#00356B]">Congratulations!</div>
    </div>

    <!-- Letter Body -->
    <div class="space-y-4 mb-8">
      <p>
        On behalf of the Admissions Committee, I am delighted to inform you that you have been admitted to the Yale College Class of 2024. Your application impressed us with its depth, creativity, and intellectual promise, and we believe that you will contribute significantly to the Yale community.
      </p>

      <p>
        This year, Yale received over 35,000 applications for the 1,550 places in the first-year class. Your admission is a tremendous accomplishment, and we hope you will join us next fall. The diverse perspectives, talents, and experiences you bring will enrich our campus in meaningful ways.
      </p>

      <p>
        You are invited to attend Bulldog Days, our admitted students program, from April 16-18, 2020. This program will give you the opportunity to experience life at Yale firsthand, meet current students and faculty, and connect with your future classmates.
      </p>

      <p>
        To accept your offer of admission, please complete the reply form available in your admissions portal by <strong>May 1, 2020</strong>. You will also find important information about financial aid, housing, and next steps in your portal.
      </p>

      <p>
        Again, congratulations on this outstanding achievement. We look forward to welcoming you to New Haven in August.
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <div class="mb-2">
        <img src="/yale-signature.png" alt="Signature" class="h-12" style="filter: invert(15%) sepia(85%) saturate(1500%) hue-rotate(200deg) brightness(30%) contrast(100%);">
      </div>
      <div class="font-bold">Jeremiah Quinlan</div>
      <div class="text-sm text-gray-600">
        Dean of Undergraduate Admissions<br>
        Yale College
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
      <div class="grid grid-cols-2 gap-8">
        <div>
          <strong>Yale College Mission:</strong><br>
          Yale is committed to improving the world today and for future generations through outstanding research and scholarship, education, preservation, and practice.
        </div>
        <div>
          <strong>Contact Information:</strong><br>
          Email: undergraduate.admissions@yale.edu<br>
          Phone: 203-432-9300<br>
          Website: admissions.yale.edu
        </div>
      </div>
    </div>

    <!-- Simulation Note -->
    <div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
      <strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. 
      This is not a real admission decision from Yale University.
    </div>
  </div>
</main>
