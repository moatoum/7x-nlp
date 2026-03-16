-- ============================================================
-- 7X National Logistics Platform — Database Schema
-- PostgreSQL (compatible with Azure Database for PostgreSQL)
-- Generated: 2026-03-16
-- ============================================================

-- 1. SUBMISSIONS
-- Core table storing all logistics service requests
CREATE TABLE "submissions" (
    "id"                     TEXT NOT NULL,
    "reference_number"       TEXT NOT NULL,
    "status"                 TEXT NOT NULL DEFAULT 'submitted',       -- submitted | in_review | approved | rejected
    "created_at"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Service details
    "service_category"       TEXT,          -- e.g. domestic_courier, international, freight, warehousing
    "service_subcategory"    TEXT,          -- e.g. Same day, Express, Air freight
    "business_type"          TEXT,          -- e.g. E-commerce / D2C, Retail, Healthcare / Pharma
    "origin_location"        TEXT,          -- e.g. Dubai, Abu Dhabi
    "destination_location"   TEXT,
    "frequency"              TEXT,          -- e.g. Under 100, 100-1,000, 1,000-10,000, 10,000+
    "urgency"                TEXT,          -- e.g. Same day, Next day, Express, Standard
    "special_requirements"   TEXT[],        -- PostgreSQL array: e.g. {Temperature sensitive, High value items}
    "additional_notes"       TEXT,

    -- Contact info
    "contact_name"           TEXT,
    "contact_email"          TEXT,
    "contact_phone"          TEXT,
    "company_name"           TEXT,

    -- Conversation metadata
    "conversation_duration"  INTEGER NOT NULL DEFAULT 0,    -- milliseconds
    "nodes_visited"          TEXT[],                         -- conversation flow steps
    "total_messages"         INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- Unique index on reference number for fast tracking lookups
CREATE UNIQUE INDEX "submissions_reference_number_key" ON "submissions"("reference_number");


-- 2. NOTES
-- Internal/external notes attached to submissions
-- Internal = admin-only, External = visible on public tracking page
CREATE TABLE "notes" (
    "id"              TEXT NOT NULL,
    "content"         TEXT NOT NULL,
    "visibility"      TEXT NOT NULL DEFAULT 'internal',    -- internal | external
    "created_at"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author"          TEXT NOT NULL DEFAULT 'Admin',
    "submission_id"   TEXT NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- Foreign key: notes belong to a submission (cascade delete)
ALTER TABLE "notes"
    ADD CONSTRAINT "notes_submission_id_fkey"
    FOREIGN KEY ("submission_id") REFERENCES "submissions"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;


-- 3. RECOMMENDED SERVICES
-- AI-matched logistics services for each submission
CREATE TABLE "recommended_services" (
    "id"              TEXT NOT NULL,
    "service_id"      TEXT NOT NULL,        -- catalog service ID (e.g. sameday-courier)
    "name"            TEXT NOT NULL,
    "category"        TEXT NOT NULL,
    "description"     TEXT NOT NULL,
    "vertical"        TEXT NOT NULL,
    "confidence"      DOUBLE PRECISION,     -- AI confidence score (0-1), nullable
    "submission_id"   TEXT NOT NULL,

    CONSTRAINT "recommended_services_pkey" PRIMARY KEY ("id")
);

-- Foreign key: recommended_services belong to a submission (cascade delete)
ALTER TABLE "recommended_services"
    ADD CONSTRAINT "recommended_services_submission_id_fkey"
    FOREIGN KEY ("submission_id") REFERENCES "submissions"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;


-- ============================================================
-- NOTES FOR AZURE TEAM:
--
-- 1. All primary keys use UUID text strings (generated app-side)
-- 2. TEXT[] arrays are PostgreSQL-native — supported on Azure
--    Database for PostgreSQL (Flexible Server)
-- 3. If using Azure SQL (MSSQL) instead, TEXT[] arrays must be
--    replaced with join tables or JSON columns
-- 4. Recommended: Enable connection pooling (PgBouncer) on Azure
-- 5. The app uses Prisma ORM — just swap DATABASE_URL env var
-- ============================================================
