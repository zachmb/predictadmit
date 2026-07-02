// src/lib/config/communityProfiles.ts
// Seed corpus for the Community "Past Admits" view. Realistic but fictional
// composite profiles. Real, consented contributions (via /api/contribute) are
// layered on top of these in the UI.

export type AdmitResult = { school: string; slug?: string; outcome: 'admit' | 'deny' | 'waitlist' };

export type CommunityProfile = {
	id: string;
	handle: string; // anonymized display handle
	gradYear: number;
	major: string;
	state: string;
	gpaWeighted: number;
	gpaUnweighted: number;
	sat?: number;
	act?: number;
	hook: string; // one-line "what made them stand out"
	activities: string[];
	awards: string[];
	results: AdmitResult[];
	seed?: boolean;
};

export const communityProfiles: CommunityProfile[] = [
	{
		id: 'seed-1', handle: 'FutureCardiologist', gradYear: 2026, major: 'Biology / Pre-med', state: 'CA',
		gpaWeighted: 4.62, gpaUnweighted: 3.98, sat: 1560,
		hook: 'Founded a free clinic-navigation nonprofit; 12 AP courses.',
		activities: ['Founder, immigrant health-access nonprofit (2k users)', 'Varsity cross country captain', 'Hospital volunteer, 400+ hrs', 'Bio research at state university'],
		awards: ['National Merit Finalist', 'Congressional App Challenge winner', 'AP Scholar with Distinction'],
		results: [
			{ school: 'Stanford University', slug: 'stanford', outcome: 'admit' },
			{ school: 'Harvard College', slug: 'harvard', outcome: 'waitlist' },
			{ school: 'UCLA', slug: 'ucla', outcome: 'admit' },
			{ school: 'UC Berkeley', slug: 'ucberkeley', outcome: 'admit' },
			{ school: 'Johns Hopkins University', slug: 'jhu', outcome: 'admit' }
		], seed: true
	},
	{
		id: 'seed-2', handle: 'QuietCoder', gradYear: 2026, major: 'Computer Science', state: 'WA',
		gpaWeighted: 4.35, gpaUnweighted: 3.9, sat: 1540,
		hook: 'Shipped an app with 50k downloads; USACO Platinum.',
		activities: ['Solo iOS dev, 50k downloads', 'USACO Platinum', 'CS club president', 'Part-time software internship'],
		awards: ['USACO Platinum', 'Regional hackathon 1st place'],
		results: [
			{ school: 'Massachusetts Institute of Technology', slug: 'mit', outcome: 'deny' },
			{ school: 'Carnegie Mellon University', slug: 'cmu', outcome: 'admit' },
			{ school: 'Georgia Institute of Technology', slug: 'georgiatech', outcome: 'admit' },
			{ school: 'University of Washington', slug: 'uw', outcome: 'admit' },
			{ school: 'University of Illinois Urbana-Champaign', slug: 'uiuc', outcome: 'admit' }
		], seed: true
	},
	{
		id: 'seed-3', handle: 'DebateChampGA', gradYear: 2025, major: 'Political Science', state: 'GA',
		gpaWeighted: 4.5, gpaUnweighted: 3.95, act: 35,
		hook: 'Nationally ranked debater; interned for a US Senator.',
		activities: ['#3 nationally, policy debate', 'Senate office intern', 'Founder, civics podcast', 'Model UN secretary-general'],
		awards: ['NSDA National Finalist', 'State debate champion'],
		results: [
			{ school: 'Georgetown University', slug: 'georgetown', outcome: 'admit' },
			{ school: 'Duke University', slug: 'duke', outcome: 'admit' },
			{ school: 'Princeton University', slug: 'princeton', outcome: 'deny' },
			{ school: 'University of Virginia', slug: 'uva', outcome: 'admit' },
			{ school: 'Emory University', slug: 'emory', outcome: 'admit' }
		], seed: true
	},
	{
		id: 'seed-4', handle: 'FirstGenBuilder', gradYear: 2026, major: 'Mechanical Engineering', state: 'TX',
		gpaWeighted: 4.1, gpaUnweighted: 3.85, sat: 1450,
		hook: 'First-gen; built solar water-heaters for rural homes.',
		activities: ['Robotics team lead', 'Solar nonprofit founder', 'Works 20 hrs/wk at family business', 'FIRST Robotics regional finalist'],
		awards: ['FIRST Dean’s List semifinalist', 'Coca-Cola Scholar semifinalist'],
		results: [
			{ school: 'University of Texas at Austin', slug: 'texas', outcome: 'admit' },
			{ school: 'Rice University', slug: 'rice', outcome: 'admit' },
			{ school: 'Purdue University', slug: 'purdue', outcome: 'admit' },
			{ school: 'Massachusetts Institute of Technology', slug: 'mit', outcome: 'waitlist' }
		], seed: true
	},
	{
		id: 'seed-5', handle: 'MuseumKid', gradYear: 2025, major: 'Art History', state: 'NY',
		gpaWeighted: 4.3, gpaUnweighted: 3.92, sat: 1500,
		hook: 'Curated a youth exhibit at a city museum; published essays.',
		activities: ['Youth curator, city museum', 'Literary magazine editor-in-chief', 'Art teacher for kids', 'Published in teen lit journals'],
		awards: ['Scholastic Art & Writing Gold Medal', 'YoungArts Finalist'],
		results: [
			{ school: 'Yale College', slug: 'yale', outcome: 'admit' },
			{ school: 'Brown University', slug: 'brown', outcome: 'admit' },
			{ school: 'Columbia University', slug: 'columbia', outcome: 'waitlist' },
			{ school: 'New York University', slug: 'nyu', outcome: 'admit' }
		], seed: true
	},
	{
		id: 'seed-6', handle: 'MathOlympian', gradYear: 2026, major: 'Mathematics', state: 'IL',
		gpaWeighted: 4.7, gpaUnweighted: 4.0, sat: 1580,
		hook: 'USAMO qualifier; original research in combinatorics.',
		activities: ['USAMO qualifier', 'Math circle founder', 'Research at university REU', 'Tutors low-income students'],
		awards: ['USAMO qualifier', 'AIME 13', 'Regeneron STS semifinalist'],
		results: [
			{ school: 'Massachusetts Institute of Technology', slug: 'mit', outcome: 'admit' },
			{ school: 'California Institute of Technology', slug: 'caltech', outcome: 'admit' },
			{ school: 'Princeton University', slug: 'princeton', outcome: 'admit' },
			{ school: 'Harvard College', slug: 'harvard', outcome: 'waitlist' }
		], seed: true
	},
	{
		id: 'seed-7', handle: 'DIYBiologist', gradYear: 2025, major: 'Biomedical Engineering', state: 'NC',
		gpaWeighted: 4.4, gpaUnweighted: 3.9, act: 34,
		hook: 'Patent-pending low-cost prosthetic; state science fair champ.',
		activities: ['Prosthetics R&D (patent pending)', 'HOSA state officer', 'Hospital shadowing 300 hrs', 'Science olympiad captain'],
		awards: ['ISEF finalist', 'HOSA national medalist'],
		results: [
			{ school: 'Duke University', slug: 'duke', outcome: 'admit' },
			{ school: 'Johns Hopkins University', slug: 'jhu', outcome: 'admit' },
			{ school: 'University of North Carolina at Chapel Hill', slug: 'unc', outcome: 'admit' },
			{ school: 'Vanderbilt University', slug: 'vanderbilt', outcome: 'admit' }
		], seed: true
	},
	{
		id: 'seed-8', handle: 'StartupTeen', gradYear: 2026, major: 'Business / Economics', state: 'FL',
		gpaWeighted: 4.25, gpaUnweighted: 3.8, sat: 1490,
		hook: 'Ran a profitable e-commerce brand ($120k revenue).',
		activities: ['Founder/CEO, DTC brand ($120k rev)', 'DECA international finalist', 'Investing club founder', 'Mentors young entrepreneurs'],
		awards: ['DECA ICDC finalist', 'NFTE regional winner'],
		results: [
			{ school: 'University of Pennsylvania', slug: 'upenn', outcome: 'waitlist' },
			{ school: 'University of Michigan', slug: 'umich', outcome: 'admit' },
			{ school: 'New York University', slug: 'nyu', outcome: 'admit' },
			{ school: 'University of Southern California', slug: 'usc', outcome: 'admit' }
		], seed: true
	},
	{
		id: 'seed-9', handle: 'EnviroActivist', gradYear: 2025, major: 'Environmental Science', state: 'OR',
		gpaWeighted: 4.15, gpaUnweighted: 3.88, sat: 1460,
		hook: 'Passed a city plastics ordinance she lobbied for.',
		activities: ['Led city plastic-ban campaign (passed)', 'Sunrise Movement hub coordinator', 'Field research intern', 'Debate team'],
		awards: ['Bezos Earth youth honoree', 'State Sierra Club award'],
		results: [
			{ school: 'UC Berkeley', slug: 'ucberkeley', outcome: 'admit' },
			{ school: 'UCLA', slug: 'ucla', outcome: 'waitlist' },
			{ school: 'University of Washington', slug: 'uw', outcome: 'admit' },
			{ school: 'Cornell University', slug: 'cornell', outcome: 'admit' }
		], seed: true
	},
	{
		id: 'seed-10', handle: 'CompSciWildcard', gradYear: 2026, major: 'Computer Science', state: 'NJ',
		gpaWeighted: 3.95, gpaUnweighted: 3.7, sat: 1420,
		hook: 'Self-taught ML; open-source library with 3k GitHub stars.',
		activities: ['OSS maintainer (3k stars)', 'Freelance ML developer', 'Coding club', 'Volunteer coding teacher'],
		awards: ['Congressional App Challenge winner'],
		results: [
			{ school: 'Rutgers University', slug: 'rutgers', outcome: 'admit' },
			{ school: 'University of Illinois Urbana-Champaign', slug: 'uiuc', outcome: 'admit' },
			{ school: 'Northeastern University', slug: 'northeastern', outcome: 'admit' },
			{ school: 'Carnegie Mellon University', slug: 'cmu', outcome: 'deny' }
		], seed: true
	},
	{
		id: 'seed-11', handle: 'ClassicsNerd', gradYear: 2025, major: 'Classics', state: 'MA',
		gpaWeighted: 4.55, gpaUnweighted: 3.99, sat: 1550,
		hook: 'National Latin exam gold; translated an unpublished text.',
		activities: ['Certamen national team', 'Founded Latin tutoring program', 'Museum archival internship', 'Orchestra concertmaster'],
		awards: ['National Latin Exam gold (x4)', 'Presidential Scholar candidate'],
		results: [
			{ school: 'Harvard College', slug: 'harvard', outcome: 'admit' },
			{ school: 'Yale College', slug: 'yale', outcome: 'admit' },
			{ school: 'University of Chicago', slug: 'uchicago', outcome: 'admit' },
			{ school: 'Brown University', slug: 'brown', outcome: 'waitlist' }
		], seed: true
	},
	{
		id: 'seed-12', handle: 'AthleteScholar', gradYear: 2026, major: 'Kinesiology', state: 'OH',
		gpaWeighted: 4.05, gpaUnweighted: 3.82, act: 31,
		hook: 'Recruited D1 swimmer with strong academics.',
		activities: ['D1 recruited swimmer (state champ)', 'Team captain', 'Youth swim coach', 'NHS treasurer'],
		awards: ['All-American swimmer', 'Scholar-athlete of the year'],
		results: [
			{ school: 'The Ohio State University', slug: 'osu', outcome: 'admit' },
			{ school: 'University of Michigan', slug: 'umich', outcome: 'admit' },
			{ school: 'University of Wisconsin-Madison', slug: 'wisconsin', outcome: 'admit' },
			{ school: 'Stanford University', slug: 'stanford', outcome: 'deny' }
		], seed: true
	}
];
