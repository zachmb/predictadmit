// src/lib/config/schoolStats.ts
// Richer, display-oriented admissions data for the Pro "Schools" explorer,
// "Chance Me" profile, and dashboard. Values are approximate, publicly-known
// figures used for a realistic simulation — not official guarantees.

export type CampusSetting = 'Urban' | 'Suburban' | 'College town' | 'Rural';
export type SchoolSize = 'Small' | 'Medium' | 'Large';

export interface SchoolStat {
	slug: string;
	name?: string; // display name for schools without a full portal config
	color?: string; // brand hex for schools without a full portal config
	rank: number; // US national-university style ranking
	location: string; // "City, State"
	acceptanceRate: number; // decimal, e.g. 0.034
	satAvg: number; // mid-range SAT (out of 1600)
	actAvg: number; // mid-range ACT (out of 36)
	gpaWeighted: number; // avg weighted GPA of admits
	size: SchoolSize;
	setting: CampusSetting;
	tuition: number; // annual sticker tuition (USD, in-state where relevant)
}

export const schoolStats: Record<string, SchoolStat> = {
	princeton: { slug: 'princeton', rank: 1, location: 'Princeton, NJ', acceptanceRate: 0.045, satAvg: 1540, actAvg: 35, gpaWeighted: 4.0, size: 'Medium', setting: 'Suburban', tuition: 62400 },
	mit: { slug: 'mit', rank: 2, location: 'Cambridge, MA', acceptanceRate: 0.04, satAvg: 1550, actAvg: 35, gpaWeighted: 4.17, size: 'Medium', setting: 'Urban', tuition: 62396 },
	harvard: { slug: 'harvard', rank: 3, location: 'Cambridge, MA', acceptanceRate: 0.034, satAvg: 1550, actAvg: 35, gpaWeighted: 4.2, size: 'Medium', setting: 'Urban', tuition: 59076 },
	stanford: { slug: 'stanford', rank: 4, location: 'Stanford, CA', acceptanceRate: 0.037, satAvg: 1540, actAvg: 35, gpaWeighted: 4.18, size: 'Large', setting: 'Suburban', tuition: 62484 },
	yale: { slug: 'yale', rank: 5, location: 'New Haven, CT', acceptanceRate: 0.046, satAvg: 1540, actAvg: 35, gpaWeighted: 4.14, size: 'Medium', setting: 'Urban', tuition: 64700 },
	caltech: { slug: 'caltech', rank: 6, location: 'Pasadena, CA', acceptanceRate: 0.03, satAvg: 1560, actAvg: 36, gpaWeighted: 4.19, size: 'Small', setting: 'Suburban', tuition: 63255 },
	jhu: { slug: 'jhu', rank: 6, location: 'Baltimore, MD', acceptanceRate: 0.065, satAvg: 1530, actAvg: 35, gpaWeighted: 4.0, size: 'Medium', setting: 'Urban', tuition: 63340 },
	northwestern: { slug: 'northwestern', rank: 6, location: 'Evanston, IL', acceptanceRate: 0.07, satAvg: 1530, actAvg: 34, gpaWeighted: 4.13, size: 'Medium', setting: 'Suburban', tuition: 65997 },
	duke: { slug: 'duke', rank: 7, location: 'Durham, NC', acceptanceRate: 0.06, satAvg: 1540, actAvg: 35, gpaWeighted: 4.13, size: 'Medium', setting: 'Suburban', tuition: 66172 },
	upenn: { slug: 'upenn', rank: 10, location: 'Philadelphia, PA', acceptanceRate: 0.058, satAvg: 1540, actAvg: 35, gpaWeighted: 4.04, size: 'Large', setting: 'Urban', tuition: 66104 },
	brown: { slug: 'brown', rank: 9, location: 'Providence, RI', acceptanceRate: 0.051, satAvg: 1540, actAvg: 35, gpaWeighted: 4.08, size: 'Medium', setting: 'Urban', tuition: 68612 },
	cornell: { slug: 'cornell', rank: 11, location: 'Ithaca, NY', acceptanceRate: 0.079, satAvg: 1520, actAvg: 34, gpaWeighted: 4.07, size: 'Large', setting: 'College town', tuition: 66014 },
	uchicago: { slug: 'uchicago', rank: 11, location: 'Chicago, IL', acceptanceRate: 0.05, satAvg: 1540, actAvg: 35, gpaWeighted: 4.32, size: 'Medium', setting: 'Urban', tuition: 66939 },
	columbia: { slug: 'columbia', rank: 12, location: 'New York, NY', acceptanceRate: 0.039, satAvg: 1530, actAvg: 35, gpaWeighted: 4.15, size: 'Medium', setting: 'Urban', tuition: 68400 },
	notredame: { slug: 'notredame', rank: 18, location: 'Notre Dame, IN', acceptanceRate: 0.12, satAvg: 1500, actAvg: 34, gpaWeighted: 4.06, size: 'Medium', setting: 'Suburban', tuition: 62693 },
	vanderbilt: { slug: 'vanderbilt', rank: 18, location: 'Nashville, TN', acceptanceRate: 0.07, satAvg: 1530, actAvg: 35, gpaWeighted: 3.94, size: 'Medium', setting: 'Urban', tuition: 65974 },
	rice: { slug: 'rice', rank: 18, location: 'Houston, TX', acceptanceRate: 0.075, satAvg: 1530, actAvg: 35, gpaWeighted: 4.12, size: 'Medium', setting: 'Urban', tuition: 58128 },
	wustl: { slug: 'wustl', rank: 24, location: 'St. Louis, MO', acceptanceRate: 0.11, satAvg: 1530, actAvg: 34, gpaWeighted: 4.0, size: 'Medium', setting: 'Suburban', tuition: 64500 },
	ucla: { slug: 'ucla', rank: 15, location: 'Los Angeles, CA', acceptanceRate: 0.09, satAvg: 1450, actAvg: 32, gpaWeighted: 4.51, size: 'Large', setting: 'Urban', tuition: 13804 },
	ucberkeley: { slug: 'ucberkeley', rank: 17, location: 'Berkeley, CA', acceptanceRate: 0.11, satAvg: 1440, actAvg: 32, gpaWeighted: 4.18, size: 'Large', setting: 'Urban', tuition: 15226 },
	georgetown: { slug: 'georgetown', rank: 24, location: 'Washington, DC', acceptanceRate: 0.12, satAvg: 1500, actAvg: 34, gpaWeighted: 4.0, size: 'Medium', setting: 'Urban', tuition: 65082 },
	cmu: { slug: 'cmu', rank: 24, location: 'Pittsburgh, PA', acceptanceRate: 0.11, satAvg: 1540, actAvg: 35, gpaWeighted: 3.9, size: 'Medium', setting: 'Urban', tuition: 63829 },
	emory: { slug: 'emory', rank: 24, location: 'Atlanta, GA', acceptanceRate: 0.13, satAvg: 1500, actAvg: 34, gpaWeighted: 3.8, size: 'Medium', setting: 'Suburban', tuition: 61054 },
	usc: { slug: 'usc', rank: 27, location: 'Los Angeles, CA', acceptanceRate: 0.1, satAvg: 1510, actAvg: 34, gpaWeighted: 3.85, size: 'Large', setting: 'Urban', tuition: 69904 },
	uva: { slug: 'uva', rank: 24, location: 'Charlottesville, VA', acceptanceRate: 0.17, satAvg: 1470, actAvg: 33, gpaWeighted: 4.32, size: 'Large', setting: 'College town', tuition: 21381 },
	umich: { slug: 'umich', rank: 21, location: 'Ann Arbor, MI', acceptanceRate: 0.18, satAvg: 1460, actAvg: 33, gpaWeighted: 3.9, size: 'Large', setting: 'College town', tuition: 17786 },
	unc: { slug: 'unc', rank: 22, location: 'Chapel Hill, NC', acceptanceRate: 0.19, satAvg: 1420, actAvg: 32, gpaWeighted: 4.5, size: 'Large', setting: 'College town', tuition: 8998 },
	georgiatech: { slug: 'georgiatech', rank: 33, location: 'Atlanta, GA', acceptanceRate: 0.16, satAvg: 1490, actAvg: 34, gpaWeighted: 4.07, size: 'Large', setting: 'Urban', tuition: 11764 },
	nyu: { slug: 'nyu', rank: 30, location: 'New York, NY', acceptanceRate: 0.12, satAvg: 1510, actAvg: 34, gpaWeighted: 3.75, size: 'Large', setting: 'Urban', tuition: 62796 },
	wakeforest: { slug: 'wakeforest', rank: 47, location: 'Winston-Salem, NC', acceptanceRate: 0.21, satAvg: 1440, actAvg: 32, gpaWeighted: 3.9, size: 'Medium', setting: 'Suburban', tuition: 67642 },
	ucsd: { slug: 'ucsd', rank: 28, location: 'La Jolla, CA', acceptanceRate: 0.24, satAvg: 1400, actAvg: 31, gpaWeighted: 4.21, size: 'Large', setting: 'Suburban', tuition: 15026 },
	uci: { slug: 'uci', rank: 33, location: 'Irvine, CA', acceptanceRate: 0.21, satAvg: 1360, actAvg: 30, gpaWeighted: 4.16, size: 'Large', setting: 'Suburban', tuition: 15026 },
	ucdavis: { slug: 'ucdavis', rank: 33, location: 'Davis, CA', acceptanceRate: 0.37, satAvg: 1310, actAvg: 29, gpaWeighted: 4.15, size: 'Large', setting: 'College town', tuition: 15266 },
	uf: { slug: 'uf', rank: 28, location: 'Gainesville, FL', acceptanceRate: 0.23, satAvg: 1400, actAvg: 31, gpaWeighted: 4.4, size: 'Large', setting: 'College town', tuition: 6380 },
	uiuc: { slug: 'uiuc', rank: 33, location: 'Champaign, IL', acceptanceRate: 0.43, satAvg: 1440, actAvg: 32, gpaWeighted: 3.8, size: 'Large', setting: 'College town', tuition: 17138 },
	wisconsin: { slug: 'wisconsin', rank: 39, location: 'Madison, WI', acceptanceRate: 0.45, satAvg: 1410, actAvg: 30, gpaWeighted: 3.9, size: 'Large', setting: 'College town', tuition: 11205 },
	purdue: { slug: 'purdue', rank: 46, location: 'West Lafayette, IN', acceptanceRate: 0.5, satAvg: 1330, actAvg: 30, gpaWeighted: 3.75, size: 'Large', setting: 'College town', tuition: 9992 },
	osu: { slug: 'osu', rank: 43, location: 'Columbus, OH', acceptanceRate: 0.53, satAvg: 1370, actAvg: 30, gpaWeighted: 3.83, size: 'Large', setting: 'Urban', tuition: 12485 },
	wwu: { slug: 'wwu', rank: 176, location: 'Bellingham, WA', acceptanceRate: 0.85, satAvg: 1150, actAvg: 24, gpaWeighted: 3.5, size: 'Medium', setting: 'Suburban', tuition: 8109 },

	// --- Extended catalog (no dedicated portal; name + color are self-contained) ---
	northeastern: { slug: 'northeastern', name: 'Northeastern University', color: '#C8102E', rank: 53, location: 'Boston, MA', acceptanceRate: 0.06, satAvg: 1490, actAvg: 34, gpaWeighted: 4.0, size: 'Large', setting: 'Urban', tuition: 63000 },
	tufts: { slug: 'tufts', name: 'Tufts University', color: '#3E8EDE', rank: 40, location: 'Medford, MA', acceptanceRate: 0.1, satAvg: 1500, actAvg: 34, gpaWeighted: 4.0, size: 'Medium', setting: 'Suburban', tuition: 68000 },
	bc: { slug: 'bc', name: 'Boston College', color: '#98002E', rank: 39, location: 'Chestnut Hill, MA', acceptanceRate: 0.15, satAvg: 1470, actAvg: 33, gpaWeighted: 3.9, size: 'Medium', setting: 'Suburban', tuition: 67000 },
	bu: { slug: 'bu', name: 'Boston University', color: '#CC0000', rank: 43, location: 'Boston, MA', acceptanceRate: 0.11, satAvg: 1470, actAvg: 33, gpaWeighted: 3.9, size: 'Large', setting: 'Urban', tuition: 66000 },
	tulane: { slug: 'tulane', name: 'Tulane University', color: '#006747', rank: 73, location: 'New Orleans, LA', acceptanceRate: 0.11, satAvg: 1470, actAvg: 33, gpaWeighted: 3.9, size: 'Medium', setting: 'Urban', tuition: 66000 },
	rochester: { slug: 'rochester', name: 'University of Rochester', color: '#FFD100', rank: 47, location: 'Rochester, NY', acceptanceRate: 0.36, satAvg: 1440, actAvg: 33, gpaWeighted: 3.9, size: 'Medium', setting: 'Suburban', tuition: 65000 },
	case: { slug: 'case', name: 'Case Western Reserve University', color: '#0A304E', rank: 53, location: 'Cleveland, OH', acceptanceRate: 0.3, satAvg: 1470, actAvg: 34, gpaWeighted: 3.9, size: 'Medium', setting: 'Urban', tuition: 65000 },
	rpi: { slug: 'rpi', name: 'Rensselaer Polytechnic Institute', color: '#D6001C', rank: 63, location: 'Troy, NY', acceptanceRate: 0.65, satAvg: 1420, actAvg: 32, gpaWeighted: 3.9, size: 'Medium', setting: 'Urban', tuition: 62000 },
	villanova: { slug: 'villanova', name: 'Villanova University', color: '#00205B', rank: 51, location: 'Villanova, PA', acceptanceRate: 0.24, satAvg: 1430, actAvg: 33, gpaWeighted: 3.9, size: 'Medium', setting: 'Suburban', tuition: 65000 },
	lehigh: { slug: 'lehigh', name: 'Lehigh University', color: '#653819', rank: 47, location: 'Bethlehem, PA', acceptanceRate: 0.29, satAvg: 1400, actAvg: 32, gpaWeighted: 3.9, size: 'Medium', setting: 'Suburban', tuition: 62000 },
	gwu: { slug: 'gwu', name: 'George Washington University', color: '#033C5A', rank: 67, location: 'Washington, DC', acceptanceRate: 0.49, satAvg: 1400, actAvg: 32, gpaWeighted: 3.85, size: 'Medium', setting: 'Urban', tuition: 63000 },
	fordham: { slug: 'fordham', name: 'Fordham University', color: '#900028', rank: 89, location: 'New York, NY', acceptanceRate: 0.54, satAvg: 1370, actAvg: 31, gpaWeighted: 3.8, size: 'Medium', setting: 'Urban', tuition: 60000 },
	miami: { slug: 'miami', name: 'University of Miami', color: '#F47321', rank: 63, location: 'Coral Gables, FL', acceptanceRate: 0.19, satAvg: 1360, actAvg: 31, gpaWeighted: 3.8, size: 'Large', setting: 'Suburban', tuition: 60000 },

	uw: { slug: 'uw', name: 'University of Washington', color: '#4B2E83', rank: 40, location: 'Seattle, WA', acceptanceRate: 0.43, satAvg: 1420, actAvg: 31, gpaWeighted: 3.8, size: 'Large', setting: 'Urban', tuition: 12000 },
	texas: { slug: 'texas', name: 'University of Texas at Austin', color: '#BF5700', rank: 30, location: 'Austin, TX', acceptanceRate: 0.31, satAvg: 1410, actAvg: 31, gpaWeighted: 4.0, size: 'Large', setting: 'Urban', tuition: 11000 },
	ucsb: { slug: 'ucsb', name: 'UC Santa Barbara', color: '#003660', rank: 35, location: 'Santa Barbara, CA', acceptanceRate: 0.26, satAvg: 1380, actAvg: 30, gpaWeighted: 4.17, size: 'Large', setting: 'Suburban', tuition: 15000 },
	umd: { slug: 'umd', name: 'University of Maryland', color: '#E03A3E', rank: 46, location: 'College Park, MD', acceptanceRate: 0.45, satAvg: 1420, actAvg: 32, gpaWeighted: 4.0, size: 'Large', setting: 'Suburban', tuition: 11000 },
	pitt: { slug: 'pitt', name: 'University of Pittsburgh', color: '#003594', rank: 67, location: 'Pittsburgh, PA', acceptanceRate: 0.49, satAvg: 1360, actAvg: 31, gpaWeighted: 3.9, size: 'Large', setting: 'Urban', tuition: 20000 },
	rutgers: { slug: 'rutgers', name: 'Rutgers University', color: '#CC0033', rank: 40, location: 'New Brunswick, NJ', acceptanceRate: 0.66, satAvg: 1310, actAvg: 29, gpaWeighted: 3.7, size: 'Large', setting: 'Suburban', tuition: 16000 },
	fsu: { slug: 'fsu', name: 'Florida State University', color: '#782F40', rank: 54, location: 'Tallahassee, FL', acceptanceRate: 0.25, satAvg: 1330, actAvg: 29, gpaWeighted: 4.0, size: 'Large', setting: 'College town', tuition: 6500 },
	iu: { slug: 'iu', name: 'Indiana University Bloomington', color: '#990000', rank: 72, location: 'Bloomington, IN', acceptanceRate: 0.8, satAvg: 1250, actAvg: 27, gpaWeighted: 3.7, size: 'Large', setting: 'College town', tuition: 12000 },
	msu: { slug: 'msu', name: 'Michigan State University', color: '#18453B', rank: 60, location: 'East Lansing, MI', acceptanceRate: 0.83, satAvg: 1180, actAvg: 25, gpaWeighted: 3.6, size: 'Large', setting: 'College town', tuition: 15000 },
	asu: { slug: 'asu', name: 'Arizona State University', color: '#8C1D40', rank: 105, location: 'Tempe, AZ', acceptanceRate: 0.9, satAvg: 1230, actAvg: 25, gpaWeighted: 3.5, size: 'Large', setting: 'Urban', tuition: 11000 },

	williams: { slug: 'williams', name: 'Williams College', color: '#512698', rank: 1, location: 'Williamstown, MA', acceptanceRate: 0.09, satAvg: 1520, actAvg: 34, gpaWeighted: 4.0, size: 'Small', setting: 'Rural', tuition: 66000 },
	amherst: { slug: 'amherst', name: 'Amherst College', color: '#3F1E75', rank: 2, location: 'Amherst, MA', acceptanceRate: 0.09, satAvg: 1530, actAvg: 34, gpaWeighted: 4.0, size: 'Small', setting: 'College town', tuition: 67000 },
	swarthmore: { slug: 'swarthmore', name: 'Swarthmore College', color: '#9E1B32', rank: 3, location: 'Swarthmore, PA', acceptanceRate: 0.07, satAvg: 1520, actAvg: 34, gpaWeighted: 4.0, size: 'Small', setting: 'Suburban', tuition: 62000 },
	pomona: { slug: 'pomona', name: 'Pomona College', color: '#00449E', rank: 4, location: 'Claremont, CA', acceptanceRate: 0.07, satAvg: 1530, actAvg: 34, gpaWeighted: 4.0, size: 'Small', setting: 'Suburban', tuition: 62000 },
	bowdoin: { slug: 'bowdoin', name: 'Bowdoin College', color: '#332F2E', rank: 6, location: 'Brunswick, ME', acceptanceRate: 0.09, satAvg: 1510, actAvg: 34, gpaWeighted: 4.0, size: 'Small', setting: 'College town', tuition: 63000 },
	middlebury: { slug: 'middlebury', name: 'Middlebury College', color: '#0D2E52', rank: 9, location: 'Middlebury, VT', acceptanceRate: 0.13, satAvg: 1490, actAvg: 33, gpaWeighted: 4.0, size: 'Small', setting: 'Rural', tuition: 66000 },
	wellesley: { slug: 'wellesley', name: 'Wellesley College', color: '#002776', rank: 7, location: 'Wellesley, MA', acceptanceRate: 0.13, satAvg: 1500, actAvg: 33, gpaWeighted: 4.0, size: 'Small', setting: 'Suburban', tuition: 66000 },
	cmc: { slug: 'cmc', name: 'Claremont McKenna College', color: '#7C2529', rank: 8, location: 'Claremont, CA', acceptanceRate: 0.11, satAvg: 1490, actAvg: 33, gpaWeighted: 4.0, size: 'Small', setting: 'Suburban', tuition: 64000 },
	harveymudd: { slug: 'harveymudd', name: 'Harvey Mudd College', color: '#000000', rank: 10, location: 'Claremont, CA', acceptanceRate: 0.1, satAvg: 1540, actAvg: 35, gpaWeighted: 4.0, size: 'Small', setting: 'Suburban', tuition: 66000 },
	carleton: { slug: 'carleton', name: 'Carleton College', color: '#002E5D', rank: 5, location: 'Northfield, MN', acceptanceRate: 0.17, satAvg: 1480, actAvg: 33, gpaWeighted: 4.0, size: 'Small', setting: 'College town', tuition: 66000 },

	oxford: { slug: 'oxford', name: 'University of Oxford', color: '#002147', rank: 90, location: 'Oxford, UK', acceptanceRate: 0.17, satAvg: 1520, actAvg: 34, gpaWeighted: 4.0, size: 'Large', setting: 'College town', tuition: 45000 },
	cambridge: { slug: 'cambridge', name: 'University of Cambridge', color: '#A3C1AD', rank: 91, location: 'Cambridge, UK', acceptanceRate: 0.21, satAvg: 1520, actAvg: 34, gpaWeighted: 4.0, size: 'Large', setting: 'College town', tuition: 45000 },
	imperial: { slug: 'imperial', name: 'Imperial College London', color: '#003E74', rank: 95, location: 'London, UK', acceptanceRate: 0.14, satAvg: 1500, actAvg: 34, gpaWeighted: 4.0, size: 'Large', setting: 'Urban', tuition: 40000 },
	ucl: { slug: 'ucl', name: 'University College London', color: '#500778', rank: 98, location: 'London, UK', acceptanceRate: 0.3, satAvg: 1470, actAvg: 33, gpaWeighted: 4.0, size: 'Large', setting: 'Urban', tuition: 38000 },
	lse: { slug: 'lse', name: 'London School of Economics', color: '#E31837', rank: 100, location: 'London, UK', acceptanceRate: 0.09, satAvg: 1490, actAvg: 33, gpaWeighted: 4.0, size: 'Medium', setting: 'Urban', tuition: 42000 },
	toronto: { slug: 'toronto', name: 'University of Toronto', color: '#002A5C', rank: 110, location: 'Toronto, Canada', acceptanceRate: 0.43, satAvg: 1400, actAvg: 31, gpaWeighted: 4.0, size: 'Large', setting: 'Urban', tuition: 45000 },
	mcgill: { slug: 'mcgill', name: 'McGill University', color: '#ED1B2F', rank: 112, location: 'Montreal, Canada', acceptanceRate: 0.46, satAvg: 1420, actAvg: 32, gpaWeighted: 4.0, size: 'Large', setting: 'Urban', tuition: 45000 }
};

export function getSchoolStat(slug: string): SchoolStat | undefined {
	return schoolStats[slug];
}

/** Rough applicant "academic index" 0–100 from SAT (or ACT) and weighted GPA. */
export function computeAcademicIndex(sat?: number, act?: number, weightedGpa?: number): number {
	let satPart = 0;
	if (sat && sat > 0) satPart = Math.min(1, Math.max(0, (sat - 1000) / 600));
	else if (act && act > 0) satPart = Math.min(1, Math.max(0, (act - 20) / 16));
	const gpaPart = weightedGpa ? Math.min(1, Math.max(0, (weightedGpa - 3.0) / 1.5)) : 0;
	const combined = sat || act ? 0.55 * satPart + 0.45 * gpaPart : gpaPart;
	return Math.round(combined * 100);
}

export type Likelihood = 'Safety' | 'Target' | 'Reach' | 'Hard reach';

/** Classify a school as reach/target/safety given an academic index (0–100). */
export function classifyLikelihood(stat: SchoolStat, academicIndex: number): Likelihood {
	// Base difficulty from selectivity (0 = easy, 1 = brutal)
	const selectivity = Math.min(1, Math.max(0, 1 - stat.acceptanceRate * 1.8));
	// Student strength relative to selectivity
	const margin = academicIndex / 100 - selectivity;
	if (stat.acceptanceRate < 0.1) {
		return margin > 0.15 ? 'Reach' : 'Hard reach';
	}
	if (margin > 0.2) return 'Safety';
	if (margin > -0.05) return 'Target';
	return 'Reach';
}
