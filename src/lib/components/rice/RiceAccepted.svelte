<script lang="ts">
  export let applicantName: string = 'Applicant';
</script>

<div class="min-h-screen bg-white p-8 font-serif">
  <div class="max-w-2xl mx-auto">
    <!-- Letterhead - Rice Blue -->
    <div class="border-b-4 border-[#00205B] pb-4 mb-8">
      <div class="flex items-center mb-4">
        <!-- Rice Owl Logo -->
        <div class="w-12 h-12 bg-[#00205B] rounded-full mr-4 flex items-center justify-center">
          <span class="text-white text-xl font-bold">R</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#00205B]">Rice University</h1>
          <p class="text-gray-700 text-sm">Office of Admission</p>
        </div>
      </div>
      <div class="text-sm text-gray-600">
        <p>6100 Main Street, MS-17</p>
        <p>Houston, Texas 77005</p>
        <p>Tel: 713-348-7423</p>
      </div>
    </div>

    <!-- Date -->
    <p class="mb-8 text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

    <!-- Applicant Info -->
    <div class="mb-8">
      <p class="text-lg font-medium text-gray-800">{applicantName}</p>
      <p class="text-gray-600">Regular Decision Applicant</p>
      <p class="text-sm text-gray-500">Proposed Major: Computer Science</p>
    </div>

    <!-- Letter Body -->
    <div class="mb-8 leading-relaxed text-gray-800">
      <p class="mb-4">Dear {applicantName},</p>
      
      <p class="mb-4">
        On behalf of Rice University, I am delighted to offer you admission to the 
        Class of 2028. Welcome to the Rice community!
      </p>
      
      <p class="mb-4">
        Your application was evaluated within an exceptionally competitive pool of more than 31,000 
        candidates from around the world. The Admission Committee was impressed by your intellectual 
        curiosity, academic achievements, and demonstrated commitment to both academic excellence and 
        collaborative learning. Your unique perspective and potential align perfectly with Rice's 
        mission to nurture discovery and innovation in a residential college system.
      </p>
      
      <div class="my-8 p-6 bg-blue-50 border-l-4 border-[#00205B] italic">
        <p class="mb-2 font-semibold text-[#00205B]">Welcome to the Residential College System</p>
        <p class="text-gray-700">
          At Rice, you will join one of our eleven residential colleges, each with its own distinctive 
          traditions, faculty associates, and close-knit community. You'll have the opportunity to 
          engage with world-renowned faculty in small classes, collaborate with peers in a 6:1 student-to-faculty 
          ratio environment, and benefit from our unique campus in the heart of Houston's Museum District.
        </p>
      </div>
      
      <p class="mb-4">
        As an admitted student, you will receive comprehensive information about next steps, including 
        details about Rice's admitted student programs (Rice Days), residential college assignment, 
        course registration, and financial aid (if applicable). You can also expect to hear directly from 
        current students, faculty, and alumni who are eager to welcome you to campus.
      </p>
      
      <p class="mb-4">
        This offer of admission is contingent upon your successful completion of the current academic 
        year. We expect that you will maintain the high standards of achievement and personal conduct 
        that characterized your secondary school record.
      </p>
      
      <p class="mb-4">
        Please take time to celebrate this significant achievement with your family, teachers, and 
        friends who have supported you throughout this process. We look forward to welcoming you to 
        Houston this fall.
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <p class="mb-1">Sincerely,</p>
      <div class="mb-8">
        <div class="h-12 mb-2 flex items-center text-[#00205B] font-bold text-lg">
          Rice University
        </div>
        <p class="font-semibold text-[#00205B]">Yvonne Romero da Silva</p>
        <p class="text-sm text-gray-700">Vice President for Enrollment</p>
        <p class="text-sm text-gray-600">Rice University</p>
      </div>
      
      <div class="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm text-gray-700 mb-2">
          <strong class="text-[#00205B]">Next Steps:</strong> Your official admission packet will arrive by mail within 
          7-10 business days. Please log into your Rice Admission Portal to view your financial aid award 
          (if applicable) and to confirm your enrollment by May 1.
        </p>
        <p class="text-sm text-gray-700">
          <strong class="text-[#00205B]">Important:</strong> Admitted students are invited to attend 
          <em>Rice Days</em>, our admitted student program, in April. Registration information will be available in your portal.
        </p>
      </div>
    </div>
  </div>
</div>
