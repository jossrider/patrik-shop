/*
  Warnings:

  - You are about to drop the `Countries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Countries";

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);
