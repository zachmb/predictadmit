<script lang="ts">
  export let applicantName: string = 'Applicant';
</script>

<div class="min-h-screen bg-white p-8 font-serif">
  <div class="max-w-2xl mx-auto">
    <!-- Letterhead -->
    <div class="border-b-2 border-gray-300 pb-4 mb-8">
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 bg-gray-300 rounded mr-4 flex items-center justify-center">
          <span class="text-white text-xl font-bold">P</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-700">University of Pennsylvania</h1>
          <p class="text-gray-600 text-sm">Office of Undergraduate Admissions</p>
        </div>
      </div>
      <div class="text-sm text-gray-600">
        <p>1 College Hall, Room 100</p>
        <p>Philadelphia, Pennsylvania 19104</p>
      </div>
    </div>

    <!-- Date -->
    <p class="mb-8 text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

    <!-- Applicant Info -->
    <div class="mb-8">
      <p class="text-gray-800">{applicantName}</p>
      <p class="text-gray-600">Regular Decision Applicant</p>
    </div>

    <!-- Letter Body -->
    <div class="mb-8 leading-relaxed text-gray-800">
      <p class="mb-4">Dear {applicantName},</p>
      
      <p class="mb-4">
        Thank you for your application to the University of Pennsylvania. The Admissions Committee has 
        completed its review, and I regret to inform you that we are unable to offer you admission 
        to the Class of 2028.
      </p>
      
      <p class="mb-4">
        This year, Penn received more than 59,000 applications for approximately 2,400 places in 
        the first-year class—the most competitive selection process in our history. Each application 
        was reviewed thoroughly within the context of the applicant's available opportunities, 
        considering academic achievement, personal qualities, and potential contributions to our 
        community.
      </p>
      
      <div class="my-8 p-6 bg-gray-50 border-l-4 border-[#990000] italic">
        <p class="mb-2 font-semibold text-gray-700">About Our Selection Process</p>
        <p class="text-gray-600">
          Our holistic review considers each applicant's unique combination of talents, experiences, 
          and aspirations. While you have clearly accomplished a great deal, the limitations of our 
          class size prevent us from admitting many outstanding students who would undoubtedly thrive 
          at Penn.
        </p>
      </div>
      
      <p class="mb-4">
        Please know that this decision reflects the extraordinary selectivity of our applicant 
        pool rather than any deficiency in your accomplishments or potential. We have every 
        confidence that you will find success and make meaningful contributions at another 
        excellent institution.
      </p>
      
      <p class="mb-4">
        We appreciate the time and effort you dedicated to your application and wish you all the best 
        in your future academic endeavors.
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <p class="mb-1">Sincerely,</p>
      <div class="mb-8">
        <p class="font-semibold text-gray-700">Office of Undergraduate Admissions</p>
        <p class="text-sm text-gray-600">University of Pennsylvania</p>
      </div>
      
      <div class="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-300 text-sm">
        <p class="text-gray-700 mb-2">
          This decision is final for the 2024-2025 application cycle. We encourage you to explore 
          other excellent institutions where your talents will be valued and nurtured.
        </p>
      </div>
    </div>
  </div>
</div>