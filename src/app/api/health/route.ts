import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Helper: extract a useful error message from Prisma errors.
 * Prisma errors often start with newlines and span multiple lines.
 * We grab the first 5 non-empty lines to capture the actual cause.
 */
function extractErrorMessage(e: unknown): string {
  if (!(e instanceof Error)) return String(e) || 'Unknown error';
  const lines = e.message
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  return lines.slice(0, 5).join(' | ') || e.message.slice(0, 500) || 'Empty error message';
}

// GET /api/health — Comprehensive deployment diagnostics
export async function GET() {
  const results: Record<string, unknown> = {
    status: 'checking',
    timestamp: new Date().toISOString(),
    hostname: process.env.HOSTNAME || 'unknown',
    nodeEnv: process.env.NODE_ENV || 'unset',
    dbUrl: (process.env.DATABASE_URL || '').replace(/:[^@]+@/, ':***@') || '(EMPTY)',
    directUrl: (process.env.DIRECT_URL || '').replace(/:[^@]+@/, ':***@') || '(EMPTY)',
  };

  // ── 1. Raw connectivity test (SELECT 1) ──
  try {
    const raw = await prisma.$queryRaw`SELECT 1 AS ok`;
    results.rawConnection = `OK — ${JSON.stringify(raw)}`;
  } catch (e: unknown) {
    results.rawConnection = `FAIL: ${extractErrorMessage(e)}`;
  }

  // ── 2. Table-level tests ──
  try {
    const subCount = await prisma.submission.count();
    results.submissions = `OK (${subCount})`;
  } catch (e: unknown) {
    results.submissions = `FAIL: ${extractErrorMessage(e)}`;
  }

  try {
    const leadCount = await prisma.lead.count();
    results.leads = `OK (${leadCount})`;
  } catch (e: unknown) {
    results.leads = `FAIL: ${extractErrorMessage(e)}`;
  }

  // ── 3. Check if migration tables exist ──
  try {
    const tables = await prisma.$queryRaw<
      { tablename: string }[]
    >`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;
    results.publicTables = tables.map((t) => t.tablename);
  } catch (e: unknown) {
    results.publicTables = `FAIL: ${extractErrorMessage(e)}`;
  }

  results.status =
    typeof results.submissions === 'string' && results.submissions.startsWith('OK')
      ? 'healthy'
      : 'unhealthy';

  return NextResponse.json(results, { status: results.status === 'healthy' ? 200 : 503 });
}
