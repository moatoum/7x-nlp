import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const CHAT_SESSION_TTL = 30 * 60 * 1000; // 30 minutes

/** Create a new chat session and return its token */
export async function createChatSession(): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  await prisma.chatSession.create({
    data: {
      token,
      expiresAt: new Date(Date.now() + CHAT_SESSION_TTL),
    },
  });
  return token;
}

/** Validate a chat session token */
export async function validateChatSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const session = await prisma.chatSession.findUnique({ where: { token } });
  if (!session) return false;
  if (new Date() > session.expiresAt) {
    await prisma.chatSession.delete({ where: { token } }).catch(() => {});
    return false;
  }
  return true;
}

/** TTL in seconds for cookie maxAge */
export const CHAT_SESSION_TTL_SECONDS = CHAT_SESSION_TTL / 1000;
