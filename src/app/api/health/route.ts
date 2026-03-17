import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/health — Quick DB connectivity check
export async function GET() {
  const results: Record<string, string> = {
    status: 'checking',
    dbUrl: (process.env.DATABASE_URL || '').replace(/:[^@]+@/, ':***@'),
    directUrl: (process.env.DIRECT_URL || '').replace(/:[^@]+@/, ':***@'),
  };

  try {
    const subCount = await prisma.submission.count();
    results.submissions = `OK (${subCount})`;
  } catch (e: unknown) {
    results.submissions = `FAIL: ${e instanceof Error ? e.message.split('\n')[0] : String(e)}`;
  }

  try {
    const leadCount = await prisma.lead.count();
    results.leads = `OK (${leadCount})`;
  } catch (e: unknown) {
    results.leads = `FAIL: ${e instanceof Error ? e.message.split('\n')[0] : String(e)}`;
  }

  results.status = results.submissions?.startsWith('OK') ? 'healthy' : 'unhealthy';

  return NextResponse.json(results);
}
