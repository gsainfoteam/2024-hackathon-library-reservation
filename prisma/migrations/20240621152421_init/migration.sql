/*
  Warnings:

  - You are about to drop the `room` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "libraryPW" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "room";
