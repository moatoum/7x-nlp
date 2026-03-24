import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

const VALID_STATUSES = new Set(['new', 'attempting', 'contacted', 'qualified', 'disqualified', 'closed']);

// GET /api/leads/[id] (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ ...lead, createdAt: lead.createdAt.getTime() });
  } catch (error) {
    console.error('GET /api/leads/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

// PATCH /api/leads/[id] — Update lead status or notes (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    const data: Record<string, unknown> = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.has(body.status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${Array.from(VALID_STATUSES).join(', ')}` },
          { status: 400 }
        );
      }
      data.status = body.status;
    }

    if (body.notes !== undefined) {
      if (body.notes !== null && typeof body.notes !== 'string') {
        return NextResponse.json({ error: 'Notes must be a string or null' }, { status: 400 });
      }
      if (typeof body.notes === 'string' && body.notes.length > 2000) {
        return NextResponse.json({ error: 'Notes must be under 2000 characters' }, { status: 400 });
      }
      data.notes = body.notes;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const lead = await prisma.lead.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ ...lead, createdAt: lead.createdAt.getTime() });
  } catch (error) {
    console.error('PATCH /api/leads/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
