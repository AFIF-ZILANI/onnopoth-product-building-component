/**
 * Server-side validation for every public form. Returns normalised data plus
 * a map of Bangla error messages keyed by field name (same keys the forms use).
 */
export const PHONE_RE = /^01\d{9}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/[^\s]+$/i;
const GITHUB_RE = /^https?:\/\/(www\.)?github\.com\/[^\s/]+\/[^\s/]+/i;

export const clean = (v) => (typeof v === 'string' ? v.trim() : '');
export const normalisePhone = (v) => clean(v).replace(/[\s-]/g, '');

const MAX = { short: 160, long: 4000 };
const tooLong = (v, n) => v.length > n;

export function validateRegistration(body = {}) {
  const errors = {};
  const type = clean(body.registrationType);
  const isTeam = type === 'team';
  const members = Array.isArray(body.members) ? body.members.slice(0, 3).map(clean) : [];
  const leaderIndex = Number.isInteger(body.teamLeader) && body.teamLeader >= 0 && body.teamLeader < 3 ? body.teamLeader : 0;
  const fullName = isTeam ? members[leaderIndex] || members.find(Boolean) || '' : clean(body.fullName);

  const data = {
    registrationType: type,
    fullName,
    teamName: isTeam ? clean(body.teamName) : '',
    members: isTeam ? members.filter(Boolean) : [],
    institution: clean(body.institution),
    className: clean(body.className),
    whatsapp: normalisePhone(body.whatsapp),
    email: clean(body.email).toLowerCase(),
    github: clean(body.github).replace(/^@/, ''),
    productName: clean(body.productName),
    problem: clean(body.problem),
    users: clean(body.users),
    features: clean(body.features),
    agree: body.agree === true,
  };

  if (!['solo', 'team'].includes(type)) errors.registrationType = 'রেজিস্ট্রেশনের ধরন নির্বাচন করুন।';
  if (!data.fullName) errors.fullName = 'নাম আবশ্যক।';
  if (isTeam && data.members.length === 0) errors.members = 'কমপক্ষে একজন সদস্যের নাম লিখুন।';
  if (isTeam && !data.teamName) errors.teamName = 'টিমের নাম আবশ্যক।';
  if (!data.institution) errors.institution = 'প্রতিষ্ঠানের নাম আবশ্যক।';
  if (!data.className) errors.className = 'শ্রেণি/সেমিস্টার আবশ্যক।';
  if (!PHONE_RE.test(data.whatsapp)) errors.whatsapp = 'সঠিক WhatsApp নম্বর দিন (01XXXXXXXXX)।';
  if (!EMAIL_RE.test(data.email)) errors.email = 'সঠিক ইমেইল ঠিকানা দিন।';
  if (!data.github) errors.github = 'GitHub ইউজারনেম আবশ্যক।';
  if (!data.productName) errors.productName = 'প্রোডাক্টের নাম আবশ্যক।';
  if (!data.problem) errors.problem = 'কোন সমস্যার সমাধান করবে তা লিখুন।';
  if (!data.users) errors.users = 'কারা এটি ব্যবহার করবে তা লিখুন।';
  if (!data.features) errors.features = 'প্রধান ফিচারগুলো লিখুন।';
  if (!data.agree) errors.agree = 'রুলবুক পড়ার নিশ্চিতকরণ আবশ্যক।';

  for (const k of ['fullName', 'teamName', 'institution', 'className', 'github', 'productName']) {
    if (!errors[k] && tooLong(data[k], MAX.short)) errors[k] = 'লেখাটি অনেক বড়।';
  }
  for (const k of ['problem', 'users', 'features']) {
    if (!errors[k] && tooLong(data[k], MAX.long)) errors[k] = 'লেখাটি অনেক বড় (সর্বোচ্চ ৪০০০ অক্ষর)।';
  }
  if (data.members.some((m) => tooLong(m, MAX.short))) errors.members = 'নাম অনেক বড়।';

  return { data, errors };
}

export function validateSubmission(body = {}) {
  const errors = {};
  const data = {
    name: clean(body.name),
    productName: clean(body.productName),
    platform: clean(body.platform) || 'github',
    githubUrl: clean(body.githubUrl),
    liveUrl: clean(body.liveUrl),
    demoUrl: clean(body.demoUrl),
    aiTools: clean(body.aiTools),
    timeSpent: clean(body.timeSpent),
    readme: body.readme === true,
    agree: body.agree === true,
  };
  const needsGithub = data.platform === 'github';
  if (!needsGithub) data.githubUrl = '';

  if (!['github', 'lovable', 'v0'].includes(data.platform)) errors.platform = 'বিল্ড প্ল্যাটফর্ম নির্বাচন করুন।';
  if (!data.name) errors.name = 'নাম বা টিমের নাম লিখুন।';
  if (!data.productName) errors.productName = 'প্রোডাক্টের নাম লিখুন।';
  if (needsGithub && !GITHUB_RE.test(data.githubUrl)) errors.githubUrl = 'সঠিক GitHub repository লিংক দিন (github.com/...)।';
  if (!URL_RE.test(data.liveUrl)) errors.liveUrl = 'সঠিক লাইভ লিংক দিন (https://...)।';
  if (data.demoUrl && !URL_RE.test(data.demoUrl)) errors.demoUrl = 'সঠিক ডেমো ভিডিও লিংক দিন।';
  if (!data.aiTools) errors.aiTools = 'কোন AI টুল কীভাবে ব্যবহার করেছেন তা লিখুন।';
  if (needsGithub && !data.readme) errors.readme = 'README যোগ করার নিশ্চিতকরণ আবশ্যক।';
  if (!data.agree) errors.agree = 'নিয়ম মেনে জমা দেওয়ার নিশ্চিতকরণ আবশ্যক।';
  for (const k of ['githubUrl', 'liveUrl', 'demoUrl']) if (!errors[k] && tooLong(data[k], 500)) errors[k] = 'লিংকটি অনেক বড়।';
  if (!errors.aiTools && tooLong(data.aiTools, MAX.long)) errors.aiTools = 'লেখাটি অনেক বড়।';
  if (!errors.name && tooLong(data.name, MAX.short)) errors.name = 'লেখাটি অনেক বড়।';
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
      place: clean(r?.place) || `${i + 1}`,
      registrationId: Number.isInteger(r?.registrationId) ? r.registrationId : null,
      name: clean(r?.name),
      email: clean(r?.email).toLowerCase(),
      product: clean(r?.product),
      institution: clean(r?.institution),
      marks: r?.marks === '' || r?.marks == null ? null : Number(r.marks),
    };
    if (!row.name || !row.product || !EMAIL_RE.test(row.email)) return { error: `${i + 1} নম্বর সারিতে নাম, প্রোডাক্ট ও সঠিক ইমেইল আবশ্যক।` };
    if (row.marks != null && (!Number.isInteger(row.marks) || row.marks < 0 || row.marks > 100)) return { error: `${i + 1} নম্বর সারির নম্বর ০–১০০ এর মধ্যে হতে হবে।` };
    out.push(row);
  }
  return { rows: out };
}
