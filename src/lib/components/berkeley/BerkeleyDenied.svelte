<script lang="ts">
  export let applicantName: string = 'Applicant';
</script>

<div class="min-h-screen bg-white p-8 font-serif">
  <div class="max-w-2xl mx-auto">
    <!-- Letterhead -->
    <div class="border-b-2 border-gray-300 pb-4 mb-8">
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 bg-gray-300 rounded mr-4 flex items-center justify-center">
          <span class="text-white text-xl font-bold">Cal</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-700">University of California, Berkeley</h1>
          <p class="text-gray-600 text-sm">Office of Undergraduate Admissions</p>
        </div>
      </div>
      <div class="text-sm text-gray-600">
        <p>110 Sproul Hall #5800</p>
        <p>Berkeley, California 94720</p>
      </div>
    </div>

    <!-- Date -->
    <p class="mb-8 text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

    <!-- Applicant Info -->
    <div class="mb-8">
      <p class="text-gray-800">{applicantName}</p>
      <p class="text-gray-600">Freshman Applicant</p>
    </div>

    <!-- Letter Body -->
    <div class="mb-8 leading-relaxed text-gray-800">
      <p class="mb-4">Dear {applicantName},</p>
      
      <p class="mb-4">
        Thank you for your application to the University of California, Berkeley. After careful consideration by 
        our Admissions Committee, I regret to inform you that we are unable to offer you admission 
        to the Fall 2024 entering class.
      </p>
      
      <p class="mb-4">
        This year, UC Berkeley reviewed applications from an exceptionally accomplished pool of 
        more than 125,000 candidates. Each application was evaluated holistically, considering 
        academic achievement, personal qualities, extracurricular involvement, and potential 
        contributions to our diverse campus community.
      </p>
      
      <div class="my-8 p-6 bg-gray-50 border-l-4 border-[#003262] italic">
        <p class="mb-2 font-semibold text-gray-700">About Our Selection Process</p>
        <p class="text-gray-600">
          As the world's premier public university, Berkeley seeks students who demonstrate exceptional 
          academic ability, intellectual curiosity, and a commitment to public service. While you have 
          clearly demonstrated significant accomplishments, the limitations of our enrollment capacity 
          prevent us from admitting many outstanding students who would undoubtedly thrive at Berkeley.
        </p>
      </div>
      
      <p class="mb-4">
        Please know that this decision reflects the extraordinary selectivity of our applicant 
        pool rather than any deficiency in your abilities or potential. We encourage you to consider 
        the many other excellent institutions within the University of California system and beyond.
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
        <p class="text-sm text-gray-600">University of California, Berkeley</p>
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