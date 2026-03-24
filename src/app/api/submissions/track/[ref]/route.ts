import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toPublicSubmission } from '@/lib/mappers';

// GET /api/submissions/track/[ref] — Track by reference number
export async function GET(
  _request: NextRequest,
  { params }: { params: { ref: string } }
) {
  try {
    const submission = await prisma.submission.findUnique({
      where: { referenceNumber: params.ref.toUpperCase() },
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
