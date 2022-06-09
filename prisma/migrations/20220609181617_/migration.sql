/*
  Warnings:

  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "post";

-- CreateTable
CREATE TABLE "entry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "img_url" TEXT,
    "file_url" TEXT,

    CONSTRAINT "entry_pkey" PRIMARY KEY ("id")
);
