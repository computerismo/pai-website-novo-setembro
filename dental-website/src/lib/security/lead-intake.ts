import { z } from "zod";

const safeAttribution = z
  .string()
  .trim()
  .max(100)
  .regex(/^[\p{L}\p{N} ._:/-]*$/u)
  .optional();

export const leadIntakeSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().max(254).email().transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(8).max(24).regex(/^[+\d\s().-]+$/),
  acceptTerms: z.literal(true),
  website: z.string().max(512).optional(),
  source: safeAttribution,
  campaignId: safeAttribution,
  utm_source: safeAttribution,
  utm_medium: safeAttribution,
  utm_campaign: safeAttribution,
});

export const LEAD_CONSENT_POLICY_VERSION = "lead-contact-v1";
export const LEAD_REQUEST_MAX_BYTES = 16 * 1024;
