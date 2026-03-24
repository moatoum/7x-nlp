import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const CHAT_SESSION_TTL = 30 * 60 * 1000; // 30 minutes

// In-memory fallback if DB table doesn't exist
const memSessions = new Map<string, number>();

/** Create a new chat session and return its token */
export async function createChatSession(): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + CHAT_SESSION_TTL);

  try {
    await prisma.chatSession.create({
      data: { token, expiresAt },
    });
  } catch {
    // DB table may not exist — use in-memory fallback
    memSessions.set(token, expiresAt.getTime());
  }

  return token;
}

/** Validate a chat session token */
export async function validateChatSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  // Try DB first
  try {
    const session = await prisma.chatSession.findUnique({ where: { token } });
    if (session) {
      if (new Date() > session.expiresAt) {
        await prisma.chatSession.delete({ where: { token } }).catch(() => {});
        return false;
      }
      return true;
    }
  } catch {
    // DB unavailable — fall through to memory
  }

  // Check in-memory fallback
  const expiresAt = memSessions.get(token);
  if (expiresAt === undefined) return false;
  if (Date.now() > expiresAt) {
    memSessions.delete(token);
    return false;
  }
  return true;
}

/** TTL in seconds for cookie maxAge */
export const CHAT_SESSION_TTL_SECONDS = CHAT_SESSION_TTL / 1000;
