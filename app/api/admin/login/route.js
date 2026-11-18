import { createAdminSession } from '@/lib/admin';

export const runtime = 'nodejs';

/** Fixed admin credentials are stored in Vercel env vars, never in code. */
export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।' }, { status: 401 });
    }

    const res = Response.json({ ok: true });
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.headers.set(
      'Set-Cookie',
      `onnopoth_admin=${encodeURIComponent(createAdminSession(email))}; HttpOnly; Path=/; SameSite=Lax; Max-Age=43200${secure}`
    );
    return res;
  } catch {
    return Response.json({ error: 'অনুরোধটি পড়া যায়নি।' }, { status: 400 });
  }
}
