/**
 * POST /api/register
 * ---------------------------------------------------------------------------
 * • Validates the registration on the server (never trust the browser).
 * • Blocks spam with a hidden honeypot + a simple in-memory IP rate limit.
 * • Sends a formatted HTML email to the organizer (RECEIVER_EMAIL).
 * • Sends a Bangla confirmation email to the participant. If this second
 *   email fails, the registration still succeeds.
 *
 * Email credentials are read ONLY here, on the server, from env variables.
 * They are never imported into any client component.
 */

import nodemailer from 'nodemailer';
import { isRegistrationOpen, event } from '@/lib/config';
import { eventIcs } from '@/lib/calendar';

// Force the Node.js runtime (Nodemailer needs Node APIs, not Edge).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// --- Simple in-memory rate limiter -----------------------------------------
// NOTE: Serverless functions can restart, so this is best-effort only (which
// is fine for a student competition). A database/Redis can replace it later.
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 5; // max submissions per IP per window
const rateStore = new Map(); // ip -> { count, resetAt }

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_MAX;
}

// --- Tiny helpers -----------------------------------------------------------
function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown-ip';
}

// Escape user input before dropping it into an HTML email (avoid broken HTML
// and basic injection).
function esc(value) {
  return clean(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Bangladesh mobile format: 01XXXXXXXXX (01 + 9 digits = 11 digits).
const PHONE_RE = /^01\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Server-side validation -------------------------------------------------
function validate(data) {
  const errors = {};
  const isTeam = data.registrationType === 'team';

  if (!['solo', 'team'].includes(data.registrationType)) {
    errors.registrationType = 'রেজিস্ট্রেশনের ধরন নির্বাচন করুন।';
  }

  const leaderName = isTeam
    ? clean(data.members?.[data.teamLeader]) || clean(data.members?.[0])
    : clean(data.fullName);

  if (!leaderName) errors.fullName = 'নাম আবশ্যক।';

  if (isTeam) {
    const members = (data.members || []).map(clean).filter(Boolean);
    if (members.length === 0) errors.members = 'কমপক্ষে একজন সদস্যের নাম লিখুন।';
    if (members.length > 3) errors.members = 'সর্বোচ্চ ৩ জন সদস্য হতে পারে।';
    if (!clean(data.teamName)) errors.teamName = 'টিমের নাম আবশ্যক।';
  }

  if (!clean(data.institution)) errors.institution = 'প্রতিষ্ঠানের নাম আবশ্যক।';
  if (!clean(data.className)) errors.className = 'শ্রেণি/সেমিস্টার আবশ্যক।';

  const phoneDigits = clean(data.whatsapp).replace(/[\s-]/g, '');
  if (!PHONE_RE.test(phoneDigits)) {
    errors.whatsapp = 'সঠিক WhatsApp নম্বর দিন (01XXXXXXXXX)।';
  }

  if (!EMAIL_RE.test(clean(data.email))) {
    errors.email = 'সঠিক ইমেইল ঠিকানা দিন।';
  }

  if (!clean(data.github)) errors.github = 'GitHub ইউজারনেম আবশ্যক।';
  if (!clean(data.productName)) errors.productName = 'প্রোডাক্টের নাম আবশ্যক।';
  if (!clean(data.problem)) errors.problem = 'কোন সমস্যার সমাধান করবে তা লিখুন।';
  if (!clean(data.users)) errors.users = 'কারা এটি ব্যবহার করবে তা লিখুন।';
  if (!clean(data.features)) errors.features = 'প্রধান ফিচারগুলো লিখুন।';
  if (data.agree !== true) {
    errors.agree = 'রুলবুক পড়ার নিশ্চিতকরণ আবশ্যক।';
  }

  return { errors, leaderName };
}

// --- Email templates --------------------------------------------------------
function buildOrganizerEmail(d, leaderName, isTeam) {
  const membersHtml = isTeam
    ? `<tr>
         <td style="padding:8px 0;color:#475569;font-weight:600;">টিমের সদস্য</td>
         <td style="padding:8px 0;">${(d.members || [])
           .map(clean)
           .filter(Boolean)
           .map((m, i) => `${i + 1}. ${esc(m)}`)
           .join('<br/>')}</td>
       </tr>
       <tr>
         <td style="padding:8px 0;color:#475569;font-weight:600;">টিম লিডার</td>
         <td style="padding:8px 0;">${esc(leaderName)}</td>
       </tr>`
    : '';

  const teamNameHtml = isTeam
    ? `<tr>
         <td style="padding:8px 0;color:#475569;font-weight:600;">টিমের নাম</td>
         <td style="padding:8px 0;">${esc(d.teamName) || '—'}</td>
       </tr>`
    : '';

  const row = (label, value) => `
    <tr>
      <td style="padding:8px 0;color:#475569;font-weight:600;width:170px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;vertical-align:top;white-space:pre-wrap;">${value}</td>
    </tr>`;

  return `
  <div style="font-family:'Noto Sans Bengali',Arial,sans-serif;max-width:680px;margin:auto;color:#0f172a;">
    <div style="background:linear-gradient(135deg,#3b82f6,#6366f1,#a855f7);padding:22px 26px;border-radius:14px 14px 0 0;">
      <h1 style="color:#ffffff;margin:0;font-size:22px;">নতুন রেজিস্ট্রেশন 🎉</h1>
      <p style="color:#e0e7ff;margin:6px 0 0;font-size:14px;">${esc(event.name)} — ${esc(event.organizer)}</p>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 14px 14px;padding:24px 26px;">
      <table style="width:100%;border-collapse:collapse;font-size:15px;">
        ${row('ধরন', isTeam ? 'টিম' : 'একা (Solo)')}
        ${row('নাম', esc(leaderName))}
        ${teamNameHtml}
        ${membersHtml}
        ${row('প্রতিষ্ঠান', esc(d.institution))}
        ${row('শ্রেণি/সেমিস্টার', esc(d.className))}
        ${row('WhatsApp', esc(d.whatsapp))}
        ${row('ইমেইল', esc(d.email))}
        ${row('GitHub', esc(d.github))}
        ${row('প্রোডাক্টের নাম', esc(d.productName))}
        ${row('কোন সমস্যা সমাধান করবে', esc(d.problem))}
        ${row('কারা ব্যবহার করবে', esc(d.users))}
        ${row('প্রধান ৩–৫টি ফিচার', esc(d.features))}
      </table>
      <p style="margin-top:22px;font-size:12px;color:#94a3b8;">
        Reply করলে participant-এর কাছে যাবে (replyTo সেট করা আছে)।
      </p>
    </div>
  </div>`;
}

function buildConfirmationEmail(name) {
  return `
  <div style="font-family:'Noto Sans Bengali',Arial,sans-serif;max-width:600px;margin:auto;color:#0f172a;">
    <div style="background:linear-gradient(135deg,#3b82f6,#6366f1,#a855f7);padding:22px 26px;border-radius:14px 14px 0 0;">
      <h1 style="color:#ffffff;margin:0;font-size:22px;">${esc(event.name)}</h1>
      <p style="color:#e0e7ff;margin:6px 0 0;font-size:14px;">${esc(event.organizer)} · ${esc(event.mode)}</p>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 14px 14px;padding:26px;">
      <p style="font-size:16px;">অভিনন্দন, ${esc(name)}! 👋</p>
      <p style="font-size:16px;line-height:1.8;">
        আপনার রেজিস্ট্রেশন গ্রহণ করা হয়েছে। ২৫ নভেম্বর কনফার্মড তালিকা ঘোষণা করা হবে।
      </p>
      <p style="font-size:15px;line-height:1.8;color:#475569;">
        আগে থেকেই GitHub ও Vercel অ্যাকাউন্ট তৈরি করে রাখতে ভুলবেন না। কোড লেখা শুরু করতে হবে
        ২৭ নভেম্বর সকাল ১০টার পরে। শুভেচ্ছা রইলো!
      </p>
      <p style="font-size:14px;color:#64748b;margin-top:24px;">
        — ${esc(event.organizer)} আয়োজক কমিটি
      </p>
    </div>
  </div>`;
}

// --- Route handler ----------------------------------------------------------
export async function POST(req) {
  try {
    // 1) Honeypot — bots usually fill every field. Pretend success, send nothing.
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'অনুরোধটি পড়া যায়নি।' }, { status: 400 });
    }

    if (clean(body.website)) {
      // Silent success for spammers.
      return Response.json({ ok: true });
    }

    // 2) Deadline check (server-side, authoritative).
    if (!isRegistrationOpen()) {
      return Response.json(
        { error: 'রেজিস্ট্রেশনের সময় শেষ হয়ে গেছে।' },
        { status: 403 }
      );
    }

    // 3) Rate limiting.
    if (isRateLimited(getClientIp(req))) {
      return Response.json(
        { error: 'অনেকগুলো চেষ্টা করেছেন। কিছুক্ষণ পর আবার চেষ্টা করুন।' },
        { status: 429 }
      );
    }

    // 4) Normalise + validate.
    const data = {
      registrationType: clean(body.registrationType),
      fullName: clean(body.fullName),
      teamName: clean(body.teamName),
      members: Array.isArray(body.members) ? body.members.slice(0, 3) : [],
      teamLeader: Number.isInteger(body.teamLeader) ? body.teamLeader : 0,
      institution: clean(body.institution),
      className: clean(body.className),
      whatsapp: clean(body.whatsapp),
      email: clean(body.email),
      github: clean(body.github),
      productName: clean(body.productName),
      problem: clean(body.problem),
      users: clean(body.users),
      features: clean(body.features),
      agree: body.agree === true,
    };

    const { errors, leaderName } = validate(data);
    if (Object.keys(errors).length > 0) {
      return Response.json(
        { error: 'অনুগ্রহ করে সব ঘর সঠিকভাবে পূরণ করুন।', fields: errors },
        { status: 400 }
      );
    }

    // 5) Mail transport — credentials come from environment variables only.
    const { GMAIL_USER, GMAIL_APP_PASSWORD, RECEIVER_EMAIL } = process.env;

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !RECEIVER_EMAIL) {
      console.error('Missing email environment variables.');
      return Response.json(
        { error: 'ইমেইল সার্ভার সেটআপ করা নেই। অনুগ্রহ করে আয়োজকের সাথে যোগাযোগ করুন।' },
        { status: 500 }
      );
    }

    // Gmail SMTP is the default. SMTP_HOST is an OPTIONAL override used only
    // for local testing with a fake SMTP server — leave it unset on Vercel.
    const smtpHost = process.env.SMTP_HOST;
    const transporter = smtpHost
      ? nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT || 1025),
          secure: false,
          auth: process.env.SMTP_USER
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
        })
      : nodemailer.createTransport({
          service: 'gmail',
          auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
        });

    const isTeam = data.registrationType === 'team';

    // 6) Main notification to the organizer.
    await transporter.sendMail({
      from: `"${event.shortName}" <${GMAIL_USER}>`,
      to: RECEIVER_EMAIL,
      replyTo: data.email,
      subject: `New Registration: ${data.productName} – ${leaderName}`,
      // Machine-readable copy of the idea so the admin panel can list every
      // submission straight from the Gmail inbox (no database needed).
      headers: {
        'X-OnnoPoth-Registration': Buffer.from(
          JSON.stringify({
            name: leaderName,
            email: data.email,
            productName: data.productName,
            registrationType: data.registrationType,
            teamName: data.teamName,
            members: data.members,
            institution: data.institution,
            className: data.className,
            whatsapp: data.whatsapp,
            github: data.github,
            problem: data.problem,
            users: data.users,
            features: data.features,
            submittedAt: new Date().toISOString(),
          })
        ).toString('base64'),
      },
      html: buildOrganizerEmail(data, leaderName, isTeam),
      text: `New Registration\n\nProduct: ${data.productName}\nName: ${leaderName}\nEmail: ${data.email}\nWhatsApp: ${data.whatsapp}\nInstitution: ${data.institution}`,
    });

    // 7) Confirmation to the participant — failure here must NOT fail the form.
    try {
      await transporter.sendMail({
        from: `"${event.shortName}" <${GMAIL_USER}>`,
        to: data.email,
        subject: 'আপনার রেজিস্ট্রেশন গ্রহণ করা হয়েছে',
        html: buildConfirmationEmail(leaderName),
        attachments: [
          {
            filename: 'onnopoth-competition.ics',
            content: eventIcs(),
            contentType: 'text/calendar',
          },
        ],
      });
    } catch (confirmError) {
      console.warn('Confirmation email failed (registration still saved):', confirmError.message);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { error: 'কিছু একটা সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
