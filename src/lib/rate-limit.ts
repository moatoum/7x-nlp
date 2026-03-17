/**
 * Simple in-memory rate limiter.
 *
 * Note: state is per-process and not shared across instances.
 * For multi-instance deployments, migrate to Redis or a shared store.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimiterOptions {
  /** Max requests allowed per window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export function createRateLimiter({ limit, windowMs }: RateLimiterOptions) {
  const map = new Map<string, RateLimitEntry>();

  // Periodic cleanup to prevent memory leaks (every 5 minutes)
  setInterval(() => {
    const now = Date.now();
    map.forEach((entry, key) => {
      if (now > entry.resetAt) map.delete(key);
    });
  }, 5 * 60 * 1000).unref();

  return function check(key: string): boolean {
    const now = Date.now();
    const entry = map.get(key);

    if (!entry || now > entry.resetAt) {
      map.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (entry.count >= limit) return false;
    entry.count++;
    return true;
  };
}

/**
 * Extract client IP from request headers.
 * Uses x-forwarded-for (first hop) — assumes trusted reverse proxy.
 */
export function getClientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}
