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

const VALID_STATUSES = new Set(['submitted', 'in_review', 'approved', 'rejected']);
const VALID_TAGS = new Set(['NXN', 'EMX']);

// PATCH /api/submissions/[id] — Update status and/or tag
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.status !== undefined) {
      if (!VALID_STATUSES.has(body.status)) {
        return NextResponse.json({ error: `Invalid status. Must be one of: ${Array.from(VALID_STATUSES).join(', ')}` }, { status: 400 });
      }
      data.status = body.status;
    }
    if (body.tag !== undefined) {
      if (body.tag !== null && !VALID_TAGS.has(body.tag)) {
        return NextResponse.json({ error: `Invalid tag. Must be one of: ${Array.from(VALID_TAGS).join(', ')}` }, { status: 400 });
      }
      data.tag = body.tag;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

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
