import { getRecords, decisionFor } from '@/lib/gmail-store';
import { getCookieValue, isAdminSession } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!isAdminSession(getCookieValue(req.headers.get('cookie'), 'onnopoth_admin'))) {
    return Response.json({ error: 'অনুমোদন প্রয়োজন।' }, { status: 401 });
  }

  try {
    const force = new URL(req.url).searchParams.get('refresh') === '1';
    const { registrations, approvals } = await getRecords({ force });
    const ideas = registrations.map((item) => {
      const decision = decisionFor(approvals, item.email);
      return { ...item, decision: decision ? decision.decision : null };
    });
    return Response.json({ ideas });
  } catch (error) {
    console.error('Admin ideas fetch failed:', error.message);
    return Response.json(
      { error: 'ইনবক্স পড়া যায়নি। Gmail-এ IMAP চালু আছে কি যাচাই করুন।' },
      { status: 500 }
    );
  }
}
