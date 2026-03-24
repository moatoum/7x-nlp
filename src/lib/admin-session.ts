import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours

interface SessionData {
  username: string;
  role: string;
  expiresAt: number;
}

// In-memory fallback if DB is unavailable
const memSessions = new Map<string, SessionData>();

/** Create a new session and return its token */
export async function createSession(username: string, role: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL);

  try {
    await prisma.adminSession.create({
      data: { token, username, role, expiresAt },
    });
  } catch {
    // DB unavailable — use in-memory fallback
    memSessions.set(token, { username, role, expiresAt: expiresAt.getTime() });
  }

  return token;
}

/** Validate a session token. Returns user info or null. */
export async function validateSession(token: string | undefined): Promise<{ username: string; role: string } | null> {
  if (!token) return null;

  // Try DB first
  try {
    const session = await prisma.adminSession.findUnique({ where: { token } });
    if (session) {
      if (new Date() > session.expiresAt) {
        await prisma.adminSession.delete({ where: { token } }).catch(() => {});
        return null;
      }
      return { username: session.username, role: session.role };
    }
  } catch {
    // DB unavailable — fall through to memory
  }

  // Check in-memory fallback
  const mem = memSessions.get(token);
  if (!mem) return null;
  if (Date.now() > mem.expiresAt) {
    memSessions.delete(token);
    return null;
  }
  return { username: mem.username, role: mem.role };
}

/** Remove a session */
export async function destroySession(token: string | undefined): Promise<void> {
  if (!token) return;
  memSessions.delete(token);
  try {
    await prisma.adminSession.delete({ where: { token } });
  } catch {
    // ignore
  }
}

/** TTL in seconds for cookie maxAge */
export const SESSION_TTL_SECONDS = SESSION_TTL / 1000;
