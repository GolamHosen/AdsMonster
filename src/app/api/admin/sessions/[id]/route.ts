import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { sessions, auditLogs } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const sessionId = Number(id);
  if (!Number.isInteger(sessionId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(sessions.id, sessionId), eq(sessions.adminId, admin!.id)));

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "update",
    entity: "session",
    entityId: String(sessionId),
    metadata: { revoked: true },
  });

  return NextResponse.json({ ok: true });
}
