-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "leads_reference_number_key" ON "leads"("reference_number");
