/*
  Warnings:

  - You are about to drop the column `status` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `TaskMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskMember" DROP CONSTRAINT "TaskMember_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskMember" DROP CONSTRAINT "TaskMember_userId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status",
ADD COLUMN     "assignedToId" INTEGER,
ADD COLUMN     "finalized" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "TaskMember";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
