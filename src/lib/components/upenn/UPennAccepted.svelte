<script lang="ts">
  export let applicantName: string = 'Applicant';
</script>

<div class="min-h-screen bg-white p-8 font-serif">
  <div class="max-w-2xl mx-auto">
    <!-- Letterhead - Penn Red and Blue -->
    <div class="border-b-4 border-[#990000] pb-4 mb-8">
      <div class="flex items-center mb-4">
        <!-- Penn Shield Logo -->
        <div class="w-12 h-12 bg-[#990000] rounded mr-4 flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 bg-[#011F5B] opacity-30"></div>
          <span class="text-white text-xl font-bold z-10">P</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#011F5B]">University of Pennsylvania</h1>
          <p class="text-[#990000] text-sm font-medium">Office of Undergraduate Admissions</p>
        </div>
      </div>
      <div class="text-sm text-gray-600">
        <p>1 College Hall, Room 100</p>
        <p>Philadelphia, Pennsylvania 19104</p>
        <p>Tel: 215-898-7507</p>
      </div>
    </div>

    <!-- Date -->
    <p class="mb-8 text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

    <!-- Applicant Info -->
    <div class="mb-8">
      <p class="text-lg font-medium text-gray-800">{applicantName}</p>
      <p class="text-gray-600">Regular Decision Applicant</p>
      <p class="text-sm text-gray-500">Proposed School: The College of Arts and Sciences</p>
    </div>

    <!-- Letter Body -->
    <div class="mb-8 leading-relaxed text-gray-800">
      <p class="mb-4">Dear {applicantName},</p>
      
      <p class="mb-4">
        On behalf of the University of Pennsylvania, I am delighted to offer you admission to the 
        Class of 2028. Welcome to Penn!
      </p>
      
      <p class="mb-4">
        Your application was evaluated within an exceptionally competitive pool of more than 59,000 
        candidates from around the world. The Admissions Committee was impressed by your intellectual 
        curiosity, academic achievements, and commitment to making a difference in your community. 
        Your unique perspective and demonstrated leadership align perfectly with Penn's mission to 
        educate students who will become leaders in their fields and contribute meaningfully to society.
      </p>
      
      <div class="my-8 p-6 bg-red-50 border-l-4 border-[#990000] italic">
        <p class="mb-2 font-semibold text-[#011F5B]">Welcome to the Penn Community</p>
        <p class="text-gray-700">
          At Penn, you will join a vibrant, interdisciplinary community in the heart of Philadelphia. 
          You'll have the opportunity to engage with world-renowned faculty, collaborate with peers 
          from diverse backgrounds, and take advantage of our unique integration of liberal arts 
          education with professional preparation through our four undergraduate schools.
        </p>
      </div>
      
      <p class="mb-4">
        As an admitted student, you will receive comprehensive information about next steps, including 
        details about Penn's admitted student programs (Quaker Days), housing, course registration, 
        and financial aid (if applicable). You can also expect to hear directly from current students, 
        faculty, and alumni who are eager to welcome you to campus.
      </p>
      
      <p class="mb-4">
        This offer of admission is contingent upon your successful completion of the current academic 
        year. We expect that you will maintain the high standards of achievement and personal conduct 
        that characterized your secondary school record.
      </p>
      
      <p class="mb-4">
        Please take time to celebrate this significant achievement with your family, teachers, and 
        friends who have supported you throughout this process. We look forward to welcoming you to 
        Philadelphia this fall.
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <p class="mb-1">Sincerely,</p>
      <div class="mb-8">
        <div class="h-12 mb-2 flex items-center">
          <div class="w-16 h-8 bg-[#990000] mr-2"></div>
          <div class="w-16 h-8 bg-[#011F5B]"></div>
        </div>
        <p class="font-semibold text-[#011F5B]">John J. McLaughlin</p>
        <p class="text-sm text-[#990000]">Dean of Admissions</p>
        <p class="text-sm text-gray-600">University of Pennsylvania</p>
      </div>
      
      <div class="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm text-gray-700 mb-2">
          <strong class="text-[#011F5B]">Next Steps:</strong> Your official admission packet will arrive by mail within 
          7-10 business days. Please log into your Penn Applicant Portal to view your financial aid award 
          (if applicable) and to confirm your enrollment by May 1.
        </p>
        <p class="text-sm text-gray-700">
          <strong class="text-[#990000]">Important:</strong> Admitted students are invited to attend Quaker Days 
          (our admitted student program) in April. Registration information will be available in your portal.
        </p>
      </div>
    </div>
  </div>
</div>