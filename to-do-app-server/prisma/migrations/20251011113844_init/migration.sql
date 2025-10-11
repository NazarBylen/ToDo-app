/*
  Warnings:

  - You are about to drop the column `userId` on the `TodoList` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TodoList" DROP CONSTRAINT "TodoList_userId_fkey";

-- AlterTable
ALTER TABLE "TodoList" DROP COLUMN "userId";
