<script lang="ts">
	// Props passed from the main portal page
	export let applicantName: string;
	export let schoolName: string;
	export let primaryColor: string; // Caltech Orange: #E15000
	export let footerDomain: string;
</script>

<div class="min-h-screen bg-white text-gray-800 font-sans p-6">
    <main class="max-w-3xl mx-auto mt-10">
        <div class="absolute left-1/2 transform -translate-x-1/2 max-w-3xl w-full" style="top: 2rem;">
            <a
                href="/"
                class="inline-block border border-slate-500 bg-slate-100 px-3 py-1 text-[11px] font-semibold hover:bg-slate-200 active:bg-slate-300 transition-colors shadow-sm"
                style="position: absolute; left: 0; top: 0;"
            >
                &#8592; Back to PredictAdmit admitMail
            </a>
        </div>
        
        <div class="border-b-2 pb-4 mb-8" style="border-color: {primaryColor};">
            <div class="flex items-center">
                <div class="w-16 h-16 text-white flex items-center justify-center font-bold text-2xl mr-4" style="background-color: {primaryColor};">
                    C
                </div>
                <div>
                    <h1 class="text-2xl font-bold" style="color: {primaryColor};">CALIFORNIA INSTITUTE OF TECHNOLOGY</h1>
                    <div class="text-sm text-gray-600">
                        Office of Undergraduate Admissions<br>
                        1200 E California Blvd, Pasadena, California 91125<br>
                        Telephone 626-395-6341 • Fax 626-449-9742
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-8">
            <div class="text-right text-sm text-gray-600 mb-2">
                March 14, 2020
            </div>
            <div class="space-y-1">
                <div>{applicantName || 'Applicant'}</div>
                <div>1600 Pennsylvania Avenue NW</div>
                <div>Washington, DC 20500</div>
            </div>
        </div>

        <div class="mb-6">
            <div class="text-lg font-bold text-red-700">Decision Notification</div>
        </div>

        <div class="space-y-4 mb-8">
            <p>
                Thank you for your interest in the California Institute of Technology and for the comprehensive application you submitted for admission to the Class of 2024.
            </p>

            <p>
                The selection process this year was extremely competitive, with an exceptionally talented pool of applicants seeking a limited number of spaces. After a careful and holistic review by the Undergraduate Admissions Committee, we regret to inform you that we are unable to offer you admission at this time.
            </p>

            <p>
                Please know that this decision reflects the demanding nature of our selection process and the small size of our entering class, rather than a lack of respect for your considerable academic and personal achievements. We were impressed by your demonstrated abilities and contributions.
            </p>

            <p>
                You may log in to your admissions portal for additional context regarding this decision.
            </p>

            <p>
                We wish you great success in the continuation of your education and all future endeavors.
            </p>
        </div>

        <div class="mt-12">
            <div class="mb-2 h-12 flex items-end">
                <div class="text-xl italic font-serif" style="color: {primaryColor};">Grant's Signature</div>
            </div>
            <div class="font-bold">Grant D. Currin</div>
            <div class="text-sm text-gray-600">
                Director of Undergraduate Admissions<br>
                Caltech
            </div>
        </div>

        <div class="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
            <div class="grid grid-cols-2 gap-8">
                <div>
                    <strong>Caltech Mission:</strong><br>
                    To expand human knowledge and benefit society through research integrated with education, in a highly collegial, interdisciplinary atmosphere.
                </div>
                <div>
                    <strong>Contact Information:</strong><br>
                    Email: ugadmissions@caltech.edu<br>
                    Phone: 626-395-6341<br>
                    Website: admissions.caltech.edu
                </div>
            </div>
        </div>

        <div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
            <strong>Note:</strong> This is a simulated admission letter for entertainment purposes only. 
            This is not a real admission decision from Caltech.
        </div>
    </main>
</div>