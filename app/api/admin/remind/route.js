/** POST /api/admin/remind — email all participants whose idea is still pending. */
import nodemailer from 'nodemailer';
import { getRecords, decisionFor } from '@/lib/gmail-store';
import { getCookieValue, isAdminSession } from '@/lib/admin';
import { event } from '@/lib/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  if (!isAdminSession(getCookieValue(req.headers.get('cookie'), 'onnopoth_admin'))) {
    return Response.json({ error: 'অনুমোদন প্রয়োজন।' }, { status: 401 });
  }

  try {
    const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      return Response.json({ error: 'ইমেইল সেটআপ করা নেই।' }, { status: 500 });
    }

    const { registrations, approvals } = await getRecords({ force: true });
    const pending = registrations.filter((r) => !decisionFor(approvals, r.email));
    if (!pending.length) return Response.json({ sent: 0 });

    const smtpHost = process.env.SMTP_HOST;
    const transporter = smtpHost
      ? nodemailer.createTransport({ host: smtpHost, port: Number(process.env.SMTP_PORT || 1025), secure: false })
      : nodemailer.createTransport({
          service: 'gmail',
          auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
        });

    let sent = 0;
    for (const person of pending) {
      try {
        await transporter.sendMail({
          from: `"${event.shortName}" <${GMAIL_USER}>`,
          to: person.email,
          subject: 'মনে করিয়ে দিচ্ছি: আইডিয়া যাচাই চলছে',
          html: `<div style="font-family:'Noto Sans Bengali',Arial,sans-serif;max-width:600px;margin:auto;color:#0f172a;">
            <div style="background:linear-gradient(135deg,#3b82f6,#6366f1,#a855f7);padding:20px;border-radius:14px 14px 0 0;">
              <h1 style="color:#fff;margin:0;font-size:20px;">${event.name}</h1>
            </div>
            <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 14px 14px;padding:24px;">
              <p>প্রিয় ${String(person.name || 'প্রতিযোগী').replace(/</g, '&lt;')},</p>
              <p style="line-height:1.8;color:#475569;">আপনার <strong>${String(person.productName || 'প্রোডাক্ট').replace(/</g, '&lt;')}</strong> আইডিয়া আমাদের পর্যালোচনায় আছে। ২৫ নভেম্বর স্ট্যাটাস জানানো হবে।</p>
              <p style="line-height:1.8;color:#475569;">নিজের স্ট্যাটাস যেকোনো সময় চেক করতে পারেন।</p>
              <p style="color:#64748b;font-size:13px;">— ${event.organizer} আয়োজক কমিটি</p>
            </div>
          </div>`,
        });
        sent += 1;
      } catch (error) {
        console.warn('Reminder failed for', person.email, error.message);
      }
    }

    return Response.json({ sent });
  } catch (error) {
    console.error('Reminder run failed:', error.message);
    return Response.json({ error: 'রিমাইন্ডার পাঠানো যায়নি।' }, { status: 500 });
  }
}
