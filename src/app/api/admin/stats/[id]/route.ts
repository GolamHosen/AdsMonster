import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { stats, auditLogs } from "@/db/schema";
import { statSchema } from "@/lib/validation";
import { requireAdminApi } from "@/lib/api-helpers";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const statId = Number(id);
  if (!Number.isInteger(statId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = statSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }

  const [updated] = await db
    .update(stats)
    .set(parsed.data)
    .where(eq(stats.id, statId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Stat not found" }, { status: 404 });
  }

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "update",
    entity: "stat",
    entityId: String(statId),
  });

  return NextResponse.json({ stat: updated });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const statId = Number(id);
  if (!Number.isInteger(statId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await db.delete(stats).where(eq(stats.id, statId));

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "delete",
    entity: "stat",
    entityId: String(statId),
  });

  return NextResponse.json({ ok: true });
}
