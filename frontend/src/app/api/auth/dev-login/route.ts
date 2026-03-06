import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const DEV_USER = {
  sub: 'auth0|dev-user',
  email: 'test@gmail.com',
  name: 'Test User',
};

function isDevBypassEnabled() {
  return (
    process.env.DEV_AUTH_BYPASS === 'true' &&
    process.env.NODE_ENV !== 'production'
  );
}

export async function POST(request: NextRequest) {
  if (!isDevBypassEnabled()) {
    return Response.json({ error: 'Not available' }, { status: 404 });
  }
  const contentType = request.headers.get('content-type') || '';
  let email: string;
  let password: string;
  if (contentType.includes('application/json')) {
    const body = await request.json();
    email = body?.email as string;
    password = body?.password as string;
  } else {
    const formData = await request.formData();
    email = (formData.get('email') as string) || '';
    password = (formData.get('password') as string) || '';
  }
  if (email !== 'test@gmail.com' || password !== '123456') {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const cookieStore = await cookies();
  cookieStore.set('dev_session', JSON.stringify(DEV_USER), {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24h
  });
  return Response.redirect(new URL('/convert', request.url));
}
