/**
 * POST /api/admin/results — publish up to 10 winners and email each of them.
 * The published list is stored as a custom header in the organizer's inbox,
 * so the public results page can read it without a database.
 */
import nodemailer from 'nodemailer';
import { getCookieValue, isAdminSession } from '@/lib/admin';
import { clearRecordsCache } from '@/lib/gmail-store';
import { event, socialLinks } from '@/lib/config';

export const runtime = 'nodejs';

function esc(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function resultEmail(name, place, product, marks, rank) {
  return `
  <div style="font-family:'Noto Sans Bengali',Arial,sans-serif;max-width:620px;margin:auto;color:#0f172a;">
    <div style="background:linear-gradient(135deg,#3b82f6,#6366f1,#a855f7);padding:22px 26px;border-radius:14px 14px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:22px;">ফলাফল ঘোষণা 🎉</h1>
      <p style="color:#e0e7ff;margin:6px 0 0;font-size:14px;">${esc(event.name)}</p>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 14px 14px;padding:26px;">
      <p style="font-size:16px;">অভিনন্দন, ${esc(name)}!</p>
      <p style="font-size:15px;line-height:1.8;color:#475569;">
        আপনি <strong>${esc(product)}</strong> প্রোডাক্টের জন্য <strong>${esc(place)} স্থান</strong> অর্জন করেছেন${marks != null ? ` — <strong>${esc(marks)} / 100</strong> নম্বরসহ` : ''}।
      </p>
      ${rank <= 3 ? '<p style="line-height:1.8;color:#475569;">আপনার পুরস্কার (Book) সম্পর্কে আয়োজক কমিটি শীঘ্রই যোগাযোগ করবে।</p>' : ''}
      <p style="font-size:13px;color:#64748b;margin-top:24px;">সম্পূর্ণ ফলাফল: <a href="${socialLinks.siteUrl}/results">${socialLinks.siteUrl}/results</a></p>
      <p style="font-size:14px;color:#64748b;">— ${esc(event.organizer)} আয়োজক কমিটি</p>
    </div>
  </div>`;
}

export async function POST(req) {
  if (!isAdminSession(getCookieValue(req.headers.get('cookie'), 'onnopoth_admin'))) {
    return Response.json({ error: 'অনুমোদন প্রয়োজন।' }, { status: 401 });
  }

  try {
    const { winners } = await req.json();
    if (!Array.isArray(winners) || winners.length === 0 || winners.length > 10) {
      return Response.json({ error: '১ থেকে ১০ জনের ফলাফল দিন।' }, { status: 400 });
    }

    const clean = winners.slice(0, 10).map((w, i) => ({
      rank: i + 1,
      place: String(w.place || `${i + 1}`),
      name: String(w.name || '').trim(),
      email: String(w.email || '').trim(),
      product: String(w.product || '').trim(),
      institution: String(w.institution || '').trim(),
      marks: w.marks === '' || w.marks == null ? null : Number(w.marks),
    }));

    if (clean.some((w) => !w.name || !w.email || !w.product)) {
      return Response.json({ error: 'নাম, প্রোডাক্ট ও ইমেইল আবশ্যক।' }, { status: 400 });
    }

    const { GMAIL_USER, GMAIL_APP_PASSWORD, RECEIVER_EMAIL } = process.env;
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      return Response.json({ error: 'ইমেইল সেটআপ করা নেই।' }, { status: 500 });
    }

    const smtpHost = process.env.SMTP_HOST;
    const transporter = smtpHost
      ? nodemailer.createTransport({ host: smtpHost, port: Number(process.env.SMTP_PORT || 1025), secure: false })
      : nodemailer.createTransport({
          service: 'gmail',
          auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
        });

    // One email per unique address, even if someone appears in multiple places.
    const byEmail = new Map();
    for (const w of clean) {
      if (!byEmail.has(w.email.toLowerCase())) byEmail.set(w.email.toLowerCase(), []);
      byEmail.get(w.email.toLowerCase()).push(w);
    }

    let emailsSent = 0;
    for (const [, entries] of byEmail) {
      const first = entries[0];
      const rankText = entries.map((e) => `${e.place} স্থান (${e.product})`).join(', ');
      try {
        await transporter.sendMail({
          from: `"${event.shortName}" <${GMAIL_USER}>`,
          to: first.email,
          subject: `ফলাফল ঘোষণা – ${rankText}`,
          html: resultEmail(first.name, rankText, first.product, first.marks, first.rank),
        });
        emailsSent += 1;
      } catch (error) {
        console.warn('Result email failed for', first.email, error.message);
      }
    }

    await transporter.sendMail({
      from: `"${event.shortName}" <${GMAIL_USER}>`,
      to: RECEIVER_EMAIL || GMAIL_USER,
      subject: `Results published – ${clean.length} places`,
      headers: {
        'X-OnnoPoth-Results': Buffer.from(
          JSON.stringify({ winners: clean, publishedAt: new Date().toISOString() })
        ).toString('base64'),
      },
      text: `Published results:\n${clean.map((w) => `${w.place}. ${w.name} – ${w.product} – ${w.marks ?? '—'}`).join('\n')}`,
    });

    clearRecordsCache();
    return Response.json({ ok: true, published: clean.length, emailsSent });
  } catch (error) {
    console.error('Publish results failed:', error.message);
    return Response.json({ error: 'ফলাফল প্রকাশ করা যায়নি।' }, { status: 500 });
  }
}
