import { getRecords, decisionFor } from '@/lib/gmail-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const digits = (value) => String(value || '').replace(/\D/g, '');

/** POST /api/status — check an idea's approval status with email + WhatsApp. */
export async function POST(req) {
  try {
    const { email, whatsapp } = await req.json();
    if (!email || !whatsapp) {
      return Response.json({ error: 'ইমেইল ও WhatsApp নম্বর দিন।' }, { status: 400 });
    }

    const { registrations, approvals } = await getRecords();
    const record = registrations.find(
      (r) =>
        r.email?.toLowerCase() === String(email).trim().toLowerCase() &&
        digits(r.whatsapp) === digits(whatsapp)
    );

    if (!record) {
      return Response.json({ status: 'not-found' });
    }

    const decision = decisionFor(approvals, record.email);
    const status = !decision
      ? 'pending'
      : decision.decision === 'approve'
        ? 'approved'
        : 'declined';
    return Response.json({
      status,
      name: record.name,
      productName: record.productName,
      teamName: record.teamName || null,
    });
  } catch (error) {
    console.error('Status check failed:', error.message);
    return Response.json(
      { error: 'স্ট্যাটাস যাচাই করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
