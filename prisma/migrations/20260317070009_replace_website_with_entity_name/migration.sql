-- Replace businessWebsite with entityName
-- Step 1: Add entity_name as nullable first
ALTER TABLE "leads" ADD COLUMN "entity_name" TEXT;

-- Step 2: Backfill existing rows (use business_website or a placeholder)
UPDATE "leads" SET "entity_name" = COALESCE("business_website", 'Unknown') WHERE "entity_name" IS NULL;

-- Step 3: Make it required
ALTER TABLE "leads" ALTER COLUMN "entity_name" SET NOT NULL;

-- Step 4: Drop the old column
ALTER TABLE "leads" DROP COLUMN "business_website";
