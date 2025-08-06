-- CreateTable
CREATE TABLE "public"."template_instances" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "form" JSONB,
    "templateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_instances_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."template_instances" ADD CONSTRAINT "template_instances_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
