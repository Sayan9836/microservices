/*
  Warnings:

  - You are about to drop the column `name` on the `todos` table. All the data in the column will be lost.
  - Added the required column `title` to the `todos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "todos" RENAME COLUMN "name" TO "title";
