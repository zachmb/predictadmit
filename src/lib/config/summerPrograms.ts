// src/lib/config/summerPrograms.ts
// Hand-curated catalog of summer programs for high-school students.
// One canonical entry per program (no duplicates), correct host organizations,
// and honest data: costs are tiers rather than invented dollar figures, and
// deadlines are typical windows from recent cycles — students must always
// confirm the current deadline on the program's official site.

export type ProgramSubject =
	| 'STEM research'
	| 'Math'
	| 'CS & engineering'
	| 'Medicine'
	| 'Writing & humanities'
	| 'Journalism'
	| 'Business'
	| 'Leadership & service'
	| 'Arts'
	| 'Global & language';

export type ProgramFormat = 'Residential' | 'Commuter' | 'Virtual' | 'Hybrid' | 'Varies';

export type CostTier = 'Free' | 'Free + stipend' | 'Under $2k' | '$2k–$6k' | 'Over $6k' | 'Varies';

/**
 * Honest read on what attending signals to selective colleges:
 * - Elite: highly selective (often free) — a genuine spike on an application.
 * - Strong: selective and respected — meaningfully strengthens a narrative.
 * - Moderate: somewhat selective or large-cohort — useful, not a differentiator.
 * - Enrichment: open or near-open enrollment — great for exploration and
 *   confirming interest, but paying to attend is not a selectivity signal.
 */
export type AdmissionsSignal = 'Elite' | 'Strong' | 'Moderate' | 'Enrichment';

export interface SummerProgram {
	id: string;
	name: string;
	host: string;
	subjects: ProgramSubject[];
	format: ProgramFormat;
	duration: string;
	cost: CostTier;
	costNote?: string;
	/** Typical window from recent cycles, e.g. "Mid Dec – mid Jan". Verify on the official site. */
	typicalDeadline: string;
	/** Position in the application season for sorting: Sep=0 … Aug=11, rolling=99. */
	deadlineOrder: number;
	eligibility?: string;
	signal: AdmissionsSignal;
	blurb: string;
	/** Official domain (not a deep link, so it stays valid). */
	website?: string;
}

export const summerPrograms: SummerProgram[] = [
	// ---- STEM research -------------------------------------------------------
	{
		id: 'rsi',
		name: 'Research Science Institute (RSI)',
		host: 'Center for Excellence in Education (hosted at MIT)',
		subjects: ['STEM research'],
		format: 'Residential',
		duration: '6 weeks',
		cost: 'Free',
		typicalDeadline: 'Mid Dec – mid Jan',
		deadlineOrder: 4,
		eligibility: 'Rising seniors',
		signal: 'Elite',
		blurb:
			'The most selective research program in the country: original STEM research under academic mentors, capped by conference-style presentations. Entirely free.',
		website: 'cee.org'
	},
	{
		id: 'mites',
		name: 'MITES Summer',
		host: 'Massachusetts Institute of Technology',
		subjects: ['STEM research', 'CS & engineering'],
		format: 'Residential',
		duration: '6 weeks',
		cost: 'Free',
		typicalDeadline: 'Early Feb',
		deadlineOrder: 5,
		eligibility: 'Rising seniors; strong focus on underserved and underrepresented students',
		signal: 'Elite',
		blurb:
			'Rigorous MIT coursework in math, science, and humanities with project-based electives. Free including room and board.',
		website: 'mit.edu'
	},
	{
		id: 'ssp',
		name: 'Summer Science Program (SSP)',
		host: 'Summer Science Program International',
		subjects: ['STEM research'],
		format: 'Residential',
		duration: '5 weeks',
		cost: 'Varies',
		costNote: 'Need-based aid down to $0',
		typicalDeadline: 'Late Feb',
		deadlineOrder: 6,
		eligibility: 'Rising seniors (some juniors)',
		signal: 'Elite',
		blurb:
			'Teams do real research in astrophysics, biochemistry, genomics, or synthetic chemistry at university campuses. One of the oldest and most respected programs.',
		website: 'summerscience.org'
	},
	{
		id: 'simons',
		name: 'Simons Summer Research Program',
		host: 'Stony Brook University',
		subjects: ['STEM research'],
		format: 'Varies',
		duration: '7 weeks',
		cost: 'Free + stipend',
		typicalDeadline: 'Early Feb',
		deadlineOrder: 5,
		eligibility: 'Rising seniors',
		signal: 'Elite',
		blurb:
			'Hands-on research in a Stony Brook faculty lab, ending with a research abstract and poster. Participants receive a stipend award.',
		website: 'stonybrook.edu'
	},
	{
		id: 'clark',
		name: 'Clark Scholars Program',
		host: 'Texas Tech University',
		subjects: ['STEM research'],
		format: 'Residential',
		duration: '7 weeks',
		cost: 'Free + stipend',
		typicalDeadline: 'Mid Feb',
		deadlineOrder: 5,
		eligibility: '17+ by program start',
		signal: 'Elite',
		blurb:
			'Tiny cohort (~12 students) doing intensive one-on-one research with faculty in any discipline, not just STEM. Free with a stipend.',
		website: 'ttu.edu'
	},
	{
		id: 'rockefeller-ssrp',
		name: 'Summer Science Research Program (SSRP)',
		host: 'Rockefeller University',
		subjects: ['STEM research'],
		format: 'Commuter',
		duration: '7 weeks',
		cost: 'Free',
		typicalDeadline: 'Early Jan',
		deadlineOrder: 4,
		signal: 'Strong',
		blurb:
			'Biomedical research in themed team "tracks" at one of the world\'s top research institutions, mentored by Rockefeller scientists.',
		website: 'rockefeller.edu'
	},
	{
		id: 'jax',
		name: 'Summer Student Program',
		host: 'The Jackson Laboratory',
		subjects: ['STEM research', 'Medicine'],
		format: 'Residential',
		duration: '10 weeks',
		cost: 'Free + stipend',
		typicalDeadline: 'Late Jan',
		deadlineOrder: 4,
		signal: 'Strong',
		blurb:
			'Genetics and genomics research with a defined project of your own at JAX campuses in Maine and Connecticut. Stipend covers the summer.',
		website: 'jax.org'
	},
	{
		id: 'fredhutch-ship',
		name: 'Summer High School Internship Program (SHIP)',
		host: 'Fred Hutchinson Cancer Center',
		subjects: ['STEM research', 'Medicine'],
		format: 'Commuter',
		duration: '8 weeks',
		cost: 'Free + stipend',
		typicalDeadline: 'Winter (varies)',
		deadlineOrder: 5,
		eligibility: 'Rising seniors; Seattle area; prioritizes students underrepresented in biomedical science',
		signal: 'Strong',
		blurb: 'Paid, mentored cancer-research internship pairing students with Fred Hutch labs.',
		website: 'fredhutch.org'
	},
	{
		id: 'simr',
		name: 'Stanford Institutes of Medicine Summer Research Program (SIMR)',
		host: 'Stanford University School of Medicine',
		subjects: ['STEM research', 'Medicine'],
		format: 'Commuter',
		duration: '8 weeks',
		cost: 'Free + stipend',
		typicalDeadline: 'Late Feb',
		deadlineOrder: 6,
		eligibility: 'Juniors and seniors; Bay Area presence required',
		signal: 'Elite',
		blurb:
			'Eight weeks of biomedical research in Stanford Medicine labs across immunology, neuroscience, cancer biology, bioengineering, and more.',
		website: 'stanford.edu'
	},
	{
		id: 'nih-histep',
		name: 'HiSTEP (High School Scientific Training and Enrichment Program)',
		host: 'National Institutes of Health',
		subjects: ['STEM research', 'Medicine'],
		format: 'Commuter',
		duration: '5 weeks',
		cost: 'Free + stipend',
		typicalDeadline: 'Feb',
		deadlineOrder: 5,
		eligibility: 'Rising seniors near NIH Bethesda from schools with significant financial need',
		signal: 'Strong',
		blurb:
			'Paid NIH summer enrichment focused on science skills, career exploration, and college readiness.',
		website: 'nih.gov'
	},
	{
		id: 'cosmos',
		name: 'COSMOS (California State Summer School for Mathematics and Science)',
		host: 'University of California (multiple campuses)',
		subjects: ['STEM research', 'CS & engineering'],
		format: 'Residential',
		duration: '4 weeks',
		cost: '$2k–$6k',
		costNote: 'California-resident pricing; financial aid available',
		typicalDeadline: 'Early Feb',
		deadlineOrder: 5,
		signal: 'Strong',
		blurb:
			'Cluster-based STEM intensives at UC campuses (Davis, Irvine, San Diego, Santa Cruz, and LA), from astrophysics to biomedical sciences.',
		website: 'ucop.edu'
	},
	{
		id: 'ucd-ysp',
		name: 'Young Scholars Program',
		host: 'UC Davis',
		subjects: ['STEM research'],
		format: 'Residential',
		duration: '6 weeks',
		cost: '$2k–$6k',
		costNote: 'Some scholarships available',
		typicalDeadline: 'Mar',
		deadlineOrder: 6,
		signal: 'Strong',
		blurb:
			'Individual research projects in biological and environmental sciences with UC Davis research faculty.',
		website: 'ucdavis.edu'
	},
	{
		id: 'bu-rise',
		name: 'RISE (Research in Science & Engineering)',
		host: 'Boston University',
		subjects: ['STEM research'],
		format: 'Residential',
		duration: '6 weeks',
		cost: 'Over $6k',
		costNote: 'Need-based aid available',
		typicalDeadline: 'Feb',
		deadlineOrder: 5,
		eligibility: 'Rising seniors',
		signal: 'Strong',
		blurb:
			'Choose an Internship track (research in a BU lab) or Practicum track (guided group research) across the sciences and engineering.',
		website: 'bu.edu'
	},
	{
		id: 'bnl-hsrp',
		name: 'High School Research Program',
		host: 'Brookhaven National Laboratory',
		subjects: ['STEM research'],
		format: 'Commuter',
		duration: '6 weeks',
		cost: 'Free',
		typicalDeadline: 'Spring (varies)',
		deadlineOrder: 7,
		signal: 'Strong',
		blurb:
			'Research alongside scientists at a U.S. Department of Energy national laboratory on Long Island.',
		website: 'bnl.gov'
	},

	// ---- Math ---------------------------------------------------------------
	{
		id: 'promys',
		name: 'PROMYS',
		host: 'Boston University',
		subjects: ['Math'],
		format: 'Residential',
		duration: '6 weeks',
		cost: '$2k–$6k',
		costNote: 'Full need-based aid; free for eligible families',
		typicalDeadline: 'Mar',
		deadlineOrder: 6,
		signal: 'Elite',
		blurb:
			'Deep immersion in number theory through daily problem sets — one of the storied trio of proof-based summer math programs.',
		website: 'promys.org'
	},
	{
		id: 'ross',
		name: 'Ross Mathematics Program',
		host: 'Ross Mathematics Foundation',
		subjects: ['Math'],
		format: 'Residential',
		duration: '6 weeks',
		cost: '$2k–$6k',
		costNote: 'Financial aid available',
		typicalDeadline: 'Mar – early Apr',
		deadlineOrder: 6,
		signal: 'Elite',
		blurb:
			'"Think deeply of simple things": six weeks inside number theory, writing proofs from first principles.',
		website: 'rossprogram.org'
	},
	{
		id: 'mathcamp',
		name: 'Canada/USA Mathcamp',
		host: 'Mathematics Foundation of America',
		subjects: ['Math'],
		format: 'Residential',
		duration: '5 weeks',
		cost: '$2k–$6k',
		costNote: 'Full need-based aid; free for lower-income families',
		typicalDeadline: 'Mar (qualifying quiz)',
		deadlineOrder: 6,
		signal: 'Elite',
		blurb:
			'Admission by a famously fun qualifying quiz; five weeks of student-driven advanced mathematics with visiting mathematicians.',
		website: 'mathcamp.org'
	},
	{
		id: 'sumac',
		name: 'Stanford University Mathematics Camp (SUMaC)',
		host: 'Stanford University',
		subjects: ['Math'],
		format: 'Varies',
		duration: '4 weeks',
		cost: 'Over $6k',
		costNote: 'Financial aid available; online option costs less',
		typicalDeadline: 'Feb – Mar',
		deadlineOrder: 5,
		signal: 'Strong',
		blurb:
			'Abstract algebra & number theory or algebraic topology, taught proof-first in residential and online formats.',
		website: 'stanford.edu'
	},
	{
		id: 'hcssim',
		name: "Hampshire College Summer Studies in Mathematics (HCSSiM)",
		host: 'Hampshire College',
		subjects: ['Math'],
		format: 'Residential',
		duration: '6 weeks',
		cost: '$2k–$6k',
		costNote: 'Financial aid available',
		typicalDeadline: 'Spring (rolling)',
		deadlineOrder: 7,
		signal: 'Strong',
		blurb:
			'Six weeks of "Interesting Mathematics" — playful, proof-heavy workshops with a devoted alumni cult following.',
		website: 'hcssim.org'
	},
	{
		id: 'mathily',
		name: 'MathILy',
		host: 'Bryn Mawr College',
		subjects: ['Math'],
		format: 'Residential',
		duration: '5 weeks',
		cost: '$2k–$6k',
		costNote: 'Need-based aid available',
		typicalDeadline: 'Apr',
		deadlineOrder: 7,
		signal: 'Strong',
		blurb: 'Serious mathematics with inquiry-based, improvisational instruction ("...and serious fun").',
		website: 'mathily.org'
	},
	{
		id: 'mathroots',
		name: 'MathROOTS',
		host: 'MIT',
		subjects: ['Math'],
		format: 'Residential',
		duration: '2 weeks',
		cost: 'Free',
		typicalDeadline: 'Mar',
		deadlineOrder: 6,
		eligibility: 'High-potential students from underrepresented backgrounds or underserved communities',
		signal: 'Strong',
		blurb: 'Free two-week MIT math intensive focused on creative problem-solving techniques.',
		website: 'mit.edu'
	},

	// ---- CS & engineering ----------------------------------------------------
	{
		id: 'bwsi',
		name: 'Beaver Works Summer Institute (BWSI)',
		host: 'MIT Lincoln Laboratory',
		subjects: ['CS & engineering'],
		format: 'Varies',
		duration: '4 weeks',
		cost: 'Free',
		typicalDeadline: 'Mar – Apr (after prerequisite online courses)',
		deadlineOrder: 6,
		signal: 'Strong',
		blurb:
			'Project-based engineering: autonomous racecars, UAVs, cybersecurity, assistive tech. Free, with self-paced prerequisites in the spring.',
		website: 'mit.edu'
	},
	{
		id: 'ai4all',
		name: 'AI4ALL Summer Programs',
		host: 'AI4ALL (hosted at partner universities)',
		subjects: ['CS & engineering'],
		format: 'Varies',
		duration: '2–3 weeks',
		cost: 'Free',
		costNote: 'Free at most host sites',
		typicalDeadline: 'Winter – spring (varies by site)',
		deadlineOrder: 6,
		eligibility: 'Focus on students underrepresented in AI',
		signal: 'Strong',
		blurb:
			'AI fundamentals plus a mentored group project at university host sites, aimed at broadening who builds AI.',
		website: 'ai-4-all.org'
	},
	{
		id: 'arise',
		name: 'ARISE (Applied Research Innovations in Science and Engineering)',
		host: 'NYU Tandon School of Engineering',
		subjects: ['CS & engineering', 'STEM research'],
		format: 'Commuter',
		duration: '10 weeks',
		cost: 'Free + stipend',
		typicalDeadline: 'Mar',
		deadlineOrder: 6,
		eligibility: 'NYC students, rising juniors/seniors',
		signal: 'Strong',
		blurb: 'Workshops plus placement in an NYU faculty lab, with a stipend for participants.',
		website: 'nyu.edu'
	},
	{
		id: 'gwc-sip',
		name: 'Summer Immersion Program',
		host: 'Girls Who Code',
		subjects: ['CS & engineering'],
		format: 'Virtual',
		duration: '2 weeks',
		cost: 'Free',
		typicalDeadline: 'Spring',
		deadlineOrder: 6,
		eligibility: 'Girls and non-binary students',
		signal: 'Moderate',
		blurb: 'Free two-week intro to CS careers with industry partner companies.',
		website: 'girlswhocode.com'
	},
	{
		id: 'kwk',
		name: 'Kode With Klossy Summer Camps',
		host: 'Kode With Klossy',
		subjects: ['CS & engineering'],
		format: 'Varies',
		duration: '2 weeks',
		cost: 'Free',
		typicalDeadline: 'Spring',
		deadlineOrder: 6,
		eligibility: 'Girls and gender-expansive teens 13–18',
		signal: 'Moderate',
		blurb: 'Free two-week camps in web, mobile, data science, or machine learning.',
		website: 'kodewithklossy.com'
	},

	// ---- Writing & humanities -------------------------------------------------
	{
		id: 'tass',
		name: 'Telluride Association Summer Seminar (TASS)',
		host: 'Telluride Association',
		subjects: ['Writing & humanities', 'Leadership & service'],
		format: 'Residential',
		duration: '6 weeks',
		cost: 'Free',
		costNote: 'Free including travel',
		typicalDeadline: 'Dec – early Jan',
		deadlineOrder: 4,
		eligibility: 'Sophomores and juniors',
		signal: 'Elite',
		blurb:
			'Seminar-style critical study of Black and ethnic studies with democratic self-governance. Completely free, famously selective.',
		website: 'tellurideassociation.org'
	},
	{
		id: 'iowa-yws',
		name: "Iowa Young Writers' Studio",
		host: 'University of Iowa',
		subjects: ['Writing & humanities'],
		format: 'Residential',
		duration: '2 weeks',
		cost: '$2k–$6k',
		costNote: 'Some scholarships available',
		typicalDeadline: 'Early Feb',
		deadlineOrder: 5,
		signal: 'Strong',
		blurb:
			'Admission by writing sample to the high-school arm of the most famous creative-writing university in the country.',
		website: 'uiowa.edu'
	},
	{
		id: 'kenyon-yw',
		name: 'Kenyon Review Young Writers Workshop',
		host: 'Kenyon Review / Kenyon College',
		subjects: ['Writing & humanities'],
		format: 'Residential',
		duration: '2 weeks',
		cost: '$2k–$6k',
		costNote: 'Need-based scholarships',
		typicalDeadline: 'Winter – spring (rolling rounds)',
		deadlineOrder: 6,
		signal: 'Strong',
		blurb: 'Generative writing workshop run by one of the leading literary magazines.',
		website: 'kenyonreview.org'
	},
	{
		id: 'adroit',
		name: 'Summer Mentorship Program',
		host: 'The Adroit Journal',
		subjects: ['Writing & humanities'],
		format: 'Virtual',
		duration: '~6 weeks',
		cost: 'Under $2k',
		costNote: 'Fee waivers available',
		typicalDeadline: 'Spring',
		deadlineOrder: 6,
		signal: 'Strong',
		blurb:
			'One-on-one mentorship with an established poet or prose writer; a launching pad for many nationally awarded teen writers.',
		website: 'theadroitjournal.org'
	},
	{
		id: 'stanford-shi',
		name: 'Stanford Summer Humanities Institute',
		host: 'Stanford University',
		subjects: ['Writing & humanities'],
		format: 'Residential',
		duration: '3 weeks',
		cost: 'Over $6k',
		costNote: 'Financial aid available',
		typicalDeadline: 'Feb',
		deadlineOrder: 5,
		signal: 'Strong',
		blurb: 'Research-driven humanities seminars with Stanford professors, ending in an original paper.',
		website: 'stanford.edu'
	},

	// ---- Journalism ------------------------------------------------------------
	{
		id: 'psjp',
		name: 'Princeton Summer Journalism Program',
		host: 'Princeton University',
		subjects: ['Journalism'],
		format: 'Hybrid',
		duration: '10 days on campus + school-year college counseling',
		cost: 'Free',
		typicalDeadline: 'Feb',
		deadlineOrder: 5,
		eligibility: 'Low-income juniors',
		signal: 'Elite',
		blurb:
			'Free journalism bootcamp with top editors and reporters, plus a full year of college-application support.',
		website: 'princeton.edu'
	},
	{
		id: 'cherubs',
		name: 'Medill-Northwestern Journalism Institute ("Cherubs")',
		host: 'Northwestern University',
		subjects: ['Journalism'],
		format: 'Residential',
		duration: '~1 month',
		cost: '$2k–$6k',
		costNote: 'Scholarships available',
		typicalDeadline: 'Mar',
		deadlineOrder: 6,
		eligibility: 'Rising seniors',
		signal: 'Strong',
		blurb: 'The classic pre-college journalism intensive at Medill, running since 1934.',
		website: 'northwestern.edu'
	},
	{
		id: 'jcamp',
		name: 'JCamp',
		host: 'Asian American Journalists Association',
		subjects: ['Journalism'],
		format: 'Residential',
		duration: '6 days',
		cost: 'Free',
		costNote: 'Free including travel',
		typicalDeadline: 'Winter',
		deadlineOrder: 5,
		signal: 'Strong',
		blurb:
			'Free multicultural journalism training with veteran reporters and executives; open to students of all backgrounds.',
		website: 'aaja.org'
	},

	// ---- Business --------------------------------------------------------------
	{
		id: 'lbw',
		name: 'Leadership in the Business World (LBW)',
		host: 'Wharton School, University of Pennsylvania',
		subjects: ['Business', 'Leadership & service'],
		format: 'Residential',
		duration: '3 weeks',
		cost: 'Over $6k',
		costNote: 'Need-based aid available',
		typicalDeadline: 'Jan',
		deadlineOrder: 4,
		eligibility: 'Rising seniors',
		signal: 'Strong',
		blurb:
			"Wharton's flagship pre-college: business fundamentals, leadership labs, and a team venture pitch.",
		website: 'upenn.edu'
	},
	{
		id: 'launchx',
		name: 'LaunchX',
		host: 'LaunchX',
		subjects: ['Business'],
		format: 'Varies',
		duration: '4 weeks',
		cost: 'Over $6k',
		costNote: 'Aid available; online options cost less',
		typicalDeadline: 'Rolling rounds through spring',
		deadlineOrder: 6,
		signal: 'Moderate',
		blurb: 'Start a real startup with a team of peers, from customer research to launch.',
		website: 'launchx.com'
	},
	{
		id: 'bofa-leaders',
		name: 'Student Leaders Program',
		host: 'Bank of America',
		subjects: ['Business', 'Leadership & service'],
		format: 'Hybrid',
		duration: '8 weeks',
		cost: 'Free + stipend',
		costNote: 'Paid nonprofit internship',
		typicalDeadline: 'Jan – Feb',
		deadlineOrder: 4,
		eligibility: 'Juniors and seniors',
		signal: 'Strong',
		blurb:
			'Paid internship at a local nonprofit plus a national leadership summit in Washington, DC.',
		website: 'bankofamerica.com'
	},

	// ---- Leadership & service ----------------------------------------------------
	{
		id: 'leda',
		name: 'Aspects of Leadership Summer Institute',
		host: 'LEDA (Leadership Enterprise for a Diverse America)',
		subjects: ['Leadership & service'],
		format: 'Residential',
		duration: '7 weeks',
		cost: 'Free',
		typicalDeadline: 'Dec – Jan',
		deadlineOrder: 4,
		eligibility: 'High-achieving juniors from low-income backgrounds',
		signal: 'Elite',
		blurb:
			'Fully funded leadership institute on the Princeton campus, plus year-round college guidance through the LEDA Scholars network.',
		website: 'ledascholars.org'
	},
	{
		id: 'nd-leadership',
		name: 'Notre Dame Leadership Seminars',
		host: 'University of Notre Dame',
		subjects: ['Leadership & service'],
		format: 'Residential',
		duration: '~10 days',
		cost: 'Free',
		costNote: 'All expenses covered; college credit awarded',
		typicalDeadline: 'Jan',
		deadlineOrder: 4,
		eligibility: 'Rising seniors',
		signal: 'Elite',
		blurb:
			'Highly selective, fully funded seminars on global issues — one of the few free-with-credit programs anywhere.',
		website: 'nd.edu'
	},
	{
		id: 'boys-girls-state',
		name: 'Boys State / Girls State',
		host: 'American Legion & American Legion Auxiliary',
		subjects: ['Leadership & service'],
		format: 'Residential',
		duration: '~1 week',
		cost: 'Free',
		costNote: 'Usually sponsored; selection typically via your school',
		typicalDeadline: 'Spring (via school/Legion post nomination)',
		deadlineOrder: 7,
		eligibility: 'Rising seniors',
		signal: 'Strong',
		blurb:
			'Long-running civic leadership program where students build and run a model state government.',
		website: 'legion.org'
	},
	{
		id: 'nsli-y',
		name: 'NSLI-Y (National Security Language Initiative for Youth)',
		host: 'U.S. Department of State',
		subjects: ['Global & language', 'Leadership & service'],
		format: 'Residential',
		duration: '6–8 weeks abroad',
		cost: 'Free',
		costNote: 'Fully funded merit scholarship, including travel',
		typicalDeadline: 'Early Nov',
		deadlineOrder: 2,
		signal: 'Elite',
		blurb:
			'Fully funded immersion abroad in critical languages (Arabic, Mandarin, Korean, Russian, and more) with host families.',
		website: 'nsliforyouth.org'
	},

	// ---- Arts ---------------------------------------------------------------------
	{
		id: 'interlochen',
		name: 'Interlochen Arts Camp',
		host: 'Interlochen Center for the Arts',
		subjects: ['Arts'],
		format: 'Residential',
		duration: '1–6 weeks',
		cost: 'Over $6k',
		costNote: 'Substantial need- and merit-based aid',
		typicalDeadline: 'Winter priority; rolling after',
		deadlineOrder: 5,
		signal: 'Strong',
		blurb:
			'The storied arts camp for serious young musicians, actors, dancers, filmmakers, writers, and visual artists.',
		website: 'interlochen.org'
	},
	{
		id: 'buti',
		name: 'Boston University Tanglewood Institute (BUTI)',
		host: 'Boston University',
		subjects: ['Arts'],
		format: 'Residential',
		duration: '2–6 weeks',
		cost: 'Over $6k',
		costNote: 'Merit and need-based aid',
		typicalDeadline: 'Winter (audition-based)',
		deadlineOrder: 5,
		signal: 'Strong',
		blurb:
			'Elite classical-music training alongside the Boston Symphony Orchestra\'s summer home at Tanglewood.',
		website: 'bu.edu'
	},
	{
		id: 'risd-precollege',
		name: 'RISD Pre-College',
		host: 'Rhode Island School of Design',
		subjects: ['Arts'],
		format: 'Varies',
		duration: '5 weeks',
		cost: 'Over $6k',
		costNote: 'Scholarships available; online option costs less',
		typicalDeadline: 'Spring',
		deadlineOrder: 7,
		signal: 'Moderate',
		blurb:
			'Art-school schedule and critique culture, ending in a college-ready portfolio project.',
		website: 'risd.edu'
	},

	// ---- Open-enrollment pre-college (honest tier) ---------------------------------
	{
		id: 'harvard-ssp',
		name: 'Harvard Summer School — Secondary School Program',
		host: 'Harvard University',
		subjects: ['Writing & humanities', 'STEM research', 'Business'],
		format: 'Varies',
		duration: '4 or 7 weeks',
		cost: 'Over $6k',
		costNote: 'Some aid available',
		typicalDeadline: 'Spring (rolling until full)',
		deadlineOrder: 7,
		signal: 'Enrichment',
		blurb:
			'Real college courses for credit on the Harvard campus. Excellent teaching and independence practice — but enrollment is largely open, so treat it as academic exploration, not a selectivity spike.',
		website: 'harvard.edu'
	},
	{
		id: 'brown-precollege',
		name: 'Summer@Brown Pre-College',
		host: 'Brown University',
		subjects: ['Writing & humanities', 'STEM research', 'Leadership & service'],
		format: 'Varies',
		duration: '1–6 weeks',
		cost: 'Over $6k',
		costNote: 'Need-based scholarships',
		typicalDeadline: 'Spring (rolling until full)',
		deadlineOrder: 7,
		signal: 'Enrichment',
		blurb:
			'Hundreds of non-credit courses in Brown\'s open curriculum spirit. Great for exploring interests; admission is near-open, so colleges read it as enrichment.',
		website: 'brown.edu'
	},
	{
		id: 'columbia-immersion',
		name: 'Columbia Summer Immersion',
		host: 'Columbia University',
		subjects: ['Writing & humanities', 'Business', 'STEM research'],
		format: 'Varies',
		duration: '1–3 weeks',
		cost: 'Over $6k',
		costNote: 'Some scholarships',
		typicalDeadline: 'Spring (rolling until full)',
		deadlineOrder: 7,
		signal: 'Enrichment',
		blurb:
			'Short intensives on the Columbia campus or online across dozens of subjects. An experience of NYC college life more than an admissions differentiator.',
		website: 'columbia.edu'
	},
	{
		id: 'stanford-spcs',
		name: 'Stanford Pre-Collegiate Summer Institutes',
		host: 'Stanford University',
		subjects: ['STEM research', 'Writing & humanities', 'CS & engineering'],
		format: 'Varies',
		duration: '2–3 weeks',
		cost: 'Over $6k',
		costNote: 'Financial aid available',
		typicalDeadline: 'Winter – spring',
		deadlineOrder: 6,
		signal: 'Moderate',
		blurb:
			'Single-subject intensives with an application review — more selective than open pre-college programs, but still primarily an enrichment experience.',
		website: 'stanford.edu'
	},
	{
		id: 'yale-summer',
		name: 'Yale Summer Session (Pre-College)',
		host: 'Yale University',
		subjects: ['Writing & humanities', 'STEM research'],
		format: 'Varies',
		duration: '5 weeks',
		cost: 'Over $6k',
		costNote: 'Limited aid',
		typicalDeadline: 'Spring',
		deadlineOrder: 7,
		signal: 'Enrichment',
		blurb:
			'Yale College courses for credit alongside undergrads, residential or online. Valuable coursework; not a selectivity signal by itself.',
		website: 'yale.edu'
	},
	{
		id: 'yygs',
		name: 'Yale Young Global Scholars (YYGS)',
		host: 'Yale University',
		subjects: ['Leadership & service', 'Writing & humanities'],
		format: 'Residential',
		duration: '2 weeks',
		cost: 'Over $6k',
		costNote: 'Substantial need-based aid, including full scholarships',
		typicalDeadline: 'Nov (EA) / Jan (regular)',
		deadlineOrder: 3,
		signal: 'Moderate',
		blurb:
			'Interdisciplinary sessions with a huge international cohort. Selective on paper but large; the global network is the real draw.',
		website: 'yale.edu'
	},
	{
		id: 'jhu-cty',
		name: 'Center for Talented Youth (CTY) Summer Programs',
		host: 'Johns Hopkins University',
		subjects: ['STEM research', 'Writing & humanities', 'Math'],
		format: 'Varies',
		duration: '3 weeks',
		cost: '$2k–$6k',
		costNote: 'Need-based aid; qualifying test scores required',
		typicalDeadline: 'Rolling (test-in)',
		deadlineOrder: 99,
		signal: 'Moderate',
		blurb:
			'Accelerated courses for students who qualify by above-grade-level testing, on campuses nationwide and online.',
		website: 'jhu.edu'
	}
];

/**
 * Programs you cannot apply to directly — earned through competition pipelines.
 * Listed so students don't get misled by catalogs that show them with
 * "application deadlines."
 */
export const inviteOnlyPipelines = [
	{
		name: 'Mathematical Olympiad Program (MOP)',
		how: 'Invitation only, based on USAMO/USAJMO results (which require AMC → AIME qualification).'
	},
	{
		name: 'USACO Training Camp',
		how: 'Invitation only, from top finishes in USA Computing Olympiad contests.'
	},
	{
		name: 'International olympiad teams (IMO, IPhO, IChO, IOI, IBO…)',
		how: 'Selected from national olympiad camps and team selection tests, not applications.'
	}
];
