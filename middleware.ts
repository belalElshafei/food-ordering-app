import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

const userProtectedPaths = ['/checkout', '/orders', '/track'];
const adminPaths = ['/admin'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale and path without locale
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  const pathWithoutLocale = pathnameLocale
    ? pathname.slice(`/${pathnameLocale}`.length) || '/'
    : pathname;

  // Check if this is a protected user route
  const isUserProtected = userProtectedPaths.some(
    (p) => pathWithoutLocale.startsWith(p)
  );

  if (isUserProtected) {
    // Check for auth session token (next-auth sets this cookie)
    const sessionToken =
      request.cookies.get('authjs.session-token') ||
      request.cookies.get('__Secure-authjs.session-token') ||
      request.cookies.get('next-auth.session-token') ||
      request.cookies.get('__Secure-next-auth.session-token');

    if (!sessionToken) {
      const locale = pathnameLocale || defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)'],
};
