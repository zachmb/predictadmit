// src/lib/config/admitMail.ts

export type PortalEmail = {
  name: string;
  slug: string;
  from: string;
  subject: string;
  received: string; // raw seed value, not shown directly
};

export type SentEmail = {
  id: string;
  to: string;
  subject: string;
  sent: string;
  preview: string;
  body: string;
};

export type ApplicationPhase = 'idle' | 'commonapp' | 'fee' | 'transcript' | 'act' | 'finished';

export type PersistedState = {
  hasApplied: boolean;
  hasSavedProfile: boolean;
  calendarIndex: number;
  applicationPhase: ApplicationPhase;
  edChoiceSlug: string;
  currentEdSlug: string | null;
  edEmailMustBeViewed: boolean;
  hasViewedEdEmail: boolean;
  edEmailRevealed: boolean;
  rdTimelineStarted: boolean;
  visiblePortalSlugs: string[];
  readPortalSlugs: string[];
};

export const ED_DATE_LABEL = 'Dec 15, 2025';
export const RD_DATE_LABEL = 'Mar 20, 2026';

export const calendarDates = [
  'Aug 1, 2025',
  'Aug 15, 2025',
  'Sep 1, 2025',
  'Sep 15, 2025',
  'Oct 1, 2025',
  'Oct 15, 2025',
  'Nov 1, 2025',
  'Nov 15, 2025',
  'Dec 1, 2025',
  'Dec 15, 2025',
  'Jan 1, 2026',
  'Feb 1, 2026',
  'Mar 1, 2026',
  'Mar 20, 2026'
];

export const portals: PortalEmail[] = [
  {
    name: 'Harvard University',
    slug: 'harvard',
    from: 'Harvard College Admissions <admissions@fas.harvard.edu>',
    subject: 'Your Harvard application status is now available',
    received: 'Dec 15, 2025, 4:05 PM'
  },
  {
    name: 'Stanford University',
    slug: 'stanford',
    from: 'Stanford Undergraduate Admission <admission@stanford.edu>',
    subject: 'Status update in your Stanford application portal',
    received: 'Dec 15, 2025, 4:07 PM'
  },
  {
    name: 'Massachusetts Institute of Technology',
    slug: 'mit',
    from: 'MIT Admissions <admissions@mit.edu>',
    subject: 'A new update has been posted to your MIT account',
    received: 'Dec 15, 2025, 4:09 PM'
  },
  {
    name: 'Princeton University',
    slug: 'princeton',
    from: 'Princeton University Admission <uaoffice@princeton.edu>',
    subject: 'Princeton admission status update available',
    received: 'Dec 15, 2025, 4:11 PM'
  },
  {
    name: 'Yale University',
    slug: 'yale',
    from: 'Yale College Undergraduate Admissions <admissions@yale.edu>',
    subject: 'Yale application status notification',
    received: 'Dec 15, 2025, 4:13 PM'
  },
  {
    name: 'Columbia University',
    slug: 'columbia',
    from: 'Columbia Undergraduate Admissions <ugrad-ask@columbia.edu>',
    subject: 'Columbia application portal status update',
    received: 'Dec 15, 2025, 4:15 PM'
  },
  {
    name: 'University of Chicago',
    slug: 'uchicago',
    from: 'UChicago College Admissions <collegeadmissions@uchicago.edu>',
    subject: 'Your University of Chicago decision is ready',
    received: 'Dec 15, 2025, 4:17 PM'
  },
  {
    name: 'University of Pennsylvania (Wharton)',
    slug: 'upenn',
    from: 'Penn Undergraduate Admissions <info@admissions.upenn.edu>',
    subject: 'Important update to your Penn applicant portal',
    received: 'Dec 15, 2025, 4:19 PM'
  },
  {
    name: 'California Institute of Technology',
    slug: 'caltech',
    from: 'Caltech Undergraduate Admissions <ugadmissions@caltech.edu>',
    subject: 'Caltech admission portal status update',
    received: 'Dec 15, 2025, 4:21 PM'
  },
  {
    name: 'Duke University',
    slug: 'duke',
    from: 'Duke Undergraduate Admissions <undergrad-admissions@duke.edu>',
    subject: 'Duke application status update now available',
    received: 'Dec 15, 2025, 4:23 PM'
  },
  {
    name: 'Johns Hopkins University',
    slug: 'jhu',
    from: 'JHU Office of Undergraduate Admissions <applyhelp@jhu.edu>',
    subject: 'Johns Hopkins decision available in your portal',
    received: 'Dec 15, 2025, 4:25 PM'
  },
  {
    name: 'Northwestern University',
    slug: 'northwestern',
    from: 'Northwestern Undergraduate Admission <ug-admission@northwestern.edu>',
    subject: 'Status update to your Northwestern application',
    received: 'Dec 15, 2025, 4:27 PM'
  },
  {
    name: 'Dartmouth College',
    slug: 'dartmouth',
    from: 'Dartmouth Undergraduate Admissions <admissions@dartmouth.edu>',
    subject: 'Dartmouth application portal status update',
    received: 'Dec 15, 2025, 4:29 PM'
  },
  {
    name: 'Brown University',
    slug: 'brown',
    from: 'Brown University Admission <admission@brown.edu>',
    subject: 'New Brown University admission status available',
    received: 'Dec 15, 2025, 4:31 PM'
  },
  {
    name: 'Vanderbilt University',
    slug: 'vanderbilt',
    from: 'Vanderbilt Undergraduate Admissions <admissions@vanderbilt.edu>',
    subject: 'Vanderbilt application decision posted',
    received: 'Dec 15, 2025, 4:33 PM'
  },
  {
    name: 'Rice University',
    slug: 'rice',
    from: 'Rice University Admission <admission@rice.edu>',
    subject: 'Rice University admission status in your portal',
    received: 'Dec 15, 2025, 4:35 PM'
  },
  {
    name: 'Washington University in St. Louis',
    slug: 'wustl',
    from: 'WashU Undergraduate Admissions <admissions@wustl.edu>',
    subject: 'Washington University application status update',
    received: 'Dec 15, 2025, 4:37 PM'
  },
  {
    name: 'Cornell University',
    slug: 'cornell',
    from: 'Cornell Undergraduate Admissions <admissions@cornell.edu>',
    subject: 'Cornell decision available in your applicant portal',
    received: 'Dec 15, 2025, 4:39 PM'
  },
  {
    name: 'University of California, Los Angeles',
    slug: 'ucla',
    from: 'UCLA Undergraduate Admission <ugadm@admission.ucla.edu>',
    subject: 'UCLA admission decision has been posted',
    received: 'Mar 20, 2026, 5:01 PM'
  },
  {
    name: 'University of California, Berkeley',
    slug: 'ucberkeley',
    from: 'UC Berkeley Office of Undergraduate Admissions <admissions@berkeley.edu>',
    subject: 'Berkeley application status notification',
    received: 'Mar 20, 2026, 5:03 PM'
  }
];

export const sentEmails: SentEmail[] = [
  {
    id: '1',
    to: 'Harvard College Admissions <admissions@fas.harvard.edu>',
    subject: 'Re: Application status (accidental reply-all)',
    sent: 'Dec 10, 2025, 11:42 PM',
    preview:
      'Hi, just checking if my application looks okay, I promise I’m not refreshing every 5 seconds...',
    body: `Hi,

I meant to send this to my friend, not to the admissions office (oops).

I just wanted to say that I'm really excited about Harvard
and totally not refreshing the portal every 5 seconds. Definitely not.
Please ignore this message if it actually reached you.

Best,
ChatGPT, who can't make a succesful joke email :(`
  },
  {
    id: '2',
    to: 'Stanford Undergraduate Admission <admission@stanford.edu>',
    subject: 'Follow-up on typo in my essay',
    sent: 'Dec 8, 2025, 9:17 PM',
    preview:
      'I wrote “I love staying up late debugging bugs” instead of “debugging code”...',
    body: `Hello Stanford Admission,

In my application essay, I accidentally wrote that I "love staying up late debugging bugs"
instead of "debugging code." While both are technically true, I just wanted to clarify
that I meant the software variety.

Thank you for understanding,
Applicant`
  },
  {
    id: '3',
    to: 'LoopLess Team <crew@looplessapp.com>',
    subject: 'Internship application',
    sent: 'Dec 5, 2025, 4:02 PM',
    preview: 'Dear LoopLess team, I would love to join you.',
    body: `Hey team,

I love your science based screen time reduction app. Your team from Apple, OpenAI, and Fermilab is crazy!

I know you are hiring high school interns for:

- organic marketing (where multiple high schoolers have gotten MILLIONS of views)
- science research (researching cognitive-behavioral therapy under ur ex-Fermilab team, designing features that make it to the app)
- software engineering (building features used by LOTS of people)

love, me :>`
  }
];
