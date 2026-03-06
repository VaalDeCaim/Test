import { auth0 } from '@/lib/auth0';

export async function GET() {
  try {
    const { token } = await auth0.getAccessToken();
    return Response.json({ accessToken: token || '' });
  } catch {
    return Response.json({ accessToken: '' });
  }
}
