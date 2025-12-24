<script lang="ts">
  export let applicantName: string = 'Applicant';
</script>

<div class="min-h-screen bg-white p-8 font-serif">
  <div class="max-w-2xl mx-auto">
    <!-- Letterhead - UChicago Maroon -->
    <div class="border-b-4 border-[#800000] pb-4 mb-8">
      <div class="flex items-center mb-4">
        <!-- UChicago Phoenix Logo -->
        <div class="w-12 h-12 bg-[#800000] rounded-full mr-4 flex items-center justify-center">
          <span class="text-white text-xl font-bold">C</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#800000]">The University of Chicago</h1>
          <p class="text-gray-700 text-sm">Office of College Admissions</p>
        </div>
      </div>
      <div class="text-sm text-gray-600">
        <p>1101 E. 58th Street</p>
        <p>Rosenwald Hall, Suite 105</p>
        <p>Chicago, Illinois 60637</p>
        <p>Tel: 773-702-8650</p>
      </div>
    </div>

    <!-- Date -->
    <p class="mb-8 text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

    <!-- Applicant Info -->
    <div class="mb-8">
      <p class="text-lg font-medium text-gray-800">{applicantName}</p>
      <p class="text-gray-600">Regular Decision Applicant</p>
    </div>

    <!-- Letter Body -->
    <div class="mb-8 leading-relaxed text-gray-800">
      <p class="mb-4">Dear {applicantName},</p>
      
      <p class="mb-4">
        It is with great pleasure that we offer you admission to the College of the University of Chicago, 
        Class of 2028. Welcome to the life of the mind.
      </p>
      
      <p class="mb-4">
        Your application was evaluated within an exceptionally thoughtful and intellectually curious 
        applicant pool. The Admissions Committee was impressed by your distinctive approach to learning, 
        your willingness to engage with unconventional ideas, and your demonstrated commitment to 
        rigorous inquiry—qualities that align perfectly with the University of Chicago's distinctive 
        academic culture.
      </p>
      
      <div class="my-8 p-6 bg-red-50 border-l-4 border-[#800000] italic">
        <p class="mb-2 font-semibold text-[#800000]">Welcome to the Life of the Mind</p>
        <p class="text-gray-700">
          At Chicago, you will join a community of scholars who value rigorous debate, intellectual 
          curiosity, and the pursuit of knowledge for its own sake. You'll engage with our unique Core 
          Curriculum, work closely with world-renowned faculty, and participate in the vibrant 
          intellectual life of our Hyde Park campus.
        </p>
      </div>
      
      <p class="mb-4">
        As an admitted student, you will receive comprehensive information about next steps, including 
        details about UChicago's admitted student programs, housing, course registration, and financial 
        aid (if applicable). You can also expect to hear directly from current students, faculty, and 
        alumni who are eager to welcome you to our intellectual community.
      </p>
      
      <p class="mb-4">
        This offer of admission is contingent upon your successful completion of the current academic 
        year. We expect that you will maintain the high standards of academic achievement and personal 
        conduct that characterized your secondary school record.
      </p>
      
      <p class="mb-4">
        Please take time to celebrate this significant achievement with your family, teachers, and 
        friends who have supported you throughout this process. We look forward to welcoming you to 
        the University of Chicago this fall.
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <p class="mb-1">Sincerely,</p>
      <div class="mb-8">
        <div class="h-12 mb-2 flex items-center text-[#800000] font-bold">
          The University of Chicago
        </div>
        <p class="font-semibold text-[#800000]">James G. Nondorf</p>
        <p class="text-sm text-gray-700">Vice President for Enrollment and Dean of Admissions</p>
        <p class="text-sm text-gray-600">The University of Chicago</p>
      </div>
      
      <div class="mt-12 p-6 bg-red-50 rounded-lg border border-red-200">
        <p class="text-sm text-gray-700 mb-2">
          <strong class="text-[#800000]">Next Steps:</strong> Your official admission packet will arrive by mail within 
          7-10 business days. Please log into your UChicago Account to view your financial aid award 
          (if applicable) and to confirm your enrollment by May 1.
        </p>
        <p class="text-sm text-gray-700">
          <strong class="text-[#800000]">UChicago Tradition:</strong> Admitted students are invited to attend 
          <em>Destination UChicago</em>, our admitted student program, in April. Registration information will be available in your portal.
        </p>
      </div>
    </div>
  </div>
</div>