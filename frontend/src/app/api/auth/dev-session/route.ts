import { cookies } from 'next/headers';

function isDevBypassEnabled() {
  return (
    process.env.DEV_AUTH_BYPASS === 'true' &&
    process.env.NODE_ENV !== 'production'
  );
}

export async function GET() {
  if (!isDevBypassEnabled()) {
    return Response.json(null, { status: 204 });
  }
  const cookieStore = await cookies();
  const session = cookieStore.get('dev_session')?.value;
  if (!session) {
    return Response.json(null, { status: 204 });
  }
  try {
    const user = JSON.parse(session) as { sub: string; email?: string; name?: string };
    return Response.json(user);
  } catch {
    return Response.json(null, { status: 204 });
  }
}
