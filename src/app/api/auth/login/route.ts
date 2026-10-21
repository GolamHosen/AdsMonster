import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admins, auditLogs } from "@/db/schema";
import { loginSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createSession } from "@/lib/auth";

const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes after too many failures

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);

  const ipLimit = await checkRateLimit(`login:ip:${ip}`, MAX_ATTEMPTS, WINDOW_MS);
  if (!ipLimit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const emailLimit = await checkRateLimit(`login:email:${email}`, MAX_ATTEMPTS, WINDOW_MS);
  if (!emailLimit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 },
    );
  }

  const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

  const genericError = NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  if (!admin || !admin.isActive) {
    await db.insert(auditLogs).values({
      adminId: admin?.id,
      action: "login_failed",
      entity: "admin",
      ip,
      metadata: { email },
    });
    return genericError;
  }

  if (admin.lockedUntil && admin.lockedUntil.getTime() > Date.now()) {
    return NextResponse.json(
      { error: "Account temporarily locked due to repeated failed attempts. Try again later." },
      { status: 423 },
    );
  }

  const passwordOk = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordOk) {
    const failedCount = admin.failedLoginCount + 1;
    const shouldLock = failedCount >= 6;

    await db
      .update(admins)
      .set({
        failedLoginCount: shouldLock ? 0 : failedCount,
        lockedUntil: shouldLock ? new Date(Date.now() + LOCK_DURATION_MS) : null,
        updatedAt: new Date(),
      })
      .where(eq(admins.id, admin.id));

    await db.insert(auditLogs).values({
      adminId: admin.id,
      action: "login_failed",
      entity: "admin",
      ip,
      metadata: { email },
    });

    return genericError;
  }

  await db
    .update(admins)
    .set({
      failedLoginCount: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      lastLoginIp: ip,
      updatedAt: new Date(),
    })
    .where(eq(admins.id, admin.id));

  await createSession(admin.id);

  await db.insert(auditLogs).values({
    adminId: admin.id,
    action: "login_success",
    entity: "admin",
    ip,
  });

  return NextResponse.json({
    ok: true,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  });
}
