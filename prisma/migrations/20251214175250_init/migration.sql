-- CreateTable
CREATE TABLE "investors" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "street_address" VARCHAR(255) NOT NULL,
    "state" CHAR(2) NOT NULL,
    "zip_code" VARCHAR(10) NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "file_original_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "investors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_investor_lastname_created" ON "investors"("last_name", "created_at");

-- CreateIndex
CREATE INDEX "idx_investor_phone" ON "investors"("phone_number");
