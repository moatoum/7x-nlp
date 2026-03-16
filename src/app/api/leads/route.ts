import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  } catch (error) {
    console.error('GET /api/leads error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// POST /api/leads — Create a new lead (public form)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.contactName?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!body.businessEmail?.trim() || !EMAIL_REGEX.test(body.businessEmail)) {
      return NextResponse.json({ error: 'Valid business email is required' }, { status: 400 });
    }
    const digitsOnly = (body.phone || '').replace(/\D/g, '');
    if (digitsOnly.length < 7 || /^(\d)\1+$/.test(digitsOnly)) {
      return NextResponse.json({ error: 'Valid phone number is required' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        referenceNumber: generateLeadRef(),
        contactName: body.contactName.trim(),
        businessEmail: body.businessEmail.trim(),
        phone: body.phone.trim(),
        businessWebsite: body.businessWebsite?.trim() || null,
        uaeRegistered: body.uaeRegistered === true,
      },
    });

    return NextResponse.json(
      { ...lead, createdAt: lead.createdAt.getTime() },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/leads error:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
