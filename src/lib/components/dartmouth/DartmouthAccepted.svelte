<script lang="ts">
  export let applicantName: string = 'Applicant';
</script>

<div class="min-h-screen bg-white p-8 font-serif">
  <div class="max-w-2xl mx-auto">
    <!-- Letterhead - Dartmouth Green -->
    <div class="border-b-4 border-[#00693E] pb-4 mb-8">
      <div class="flex items-center mb-4">
        <!-- Dartmouth Pine Logo -->
        <div class="w-12 h-12 bg-[#00693E] rounded-full mr-4 flex items-center justify-center">
          <span class="text-white text-xl font-bold">D</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#00693E]">Dartmouth College</h1>
          <p class="text-gray-700 text-sm">Office of Admissions</p>
        </div>
      </div>
      <div class="text-sm text-gray-600">
        <p>6016 McNutt Hall</p>
        <p>Hanover, New Hampshire 03755</p>
        <p>Tel: 603-646-2875</p>
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
        On behalf of Dartmouth College, I am delighted to offer you admission to the 
        Class of 2028. Welcome to the Dartmouth family!
      </p>
      
      <p class="mb-4">
        Your application was evaluated within an exceptionally competitive pool of candidates from 
        around the world. The Admissions Committee was impressed by your intellectual curiosity, 
        academic achievements, and demonstrated commitment to both academic excellence and community 
        engagement. Your unique perspective and potential for leadership align perfectly with 
        Dartmouth's mission to educate the most promising students and prepare them for a lifetime 
        of learning and of responsible leadership.
      </p>
      
      <div class="my-8 p-6 bg-green-50 border-l-4 border-[#00693E] italic">
        <p class="mb-2 font-semibold text-[#00693E]">Welcome to the Dartmouth Experience</p>
        <p class="text-gray-700">
          At Dartmouth, you will join a close-knit community of scholars in the beautiful Upper Valley 
          of New Hampshire. You'll engage with our distinctive D-Plan (quarter system), work closely 
          with world-renowned faculty in small classes, and participate in the vibrant outdoor and 
          social traditions that define the Dartmouth experience—from the Dartmouth Outing Club to 
          Winter Carnival.
        </p>
      </div>
      
      <p class="mb-4">
        As an admitted student, you will receive comprehensive information about next steps, including 
        details about Dartmouth's admitted student programs (Dimensions of Dartmouth), housing, course 
        registration, and financial aid (if applicable). You can also expect to hear directly from 
        current students, faculty, and alumni who are eager to welcome you to our community.
      </p>
      
      <p class="mb-4">
        This offer of admission is contingent upon your successful completion of the current academic 
        year. We expect that you will maintain the high standards of achievement and personal conduct 
        that characterized your secondary school record.
      </p>
      
      <p class="mb-4">
        Please take time to celebrate this significant achievement with your family, teachers, and 
        friends who have supported you throughout this process. We look forward to welcoming you to 
        Hanover this fall.
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <p class="mb-1">Sincerely,</p>
      <div class="mb-8">
        <div class="h-12 mb-2 flex items-center text-[#00693E] font-bold text-lg">
          Dartmouth College
        </div>
        <p class="font-semibold text-[#00693E]">Lee Coffin</p>
        <p class="text-sm text-gray-700">Vice Provost for Enrollment and Dean of Admissions and Financial Aid</p>
        <p class="text-sm text-gray-600">Dartmouth College</p>
      </div>
      
      <div class="mt-12 p-6 bg-green-50 rounded-lg border border-green-200">
        <p class="text-sm text-gray-700 mb-2">
          <strong class="text-[#00693E]">Next Steps:</strong> Your official admission packet will arrive by mail within 
          7-10 business days. Please log into your Dartmouth Application Portal to view your financial aid award 
          (if applicable) and to confirm your enrollment by May 1.
        </p>
        <p class="text-sm text-gray-700">
          <strong class="text-[#00693E]">Important:</strong> Admitted students are invited to attend 
          <em>Dimensions of Dartmouth</em>, our admitted student program, in April. Registration information will be available in your portal.
        </p>
      </div>
    </div>
  </div>
</div>