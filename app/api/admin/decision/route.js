/**
 * POST /api/admin/decision
 * Approve or decline an idea. Approval emails a signed one-time link that
 * unlocks the main product submission form.
 */
import nodemailer from 'nodemailer';
import { getCookieValue, isAdminSession, createApprovalToken } from '@/lib/admin';
import { event, socialLinks } from '@/lib/config';
import { eventIcs } from '@/lib/calendar';
import { clearRecordsCache } from '@/lib/gmail-store';

export const runtime = 'nodejs';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function approvalEmail(name, productName, link) {
  return `
  <div style="font-family:'Noto Sans Bengali',Arial,sans-serif;max-width:620px;margin:auto;color:#0f172a;">
    <div style="background:linear-gradient(135deg,#3b82f6,#6366f1,#a855f7);padding:22px 26px;border-radius:14px 14px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:22px;">আপনার আইডিয়া অ্যাপ্রুভ হয়েছে! 🎉</h1>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 14px 14px;padding:26px;">
      <p style="font-size:16px;">অভিনন্দন, ${escapeHtml(name)}!</p>
      <p style="font-size:15px;line-height:1.8;color:#475569;">
        <strong>${escapeHtml(productName)}</strong> প্রোডাক্টের আইডিয়া যাচাইয়ে পাস করেছে। এখন আপনি ফাইনাল প্রোডাক্ট জমা দিতে পারেন।
      </p>
      <p style="margin:26px 0 10px;font-size:14px;color:#475569;">নিচের বাটনে ক্লিক করে সাবমিশন ফর্মে যান:</p>
      <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#6366f1,#a855f7);color:#fff;text-decoration:none;padding:13px 26px;border-radius:999px;font-weight:bold;">
        প্রোডাক্ট জমা দিন →
      </a>
      <p style="margin-top:24px;font-size:12px;color:#94a3b8;">এই লিংকটি শুধু আপনার জন্য। ২৭ নভেম্বর রাত ১০টার পর কাজ করবে না।</p>
    </div>
  </div>`;
}

function declineEmail(name, productName) {
  return `
  <div style="font-family:'Noto Sans Bengali',Arial,sans-serif;max-width:620px;margin:auto;color:#0f172a;">
    <div style="background:linear-gradient(135deg,#64748b,#475569);padding:22px 26px;border-radius:14px 14px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:22px;">আইডিয়া আপডেট</h1>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 14px 14px;padding:26px;">
      <p style="font-size:16px;">প্রিয় ${escapeHtml(name)},</p>
      <p style="font-size:15px;line-height:1.8;color:#475569;">
        <strong>${escapeHtml(productName)}</strong> আইডিয়াটি এইবারের জন্য নির্বাচিত হয়নি। আপনার আগ্রহের জন্য ধন্যবাদ — পরবর্তী ইভেন্টে আবার চেষ্টা করার সুযোগ থাকবে।
      </p>
      <p style="font-size:14px;color:#64748b;margin-top:24px;">— ${escapeHtml(event.organizer)} আয়োজক কমিটি</p>
    </div>
  </div>`;
}

export async function POST(req) {
  if (!isAdminSession(getCookieValue(req.headers.get('cookie'), 'onnopoth_admin'))) {
    return Response.json({ error: 'অনুমোদন প্রয়োজন।' }, { status: 401 });
  }

  try {
    const { email, name, productName, decision } = await req.json();
    if (!email || !productName || !['approve', 'decline'].includes(decision)) {
      return Response.json({ error: 'অনুরোধটি সঠিক নয়।' }, { status: 400 });
    }

    const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      return Response.json({ error: 'ইমেইল সেটআপ করা নেই।' }, { status: 500 });
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

    const approved = decision === 'approve';
    const subject = approved
      ? `আপনার আইডিয়া অ্যাপ্রুভ হয়েছে – ${productName}`
      : `আইডিয়া আপডেট – ${productName}`;

    const mail = {
      from: `"${event.shortName}" <${GMAIL_USER}>`,
      to: email,
      subject,
      html: approved
        ? approvalEmail(
            name,
            productName,
            `${socialLinks.siteUrl}/submit?token=${encodeURIComponent(createApprovalToken(email, productName))}`
          )
        : declineEmail(name, productName),
    };

    await transporter.sendMail({
      ...mail,
      attachments: [
        {
          filename: 'onnopoth-competition.ics',
          content: eventIcs(),
          contentType: 'text/calendar',
        },
      ],
    });

    // Keep a machine-readable decision record in the organizer's own inbox so
    // the status checker and confirmed list can query it later.
    await transporter.sendMail({
      from: `"${event.shortName}" <${GMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL || GMAIL_USER,
      subject: `Decision recorded: ${decision} – ${productName}`,
      headers: {
        'X-OnnoPoth-Approval': Buffer.from(
          JSON.stringify({
            email,
            name,
            productName,
            decision,
            decidedAt: new Date().toISOString(),
          })
        ).toString('base64'),
      },
      text: `Decision recorded: ${decision}\nName: ${name}\nEmail: ${email}\nProduct: ${productName}`,
    });

    clearRecordsCache();
    return Response.json({ ok: true, decision });
  } catch (error) {
    console.error('Admin decision failed:', error.message);
    return Response.json({ error: 'ইমেইল পাঠানো যায়নি।' }, { status: 500 });
  }
}
