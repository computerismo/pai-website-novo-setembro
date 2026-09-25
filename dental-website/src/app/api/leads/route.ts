import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { consumeLeadRateLimit } from "@/lib/security/lead-rate-limit";
import {
  LEAD_CONSENT_POLICY_VERSION,
  LEAD_REQUEST_MAX_BYTES,
  leadIntakeSchema,
} from "@/lib/security/lead-intake";
import { readJsonBody, RequestBodyError } from "@/lib/security/request-body";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const body = await readJsonBody<unknown>(request, LEAD_REQUEST_MAX_BYTES);
    const validation = leadIntakeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid lead data", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const leadData = validation.data;
    if (leadData.website) return NextResponse.json({ success: true }, { status: 202 });

    const rateAllowed = await consumeLeadRateLimit(leadData.email);
    if (rateAllowed === null) {
      return NextResponse.json({ error: "Lead intake is not configured" }, { status: 503 });
    }
    if (!rateAllowed) {
      return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
    }

    const lead = await prisma.lead.create({
      data: {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        utmSource: leadData.utm_source || leadData.source,
        utmMedium: leadData.utm_medium,
        utmCampaign: leadData.utm_campaign || leadData.campaignId,
        consentAt: new Date(),
        consentPolicyVersion: LEAD_CONSENT_POLICY_VERSION,
        status: "new",
      },
      select: { id: true },
    });

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("lead_submission_failed");
    return NextResponse.json({ error: "Unable to submit lead" }, { status: 500 });
  }
}
