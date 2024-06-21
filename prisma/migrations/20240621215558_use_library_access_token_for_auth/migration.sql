/*
  Warnings:

  - You are about to drop the column `libraryID` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `libraryPW` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_libraryID_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "libraryID",
DROP COLUMN "libraryPW",
ADD COLUMN     "accessToken" TEXT;
