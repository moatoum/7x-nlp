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
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('GET /api/submissions error:', errMsg, error);
    return NextResponse.json({ error: `Failed to fetch submissions: ${errMsg}` }, { status: 500 });
  }
}

// POST /api/submissions — Create new
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate only the absolute minimum — referenceNumber is the only hard requirement
    if (!body.referenceNumber || typeof body.referenceNumber !== 'string') {
      return NextResponse.json({ error: 'Reference number is required' }, { status: 400 });
    }

    // Log what we received for debugging
    console.log('POST /api/submissions — ref:', body.referenceNumber,
      'name:', body.contactName, 'email:', body.contactEmail,
      'category:', body.serviceCategory);

    // Check for duplicate reference number
    const existing = await prisma.submission.findUnique({
      where: { referenceNumber: body.referenceNumber },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: 'Duplicate reference number' }, { status: 409 });
    }

    const submission = await prisma.submission.create({
      data: {
        referenceNumber: body.referenceNumber,
        status: body.status || 'submitted',
        createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
        entityType: body.entityType ?? null,
        serviceCategory: body.serviceCategory ?? null,
        serviceSubcategory: body.serviceSubcategory ?? null,
        businessType: body.businessType ?? null,
        originLocation: body.originLocation ?? null,
        destinationLocation: body.destinationLocation ?? null,
        frequency: body.frequency ?? null,
        urgency: body.urgency ?? null,
        specialRequirements: body.specialRequirements || [],
        additionalNotes: body.additionalNotes ?? null,
        currentCourier: body.currentCourier ?? null,
        supplierStatus: body.supplierStatus ?? null,
        supplierCountry: body.supplierCountry ?? null,
        goodsCategory: body.goodsCategory ?? null,
        incoterms: body.incoterms ?? null,
        cargoVolume: body.cargoVolume ?? null,
        customsRequired: body.customsRequired ?? null,
        storageType: body.storageType ?? null,
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
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('POST /api/submissions error:', errMsg, error);
    return NextResponse.json({ error: `Failed to create submission: ${errMsg}` }, { status: 500 });
  }
}
