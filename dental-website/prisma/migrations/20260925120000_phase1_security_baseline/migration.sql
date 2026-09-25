-- New accounts start with the least-privileged role. Existing users keep
-- their current role so this migration cannot unexpectedly lock out an owner.
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'viewer';

-- New marketing leads do not need a treatment/free-text field. Keep historical
-- values intact while allowing future records to omit this legacy field.
ALTER TABLE "Lead" ALTER COLUMN "treatment" DROP NOT NULL;
ALTER TABLE "Lead" ADD COLUMN "consentAt" TIMESTAMP(3);
ALTER TABLE "Lead" ADD COLUMN "consentPolicyVersion" TEXT;

-- Database-backed limiter; keys are HMACs and expire after a short window.
CREATE TABLE "LeadSubmissionBucket" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LeadSubmissionBucket_pkey" PRIMARY KEY ("key")
);

CREATE INDEX "LeadSubmissionBucket_expiresAt_idx"
    ON "LeadSubmissionBucket"("expiresAt");
