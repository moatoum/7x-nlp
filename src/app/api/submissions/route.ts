import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toClientSubmission } from '@/lib/mappers';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';
import { requireAdmin } from '@/lib/require-admin';

const submitLimiter = createRateLimiter({ limit: 10, windowMs: 60_000 }); // 10 per minute

// ── Input validation helpers ──
const MAX_STR = 255;
const MAX_TEXT = 2000;
const MAX_ARRAY = 10;
const MAX_SERVICES = 20;

function str(val: unknown, max = MAX_STR): string | null {
  if (val == null) return null;
  if (typeof val !== 'string') return null;
  return val.slice(0, max) || null;
}

function strArr(val: unknown, maxItems = MAX_ARRAY): string[] {
  if (!Array.isArray(val)) return [];
  return val.filter((v): v is string => typeof v === 'string').slice(0, maxItems).map((s) => s.slice(0, MAX_STR));
}

// GET /api/submissions — List all (admin only)
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const submissions = await prisma.submission.findMany({
      include: { notes: true, recommendedServices: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(submissions.map(toClientSubmission));
  } catch (error: unknown) {
    console.error('GET /api/submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

// POST /api/submissions — Create new
export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(request.headers);
    if (!submitLimiter(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please wait before submitting again.' }, { status: 429 });
    }

    const body = await request.json();

    if (!body.referenceNumber || typeof body.referenceNumber !== 'string' || body.referenceNumber.length > 50) {
      return NextResponse.json({ error: 'Reference number is required' }, { status: 400 });
    }

    // Log non-PII fields only
    console.log('POST /api/submissions — ref:', body.referenceNumber,
      'category:', body.serviceCategory);

    // Check for duplicate reference number
    const existing = await prisma.submission.findUnique({
      where: { referenceNumber: body.referenceNumber },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: 'Duplicate reference number' }, { status: 409 });
    }

    // Validate and cap recommended services array
    const rawServices = Array.isArray(body.recommendedServices) ? body.recommendedServices.slice(0, MAX_SERVICES) : [];

    const submission = await prisma.submission.create({
      data: {
        referenceNumber: body.referenceNumber,
        status: str(body.status) || 'submitted',
        createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
        entityType: str(body.entityType),
        serviceCategory: str(body.serviceCategory),
        serviceSubcategory: str(body.serviceSubcategory),
        businessType: str(body.businessType),
        originLocation: str(body.originLocation),
        destinationLocation: str(body.destinationLocation),
        frequency: str(body.frequency),
        urgency: str(body.urgency),
        specialRequirements: strArr(body.specialRequirements),
        additionalNotes: str(body.additionalNotes, MAX_TEXT),
        currentCourier: str(body.currentCourier),
        supplierStatus: str(body.supplierStatus),
        supplierCountry: str(body.supplierCountry),
        goodsCategory: str(body.goodsCategory),
        incoterms: str(body.incoterms),
        cargoVolume: str(body.cargoVolume),
        customsRequired: str(body.customsRequired),
        storageType: str(body.storageType),
        contactName: str(body.contactName),
        contactEmail: str(body.contactEmail),
        contactPhone: str(body.contactPhone, 30),
        companyName: str(body.companyName),
        conversationDuration: typeof body.conversationDuration === 'number' ? Math.min(body.conversationDuration, 86400) : 0,
        nodesVisited: strArr(body.nodesVisited, 50),
        totalMessages: typeof body.totalMessages === 'number' ? Math.min(body.totalMessages, 1000) : 0,
        recommendedServices: {
          create: rawServices.map((s: { id: string; name: string; category: string; description: string; vertical: string; confidence?: number }) => ({
            serviceId: String(s.id).slice(0, MAX_STR),
            name: String(s.name).slice(0, MAX_STR),
            category: String(s.category).slice(0, MAX_STR),
            description: String(s.description).slice(0, 500),
            vertical: String(s.vertical).slice(0, MAX_STR),
            confidence: typeof s.confidence === 'number' ? s.confidence : null,
          })),
        },
      },
      include: { notes: true, recommendedServices: true },
    });

    return NextResponse.json(toClientSubmission(submission), { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/submissions error:', error);
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}
