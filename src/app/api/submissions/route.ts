import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toClientSubmission } from '@/lib/mappers';

// GET /api/submissions — List all
export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      include: { notes: true, recommendedServices: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(submissions.map(toClientSubmission));
  } catch (error) {
    console.error('GET /api/submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

// POST /api/submissions — Create new
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const submission = await prisma.submission.create({
      data: {
        referenceNumber: body.referenceNumber,
        status: body.status || 'submitted',
        createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
        serviceCategory: body.serviceCategory ?? null,
        serviceSubcategory: body.serviceSubcategory ?? null,
        businessType: body.businessType ?? null,
        originLocation: body.originLocation ?? null,
        destinationLocation: body.destinationLocation ?? null,
        frequency: body.frequency ?? null,
        urgency: body.urgency ?? null,
        specialRequirements: body.specialRequirements || [],
        additionalNotes: body.additionalNotes ?? null,
        contactName: body.contactName ?? null,
        contactEmail: body.contactEmail ?? null,
        contactPhone: body.contactPhone ?? null,
        companyName: body.companyName ?? null,
        conversationDuration: body.conversationDuration || 0,
        nodesVisited: body.nodesVisited || [],
        totalMessages: body.totalMessages || 0,
        recommendedServices: {
          create: (body.recommendedServices || []).map((s: { id: string; name: string; category: string; description: string; vertical: string; confidence?: number }) => ({
            serviceId: s.id,
            name: s.name,
            category: s.category,
            description: s.description,
            vertical: s.vertical,
            confidence: s.confidence ?? null,
          })),
        },
      },
      include: { notes: true, recommendedServices: true },
    });

    return NextResponse.json(toClientSubmission(submission), { status: 201 });
  } catch (error) {
    console.error('POST /api/submissions error:', error);
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}
