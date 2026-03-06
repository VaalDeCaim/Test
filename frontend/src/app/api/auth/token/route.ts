import { cookies } from 'next/headers';
import { auth0 } from '@/lib/auth0';

const isDevBypass =
  process.env.DEV_AUTH_BYPASS === 'true' &&
  process.env.NODE_ENV !== 'production';

export async function GET() {
  if (isDevBypass) {
    const cookieStore = await cookies();
    const session = cookieStore.get('dev_session')?.value;
    if (session) {
      return Response.json({ accessToken: 'dev-bypass-token' });
    }
    return Response.json({ accessToken: '' });
  }
  try {
    const { token } = await auth0.getAccessToken();
    return Response.json({ accessToken: token || '' });
  } catch {
    return Response.json({ accessToken: '' });
  }
}
