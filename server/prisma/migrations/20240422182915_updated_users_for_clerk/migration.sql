/*
  Warnings:

  - Made the column `clerkData` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clerkId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "clerkData" SET NOT NULL,
ALTER COLUMN "clerkId" SET NOT NULL;
