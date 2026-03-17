import crypto from 'crypto';

/**
 * Server-side admin session management.
 *
 * In production, migrate to Redis/DB-backed sessions.
 * This in-memory store is acceptable for single-instance deployments.
 */

const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours

interface SessionData {
  username: string;
  role: string;
  expiresAt: number;
}

const sessions = new Map<string, SessionData>();

/** Create a new session and return its token */
export function createSession(username: string, role: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    username,
    role,
    expiresAt: Date.now() + SESSION_TTL,
  });
  return token;
}

/** Validate a session token. Returns user info or null. */
export function validateSession(token: string | undefined): { username: string; role: string } | null {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return { username: session.username, role: session.role };
}

/** Remove a session */
export function destroySession(token: string | undefined): void {
  if (token) sessions.delete(token);
}

/** TTL in seconds for cookie maxAge */
export const SESSION_TTL_SECONDS = SESSION_TTL / 1000;
