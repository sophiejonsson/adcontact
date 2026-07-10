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

// Cap the file we forward to Web3Forms (their attachment size is limited).
// Larger drawings are noted in the message instead of dropped silently.
const MAX_FORWARD_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5 MB

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

/** Cloudflare Turnstile server-side verification. Skipped when no secret is set. */
async function verifyTurnstile(token: string, request: NextRequest): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // captcha not configured yet — allow through
  if (!token) return false;
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "";
  const form = new URLSearchParams();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

/** Forward the RFQ to Web3Forms (which emails it to the configured inbox). */
async function sendToWeb3Forms(body: Partial<RFQPayload>, file: File | null): Promise<boolean> {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    // Not wired up yet — log so nothing is lost during setup.
    console.log("[RFQ] (no WEB3FORMS_ACCESS_KEY) received:", {
      name: body.name,
      company: body.company,
      email: body.email,
      lookingFor: body.lookingFor,
      timestamp: new Date().toISOString(),
    });
    return true;
  }

  const oversized = Boolean(file && file.size > MAX_FORWARD_ATTACHMENT_BYTES);
  const messageWithNote =
    (body.message ?? "") +
    (oversized && file
      ? `\n\n[Note: customer attached "${file.name}" (${(file.size / 1024 / 1024).toFixed(1)} MB) — too large to forward; please request it directly.]`
      : "");

  const fields: Record<string, string> = {
    access_key: accessKey,
    subject: `New RFQ from ${body.company || body.name || "the website"}`,
    from_name: "Adcontact website",
    replyto: body.email ?? "",
    name: body.name ?? "",
    company: body.company ?? "",
    email: body.email ?? "",
    phone: body.phone ?? "",
    country: body.country ?? "",
    "Looking for": body.lookingFor ?? "",
    "Part number": body.partNumber ?? "",
    message: messageWithNote,
  };

  const forwardFile = file && !oversized ? file : null;

  async function post(withFile: boolean): Promise<Response> {
    if (withFile && forwardFile) {
      const fd = new FormData();
      for (const [k, v] of Object.entries(fields)) fd.append(k, v);
      fd.append("attachment", forwardFile, forwardFile.name);
      return fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
    }
    return fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(fields),
    });
  }

  try {
    let res = await post(Boolean(forwardFile));
    // If the attachment tripped it up, retry text-only so the RFQ still lands.
    if (!res.ok && forwardFile) res = await post(false);
    return res.ok;
  } catch {
    return false;
  }
}

// Read-only health/config check (no secrets — just whether each key is set).
export function GET() {
  return NextResponse.json({
    ok: true,
    web3forms: Boolean(process.env.WEB3FORMS_ACCESS_KEY),
    turnstile: Boolean(process.env.TURNSTILE_SECRET_KEY),
  });
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let body: Partial<RFQPayload>;
    let file: File | null = null;
    let turnstileToken = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const attachment = formData.get("drawing");
      file = attachment instanceof File && attachment.size > 0 ? attachment : null;
      turnstileToken = String(formData.get("turnstileToken") || "");
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
        attachment: file ? { name: file.name, type: file.type, size: file.size } : undefined,
      };
    } else {
      const json = (await request.json()) as Partial<RFQPayload> & { turnstileToken?: string };
      turnstileToken = String(json.turnstileToken || "");
      body = json;
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

    // Captcha (Cloudflare Turnstile) — only enforced once TURNSTILE_SECRET_KEY is set.
    const captchaOk = await verifyTurnstile(turnstileToken, request);
    if (!captchaOk) {
      return NextResponse.json(
        { error: "Captcha verification failed. Please complete the check and try again." },
        { status: 400 },
      );
    }

    const sent = await sendToWeb3Forms(body, file);
    if (!sent) {
      return NextResponse.json(
        { error: "We couldn't send your request. Please try again or email order@adcontact.se." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your request has been received. We will respond within 1 business day.",
      referenceId: `RFQ-${Date.now()}`,
    });
  } catch (error) {
    console.error("[RFQ] Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 },
    );
  }
}
