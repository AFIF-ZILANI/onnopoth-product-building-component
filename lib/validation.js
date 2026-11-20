/**
 * Validation shared by the browser forms and the API routes, so both always
 * agree. Returns normalised data plus Bangla error messages keyed by field.
 * Length limits match the database CHECK constraints in supabase/migrations.
 */

// Bangladeshi mobile numbers: 013–019 followed by 8 digits.
export const PHONE_RE = /^01[3-9]\d{8}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^https?:\/\/[^\s]+$/i;
const GITHUB_REPO_RE = /^https?:\/\/(www\.)?github\.com\/[^\s/]+\/[^\s/]+/i;
// GitHub's own rule: letters, digits and single hyphens, not at either end, max 39.
const GITHUB_USER_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export const LIMITS = {
  fullName: 120,
  teamName: 120,
  member: 120,
  institution: 200,
  className: 120,
  productName: 160,
  long: 4000,
  problemMin: 20,
  featuresMin: 10,
};

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const INVISIBLE = /[​-‍⁠﻿]/g;

export const clean = (v) => (typeof v === 'string' ? v.normalize('NFC').replace(INVISIBLE, '').trim() : '');
/** Single-line text: also collapses runs of whitespace. */
export const cleanLine = (v) => clean(v).replace(/\s+/g, ' ');

/** "+88 017-1234 5678", "০১৭১২৩৪৫৬৭৮" → "01712345678". */
export function normalisePhone(v) {
  let digits = clean(v).replace(/[০-৯]/g, (d) => BN_DIGITS.indexOf(d)).replace(/\D/g, '');
  if (digits.startsWith('0088')) digits = digits.slice(4);
  else if (digits.startsWith('88') && digits.length === 13) digits = digits.slice(2);
  return digits;
}

/** "https://github.com/rahim/repo", "@rahim" → "rahim". */
export function normaliseGithub(v) {
  let s = clean(v).replace(/^@/, '');
  const m = s.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#\s]+)/i);
  if (m) s = m[1];
  return s.replace(/\/+$/, '');
}

const COMMON_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'live.com'];

function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/** "rahim@gmial.con" → "rahim@gmail.com" (or null when it looks fine). */
export function suggestEmail(email) {
  const [user, domain] = String(email).toLowerCase().split('@');
  if (!user || !domain || COMMON_DOMAINS.includes(domain)) return null;
  const best = COMMON_DOMAINS.map((d) => [d, distance(domain, d)]).sort((a, b) => a[1] - b[1])[0];
  return best && best[1] > 0 && best[1] <= 2 ? `${user}@${best[0]}` : null;
}

const tooLong = (v, n) => [...v].length > n;
const bn = (n) => String(n).replace(/\d/g, (d) => BN_DIGITS[d]);

export function validateRegistration(body = {}) {
  const errors = {};
  const type = clean(body.registrationType);
  const isTeam = type === 'team';
  const rawMembers = Array.isArray(body.members) ? body.members.slice(0, 3).map(cleanLine) : [];
  const leaderIndex = Number.isInteger(body.teamLeader) && body.teamLeader >= 0 && body.teamLeader < 3 ? body.teamLeader : 0;
  const members = rawMembers.filter(Boolean);
  const fullName = isTeam ? rawMembers[leaderIndex] || members[0] || '' : cleanLine(body.fullName);

  const data = {
    registrationType: type,
    fullName,
    teamName: isTeam ? cleanLine(body.teamName) : '',
    members: isTeam ? members : [],
    institution: cleanLine(body.institution),
    className: cleanLine(body.className),
    whatsapp: normalisePhone(body.whatsapp),
    email: clean(body.email).toLowerCase(),
    github: normaliseGithub(body.github),
    productName: cleanLine(body.productName),
    problem: clean(body.problem),
    users: clean(body.users),
    features: clean(body.features),
    agree: body.agree === true,
  };

  const need = (key, ok, message) => {
    if (!errors[key] && !ok) errors[key] = message;
  };

  need('registrationType', ['solo', 'team'].includes(type), 'একা নাকি টিমে — একটি বেছে নাও।');

  if (isTeam) {
    need('teamName', data.teamName, 'টিমের একটা নাম দাও।');
    need('teamName', !tooLong(data.teamName, LIMITS.teamName), `টিমের নাম ${bn(LIMITS.teamName)} অক্ষরের মধ্যে রাখো।`);
    need('members', members.length >= 2, members.length === 1 ? 'টিমে অন্তত ২ জন লাগবে। একা হলে উপরে “একা” বেছে নাও।' : 'টিমের সদস্যদের নাম লেখো (অন্তত ২ জন)।');
    const lower = members.map((m) => m.toLowerCase());
    need('members', new Set(lower).size === lower.length, 'একই নাম দুবার লেখা হয়েছে।');
    need('members', !members.some((m) => tooLong(m, LIMITS.member)), `প্রতিটি নাম ${bn(LIMITS.member)} অক্ষরের মধ্যে রাখো।`);
  } else {
    need('fullName', data.fullName, 'তোমার পুরো নাম লেখো।');
    need('fullName', !tooLong(data.fullName, LIMITS.fullName), `নাম ${bn(LIMITS.fullName)} অক্ষরের মধ্যে রাখো।`);
  }

  need('institution', data.institution, 'তোমার স্কুল, কলেজ বা বিশ্ববিদ্যালয়ের নাম লেখো।');
  need('institution', !tooLong(data.institution, LIMITS.institution), `প্রতিষ্ঠানের নাম ${bn(LIMITS.institution)} অক্ষরের মধ্যে রাখো।`);
  need('className', data.className, 'শ্রেণি বা সেমিস্টার লেখো (যেমন: Class 12, 3rd Semester)।');
  need('className', !tooLong(data.className, LIMITS.className), `${bn(LIMITS.className)} অক্ষরের মধ্যে রাখো।`);

  need('whatsapp', data.whatsapp, 'WhatsApp নম্বর দাও।');
  need('whatsapp', data.whatsapp.length === 11, `নম্বরে ১১টি সংখ্যা থাকতে হবে (এখন ${bn(data.whatsapp.length)}টি)। যেমন: 01712345678`);
  need('whatsapp', PHONE_RE.test(data.whatsapp), 'এটি বাংলাদেশি মোবাইল নম্বর মনে হচ্ছে না। 013–019 দিয়ে শুরু হতে হবে।');

  need('email', data.email, 'ইমেইল ঠিকানা দাও — কনফার্মেশন এখানেই যাবে।');
  need('email', EMAIL_RE.test(data.email) && data.email.length <= 254, 'ইমেইল ঠিকানাটি সঠিক নয় (যেমন: name@gmail.com)।');

  need('github', data.github, 'GitHub ইউজারনেম দাও। অ্যাকাউন্ট না থাকলে github.com-এ ফ্রি খুলে নাও।');
  need('github', GITHUB_USER_RE.test(data.github), 'GitHub ইউজারনেমে শুধু ইংরেজি অক্ষর, সংখ্যা ও হাইফেন (-) থাকে, সর্বোচ্চ ৩৯ অক্ষর।');

  need('productName', data.productName, 'প্রোডাক্টের একটা নাম দাও (পরে বদলানো যাবে)।');
  need('productName', !tooLong(data.productName, LIMITS.productName), `নাম ${bn(LIMITS.productName)} অক্ষরের মধ্যে রাখো।`);

  need('problem', data.problem, 'কোন সমস্যার সমাধান করবে তা লেখো।');
  need('problem', [...data.problem].length >= LIMITS.problemMin, `আরেকটু বিস্তারিত লেখো (অন্তত ${bn(LIMITS.problemMin)} অক্ষর) — কে, কী সমস্যায় পড়ছে?`);
  need('users', data.users, 'কারা এটি ব্যবহার করবে তা লেখো।');
  need('features', data.features, 'প্রধান ফিচারগুলো লেখো।');
  need('features', [...data.features].length >= LIMITS.featuresMin, `অন্তত ২–৩টি ফিচার লেখো (কমপক্ষে ${bn(LIMITS.featuresMin)} অক্ষর)।`);
  for (const k of ['problem', 'users', 'features']) need(k, !tooLong(data[k], LIMITS.long), `লেখাটি ${bn(LIMITS.long)} অক্ষরের মধ্যে রাখো।`);

  need('agree', data.agree, 'জমা দেওয়ার আগে রুলবুক পড়ে টিক দাও।');

  return { data, errors };
}

export function validateSubmission(body = {}) {
  const errors = {};
  const data = {
    name: cleanLine(body.name),
    productName: cleanLine(body.productName),
    platform: clean(body.platform) || 'github',
    githubUrl: clean(body.githubUrl),
    liveUrl: clean(body.liveUrl),
    demoUrl: clean(body.demoUrl),
    aiTools: clean(body.aiTools),
    timeSpent: cleanLine(body.timeSpent),
    readme: body.readme === true,
    agree: body.agree === true,
  };
  const needsGithub = data.platform === 'github';
  if (!needsGithub) data.githubUrl = '';

  if (!['github', 'lovable', 'v0'].includes(data.platform)) errors.platform = 'বিল্ড প্ল্যাটফর্ম নির্বাচন করুন।';
  if (!data.name) errors.name = 'নাম বা টিমের নাম লিখুন।';
  if (!data.productName) errors.productName = 'প্রোডাক্টের নাম লিখুন।';
  if (needsGithub && !GITHUB_REPO_RE.test(data.githubUrl)) errors.githubUrl = 'সঠিক GitHub repository লিংক দিন (github.com/...)।';
  if (!URL_RE.test(data.liveUrl)) errors.liveUrl = 'সঠিক লাইভ লিংক দিন (https://...)।';
  if (data.demoUrl && !URL_RE.test(data.demoUrl)) errors.demoUrl = 'সঠিক ডেমো ভিডিও লিংক দিন।';
  if (!data.aiTools) errors.aiTools = 'কোন AI টুল কীভাবে ব্যবহার করেছেন তা লিখুন।';
  if (needsGithub && !data.readme) errors.readme = 'README যোগ করার নিশ্চিতকরণ আবশ্যক।';
  if (!data.agree) errors.agree = 'নিয়ম মেনে জমা দেওয়ার নিশ্চিতকরণ আবশ্যক।';
  for (const k of ['githubUrl', 'liveUrl', 'demoUrl']) if (!errors[k] && tooLong(data[k], 500)) errors[k] = 'লিংকটি অনেক বড়।';
  if (!errors.aiTools && tooLong(data.aiTools, LIMITS.long)) errors.aiTools = 'লেখাটি অনেক বড়।';
  if (!errors.name && tooLong(data.name, LIMITS.productName)) errors.name = 'লেখাটি অনেক বড়।';
  if (!errors.productName && tooLong(data.productName, LIMITS.productName)) errors.productName = 'লেখাটি অনেক বড়।';
  if (tooLong(data.timeSpent, 120)) errors.timeSpent = 'লেখাটি অনেক বড়।';
  return { data, errors };
}

/** Admin results input: up to ten rows with place, name, email and product. */
export function validateResults(rows) {
  if (!Array.isArray(rows)) return { error: 'ফলাফলের তালিকা সঠিক নয়।' };
  if (rows.length > 10) return { error: 'সর্বোচ্চ ১০টি স্থান প্রকাশ করা যায়।' };
  const out = [];
  for (const [i, r] of rows.entries()) {
    const row = {
      rank: i + 1,
      place: cleanLine(r?.place) || `${i + 1}`,
      registrationId: Number.isInteger(r?.registrationId) ? r.registrationId : null,
      name: cleanLine(r?.name),
      email: clean(r?.email).toLowerCase(),
      product: cleanLine(r?.product),
      institution: cleanLine(r?.institution),
      marks: r?.marks === '' || r?.marks == null ? null : Number(r.marks),
    };
    if (!row.name || !row.product || !EMAIL_RE.test(row.email)) return { error: `${i + 1} নম্বর সারিতে নাম, প্রোডাক্ট ও সঠিক ইমেইল আবশ্যক।` };
    if (row.place.length > 40) return { error: `${i + 1} নম্বর সারির স্থানের নাম অনেক বড়।` };
    if (row.marks != null && (!Number.isInteger(row.marks) || row.marks < 0 || row.marks > 100)) return { error: `${i + 1} নম্বর সারির নম্বর ০–১০০ এর মধ্যে হতে হবে।` };
    out.push(row);
  }
  return { rows: out };
}
