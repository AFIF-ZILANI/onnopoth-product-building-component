/**
 * POST /api/submit
 * ---------------------------------------------------------------------------
 * Receives a finished project from a competitor and emails it to the
 * organizer. Mirrors the registration route: honeypot, IP rate limit,
 * server-side validation, deadline check and a best-effort confirmation.
 */

import nodemailer from 'nodemailer';
import { event, isSubmissionOpen } from '@/lib/config';
import { isApprovalToken, verifyToken } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const rateStore = new Map();

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

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown-ip';
}

function esc(value) {
  return clean(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/[^\s]+$/i;
const GITHUB_RE = /^https?:\/\/(www\.)?github\.com\/[^\s/]+\/[^\s/]+/i;

function validate(data) {
  const errors = {};
  const needsGithub = data.platform === 'github';
  if (!['github', 'lovable', 'v0'].includes(data.platform)) {
    errors.platform = 'বিল্ড প্ল্যাটফর্ম নির্বাচন করুন।';
  }
  if (!clean(data.name)) errors.name = 'নাম বা টিমের নাম লিখুন।';
  if (!EMAIL_RE.test(clean(data.email))) errors.email = 'সঠিক ইমেইল ঠিকানা দিন।';
  if (!clean(data.productName)) errors.productName = 'প্রোডাক্টের নাম লিখুন।';
  if (needsGithub && !GITHUB_RE.test(clean(data.githubUrl))) {
    errors.githubUrl = 'সঠিক GitHub repository লিংক দিন (github.com/...)।';
  }
  if (!URL_RE.test(clean(data.liveUrl))) errors.liveUrl = 'সঠিক লাইভ লিংক দিন (https://...)।';
  if (clean(data.demoUrl) && !URL_RE.test(clean(data.demoUrl))) {
    errors.demoUrl = 'সঠিক ডেমো ভিডিও লিংক দিন।';
  }
  if (!clean(data.aiTools)) errors.aiTools = 'কোন AI টুল কীভাবে ব্যবহার করেছেন তা লিখুন।';
  if (needsGithub && data.readme !== true) errors.readme = 'README যোগ করার নিশ্চিতকরণ আবশ্যক।';
  if (data.agree !== true) errors.agree = 'নিয়ম মেনে জমা দেওয়ার নিশ্চিতকরণ আবশ্যক।';
  return errors;
}

function row(label, value) {
  return `<tr>
    <td style="padding:8px 0;color:#475569;font-weight:600;width:170px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;vertical-align:top;white-space:pre-wrap;word-break:break-all;">${value}</td>
  </tr>`;
}

function organizerEmail(d) {
  return `
  <div style="font-family:'Noto Sans Bengali',Arial,sans-serif;max-width:680px;margin:auto;color:#0f172a;">
    <div style="background:linear-gradient(135deg,#3b82f6,#6366f1,#a855f7);padding:22px 26px;border-radius:14px 14px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:22px;">নতুন প্রোডাক্ট জমা দেওয়া হয়েছে 🚀</h1>
      <p style="color:#e0e7ff;margin:6px 0 0;font-size:14px;">${esc(event.name)} — Final Submission</p>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 14px 14px;padding:24px 26px;">
      <table style="width:100%;border-collapse:collapse;font-size:15px;">
        ${row('নাম / টিম', esc(d.name))}
        ${row('প্রোডাক্ট', esc(d.productName))}
        ${row('ইমেইল', esc(d.email))}
        ${row('প্ল্যাটফর্ম', esc(d.platform))}
        ${d.githubUrl ? row('GitHub', `<a href="${esc(d.githubUrl)}">${esc(d.githubUrl)}</a>`) : ''}
        ${row('Live link', `<a href="${esc(d.liveUrl)}">${esc(d.liveUrl)}</a>`)}
        ${row('ডেমো ভিডিও', d.demoUrl ? `<a href="${esc(d.demoUrl)}">${esc(d.demoUrl)}</a>` : '—')}
        ${row('AI টুল ব্যবহার', esc(d.aiTools))}
        ${d.platform === 'github' ? row('README', d.readme ? 'যোগ করা হয়েছে' : 'না') : ''}
        ${row('মোট সময়', esc(d.timeSpent) || '—')}
      </table>
    </div>
  </div>`;
}

function confirmationEmail(name) {
  return `
  <div style="font-family:'Noto Sans Bengali',Arial,sans-serif;max-width:600px;margin:auto;color:#0f172a;">
    <div style="background:linear-gradient(135deg,#3b82f6,#6366f1,#a855f7);padding:22px 26px;border-radius:14px 14px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:22px;">${esc(event.name)}</h1>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 14px 14px;padding:26px;">
      <p style="font-size:16px;">অভিনন্দন, ${esc(name)}! 🎉</p>
      <p style="font-size:16px;line-height:1.8;">
        আপনার প্রোডাক্ট সফলভাবে জমা দেওয়া হয়েছে। বিচারকমণ্ডলী ২৮ নভেম্বর প্রোডাক্টগুলো যাচাই করবে এবং
        সন্ধ্যায় ফলাফল ঘোষণা করা হবে।
      </p>
      <p style="font-size:14px;color:#64748b;margin-top:24px;">— ${esc(event.organizer)} আয়োজক কমিটি</p>
    </div>
  </div>`;
}

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'অনুরোধটি পড়া যায়নি।' }, { status: 400 });
    }

    // Honeypot — silent success for bots.
    if (clean(body.website)) return Response.json({ ok: true });

    // Only participants whose idea was approved (signed link from email) may submit.
    if (!isApprovalToken(body.token)) {
      return Response.json(
        { error: 'আপনার আইডিয়া এখনো অ্যাপ্রুভ হয়নি বা লিংকটি মেয়াদোত্তীর্ণ।' },
        { status: 403 }
      );
    }

    if (!isSubmissionOpen()) {
      return Response.json(
        { error: 'জমা দেওয়ার সময় শেষ হয়ে গেছে।' },
        { status: 403 }
      );
    }

    if (isRateLimited(getClientIp(req))) {
      return Response.json(
        { error: 'অনেকগুলো চেষ্টা করেছেন। কিছুক্ষণ পর আবার চেষ্টা করুন।' },
        { status: 429 }
      );
    }

    const data = {
      name: clean(body.name),
      email: clean(body.email),
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

    const errors = validate(data);
    if (Object.keys(errors).length > 0) {
      return Response.json(
        { error: 'অনুগ্রহ করে সব ঘর সঠিকভাবে পূরণ করুন।', fields: errors },
        { status: 400 }
      );
    }

    const { GMAIL_USER, GMAIL_APP_PASSWORD, RECEIVER_EMAIL } = process.env;
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !RECEIVER_EMAIL) {
      return Response.json(
        { error: 'ইমেইল সার্ভার সেটআপ করা নেই। আয়োজকের সাথে যোগাযোগ করুন।' },
        { status: 500 }
      );
    }

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

    await transporter.sendMail({
      from: `"${event.shortName}" <${GMAIL_USER}>`,
      to: RECEIVER_EMAIL,
      replyTo: data.email,
      subject: `New Submission: ${data.productName} – ${data.name}`,
      html: organizerEmail(data),
      text: `New Submission\n\nProduct: ${data.productName}\nTeam: ${data.name}\nGitHub: ${data.githubUrl}\nLive: ${data.liveUrl}`,
    });

    try {
      await transporter.sendMail({
        from: `"${event.shortName}" <${GMAIL_USER}>`,
        to: data.email,
        subject: 'আপনার প্রোডাক্ট জমা দেওয়া হয়েছে',
        html: confirmationEmail(data.name),
      });
    } catch (error) {
      console.warn('Submission confirmation failed (submission still saved):', error.message);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Submission error:', error);
    return Response.json(
      { error: 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
