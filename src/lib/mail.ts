import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export interface LeadEmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  budget?: string;
  message?: string;
  ip?: string;
}

export interface MailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  skipped?: boolean;
}

/**
 * Checks whether the required SMTP environment variables are present.
 */
export function isMailConfigured(): boolean {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || process.env.SMTP_SERVICE;
  return Boolean(user && pass && host);
}

/**
 * Returns a cached or new Nodemailer Transporter instance based on .env config.
 */
let cachedTransporter: Transporter | null = null;

export function getMailTransporter(): Transporter | null {
  if (!isMailConfigured()) {
    return null;
  }

  if (cachedTransporter) {
    return cachedTransporter;
  }

  const service = process.env.SMTP_SERVICE?.trim();
  const host = process.env.SMTP_HOST?.trim();
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const secure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === "true"
      : port === 465;

  const auth = {
    user: process.env.SMTP_USER?.trim(),
    pass: process.env.SMTP_PASS?.trim(),
  };

  if (service) {
    // Pre-configured service like "gmail", "outlook", etc.
    cachedTransporter = nodemailer.createTransport({
      service,
      auth,
    });
  } else {
    // Standard SMTP host/port configuration
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth,
      tls: {
        // Do not fail on self-signed certificates in development
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });
  }

  return cachedTransporter;
}

/**
 * Verifies that the SMTP configuration can authenticate with the mail server.
 */
export async function verifyMailConnection(): Promise<{ ok: boolean; message: string }> {
  const transporter = getMailTransporter();
  if (!transporter) {
    return {
      ok: false,
      message:
        "SMTP credentials are not configured. Please set SMTP_USER, SMTP_PASS, and SMTP_HOST in .env",
    };
  }

  try {
    await transporter.verify();
    return { ok: true, message: "SMTP connection verified successfully!" };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return { ok: false, message: `SMTP verification failed: ${errMessage}` };
  }
}

/**
 * Helper to escape HTML characters in untrusted user input before rendering inside email HTML.
 */
function escapeHtml(unsafe: string | undefined): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sends a notification email to the agency team when a client submits the contact form.
 */
export async function sendLeadNotificationEmail(
  data: LeadEmailData,
): Promise<MailSendResult> {
  const transporter = getMailTransporter();

  if (!transporter) {
    console.warn(
      "[Nodemailer] SMTP not configured. Lead email notification was skipped. Details:",
      { name: data.name, email: data.email, service: data.serviceInterest },
    );
    return {
      success: false,
      skipped: true,
      error: "SMTP is not configured in .env",
    };
  }

  // Where to send the notification (agency inbox)
  const toEmail =
    process.env.CONTACT_RECEIVER_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.SMTP_USER?.trim();

  if (!toEmail) {
    return {
      success: false,
      error: "No receiver email configured (CONTACT_RECEIVER_EMAIL or ADMIN_EMAIL)",
    };
  }

  const fromEmail =
    process.env.SMTP_FROM?.trim() ||
    `"Ads Monster Notifications" <${process.env.SMTP_USER?.trim()}>`;

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone || "Not provided");
  const safeCompany = escapeHtml(data.company || "Not provided");
  const safeService = escapeHtml(data.serviceInterest || "General Inquiry");
  const safeBudget = escapeHtml(data.budget || "Not specified");
  const safeMessage = escapeHtml(data.message || "No message provided.");
  const safeIp = escapeHtml(data.ip || "Unknown");
  const submissionTime = new Date().toUTCString();

  const subject = `🚀 New Lead: ${data.name} — ${data.serviceInterest || "New Client Inquiry"}`;

  const textContent = `
NEW CLIENT INQUIRY RECEIVED
------------------------------------
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "N/A"}
Company: ${data.company || "N/A"}
Service: ${data.serviceInterest || "N/A"}
Budget: ${data.budget || "N/A"}
Date: ${submissionTime}
Client IP: ${data.ip || "N/A"}

Message:
${data.message || "No message provided"}
------------------------------------
Reply directly to this email to contact the lead.
  `.trim();

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead Notification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.6;
    }
    .wrapper {
      width: 100%;
      background-color: #f1f5f9;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
    }
    .header {
      background-color: #104042;
      padding: 32px 30px;
      color: #ffffff;
      text-align: left;
    }
    .badge {
      display: inline-block;
      background-color: #AEFF1C;
      color: #104042;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 4px 10px;
      border-radius: 999px;
      margin-bottom: 12px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
    }
    .header p {
      margin: 6px 0 0 0;
      font-size: 14px;
      color: #94d2bd;
    }
    .body-content {
      padding: 30px;
    }
    .card-grid {
      display: table;
      width: 100%;
      margin-bottom: 20px;
    }
    .card-row {
      display: table-row;
    }
    .card-cell {
      display: table-cell;
      padding: 8px 12px;
      vertical-align: top;
      border-bottom: 1px solid #f1f5f9;
    }
    .cell-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      font-weight: 600;
      width: 32%;
    }
    .cell-val {
      font-size: 14px;
      color: #0f172a;
      font-weight: 600;
    }
    .cell-val a {
      color: #104042;
      text-decoration: underline;
    }
    .message-box {
      margin-top: 24px;
      background-color: #F7FAFA;
      border-left: 4px solid #104042;
      border-radius: 0 12px 12px 0;
      padding: 16px 20px;
    }
    .message-box h3 {
      margin: 0 0 8px 0;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #104042;
      font-weight: 700;
    }
    .message-box p {
      margin: 0;
      font-size: 14px;
      color: #334155;
      white-space: pre-wrap;
    }
    .action-btn-container {
      margin-top: 30px;
      text-align: center;
    }
    .action-btn {
      display: inline-block;
      background-color: #104042;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      padding: 14px 28px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(16, 64, 66, 0.25);
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      text-align: center;
    }
    .footer p {
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <span class="badge">New Lead</span>
        <h1>${safeName}</h1>
        <p>Inquired about <strong>${safeService}</strong></p>
      </div>
      <div class="body-content">
        <div class="card-grid">
          <div class="card-row">
            <div class="card-cell cell-label">Email</div>
            <div class="card-cell cell-val"><a href="mailto:${safeEmail}">${safeEmail}</a></div>
          </div>
          <div class="card-row">
            <div class="card-cell cell-label">Phone</div>
            <div class="card-cell cell-val">${data.phone ? `<a href="tel:${safePhone}">${safePhone}</a>` : '<span style="color:#94a3b8;font-weight:normal">Not provided</span>'}</div>
          </div>
          <div class="card-row">
            <div class="card-cell cell-label">Company</div>
            <div class="card-cell cell-val">${safeCompany}</div>
          </div>
          <div class="card-row">
            <div class="card-cell cell-label">Service</div>
            <div class="card-cell cell-val"><strong style="color:#104042">${safeService}</strong></div>
          </div>
          <div class="card-row">
            <div class="card-cell cell-label">Budget</div>
            <div class="card-cell cell-val"><span style="background-color:#AEFF1C;color:#104042;padding:2px 8px;border-radius:6px;font-size:12px;font-weight:700;">${safeBudget}</span></div>
          </div>
        </div>

        <div class="message-box">
          <h3>Client's Message</h3>
          <p>${safeMessage}</p>
        </div>

        <div class="action-btn-container">
          <a href="mailto:${safeEmail}?subject=Re:%20Strategy%20Call%20with%20Ads%20Monster" class="action-btn">
            ✉️ Reply to ${safeName}
          </a>
        </div>
      </div>
      <div class="footer">
        <p>Submitted via website contact form on ${submissionTime}</p>
        <p>Client IP: ${safeIp} &bull; Reply directly to this email to reach the client.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: `"${data.name}" <${data.email}>`,
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log("[Nodemailer] Lead notification sent successfully. Message ID:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error("[Nodemailer] Failed to send lead notification email:", errMessage);
    return {
      success: false,
      error: errMessage,
    };
  }
}

/**
 * Optional: Sends an automatic polite confirmation email to the client acknowledging their inquiry.
 */
export async function sendLeadConfirmationEmail(
  data: LeadEmailData,
): Promise<MailSendResult> {
  const transporter = getMailTransporter();
  if (!transporter) {
    return { success: false, skipped: true, error: "SMTP not configured" };
  }

  // Check if auto-acknowledgement is disabled
  if (process.env.SEND_CLIENT_CONFIRMATION === "false") {
    return { success: false, skipped: true, error: "Client confirmation disabled" };
  }

  const fromEmail =
    process.env.SMTP_FROM?.trim() ||
    `"Ads Monster" <${process.env.SMTP_USER?.trim()}>`;

  const safeName = escapeHtml(data.name);
  const safeService = escapeHtml(data.serviceInterest || "digital advertising");

  const subject = "We received your message! — Ads Monster Team";

  const textContent = `
Hi ${data.name},

Thank you for reaching out to Ads Monster!

We've received your inquiry regarding ${data.serviceInterest || "our advertising services"}. One of our senior ad strategists is reviewing your details and will get back to you within one business day with a customized scaling plan.

If you have any immediate questions or want to send additional details, feel free to reply directly to this email.

Best regards,
The Ads Monster Team
https://adsmonster.com
  `.trim();

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Thank You for Contacting Ads Monster</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
    }
    .wrapper {
      width: 100%;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #104042;
      padding: 32px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .header p {
      margin: 8px 0 0 0;
      color: #AEFF1C;
      font-weight: 600;
      font-size: 14px;
    }
    .content {
      padding: 32px 30px;
      line-height: 1.6;
      color: #334155;
      font-size: 15px;
    }
    .highlight-box {
      background-color: #E8F4F4;
      border-radius: 12px;
      padding: 16px 20px;
      margin: 20px 0;
      border-left: 4px solid #104042;
    }
    .highlight-box p {
      margin: 0;
      color: #104042;
      font-size: 14px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      font-size: 12px;
      color: #94a3b8;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Ads Monster</h1>
        <p>Inquiry Received &bull; Strategy Team Reviewing</p>
      </div>
      <div class="content">
        <p>Hi <strong>${safeName}</strong>,</p>
        <p>Thank you for reaching out to us. We're excited to learn more about your brand and discuss how we can accelerate your performance marketing.</p>
        
        <div class="highlight-box">
          <p><strong>Next Step:</strong> One of our senior ad strategists is reviewing your request for <strong>${safeService}</strong>. You'll receive a tailored response within 1 business day.</p>
        </div>

        <p>In the meantime, feel free to reply directly to this email if you have any additional details or campaign materials you'd like us to take a look at.</p>

        <p style="margin-top: 24px;">To your growth,<br><strong>The Ads Monster Team</strong></p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Ads Monster. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: data.email,
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log("[Nodemailer] Confirmation email sent to client:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // Non-critical error, just log warning
    const errMessage = error instanceof Error ? error.message : String(error);
    console.warn("[Nodemailer] Could not send confirmation to client:", errMessage);
    return { success: false, error: errMessage };
  }
}

export interface PackageInvoiceEmailData {
  orderNumber: string;
  invoiceNumber: string;
  packageName: string;
  packagePrice: string;
  billingCycle?: string;
  adNetworks?: string;
  monthlyAdSpend?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  clientWebsite?: string;
  billingAddress?: string;
  taxId?: string;
  clientNotes?: string;
  createdAt?: Date;
  status?: string;
}

/**
 * Sends package invoice email to both agency admin and the client.
 */
export async function sendPackageInvoiceEmail(
  data: PackageInvoiceEmailData,
): Promise<{ adminResult: MailSendResult; clientResult: MailSendResult }> {
  const transporter = getMailTransporter();

  if (!transporter) {
    console.warn(
      "[Nodemailer] SMTP not configured. Package invoice email was simulated/skipped for:",
      { order: data.orderNumber, package: data.packageName, client: data.clientEmail },
    );
    return {
      adminResult: { success: false, skipped: true, error: "SMTP is not configured in .env" },
      clientResult: { success: false, skipped: true, error: "SMTP is not configured in .env" },
    };
  }

  const fromEmail =
    process.env.SMTP_FROM?.trim() ||
    `"Ads Monster Billing" <${process.env.SMTP_USER?.trim() || "billing@adsmonster.com"}>`;

  const agencyEmail =
    process.env.CONTACT_RECEIVER_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.SMTP_USER?.trim() ||
    "hello@adsmonster.com";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const formattedDate = (data.createdAt || new Date()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const safeClientName = escapeHtml(data.clientName);
  const safeClientEmail = escapeHtml(data.clientEmail);
  const safeClientCompany = escapeHtml(data.clientCompany || "Independent Business");
  const safeClientPhone = escapeHtml(data.clientPhone || "Not specified");
  const safePackageName = escapeHtml(data.packageName);
  const safePrice = escapeHtml(data.packagePrice);
  const safeAdNetworks = escapeHtml(data.adNetworks || "Google Ads, Meta Ads");
  const safeMonthlySpend = escapeHtml(data.monthlyAdSpend || "Target ad spend");
  const safeInvoiceNum = escapeHtml(data.invoiceNumber);
  const safeOrderNum = escapeHtml(data.orderNumber);
  const safeNotes = escapeHtml(data.clientNotes || "None provided");
  const safeBillingAddress = escapeHtml(data.billingAddress || "On file");
  const safeStatus = escapeHtml((data.status || "pending_review").replace("_", " ").toUpperCase());

  // 1. ADMIN HTML INVOICE NOTIFICATION
  const adminSubject = `[PACKAGE ORDER & INVOICE] ${data.packageName} - ${data.clientName} (${data.invoiceNumber})`;
  const adminHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Package Order Invoice</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0b2223; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #104042; }
    .wrapper { width: 100%; padding: 40px 16px; box-sizing: border-box; background: #0b2223; }
    .card { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    .header { background: #104042; padding: 36px 40px; color: #ffffff; }
    .badge { display: inline-block; background: #AEFF1C; color: #104042; font-weight: 800; font-size: 11px; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .title { font-size: 26px; font-weight: 800; margin: 0; color: #ffffff; }
    .subtitle { font-size: 14px; color: rgba(255,255,255,0.7); margin-top: 6px; }
    .body { padding: 36px 40px; }
    .meta-box { background: #E8F4F4; border-radius: 12px; padding: 20px; margin-bottom: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .meta-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #5E5E5E; letter-spacing: 0.5px; }
    .meta-value { font-size: 15px; font-weight: 800; color: #104042; margin-top: 2px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 24px; margin-bottom: 24px; }
    .table th { background: #104042; color: #ffffff; text-align: left; padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .table th:first-child { border-top-left-radius: 8px; }
    .table th:last-child { border-top-right-radius: 8px; text-align: right; }
    .table td { padding: 16px; border-bottom: 1px solid #E8F4F4; font-size: 14px; }
    .table td:last-child { text-align: right; font-weight: 800; font-size: 16px; color: #006402; }
    .total-row td { background: #E8F4F4; font-weight: 800; font-size: 16px; border: none; padding: 16px; }
    .total-row td:last-child { color: #104042; font-size: 20px; }
    .btn { display: inline-block; background: #104042; color: #AEFF1C; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 12px; text-align: center; }
    .footer { background: #f8fafc; padding: 24px 40px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <span class="badge">Digital Marketing Package Order</span>
        <h1 class="title">New Client Package Invoice</h1>
        <p class="subtitle">Invoice ${safeInvoiceNum} &bull; Order #${safeOrderNum} &bull; ${formattedDate}</p>
      </div>
      <div class="body">
        <div class="meta-box">
          <div>
            <div class="meta-label">Client Name</div>
            <div class="meta-value">${safeClientName}</div>
          </div>
          <div>
            <div class="meta-label">Client Email</div>
            <div class="meta-value">${safeClientEmail}</div>
          </div>
          <div>
            <div class="meta-label">Company / Brand</div>
            <div class="meta-value">${safeClientCompany}</div>
          </div>
          <div>
            <div class="meta-label">Phone Number</div>
            <div class="meta-value">${safeClientPhone}</div>
          </div>
          <div>
            <div class="meta-label">Order Status</div>
            <div class="meta-value" style="color: #006402;">${safeStatus}</div>
          </div>
          <div>
            <div class="meta-label">Billing Cycle</div>
            <div class="meta-value">Monthly Recurring</div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Service / Package</th>
              <th>Channel Scope</th>
              <th>Monthly Spend Cap</th>
              <th>Investment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${safePackageName}</strong><br>
                <span style="font-size: 12px; color: #5E5E5E;">Managed Performance Growth Plan</span>
              </td>
              <td>${safeAdNetworks}</td>
              <td>${safeMonthlySpend}</td>
              <td>${safePrice}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3"><strong>Total Due / Invoice Amount:</strong></td>
              <td><strong>${safePrice}</strong></td>
            </tr>
          </tbody>
        </table>

        ${data.clientNotes ? `
        <div style="background: #fefce8; border-left: 4px solid #eab308; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
          <strong style="color: #854d0e; font-size: 12px; text-transform: uppercase;">Client Instructions / Notes:</strong>
          <p style="margin: 6px 0 0; font-size: 14px; color: #713f12;">${safeNotes}</p>
        </div>` : ""}

        <div style="text-align: center; margin-top: 32px;">
          <a href="${appUrl}/dashboard/orders" class="btn">View & Manage in Admin Dashboard &rarr;</a>
        </div>
      </div>
      <div class="footer">
        AdsMonster Agency Control System &bull; Received automatically via client checkout portal.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  // 2. CLIENT HTML INVOICE CONFIRMATION RECEIPT
  const clientSubject = `Invoice & Order Confirmation: ${data.packageName} (${data.invoiceNumber}) - AdsMonster`;
  const clientHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your AdsMonster Package Invoice</title>
  <style>
    body { margin: 0; padding: 0; background-color: #E8F4F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #104042; }
    .wrapper { width: 100%; padding: 40px 16px; box-sizing: border-box; background: #E8F4F4; }
    .card { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(16,64,66,0.1); border: 1px solid rgba(16,64,66,0.08); }
    .header { background: #104042; padding: 40px; color: #ffffff; text-align: center; }
    .logo-text { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; margin-bottom: 4px; }
    .logo-highlight { color: #AEFF1C; }
    .badge { display: inline-block; background: #AEFF1C; color: #104042; font-weight: 800; font-size: 12px; padding: 6px 16px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; margin-top: 14px; }
    .body { padding: 40px; }
    .invoice-header { display: flex; justify-content: space-between; border-bottom: 2px solid #E8F4F4; padding-bottom: 20px; margin-bottom: 28px; }
    .inv-col { margin-bottom: 12px; }
    .inv-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #5E5E5E; letter-spacing: 0.5px; }
    .inv-val { font-size: 15px; font-weight: 800; color: #104042; margin-top: 2px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 24px; margin-bottom: 28px; }
    .table th { background: #104042; color: #ffffff; text-align: left; padding: 12px 16px; font-size: 12px; text-transform: uppercase; }
    .table th:first-child { border-top-left-radius: 8px; }
    .table th:last-child { border-top-right-radius: 8px; text-align: right; }
    .table td { padding: 16px; border-bottom: 1px solid #E8F4F4; font-size: 14px; }
    .table td:last-child { text-align: right; font-weight: 800; font-size: 16px; color: #006402; }
    .total-row td { background: #E8F4F4; font-weight: 800; font-size: 16px; border: none; padding: 16px; }
    .total-row td:last-child { color: #104042; font-size: 22px; }
    .steps-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px; padding: 24px; margin-top: 28px; }
    .step-item { display: flex; gap: 12px; margin-bottom: 14px; font-size: 14px; color: #166534; }
    .btn { display: inline-block; background: #104042; color: #AEFF1C; font-weight: 700; font-size: 15px; text-decoration: none; padding: 16px 36px; border-radius: 9999px; text-align: center; }
    .footer { background: #f8fafc; padding: 28px 40px; font-size: 13px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo-text">Ads<span class="logo-highlight">Monster</span></div>
        <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.8);">Performance Growth Partnership</p>
        <span class="badge">Official Invoice &bull; ${safeInvoiceNum}</span>
      </div>
      <div class="body">
        <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">
          Hi <strong>${safeClientName}</strong>,<br>
          Thank you for trusting AdsMonster to scale your advertising campaigns! We have successfully generated your service package invoice and registered your marketing plan.
        </p>

        <div style="background: #E8F4F4; border-radius: 16px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border: none;">
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #5E5E5E;">Invoice Number:</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 800; color: #104042; text-align: right;">${safeInvoiceNum}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #5E5E5E;">Order Reference:</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 800; color: #104042; text-align: right;">#${safeOrderNum}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #5E5E5E;">Issue Date:</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 800; color: #104042; text-align: right;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #5E5E5E;">Status:</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 800; color: #006402; text-align: right;">${safeStatus}</td>
            </tr>
          </table>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Package Selected</th>
              <th>Supported Networks</th>
              <th>Ad Spend Tier</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${safePackageName}</strong><br>
                <span style="font-size: 12px; color: #5E5E5E;">Monthly Scaling Retainer</span>
              </td>
              <td>${safeAdNetworks}</td>
              <td>${safeMonthlySpend}</td>
              <td>${safePrice}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3"><strong>Total Amount:</strong></td>
              <td><strong>${safePrice}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="steps-box">
          <h3 style="margin: 0 0 12px; color: #15803d; font-size: 16px;">What Happens Next?</h3>
          <div class="step-item">
            <span>&bull;</span>
            <span><strong>Strategist Onboarding:</strong> Your Senior Ad Strategist will connect within 1 business day to review your ad accounts.</span>
          </div>
          <div class="step-item">
            <span>&bull;</span>
            <span><strong>Tracking & Pixel Audit:</strong> We verify all conversions, pixels, and server-side events before launching ad creative.</span>
          </div>
          <div class="step-item">
            <span>&bull;</span>
            <span><strong>Live Client Dashboard:</strong> You can review campaign metrics and invoices anytime in your portal.</span>
          </div>
        </div>

        <div style="text-align: center; margin-top: 36px;">
          <a href="${appUrl}/client/dashboard" class="btn">Access Client Dashboard &rarr;</a>
        </div>
      </div>
      <div class="footer">
        <p style="margin: 0 0 6px;">Questions? Reply directly to this email or reach us at hello@adsmonster.com</p>
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} AdsMonster. 123 Growth Avenue, Suite 400, New York, NY</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  let adminResult: MailSendResult = { success: false };
  let clientResult: MailSendResult = { success: false };

  // Send to Agency Admin
  try {
    const adminInfo = await transporter.sendMail({
      from: fromEmail,
      to: agencyEmail,
      replyTo: data.clientEmail,
      subject: adminSubject,
      html: adminHtml,
    });
    console.log("[Nodemailer] Invoice email delivered to agency admin:", adminInfo.messageId);
    adminResult = { success: true, messageId: adminInfo.messageId };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error("[Nodemailer] Failed to send invoice to agency admin:", errMessage);
    adminResult = { success: false, error: errMessage };
  }

  // Send to Client
  try {
    const clientInfo = await transporter.sendMail({
      from: fromEmail,
      to: data.clientEmail,
      subject: clientSubject,
      html: clientHtml,
    });
    console.log("[Nodemailer] Invoice email delivered to client:", clientInfo.messageId);
    clientResult = { success: true, messageId: clientInfo.messageId };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.warn("[Nodemailer] Could not send confirmation invoice to client:", errMessage);
    clientResult = { success: false, error: errMessage };
  }

  return { adminResult, clientResult };
}

export interface PaymentConfirmationEmailData {
  orderNumber: string;
  invoiceNumber: string;
  packageName: string;
  amountPaid: string;
  paymentMethod: string;
  transactionId?: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  billingCycle?: string;
  paidAt?: Date;
}

/**
 * Sends a rich payment receipt and confirmation email to client and agency team
 * after Stripe or PayPal checkout successfully completes.
 */
export async function sendPaymentConfirmationEmail(
  data: PaymentConfirmationEmailData,
): Promise<{ adminResult: MailSendResult; clientResult: MailSendResult }> {
  const transporter = getMailTransporter();

  if (!transporter) {
    console.warn(
      "[Nodemailer] SMTP not configured. Payment confirmation email skipped for:",
      { order: data.orderNumber, client: data.clientEmail, amount: data.amountPaid },
    );
    return {
      adminResult: { success: false, skipped: true, error: "SMTP is not configured in .env" },
      clientResult: { success: false, skipped: true, error: "SMTP is not configured in .env" },
    };
  }

  const fromEmail =
    process.env.SMTP_FROM?.trim() ||
    `"AdsMonster Billing" <${process.env.SMTP_USER?.trim() || "billing@adsmonster.com"}>`;

  const agencyEmail =
    process.env.CONTACT_RECEIVER_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.SMTP_USER?.trim() ||
    "hello@adsmonster.com";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const formattedDate = (data.paidAt || new Date()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const methodLabel =
    data.paymentMethod.toLowerCase() === "stripe"
      ? "Credit / Debit Card (Stripe)"
      : data.paymentMethod.toLowerCase() === "paypal"
      ? "PayPal Express Checkout"
      : "Direct Bank Transfer";

  const safeClientName = escapeHtml(data.clientName);
  const safeOrderNumber = escapeHtml(data.orderNumber);
  const safeInvoiceNumber = escapeHtml(data.invoiceNumber);
  const safePackageName = escapeHtml(data.packageName);
  const safeAmount = escapeHtml(data.amountPaid);
  const safeTransactionId = data.transactionId ? escapeHtml(data.transactionId) : "N/A";

  const sharedCss = `
    body { margin: 0; padding: 0; background-color: #0b2223; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    .wrapper { width: 100%; padding: 40px 16px; box-sizing: border-box; background: #0b2223; }
    .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #104042 0%, #082627 100%); padding: 36px 32px; text-align: center; color: #ffffff; border-bottom: 3px solid #AEFF1C; }
    .success-pill { display: inline-block; background: #AEFF1C; color: #104042; font-weight: 800; font-size: 11px; padding: 4px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .content { padding: 36px 32px; background: #ffffff; }
    .info-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 20px; margin-bottom: 24px; }
    .receipt-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .receipt-row:last-child { border-bottom: none; }
    .label { color: #64748b; font-weight: 500; }
    .val { color: #0f172a; font-weight: 700; text-align: right; }
    .cta-btn { display: inline-block; background: #104042; color: #AEFF1C !important; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; margin-top: 16px; }
    .footer { text-align: center; padding: 24px; font-size: 12px; color: #94a3b8; background: #fafafa; border-top: 1px solid #f1f5f9; }
  `;

  // Client Receipt HTML
  const clientHtml = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><style>${sharedCss}</style></head>
  <body>
    <div class="wrapper">
      <div class="card">
        <div class="header">
          <span class="success-pill">&#10003; Payment Received & Confirmed</span>
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff;">Payment Receipt</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.8);">Thank you for partnering with AdsMonster</p>
        </div>
        <div class="content">
          <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">
            Hi <strong>${safeClientName}</strong>,
          </p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6;">
            We have successfully received your payment for the <strong>${safePackageName}</strong> package. Your campaign onboarding is now active.
          </p>

          <div class="info-box">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Order Reference:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #104042;">#${safeOrderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Invoice Reference:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #104042;">#${safeInvoiceNumber}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Payment Method:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #0f172a;">${methodLabel}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Transaction Ref:</td>
                <td style="padding: 6px 0; text-align: right; font-family: monospace; font-size: 12px; color: #475569;">${safeTransactionId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Date Paid:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #0f172a;">${formattedDate}</td>
              </tr>
              <tr style="border-top: 2px solid #bbf7d0;">
                <td style="padding: 10px 0 4px 0; font-size: 15px; font-weight: 800; color: #104042;">Total Amount Paid:</td>
                <td style="padding: 10px 0 4px 0; text-align: right; font-size: 18px; font-weight: 800; color: #006402;">${safeAmount}</td>
              </tr>
            </table>
          </div>

          <div style="background: #f8fafc; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 6px 0; font-size: 14px; color: #104042;">What Happens Next?</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.6;">
              <li>Your Dedicated Senior Ad Strategist is preparing your strategy sprint.</li>
              <li>You can view campaigns, download invoices, and manage settings anytime from your portal.</li>
            </ul>
          </div>

          <div style="text-align: center;">
            <a href="${appUrl}/client/dashboard" class="cta-btn">Access Client Dashboard &rarr;</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} AdsMonster Performance Digital Agency. All rights reserved.
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  // Admin Notification HTML
  const adminHtml = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><style>${sharedCss}</style></head>
  <body>
    <div class="wrapper">
      <div class="card">
        <div class="header" style="border-bottom-color: #22c55e;">
          <span class="success-pill" style="background: #22c55e; color: #ffffff;">New Payment Alert</span>
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff;">Payment Collected: ${safeAmount}</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.8);">Client ${safeClientName} has completed payment</p>
        </div>
        <div class="content">
          <p style="font-size: 14px; color: #334155; line-height: 1.6;">
            A package order has been marked <strong>PAID</strong> via <strong>${methodLabel}</strong>.
          </p>
          <div class="info-box">
            <p style="margin: 4px 0;"><strong>Client:</strong> ${safeClientName} (${escapeHtml(data.clientEmail)})</p>
            ${data.clientCompany ? `<p style="margin: 4px 0;"><strong>Company:</strong> ${escapeHtml(data.clientCompany)}</p>` : ""}
            <p style="margin: 4px 0;"><strong>Package:</strong> ${safePackageName}</p>
            <p style="margin: 4px 0;"><strong>Amount:</strong> ${safeAmount}</p>
            <p style="margin: 4px 0;"><strong>Order #:</strong> ${safeOrderNumber}</p>
            <p style="margin: 4px 0;"><strong>Invoice #:</strong> ${safeInvoiceNumber}</p>
            <p style="margin: 4px 0;"><strong>Transaction ID:</strong> ${safeTransactionId}</p>
          </div>
          <div style="text-align: center;">
            <a href="${appUrl}/dashboard/orders" class="cta-btn">View in Admin Dashboard &rarr;</a>
          </div>
        </div>
        <div class="footer">AdsMonster Internal Notification</div>
      </div>
    </div>
  </body>
  </html>
  `;

  let adminResult: MailSendResult = { success: false };
  let clientResult: MailSendResult = { success: false };

  // Send to Agency Admin
  try {
    const adminInfo = await transporter.sendMail({
      from: fromEmail,
      to: agencyEmail,
      replyTo: data.clientEmail,
      subject: `[Payment Received] ${safeAmount} from ${safeClientName} - ${safePackageName}`,
      html: adminHtml,
    });
    adminResult = { success: true, messageId: adminInfo.messageId };
  } catch (error) {
    adminResult = { success: false, error: error instanceof Error ? error.message : String(error) };
  }

  // Send to Client
  try {
    const clientInfo = await transporter.sendMail({
      from: fromEmail,
      to: data.clientEmail,
      subject: `Receipt: Payment confirmed for ${safePackageName} [${safeInvoiceNumber}]`,
      html: clientHtml,
    });
    clientResult = { success: true, messageId: clientInfo.messageId };
  } catch (error) {
    clientResult = { success: false, error: error instanceof Error ? error.message : String(error) };
  }

  return { adminResult, clientResult };
}


