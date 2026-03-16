import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toClientNote } from '@/lib/mappers';

// POST /api/submissions/[id]/notes — Add a note
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const note = await prisma.note.create({
      data: {
        content: body.content,
        visibility: body.visibility || 'internal',
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
