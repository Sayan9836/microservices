/*
  Warnings:

  - You are about to drop the column `firstName` on the `todos` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `todos` table. All the data in the column will be lost.
  - Added the required column `name` to the `todos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- 1. Add the old column back as nullable
ALTER TABLE "todos" ADD COLUMN "name" TEXT;

-- 2. COMBINE THE DATA SAFELY
-- CONCAT_WS handles spaces and NULLs perfectly
UPDATE "todos" SET "name" = TRIM(CONCAT_WS(' ', "firstName", "lastName"));

-- 3. Drop the redundant part columns
ALTER TABLE "todos" DROP COLUMN "firstName";
ALTER TABLE "todos" DROP COLUMN "lastName";

-- 4. Make the merged column required (NOT NULL)
ALTER TABLE "todos" ALTER COLUMN "name" SET NOT NULL;

