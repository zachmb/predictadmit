<script lang="ts">
  export let applicantName: string = 'Applicant';
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 font-serif">
  <div class="max-w-3xl mx-auto bg-white border border-gray-300 shadow-sm">
    <!-- Header -->
    <div class="bg-[#00254C] text-white p-6 text-center">
      <h1 class="text-2xl font-bold">GEORGIA INSTITUTE OF TECHNOLOGY</h1>
      <p class="text-lg mt-1">Office of Undergraduate Admissions</p>
    </div>

    <!-- Content -->
    <div class="p-8">
      <!-- Date and Address -->
      <div class="mb-8 text-sm text-gray-700">
        <p>{currentDate}</p>
        <p class="mt-2">{applicantName}</p>
        <p>As provided in your application</p>
      </div>

      <!-- Main Letter -->
      <div class="space-y-6 text-gray-800">
        <p>Dear {applicantName},</p>
        
        <p>Thank you for your application to the Georgia Institute of Technology. After careful consideration by our admissions committee, I regret to inform you that we are unable to offer you admission to the first-year class entering in Fall 2020.</p>
        
        <p>This year, we received a record number of applications—over 45,000—for approximately 3,500 places in our entering class. The selection process was exceptionally competitive, and we were faced with the difficult task of choosing from among many highly qualified candidates.</p>
        
        <div class="bg-gray-50 border-l-4 border-gray-400 p-4 my-4">
          <p class="font-semibold text-gray-700">Transfer Consideration</p>
          <p class="text-sm mt-1">Many successful Georgia Tech students begin their studies at other institutions. If you remain interested in transferring to Georgia Tech, please visit our <a href="#" class="text-[#00254C] font-semibold hover:underline">transfer admission website</a> for information about requirements and deadlines.</p>
        </div>
        
        <p>Please understand that this decision reflects the competitive nature of our applicant pool and the limited number of spaces available, rather than a judgment of your abilities or potential. Many students who are not admitted to Georgia Tech go on to achieve great success at other excellent institutions.</p>
        
        <p>We recognize the time and effort you invested in your application, and we appreciate your interest in Georgia Tech. We wish you the very best in your future academic endeavors and beyond.</p>
        
        <div class="mt-10">
          <p>Sincerely,</p>
          <div class="mt-6">
            <p class="font-semibold">Rick Clark</p>
            <p>Director of Undergraduate Admission</p>
            <p>Georgia Institute of Technology</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="bg-gray-100 border-t border-gray-300 p-6 text-center text-sm text-gray-600">
      <p>Georgia Institute of Technology • North Avenue, Atlanta, GA 30332</p>
      <p class="mt-1">404.894.2000 • admission.gatech.edu</p>
      <p class="mt-2 text-xs">This is a simulated admission decision for entertainment purposes only.</p>
    </div>
  </div>
  
  <!-- Back button -->
  <div class="text-center mt-8">
    <button
      on:click={() => window.history.back()}
      class="inline-flex items-center text-[#00254C] hover:underline font-medium"
    >
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Return to Portal
    </button>
  </div>
</div>