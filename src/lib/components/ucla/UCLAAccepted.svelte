<script lang="ts">
  export let applicantName: string = 'Applicant';
</script>

<div class="min-h-screen bg-white p-8 font-serif">
  <div class="max-w-2xl mx-auto">
    <!-- Letterhead - UCLA Blue and Gold -->
    <div class="border-b-4 border-[#2774AE] pb-4 mb-8">
      <div class="flex items-center mb-4">
        <!-- UCLA Logo -->
        <div class="w-12 h-12 bg-[#2774AE] text-[#FFD100] rounded mr-4 flex items-center justify-center">
          <span class="text-xl font-bold">UCLA</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#2774AE]">University of California, Los Angeles</h1>
          <p class="text-[#FFD100] text-sm font-medium">Office of Undergraduate Admissions</p>
        </div>
      </div>
      <div class="text-sm text-gray-600">
        <p>1147 Murphy Hall, Box 951436</p>
        <p>Los Angeles, California 90095</p>
        <p>Tel: 310-825-3101</p>
      </div>
    </div>

    <!-- Date -->
    <p class="mb-8 text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

    <!-- Applicant Info -->
    <div class="mb-8">
      <p class="text-lg font-medium text-gray-800">{applicantName}</p>
      <p class="text-gray-600">Freshman Applicant</p>
      <p class="text-sm text-gray-500">College of Letters and Science</p>
    </div>

    <!-- Letter Body -->
    <div class="mb-8 leading-relaxed text-gray-800">
      <p class="mb-4">Dear {applicantName},</p>
      
      <p class="mb-4">
        On behalf of the University of California, Los Angeles, I am delighted to offer you admission to the 
        Fall 2024 entering class. Congratulations and welcome to the Bruin family!
      </p>
      
      <p class="mb-4">
        Your application was evaluated within an exceptionally competitive pool of more than 146,000 
        candidates from around the world—the most applications received by any four-year university in 
        the United States. The Admissions Committee was impressed by your academic achievements, 
        intellectual curiosity, and demonstrated commitment to both scholarship and community engagement. 
        Your unique perspective and potential align perfectly with UCLA's mission as a leading public 
        research university.
      </p>
      
      <div class="my-8 p-6 bg-blue-50 border-l-4 border-[#FFD100] italic">
        <p class="mb-2 font-semibold text-[#2774AE]">Welcome to UCLA</p>
        <p class="text-gray-700">
          At UCLA, you will join a diverse, dynamic community of scholars, innovators, and leaders in 
          the heart of Los Angeles. You'll have the opportunity to learn from world-renowned faculty, 
          engage in cutting-edge research, and experience the vibrant culture of Southern California 
          while pursuing academic excellence at one of the world's top public universities.
        </p>
      </div>
      
      <p class="mb-4">
        As an admitted student, you will receive comprehensive information about next steps, including 
        details about Bruin Day (our admitted student program), housing in the Hill, course registration 
        through MyUCLA, and financial aid (if applicable). You can also expect to hear directly from 
        current students, faculty, and alumni who are eager to welcome you to Westwood.
      </p>
      
      <p class="mb-4">
        This offer of admission is contingent upon your successful completion of the current academic 
        year. We expect that you will maintain the high standards of achievement and personal conduct 
        that characterized your secondary school record.
      </p>
      
      <p class="mb-4">
        Please take time to celebrate this significant achievement with your family, teachers, and 
        friends who have supported you throughout this process. We look forward to welcoming you to 
        UCLA this fall.
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <p class="mb-1">Sincerely,</p>
      <div class="mb-8">
        <div class="h-12 mb-2 flex items-center">
          <div class="w-16 h-8 bg-[#2774AE] mr-2"></div>
          <div class="w-16 h-8 bg-[#FFD100]"></div>
        </div>
        <p class="font-semibold text-[#2774AE]">Youlonda Copeland-Morgan</p>
        <p class="text-sm text-[#FFD100]">Vice Provost for Enrollment Management</p>
        <p class="text-sm text-gray-600">University of California, Los Angeles</p>
      </div>
      
      <div class="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm text-gray-700 mb-2">
          <strong class="text-[#2774AE]">Next Steps:</strong> Your official admission packet will arrive by mail within 
          7-10 business days. Please log into your UCLA Applicant Portal to view your financial aid award 
          (if applicable) and to confirm your enrollment by May 1.
        </p>
        <p class="text-sm text-gray-700">
          <strong class="text-[#FFD100]">Important:</strong> Admitted students are invited to attend 
          <em>Bruin Day</em>, our admitted student program, on Saturday, April 20, 2024. Registration information will be available in your portal.
        </p>
      </div>
    </div>
  </div>
</div>