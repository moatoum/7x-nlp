import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/migrate — Run full schema migration via raw SQL.
 * Creates all tables if they don't exist.
 * Safe to call multiple times (uses IF NOT EXISTS).
 */
export async function GET() {
  const results: string[] = [];

  try {
    // ── 1. Create submissions table ──
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "submissions" (
        "id" TEXT NOT NULL,
        "reference_number" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'submitted',
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "service_category" TEXT,
        "service_subcategory" TEXT,
        "business_type" TEXT,
        "origin_location" TEXT,
        "destination_location" TEXT,
        "frequency" TEXT,
        "urgency" TEXT,
        "special_requirements" TEXT[],
        "additional_notes" TEXT,
        "contact_name" TEXT,
        "contact_email" TEXT,
        "contact_phone" TEXT,
        "company_name" TEXT,
        "conversation_duration" INTEGER NOT NULL DEFAULT 0,
        "nodes_visited" TEXT[],
        "total_messages" INTEGER NOT NULL DEFAULT 0,
        "current_courier" TEXT,
        "entity_type" TEXT,
        "tag" TEXT,
        "cargo_volume" TEXT,
        "customs_required" TEXT,
        "goods_category" TEXT,
        "incoterms" TEXT,
        "supplier_country" TEXT,
        "supplier_status" TEXT,
        "storage_type" TEXT,
        CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
      )
    `);
    results.push('✓ submissions table');

    // ── 2. Create notes table ──
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "notes" (
        "id" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "visibility" TEXT NOT NULL DEFAULT 'internal',
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "author" TEXT NOT NULL DEFAULT 'Admin',
        "submission_id" TEXT NOT NULL,
        CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
      )
    `);
    results.push('✓ notes table');

    // ── 3. Create recommended_services table ──
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "recommended_services" (
        "id" TEXT NOT NULL,
        "service_id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "vertical" TEXT NOT NULL,
        "confidence" DOUBLE PRECISION,
        "submission_id" TEXT NOT NULL,
        CONSTRAINT "recommended_services_pkey" PRIMARY KEY ("id")
      )
    `);
    results.push('✓ recommended_services table');

    // ── 4. Create leads table ──
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "leads" (
        "id" TEXT NOT NULL,
        "reference_number" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'new',
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "contact_name" TEXT NOT NULL,
        "business_email" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "business_website" TEXT,
        "uae_registered" BOOLEAN NOT NULL,
        "notes" TEXT,
        CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
      )
    `);
    results.push('✓ leads table');

    // ── 5. Create indexes (safe — IF NOT EXISTS) ──
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "submissions_reference_number_key" ON "submissions"("reference_number")
    `);
    results.push('✓ submissions unique index');

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "leads_reference_number_key" ON "leads"("reference_number")
    `);
    results.push('✓ leads unique index');

    // ── 6. Create foreign keys (check if they exist first) ──
    const fkCheck = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM information_schema.table_constraints
      WHERE constraint_name = 'notes_submission_id_fkey' AND table_name = 'notes'
    `;
    if (Number(fkCheck[0]?.count) === 0) {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "notes" ADD CONSTRAINT "notes_submission_id_fkey"
        FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE
      `);
      results.push('✓ notes FK created');
    } else {
      results.push('✓ notes FK already exists');
    }

    const fkCheck2 = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM information_schema.table_constraints
      WHERE constraint_name = 'recommended_services_submission_id_fkey' AND table_name = 'recommended_services'
    `;
    if (Number(fkCheck2[0]?.count) === 0) {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "recommended_services" ADD CONSTRAINT "recommended_services_submission_id_fkey"
        FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE
      `);
      results.push('✓ recommended_services FK created');
    } else {
      results.push('✓ recommended_services FK already exists');
    }

    // ── 7. Verify ──
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
    `;

    return NextResponse.json({
      status: 'success',
      steps: results,
      tables: tables.map((t) => t.tablename),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { status: 'error', completedSteps: results, error: msg },
      { status: 500 }
    );
  }
}
