import { isApprovalToken, verifyToken } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/submit/access?token=… — unlock check for the submission form. */
export async function GET(req) {
  const token = new URL(req.url).searchParams.get('token') || '';
  if (!isApprovalToken(token)) {
    return Response.json({ allowed: false }, { status: 403 });
  }
  const payload = verifyToken(token);
  return Response.json({ allowed: true, email: payload.email, productName: payload.productName });
}
