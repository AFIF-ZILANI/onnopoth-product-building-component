/**
 * ============================================================================
 *  SINGLE SOURCE OF TRUTH
 * ----------------------------------------------------------------------------
 *  Every editable value of the competition lives here: dates, deadlines,
 *  phone numbers, prizes, links and labels. Change a value here and it updates
 *  across the whole website.
 *
 *  NOTE: Secrets (GMAIL_USER, GMAIL_APP_PASSWORD, RECEIVER_EMAIL) are NOT here.
 *  They are read only on the server from environment variables so they can
 *  never be shipped to the browser.
 * ============================================================================
 */

// Event identity -------------------------------------------------------------
export const event = {
  name: 'Product Building Competition (Using AI)',
  shortName: 'Product Building Competition',
  organizer: 'OnnoPoth',
  tagline: 'AI-এর সাহায্যে আইডিয়াকে বাস্তব প্রোডাক্টে রূপ দাও',
  mode: 'Online Event',
  duration: '12 Hours',
  prizeLabel: 'Gifts for Top 3',
};

/**
 * All dates use an explicit UTC+6 (Bangladesh) offset so they are unambiguous.
 * `new Date(...)` understands the "+06:00" part automatically.
 */
export const dates = {
  // Main competition starts: 27 November 2026, 10:00 AM (UTC+6)
  competitionStart: '2026-11-27T10:00:00+06:00',
  // Competition ends: 27 November 2026, 10:00 PM (UTC+6)
  competitionEnd: '2026-11-27T22:00:00+06:00',
  // Registration closes: 23 November 2026, 11:59 PM (UTC+6)
  registrationDeadline: '2026-11-23T23:59:00+06:00',
  // Human-readable version shown in the UI.
  competitionStartLabel: '২৭ নভেম্বর ২০২৬, সকাল ১০টা (UTC+6)',
  registrationDeadlineLabel: '২৩ নভেম্বর ২০২৬, রাত ১১:৫৯ (UTC+6)',
};

// Contact --------------------------------------------------------------------
export const contact = {
  person: 'Kazi Tauhid Rana',
  phone: '01319711956',
  whatsapp: 'https://wa.me/8801319711956',
  tel: 'tel:+8801319711956',
};

// Prize cards ----------------------------------------------------------------
export const prizes = [
  { place: '1st', bangla: 'প্রথম স্থান', prize: 'Book', theme: 'gold' },
  { place: '2nd', bangla: 'দ্বিতীয় স্থান', prize: 'Book', theme: 'silver' },
  { place: '3rd', bangla: 'তৃতীয় স্থান', prize: 'Book', theme: 'bronze' },
];

// Judging criteria (must total 100) -----------------------------------------
export const judgingCriteria = [
  { label: 'আইডিয়ার মৌলিকতা ও সমস্যা সমাধান', marks: 25 },
  { label: 'প্রোডাক্ট ঠিকমতো কাজ করছে কি না', marks: 25 },
  { label: 'AI-এর কার্যকর ব্যবহার', marks: 20 },
  { label: 'UI/UX ডিজাইন', marks: 15 },
  { label: 'উপস্থাপনা ও README', marks: 10 },
  { label: 'কোডের গুণমান', marks: 5 },
];

// Submission link — replace with the real form link when it is ready.
// [SUBMISSION_LINK placeholder — keep it here, not hard-coded in the rulebook]
export const submissionLink = '[SUBMISSION_LINK]';

// Social / external links ----------------------------------------------------
export const socialLinks = {
  rulebook: '/rulebook',
  siteUrl: 'https://your-domain.vercel.app', // change to your live Vercel URL
};

// Shared navigation ----------------------------------------------------------
export const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Timeline', href: '/#timeline' },
  { label: 'Rules', href: '/#rules' },
  { label: 'Rulebook', href: '/rulebook' },
  { label: 'Register', href: '/#register' },
  { label: 'Contact', href: '/#contact' },
];

/**
 * Small helper used by BOTH the browser and the API route so the two stay in
 * sync. Returns true while registration is still open.
 */
export function isRegistrationOpen(now = Date.now()) {
  return now < new Date(dates.registrationDeadline).getTime();
}
