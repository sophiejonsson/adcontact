import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type RFQPayload = {
  name: string;
  company: string;
  email: string;
  phone?: string;
  country: string;
  lookingFor: string;
  partNumber?: string;
  message?: string;
  // Anti-spam (not stored)
  website?: string; // honeypot — must be empty
  elapsedMs?: number; // time the form was on screen before submit
  attachment?: {
    name: string;
    type: string;
    size: number;
  };
};

function validateRFQ(body: Partial<RFQPayload>): string | null {
  if (!body.name?.trim()) return "Name is required";
  if (!body.company?.trim()) return "Company is required";
  if (!body.email?.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return "Invalid email address";
  if (!body.lookingFor?.trim()) return "Please describe what you are looking for";
  return null;
}

/** Heuristics that catch the bot signups that plagued the old Magento store. */
function looksLikeSpam(body: Partial<RFQPayload>): boolean {
  // 1. Honeypot field filled in (humans never see it).
  if (body.website && body.website.trim().length > 0) return true;
  // 2. Submitted implausibly fast (real users take more than ~2s).
  if (typeof body.elapsedMs === "number" && body.elapsedMs < 2000) return true;
  // 3. Links in the "what do you need" field — classic spam payload.
  const text = `${body.lookingFor ?? ""} ${body.message ?? ""}`;
  if (/(https?:\/\/|\[url=|<a\s)/i.test(text)) return true;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let body: Partial<RFQPayload>;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const attachment = formData.get("drawing");
      body = {
        name: String(formData.get("name") || ""),
        company: String(formData.get("company") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        country: String(formData.get("country") || ""),
        lookingFor: String(formData.get("lookingFor") || ""),
        partNumber: String(formData.get("partNumber") || ""),
        message: String(formData.get("message") || ""),
        website: String(formData.get("website") || ""),
        elapsedMs: Number(formData.get("elapsedMs") || 0),
        attachment:
          attachment instanceof File && attachment.size > 0
            ? {
                name: attachment.name,
                type: attachment.type,
                size: attachment.size,
              }
            : undefined,
      };
    } else {
      body = await request.json();
    }

    // Silently drop spam: return a success-shaped response so bots don't probe.
    if (looksLikeSpam(body)) {
      return NextResponse.json({
        success: true,
        message: "Your request has been received.",
        referenceId: `RFQ-${Date.now()}`,
      });
    }

    const validationError = validateRFQ(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // In production: send to CRM, email (Resend/SendGrid), Airtable, HubSpot, Supabase, etc.
    // Example placeholder:
    // await sendEmail({
    //   to: process.env.RFQ_EMAIL_RECIPIENT,
    //   subject: `New RFQ from ${body.company}`,
    //   body: formatRFQEmail(body),
    // });

    console.log("[RFQ] New request received:", {
      name: body.name,
      company: body.company,
      email: body.email,
      lookingFor: body.lookingFor,
      partNumber: body.partNumber,
      attachment: body.attachment,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Your request has been received. We will respond within 1 business day.",
      referenceId: `RFQ-${Date.now()}`,
    });
  } catch (error) {
    console.error("[RFQ] Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
