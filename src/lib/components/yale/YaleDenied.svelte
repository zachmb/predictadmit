<script lang="ts">
  export let applicantName: string;
</script>

<svelte:head>
  <title>Yale College - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
  <div class="max-w-3xl mx-auto">
    <!-- Letterhead -->
    <div class="border-b-2 border-gray-400 pb-4 mb-8">
      <div class="flex items-center">
        <div class="w-16 h-16 bg-gray-400 text-white flex items-center justify-center font-bold text-2xl mr-4">
          Y
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-700">YALE COLLEGE</h1>
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
      <div class="text-lg font-bold text-gray-700">Admissions Decision</div>
    </div>

    <!-- Letter Body -->
    <div class="space-y-4 mb-8">
      <p>
        Thank you for applying to Yale College. The Admissions Committee has completed its review of applications for the Class of 2024, and I regret to inform you that we are unable to offer you admission.
      </p>

      <p>
        This year, Yale received over 35,000 applications for approximately 1,550 places in the first-year class. The selection process was exceptionally difficult due to the extraordinary qualifications of our applicant pool. Please understand that our decision reflects the competitive nature of our admissions process and is not a judgment of your abilities or potential.
      </p>

      <p>
        We recognize the time and effort you devoted to your application, and we appreciate your interest in Yale. We have no doubt that you will find a college where you will thrive and make significant contributions.
      </p>

      <p>
        We wish you every success in your future academic endeavors and hope that you will continue to pursue your intellectual passions with the same dedication and enthusiasm evident in your application.
      </p>
    </div>

    <!-- Next Steps -->
    <div class="mt-8 p-6 bg-gray-50 border border-gray-200 rounded">
      <h3 class="font-bold text-gray-700 mb-3">Next Steps & Resources</h3>
      <ul class="space-y-2 text-sm">
        <li>• You may reapply for transfer admission after completing at least one year of college coursework.</li>
        <li>• Yale offers a variety of summer programs and online courses open to all students.</li>
        <li>• We encourage you to explore our virtual campus tours and online resources at <a href="https://admissions.yale.edu" class="text-blue-600 hover:underline">admissions.yale.edu</a>.</li>
      </ul>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <div class="mb-2">
        <div class="h-1 w-32 bg-gray-400"></div>
      </div>
      <div class="font-bold">Jeremiah Quinlan</div>
      <div class="text-sm text-gray-600">
        Dean of Undergraduate Admissions<br>
        Yale College
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
      <p class="italic">
        "The aim of education is not to fill a bucket but to light a fire." – William Butler Yeats
      </p>
      <div class="mt-4">
        <strong>Yale College Admissions Office</strong><br>
        P.O. Box 208234, New Haven, CT 06520-8234<br>
        Phone: 203-432-9300 • Email: undergraduate.admissions@yale.edu
      </div>
    </div>

    <!-- Simulation Note -->
    <div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
      <strong>Note:</strong> This is a simulated admission decision for entertainment purposes only. 
      This is not a real decision from Yale University.
    </div>
  </div>
</main>
