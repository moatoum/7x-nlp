import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Helper: extract a useful error message from Prisma errors
 * (Prisma errors often start with newlines, so split('\n')[0] would be empty)
 */
function extractErrorMessage(e: unknown): string {
  if (!(e instanceof Error)) return String(e) || 'Unknown error';
  const lines = e.message.split('\n').filter((l) => l.trim().length > 0);
  return lines[0] || e.message.slice(0, 200) || 'Empty error message';
}

// GET /api/health — Comprehensive deployment diagnostics
export async function GET() {
  // ── Env-var diagnostics ──
  // List ALL env var names present (no values for security).
  // This tells us whether K8s injected the env section at all.
  const allEnvNames = Object.keys(process.env).sort();

  // Key env vars we care about
  const keyVars = [
    'DATABASE_URL',
    'DIRECT_URL',
    'NODE_ENV',
    'AZURE_AI_ENDPOINT',
    'AZURE_AI_KEY',
    'AZURE_AI_DEPLOYMENT',
    'RESEND_API_KEY',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD',
    'NXN_PASSWORD',
    'EMX_PASSWORD',
    'PORT',
    'HOSTNAME',
  ];

  const envPresence: Record<string, boolean> = {};
  for (const key of keyVars) {
    envPresence[key] = !!process.env[key];
  }

  const results: Record<string, unknown> = {
    status: 'checking',
    timestamp: new Date().toISOString(),
    hostname: process.env.HOSTNAME || 'unknown',
    nodeEnv: process.env.NODE_ENV || 'unset',
    dbUrl: (process.env.DATABASE_URL || '').replace(/:[^@]+@/, ':***@') || '(EMPTY)',
    directUrl: (process.env.DIRECT_URL || '').replace(/:[^@]+@/, ':***@') || '(EMPTY)',
    envPresence,
    totalEnvVars: allEnvNames.length,
    allEnvNames,
  };

  // ── DB connectivity ──
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

  results.status =
    typeof results.submissions === 'string' && results.submissions.startsWith('OK')
      ? 'healthy'
      : 'unhealthy';

  return NextResponse.json(results, { status: results.status === 'healthy' ? 200 : 503 });
}
