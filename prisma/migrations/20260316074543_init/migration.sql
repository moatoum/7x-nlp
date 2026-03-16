-- CreateTable
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

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'internal',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT NOT NULL DEFAULT 'Admin',
    "submission_id" TEXT NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "submissions_reference_number_key" ON "submissions"("reference_number");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommended_services" ADD CONSTRAINT "recommended_services_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
