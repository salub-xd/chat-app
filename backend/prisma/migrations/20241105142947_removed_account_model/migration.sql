/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOAuth" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Account";
