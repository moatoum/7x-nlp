import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toClientSubmission } from '@/lib/mappers';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // Validate required fields
    if (!body.referenceNumber || typeof body.referenceNumber !== 'string') {
      return NextResponse.json({ error: 'Reference number is required' }, { status: 400 });
    }
    if (!body.contactName || typeof body.contactName !== 'string' || body.contactName.trim().length < 2) {
      return NextResponse.json({ error: 'Valid contact name is required (min 2 characters)' }, { status: 400 });
    }
    if (!body.contactEmail || !EMAIL_REGEX.test(body.contactEmail)) {
      return NextResponse.json({ error: 'Valid contact email is required' }, { status: 400 });
    }
    if (!body.serviceCategory || typeof body.serviceCategory !== 'string') {
      return NextResponse.json({ error: 'Service category is required' }, { status: 400 });
    }

    // Validate phone if provided
    if (body.contactPhone) {
      const digitsOnly = body.contactPhone.replace(/\D/g, '');
      if (digitsOnly.length < 7 || /^(\d)\1+$/.test(digitsOnly)) {
        return NextResponse.json({ error: 'Valid phone number is required' }, { status: 400 });
      }
    }

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
  } catch (error) {
    console.error('POST /api/submissions error:', error);
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}
