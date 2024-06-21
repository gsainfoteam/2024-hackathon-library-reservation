-- AlterTable
ALTER TABLE "user" ALTER COLUMN "libraryID" DROP NOT NULL,
ALTER COLUMN "libraryPW" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Room" (
    "uuid" UUID NOT NULL,
    "roomCode" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "ReservedAtandBy" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomCode_key" ON "Room"("roomCode");
