<script lang="ts">
  export let applicantName: string = 'Applicant';
</script>

<div class="min-h-screen bg-white p-8 font-serif">
  <div class="max-w-2xl mx-auto">
    <!-- Letterhead - UC Berkeley Blue and Gold -->
    <div class="border-b-4 border-[#003262] pb-4 mb-8">
      <div class="flex items-center mb-4">
        <!-- Berkeley "Cal" Logo -->
        <div class="w-12 h-12 bg-[#003262] text-[#FDB515] rounded mr-4 flex items-center justify-center">
          <span class="text-xl font-bold">Cal</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#003262]">University of California, Berkeley</h1>
          <p class="text-[#FDB515] text-sm font-medium">Office of Undergraduate Admissions</p>
        </div>
      </div>
      <div class="text-sm text-gray-600">
        <p>110 Sproul Hall #5800</p>
        <p>Berkeley, California 94720</p>
        <p>Tel: 510-642-3175</p>
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
        On behalf of the University of California, Berkeley, I am delighted to offer you admission to the 
        Fall 2024 entering class. Congratulations and welcome to the Cal community!
      </p>
      
      <p class="mb-4">
        Your application was evaluated within an exceptionally competitive pool of more than 125,000 
        candidates from around the world. The Admissions Committee was impressed by your academic 
        achievements, intellectual curiosity, and demonstrated commitment to both scholarship and 
        community engagement. Your unique perspective and potential align perfectly with Berkeley's 
        mission as the world's premier public university.
      </p>
      
      <div class="my-8 p-6 bg-blue-50 border-l-4 border-[#FDB515] italic">
        <p class="mb-2 font-semibold text-[#003262]">Welcome to UC Berkeley</p>
        <p class="text-gray-700">
          At Berkeley, you will join a diverse, dynamic community of scholars, innovators, and activists. 
          You'll have the opportunity to learn from Nobel laureates, Pulitzer Prize winners, and 
          groundbreaking researchers while engaging with the vibrant culture of the San Francisco Bay Area. 
          As a public university, we are committed to providing an accessible, world-class education.
        </p>
      </div>
      
      <p class="mb-4">
        As an admitted student, you will receive comprehensive information about next steps, including 
        details about Cal Day (our admitted student program), housing in the residence halls, course 
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
        Berkeley this fall.
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <p class="mb-1">Sincerely,</p>
      <div class="mb-8">
        <div class="h-12 mb-2 flex items-center">
          <div class="w-16 h-8 bg-[#003262] mr-2"></div>
          <div class="w-16 h-8 bg-[#FDB515]"></div>
        </div>
        <p class="font-semibold text-[#003262]">Olufemi Ogundele</p>
        <p class="text-sm text-[#FDB515]">Associate Vice Chancellor and Director of Undergraduate Admissions</p>
        <p class="text-sm text-gray-600">University of California, Berkeley</p>
      </div>
      
      <div class="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm text-gray-700 mb-2">
          <strong class="text-[#003262]">Next Steps:</strong> Your official admission packet will arrive by mail within 
          7-10 business days. Please log into your UC Berkeley Applicant Portal to view your financial aid award 
          (if applicable) and to confirm your enrollment by May 1.
        </p>
        <p class="text-sm text-gray-700">
          <strong class="text-[#FDB515]">Important:</strong> Admitted students are invited to attend 
          <em>Cal Day</em>, our admitted student program, on Saturday, April 13, 2024. Registration information will be available in your portal.
        </p>
      </div>
    </div>
  </div>
</div>