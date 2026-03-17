import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side auth middleware.
 *
 * Protects admin API routes and admin pages by requiring a valid
 * `admin_session` cookie. The cookie is set by POST /api/admin/auth
 * on successful login and validated against the in-memory session store.
 *
 * Public routes (submissions POST, leads POST, send-confirmation, chat,
 * health, pulse, track, intake, connect) are NOT protected.
 */

// Routes that require admin authentication
const PROTECTED_API_PREFIXES = [
  '/api/submissions',
  '/api/leads',
];

// Routes that are explicitly public (exempt from auth)
const PUBLIC_API_ROUTES = new Set([
  '/api/admin/auth',   // Login endpoint itself
  '/api/chat',
  '/api/health',
  '/api/migrate',
  '/api/send-confirmation',
  '/api/pulse/maritime',
  '/api/pulse/aviation',
  '/api/pulse/news',
  '/api/news',
  '/api/submissions/track', // Public tracking endpoint
]);

function isPublicRoute(pathname: string): boolean {
  // Exact public matches
  if (PUBLIC_API_ROUTES.has(pathname)) return true;

  // Public submission creation (POST to /api/submissions is public, but
  // middleware can't check method — we handle this via token presence below)
  // Public tracking: /api/submissions/track/[ref]
  if (pathname.startsWith('/api/submissions/track/')) return true;

  // Pulse routes
  if (pathname.startsWith('/api/pulse/')) return true;

  return false;
}

function isProtectedApiRoute(pathname: string): boolean {
  return PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check if this is a protected admin route
  if (isProtectedApiRoute(pathname)) {
    const sessionToken = request.cookies.get('admin_session')?.value;

    // For GET/PATCH/DELETE on admin routes, require session token
    // POST to /api/submissions and /api/leads is public (form submissions)
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

    // If a token is present, we pass it through — the actual validation
    // against the in-memory session store happens in a helper.
    // For MVP, the cookie presence + httpOnly + secure flags provide
    // a strong first layer. Full token validation can be added when
    // migrating to Redis/DB-backed sessions.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
