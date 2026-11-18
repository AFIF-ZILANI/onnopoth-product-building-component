/**
 * Reads registrations and admin decisions from the organizer's Gmail inbox.
 * The custom headers written by the API routes act as our tiny database.
 * Results are cached in memory for 60s to keep IMAP calls fast.
 */
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

let cache = null;
const CACHE_MS = 60 * 1000;

async function readInbox() {
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error('ইমেইল সেটআপ করা নেই।');
  }

  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    logger: false,
  });

  const registrations = [];
  const approvals = [];
  const results = [];

  await client.connect();
  const lock = await client.getMailboxLock('INBOX');
  try {
    for await (const msg of client.fetch({ since: new Date('2026-01-01') }, { source: true, uid: true })) {
      try {
        const parsed = await simpleParser(msg.source);
        const reg = parsed.headers.get('x-onnopoth-registration');
        const dec = parsed.headers.get('x-onnopoth-approval');
        const res = parsed.headers.get('x-onnopoth-results');

        if (reg) {
          const raw = Array.isArray(reg) ? reg[0] : reg;
          registrations.push({ ...JSON.parse(Buffer.from(String(raw), 'base64').toString('utf8')), uid: msg.uid });
        }
        if (dec) {
          const raw = Array.isArray(dec) ? dec[0] : dec;
          approvals.push({ ...JSON.parse(Buffer.from(String(raw), 'base64').toString('utf8')), uid: msg.uid });
        }
        if (res) {
          const raw = Array.isArray(res) ? res[0] : res;
          results.push({ ...JSON.parse(Buffer.from(String(raw), 'base64').toString('utf8')), uid: msg.uid });
        }
      } catch {
        // Ignore unrelated or malformed messages.
      }
    }
  } finally {
    lock.release();
    await client.logout();
  }

  registrations.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
  approvals.sort((a, b) => new Date(b.decidedAt || 0) - new Date(a.decidedAt || 0));
  results.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

  return { registrations, approvals, results };
}

export async function getRecords({ force = false } = {}) {
  if (!force && cache && Date.now() - cache.at < CACHE_MS) return cache;
  const data = await readInbox();
  cache = { ...data, at: Date.now() };
  return cache;
}

/** Call after writing a new decision so status checks see it immediately. */
export function clearRecordsCache() {
  cache = null;
}

/** Latest decision for one email, or null. */
export function decisionFor(approvals, email) {
  return approvals.find((a) => a.email?.toLowerCase() === String(email).toLowerCase()) || null;
}
