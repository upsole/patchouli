/*
  Warnings:

  - The `tag` column on the `entry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "entry" DROP COLUMN "tag",
ADD COLUMN     "tag" TEXT[];
