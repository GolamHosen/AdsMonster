import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { newsletterSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);

  const limit = await checkRateLimit(`newsletter:ip:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { email } = parsed.data;

  if (!isDatabaseConfigured) {
    console.log("[Demo Mode] Newsletter subscriber received (database not yet configured):", email);
    return NextResponse.json({ ok: true });
  }

  try {
    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);

    if (existing.length > 0) {
      if (existing[0].status === "unsubscribed") {
        await db
          .update(newsletterSubscribers)
          .set({ status: "active" })
          .where(eq(newsletterSubscribers.id, existing[0].id));
      }
      return NextResponse.json({ ok: true, message: "You're already subscribed!" });
    }

    await db.insert(newsletterSubscribers).values({ email, ip });
  } catch (err) {
    console.warn("[Newsletter] Failed to persist subscriber to database:", err);
  }

  return NextResponse.json({ ok: true });
}
