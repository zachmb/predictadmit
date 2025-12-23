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
    <div class="border-b-2 border-gray-400 pb-4 mb-8">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-700">STANFORD</h1>
          <div class="text-lg font-semibold text-gray-600">UNIVERSITY</div>
          <div class="text-sm text-gray-600 mt-2">
            Office of Undergraduate Admission<br>
            355 Galvez Street, Stanford, CA 94305-6106
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
    <div class="mb-8">
      <div class="font-bold text-lg mb-2">{applicantName || 'Applicant'}</div>
      <div class="text-sm text-gray-600">
        <div>Date of Birth: {dateOfBirth}</div>
        <div class="mt-2">Permanent Address: {permanentAddress.split('\n')[0]}</div>
      </div>
    </div>

    <!-- Decision Header -->
    <div class="text-center py-6 mb-8 bg-gray-50 border border-gray-300 rounded">
      <div class="text-2xl font-bold text-gray-700 mb-2">Admissions Decision</div>
      <div class="text-lg text-gray-600">Stanford University Class of 2024</div>
    </div>

    <!-- Letter Body -->
    <div class="space-y-6 mb-10">
      <p class="text-lg">
        Dear {applicantName || 'Applicant'},
      </p>

      <p>
        Thank you for applying to Stanford University. The Admission Committee has completed its review of applications for the Class of 2024, and I regret to inform you that we are unable to offer you admission.
      </p>

      <p>
        This year, Stanford received over 45,000 applications for approximately 1,700 places in the first-year class. The selection process was exceptionally challenging due to the outstanding qualifications of all our applicants. Please know that our decision reflects the competitive nature of our admission process and is not a reflection of your abilities or potential.
      </p>

      <div class="bg-gray-50 p-6 border border-gray-300 rounded">
        <h3 class="font-bold text-gray-700 mb-3">About Stanford's Admission Process:</h3>
        <p class="text-sm mb-3">
          Stanford practices a holistic review process, considering academic achievement, personal context, extracurricular contributions, and intellectual vitality. With an admission rate of less than 5%, many highly qualified applicants cannot be offered admission.
        </p>
        <p class="text-sm">
          We encourage you to take pride in your accomplishments and to continue pursuing your educational goals with the same determination that brought you to apply to Stanford.
        </p>
      </div>

      <p>
        Your application demonstrated many strengths, and we have no doubt that you will find a college where you will excel and make meaningful contributions. The particular combination of talents and experiences we seek each year varies, and the fact that you were not admitted does not diminish your achievements or potential.
      </p>

      <p>
        We appreciate the time and effort you devoted to your application, and we thank you for your interest in Stanford University.
      </p>
    </div>

    <!-- Additional Resources -->
    <div class="mt-8 p-6 bg-[#F9F2E8] border border-[#E4D5C0] rounded">
      <h3 class="font-bold text-gray-700 mb-3">Other Ways to Engage with Stanford:</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <h4 class="font-semibold mb-1">Online Learning</h4>
          <ul class="space-y-1">
            <li>• Stanford Online (free courses)</li>
            <li>• Summer Session (open enrollment)</li>
            <li>• Stanford Pre-Collegiate Studies</li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-1">Campus Resources</h4>
          <ul class="space-y-1">
            <li>• Virtual campus tours</li>
            <li>• Stanford Arts programs</li>
            <li>• Public lecture series</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <div class="mb-4">
        <div class="h-1 w-48 bg-gray-400"></div>
      </div>
      <div class="font-bold">Richard H. Shaw</div>
      <div class="text-sm text-gray-600">
        Dean of Admission and Financial Aid<br>
        Stanford University
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-16 pt-8 border-t border-gray-300 text-center text-xs text-gray-500">
      <p class="italic mb-4">
        "The purpose of education is to replace an empty mind with an open one." – Malcolm Forbes
      </p>
      <p>
        Office of Undergraduate Admission • Stanford University<br>
        355 Galvez Street, Stanford, CA 94305-6106<br>
        admission@stanford.edu • admission.stanford.edu
      </p>
    </div>

    <!-- Simulation Note -->
    <div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
      <strong>Note:</strong> This is a simulated admission decision for entertainment purposes only. 
      This is not a real decision from Stanford University.
    </div>
  </div>
</main>