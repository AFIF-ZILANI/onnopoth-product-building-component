export const runtime = 'nodejs';

export async function POST() {
  const res = Response.json({ ok: true });
  res.headers.set(
    'Set-Cookie',
    'onnopoth_admin=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0'
  );
  return res;
}
