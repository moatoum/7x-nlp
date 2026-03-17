import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toClientNote } from '@/lib/mappers';
import { requireAdmin } from '@/lib/require-admin';

const VALID_VISIBILITY = new Set(['internal', 'external']);

// POST /api/submissions/[id]/notes — Add a note (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    // Validate content is non-empty and within size limit
    if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
      return NextResponse.json({ error: 'Note content is required' }, { status: 400 });
    }
    if (body.content.trim().length > 2000) {
      return NextResponse.json({ error: 'Note content must be under 2000 characters' }, { status: 400 });
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
        content: body.content.trim().slice(0, 2000),
        visibility,
        author: typeof body.author === 'string' ? body.author.slice(0, 100) : 'Admin',
        submissionId: params.id,
      },
    });

    return NextResponse.json(toClientNote(note), { status: 201 });
  } catch (error) {
    console.error('POST /api/submissions/[id]/notes error:', error);
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
  }
}
