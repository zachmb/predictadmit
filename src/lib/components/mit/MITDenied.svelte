<script lang="ts">
  export let applicantName: string = 'Applicant';
</script>

<div class="min-h-screen bg-white p-8 font-sans">
  <div class="max-w-2xl mx-auto">
    <!-- Letterhead -->
    <div class="border-b-2 border-gray-300 pb-4 mb-8">
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
          <span class="text-white text-xl font-bold">MIT</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-700">Massachusetts Institute of Technology</h1>
          <p class="text-gray-600 text-sm">Office of Undergraduate Admissions</p>
        </div>
      </div>
      <div class="text-sm text-gray-600">
        <p>77 Massachusetts Avenue</p>
        <p>Room 10-100</p>
        <p>Cambridge, Massachusetts 02139</p>
      </div>
    </div>

    <!-- Date -->
    <p class="mb-8 text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

    <!-- Applicant Info -->
    <div class="mb-8">
      <p class="text-gray-800">{applicantName}</p>
      <p class="text-gray-600">Regular Action Applicant</p>
    </div>

    <!-- Letter Body -->
    <div class="mb-8 leading-relaxed text-gray-800">
      <p class="mb-4">Dear {applicantName},</p>
      
      <p class="mb-4">
        Thank you for your application to the Massachusetts Institute of Technology. After careful 
        consideration by our Admissions Committee, I regret to inform you that we are unable to offer 
        you admission to the Class of 2028.
      </p>
      
      <p class="mb-4">
        This year, MIT reviewed applications from an exceptionally accomplished pool of more than 
        33,000 candidates. Each application was evaluated holistically, considering academic 
        achievement in mathematics and science, intellectual curiosity, hands-on experience, and 
        personal qualities that align with MIT's collaborative, problem-solving culture.
      </p>
      
      <div class="my-8 p-6 bg-gray-50 border-l-4 border-[#A31F34] italic">
        <p class="mb-2 font-semibold text-gray-700">About Our Selection Process</p>
        <p class="text-gray-600">
          MIT seeks students who demonstrate extraordinary aptitude in mathematics and science, 
          combined with creativity, initiative, and a collaborative spirit. While you have clearly 
          demonstrated significant accomplishments, the limitations of our class size prevent us from 
          admitting many outstanding students who would undoubtedly thrive at MIT.
        </p>
      </div>
      
      <p class="mb-4">
        Please know that this decision reflects the extraordinary selectivity of our applicant 
        pool rather than any deficiency in your abilities or potential. We have every confidence 
        that you will find success and make meaningful contributions at another excellent institution.
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
        <p class="text-sm text-gray-600">Massachusetts Institute of Technology</p>
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