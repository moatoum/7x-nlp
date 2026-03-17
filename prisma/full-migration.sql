-- =============================================
-- Full schema migration for 7X NLS
-- Run against Azure PostgreSQL (direct port 5432)
-- =============================================

-- Migration 1: init — Core tables
CREATE TABLE "submissions" (
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
    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'internal',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT NOT NULL DEFAULT 'Admin',
    "submission_id" TEXT NOT NULL,
    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "recommended_services" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vertical" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "submission_id" TEXT NOT NULL,
    CONSTRAINT "recommended_services_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "submissions_reference_number_key" ON "submissions"("reference_number");

ALTER TABLE "notes" ADD CONSTRAINT "notes_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "recommended_services" ADD CONSTRAINT "recommended_services_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migration 2: add_entity_courier_tag
ALTER TABLE "submissions" ADD COLUMN "current_courier" TEXT,
ADD COLUMN "entity_type" TEXT,
ADD COLUMN "tag" TEXT;

-- Migration 3: add_import_flow_fields
ALTER TABLE "submissions" ADD COLUMN "cargo_volume" TEXT,
ADD COLUMN "customs_required" TEXT,
ADD COLUMN "goods_category" TEXT,
ADD COLUMN "incoterms" TEXT,
ADD COLUMN "supplier_country" TEXT,
ADD COLUMN "supplier_status" TEXT;

-- Migration 4: add_storage_type
ALTER TABLE "submissions" ADD COLUMN "storage_type" TEXT;

-- Migration 5: add_lead_model
CREATE TABLE "leads" (
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
);

CREATE UNIQUE INDEX "leads_reference_number_key" ON "leads"("reference_number");
