/*
  Warnings:

  - The primary key for the `investor_files` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `investors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `investor_files` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `investor_id` on the `investor_files` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `investors` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "investor_files" DROP CONSTRAINT "investor_files_investor_id_fkey";

-- AlterTable
ALTER TABLE "investor_files" DROP CONSTRAINT "investor_files_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "investor_id",
ADD COLUMN     "investor_id" UUID NOT NULL,
ADD CONSTRAINT "investor_files_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "investors" DROP CONSTRAINT "investors_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "investors_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "idx_investor_file_investor_id" ON "investor_files"("investor_id");

-- AddForeignKey
ALTER TABLE "investor_files" ADD CONSTRAINT "investor_files_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
