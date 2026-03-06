import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

function isDevBypassEnabled() {
  return (
    process.env.DEV_AUTH_BYPASS === 'true' &&
    process.env.NODE_ENV !== 'production'
  );
}

export async function GET(request: NextRequest) {
  if (!isDevBypassEnabled()) {
    return Response.redirect(new URL('/', request.url));
  }
  const cookieStore = await cookies();
  cookieStore.delete('dev_session');
  return Response.redirect(new URL('/', request.url));
}
