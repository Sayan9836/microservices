/*
  Warnings:

  - You are about to drop the column `name` on the `todos` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `todos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `todos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- 1. Add the new columns as NULLABLE first
ALTER TABLE "todos" ADD COLUMN "firstName" TEXT;
ALTER TABLE "todos" ADD COLUMN "lastName" TEXT;

-- 2. Use PostgreSQL's split_part to copy the data
-- It splits the "name" by a space (' ') and takes part 1 and part 2
UPDATE "todos" SET 
  "firstName" = split_part("name", ' ', 1),
  "lastName" = split_part("name", ' ', 2);

-- 3. Delete the old column now that the data is moved
ALTER TABLE "todos" DROP COLUMN "name";

-- 4. Now make the new columns REQUIRED (NOT NULL)
ALTER TABLE "todos" ALTER COLUMN "firstName" SET NOT NULL;
ALTER TABLE "todos" ALTER COLUMN "lastName" SET NOT NULL;

