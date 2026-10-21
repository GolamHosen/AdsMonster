import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { leads } from "@/db/schema";
import { leadSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  sendLeadNotificationEmail,
  sendLeadConfirmationEmail,
} from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);

  const limit = await checkRateLimit(`contact:ip:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form fields and try again.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Honeypot: if filled, silently pretend success to confuse bots.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, phone, company, serviceInterest, budget, message } = parsed.data;

  // 1. Persist to database if database is configured
  if (isDatabaseConfigured) {
    try {
      await db.insert(leads).values({
        name,
        email,
        phone,
        company,
        serviceInterest,
        budget,
        message,
        ip,
        source: "website",
      });
    } catch (err) {
      console.warn("[Contact] Failed to persist lead to database:", err);
    }
  } else {
    console.log("[Demo Mode] Database not yet configured. Processing email notification for lead:", {
      name,
      email,
      serviceInterest,
    });
  }

  // 2. Dispatch email notification to agency via Nodemailer
  const leadPayload = {
    name,
    email,
    phone,
    company,
    serviceInterest,
    budget,
    message,
    ip,
  };

  try {
    // Send email to agency inbox
    await sendLeadNotificationEmail(leadPayload);

    // Also send confirmation acknowledgement to the client (non-blocking if it fails)
    sendLeadConfirmationEmail(leadPayload).catch((err) => {
      console.warn("[Contact] Failed to send client auto-confirmation:", err);
    });
  } catch (mailErr) {
    console.error("[Contact] Unexpected error while sending lead email:", mailErr);
  }

  return NextResponse.json({ ok: true });
}

