import { NextRequest, NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { createChatSession, CHAT_SESSION_TTL_SECONDS } from '@/lib/chat-session';

// POST /api/chat/verify — Verify Turnstile token and create chat session
export async function POST(request: NextRequest) {
  try {
    const { turnstileToken } = await request.json();

    if (!turnstileToken || typeof turnstileToken !== 'string') {
      return NextResponse.json({ error: 'Verification required' }, { status: 403 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const valid = await verifyTurnstileToken(turnstileToken, ip);

    if (!valid) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
    }

    const token = await createChatSession();

    const response = NextResponse.json({ success: true });
    response.cookies.set('chat_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: CHAT_SESSION_TTL_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
