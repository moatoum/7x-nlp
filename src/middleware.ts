import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'ar'];
const DEFAULT_LOCALE = 'en';

/**
 * Server-side middleware.
 *
 * 1. Locale detection & redirection for page routes
 * 2. Admin auth for protected API routes
 */

// Routes that require admin authentication
const PROTECTED_API_PREFIXES = [
  '/api/submissions',
  '/api/leads',
];

// Routes that are explicitly public (exempt from auth)
const PUBLIC_API_ROUTES = new Set([
  '/api/admin/auth',
  '/api/chat',
  '/api/health',
  '/api/send-confirmation',
  '/api/pulse/maritime',
  '/api/pulse/aviation',
  '/api/pulse/news',
  '/api/submissions/track',
]);

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_API_ROUTES.has(pathname)) return true;
  if (pathname.startsWith('/api/submissions/track/')) return true;
  if (pathname.startsWith('/api/pulse/')) return true;
  return false;
}

function isProtectedApiRoute(pathname: string): boolean {
  return PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function handleApiAuth(request: NextRequest, pathname: string) {
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (isProtectedApiRoute(pathname)) {
    const sessionToken = request.cookies.get('admin_session')?.value;
    const method = request.method;
    const isPublicWrite =
      method === 'POST' &&
      (pathname === '/api/submissions' || pathname === '/api/leads');

    if (!isPublicWrite && !sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // === API routes: handle auth only ===
  if (pathname.startsWith('/api/')) {
    return handleApiAuth(request, pathname);
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
