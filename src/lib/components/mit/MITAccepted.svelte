<script lang="ts">
  export let applicantName: string = 'Applicant';
</script>

<div class="min-h-screen bg-white p-8 font-sans">
  <div class="max-w-2xl mx-auto">
    <!-- Letterhead - MIT Red -->
    <div class="border-b-4 border-[#A31F34] pb-4 mb-8">
      <div class="flex items-center mb-4">
        <!-- MIT Dome/Seal Logo -->
        <div class="w-12 h-12 bg-[#A31F34] rounded-full mr-4 flex items-center justify-center">
          <span class="text-white text-xl font-bold">MIT</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#A31F34]">Massachusetts Institute of Technology</h1>
          <p class="text-gray-700 text-sm">Office of Undergraduate Admissions</p>
        </div>
      </div>
      <div class="text-sm text-gray-600">
        <p>77 Massachusetts Avenue</p>
        <p>Room 10-100</p>
        <p>Cambridge, Massachusetts 02139</p>
        <p>Tel: 617-253-3400</p>
      </div>
    </div>

    <!-- Date -->
    <p class="mb-8 text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

    <!-- Applicant Info -->
    <div class="mb-8">
      <p class="text-lg font-medium text-gray-800">{applicantName}</p>
      <p class="text-gray-600">Regular Action Applicant</p>
    </div>

    <!-- Letter Body -->
    <div class="mb-8 leading-relaxed text-gray-800">
      <p class="mb-4">Dear {applicantName},</p>
      
      <p class="mb-4">
        On behalf of the Admissions Committee, I am delighted to offer you admission to the 
        Massachusetts Institute of Technology, Class of 2028. Welcome to MIT!
      </p>
      
      <p class="mb-4">
        Your application was evaluated within an exceptionally competitive pool of more than 33,000 
        candidates from around the world. The Committee was impressed by your extraordinary 
        achievements in mathematics and science, your intellectual curiosity, and your demonstrated 
        capacity for hands-on problem-solving. Your unique combination of analytical rigor and 
        creative thinking aligns perfectly with MIT's mission to advance knowledge and educate 
        students in science, technology, and other areas of scholarship.
      </p>
      
      <div class="my-8 p-6 bg-red-50 border-l-4 border-[#A31F34] italic">
        <p class="mb-2 font-semibold text-[#A31F34]">Welcome to the MIT Community</p>
        <p class="text-gray-700">
          At MIT, you will join a community of brilliant, curious, and collaborative individuals 
          dedicated to solving the world's most challenging problems. You'll engage with our unique 
          hands-on curriculum, work alongside Nobel laureates and Turing Award winners, and 
          participate in cutting-edge research as early as your first year.
        </p>
      </div>
      
      <p class="mb-4">
        As an admitted student, you will receive comprehensive information about next steps, including 
        details about Campus Preview Weekend (CPW), housing, course registration, and financial aid 
        (if applicable). You can also expect to hear directly from current students, faculty, and 
        alumni who are eager to welcome you to our community.
      </p>
      
      <p class="mb-4">
        This offer of admission is contingent upon your successful completion of the current academic 
        year. We expect that you will maintain the high standards of academic achievement and personal 
        conduct that characterized your secondary school record.
      </p>
      
      <p class="mb-4">
        Please take time to celebrate this significant achievement with your family, teachers, and 
        friends who have supported you throughout this process. We look forward to welcoming you to 
        Cambridge this fall.
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <p class="mb-1">Sincerely,</p>
      <div class="mb-8">
        <div class="h-12 mb-2 flex items-center text-[#A31F34] font-bold text-lg">
          Massachusetts Institute of Technology
        </div>
        <p class="font-semibold text-[#A31F34]">Stuart Schmill</p>
        <p class="text-sm text-gray-700">Dean of Admissions and Student Financial Services</p>
        <p class="text-sm text-gray-600">Massachusetts Institute of Technology</p>
      </div>
      
      <div class="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-300">
        <p class="text-sm text-gray-700 mb-2">
          <strong class="text-[#A31F34]">Next Steps:</strong> Your official admission packet will arrive by mail within 
          7-10 business days. Please log into your MIT Application Portal to view your financial aid award 
          (if applicable) and to confirm your enrollment by May 1.
        </p>
        <p class="text-sm text-gray-700">
          <strong class="text-[#A31F34]">Important:</strong> Admitted students are invited to attend 
          <em>Campus Preview Weekend (CPW)</em> from April 11-14, 2024. Registration information will be available in your portal.
        </p>
      </div>
    </div>
  </div>
</div>