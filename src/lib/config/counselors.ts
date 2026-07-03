// src/lib/config/counselors.ts
// Roster for the paid "Human Counselors" marketplace. Every counselor got into a
// Top-20 university within the last admissions cycle (Class of 2029). Profiles are
// realistic composites for the simulation. The "Accepted to" list is the trust
// proof. The intro call is free; working sessions and packages are paid.

export type MajorTag =
	| 'Computer Science & Technology 💻'
	| 'Engineering & Materials ⚙️'
	| 'Business & Economics 💼'
	| 'Mathematics & Statistics 📊'
	| 'Pre-med ⚕️'
	| 'Public Health 🏥'
	| 'Government & Politics 🏛️'
	| 'Physical & Life Sciences 🔬'
	| 'Humanities 📚';

export type Counselor = {
	id: string;
	name: string; // first name + last initial
	school: string; // the T20 they were admitted to this cycle
	color: string; // brand color for the avatar
	classYear: number; // e.g. 2029
	admitPlan: 'ED' | 'REA' | 'SCEA' | 'RD' | 'EA';
	headline: string; // "Major @ School (Plan) · credential · credential"
	majors: MajorTag[]; // major categories they can mentor for
	fromState: string;
	rating: number; // 0–5
	reviews: number;
	sessionsCompleted: number;
	responseHours: number;
	bio: string;
	specialties: string[]; // "Topics" — services they help with
	acceptedTo: string[]; // the trust proof
	pricePerSession: number; // 60-min working session (USD)
	packagePrice: number; // multi-session application package (USD)
	verified: boolean;
};

export const counselors: Counselor[] = [
	{
		id: 'c-maya',
		name: 'Maya R.',
		school: 'Princeton',
		color: '#FF8F00',
		classYear: 2029,
		admitPlan: 'SCEA',
		headline: 'Molecular Biology @ Princeton (SCEA) · Simons Summer Research Fellow · ISEF Finalist',
		majors: ['Pre-med ⚕️', 'Physical & Life Sciences 🔬'],
		fromState: 'CA',
		rating: 5.0,
		reviews: 41,
		sessionsCompleted: 120,
		responseHours: 2,
		bio: 'Admitted to Princeton SCEA out of a large public school. I turned a "boring" summer research placement into a genuine spike — a journal-adjacent project and an ISEF finalist run — and I love helping STEM and pre-med students find the through-line that makes an application feel inevitable.',
		specialties: ['Personal statement', 'Research & science-fair coaching', 'STEM supplements', 'ED/EA strategy'],
		acceptedTo: ['Princeton', 'Duke', 'Johns Hopkins', 'Cornell', 'UCLA', 'Rice'],
		pricePerSession: 129,
		packagePrice: 899,
		verified: true
	},
	{
		id: 'c-dev',
		name: 'Dev P.',
		school: 'MIT',
		color: '#A31F34',
		classYear: 2029,
		admitPlan: 'EA',
		headline: 'Computer Science @ MIT (EA) · Shipped an app with 50k+ users · First-gen',
		majors: ['Computer Science & Technology 💻', 'Engineering & Materials ⚙️'],
		fromState: 'TX',
		rating: 4.9,
		reviews: 33,
		sessionsCompleted: 88,
		responseHours: 3,
		bio: 'MIT EA admit and first-gen. I built and shipped an app that reached 50k+ downloads before senior year, and I can help you frame technical projects so an admissions officer instantly gets why they matter — plus nail the MIT-style short answers.',
		specialties: ['Activities list', 'Maker / CS projects', 'MIT-style short answers', 'First-gen'],
		acceptedTo: ['MIT', 'Georgia Tech', 'UC Berkeley', 'UIUC (CS)', 'UW'],
		pricePerSession: 119,
		packagePrice: 799,
		verified: true
	},
	{
		id: 'c-aisha',
		name: 'Aisha K.',
		school: 'Harvard',
		color: '#A51C30',
		classYear: 2029,
		admitPlan: 'RD',
		headline: 'Government @ Harvard · Debate & policy · Deferred early → admitted RD',
		majors: ['Government & Politics 🏛️', 'Humanities 📚'],
		fromState: 'NY',
		rating: 5.0,
		reviews: 57,
		sessionsCompleted: 160,
		responseHours: 1,
		bio: 'Harvard RD admit after being deferred early somewhere else — so I know the "regroup and come back stronger" playbook cold. I specialize in the humanities voice: helping you sound like a person with a point of view, not a résumé in paragraph form.',
		specialties: ['Personal statement', 'Humanities / essays', 'Interview prep', 'Deferral recovery'],
		acceptedTo: ['Harvard', 'Columbia', 'Georgetown', 'UVA', 'UNC Chapel Hill'],
		pricePerSession: 149,
		packagePrice: 1099,
		verified: true
	},
	{
		id: 'c-noah',
		name: 'Noah B.',
		school: 'Penn (Wharton)',
		color: '#011F5B',
		classYear: 2029,
		admitPlan: 'ED',
		headline: 'Finance @ Wharton, Penn (ED) · Founder · "Why-school" specialist',
		majors: ['Business & Economics 💼'],
		fromState: 'IL',
		rating: 4.8,
		reviews: 29,
		sessionsCompleted: 74,
		responseHours: 4,
		bio: 'Wharton ED admit. I ran a small but real business in high school and I know the "why this school / why this major" game better than anyone — the single essay most business applicants get wrong. I help you make an entrepreneurship narrative specific enough to be believable.',
		specialties: ['Why-school essays', 'Business / Wharton', 'ED strategy', 'Activities list'],
		acceptedTo: ['Penn (Wharton)', 'NYU (Stern)', 'Michigan (Ross)', 'USC'],
		pricePerSession: 109,
		packagePrice: 749,
		verified: true
	},
	{
		id: 'c-sofia',
		name: 'Sofia G.',
		school: 'Stanford',
		color: '#8C1515',
		classYear: 2029,
		admitPlan: 'RD',
		headline: 'Symbolic Systems @ Stanford · Low-income · Authentic-voice essays',
		majors: ['Computer Science & Technology 💻', 'Humanities 📚'],
		fromState: 'FL',
		rating: 4.9,
		reviews: 38,
		sessionsCompleted: 96,
		responseHours: 2,
		bio: 'Stanford RD admit from a low-income background. I care a lot about authentic stories and about the Stanford short answers, which reward specificity and genuine curiosity over polish. I also help students navigate financial aid so cost never quietly narrows their list.',
		specialties: ['Stanford short answers', 'Personal statement', 'Financial aid', 'Authentic voice'],
		acceptedTo: ['Stanford', 'UChicago', 'UCLA', 'USC', 'UC Berkeley'],
		pricePerSession: 129,
		packagePrice: 899,
		verified: true
	},
	{
		id: 'c-elena',
		name: 'Elena V.',
		school: 'Yale',
		color: '#00356B',
		classYear: 2029,
		admitPlan: 'SCEA',
		headline: 'Ethics, Politics & Economics @ Yale (SCEA) · Nationally-ranked debater',
		majors: ['Government & Politics 🏛️', 'Business & Economics 💼'],
		fromState: 'WA',
		rating: 5.0,
		reviews: 44,
		sessionsCompleted: 130,
		responseHours: 2,
		bio: 'Yale SCEA admit with a debate and policy background. I am (kindly) ruthless about cutting clichés and finding the one concrete detail that turns a generic essay into unmistakably yours. Great for policy, econ, and pre-law-leaning applicants.',
		specialties: ['Personal statement', 'Yale supplements', 'Debate / policy ECs', 'Essay editing'],
		acceptedTo: ['Yale', 'Princeton', 'Brown', 'Georgetown'],
		pricePerSession: 139,
		packagePrice: 999,
		verified: true
	},
	{
		id: 'c-priya',
		name: 'Priya S.',
		school: 'Columbia',
		color: '#003D6B',
		classYear: 2029,
		admitPlan: 'ED',
		headline: 'Neuroscience @ Columbia (ED) · First-gen · Activities-list surgeon',
		majors: ['Pre-med ⚕️', 'Physical & Life Sciences 🔬'],
		fromState: 'NJ',
		rating: 4.9,
		reviews: 31,
		sessionsCompleted: 79,
		responseHours: 3,
		bio: 'Columbia ED admit, first-gen, and I came in with a sprawling activities list. I am great at pruning and prioritizing so your ten activities tell one clear story instead of ten half-stories — the difference between "busy" and "focused."',
		specialties: ['Activities list', 'Columbia lists / supplements', 'First-gen', 'Pre-med'],
		acceptedTo: ['Columbia', 'Cornell', 'Johns Hopkins', 'NYU', 'Rutgers (Honors)'],
		pricePerSession: 109,
		packagePrice: 769,
		verified: true
	},
	{
		id: 'c-james',
		name: 'James O.',
		school: 'UChicago',
		color: '#800000',
		classYear: 2029,
		admitPlan: 'ED',
		headline: 'Economics @ UChicago (ED) · Master of the famously weird prompts',
		majors: ['Business & Economics 💼', 'Mathematics & Statistics 📊'],
		fromState: 'NC',
		rating: 4.8,
		reviews: 22,
		sessionsCompleted: 55,
		responseHours: 5,
		bio: 'UChicago ED admit. If you are staring blankly at those famously strange UChicago prompts, I have been exactly there — I can help you be clever and real at the same time, which is the whole trick. Also strong on quantitative-social-science framing.',
		specialties: ['UChicago prompts', 'Quirky / creative essays', 'ED strategy', 'Intellectual vitality'],
		acceptedTo: ['UChicago', 'Northwestern', 'Emory', 'WashU', 'Michigan'],
		pricePerSession: 99,
		packagePrice: 699,
		verified: true
	}
];

export function allSpecialties(): string[] {
	const set = new Set<string>();
	for (const c of counselors) c.specialties.forEach((s) => set.add(s));
	return Array.from(set).sort();
}

export function allMajors(): string[] {
	const set = new Set<string>();
	for (const c of counselors) c.majors.forEach((m) => set.add(m));
	return Array.from(set).sort();
}
