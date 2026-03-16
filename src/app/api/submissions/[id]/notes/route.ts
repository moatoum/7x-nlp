import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toClientNote } from '@/lib/mappers';

const VALID_VISIBILITY = new Set(['internal', 'external']);

// POST /api/submissions/[id]/notes — Add a note
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate content is non-empty
    if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
      return NextResponse.json({ error: 'Note content is required' }, { status: 400 });
    }

    // Validate visibility
    const visibility = body.visibility || 'internal';
    if (!VALID_VISIBILITY.has(visibility)) {
      return NextResponse.json({ error: 'Visibility must be "internal" or "external"' }, { status: 400 });
    }

    // Verify submission exists
    const submission = await prisma.submission.findUnique({
      where: { id: params.id },
      select: { id: true },
    });
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const note = await prisma.note.create({
      data: {
        content: body.content.trim(),
        visibility,
        author: body.author || 'Admin',
        submissionId: params.id,
      },
    });

    return NextResponse.json(toClientNote(note), { status: 201 });
  } catch (error) {
    console.error('POST /api/submissions/[id]/notes error:', error);
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
  }
}
