import { cookies } from 'next/headers';
import { auth0 } from './auth0';

const isDevBypass =
  process.env.DEV_AUTH_BYPASS === 'true' &&
  process.env.NODE_ENV !== 'production';

export async function getSession() {
  if (isDevBypass) {
    const cookieStore = await cookies();
    const session = cookieStore.get('dev_session')?.value;
    if (session) {
      try {
        const user = JSON.parse(session) as { sub: string; email?: string; name?: string };
        return { user };
      } catch {
        // ignore
      }
    }
    return null;
  }
  return auth0.getSession();
}
