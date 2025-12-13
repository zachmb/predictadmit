<script lang="ts">
  export let applicantName: string = 'Applicant';
</script>

<div class="min-h-screen bg-white p-8 font-serif">
  <div class="max-w-2xl mx-auto">
    <!-- Letterhead - Northwestern Purple -->
    <div class="border-b-4 border-[#4E2A84] pb-4 mb-8">
      <div class="flex items-center mb-4">
        <!-- Northwestern "N" Logo -->
        <div class="w-12 h-12 bg-[#4E2A84] rounded mr-4 flex items-center justify-center">
          <span class="text-white text-xl font-bold">N</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#4E2A84]">Northwestern University</h1>
          <p class="text-gray-700 text-sm">Office of Undergraduate Admission</p>
        </div>
      </div>
      <div class="text-sm text-gray-600">
        <p>1801 Hinman Avenue</p>
        <p>Evanston, Illinois 60208</p>
        <p>Tel: 847-491-7271</p>
      </div>
    </div>

    <!-- Date -->
    <p class="mb-8 text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

    <!-- Applicant Info -->
    <div class="mb-8">
      <p class="text-lg font-medium text-gray-800">{applicantName}</p>
      <p class="text-gray-600">Regular Decision Applicant</p>
      <p class="text-sm text-gray-500">Proposed School: Weinberg College of Arts and Sciences</p>
    </div>

    <!-- Letter Body -->
    <div class="mb-8 leading-relaxed text-gray-800">
      <p class="mb-4">Dear {applicantName},</p>
      
      <p class="mb-4">
        On behalf of Northwestern University, I am delighted to offer you admission to the 
        Class of 2028. Welcome to the Northwestern community!
      </p>
      
      <p class="mb-4">
        Your application was evaluated within an exceptionally competitive pool of more than 52,000 
        candidates from around the world. The Admissions Committee was impressed by your intellectual 
        curiosity, academic achievements, and demonstrated commitment to both academic excellence and 
        personal growth. Your unique perspective and potential for leadership align perfectly with 
        Northwestern's mission to educate students who will become leaders in their chosen fields.
      </p>
      
      <div class="my-8 p-6 bg-purple-50 border-l-4 border-[#4E2A84] italic">
        <p class="mb-2 font-semibold text-[#4E2A84]">Welcome to the Northwestern Community</p>
        <p class="text-gray-700">
          At Northwestern, you will join a vibrant, interdisciplinary community on the shores of 
          Lake Michigan. You'll have the opportunity to engage with world-renowned faculty, 
          collaborate with peers from diverse backgrounds, and take advantage of our unique 
          integration of rigorous academics with practical experience through our distinctive 
          quarter system and proximity to Chicago.
        </p>
      </div>
      
      <p class="mb-4">
        As an admitted student, you will receive comprehensive information about next steps, including 
        details about Northwestern's admitted student programs (Wildcat Days), housing, course 
        registration, and financial aid (if applicable). You can also expect to hear directly from 
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
        Evanston this fall.
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <p class="mb-1">Sincerely,</p>
      <div class="mb-8">
        <div class="h-12 mb-2 flex items-center text-[#4E2A84] font-bold text-lg">
          Northwestern University
        </div>
        <p class="font-semibold text-[#4E2A84]">Christopher Watson</p>
        <p class="text-sm text-gray-700">Dean of Undergraduate Admission</p>
        <p class="text-sm text-gray-600">Northwestern University</p>
      </div>
      
      <div class="mt-12 p-6 bg-purple-50 rounded-lg border border-purple-200">
        <p class="text-sm text-gray-700 mb-2">
          <strong class="text-[#4E2A84]">Next Steps:</strong> Your official admission packet will arrive by mail within 
          7-10 business days. Please log into your Northwestern Applicant Portal to view your financial aid award 
          (if applicable) and to confirm your enrollment by May 1.
        </p>
        <p class="text-sm text-gray-700">
          <strong class="text-[#4E2A84]">Important:</strong> Admitted students are invited to attend 
          <em>Wildcat Days</em>, our admitted student program, in April. Registration information will be available in your portal.
        </p>
      </div>
    </div>
  </div>
</div>