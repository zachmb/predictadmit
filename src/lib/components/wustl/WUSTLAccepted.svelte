<script lang="ts">
  export let applicantName: string = 'Applicant';
</script>

<div class="min-h-screen bg-white p-8 font-serif">
  <div class="max-w-2xl mx-auto">
    <!-- Letterhead - WashU Red -->
    <div class="border-b-4 border-[#A51417] pb-4 mb-8">
      <div class="flex items-center mb-4">
        <!-- WashU Seal -->
        <div class="w-12 h-12 bg-[#A51417] rounded-full mr-4 flex items-center justify-center">
          <span class="text-white text-xl font-bold">W</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#A51417]">Washington University in St. Louis</h1>
          <p class="text-gray-700 text-sm">Office of Undergraduate Admissions</p>
        </div>
      </div>
      <div class="text-sm text-gray-600">
        <p>One Brookings Drive</p>
        <p>St. Louis, Missouri 63130</p>
        <p>Tel: 314-935-6000</p>
      </div>
    </div>

    <!-- Date -->
    <p class="mb-8 text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

    <!-- Applicant Info -->
    <div class="mb-8">
      <p class="text-lg font-medium text-gray-800">{applicantName}</p>
      <p class="text-gray-600">Regular Decision Applicant</p>
      <p class="text-sm text-gray-500">College of Arts & Sciences</p>
    </div>

    <!-- Letter Body -->
    <div class="mb-8 leading-relaxed text-gray-800">
      <p class="mb-4">Dear {applicantName},</p>
      
      <p class="mb-4">
        On behalf of Washington University in St. Louis, I am delighted to offer you admission to the 
        Class of 2028. Welcome to the WashU community!
      </p>
      
      <p class="mb-4">
        Your application was evaluated within an exceptionally competitive pool of more than 32,000 
        candidates from around the world. The Admissions Committee was impressed by your intellectual 
        curiosity, academic achievements, and demonstrated commitment to both academic excellence and 
        community engagement. Your unique perspective and potential for leadership align perfectly with 
        Washington University's mission to discover and disseminate knowledge, and protect the freedom 
        of inquiry through research, teaching, and learning.
      </p>
      
      <div class="my-8 p-6 bg-red-50 border-l-4 border-[#A51417] italic">
        <p class="mb-2 font-semibold text-[#A51417]">Welcome to the Washington University Community</p>
        <p class="text-gray-700">
          At WashU, you will join a collaborative community on our beautiful, park-like campus in St. Louis. 
          You'll have the opportunity to engage with world-renowned faculty in small classes, participate in 
          cutting-edge research as early as your first year, and take advantage of our unique integration 
          of rigorous academics with the cultural and professional opportunities of St. Louis.
        </p>
      </div>
      
      <p class="mb-4">
        As an admitted student, you will receive comprehensive information about next steps, including 
        details about WashU's admitted student programs (WashU Preview), housing in our residential 
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
        St. Louis this fall.
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <p class="mb-1">Sincerely,</p>
      <div class="mb-8">
        <div class="h-12 mb-2 flex items-center">
          <div class="w-16 h-8 bg-[#A51417] mr-2"></div>
          <div class="w-16 h-8 bg-[#3D7E42]"></div>
        </div>
        <p class="font-semibold text-[#A51417]">Ronné Patrick Turner</p>
        <p class="text-sm text-[#3D7E42]">Vice Provost for Admissions and Financial Aid</p>
        <p class="text-sm text-gray-600">Washington University in St. Louis</p>
      </div>
      
      <div class="mt-12 p-6 bg-red-50 rounded-lg border border-red-200">
        <p class="text-sm text-gray-700 mb-2">
          <strong class="text-[#A51417]">Next Steps:</strong> Your official admission packet will arrive by mail within 
          7-10 business days. Please log into your WashU Applicant Portal to view your financial aid award 
          (if applicable) and to confirm your enrollment by May 1.
        </p>
        <p class="text-sm text-gray-700">
          <strong class="text-[#3D7E42]">Important:</strong> Admitted students are invited to attend 
          <em>WashU Preview</em>, our admitted student program, in April. Registration information will be available in your portal.
        </p>
      </div>
    </div>
  </div>
</div>