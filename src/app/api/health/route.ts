import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/health — Minimal health check (no sensitive data exposed)
export async function GET() {
  const results: Record<string, unknown> = {
    status: 'checking',
    timestamp: new Date().toISOString(),
  };

  // DB connectivity test
  try {
    await prisma.$queryRaw`SELECT 1 AS ok`;
    results.db = 'ok';
  } catch {
    results.db = 'fail';
  }

  // Table-level tests (counts only, no schema details)
  try {
    const subCount = await prisma.submission.count();
    results.submissions = subCount;
  } catch {
    results.submissions = 'fail';
  }

  try {
    const leadCount = await prisma.lead.count();
    results.leads = leadCount;
  } catch {
    results.leads = 'fail';
  }

  results.status = results.db === 'ok' && typeof results.submissions === 'number' ? 'healthy' : 'unhealthy';

  return NextResponse.json(results, { status: results.status === 'healthy' ? 200 : 503 });
}
