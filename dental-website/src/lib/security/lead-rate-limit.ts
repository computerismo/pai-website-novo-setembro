import { createHmac } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

const WINDOW_MS = 60_000;
const MAX_SUBMISSIONS_PER_EMAIL = 5;
const MAX_SUBMISSIONS_PER_DEPLOYMENT = 300;

export function getLeadRateLimitKey(email: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(`lead-submission-v1:${email.trim().toLowerCase()}`)
    .digest("hex");
}

export async function consumeLeadRateLimit(email: string): Promise<boolean | null> {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) return null;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + WINDOW_MS);
  const emailKey = getLeadRateLimitKey(email, secret);
  const deploymentKey = getLeadRateLimitKey("deployment", secret);

  await prisma.leadSubmissionBucket.deleteMany({
    where: { expiresAt: { lte: now } },
  });

  const incrementBucket = async (key: string, maximum: number) => {
    const rows = await prisma.$queryRaw<Array<{ count: number }>>(Prisma.sql`
      INSERT INTO "LeadSubmissionBucket" ("key", "count", "expiresAt")
      VALUES (${key}, 1, ${expiresAt})
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE
          WHEN "LeadSubmissionBucket"."expiresAt" <= ${now} THEN 1
          ELSE LEAST("LeadSubmissionBucket"."count" + 1, ${maximum + 1})
        END,
        "expiresAt" = CASE
          WHEN "LeadSubmissionBucket"."expiresAt" <= ${now} THEN ${expiresAt}
          ELSE "LeadSubmissionBucket"."expiresAt"
        END
      RETURNING "count"
    `);
    return rows[0]?.count ?? maximum + 1;
  };

  const emailCount = await incrementBucket(emailKey, MAX_SUBMISSIONS_PER_EMAIL);
  if (emailCount > MAX_SUBMISSIONS_PER_EMAIL) return false;

  const deploymentCount = await incrementBucket(deploymentKey, MAX_SUBMISSIONS_PER_DEPLOYMENT);
  return deploymentCount <= MAX_SUBMISSIONS_PER_DEPLOYMENT;
}
