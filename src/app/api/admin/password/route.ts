import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admins, auditLogs, sessions } from "@/db/schema";
import { changePasswordSchema } from "@/lib/validation";
import { requireAdminApi } from "@/lib/api-helpers";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  const limit = await checkRateLimit(`password-change:${admin!.id}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data" },
      { status: 400 },
    );
  }

  const [fullAdmin] = await db.select().from(admins).where(eq(admins.id, admin!.id)).limit(1);
  if (!fullAdmin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const currentOk = await bcrypt.compare(parsed.data.currentPassword, fullAdmin.passwordHash);
  if (!currentOk) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12);

  await db
    .update(admins)
    .set({ passwordHash: newHash, updatedAt: new Date() })
    .where(eq(admins.id, admin!.id));

  // Revoke all other sessions for security after a password change.
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.adminId, admin!.id));

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "password_changed",
    entity: "admin",
    entityId: String(admin!.id),
  });

  return NextResponse.json({ ok: true });
}
