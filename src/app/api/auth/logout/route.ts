import { NextResponse } from "next/server";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { destroySession, getCurrentAdmin } from "@/lib/auth";

export async function POST() {
  const admin = await getCurrentAdmin();
  await destroySession();

  if (admin) {
    await db.insert(auditLogs).values({
      adminId: admin.id,
      action: "logout",
      entity: "admin",
    });
  }

  return NextResponse.json({ ok: true });
}
