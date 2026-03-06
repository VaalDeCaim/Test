import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

const PROTECTED_PATHS = ['/convert', '/history', '/topup', '/settings'];

export async function middleware(request: NextRequest) {
  const isDevBypass =
    process.env.DEV_AUTH_BYPASS === 'true' &&
    process.env.NODE_ENV !== 'production';

  if (isDevBypass) {
    const pathname = request.nextUrl.pathname;
    if (pathname === '/auth/login' || pathname.startsWith('/auth/login?')) {
      return NextResponse.redirect(new URL('/auth/dev-login', request.url));
    }
    if (pathname === '/auth/logout') {
      return NextResponse.redirect(new URL('/api/auth/dev-logout', request.url));
    }
    const isProtected = PROTECTED_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + '/')
    );
    if (isProtected) {
      const hasDevSession = request.cookies.has('dev_session');
      if (!hasDevSession) {
        return NextResponse.redirect(new URL('/auth/dev-login', request.url));
      }
    }
    return NextResponse.next();
  }

  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
