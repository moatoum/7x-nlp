import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/admin-session';

/**
 * Validate admin session for protected API routes.
 * Returns null if authorized, or a 401/403 response if not.
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  // CSRF protection: reject state-changing requests from cross-origin
  if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
  }

  const token = request.cookies.get('admin_session')?.value;
  const session = validateSession(token);

  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  return null;
}
