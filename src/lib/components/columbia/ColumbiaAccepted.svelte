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
    <div class="border-b-2 border-[#75A3D1] pb-4 mb-8">
      <div class="flex items-center">
        <div class="w-16 h-16 bg-[#002D72] text-white flex items-center justify-center font-bold text-2xl mr-4">
          C
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#002D72]">COLUMBIA UNIVERSITY</h1>
          <div class="text-sm text-gray-600">
            Undergraduate Admissions<br>
            New York, New York 10027<br>
            Telephone 212-854-2522
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
      <div class="text-lg font-bold text-[#002D72]">Congratulations!</div>
    </div>

    <!-- Letter Body -->
    <div class="space-y-4 mb-8">
      <p>
        On behalf of the Columbia University Committee on Admissions, I am delighted to inform you that you have been admitted to Columbia College or Columbia Engineering as a member of the Class of 2024. Your application impressed us with its intellectual curiosity, academic achievement, and potential to contribute to our vibrant community in Morningside Heights.
      </p>

      <p>
        This year, Columbia received over 40,000 applications for the approximately 1,400 places in the first-year class. Your admission is a testament to your exceptional abilities and your potential to thrive in Columbia's rigorous academic environment in the heart of New York City.
      </p>

      <div class="bg-blue-50 border-l-4 border-[#002D72] p-4 my-4">
        <h3 class="font-bold text-[#002D72] mb-2">The Core Curriculum</h3>
        <p class="text-sm">
          As a Columbia student, you will join the Core Curriculum, a set of common courses required of all undergraduates that have been the foundation of Columbia's undergraduate education since 1919. The Core will challenge you to think critically about the human experience and the world we inhabit.
        </p>
      </div>

      <p>
        We were particularly impressed by your potential to contribute to Columbia's diverse community of scholars. Located in New York City, Columbia offers unparalleled opportunities for research, internships, and cultural engagement that complement our rigorous academic programs.
      </p>

      <p>
        Columbia is committed to meeting 100% of the demonstrated financial need of all admitted students, and your financial aid award (if applicable) is available in your admission portal. We encourage you to review this information carefully as you make your college decision.
      </p>

      <p>
        To accept your offer of admission, please complete the online reply form in your admission portal by <strong>May 1, 2020</strong>. You are also invited to attend Days on Campus, our admitted students program, from April 16-18, 2020.
      </p>

      <p>
        Again, congratulations on this outstanding achievement. We look forward to welcoming you to Columbia University this fall.
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <div class="mb-2">
        <div class="h-1 w-32 bg-[#002D72]"></div>
      </div>
      <div class="font-bold text-lg">Jessica Marinaccio</div>
      <div class="text-sm text-gray-600">
        Dean of Undergraduate Admissions<br>
        Columbia University
      </div>
    </div>

    <!-- Columbia Crown -->
    <div class="mt-16 text-center">
      <div class="inline-block text-4xl mb-4">👑</div>
      <div class="text-sm text-gray-500">
        Columbia University in the City of New York<br>
        <span class="italic">Founded 1754 as King's College</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
      <div class="grid grid-cols-2 gap-8">
        <div>
          <strong>Columbia University Mission:</strong><br>
          Columbia University seeks to attract a diverse and international faculty and student body, to support research and teaching on global issues, and to create academic relationships with many countries and regions.
        </div>
        <div>
          <strong>Contact Information:</strong><br>
          Email: ugrad-admiss@columbia.edu<br>
          Phone: 212-854-2522<br>
          Website: undergrad.admissions.columbia.edu
        </div>
      </div>
    </div>

    <!-- Simulation Note -->
    <div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
      <strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. 
      This is not a real admission decision from Columbia University.
    </div>
  </div>
</main>