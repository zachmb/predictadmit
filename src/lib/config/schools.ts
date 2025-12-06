// src/lib/config/schools.ts
export type SchoolDecision = 'admit' | 'deny';

export interface SchoolConfig {
  slug: string;
  schoolName: string;
  logoPrimary: string;
  logoSecondary: string;
  primaryColor: string;
  admissionsId: string;
  financialAidId: string;
  bannerText: string;
  noticeText: string;
  statusLastPosted: string;
  statusLinkLabel: string;
  decision: SchoolDecision;
}

export const schoolConfigs: Record<string, SchoolConfig> = {
  harvard: {
    slug: 'harvard',
    schoolName: 'Harvard College',
    logoPrimary: 'Harvard',
    logoSecondary: 'COLLEGE ADMISSIONS',
    primaryColor: '#A51C30',
    admissionsId: 'H-2026-001234',
    financialAidId: 'FA-H-567890',
    bannerText: 'Thank you for applying to Harvard College.',
    noticeText:
      'Admission decisions for Regular Decision candidates will be available Sunday, March 29 at 7:00 p.m. Eastern Time.',
    statusLastPosted: 'March 15, 2026',
    statusLinkLabel: 'View Status >>',
    decision: 'deny'
  },
  stanford: {
    slug: 'stanford',
    schoolName: 'Stanford University',
    logoPrimary: 'Stanford',
    logoSecondary: 'UNDERGRADUATE ADMISSION',
    primaryColor: '#8C1515',
    admissionsId: 'S-2026-004321',
    financialAidId: 'FA-S-123456',
    bannerText: 'Thank you for submitting your application to Stanford University.',
    noticeText:
      'Admission decisions for first-year applicants will be available Friday, March 27 at 4:00 p.m. Pacific Time.',
    statusLastPosted: 'March 14, 2026',
    statusLinkLabel: 'View Admission Decision >>',
    decision: 'deny'
  },
  mit: {
    slug: 'mit',
    schoolName: 'Massachusetts Institute of Technology',
    logoPrimary: 'MIT',
    logoSecondary: 'UNDERGRADUATE ADMISSIONS',
    primaryColor: '#A31F34',
    admissionsId: 'MIT-2026-098765',
    financialAidId: 'FA-MIT-246810',
    bannerText: 'Thank you for applying to the Massachusetts Institute of Technology.',
    noticeText:
      'MIT Admissions decisions will be posted in your MyMIT account on Pi Day at 6:28 p.m. ET.',
    statusLastPosted: 'March 14, 2026',
    statusLinkLabel: 'View Your Decision >>',
    decision: 'deny'
  },
  princeton: {
    slug: 'princeton',
    schoolName: 'Princeton University',
    logoPrimary: 'Princeton',
    logoSecondary: 'UNIVERSITY ADMISSION',
    primaryColor: '#FF8F00',
    admissionsId: 'P-2026-112233',
    financialAidId: 'FA-P-987654',
    bannerText: 'Thank you for applying to Princeton University.',
    noticeText:
      'Regular Decision results for first-year applicants will be available in the applicant portal on March 28 at 7:00 p.m. ET.',
    statusLastPosted: 'March 12, 2026',
    statusLinkLabel: 'View Update >>',
    decision: 'deny'
  },
  yale: {
    slug: 'yale',
    schoolName: 'Yale College',
    logoPrimary: 'Yale',
    logoSecondary: 'UNDERGRADUATE ADMISSIONS',
    primaryColor: '#00356B',
    admissionsId: 'Y-2026-334455',
    financialAidId: 'FA-Y-556677',
    bannerText: 'Thank you for completing your application to Yale College.',
    noticeText:
      'Your Yale admissions decision is now available in your Yale Admissions Status Portal.',
    statusLastPosted: 'March 15, 2026',
    statusLinkLabel: 'View Status >>',
    decision: 'admit'
  },
  columbia: {
    slug: 'columbia',
    schoolName: 'Columbia University',
    logoPrimary: 'Columbia',
    logoSecondary: 'UNDERGRADUATE ADMISSIONS',
    primaryColor: '#003D6B',
    admissionsId: 'CU-2026-778899',
    financialAidId: 'FA-CU-001122',
    bannerText: 'Thank you for applying to Columbia University in the City of New York.',
    noticeText:
      'Admission decisions are now available in your applicant status page. Please log in to view your decision.',
    statusLastPosted: 'March 13, 2026',
    statusLinkLabel: 'View Decision >>',
    decision: 'admit'
  },
  uchicago: {
    slug: 'uchicago',
    schoolName: 'The University of Chicago',
    logoPrimary: 'UChicago',
    logoSecondary: 'COLLEGE ADMISSIONS',
    primaryColor: '#800000',
    admissionsId: 'UC-2026-135790',
    financialAidId: 'FA-UC-246802',
    bannerText: 'Thank you for applying to the College at the University of Chicago.',
    noticeText:
      'A decision has been posted to your UChicago Account. For security reasons, decisions are not released by email or telephone.',
    statusLastPosted: 'March 16, 2026',
    statusLinkLabel: 'View Your UChicago Decision >>',
    decision: 'admit'
  },
  upenn: {
    slug: 'upenn',
    schoolName: 'University of Pennsylvania',
    logoPrimary: 'Penn',
    logoSecondary: 'UNDERGRADUATE ADMISSIONS',
    primaryColor: '#011F5B',
    admissionsId: 'PENN-2026-975310',
    financialAidId: 'FA-PENN-112244',
    bannerText: 'Thank you for applying to the University of Pennsylvania.',
    noticeText:
      'Your admissions decision is now available in your Penn Applicant Portal. Please log in using your existing credentials.',
    statusLastPosted: 'March 13, 2026',
    statusLinkLabel: 'View Status >>',
    decision: 'deny'
  },
  caltech: {
    slug: 'caltech',
    schoolName: 'California Institute of Technology',
    logoPrimary: 'Caltech',
    logoSecondary: 'UNDERGRADUATE ADMISSIONS',
    primaryColor: '#FF6C0C',
    admissionsId: 'CIT-2026-555111',
    financialAidId: 'FA-CIT-333777',
    bannerText: 'Thank you for applying to the California Institute of Technology.',
    noticeText:
      'Caltech admissions decisions for first-year applicants are now available via the Beaver Breakroom portal.',
    statusLastPosted: 'March 14, 2026',
    statusLinkLabel: 'View Caltech Decision >>',
    decision: 'deny'
  },
  duke: {
    slug: 'duke',
    schoolName: 'Duke University',
    logoPrimary: 'Duke',
    logoSecondary: 'UNDERGRADUATE ADMISSIONS',
    primaryColor: '#00539B',
    admissionsId: 'DUKE-2026-123456',
    financialAidId: 'FA-DUKE-987654',
    bannerText: 'Thank you for submitting your application to Duke University!',
    noticeText:
      'Admission decisions for Regular Decision (and deferred Early Decision) candidates will be available Thursday, March 26 at 7 p.m. Eastern Time.',
    statusLastPosted: 'December 12, 2019',
    statusLinkLabel: 'View Update >>',
    decision: 'admit'
  },
  jhu: {
    slug: 'jhu',
    schoolName: 'Johns Hopkins University',
    logoPrimary: 'Johns Hopkins',
    logoSecondary: 'UNDERGRADUATE ADMISSIONS',
    primaryColor: '#002D72',
    admissionsId: 'JHU-2026-441122',
    financialAidId: 'FA-JHU-889900',
    bannerText: 'Thank you for applying to Johns Hopkins University.',
    noticeText:
      'Admission decisions are now available in your Johns Hopkins applicant portal.',
    statusLastPosted: 'March 15, 2026',
    statusLinkLabel: 'View Admissions Decision >>',
    decision: 'admit'
  },
  northwestern: {
    slug: 'northwestern',
    schoolName: 'Northwestern University',
    logoPrimary: 'Northwestern',
    logoSecondary: 'UNDERGRADUATE ADMISSION',
    primaryColor: '#4E2A84',
    admissionsId: 'NU-2026-667788',
    financialAidId: 'FA-NU-334455',
    bannerText: 'Thank you for applying to Northwestern University.',
    noticeText:
      'Your Northwestern admissions decision is now available in your applicant portal.',
    statusLastPosted: 'March 17, 2026',
    statusLinkLabel: 'View Status >>',
    decision: 'admit'
  },
  dartmouth: {
    slug: 'dartmouth',
    schoolName: 'Dartmouth College',
    logoPrimary: 'Dartmouth',
    logoSecondary: 'OFFICE OF ADMISSIONS',
    primaryColor: '#00693E',
    admissionsId: 'DC-2026-220011',
    financialAidId: 'FA-DC-880044',
    bannerText: 'Thank you for applying to Dartmouth College.',
    noticeText:
      'A decision has been posted to your Dartmouth applicant portal. Please log in to view it.',
    statusLastPosted: 'March 16, 2026',
    statusLinkLabel: 'View Decision >>',
    decision: 'admit'
  },
  brown: {
    slug: 'brown',
    schoolName: 'Brown University',
    logoPrimary: 'Brown',
    logoSecondary: 'UNDERGRADUATE ADMISSIONS',
    primaryColor: '#4E3629',
    admissionsId: 'BR-2026-909090',
    financialAidId: 'FA-BR-303030',
    bannerText: 'Thank you for applying to Brown University.',
    noticeText:
      'Your Brown decision is now available via your Brown Applicant Portal. Please sign in to view your admission decision.',
    statusLastPosted: 'March 15, 2026',
    statusLinkLabel: 'View Status >>',
    decision: 'deny'
  },
  vanderbilt: {
    slug: 'vanderbilt',
    schoolName: 'Vanderbilt University',
    logoPrimary: 'Vanderbilt',
    logoSecondary: 'UNDERGRADUATE ADMISSIONS',
    primaryColor: '#B89D4F',
    admissionsId: 'VU-2026-505050',
    financialAidId: 'FA-VU-252525',
    bannerText: 'Thank you for applying to Vanderbilt University.',
    noticeText:
      'Your Vanderbilt admissions decision is now available via your MyAppVU portal.',
    statusLastPosted: 'March 17, 2026',
    statusLinkLabel: 'View Decision >>',
    decision: 'admit'
  },
  rice: {
    slug: 'rice',
    schoolName: 'Rice University',
    logoPrimary: 'Rice',
    logoSecondary: 'OFFICE OF ADMISSION',
    primaryColor: '#00205B',
    admissionsId: 'RU-2026-606060',
    financialAidId: 'FA-RU-161616',
    bannerText: 'Thank you for applying to Rice University.',
    noticeText:
      'Rice admission decisions are available in your Rice Admission Student Portal.',
    statusLastPosted: 'March 16, 2026',
    statusLinkLabel: 'View Status >>',
    decision: 'admit'
  },
  wustl: {
    slug: 'wustl',
    schoolName: 'Washington University in St. Louis',
    logoPrimary: 'WashU',
    logoSecondary: 'UNDERGRADUATE ADMISSIONS',
    primaryColor: '#295F2D',
    admissionsId: 'WU-2026-707070',
    financialAidId: 'FA-WU-191919',
    bannerText: 'Thank you for applying to Washington University in St. Louis.',
    noticeText:
      'A status update has been posted to your WashU Pathway portal. Please log in to view your decision.',
    statusLastPosted: 'March 18, 2026',
    statusLinkLabel: 'View Update >>',
    decision: 'admit'
  },
  cornell: {
    slug: 'cornell',
    schoolName: 'Cornell University',
    logoPrimary: 'Cornell',
    logoSecondary: 'UNDERGRADUATE ADMISSIONS',
    primaryColor: '#B31B1B',
    admissionsId: 'CU-2026-818181',
    financialAidId: 'FA-CU-272727',
    bannerText: 'Thank you for applying to Cornell University.',
    noticeText:
      'Your admission decision is now available in your Cornell application status page.',
    statusLastPosted: 'March 15, 2026',
    statusLinkLabel: 'View Status >>',
    decision: 'deny'
  },
  ucla: {
    slug: 'ucla',
    schoolName: 'University of California, Los Angeles',
    logoPrimary: 'UCLA',
    logoSecondary: 'UNDERGRADUATE ADMISSIONS',
    primaryColor: '#2774AE',
    admissionsId: 'UCLA-2026-929292',
    financialAidId: 'FA-UCLA-282828',
    bannerText: 'Thank you for applying to the University of California, Los Angeles.',
    noticeText:
      'Your UCLA admission decision has been posted to the UCLA Applicant Portal.',
    statusLastPosted: 'March 20, 2026',
    statusLinkLabel: 'View Decision >>',
    decision: 'admit'
  },
  ucberkeley: {
    slug: 'ucberkeley',
    schoolName: 'University of California, Berkeley',
    logoPrimary: 'Berkeley',
    logoSecondary: 'OFFICE OF UNDERGRADUATE ADMISSIONS',
    primaryColor: '#003262',
    admissionsId: 'UCB-2026-737373',
    financialAidId: 'FA-UCB-292929',
    bannerText: 'Thank you for applying to the University of California, Berkeley.',
    noticeText:
      'Your UC Berkeley admission decision is now available in the MAP@Berkeley portal.',
    statusLastPosted: 'March 20, 2026',
    statusLinkLabel: 'View Status >>',
    decision: 'admit'
  }
};
