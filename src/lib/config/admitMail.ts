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
	},
	{
		name: 'Western Washington University',
		slug: 'wwu',
		from: 'WWU Admissions <admissions@wwu.edu>',
		subject: 'Western Washington University admission portal update',
		received: 'Mar 20, 2026, 5:05 PM'
	},
	{
		name: 'Georgia Institute of Technology',
		slug: 'georgiatech',
		from: 'Georgia Tech Admission <admission@gatech.edu>',
		subject: 'A decision has been posted to your Georgia Tech status page',
		received: 'Mar 20, 2026, 5:07 PM'
	},
	{
		name: 'New York University',
		slug: 'nyu',
		from: 'NYU Admissions <admissions@nyu.edu>',
		subject: 'Your NYU application decision is now available',
		received: 'Mar 20, 2026, 5:09 PM'
	},
	{
		name: 'University of Southern California',
		slug: 'usc',
		from: 'USC Undergraduate Admission <admission@usc.edu>',
		subject: 'Your USC admission decision is available in your portal',
		received: 'Mar 20, 2026, 5:11 PM'
	},
	{
		name: 'Georgetown University',
		slug: 'georgetown',
		from: 'Georgetown Admissions <undergraduate@georgetown.edu>',
		subject: 'Your Georgetown application status has been updated',
		received: 'Mar 20, 2026, 5:13 PM'
	},
	{
		name: 'University of Notre Dame',
		slug: 'notredame',
		from: 'Notre Dame Admissions <admissions@nd.edu>',
		subject: 'A decision has been posted to your Notre Dame portal',
		received: 'Mar 20, 2026, 5:15 PM'
	},
	{
		name: 'Emory University',
		slug: 'emory',
		from: 'Emory Admission <admission@emory.edu>',
		subject: 'Your Emory admission decision is now available',
		received: 'Mar 20, 2026, 5:17 PM'
	},
	{
		name: 'University of Virginia',
		slug: 'uva',
		from: 'UVA Admission <undergradadmission@virginia.edu>',
		subject: 'Your UVA admission decision is available in MyUVA',
		received: 'Mar 20, 2026, 5:19 PM'
	},
	{
		name: 'Carnegie Mellon University',
		slug: 'cmu',
		from: 'Carnegie Mellon Admission <undergraduate-admissions@andrew.cmu.edu>',
		subject: 'Your Carnegie Mellon admission decision is now available',
		received: 'Mar 20, 2026, 5:21 PM'
	},
	{
		name: 'University of Michigan',
		slug: 'umich',
		from: 'U-M Admissions <admissions@umich.edu>',
		subject: 'Your University of Michigan decision is now available',
		received: 'Mar 20, 2026, 5:23 PM'
	},
	{
		name: 'University of North Carolina at Chapel Hill',
		slug: 'unc',
		from: 'UNC Admissions <admissions@unc.edu>',
		subject: 'A decision has been posted to your UNC portal',
		received: 'Mar 20, 2026, 5:25 PM'
	},
	{
		name: 'University of California, San Diego',
		slug: 'ucsd',
		from: 'UC San Diego Admissions <admissions@ucsd.edu>',
		subject: 'Your UC San Diego admission decision is now available',
		received: 'Mar 20, 2026, 5:27 PM'
	},
	{
		name: 'University of California, Irvine',
		slug: 'uci',
		from: 'UC Irvine Admissions <admissions@uci.edu>',
		subject: 'Your UC Irvine admission decision is now available',
		received: 'Mar 20, 2026, 5:29 PM'
	},
	{
		name: 'University of California, Davis',
		slug: 'ucdavis',
		from: 'UC Davis Admissions <undergraduateadmissions@ucdavis.edu>',
		subject: 'Your UC Davis admission decision is now available',
		received: 'Mar 20, 2026, 5:31 PM'
	},
	{
		name: 'Wake Forest University',
		slug: 'wakeforest',
		from: 'Wake Forest Admissions <admissions@wfu.edu>',
		subject: 'Your Wake Forest admission decision is now available',
		received: 'Mar 20, 2026, 5:33 PM'
	},
	{
		name: 'University of Florida',
		slug: 'uf',
		from: 'UF Admissions <freshman@admissions.ufl.edu>',
		subject: 'Your University of Florida admission decision is available',
		received: 'Mar 20, 2026, 5:35 PM'
	},
	{
		name: 'University of Illinois Urbana-Champaign',
		slug: 'uiuc',
		from: 'Illinois Admissions <admissions@illinois.edu>',
		subject: 'Your University of Illinois admission decision is available',
		received: 'Mar 20, 2026, 5:37 PM'
	},
	{
		name: 'University of Wisconsin-Madison',
		slug: 'wisconsin',
		from: 'UW-Madison Admissions <onwisconsin@admissions.wisc.edu>',
		subject: 'Your UW-Madison admission decision is now available',
		received: 'Mar 20, 2026, 5:39 PM'
	},
	{
		name: 'Purdue University',
		slug: 'purdue',
		from: 'Purdue Admissions <admissions@purdue.edu>',
		subject: 'Your Purdue admission decision is now available',
		received: 'Mar 20, 2026, 5:41 PM'
	},
	{
		name: 'The Ohio State University',
		slug: 'osu',
		from: 'Ohio State Admissions <askabuckeye@osu.edu>',
		subject: 'Your Ohio State admission decision is now available',
		received: 'Mar 20, 2026, 5:43 PM'
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
		preview: 'I wrote “I love staying up late debugging bugs” instead of “debugging code”...',
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
