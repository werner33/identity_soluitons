/*
  Warnings:

  - You are about to drop the column `file_original_name` on the `investors` table. All the data in the column will be lost.
  - You are about to drop the column `file_path` on the `investors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "investors" DROP COLUMN "file_original_name",
DROP COLUMN "file_path";

-- CreateTable
CREATE TABLE "investor_files" (
    "id" SERIAL NOT NULL,
    "investor_id" INTEGER NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "file_original_name" VARCHAR(255) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investor_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_investor_file_investor_id" ON "investor_files"("investor_id");

-- AddForeignKey
ALTER TABLE "investor_files" ADD CONSTRAINT "investor_files_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
