
-- AlterTable
ALTER TABLE "LeadHistory" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "LeadNote" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "LeadHistory_userId_idx" ON "LeadHistory"("userId");

-- CreateIndex
CREATE INDEX "LeadNote_userId_idx" ON "LeadNote"("userId");

-- AddForeignKey
ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadHistory" ADD CONSTRAINT "LeadHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
