import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const leadLimiter = createRateLimiter({ limit: 10, windowMs: 60_000 }); // 10 per minute

// Field length limits
const MAX_NAME = 255;
const MAX_EMAIL = 255;
const MAX_PHONE = 30;
const MAX_WEBSITE = 500;

function generateLeadRef() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const code = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `7X-L-${date}-${code}`;
}

// GET /api/leads — List all leads (admin)
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(
      leads.map((l) => ({
        ...l,
        createdAt: l.createdAt.getTime(),
      }))
    );
  } catch (error: unknown) {
    console.error('GET /api/leads error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// POST /api/leads — Create a new lead (public form)
export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(request.headers);
    if (!leadLimiter(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please wait before submitting again.' }, { status: 429 });
    }

    const body = await request.json();

    // Validation with length limits
    const name = typeof body.contactName === 'string' ? body.contactName.trim() : '';
    if (!name || name.length > MAX_NAME) {
      return NextResponse.json({ error: 'Name is required (max 255 chars)' }, { status: 400 });
    }

    const email = typeof body.businessEmail === 'string' ? body.businessEmail.trim() : '';
    if (!email || email.length > MAX_EMAIL || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Valid business email is required' }, { status: 400 });
    }

    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    if (phone.length > MAX_PHONE) {
      return NextResponse.json({ error: 'Phone number is too long' }, { status: 400 });
    }
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || /^(\d)\1+$/.test(digitsOnly)) {
      return NextResponse.json({ error: 'Valid phone number is required' }, { status: 400 });
    }

    const website = typeof body.businessWebsite === 'string' ? body.businessWebsite.trim() : '';
    if (website && website.length > MAX_WEBSITE) {
      return NextResponse.json({ error: 'Website URL is too long' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        referenceNumber: generateLeadRef(),
        contactName: name,
        businessEmail: email,
        phone: phone,
        businessWebsite: website || null,
        uaeRegistered: body.uaeRegistered === true,
      },
    });

    return NextResponse.json(
      { ...lead, createdAt: lead.createdAt.getTime() },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('POST /api/leads error:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
