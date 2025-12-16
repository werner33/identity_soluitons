/*
  Warnings:

  - You are about to alter the column `phone_number` on the `investors` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE "investors" ALTER COLUMN "phone_number" SET DATA TYPE VARCHAR(10);

-- Add CHECK constraints for data validation
-- Phone number: must be exactly 10 digits
ALTER TABLE "investors"
ADD CONSTRAINT "chk_phone_number_format"
CHECK (phone_number ~ '^[0-9]{10}$');

-- ZIP code: must be 5 digits or 5-4 format, and first 5 digits in valid range (00501-99950)
ALTER TABLE "investors"
ADD CONSTRAINT "chk_zip_code_format"
CHECK (
  zip_code ~ '^[0-9]{5}(-[0-9]{4})?$' AND
  CAST(SUBSTRING(zip_code, 1, 5) AS INTEGER) BETWEEN 501 AND 99950
);

-- Date of birth: must result in age between 18 and 120 years
ALTER TABLE "investors"
ADD CONSTRAINT "chk_date_of_birth_age"
CHECK (
  date_of_birth <= CURRENT_DATE - INTERVAL '18 years' AND
  date_of_birth >= CURRENT_DATE - INTERVAL '120 years'
);

-- First name: must not be empty and length between 1-100 chars
ALTER TABLE "investors"
ADD CONSTRAINT "chk_first_name_length"
CHECK (LENGTH(TRIM(first_name)) >= 1 AND LENGTH(first_name) <= 100);

-- Last name: must not be empty and length between 1-100 chars
ALTER TABLE "investors"
ADD CONSTRAINT "chk_last_name_length"
CHECK (LENGTH(TRIM(last_name)) >= 1 AND LENGTH(last_name) <= 100);

-- Street address: must not be empty and length between 1-255 chars
ALTER TABLE "investors"
ADD CONSTRAINT "chk_street_address_length"
CHECK (LENGTH(TRIM(street_address)) >= 1 AND LENGTH(street_address) <= 255);
