<script lang="ts">
  export let applicantName: string;
  
  const dateOfBirth = "July 1, 2002";
  const permanentAddress = "123 Collegeway\nPasadena, CA 91001\nUnited States";
</script>

<svelte:head>
  <title>Stanford University - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
  <div class="max-w-4xl mx-auto">
    <!-- Letterhead -->
    <div class="border-b-2 border-[#8C1515] pb-4 mb-8">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-[#8C1515]">STANFORD</h1>
          <div class="text-lg font-semibold text-gray-700">UNIVERSITY</div>
          <div class="text-sm text-gray-600 mt-2">
            Office of Undergraduate Admission<br>
            355 Galvez Street, Stanford, CA 94305-6106<br>
            Telephone 650-723-2091 • Fax 650-725-2846
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-600">March 27, 2020</div>
          <div class="mt-2 text-xs text-gray-500">
            Application ID: SU20{Math.floor(10000 + Math.random() * 90000)}
          </div>
        </div>
      </div>
    </div>

    <!-- Applicant Info -->
    <div class="mb-8 grid grid-cols-2 gap-8">
      <div>
        <div class="font-bold text-lg mb-2">{applicantName || 'Applicant'}</div>
        <div class="text-sm text-gray-600">
          <div>Date of Birth: {dateOfBirth}</div>
          <div class="mt-4 font-medium">Permanent Address:</div>
          <div class="whitespace-pre-line text-sm">{permanentAddress}</div>
        </div>
      </div>
      <div class="text-right">
        <div class="text-5xl text-[#8C1515] font-bold mb-4">🎉</div>
        <div class="text-2xl font-bold text-[#8C1515]">Congratulations!</div>
      </div>
    </div>

    <!-- Letter Body -->
    <div class="space-y-6 mb-10">
      <div class="text-center py-4 bg-[#F9F2E8] border border-[#E4D5C0] rounded">
        <h2 class="text-2xl font-bold text-[#8C1515] mb-2">You're In!</h2>
        <p class="text-lg">Welcome to the Stanford University Class of 2024</p>
      </div>

      <p class="text-lg">
        Dear {applicantName || 'Applicant'},
      </p>

      <p>
        On behalf of the Admission Committee, I am thrilled to inform you that you have been admitted to Stanford University as a member of the Class of 2024. Your application stood out among more than 45,000 others for its intellectual vitality, creativity, and demonstrated commitment to making a difference in the world.
      </p>

      <p>
        We were particularly impressed by your potential to contribute to Stanford's culture of innovation and discovery. Your unique perspective and experiences will enrich our campus community, and we believe you will thrive in our collaborative, interdisciplinary environment.
      </p>

      <div class="bg-[#F5F5F5] p-6 border-l-4 border-[#8C1515]">
        <h3 class="font-bold text-[#8C1515] mb-2">Next Steps:</h3>
        <ul class="space-y-2">
          <li>• <strong>Admit Weekend:</strong> April 16-18, 2020 (Virtual options available)</li>
          <li>• <strong>Reply Deadline:</strong> May 1, 2020</li>
          <li>• <strong>Financial Aid:</strong> Your award letter is available in your portal</li>
          <li>• <strong>Housing:</strong> Apply by May 15, 2020</li>
        </ul>
      </div>

      <p>
        Stanford offers an unmatched educational experience, combining world-class academics with a vibrant campus life in the heart of Silicon Valley. We provide generous financial aid to meet 100% of demonstrated need, and we encourage you to explore the many opportunities available through our 650+ student organizations, research initiatives, and artistic programs.
      </p>

      <p>
        To accept your offer of admission, please complete the online reply form in your admission portal by <strong>May 1, 2020</strong>. You'll also find detailed information about orientation, course selection, and campus resources in your portal.
      </p>

      <p class="font-semibold">
        We can't wait to welcome you to the Farm this fall!
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <div class="mb-4">
        <div class="h-1 w-48 bg-[#8C1515]"></div>
      </div>
      <div class="font-bold text-lg">Richard H. Shaw</div>
      <div class="text-sm text-gray-600">
        Dean of Admission and Financial Aid<br>
        Stanford University
      </div>
    </div>

    <!-- Stanford Seal -->
    <div class="mt-16 pt-8 border-t border-gray-300 text-center">
      <div class="inline-block p-4 border-2 border-[#8C1515] rounded-full">
        <div class="text-[#8C1515] font-bold text-sm">STANFORD UNIVERSITY</div>
        <div class="text-xs text-gray-600 mt-1">Founded 1891</div>
      </div>
      <div class="mt-4 text-xs text-gray-500">
        <p>"Die Luft der Freiheit weht" – The wind of freedom blows</p>
        <p class="mt-2">Office of Undergraduate Admission • Stanford University</p>
        <p>admission@stanford.edu • 650-723-2091 • admission.stanford.edu</p>
      </div>
    </div>

    <!-- Simulation Note -->
    <div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
      <strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. 
      This is not a real admission decision from Stanford University.
    </div>
  </div>
</main>