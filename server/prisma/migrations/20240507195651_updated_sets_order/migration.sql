-- AlterTable
ALTER TABLE "WorkoutSet" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "WorkoutSetInstance" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;
