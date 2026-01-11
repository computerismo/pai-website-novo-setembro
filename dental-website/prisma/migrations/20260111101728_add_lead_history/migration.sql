-- CreateTable
CREATE TABLE "LeadHistory" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadHistory_leadId_idx" ON "LeadHistory"("leadId");

-- CreateIndex
CREATE INDEX "LeadHistory_createdAt_idx" ON "LeadHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "LeadHistory" ADD CONSTRAINT "LeadHistory_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
