import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const leadSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  treatment: z.string(),
  message: z.string().optional(),
  acceptTerms: z.boolean(),
  campaignId: z.string().optional(),
  source: z.string().optional(),
  timestamp: z.string(),
  page: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  gclid: z.string().optional(),
  fbclid: z.string().optional(),
});

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Remove old timestamps
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);

  if (validTimestamps.length >= MAX_REQUESTS) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = leadSchema.parse(body);

    console.log("Processing lead:", { email: validatedData.email, ip });

    try {
      // Save to database
      const lead = await prisma.lead.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          treatment: validatedData.treatment,
          message: validatedData.message,
          // Tracking fields
          // If utm_source is present, use it. Otherwise fall back to internal source prop.
          utmSource: validatedData.utm_source || validatedData.source,
          // If utm_medium is present, use it. 
          // If NOT present, and we didn't have a specific utm_source (meaning it's a direct page visit), label as 'direct'.
          utmMedium: validatedData.utm_medium || (validatedData.utm_source ? null : 'direct'),
          utmCampaign: validatedData.utm_campaign || validatedData.campaignId,
          utmTerm: validatedData.utm_term,
          utmContent: validatedData.utm_content,
          gclid: validatedData.gclid,
          fbclid: validatedData.fbclid,
          userAgent: request.headers.get("user-agent") || undefined,
          ipAddress: ip,
          status: "new",
        },
      });

      console.log("Lead saved successfully:", lead.id);

      return NextResponse.json({
        success: true,
        message: "Lead received successfully",
        id: lead.id,
      });
    } catch (dbError) {
      console.error("Database error saving lead:", dbError);
      // Return 500 but don't expose DB details
      return NextResponse.json(
        { error: "Failed to save lead to database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Lead submission error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
