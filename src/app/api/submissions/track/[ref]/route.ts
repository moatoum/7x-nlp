import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toPublicSubmission } from '@/lib/mappers';
import { verifyTurnstileToken } from '@/lib/turnstile';

// GET /api/submissions/track/[ref] — Track by reference number
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  // Turnstile verification
  if (process.env.TURNSTILE_TRACKING_ENABLED === 'true') {
    const token = request.headers.get('x-turnstile-token');
    if (!token) {
      return NextResponse.json({ error: 'Verification required' }, { status: 403 });
    }
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const valid = await verifyTurnstileToken(token, ip || undefined);
    if (!valid) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
    }
  }

  const { ref } = await params;
  try {
    const submission = await prisma.submission.findUnique({
      where: { referenceNumber: ref.toUpperCase() },
      include: { notes: true, recommendedServices: true },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(toPublicSubmission(submission));
  } catch (error) {
    console.error('GET /api/submissions/track/[ref] error:', error);
    return NextResponse.json({ error: 'Failed to fetch submission' }, { status: 500 });
  }
}
