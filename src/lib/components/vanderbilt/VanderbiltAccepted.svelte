<script lang="ts">
  export let applicantName: string = 'Applicant';
</script>

<div class="min-h-screen bg-white p-8 font-serif">
  <div class="max-w-2xl mx-auto">
    <!-- Letterhead - Vanderbilt Black and Gold -->
    <div class="border-b-4 border-black pb-4 mb-8">
      <div class="flex items-center mb-4">
        <!-- Vanderbilt "V" Logo -->
        <div class="w-12 h-12 bg-black text-[#CFB87C] rounded mr-4 flex items-center justify-center">
          <span class="text-2xl font-bold">V</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-black">Vanderbilt University</h1>
          <p class="text-[#CFB87C] text-sm font-medium">Office of Undergraduate Admissions</p>
        </div>
      </div>
      <div class="text-sm text-gray-600">
        <p>2305 West End Avenue</p>
        <p>Nashville, Tennessee 37203</p>
        <p>Tel: 615-322-2561</p>
      </div>
    </div>

    <!-- Date -->
    <p class="mb-8 text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

    <!-- Applicant Info -->
    <div class="mb-8">
      <p class="text-lg font-medium text-gray-800">{applicantName}</p>
      <p class="text-gray-600">Regular Decision Applicant</p>
      <p class="text-sm text-gray-500">College of Arts and Science</p>
    </div>

    <!-- Letter Body -->
    <div class="mb-8 leading-relaxed text-gray-800">
      <p class="mb-4">Dear {applicantName},</p>
      
      <p class="mb-4">
        On behalf of Vanderbilt University, I am delighted to offer you admission to the 
        Class of 2028. Anchor Down!
      </p>
      
      <p class="mb-4">
        Your application was evaluated within an exceptionally competitive pool of more than 47,000 
        candidates from around the world. The Admissions Committee was impressed by your intellectual 
        curiosity, academic achievements, and demonstrated commitment to both academic excellence and 
        community engagement. Your unique perspective and potential for leadership align perfectly with 
        Vanderbilt's mission to provide a rigorous education in a vibrant, inclusive community.
      </p>
      
      <div class="my-8 p-6 bg-yellow-50 border-l-4 border-[#CFB87C] italic">
        <p class="mb-2 font-semibold text-black">Welcome to the Vanderbilt Community</p>
        <p class="text-gray-700">
          At Vanderbilt, you will join a residential college community on a beautiful park-like campus 
          in the heart of Nashville. You'll have the opportunity to engage with world-renowned faculty, 
          collaborate with peers from diverse backgrounds, and take advantage of our unique integration 
          of rigorous academics with the vibrant cultural and professional opportunities of Music City.
        </p>
      </div>
      
      <p class="mb-4">
        As an admitted student, you will receive comprehensive information about next steps, including 
        details about Vanderbilt's admitted student programs (Anchor Days), housing in our residential 
        colleges, course registration, and financial aid (if applicable). You can also expect to hear 
        directly from current students, faculty, and alumni who are eager to welcome you to campus.
      </p>
      
      <p class="mb-4">
        This offer of admission is contingent upon your successful completion of the current academic 
        year. We expect that you will maintain the high standards of achievement and personal conduct 
        that characterized your secondary school record.
      </p>
      
      <p class="mb-4">
        Please take time to celebrate this significant achievement with your family, teachers, and 
        friends who have supported you throughout this process. We look forward to welcoming you to 
        Nashville this fall.
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <p class="mb-1">Sincerely,</p>
      <div class="mb-8">
        <div class="h-12 mb-2 flex items-center">
          <div class="w-16 h-8 bg-black mr-2"></div>
          <div class="w-16 h-8 bg-[#CFB87C]"></div>
        </div>
        <p class="font-semibold text-black">Douglas L. Christiansen</p>
        <p class="text-sm text-[#CFB87C]">Vice Provost for University Enrollment Affairs and Dean of Admissions</p>
        <p class="text-sm text-gray-600">Vanderbilt University</p>
      </div>
      
      <div class="mt-12 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <p class="text-sm text-gray-700 mb-2">
          <strong class="text-black">Next Steps:</strong> Your official admission packet will arrive by mail within 
          7-10 business days. Please log into your Vanderbilt Applicant Portal to view your financial aid award 
          (if applicable) and to confirm your enrollment by May 1.
        </p>
        <p class="text-sm text-gray-700">
          <strong class="text-[#CFB87C]">Anchor Down:</strong> Admitted students are invited to attend 
          <em>Anchor Days</em>, our admitted student program, in April. Registration information will be available in your portal.
        </p>
      </div>
    </div>
  </div>
</div>