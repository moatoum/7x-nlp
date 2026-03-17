import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, buildIntakeEmailPayload, type IntakeEmailData } from '@/lib/notification-engine';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const emailLimiter = createRateLimiter({ limit: 5, windowMs: 60_000 }); // 5 emails per minute per IP

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(request.headers);
    if (!emailLimiter(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before sending again.' },
        { status: 429 },
      );
    }

    const data: IntakeEmailData = await request.json();

    if (!data.contactEmail || !data.referenceNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Skip if Notification Engine is not configured
    if (
      !process.env.NOTIFICATION_ENGINE_URL ||
      !process.env.NOTIFICATION_ENGINE_API_KEY ||
      !process.env.NOTIFICATION_EMAIL_TEMPLATE_ID
    ) {
      console.warn('Notification Engine not configured, skipping email');
      return NextResponse.json({ success: true, skipped: true });
    }

    const payload = buildIntakeEmailPayload(data);
    const result = await sendEmail(payload);

    console.log('Intake confirmation email sent, txnId:', result.transactionId);
    return NextResponse.json({ success: true, transactionId: result.transactionId });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
