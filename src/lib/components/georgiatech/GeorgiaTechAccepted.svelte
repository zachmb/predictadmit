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
        <p class="text-lg font-semibold text-[#00254C]">CONGRATULATIONS!</p>
        
        <p>Dear {applicantName},</p>
        
        <p>On behalf of the Georgia Institute of Technology, I am delighted to offer you admission to the first-year class entering in Fall 2020. Your outstanding academic achievements, personal qualities, and potential for leadership distinguished you in our most competitive applicant pool in Institute history.</p>
        
        <p>This year, we received over 45,000 applications for approximately 3,500 places in our first-year class. Your selection is a testament to your exceptional abilities and your potential to thrive in our rigorous academic environment.</p>
        
        <div class="bg-yellow-50 border-l-4 border-[#B3A369] p-4 my-4">
          <p class="font-semibold text-[#00254C]">Admitted Student Portal</p>
          <p class="text-sm mt-1">Please log into your <a href="#" class="text-[#B3A369] font-semibold hover:underline">admitted student portal</a> to view your financial aid package, confirm your enrollment, and learn about next steps.</p>
        </div>
        
        <p>At Georgia Tech, you will join a community of innovators, problem-solvers, and creators who are shaping the future. Our undergraduate programs are consistently ranked among the nation's best, and our graduates are highly sought by top employers and graduate schools worldwide.</p>
        
        <p>You have been admitted to the <span class="font-semibold">College of Engineering</span>. Specific information about your major and orientation will be available in your admitted student portal.</p>
        
        <div class="border-t border-gray-300 pt-6 mt-6">
          <p class="font-semibold">Important Dates:</p>
          <ul class="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li><span class="font-medium">May 1, 2020:</span> Enrollment confirmation deadline</li>
            <li><span class="font-medium">August 17, 2020:</span> First-year student move-in</li>
            <li><span class="font-medium">August 19, 2020:</span> FASET Orientation begins</li>
            <li><span class="font-medium">August 24, 2020:</span> First day of classes</li>
          </ul>
        </div>
        
        <p>We encourage you to visit campus through one of our admitted student programs to experience the Georgia Tech community firsthand. Details are available in your portal.</p>
        
        <p>Once again, congratulations on this outstanding achievement. We are excited about the possibility of you joining the Georgia Tech family and contributing your talents to our campus community.</p>
        
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
      <p class="mt-2 text-xs">This is a simulated admission letter for entertainment purposes only.</p>
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