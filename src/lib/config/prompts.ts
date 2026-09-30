/**
 * ============================================================================
 * 2025-2026 UNDERGRADUATE SUPPLEMENTAL ESSAY PROMPTS + COMMON APP PERSONAL STATEMENT
 * ============================================================================
 *
 * Compiled for the 2025-2026 US undergraduate application cycle.
 * Prompts are verbatim (transcribed exactly as published). Word limits are appended
 * in parentheses at the end of each description.
 *
 * ----------------------------------------------------------------------------
 * CONFIDENCE / SOURCING NOTES (read before merging)
 * ----------------------------------------------------------------------------
 *
 * HIGH CONFIDENCE (prompts cross-checked, verbatim, 2025-2026 cycle confirmed):
 *   harvard, stanford, mit, princeton, yale, columbia, uchicago, upenn, caltech,
 *   duke, jhu, northwestern, dartmouth, brown, vanderbilt, rice, wustl, cornell,
 *   georgiatech, nyu, usc, georgetown, notredame, emory, uva, cmu, umich, unc,
 *   wakeforest, uf, wisconsin, purdue
 *   + The UC schools (ucla, ucberkeley, ucsd, uci, ucdavis) — all share the 8 UC
 *     Personal Insight Questions (pick 4, 350 words each). These PIQs have been
 *     stable for several cycles and are HIGH confidence.
 *   + Common App 7 personal-statement prompts (unchanged for the 2025-2026 cycle).
 *
 * LOWER CONFIDENCE / NOTABLE CAVEATS (flagged — verify against the official page
 * before relying on these):
 *   - wwu (Western Washington University): WWU does NOT require a supplemental essay
 *     for first-year applicants. The essay is OPTIONAL/recommended. There is no
 *     fixed first-year supplemental prompt published; the entries below are the
 *     OPTIONAL recommended prompts WWU provides. LOWER confidence on exact first-year
 *     wording (WWU publishes clear prompts mainly for TRANSFER applicants).
 *   - osu (Ohio State): NO required supplemental essay for general first-year
 *     applicants on the Common App. Only the Morrill Scholars Program (scholarship,
 *     eligibility-restricted) has an essay. Listed below as optional.
 *   - uva (University of Virginia): REMOVED its general supplemental essay for
 *     2025-2026. Only the School of Nursing has a supplemental prompt. Confirmed via
 *     The Cavalier Daily (UVA student newspaper) reporting the removal.
 *   - Several large publics and a few privates have school/college-specific prompts
 *     that VARY by the college or major the student applies to (Cornell, UPenn,
 *     Georgetown, USC, Purdue, UMich, Rice). Where a universal/most-common prompt
 *     exists it is listed; the college-specific variant is captured generically and
 *     marked. Confirm the exact variant for the student's target college/major.
 *   - NOTE on cycle: as of the research date (Sept 2026) many aggregators had rolled
 *     to 2026-2027. This file deliberately uses the 2025-2026 prompts where the two
 *     cycles differ (notably MIT, Caltech, Yale — whose 2026-27 prompts changed).
 *
 * PRIMARY SOURCES USED (official pages + high-accuracy aggregators):
 *   - Common App: collegeessayguy.com, bmhs.us (official PDF)
 *   - Harvard: college.harvard.edu via collegevine.com
 *   - Stanford: collegevine.com, collegeessayguy.com
 *   - MIT: mitadmissions.org, toptieradmissions.com (2025-26 archive)
 *   - Princeton: nextadmit.com, collegeessayguy.com
 *   - Yale: blog.accepted.com (2025-26), nextadmit.com
 *   - Columbia: toptieradmissions.com, collegeessay.org
 *   - UChicago: collegetransitions.com, scholarships360.org
 *   - UPenn: blog.accepted.com, collegevine.com
 *   - Caltech: scholarships360.org (2025-26, updated Sept 2 2025)
 *   - Duke: toptieradmissions.com, scholarships360.org
 *   - JHU: scholarships360.org
 *   - Northwestern: scholarships360.org
 *   - Dartmouth: scholarships360.org, collegetransitions.com
 *   - Brown: scholarships360.org, toptieradmissions.com
 *   - Vanderbilt: collegeessayadvisors.com
 *   - Rice: collegetransitions.com, admission.rice.edu
 *   - WashU: scholarships360.org
 *   - Cornell: scholarships360.org, collegevine.com
 *   - Georgia Tech: scholarships360.org, collegetransitions.com
 *   - NYU: collegevine.com
 *   - USC: scholarships360.org, collegevine.com
 *   - Georgetown: quadeducationgroup.com, toptieradmissions.com
 *   - Notre Dame: collegevine.com, scholarships360.org
 *   - Emory: scholarships360.org
 *   - UVA: cavalierdaily.com (removal report), collegevine.com
 *   - CMU: toptieradmissions.com, collegeadvisor.com
 *   - UMich: collegetransitions.com, scholarships360.org
 *   - UNC: scholarships360.org, atomicmind.com
 *   - Wake Forest: scholarships360.org, collegevine.com
 *   - UF: nextadmit.com, collegevine.com
 *   - UW-Madison: scholarships360.org, collegetransitions.com
 *   - Purdue: collegevine.com, cosmic.nyc
 *   - OSU: nextadmit.com
 *   - UC PIQs: admission.universityofcalifornia.edu (standard published set)
 *   - WWU: admissions.wwu.edu, collegevine.com
 * ============================================================================
 */

export interface EssayPrompt { id: string; title: string; description: string; }

export const schoolPrompts: Record<string, EssayPrompt[]> = {
  harvard: [
    { id: 'harvard-1', title: 'Life Experiences / Contribution', description: 'Harvard has long recognized the importance of enrolling a student body with a diversity of perspectives and experiences. How will the life experiences that shaped who you are today enable you to contribute to Harvard? (150 words)' },
    { id: 'harvard-2', title: 'Disagreement', description: 'Describe a time when you strongly disagreed with someone about an idea or issue. How did you communicate or engage with this person? What did you learn from this experience? (150 words)' },
    { id: 'harvard-3', title: 'Extracurriculars', description: 'Briefly describe any of your extracurricular activities, employment experience, travel, or family responsibilities that have shaped who you are. (150 words)' },
    { id: 'harvard-4', title: 'Future Goals', description: 'How do you hope to use your Harvard education in the future? (150 words)' },
    { id: 'harvard-5', title: 'Roommate', description: 'Top 3 things your roommates might like to know about you. (150 words)' },
  ],

  stanford: [
    { id: 'stanford-1', title: 'Short Answer: Societal Challenge', description: 'What is the most significant challenge that society faces today? (50 words)' },
    { id: 'stanford-2', title: 'Short Answer: Last Two Summers', description: 'How did you spend your last two summers? (50 words)' },
    { id: 'stanford-3', title: 'Short Answer: Historical Moment', description: 'What historical moment or event do you wish you could have witnessed? (50 words)' },
    { id: 'stanford-4', title: 'Short Answer: Extracurricular', description: 'Briefly elaborate on one of your extracurricular activities, a job you hold, or responsibilities you have for your family. (50 words)' },
    { id: 'stanford-5', title: 'Short Answer: Five Things', description: 'List five things that are important to you. (50 words)' },
    { id: 'stanford-6', title: 'Intellectual Vitality', description: 'The Stanford community is deeply curious and driven to learn in and out of the classroom. Reflect on an idea or experience that makes you genuinely excited about learning. (100-250 words)' },
    { id: 'stanford-7', title: 'Roommate Note', description: 'Virtually all of Stanford’s undergraduates live on campus. Write a note to your future roommate that reveals something about you or that will help your roommate—and us—know you better. (100-250 words)' },
    { id: 'stanford-8', title: 'Distinctive Contribution', description: 'Please describe what aspects of your life experiences, interests, and character would help you make a distinctive contribution as an undergraduate to Stanford University. (100-250 words)' },
  ],

  mit: [
    { id: 'mit-1', title: 'Field of Study', description: 'What field of study appeals to you the most right now? Tell us more about why this field of study at MIT appeals to you. (100-200 words)' },
    { id: 'mit-2', title: 'Just for Pleasure', description: 'We know you lead a busy life, full of activities, many of which are required of you. Tell us about something you do simply for the pleasure of it. (100-200 words)' },
    { id: 'mit-3', title: 'Unconventional Path', description: 'While some reach their goals following well-trodden paths, others blaze their own trails achieving the unexpected. In what ways have you done something different than what was expected in your educational journey? (100-200 words)' },
    { id: 'mit-4', title: 'Collaboration / Community', description: 'MIT brings people with diverse backgrounds together to collaborate, from tackling the world’s biggest challenges to lending a helping hand. Describe one way you have collaborated with others to learn from them, with them, or contribute to your community together. (100-200 words)' },
    { id: 'mit-5', title: 'Unexpected Challenge', description: 'How did you manage a situation or challenge that you didn’t expect? What did you learn from it? (100-200 words)' },
  ],

  princeton: [
    { id: 'princeton-1', title: 'Academic Interests (A.B. / Undecided)', description: 'For A.B. Degree Applicants or Undecided Applicants: As a research institution that also prides itself on its liberal arts curriculum, Princeton allows students to explore areas across the humanities and the arts, the natural sciences, and the social sciences. What academic areas most pique your curiosity, and how do the programs offered at Princeton suit your particular interests? (Answer this OR the engineering prompt.) (250 words)' },
    { id: 'princeton-2', title: 'Why Engineering (B.S.E.)', description: 'For B.S.E. Degree Applicants: Please describe why you are interested in studying engineering at Princeton. Include any of your experiences in or exposure to engineering, and how you think the programs offered at the University suit your particular interests. (Answer this OR the A.B. prompt.) (250 words)' },
    { id: 'princeton-3', title: 'Your Voice: Lived Experience', description: 'At Princeton, we value diverse perspectives and the ability to have respectful dialogue about difficult issues. Share a time when you had a conversation with a person or a group of people about a difficult topic. What insight did you gain, and how would you incorporate that knowledge into your thinking in the future? (250 words)' },
    { id: 'princeton-4', title: 'Service and Civic Engagement', description: 'Princeton has a longstanding commitment to understanding our responsibility to society through service and civic engagement. How does your own story intersect with these ideals? (250 words)' },
    { id: 'princeton-5', title: 'More About You: New Skill', description: 'What is a new skill you would like to learn in college? (50 words)' },
    { id: 'princeton-6', title: 'More About You: Joy', description: 'What brings you joy? (50 words)' },
    { id: 'princeton-7', title: 'More About You: Soundtrack', description: 'What song represents the soundtrack of your life at this moment? (50 words)' },
  ],

  yale: [
    { id: 'yale-1', title: 'Academic Interest Topic', description: 'Students at Yale have plenty of time to explore their academic interests before committing to one or more major fields of study. Many students either modify their original academic direction or change their minds entirely. As of this moment, what academic areas seem to fit your interests or goals most comfortably? Tell us about a topic or idea that excites you and is related to one or more academic areas you selected above. Why are you drawn to it? (200 words)' },
    { id: 'yale-2', title: 'Why Yale', description: 'Reflect on how your interests, values, and/or experiences have drawn you to Yale. (125 words)' },
    { id: 'yale-3', title: 'Short Take: Inspiration', description: 'What inspires you? (200 characters, ~35 words)' },
    { id: 'yale-4', title: 'Short Take: Teach / Book / Art', description: 'If you could teach any college course, write a book, or create an original piece of art of any kind, what would it be? (200 characters, ~35 words)' },
    { id: 'yale-5', title: 'Short Take: Influential Person', description: 'Other than a family member, who is someone who has had a significant influence on you? What has been the impact of their influence? (200 characters, ~35 words)' },
    { id: 'yale-6', title: 'Short Take: Something Unique', description: 'What is something about you that is not included anywhere else in your application? (200 characters, ~35 words)' },
    { id: 'yale-7', title: 'Long Essay (Choose One)', description: 'Respond to ONE of the following in 400 words or fewer: (a) Reflect on a time you discussed an issue important to you with someone holding an opposing view. Why did you find the experience meaningful? (b) Reflect on your membership in a community to which you feel connected. Why is this community meaningful to you? You may define community however you like. (c) Reflect on an element of your personal experience that you feel will enrich your college. How has it shaped you? (400 words)' },
  ],

  columbia: [
    { id: 'columbia-1', title: 'Intellectual Development List', description: 'List a selection of texts, resources and outlets that have contributed to your intellectual development outside of academic courses, including but not limited to books, journals, websites, podcasts, essays, plays, presentations, videos, museums and other content that you enjoy. (100 words or fewer)' },
    { id: 'columbia-2', title: 'Lived Experience / Contribution', description: 'Tell us about an aspect of your life so far or your lived experience that is important to you, and describe how it has shaped the way you would learn from and contribute to Columbia’s multidimensional and collaborative environment. (150 words or fewer)' },
    { id: 'columbia-3', title: 'Disagreement / Perspective', description: 'At Columbia, students representing a wide range of perspectives are invited to live and learn together. In such a community, questions and debates naturally arise. Please describe a time when you did not agree with someone and discuss how you engaged with them and what you took away from the interaction. (150 words or fewer)' },
    { id: 'columbia-4', title: 'Navigating Adversity', description: 'In college/university, students are often challenged in ways that they could not anticipate. Please describe a situation in which you have navigated through adversity and discuss how you changed as a result. (150 words or fewer)' },
    { id: 'columbia-5', title: 'Why Columbia', description: 'Why are you interested in attending Columbia University? (150 words or fewer)' },
    { id: 'columbia-6', title: 'Why Major', description: 'What attracts you to your preferred areas of study at Columbia College or Columbia Engineering? (150 words or fewer)' },
  ],

  uchicago: [
    { id: 'uchicago-1', title: 'Why UChicago', description: 'How does the University of Chicago, as you know it now, satisfy your desire for a particular kind of learning, community, and future? Please address with some specificity your own wishes and how they relate to UChicago. (No strict word limit; aim ~300-600 words)' },
    { id: 'uchicago-2', title: 'Extended Essay (Choose One)', description: 'Choose ONE of the following prompts (no word limit; be creative): (1) In an ideal world where inter-species telepathic communication exists, which species would you choose to have a conversation with, and what would you want to learn from them? Would you ask beavers for architectural advice? Octopuses about cognition? Pigeons about navigation? Ants about governance? Make your case—both for the species and the question. (2) If you could uninvent one thing, what would it be—and what would unravel as a result? (3) “Left” can mean remaining or departed. “Dust” can mean to add fine particles or to remove them. “Fast” can mean moving quickly or fixed firmly in place. These contronyms—words that are their own antonyms—somehow hold opposing meanings in perfect tension. Explore a contronym: a role, identity, or experience in your life that has contained its own opposite. (4) The penny is on its way out—too small to matter, too costly to keep. But not everything small should disappear. What’s one object the world is phasing out that you think we can’t afford to lose, and why? (5) From Michelin Tires creating the Michelin Guide, to the audio equipment company Audio-Technica becoming one of the world’s largest manufacturers of sushi robots, brand identity can turn out to be a lot more flexible than we think. Choose an existing brand, company, or institution and propose an unexpected but strangely logical new product or service for them to launch. Why is this unlikely extension exactly what the world (or the brand) needs right now? (6) Statistically speaking, ice cream doesn’t cause shark attacks, pet spending doesn’t drive the number of lawyers in California, and margarine consumption isn’t responsible for Maine’s divorce rate—at least, not according to conventional wisdom. Choose your favorite spurious correlation and make the case for why it might actually reveal a deeper, causative truth. (7) In the spirit of adventurous inquiry (and with the approval of the Dean of Admissions), choose one of our past prompts (or create a question of your own). Be original, creative, thought provoking. (No word limit)' },
  ],

  upenn: [
    { id: 'upenn-1', title: 'Thank-You Note', description: 'Write a short thank-you note to someone you have not yet thanked and would like to acknowledge. (We encourage you to share this note with that person, if possible, and reflect on the experience!) (150-200 words)' },
    { id: 'upenn-2', title: 'Community at Penn', description: 'How will you explore community at Penn? Consider how Penn will help shape your perspective, and how your experiences and perspective will help shape Penn. (150-200 words)' },
    { id: 'upenn-3', title: 'School-Specific (Why Your School/Major)', description: 'Answer the prompt for the specific Penn undergraduate school you are applying to (150-200 words). College of Arts & Sciences: What are you curious about, and how would you take advantage of opportunities in the arts and sciences? / Wharton: Please reflect on a current issue of importance to you and share how you hope a Wharton education would help you to explore it. / School of Engineering & Applied Science (SEAS): Please share how you plan to pursue your engineering interests at Penn. / School of Nursing: Describe why you are interested in studying nursing at Penn. (Note: specialized/dual-degree programs such as M&T, LSM, VIPER, NETS, DMD, NHCM have additional longer essays, 400-650 words.) (150-200 words)' },
  ],

  caltech: [
    { id: 'caltech-1', title: 'STEM Future: Academic Interest', description: 'Caltech’s mission is centered on expanding human knowledge and benefiting society through research integrated with education. If you had to choose an area of interest or two today, what would you choose? Why did you choose your proposed area of interest? If you selected “other,” what topics are you interested in pursuing? (100-200 words)' },
    { id: 'caltech-2', title: 'STEM Present: Curiosity', description: 'Regardless of your STEM interest listed above, take this opportunity to nerd out and talk to us about whatever STEM rabbit hole you have found yourself falling into. Be as specific or broad as you would like. (50-150 words)' },
    { id: 'caltech-3', title: 'STEM Past: Experience (Choose One)', description: 'Respond to ONE of the following (100-200 words): (a) Tell us how you initially found your interest and passion for science or any STEM topic, and how you have pursued or developed this interest or passion over time. (b) Tell us about a meaningful STEM-related experience from the last few years and share how and why it inspired your curiosity. (100-200 words)' },
    { id: 'caltech-4', title: 'Creativity in Action', description: 'How have you been a creator, inventor, or innovator in your own life, whether in or out of the classroom? (200-250 words)' },
    { id: 'caltech-5', title: 'Short Answers (Choose Two of Four)', description: 'Choose TWO of the following four questions; your combined responses should total no more than 250 words: (1) What is an interest or hobby you do for fun, and why does it bring you joy? (2) If you could teach a class on any topic or concept, what would it be and why? (3) What is a core piece of your identity or being that shapes how you view and/or interact with the world? (4) What is a concept that blew your mind or baffled you when you first encountered it? (250 words combined)' },
  ],

  duke: [
    { id: 'duke-1', title: 'Why Duke (Required)', description: 'What is your impression of Duke as a university and community, and why do you believe it is a good match for your goals, values, and interests? If there is something specific that attracts you to our academic offerings in Trinity College of Arts & Sciences or the Pratt School of Engineering, or to our co-curricular opportunities, feel free to include that too. (250 words)' },
    { id: 'duke-2', title: 'Perspectives & Experiences (optional)', description: 'We believe a wide range of personal perspectives, beliefs, and lived experiences are essential to making Duke a vibrant and meaningful living and learning community. Please share anything in this context that might help us better understand you and your potential contributions to Duke. (Optional; 250 words or fewer)' },
    { id: 'duke-3', title: 'Difference of Opinion (optional)', description: 'Meaningful dialogue often involves respectful disagreement. Provide an example of a difference of opinion you’ve had with someone you care about. What did you learn from it? (Optional; 250 words or fewer)' },
    { id: 'duke-4', title: 'Something You’re Excited About (optional)', description: 'What’s the last thing that you’ve been really excited about? (Optional; 250 words or fewer)' },
    { id: 'duke-5', title: 'AI Use (optional)', description: 'Duke’s Interdisciplinary AI initiative brings together experts across disciplines to advance AI research, tackle ethical challenges, and explore classroom applications. Tell us about a situation when you would or would not choose to use AI (when possible and permitted). What shapes your thinking? (Optional; 250 words or fewer)' },
  ],

  jhu: [
    { id: 'jhu-1', title: 'An Important First', description: 'Over the past 150 years, every monumental discovery at Hopkins has started with a first step: The first draft by a Pulitzer Prize-winning author. A prototype that led to a life-changing medical invention. The first pitch that launched a new startup venture. As we commemorate the university’s sesquicentennial—150 years since its founding—we continue to celebrate first steps just as much as final achievements. Tell us about an important first in your life—big or small—that has shaped you. (350 words)' },
  ],

  northwestern: [
    { id: 'northwestern-1', title: 'Background & Community (Required)', description: 'We want to be sure we’re considering your application in the context of your personal experiences: What aspects of your background, your identity, or your school, community, and/or household settings have most shaped how you see yourself engaging in Northwestern’s community, be it academically, extracurricularly, culturally, politically, socially, or otherwise? (Fewer than 300 words)' },
    { id: 'northwestern-2', title: 'Optional: The Rock', description: 'Painting “The Rock” is a beloved Northwestern tradition. If you could paint The Rock for any reason, what would you paint and why? (Answer at least 1, no more than 2 of the optional prompts; fewer than 200 words each)' },
    { id: 'northwestern-3', title: 'Optional: Design a Class/Project', description: 'Northwestern fosters a culture of “and” that empowers students to pursue multiple interests. If you could dream up a class, research project, or creative effort, what would it be? Who might be some ideal classmates or collaborators? (Optional; fewer than 200 words)' },
    { id: 'northwestern-4', title: 'Optional: Community & Belonging', description: 'Northwestern is a place where people with different backgrounds, beliefs, and identities come together. Reflect on a community or group you belong to, and how you’d bring that experience to connect with others at Northwestern. (Optional; fewer than 200 words)' },
    { id: 'northwestern-5', title: 'Optional: Location', description: 'Northwestern’s location is special: on the shore of Lake Michigan, steps from downtown Evanston, just a few miles from Chicago. What aspects of our location are most compelling to you, and why? (Optional; fewer than 200 words)' },
    { id: 'northwestern-6', title: 'Optional: Community Contribution', description: 'Northwestern values students who contribute in a variety of ways. How do you see yourself engaging with and contributing to a specific community, club, or group on campus? (Optional; fewer than 200 words)' },
  ],

  dartmouth: [
    { id: 'dartmouth-1', title: 'Why Dartmouth (Required)', description: 'As you seek admission to Dartmouth’s Class of 2030, what aspects of the college’s academic program, community, or campus environment attract your interest? In short, why Dartmouth? (100 words)' },
    { id: 'dartmouth-2', title: 'Required Essay 2 (Choose One)', description: 'Respond to ONE of the following (250 words): (A) There is a Quaker saying: Let your life speak. Describe the environment in which you were raised and the impact it has had on the person you are today. (B) “Be yourself,” Oscar Wilde advised. “Everyone else is taken.” Introduce yourself. (250 words)' },
    { id: 'dartmouth-3', title: 'Required Essay 3 (Choose One)', description: 'Respond to ONE of the following (250 words): (A) What excites you? (B) Labor leader and civil rights activist Dolores Huerta recommended a life of purpose. “We must use our lives to make the world a better place to live, not just to acquire things,” she said. “That is what we are put on the earth for.” In what ways do you hope to make—or are you already making—an impact? Why? How? (C) Dr. Seuss, aka Theodor Geisel of Dartmouth’s Class of 1925, wrote, “Think and wonder. Wonder and think.” As you wonder and think, what’s on your mind? (D) Celebrate your nerdy side. (E) “It’s not easy being green…” was the frequent refrain of Kermit the Frog. How has difference been a part of your life, and how have you embraced it as part of your identity, outlook, or sense of purpose? (F) As noted in the College’s alma mater, “the still north” wins our hearts and “lures us ever.” In what ways has a place, or places, informed who you are today? (250 words)' },
  ],

  brown: [
    { id: 'brown-1', title: 'Open Curriculum', description: 'Brown’s Open Curriculum allows students to explore broadly while also diving deeply into their academic pursuits. Tell us about any academic interests that excite you, and how you might pursue them at Brown. (200-250 words)' },
    { id: 'brown-2', title: 'Growing Up / Contribution', description: 'Students entering Brown often find that making their home on College Hill naturally invites reflection on where they came from. Share how an aspect of your growing up has inspired or challenged you, and what unique contributions this might allow you to make to the Brown community. (200-250 words)' },
    { id: 'brown-3', title: 'Joy', description: 'Brown students care deeply about their work and the world around them. Students find contentment, satisfaction, and meaning in daily interactions and major discoveries. Whether big or small, mundane or spectacular, tell us about something that brings you joy. (200-250 words)' },
    { id: 'brown-4', title: 'Short Answer: Three Words', description: 'What three words best describe you? (3 words)' },
    { id: 'brown-5', title: 'Short Answer: Teach a Class', description: 'If you could teach a class on any one thing, whether academic or otherwise, what would it be? (100 words)' },
    { id: 'brown-6', title: 'Short Answer: Why Brown (One Sentence)', description: 'In one sentence, Why Brown? (50 words)' },
  ],

  vanderbilt: [
    { id: 'vanderbilt-1', title: 'Dare to Grow', description: 'Vanderbilt University’s motto, Crescere aude, is Latin for “dare to grow.” In your response, reflect on how one or more aspects of your identity, culture, or background has played a role in your personal growth, and how it will contribute to our campus community as you dare to grow at Vanderbilt. (Approximately 250 words)' },
  ],

  rice: [
    { id: 'rice-1', title: 'Why This Major', description: 'Please explain why you wish to study the academic areas you selected. (150 words)' },
    { id: 'rice-2', title: 'Why Rice', description: 'Based upon your exploration of Rice University, what elements of the Rice experience appeal to you? (150 words)' },
    { id: 'rice-3', title: 'Residential College / Perspectives (Choose One)', description: 'Respond to ONE of the following (500 words): (a) The Residential College System is at the heart of Rice student life and is heavily influenced by the particular cultural traditions and unique life experiences each student brings. What life experiences and/or unique perspectives are you looking forward to sharing with fellow Owls in the residential college system? (b) Rice is strengthened by its diverse community of learning and discovery that produces leaders and change agents across the spectrum of human endeavor. What perspectives shaped by your background, experiences, upbringing, and/or cultural identity inspire you to join our community of change agents at Rice? (500 words)' },
    { id: 'rice-4', title: 'The Box', description: 'In keeping with Rice’s long-standing tradition, please share an image of something that appeals to you. (Upload a single two-dimensional image; “The Box” is not formally evaluated.) (Image upload)' },
  ],

  wustl: [
    { id: 'wustl-1', title: 'Why This Major (Required)', description: 'Please tell us what you are interested in studying at college and why. Undergraduate students in Arts & Sciences, Engineering, or Business can pursue study across the university’s academic divisions; feel free to share how your interests align with our approach to education. (200 words; some sources list up to 250)' },
    { id: 'wustl-2', title: 'Optional: In St. Louis, For St. Louis', description: 'WashU supports engagement in the St. Louis community by considering the university as “In St. Louis, For St. Louis.” What is a community you are a part of and your place or impact within it? (Optional; 250 words)' },
    { id: 'wustl-3', title: 'Optional: By Name & Story', description: 'WashU strives to know every undergraduate student “By Name & Story.” How have your life experiences shaped your story? (Optional; 250 words)' },
  ],

  cornell: [
    { id: 'cornell-1', title: 'Community (Required, All Applicants)', description: 'We all contribute to, and are influenced by, the communities that are meaningful to us. Share how you’ve been shaped by one of the communities you belong to. Define community in the way that is most meaningful to you. Some examples of community you might choose from are: family, school, shared interest, virtual, local, global, cultural. (350 words)' },
    { id: 'cornell-2', title: 'College/Major-Specific (Required)', description: 'In addition to the required community essay, you must respond to the essay prompt(s) for the specific Cornell undergraduate college/school to which you are applying. Prompts and word limits vary by college (e.g., CALS: Why are you drawn to studying the major you have selected and specifically, why do you want to pursue this major at Cornell CALS? – 500 words; College of Human Ecology – 600 words; SC Johnson College of Business; College of Architecture, Art, and Planning; College of Engineering has two long + several short essays; College of Arts & Sciences; Brooks School of Public Policy; ILR School). VERIFY the exact prompt and word limit for the student’s target college. (Varies by college; ~350-650 words)' },
  ],

  ucla: [
    { id: 'ucla-1', title: 'UC PIQ 1: Leadership', description: 'UC Personal Insight Questions — respond to ANY 4 of the following 8, 350 words each. (1) Describe an example of your leadership experience in which you have positively influenced others, helped resolve disputes, or contributed to group efforts over time. (350 words)' },
    { id: 'ucla-2', title: 'UC PIQ 2: Creativity', description: 'Every person has a creative side, and it can be expressed in many ways: problem solving, original and innovative thinking, and artistically, to name a few. Describe how you express your creative side. (350 words)' },
    { id: 'ucla-3', title: 'UC PIQ 3: Talent/Skill', description: 'What would you say is your greatest talent or skill? How have you developed and demonstrated that talent over time? (350 words)' },
    { id: 'ucla-4', title: 'UC PIQ 4: Educational Opportunity/Barrier', description: 'Describe how you have taken advantage of a significant educational opportunity or worked to overcome an educational barrier you have faced. (350 words)' },
    { id: 'ucla-5', title: 'UC PIQ 5: Challenge', description: 'Describe the most significant challenge you have faced and the steps you have taken to overcome this challenge. How has this challenge affected your academic achievement? (350 words)' },
    { id: 'ucla-6', title: 'UC PIQ 6: Academic Subject', description: 'Think about an academic subject that inspires you. Describe how you have furthered this interest inside and/or outside of the classroom. (350 words)' },
    { id: 'ucla-7', title: 'UC PIQ 7: Community', description: 'What have you done to make your school or your community a better place? (350 words)' },
    { id: 'ucla-8', title: 'UC PIQ 8: Standout Candidate', description: 'Beyond what has already been shared in your application, what do you believe makes you a strong candidate for admission to the University of California? (350 words)' },
  ],

  ucberkeley: [
    { id: 'ucberkeley-1', title: 'UC PIQ 1: Leadership', description: 'UC Personal Insight Questions — respond to ANY 4 of the following 8, 350 words each. (1) Describe an example of your leadership experience in which you have positively influenced others, helped resolve disputes, or contributed to group efforts over time. (350 words)' },
    { id: 'ucberkeley-2', title: 'UC PIQ 2: Creativity', description: 'Every person has a creative side, and it can be expressed in many ways: problem solving, original and innovative thinking, and artistically, to name a few. Describe how you express your creative side. (350 words)' },
    { id: 'ucberkeley-3', title: 'UC PIQ 3: Talent/Skill', description: 'What would you say is your greatest talent or skill? How have you developed and demonstrated that talent over time? (350 words)' },
    { id: 'ucberkeley-4', title: 'UC PIQ 4: Educational Opportunity/Barrier', description: 'Describe how you have taken advantage of a significant educational opportunity or worked to overcome an educational barrier you have faced. (350 words)' },
    { id: 'ucberkeley-5', title: 'UC PIQ 5: Challenge', description: 'Describe the most significant challenge you have faced and the steps you have taken to overcome this challenge. How has this challenge affected your academic achievement? (350 words)' },
    { id: 'ucberkeley-6', title: 'UC PIQ 6: Academic Subject', description: 'Think about an academic subject that inspires you. Describe how you have furthered this interest inside and/or outside of the classroom. (350 words)' },
    { id: 'ucberkeley-7', title: 'UC PIQ 7: Community', description: 'What have you done to make your school or your community a better place? (350 words)' },
    { id: 'ucberkeley-8', title: 'UC PIQ 8: Standout Candidate', description: 'Beyond what has already been shared in your application, what do you believe makes you a strong candidate for admission to the University of California? (350 words)' },
  ],

  ucsd: [
    { id: 'ucsd-1', title: 'UC PIQ 1: Leadership', description: 'UC Personal Insight Questions — respond to ANY 4 of the following 8, 350 words each. (1) Describe an example of your leadership experience in which you have positively influenced others, helped resolve disputes, or contributed to group efforts over time. (350 words)' },
    { id: 'ucsd-2', title: 'UC PIQ 2: Creativity', description: 'Every person has a creative side, and it can be expressed in many ways: problem solving, original and innovative thinking, and artistically, to name a few. Describe how you express your creative side. (350 words)' },
    { id: 'ucsd-3', title: 'UC PIQ 3: Talent/Skill', description: 'What would you say is your greatest talent or skill? How have you developed and demonstrated that talent over time? (350 words)' },
    { id: 'ucsd-4', title: 'UC PIQ 4: Educational Opportunity/Barrier', description: 'Describe how you have taken advantage of a significant educational opportunity or worked to overcome an educational barrier you have faced. (350 words)' },
    { id: 'ucsd-5', title: 'UC PIQ 5: Challenge', description: 'Describe the most significant challenge you have faced and the steps you have taken to overcome this challenge. How has this challenge affected your academic achievement? (350 words)' },
    { id: 'ucsd-6', title: 'UC PIQ 6: Academic Subject', description: 'Think about an academic subject that inspires you. Describe how you have furthered this interest inside and/or outside of the classroom. (350 words)' },
    { id: 'ucsd-7', title: 'UC PIQ 7: Community', description: 'What have you done to make your school or your community a better place? (350 words)' },
    { id: 'ucsd-8', title: 'UC PIQ 8: Standout Candidate', description: 'Beyond what has already been shared in your application, what do you believe makes you a strong candidate for admission to the University of California? (350 words)' },
  ],

  uci: [
    { id: 'uci-1', title: 'UC PIQ 1: Leadership', description: 'UC Personal Insight Questions — respond to ANY 4 of the following 8, 350 words each. (1) Describe an example of your leadership experience in which you have positively influenced others, helped resolve disputes, or contributed to group efforts over time. (350 words)' },
    { id: 'uci-2', title: 'UC PIQ 2: Creativity', description: 'Every person has a creative side, and it can be expressed in many ways: problem solving, original and innovative thinking, and artistically, to name a few. Describe how you express your creative side. (350 words)' },
    { id: 'uci-3', title: 'UC PIQ 3: Talent/Skill', description: 'What would you say is your greatest talent or skill? How have you developed and demonstrated that talent over time? (350 words)' },
    { id: 'uci-4', title: 'UC PIQ 4: Educational Opportunity/Barrier', description: 'Describe how you have taken advantage of a significant educational opportunity or worked to overcome an educational barrier you have faced. (350 words)' },
    { id: 'uci-5', title: 'UC PIQ 5: Challenge', description: 'Describe the most significant challenge you have faced and the steps you have taken to overcome this challenge. How has this challenge affected your academic achievement? (350 words)' },
    { id: 'uci-6', title: 'UC PIQ 6: Academic Subject', description: 'Think about an academic subject that inspires you. Describe how you have furthered this interest inside and/or outside of the classroom. (350 words)' },
    { id: 'uci-7', title: 'UC PIQ 7: Community', description: 'What have you done to make your school or your community a better place? (350 words)' },
    { id: 'uci-8', title: 'UC PIQ 8: Standout Candidate', description: 'Beyond what has already been shared in your application, what do you believe makes you a strong candidate for admission to the University of California? (350 words)' },
  ],

  ucdavis: [
    { id: 'ucdavis-1', title: 'UC PIQ 1: Leadership', description: 'UC Personal Insight Questions — respond to ANY 4 of the following 8, 350 words each. (1) Describe an example of your leadership experience in which you have positively influenced others, helped resolve disputes, or contributed to group efforts over time. (350 words)' },
    { id: 'ucdavis-2', title: 'UC PIQ 2: Creativity', description: 'Every person has a creative side, and it can be expressed in many ways: problem solving, original and innovative thinking, and artistically, to name a few. Describe how you express your creative side. (350 words)' },
    { id: 'ucdavis-3', title: 'UC PIQ 3: Talent/Skill', description: 'What would you say is your greatest talent or skill? How have you developed and demonstrated that talent over time? (350 words)' },
    { id: 'ucdavis-4', title: 'UC PIQ 4: Educational Opportunity/Barrier', description: 'Describe how you have taken advantage of a significant educational opportunity or worked to overcome an educational barrier you have faced. (350 words)' },
    { id: 'ucdavis-5', title: 'UC PIQ 5: Challenge', description: 'Describe the most significant challenge you have faced and the steps you have taken to overcome this challenge. How has this challenge affected your academic achievement? (350 words)' },
    { id: 'ucdavis-6', title: 'UC PIQ 6: Academic Subject', description: 'Think about an academic subject that inspires you. Describe how you have furthered this interest inside and/or outside of the classroom. (350 words)' },
    { id: 'ucdavis-7', title: 'UC PIQ 7: Community', description: 'What have you done to make your school or your community a better place? (350 words)' },
    { id: 'ucdavis-8', title: 'UC PIQ 8: Standout Candidate', description: 'Beyond what has already been shared in your application, what do you believe makes you a strong candidate for admission to the University of California? (350 words)' },
  ],

  wwu: [
    { id: 'wwu-1', title: 'Optional: Interests & Goals', description: 'NOTE: Western Washington University does NOT require a supplemental essay for first-year applicants; an essay is optional and recommended. WWU invites applicants to share an essay of roughly 300-500 words describing their goals, interests, and any challenges they have overcome. (Optional; ~300-500 words) — LOWER CONFIDENCE on exact first-year wording; confirm at admissions.wwu.edu.' },
  ],

  georgiatech: [
    { id: 'georgiatech-1', title: 'Why This Major at Georgia Tech', description: 'Why do you want to study your chosen major specifically at Georgia Tech, and how do you think that will prepare you to make an impact in the world? (300 words)' },
  ],

  nyu: [
    { id: 'nyu-1', title: 'Bridge Builder (Optional; Choose One Sub-Prompt)', description: 'In a world where disconnection seems to often prevail, we are looking for students who embody the qualities of bridge builders—students who can connect people, groups, and ideas to span divides, foster understanding, and promote collaboration within a dynamic, interconnected, and vibrant global academic community. Choose ONE of the following (optional; 250 words): (1) Tell us about a time you encountered a perspective different from your own. What did you learn—about yourself, the other person, or the world? (2) Tell us about an experience you’ve had working with others who have different backgrounds or perspectives. What challenges did your group face? Did you overcome them, and if so, how? What role did you try to play in helping people to work together, and what did you learn from your efforts? (3) Tell us about someone you’ve observed who does a particularly good job helping people think or work together. How does this person set the stage for common exploration or work? How do they react when difficulties or dissensions arise? (Optional; 250 words)' },
  ],

  usc: [
    { id: 'usc-1', title: 'Why This Major (Required)', description: 'Describe how you plan to pursue your academic interests and why you want to explore them at USC specifically. Please feel free to address your first- and second-choice major selections. (250 words)' },
    { id: 'usc-2', title: 'Short Answer: Three Words', description: 'Describe yourself in three words. (25 characters each)' },
    { id: 'usc-3', title: 'Short Answer: Favorite Snack', description: 'What is your favorite snack? (100 characters)' },
    { id: 'usc-4', title: 'Short Answer: Best Movie', description: 'Best movie of all time. (100 characters)' },
    { id: 'usc-5', title: 'Short Answer: Dream Job', description: 'Dream job. (100 characters)' },
    { id: 'usc-6', title: 'Short Answer: Theme Song', description: 'If your life had a theme song, what would it be? (100 characters)' },
    { id: 'usc-7', title: 'Short Answer: Dream Trip', description: 'Dream trip. (100 characters)' },
    { id: 'usc-8', title: 'Short Answer: Next Binge Watch', description: 'What TV show will you binge watch next? (100 characters)' },
    { id: 'usc-9', title: 'Short Answer: Ideal Roommate', description: 'Which well-known person or fictional character would be your ideal roommate? (100 characters)' },
    { id: 'usc-10', title: 'Short Answer: Favorite Book', description: 'Favorite book. (100 characters)' },
    { id: 'usc-11', title: 'Short Answer: Teach a Class', description: 'If you could teach a class on any topic, what would it be? (100 characters)' },
  ],

  georgetown: [
    { id: 'georgetown-1', title: 'Short Essay: Why Georgetown', description: 'Briefly discuss the significance to you of the school or summer activity in which you have been most involved. (Approximately one half page, single-spaced; ~250-300 words)' },
    { id: 'georgetown-2', title: 'Personal/Creative Essay', description: 'As Georgetown is a diverse community, the Admissions Committee would like to know more about you in your own words. Please submit a brief personal or creative essay that you feel best describes you and reflects on your own background, identity, skills, and talents. (Approximately one page, single-spaced; ~500-650 words)' },
    { id: 'georgetown-3', title: 'School-Specific Essay', description: 'Respond to the essay prompt for the specific Georgetown school to which you are applying (approximately one page, single-spaced). Georgetown College (Arts & Sciences): A liberal arts education from the College of Arts & Sciences involves encounters with new concepts and modes of inquiry. Describe something (a class, a book, an event, etc.) that changed your thinking. / Walsh School of Foreign Service: The Walsh School of Foreign Service was founded over a century ago to prepare generations of leaders to solve global problems. What is motivating you to dedicate your undergraduate studies to a future in service to the world? / McDonough School of Business: Please discuss your motivations for studying business at Georgetown. / School of Nursing: Describe the factors that have influenced your interest in studying nursing at Georgetown. / School of Health: Describe the factors that have influenced your interest in studying health care, addressing your intended major (Global Health, Health Care Management & Policy, or Human Science). (~1 page single-spaced)' },
  ],

  notredame: [
    { id: 'notredame-1', title: 'Non-Negotiable (Required)', description: 'Everyone has different priorities when considering their higher education options and building their college or university list. Tell us about your “non-negotiable” factor(s) when searching for your future college home. (150 words)' },
    { id: 'notredame-2', title: 'Why This Major (Required)', description: 'Briefly share what draws you to the area(s) of study you listed. (100 words)' },
    { id: 'notredame-3', title: 'Short Answers (Choose 3)', description: 'Please choose THREE of the following questions; respond to each in 50-100 words: (1) How does faith influence the decisions you make? (2) What is distinctive about your personal experiences and development (e.g., family support, culture, disability, personal background, community)? Why are these experiences important to you and how will you enrich the Notre Dame community? (3) How do you foster service to others in your community? (4) What compliment are you most proud of receiving, and why does it mean so much to you? (5) What would you fight for? (50-100 words each)' },
  ],

  emory: [
    { id: 'emory-1', title: 'Why These Academic Areas (Required)', description: 'What academic areas are you interested in exploring at Emory University and why? (200 words)' },
    { id: 'emory-2', title: 'Getting to Know You (Choose One)', description: 'Answer ONE of the following (150 words): (1) Emory University has a strong commitment to building community. Tell us about a community that you have been part of where your personal participation helped to change or shape the community for the better. (2) Reflect on a personal experience where you intentionally expanded your cultural awareness. (3) Emory University’s unique mission calls for service to humanity. Share how you might personally contribute to this mission of service to humanity. (4) In a scholarly community, differing ideas often collide before they converge. How do you personally navigate disagreement in a way that promotes progress and deepens meaningful dialogue? (150 words)' },
  ],

  uva: [
    { id: 'uva-1', title: 'Nursing Only (No General Supplement)', description: 'NOTE: For 2025-2026, UVA REMOVED its general supplemental essay. There is NO supplemental essay for College of Arts & Sciences, Engineering, Architecture, or Kinesiology applicants. ONLY School of Nursing applicants respond to: Describe a health care-related experience or another significant interaction that deepened your interest in studying nursing. (Nursing applicants only; ~250-300 words)' },
  ],

  cmu: [
    { id: 'cmu-1', title: 'Passion for Major', description: 'Most students choose their intended major or area of study based on a passion or inspiration that’s developed over time – what passion or inspiration led you to choose this area of study? (300 words)' },
    { id: 'cmu-2', title: 'Defining a Successful College Experience', description: 'Many students pursue college for a specific degree, career opportunity or personal goal. Whichever it may be, learning will be critical to achieve your ultimate goal. As you think ahead to the process of learning during your college years, how will you define a successful college experience? (300 words)' },
    { id: 'cmu-3', title: 'What to Emphasize', description: 'Consider your application as a whole. What do you personally want to emphasize about your application for the admission committee’s consideration? Highlight something that’s important to you or something you haven’t had a chance to share. Tell us, don’t show us (no websites please). (300 words)' },
  ],

  umich: [
    { id: 'umich-1', title: 'Leadership & Community', description: 'At the University of Michigan, we are focused on developing leaders and citizens who will challenge the present and enrich the future. In your essay, share with us how you are prepared to contribute to these goals. This could include the people, places, experiences, or aspirations that have shaped your journey and future plans. (100-300 words)' },
    { id: 'umich-2', title: 'Why Michigan', description: 'Describe the unique qualities that attract you to the specific undergraduate College or School (including preferred admission and dual degree programs) to which you are applying at the University of Michigan. How would that curriculum support your interests? (100-550 words)' },
  ],

  unc: [
    { id: 'unc-1', title: 'Personal Quality & Community Impact', description: 'Discuss one of your personal qualities and share a story, anecdote, or memory of how it helped you make a positive impact on a community. This could be your current community or another community you have engaged. (200-250 words)' },
    { id: 'unc-2', title: 'Academic Interest', description: 'Discuss an academic topic that you’re excited to explore and learn more about in college. Why does this topic interest you? Teach us something you’ve learned about the topic through your research or experience. (200-250 words)' },
  ],

  wakeforest: [
    { id: 'wakeforest-1', title: 'Why Wake Forest (Optional)', description: 'NOTE: Wake Forest states applicants may answer any, all, or none of its supplemental questions (all optional). Why have you decided to apply to Wake Forest? Share with us anything that has made you interested in our institution. (Optional; 150 words)' },
    { id: 'wakeforest-2', title: 'Optional: Five Books', description: 'List five books you have read that intrigued you. (Include each book’s title and author and note whether the selection was required or not.) (Optional; short-answer list)' },
    { id: 'wakeforest-3', title: 'Optional: Intellectual Curiosity', description: 'Tell us what piques your intellectual curiosity or has helped you understand the world’s complexity. This can include a work you’ve read, a project you’ve completed for a class, and even co-curricular activities in which you have been involved. (Optional; 150 words)' },
    { id: 'wakeforest-4', title: 'Optional: Maya Angelou Quote', description: 'Dr. Maya Angelou, renowned author, poet, civil-rights activist, and former Wake Forest University Reynolds Professor of American Studies, inspired others to celebrate their identities and to honor each person’s dignity. Choose one of Dr. Angelou’s powerful quotes. How does this quote relate to your lived experience or reflect how you plan to contribute to the Wake Forest community? (Optional; 300 words)' },
    { id: 'wakeforest-5', title: 'Optional: Top Ten List', description: 'Give us your top ten list. (The choice of theme is yours.) (Optional; 100 characters per line)' },
  ],

  uf: [
    { id: 'uf-1', title: 'Most Meaningful Commitment (Required)', description: 'Please provide more details on your most meaningful commitment outside of the classroom while in high school and explain why it was meaningful. This could be related to an extracurricular activity, work, volunteering, an academic activity, family responsibility, or any other non-classroom activity. (250 words)' },
    { id: 'uf-2', title: 'Optional: Additional Information', description: 'Is there any additional information or extenuating circumstances the Admissions Committee should know when reviewing your application? (Optional; fewer than 250 words)' },
  ],

  wisconsin: [
    { id: 'wisconsin-1', title: 'Why Wisconsin & Why Major (Required)', description: 'Tell us why you would like to attend the University of Wisconsin–Madison. In addition, please include why you are interested in studying the major(s) you have selected. If you selected undecided, please describe your areas of possible academic interest. (650 words max; UW-Madison recommends ~300-500 words)' },
    { id: 'wisconsin-2', title: 'What You Bring (Universities of Wisconsin app only)', description: 'NOTE: This second prompt appears only on the Universities of Wisconsin system application (NOT the Common App). Common App applicants answer only the first prompt. Each student is unique. Please tell us about the particular life experiences, talents, commitments, and/or interests you will bring to our campus. (650 words max)' },
  ],

  purdue: [
    { id: 'purdue-1', title: 'Opportunities at Purdue', description: 'How will opportunities at Purdue support your interests, both in and out of the classroom? (250 words)' },
    { id: 'purdue-2', title: 'Why This Major', description: 'Briefly discuss your reasons for pursuing the major you have selected. (250 words)' },
    { id: 'purdue-3', title: 'Alternate Major / Campus', description: 'If you’ve selected an alternate major (and/or a campus location, Indianapolis or West Lafayette), briefly discuss your reasons for pursuing that alternate. (250 words)' },
  ],

  osu: [
    { id: 'osu-1', title: 'No Required Supplement (Optional Scholarship Essay)', description: 'NOTE: The Ohio State University does NOT require a supplemental essay for general first-year applicants on the Common App. The only essay is for the Morrill Scholars Program (a merit scholarship with eligibility restrictions — U.S. citizens/permanent residents applying to the Columbus campus). Morrill prompt: In what ways have your life experiences and/or endeavors prepared you to be an active Morrill Scholar who will champion OSU’s Shared Values while investing in a culture of service reflective of our land-grant mission? (Optional / scholarship only; 350-500 words)' },
  ],
};

// ============================================================================
// Common App personal statement (the 7 official 2025-2026 prompts, unchanged):
// ============================================================================
export const commonAppPrompts: EssayPrompt[] = [
  { id: 'common-1', title: 'Background/Identity', description: 'Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story. (650 words)' },
  { id: 'common-2', title: 'Challenge/Setback/Failure', description: 'The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience? (650 words)' },
  { id: 'common-3', title: 'Questioning a Belief', description: 'Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome? (650 words)' },
  { id: 'common-4', title: 'Gratitude', description: 'Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you? (650 words)' },
  { id: 'common-5', title: 'Personal Growth', description: 'Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others. (650 words)' },
  { id: 'common-6', title: 'Engaging Topic', description: 'Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more? (650 words)' },
  { id: 'common-7', title: 'Topic of Your Choice', description: 'Share an essay on any topic of your choice. It can be one you’ve already written, one that responds to a different prompt, or one of your own design. (650 words)' },
];
