/*
  Warnings:

  - You are about to drop the column `tag` on the `entry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "entry" DROP COLUMN "tag",
ADD COLUMN     "tags" TEXT[];
