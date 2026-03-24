import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours

/** Create a new session and return its token */
export async function createSession(username: string, role: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  await prisma.adminSession.create({
    data: {
      token,
      username,
      role,
      expiresAt: new Date(Date.now() + SESSION_TTL),
    },
  });
  return token;
}

/** Validate a session token. Returns user info or null. */
export async function validateSession(token: string | undefined): Promise<{ username: string; role: string } | null> {
  if (!token) return null;
  const session = await prisma.adminSession.findUnique({ where: { token } });
  if (!session) return null;
  if (new Date() > session.expiresAt) {
    await prisma.adminSession.delete({ where: { token } });
    return null;
  }
  return { username: session.username, role: session.role };
}

/** Remove a session */
export async function destroySession(token: string | undefined): Promise<void> {
  if (token) {
    await prisma.adminSession.delete({ where: { token } }).catch(() => {});
  }
}

/** TTL in seconds for cookie maxAge */
export const SESSION_TTL_SECONDS = SESSION_TTL / 1000;
