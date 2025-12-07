<script lang="ts">
  let { applicantName = '' } = $props<{ applicantName: string }>();
  
  // Extract first name from full name
  const firstName = $derived(() => {
    if (!applicantName) return '';
    const names = applicantName.split(' ');
    return names[0] || '';
  });
</script>

<svelte:head>
  <title>Columbia University - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
  <div class="max-w-3xl mx-auto">
    <!-- Letterhead -->
    <div class="border-b-2 border-gray-400 pb-4 mb-8">
      <div class="flex items-center">
        <div class="w-16 h-16 bg-gray-400 text-white flex items-center justify-center font-bold text-2xl mr-4">
          C
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-700">COLUMBIA UNIVERSITY</h1>
          <div class="text-sm text-gray-600">
            Undergraduate Admissions<br>
            New York, New York 10027
          </div>
        </div>
      </div>
    </div>

    <!-- Date and Address -->
    <div class="mb-8">
      <div class="text-right text-sm text-gray-600 mb-2">
        March 25, 2020
      </div>
      <div class="space-y-1">
        <div>{applicantName || 'Applicant'}</div>
        <div>F33 College Way</div>
        <div>Pasadena, CA 91001</div>
        <div>United States</div>
      </div>
    </div>

    <!-- Greeting -->
    <div class="mb-6">
      <div class="text-lg font-bold text-gray-700">Admissions Decision</div>
    </div>

    <!-- Letter Body -->
    <div class="space-y-4 mb-8">
      <p>
        Thank you for applying to Columbia University. The Committee on Admissions has completed its review of applications for the Class of 2024, and I regret to inform you that we are unable to offer you admission.
      </p>

      <p>
        This year, Columbia received over 40,000 applications for approximately 1,400 places in the first-year class. The selection process was exceptionally difficult due to the extraordinary qualifications of our applicant pool. Please understand that our decision reflects the competitive nature of our admissions process and is not a judgment of your abilities or potential.
      </p>

      <div class="bg-gray-50 p-6 border border-gray-200 rounded my-4">
        <h3 class="font-bold text-gray-700 mb-2">Columbia's Holistic Review Process</h3>
        <p class="text-sm">
          Columbia practices a holistic review, considering academic achievement, personal qualities, extracurricular engagement, and potential to contribute to our campus community. Each application is read by multiple committee members before final decisions are made.
        </p>
      </div>

      <p>
        We recognize the considerable time and effort you devoted to your application, and we appreciate your interest in Columbia University. We have no doubt that you will find a college where you will thrive and make significant contributions.
      </p>

      <p>
        Your application demonstrated many strengths, and we encourage you to take pride in your accomplishments. The particular combination of talents and experiences we seek each year varies, and the fact that you were not admitted does not diminish your achievements or potential.
      </p>

      <p>
        We wish you every success in your future academic endeavors and hope that you will continue to pursue your intellectual passions with the same dedication evident in your application.
      </p>
    </div>

    <!-- Next Steps -->
    <div class="mt-8 p-6 bg-gray-50 border border-gray-200 rounded">
      <h3 class="font-bold text-gray-700 mb-3">Next Steps & Resources</h3>
      <ul class="space-y-2 text-sm">
        <li>• You may consider applying for transfer admission after completing one year of college coursework.</li>
        <li>• Columbia offers various summer programs and online courses through Columbia University Summer Sessions.</li>
        <li>• We encourage you to explore our virtual campus tours and admission resources at <a href="https://undergrad.admissions.columbia.edu" class="text-blue-600 hover:underline">undergrad.admissions.columbia.edu</a>.</li>
      </ul>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <div class="mb-2">
        <div class="h-1 w-32 bg-gray-400"></div>
      </div>
      <div class="font-bold">Jessica Marinaccio</div>
      <div class="text-sm text-gray-600">
        Dean of Undergraduate Admissions<br>
        Columbia University
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
      <p class="italic mb-4">
        "Columbia's graduates are recognized for their intellectual rigor, their collaborative and forward-thinking spirit, and their commitment to making a positive impact on the world."
      </p>
      <div>
        <strong>Columbia University Admissions Office</strong><br>
        212 Hamilton Hall, Mail Code 2807<br>
        1130 Amsterdam Avenue<br>
        New York, NY 10027<br>
        Phone: 212-854-2522 • Email: ugrad-admiss@columbia.edu
      </div>
    </div>

    <!-- Simulation Note -->
    <div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
      <strong>Note:</strong> This is a simulated admission decision for entertainment purposes only. 
      This is not a real decision from Columbia University.
    </div>
  </div>
</main>