/*
  Warnings:

  - Changed the type of `species` on the `animals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Species" AS ENUM ('DOG', 'CAT', 'CATTLE', 'BUFFALO', 'SHEEP', 'GOAT', 'HORSE', 'OTHER');

-- AlterTable
ALTER TABLE "animals" DROP COLUMN "species",
ADD COLUMN     "species" "Species" NOT NULL;
