import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toClientSubmission } from '@/lib/mappers';

// GET /api/submissions/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: params.id },
      include: { notes: true, recommendedServices: true },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(toClientSubmission(submission));
  } catch (error) {
    console.error('GET /api/submissions/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch submission' }, { status: 500 });
  }
}

// PATCH /api/submissions/[id] — Update status and/or tag
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.tag !== undefined) data.tag = body.tag;

    const submission = await prisma.submission.update({
      where: { id: params.id },
      data,
      include: { notes: true, recommendedServices: true },
    });

    return NextResponse.json(toClientSubmission(submission));
  } catch (error) {
    console.error('PATCH /api/submissions/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}
