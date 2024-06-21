/*
  Warnings:

  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Room";

-- CreateTable
CREATE TABLE "room" (
    "uuid" UUID NOT NULL,
    "roomCode" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "ReservedAtandBy" TEXT NOT NULL,
    "floor" TEXT NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_roomCode_key" ON "room"("roomCode");
