<script lang="ts">
  let { applicantName = '' } = $props<{ applicantName: string }>();
  
  // Extract first name from full name
  const firstName = $derived(() => {
    if (!applicantName) return '';
    const names = applicantName.split(' ');
    return names[0] || '';
  });
</script>

<svelte:head>
  <title>Princeton University - Admission Decision</title>
</svelte:head>

<main class="min-h-screen bg-white text-gray-800 font-serif p-6">
  <div class="max-w-3xl mx-auto">
    <!-- Letterhead -->
    <div class="border-b-2 border-[#E77500] pb-4 mb-8">
      <div class="flex items-center">
        <div class="w-16 h-16 bg-[#E77500] text-white flex items-center justify-center font-bold text-2xl mr-4 rounded-full">
          P
        </div>
        <div>
          <h1 class="text-2xl font-bold text-[#E77500]">PRINCETON UNIVERSITY</h1>
          <div class="text-sm text-gray-600">
            Office of Undergraduate Admission<br>
            Princeton, New Jersey 08544<br>
            Telephone 609-258-3060
          </div>
        </div>
      </div>
    </div>

    <!-- Date and Address -->
    <div class="mb-8">
      <div class="text-right text-sm text-gray-600 mb-2">
        March 26, 2020
      </div>
      <div class="space-y-1">
        <div>{applicantName || 'Applicant'}</div>
        <div>1600 Pennsylvania Avenue NW</div>
        <div>Washington, DC 20500</div>
      </div>
    </div>

    <!-- Greeting -->
    <div class="mb-6">
      <div class="text-lg font-bold text-[#E77500]">Congratulations!</div>
    </div>

    <!-- Letter Body -->
    <div class="space-y-4 mb-8">
      <p>
        On behalf of the Admission Committee, I am delighted to inform you that you have been admitted to Princeton University as a member of the Class of 2024. Your application impressed us with its intellectual depth, creativity, and commitment to academic excellence.
      </p>

      <p>
        This year, Princeton received over 32,000 applications for the 1,300 places in the first-year class. Your admission is a testament to your exceptional abilities and potential to contribute to our vibrant campus community.
      </p>

      <p>
        At Princeton, you will join a community dedicated to "In the Nation's Service and the Service of Humanity." You will have the opportunity to learn from Nobel laureates and Pulitzer Prize winners, conduct original research as an undergraduate, and participate in our unique residential college system.
      </p>

      <div class="bg-orange-50 border-l-4 border-[#E77500] p-4 my-4">
        <h3 class="font-bold text-[#E77500] mb-2">A Princeton Education</h3>
        <p class="text-sm">
          Princeton is the only top research university that requires a senior thesis of all its undergraduates. This capstone experience allows you to work one-on-one with faculty mentors to produce original scholarship.
        </p>
      </div>

      <p>
        We were particularly impressed by your potential to thrive in our rigorous academic environment. Princeton's commitment to undergraduate teaching, combined with our generous financial aid program that meets 100% of demonstrated need without loans, ensures that you can focus fully on your education.
      </p>

      <p>
        To accept your offer of admission, please complete the online reply form in your admission portal by <strong>May 1, 2020</strong>. You are also invited to attend Princeton Preview, our admitted students program, from April 16-18, 2020.
      </p>

      <p>
        Again, congratulations on this outstanding achievement. We look forward to welcoming you to Princeton this fall.
      </p>
    </div>

    <!-- Signature -->
    <div class="mt-12">
      <div class="mb-2">
        <div class="h-1 w-32 bg-[#E77500]"></div>
      </div>
      <div class="font-bold text-lg">Karen Richardson</div>
      <div class="text-sm text-gray-600">
        Dean of Admission<br>
        Princeton University
      </div>
    </div>

    <!-- Tiger Graphic -->
    <div class="mt-16 text-center">
      <div class="inline-block text-4xl mb-4">🐯</div>
      <div class="text-sm text-gray-500 italic">
        Princeton Tigers – Est. 1746
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
      <div class="grid grid-cols-2 gap-8">
        <div>
          <strong>Princeton University Mission:</strong><br>
          Princeton University advances learning through scholarship, research, and teaching of unsurpassed quality, with an emphasis on undergraduate and doctoral education that is distinctive among the world's great universities.
        </div>
        <div>
          <strong>Contact Information:</strong><br>
          Email: uaoffice@princeton.edu<br>
          Phone: 609-258-3060<br>
          Website: admission.princeton.edu
        </div>
      </div>
    </div>

    <!-- Simulation Note -->
    <div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
      <strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. 
      This is not a real admission decision from Princeton University.
    </div>
  </div>
</main>
