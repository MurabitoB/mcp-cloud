/*
  Warnings:

  - You are about to drop the column `k8sManifest` on the `templates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."templates" DROP COLUMN "k8sManifest";
