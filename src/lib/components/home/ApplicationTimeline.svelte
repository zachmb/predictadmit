<script lang="ts">
  import { calendarDates } from '$lib/config/admitMail';
  import type { ApplicationPhase } from '$lib/config/admitMail';

  export let hasApplied: boolean;
  export let calendarIndex: number;
  export let applicationPhase: ApplicationPhase;
  export let displayName: string;
  export let displayEmail: string;

  // small derived bits for the Common App mock
  $: firstName = (displayName || '').split(' ')[0] || 'First';
  $: lastName = (displayName || '').split(' ').slice(1).join(' ') || 'Last';
</script>

{#if hasApplied}
  <section class="bg-white border border-slate-400 shadow-md rounded-sm">
    <div class="border-b border-slate-300 bg-slate-100 px-4 py-2 flex items-center justify-between">
      <div class="text-[11px] text-slate-800">
        <span class="font-semibold">Application progress</span>
        <span class="text-slate-500"> · commonapp.org · PowerSchool · ACT</span>
      </div>
      <div class="text-[11px] text-slate-700">
        Calendar: <span class="font-semibold">{calendarDates[calendarIndex]}</span>
      </div>
    </div>

    <div class="px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
      <!-- Fake browser window -->
      <div class="md:col-span-2 border border-slate-400 rounded-sm shadow-sm bg-slate-50">
        <div class="flex items-center justify-between px-3 py-2 border-b border-slate-300 bg-slate-200">
          <div class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
            <span class="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
            <span class="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          </div>
          <div class="flex-1 mx-2">
            <div class="border border-slate-400 bg-white px-2 py-1 text-[10px] truncate">
              {#if applicationPhase === 'commonapp'}
                https://apply.commonapp.org/account/create
              {:else if applicationPhase === 'fee'}
                https://apply.commonapp.org/submit/confirmation
              {:else if applicationPhase === 'transcript'}
                https://powerschool.example.org/student/transcript
              {:else if applicationPhase === 'act'}
                https://my.act.org/dashboard
              {:else}
                https://predictadmit.com/status/waiting
              {/if}
            </div>
          </div>
          <div class="text-[10px] text-slate-700">
            🔒 Secure
          </div>
        </div>

        <div class="px-4 py-4 bg-white min-h-[200px]">
          {#if applicationPhase === 'commonapp'}
            <!-- Common App–style page -->
            <div class="border border-slate-200 rounded-sm overflow-hidden text-[11px]">
              <div class="bg-sky-900 text-white px-4 py-2 flex items-center justify-between">
                <span class="text-xs font-semibold tracking-wide uppercase">
                  The Common Application
                </span>
                <span class="text-[10px] text-sky-100">Undergraduate admission</span>
              </div>
              <div class="flex border-b border-slate-200 bg-slate-50 text-[10px]">
                <div class="px-4 py-2 border-b-2 border-sky-700 font-semibold text-slate-900">
                  Create Account
                </div>
                <div class="px-4 py-2 text-slate-500">
                  Dashboard
                </div>
                <div class="px-4 py-2 text-slate-500">
                  My Colleges
                </div>
                <div class="px-4 py-2 text-slate-500">
                  College Search
                </div>
              </div>
              <div class="px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <div>
                    <label
                      class="block text-[10px] font-semibold mb-1"
                      for="common-first-name"
                    >
                      First / Given Name
                    </label>
                    <input
                      id="common-first-name"
                      class="w-full border border-slate-300 bg-slate-50 px-2 py-1 text-[11px]"
                      value={firstName}
                      readonly
                    />
                  </div>
                  <div>
                    <label
                      class="block text-[10px] font-semibold mb-1"
                      for="common-last-name"
                    >
                      Last / Family Name
                    </label>
                    <input
                      id="common-last-name"
                      class="w-full border border-slate-300 bg-slate-50 px-2 py-1 text-[11px]"
                      value={lastName}
                      readonly
                    />
                  </div>
                  <div>
                    <label
                      class="block text-[10px] font-semibold mb-1"
                      for="common-email"
                    >
                      Email Address
                    </label>
                    <input
                      id="common-email"
                      class="w-full border border-slate-300 bg-slate-50 px-2 py-1 text-[11px]"
                      value={displayEmail}
                      readonly
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        class="block text-[10px] font-semibold mb-1"
                        for="common-password"
                      >
                        Password
                      </label>
                      <input
                        id="common-password"
                        class="w-full border border-slate-300 bg-slate-50 px-2 py-1 text-[11px]"
                        type="password"
                        value="••••••••"
                        readonly
                      />
                    </div>
                    <div>
                      <label
                        class="block text-[10px] font-semibold mb-1"
                        for="common-confirm-password"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="common-confirm-password"
                        class="w-full border border-slate-300 bg-slate-50 px-2 py-1 text-[11px]"
                        type="password"
                        value="••••••••"
                        readonly
                      />
                    </div>
                  </div>
                </div>
                <div class="space-y-3">
                  <div>
                    <div class="text-[10px] font-semibold mb-1">
                      Profile completion
                    </div>
                    <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div class="h-2 bg-sky-700" style="width: 65%;"></div>
                    </div>
                    <p class="mt-1 text-[10px] text-slate-600">
                      Activities, essay, and colleges added. Ready to submit.
                    </p>
                  </div>
                  <ul class="list-disc list-inside space-y-1 text-[11px] text-slate-700">
                    <li>Personal information · Complete</li>
                    <li>Education · Complete</li>
                    <li>Testing · Complete</li>
                    <li>Writing · Complete</li>
                    <li>Review &amp; Submit · In progress</li>
                  </ul>
                </div>
              </div>
            </div>
          {:else if applicationPhase === 'fee'}
            <!-- Payment/confirmation–style page -->
            <div class="border border-emerald-200 rounded-sm bg-emerald-50 px-4 py-4 text-[11px]">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-6 h-6 rounded-full border border-emerald-500 flex items-center justify-center text-emerald-600 text-xs">
                  ✓
                </div>
                <div>
                  <div class="text-xs font-semibold text-emerald-800">
                    Submission complete
                  </div>
                  <div class="text-[10px] text-emerald-700">
                    Your Common App submissions have been processed.
                  </div>
                </div>
              </div>
              <div class="border border-emerald-200 bg-white rounded-sm px-3 py-3">
                <div class="text-[10px] font-semibold text-slate-800 mb-1">
                  Payment confirmation
                </div>
                <p class="mb-1">
                  Confirmation ID:
                  <span class="font-mono">
                    CA-{Math.floor(Math.random() * 899999 + 100000)}
                  </span>
                </p>
                <p class="mb-1">
                  Card ending in <span class="font-semibold">4242</span> · Total fees:
                  <span class="font-semibold">$325.00</span>
                </p>
                <p class="mb-2 text-slate-700">
                  Applications submitted to:
                </p>
                <ul class="list-disc list-inside text-slate-800 space-y-1">
                  <li>Harvard University</li>
                  <li>Stanford University</li>
                  <li>Massachusetts Institute of Technology</li>
                  <li>+  {20 - 3} more colleges</li>
                </ul>
              </div>
            </div>
          {:else if applicationPhase === 'transcript'}
            <!-- PowerSchool–style page -->
            <div class="text-[11px]">
              <h2 class="text-sm font-semibold mb-2">PowerSchool · Unofficial Transcript</h2>
              <p class="mb-2 text-slate-700">
                Student: <span class="font-semibold">{displayName}</span> · School:
                <span class="font-semibold">Sample High School</span>
              </p>
              <div class="border border-slate-200 rounded-sm overflow-hidden bg-slate-50">
                <table class="w-full text-[10px]">
                  <thead class="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th class="px-2 py-1 text-left">Course</th>
                      <th class="px-2 py-1 text-left">Level</th>
                      <th class="px-2 py-1 text-left">Term</th>
                      <th class="px-2 py-1 text-left">Grade</th>
                      <th class="px-2 py-1 text-left">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-slate-100 bg-white">
                      <td class="px-2 py-1">AP Calculus BC</td>
                      <td class="px-2 py-1">AP</td>
                      <td class="px-2 py-1">12</td>
                      <td class="px-2 py-1 font-semibold">A</td>
                      <td class="px-2 py-1">1.0</td>
                    </tr>
                    <tr class="border-b border-slate-100">
                      <td class="px-2 py-1">AP Physics C: Mechanics</td>
                      <td class="px-2 py-1">AP</td>
                      <td class="px-2 py-1">12</td>
                      <td class="px-2 py-1 font-semibold">A</td>
                      <td class="px-2 py-1">1.0</td>
                    </tr>
                    <tr class="border-b border-slate-100 bg-white">
                      <td class="px-2 py-1">AP Computer Science A</td>
                      <td class="px-2 py-1">AP</td>
                      <td class="px-2 py-1">11</td>
                      <td class="px-2 py-1 font-semibold">A</td>
                      <td class="px-2 py-1">1.0</td>
                    </tr>
                    <tr class="border-b border-slate-100">
                      <td class="px-2 py-1">AP English Language &amp; Composition</td>
                      <td class="px-2 py-1">AP</td>
                      <td class="px-2 py-1">11</td>
                      <td class="px-2 py-1 font-semibold">A</td>
                      <td class="px-2 py-1">1.0</td>
                    </tr>
                    <tr class="bg-white">
                      <td class="px-2 py-1">AP U.S. History</td>
                      <td class="px-2 py-1">AP</td>
                      <td class="px-2 py-1">11</td>
                      <td class="px-2 py-1 font-semibold">A</td>
                      <td class="px-2 py-1">1.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="mt-2 text-[10px] text-slate-700">
                Weighted GPA: <span class="font-semibold">4.9</span> · Unweighted GPA:
                <span class="font-semibold">4.0</span>
              </p>
            </div>
          {:else if applicationPhase === 'act'}
            <!-- ACT–style page -->
            <div class="text-[11px]">
              <h2 class="text-sm font-semibold mb-2">ACT Student · Score Report</h2>
              <div class="grid grid-cols-2 gap-3">
                <div class="border border-slate-200 rounded-sm bg-slate-50 px-3 py-3">
                  <div class="text-[10px] text-slate-600 mb-1">
                    Composite Score
                  </div>
                  <div class="text-2xl font-bold text-green-700 leading-none">35</div>
                  <div class="text-[10px] text-slate-600 mt-1">
                    Test Date: <span class="font-semibold">April 2025</span>
                  </div>
                </div>
                <div class="border border-slate-200 rounded-sm bg-slate-50 px-3 py-3">
                  <div class="text-[10px] font-semibold mb-1">Section Scores</div>
                  <ul class="space-y-1 text-[10px]">
                    <li>English: <span class="font-semibold">36</span></li>
                    <li>Math: <span class="font-semibold">35</span></li>
                    <li>Reading: <span class="font-semibold">35</span></li>
                    <li>Science: <span class="font-semibold">34</span></li>
                  </ul>
                </div>
              </div>
              <p class="mt-2 text-[10px] text-slate-700">
                Score report sent electronically to all colleges on your list.
              </p>
            </div>
          {:else}
            <div>
              <h2 class="text-sm font-semibold mb-2">Applications submitted</h2>
              <p class="text-slate-700 mb-1">
                Your files are complete. Admissions committees are meeting; time is crawling toward
                decision day.
              </p>
              <p class="text-[10px] text-slate-600">
                Once the calendar reaches December 15, your Early Decision / REA result (if applicable)
                will appear. Regular Decision emails unlock on the March decision date.
              </p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Calendar / explanation -->
      <div class="border border-slate-400 rounded-sm bg-slate-50 px-3 py-3 flex flex-col justify-between">
        <div>
          <h3 class="text-xs font-bold text-slate-900 mb-2 uppercase">
            Time passing
          </h3>
          <p class="text-[11px] text-slate-800 mb-2">
            The calendar jumps from August application season through December early rounds and then to
            March Regular Decision.
          </p>
        </div>
        <div class="mt-2 border border-slate-300 bg-white px-3 py-2 text-center">
          <div class="text-[10px] uppercase text-slate-500 tracking-wide">
            Today
          </div>
          <div class="text-sm font-semibold text-slate-900">
            {calendarDates[calendarIndex]}
          </div>
        </div>
        <p class="mt-3 text-[10px] text-slate-600">
          When the application process has finished and the date reaches your decision rounds, admitMail
          will start to fill with emails.
        </p>
      </div>
    </div>
  </section>
{/if}
