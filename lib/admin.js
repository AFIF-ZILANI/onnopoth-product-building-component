/**
 * Small stateless auth helpers for the admin panel and approval links.
 * All secrets come from environment variables — never from source code.
 */
import crypto from 'crypto';
import { dates } from './config';

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.GMAIL_APP_PASSWORD || '';
}

/** Sign a JSON payload into a tamper-proof token. */
export function signToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret()).update(data).digest('base64url');
  return `${data}.${sig}`;
}

/** Verify and decode a token. Returns null if invalid. */
export function verifyToken(token) {
  if (typeof token !== 'string') return null;
  try {
    const [data, sig] = token.split('.');
    if (!data || !sig) return null;
    const expected = crypto.createHmac('sha256', secret()).update(data).digest('base64url');
    if (sig.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Admin session cookie value (valid for 12 hours). */
export function createAdminSession(email) {
  return signToken({ type: 'admin', email, exp: Date.now() + 12 * 60 * 60 * 1000 });
}

export function isAdminSession(token) {
  const payload = verifyToken(token);
  return !!(payload && payload.type === 'admin' && payload.email === process.env.ADMIN_EMAIL);
}

/** One-click approval link token, valid until the submission deadline. */
export function createApprovalToken(email, productName) {
  return signToken({
    type: 'approval',
    email,
    productName,
    exp: new Date(dates.competitionEnd).getTime(),
  });
}

export function isApprovalToken(token) {
  const payload = verifyToken(token);
  return !!(payload && payload.type === 'approval' && payload.email && payload.productName);
}

export function getCookieValue(cookieHeader, name) {
  if (!cookieHeader) return null;
  const match = cookieHeader.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}
