import { NextRequest, NextResponse } from "next/server";
import {
  isMailConfigured,
  verifyMailConnection,
  sendLeadNotificationEmail,
} from "@/lib/mail";

export const runtime = "nodejs";

export async function GET() {
  const configured = isMailConfigured();

  if (!configured) {
    return NextResponse.json({
      configured: false,
      status: "unconfigured",
      message:
        "Nodemailer is not configured yet. Please provide SMTP_USER, SMTP_PASS, and SMTP_HOST in your .env file.",
      environment: {
        SMTP_HOST: process.env.SMTP_HOST || "(not set)",
        SMTP_PORT: process.env.SMTP_PORT || "587 (default)",
        SMTP_SECURE: process.env.SMTP_SECURE || "false (default)",
        SMTP_USER: process.env.SMTP_USER ? `${process.env.SMTP_USER.slice(0, 3)}***` : "(not set)",
        CONTACT_RECEIVER_EMAIL: process.env.CONTACT_RECEIVER_EMAIL || process.env.ADMIN_EMAIL || "(not set)",
      },
    });
  }

  const verification = await verifyMailConnection();

  return NextResponse.json({
    configured: true,
    status: verification.ok ? "connected" : "failed",
    message: verification.message,
    environment: {
      SMTP_HOST: process.env.SMTP_HOST || process.env.SMTP_SERVICE,
      SMTP_PORT: process.env.SMTP_PORT || "587",
      SMTP_SECURE: process.env.SMTP_SECURE || "false",
      SMTP_USER: process.env.SMTP_USER,
      CONTACT_RECEIVER_EMAIL: process.env.CONTACT_RECEIVER_EMAIL || process.env.ADMIN_EMAIL,
    },
  });
}

export async function POST(request: NextRequest) {
  if (!isMailConfigured()) {
    return NextResponse.json(
      {
        error:
          "SMTP is not configured in .env. Please fill in SMTP_USER, SMTP_PASS, and SMTP_HOST first.",
      },
      { status: 400 },
    );
  }

  let body: { testRecipient?: string } = {};
  try {
    body = await request.json();
  } catch {
    // Body is optional
  }

  const result = await sendLeadNotificationEmail({
    name: "Test Client",
    email: body.testRecipient || "test@example.com",
    phone: "+1 (555) 000-1122",
    company: "Test Brands Inc.",
    serviceInterest: "Google Ads & Meta Ads",
    budget: "$5,000 - $10,000",
    message:
      "This is a test notification email sent to verify that your Nodemailer configuration is working properly!",
    ip: "127.0.0.1",
  });

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Failed to send test email.",
        details: result.error,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Test email sent successfully! Please check your inbox.",
    messageId: result.messageId,
  });
}
