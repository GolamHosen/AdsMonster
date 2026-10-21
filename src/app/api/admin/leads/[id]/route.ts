import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leads, auditLogs } from "@/db/schema";
import { leadStatusSchema } from "@/lib/validation";
import { requireAdminApi } from "@/lib/api-helpers";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = leadStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const [updated] = await db
    .update(leads)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(eq(leads.id, leadId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "update",
    entity: "lead",
    entityId: String(leadId),
    metadata: { status: parsed.data.status },
  });

  return NextResponse.json({ lead: updated });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { admin, response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await db.delete(leads).where(eq(leads.id, leadId));

  await db.insert(auditLogs).values({
    adminId: admin!.id,
    action: "delete",
    entity: "lead",
    entityId: String(leadId),
  });

  return NextResponse.json({ ok: true });
}
