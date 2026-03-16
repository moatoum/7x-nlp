-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "cargo_volume" TEXT,
ADD COLUMN     "customs_required" TEXT,
ADD COLUMN     "goods_category" TEXT,
ADD COLUMN     "incoterms" TEXT,
ADD COLUMN     "supplier_country" TEXT,
ADD COLUMN     "supplier_status" TEXT;
