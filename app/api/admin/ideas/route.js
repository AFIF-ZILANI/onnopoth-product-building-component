/**
 * GET /api/admin/ideas
 * Reads every idea submission straight from the organizer's Gmail inbox.
 * The registration route stores a base64 JSON copy in a custom email header,
 * so no external database is needed.
 */
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { getCookieValue, isAdminSession } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!isAdminSession(getCookieValue(req.headers.get('cookie'), 'onnopoth_admin'))) {
    return Response.json({ error: 'অনুমোদন প্রয়োজন।' }, { status: 401 });
  }

  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return Response.json({ error: 'ইমেইল সেটআপ করা নেই।' }, { status: 500 });
  }

  let client;
  try {
    client = new ImapFlow({
      host: 'imap.gmail.com',
      port: 993,
      secure: true,
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      logger: false,
    });
    await client.connect();

    const lock = await client.getMailboxLock('INBOX');
    const ideas = [];
    try {
      // Only registrations (they carry our custom header).
      for await (const msg of client.fetch({ since: new Date('2026-01-01') }, { source: true, uid: true })) {
        try {
          const parsed = await simpleParser(msg.source);
          const header = parsed.headers.get('x-onnopoth-registration');
          if (!header) continue;
          const raw = Array.isArray(header) ? header[0] : header;
          const data = JSON.parse(Buffer.from(String(raw), 'base64').toString('utf8'));
          ideas.push({ ...data, uid: msg.uid, subject: parsed.subject || '' });
        } catch {
          // Skip malformed/older emails silently.
        }
      }
    } finally {
      lock.release();
    }

    ideas.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
    return Response.json({ ideas });
  } catch (error) {
    console.error('Admin ideas fetch failed:', error.message);
    return Response.json(
      { error: 'ইনবক্স পড়া যায়নি। Gmail-এ IMAP চালু আছে কি যাচাই করুন।' },
      { status: 500 }
    );
  } finally {
    if (client) {
      try { await client.logout(); } catch { /* ignore */ }
    }
  }
}
