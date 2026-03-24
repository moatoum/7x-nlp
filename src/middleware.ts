import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'ar'];
const DEFAULT_LOCALE = 'en';

/**
 * Server-side middleware.
 *
 * Handles locale detection & redirection for page routes.
 * API auth is handled at the route level via requireAdmin().
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // === API routes: skip middleware, auth handled by requireAdmin() in route handlers ===
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // === Skip admin, static, and internal routes ===
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/animations') ||
    pathname.startsWith('/fonts') ||
    pathname.match(/\.(ico|png|svg|jpg|jpeg|gif|webp|json|woff|woff2|ttf|css|js|mp4|html)$/)
  ) {
    return NextResponse.next();
  }

  // === Check if pathname already has a locale prefix ===
  const pathnameLocale = SUPPORTED_LOCALES.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    return NextResponse.next();
  }

  // === Detect locale from cookie, then Accept-Language header ===
  const cookieLocale = request.cookies.get('locale')?.value;
  let detectedLocale = DEFAULT_LOCALE;

  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    detectedLocale = cookieLocale;
  } else {
    const acceptLanguage = request.headers.get('accept-language') || '';
    if (acceptLanguage.includes('ar')) {
      detectedLocale = 'ar';
    }
  }

  // === Redirect to locale-prefixed URL ===
  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
